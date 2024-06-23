---
title: Get supported glossary formats method
titleSuffix: Azure AI services
description: The get supported glossary formats method returns the list of supported glossary formats.
#services: cognitive-services
manager: nitinme
ms.author: lajanuar
author: laujan
ms.service: azure-ai-translator
ms.topic: reference
ms.date: 02/09/2024
---

# Get supported glossary formats

Reference</br>
Feature: **Azure AI Translator → Document Translation**</br>
API Version: **2024-05-01**</br>
HTTP method: **GET**

This method returns a list of glossary formats supported by the Document Translation feature. The list includes the common file extensions.

## Request URL

> [!IMPORTANT]
>
> **All API requests to the Document Translation feature require a custom domain endpoint that is located on your resource overview page in the Azure portal**.

```bash
curl -i -X GET "{document-translation-endpoint}/translator/document/formats?api-version={date}&type=glossary"
```

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
|200|OK. Returns the list of supported glossary file formats.|
|500|Internal Server Error.|
|Other Status Codes|&bullet; Too many requests<br>&bullet; Server temporary unavailable|


## Get supported glossary formats response

Base type for list return in the Get supported glossary formats API.

### Successful get supported glossary formats response

Base type for list return in the Get supported glossary formats API.

|Name|Type|Description|
|--- |--- |--- |
|value|FileFormat []|FileFormat[] contains the listed details.|
|value.contentTypes|string []|Supported Content-Types for this format.|
|value.defaultVersion|string|Default version if none is specified|
|value.fileExtensions|string []| Supported file extension for this format.|
|value.format|string|Name of the format.|
|value.versions|string []| Supported version.|

### Error response

|Name|Type|Description|
|--- |--- |--- |
|code|string|Enums containing high-level error codes. Possible values:<br/>&bullet; InternalServerError<br>&bullet; InvalidArgument<br>&bullet; InvalidRequest<br>&bullet; RequestRateTooHigh<br>&bullet; ResourceNotFound<br>&bullet; ServiceUnavailable<br>&bullet; Unauthorized|
|message|string|Gets high-level error message.|
|innerError|InnerTranslationError|New Inner Error format that conforms to Azure AI services API Guidelines. This error message contains required properties ErrorCode, message, and optional properties target, details(key value pair), inner error(it can be nested).|
|innerError.code|string|Gets code error string.|
|innerError.message|string|Gets high-level error message.|
|innerError.target|string|Gets the source of the error. For example, it would be `documents` or `document id` if there was invalid document.|

## Examples

### Example successful response

The following JSON object is an example of a successful response.

```JSON
{
    "value": [
        {
            "format": "XLIFF",
            "fileExtensions": [
                ".xlf"
            ],
            "contentTypes": [
                "application/xliff+xml"
            ],
            "defaultVersion": "1.2",
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
            ]
        },
        {
            "format": "CSV",
            "fileExtensions": [
                ".csv"
            ],
            "contentTypes": [
                "text/csv"
            ]
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
