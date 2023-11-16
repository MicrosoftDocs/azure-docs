---
title: Video Retrieval API reference - Image Analysis 4.0
titleSuffix: Azure AI services
description: Learn how to call the Video Retrieval APIs.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: how-to
ms.date: 11/15/2023
ms.author: pafarley
ms.custom: 
---


# Video Retrieval API reference

## Authentication

Include the following header when making a call to any API in this document.

```
Ocp-Apim-Subscription-Key: YOUR_COMPUTER_VISION_KEY
```

Version: `2023-05-01-preview`


## CreateIndex

### URL
PUT /retrieval/indexes/{indexName}?api-version=<verion_number>

### Summary

Creates an index for the documents to be ingested.

### Description

This method creates an index, which can then be used to ingest documents.
An index needs to be created before ingestion can be performed.

### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index to be created. | Yes | string |
| api-version | query | Requested API version. | Yes | string |
| body | body | The request body containing the metadata that could be used for searching. | Yes | [CreateIngestionIndexRequestModel](#createingestionindexrequestmodel) |

#### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | Created | [GetIngestionIndexResponseModel](#getingestionindexresponsemodel) |

## GetIndex

### URL
GET /retrieval/indexes/{indexName}?api-version=<verion_number>

### Summary

Retrieves the index.

### Description

Retrieves the index with the specified name.

### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index to retrieve. | Yes | string |
| api-version | query | Requested API version. | Yes | string |

### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [GetIngestionIndexResponseModel](#getingestionindexresponsemodel) |
| default | Error | [ErrorResponse](#errorresponse) |

## UpdateIndex

### URL
PATCH /retrieval/indexes/{indexName}?api-version=<verion_number>

### Summary

Updates an index.

### Description

Updates an index with the specified name.

### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index to be updated. | Yes | string |
| api-version | query | Requested API version. | Yes | string |
| body | body | The request body containing the updates to be applied to the index. | Yes | [UpdateIngestionIndexRequestModel](#updateingestionindexrequestmodel) |

### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [GetIngestionIndexResponseModel](#getingestionindexresponsemodel) |
| default | Error | [ErrorResponse](#errorresponse) |

## DeleteIndex

### URL
DELETE /retrieval/indexes/{indexName}?api-version=<verion_number>

### Summary

Deletes an index.

### Description

Deletes an index and all its associated ingestion documents.

### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index to be deleted. | Yes | string |
| api-version | query | Requested API version. | Yes | string |

### Responses

| Code | Description |
| ---- | ----------- |
| 204 | No Content |

## ListIndexes

### URL
GET /retrieval/indexes?api-version=<verion_number>

### Summary

Retrieves all indexes.

### Description

Retrieves a list of all indexes across all ingestions.

### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| $skip | query | Number of datasets to be skipped. | No | integer |
| $top | query | Number of datasets to be returned after skipping. | No | integer |
| api-version | query | Requested API version. | Yes | string |

### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [GetIngestionIndexResponseModelCollectionApiModel](#getingestionindexresponsemodelcollectionapimodel) |
| default | Error | [ErrorResponse](#errorresponse) |

## CreateIngestion

### URL
PUT /retrieval/indexes/{indexName}/ingestions/{ingestionName}?api-version=<verion_number>

### Summary

Creates an ingestion for a specific index and ingestion name.

### Description

Ingestion request can have video payload.
It can have one of the three modes (add, update or remove).
Add mode will create an ingestion and process the video.
Update mode will update the metadata only. In order to reprocess the video, the ingestion needs to be deleted and recreated.

### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index to which the ingestion is to be created. | Yes | string |
| ingestionName | path | The name of the ingestion to be created. | Yes | string |
| api-version | query | Requested API version. | Yes | string |
| body | body | The request body containing the ingestion request to be created. | Yes | [CreateIngestionRequestModel](#createingestionrequestmodel) |

### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 202 | Accepted | [IngestionResponseModel](#ingestionresponsemodel) |

## GetIngestion

### URL

GET /retrieval/indexes/{indexName}/ingestions/{ingestionName}?api-version=<verion_number>

### Summary

Gets the ingestion status.

### Description

Gets the ingestion status for the specified index and ingestion name.

### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index for which the ingestion status to be checked. | Yes | string |
| ingestionName | path | The name of the ingestion to be retrieved. | Yes | string |
| detailLevel | query | A level to indicate detail level per document ingestion status. | No | string |
| api-version | query | Requested API version. | Yes | string |

### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [IngestionResponseModel](#ingestionresponsemodel) |
| default | Error | [ErrorResponse](#errorresponse) |

## ListIngestions

### URL

GET /retrieval/indexes/{indexName}/ingestions?api-version=<verion_number>

### Summary

Retrieves all ingestions.

### Description

Retrieves all ingestions for the specific index.

### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index for which to retrieve the ingestions. | Yes | string |
| api-version | query | Requested API version. | Yes | string |

### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [IngestionResponseModelCollectionApiModel](#ingestionresponsemodelcollectionapimodel) |
| default | Error | [ErrorResponse](#errorresponse) |

## ListDocuments

### URL

GET /retrieval/indexes/{indexName}/documents?api-version=<verion_number>

### Summary

Retrieves all documents.

### Description

Retrieves all documents for the specific index.

### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index for which to retrieve the documents. | Yes | string |
| $skip | query | Number of datasets to be skipped. | No | integer |
| $top | query | Number of datasets to be returned after skipping. | No | integer |
| api-version | query | Requested API version. | Yes | string |

### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [IngestionDocumentResponseModelCollectionApiModel](#ingestiondocumentresponsemodelcollectionapimodel) |
| default | Error | [ErrorResponse](#errorresponse) |

## SearchByText

### URL

POST /retrieval/indexes/{indexName}:queryByText?api-version=<verion_number>

### Summary

Performs a text-based search.

### Description

Performs a text-based search on the specified index.

### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| indexName | path | The name of the index to search. | Yes | string |
| api-version | query | Requested API version. | Yes | string |
| body | body | The request body containing the query and other parameters. | Yes | [SearchQueryTextRequestModel](#searchquerytextrequestmodel) |

### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | [SearchResultDocumentModelCollectionApiModel](#searchresultdocumentmodelcollectionapimodel) |
| default | Error | [ErrorResponse](#errorresponse) |

## Models

### CreateIngestionIndexRequestModel

Represents the create ingestion index request model for the JSON document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| metadataSchema | [MetadataSchemaModel](#metadataschemamodel) |  | No |
| features | [ [FeatureModel](#featuremodel) ] | Gets or sets the list of features for the document. Default is "vision". | No |
| userData | object | Gets or sets the user data for the document. | No |

### CreateIngestionRequestModel

Represents the create ingestion request model for the JSON document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| videos | [ [IngestionDocumentRequestModel](#ingestiondocumentrequestmodel) ] | Gets or sets the list of video document ingestion requests in the JSON document. | No |
| moderation | boolean | Gets or sets the moderation flag, indicating if the content should be moderated. | No |
| generateInsightIntervals | boolean | Gets or sets the interval generation flag, indicating if insight intervals should be generated. | No |
| documentAuthenticationKind | string | Gets or sets the authentication kind that is to be used for downloading the documents.<br>*Enum:* `"none"`, `"managedIdentity"` | No |
| filterDefectedFrames | boolean | Frame filter flag indicating frames will be evaluated and all defected (e.g. blurry, lowlight, overexposure) frames will be filtered out. | No |

### DatetimeFilterModel

Represents a datetime filter to apply on a search query.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| fieldName | string | Gets or sets the name of the field to filter on. | Yes |
| startTime | string | Gets or sets the start time of the range to filter on. | No |
| endTime | string | Gets or sets the end time of the range to filter on. | No |

### ErrorResponse

Response returned when an error occurs.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| error | [ErrorResponseDetails](#errorresponsedetails) |  | Yes |

### ErrorResponseDetails

Error info.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string | Error code. | Yes |
| message | string | Error message. | Yes |
| target | string | Target of the error. | No |
| details | [ [ErrorResponseDetails](#errorresponsedetails) ] | List of detailed errors. | No |
| innererror | [ErrorResponseInnerError](#errorresponseinnererror) |  | No |

### ErrorResponseInnerError

Detailed error.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string | Error code. | Yes |
| message | string | Error message. | Yes |
| innererror | [ErrorResponseInnerError](#errorresponseinnererror) |  | No |

### FeatureModel

Represents a feature in the index.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Gets or sets the name of the feature.<br>*Enum:* `"vision"`, `"speech"` | Yes |
| modelVersion | string | Gets or sets the model version of the feature. | No |
| domain | string | Gets or sets the model domain of the feature.<br>*Enum:* `"generic"`, `"surveillance"` | No |

### GetIngestionIndexResponseModel

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

### GetIngestionIndexResponseModelCollectionApiModel

Contains an array of results that may be paginated.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| value | [ [GetIngestionIndexResponseModel](#getingestionindexresponsemodel) ] | The array of results. | Yes |
| nextLink | string | A link to the next set of paginated results, if there are more results available; not present otherwise. | No |

### IngestionDocumentRequestModel

Represents a video document ingestion request in the JSON document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| mode | string | Gets or sets the mode of the ingestion for document.<br>*Enum:* `"add"`, `"update"`, `"remove"` | Yes |
| documentId | string | Gets or sets the document ID. | No |
| documentUrl | string (uri) | Gets or sets the document URL. Shared access signature (SAS), if any, will be removed from the URL. | Yes |
| metadata | object | Gets or sets the metadata for the document as a dictionary of name-value pairs. | No |
| userData | object | Gets or sets the user data for the document. | No |

### IngestionDocumentResponseModel

Represents an ingestion document response object in the JSON document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| documentId | string | Gets or sets the document ID. | No |
| documentUrl | string (uri) | Gets or sets the document URL. Shared access signature (SAS), if any, will be removed from the URL. | No |
| metadata | object | Gets or sets the key-value pairs of metadata. | No |
| error | [ErrorResponseDetails](#errorresponsedetails) |  | No |
| createdDateTime | dateTime | Gets or sets the created date and time of the document. | No |
| lastModifiedDateTime | dateTime | Gets or sets the last modified date and time of the document. | No |
| userData | object | Gets or sets the user data for the document. | No |

### IngestionDocumentResponseModelCollectionApiModel

Contains an array of results that may be paginated.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| value | [ [IngestionDocumentResponseModel](#ingestiondocumentresponsemodel) ] | The array of results. | Yes |
| nextLink | string | A link to the next set of paginated results, if there are more results available; not present otherwise. | No |

### IngestionErrorDetailsApiModel

Represents the ingestion error information for each document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string | Error code. | No |
| message | string | Error message. | No |
| innerError | [IngestionInnerErrorDetailsApiModel](#ingestioninnererrordetailsapimodel) |  | No |

### IngestionInnerErrorDetailsApiModel

Represents the ingestion inner-error information for each document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string | Error code. | No |
| message | string | Error message. | No |
| innerError | [IngestionInnerErrorDetailsApiModel](#ingestioninnererrordetailsapimodel) |  | No |

### IngestionResponseModel

Represents the ingestion response model for the JSON document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Gets or sets the name of the ingestion. | No |
| state | string | Gets or sets the state of the ingestion.<br>*Enum:* `"notStarted"`, `"running"`, `"completed"`, `"failed"`, `"partiallySucceeded"` | No |
| error | [ErrorResponseDetails](#errorresponsedetails) |  | No |
| batchName | string | The name of the batch associated with this ingestion. | No |
| createdDateTime | dateTime | Gets or sets the created date and time of the ingestion. | No |
| lastModifiedDateTime | dateTime | Gets or sets the last modified date and time of the ingestion. | No |
| fileStatusDetails | [ [IngestionStatusDetailsApiModel](#ingestionstatusdetailsapimodel) ] | The list of ingestion statuses for each document. | No |

### IngestionResponseModelCollectionApiModel

Contains an array of results that may be paginated.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| value | [ [IngestionResponseModel](#ingestionresponsemodel) ] | The array of results. | Yes |
| nextLink | string | A link to the next set of paginated results, if there are more results available; not present otherwise. | No |

### IngestionStatusDetailsApiModel

Represents the ingestion status detail for each document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| lastUpdateTime | dateTime | Status update time of the batch chunk. | Yes |
| documentId | string | The document ID. | Yes |
| documentUrl | string (uri) | The url of the document. | No |
| succeeded | boolean | A flag to indicate if inference was successful. | Yes |
| error | [IngestionErrorDetailsApiModel](#ingestionerrordetailsapimodel) |  | No |

### MetadataSchemaFieldModel

Represents a field in the metadata schema.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Gets or sets the name of the field. | Yes |
| searchable | boolean | Gets or sets a value indicating whether the field is searchable. | Yes |
| filterable | boolean | Gets or sets a value indicating whether the field is filterable. | Yes |
| type | string | Gets or sets the type of the field. It could be string or datetime.<br>*Enum:* `"string"`, `"datetime"` | Yes |

### MetadataSchemaModel

Represents the metadata schema for the document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| language | string | Gets or sets the language of the metadata schema. Default is "en". | No |
| fields | [ [MetadataSchemaFieldModel](#metadataschemafieldmodel) ] | Gets or sets the list of fields in the metadata schema. | Yes |

### SearchFiltersModel

Represents the filters to apply on a search query.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| stringFilters | [ [StringFilterModel](#stringfiltermodel) ] | Gets or sets the string filters to apply on the search query. | No |
| datetimeFilters | [ [DatetimeFilterModel](#datetimefiltermodel) ] | Gets or sets the datetime filters to apply on the search query. | No |
| featureFilters | [ string ] | Gets or sets the feature filters to apply on the search query. | No |

### SearchQueryTextRequestModel

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
| disableMetadataSearch | boolean | Gets or sets a boolean value indicating whether metadata is disabled in the search or not. | Yes |

### SearchResultDocumentModel

Represents a search query response.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| documentId | string | Gets or sets the ID of the document. | No |
| documentKind | string | Gets or sets the kind of the document, which can be "video". | No |
| start | string | Gets or sets the start time of the document. This property is only applicable for video documents. | No |
| end | string | Gets or sets the end time of the document. This property is only applicable for video documents. | No |
| best | string | Gets or sets the timestamp of the document with highest relevance score. This property is only applicable for video documents. | No |
| relevance | double | Gets or sets the relevance score of the document. | Yes |
| additionalMetadata | object | Gets or sets the additional metadata related to search. | No |

### SearchResultDocumentModelCollectionApiModel

Contains an array of results that may be paginated.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| value | [ [SearchResultDocumentModel](#searchresultdocumentmodel) ] | The array of results. | Yes |
| nextLink | string | A link to the next set of paginated results, if there are more results available; not present otherwise. | No |

### StringFilterModel

Represents a string filter to apply on a search query.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| fieldName | string | Gets or sets the name of the field to filter on. | Yes |
| values | [ string ] | Gets or sets the values to filter on. | Yes |

### UpdateIngestionIndexRequestModel

Represents the update ingestion index request model for the JSON document.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| metadataSchema | [MetadataSchemaModel](#metadataschemamodel) |  | No |
| userData | object | Gets or sets the user data for the document. | No |
