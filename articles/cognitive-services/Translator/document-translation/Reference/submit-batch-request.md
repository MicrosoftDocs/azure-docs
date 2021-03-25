---
title: Document Translation Submit Batch Request
titleSuffix: Azure Cognitive Services
description: Submit a document translation request to the Document Translation service.
services: cognitive-services
author: jann-skotdal
manager: nitinme

ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: reference
ms.date: 03/03/2021
ms.author: v-jansk
---

# Document Translation: Submit Batch Request

Use this API to submit a bulk (batch) translation request to the Document Translation service. Each request can contain multiple documents and must contain a source and destination container for each document.

The prefix and suffix filter (if supplied) are used to filter folders. The prefix is applied to the subpath after the container name.

Glossaries / Translation memory can be included in the request and are applied by the service when the document is translated.

If the glossary is invalid or unreachable during translation, an error is indicated in the document status. If a file with the same name already exists at the destination, it will be overwritten. The targetUrl for each target language must be unique.

## Request URL

Send a `POST` request to:
```HTTP
POST https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0-preview.1/batches
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

## Request Body: Batch Submission Request

<table width="100%">
  <th width="20%">Name</th>
  <th>Type</th>
  <th>Description</th>
  <tr>
    <td>inputs</td>
    <td>BatchRequest[]</td>
    <td>BatchRequest listed below. The input list of documents or folders containing documents. Media Types: "application/json", "text/json", "application/*+json".
    </td>
  </tr>
</table>

### inputs

Definition for the input batch translation request.

<table width="100%">
  <th width="20%">Name</th>
  <th>Type</th>
  <th>Required</th>
  <th>Description</th>
  <tr>
    <td>source</td>
    <td>SourceInput[]</td>
    <td>True</td>
    <td>inputs.source listed below. Source of the input documents.
    </td>
  </tr>
  <tr>
    <td>storageType</td>
    <td>StorageInputType[]</td>
    <td>True</td>
    <td>inputs.storageType listed below. Storage type of the input documents source string.
    </td>
  </tr>
  <tr>
    <td>targets</td>
    <td>TargetInput[]</td>
    <td>True</td>
    <td>inputs.target listed below. Location of the destination for the output.
    </td>
  </tr>
</table>

**inputs.source**

Source of the input documents.

<table width="100%">
  <th width="20%">Name</th>
  <th>Type</th>
  <th>Required</th>
  <th>Description</th>
  <tr>
    <td>filter</td>
    <td>DocumentFilter[]</td>
    <td>False</td>
    <td>DocumentFilter[] listed below.</td>
  </tr>
  <tr>
    <td>filter.prefix</td>
    <td>string</td>
    <td>False</td>
    <td>A case-sensitive prefix string to filter documents in the source path for translation. For example, when using an Azure storage blob Uri, use the prefix to restrict sub folders for translation.</td>
  </tr>
  <tr>
    <td>filter.suffix</p></td>
    <td>string</td>
    <td>False</td>
    <td>A case-sensitive suffix string to filter documents in the source path for translation. This is most often use for file extensions.
    </td>
  </tr>
  <tr>
    <td>language</td>
    <td>string</td>
    <td>False</td>
    <td>Language code If none is specified, we will perform auto detect on the document.
    </td>
  </tr>
  <tr>
    <td>sourceUrl</td>
    <td>string</td>
    <td>True</td>
    <td>Location of the folder / container or single file with your documents.
    </td>
  </tr>
  <tr>
    <td>storageSource</td>
    <td>StorageSource</td>
    <td>False</td>
    <td>StorageSource listed below.
    </td>
  </tr>
    <tr>
    <td>storageSource.AzureBlob</p></td>
    <td>string</td>
    <td>False</td>
    <td></td>
  </tr>
</table>

**inputs.storageType**

Storage type of the input documents source string.

<table width="100%">
  <th width="20%">Name</th>
  <th>Type</th>
  <tr>
    <td>file</td>
    <td>string</td>
  </tr>
  <tr>
    <td>folder</td>
    <td>string</td>
  </tr>
</table>

**inputs.target**

Destination for the finished translated documents.

<table width="100%">
  <th width="20%">Name</th>
  <th>Type</th>
  <th>Required</th>
  <th>Description</th>
  <tr>
    <td>category</td>
    <td>string</td>
    <td>False</td>
    <td>Category / custom system for translation request.
    </td>
  </tr>
  <tr>
    <td>glossaries</td>
    <td>Glossary[]</td>
    <td>False</td>
    <td>Glossary listed below. List of Glossary.
    </td>
  </tr>
    <tr>
    <td>glossaries.format</p></td>
    <td>string</td>
   <td>False</td>
    <td>Format.
    </td>
  </tr>
  <tr>
    <td>glossaries.glossaryUrl</p></td>
    <td>string</td>
    <td>True (if using glossaries)</td>
    <td>Location of the glossary. We will use the file extension to extract the formatting if the format parameter isn't supplied. <br/><br/>If the translation language pair isn't present in the glossary, it won't be applied.
    </td>
  </tr>
  <tr>
    <td>glossaries.storageSource</p></td>
    <td>StorageSource</td>
    <td>False</td>
    <td>StorageSource listed above.
    </td>
  </tr>
  <tr>
    <td>targetUrl</p></td>
    <td>string</td>
    <td>True</td>
    <td>Location of the folder / container with your documents.
    </td>
  </tr>
  <tr>
    <td>language</td>
    <td>string</td>
    <td>True</td>
    <td>Two letter Target Language code. See list of <a href"https://docs.microsoft.com/azure/cognitive-services/translator/language-support">language codes</a>.
    </td>
  </tr>
  <tr>
    <td>storageSource</td>
    <td>StorageSource []</td>
    <td>False</td>
    <td>StorageSource [] listed above.
    </td>
  </tr>
  <tr>
    <td>version</td>
    <td>string</td>
    <td>False</td>
    <td>Version.
    </td>
  </tr>
</table>



## Example Request

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

<table width="100%">
  <th width="20%">Status Code</th>
  <th>Description</th>
  <tr>
    <td>202</td>
    <td>Accepted. Successful request and the batch request is created by the service. The header Operation-Location will indicate a status url with the operation ID.<br/><br/>Headers<br/>Operation-Location: string
  </tr>
  <tr>
    <td>400</td>
    <td>Bad Request. Invalid request. Check input parameters.</td>
  </tr>
  <tr>
    <td>401</td>
    <td>Unauthorized. Please check your credentials.</td>
  </tr>
  <tr>
    <td>429</td>
    <td>Request rate is too high.</td>
  </tr>
  <tr>
    <td>500</td>
    <td>Internal Server Error.</td>
  </tr>
  <tr>
  <tr>
    <td>503</td>
    <td>Service is currently unavailable.  Please try again later.</td>
  </tr>
  <tr>
    <td>Other Status Codes</td>
    <td><ul><li>Too many requests</li><li>Server temporary unavailable</li></ul></td>
  </tr>
</table>

## Error Response

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
    <td>inner.Errorcode</p></td>
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
The following information is returned in a successful response.

You can find the job ID in the The POST method's response Header Operation-Location URL value. The last parameter of the URL is the operation's job ID (the string following "/operation/").

```HTTP
Operation-Location: https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0.preview.1/operation/0FA2822F-4C2A-4317-9C20-658C801E0E55
```

### Example Error Response

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
