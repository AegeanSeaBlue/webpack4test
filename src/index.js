import '@babel/polyfill';

import React, {Component} from 'react';
import ReactDom from 'react-dom';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/snippets/mysql';
import {addCompleter} from 'ace-builds/src-noconflict/ext-language_tools';

import {observable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import {SetTimer} from './timer';


class Store {
  @observable num = 5;
  @observable.shallow refreshList = [];
}

let store = new Store();


let dispatchTimer = (list, frequency) => {
  return setInterval(() => {
    list.forEach((item, index) => {
      let now = Date.now();
      if (!item.recordTime) {
        item.recordTime = now;
        return false;
      }
      if (Date.now() - item.recordTime >= item.interval) {
        item.recordTime = now;
        Promise.resolve().then(() => {
          if (typeof item.handle === 'function') {
            item.handle({...item}, index);
          }
        });
      }
    });
  }, frequency || 1000);
};

let dispatchInterval = (list, frequency) => {
  if (!frequency) return false;
  return setInterval(() => {
    list.forEach((item, index) => {
      Promise.resolve().then(() => {
        if (typeof item.handle === 'function') {
          item.handle({...item}, index);
        }
      });
    });
  }, frequency);
};


let setTimer = (list = [], frequency) => {
  if (!(list instanceof Array) || list.length < 1) return false;
  let timeList = list.filter(item => item.interval > 100);
  if (timeList.length < 1) return false;
  if (timeList.length === 1) {
    return dispatchInterval(list, frequency);
  }
  let first = timeList[0];
  let refreshAll = timeList.every(e => e.interval === first.interval);
  return refreshAll ? dispatchTimer(list, frequency) : dispatchInterval(list, frequency);
};


@observer
class Timer extends Component {
  componentDidMount() {
    this.timer = new SetTimer(null, 3000);

    setTimeout(() => {
      let item = {
        key: '1',
        interval: 3000,
        handle: (res) => {
          console.log(res);
          /*fetch({url: 'v1'}).then((res) => {
            console.log(res);
          });*/
        }
      };
      store.refreshList.push(item);
      this.timer.update([item]);

    }, 3000);
    setTimeout(() => {
      let item = {
        key: '2',
        interval: 6000,
        handle: (res) => {
          console.log(res, store.refreshList);
          /*fetch({url: 'w1'}).then((res) => {
            console.log(res);
          });*/
        }
      };
      store.refreshList.push(item);
      this.timer.update([item]);
    }, 6000);

  }


  render() {
    return (
      <div>
        {
          store.refreshList.map((item, index) => (
            <div key={index} style={{padding: 10, color: 'rgb(88, 92, 246)'}}>
              <span># {index} - timer</span>
            </div>
          ))
        }
      </div>
    );
  }
}

@observer
class Time extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <div>
        <div>{store.num}</div>
      </div>
    );
  }
}


class App extends Component {
  componentDidMount() {
    addCompleter({
      getCompletions: (editor, session, pos, prefix, callback) => {
        callback(null, [
          {
            name: 'test',
            value: 'test',
            caption: 'test',
            meta: 'local',
            score: 1000,
          },
        ]);
      },
    });
  }

  render() {
    return (
      <div>
        <Time/>

        <Timer/>

        <AceEditor
          //ref="editor"
          mode="mysql"
          theme="xcode"
          onChange={(value) => {
            console.log();
          }}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{$blockScrolling: true}}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          enableSnippets={true}
          fontSize={18}
          onLoad={(editor) => {
            console.log(editor);
          }}

          showGutter={true}
          showPrintMargin={true}
          highlightActiveLine={true}

          showLineNumbers={true}
        />
      </div>
    );
  }
}

const Root = () => {
  return <App/>;
};

ReactDom.render(<Root/>, document.getElementById('root'));
