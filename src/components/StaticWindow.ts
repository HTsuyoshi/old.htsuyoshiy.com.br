import p5 from 'p5';
import { DynamicWindow } from './DynamicWindow.ts'

export class StaticWindow extends DynamicWindow {
  public constructor(
    p: p5,
    pos: { x: number, y: number },
    size: { w: number, h: number },
    colors: { [key: string]: string },
    name: string,
    redirect: (string|number),
    ready: boolean,
    image: p5.Image,
    fontSize: number,
    win: { [key: string]: number },
  ) {
    super(p, pos, size, colors, name, redirect, ready, image, fontSize, win);
    this.content.copy(
      this.image,
      0, 0, this.image.width, this.image.height,
      0, 0, this.getImageWidth(), this.getImageHeight(),
    );
    this.contentGray.copy(
      this.image,
      0, 0, this.image.width, this.image.height,
      0, 0, this.getImageWidth(), this.getImageHeight(),
    );
    this.contentGray.filter(this.p.GRAY);
  }

  public updateBackground() { }
}