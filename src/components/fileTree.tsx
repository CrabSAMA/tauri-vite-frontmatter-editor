import { Tree } from 'antd'
import type { DataNode, DirectoryTreeProps } from 'antd/es/tree'
import '@/components/fileTree.css'
import type { CSSProperties } from 'react'
import { readFrontMatter } from '@/util'

const { DirectoryTree } = Tree

interface FileTreeProps {
  style: CSSProperties
  directoryTree: DataNode[]
  onSelectMarkdown: (attributes: any) => any
}

function fileTree({ directoryTree, onSelectMarkdown, style }: FileTreeProps) {
  
  const onSelect: DirectoryTreeProps['onSelect'] = async (keys, info) => {
    console.log('Trigger Select', keys, info);
    if (!info.node.isLeaf) return
    const result = await readFrontMatter(keys[0].toString())
    onSelectMarkdown(result)
  };

  return (
    <section className="file-tree-container" style={style}>
      <DirectoryTree treeData={directoryTree} onSelect={onSelect}></DirectoryTree>
    </section>
  )
}

export default fileTree