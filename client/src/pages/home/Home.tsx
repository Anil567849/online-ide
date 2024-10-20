import { useCallback, useEffect, useState } from "react";
import "./home.css";
import Terminal from "../../components/Terminal";
import FileTree from "../../components/Tree";
import socket from "../../socket";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { createPath } from "../../utils/home";
import { getFileExtension } from "../../utils/getFileExtension";

function App() {
  const [fileTree, setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [code, setCode] = useState("");
  const [isSaved, setIsSaved] = useState<boolean>(true);

  useEffect(() => {
    if (!isSaved && code) {
      const timer = setTimeout(() => {
        setIsSaved(true);
        socket.emit("file:change", {
          path: selectedFile,
          content: code,
        });
      }, 5 * 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [code, selectedFile, isSaved]);

  useEffect(() => {
      setIsSaved(selectedFileContent === code);
  }, [code]);

  useEffect(() => {
    setCode("");
  }, [selectedFile]);

  useEffect(() => {
    setCode(selectedFileContent);
  }, [selectedFileContent]);

  const getFileTree = async () => {
    const response = await fetch("http://localhost:8000/files");
    if (!response.ok) return;
    const result = await response.json();
    setFileTree(result.tree);
  };

  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;
    const response = await fetch(
      `http://localhost:8000/files/content?path=${selectedFile}`
    );
    if (!response.ok) return;
    const result = await response.json();
    setSelectedFileContent(result.content);
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile) getFileContents();
  }, [getFileContents, selectedFile]);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);
    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, []);

  return (
    <div className="playground-container">
      <div className="editor-container">
        <div className="files">
          {selectedFile && (
            <>
              <p>
                <span className="file-name-header">root {createPath(selectedFile)}{" "}</span>
              </p>
              <p>
                <span style={{ backgroundColor: isSaved ? "green" : "red", padding: '10px', borderRadius: '5rem', marginTop: "100px" }}>{isSaved ? "Saved" : "Unsaved"}</span>
              </p>
            </>
          )}
          <FileTree
            onSelect={(path: string) => {
              setSelectedFileContent("");
              setSelectedFile(path);
            }}
            tree={fileTree}
          />
        </div>
        <div className="editor">
          {
            selectedFile ? <AceEditor
              width="100%"
              height="100%"
              mode={getFileExtension(selectedFile)}
              value={code}
              onChange={(e) => setCode(e)}
            /> : <AceEditor
              width="100%"
              height="100%"
              value="Select a file to write"
              fontSize="2.5rem"
              readOnly={true}

            />

          }
        </div>
      </div>
      <div className="terminal-container">
        <p style={{color: 'white', margin: "0"}}>Terminal</p>
        <Terminal />
      </div>
    </div>
  );
}

export default App;