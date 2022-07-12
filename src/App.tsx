import React, { useState } from 'react';
import './App.css';
import { ApiFacade, Ping, Pong } from './generated/swagger/api';

function App() {


  const [sending, setSending] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const [messageToSend, setMessageToSend] = useState<string>('');
  const [whoisToSend, setWhoisToSend] = useState<string>('');
  const [pong, setPong] = useState<Pong>();

  async function sendPing() {
    const ping: Ping = { whois: whoisToSend };

    setSending(true);
    setFailed(false);
    setPong(undefined);
    
    try {
      const pong = await ApiFacade.StatusApi.ping(messageToSend, ping);
      setPong(pong);
    } catch (error) {
      setFailed(true);
    }

    setSending(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to the React Type Script API Spec Example APP
        </p>
        <p>
          For triggering an API call, please type any greeting message and press "Send"
        </p>
        <p>
          <div>
            <div>
              <input type={'text'} placeholder={'Type message to send...'} onKeyUp={(e) => setMessageToSend(e.target.value)} />
            </div>
            <div>
              <input type={'text'} placeholder={'Type whois to send...'} onKeyUp={(e) => setWhoisToSend(e.target.value)} />

            </div>
            <div>
            <input type={'submit'} value={'Send'} disabled={!messageToSend || !whoisToSend} onClick={sendPing} />
            </div>
          </div>

        </p>
        <p>
          {failed && 'Send ping request failed'}
          {sending && 'Awaiting Server...'}
          {pong && 'API Server pong response:'}
        </p>
        {
          !pong ? (failed || sending ? '' : '---No ping sent yet---') : <p>
            <div>
              <input type={'text'} disabled={true} value={pong.greeting} style={{ color: 'white'}} />
            </div>
            <div>
              <input type={'text'} disabled={true} value={new Date(pong.time).toUTCString()} style={{ color: 'white'}} />
            </div>
          </p>
        }

        <a
          className="App-link"
          href="https://github.com/haimkastner/node-api-spec-boilerplate"
          target="_blank"
          rel="noopener noreferrer"
        >
          Node.JS API Spec Boilerplate
        </a>
        <a
          className="App-link"
          href="https://github.com/haimkastner/react-typescript-spec-facade"
          target="_blank"
          rel="noopener noreferrer"
        >
          React TypeScript Spec Facade
        </a>
        <a
          className="App-link"
          href="https://app.swaggerhub.com/apis/haimkastner/node-api-spec-boilerplate"
          target="_blank"
          rel="noopener noreferrer"
        >
          API Server Spec
        </a>
      </header>
    </div>
  );
}

export default App;
