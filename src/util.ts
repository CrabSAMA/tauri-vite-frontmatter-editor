import { fs, path } from '@tauri-apps/api'
import { invoke } from '@tauri-apps/api/tauri'
import type { DataNode } from 'antd/es/tree';
import { parse, stringify } from 'yaml'


export async function readDir(dir: string): Promise<DataNode[]> {
  const files = await fs.readDir(dir); // 读取目录下的文件和文件夹
  const result: DataNode[] = [];
  for (const file of files) {
    const filePath = file.path; // 获取文件/文件夹的完整路径
    const isDirectory = !!file.children;
    if (file.name?.startsWith('.')) continue
    // // img 文件夹不处理
    if (isDirectory && file.name === 'img') continue
    const item: DataNode = {
      title: file.name,
      key: filePath,
      isLeaf: !isDirectory
    };
    if (isDirectory && !file.name?.startsWith('.')) {
      item.children = await readDir(filePath); // 递归读取子目录
    }
    if (!isDirectory && await path.extname(filePath) !== 'md') continue
    result.push(item);
  }
  // files.forEach(async (file) => {
  // });
  return result;
}

export async function readFrontMatter(markdownPath: string) {
  // const markdown = await fs.readTextFile(markdownPath)
  const markdown: string = await invoke('read_file', { path: markdownPath })
  // const start = '---';
  // const end = '---';
  // const startIndex = markdown.indexOf(start) + start.length;
  // const endIndex = markdown.indexOf(end, startIndex);
  // const regex = /^---\n([\s\S]*?)\n---/gm; // 匹配YAML frontmatter
  // const matches = regex.exec(markdown);
  // const result = matches ? matches[1] : '';

  const frontmatterStart = '---'; // YAML frontmatter的开始标记
  const frontmatterEnd = '---'; // YAML frontmatter的结束标记

  const startIdx = markdown.indexOf(frontmatterStart); // 获取YAML frontmatter的开始位置
  const endIdx = markdown.indexOf(frontmatterEnd, startIdx + frontmatterStart.length); // 获取YAML frontmatter的结束位置

  if (startIdx !== -1 && endIdx !== -1) {
    let yaml = markdown.slice(startIdx + frontmatterStart.length, endIdx); // 获取YAML frontmatter的值
    // const data = YAML.parse(yaml); // 将YAML字符串解析为JavaScript对象
    // console.log(data); // 输出JavaScript对象
    console.log(yaml);
    console.log(parse(yaml));
    console.log('---\n' + stringify(parse(yaml)) + '---');
    return parse(yaml)
    
  } else {
    console.log('No YAML frontmatter found.');
  }
}