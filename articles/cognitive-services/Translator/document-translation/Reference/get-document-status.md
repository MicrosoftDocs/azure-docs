---
title: Document Translation Get Document Status Method
titleSuffix: Azure Cognitive Services
description: The Get Document Status method returns the status for a specific document.
services: cognitive-services
author: jann-skotdal
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 03/03/2021
ms.author: v-jansk
---

# Document Translation: Get Document Status

The Get Document Status method returns the status for a specific document. The method returns the translation status for a specific document based on the request ID and document ID.

## Request URL

Send a `GET` request to:
```HTTP
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches/{id}/documents/{documentId}
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
    <td>documentId</td>
    <td>True</td>
    <td>The document ID.</td>
  </tr>
  <tr>
    <td>id</td>
    <td>True</td>
    <td>The batch ID. Format - uuid. </td>
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
    <td>OK. Successful request and it is accepted by the service. The operation details are returned.<br/><br/>Headers<br/>Retry-After: integer<br/>ETag: string</td>
  </tr>
  <tr>
    <td>401</td>
    <td>Unauthorized. Please check your credentials.</td>
  </tr>
  <tr>
    <td>404</td>
    <td>Not Found. Resource is not found.</td>
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

## Get Document Status Response

## Successful Get Document Status Response
<table>
  <th width="20%">Name</th>
  <th>Type</th>
  <th>Description</th>
   <tr>
    <td>path</td>
    <td>string</td>
    <td>Location of the document or folder.</td>
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
    <td>to</td>
    <td>string</td>
    <td>Two letter language code of To Language. See the list of languages.</td>
  </tr>
  <tr>
    <td>progress</td>
    <td>number</td>
    <td>Progress of the translation if available</td>
  </tr>
  <tr>
    <td>id</td>
    <td>string</td>
    <td>Document ID.</td>
  </tr>
  <tr>
    <td>characterCharged</td>
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
  "path": "https://myblob.blob.core.windows.net/destinationContainer/fr/mydoc.txt",
  "createdDateTimeUtc": "2020-03-26T00:00:00Z",
  "lastActionDateTimeUtc": "2020-03-26T01:00:00Z",
  "status": "Running",
  "to": "fr",
  "progress": 0.1,
  "id": "273622bd-835c-4946-9798-fd8f19f6bbf2",
  "characterCharged": 0
}
```

### Example Error Response
The following is an example of an error response. The schema for other error codes is the same.

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
