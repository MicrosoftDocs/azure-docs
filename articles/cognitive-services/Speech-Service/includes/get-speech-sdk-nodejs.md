---
author: trevorbye
ms.service: cognitive-services
ms.topic: include
ms.date: 03/27/2020
ms.author: trbye
---

:::row:::
    :::column span="3":::
        The JavaScript Speech SDK is available as an npm package, see <a href="https://www.npmjs.com/package/microsoft-cognitiveservices-speech-sdk" target="_blank">microsoft-cognitiveservices-speech-sdk <span class="docon docon-navigate-external x-hidden-focus"></span></a> and it's companion GitHub repository <a href="https://github.com/Microsoft/cognitive-services-speech-sdk-js" target="_blank">cognitive-services-speech-sdk-js <span class="docon docon-navigate-external x-hidden-focus"></span></a>.
    :::column-end:::
    :::column:::
        <br>
        <div class="icon is-large">
            <img alt="Node.js" src="https://docs.microsoft.com/media/logos/logo_nodejs.svg" width="60px">
        </div>
    :::column-end:::
:::row-end:::

> [!TIP]
> Although the JavaScript Speech SDK is available as an npm package, thus both Node.js and client web browsers can consume it - consider the various architectural implications of each environment. For example, the <a href="https://en.wikipedia.org/wiki/Document_Object_Model" target="_blank">document object model (DOM) <span class="docon docon-navigate-external x-hidden-focus"></span></a> is not available for server-side applications just as the <a href="https://nodejs.org/api/fs.html" target="_blank">file system <span class="docon docon-navigate-external x-hidden-focus"></span></a> is not available to client-side applications.

### Node.js Package Manager (NPM)

To install the JavaScript Speech SDK, run the following `npm install` command below.

```nodejs
npm install microsoft-cognitiveservices-speech-sdk
```

For more information, see the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/node" target="_blank">Node.js Speech SDK quickstart <span class="docon docon-navigate-external x-hidden-focus"></span></a>.
