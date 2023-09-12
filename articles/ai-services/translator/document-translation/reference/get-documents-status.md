---
title: Get documents status
titleSuffix: Azure AI services
description: The get documents status method returns the status for all documents in a batch document translation request.
services: cognitive-services
manager: nitinme
ms.author: lajanuar
author: laujan
ms.service: azure-ai-translator
ms.topic: reference
ms.date: 07/18/2023
---

# Get documents status

Reference</br>
Service: **Azure AI Document Translation**</br>
API Version: **v1.1**</br>

If the number of documents in the response exceeds our paging limit, server-side paging is used. Paginated responses indicate a partial result and include a continuation token in the response. The absence of a continuation token means that no other pages are available.

`$top`, `$skip`, and `$maxpagesize` query parameters can be used to specify the number of results to return and an offset for the collection.

`$top` indicates the total number of records the user wants to be returned across all pages. `$skip` indicates the number of records to skip from the list of document status held by the server based on the sorting method specified. By default, we sort by descending start time. ``$maxpagesize`` is the maximum items returned in a page. If more items are requested via `$top` (or `$top` isn't specified and there are more items to be returned), @nextLink will contain the link to the next page.

$orderBy query parameter can be used to sort the returned list (ex "$orderBy=createdDateTimeUtc asc" or "$orderBy=createdDateTimeUtc desc"). The default sorting is descending by createdDateTimeUtc. Some query parameters can be used to filter the returned list (ex: "status=Succeeded,Cancelled") only returns succeeded and canceled documents. createdDateTimeUtcStart and createdDateTimeUtcEnd can be used combined or separately to specify a range of datetime to filter the returned list by. The supported filtering query parameters are (status, IDs, createdDateTimeUtcStart, createdDateTimeUtcEnd).

When both `$top` and `$skip` are included, the server should first apply `$skip` and then `$top` on the collection. 

> [!NOTE]
> If the server can't honor `$top` and/or `$skip`, the server must return an error to the client informing about it instead of just ignoring the query options. This reduces the risk of the client making assumptions about the data returned.

## Request URL

Send a `GET` request to:
```HTTP
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.1/batches/{id}/documents
```

Learn how to find your [custom domain name](../quickstarts/document-translation-rest-api.md).

> [!IMPORTANT]
>
> * **All API requests to the Document Translation service require a custom domain endpoint**.
> * You can't use the endpoint found on your Azure portal resource _Keys and Endpoint_ page nor the global translator endpoint—`api.cognitive.microsofttranslator.com`—to make HTTP requests to Document Translation.

## Request parameters

Request parameters passed on the query string are:

|Query parameter|In|Required|Type|Description|
|--- |--- |--- |--- |--- |
|`id`|path|True|string|The operation ID.|
|`$maxpagesize`|query|False|integer int32|`$maxpagesize` is the maximum items returned in a page. If more items are requested via `$top` (or `$top` isn't specified and there are more items to be returned), @nextLink will contain the link to the next page. Clients MAY request server-driven paging with a specific page size by specifying a `$maxpagesize` preference. The server SHOULD honor this preference if the specified page size is smaller than the server's default page size.|
|$orderBy|query|False|array|The sorting query for the collection (ex: `CreatedDateTimeUtc asc`, `CreatedDateTimeUtc desc`).|
|`$skip`|query|False|integer int32|$skip indicates the number of records to skip from the list of records held by the server based on the sorting method specified. By default, we sort by descending start time. Clients MAY use $top and `$skip` query parameters to specify the number of results to return and an offset into the collection. When the client returns both `$top` and `$skip`, the server SHOULD first apply `$skip` and then `$top` on the collection. Note: If the server can't honor `$top` and/or `$skip`, the server MUST return an error to the client informing about it instead of just ignoring the query options.|
|`$top`|query|False|integer int32|`$top` indicates the total number of records the user wants to be returned across all pages. Clients MAY use `$top` and `$skip` query parameters to specify the number of results to return and an offset into the collection. When the client returns both `$top` and `$skip`, the server SHOULD first apply `$skip` and then `$top` on the collection. Note: If the server can't honor `$top` and/or `$skip`, the server MUST return an error to the client informing about it instead of just ignoring the query options.|
|createdDateTimeUtcEnd|query|False|string date-time|The end datetime to get items before.|
|createdDateTimeUtcStart|query|False|string date-time|The start datetime to get items after.|
|`ids`|query|False|array|IDs to use in filtering.|
|statuses|query|False|array|Statuses to use in filtering.|

## Request headers

Request headers are:

|Headers|Description|
|--- |--- |
|Ocp-Apim-Subscription-Key|Required request header|

## Response status codes

The following are the possible HTTP status codes that a request returns.

|Status Code|Description|
|--- |--- |
|200|OK. Successful request and returns the status of the documents. HeadersRetry-After: integerETag: string|
|400|Invalid request. Check input parameters.|
|401|Unauthorized. Check your credentials.|
|404|Resource isn't found.|
|500|Internal Server Error.|
|Other Status Codes|<ul><li>Too many requests</li><li>Server temporary unavailable</li></ul>|


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
|value.lastActionDateTimeUtc|string|Date time in which the operation's status has been updated.|
|value.status|status|List of possible statuses for job or document.<ul><li>Canceled</li><li>Cancelling</li><li>Failed</li><li>NotStarted</li><li>Running</li><li>Succeeded</li><li>ValidationFailed</li></ul>|
|value.to|string|To language.|
|value.progress|number|Progress of the translation if available.|
|value.id|string|Document ID.|
|value.characterCharged|integer|Characters charged by the API.|

### Error response

|Name|Type|Description|
|--- |--- |--- |
|code|string|Enums containing high-level error codes. Possible values:<br/><ul><li>InternalServerError</li><li>InvalidArgument</li><li>InvalidRequest</li><li>RequestRateTooHigh</li><li>ResourceNotFound</li><li>ServiceUnavailable</li><li>Unauthorized</li></ul>|
|message|string|Gets high-level error message.|
|target|string|Gets the source of the error. For example, it would be `documents` or `document id` for an invalid document.|
|innerError|InnerTranslationError|New Inner Error format that conforms to Azure AI services API Guidelines. This error message contains required properties ErrorCode, message, and optional properties target, details (key value pair), inner error (it can be nested).|
|innerError.code|string|Gets code error string.|
|innerError.message|string|Gets high-level error message.|
|innerError.target|string|Gets the source of the error. For example, it would be `documents` or `document id` if there was an invalid document.|

## Examples

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
> [Get started with Document Translation](../quickstarts/document-translation-rest-api.md)
