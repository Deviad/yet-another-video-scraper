import * as fs from 'fs';

const downloadFolderFactory = () => {
  const folderExists = fs.existsSync('./download');
  if (!folderExists) {
    fs.mkdirSync('./download', { recursive: false });
  }
};

export default downloadFolderFactory;
