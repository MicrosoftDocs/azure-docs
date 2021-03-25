---
title: Document Translation Get Operation Status
titleSuffix: Azure Cognitive Services
description: The Get Operation Status method returns the status for a document translation request.
services: cognitive-services
author: jann-skotdal
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 03/03/2021
ms.author: v-jansk
---

# Document Translation: Get Operation Status

The Get Operation Documents Status method returns the status for a document translation request. The status includes the overall request status and the status for documents that are being translated as part of that request.

## Request URL

Send a `GET` request to:
```HTTP
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches/{id}
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
    <td>The operation ID.</td>
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
    <td>OK. Successful request and returns the status of the batch translation operation. <br/><br/>Headers<br/>Retry-After: integer<br/>ETag: string
  </tr>
  <tr>
    <td>401</td>
    <td>Unauthorized. Check your credentials.</td>
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

## Get Operation Status Response

### Successful Get Operation Status Response
The following information is returned in a successful response.

<table>
  <th width="20%">Name</th>
  <th>Type</th>
  <th>Description</th>
  <tr>
    <td>id</td>
    <td>string</td>
    <td>ID of the operation.</td>
  </tr>
  <tr>
    <td>createdDateTimeUtc</td>
    <td>string</td>
    <td>Operation created date time.</td>
  </tr>
  <tr>
    <td>lastActionDateTimeUtc</td>
    <td>string</td>
    <td>Date time in which the operation's status has been updated.</td>
  </tr>
  <tr>
    <td>status</td>
    <td>String</td>
    <td>List of possible statuses for job or document: <ul><li>Cancelled</li><li>Cancelling</li><li>Failed</li><li>NotStarted</li><li>Running</li><li>Succeeded</li><li>ValidationFailed</li></ul></td>
  </tr>
  <tr>
    <td>summary</td>
    <td>StatusSummary</td>
    <td>Summary containing the details listed below.</td>
  </tr>
    <tr>
    <td>summary.total</p></td>
    <td>integer</td>
    <td>Total count.</td>
  </tr>
  <tr>
    <td>summary.failed</p></td>
    <td>integer</td>
    <td>Failed count.</td>
  </tr>
  <tr>
    <td>summary.success</p></td>
    <td>integer</td>
    <td>Number of successful.</td>
  </tr>
  <tr>
    <td>summary.inProgress</p></td>
    <td>integer</td>
    <td>Number of in progress.</td>
  </tr>
  <tr>
    <td>summary.notYetStarted</p></td>
    <td>integer</td>
    <td>Count of not yet started.</td>
  </tr>
  <tr>
    <td>summary.cancelled</p></td>
    <td>integer</td>
    <td>Number of cancelled.</td>
  </tr>
  <tr>
    <td>summary.totalCharacterCharged</p></td>
    <td>integer</td>
    <td>Total characters charged by the API.</td>
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
    <td>Gets the source of the error. For example, it would be "documents" or "document id" for an invalid document.</td>
  </tr>
  <tr>
    <td>innerError</td>
    <td>InnerErrorV2</td>
    <td>New Inner Error format, which conforms to Cognitive Services API Guidelines. It contains required properties ErrorCode, message, and optional properties target, details(key value pair), inner error (can be nested).</td>
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

### Example Error Response

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
