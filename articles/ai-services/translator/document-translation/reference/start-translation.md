---
title: Start translation
titleSuffix: Azure AI services
description: Start a document translation request with the Document Translation service.
#services: cognitive-services
manager: nitinme
ms.author: lajanuar
author: laujan
ms.service: azure-ai-translator
ms.topic: reference
ms.date: 09/07/2023
---

# Start translation

<!-- markdownlint-disable MD036 -->

Reference</br>
Service: **Azure AI Document Translation**</br>
API Version: **v1.1**</br>

Use this API to start a translation request with the Document Translation service. Each request can contain multiple documents and must contain a source and destination container for each document.

The prefix and suffix filter (if supplied) are used to filter folders. The prefix is applied to the subpath after the container name.

Glossaries / Translation memory can be included in the request and applied by the service when the document is translated.

If the glossary is invalid or unreachable during translation, an error is indicated in the document status. If a file with the same name already exists in the destination, the job fails. The targetUrl for each target language must be unique.

## Request URL

Send a `POST` request to:
```HTTP
POST https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.1/batches
```

Learn how to find your [custom domain name](../quickstarts/document-translation-rest-api.md).

> [!IMPORTANT]
>
> * **All API requests to the Document Translation service require a custom domain endpoint**.
> * You can't use the endpoint found on your Azure portal resource _Keys and Endpoint_ page nor the global translator endpoint—`api.cognitive.microsofttranslator.com`—to make HTTP requests to Document Translation.

## Request headers

Request headers are:

|Headers|Description|
|--- |--- |
|Ocp-Apim-Subscription-Key|Required request header|

## BatchRequest (body)

Definition for the input batch translation request. Each request can contain multiple documents and must contain a source and target container for each document. Source media types: `application/json`, `text/json`, `application/*+json`.

```json

{
  "inputs": [
    {
      "source": {
        "sourceUrl": "https://myblob.blob.core.windows.net/Container/",
        "filter": {
          "prefix": "FolderA",
          "suffix": ".txt"
        },
        "language": "en",
        "storageSource": "AzureBlob"
      },
      "targets": [
        {
          "targetUrl": "https://myblob.blob.core.windows.net/TargetUrl/",
          "category": "general",
          "language": "fr",
          "glossaries": [
            {
              "glossaryUrl": "https://myblob.blob.core.windows.net/Container/myglossary.tsv",
              "format": "XLIFF",
              "version": "2.0",
              "storageSource": "AzureBlob"
            }
          ],
          "storageSource": "AzureBlob"
        }
      ],
      "storageType": "Folder"
    }
  ],
  "options": {
    "experimental": true
  }
}

```

## Inputs

Definition for the input batch translation request.

|Key parameter|Type|Required|Request parameters|Description|
|--- |---|---|---|--|
|**inputs**| `array`|True|&bullet; source (object)</br></br>&bullet; targets (array)</br></br>&bullet; storageType (string)|Input source data.|

### inputs.source

Definition for the source data.

|Key parameter|Type|Required|Request parameters|Description|
|--- |---|---|---|--|
|**inputs.source** |`object`|True|&bullet; sourceUrl (string)</br></br>&bullet; filter (object)</br></br>&bullet; language (string)</br></br>&bullet; storageSource (string)|Source data for input documents.|
|**inputs.source.sourceUrl**|`string`|True|&bullet; string|Container location for the source file or folder.|
|**inputs.source.filter**|`object`|False|&bullet; prefix (string)</br></br>&bullet; suffix (string)|Case-sensitive strings to filter documents in the source path.|
|**inputs.source.filter.prefix**|`string`|False|&bullet; string|Case-sensitive prefix string to filter documents in the source path for translation. Often used to designate sub-folders for translation. Example: "_FolderA_".|
|**inputs.source.filter.suffix**|`string`|False|&bullet; string|Case-sensitive suffix string to filter documents in the source path for translation. Most often used for file extensions. Example: "_.txt_"|
|**inputs.source.language**|`string`|False|&bullet; string|The language code for the source documents. If not specified, auto-detect is implemented.
|**inputs.source.storageSource**|`string`|False|&bullet; string|Storage source for inputs. Defaults to "AzureBlob".|

### inputs.targets

Definition for target and glossaries data.

|Key parameter|Type|Required|Request parameters|Description|
|--- |---|---|---|--|
|**inputs.targets**|`array`|True|&bullet; targetUrl (string)</br></br>&bullet; category (string)</br></br>&bullet; language (string)</br></br>&bullet; glossaries (array)</br></br>&bullet; storageSource (string)|Targets and glossaries data for translated documents.|
|**inputs.targets.targetUrl**|`string`|True|&bullet; string|Location of the container location for translated documents.|
|**inputs.targets.category**|`string`|False|&bullet; string|Classification or category for the translation request. Example: "_general_".|
|**inputs.targets.language**|`string`|True|&bullet; string|Target language code. Example: "_fr_".|
|**inputs.targets.glossaries**|`array`|False|&bullet; glossaryUrl (string)</br></br>&bullet; format (string)</br></br>&bullet; version (string)</br></br>&bullet; storageSource (string)|_See_ [Create and use glossaries](../how-to-guides/create-use-glossaries.md)|
|**inputs.targets.glossaries.glossaryUrl**|`string`|True (if using glossaries)|&bullet; string|Location of the glossary. The file extension is used to extract the formatting if the format parameter isn't supplied. If the translation language pair isn't present in the glossary, it isn't applied.|
|**inputs.targets.glossaries.format**|`string`|False|&bullet; string|Specified file format for glossary. To check if your file format is supported, _see_ [Get supported glossary formats](get-supported-glossary-formats.md).|
|**inputs.targets.glossaries.version**|`string`|False|&bullet; string|Version indicator. Example: "_2.0_".|
|**inputs.targets.glossaries.storageSource**|`string`|False|&bullet; string|Storage source for glossaries. Defaults to "_AzureBlob_".|
|**inputs.targets.storageSource**|`string`|False|&bullet; string|Storage source for targets.Defaults to "_AzureBlob_".|

### inputs.storageType

Definition of the storage entity for input documents.

|Key parameter|Type|Required|Request parameters|Description|
|--- |---|---|---|--|
|**inputs.storageType**|`string`|False|&bullet;`Folder`</br></br>&bullet; `File`|Storage type of the input documents source string. Only "_Folder_" or "_File_" are valid values.|

## Options

Definition for the input batch translation request.

|Key parameter|Type|Required|Request parameters|Description|
|--- |---|---|---|--|
|**options**|`object`|False|Source information for input documents.|
|**options.experimental**|`boolean`|False|&bullet;`true`</br></br>&bullet; `false`|Indicates whether the request will include an experimental feature (if applicable). Only the booleans _`true`_ or _`false`_ are valid values.|

## Example request

The following are examples of batch requests.

> [!NOTE]
> In the following examples, limited access has been granted to the contents of an Azure Storage container [using a shared access signature(SAS)](../../../../storage/common/storage-sas-overview.md) token.

**Translating all documents in a container**

```json
{
    "inputs": [
        {
            "source": {
                "sourceUrl": "https://my.blob.core.windows.net/source-en?sv=2019-12-12&st=2021-03-05T17%3A45%3A25Z&se=2021-03-13T17%3A45%3A00Z&sr=c&sp=rl&sig=SDRPMjE4nfrH3csmKLILkT%2Fv3e0Q6SWpssuuQl1NmfM%3D"
            },
            "targets": [
                {
                    "targetUrl": "https://my.blob.core.windows.net/target-fr?sv=2019-12-12&st=2021-03-05T17%3A49%3A02Z&se=2021-03-13T17%3A49%3A00Z&sr=c&sp=wdl&sig=Sq%2BYdNbhgbq4hLT0o1UUOsTnQJFU590sWYo4BOhhQhs%3D",
                    "language": "fr"
                }
            ]
        }
    ]
}
```

**Translating all documents in a container applying glossaries**

```json
{
    "inputs": [
        {
            "source": {
                "sourceUrl": "https://my.blob.core.windows.net/source-en?sv=2019-12-12&st=2021-03-05T17%3A45%3A25Z&se=2021-03-13T17%3A45%3A00Z&sr=c&sp=rl&sig=SDRPMjE4nfrH3csmKLILkT%2Fv3e0Q6SWpssuuQl1NmfM%3D"
            },
            "targets": [
                {
                    "targetUrl": "https://my.blob.core.windows.net/target-fr?sv=2019-12-12&st=2021-03-05T17%3A49%3A02Z&se=2021-03-13T17%3A49%3A00Z&sr=c&sp=wdl&sig=Sq%2BYdNbhgbq4hLT0o1UUOsTnQJFU590sWYo4BOhhQhs%3D",
                    "language": "fr",
                    "glossaries": [
                        {
                            "glossaryUrl": "https://my.blob.core.windows.net/glossaries/en-fr.xlf?sv=2019-12-12&st=2021-03-05T17%3A45%3A25Z&se=2021-03-13T17%3A45%3A00Z&sr=c&sp=rl&sig=BsciG3NWoOoRjOYesTaUmxlXzyjsX4AgVkt2AsxJ9to%3D",
                            "format": "xliff",
                            "version": "1.2"
                        }
                    ]

                }
            ]
        }
    ]
}
```

**Translating specific folder in a container**

Make sure you've specified the folder name (case sensitive) as prefix in filter.

```json
{
    "inputs": [
        {
            "source": {
                "sourceUrl": "https://my.blob.core.windows.net/source-en?sv=2019-12-12&st=2021-03-05T17%3A45%3A25Z&se=2021-03-13T17%3A45%3A00Z&sr=c&sp=rl&sig=SDRPMjE4nfrH3csmKLILkT%2Fv3e0Q6SWpssuuQl1NmfM%3D",
                "filter": {
                    "prefix": "MyFolder/"
                }
            },
            "targets": [
                {
                    "targetUrl": "https://my.blob.core.windows.net/target-fr?sv=2019-12-12&st=2021-03-05T17%3A49%3A02Z&se=2021-03-13T17%3A49%3A00Z&sr=c&sp=wdl&sig=Sq%2BYdNbhgbq4hLT0o1UUOsTnQJFU590sWYo4BOhhQhs%3D",
                    "language": "fr"
                }
            ]
        }
    ]
}
```

**Translating specific document in a container**

* Specify "storageType": "File"
* Create source URL & SAS token for the specific blob/document.
* Specify the target filename as part of the target URL – though the SAS token is still for the container.

This sample request shows a single document translated into two target languages

```json
{
    "inputs": [
        {
            "storageType": "File",
            "source": {
                "sourceUrl": "https://my.blob.core.windows.net/source-en/source-english.docx?sv=2019-12-12&st=2021-01-26T18%3A30%3A20Z&se=2021-02-05T18%3A30%3A00Z&sr=c&sp=rl&sig=d7PZKyQsIeE6xb%2B1M4Yb56I%2FEEKoNIF65D%2Fs0IFsYcE%3D"
            },
            "targets": [
                {
                    "targetUrl": "https://my.blob.core.windows.net/target/try/Target-Spanish.docx?sv=2019-12-12&st=2021-01-26T18%3A31%3A11Z&se=2021-02-05T18%3A31%3A00Z&sr=c&sp=wl&sig=AgddSzXLXwHKpGHr7wALt2DGQJHCzNFF%2F3L94JHAWZM%3D",
                    "language": "es"
                },
                {
                    "targetUrl": "https://my.blob.core.windows.net/target/try/Target-German.docx?sv=2019-12-12&st=2021-01-26T18%3A31%3A11Z&se=2021-02-05T18%3A31%3A00Z&sr=c&sp=wl&sig=AgddSzXLXwHKpGHr7wALt2DGQJHCzNFF%2F3L94JHAWZM%3D",
                    "language": "de"
                }
            ]
        }
    ]
}
```

## Response status codes

The following are the possible HTTP status codes that a request returns.

|Status Code|Description|
|--- |--- |
|202|Accepted. Successful request and the batch request created. The header Operation-Location indicates a status url with the operation ID.HeadersOperation-Location: string|
|400|Bad Request. Invalid request. Check input parameters.|
|401|Unauthorized. Check your credentials.|
|429|Request rate is too high.|
|500|Internal Server Error.|
|503|Service is currently unavailable.  Try again later.|
|Other Status Codes|<ul><li>Too many requests</li><li>Server temporary unavailable</li></ul>|

## Error response

|Key parameter|Type|Description|
|--- |--- |--- |
|code|`string`|Enums containing high-level error codes. Possible values:<br/><ul><li>InternalServerError</li><li>InvalidArgument</li><li>InvalidRequest</li><li>RequestRateTooHigh</li><li>ResourceNotFound</li><li>ServiceUnavailable</li><li>Unauthorized</li></ul>|
|message|`string`|Gets high-level error message.|
|innerError|InnerTranslationError|New Inner Error format that conforms to Azure AI services API Guidelines. This error message contains required properties: ErrorCode, message and optional properties target, details(key value pair), and inner error(it can be nested).|
|inner.Errorcode|`string`|Gets code error string.|
|innerError.message|`string`|Gets high-level error message.|
|innerError.target|`string`|Gets the source of the error. For example, it would be `documents` or `document id` if the document is invalid.|

## Examples

### Example successful response

The following information is returned in a successful response.

You can find the job ID in the POST method's response Header Operation-Location URL value. The last parameter of the URL is the operation's job ID (the string following "/operation/").

```HTTP
Operation-Location: https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.1/operation/0FA2822F-4C2A-4317-9C20-658C801E0E55
```

### Example error response

```JSON
{
  "error": {
    "code": "ServiceUnavailable",
    "message": "Service is temporary unavailable",
    "innerError": {
      "code": "ServiceTemporaryUnavailable",
      "message": "Service is currently unavailable.  Please try again later"
    }
  }
}
```

## Next steps

Follow our quickstart to learn more about using Document Translation and the client library.

> [!div class="nextstepaction"]
> [Get started with Document Translation](../quickstarts/document-translation-rest-api.md)
