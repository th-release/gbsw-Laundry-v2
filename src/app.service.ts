import { HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { db } from '../utils/databases'
import utils, { TokenData } from '../utils/util';

@Injectable()
export class AppService {

  async getIndex(req: Request, res: Response): Promise<any> {
    try {
      const { auth_token } = req.cookies;
      const token = verify(auth_token, utils.getSecret() || 'SECRET') as TokenData;
      if (token) {
        const [user] = await db.select('*').from('Accounts').where({ 
          id: token.id, 
          Student_ID: token.Student_ID, 
          Name: token.Name, 
          grade: token.grade, 
          class: token.class, 
          number: token.number, 
          room: token.room, 
          phone: token.phone, 
          gender: token.gender,
          authority: token.authority,
          status: 1,
        })
        if (user) {
          return res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, message: '사용자 정보를 정상적으로 불러왔습니다.', token });
        } else {
          return res.status(HttpStatus.UNAUTHORIZED).send({ statusCode: HttpStatus.UNAUTHORIZED, message: '사용자 정보를 정상적으로 불러오지 못했습니다.' });
        }
      } else {
        return res.status(HttpStatus.BAD_REQUEST).send({ statusCode: HttpStatus.OK, message: "로그인 시간이 만료 되었습니다.<br/> 다시 로그인을 시도 해주세요." })
      }
    } catch(e) {
      return res.status(HttpStatus.BAD_REQUEST).send({ statusCode: HttpStatus.BAD_REQUEST, message: e });
    }
  }
}
