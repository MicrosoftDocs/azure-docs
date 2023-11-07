---
title: Get translation status
titleSuffix: Azure AI services
description: The get translation status method returns the status for a document translation request.
services: cognitive-services
manager: nitinme
ms.author: lajanuar
author: laujan
ms.service: azure-ai-translator
ms.topic: reference
ms.date: 07/18/2023
---

# Get translation status

Reference</br>
Service: **Azure AI Document Translation**</br>
API Version: **v1.1**</br>

The Get translation status method returns the status for a document translation request. The status includes the overall request status and the status for documents that are being translated as part of that request. 

## Request URL

Send a `GET` request to:

```HTTP
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.1/batches/{id}
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
|`id`|True|The operation ID.|

## Request headers

Request headers are:

|Headers|Description|
|--- |--- |
|Ocp-Apim-Subscription-Key|Required request header|

## Response status codes

The following are the possible HTTP status codes that a request returns.

|Status Code|Description|
|--- |--- |
|200|OK. Successful request and returns the status of the batch translation operation. HeadersRetry-After: integerETag: string|
|401|Unauthorized. Check your credentials.|
|404|Resource isn't found.|
|500|Internal Server Error.|
|Other Status Codes|<ul><li>Too many requests</li><li>Server temporary unavailable</li></ul>|

## Get translation status response

### Successful get translation status response

The following information is returned in a successful response.

|Name|Type|Description|
|--- |--- |--- |
|`id`|string|ID of the operation.|
|createdDateTimeUtc|string|Operation created date time.|
|lastActionDateTimeUtc|string|Date time in which the operation's status has been updated.|
|status|String|List of possible statuses for job or document: <ul><li>Canceled</li><li>Cancelling</li><li>Failed</li><li>NotStarted</li><li>Running</li><li>Succeeded</li><li>ValidationFailed</li></ul>|
|summary|StatusSummary|Summary containing the listed details.|
|summary.total|integer|Total count.|
|summary.failed|integer|Failed count.|
|summary.success|integer|Number of successful.|
|summary.inProgress|integer|Number of in progress.|
|summary.notYetStarted|integer|Count of not yet started.|
|summary.cancelled|integer|Number of canceled.|
|summary.totalCharacterCharged|integer|Total characters charged by the API.|

### Error response

|Name|Type|Description|
|--- |--- |--- |
|code|string|Enums containing high-level error codes. Possible values:<br/><ul><li>InternalServerError</li><li>InvalidArgument</li><li>InvalidRequest</li><li>RequestRateTooHigh</li><li>ResourceNotFound</li><li>ServiceUnavailable</li><li>Unauthorized</li></ul>|
|message|string|Gets high-level error message.|
|target|string|Gets the source of the error. For example, it would be `documents` or `document id` for an invalid document.|
|innerError|InnerTranslationError|New Inner Error format that conforms to Azure AI services API Guidelines. This error message contains required properties ErrorCode, message and optional properties target, details(key value pair), inner error(it can be nested).|
|innerError.code|string|Gets code error string.|
|innerError.message|string|Gets high-level error message.|
|innerError.target|string|Gets the source of the error. For example, it would be `documents` or `document id` for invalid document.|

## Examples

### Example successful response

The following JSON object is an example of a successful response.

```JSON
{
  "id": "727bf148-f327-47a0-9481-abae6362f11e",
  "createdDateTimeUtc": "2020-03-26T00:00:00Z",
  "lastActionDateTimeUtc": "2020-03-26T01:00:00Z",
  "status": "Succeeded",
  "summary": {
    "total": 10,
    "failed": 1,
    "success": 9,
    "inProgress": 0,
    "notYetStarted": 0,
    "cancelled": 0,
    "totalCharacterCharged": 0
  }
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
