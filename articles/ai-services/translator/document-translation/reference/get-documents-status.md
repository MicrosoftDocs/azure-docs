---
title: Get documents status
titleSuffix: Azure AI services
description: The get documents status method returns the status for all documents in an asynchronous batch translation request.
#services: cognitive-services
manager: nitinme
ms.author: lajanuar
author: laujan
ms.service: azure-ai-translator
ms.topic: reference
ms.date: 02/09/2024
---

# Get status for all documents

Reference</br>
Feature: **Azure AI Translator → Document Translation**</br>
API Version: **2024-05-01**</br>
HTTP method: **GET**

> [!IMPORTANT]
>
> **All API requests to the Document Translation feature require a custom domain endpoint that is located on your resource overview page in the Azure portal**.

* Use the `get documents status` method to request the status for all documents in a translation job.

* `$top`, `$skip`, and `$maxpagesize` query parameters can be used to specify the number of results to return and an offset for the collection.
  * `$top` indicates the total number of records the user wants to be returned across all pages.
  * `$skip` indicates the number of records to skip from the list of document status held by the server based on the sorting method specified. By default, records are sorted by descending start time.
  * `$maxpagesize` is the maximum items returned in a page.
  * If more items are requested via `$top` (or `$top` isn't specified and there are more items to be returned), `@nextLink` will contain the link to the next page.
  * If the number of documents in the response exceeds our paging limit, server-side paging is used.
  * Paginated responses indicate a partial result and include a continuation token in the response. The absence of a continuation token means that no other pages are available.

> [!NOTE]
> If the server can't honor `$top` and/or `$skip`, the server must return an error to the client informing about it instead of just ignoring the query options. This reduces the risk of the client making assumptions about the data returned.

* `$orderBy` query parameter can be used to sort the returned list (ex: `$orderBy=createdDateTimeUtc asc` or `$orderBy=createdDateTimeUtc desc`).
* The default sorting is descending by `createdDateTimeUtc`. Some query parameters can be used to filter the returned list (ex: `status=Succeeded,Cancelled`) only returns succeeded and canceled documents. 
* The `createdDateTimeUtcStart` and `createdDateTimeUtcEnd` query parameters can be used combined or separately to specify a range of datetime to filter the returned list. 
* The supported filtering query parameters are (`status`, `id`, `createdDateTimeUtcStart`, and `createdDateTimeUtcEnd`).
* When both `$top` and `$skip` are included, the server should first apply `$skip` and then `$top` on the collection.

## Request URL

Send a `GET` request to:

```bash 
  curl -i -X GET "{document-translation-endpoint}/translator/document/batches/{id}/documents?api-version={date}"
```

### Locating  the `id` value

* You can find the job `id` in the POST `start-batch-translation` method response Header `Operation-Location` URL value. The alphanumeric string following the `/document/` parameter is the operation's job **`id`**:

|**Response header**|**Response URL**|
|-----------------------|----------------|
|Operation-Location   | {document-translation-endpoint}/translator/document/`9dce0aa9-78dc-41ba-8cae-2e2f3c2ff8ec`?api-version=2024-05-01|

* You can also use a [get-translations-status](../reference/get-translations-status.md) request to retrieve a list of translation _**jobs**_ and their `id`s.

## Request parameters

Request parameters passed on the query string are:

|Query parameter|In|Required|Type|Description|
|--- |--- |--- |--- |--- |
|`id`|path|True|string|The operation ID.|
|`$maxpagesize`|query|False|integer int32|`$maxpagesize` is the maximum items returned in a page. If more items are requested via `$top` (or `$top` isn't specified and there are more items to be returned), @nextLink will contain the link to the next page. Clients can request server-driven paging with a specific page size by specifying a `$maxpagesize` preference. The server SHOULD honor this preference if the specified page size is smaller than the server's default page size.|
|$orderBy|query|False|array|The sorting query for the collection (ex: `CreatedDateTimeUtc asc`, `CreatedDateTimeUtc desc`).|
|`$skip`|query|False|integer int32|$skip indicates the number of records to skip from the list of records held by the server based on the sorting method specified. By default, we sort by descending start time. Clients MAY use $top and `$skip` query parameters to specify the number of results to return and an offset into the collection. When the client returns both `$top` and `$skip`, the server SHOULD first apply `$skip` and then `$top` on the collection. If the server can't honor `$top` and/or `$skip`, the server MUST return an error to the client informing about it instead of just ignoring the query options.|
|`$top`|query|False|integer int32|`$top` indicates the total number of records the user wants to be returned across all pages. Clients can use `$top` and `$skip` query parameters to specify the number of results to return and an offset into the collection. When the client returns both `$top` and `$skip`, the server SHOULD first apply `$skip` and then `$top` on the collection. If the server can't honor `$top` and/or `$skip`, the server MUST return an error to the client informing about it instead of just ignoring the query options.|
|createdDateTimeUtcEnd|query|False|string date-time|The end datetime to get items before.|
|createdDateTimeUtcStart|query|False|string date-time|The start datetime to get items after.|
|`ids`|query|False|array|IDs to use in filtering.|
|statuses|query|False|array|Statuses to use in filtering.|

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
|200|OK. Successful request and returns the status of the documents. HeadersRetry-After: integerETag: string|
|400|Invalid request. Check input parameters.|
|401|Unauthorized. Check your credentials.|
|404|Resource isn't found.|
|500|Internal Server Error.|
|Other Status Codes|&bullet; Too many requests<br>&bullet; The server is temporarily unavailable|

## Get documents status response

### Successful get documents status response

The following information is returned in a successful response.

|Name|Type|Description|
|--- |--- |--- |
|@nextLink|string|Url for the next page. Null if no more pages available.|
|value|DocumentStatus []|The detail status list of individual documents.|
|value.path|string|Location of the document or folder.|
|value.sourcePath|string|Location of the source document.|
|value.createdDateTimeUtc|string|Operation created date time.|
|value.lastActionDateTimeUtc|string|Date time in which the operation's status is updated.|
|value.status|status|List of possible statuses for job or document. <br>&bullet; Canceled<br>&bullet; Cancelling<br>&bullet; Failed<br>&bullet; NotStarted<br>&bullet; Running<br>&bullet; Succeeded<br>&bullet; ValidationFailed|
|value.to|string|To language.|
|value.progress|number|Progress of the translation if available.|
|value.id|string|Document ID.|
|value.characterCharged|integer|Characters charged by the API.|

### Error response

|Name|Type|Description|
|--- |--- |--- |
|code|string|Enums containing high-level error codes. Possible values:<br/>&bullet; InternalServerError<br>&bullet; InvalidArgument<br>&bullet; InvalidRequest<br>&bullet; RequestRateTooHigh<br>&bullet; ResourceNotFound<br>&bullet; ServiceUnavailable<br>&bullet; Unauthorized|
|message|string|Gets high-level error message.|
|target|string|Gets the source of the error. For example, it would be `documents` or `document id` for an invalid document.|
|innerError|InnerTranslationError|New Inner Error format that conforms to Azure AI services API Guidelines. This error message contains required properties ErrorCode, message, and optional properties target, details (key value pair), inner error (it can be nested).|
|innerError.code|string|Gets code error string.|
|innerError.message|string|Gets high-level error message.|
|innerError.target|string|Gets the source of the error. For example, it would be `documents` or `document id` if there was an invalid document.|

## Examples

> [!TIP]
> Use this method to retrieve the `documentId` parameter for the [get-document-status](get-document-status.md) query string.

### Example successful response

The following JSON object is an example of a successful response.

```JSON
{
  "value": [
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
  ],
  "@nextLink": "https://westus.cognitiveservices.azure.com/translator/text/batch/v1.1/operation/0FA2822F-4C2A-4317-9C20-658C801E0E55/documents?$top=5&$skip=15"
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
