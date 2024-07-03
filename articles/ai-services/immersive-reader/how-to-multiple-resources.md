---
title: Integrate multiple Immersive Reader resources
titleSuffix: Azure AI services
description: Learn how to create a Node.js application using multiple Immersive Reader resources.
author: sharmas
manager: nitinme

ms.service: azure-ai-immersive-reader
ms.topic: how-to
ms.date: 02/27/2024
ms.author: sharmas
ms.custom: devx-track-js
#Customer intent: As a developer, I want to learn more about the Immersive Reader SDK so that I can fully utilize all that the SDK has to offer.
---

# Integrate multiple Immersive Reader resources

In the [overview](overview.md), you learned about the Immersive Reader and how it implements proven techniques to improve reading comprehension for language learners, emerging readers, and students with learning differences. In the [quickstart](quickstarts/client-libraries.md), you learned how to use Immersive Reader with a single resource. This tutorial covers how to integrate multiple Immersive Reader resources in the same application.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create multiple Immersive Reader resource under an existing resource group.
> * Launch the Immersive Reader using multiple resources.

## Prerequisites

* An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/ai-services).
* A single Immersive Reader resource configured for Microsoft Entra authentication. Follow [these instructions](how-to-create-immersive-reader.md) to get set up.
* A [NodeJS web app](quickstarts/client-libraries.md?pivots=programming-language-nodejs) that launches Immersive Reader.

## Create multiple resources

Follow [these instructions](how-to-create-immersive-reader.md) again to create each Immersive Reader resource. The `Create-ImmersiveReaderResource` script has `ResourceName`, `ResourceSubdomain`, and `ResourceLocation` as parameters. These parameters should be unique for each resource being created. The remaining parameters should be the same as what you used when setting up your first Immersive Reader resource. This way, each resource can be linked to the same Azure resource group and Microsoft Entra application.

The following example shows how to create two resources, one in **WestUS** and another in **EastUS**. Each resource has unique values for `ResourceName`, `ResourceSubdomain`, and `ResourceLocation`.

```azurepowershell-interactive
Create-ImmersiveReaderResource
  -SubscriptionName <SUBSCRIPTION_NAME>
  -ResourceName Resource_name_westus
  -ResourceSubdomain resource-subdomain-westus
  -ResourceSKU <RESOURCE_SKU>
  -ResourceLocation westus
  -ResourceGroupName <RESOURCE_GROUP_NAME>
  -ResourceGroupLocation <RESOURCE_GROUP_LOCATION>
  -AADAppDisplayName <MICROSOFT_ENTRA_DISPLAY_NAME>
  -AADAppIdentifierUri <MICROSOFT_ENTRA_IDENTIFIER_URI>
  -AADAppClientSecret <MICROSOFT_ENTRA_CLIENT_SECRET>

Create-ImmersiveReaderResource
  -SubscriptionName <SUBSCRIPTION_NAME>
  -ResourceName Resource_name_eastus
  -ResourceSubdomain resource-subdomain-eastus
  -ResourceSKU <RESOURCE_SKU>
  -ResourceLocation eastus
  -ResourceGroupName <RESOURCE_GROUP_NAME>
  -ResourceGroupLocation <RESOURCE_GROUP_LOCATION>
  -AADAppDisplayName <MICROSOFT_ENTRA_DISPLAY_NAME>
  -AADAppIdentifierUri <MICROSOFT_ENTRA_IDENTIFIER_URI>
  -AADAppClientSecret <MICROSOFT_ENTRA_CLIENT_SECRET>
```

## Add resources to environment configuration

In the quickstart, you created an environment configuration file that contains the `TenantId`, `ClientId`, `ClientSecret`, and `Subdomain` parameters. Since all of your resources use the same Microsoft Entra application, you can use the same values for the `TenantId`, `ClientId`, and `ClientSecret`. The only change that needs to be made is to list each subdomain for each resource.

Your new *.env* file should now look something like:

```text
TENANT_ID={YOUR_TENANT_ID}
CLIENT_ID={YOUR_CLIENT_ID}
CLIENT_SECRET={YOUR_CLIENT_SECRET}
SUBDOMAIN_WUS={YOUR_WESTUS_SUBDOMAIN}
SUBDOMAIN_EUS={YOUR_EASTUS_SUBDOMAIN}
```

> [!NOTE]
> Be sure not to commit this file into source control because it contains secrets that shouldn't be made public.

Next, modify the *routes\index.js* file that you created to support your multiple resources. Replace its content with the following code.

As before, this code creates an API endpoint that acquires a Microsoft Entra authentication token using your service principal password. This time, it allows the user to specify a resource location and pass it in as a query parameter. It then returns an object containing the token and the corresponding subdomain.

```javascript
var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/GetTokenAndSubdomain', function(req, res) {
    try {
        request.post({
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
        function(err, resp, tokenResult) {
            if (err) {
                console.log(err);
                return res.status(500).send('CogSvcs IssueToken error');
            }

            var tokenResultParsed = JSON.parse(tokenResult);

            if (tokenResultParsed.error) {
                console.log(tokenResult);
                return res.send({error :  "Unable to acquire Azure AD token. Check the debugger for more information."})
            }

            var token = tokenResultParsed.access_token;

            var subdomain = "";
            var region = req.query && req.query.region;
            switch (region) {
                case "eus":
                    subdomain = process.env.SUBDOMAIN_EUS
                    break;
                case "wus":
                default:
                    subdomain = process.env.SUBDOMAIN_WUS
            }

            return res.send({token, subdomain});
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send('CogSvcs IssueToken error');
    }
});

module.exports = router;
```

The `getimmersivereaderlaunchparams` API endpoint should be secured behind some form of authentication (for example, [OAuth](https://oauth.net/2/)) to prevent unauthorized users from obtaining tokens to use against your Immersive Reader service and billing; that work is beyond the scope of this tutorial.

## Add sample content

Open *views\index.pug*, and replace its content with the following code. This code populates the page with some sample content, and adds two buttons that launch the Immersive Reader. One that launches Immersive Reader for the **EastUS** resource, and another for the **WestUS** resource.

```pug
doctype html
html
    head
        title Immersive Reader Quickstart Node.js

        link(rel='stylesheet', href='https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css')

        // A polyfill for Promise is needed for IE11 support.
        script(src='https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js')

        script(src='https://ircdname.azureedge.net/immersivereadersdk/immersive-reader-sdk.1.2.0.js')
        script(src='https://code.jquery.com/jquery-3.3.1.min.js')

        style(type="text/css").
            .immersive-reader-button {
            background-color: white;
            margin-top: 5px;
            border: 1px solid black;
            float: right;
            }
    body
        div(class="container")
            button(class="immersive-reader-button" data-button-style="icon" data-locale="en" onclick='handleLaunchImmersiveReader("wus")') WestUS Immersive Reader
            button(class="immersive-reader-button" data-button-style="icon" data-locale="en" onclick='handleLaunchImmersiveReader("eus")') EastUS Immersive Reader

            h1(id="ir-title") About Immersive Reader
            div(id="ir-content" lang="en-us")
            p Immersive Reader is a tool that implements proven techniques to improve reading comprehension for emerging readers, language learners, and people with learning differences. The Immersive Reader is designed to make reading more accessible for everyone. The Immersive Reader

                ul
                    li Shows content in a minimal reading view
                    li Displays pictures of commonly used words
                    li Highlights nouns, verbs, adjectives, and adverbs
                    li Reads your content out loud to you
                    li Translates your content into another language
                    li Breaks down words into syllables

            h3 The Immersive Reader is available in many languages.

            p(lang="es-es") El Lector inmersivo está disponible en varios idiomas.
            p(lang="zh-cn") 沉浸式阅读器支持许多语言
            p(lang="de-de") Der plastische Reader ist in vielen Sprachen verfügbar.
            p(lang="ar-eg" dir="rtl" style="text-align:right") يتوفر \"القارئ الشامل\" في العديد من اللغات.

script(type="text/javascript").
function getTokenAndSubdomainAsync(region) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "/GetTokenAndSubdomain",
                type: "GET",
                data: {
                    region: region
                },
                success: function (data) {
                    if (data.error) {
                        reject(data.error);
                    } else {
                        resolve(data);
                    }
                },
                error: function (err) {
                    reject(err);
                }
            });
        });
    }

    function handleLaunchImmersiveReader(region) {
        getTokenAndSubdomainAsync(region)
            .then(function (response) {
                const token = response["token"];
                const subdomain = response["subdomain"];
                // Learn more about chunk usage and supported MIME types https://learn.microsoft.com/azure/ai-services/immersive-reader/reference#chunk
                const data = {
                    title: $("#ir-title").text(),
                    chunks: [{
                        content: $("#ir-content").html(),
                        mimeType: "text/html"
                    }]
                };
                // Learn more about options https://learn.microsoft.com/azure/ai-services/immersive-reader/reference#options
                const options = {
                    "onExit": exitCallback,
                    "uiZIndex": 2000
                };
                ImmersiveReader.launchAsync(token, subdomain, data, options)
                    .catch(function (error) {
                        alert("Error in launching the Immersive Reader. Check the console.");
                        console.log(error);
                    });
            })
            .catch(function (error) {
                alert("Error in getting the Immersive Reader token and subdomain. Check the console.");
                console.log(error);
            });
    }

    function exitCallback() {
        console.log("This is the callback function. It is executed when the Immersive Reader closes.");
    }
```

Your web app is now ready. Start the app by running:

```bash
npm start
```

Open your browser and navigate to `http://localhost:3000`. You should see the above content on the page. Select either the **EastUS Immersive Reader** button or the **WestUS Immersive Reader** button to launch the Immersive Reader using those respective resources.

## Next step

> [!div class="nextstepaction"]
> [Explore the Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk)
