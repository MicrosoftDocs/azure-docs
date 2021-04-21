---
title: Get documents status
titleSuffix: Azure Cognitive Services
description: The get documents status method returns the status for all documents in a batch document translation request.
services: cognitive-services
author: jann-skotdal
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 03/25/2021
ms.author: v-jansk
---

# Get documents status

The Get documents status method returns the status for all documents in a batch document translation request.

The documents included in the response are sorted by document ID in descending order. If the number of documents in the response exceeds our paging limit, server-side paging is used. Paginated responses indicate a partial result and include a continuation token in the response. The absence of a continuation token means that no additional pages are available.

$top and $skip query parameters can be used to specify a number of results to return and an offset for the collection. The server honors the values specified by the client. However, clients must be prepared to handle responses that contain a different page size or contain a continuation token.

When both $top and $skip are included, the server should first apply $skip and then $top on the collection.

> [!NOTE]
> If the server can't honor $top and/or $skip, the server must return an error to the client informing about it instead of just ignoring the query options. This reduces the risk of the client making assumptions about the data returned.

## Request URL

Send a `GET` request to:
```HTTP
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches/{id}/documents
```

Learn how to find your [custom domain name](../get-started-with-document-translation.md#find-your-custom-domain-name).

> [!IMPORTANT]
>
> * **All API requests to the Document Translation service require a custom domain endpoint**.
> * You can't use the endpoint found on your Azure portal resource _Keys and Endpoint_ page nor the global translator endpoint—`api.cognitive.microsofttranslator.com`—to make HTTP requests to Document Translation.

## Request parameters

Request parameters passed on the query string are:

|Query parameter|Required|Description|
|--- |--- |--- |
|id|True|The operation ID.|
|$skip|False|Skip the $skip entries in the collection. When both $top and $skip are supplied, $skip is applied first.|
|$top|False|Take the $top entries in the collection. When both $top and $skip are supplied, $skip is applied first.|

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
|404|Resource is not found.|
|500|Internal Server Error.|
|Other Status Codes|<ul><li>Too many requests</li><li>Server temporary unavailable</li></ul>|


## Get documents status response

### Successful get documents status response

The following information is returned in a successful response.

|Name|Type|Description|
|--- |--- |--- |
|@nextLink|string|Url for the next page. Null if no more pages available.|
|value|DocumentStatusDetail []|The detail status of individual documents listed below.|
|value.path|string|Location of the document or folder.|
|value.createdDateTimeUtc|string|Operation created date time.|
|value.lastActionDateTimeUt|string|Date time in which the operation's status has been updated.|
|value.status|status|List of possible statuses for job or document.<ul><li>Canceled</li><li>Cancelling</li><li>Failed</li><li>NotStarted</li><li>Running</li><li>Succeeded</li><li>ValidationFailed</li></ul>|
|value.to|string|To language.|
|value.progress|string|Progress of the translation if available.|
|value.id|string|Document ID.|
|value.characterCharged|integer|Characters charged by the API.|

### Error response

|Name|Type|Description|
|--- |--- |--- |
|code|string|Enums containing high-level error codes. Possible values:<br/><ul><li>InternalServerError</li><li>InvalidArgument</li><li>InvalidRequest</li><li>RequestRateTooHigh</li><li>ResourceNotFound</li><li>ServiceUnavailable</li><li>Unauthorized</li></ul>|
|message|string|Gets high-level error message.|
|target|string|Gets the source of the error. For example, it would be "documents" or "document id" in the case of an invalid document.|
|innerError|InnerErrorV2|New Inner Error format, which conforms to Cognitive Services API Guidelines. It contains required properties ErrorCode, message and optional properties target, details(key value pair), inner error (this can be nested).|
|innerError.code|string|Gets code error string.|
|innerError.message|string|Gets high-level error message.|

## Examples

### Example successful response

The following is an example of a successful response.

```JSON
{
  "value": [
    {
      "path": "https://myblob.blob.core.windows.net/destinationContainer/fr/mydoc.txt",
      "createdDateTimeUtc": "2020-03-26T00:00:00Z",
      "lastActionDateTimeUtc": "2020-03-26T01:00:00Z",
      "status": "Running",
      "to": "fr",
      "progress": 0.1,
      "id": "273622bd-835c-4946-9798-fd8f19f6bbf2",
      "characterCharged": 0
    }
  ],
  "@nextLink": "https://westus.cognitiveservices.azure.com/translator/text/batch/v1.0.preview.1/operation/0FA2822F-4C2A-4317-9C20-658C801E0E55/documents?$top=5&$skip=15"
}
```

### Example error response

The following is an example of an error response. The schema for other error codes is the same.

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
