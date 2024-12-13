import "./monacoWorker";
import * as Y from "yjs";
import * as monaco from "monaco-editor"

import { MonacoBinding } from "y-monaco";
import { WebsocketProvider } from "y-websocket";

// const wsProvider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', doc)

// wsProvider.on('status', (event) => {
//   console.log(event.status) // logs "connected" or "disconnected"
// });


window.addEventListener("load", () => {
  const ydoc = new Y.Doc();
  const docName = location.pathname.split('/')[2];
  const provider = new WebsocketProvider(
    `ws${location.protocol.slice(4)}//${location.host}/ws`,
    docName,
    ydoc,
  );
  const ytext = ydoc.getText('monaco');

  const editor = monaco.editor.create((document.getElementById('monaco-editor') as HTMLElement), {
    value: '',
    language: 'javascript',
    theme: 'vs-light'
  });

  const monacoBinding = new MonacoBinding(ytext, (editor.getModel() as monaco.editor.ITextModel), new Set([editor]), provider.awareness);

  // @ts-ignore
  window.y = { provider, ydoc, ytext, monacoBinding }
});
