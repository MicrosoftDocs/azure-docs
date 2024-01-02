---
author: rwallerms
manager: nitinme
ms.service: azure-ai-immersive-reader
ms.topic: include
ms.date: 03/04/2021
ms.author: rwaller
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* An Immersive Reader resource configured for Microsoft Entra authentication. Follow [these instructions](../../how-to-create-immersive-reader.md) to get set up.  You will need some of the values created here when configuring the environment properties. Save the output of your session into a text file for future reference.
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

<a name='acquire-an-azure-ad-authentication-token'></a>

## Acquire a Microsoft Entra authentication token

Next, write a backend API to retrieve a Microsoft Entra authentication token.

You need some values from the Microsoft Entra auth configuration prerequisite step above for this part. Refer back to the text file you saved of that session.

````text
TenantId     => Azure subscription TenantId
ClientId     => Azure AD ApplicationId
ClientSecret => Azure AD Application Service Principal password
Subdomain    => Immersive Reader resource subdomain (resource 'Name' if the resource was created in the Azure portal, or 'CustomSubDomain' option if the resource was created with Azure CLI PowerShell. Check the Azure portal for the subdomain on the Endpoint in the resource Overview page, for example, 'https://[SUBDOMAIN].cognitiveservices.azure.com/')
````

Once you have these values, create a new file called _.env_, and paste the following code into it, supplying your custom property values from above. Do not include quotation marks or the "{" and "}" characters.

```text
TENANT_ID={YOUR_TENANT_ID}
CLIENT_ID={YOUR_CLIENT_ID}
CLIENT_SECRET={YOUR_CLIENT_SECRET}
SUBDOMAIN={YOUR_SUBDOMAIN}
```

Be sure not to commit this file into source control, as it contains secrets that should not be made public.

Next, open _app.js_ and add the following to the top of the file. This loads the properties defined in the .env file as environment variables into Node.

```javascript
require('dotenv').config();
```

Open the _routes\index.js_ file and replace its content with the following code.

This code creates an API endpoint that acquires a Microsoft Entra authentication token using your service principal password. It also retrieves the subdomain. It then returns an object containing the token and subdomain.

```javascript
var request = require('request');
var express = require('express');
var router = express.Router();

router.get('/getimmersivereaderlaunchparams', function(req, res) {
    request.post ({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                url: `https://login.windows.net/${process.env.TENANT_ID}/oauth2/token`,
                form: {
                    grant_type: 'client_credentials',
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    resource: 'https://cognitiveservices.azure.com/'
                }
        },
        function(err, resp, tokenResponse) {
                if (err) {
                    return res.status(500).send('CogSvcs IssueToken error');
                }

                const token = JSON.parse(tokenResponse).access_token;
                const subdomain = process.env.SUBDOMAIN;
                return res.send({token: token, subdomain: subdomain});
        }
  );
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

```

The **getimmersivereaderlaunchparams** API endpoint should be secured behind some form of authentication (for example, [OAuth](https://oauth.net/2/)) to prevent unauthorized users from obtaining tokens to use against your Immersive Reader service and billing; that work is beyond the scope of this tutorial.

## Launch the Immersive Reader with sample content

1. Open _views\layout.pug_, and add the following code under the `head` tag, before the `body` tag. These `script` tags load the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) and jQuery.

    ```pug
    script(src='https://ircdname.azureedge.net/immersivereadersdk/immersive-reader-sdk.1.2.0.js')
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

            function getImmersiveReaderLaunchParamsAsync() {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                                url: '/getimmersivereaderlaunchparams',
                                type: 'GET',
                                success: data => {
                                        resolve(data);
                                },
                                error: err => {
                                        console.log('Error in getting token and subdomain!', err);
                                        reject(err);
                                }
                        });
                    });
            }

            async function launchImmersiveReader() {
                    const content = {
                            title: document.getElementById('title').innerText,
                            chunks: [{
                                    content: document.getElementById('content').innerText + '\n\n',
                                    lang: 'en'
                            }]
                    };

                    const launchParams = await getImmersiveReaderLaunchParamsAsync();
                    const token = launchParams.token;
                    const subdomain = launchParams.subdomain;

                    ImmersiveReader.launchAsync(token, subdomain, content);
            }
    ```

3. Our web app is now ready. Start the app by running:

    ```bash
    npm start
    ```

4. Open your browser and navigate to _http://localhost:3000_. You should see the above content on the page. Select the **Immersive Reader** button to launch the Immersive Reader with your content.

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

3. Navigate to _http://localhost:3000_ again. You should see the Spanish text on the page, and when you select **Immersive Reader**, it will show up in the Immersive Reader as well.

## Specify the language of the Immersive Reader interface

By default, the language of the Immersive Reader interface matches the browser's language settings. You can also specify the language of the Immersive Reader interface with the following code.

1. In _views\index.pug_, replace the call to `ImmersiveReader.launchAsync(token, subdomain, content)` with the code below.

    ```javascript
    const options = {
        uiLang: 'fr',
    }
    ImmersiveReader.launchAsync(token, subdomain, content, options);
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

* Explore the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) and the [Immersive Reader SDK Reference](../../reference.md)
* View code samples on [GitHub](https://github.com/microsoft/immersive-reader-sdk/tree/master/js/samples/advanced-csharp)
