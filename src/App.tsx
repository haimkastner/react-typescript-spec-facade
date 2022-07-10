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
          For triggering an API call, please type any greeting message and press "SEND"
        </p>
        <p>
          <input type={'text'} placeholder={'Type message to send...'} onKeyUp={(e) => setMessageToSend(e.target.value)} />
          <input type={'text'} placeholder={'Type whois to send...'} onKeyUp={(e) => setWhoisToSend(e.target.value)} />
          <button disabled={!messageToSend || !whoisToSend} onClick={sendPing}>
            SEND
          </button>
        </p>
        <p>
          {failed && 'Send ping request failed' }
          {sending && 'Awaiting Server...' }
          {pong && 'API Server response:'}
        </p>
        {
          !pong ? (failed || sending ? '' : '---No ping sent yet---') : <p>
            <div>
              <input type={'text'} disabled={true} value={pong.greeting} />
            </div>
            <div>
              <input type={'text'} disabled={true} value={new Date(pong.time).toUTCString()} />
            </div>
          </p>
        }

        <a
          className="App-link"
          href="https://github.com/haimkastner/node-api-spec-boilerplate"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lean more: about generating and using API spec.
        </a>
      </header>
    </div>
  );
}

export default App;
