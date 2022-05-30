import { HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { db } from '../../utils/databases'
import utils, { TokenData } from '../../utils/util';

@Injectable()
export class PanelService {

  async GetData(req: Request, res: Response): Promise<any> {
    try {
      const { type } = req.query
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
          if (type === 'Main') {
            if (user.authority === 1) {
              const projects = await db.select('*').from('projects')
              return res.status(HttpStatus.OK).send({ 
                statusCode: HttpStatus.OK, 
                message: '사용자 정보를 정상적으로 불러왔습니다.', projects, 
                token, 
                authority: user.authority 
              })
            } else {
              const projects = await db.select('*').from('projects').where({ authority: 0 })
              return res.status(HttpStatus.OK).send({ 
                statusCode: HttpStatus.OK, 
                message: '', 
                projects, 
                token, 
                authority: user.authority 
              })
            }
          } else if (type === 'Laundry') {
            const washer = await db.select('*').from('Laundry').where({ gender: token.gender, floor: token.room[0], type: 1 })
            const dryer = await db.select('*').from('Laundry').where({ gender: token.gender, floor: token.room[0], type: 2 })
            for (const wash of washer) {
              await db.update({ active: 0, Student_ID: 0, name: 0, time: 0, room: 0 })
                .from('Laundry')
                .where({ gender: token.gender, floor: token.room[0], type: 1 })
                .andWhere('time', '<=', wash.time + 10800000)
            }
            await db.update('*').from('Laundry').where('')
            return res.status(HttpStatus.OK).send({ 
              statusCode: HttpStatus.OK, 
              message: '', 
              token, 
              washer, 
              dryer 
            });
          } else {
            return res.status(HttpStatus.OK).send({ statusCode: HttpStatus.OK, message: '사용자 정보를 정상적으로 불러왔습니다.', token });
          }
        }
        return res.status(HttpStatus.BAD_REQUEST).send({ statusCode: HttpStatus.BAD_REQUEST, message: "비정상적인 유저 정보 입니다.", auth_token })
      } else {
        return res.status(HttpStatus.BAD_REQUEST).send({ statusCode: HttpStatus.OK, message: "로그인 시간이 만료 되었습니다.<br/> 다시 로그인을 시도 해주세요." })
      }
    } catch(e) {
      return res.status(HttpStatus.BAD_REQUEST).send({ statusCode: HttpStatus.BAD_REQUEST, message: e });
    }
  }

  async UseLaundry(req: Request, res: Response): Promise<any> {
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
          status: 1,
        })
        if (user) {
          const { machineNum, type } = req.body
          if (!machineNum || !type) {
            return res.status(HttpStatus.BAD_REQUEST).send({ 
              statusCode: HttpStatus.BAD_REQUEST, 
              message: "잘못된 요청입니다." 
            });
          }
          
          const [machine] = await db.select('*').from('Laundry').where({ 
            num: machineNum, 
            type,
            floor: token.room[0],
            gender: token.gender
          })

          if (machine) {
            if (machine.active === 1) {
              if (user.Student_ID === machine.Student_ID) {
                await db.update({ 
                  active: 0, 
                  room: 0, 
                  name: "0", 
                  Student_ID: "0",  
                  time: 0 
                }).where({ 
                  num: machineNum, 
                  type, 
                  floor: token.room[0], 
                  gender: token.gender 
                }).from('Laundry')

                return res.status(HttpStatus.OK).send({ 
                  statusCode: HttpStatus.OK, 
                  message: '세탁기 사용 취소 요청 <br/>정상적으로 처리 되었습니다.' 
                })
              } else {
                return res.status(HttpStatus.BAD_REQUEST).send({ statusCode: HttpStatus.BAD_REQUEST, message: '사용자 정보가 일치하지 않습니다.' })
              }
            } else {
              await db.update({ 
                active: 1, 
                room: token.room, 
                name: token.Name, 
                Student_ID: token.Student_ID, 
                time: Date.now()
              }).where({ 
                  num: machineNum, 
                  type, 
                  floor: token.room[0], 
                  gender: token.gender 
              }).from('Laundry')

              return res.status(HttpStatus.OK).send({ 
                statusCode: HttpStatus.OK, 
                message: '세탁기 사용 요청이 <br/>정상적으로 처리 되었습니다.'
              })
            }
          } else {
            // 세탁기, 건조기가 데이터 베이스에 등록이 안되어 있을 때
            return res.status(HttpStatus.BAD_REQUEST).send({ 
              statusCode: HttpStatus.BAD_REQUEST, 
              message: "비정상적인 요청 입니다." 
            });
          }
        } else {
          // 유저가 데이터 베이스에 없을 때
          return res.status(HttpStatus.BAD_REQUEST).send({ 
            statusCode: HttpStatus.BAD_REQUEST, 
            message: "비정상적인 유저 정보 입니다.",
            auth_token 
          });
        }
      } else {
        // jwt 만료 처리 / 토큰이 없을 때
        return res.status(HttpStatus.BAD_REQUEST).send({ 
          statusCode: HttpStatus.BAD_REQUEST, 
          message: "로그인 시간이 만료 되었습니다. <br/>다시 로그인을 시도 해주세요." 
        });
      }
    } catch(e) {
      // catch 처리
      return res.status(HttpStatus.BAD_REQUEST).send({ 
        statusCode: HttpStatus.BAD_REQUEST, 
        message: e 
      });
    }
  }
}
