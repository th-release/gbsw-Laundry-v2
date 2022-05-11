import { HttpStatus, Injectable } from '@nestjs/common';
import { Response, Request } from 'express';
import { sign } from 'jsonwebtoken'
import { db } from '../../utils/databases'
import utils from '../../utils/util';

@Injectable()
export class AuthService {
  async login(req: Request, res: Response): Promise<any> {
    const { id, password } = req.body;
    const spe = id.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
    const korean = id.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi); 
    if ((id < 4) || (id.length > 25))
      return res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '아이디를 4자리 ~ 24자리 이내로 입력해주세요.'
      });
    if (id.search(/₩s/) != -1)
      return res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '아이디는 공백없이 입력해주세요.'
      });
    if (spe > 0 || korean > 0)
      return res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '아이디는 영문, 숫자만 입력해주세요.'
      });
    const [user] = await db.select('*').from('Accounts').where({ id })
    if (user) {
      if (utils.hash(password + user.salt) === user.Password) {
        if (user.status) {
          return res.status(HttpStatus.OK).send({ 
            statusCode: HttpStatus.OK, 
            message: '로그인이 정상적으로 처리 되었습니다.', 
            token: sign({ 
              id: user.id, 
              Student_ID: user.Student_ID, 
              Name: user.Name, 
              grade: user.grade, 
              class: user.class, 
              number: user.number, 
              room: user.room, 
              phone: user.phone, 
              gender: user.gender,
              authority: user.authority
            }, 
            utils.getSecret() || 'SECRET', 
            { 
              expiresIn: '8h' 
            }),
          });
        } else {
          return res.status(HttpStatus.BAD_REQUEST).send({ 
            statusCode: HttpStatus.BAD_REQUEST, 
            message: '아직 승인되지 않은 계정입니다.<br/>관리자에게 문의 주세요.' 
          });
        }
      } else {
        return res.status(HttpStatus.BAD_REQUEST).send({ 
          statusCode: HttpStatus.BAD_REQUEST, 
          message: '아이디 혹은 비밀번호를 확인해 주세요.' 
        });
      }
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send({ 
        statusCode: HttpStatus.BAD_REQUEST, 
        message: '해당하는 유저의 정보를 찾을 수 없습니다.' 
      });
    }
  }

  async signup(req: Request, res: Response): Promise<any> {
    const { Id, Password, Grade, Class, Number, Name, Phone, Room } = req.body
    const spe = Id.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
    const korean = Id.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi); 
    if ((Id < 4) || (Id.length > 25))
      return res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '아이디를 4자리 ~ 24자리 이내로 입력해주세요.'
      });
    if (Id.search(/₩s/) != -1)
      return res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '아이디는 공백없이 입력해주세요.'
      });
    if (spe > 0 || korean > 0)
      return res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '아이디는 영문, 숫자만 입력해주세요.'
      });
    const StudentID = String(Grade + Class + (parseInt(Number) < 10 ? '0' + parseInt(Number) : parseInt(Number)))
    if (Id.length > 24) 
      return res.status(HttpStatus.BAD_REQUEST).send({ 
        statusCode: HttpStatus.BAD_REQUEST, 
        message: '아이디를 확인해 주세요.' 
      })
    if (!utils.isNumber(Grade) || !utils.isNumber(Class) || !utils.isNumber(Number)) 
      return res.status(HttpStatus.BAD_REQUEST).send({ 
        statusCode: HttpStatus.BAD_REQUEST, 
        message: '학년, 반, 번호를 확인해 주세요.' 
      })
    if (Phone.length !== 11 || !utils.isNumber(Phone))
      return res.status(HttpStatus.BAD_REQUEST).send({ 
        statusCode: HttpStatus.BAD_REQUEST, 
        message: '전화번호를 확인해 주세요.' 
      })
    try {
      const [user] = await db.select('*').from('Accounts').where({ 
          id: Id,
          Student_ID: StudentID,
          Phone 
        })
      const salt = utils.getRandom("all", 32);
      if (!user) {
        if (parseInt(Room.slice(1)) > 10) {
          await db.insert({ 
            Id, 
            Password: utils.hash(Password + salt), 
            salt, 
            grade: Grade, 
            class: Class, 
            number: Number, 
            room:Room,
            Phone, 
            status: 0, 
            Student_ID: StudentID, 
            Name, 
            gender: 0, 
            Created_At: new Date(Date.now() + 32400000)
          }).into('Accounts')
        } else {
          await db.insert({ 
            Id, 
            Password: utils.hash(Password + salt), 
            salt, 
            grade: Grade, 
            class: Class, 
            number: Number, 
            room: Room, 
            Phone, 
            status: 0, 
            Student_ID: StudentID, 
            Name, 
            gender: 1, 
            Created_At: new Date(Date.now() + 32400000)
          }).into('Accounts')
        }
        return res.status(HttpStatus.OK).send({ 
          statusCode: HttpStatus.OK, 
          message: '회원가입이 정상적으로 처리 되었습니다.' 
        })
      } else throw('이미 존재하는 유저 정보가 있습니다.')
    } catch(e) {
      return res.status(HttpStatus.BAD_REQUEST).send({ 
        statusCode: HttpStatus.BAD_REQUEST, 
        message: e 
      })
    }
  }
}
