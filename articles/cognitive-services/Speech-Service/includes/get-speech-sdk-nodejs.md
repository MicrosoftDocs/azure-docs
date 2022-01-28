---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 03/27/2020
ms.author: eur
ms.custom: devx-track-js
---

The Speech SDK for JavaScript is available as an npm package. See <a href="https://www.npmjs.com/package/microsoft-cognitiveservices-speech-sdk" target="_blank">microsoft-cognitiveservices-speech-sdk </a> and its companion GitHub repository <a href="https://github.com/Microsoft/cognitive-services-speech-sdk-js" target="_blank">cognitive-services-speech-sdk-js</a>.

> [!TIP]
> The Speech SDK for JavaScript is available as an npm package, so both Node.js and client web browsers can consume it. But make sure to consider the various architectural implications of each environment. For example, the <a href="https://en.wikipedia.org/wiki/Document_Object_Model" target="_blank">document object model (DOM) </a> isn't available for server-side applications just as the <a href="https://nodejs.org/api/fs.html" target="_blank">file system </a> isn't available to client-side applications.

### Node.js Package Manager (NPM)

To install the Speech SDK for JavaScript, run the following `npm install` command:

```nodejs
npm install microsoft-cognitiveservices-speech-sdk
```

For more information, see the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/node" target="_blank">Node.js Speech SDK quickstart</a>.
