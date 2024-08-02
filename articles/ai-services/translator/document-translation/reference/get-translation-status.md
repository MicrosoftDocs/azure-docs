---
title: Get translation status
titleSuffix: Azure AI services
description: The get translation status method returns the status for a document translation request.
#services: cognitive-services
manager: nitinme
ms.author: lajanuar
author: laujan
ms.service: azure-ai-translator
ms.topic: reference
ms.date: 02/09/2024
---

# Get status for a specific translation job

Reference</br>
Feature: **Azure AI Translator → Document Translation**</br>
API Version: **2024-05-01**</br>
HTTP method: **GET**

* Use the `get translation status` method to request the status of a specific translation job. The response includes the overall job status and the status for documents that are being translated as part of that job.

## Request URL

> [!IMPORTANT]
>
> **All API requests to the Document Translation feature require a custom domain endpoint that is located on your resource overview page in the Azure portal**.

```bash
curl -i -X GET "{document-translation-endpoint}/translator/document/batches/{id}?api-version={date}"
```

## Request parameters

Request parameters passed on the query string are:

|Query parameter|Required|Description|
|--- |--- |--- |
|`id`|True|The operation ID.|

### Locating  the `id` value

 You can find the job `id` in the POST `start-batch-translation` method response Header `Operation-Location` URL value. The alphanumeric string following the `/document/` parameter is the operation's job **`id`**:

|**Response header**|**Response URL**|
|-----------------------|----------------|
|Operation-Location   | {document-translation-endpoint}/translator/document/`9dce0aa9-78dc-41ba-8cae-2e2f3c2ff8ec`?api-version=2024-05-01|

* You can also use a [get-translations-status](../reference/get-translations-status.md) request to retrieve a list of translation _**jobs**_ and their `id`s.

## Request headers

Request headers are:

|Headers|Description|Condition|
|--- |--- |---|
|**Ocp-Apim-Subscription-Key**|Your Translator service API key from the Azure portal.|Required|
|**Ocp-Apim-Subscription-Region**|The region where your resource was created. |&bullet; ***Required*** when using a regional (geographic) resource like **West US**.</br>&bullet.|
|**Content-Type**|The content type of the payload. The accepted value is **application/json** or **charset=UTF-8**.|&bullet; **Required**|

## Response status codes

The following are the possible HTTP status codes that a request returns.

|Status Code|Description|
|--- |--- |
|200|OK. Successful request and returns the status of the batch translation operation. HeadersRetry-After: integerETag: string|
|401|Unauthorized. Check your credentials.|
|404|Resource isn't found.|
|500|Internal Server Error.|
|Other Status Codes|&bullet; Too many requests<br>&bullet; Server temporary unavailable|

## Get translation status response

### Successful get translation status response

The following information is returned in a successful response.

|Name|Type|Description|
|--- |--- |--- |
|`id`|string|ID of the operation.|
|createdDateTimeUtc|string|Operation created date time.|
|lastActionDateTimeUtc|string|Date time in which the operation's status was updated.|
|status|String|List of possible statuses for job or document: <br>&bullet; Canceled<br>&bullet; Cancelling<br>&bullet; Failed<br>&bullet; NotStarted<br>&bullet; Running<br>&bullet; Succeeded<br>&bullet; ValidationFailed|
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
|code|string|Enums containing high-level error codes. Possible values:<br>&bullet; InternalServerError<br>&bullet; InvalidArgument<br>&bullet; InvalidRequest<br>&bullet; RequestRateTooHigh<br>&bullet; ResourceNotFound<br>&bullet; ServiceUnavailable<br>&bullet; Unauthorized|
|message|string|Gets high-level error message.|
|target|string|Gets the source of the error. For example, it would be `documents` or `document id` for an invalid document.|
|innerError|InnerTranslationError|New Inner Error format that conforms to Azure AI services API Guidelines. This error message contains required properties ErrorCode, message, and optional properties target, details(key value pair), inner error(it can be nested).|
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
> [Get started with Document Translation](../how-to-guides/use-rest-api-programmatically.md)
