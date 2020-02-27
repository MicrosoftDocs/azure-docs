---
title: "Quickstart: Check spelling with the REST API and PowerShell - Bing Spell Check"
titleSuffix: Azure Cognitive Services
description: This quickstart shows how a simple PowerShell application sends a request to the Bing Spell Check API and returns a list of suggested corrections.
services: cognitive-services
author: denisbalan
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-spell-check
ms.topic: quickstart
ms.date: 20/02/2020
---
# Quickstart: Check spelling with the Bing Spell Check REST API and PowerShell

Use this quickstart to make your first call to the Bing Spell Check REST API. This simple PowerShell application sends a request to the API and returns a list of suggested corrections. While this application is written in PowerShell, the API is a RESTful Web service compatible with most programming languages.

## Prerequisites

* PowerShell (at least version 5.1)

[!INCLUDE [cognitive-services-bing-spell-check-signup-requirements](../../../../includes/cognitive-services-bing-spell-check-signup-requirements.md)]


## Get Spell Check results

1. Create a new PowerShell file (ex spell-check.ps1).
2. Add the code provided below.
3. Replace the `subscriptionKey` value with an access key valid for your subscription.
4. You can use the global endpoint below, or the [custom subdomain](../../../cognitive-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.
5. Run the program.
    
    ```powershell        
    $apihost = 'https://api.cognitive.microsoft.com';
    $path = '/bing/v7.0/spellcheck?';
    $params = 'mkt=en-us&mode=proof';
    
    $input = "Hollo, wrld!";
    
    $data = 'text={0}' -f @([System.Web.HTTPUtility]::UrlEncode($input));
    
    # NOTE: Replace this example key with a valid subscription key.
    $key = 'ENTER KEY HERE';
    
    # The following headers are optional, but it is recommended
    # that they are treated as required. These headers will assist the service
    # with returning more accurate results.
    #'X-Search-Location' => CLIENT_LOCATION
    #'X-MSEdge-ClientID' => CLIENT_ID
    #'X-MSEdge-ClientIP' => CLIENT_IP
    
    $url = $apihost + $path + $params;
    
    $headers = @{"Ocp-Apim-Subscription-Key" = $key};
    $json_result = invoke-restmethod `
        -Headers $headers `
        -Uri $url `
        -Method Post `
        -Body $data `
        -ContentType 'application/x-www-form-urlencoded'
    
    write-output $($json_result | convertto-json);
    ```


## Run the application

Run your application by starting terminal and invoking the file.
    ```powershell
        ./spell-check.ps1
    ```

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
> [Create a single page web-app](../tutorials/spellcheck.md)

- [What is the Bing Spell Check API?](../overview.md)
- [Bing Spell Check API v7 Reference](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-spell-check-api-v7-reference)
