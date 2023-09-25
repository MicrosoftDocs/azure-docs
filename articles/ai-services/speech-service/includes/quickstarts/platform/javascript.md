---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 09/05/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/javascript.md)]

This guide shows how to install the [Speech SDK](~/articles/ai-services/speech-service/speech-sdk.md) for JavaScript.

The Speech SDK for JavaScript is available as an npm package. See [microsoft-cognitiveservices-speech-sdk](https://www.npmjs.com/package/microsoft-cognitiveservices-speech-sdk) and its companion GitHub repository [cognitive-services-speech-sdk-js](https://github.com/Microsoft/cognitive-services-speech-sdk-js).

## Platform requirements

Understand the architectural implications between Node.js and client web browsers. For example, the [document object model (DOM)](https://en.wikipedia.org/wiki/Document_Object_Model) isn't available for server-side applications. The [Node.js file system](https://nodejs.org/api/fs.html) isn't available to client-side applications.

## Install the Speech SDK for JavaScript

Depending on the target environment, use one of the following guides:

#### [Node.js](#tab/nodejs)

This guide shows how to install the [Speech SDK](~/articles/ai-services/speech-service/speech-sdk.md) for JavaScript for use with Node.js.

1. Install [Node.js](https://nodejs.org/).
1. Create a new directory, run `npm init`, and walk through the prompts.
1. To install the Speech SDK for JavaScript, run the following `npm install` command:

    ```console
    npm install microsoft-cognitiveservices-speech-sdk
    ```

For more information, see the [Node.js samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/node).

#### [Browser-based](#tab/browser)

This guide shows how to install the [Speech SDK](~/articles/ai-services/speech-service/speech-sdk.md) for JavaScript for use with a webpage.

### Unpack to a folder

1. Create a new, empty folder. If you want to host the sample on a web server, make sure that the web server can access the folder.

1. Download the Speech SDK as a [.zip package](https://aka.ms/csspeech/jsbrowserpackage) and unpack it into the newly created folder. These files are unpacked:

   - *microsoft.cognitiveservices.speech.sdk.bundle.js*: A human-readable version of the Speech SDK.
   - *microsoft.cognitiveservices.speech.sdk.bundle.js.map*: A map file that's used for debugging SDK code.
   - *microsoft.cognitiveservices.speech.sdk.bundle.d.ts*: Object definitions for use with TypeScript.
   - *microsoft.cognitiveservices.speech.sdk.bundle-min.js*: A minified version of the Speech SDK.
   - *speech-processor.js*: Code to improve performance on some browsers.

1. Create a new file named *index.html* in the folder, and open this file with a text editor.

### HTML script tag

Download and extract the *microsoft.cognitiveservices.speech.sdk.bundle.js* file from the [Speech SDK for JavaScript](https://aka.ms/csspeech/jsbrowserpackage). Place it in a folder that your HTML file can access.

```html
<script src="microsoft.cognitiveservices.speech.sdk.bundle.js"></script>;
```

> [!TIP]
> If you're targeting a web browser and using the `<script>` tag, the `sdk` prefix is not needed. The `sdk` prefix is an alias that's used to name the `require` module.

Alternatively, you could directly include a `<script>` tag in the HTML `<head>` element, relying on the [JSDelivr NPM syndicate](https://www.jsdelivr.com/package/npm/microsoft-cognitiveservices-speech-sdk).

```html
<script src="https://cdn.jsdelivr.net/npm/microsoft-cognitiveservices-speech-sdk@latest/distrib/browser/microsoft.cognitiveservices.speech.sdk.bundle-min.js">
</script>
```

For more information, see the [browser-based samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/javascript/browser).

---

## Use the Speech SDK

- Add the following import statement to use the Speech SDK in your JavaScript project:

  ```javascript
  import * as sdk from "microsoft-cognitiveservices-speech-sdk";
  ```

For more information on `import`, see [Export and Import](https://javascript.info/import-export) on the JavaScript website.

Alternatively, you could use a require statement:

```javascript
const sdk = require("microsoft-cognitiveservices-speech-sdk");
```
