import { isScreenSmall, isMobile } from '../lib/common.ts';
import { StaticWindow } from './StaticWindow.ts';
import { DynamicWindow } from './DynamicWindow.ts';
import { states, homeWindows, aboutWindows, artWindows, hobbiesWindows, gameDevWindows } from './Data.ts';
import type { windowData } from './Data.ts';
import p5 from 'p5';

export const home = (p: p5) => {
  // Remove this comment
  //p.disableFriendlyErrors = true;

  /* Constants */
  const colors: {
    main: string,
    alt: string,
    border: string,
    bg: string,
    text: string,
  } = {
    //main: '#6531b9ff',
    //main: '#000000',
    main: '#000000',
    //main: '#000000',
    //alt: '#995353',
    alt: '#c63348ff',
    border: '#212121',
    //bg: '#ffffff',
    //bg: '#c63348ff',
    //bg: '#995353',
    bg: '#ffffff',
    //bg: '#000000',
    //bg: '#FF3483',
    
    text: '#995353'
    //main: '#c678dd',
    //alt: '#ffff00',
    //bg: '#282c34',
    //text: '#ffffff'
  };

  /* Variables */
  let win: {
      width: number,
      height: number,
      top: number,
      bottom: number,
      left: number,
      right: number
    } = {
      width: window.innerWidth,
      height: window.innerHeight,
      top: -window.innerHeight * .5,
      bottom: window.innerHeight * .5,
      left: window.innerWidth * .5,
      right: window.innerWidth * .5
    },
    mouseX: number,
    mouseY: number,
    pmouseX: number,
    pmouseY: number,
    touchX: number = 0,
    touchY: number = 0,
    ptouchX: number = 0,
    ptouchY: number = 0,
    smallScreen: boolean,
    mobile: boolean,
    font: p5.Font,
    background: p5.Graphics,
    images: { [name: string]: p5.Image },
    windows: DynamicWindow[],
    links: windowData[],
    fontSize: number = 16,
    state: number = states.HOME;
  
  /* Resize window */
  function updateConstants() {
    win.top = -win.height * .5;
    win.bottom = win.height * .5;
    win.left = -win.width * .5;
    win.right = win.width * .5;
  }
  
  function updateMouse() {
    mouseX = p.mouseX + win.left;
    mouseY = p.mouseY + win.top;
    pmouseX = p.pmouseX + win.left;
    pmouseY = p.pmouseY + win.top;
  }
  
  function updateTouch() {
    ptouchX = touchX;
    ptouchY = touchY;
    if (p.touches.length === 0) return;
    const touch: {} = p.touches[0];
    if ('x' in touch && (typeof touch.x === 'number')) touchX = touch.x + win.left;
    if ('y' in touch && (typeof touch.y === 'number')) touchY = touch.y + win.top;
  }

  function drawBackground() {
    //p.background(colors.bg);
    p.image(background, win.left, win.top, win.width, win.height);
  }

  function createBackground() {
    background = p.createGraphics(win.width, win.height, p.WEBGL);
    background.background(colors.bg);
    const dist = 30;
    background.stroke('#000000');
    for (let i=win.left; i<win.right; i+=dist) background.line(i, win.top, i, win.bottom);
    for (let i=win.top; i<win.bottom; i+=dist) background.line(win.left, i, win.right, i);
  }

  async function setupApp() {
    updateConstants();
    updateMouse();
    createBackground();
    smallScreen = isScreenSmall(win.width, win.height);
    mobile = isMobile();

    windows = [];
    switch (state) {
      case states.HOME:
        links = homeWindows;
        break;
      case states.ABOUT:
        links = aboutWindows;
        break;
      case states.ART:
        links = artWindows;
        break;
      case states.HOBBIES:
        links = hobbiesWindows;
        break;
      case states.GAME_DEV:
        links = gameDevWindows;
        break;
    }
    links = p.shuffle(links);
    for (let i=0; i<links.length; i++) {
      const data = links[i],
        base: number = (mobile) ? (p.min(win.width, win.height) * .15) : (p.min(win.width, win.height) * .2),
        pos: { x: number, y: number } = {
          x: (win.left + base) + ((win.width - (base * 2)) * Math.random()),
          y: (win.height * -.3) + (((win.height * .6)/links.length) * i)
        };

      let size: { w: number, h: number } = {
        w: Math.max(((data.name.length + 4) * fontSize), base * data.ratio) + Math.ceil(Math.random() * base * .5 * data.ratio),
        h: Math.max(((data.name.length + 4) * fontSize), base * data.ratio) + Math.ceil(Math.random() * base * .5 * data.ratio)
        },
        newWindow: (DynamicWindow|StaticWindow);
      if (data.static) {
        size.h = size.w * (images[data.name].height/images[data.name].width);
        newWindow = new StaticWindow(p, pos, size, colors, data.name, data.redirect, data.ready, images[data.name], fontSize, win);
      } else {
        newWindow = new DynamicWindow(p, pos, size, colors, data.name, data.redirect, data.ready, images[data.name], fontSize, win);
      }
      windows.push(newWindow);
    }
  }

  /* P5js functions */
  p.preload = async () => {
    /* App setup */
    font = await p.loadFont('/fonts/scientifica.ttf');
    images = {};
    const base = '/images'
    for (const v of homeWindows) images[v.name] = await p.loadImage(`${base}/${v.source}`);
    for (const v of aboutWindows) images[v.name] = await p.loadImage(`${base}/${v.source}`);
    for (const v of artWindows) images[v.name] = await p.loadImage(`${base}/${v.source}`);
    for (const v of hobbiesWindows) images[v.name] = await p.loadImage(`${base}/${v.source}`);
    for (const v of gameDevWindows) images[v.name] = await p.loadImage(`${base}/${v.source}`);

    setupApp();
  }

  p.setup = () => {
    /* Canvas settings */
    p.createCanvas(win.width, win.height, p.WEBGL);
    p.frameRate(60);
    p.pixelDensity(1);
    p.setAttributes({
      antialias: false,
      depth: false,
      premultipliedAlpha: false
    });
    p.noSmooth();
    p.curveDetail(3);
    p.describe('My home page');

    p.textFont(font);
    p.textSize(fontSize);

    p.strokeJoin(p.MITER);

    setupApp();
  }

  p.draw = () => {
    drawBackground();

    if (smallScreen) {
      p.push();
      p.fill(colors.main);
      p.textAlign(p.CENTER);
      p.text('Screen too small', 0, 0);
      p.pop();
      return;
    }
    if (!mobile) updateMouse();

    for (const w of windows) w.update();
    for (let i=windows.length - 1; i >= 0; i--) windows[i].draw();
  };

  p.touchStarted = () => {
    if (smallScreen || !mobile) return;
    if (mobile) updateTouch();
    for (const w of windows) {
      if (w.mousePressed(touchX, touchY)) {
        const redirect = w.getRedirect();
        if (w.getFollow() === true) return;
        else if (typeof redirect === 'string' && redirect !== '') {
          window.open(redirect, '_blank');
          return;
        } else if (typeof redirect === 'number') {
          state = redirect;
          setupApp();
          return;
        }
        return;
      }
    }
  }

  p.touchMoved = () => {
    if (smallScreen || !mobile) return;
    if (mobile) updateTouch();
    for (const w of windows)
      w.mouseDragged(touchX, touchY);
  }

  p.touchEnded = () => {
    if (smallScreen || !mobile) return;
    for (const w of windows)
      if (w.mouseReleased(touchX, touchY, ptouchX, ptouchY)) return;
  }

  p.mousePressed = () => {
    if (smallScreen || mobile) return;
    for (const w of windows) {
      if (w.mousePressed(mouseX, mouseY)) {
        const redirect = w.getRedirect();
        if (w.getFollow() === true) return;
        else if (typeof redirect === 'string' && redirect !== '') {
          window.open(redirect, '_blank');
          return;
        } else if (typeof redirect === 'number') {
          state = redirect;
          setupApp();
          return;
        }
        return;
      }
    }
  }

  p.mouseMoved = () => {
    if (smallScreen || mobile) return;
    for (const w of windows) w.setHover(false);
    for (const w of windows)
      if (w.mouseMoved(mouseX, mouseY)) return;
  }

  p.mouseDragged = () => {
    if (smallScreen || mobile) return;
    for (const w of windows)
      if (w.mouseDragged(mouseX, mouseY)) return;
  }

  p.mouseReleased = () => {
    if (smallScreen || mobile) return;
    for (const w of windows)
      if (w.mouseReleased(mouseX, mouseY, pmouseX, pmouseY)) return;
  }

  p.windowResized = () => {
    win.width = window.innerWidth;
    win.height = window.innerHeight;
    p.resizeCanvas(win.width, win.height);
    setupApp();
  }
};
