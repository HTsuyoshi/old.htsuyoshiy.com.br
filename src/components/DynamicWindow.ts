import p5 from 'p5';

//const STATE_WINDOW = 0,
//  STATE_MINIMIZED = 1,
//  STATE_FULLSCREEN= 2;

export class DynamicWindow {
  protected p: p5;
  protected pos: { x: number, y: number };
  protected vel: { x: number, y: number };
  protected size : { w: number, h: number };
  protected colors: { [key: string]: string };
  protected name: string;
  protected redirect: (string|number);
  protected ready: boolean;
  protected image: p5.Image;
  protected content: p5.Image;
  protected contentGray: p5.Image;
  protected fontSize: number;

  /* Interaction */
  private animation: number = 0.1; // From 0.0 to 1.0
  private squashX: number = 1.0;
  private squashY: number = 1.0;
  private hover: boolean = false;
  private follow: boolean = false;
  private followOffset: { x: number, y: number } = { x: 0, y: 0 };
  private win: { [key: string]: number };
  //private state: number = false;

  /* Settings */
  private borderSize: number = 4;
  private barHeight: number = 20 + (this.borderSize * 2); // change to be the size of the text

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
    win: { [key: string]: number }
  ) {
    this.p = p;
    this.pos = { x: pos.x - (size.w * .5), y: pos.y - (size.h * .5) };
    this.vel = { x: Math.ceil((Math.random() - 0.5) * 20), y: Math.ceil((Math.random() - 0.5) * 20) };
    this.size = { w: size.w, h: size.h };
    this.colors = colors;

    this.name = name;
    this.image = image;
    this.content = this.p.createImage(this.size.w, this.size.h);
    this.contentGray = this.p.createImage(this.size.w, this.size.h);
    this.fontSize = fontSize;

    this.redirect = redirect;
    this.ready = ready;

    this.win = win;
    this.updateBackground();
  }

  public update(): void { 
    if (this.ready && this.hover && (this.animation < 1.0))  this.animation += 0.1;
    if (this.ready && !this.hover && (this.animation > 0.0)) this.animation -= 0.1;

    if (this.follow) return;

    if (this.collision()) this.fixPos();
    else this.fixSquash();

    if (Math.abs(this.vel.x) > 0.1) this.vel.x = this.vel.x * 0.9;
    else this.vel.x = 0;
    if (Math.abs(this.vel.y) > 0.1) this.vel.y = this.vel.y * 0.9;
    else this.vel.y = 0;
    if (Math.abs(this.vel.x) > 0) this.pos.x += this.vel.x;
    if (Math.abs(this.vel.y) > 0) this.pos.y += this.vel.y;
    if (Math.abs(this.vel.x) > 0 || Math.abs(this.vel.y) > 0) this.updateBackground();
  }
  
  public updateBackground(): void {
    this.content.copy(
      this.image,
      this.pos.x + (this.image.width * .5), this.pos.y + (this.image.height * .5), this.getImageWidth(), this.getImageHeight(),
      0, 0, this.content.width, this.content.height,
    );
    this.content.set(0, 0, this.p.color(0,0,0));
    this.contentGray.copy(
      this.image,
      this.pos.x + (this.image.width * .5), this.pos.y + (this.image.height * .5), this.getImageWidth(), this.getImageHeight(),
      0, 0, this.content.width, this.content.height,
    );
    this.contentGray.filter(this.p.GRAY);
  }


  public draw(): void {
    this.p.push();
    this.p.stroke(this.colors.main);
    this.p.strokeWeight(this.borderSize);

    /* Window Background */
    this.p.rect(
      this.getCenterX() - (.5 * this.getWidth()),
      this.getCenterY() - (.5 * this.getHeight()),
      this.getWidth(),
      this.getHeight()
    );

    /* Bar */
    this.p.fill(this.colors.main);
    this.p.rect(
      this.getCenterX() - (.5 * this.getWidth()),
      this.getCenterY() - (.5 * this.getHeight()),
      this.getWidth(),
      this.getBarHeight()
    );

    /* Text Bar */
    this.p.fill(this.p.lerpColor(this.p.color(this.colors.text), this.p.color(this.colors.alt), this.animation));
    this.p.text(
      this.name,
      this.getPosX() + (.5 * this.borderSize) + this.borderSize,
      this.getPosY() + (.5 * this.borderSize) + (this.barHeight * 0.5) + (this.p.textSize() * .3)
    );
    this.p.pop();

    //this.drawButton(1, 'X');
    //this.drawButton(2, 'O');
    //this.drawButton(3, '_');
    this.drawContent();

    this.p.push();
    this.p.noFill();
    this.p.strokeWeight(this.borderSize * .5);
    this.p.stroke(this.p.color(this.colors.border));
    this.p.rect(
      -5 + this.getCenterX() - (.5 * this.getWidth()),
      -5 + this.getCenterY() - (.5 * this.getHeight()),
      10 + this.getWidth(),
      10 + this.getHeight()
    );
    this.p.pop();
  }

  //private drawButton(i: number, text: string) {
  //  const buttonSize = this.barHeight - (this.borderSize * 2);

  //  this.p.push();
  //  this.p.fill(this.colors.text);
  //  this.p.rect(
  //    this.pos.x + this.getWidth() - ((this.borderSize + buttonSize) * i),
  //    this.pos.y + this.borderSize,
  //    buttonSize, buttonSize
  //  );
  //  this.p.fill(this.colors.main);
  //  this.p.text(
  //    text,
  //    this.pos.x + this.getWidth() - ((this.borderSize + buttonSize) * i) + (this.p.textWidth(text) * .5),
  //    this.pos.y + this.borderSize + this.fontSize
  //  );
  //  this.p.pop();
  //}

  private drawContent() {
    this.p.image(
      this.content,
      this.getPosX() + (.5 * this.borderSize),
      this.getPosY() + (.5 * this.borderSize) + this.getBarHeight(),
      this.getImageWidth(),
      this.getImageHeight()
    );
    if (this.animation === 1) return;
    this.p.push();
    this.p.tint(255, 255 * (1.0 - this.animation));
    this.p.image(
      this.contentGray,
      this.getPosX() + (.5 * this.borderSize),
      this.getPosY() + (.5 * this.borderSize) + this.getBarHeight(),
      this.getImageWidth(),
      this.getImageHeight()
    );
    this.p.pop();
  }

  public mousePressed(
    mouseX: number,
    mouseY: number
  ): boolean {
    if (this.hoverTitle(mouseX, mouseY)) return true;
    if (this.hoverBar(mouseX, mouseY) ||
      this.hoverContent(mouseX, mouseY)) {
      this.hover = true;
      this.follow = true;
      this.followOffset.x = this.pos.x - mouseX;
      this.followOffset.y = this.pos.y - mouseY;
      return true;
    }
    return false;
  }

  public mouseDragged(
    mouseX: number,
    mouseY: number,
  ): boolean {
    if (this.follow) {
      this.pos.x = mouseX + this.followOffset.x + this.squashOffX();
      this.pos.y = mouseY + this.followOffset.y + this.squashOffY();
      if (!this.fixPos()) {
        this.fixSquash();
        this.fixPos();
      }
      this.updateBackground();
      return true;
    }
    return false;
  }

  public mouseMoved(
    mouseX: number,
    mouseY: number
  ): boolean {
    if (this.hoverTitle(mouseX, mouseY)) {
      this.p.cursor(this.p.HAND);
      this.hover = true;
      return true;
    }
    this.p.cursor(this.p.ARROW);
    if (this.hoverContent(mouseX, mouseY) || this.hoverBar(mouseX, mouseY)) {
      this.hover = true;
      return true;
    }
    this.hover = false;
    return false;
  }

  public mouseReleased(
    mouseX: number,
    mouseY: number,
    pmouseX: number,
    pmouseY: number,
  ): boolean {
    if (this.follow) {
      this.hover = false;
      this.follow = false;
      this.vel.x = mouseX - pmouseX;
      this.vel.y = mouseY - pmouseY;
      return true;
    }
    return false;
  }

  /* Logic functions */
  private hoverTitle(mouseX: number, mouseY: number): boolean {
    if (mouseX > this.getPosX() &&
        mouseX < this.getPosX() + (this.squashX * this.p.textWidth(this.name)) &&
        mouseY > this.getPosY() &&
        mouseY < this.getPosY() + this.getBarHeight()) return true;
    return false;
  }

  private hoverBar(mouseX: number, mouseY: number): boolean {
    if (mouseX > this.getPosX() &&
        mouseX < this.getPosX() + this.getWidth() &&
        mouseY > this.getPosY() &&
        mouseY < this.getPosY() + this.getBarHeight()) return true;
    return false;
  }

  private hoverContent(mouseX: number, mouseY: number): boolean {
    if (mouseX > this.getPosX() &&
        mouseX < this.getPosX() + this.getWidth() &&
        mouseY > this.getPosY() + this.getBarHeight() &&
        mouseY < this.getPosY() + this.getHeight()) return true;
    return false;
  }

  private collision(): boolean {
    let collide = false;

    if (this.collisionRight()) {
      this.vel.x = - Math.abs(this.vel.x);
      collide = true;
    } else if (this.collisionLeft()) {
      this.vel.x = Math.abs(this.vel.x);
      collide = true;
    }

    if (this.collisionTop()) {
      this.vel.y = Math.abs(this.vel.y);
      collide = true;
    } else if (this.collisionBottom()) {
      this.vel.y = - Math.abs(this.vel.y);
      collide = true;
    }

    return collide;
  }

  private fixPos(): boolean {
    let fix = false;
    if (this.collisionRight()) {
      if (this.follow) this.squashHorizontal();
      this.pos.x = this.win.right - this.getWidth();
      fix = true;
    } else if (this.collisionLeft()) {
      if (this.follow) this.squashHorizontal();
      this.pos.x = this.win.left + (this.borderSize * .5);
      fix = true;
    } 

    if (this.collisionTop()) {
      if (this.follow) this.squashVertical();
      this.pos.y = this.win.top + (this.borderSize * .5);
      fix = true;
    } else if (this.collisionBottom()) {
      if (this.follow) this.squashVertical();
      this.pos.y = this.win.bottom - this.getHeight();
      fix = true;
    }
    return fix;
  }

  private fixSquash(): void {
    if (this.squashX > 1) {
      this.squashX = this.p.lerp(this.squashX, 1, 0.8); 
      this.squashY = this.p.lerp(this.squashY, 1, 0.8); 
      const vel = this.p.abs((1 - this.squashY) * 1000);
      if (this.pos.y > 0) this.vel.y -= vel;
      else this.vel.y += vel;
      this.updateBackground();
      return;
    }

    if (this.squashY > 1) {
      this.squashX = this.p.lerp(this.squashX, 1, 0.8); 
      this.squashY = this.p.lerp(this.squashY, 1, 0.8); 
      const vel = this.p.abs((1 - this.squashX) * 1000);
      if (this.pos.x > 0) this.vel.x -= vel;
      else this.vel.x += vel;
      this.updateBackground();
      return;
    }
  }

  /* For collision and physics */
  protected getBarHeight(): number { return this.barHeight; }
  protected getImageWidth(): number { return this.squashX * this.size.w; }
  protected getImageHeight(): number { return this.squashY * this.size.h; }
  protected getWidth(): number { return this.getImageWidth() + this.borderSize; }
  protected getHeight(): number { return this.getImageHeight() + this.getBarHeight() + this.borderSize; }

  /* Fix squash */
  protected getPosX(): number { return this.pos.x - (.5 * this.borderSize); }
  protected getPosY(): number { return this.pos.y - (.5 * this.borderSize); }
  protected getCenterX(): number { return this.getPosX() + (.5 * this.getWidth()); }
  protected getCenterY(): number { return this.getPosY() + (.5 * this.getHeight()); }

  protected squashOffX() {
    if (this.squashX > 1) return -.5 * (this.getWidth() - (this.size.w + this.borderSize));
    return 0;
  }
  protected squashOffY() {
    if (this.squashY > 1) return -.5 * (this.getHeight() - (this.size.h + this.barHeight + this.borderSize));
    return 0;
  }

  protected collisionTop(): boolean { return (this.getCenterY() - (this.getHeight() * .5) < this.win.top) }
  protected collisionLeft(): boolean { return (this.getCenterX() - (this.getWidth() * .5) < this.win.left) }
  protected collisionRight(): boolean { return (this.getCenterX() + (this.getWidth() * .5) > this.win.right) }
  protected collisionBottom(): boolean { return (this.getCenterY() + (this.getHeight() * .5) > this.win.bottom) }


  protected squashVertical(): void {
    if (this.squashX < 1.5) this.squashX += .02;
    if (this.squashY > .7) this.squashY -= .02;
  }
  protected squashHorizontal(): void {
    if (this.squashX > .7) this.squashX -= .02;
    if (this.squashY < 1.5) this.squashY += .02;
  }

  /* Access */
  public getFollow(): boolean { return this.follow; }
  public getRedirect(): (string|number) { return this.redirect; }
  public setHover(hover: boolean): void { this.hover = hover; }
}