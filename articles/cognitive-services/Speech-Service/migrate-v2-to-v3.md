---
title: Migrate from v2 to v3 REST API - Speech service
titleSuffix: Azure Cognitive Services
description: Compared to v2, the new API version v3 contains a set of smaller breaking changes. This document will help migrating to the new major version in no time.
services: cognitive-services
author: bexxx
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 02/12/2020
ms.author: rbeckers
ms.custom: devx-track-csharp
---

# Migration from v2.0 to v3.0 of speech to text REST API

The v3 version of the speech REST API improves over the previous API version in respect to reliability and ease of use. The API layout aligns more closely with other Azure or Cognitive Services APIs. This helps you applying your existing skills when using our speech API.

The API overview is available as a [Swagger document](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0). This is ideal to give you an API overview and test the new API.

We're providing samples for C# and Python. For batch transcriptions you will find the samples in the [GitHub sample repository](https://aka.ms/csspeech/samples) inside the `samples/batch` subdirectory.

## Forward compatibility

To ensure a smooth migration to v3, all entities from v2 can be also found in the v3 API under the same identity. If there is a result schema change (for example, transcriptions), the responses for a GET in v3 version of the API will be in the v3 schema. If you perform the GET in v2 version of the API, the result schema will be in the v2 format. Newly created entities on v3 **are not** available on v2.

## Breaking changes

The list of breaking changes has been sorted by the magnitude of changes required to adapt. There are only a few changes that require a non-trivial change in the calling code. Most changes require simple renames. The time it took for teams to migrate from v2 to v3 varied between a couple of hours to a couple of days. However, the benefits of increased stability, simpler code, faster responses quickly offset the investment. 

### Host name changes

The host names have changed from {region}.cris.ai to {region}.api.cognitive.microsoft.com. In this change, the paths do no longer contain "api/" because it's part of the hostname. See the [Swagger document](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0) for a full description of regions and paths.

### Identity of an entity

The property `id` was replaced with `self`. In v2, an API user had to know how our paths on the API are being created. This was non-extensible and required unnecessary work from the user. The property `id` (uuid) is replaced by `self` (string), which is location of the entity (url). The value is still unique between all your entities. If `id` is stored as a string in your code, a simple rename is enough to support the new schema. You can now use the `self` content as url for all your REST calls for your entity (GET, PATCH, DELETE).

If the entity has additional functionality available under other paths, they are listed under `links`. A good example is a transcription, which has a separate method to `GET` the content of the transcription.

v2 transcription:

```json
{
    "id": "9891c965-bb32-4880-b14b-6d44efb158f3",
    "createdDateTime": "2019-01-07T11:34:12Z",
    "lastActionDateTime": "2019-01-07T11:36:07Z",
    "status": "Succeeded",
    "locale": "en-US",
    "name": "Transcription using locale en-US",
    
}
```

v3 transcription:

```json
{
    "self": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3",
    "createdDateTime": "2019-01-07T11:34:12Z",
    "lastActionDateTime": "2019-01-07T11:36:07Z",
    "status": "Succeeded",
    "locale": "en-US", 
    "displayName": "Transcription using locale en-US",
    "links": {
      "files": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3/files"
    },
    
}
```

Depending on your client implementation, it may not be enough to rename the property. We recommend to take advantage of using the returned values of `self` and `links` as the target urls of your rest calls, and not to generate the paths in your client. By using the returned urls, you can be sure that future changes in paths will not break your client code.

### Working with collections of entities

Previously the v2 API returned all available entities in a response. To allow a more fine grained control over the expected response size, in v3 all responses of collections are paginated. You have control over the count of returned entities and the offset of the page. This behavior makes it easy to predict the runtime of the response processor and it's consistent with other Azure APIs.

The basic shape of the response is the same for all collections:

```json
{
    "values": [
    {
      
    },
    
    ],
    "@nextLink": "https://{region}.api.cognitive.microsoft.com/speechtotext/v3.0/{collection}?skip=100&top=100"
}
```

The property `values` contains a subset of the available collection entities. The count and offset can be controlled by using the query parameters `skip` and `top`. When `@nextLink` is not null, there's more data available and the next batch of data can be retrieved by doing a GET on `$.@nextLink`.

This change requires calling the `GET` for the collection in a loop until all elements have been returned.

### Creating transcriptions

A detailed description on how to create transcription can be found in [Batch transcription How-to](./batch-transcription.md).

The creation of transcriptions has been changed in v3 to enable setting specific transcription options explicitly. All (optional) configuration properties can now be set in the `properties` property.
Also version v3 now supports multiple input files and therefore requires a list of urls and not a single url as required by v2. The property name was renamed from `recordingsUrl` to `contentUrls`. The functionality of analyzing sentiment in transcriptions has been removed on v3. We recommend to use the Microsoft Cognitive Service "[Text Analysis](https://azure.microsoft.com/en-us/services/cognitive-services/text-analytics/)" instead.

The new property `timeToLive` under `properties` can help to prune the existing completed entities. The `timeToLive` specifies a duration after which a completed entity will be automatically deleted. Set it to a high value (for example `PT12H`) when the entities are continuously tracked, consumed, and deleted and therefore usually processed long before 12 hours passed.

v2 transcription POST request body:

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

v3 transcription POST request body:

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
  },
}
```

### Format of v3 transcription results

The schema of transcription results has been slightly changed to align with the transcriptions created by real-time endpoints. An in-depth description of the new format can be found in the [Batch transcription How-to](./batch-transcription.md). The schema of the result is published in our [GitHub sample repository](https://aka.ms/csspeech/samples) under `samples/batch/transcriptionresult_v3.schema.json`.

The property names are now camel-cased and the values for channel and speaker are using integer types. To align the format of durations with other Azure APIs, it is now in formatted as described in ISO 8601.

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

### Getting the content of entities and the results

In v2, the links to the input or result files have been inlined with the rest of the entity metadata. As an improvement in v3, there is a clear separation between entity metadata, which is returned by a GET on `$.self` and the details and credentials to access the result files. This separation helps protecting customer data and allows fine control over the duration of validity of the credentials.

In v3, there is a property called `files` under links in case the entity exposes data (datasets, transcriptions, endpoints, evaluations). A GET on `$.links.files` will return a list of files and SAS url to access the content of each file. To control the validity duration of the SAS urls, the query parameter `sasValidityInSeconds` can be used to specify the lifetime.

v2 transcription:

```json
{
  "id": "9891c965-bb32-4880-b14b-6d44efb158f3",
  "status": "Succeeded",
  "reportFileUrl": "https://contoso.com/report.txt?st=2018-02-09T18%3A07%3A00Z&se=2018-02-10T18%3A07%3A00Z&sp=rl&sv=2017-04-17&sr=b&sig=6c044930-3926-4be4-be76-f728327c53b5",
  "resultsUrls": {
    "channel_0": "https://contoso.com/audiofile1.wav?st=2018-02-09T18%3A07%3A00Z&se=2018-02-10T18%3A07%3A00Z&sp=rl&sv=2017-04-17&sr=b&sig=6c044930-3926-4be4-be76-f72832e6600c",
    "channel_1": "https://contoso.com/audiofile2.wav?st=2018-02-09T18%3A07%3A00Z&se=2018-02-10T18%3A07%3A00Z&sp=rl&sv=2017-04-17&sr=b&sig=3e0163f1-0029-4d4a-988d-3fba7d7c53b5"
  },
  
}
```

v3 transcription:

```json
{
    "self": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3",
    "links": {
      "files": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3/files"
    },
    
}
```

Then a GET on `$.links.files` would result in:

```json
{
  "values": [
    {
      "self": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3/files/f23e54f5-ed74-4c31-9730-2f1a3ef83ce8",
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
      "self": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3/files/28bc946b-c251-4a86-84f6-ea0f0a2373ef",
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
  "@nextLink": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3/files?skip=2&top=2"
}
```

The `kind` indicates the format of content of the file. For transcriptions, the files of kind `TranscriptionReport` are the summary of the job and files of the kind `Transcription` are the result of the job itself.

### Customizing models

Before v3, there was a distinction between an "Acoustic model" and a "Language model" when a model was being trained. This distinction resulted in the need to specify multiple models when creating endpoints or transcriptions. To simplify this process for a caller, we removed the differences and made all dependent on the content of the datasets that are being used for model training. With this change, the model creation now supports mixed datasets (language data and acoustic data). Endpoints and transcriptions now require only one model only.

With this change, the need for a `kind` in the POST has been removed and the `datasets[]` can now contain multiple datasets of the same or mixed kinds.

To improve the results of a trained model, the acoustic data is automatically used internally for the language training. In general, models created through the v3 API deliver more accurate results than models created with the v2 API.

### Retrieving base and custom models

In order to simplify getting the available models, v3 has separated the collections of "base models" from the customer owned "customized models". The two routes are now
`GET /speechtotext/v3.0/models/base` and `GET /speechtotext/v3.0/models/`.

Previously all models have been returned together in a single response.

### Name of an entity

The name of the property `name` is renamed to `displayName`. This is aligned to other Azure APIs to not indicate identity properties. The value of this property must not be unique and can be changed after entity creation with a `PATCH`.

v2 transcription:

```json
{
    "name": "Transcription using locale en-US",
    
}
```

v3 transcription:

```json
{
    "displayName": "Transcription using locale en-US",
    
}
```

### Accessing referenced entities

In v2 referenced entities have always been inlined, for example the used models of an endpoint. The nesting of entities resulted in large responses and consumers rarely consumed the nested content. To shrink the response size and improve performance for all API users, the referenced entities are no longer inlined in the response. Instead a reference to the other entity is being used, which can directly be used. This reference can be used for a subsequent `GET` (it's a url as well), following the same pattern as the `self` link.

v2 transcription:

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
      ],
      
    },
  ],
  
}
```

v3 transcription:

```json
{
  "self": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.0/transcriptions/9891c965-bb32-4880-b14b-6d44efb158f3",
  "model": {
    "self": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.0/models/021a72d0-54c4-43d3-8254-27336ead9037"
  },
  
}
```

In case you need to consume the details of a referenced model as shown in the above example, simplify issue a GET on `$.model.self`.

### Retrieving endpoint logs

Version v2 of the service supported logging the responses of endpoints. To retrieve the results of an endpoint with v2, one had to create a "data export", which represented a snapshot of the results defined by a time range. The process of exporting batches of data has become inflexible. The v3 API gives access to each individual file and allows iteration through them.

A successfully running v3 endpoint:

```json
{
  "self": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.0/endpoints/afa0669c-a01e-4693-ae3a-93baf40f26d6",
  "links": {
    "logs": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.0/endpoints/afa0669c-a01e-4693-ae3a-93baf40f26d6/files/logs",
    
  },
  
}
```

Response of GET `$.links.logs`:

```json
{
  "values": [
    {
      "self": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.0/endpoints/6d72ad7e-f286-4a6f-b81b-a0532ca6bcaa/files/logs/2019-09-20_080000_3b5f4628-e225-439d-bd27-8804f9eed13f.wav",
      "name": "2019-09-20_080000_3b5f4628-e225-439d-bd27-8804f9eed13f.wav",
      "kind": "Audio",
      "properties": {
        "size": 12345
      },
      "createdDateTime": "2020-01-13T08:00:00Z",
      "links": {
        "contentUrl": "https://customspeech-usw.blob.core.windows.net/artifacts/2019-09-20_080000_3b5f4628-e225-439d-bd27-8804f9eed13f.wav?st=2018-02-09T18%3A07%3A00Z&se=2018-02-10T18%3A07%3A00Z&sp=rl&sv=2017-04-17&sr=b&sig=e05d8d56-9675-448b-820c-4318ae64c8d5"
      }
    },
    
  ],
  "@nextLink": "https://westus.api.cognitive.microsoft.com/speechtotext/v3.0/endpoints/afa0669c-a01e-4693-ae3a-93baf40f26d6/files/logs?top=2&SkipToken=2!188!MDAwMDk1ITZhMjhiMDllLTg0MDYtNDViMi1hMGRkLWFlNzRlOGRhZWJkNi8yMDIwLTA0LTAxLzEyNDY0M182MzI5NGRkMi1mZGYzLTRhZmEtOTA0NC1mODU5ZTcxOWJiYzYud2F2ITAwMDAyOCE5OTk5LTEyLTMxVDIzOjU5OjU5Ljk5OTk5OTlaIQ--"
}
```

Pagination for endpoint logs works similar to all other collections, except that no offset can be specified. Due to the large amount of available data, server driven pagination had to be implemented.

In v3, each endpoint log can be deleted individually by issuing a DELETE on the `self` of a file, or by using DELETE on `$.links.logs`. To specify an end data, the query parameter `endDate` can be added to the request.

### Using "custom" properties

To separate custom properties from the optional configuration properties, all explicitly named properties are now located in the `properties` property and all properties defined the callers are now located in the `customProperties` property.

v2 transcription entity

```json
{
  "properties": {
    "customerDefinedKey": "value",
    "diarizationEnabled": "False",
    "wordLevelTimestampsEnabled": "False",
    
  },
  
}
```

v3 transcription entity

```json
{
  "properties": {
    "diarizationEnabled": false,
    "wordLevelTimestampsEnabled": false,
    
  },
  "customProperties": {
    "customerDefinedKey": "value"
  },
  
}
```

This change also enabled the usage of correct types on all explicitly named properties under `properties` (for example bool instead of string).

### Response headers

v3 no longer returns the header `Operation-Location` in addition to the header `Location` on POST requests. The value of both headers used to be the exact same. Now only `Location` is being returned.

Because the new API version is now managed by Azure API management (APIM), the throttling related headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` aren't contained in the response headers.

### Accuracy tests

Accuracy tests have been renamed to evaluations because the new name describes better what they represent. The news paths are for example "https://{region}.api.cognitive.microsoft.com/speechtotext/v3.0/evaluations".
