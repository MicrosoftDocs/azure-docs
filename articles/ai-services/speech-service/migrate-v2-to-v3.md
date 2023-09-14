---
title: Migrate from v2 to v3 REST API - Speech service
titleSuffix: Azure AI services
description: This document helps developers migrate code from v2 to v3 of the Speech to text REST API.speech-to-text REST API.
services: cognitive-services
author: bexxx
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 11/29/2022
ms.author: rbeckers
ms.custom: devx-track-csharp
---

# Migrate code from v2.0 to v3.0 of the REST API

Compared to v2, the v3 version of the Speech services REST API for speech to text is more reliable, easier to use, and more consistent with APIs for similar services. Most teams can migrate from v2 to v3 in a day or two.

> [!IMPORTANT]
> The Speech to text REST API v2.0 is deprecated and will be retired by February 29, 2024. Please migrate your applications to the Speech to text REST API v3.1. Complete the steps in this article and then see the [Migrate code from v3.0 to v3.1 of the REST API](migrate-v3-0-to-v3-1.md) guide for additional requirements.

## Forward compatibility

All entities from v2 can also be found in the v3 API under the same identity. Where the schema of a result has changed, (for example, transcriptions), the result of a GET in the v3 version of the API uses the v3 schema. The result of a GET in the v2 version of the API uses the same v2 schema. Newly created entities on v3 aren't available in responses from v2 APIs. 

## Migration steps

This is a summary list of items you need to be aware of when you are preparing for migration. Details are found in the individual links. Depending on your current use of the API not all steps listed here may apply. Only a few changes require non-trivial changes in the calling code. Most changes just require a change to item names. 

General changes: 

1. [Change the host name](#host-name-changes)

1. [Rename the property id to self in your client code](#identity-of-an-entity) 

1. [Change code to iterate over collections of entities](#working-with-collections-of-entities)

1. [Rename the property name to displayName in your client code](#name-of-an-entity)

1. [Adjust the retrieval of the metadata of referenced entities](#accessing-referenced-entities)

1. If you use Batch transcription: 

    * [Adjust code for creating batch transcriptions](#creating-transcriptions) 

    * [Adapt code to the new transcription results schema](#format-of-v3-transcription-results)

    * [Adjust code for how results are retrieved](#getting-the-content-of-entities-and-the-results)

1. If you use Custom model training/testing APIs: 

    * [Apply modifications to custom model training](#customizing-models)

    * [Change how base and custom models are retrieved](#retrieving-base-and-custom-models)

    * [Rename the path segment accuracytests to evaluations in your client code](#accuracy-tests)

1. If you use endpoints APIs:

    * [Change how endpoint logs are retrieved](#retrieving-endpoint-logs)

1. Other minor changes: 

    * [Pass all custom properties as customProperties instead of properties in your POST requests](#using-custom-properties)

    * [Read the location from response header Location instead of Operation-Location](#response-headers)

## Breaking changes

### Host name changes

Endpoint host names have changed from `{region}.cris.ai` to `{region}.api.cognitive.microsoft.com`. Paths to the new endpoints no longer contain `api/` because it's part of the hostname. The [Speech to text REST API v3.0](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0) reference documentation lists valid regions and paths.
>[!IMPORTANT]
>Change the hostname from `{region}.cris.ai` to `{region}.api.cognitive.microsoft.com` where region is the region of your speech subscription. Also remove `api/`from any path in your client code.

### Identity of an entity

The property `id` is now `self`. In v2, an API user had to know how our paths on the API are being created. This was non-extensible and required unnecessary work from the user. The property `id` (uuid) is replaced by `self` (string), which is location of the entity (URL). The value is still unique between all your entities. If `id` is stored as a string in your code, a rename is enough to support the new schema. You can now use the `self` content as the URL for the `GET`, `PATCH`, and `DELETE` REST calls for your entity.

If the entity has additional functionality available through other paths, they are listed under `links`. The following example for transcription shows a separate method to `GET` the content of the transcription:
>[!IMPORTANT]
>Rename the property `id` to `self` in your client code. Change the type from `uuid` to `string` if needed. 

**v2 transcription:**

```json
{
    "id": "9891c965-bb32-4880-b14b-6d44efb158f3",
    "createdDateTime": "2019-01-07T11:34:12Z",
    "lastActionDateTime": "2019-01-07T11:36:07Z",
    "status": "Succeeded",
    "locale": "en-US",
    "name": "Transcription using locale en-US"
}
```

**v3 transcription:**

```json
{
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3",
    "createdDateTime": "2019-01-07T11:34:12Z",
    "lastActionDateTime": "2019-01-07T11:36:07Z",
    "status": "Succeeded",
    "locale": "en-US", 
    "displayName": "Transcription using locale en-US",
    "links": {
      "files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3/files"
    }
}
```

Depending on your code's implementation, it may not be enough to rename the property. We recommend using the returned `self` and `links` values as the target urls of your REST calls, rather than generating paths in your client. By using the returned URLs, you can be sure that future changes in paths will not break your client code.

### Working with collections of entities

Previously the v2 API returned all available entities in a result. To allow a more fine grained control over the expected response size in v3, all collection results are paginated. You have control over the count of returned entities and the starting offset of the page. This behavior makes it easy to predict the runtime of the response processor.

The basic shape of the response is the same for all collections:

```json
{
    "values": [
        {     
        }
    ],
    "@nextLink": "https://{region}.api.cognitive.microsoft.com/speechtotext/v3.0/{collection}?skip=100&top=100"
}
```

The `values` property contains a subset of the available collection entities. The count and offset can be controlled using the `skip` and `top` query parameters. When `@nextLink` is not `null`, there's more data available and the next batch of data can be retrieved by doing a GET on `$.@nextLink`.

This change requires calling the `GET` for the collection in a loop until all elements have been returned.

>[!IMPORTANT]
>When the response of a GET to `speechtotext/v3.1/{collection}` contains a value in `$.@nextLink`, continue issuing `GETs` on `$.@nextLink` until `$.@nextLink` is not set to retrieve all elements of that collection.

### Creating transcriptions

A detailed description on how to create batches of transcriptions can be found in [Batch transcription How-to](./batch-transcription.md).

The v3 transcription API lets you set specific transcription options explicitly. All (optional) configuration properties can now be set in the `properties` property.
Version v3 also supports multiple input files, so it requires a list of URLs rather than a single URL as v2 did. The v2 property name `recordingsUrl` is now `contentUrls` in v3. The functionality of analyzing sentiment in transcriptions has been removed in v3. See [Text Analysis](https://azure.microsoft.com/services/cognitive-services/text-analytics/) for sentiment analysis options.

The new property `timeToLive` under `properties` can help prune the existing completed entities. The `timeToLive` specifies a duration after which a completed entity will be deleted automatically. Set it to a high value (for example `PT12H`) when the entities are continuously tracked, consumed, and deleted and therefore usually processed long before 12 hours have passed.

**v2 transcription POST request body:**

```json
{
  "locale": "en-US",
  "name": "Transcription using locale en-US",
  "recordingsUrl": "https://contoso.com/mystoragelocation",
  "properties": {
    "AddDiarization": "False",
    "AddWordLevelTimestamps": "False",
    "PunctuationMode": "DictatedAndAutomatic",
    "ProfanityFilterMode": "Masked"
  }
}
```

**v3 transcription POST request body:**

```json
{
  "locale": "en-US",
  "displayName": "Transcription using locale en-US",
  "contentUrls": [
    "https://contoso.com/mystoragelocation",
    "https://contoso.com/myotherstoragelocation"
  ],
  "properties": {
    "diarizationEnabled": false,
    "wordLevelTimestampsEnabled": false,
    "punctuationMode": "DictatedAndAutomatic",
    "profanityFilterMode": "Masked"
  }
}
```
>[!IMPORTANT]
>Rename the property `recordingsUrl` to `contentUrls` and pass an array of urls instead of a single url. Pass settings for `diarizationEnabled` or `wordLevelTimestampsEnabled` as `bool` instead of `string`.

### Format of v3 transcription results

The schema of transcription results has changed slightly to align with transcriptions created by real-time endpoints. Find an in-depth description of the new format in the [Batch transcription How-to](./batch-transcription.md). The schema of the result is published in our [GitHub sample repository](https://aka.ms/csspeech/samples) under `samples/batch/transcriptionresult_v3.schema.json`.

Property names are now camel-cased and the values for `channel` and `speaker` now use integer types. Format for durations now use the structure described in ISO 8601, which matches duration formatting used in other Azure APIs.

Sample of a v3 transcription result. The differences are described in the comments.

```json
{
  "source": "...",                      // (new in v3) was AudioFileName / AudioFileUrl
  "timestamp": "2020-06-16T09:30:21Z",  // (new in v3)
  "durationInTicks": 41200000,          // (new in v3) was AudioLengthInSeconds
  "duration": "PT4.12S",                // (new in v3)
  "combinedRecognizedPhrases": [        // (new in v3) was CombinedResults
    {
      "channel": 0,                     // (new in v3) was ChannelNumber
      "lexical": "hello world",
      "itn": "hello world",
      "maskedITN": "hello world",
      "display": "Hello world."
    }
  ],
  "recognizedPhrases": [                // (new in v3) was SegmentResults
    {
      "recognitionStatus": "Success",   // 
      "channel": 0,                     // (new in v3) was ChannelNumber
      "offset": "PT0.07S",              // (new in v3) new format, was OffsetInSeconds
      "duration": "PT1.59S",            // (new in v3) new format, was DurationInSeconds
      "offsetInTicks": 700000.0,        // (new in v3) was Offset
      "durationInTicks": 15900000.0,    // (new in v3) was Duration

      // possible transcriptions of the current phrase with confidences
      "nBest": [
        {
          "confidence": 0.898652852,phrase
          "speaker": 1,
          "lexical": "hello world",
          "itn": "hello world",
          "maskedITN": "hello world",
          "display": "Hello world.",

          "words": [
            {
              "word": "hello",
              "offset": "PT0.09S",
              "duration": "PT0.48S",
              "offsetInTicks": 900000.0,
              "durationInTicks": 4800000.0,
              "confidence": 0.987572
            },
            {
              "word": "world",
              "offset": "PT0.59S",
              "duration": "PT0.16S",
              "offsetInTicks": 5900000.0,
              "durationInTicks": 1600000.0,
              "confidence": 0.906032
            }
          ]
        }
      ]
    }
  ]
}
```
>[!IMPORTANT]
>Deserialize the transcription result into the new type as shown above. Instead of a single file per audio channel, distinguish channels by checking the property value of `channel` for each element in `recognizedPhrases`. There is now a single result file for each input file.


### Getting the content of entities and the results

In v2, the links to the input or result files have been inlined with the rest of the entity metadata. As an improvement in v3, there is a clear separation between entity metadata (which is returned by a GET on `$.self`) and the details and credentials to access the result files. This separation helps protect customer data and allows fine control over the duration of validity of the credentials.

In v3, `links` include a sub-property called `files` in case the entity exposes data (datasets, transcriptions, endpoints, or evaluations). A GET on `$.links.files` will return a list of files and a SAS URL
to access the content of each file. To control the validity duration of the SAS URLs, the query parameter `sasValidityInSeconds` can be used to specify the lifetime.

**v2 transcription:**

```json
{
  "id": "9891c965-bb32-4880-b14b-6d44efb158f3",
  "status": "Succeeded",
  "reportFileUrl": "https://contoso.com/report.txt?st=2018-02-09T18%3A07%3A00Z&se=2018-02-10T18%3A07%3A00Z&sp=rl&sv=2017-04-17&sr=b&sig=6c044930-3926-4be4-be76-f728327c53b5",
  "resultsUrls": {
    "channel_0": "https://contoso.com/audiofile1.wav?st=2018-02-09T18%3A07%3A00Z&se=2018-02-10T18%3A07%3A00Z&sp=rl&sv=2017-04-17&sr=b&sig=6c044930-3926-4be4-be76-f72832e6600c",
    "channel_1": "https://contoso.com/audiofile2.wav?st=2018-02-09T18%3A07%3A00Z&se=2018-02-10T18%3A07%3A00Z&sp=rl&sv=2017-04-17&sr=b&sig=3e0163f1-0029-4d4a-988d-3fba7d7c53b5"
  }
}
```

**v3 transcription:**

```json
{
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3",
    "links": {
      "files": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3/files"
    } 
}
```

**A GET on `$.links.files` would result in:**

```json
{
  "values": [
    {
      "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3/files/f23e54f5-ed74-4c31-9730-2f1a3ef83ce8",
      "name": "Name",
      "kind": "Transcription",
      "properties": {
        "size": 200
      },
      "createdDateTime": "2020-01-13T08:00:00Z",
      "links": {
        "contentUrl": "https://customspeech-usw.blob.core.windows.net/artifacts/mywavefile1.wav.json?st=2018-02-09T18%3A07%3A00Z&se=2018-02-10T18%3A07%3A00Z&sp=rl&sv=2017-04-17&sr=b&sig=e05d8d56-9675-448b-820c-4318ae64c8d5"
      }
    },
    {
      "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3/files/28bc946b-c251-4a86-84f6-ea0f0a2373ef",
      "name": "Name",
      "kind": "TranscriptionReport",
      "properties": {
        "size": 200
      },
      "createdDateTime": "2020-01-13T08:00:00Z",
      "links": {
        "contentUrl": "https://customspeech-usw.blob.core.windows.net/artifacts/report.json?st=2018-02-09T18%3A07%3A00Z&se=2018-02-10T18%3A07%3A00Z&sp=rl&sv=2017-04-17&sr=b&sig=e05d8d56-9675-448b-820c-4318ae64c8d5"
      }
    }
  ],
  "@nextLink": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3/files?skip=2&top=2"
}
```

The `kind` property indicates the format of content of the file. For transcriptions, the files of kind `TranscriptionReport` are the summary of the job and files of the kind `Transcription` are the result of the job itself.

>[!IMPORTANT]
>To get the results of operations, use a `GET` on `/speechtotext/v3.0/{collection}/{id}/files`, they are no longer contained in the responses of `GET` on `/speechtotext/v3.0/{collection}/{id}` or `/speechtotext/v3.0/{collection}`.

### Customizing models

Before v3, there was a distinction between an _acoustic model_ and a _language model_ when a model was being trained. This distinction resulted in the need to specify multiple models when creating endpoints or transcriptions. To simplify this process for a caller, we removed the differences and made everything depend on the content of the datasets that are being used for model training. With this change, the model creation now supports mixed datasets (language data and acoustic data). Endpoints and transcriptions now require only one model.

With this change, the need for a `kind` in the `POST` operation has been removed and the `datasets[]` array can now contain multiple datasets of the same or mixed kinds.

To improve the results of a trained model, the acoustic data is automatically used internally during language training. In general, models created through the v3 API deliver more accurate results than models created with the v2 API.

>[!IMPORTANT]
>To customize both the acoustic and language model part, pass all of the required language and acoustic datasets in `datasets[]` of the POST to `/speechtotext/v3.0/models`. This will create a single model with both parts customized.

### Retrieving base and custom models

To simplify getting the available models, v3 has separated the collections of "base models" from the customer owned "customized models". The two routes are now
`GET /speechtotext/v3.0/models/base` and `GET /speechtotext/v3.0/models/`.

In v2, all models were returned together in a single response.

>[!IMPORTANT]
>To get a list of provided base models for customization, use `GET` on `/speechtotext/v3.0/models/base`. You can find your own customized models with a `GET` on `/speechtotext/v3.0/models`.

### Name of an entity

The `name` property is now `displayName`. This is consistent with other Azure APIs to not indicate identity properties. The value of this property must not be unique and can be changed after entity creation with a `PATCH` operation.

**v2 transcription:**

```json
{
    "name": "Transcription using locale en-US"
}
```

**v3 transcription:**

```json
{
    "displayName": "Transcription using locale en-US"
}
```

>[!IMPORTANT]
>Rename the property `name` to `displayName` in your client code.

### Accessing referenced entities

In v2, referenced entities were always inlined, for example the used models of an endpoint. The nesting of entities resulted in large responses and consumers rarely consumed the nested content. To shrink the response size and improve performance, the referenced entities are no longer inlined in the response. Instead, a reference to the other entity appears, and can directly be used for a subsequent `GET` (it's a URL as well), following the same pattern as the `self` link.

**v2 transcription:**

```json
{
  "id": "9891c965-bb32-4880-b14b-6d44efb158f3",
  "models": [
    {
      "id": "827712a5-f942-4997-91c3-7c6cde35600b",
      "modelKind": "Language",
      "lastActionDateTime": "2019-01-07T11:36:07Z",
      "status": "Running",
      "createdDateTime": "2019-01-07T11:34:12Z",
      "locale": "en-US",
      "name": "Acoustic model",
      "description": "Example for an acoustic model",
      "datasets": [
        {
          "id": "702d913a-8ba6-4f66-ad5c-897400b081fb",
          "dataImportKind": "Language",
          "lastActionDateTime": "2019-01-07T11:36:07Z",
          "status": "Succeeded",
          "createdDateTime": "2019-01-07T11:34:12Z",
          "locale": "en-US",
          "name": "Language dataset",
        }
      ]
    },
  ]
}
```

**v3 transcription:**

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3",
  "model": {
    "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/models/021a72d0-54c4-43d3-8254-27336ead9037"
  }
}
```

If you need to consume the details of a referenced model as shown in the above example, just issue a GET on `$.model.self`.

>[!IMPORTANT]
>To retrieve the metadata of referenced entities, issue a GET on `$.{referencedEntity}.self`, for example to retrieve the model of a transcription do a `GET` on `$.model.self`.


### Retrieving endpoint logs

Version v2 of the service supported logging endpoint results. To retrieve the results of an endpoint with v2, you would create a "data export", which represented a snapshot of the results defined by a time range. The process of exporting batches of data was inflexible. The v3 API gives access to each individual file and allows iteration through them.

**A successfully running v3 endpoint:**

```json
{
  "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/endpoints/afa0669c-a01e-4693-ae3a-93baf40f26d6",
  "links": {
    "logs": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/endpoints/afa0669c-a01e-4693-ae3a-93baf40f26d6/files/logs" 
  }
}
```

**Response of GET `$.links.logs`:**

```json
{
  "values": [
    {
      "self": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/endpoints/6d72ad7e-f286-4a6f-b81b-a0532ca6bcaa/files/logs/2019-09-20_080000_3b5f4628-e225-439d-bd27-8804f9eed13f.wav",
      "name": "2019-09-20_080000_3b5f4628-e225-439d-bd27-8804f9eed13f.wav",
      "kind": "Audio",
      "properties": {
        "size": 12345
      },
      "createdDateTime": "2020-01-13T08:00:00Z",
      "links": {
        "contentUrl": "https://customspeech-usw.blob.core.windows.net/artifacts/2019-09-20_080000_3b5f4628-e225-439d-bd27-8804f9eed13f.wav?st=2018-02-09T18%3A07%3A00Z&se=2018-02-10T18%3A07%3A00Z&sp=rl&sv=2017-04-17&sr=b&sig=e05d8d56-9675-448b-820c-4318ae64c8d5"
      }
    }    
  ],
  "@nextLink": "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/endpoints/afa0669c-a01e-4693-ae3a-93baf40f26d6/files/logs?top=2&SkipToken=2!188!MDAwMDk1ITZhMjhiMDllLTg0MDYtNDViMi1hMGRkLWFlNzRlOGRhZWJkNi8yMDIwLTA0LTAxLzEyNDY0M182MzI5NGRkMi1mZGYzLTRhZmEtOTA0NC1mODU5ZTcxOWJiYzYud2F2ITAwMDAyOCE5OTk5LTEyLTMxVDIzOjU5OjU5Ljk5OTk5OTlaIQ--"
}
```

Pagination for endpoint logs works similar to all other collections, except that no offset can be specified. Due to the large amount of available data, pagination is determined by the server.

In v3, each endpoint log can be deleted individually by issuing a `DELETE` operation on the `self` of a file, or by using `DELETE` on `$.links.logs`. To specify an end date, the query parameter `endDate` can be added to the request.

>[!IMPORTANT]
>Instead of creating log exports on `/api/speechtotext/v2.0/endpoints/{id}/data` use `/v3.0/endpoints/{id}/files/logs/` to access log files individually. 

### Using custom properties

To separate custom properties from the optional configuration properties, all explicitly named properties are now located in the `properties` property and all properties defined by the callers are now located in the `customProperties` property.

**v2 transcription entity:**

```json
{
  "properties": {
    "customerDefinedKey": "value",
    "diarizationEnabled": "False",
    "wordLevelTimestampsEnabled": "False"
  }
}
```

**v3 transcription entity:**

```json
{
  "properties": {
    "diarizationEnabled": false,
    "wordLevelTimestampsEnabled": false 
  },
  "customProperties": {
    "customerDefinedKey": "value"
  }
}
```

This change also lets you use correct types on all explicitly named properties under `properties` (for example boolean instead of string).

>[!IMPORTANT]
>Pass all custom properties as `customProperties` instead of `properties` in your `POST` requests.

### Response headers

v3 no longer returns the `Operation-Location` header in addition to the `Location` header on `POST` requests. The value of both headers in v2 was the same. Now only `Location` is returned.

Because the new API version is now managed by Azure API management (APIM), the throttling related headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` aren't contained in the response headers.

>[!IMPORTANT]
>Read the location from response header `Location` instead of `Operation-Location`. In case of a 429 response code, read the `Retry-After` header value instead of `X-RateLimit-Limit`, `X-RateLimit-Remaining`, or `X-RateLimit-Reset`.


### Accuracy tests

Accuracy tests have been renamed to evaluations because the new name describes better what they represent. The new paths are: `https://{region}.api.cognitive.microsoft.com/speechtotext/v3.0/evaluations`.

>[!IMPORTANT]
>Rename the path segment `accuracytests` to `evaluations` in your client code.


## Next steps

* [Speech to text REST API](rest-speech-to-text.md)
* [Speech to text REST API v3.0 reference](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0)
