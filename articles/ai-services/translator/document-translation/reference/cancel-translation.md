---
title: Cancel translation method
titleSuffix: Azure AI services
description: The cancel translation method cancels a current processing or queued operation.
#services: cognitive-services
manager: nitinme
ms.author: lajanuar
author: laujan
ms.service: azure-ai-translator
ms.topic: reference
ms.date: 01/31/2024
---

# Cancel translation

Reference</br>
Feature: **Azure AI Translator → Document Translation**</br>
API Version: **2024-05-01**</br>
HTTP method: **DELETE**

* This method cancels a translation job that is currently processing or queued (pending) as indicated in the request by the `id` query parameter. 
* An operation isn't canceled if already completed, failed, or still canceling. In those instances, a bad request is returned. 
* Completed translations can't be canceled and are charged.

## Request URL

> [!IMPORTANT]
>
> **All API requests to the Document Translation feature require a custom domain endpoint that is located on your resource overview page in the Azure portal**.

```bash
  curl -i -X  DELETE "{document-translation-endpoint}/translator/document/batches/{id}?api-version={date}"
```

## Request parameters

Request parameters passed on the query string are:

|Query parameter|Required|Description|
|-----|-----|-----|
|`id`|True|The operation-ID.|

### Locating  the `id` value

 You can find the job `id` in the POST `start-batch-translation` method response Header `Operation-Location` URL value. The alphanumeric string following the `/document/` parameter is the operation's job **`id`**:

|**Response header**|**Response URL**|
|-----------------------|----------------|
|Operation-Location   | {document-translation-endpoint}/translator/document/`9dce0aa9-78dc-41ba-8cae-2e2f3c2ff8ec`?api-version=2024-05-01|

* You can also use a [get-translations-status](../reference/get-translations-status.md) request to retrieve a list of translation _**jobs**_ and their `id`s.

## Request headers

Request headers are:

|Headers|Description|
|-----|-----|
|Ocp-Apim-Subscription-Key|Required request header|

## Response status codes

The following are the possible HTTP status codes that a request returns.

| Status Code| Description|
|-----|-----|
|200|OK. Cancel request submitted|
|401|Unauthorized. Check your credentials.|
|404|Not found. Resource isn't found.|
|500|Internal Server Error.|
|Other Status Codes|&bullet; Too many requests<br>&bullet; Server temporary unavailable|

## Cancel translation response

### Successful response

The following information is returned in a successful response.

|Name|Type|Description|
|--- |--- |--- |
|`id`|string|ID of the operation.|
|createdDateTimeUtc|string|Operation created date time.|
|lastActionDateTimeUtc|string|Date time in which the operation's status is updated.|
|status|String|List of possible statuses for job or document: &bullet; Canceled<br>&bullet; Cancelling<br>&bullet; Failed<br>&bullet; NotStarted<br>&bullet; Running<br>&bullet; Succeeded<br>&bullet; ValidationFailed|
|summary|StatusSummary|Summary containing a list of details.|
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
|code|string|Enums containing high-level error codes. Possible values:<br>&bullet; InternalServerError<br>&bullet; InvalidArgument<br>&bullet; InvalidRequest<br>&bullet; RequestRateTooHigh<br>&bullet; ResourceNotFound<br>&bullet; ServiceUnavailable<br>&bullet; Unauthorized|
|message|string|Gets high-level error message.|
|target|string|Gets the source of the error. For example, it would be "documents" or `document id` for an invalid document.|
|innerError|InnerTranslationError|New Inner Error format that conforms to Azure AI services API Guidelines. This error message contains required properties ErrorCode, message, and optional properties target, details (key value pair), inner error (it can be nested).|
|innerError.code|string|Gets code error string.|
|innerError.message|string|Gets high-level error message.|
|innerError.target|string|Gets the source of the error. For example, it would be `documents` or `document id` if there was an invalid document.|

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
> [Get started with Document Translation](../how-to-guides/use-rest-api-programmatically.md)
