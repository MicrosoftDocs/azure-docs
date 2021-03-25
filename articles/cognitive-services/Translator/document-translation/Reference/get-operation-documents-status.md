---
title: Document Translation Get Operation Documents Status
titleSuffix: Azure Cognitive Services
description: The Get Operation Documents Status method returns the status for all documents in a batch document translation request.
services: cognitive-services
author: jann-skotdal
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 03/03/2021
ms.author: v-jansk
---

# Document Translation: Get Operation Documents Status

The Get Operation Documents Status method returns the status for all documents in a batch document translation request.

The documents included in the response are sorted by document ID in descending order. If the number of documents in the response exceeds our paging limit, server-side paging is used. Paginated responses indicate a partial result and include a continuation token in the response. The absence of a continuation token means that no additional pages are available.

$top and $skip query parameters can be used to specify a number of results to return and an offset for the collection. The server honors the values specified by the client. However, clients must be prepared to handle responses that contain a different page size or contain a continuation token.

When both $top and $skip are included, the server should first apply $skip and then $top on the collection. Note: If the server can't honor $top and/or $skip, the server must return an error to the client informing about it instead of just ignoring the query options. This reduces the risk of the client making assumptions about the data returned.

## Request URL

Send a `GET` request to:
```HTTP
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches/{id}/documents
```

Learn how to find your [custom domain name](https://docs.microsoft.com/azure/cognitive-services/translator/document-translation/get-started-with-document-translation#find-your-custom-domain-name).

> [!IMPORTANT]
>
> * **All API requests to the Document Translation service require a custom domain endpoint**.
> * You can't use the endpoint found on your Azure portal resource _Keys and Endpoint_ page nor the global translator endpoint—`api.cognitive.microsofttranslator.com`—to make HTTP requests to Document Translation.

## Request parameters

Request parameters passed on the query string are:

<table width="100%">
  <th width="20%">Query parameter</th>
  <th>Required</th>
  <th>Description</th>
  <tr>
    <td>id</td>
    <td>True</td>
    <td>The operation ID. Format - uuid. </td>
  </tr>
  <tr>
    <td>$skip</td>
    <td>False</td>
    <td>Skip the $skip entries in the collection. When both $top and $skip are supplied, $skip is applied first. </td>
  </tr>
  <tr>
    <td>$top</td>
    <td>False</td>
    <td>Take the $top entries in the collection. When both $top and $skip are supplied, $skip is applied first. </td>
  </tr>
</table>

## Request headers

Request headers are:

<table width="100%">
  <th width="20%">Headers</th>
  <th>Description</th>
  <tr>
    <td>Ocp-Apim-Subscription-Key</td>
    <td><em>Required request header</em></td>
  </tr>
</table>

## Response status codes

The following are the possible HTTP status codes that a request returns.

<table width="100%">
  <th width="20%">Status Code</th>
  <th>Description</th>
  <tr>
    <td>200</td>
    <td>OK. Successful request and returns the status of the documents.<br/><br/> Headers<br/>Retry-After: integer<br/>ETag: string
  </tr>
  <tr>
    <td>400</td>
    <td>Invalid request. Check input parameters.</td>
  </tr>
  <tr>
    <td>401</td>
    <td>Unauthorized. Please check your credentials.</td>
  </tr>
  <tr>
    <td>404</td>
    <td>Resource is not found.</td>
  </tr>
  <tr>
    <td>500</td>
    <td>Internal Server Error.</td>
  </tr>
  <tr>
    <td>Other Status Codes</td>
    <td><ul><li>Too many requests</li><li>Server temporary unavailable</li></ul></td>
  </tr>
</table>

## Get Operation Documents Status Response

### Successful Get Operation Documents Status Response
The following information is returned in a successful response.
<table>
  <th width="20%">Name</th>
  <th>Type</th>
  <th>Description</th>
  <tr>
    <td>@nextLink</td>
    <td>string</td>
    <td>Url for the next page. Null if no more pages available.</td>
  </tr>
  <tr>
    <td>value</td>
    <td>DocumentStatusDetail []</td>
    <td>The detail status of individual documents listed below.</td>
  </tr>
    <tr>
    <td>value.path</p></td>
    <td>string</td>
    <td>Location of the document or folder.</td>
  </tr>
  <tr>
    <td>value.createdDateTimeUtc</p></td>
    <td>string</td>
    <td>Operation created date time.</td>
  </tr>
  <tr>
    <td>value.lastActionDateTimeUt</p></td>
    <td>string</td>
    <td>Date time in which the operation's status has been updated.</td>
  </tr>
  <tr>
    <td>value.status</p></td>
    <td>status</td>
    <td>List of possible statuses for job or document.<ul><li>Cancelled</li><li>Cancelling</li><li>Failed</li><li>NotStarted</li><li>Running</li><li>Succeeded</li><li>ValidationFailed</li></ul></td>
  </tr>
  <tr>
    <td>value.to</p></td>
    <td>string</td>
    <td>To language.</td>
  </tr>
  <tr>
    <td>value.progress</p></td>
    <td>string</td>
    <td>Progress of the translation if available.</td>
  </tr>
  <tr>
    <td>value.id</p></td>
    <td>string</td>
    <td>Document ID.</td>
  </tr>
  <tr>
    <td>value.characterCharged</p></td>
    <td>integer</td>
    <td>Characters charged by the API.</td>
  </tr>
</table>

### Error Response

<table>
  <th width="20%">Name</th>
  <th>Type</th>
  <th>Description</th>
  <tr>
    <td>code</td>
    <td>string</td>
    <td>Enums containing high-level error codes. Possible values:<br/><ul><li>InternalServerError</li><li>InvalidArgument</li><li>InvalidRequest</li><li>RequestRateTooHigh</li><li>ResourceNotFound</li><li>ServiceUnavailable</li><li>Unauthorized</li></ul></td>
  </tr>
  <tr>
    <td>message</td>
    <td>string</td>
    <td>Gets high-level error message.</td>
  </tr>
  <tr>
    <td>target</td>
    <td>string</td>
    <td>Gets the source of the error. For example, it would be "documents" or "document id" in the case of an invalid document.</td>
  </tr>
  <tr>
    <td>innerError</td>
    <td>InnerErrorV2</td>
    <td>New Inner Error format, which conforms to Cognitive Services API Guidelines. It contains required properties ErrorCode, message and optional properties target, details(key value pair), inner error (this can be nested).</td>
  </tr>
  <tr>
    <td>innerError.code</p></td>
    <td>string</td>
    <td>Gets code error string.</td>
  </tr>
  <tr>
    <td>innerError.message</p></td>
    <td>string</td>
    <td>Gets high-level error message.</td>
  </tr>
</table>

## Examples

### Example Successful Response
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

### Example Error Response
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
