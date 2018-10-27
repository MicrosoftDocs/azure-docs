---
title: "Quickstart: Bing Spell Check API, PHP"
titlesuffix: Azure Cognitive Services
description: Get information and code samples to help you quickly get started using the Bing Spell Check API.
services: cognitive-services
author: v-jaswel
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-spell-check
ms.topic: quickstart
ms.date: 09/14/2017
ms.author: v-jaswel
---
# Quickstart for Bing Spell Check API with PHP 

This article shows you how to use the [Bing Spell Check API](https://azure.microsoft.com/services/cognitive-services/spell-check/) with PHP. The Spell Check API returns a list of words it does not recognize along with suggested replacements. Typically, you would submit text to this API and then either make the suggested replacements in the text or show them to the user of your application so they can decide whether to make the replacements. This article shows how to send a request that contains the text "Hollo, wrld!" The suggested replacements are "Hello" and "world."

## Prerequisites

You will need [PHP 5.6.x](http://php.net/downloads.php) to run this code.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Bing Spell Check API v7**. The [free trial](https://azure.microsoft.com/try/cognitive-services/#lang) is sufficient for this quickstart. You need the access key provided when you activate your free trial, or you may use a paid subscription key from your Azure dashboard.

## Get Spell Check results

1. Create a new PHP project in your favorite IDE.
2. Add the code provided below.
3. Replace the `subscriptionKey` value with an access key valid for your subscription.
4. Run the program.

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
// http://php.net/manual/en/function.stream-context-create.php
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

**Response**

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
> [Bing Spell Check tutorial](../tutorials/spellcheck.md)

## See also

- [Bing Spell Check overview](../proof-text.md)
- [Bing Spell Check API v7 Reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-spell-check-api-v7-reference)
