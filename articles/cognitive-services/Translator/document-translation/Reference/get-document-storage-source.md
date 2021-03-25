---
title: Document Translation Get Document Storage Source Method
titleSuffix: Azure Cognitive Services
description: The Get Document Storage Source method returns a list of supported storage sources.
services: cognitive-services
author: jann-skotdal
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 03/03/2021
ms.author: v-jansk
---

# Document Translation: Get Document Storage Source

The Get Document Storage Source method returns a list of storage sources/options supported by the Document Translation service.

## Request URL

Send a `GET` request to:
```HTTP
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/storagesources
```

Learn how to find your [custom domain name](https://docs.microsoft.com/azure/cognitive-services/translator/document-translation/get-started-with-document-translation#find-your-custom-domain-name).

> [!IMPORTANT]
>
> * **All API requests to the Document Translation service require a custom domain endpoint**.
> * You can't use the endpoint found on your Azure portal resource _Keys and Endpoint_ page nor the global translator endpoint—`api.cognitive.microsofttranslator.com`—to make HTTP requests to Document Translation.

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
    <td>OK. Successful request and returns the list of storage sources.
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

## Get Document Storage Source Response

### Successful Get Document Storage Source Response
Base type for list return in the Get Document Storage Source API.

<table width="100%">
  <th width="20%">Name</th>
  <th>Type</th>
  <th>Description</th>
  <tr>
    <td>value</td>
    <td>string []</td>
    <td>List of objects.
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
  "value": [
    "AzureBlob"
  ]
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
    "innerError": {
      "code": "InternalServerError",
      "message": "Unexpected internal server error has occurred"
    }
  }
}
```
