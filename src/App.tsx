import '@/style/App.css'
import FileTree from '@/components/fileTree'
import FrontmatterEdit from '@/components/frontmatterEdit'
import { open } from '@tauri-apps/api/dialog'
import { Button } from 'antd'
import { useState } from 'react'
import { readDir } from '@/util'

function App() {

  const [directoryTree, setDirectoryTree] = useState<any[]>([])
  const [directoryPath, setDirectoryPath] = useState('')
  const [markdownAttributes, setMarkdownAttributes] = useState({})

  const openSelectDirDialog = async () => {
    const selected = await open({
      multiple: false,
      directory: true
    })
    if (Array.isArray(selected)) {
      // user selected multiple files
    } else if (selected === null) {
      // user cancelled the selection
    } else {
      // user selected a single file
      const tree = await readDir(selected)
      const path = selected
      setDirectoryTree(tree)
      setDirectoryPath(path)
    }
  }

  return (
    <div className="App">
      <Button onClick={openSelectDirDialog}>选择 markdown 文件夹</Button>
      <span>{ directoryPath }</span>
      <section className="flex">
        <FileTree
          style={{ flex: 1 }}
          directoryTree={directoryTree}
          onSelectMarkdown={setMarkdownAttributes}
        />
        <section style={{ flex: 2 }}>
          <FrontmatterEdit markdownAttributes={markdownAttributes} />
        </section>
      </section>
    </div>
  )
}

export default App
