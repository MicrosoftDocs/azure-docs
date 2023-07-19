---
title: Get supported storage sources method
titleSuffix: Azure AI services
description: The get supported storage sources method returns a list of supported storage sources.
services: cognitive-services
manager: nitinme
ms.author: lajanuar
author: laujan
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 07/18/2023
---

# Get supported storage sources

Reference</br>
Service: **Azure AI Document Translation**</br>
API Version: **v1.1**</br>

The Get supported storage sources method returns a list of storage sources/options supported by the Document Translation service.

## Request URL

Send a `GET` request to:
```HTTP
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.1/storagesources
```

Learn how to find your [custom domain name](../quickstarts/document-translation-rest-api.md).

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

## Get supported storage sources response

### Successful get supported storage sources response

Base type for list return in the Get supported storage sources API.

|Name|Type|Description|
|--- |--- |--- |
|value|string []|List of objects.|

### Error response

|Name|Type|Description|
|--- |--- |--- |
|code|string|Enums containing high-level error codes. Possible values:<br/><ul><li>InternalServerError</li><li>InvalidArgument</li><li>InvalidRequest</li><li>RequestRateTooHigh</li><li>ResourceNotFound</li><li>ServiceUnavailable</li><li>Unauthorized</li></ul>|
|message|string|Gets high-level error message.|
|innerError|InnerTranslationError|New Inner Error format that conforms to Azure AI services API Guidelines. This error message contains required properties ErrorCode, message and optional properties target, details(key value pair), inner error (it can be nested).|
|innerError.code|string|Gets code error string.|
|innerError.message|string|Gets high-level error message.|
|innerError.target|string|Gets the source of the error. For example, it would be `documents` or `document id` if there was invalid document.|

## Examples

### Example successful response

The  following JSON object is an example of a successful response.

```JSON
{
  "value": [
    "AzureBlob"
  ]
}
```

### Example error response
The following JSON object is an example of an error response. The schema for other error codes is the same.

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
> [Get started with Document Translation](../quickstarts/document-translation-rest-api.md)
