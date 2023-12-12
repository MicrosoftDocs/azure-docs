---
title: Do video retrieval using vectorization - Image Analysis 4.0
titleSuffix: Azure AI services
description: Learn how to call the Spatial Analysis Video Retrieval APIs to vectorize video frames and search terms.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 10/16/2023
ms.author: pafarley
ms.custom: 
---

# Do video retrieval using vectorization (version 4.0 preview)

Azure AI Spatial Analysis Video Retrieval APIs are part of Azure AI Vision and enable developers to create an index, add documents (videos and images) to it, and search with natural language. Developers can define metadata schemas for each index and ingest metadata to the service to help with retrieval. Developers can also specify what features to extract from the index (vision, speech) and filter their search based on features.

## Prerequisites

- Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).
- Once you have your Azure subscription, [create a Vision resource using the portal](/azure/cognitive-services/cognitive-services-apis-create-account). For this preview, you must create your resource in the East US region.
- An Azure Storage resource - [Create one](/azure/storage/common/storage-account-create?tabs=azure-portal)

## Input requirements

### Supported formats

| File format | Description |
| ----------- | ----------- |
| `asf`         | ASF (Advanced / Active Streaming Format)       |
| `avi`         | AVI (Audio Video Interleaved)        |
| `flv`         | FLV (Flash Video)        |
| `matroskamm`, `webm`          | Matroska / WebM       |
| `mov`,`mp4`,`m4a`,`3gp`,`3g2`,`mj2`   | QuickTime / MOV        |
 
### Supported video codecs

| Codec       | Format |
| ----------- | ----------- |
| `h264`        | H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10       |
| `h265`        | H.265/HEVC        |
| `libvpx-vp9`  | libvpx VP9 (codec vp9)        |
| `mpeg4`       | MPEG-4 part 2       |
 
### Supported audio codecs

| Codec       | Format |
| ----------- | ----------- |
| `aac`         | AAC (Advanced Audio Coding)       |
| `mp3`         | MP3 (MPEG audio layer 3)        |
| `pcm`         | PCM (uncompressed)        |
| `vorbis`      | Vorbis       |
| `wmav2`       | Windows Media Audio 2       |

## Call the Video Retrieval APIs

To use the Spatial Analysis Video Retrieval APIs in a typical pattern, you would do the following steps:

1. Create an index using **PUT - Create an index**.
2. Add video documents to the index using **PUT - CreateIngestion**.
3. Wait for the ingestion to complete, checking with **GET - ListIngestions**.
4. Search for a keyword or phrase using **POST - SearchByText**.


### Use Video Retrieval APIs for metadata-based search

The Spatial Analysis Video Retrieval APIs allows a user to add metadata to video files. Metadata is additional information associated with video files such as "Camera ID," "Timestamp," or "Location" that can be used to organize, filter, and search for specific videos. This example demonstrates how to create an index, add video files with associated metadata, and perform searches using different features.

### Step 1: Create an Index

To begin, you need to create an index to store and organize the video files and their metadata. The example below demonstrates how to create an index named "my-video-index" using the **[Create Index](../reference-video-search.md)** API.

```bash
curl.exe -v -X PUT "https://<YOUR_ENDPOINT_URL>/computervision/retrieval/indexes/my-video-index?api-version=2023-05-01-preview" -H "Ocp-Apim-Subscription-Key: <YOUR_SUBSCRIPTION_KEY>" -H "Content-Type: application/json" --data-ascii "
{
  'metadataSchema': {
    'fields': [
      {
        'name': 'cameraId',
        'searchable': false,
        'filterable': true,
        'type': 'string'
      },
      {
        'name': 'timestamp',
        'searchable': false,
        'filterable': true,
        'type': 'datetime'
      }
    ]
  },
  'features': [
    {
      'name': 'vision',
      'domain': 'surveillance'
    },
    {
      'name': 'speech'
    }
  ]
}"
```

**Response:**
```
HTTP/1.1 201 Created
Content-Length: 530
Content-Type: application/json; charset=utf-8
request-id: cb036529-d1cf-4b44-a1ef-0a4e9fc62885
api-supported-versions: 2023-01-15-preview,2023-05-01-preview
x-envoy-upstream-service-time: 202
Date: Thu, 06 Jul 2023 18:05:05 GMT
Connection: close

{
  "name": "my-video-index",
  "metadataSchema": {
    "language": "en",
    "fields": [
      {
        "name": "cameraid",
        "searchable": false,
        "filterable": true,
        "type": "string"
      },
      {
        "name": "timestamp",
        "searchable": false,
        "filterable": true,
        "type": "datetime"
      }
    ]
  },
  "userData": {},
  "features": [
    {
      "name": "vision",
      "modelVersion": "2023-05-31",
      "domain": "surveillance"
    },
    {
      "name": "speech",
      "modelVersion": "2023-06-30",
      "domain": "generic"
    }
  ],
  "eTag": "\"7966244a79384cca9880d67a4daa9eb1\"",
  "createdDateTime": "2023-07-06T18:05:06.7582534Z",
  "lastModifiedDateTime": "2023-07-06T18:05:06.7582534Z"
}
```

### Step 2: Add video files to the index

Next, you can add video files to the index with their associated metadata. The example below demonstrates how to add two video files to the index using SAS URLs with the **[Create Ingestion](../reference-video-search.md)** API.


```bash
curl.exe -v -X PUT "https://<YOUR_ENDPOINT_URL>/computervision/retrieval/indexes/my-video-index/ingestions/my-ingestion?api-version=2023-05-01-preview" -H "Ocp-Apim-Subscription-Key: <YOUR_SUBSCRIPTION_KEY>" -H "Content-Type: application/json" --data-ascii "
{
  'videos': [
    {
      'mode': 'add',
      'documentId': '02a504c9cd28296a8b74394ed7488045',
      'documentUrl': 'https://example.blob.core.windows.net/videos/02a504c9cd28296a8b74394ed7488045.mp4?sas_token_here',
      'metadata': {
        'cameraId': 'camera1',
        'timestamp': '2023-06-30 17:40:33'
      }
    },
    {
      'mode': 'add',
      'documentId': '043ad56daad86cdaa6e493aa11ebdab3',
      'documentUrl': '[https://example.blob.core.windows.net/videos/043ad56daad86cdaa6e493aa11ebdab3.mp4?sas_token_here',
      'metadata': {
        'cameraId': 'camera2'
      }
    }
  ]
}"
```

**Response:**
```
HTTP/1.1 202 Accepted
Content-Length: 152
Content-Type: application/json; charset=utf-8
request-id: ee5e48df-13f8-4a87-a337-026947144321
operation-location: http://api.example.com.trafficmanager.net/retrieval/indexes/my-test-index/ingestions/my-ingestion
api-supported-versions: 2023-01-15-preview,2023-05-01-preview
x-envoy-upstream-service-time: 709
Date: Thu, 06 Jul 2023 18:15:34 GMT
Connection: close

{
  "name": "my-ingestion",
  "state": "Running",
  "createdDateTime": "2023-07-06T18:15:33.8105687Z",
  "lastModifiedDateTime": "2023-07-06T18:15:34.3418564Z"
}
```

### Step 3: Wait for ingestion to complete

After you add video files to the index, the ingestion process starts. It might take some time depending on the size and number of files. To ensure the ingestion is complete before performing searches, you can use the **[Get Ingestion](../reference-video-search.md)** API to check the status. Wait for this call to return `"state" = "Completed"` before proceeding to the next step. 

```bash
curl.exe -v -X GET "https://<YOUR_ENDPOINT_URL>/computervision/retrieval/indexes/my-video-index/ingestions?api-version=2023-05-01-preview&$top=20" -H "ocp-apim-subscription-key: <YOUR_SUBSCRIPTION_KEY>"
```

**Response:**
```
HTTP/1.1 200 OK
Content-Length: 164
Content-Type: application/json; charset=utf-8
request-id: 4907feaf-88f1-4009-a1a5-ad366f04ee31
api-supported-versions: 2023-01-15-preview,2023-05-01-preview
x-envoy-upstream-service-time: 12
Date: Thu, 06 Jul 2023 18:17:47 GMT
Connection: close

{
  "value": [
    {
      "name": "my-ingestion",
      "state": "Completed",
      "createdDateTime": "2023-07-06T18:15:33.8105687Z",
      "lastModifiedDateTime": "2023-07-06T18:15:34.3418564Z"
    }
  ]
}
```

### Step 4: Perform searches with metadata

After you add video files to the index, you can search for specific videos using metadata. This example demonstrates two types of searches: one using the "vision" feature and another using the "speech" feature.

#### Search with "vision" feature

To perform a search using the "vision" feature, use the [Search By Text](../reference-video-search.md) API with the `vision` filter, specifying the query text and any other desired filters.

```bash
POST -v -X "https://<YOUR_ENDPOINT_URL>/computervision/retrieval/indexes/my-video-index:queryByText?api-version=2023-05-01-preview" -H "Ocp-Apim-Subscription-Key: <YOUR_SUBSCRIPTION_KEY>" -H "Content-Type: application/json" --data-ascii "
{
  'queryText': 'a man with black hoodie',
  'filters': {
    'stringFilters': [
      {
        'fieldName': 'cameraId',
        'values': [
          'camera1'
        ]
      }
    ],
    'featureFilters': ['vision']
  }
}"
```

**Response:**
```
HTTP/1.1 200 OK
Content-Length: 3289
Content-Type: application/json; charset=utf-8
request-id: 4c2477df-d89d-4a98-b433-611083324a3f
api-supported-versions: 2023-05-01-preview
x-envoy-upstream-service-time: 233
Date: Thu, 06 Jul 2023 18:42:08 GMT
Connection: close

{
  "value": [
    {
      "documentId": "02a504c9cd28296a8b74394ed7488045",
      "documentKind": "VideoFrame",
      "start": "00:01:58",
      "end": "00:02:09",
      "best": "00:02:03",
      "relevance": 0.23974405229091644
    },
    {
      "documentId": "02a504c9cd28296a8b74394ed7488045",
      "documentKind": "VideoFrame",
      "start": "00:02:27",
      "end": "00:02:29",
      "best": "00:02:27",
      "relevance": 0.23762696981430054
    },
    {
      "documentId": "02a504c9cd28296a8b74394ed7488045",
      "documentKind": "VideoFrame",
      "start": "00:00:26",
      "end": "00:00:27",
      "best": "00:00:26",
      "relevance": 0.23250913619995117
    },
  ]
}
```

#### Search with "speech" feature

To perform a search using the "speech" feature, use the **[Search By Text](../reference-video-search.md)** API with the `speech` filter, providing the query text and any other desired filters.

```bash
curl.exe -v -X POST "https://<YOUR_ENDPOINT_URL>com/computervision/retrieval/indexes/my-video-index:queryByText?api-version=2023-05-01-preview" -H "Ocp-Apim-Subscription-Key: <YOUR_SUBSCRIPTION_KEY>" -H "Content-Type: application/json" --data-ascii "
{
  'queryText': 'leave the area',
  'dedup': false,
  'filters': {
    'stringFilters': [
      {
        'fieldName': 'cameraId',
        'values': [
          'camera1'
        ]
      }
    ],
    'featureFilters': ['speech']
  }
}"
```

**Response:**
```
HTTP/1.1 200 OK
Content-Length: 49001
Content-Type: application/json; charset=utf-8
request-id: b54577bb-1f46-44d8-9a91-c9326df3ac23
api-supported-versions: 2023-05-01-preview
x-envoy-upstream-service-time: 148
Date: Thu, 06 Jul 2023 18:43:07 GMT
Connection: close

{
  "value": [
    {
      "documentId": "02a504c9cd28296a8b74394ed7488045",
      "documentKind": "SpeechTextSegment",
      "start": "00:07:07.8400000",
      "end": "00:07:08.4400000",
      "best": "00:07:07.8400000",
      "relevance": 0.8597901463508606
    },
    {
      "documentId": "02a504c9cd28296a8b74394ed7488045",
      "documentKind": "SpeechTextSegment",
      "start": "00:07:02.0400000",
      "end": "00:07:03.0400000",
      "best": "00:07:02.0400000",
      "relevance": 0.8506758213043213
    },
    {
      "documentId": "02a504c9cd28296a8b74394ed7488045",
      "documentKind": "SpeechTextSegment",
      "start": "00:07:10.4400000",
      "end": "00:07:11.5200000",
      "best": "00:07:10.4400000",
      "relevance": 0.8474636673927307
    }
  ]
}
```

## Next steps

[Multi-modal embeddings concepts](../concept-image-retrieval.md)
