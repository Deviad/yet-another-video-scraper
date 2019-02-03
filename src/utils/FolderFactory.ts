import * as fs from 'fs';
import * as path from 'path';
class FolderFactory {
  private _courseName: string;
  private _chapterName: string;
  private _downloadPath: string;

  constructor(private _downloadFolder: string) {
    this._downloadFolder = this.folderNameSanitizer(_downloadFolder);
  }

  get downloadFolder() {
    return this._downloadFolder;
  }

  get courseName() {
    return this._courseName;
  }

  get chapterName() {
    return this._chapterName;
  }
  get downloadPath() {
    return this._downloadPath;
  }

  createDownloadFolder() {
    const folderExists = fs.existsSync(this._downloadFolder);
    if (!folderExists) {
      try {
        fs.mkdirSync(this._downloadFolder, { recursive: false });
      } catch (err) {
        throw err;
      }
    }
  }

  folderNameSanitizer: (folderName: string) => string = (folderName: string) => {
    return folderName.replace(/[.\-\\/+()*[\]={}!@#$%^&<>,:;"'| ]/g, '_');
  };

  createCourseFolder(folderName: string) {
    if (!this._downloadFolder) {
      this._downloadFolder = 'download';
    }

    this._courseName = this.folderNameSanitizer(folderName);
    const folderExists = fs.existsSync(path.join(process.env.PWD, this._downloadFolder, this._courseName));
    if (!folderExists) {
      try {
        fs.mkdirSync(path.join(process.env.PWD, this._downloadFolder, this._courseName), { recursive: true });
      } catch (err) {
        throw err;
      }
    }
  }
  createChapterFolder(folderName: string) {
    if (!this._downloadFolder) {
      this._downloadFolder = 'download';
    }
    if (!this._courseName) {
      this._courseName = 'tempName';
    }

    this._chapterName = this.folderNameSanitizer(folderName);
    this._downloadPath = path.join(process.env.PWD, this._downloadFolder, this._courseName, this._chapterName);
    const folderExists = fs.existsSync(this.downloadPath);
    if (!folderExists) {
      try {
        fs.mkdirSync(path.join(this.downloadPath), { recursive: true });
      } catch (err) {
        throw err;
      }
    }
  }
}

export default FolderFactory;
