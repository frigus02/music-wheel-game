# Music Wheel Game

An HTML5 music game. I'm mostly building this to play around with some new stuff like:

*   Web Components: [Custom Elements v1: Reusable Web Components](https://developers.google.com/web/fundamentals/getting-started/primers/customelements), [Shadow DOM v1: Self-Contained Web Components](https://developers.google.com/web/fundamentals/getting-started/primers/shadowdom)
*   ES Modules: [ES6 Modules in Depth](https://ponyfoo.com/articles/es6-modules-in-depth), [ECMAScript modules in browsers](https://jakearchibald.com/2017/es-modules-in-browsers/)
*   [Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
*   [Redux](http://redux.js.org/)

## Browser Requirements

As of now (2017-06-19) you need an update-to-date browser and enable some experimental features to get it running. These are:

*   Firefox 54:
    *   ES Modules: dom.moduleScripts.enabled = true (since version 54)
*   Chrome 60 (Canary):
    *   ES Modules: Experimental Web Platform features (since Chrome 60)

## Gameplay

*   As the music plays, colored circles will be spawning in the middle.
*   Collect with the mouse to trigger their effect:
    * **blue**: increase points by the multiplicator
    * **yellow**: increase multiplicator (+ 1)
    * **red**: decrease multiplicator (/ 1.5)
    * **purple**: increase color circle size for a few seconds
*   Try to get as much points a possible, I guess?

## Run

```
yarn install
yarn start
```

## Music

*   src/music/Come Back To You.mp3

    *   Title: Come Back To You
    *   Artist: Silence is Sexy
    *   [https://www.jamendo.com/track/214010/come-back-to-you](https://www.jamendo.com/track/214010/come-back-to-you)

*   src/music/Stories from Emona I.mp3

    *   Title: Stories from Emona I
    *   Artist: Maya Filipič
    *   [https://www.jamendo.com/track/196219/stories-from-emona-i](https://www.jamendo.com/track/196219/stories-from-emona-i)
