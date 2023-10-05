---
title: "Quickstart: Check spelling with the REST API and PHP - Bing Spell Check"
titleSuffix: Azure AI services
description: This quickstart shows how a simple PHP application sends a request to the Bing Spell Check API and returns a list of suggested corrections.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-spell-check
ms.topic: quickstart
ms.date: 05/21/2020
ms.author: aahi
ms.devlang: php
ms.custom: mode-api
---
# Quickstart: Check spelling with the Bing Spell Check REST API and PHP

[!INCLUDE [Bing move notice](../../bing-web-search/includes/bing-move-notice.md)]

Use this quickstart to make your first call to the Bing Spell Check REST API. This simple PHP application sends a request to the API and returns a list of suggested corrections.

Although this application is written in PHP, the API is a RESTful Web service compatible with most programming languages.

## Prerequisites

* [PHP 5.6.x](https://php.net/downloads.php)

[!INCLUDE [cognitive-services-bing-spell-check-signup-requirements](../../../../includes/cognitive-services-bing-spell-check-signup-requirements.md)]


## Get Bing Spell Check REST API results

1. Create a new PHP project in your favorite IDE.
2. Add the code provided below.
3. Replace the `subscriptionKey` value with an access key valid for your subscription.
4. You can use the global endpoint in the following code, or use the [custom subdomain](../../../ai-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.
5. Run the program.

    ```php
    <?php

    // NOTE: Be sure to uncomment the following line in your php.ini file.
    // ;extension=php_openssl.dll

    // These properties are used for optional headers (see below).
    // define("CLIENT_ID", "<Client ID from Previous Response Goes Here>");
    // define("CLIENT_IP", "999.999.999.999");
    // define("CLIENT_LOCATION", "+90.0000000000000;long: 00.0000000000000;re:100.000000000000");

    $host = 'https://api.cognitive.microsoft.com';
    $path = '/bing/v7.0/spellcheck?';
    $params = 'mkt=en-us&mode=proof';

    $input = "Hollo, wrld!";

    $data = array (
      'text' => urlencode ($input)
    );

    // NOTE: Replace this example key with a valid subscription key.
    $key = 'ENTER KEY HERE';

    // The following headers are optional, but it is recommended
    // that they are treated as required. These headers will assist the service
    // with returning more accurate results.
    //'X-Search-Location' => CLIENT_LOCATION
    //'X-MSEdge-ClientID' => CLIENT_ID
    //'X-MSEdge-ClientIP' => CLIENT_IP

    $headers = "Content-type: application/x-www-form-urlencoded\r\n" .
      "Ocp-Apim-Subscription-Key: $key\r\n";

    // NOTE: Use the key 'http' even if you are making an HTTPS request. See:
    // https://php.net/manual/en/function.stream-context-create.php
    $options = array (
        'http' => array (
            'header' => $headers,
            'method' => 'POST',
            'content' => http_build_query ($data)
        )
    );
    $context  = stream_context_create ($options);
    $result = file_get_contents ($host . $path . $params, false, $context);

    if ($result === FALSE) {
        /* Handle error */
    }

    $json = json_encode(json_decode($result), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    echo $json;
    ?>
    ```


## Run the application

Run your application by starting a web server and navigating to your file.

## Example JSON response

A successful response is returned in JSON, as shown in the following example:

```json
{
   "_type": "SpellCheck",
   "flaggedTokens": [
      {
         "offset": 0,
         "token": "Hollo",
         "type": "UnknownToken",
         "suggestions": [
            {
               "suggestion": "Hello",
               "score": 0.9115257530801
            },
            {
               "suggestion": "Hollow",
               "score": 0.858039839213461
            },
            {
               "suggestion": "Hallo",
               "score": 0.597385084464481
            }
         ]
      },
      {
         "offset": 7,
         "token": "wrld",
         "type": "UnknownToken",
         "suggestions": [
            {
               "suggestion": "world",
               "score": 0.9115257530801
            }
         ]
      }
   ]
}
```
## Next steps

> [!div class="nextstepaction"]
> [Create a single-page web app](../tutorials/spellcheck.md)

- [What is the Bing Spell Check API?](../overview.md)
- [Bing Spell Check API v7 reference](/rest/api/cognitiveservices-bingsearch/bing-spell-check-api-v7-reference)
