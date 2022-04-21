---
title: Azure FarmBeats as Event Grid source (Preview)
description: Describes the properties and schema provided for Azure FarmBeats events with Azure Event Grid
ms.topic: conceptual
ms.date: 06/06/2021
---
# Azure FarmBeats as Event Grid source (Preview)
This article provides the properties and schema for Azure FarmBeats events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). 

## Available event types

|Event Name | Description|
|-----|----|
|Microsoft.AgFoodPlatform.FarmerChanged|Published when a farmer is created /updated/deleted. 
|Microsoft.AgFoodPlatform.FarmChanged| Published when a farm is created/updated/deleted.
|Microsoft.AgFoodPlatform.BoundaryChanged|Published when a boundary is created /updated/deleted.
|Microsoft.AgFoodPlatform.FieldChanged|Published when a field is created /updated/deleted.
|Microsoft.AgFoodPlatform.SeasonalFieldChanged|Published when a seasonal field is created /updated/deleted.
|Microsoft.AgFoodPlatform.SeasonChanged|Published when a season is created /updated/deleted.
|Microsoft.AgFoodPlatform.CropChanged|Published when a crop is created /updated/deleted.
|Microsoft.AgFoodPlatform.CropVarietyChanged|Published when a crop variety is created /updated/deleted.
|Microsoft.AgFoodPlatform.SatelliteDataIngestionJobStatusChanged| Published when a satellite data ingestion job's status changes, for example, job is created, has progressed or completed.
|Microsoft.AgFoodPlatform.WeatherDataIngestionJobStatusChanged|Published when a weather data ingestion job's status changes, for example, job is created, has progressed or completed.
|Microsoft.AgFoodPlatform.FarmOperationDataIngestionJobStatusChanged| Published when a farm operations data ingestion job's status changes, for example, job is created, has progressed or completed.
|Microsoft.AgFoodPlatform.ApplicationDataChanged|Published when application data is created /updated/deleted. This event is associate with farm operations data.
|Microsoft.AgFoodPlatform.HarvestingDataChanged|Published when harvesting data is created /updated/deleted.This event is associated with farm operations data.
|Microsoft.AgFoodPlatform.TillageDataChanged|Published when a tillage data is created or updated or deleted. This event is associated with farm operations data.
|Microsoft.AgFoodPlatform.PlantingDataChanged|Published when planting data is created /updated/deleted.This event is associated with farm operations data.

## Event Properties
Each FarmBeats event has two parts, one that is common across events and another (a data object) which contains properties specific to each event. 

The part common across events is elaborated in the following schema.

### Event Grid event schema
An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `topic` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `eventType` | string | One of the registered event types for this event source. |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | App Configuration event data. |
| `dataVersion` | string | The schema version of the data object. The publisher defines the schema version. |
| `metadataVersion` | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |


The tables below elaborate on the properties within data object for each event.

*For FarmerChanged, FarmChanged, SeasonChanged, CropChanged, CropVarietyChanged FarmBeats events, the data object contains following properties:*

|Property | Type| Description|
|----| ----| ----|
id|	string|	User-defined ID of the resource, such as Farm ID, Farmer ID etc.
actionType|	string|	Indicates the change triggered during publishing of the event. Applicable values are Created, Updated, Deleted
status| string|	Contains the user-defined status of the resource.
properties|	object|	It contains user-defined key-value pairs
modifiedDateTime| date-time|Date-time when resource was last modified, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime|date-time|Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.
eTag|	string|	Implements optimistic concurrency
description| string|	Textual description of the resource


*BoundaryChanged FarmBeats events have the following data object:*

|Property | Type| Description|
|----| ----| ----|
id|	string|	User-defined ID of boundary
actionType|	string|	Indicates the change that is triggered during publishing of the event. Applicable values are Created, Updated, Deleted.
parentId|	string|	ID of the parent boundary belongs to.
parentType|	string|	Type of the parent boundary belongs to.
isPrimary|	boolean|	Indicates if the boundary is primary.
farmerId|	string|	Contains the ID of the farmer associated with boundary.
properties|	object|	It contains user-defined key-value pairs.
modifiedDateTime| date-time|Date-time when resource was last modified, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime|date-time|Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.
status| string|	Contains user-defined status of the resource.
eTag|	string|	Implements optimistic concurrency.
description| string|	Textual description of the resource.

*FieldChanged FarmBeats events have the following data object:*

Property|	Type|	Description
|----| ----| ----|
id|	string|	User-defined ID of the field
farmId|	string|	User-defined ID of the farm that  field is associated with
farmerId|	string|	User-defined ID of the farmer that field is associated with
name|	string|	User-defined name of the field
actionType|	string|	Indicates the change that triggered publishing of the event. Applicable values are Created, Updated, Deleted
properties|	object|	It contains user-defined key-value pairs
modifiedDateTime| date-time|Date-time when resource was last modified, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime|date-time|Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.
status| string|	Contains the user-defined status of the resource.
eTag|	string|	Implements optimistic concurrency
description|string|	Textual description of the resource

*SeasonalFieldChanged FarmBeats events have the following data object:*

Property|	Type|	Description
|----| ----| ----|
id|	string|	User-defined ID of the seasonal field
farmId|	string|	User-defined ID of the farm that seasonal field is associated with
farmerId|	string|	User-defined ID of the farmer that seasonal field is associated with
seasonId|	string|	User-defined ID of the season that seasonal field is associated with
fieldId|	string|	User-defined ID of the field that seasonal field is associated with
name|	string|	User-defined name of the seasonal field
actionType|	string|	Indicates the change that triggered publishing of the event. Applicable values are Created, Updated, Deleted
properties|	object|	It contains user-defined key-value pairs
modifiedDateTime| date-time|Date-time when resource was last modified, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime|date-time|Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.
status| string|	Contains the user-defined status of the resource.
eTag|	string|	Implements optimistic concurrency
description| string|	Textual description of the resource

*SatelliteDataIngestionJobChanged, WeatherDataIngestionJobChanged, and FarmOperationsDataIngestionJobChanged FarmBeats events have the following data object:*

Property|	Type|	Description
|----|----|----|
id|String| Unique ID of the job.
name| string| User-defined name of the job.
status|string|Various states a job can be in.
isCancellationRequested| boolean|Flag that gets set when job cancellation is requested.
description|string| Textual description of the job.
farmerId|string| ID of the farmer for which job was created.
message|string| Status message to capture more details of the job.
lastActionDateTime|date-time|Date-time when last action was taken on the job, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime|date-time|Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.


*FarmBeats farm operations data change events such as ApplicationDataChanged, HarvestingDataChanged, PlantingDataChanged, and TillageDataChanged have the following data object:*

Property|	Type|	Description
|----|----|----|
id|	string|	User-defined ID of the resource, such as Farm ID, Farmer ID etc.
status|	string|	Contains the status of the job. 
actionType|string|
source|	string|	Message from FarmBeats giving details about the job.	
modifiedDateTime| date-time|Date-time when resource was last modified, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime|date-time|Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.
eTag|	string|	Implements optimistic concurrency
description|string|	Textual description of the resource


## Sample events 
These event samples represent an event notification.

**Event type: Microsoft.AgFoodPlatform.FarmerChanged**

```json
{
    "data": {
      "actionType": "Created",
      "status": "Sample status",
      "modifiedDateTime": "2021-03-05T10:53:28Z",
      "eTag": "860197cc-0000-0700-0000-60420da80000",
      "id": "UNIQUE-FARMER-ID",
      "name": "sample farmer",
      "description": "Sample description",
      "createdDateTime": "2021-03-05T10:53:28Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      }
    },
    "id": "81fbe1de-4ae4-4284-964f-59da80a6bfe7",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/farmers/UNIQUE-FARMER-ID",
    "eventType": "Microsoft.AgFoodPlatform.FarmerChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-03-05T10:53:28.2783745Z"
  }
```

**Event type: Microsoft.AgFoodPlatform.FarmChanged**

```json
  {
    "data": {
      "farmerId": "UNIQUE-FARMER-ID",
      "actionType": "Created",
      "status": "Sample status",
      "modifiedDateTime": "2021-03-05T10:55:57Z",
      "eTag": "8601e3d5-0000-0700-0000-60420e3d0000",
      "id": "UNIQUE-FARM-ID",
      "name": "Display name",
      "description": "Sample description",
      "createdDateTime": "2021-03-05T10:55:57Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      }
    },
    "id": "31a31be7-51fb-48f3-adfd-6fb4400be002",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/farmers/UNIQUE-FARMER-ID/farms/UNIQUE-FARM-ID",
    "eventType": "Microsoft.AgFoodPlatform.FarmChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-03-05T10:55:57.6026173Z"
  }
```
**Event type: Microsoft.AgFoodPlatform.BoundaryChanged**

```json
  {
    "data": {
      "farmerId": "UNIQUE-FARMER-ID",
      "parentId": "OPTIONAL-UNIQUE-FIELD-ID",
      "isPrimary": true,
      "actionType": "Created",
      "modifiedDateTime": "2021-03-05T11:15:29Z",
      "eTag": "860109f7-0000-0700-0000-604212d10000",
      "id": "UNIQUE-BOUNDARY-ID",
      "name": "Display name",
      "description": "Sample description",
      "createdDateTime": "2021-03-05T11:15:29Z"
    },
    "id": "3d3453b2-5a94-45a7-98eb-fc2979a00317",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/farmers/UNIQUE-FARMER-ID/boundaries/UNIQUE-BOUNDARY-ID",
    "eventType": "Microsoft.AgFoodPlatform.BoundaryChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-03-05T11:15:29.4797354Z"
  }
  ```

**Event type: Microsoft.AgFoodPlatform.FieldChanged**

```json
  {
    "data": {
      "farmerId": "UNIQUE-FARMER-ID",
      "farmId": "UNIQUE-FARM-ID",
      "actionType": "Created",
      "status": "Sample status",
      "modifiedDateTime": "2021-03-05T10:58:43Z",
      "eTag": "860124dc-0000-0700-0000-60420ee30000",
      "id": "UNIQUE-FIELD-ID",
      "name": "Display name",
      "description": "Sample description",
      "createdDateTime": "2021-03-05T10:58:43Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      }
    },
    "id": "1ad04ed0-ac05-4c4e-aa3d-87facb3cc97c",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/farmers/UNIQUE-FARMER-ID/fields/UNIQUE-FIELD-ID",
    "eventType": "Microsoft.AgFoodPlatform.FieldChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-03-05T10:58:43.3222921Z"
  }
  ```
**Event type: Microsoft.AgFoodPlatform.SeasonalFieldChanged**
```json
  {
    "data": {
      "farmerId": "UNIQUE-FARMER-ID",
      "seasonId": "UNIQUE-SEASON-ID",
      "fieldId": "UNIQUE-FIELD-ID",
      "farmId": "UNIQUE-FARM-ID",
      "actionType": "Created",
      "status": "Sample status",
      "modifiedDateTime": "2021-03-05T11:24:56Z",
      "eTag": "8701300b-0000-0700-0000-604215080000",
      "id": "UNIQUE-SEASONAL-FIELD-ID",
      "name": "Display name",
      "description": "Sample description",
      "createdDateTime": "2021-03-05T11:24:56Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      }
    },
    "id": "ff59a0a3-6226-42c0-9e70-01da55efa797",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/farmers/UNIQUE-FARMER-ID/seasonalFields/UNIQUE-SEASONAL-FIELD-ID",
    "eventType": "Microsoft.AgFoodPlatform.SeasonalFieldChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-03-05T11:24:56.4210287Z"
  }
```
**Event type: Microsoft.AgFoodPlatform.SeasonChanged**
```json
  {
    "data": {
      "actionType": "Created",
      "status": "Sample status",
      "modifiedDateTime": "2021-03-05T11:18:38Z",
      "eTag": "86019afd-0000-0700-0000-6042138e0000",
      "id": "UNIQUE-SEASON-ID",
      "name": "Display name",
      "description": "Sample description",
      "createdDateTime": "2021-03-05T11:18:38Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      }
    },
    "id": "63989475-397b-4b92-8160-8743bf8e5804",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/seasons/UNIQUE-SEASON-ID",
    "eventType": "Microsoft.AgFoodPlatform.SeasonChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-03-05T11:18:38.5804699Z"
  }
  ```

  **Event type: Microsoft.AgFoodPlatform.CropChanged**

```json
  {
    "data": {
      "actionType": "Created",
      "status": "Sample status",
      "modifiedDateTime": "2021-03-05T11:03:48Z",
      "eTag": "8601c4e5-0000-0700-0000-604210150000",
      "id": "UNIQUE-CROP-ID",
      "name": "Display name",
      "description": "Sample description",
      "createdDateTime": "2021-03-05T11:03:48Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      }
    },
    "id": "4c59a797-b76d-48ec-8915-ceff58628f35",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/crops/UNIQUE-CROP-ID",
    "eventType": "Microsoft.AgFoodPlatform.CropChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-03-05T11:03:49.0590658Z"
  }
  ```

**Event type: Microsoft.AgFoodPlatform.CropVarietyChanged**

```json
  {
    "data": {
      "cropId": "UNIQUE-CROP-ID",
      "actionType": "Created",
      "status": "string",
      "modifiedDateTime": "2021-03-05T11:10:21Z",
      "eTag": "860130ef-0000-0700-0000-6042119d0000",
      "id": "UNIQUE-CROP-VARIETY-ID",
      "name": "Sample status",
      "description": "Sample description",
      "createdDateTime": "2021-03-05T11:10:21Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      }
    },
    "id": "29aefdb9-d648-442c-81f8-694f3f47583c",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/cropVarieties/UNIQUE-CROP-VARIETY-ID",
    "eventType": "Microsoft.AgFoodPlatform.CropVarietyChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-03-05T11:10:21.4572495Z"
  }
```
**Event type: Microsoft.AgFoodPlatform.SatelliteDataIngestionJobStatusChanged**
```json
[
  {
    "data": {
      "farmerId": "UNIQUE - FARMER - ID",
      "message": "Created job 'job1' to fetch satellite data for boundary 'boundary1' from startDate '06/01/2021' to endDate '06/01/2021' (both inclusive).",
      "status": "Waiting",
      "lastActionDateTime": "2021-06-01T11:25:37.8634096Z",
      "isCancellationRequested": false,
      "id": "UNIQUE - JOB - ID",
      "name": "samplejob",
      "description": "Sample for testing events",
      "createdDateTime": "2021-06-01T11:25:32.3421173Z",
      "properties": {
        "key1": "testvalue1",
        "key2": 123.45
      }
    },
    "id": "925c6be2-6561-4572-b7dd-0f3084a54567",
    "topic": "/subscriptions/{Subscription -ID}/resourceGroups/{RESOURCE - GROUP - NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/farmers/{UNIQUE-FARMER-ID}/satelliteDataIngestionJobs/{UNIQUE-JOB-ID}",
    "eventType": "Microsoft.AgFoodPlatform.SatelliteDataIngestionJobStatusChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-06-01T11:25:37.8634764Z"
  }
]
```
**Event type: Microsoft.AgFoodPlatform.WeatherDataIngestionJobStatusChanged**
```json
[
  {
    "data": {
      "farmerId": "UNIQUE-FARMER-ID",
      "message": "Created job to fetch weather data for job name 'job2', farmer id 'farmer2' and boundary id 'boundary2'.",
      "status": "Running",
      "lastActionDateTime": "2021-06-01T11:22:27.9031003Z",
      "isCancellationRequested": false,
      "id": "UNIQUE-JOB-ID",
      "createdDateTime": "2021-06-01T07:13:54.8843617Z"
    },
    "id": "ec30313a-ff2f-4b50-882b-31188113c15b",
    "topic": "/subscriptions/{Subscription -ID}/resourceGroups/{RESOURCE - GROUP - NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/farmers/UNIQUE-FARMER-ID/weatherDataIngestionJobs/UNIQUE-JOB-ID",
    "eventType": "Microsoft.AgFoodPlatform.WeatherDataIngestionJobStatusChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-06-01T11:22:27.9031302Z"
  }
]

```
**Event type: Microsoft.AgFoodPlatform.FarmOperationDataIngestionJobStatusChanged**
```json
[
  {
    "data": {
      "farmerId": "UNIQUE-FARMER-ID",
      "message": "Job completed successfully. Data statistics:{ Processed operations count = 6, Organizations count = 1, Processed organizations count = 1, Processed fields count = 2, Operations count = 6, ShapefileAttachmentsCount = 0, Fields count = 2 }",
      "status": "Succeeded",
      "lastActionDateTime": "2021-06-01T11:30:54.733625Z",
      "isCancellationRequested": false,
      "id": "UNIQUE-JOB-ID",
      "name": "sample-job",
      "description": "sample description",
      "createdDateTime": "2021-06-01T11:30:39.0905288Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      }
    },
    "id": "ebdbb7a1-ad28-4af7-b3a2-a4a3a2dd1b4f",
    "topic": "/subscriptions/{Subscription -ID}/resourceGroups/{RESOURCE - GROUP - NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/farmers/UNIQUE-FARMER-ID/farmOperationDataIngestionJobs/UNIQUE-JOB-ID",
    "eventType": "Microsoft.AgFoodPlatform.FarmOperationDataIngestionJobStatusChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-06-01T11:30:54.733671Z"
  }
]

```
**Event type: Microsoft.AgFoodPlatform.ApplicationDataChanged**

```json
  {
    "data": {
      "actionType": "Updated",
      "farmerId": "UNIQUE-FARMER-ID",
      "source": "Sample source",
      "modifiedDateTime": "2021-03-05T11:27:24Z",
      "eTag": "87011311-0000-0700-0000-6042159c0000",
      "id": "UNIQUE-APPLICATION-DATA-ID",
      "status": "Sample status",
      "name": "sample name",
      "description": "Sample description",
      "createdDateTime": "2021-03-05T11:27:24Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      }
    },
    "id": "e499f6c4-63ba-4217-8261-0c6cb0e398d2",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/farmers/UNIQUE-FARMER-ID/applicationData/UNIQUE-APPLICATION-DATA-ID",
    "eventType": "Microsoft.AgFoodPlatform.ApplicationDataChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-03-05T11:27:24.164612Z"
  }
```

**Event type: Microsoft.AgFoodPlatform.HarvestDataChanged**
```json
  {
    "data": {
      "actionType": "Created",
      "farmerId": "UNIQUE-FARMER-ID",
      "source": "Sample source",
      "modifiedDateTime": "2021-03-05T11:33:41Z",
      "eTag": "8701141b-0000-0700-0000-604217150000",
      "id": "UNIQUE-HARVEST-DATA-ID",
      "status": "Sample status",
      "name": "sample name",
      "description": "Sample description",
      "createdDateTime": "2021-03-05T11:33:41Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      }
    },
    "id": "dc3837c0-1eed-4bfa-88b6-d018cf6af4db",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/farmers/UNIQUE-FARMER-ID/harvestData/UNIQUE-HARVEST-DATA-ID",
    "eventType": "Microsoft.AgFoodPlatform.HarvestDataChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-03-05T11:33:41.3434992Z"
  }
```
**Event type: Microsoft.AgFoodPlatform.TillageDataChanged**
```json
  {
    "data": {
      "actionType": "Updated",
      "farmerId": "UNIQUE-FARMER-ID",
      "source": "sample source",
      "modifiedDateTime": "2021-06-15T10:31:07Z",
      "eTag": "6405f027-0000-0100-0000-60c8816b0000",
      "id": "c9858c3f-fb94-474a-a6de-103b453df976",
      "createdDateTime": "2021-06-15T10:31:07Z",
      "name": "sample name",
      "description":"sample description"
      "properties": {
        "_orgId": "498221",
        "_fieldId": "e61b83f4-3a12-431e-8010-596f2466dc27",
        "_cropSeason": "2010"
      }
    },
    "id": "f06f6686-1fa8-41fd-be99-46f40f495cce",
    "topic": "/subscriptions/da9091ec-d18f-456c-9c21-5783ee7f4645/resourceGroups/internal-farmbeats-resources/providers/Microsoft.AgFoodPlatform/farmBeats/internal-eus",
    "subject": "/farmers/10e3d7bf-c559-48be-af31-4e00df83bfcd/tillageData/c9858c3f-fb94-474a-a6de-103b453df976",
    "eventType": "Microsoft.AgFoodPlatform.TillageDataChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-06-15T10:31:07.6778047Z"
  }
```

**Event type: Microsoft.AgFoodPlatform.PlantingDataChanged**
```json
  {
    "data": {
      "actionType": "Created",
      "farmerId": "UNIQUE-FARMER-ID",
      "source": "Sample source",
      "modifiedDateTime": "2021-03-05T11:41:18Z",
      "eTag": "8701242a-0000-0700-0000-604218de0000",
      "id": "UNIQUE-PLANTING-DATA-ID",
      "status": "Sample status",
      "name": "sample name",
      "description": "Sample description",
      "createdDateTime": "2021-03-05T11:41:18Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      }
    },
    "id": "42589c7f-4e16-4a4d-9314-d611c822f7ac",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/farmers/UNIQUE-FARMER-ID/plantingData/UNIQUE-PLANTING-DATA-ID",
    "eventType": "Microsoft.AgFoodPlatform.PlantingDataChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-03-05T11:41:18.1744322Z"
  }
```



## Next steps
* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
