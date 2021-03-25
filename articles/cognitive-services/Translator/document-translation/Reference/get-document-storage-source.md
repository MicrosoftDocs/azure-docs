---
title: Document Translation get document storage source method
titleSuffix: Azure Cognitive Services
description: The get document storage source method returns a list of supported storage sources.
services: cognitive-services
author: jann-skotdal
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 03/03/2021
ms.author: v-jansk
---

# Document Translation: get document storage source

The Get Document Storage Source method returns a list of storage sources/options supported by the Document Translation service.

## Request URL

Send a `GET` request to:
```HTTP
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/storagesources
```

Learn how to find your [custom domain name](https://docs.microsoft.com/azure/cognitive-services/translator/document-translation/get-started-with-document-translation#find-your-custom-domain-name).

> [!IMPORTANT]
>
> * **All API requests to the Document Translation service require a custom domain endpoint**.
> * You can't use the endpoint found on your Azure portal resource _Keys and Endpoint_ page nor the global translator endpoint—`api.cognitive.microsofttranslator.com`—to make HTTP requests to Document Translation.

## Request headers

Request headers are:

|Headers|Description|
|--- |--- |
|Ocp-Apim-Subscription-Key|Required request header|

## Response status codes

The following are the possible HTTP status codes that a request returns.

|Status Code|Description|
|--- |--- |
|200|OK. Successful request and returns the list of storage sources.|
|500|Internal Server Error.|
|Other Status Codes|<ul><li>Too many requests</li><li>Server temporary unavailable</li></ul>|

## Get Document Storage Source Response

### Successful Get Document Storage Source Response
Base type for list return in the Get Document Storage Source API.

|Name|Type|Description|
|--- |--- |--- |
|value|string []|List of objects.|


### Error Response

|Name|Type|Description|
|--- |--- |--- |
|code|string|Enums containing high-level error codes. Possible values:<br/><ul><li>InternalServerError</li><li>InvalidArgument</li><li>InvalidRequest</li><li>RequestRateTooHigh</li><li>ResourceNotFound</li><li>ServiceUnavailable</li><li>Unauthorized</li></ul>|
|message|string|Gets high-level error message.|
|innerError|InnerErrorV2|New Inner Error format, which conforms to Cognitive Services API Guidelines. It contains required properties ErrorCode, message and optional properties target, details(key value pair), inner error (this can be nested).|
|innerError.code|string|Gets code error string.|
|innerError.message|string|Gets high-level error message.|

## Examples

### Example Successful Response

The following is an example of a successful response.

```JSON
{
  "value": [
    "AzureBlob"
  ]
}
```

### Example Error Response
The following is an example of an error response. The schema for other error codes is the same.

Status code: 500

```JSON
{
  "error": {
    "code": "InternalServerError",
    "message": "Internal Server Error",
    "innerError": {
      "code": "InternalServerError",
      "message": "Unexpected internal server error has occurred"
    }
  }
}
```

## Next steps

Follow our quickstart to learn more about using Document Translation and the client library.

> [!div class="nextstepaction"]
> [Get started with Document Translation](document-translation/get-started-with-document-translation.md)