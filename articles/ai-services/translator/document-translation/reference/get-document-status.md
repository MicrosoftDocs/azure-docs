---
title: Get document status method
titleSuffix: Azure AI services
description: The get document status method returns the status for a specific document.
services: cognitive-services
manager: nitinme
ms.author: lajanuar
author: laujan
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 07/18/2023
---

# Get document status

Reference</br>
Service: **Azure AI Document Translation**</br>
API Version: **v1.1**</br>

The Get Document Status method returns the status for a specific document. The method returns the translation status for a specific document based on the request ID and document ID.

## Request URL

Send a `GET` request to:
```HTTP
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.1/batches/{id}/documents/{documentId}
```

Learn how to find your [custom domain name](../quickstarts/document-translation-rest-api.md).

> [!IMPORTANT]
>
> * **All API requests to the Document Translation service require a custom domain endpoint**.
> * You can't use the endpoint found on your Azure portal resource _Keys and Endpoint_ page nor the global translator endpoint—`api.cognitive.microsofttranslator.com`—to make HTTP requests to Document Translation.

## Request parameters

Request parameters passed on the query string are:

|Query parameter|Required|Description|
|--- |--- |--- |
|documentId|True|The document ID.|
|`id`|True|The batch ID.|
## Request headers

Request headers are:

|Headers|Description|
|--- |--- |
|Ocp-Apim-Subscription-Key|Required request header|

## Response status codes

The following are the possible HTTP status codes that a request returns.

|Status Code|Description|
|--- |--- |
|200|OK. Successful request accepted by the service. The operation details are returned.HeadersRetry-After: integerETag: string|
|401|Unauthorized. Check your credentials.|
|404|Not Found. Resource isn't found.|
|500|Internal Server Error.|
|Other Status Codes|<ul><li>Too many requests</li><li>Server temporary unavailable</li></ul>|

## Get document status response

### Successful get document status response

|Name|Type|Description|
|--- |--- |--- |
|path|string|Location of the document or folder.|
|sourcePath|string|Location of the source document.|
|createdDateTimeUtc|string|Operation created date time.|
|lastActionDateTimeUtc|string|Date time in which the operation's status has been updated.|
|status|String|List of possible statuses for job or document: <ul><li>Canceled</li><li>Cancelling</li><li>Failed</li><li>NotStarted</li><li>Running</li><li>Succeeded</li><li>ValidationFailed</li></ul>|
|to|string|Two letter language code of To Language. [See the list of languages](../../language-support.md).|
|progress|number|Progress of the translation if available|
|`id`|string|Document ID.|
|characterCharged|integer|Characters charged by the API.|

### Error response

|Name|Type|Description|
|--- |--- |--- |
|code|string|Enums containing high-level error codes. Possible values:<br/><ul><li>InternalServerError</li><li>InvalidArgument</li><li>InvalidRequest</li><li>RequestRateTooHigh</li><li>ResourceNotFound</li><li>ServiceUnavailable</li><li>Unauthorized</li></ul>|
|message|string|Gets high-level error message.|
|innerError|InnerTranslationError|New Inner Error format that conforms to Azure AI services API Guidelines. This error message contains required properties ErrorCode, message and optional properties target, details(key value pair), inner error(it can be nested).|
|innerError.code|string|Gets code error string.|
|innerError.message|string|Gets high-level error message.|
|innerError.target|string|Gets the source of the error. For example, it would be `documents` or `document id` for an invalid document.|

## Examples

### Example successful response
The following JSON object is an example of a successful response.

```JSON
{
  "path": "https://myblob.blob.core.windows.net/destinationContainer/fr/mydoc.txt",
  "sourcePath": "https://myblob.blob.core.windows.net/sourceContainer/fr/mydoc.txt",
  "createdDateTimeUtc": "2020-03-26T00:00:00Z",
  "lastActionDateTimeUtc": "2020-03-26T01:00:00Z",
  "status": "Running",
  "to": "fr",
  "progress": 0.1,
  "id": "273622bd-835c-4946-9798-fd8f19f6bbf2",
  "characterCharged": 0
}
```

### Example error response

The following JSON object is an example of an error response. The schema for other error codes is the same.

Status code: 401

```JSON
{
  "error": {
    "code": "Unauthorized",
    "message": "User is not authorized",
    "target": "Document",
    "innerError": {
      "code": "Unauthorized",
      "message": "Operation is not authorized"
    }
  }
}
```

## Next steps

Follow our quickstart to learn more about using Document Translation and the client library.

> [!div class="nextstepaction"]
> [Get started with Document Translation](../quickstarts/document-translation-rest-api.md)
