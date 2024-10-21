interface IProps {
    fileName: any;
    nodes: any;
    onSelect: any;
    path: any;
}

interface IFileTree {
    tree: any;
    onSelect: any;
}

const FileTreeNode = ({ fileName, nodes, onSelect, path }: IProps) => {
    const isDir = !!nodes;
    return (
        <div onClick={(e) => {
            e.stopPropagation();
            if (isDir) return;
            onSelect(path);
        }}
            style={{ height: '100%', width: '100%' }}
        >
            <p 
            style={{ margin: "2px 0" }} 
            className={isDir ? "" : "file-node"}>
                {isDir ? "📁": "🗊"} {fileName}
            </p>

            {nodes && fileName !== "node_modules" && (
                <ul style={{ paddingLeft: '10px' }}>
                    {Object.keys(nodes).map((child) => (
                        <li key={child}>
                            <FileTreeNode
                                onSelect={onSelect}
                                path={path + "/" + child}
                                fileName={child}
                                nodes={nodes[child]}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const FileTree = ({ tree, onSelect }: IFileTree) => {
    return <FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={tree} />;
};

export default FileTree;