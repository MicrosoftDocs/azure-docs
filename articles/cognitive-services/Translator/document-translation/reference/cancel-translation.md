---
title: Cancel translation method
titleSuffix: Azure Cognitive Services
description: The cancel translation method cancels a currently processing or queued operation.
services: cognitive-services
author: jann-skotdal
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 03/25/2021
ms.author: v-jansk
---

# Cancel translation

Cancel a currently processing or queued operation. An operation won't be canceled if it is already completed or failed or canceling. A bad request will be returned. All documents that have completed translation won't be canceled and will be charged. All pending documents will be canceled if possible.

## Request URL

Send a `DELETE` request to:

```DELETE HTTP
https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches/{id}
```

Learn how to find your [custom domain name](../get-started-with-document-translation.md#find-your-custom-domain-name).

> [!IMPORTANT]
>
> * **All API requests to the Document Translation service require a custom domain endpoint**.
> * You can't use the endpoint found on your Azure portal resource _Keys and Endpoint_ page nor the global translator endpoint—`api.cognitive.microsofttranslator.com`—to make HTTP requests to Document Translation.

## Request parameters

Request parameters passed on the query string are:

|Query parameter|Required|Description|
|-----|-----|-----|
|id|True|The operation-id.|

## Request headers

Request headers are:

|Headers|Description|
|-----|-----|
|Ocp-Apim-Subscription-Key|Required request header|

## Response status codes

The following are the possible HTTP status codes that a request returns.

| Status Code| Description|
|-----|-----|
|200|OK. Cancel request has been submitted|
|401|Unauthorized. Check your credentials.|
|404|Not found. Resource is not found. 
|500|Internal Server Error.
|Other Status Codes|<ul><li>Too many requests</li><li>Server temporary unavailable</li></ul>|

## Cancel translation response

### Successful response

The following information is returned in a successful response.

|Name|Type|Description|
|--- |--- |--- |
|id|string|ID of the operation.|
|createdDateTimeUtc|string|Operation created date time.|
|lastActionDateTimeUtc|string|Date time in which the operation's status has been updated.|
|status|String|List of possible statuses for job or document: <ul><li>Canceled</li><li>Cancelling</li><li>Failed</li><li>NotStarted</li><li>Running</li><li>Succeeded</li><li>ValidationFailed</li></ul>|
|summary|StatusSummary|Summary containing the details listed below.|
|summary.total|integer|Count of total documents.|
|summary.failed|integer|Count of documents failed.|
|summary.success|integer|Count of documents successfully translated.|
|summary.inProgress|integer|Count of documents in progress.|
|summary.notYetStarted|integer|Count of documents not yet started processing.|
|summary.cancelled|integer|Number of canceled.|
|summary.totalCharacterCharged|integer|Total characters charged by the API.|

### Error response

|Name|Type|Description|
|--- |--- |--- |
|code|string|Enums containing high-level error codes. Possible values:<br/><ul><li>InternalServerError</li><li>InvalidArgument</li><li>InvalidRequest</li><li>RequestRateTooHigh</li><li>ResourceNotFound</li><li>ServiceUnavailable</li><li>Unauthorized</li></ul>|
|message|string|Gets high-level error message.|
|target|string|Gets the source of the error. For example, it would be "documents" or "document id" for an invalid document.|
|innerError|InnerErrorV2|New Inner Error format, which conforms to Cognitive Services API Guidelines. It contains required properties ErrorCode, message, and optional properties target, details(key value pair), inner error (can be nested).|
|innerError.code|string|Gets code error string.|
|inner.Eroor.message|string|Gets high-level error message.|

## Examples

### Example successful response

The following JSON object is an example of a successful response.

Status code: 200

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

Status code: 500

```JSON
{
  "error": {
    "code": "InternalServerError",
    "message": "Internal Server Error",
    "target": "Operation",
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
> [Get started with Document Translation](../get-started-with-document-translation.md)
