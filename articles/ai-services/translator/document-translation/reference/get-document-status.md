---
title: Get document status method
titleSuffix: Azure AI services
description: The get document status method returns the status for a specific document.
#services: cognitive-services
manager: nitinme
ms.author: lajanuar
author: laujan
ms.service: azure-ai-translator
ms.topic: reference
ms.date: 02/09/2024
---

# Get status for a specific document

Reference</br>
Feature: **Azure AI Translator → Document Translation**</br>
API Version: **2024-05-01**</br>
HTTP method: **GET**

This method returns the status for a specific document in a job as indicated in the request by the `id` and `documentId` query parameters.

## Request URL

> [!IMPORTANT]
>
> **All API requests to the Document Translation feature require a custom domain endpoint that is located on your resource overview page in the Azure portal**.

```bash
  curl -i -X GET "{document-translation-endpoint}/translator/document/batches/{id}/documents/{documentId}?api-version={date}"
```

## Request parameters

Request parameters passed on the query string are:

|Query parameter|Required|Description|
|--- |--- |--- |
|`documentId`|True|The document ID.|
|`id`|True|The batch ID.|

### Locating  the `id` and `documentId` values

* You can find the job `id`  in the POST `start-batch-translation` method response Header `Operation-Location`  URL value. The last parameter of the URL is the operation's job **`id`**:

|**Response header**|**Result URL**|
|-----------------------|----------------|
|`Operation-Location`| {document-translation-endpoint}/translator/document/batches/{id}?api-version={date}/ `9dce0aa9-78dc-41ba-8cae-2e2f3c2ff8ec`/ |

* You can also use a [GET translations status](get-translations-status.md) request to retrieve job `id` parameters for the query string.

* You can find the `documentId` parameter in the [get-documents-status](get-documents-status.md) method [response](get-documents-status.md#example-successful-response).

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
|Other Status Codes|&bullet; Too many requests<br>&bullet; Server temporary unavailable|

## Get document status response

### Successful get document status response

|Name|Type|Description|
|--- |--- |--- |
|path|string|Location of the document or folder.|
|sourcePath|string|Location of the source document.|
|createdDateTimeUtc|string|Operation created date time.|
|lastActionDateTimeUtc|string|Date time in which the operation's status was updated.|
|status|String|List of possible statuses for job or document: <br>&bullet; Canceled<br>&bullet; Cancelling<br>&bullet; Failed<br>&bullet; NotStarted<br>&bullet; Running<br>&bullet; Succeeded<br>&bullet; ValidationFailed|
|to|string|Two letter language code of To Language. [See the list of languages](../../language-support.md).|
|progress|number|Progress of the translation if available|
|`id`|string|Document ID.|
|characterCharged|integer|Characters charged by the API.|

### Error response

|Name|Type|Description|
|--- |--- |--- |
|code|string|Enums containing high-level error codes. Possible values:<br>&bullet; InternalServerError<br>&bullet; InvalidArgument<br>&bullet; InvalidRequest<br>&bullet; RequestRateTooHigh<br>&bullet; ResourceNotFound<br>&bullet; ServiceUnavailable<br>&bullet; Unauthorized|
|message|string|Gets high-level error message.|
|innerError|InnerTranslationError|New Inner Error format that conforms to Azure AI services API Guidelines. This error message contains required properties ErrorCode, message, and optional properties target, details(key value pair), inner error(it can be nested).|
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
> [Get started with Document Translation](../how-to-guides/use-rest-api-programmatically.md)
