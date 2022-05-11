import { HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { db } from '../../utils/databases';
import { verify } from 'jsonwebtoken';
import utils, { TokenData } from '../../utils/util';


@Injectable()
export class AuthorityService {
  async getAuthority(req: Request, res: Response): Promise<any> {
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
          authority: 1,
          status: 1,
        });
        if (user) {
          const nonAllowUsers = await db.select('*').from('Accounts').where({ status: 0 });
          return res.status(HttpStatus.OK).send({
            statusCode: HttpStatus.OK, 
            message: '환영합니다. 관리자 ' + user.Name + '님', 
            token,
            Users: nonAllowUsers
          });
        } else {
          return res.status(HttpStatus.FORBIDDEN).send({
            statusCode: HttpStatus.FORBIDDEN,
            message: '비정상적인 요청 입니다.',
          })
        }
      }
    } catch(e) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: e
      })
    }
  }

  async DeleteUser (req: Request, res: Response): Promise<any> {
    try {
      const { auth_token } = req.cookies;
      const { id } = req.body;
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
          authority: 1,
          status: 1,
        });
        if (user) {
          const [User] = await db.select('*').from('Accounts').where({ id });
          if (!User) {
            return res.status(HttpStatus.BAD_REQUEST).send({
              statusCode: HttpStatus.BAD_REQUEST,
              message: '해당하는 유저의 정보를 찾을 수 없습니다.'
            })
          } else {
            await db.delete().from('Accounts').where({ id });
            return res.status(HttpStatus.OK).send({
              statusCode: HttpStatus.OK, 
              message: '사용자' + User.Student_ID + " " + User.Name +"의 <br/>정보를 삭제하였습니다.", 
            });
          }
        } else {
          return res.status(HttpStatus.FORBIDDEN).send({
            statusCode: HttpStatus.FORBIDDEN,
            message: '비정상적인 요청 입니다.',
          })
        }
      }
    } catch(e) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: e
      })
    }
  }

  async AllowUser (req: Request, res: Response): Promise<any> {
    try {
      const { auth_token } = req.cookies;
      const { id } = req.body;
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
          authority: 1,
          status: 1,
        });
        if (user) {
          const [User] = await db.select('*').from('Accounts').where({ id });
          if (!User) {
            return res.status(HttpStatus.BAD_REQUEST).send({
              statusCode: HttpStatus.BAD_REQUEST,
              message: '해당하는 유저의 정보를 찾을 수 없습니다.'
            })
          } else {
            await db.update({ status: 1 }).from('Accounts').where({ id });
            return res.status(HttpStatus.OK).send({
              statusCode: HttpStatus.OK, 
              message: '사용자' + User.Student_ID + " " + User.Name +"의 <br/>권한을 업데이트 했습니다.", 
            });
          }
        } else {
          return res.status(HttpStatus.FORBIDDEN).send({
            statusCode: HttpStatus.FORBIDDEN,
            message: '비정상적인 요청 입니다.',
          })
        }
      }
    } catch(e) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: e
      })
    }
  }
}
