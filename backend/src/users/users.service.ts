import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async create(email: string, password: string, name: string) {
    const exists = await this.findByEmail(email);
    if (exists) throw new ConflictException('Email already in use');

    const hash = await bcrypt.hash(password, 12);
    const newUser = await this.userModel.create({
      email,
      password: hash,
      name,
    });

    return newUser.toObject();
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new NotFoundException('Invalid credentials');

    return user;
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }
}
