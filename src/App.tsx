import React, { useState } from 'react';
import './App.css';
import { ApiFacade, Ping, Pong } from './generated/swagger/api';

function App() {

  // The sending state, true if currently there is a ping request in the air.
  const [sending, setSending] = useState<boolean>(false);
  // The failed/error state, has some error message value, if the last ping request failed.
  const [failed, setFailed] = useState<string>('');
  // The greeting message state, stores the value of the greeting message to send in the next ping
  const [greeting, setGreeting] = useState<string>('');
  // The whois text state, stores the value of the whois text to send in the next ping
  const [whois, setWhois] = useState<string>('');
  // The pong state, stores the last pong responded from the API server.
  const [pong, setPong] = useState<Pong>();

  async function sendPing() {

    // Before sending ping, update relevant states.
    setSending(true);
    setFailed('');
    setPong(undefined);

    // Use the generated interfaces
    const ping: Ping = { whois };

    try {
      // The API call, bountiful, isn't it?
      // Pro-Tip: Move pointer over the 'ping' method to see the spec comments using JSDoc.
      const pong = await ApiFacade.StatusApi.ping(greeting, ping);
      console.log(`The pong arrived with the greeting: "${pong.greeting}" timestamp: "${pong.time}"`);
      // Update state with the new pong
      setPong(pong);
    } catch (error: any) {
      console.log(`The ping request failed with error: ${error?.message}`);
      // Update failed error due to the failure.
      setFailed(error?.message || 'unknown error');
    }

    // Mark sending state as finished
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
              {/* The greeting input, once changed, the greeting state wil be updated */}
              <input type={'text'} placeholder={'Type greeting to send...'} onKeyUp={(e) => setGreeting(e.target.value)} />
            </div>
            <div>
              {/* The whois input, once changed, the whois state wil be updated */}
              <input type={'text'} placeholder={'Type whois to send...'} onKeyUp={(e) => setWhois(e.target.value)} />
            </div>
            <div>
              {/* The form submit input, available if both above inputs filled, once clicked, the ping request will be triggered */}
              <input type={'submit'} value={'Send'} disabled={!greeting || !whois} onClick={sendPing} />
            </div>
          </div>

        </p>
        <p>
          {/* Show a proper message in view regarding the state */}
          {failed && 'Send ping request failed'}
          {sending && 'Awaiting Server...'}
          {pong && 'API Server pong response:'}
        </p>
        {
          // Show (if there is) the last pong responded from the API server.
          !pong ? (failed || sending ? '' : '---No ping sent yet---') : <p>
            <div>
              {/* Show the greeting message arrived */}
              <input type={'text'} disabled={true} value={pong.greeting} style={{ color: 'white' }} />
            </div>
            <div>
              {/* Show the timestamp of the last ping as responded from the API server */}
              <input type={'text'} disabled={true} value={new Date(pong.time).toUTCString()} style={{ color: 'white' }} />
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
