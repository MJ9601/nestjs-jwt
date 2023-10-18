import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | false, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (data) return req.user[data!];

    return req.user;
  },
);
