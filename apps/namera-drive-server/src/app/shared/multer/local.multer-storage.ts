import path from 'path';
import { Request } from 'express';
import { FileUtils } from '@shared';
import { UserEntity } from '@user';
import { MulterFile } from './multer-file';
import { LocalStorage } from 'src/app/storage/public_api';
import { StorageOptions } from 'src/config';

export class LocalMulterStorage {

  constructor(
      private readonly options: StorageOptions,
      private readonly storageEngine: LocalStorage) {

  }

  public async _handleFile(request: Request, file: MulterFile, callback: Function) {
    const user = request.user as UserEntity;
    const uploadPath = this.options.uploadPath;
    const exists = await this.storageEngine.exists(user, uploadPath);
    if(!exists) {
      await this.storageEngine.mkdir(user, uploadPath, true);
    }

    const filename = FileUtils.generateRandomFilename();

    // 上传终止
    request.on('aborted', () => {
      this.storageEngine.deleteFile(user, path.join(uploadPath, filename), false);
    });

    const fileStat = await this.storageEngine.writeFile(user, path.join(uploadPath, filename), file.stream);

    callback(null, {
      path: fileStat.fullpath,
      size: fileStat.size,
      mimetype: file.mimetype,
      filename: filename,
      encoding: file.encoding,
      modifyTime: fileStat.modifyTime,
      originalname: file.originalname,
    });
  }

  public async _removeFile(request: Request, file: MulterFile, callback: Function) {
    const user = request.user as UserEntity;
    await this.storageEngine.deleteFile(user, file.path, false);
    callback(null);
  }

}
