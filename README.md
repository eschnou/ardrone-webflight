# ardrone-webflight

Pilot the AR.Drone 2.0 directly from your browser. Extend the application with plugins
to add features such as video recording, autonomous flight, face recognition, and more.

Developed in Node.JS, built on top of the [ar-drone]() library. You can easily extend webflight
through plugins. It makes it a very friendly environment to quickly build and experiment 
with your drone.

**This branch is the development branch, there are no packaged release yet.** 

If you encounter an issue; please submit it to the issue tracker!

## Built-in plugins

* **[video-png](plugins/video-png/)** stream the video to the browser through static image loading, 
    works great in every browser.

* **[hud](plugins/hud/)** to visualize a head-up display with artificial horizon, compass, 
    altimeter, etc.

* **[pilot](plugins/pilot)** to control the drone remotely using the keyboard

## Installation

WebFlight requires a recent nodejs (built and tested with node > 0.10) as well as
[npm](https://npmjs.org/) and [bower](http://bower.io/) for dependency management.

```
git clone git@github.com:eschnou/ardrone-webflight
cd ardrone-webflight
npm install
bower install
```

## Usage

1. Copy the config.js.sample to config.js and edit to select your plugins
2. Connect to the drone's wifi
3. Run `node app.js`
4. Point your browser to http://localhost:3000/

If you have enabled the **pilot** plugin, you can fly the drone with the following keys. Yes, 
these are azerty bindings :-) If you need qwerty ones, just hack the plugin. I'll need to find 
a way to provide custome configuration etc.

Use `Z, S, Q, D` to move front, back and sideways. Use your `cursors` to go up/down or turn 
clockwise/counter clockwise. Use `t` to takeoff and `l` for landing.

## Adding your own plugin

There is no tutorial yet, in the meanwhile, just have a look at the built in plugins, 
it is faily straightforward. 

I would like to maintain a list of user plugins. If you hack something, please let me know
and I'll add you to the list.

## Thanks

This work is based on the integration of [nodecopter-cockpit](https://github.com/bkw/nodecopter-cockpit) 
and [drone-browser](https://github.com/functino/drone-browser), refactored in a plugin 
architecture. Special thanks to [@felixge](https://github.com/felixge) for his [node-ar-drone](https://github.com/felixge/node-ar-drone) library 
which pushed me into buying a drone and become crazy about these little flying robots!

## License

The MIT License

Copyright (c) 2013 by the AUTHORS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
