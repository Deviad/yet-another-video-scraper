import * as fs from 'fs';
import * as path from 'path';
import { CourseFolderFactory } from '@typings';

const courseFolderFactory: CourseFolderFactory = (downloadFolderName: string, courseName: string) => {
  const folderExists = fs.existsSync(path.join(process.env.PWD, downloadFolderName, courseName));
  if (!folderExists) {
    fs.mkdirSync(path.join(process.env.PWD, downloadFolderName, courseName), {
      recursive: false
    });
  }
};

export default courseFolderFactory;
