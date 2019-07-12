---
title: "Quickstart: Get list of supported languages, Node.js - Translator Text API"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you get a list of languages supported for translation, transliteration, and dictionary lookup and examples using the Translator Text API with Node.js.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: quickstart
ms.date: 06/04/2019
ms.author: swmachan
---

# Quickstart: Use the Translator Text API to get a list of supported languages with Node.js

In this quickstart, you'll learn how to make a GET request that returns a list of supported languages using Node.js and the Translator Text REST API.

>[!TIP]
> If you'd like to see all the code at once, the source code for this sample is available on [GitHub](https://github.com/MicrosoftTranslator/Text-Translation-API-V3-NodeJS).

## Prerequisites

This quickstart requires:

* [Node 8.12.x or later](https://nodejs.org/en/)

## Create a project and import required modules

Create a new project using your favorite IDE or editor. Then copy this code snippet into your project in a file named `get-languages.js`.

```javascript
const request = require('request');
const uuidv4 = require('uuid/v4');
```

> [!NOTE]
> If you haven't used these modules you'll need to install them before running your program. To install these packages, run: `npm install request uuidv4`.

These modules are required to construct the HTTP request, and create a unique identifier for the `'X-ClientTraceId'` header.

## Configure the request

The `request()` method, made available through the request module, allows us to pass the HTTP method, URL, request params, headers, and the JSON body as an `options` object. In this code snippet, we'll configure the request:

>[!NOTE]
> For more information about endpoints, routes, and request parameters, see [Translator Text API 3.0: Languages](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-languages).

```javascript
let options = {
    method: 'GET',
    baseUrl: 'https://api.cognitive.microsofttranslator.com/',
    url: 'languages',
    qs: {
      'api-version': '3.0',
    },
    headers: {
      'Content-type': 'application/json',
      'X-ClientTraceId': uuidv4().toString()
    },
    json: true,
};
```

If you are using a Cognitive Services multi-service subscription, you must also include the `Ocp-Apim-Subscription-Region` in your request parameters. [Learn more about authenticating with the multi-service subscription](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference#authentication).

## Make the request and print the response

Next, we'll create the request using the `request()` method. It takes the `options` object that we created in the previous section as the first argument, then prints the prettified JSON response.

```javascript
request(options, function(err, res, body){
    console.log(JSON.stringify(body, null, 4));
});
```

>[!NOTE]
> In this sample, we're defining the HTTP request in the `options` object. However, the request module also supports convenience methods, like `.post` and `.get`. For more information, see [convenience methods](https://github.com/request/request#convenience-methods).

## Put it all together

That's it, you've put together a simple program that will call the Translator Text API and return a JSON response. Now it's time to run your program:

```console
node get-languages.js
```

If you'd like to compare your code against ours, the complete sample is available on [GitHub](https://github.com/MicrosoftTranslator/Text-Translation-API-V3-NodeJS).

## Sample response

Find the country/region abbreviation in this [list of languages](https://docs.microsoft.com/azure/cognitive-services/translator/language-support).

This sample has been truncated to show a snippet of the result:

```json
{
    "translation": {
        "af": {
            "name": "Afrikaans",
            "nativeName": "Afrikaans",
            "dir": "ltr"
        },
        "ar": {
            "name": "Arabic",
            "nativeName": "العربية",
            "dir": "rtl"
        },
        ...
    },
    "transliteration": {
        "ar": {
            "name": "Arabic",
            "nativeName": "العربية",
            "scripts": [
                {
                    "code": "Arab",
                    "name": "Arabic",
                    "nativeName": "العربية",
                    "dir": "rtl",
                    "toScripts": [
                        {
                            "code": "Latn",
                            "name": "Latin",
                            "nativeName": "اللاتينية",
                            "dir": "ltr"
                        }
                    ]
                },
                {
                    "code": "Latn",
                    "name": "Latin",
                    "nativeName": "اللاتينية",
                    "dir": "ltr",
                    "toScripts": [
                        {
                            "code": "Arab",
                            "name": "Arabic",
                            "nativeName": "العربية",
                            "dir": "rtl"
                        }
                    ]
                }
            ]
        },
      ...
    },
    "dictionary": {
        "af": {
            "name": "Afrikaans",
            "nativeName": "Afrikaans",
            "dir": "ltr",
            "translations": [
                {
                    "name": "English",
                    "nativeName": "English",
                    "dir": "ltr",
                    "code": "en"
                }
            ]
        },
        "ar": {
            "name": "Arabic",
            "nativeName": "العربية",
            "dir": "rtl",
            "translations": [
                {
                    "name": "English",
                    "nativeName": "English",
                    "dir": "ltr",
                    "code": "en"
                }
            ]
        },
      ...
    }
}
```

## Clean up resources

If you've hardcoded your subscription key into your program, make sure to remove the subscription key when you're finished with this quickstart.

## Next steps

Take a look at the API reference to understand everything you can do with the Translator Text API.

> [!div class="nextstepaction"]
> [API reference](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference)

## See also

In addition to language detection, learn how to use the Translator Text API to:

* [Translate text](quickstart-nodejs-translate.md)
* [Transliterate text](quickstart-nodejs-transliterate.md)
* [Identify the language by input](quickstart-nodejs-detect.md)
* [Get alternate translations](quickstart-nodejs-dictionary.md)
* [Determine sentence lengths from an input](quickstart-nodejs-sentences.md)
