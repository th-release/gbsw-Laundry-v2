import SHA3 from 'sha3'
import JWT from 'jsonwebtoken'

export type TokenData = {
	id: string,
	Student_ID: string,
	Name: string,
	grade: string,
	class: string,
	number: string,
	room: string,
	phone: string,
	gender: number,
	authority: number
}

export default class utils {
	static getRandom (type_: string, length: number) { // ranStr
		let result = "";
		const type = type_.toLowerCase();
		length = length ? length : 32;
		let characters = "0123456789";
		if (type === 'number' || type === 'numbers') {
			characters = "0123456789";
			for (let i = 0; i < length; i++) {
				result += characters[Math.floor(Math.random() * characters.length)];
			}
			return result;
		} else if (type === 'alphabet' || type === 'alphabets') { 
			characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
			for (let i = 0; i < length; i++) {
				result += characters[Math.floor(Math.random() * characters.length)];
			}
			return result;
		} else if (type === 'alphanumeric' || type === 'all') {
			characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			for (let i = 0; i < length; i++) {
				result += characters[Math.floor(Math.random() * characters.length)];
			}
			return result;
		} else {
			characters = type;
			for (let i = 0; i < length; i++) {
				result += characters[Math.floor(Math.random() * characters.length)];
			}
			return result;
		}
	}

	static hash(text: string) {
		const hasher = new SHA3(512)
		hasher.update(text)
		return hasher.digest('hex')
	}

	static isNumber(value : string) {
		return !isNaN(Number(value));
	}

	static IsJsonString(str: string) {
		try {
			const json = JSON.parse(str);
			return (typeof json === 'object');
		} catch (e) {
			return false;
		}
	}

	static toLower(str: string) {
		return str.toLowerCase()
	}

	static verifyToken(token: string) {
		return JWT.verify(token, this.getSecret() || 'SECRET')
	}

	static getSecret() {
		return "2F37390CC594EC2C70F6F1D908D56E462C76A82B45C24C9E4C060CEB024BFA07D745989972757419C0BDAE0507E9324F11A5528F31C43AD71994904ED0B8D9F7";
	}
}