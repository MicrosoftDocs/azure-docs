---
title: Start translation
titleSuffix: Azure Cognitive Services
description: Start a document translation request with the Document Translation service.
services: cognitive-services
author: jann-skotdal
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 03/25/2021
ms.author: v-jansk
---

# Start translation

Use this API to start a bulk (batch) translation request with the Document Translation service. Each request can contain multiple documents and must contain a source and destination container for each document.

The prefix and suffix filter (if supplied) are used to filter folders. The prefix is applied to the subpath after the container name.

Glossaries / Translation memory can be included in the request and are applied by the service when the document is translated.

If the glossary is invalid or unreachable during translation, an error is indicated in the document status. If a file with the same name already exists at the destination, it will be overwritten. The targetUrl for each target language must be unique.

## Request URL

Send a `POST` request to:
```HTTP
POST https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches
```

Learn how to find your [custom domain name](../get-started-with-document-translation.md#find-your-custom-domain-name).

> [!IMPORTANT]
>
> * **All API requests to the Document Translation service require a custom domain endpoint**.
> * You can't use the endpoint found on your Azure portal resource _Keys and Endpoint_ page nor the global translator endpoint—`api.cognitive.microsofttranslator.com`—to make HTTP requests to Document Translation.

## Request headers

Request headers are:

|Headers|Description|
|--- |--- |
|Ocp-Apim-Subscription-Key|Required request header|

## Request Body: Batch Submission Request

|Name|Type|Description|
|--- |--- |--- |
|inputs|BatchRequest[]|BatchRequest listed below. The input list of documents or folders containing documents. Media Types: "application/json", "text/json", "application/*+json".|

### Inputs

Definition for the input batch translation request.

|Name|Type|Required|Description|
|--- |--- |--- |--- |
|source|SourceInput[]|True|inputs.source listed below. Source of the input documents.|
|storageType|StorageInputType[]|True|inputs.storageType listed below. Storage type of the input documents source string.|
|targets|TargetInput[]|True|inputs.target listed below. Location of the destination for the output.|

**inputs.source**

Source of the input documents.

|Name|Type|Required|Description|
|--- |--- |--- |--- |
|filter|DocumentFilter[]|False|DocumentFilter[] listed below.|
|filter.prefix|string|False|A case-sensitive prefix string to filter documents in the source path for translation. For example, when using an Azure storage blob Uri, use the prefix to restrict sub folders for translation.|
|filter.suffix|string|False|A case-sensitive suffix string to filter documents in the source path for translation. This is most often use for file extensions.|
|language|string|False|Language code If none is specified, we will perform auto detect on the document.|
|sourceUrl|string|True|Location of the folder / container or single file with your documents.|
|storageSource|StorageSource|False|StorageSource listed below.|
|storageSource.AzureBlob|string|False||

**inputs.storageType**

Storage type of the input documents source string.

|Name|Type|
|--- |--- |
|file|string|
|folder|string|

**inputs.target**

Destination for the finished translated documents.

|Name|Type|Required|Description|
|--- |--- |--- |--- |
|category|string|False|Category / custom system for translation request.|
|glossaries|Glossary[]|False|Glossary listed below. List of Glossary.|
|glossaries.format|string|False|Format.|
|glossaries.glossaryUrl|string|True (if using glossaries)|Location of the glossary. We will use the file extension to extract the formatting if the format parameter isn't supplied. If the translation language pair isn't present in the glossary, it won't be applied.|
|glossaries.storageSource|StorageSource|False|StorageSource listed above.|
|targetUrl|string|True|Location of the folder / container with your documents.|
|language|string|True|Two letter Target Language code. See [list of language codes](../../language-support.md).|
|storageSource|StorageSource []|False|StorageSource [] listed above.|
|version|string|False|Version.|

## Example request

The following are examples of batch requests.

**Translating all documents in a container**

```json
{
    "inputs": [
        {
            "source": {
                "sourceUrl": https://my.blob.core.windows.net/source-en?sv=2019-12-12&st=2021-03-05T17%3A45%3A25Z&se=2021-03-13T17%3A45%3A00Z&sr=c&sp=rl&sig=SDRPMjE4nfrH3csmKLILkT%2Fv3e0Q6SWpssuuQl1NmfM%3D
            },
            "targets": [
                {
                    "targetUrl": https://my.blob.core.windows.net/target-fr?sv=2019-12-12&st=2021-03-05T17%3A49%3A02Z&se=2021-03-13T17%3A49%3A00Z&sr=c&sp=wdl&sig=Sq%2BYdNbhgbq4hLT0o1UUOsTnQJFU590sWYo4BOhhQhs%3D,
                    "language": "fr"
                }
            ]
        }
    ]
}
```

**Translating all documents in a container applying glossaries**

Ensure you have created glossary URL & SAS token for the specific blob/document (not for the container)

```json
{
    "inputs": [
        {
            "source": {
                "sourceUrl": https://my.blob.core.windows.net/source-en?sv=2019-12-12&st=2021-03-05T17%3A45%3A25Z&se=2021-03-13T17%3A45%3A00Z&sr=c&sp=rl&sig=SDRPMjE4nfrH3csmKLILkT%2Fv3e0Q6SWpssuuQl1NmfM%3D
            },
            "targets": [
                {
                    "targetUrl": https://my.blob.core.windows.net/target-fr?sv=2019-12-12&st=2021-03-05T17%3A49%3A02Z&se=2021-03-13T17%3A49%3A00Z&sr=c&sp=wdl&sig=Sq%2BYdNbhgbq4hLT0o1UUOsTnQJFU590sWYo4BOhhQhs%3D,
                    "language": "fr"
     "glossaries": [
                        {
                            "glossaryUrl": https://my.blob.core.windows.net/glossaries/en-fr.xlf?sv=2019-12-12&st=2021-03-05T17%3A45%3A25Z&se=2021-03-13T17%3A45%3A00Z&sr=c&sp=rl&sig=BsciG3NWoOoRjOYesTaUmxlXzyjsX4AgVkt2AsxJ9to%3D,
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

Ensure you have specified the folder name (case sensitive) as prefix in filter – though the SAS token is still for the container.

```json
{
    "inputs": [
        {
            "source": {
                "sourceUrl": https://my.blob.core.windows.net/source-en?sv=2019-12-12&st=2021-03-05T17%3A45%3A25Z&se=2021-03-13T17%3A45%3A00Z&sr=c&sp=rl&sig=SDRPMjE4nfrH3csmKLILkT%2Fv3e0Q6SWpssuuQl1NmfM%3D,
                "filter": {
                    "prefix": "MyFolder/"
                }
            },
            "targets": [
                {
                    "targetUrl": https://my.blob.core.windows.net/target-fr?sv=2019-12-12&st=2021-03-05T17%3A49%3A02Z&se=2021-03-13T17%3A49%3A00Z&sr=c&sp=wdl&sig=Sq%2BYdNbhgbq4hLT0o1UUOsTnQJFU590sWYo4BOhhQhs%3D,
                    "language": "fr"
                }
            ]
        }
    ]
}
```

**Translating specific document in a container**

* Ensure you have specified "storageType": "File"
* Ensure you have created source URL & SAS token for the specific blob/document (not for the container)
* Ensure you have specified the target filename as part of the target URL – though the SAS token is still for the container.
* Sample request below shows a single document getting translated into two target languages

```json
{
    "inputs": [
        {
            "storageType": "File",
            "source": {
                "sourceUrl": https://my.blob.core.windows.net/source-en/source-english.docx?sv=2019-12-12&st=2021-01-26T18%3A30%3A20Z&se=2021-02-05T18%3A30%3A00Z&sr=c&sp=rl&sig=d7PZKyQsIeE6xb%2B1M4Yb56I%2FEEKoNIF65D%2Fs0IFsYcE%3D
            },
            "targets": [
                {
                    "targetUrl": https://my.blob.core.windows.net/target/try/Target-Spanish.docx?sv=2019-12-12&st=2021-01-26T18%3A31%3A11Z&se=2021-02-05T18%3A31%3A00Z&sr=c&sp=wl&sig=AgddSzXLXwHKpGHr7wALt2DGQJHCzNFF%2F3L94JHAWZM%3D,
                    "language": "es"
                },
                {
                    "targetUrl": https://my.blob.core.windows.net/target/try/Target-German.docx?sv=2019-12-12&st=2021-01-26T18%3A31%3A11Z&se=2021-02-05T18%3A31%3A00Z&sr=c&sp=wl&sig=AgddSzXLXwHKpGHr7wALt2DGQJHCzNFF%2F3L94JHAWZM%3D,
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
|202|Accepted. Successful request and the batch request are created by the service. The header Operation-Location will indicate a status url with the operation ID.HeadersOperation-Location: string|
|400|Bad Request. Invalid request. Check input parameters.|
|401|Unauthorized. Please check your credentials.|
|429|Request rate is too high.|
|500|Internal Server Error.|
|503|Service is currently unavailable.  Please try again later.|
|Other Status Codes|<ul><li>Too many requests</li><li>Server temporary unavailable</li></ul>|

## Error response

|Name|Type|Description|
|--- |--- |--- |
|code|string|Enums containing high-level error codes. Possible values:<br/><ul><li>InternalServerError</li><li>InvalidArgument</li><li>InvalidRequest</li><li>RequestRateTooHigh</li><li>ResourceNotFound</li><li>ServiceUnavailable</li><li>Unauthorized</li></ul>|
|message|string|Gets high-level error message.|
|innerError|InnerErrorV2|New Inner Error format, which conforms to Cognitive Services API Guidelines. It contains required properties ErrorCode, message and optional properties target, details(key value pair), inner error (this can be nested).|
|inner.Errorcode|string|Gets code error string.|
|innerError.message|string|Gets high-level error message.|

## Examples

### Example successful response

The following information is returned in a successful response.

You can find the job ID in the POST method's response Header Operation-Location URL value. The last parameter of the URL is the operation's job ID (the string following "/operation/").

```HTTP
Operation-Location: https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0.preview.1/operation/0FA2822F-4C2A-4317-9C20-658C801E0E55
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
> [Get started with Document Translation](../get-started-with-document-translation.md)
