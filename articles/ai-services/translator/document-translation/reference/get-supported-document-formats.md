---
title: Get supported document formats method
titleSuffix: Azure AI services
description: The get supported document formats method returns a list of supported document formats.
#services: cognitive-services
manager: nitinme
ms.author: lajanuar
author: laujan
ms.service: azure-ai-translator
ms.topic: reference
ms.date: 02/09/2024
---

# Get supported document formats

Reference</br>
Feature: **Azure AI Translator → Document Translation**</br>
API Version: **2024-05-01**</br>
HTTP method: **GET**

This method returns a list of document formats supported by the Document Translation feature. The list includes common file extensions and content-type if using the upload API.

## Request URL

> [!IMPORTANT]
>
> **All API requests to the Document Translation feature require a custom domain endpoint that is located on your resource overview page in the Azure portal**.

```bash
 curl -i -X GET "{document-translation-endpoint}/translator/document/formats?api-version={date}&type=document"
```

## Request headers

Request headers are:

|Headers|Description|
|-----|-----|
|Ocp-Apim-Subscription-Key|Required request header|

## Response status codes

The following are the possible HTTP status codes that a request returns.

|Status Code|Description|
|-----|-----|
|200|OK. Returns the list of supported document file formats.|
|500|Internal Server Error.|
|Other Status Codes|&bullet; Too many requests<br>&bullet; Server temporary unavailable|

## File format response

### Successful fileFormatListResult response

The following information is returned in a successful response.

|Name|Type|Description|
|--- |--- |--- |
|value|FileFormat []|FileFormat[] contains the listed details.|
|value.contentTypes|string[]|Supported Content-Types for this format.|
|value.defaultVersion|string|Default version if none is specified.|
|value.fileExtensions|string[]|Supported file extension for this format.|
|value.format|string|Name of the format.|
|value.versions|string [] | Supported version.|

### Error response

|Name|Type|Description|
|--- |--- |--- |
 |code|string|Enums containing high-level error codes. Possible values: &bullet; InternalServerError<br>&bullet; InvalidArgument<br>&bullet; InvalidRequest<br>&bullet; RequestRateTooHigh<br>&bullet; ResourceNotFound<br>&bullet; ServiceUnavailable<br>&bullet; Unauthorized|
|message|string|Gets high-level error message.|
|innerError|InnerTranslationError|New Inner Error format that conforms to Azure AI services API Guidelines. This error message contains required properties ErrorCode, message, and optional properties target, details(key value pair), inner error(it can be nested).|
|innerError.code|string|Gets code error string.|
|innerError.message|string|Gets high-level error message.|
|innerError.target|string|Gets the source of the error. For example, it would be `documents` or `document id` for an invalid document.|

## Examples

### Example successful response

The following JSON object is an example of a successful response.

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
            "format": "OpenXmlWord",
            "fileExtensions": [
                ".docx"
            ],
            "contentTypes": [
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
                ".html",
                ".htm"
            ],
            "contentTypes": [
                "text/html"
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
            "format": "XLIFF",
            "fileExtensions": [
                ".xlf"
            ],
            "contentTypes": [
                "application/xliff+xml"
            ],
            "versions": [
                "1.0",
                "1.1",
                "1.2"
            ]
        },
        {
            "format": "TSV",
            "fileExtensions": [
                ".tsv",
                ".tab"
            ],
            "contentTypes": [
                "text/tab-separated-values"
            ],
            "versions": []
        },
        {
            "format": "CSV",
            "fileExtensions": [
                ".csv"
            ],
            "contentTypes": [
                "text/csv"
            ],
            "versions": []
        },
        {
            "format": "RichTextFormat",
            "fileExtensions": [
                ".rtf"
            ],
            "contentTypes": [
                "application/rtf"
            ],
            "versions": []
        },
        {
            "format": "WordDocument",
            "fileExtensions": [
                ".doc"
            ],
            "contentTypes": [
                "application/msword"
            ],
            "versions": []
        },
        {
            "format": "PowerpointPresentation",
            "fileExtensions": [
                ".ppt"
            ],
            "contentTypes": [
                "application/vnd.ms-powerpoint"
            ],
            "versions": []
        },
        {
            "format": "ExcelSpreadsheet",
            "fileExtensions": [
                ".xls"
            ],
            "contentTypes": [
                "application/vnd.ms-excel"
            ],
            "versions": []
        },
        {
            "format": "OpenDocumentText",
            "fileExtensions": [
                ".odt"
            ],
            "contentTypes": [
                "application/vnd.oasis.opendocument.text"
            ],
            "versions": []
        },
        {
            "format": "OpenDocumentPresentation",
            "fileExtensions": [
                ".odp"
            ],
            "contentTypes": [
                "application/vnd.oasis.opendocument.presentation"
            ],
            "versions": []
        },
        {
            "format": "OpenDocumentSpreadsheet",
            "fileExtensions": [
                ".ods"
            ],
            "contentTypes": [
                "application/vnd.oasis.opendocument.spreadsheet"
            ],
            "versions": []
        },
        {
            "format": "Markdown",
            "fileExtensions": [
                ".markdown",
                ".mdown",
                ".mkdn",
                ".md",
                ".mkd",
                ".mdwn",
                ".mdtxt",
                ".mdtext",
                ".rmd"
            ],
            "contentTypes": [
                "text/markdown",
                "text/x-markdown",
                "text/plain"
            ],
            "versions": []
        },
        {
            "format": "Mhtml",
            "fileExtensions": [
                ".mhtml",
                ".mht"
            ],
            "contentTypes": [
                "message/rfc822",
                "application/x-mimearchive",
                "multipart/related"
            ],
            "versions": []
        }
    ]
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
