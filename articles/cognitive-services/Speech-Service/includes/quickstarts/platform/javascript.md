---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 06/10/2022
ms.author: eur
---


The Speech SDK for JavaScript is available as an npm package. See <a href="https://www.npmjs.com/package/microsoft-cognitiveservices-speech-sdk" target="_blank">microsoft-cognitiveservices-speech-sdk </a> and its companion GitHub repository <a href="https://github.com/Microsoft/cognitive-services-speech-sdk-js" target="_blank">cognitive-services-speech-sdk-js</a>.

> [!TIP]
> The Speech SDK for JavaScript is available as an npm package, so both Node.js and client web browsers can consume it. But make sure to consider the various architectural implications of each environment. For example, the <a href="https://en.wikipedia.org/wiki/Document_Object_Model" target="_blank">document object model (DOM) </a> isn't available for server-side applications just as the <a href="https://nodejs.org/api/fs.html" target="_blank">file system </a> isn't available to client-side applications.


Additionally, depending on the target environment, use one of the following elements:

# [script](#tab/script)

Download and extract the <a href="https://aka.ms/csspeech/jsbrowserpackage" target="_blank">Speech SDK for JavaScript </a> *microsoft.cognitiveservices.speech.sdk.bundle.js* file. Place it in a folder that your HTML file can access.

```html
<script src="microsoft.cognitiveservices.speech.sdk.bundle.js"></script>;
```

> [!TIP]
> If you're targeting a web browser and using the `<script>` tag, the `sdk` prefix is not needed. The `sdk` prefix is an alias that's used to name the `require` module.

# [import](#tab/import)

```javascript
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
```

For more information on `import`, see <a href="https://javascript.info/import-export" target="_blank">Export and Import</a> on the JavaScript website.

# [require](#tab/require)

```javascript
const sdk = require("microsoft-cognitiveservices-speech-sdk");
```

For more information on `require`, see <a href="https://nodejs.org/en/knowledge/getting-started/what-is-require/" target="_blank">What is require?</a> on the Node.js website.

---

### Node.js Package Manager (NPM)

To install the Speech SDK for JavaScript, run the following `npm install` command:

```nodejs
npm install microsoft-cognitiveservices-speech-sdk
```

**Choose your target environment**

#### [Browser-based](#tab/browser)

[!INCLUDE [browser](javascript-browser.md)]



For more information, see the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/browser" target="_blank">Web browser Speech SDK quickstart</a>.


#### [Node.js](#tab/nodejs)

[!INCLUDE [node](javascript-node.md)]


For more information, see the <a href="https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/node" target="_blank">Node.js Speech SDK quickstart</a>.

* * *
