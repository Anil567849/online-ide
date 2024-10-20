import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import socket from "../socket";
import classes from './terminal.module.css'

import "@xterm/xterm/css/xterm.css";

const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const isRendered = useRef(false);

  function scrollToDown(){
    if(!terminalRef.current) return;
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }

  useEffect(() => {

    scrollToDown();

    if (isRendered.current) return;
    isRendered.current = true;

    const term = new XTerminal({
      rows: 10,
    });

    if(!terminalRef.current) return;
    
    term.open(terminalRef.current);

    term.onData((data: string) => {
        socket.emit("terminal:write", data);
    });
    
    function onTerminalData(data: string) {
        term.write(data);
    }

    socket.on("terminal:data", onTerminalData);
  }, []);

  return <div ref={terminalRef} id={classes["terminal"]}/>;
};

export default Terminal;