---
title: Do video retrieval using vectorization - Image Analysis 4.0
titleSuffix: Azure AI services
description: Learn how to call the image retrieval API to vectorize video frames and search terms.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: how-to
ms.date: 09/08/2023
ms.author: pafarley
ms.custom: 
---

# Video Retrieval APIs

Video Retrieval APIs are hosted by Azure Computer Vision and enable developers to create an index, add documents (video/image) to it, and search with natural language. Developers can define metadata schema for each index, ingest metadata to the service to help with retrieval. Developers can also specify what features to extract (vision, speech) for the index and filter based on features during search.

## Prerequisites
1. Azure Subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).
2. Once you have your Azure subscription, [create a Cognitive Services resource using the portal](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account). For this preview, you must create your resource in the East US region.
3. An Azure Storage resource - [Create one](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create?tabs=azure-portal)
4. Open the Azure Portal, then copy the key and endpoint required to make the call. For details on how to do this see, [Get the keys for your resource](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account#get-the-keys-for-your-resource).

## Usage
### Basic Example
To use the Video Retrieval APIs in a typical pattern you would do the following:

1. Create an index using [PUT - Create an index](#createindex)
2. Add video documents to the index using [PUT- CreateIngestion](#createingestion)
3. Wait for the ingestion to complete, checking [GET - ListIngestions](#listingestions)
4. Search for a keyword or phrase using [POST SearchByText](#searchbytext)
   
### Authentication
Include the following header when making a call to any API in this document.

- Ocp-Apim-Subscription-Key: [key from the Computer Vision resource]

Include the following header when issuing request with JSON.

- Content-Type: application/json

### Media File Support
#### Supported formats
| File format | Description |
| ----------- | ----------- |
| asf         | ASF (Advanced / Active Streaming Format)       |
| flv         | FLV (Flash Video)        |
| matroskamm, webm          | Matroska / WebM       |
| mov,mp4,m4a,3gp,3g2,mj2   | QuickTime / MOV        |
| mpegts                    | MPEG-TS (MPEG-2 Transport Stream)       |
| rawvideo                  | raw video        |
| rm                        | RealMedia        |
| rtsp                      | RTSP input       |

#### Supported codecs
| Codec       | Format |
| ----------- | ----------- |
| h264        | H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10       |
| rawvideo    | raw video        |
| h265        | HEVC
| libvpx-vp9  | libvpx VP9 (codec vp9)        |

### Using Video Retrieval APIs for Metadata-based Search
The Video Retrieval APIs allows a user to add metadata to video files. Metadata is additional information associated with video files such as "Camera ID", "Timestamp", or "Location" that can be used to organize, filter, and search for specific videos. The example demonstrates how to create an index, add video files with associated metadata, and perform searches using different features.

In the following steps, replace https://example.cognitiveservices.azure.com/ with your Cognitive Service Resource endpoint URL. For example my resource is myCogservcies, so the url is https://myCogService.cognitiveservices.azure.com/. 

#### Step 1: Create an Index
To begin, you need to create an index to store and organize the video files and their metadata. The example below demonstrates how to create an index named "my-video-index."

**Request:**
```http
PUT https://example.cognitiveservices.azure.com/computervision/retrieval/indexes/my-video-index?api-version=2023-05-01-preview
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Content-Type: application/json

{
  "metadataSchema": {
    "fields": [
      {
        "name": "cameraId",
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
  "features": [
    {
      "name": "vision",
      "domain": "surveillance"
    },
    {
      "name": "speech"
    }
  ]
}
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

#### Step 2: Add Video Files to the Index
Next, you can add video files to the index along with their associated metadata. The example below demonstrates how to add two video files to the index using SAS URLs to provide access.

**Request:**
```http
PUT https://example.cognitiveservices.azure.com/computervision/retrieval/indexes/my-video-index/ingestions/my-ingestion?api-version=2023-05-01-preview
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Content-Type: application/json

{
  "videos": [
    {
      "mode": "add",
      "documentId": "02a504c9cd28296a8b74394ed7488045",
      "documentUrl": "https://example.blob.core.windows.net/videos/02a504c9cd28296a8b74394ed7488045.mp4?sas_token_here",
      "metadata": {
        "cameraId": "camera1",
        "timestamp": "2023-06-30 17:40:33"
      }
    },
    {
      "mode": "add",
      "documentId": "043ad56daad86cdaa6e493aa11ebdab3",
      "documentUrl": "[https://example.blob.core.windows.net/videos/043ad56daad86cdaa6e493aa11ebdab3.mp4?sas_token_here",
      "metadata": {
        "cameraId": "camera2"
      }
    }
  ]
}
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

#### Step 3: Wait for the Ingestion to Completed
After adding video files to the index, the ingestion process starts, which may take some time depending on the size and number of files. To ensure the ingestion is complete before performing searches, you can use the Get Ingestion call to check the status. Wait for this call to return "state" = "Completed" before proceeding to Step 4. 

**Request:**
```http
GET https://example.cognitiveservices.azure.com/computervision/retrieval/indexes/my-video-index/ingestions?api-version=2023-05-01-preview&$top=20
ocp-apim-subscription-key: YOUR_SUBSCRIPTION_KEY
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

#### Step 4: Perform Searches with Metadata
After adding video files to the index, you can search for specific videos using metadata. The example demonstrates two types of searches: one using the "vision" feature and another using the "speech" feature.

##### Search with "vision" Feature
To perform a search using the "vision" feature, specify the query text and any desired filters.

**Request:**
```http
POST https://example.cognitiveservices.azure.com//computervision/retrieval/indexes/my-video-index:queryByText?api-version=2023-05-01-preview
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Content-Type: application/json

{
  "queryText": "a man with black hoodie",
  "filters": {
    "stringFilters": [
      {
        "fieldName": "cameraId",
        "values": [
          "camera1"
        ]
      }
    ],
    "featureFilters": ["vision"]
  }
}
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

##### Search with "speech" Feature
To perform a search using the "speech" feature, provide the query text and any desired filters.

**Request:**
```http
POST https://example.cognitiveservices.azure.com/computervision/retrieval/indexes/my-video-index:queryByText?api-version=2023-05-01-preview
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Content-Type: application/json

{
  "queryText": "leave the area",
  "dedup": false,
  "filters": {
    "stringFilters": [
      {
        "fieldName": "cameraId",
        "values": [
          "camera1"
        ]
      }
    ],
    "featureFilters": ["speech"]
  }
}
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

---

## API Details
API Interface Version: 2023-05-01-preview

* [Ingestion](#ingestion-api)
    * [PUT - Create an index](#createindex)
    * [GET - Get an index](#getindex)
    * [GET - List all indexes](#listindexes)
    * [PATCH - Update an index](#updateindex)
    * [DELETE - Delete an index](#deleteindex)
    * [PUT - Create/Remove/Update documents in a batch](#createingestion)
    * [GET - Get an ingestion](#getingestion)
    * [GET - List ingestions (batched input) within an index](#listingestions)
    * [GET - List documents (videos) within an index](#listdocuments)
* [Search](#search-api)
    * [POST - Search by text within an index](#searchbytext)

### CreateIndex
#### URL
PUT /computervision/retrieval/indexes/{indexName}?api-version=<verion_number>

#### Summary

Creates an index for the documents to be ingested.

#### Description

This method creates an index, which can then be used to ingest documents.
An index needs to be created before ingestion can be performed.

Note: the indexing process will only index the first 40 minutes of each file.

#### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index to be created. | Yes | string |
| api-version | query | Requested API version. | Yes | string |
| body | body | The request body containing the metadata that could be used for searching. | Yes | [CreateIngestionIndexRequestModel](#createingestionindexrequestmodel) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | Created | [GetIngestionIndexResponseModel](#getingestionindexresponsemodel) |

### GetIndex
#### URL
GET /computervision/retrieval/indexes/{indexName}?api-version=<verion_number>

#### Summary

Retrieves the index.

#### Description

Retrieves the index with the specified name.

#### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index to retrieve. | Yes | string |
| api-version | query | Requested API version. | Yes | string |

#### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [GetIngestionIndexResponseModel](#getingestionindexresponsemodel) |
| default | Error | [ErrorResponse](#errorresponse) |

### UpdateIndex
#### URL
PATCH /computervision/retrieval/indexes/{indexName}?api-version=<verion_number>

#### Summary

Updates an index.

#### Description

Updates an index with the specified name.

#### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index to be updated. | Yes | string |
| api-version | query | Requested API version. | Yes | string |
| body | body | The request body containing the updates to be applied to the index. | Yes | [UpdateIngestionIndexRequestModel](#updateingestionindexrequestmodel) |

#### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [GetIngestionIndexResponseModel](#getingestionindexresponsemodel) |
| default | Error | [ErrorResponse](#errorresponse) |

### DeleteIndex
#### URL
DELETE /computervision/retrieval/indexes/{indexName}?api-version=<verion_number>

#### Summary

Deletes an index.

#### Description

Deletes an index and all its associated ingestion documents.

#### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index to be deleted. | Yes | string |
| api-version | query | Requested API version. | Yes | string |

#### Responses

| Code | Description |
| ---- | ----------- |
| 204 | No Content |

### ListIndexes
#### URL
GET /computervision/retrieval/indexes?api-version=<verion_number>

#### Summary

Retrieves all indexes.

#### Description

Retrieves a list of all indexes across all ingestions.

#### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| api-version | query | Requested API version. | Yes | string |

#### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [GetIngestionIndexResponseModelCollectionApiModel](#getingestionindexresponsemodelcollectionapimodel) |
| default | Error | [ErrorResponse](#errorresponse) |

### CreateIngestion
#### URL
PUT /computervision/retrieval/indexes/{indexName}/ingestions/{ingestionName}?api-version=<verion_number>

#### Summary

Creates an ingestion for a specific index and ingestion name.

#### Description

Ingestion request can have either video or image payload at once, but not both.
It can have one of the three modes (add, update or remove).
Add mode will create an ingestion and process the image/video.
Update mode will update the metadata only. In order to reprocess the image/video, the ingestion needs to be deleted and recreated.

#### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index to which the ingestion is to be created. | Yes | string |
| ingestionName | path | The name of the ingestion to be created. | Yes | string |
| api-version | query | Requested API version. | Yes | string |
| body | body | The request body containing the ingestion request to be created. | Yes | [CreateIngestionRequestModel](#createingestionrequestmodel) |

#### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | Created | [IngestionResponseModel](#ingestionresponsemodel) |

### GetIngestion
#### URL
GET /computervision/retrieval/indexes/{indexName}/ingestions/{ingestionName}?api-version=<verion_number>

#### Summary

Gets the ingestion status.

#### Description

Gets the ingestion status for the specified index and ingestion name.

#### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index for which the ingestion status to be checked. | Yes | string |
| ingestionName | path | The name of the ingestion to be retrieved. | Yes | string |
| api-version | query | Requested API version. | Yes | string |

#### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [IngestionResponseModel](#ingestionresponsemodel) |
| default | Error | [ErrorResponse](#errorresponse) |

### ListIngestions
#### URL
GET /computervision/retrieval/indexes/{indexName}/ingestions?api-version=<verion_number>

#### Summary

Retrieves all ingestions.

#### Description

Retrieves all ingestions for the specific index.

#### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index for which to retrieve the ingestions. | Yes | string |
| api-version | query | Requested API version. | Yes | string |

#### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [IngestionResponseModelCollectionApiModel](#ingestionresponsemodelcollectionapimodel) |
| default | Error | [ErrorResponse](#errorresponse) |

### ListDocuments
#### URL
GET /computervision/retrieval/indexes/{indexName}/documents?api-version=<verion_number>

#### Summary

Retrieves all documents.

#### Description

Retrieves all documents for the specific index.

#### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| indexName | path | The name of the index for which to retrieve the documents. | Yes | string |
| $skip | query | Number of datasets to be skipped. | No | integer |
| $top | query | Number of datasets to be returned after skipping. | No | integer |
| api-version | query | Requested API version. | Yes | string |

#### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [IngestionDocumentResponseModelCollectionApiModel](#ingestiondocumentresponsemodelcollectionapimodel) |
| default | Error | [ErrorResponse](#errorresponse) |

### SearchByText
#### URL
POST /computervision/retrieval/indexes/{indexName}:queryByText?api-version=<verion_number>

#### Summary

Performs a text-based search.

#### Description

Performs a text-based search on the specified index.

Note: the indexing process will only index the first 40 minutes of each file, thus no results will ever be returned outside of the first 40 minutes of each file in the index.

#### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index to search. | Yes | string |
| api-version | query | Requested API version. | Yes | string |
| body | body | The request body containing the query and other parameters. | Yes | [SearchQueryTextRequestModel](#searchquerytextrequestmodel) |

#### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [SearchResultDocumentModelCollectionApiModel](#searchresultdocumentmodelcollectionapimodel) |
| default | Error | [ErrorResponse](#errorresponse) |

### Models

#### CreateIngestionIndexRequestModel

Represents the create ingestion index request model for the JSON document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| metadataSchema | [MetadataSchemaModel](#metadataschemamodel) |  | No |
| features | [ [FeatureModel](#featuremodel) ] | Gets or sets the list of features for the document. Default is "vision". | No |
| userData | object | Gets or sets the user data for the document. | No |

#### CreateIngestionRequestModel

Represents the create ingestion request model for the JSON document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| videos | [ [IngestionDocumentRequestModel](#ingestiondocumentrequestmodel) ] | Gets or sets the list of video document ingestion requests in the JSON document. | No |
| images | [ [IngestionDocumentRequestModel](#ingestiondocumentrequestmodel) ] | Gets or sets the list of image document ingestion requests in the JSON document. | No |
| moderation | boolean | Gets or sets the moderation flag, indicating if the content should be moderated. | No |

#### DatetimeFilterModel

Represents a datetime filter to apply on a search query.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| fieldName | string | Gets or sets the name of the field to filter on. | Yes |
| startTime | string | Gets or sets the start time of the range to filter on. | No |
| endTime | string | Gets or sets the end time of the range to filter on. | No |

#### ErrorResponse

Response returned when an error occurs.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| error | [ErrorResponseDetails](#errorresponsedetails) |  | Yes |

#### ErrorResponseDetails

Error info.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string | Error code. | Yes |
| message | string | Error message. | Yes |
| target | string | Target of the error. | No |
| details | [ [ErrorResponseDetails](#errorresponsedetails) ] | List of detailed errors. | No |
| innererror | [ErrorResponseInnerError](#errorresponseinnererror) |  | No |

#### ErrorResponseInnerError

Detailed error.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string | Error code. | Yes |
| message | string | Error message. | Yes |
| innererror | [ErrorResponseInnerError](#errorresponseinnererror) |  | No |

#### FeatureModel

Represents a feature in the index.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Gets or sets the name of the feature.<br>*Enum:* `"vision"`, `"speech"` | Yes |
| modelVersion | string | Gets or sets the model version of the feature. | No |
| domain | string | Gets or sets the model domain of the feature.<br>*Enum:* `"generic"`, `"medical"`, `"surveillance"` | No |

#### GetIngestionIndexResponseModel

Represents the get ingestion index response model for the JSON document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Gets or sets the index name property. | No |
| metadataSchema | [MetadataSchemaModel](#metadataschemamodel) |  | No |
| userData | object | Gets or sets the user data for the document. | No |
| features | [ [FeatureModel](#featuremodel) ] | Gets or sets the list of features in the index. | No |
| eTag | string | Gets or sets the etag. | Yes |
| createdDateTime | dateTime | Gets or sets the created date and time property. | Yes |
| lastModifiedDateTime | dateTime | Gets or sets the last modified date and time property. | Yes |

#### GetIngestionIndexResponseModelCollectionApiModel

Contains an array of results that may be paginated.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| value | [ [GetIngestionIndexResponseModel](#getingestionindexresponsemodel) ] | The array of results. | Yes |
| nextLink | string | A link to the next set of paginated results, if there are more results available; not present otherwise. | No |

#### IngestionDocumentRequestModel

Represents a video or image document ingestion request in the JSON document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| mode | string | Gets or sets the mode of the ingestion for document.<br>*Enum:* `"add"`, `"update"`, `"remove"` | Yes |
| documentId | string | Gets or sets the document ID. | No |
| documentUrl | string (uri) | Gets or sets the document URL. Shared access signature (SAS) are required as part of the URL for the service to have access to the document in Azure Blob Storage. | Yes |
| metadata | object | Gets or sets the metadata for the document as a dictionary of name-value pairs. | No |
| userData | object | Gets or sets the user data for the document. | No |

#### IngestionDocumentResponseModel

Represents an ingestion document response object in the JSON document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| documentUrl | string (uri) | Gets or sets the document URL. Shared access signature (SAS), if any, will be removed from the URL. | No |
| metadata | object | Gets or sets the key-value pairs of metadata. | No |
| state | string | Gets or sets the state of the document.<br>*Enum:* `"notStarted"`, `"running"`, `"completed"`, `"failed"` | No |
| error | [ErrorResponseDetails](#errorresponsedetails) |  | No |
| createdDateTime | dateTime | Gets or sets the created date and time of the document. | No |
| lastModifiedDateTime | dateTime | Gets or sets the last modified date and time of the document. | No |
| userData | object | Gets or sets the user data for the document. | No |

#### IngestionDocumentResponseModelCollectionApiModel

Contains an array of results that may be paginated.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| value | [ [IngestionDocumentResponseModel](#ingestiondocumentresponsemodel) ] | The array of results. | Yes |
| nextLink | string | A link to the next set of paginated results, if there are more results available; not present otherwise. | No |

#### IngestionResponseModel

Represents the ingestion response model for the JSON document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Gets or sets the name of the ingestion. | No |
| state | string | Gets or sets the state of the ingestion.<br>*Enum:* `"notStarted"`, `"running"`, `"completed"`, `"failed"` | No |
| error | [ErrorResponseDetails](#errorresponsedetails) |  | No |
| createdDateTime | dateTime | Gets or sets the created date and time of the ingestion. | No |
| lastModifiedDateTime | dateTime | Gets or sets the last modified date and time of the ingestion. | No |

#### IngestionResponseModelCollectionApiModel

Contains an array of results that may be paginated.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| value | [ [IngestionResponseModel](#ingestionresponsemodel) ] | The array of results. | Yes |
| nextLink | string | A link to the next set of paginated results, if there are more results available; not present otherwise. | No |

#### MetadataSchemaFieldModel

Represents a field in the metadata schema.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Gets or sets the name of the field. | Yes |
| searchable | boolean | Gets or sets a value indicating whether the field is searchable. | Yes |
| filterable | boolean | Gets or sets a value indicating whether the field is filterable. | Yes |
| type | string | Gets or sets the type of the field. It could be string or datetime.<br>*Enum:* `"string"`, `"datetime"` | Yes |

#### MetadataSchemaModel

Represents the metadata schema for the document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| language | string | Gets or sets the language of the metadata schema. Default is "en". | No |
| fields | [ [MetadataSchemaFieldModel](#metadataschemafieldmodel) ] | Gets or sets the list of fields in the metadata schema. | Yes |

#### SearchFiltersModel

Represents the filters to apply on a search query.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| stringFilters | [ [StringFilterModel](#stringfiltermodel) ] | Gets or sets the string filters to apply on the search query. | No |
| datetimeFilters | [ [DatetimeFilterModel](#datetimefiltermodel) ] | Gets or sets the datetime filters to apply on the search query. | No |
| featureFilters | [ string ] | Gets or sets the feature filters to apply on the search query. | No |

#### SearchQueryImageRequestModel

Represents a search query request model for image-based search.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| queryImage | string | Gets or sets the base64 string representation of the query image. This property is optional. | No |
| queryImageUrl | string (uri) | Gets or sets the URL of the query image. This property is optional. | No |
| moderation | boolean | Gets or sets a boolean value indicating whether the moderation is enabled or disabled. | No |
| filters | [SearchFiltersModel](#searchfiltersmodel) |  | No |
| top | integer | Gets or sets the number of results to retrieve. | Yes |
| skip | integer | Gets or sets the number of results to skip. | Yes |
| additionalIndexNames | [ string ] | Gets or sets the additional index names to include in the search query. | No |
| dedup | boolean | Whether to remove similar video frames. | Yes |
| dedupMaxDocumentCount | integer | The maximum number of documents after dedup. | Yes |

#### SearchQueryTextRequestModel

Represents a search query request model for text-based search.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| queryText | string | Gets or sets the query text. | Yes |
| filters | [SearchFiltersModel](#searchfiltersmodel) |  | No |
| moderation | boolean | Gets or sets a boolean value indicating whether the moderation is enabled or disabled. | No |
| top | integer | Gets or sets the number of results to retrieve. | Yes |
| skip | integer | Gets or sets the number of results to skip. | Yes |
| additionalIndexNames | [ string ] | Gets or sets the additional index names to include in the search query. | No |
| dedup | boolean | Whether to remove similar video frames. | Yes |
| dedupMaxDocumentCount | integer | The maximum number of documents after dedup. | Yes |

#### SearchResultDocumentModel

Represents a search query response.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| documentId | string | Gets or sets the ID of the document. | No |
| documentKind | string | Gets or sets the kind of the document, which can be "video" or "image". | No |
| start | string | Gets or sets the start time of the document. This property is only applicable for video documents. | No |
| end | string | Gets or sets the end time of the document. This property is only applicable for video documents. | No |
| best | string | Gets or sets the timestamp of the document with highest relevance score. This property is only applicable for video documents. | No |
| relevance | double | Gets or sets the relevance score of the document. | Yes |

#### SearchResultDocumentModelCollectionApiModel

Contains an array of results that may be paginated.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| value | [ [SearchResultDocumentModel](#searchresultdocumentmodel) ] | The array of results. | Yes |
| nextLink | string | A link to the next set of paginated results, if there are more results available; not present otherwise. | No |

#### StringFilterModel

Represents a string filter to apply on a search query.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| fieldName | string | Gets or sets the name of the field to filter on. | Yes |
| values | [ string ] | Gets or sets the values to filter on. | Yes |

#### UpdateIngestionIndexRequestModel

Represents the update ingestion index request model for the JSON document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| metadataSchema | [MetadataSchemaModel](#metadataschemamodel) |  | No |
| userData | object | Gets or sets the user data for the document. | No |

## Next steps

[Image retrieval concepts](../concept-image-retrieval.md)
