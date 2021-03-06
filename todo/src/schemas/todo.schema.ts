import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Team } from 'src/interfaces/team.interface';
import { TodoStatus } from './todo.enum';

/**
 * Todo Model:
 * id: string;
 * title: string;
 * desc: string;
 * createdBy: ObjectId - Ref: User
 * status: TodoStatus;
 * assigned: boolean;
 * assignedTo: ObjectId - Ref: User
 * private: boolean;
 * archived: boolean
 * createdAt: Date;
 * updatedAt: Date;
 */

export type TodoDocument = Todo & mongoose.Document;

@Schema({ timestamps: true })
export class Todo {
  @Prop()
  id: string;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    default: '',
  })
  desc: string;

  @Prop({
    required: true,
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  })
  createdBy: string | mongoose.Schema.Types.ObjectId;

  @Prop({
    enum: TodoStatus,
    default: TodoStatus.ACTIVE,
  })
  status: TodoStatus;

  @Prop({
    default: false,
  })
  assigned: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  assignedTo: string | mongoose.Schema.Types.ObjectId;

  @Prop({
    default: false,
  })
  private: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  })
  team: string | mongoose.Schema.Types.ObjectId | Team;

  @Prop({
    default: false,
  })
  archived: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
