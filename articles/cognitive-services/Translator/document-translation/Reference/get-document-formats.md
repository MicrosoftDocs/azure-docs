---
title: Document Translation Get Document Formats Method
titleSuffix: Azure Cognitive Services
description: The Get Document Formats method returns a list of supported document formats.
services: cognitive-services
author: jann-skotdal
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 03/03/2021
ms.author: v-jansk
---

# Document Translation: Get Document Formats

The Get Document Formats method returns a list of document formats supported by the Document Translation service. The list includes the common file extension, and the content-type if using the upload API.

## Request URL

Send a `GET` request to:
```HTTP
GET https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/documents/formats
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
    <td>OK. Returns the list of supported document file formats.</td>
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

## File Format Response

### Successful FileFormatListResult Response

The following information is returned in a successful response.

<table>
  <th width="20%">Name</th>
  <th width="20%">Type</th>
  <th>Description</th>
  <tr>
    <td>value</td>
    <td>FileFormat []</td>
    <td>FileFormat[] contains the details listed below.</td>
  </tr>
    <tr>
    <td>value.format</p></td>
    <td>string[]</td>
    <td>Supported Content-Types for this format.</td>
  </tr>
  <tr>
    <td>value.fileExtensions</p></td>
    <td>string[]</td>
    <td>Supported file extension for this format.</td>
  </tr>
  <tr>
    <td>value.contentTypes</p></td>
    <td>string[]</td>
    <td>Name of the format.</td>
  </tr>
  <tr>
    <td>value.versions</p></td>
    <td>String[]</td>
    <td>Supported Version.</td>
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

Status code: 200

```JSON
{
  "value": [
    {
      "format": "PlainText",
      "fileExtensions": [
        ".txt"
      ],
      "contentTypes": [
        "text/plain"
      ],
      "versions": []
    },
    {
      "format": "PortableDocumentFormat",
      "fileExtensions": [
        ".pdf"
      ],
      "contentTypes": [
        "application/pdf"
      ],
      "versions": []
    },
    {
      "format": "OpenXmlPresentation",
      "fileExtensions": [
        ".pptx"
      ],
      "contentTypes": [
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ],
      "versions": []
    },
    {
      "format": "OpenXmlSpreadsheet",
      "fileExtensions": [
        ".xlsx"
      ],
      "contentTypes": [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ],
      "versions": []
    },
    {
      "format": "OutlookMailMessage",
      "fileExtensions": [
        ".msg"
      ],
      "contentTypes": [
        "application/vnd.ms-outlook"
      ],
      "versions": []
    },
    {
      "format": "HtmlFile",
      "fileExtensions": [
        ".html"
      ],
      "contentTypes": [
        "text/html"
      ],
      "versions": []
    },
    {
      "format": "OpenXmlWord",
      "fileExtensions": [
        ".docx"
      ],
      "contentTypes": [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ],
      "versions": []
    }
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
