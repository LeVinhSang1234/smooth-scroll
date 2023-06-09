"use client";

import { Component, ReactNode, WheelEvent } from "react";

const defaultStyle = {
  width: "100%",
  height: "100%",
};

type ScrollProps = {
  children?: ReactNode;
  overflow?: "x" | "y";
};

class Scroll extends Component<ScrollProps> {
  refScroll?: HTMLDivElement | null;
  translate: number;
  delta: number;
  time: number;
  animationFrame: number;

  constructor(props: ScrollProps) {
    super(props);
    this.translate = 0;
    this.animationFrame = 0;
    this.delta = 0;
    this.time = 40;
  }

  onWheel = (event: WheelEvent<HTMLDivElement>) => {
    const { deltaY } = event;
    window.cancelAnimationFrame(this.animationFrame);
    const newDelta = this.delta + deltaY;
    this.time = 40;
    if (Math.abs(newDelta) < Math.abs(this.delta)) {
      this.delta = deltaY;
    } else {
      this.delta = newDelta;
    }
    this.scroll();
  };

  scroll = () => {
    if (!this.refScroll) return;
    const translate = this.delta / this.time;
    this.time += 0.5;
    this.translate += translate;
    const newDelta = this.delta - translate;
    if ((this.delta < 0 && newDelta > -2) || (this.delta > 0 && newDelta < 2)) {
      this.delta = 0;
      return;
    }
    this.delta = newDelta;
    this.refScroll.style.transform = `translateY(${this.translate}px)`;
    this.animationFrame = window.requestAnimationFrame(this.scroll);
  };

  scrollReceive = () => {
    if (this.translate > 0) {
      window.cancelAnimationFrame(this.animationFrame);
      this.delta = -this.translate;
      this.time = 40;
      this.scroll();
    }
  };

  render() {
    const { children } = this.props;
    return (
      <div
        className="smooth-scroll"
        style={defaultStyle}
        onWheel={this.onWheel}
      >
        <div ref={(ref) => (this.refScroll = ref)}>{children}</div>
      </div>
    );
  }
}

export default Scroll;
