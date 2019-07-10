---
title: "Tutorial: Launch the Immersive Reader using Node.js"
titleSuffix: Azure Cognitive Services
description: In this tutorial, you'll create a Node.js application that launches the Immersive Reader.
services: cognitive-services
author: metanMSFT
manager: nitinme

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: tutorial
ms.date: 06/20/2019
ms.author: metan
#Customer intent: As a developer, I want to learn more about the Immersive Reader SDK so that I can fully utilize all that the SDK has to offer.
---

# Tutorial: Launch the Immersive Reader (Node.js)

In the [overview](./overview.md), you learned about what the Immersive Reader is and how it implements proven techniques to improve reading comprehension for language learners, emerging readers, and students with learning differences. This tutorial covers how to create a Node.js web application that launches the Immersive Reader. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Node.js web app with Express
> * Acquire an access token
> * Launch the Immersive Reader with sample content
> * Specify the language of your content
> * Specify the language of the Immersive Reader interface
> * Launch the Immersive Reader with math content

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* A subscription key for Immersive Reader. Get one by following [these instructions](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account).
* [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com)
* An IDE such as [Visual Studio Code](https://code.visualstudio.com/)

## Create a Node.js web app with Express

Create a Node.js web app with the `express-generator` tool.

```bash
npm install express-generator -g
express --view=pug myapp
cd myapp
```

Install yarn dependencies, and add dependencies `request` and `dotenv`, which will be used later in the tutorial.

```bash
yarn
yarn add request
yarn add dotenv
```

## Acquire an access token

Next, write a backend API to retrieve an access token using your subscription key. You need your subscription key and endpoint for this next step. You can find your subscription key in the Keys page of your Immersive Reader resource in the Azure portal. You can find your endpoint in the Overview page.

Once you have your subscription key and endpoint, create a new file called _.env_, and paste the following code into it, replacing `{YOUR_SUBSCRIPTION_KEY}` and `{YOUR_ENDPOINT}` with your subscription key and endpoint, respectively.

```text
SUBSCRIPTION_KEY={YOUR_SUBSCRIPTION_KEY}
ENDPOINT={YOUR_ENDPOINT}
```

Be sure not to commit this file into source control, as it contains secrets that should not be made public.

Next, open _app.js_ and add the following to the top of the file. This loads the subscription key and endpoint as environment variables into Node.

```javascript
require('dotenv').config();
```

Open the _routes\index.js_ file and the following import at the top of the file:

```javascript
var request = require('request');
```

Next, add the following code directly below that line. This code creates an API endpoint that acquires an access token using your subscription key, and then returns that token.

```javascript
router.get('/token', function(req, res, next) {
  request.post({
    headers: {
        'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY,
        'content-type': 'application/x-www-form-urlencoded'
    },
    url: process.env.ENDPOINT
  },
  function(err, resp, token) {
    return res.send(token);
  });
});
```

This API endpoint should be secured behind some form of authentication (for example, [OAuth](https://oauth.net/2/)); that work is beyond the scope of this tutorial.

## Launch the Immersive Reader with sample content

1. Open _views\layout.pug_, and add the following code under the `head` tag, before the `body` tag. These `script` tags load the [Immersive Reader SDK](https://github.com/Microsoft/immersive-reader-sdk) and jQuery.

    ```pug
    script(src='https://contentstorage.onenote.office.net/onenoteltir/immersivereadersdk/immersive-reader-sdk.0.0.1.js')
    script(src='https://code.jquery.com/jquery-3.3.1.min.js')
    ```

2. Open _views\index.pug_, and replace its content with the following code. This code populates the page with some sample content, and adds a button that launches the Immersive Reader.

    ```pug
    extends layout

    block content
      h2(id='title') Geography
      p(id='content') The study of Earth's landforms is called physical geography. Landforms can be mountains and valleys. They can also be glaciers, lakes or rivers.
      div(class='immersive-reader-button' data-button-style='iconAndText' data-locale='en-US' onclick='launchImmersiveReader()')
      script.
        function launchImmersiveReader() {
          // First, get a token using our /token endpoint
          $.ajax('/token', { success: token => {
            // Second, grab the content from the page
            const content = {
              title: document.getElementById('title').innerText,
              chunks: [ {
                content: document.getElementById('content').innerText + '\n\n',
                lang: 'en'
              } ]
            };

            // Third, launch the Immersive Reader
            ImmersiveReader.launchAsync(token, content);
          }});
        }
    ```

3. Our web app is now ready. Start the app by running:

    ```bash
    npm start
    ```

4. Open your browser and navigate to _http://localhost:3000_. You should see the above content on the page. Click the **Immersive Reader** button to launch the Immersive Reader with your content.

## Specify the language of your content

The Immersive Reader has support for many different languages. You can specify the language of your content by following the steps below.

1. Open _views\index.pug_ and add the following code below the `p(id=content)` tag that you added in the previous step. This code adds some content Spanish content to your page.

    ```pug
    p(id='content-spanish') El estudio de las formas terrestres de la Tierra se llama geografía física. Los accidentes geográficos pueden ser montañas y valles. También pueden ser glaciares, lagos o ríos.
    ```

2. In the JavaScript code, add the following above the call to `ImmersiveReader.launchAsync`. This code passes the Spanish content into the Immersive Reader.

    ```pug
    content.chunks.push({
      content: document.getElementById('content-spanish').innerText + '\n\n',
      lang: 'es'
    });
    ```

3. Navigate to _http://localhost:3000_ again. You should see the Spanish text on the page, and when you click on **Immersive Reader**, it will show up in the Immersive Reader as well.

## Specify the language of the Immersive Reader interface

By default, the language of the Immersive Reader interface matches the browser's language settings. You can also specify the language of the Immersive Reader interface with the following code.

1. In _views\index.pug_, replace the call to `ImmersiveReader.launchAsync(token, content)` with the code below.

    ```javascript
    const options = {
        uiLang: 'fr',
    }
    ImmersiveReader.launchAsync(token, content, options);
    ```

2. Navigate to _http://localhost:3000_. When you launch the Immersive Reader, the interface will be shown in French.

## Launch the Immersive Reader with math content

You can include math content in the Immersive Reader by using [MathML](https://developer.mozilla.org/en-US/docs/Web/MathML).

1. Modify _views\index.pug_ to include the following code above the call to `ImmersiveReader.launchAsync`:

    ```javascript
    const mathML = '<math xmlns="https://www.w3.org/1998/Math/MathML" display="block"> \
      <munderover> \
        <mo>∫</mo> \
        <mn>0</mn> \
        <mn>1</mn> \
      </munderover> \
      <mrow> \
        <msup> \
          <mi>x</mi> \
          <mn>2</mn> \
        </msup> \
        <mo>ⅆ</mo> \
        <mi>x</mi> \
      </mrow> \
    </math>';

    content.chunks.push({
      content: mathML,
      mimeType: 'application/mathml+xml'
    });
    ```

2. Navigate to _http://localhost:3000_. When you launch the Immersive Reader and scroll to the bottom, you'll see the math formula.

## Next steps

* Explore the [Immersive Reader SDK](https://github.com/Microsoft/immersive-reader-sdk) and the [Immersive Reader SDK Reference](./reference.md)
* View code samples on [GitHub](https://github.com/microsoft/immersive-reader-sdk/samples/advanced-csharp)