import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthService } from "./services/auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { AuthRepository } from "./repositories/auth.repository";
import { AuthController } from "./controllers/auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtGuard } from "./guards/jwt.guard";
import { JwtStrategy } from "./guards/jwt.strategy";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";
import { UserRepository } from "./repositories/user.repository";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Team, TeamSchema } from "./schemas/team.schema";
import { Todo, TodoSchema } from "./schemas/todo.schema";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_URL),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre("save", function () {
            if (this.isNew) {
              const objId = this._id;
              this.id = objId;
            }
          });
          return schema;
        },
      },
      {
        name: Team.name,
        useFactory: () => {
          const schema = TeamSchema;
          schema.pre("save", function () {
            if (this.isNew) {
              throw new Error("this schema is for read-only");
            }
          });
          return schema;
        },
      },
      {
        name: Todo.name,
        useFactory: () => {
          const schema = TodoSchema;
          schema.pre("save", function () {
            if (this.isNew) {
              throw new Error("this schema is for read-only");
            }
          });
          return schema;
        },
      },
    ]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "36000s" },
      }),
    }),
    ClientsModule.register([
      {
        name: "MAIL_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_HOST],
          queue: "mail_queue",
          noAck: false,
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: "TODO_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_HOST],
          queue: "todo_queue",
          noAck: false,
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: "TEAM_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_HOST],
          queue: "team_queue",
          noAck: false,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, AuthRepository, JwtGuard, JwtStrategy, UserService, UserRepository],
  exports: [AuthService],
})
export class AppModule {}
