import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AccessGuard implements CanActivate {
  access: number;

  constructor(access: number) {
    this.access = access;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const access = user.access;
    if (!access || this.access > access) return false;

    return true;
  }
}
