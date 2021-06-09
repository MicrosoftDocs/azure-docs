---
title: Azure FarmBeats as Event Grid source
description: Describes the properties and schema provided for Azure FarmBeats events with Azure Event Grid
ms.topic: conceptual
ms.date: 06/06/2021
---
# Azure FarmBeats as Event Grid source
This article provides the properties and schema for Azure FarmBeats events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). 

## Available event types

|Event Name | Description|
|:-----:|:----:|
Microsoft.AgFoodPlatform.FarmChanged| Published when a farm is created /updated/deleted or available from a provider in a FarmBeats resource
|Microsoft.AgFoodPlatform.FarmerChanged|Published when a farmer is created /updated/deleted or available from a provider in a FarmBeats resource
|Microsoft.AgFoodPlatform.SeasonalField Changed|Published when a Seasonal Field is created /updated/deleted or available  from a provider in a FarmBeats resource
|Microsoft.AgFoodPlatform.BoundaryChanged|Published when a farm is created /updated/deleted or available from a provider in a FarmBeats resource
|Microsoft.AgFoodPlatform.FieldChanged|Published when a Field is created /updated/deleted or available from a provider in a FarmBeats resource
|Microsoft.AgFoodPlatform.CropChanged|Published when a Crop is created /updated/deleted in a FarmBeats resource
|Microsoft.AgFoodPlatform.CropVarietyChanged|Published when a Crop Variety is created /updated/deleted in a FarmBeats resource
|Microsoft.AgFoodPlatform.SeasonChanged|Published when a Season is created /updated/deleted in a FarmBeats resource
|Microsoft.AgFoodPlatform.FarmOperations Job Changed|Published when data from the provider is available in FarmBeats resource
|Microsoft.AgFoodPlatform.ApplicationDataChanged|Published when Application Data from a provider is created /updated/deleted in a FarmBeats resource
|Microsoft.AgFoodPlatform.HarvestingDataChanged|Published when Harvesting Data from a provider is created /updated/deleted in a FarmBeats resource
|Microsoft.AgFoodPlatform.TillageDataChanged|Published when Tillage Data from a provider is created /updated/deleted in a FarmBeats resource
|Microsoft.AgFoodPlatform.PlantingDataChanged|Published when Planting Data from a provider is created /updated/deleted in a FarmBeats resource
|Microsoft.AgFoodPlatform.SatelliteDataIngestionJobStatusChanged| Published when the status of a satellite job changes. Possible states of a job are 'Waiting', 'Running', 'Canceled', 'Succeeded', 'Failed'.
|Microsoft.AgFoodPlatform.WeatherDataIngestionJobStatusChanged| Published when the status of a weather job changes. Possible states of a job are 'Waiting', 'Running', 'Canceled', 'Succeeded', 'Failed'.
|Microsoft.AgFoodPlatform.FarmOperationDataIngestionJobStatusChanged|Published when the status of a farm operation job changes. Possible states of a job are 'Waiting', 'Running', 'Canceled', 'Succeeded', 'Failed'.

## Example events
Each FarmBeats event has two parts, one that common across events and the data object, which contains properties specific to each event. The generic event schema that FarmBeats events follow is <a href = "https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/event-grid/event-schema.md#event-schema" target = "_blank">here </a>. The tables below elaborate on the properties within data object for each event.

*For farm, farmer, season, crop, crop variety events, the data object contains following properties:*

|Property | Type| Description|
|:-----:| :----:| :----:|
id|	string|	User-defined Id of the resource, such as FarmId, FarmerId etc.
actionType|	string|	Indicates the change triggered during publishing of the event. Applicable values are created, updated, deleted
properties|	object|	It contains user-defined key – value pairs
modifiedDateTime| string|	Indicates the time at which the event was last modified
createdDateTime| string|	Indicates the time at which the resource was created
status| string|	Contains the user-defined status of the object.
eTag|	string|	Implements optimistic concurrency
description| string|	Textual description of the resource


*Boundary events have the following data object:*
|Property | Type| Description|
|:-----:| :----:| :----:|
id|	string|	User-defined Id of boundary
actionType|	string|	Indicates the change which is triggered during publishing of the event. Applicable values are created, updated, deleted
properties|	object|	It contains user-defined key – value pairs
modifiedDateTime|string|Indicates the time at which the event was last modified
createdDateTime|string|	Indicates the time at which the resource was created
status|	string|	Contains the user-defined status of the object.
eTag|	string|	Implements optimistic concurrency
farmerId|	string|	Contains the id
parentId|	string|	Id of the parent boundary belongs
parentType|	string|	Type of the parent boundary belongs to
isPrimary|	boolean|	Indicates if the boundary is primary
description| string|	Textual description of the resource

*Seasonal Field events have the following data object:*

Property|	Type|	Description
|:-----:| :----:| :----:|
id|	string|	User-defined Id of the seasonal field
farmId|	string|	User-defined Id of the farm that seasonal field is associated with
farmerId|	string|	User-defined Id of the farmer that seasonal field is associated with
seasonId|	string|	User-defined Id of the season that seasonal field is associated with
fieldId|	string|	User-defined Id of the field that seasonal field is associated with
name|	string|	User-defined name of the seasonal field
actionType|	string|	Indicates the change which triggered publishing of the event. Applicable values are created, updated, deleted
properties|	object|	It contains user-defined key – value pairs
modifiedDateTime|string|	Indicates the time at which the event was last modified
createdDateTime|	string|	Indicates the time at which the resource was created
status|	string|	Contains the user-defined status of the object.
eTag|	string|	Implements optimistic concurrency
description| string|	Textual description of the resource

*Field events have the following data object:*

Property|	Type|	Description
|:-----:| :----:| :----:|
id|	string|	User-defined Id of the field
farmId|	string|	User-defined Id of the farm that  field is associated with
farmerId|	string|	User-defined Id of the farmer that field is associated with
name|	string|	User-defined name of the field
actionType|	string|	Indicates the change which triggered publishing of the event. Applicable values are created, updated, deleted
properties|	object| It contains user-defined key – value pairs
modifiedDateTime|string|Indicates the time at which the event was last modified
createdDateTime|string|	Indicates the time at which the resource was created
status|	string|	Contains the user-defined status of the object.
eTag|	string|	Implements optimistic concurrency
description|string|	Textual description of the resource
#

*Farm operations data events such as Application data, harvesting data, planting data, and tillage data have the following data object:*

Property|	Type|	Description
|:----:|:----:|:----:|
id|	string|	User-defined Id of the resource, such as FarmId, FarmerId etc.
status|	string|	Contains the status of the job. It can take any value from Created/Pending/Running/Failed/Succeeded
source|	string|	Message from FarmBeats giving details about the job.	
modifiedDateTime|	string|	Indicates the time at which the event was last modified
createdDateTime|	string|	Indicates the time at which the resource was created
eTag|	string|	Implements optimistic concurrency
description|string|	Textual description of the resource

*Job status change events for Satellite, weather and farm operations data ingestion have the following data object:*
Property|	Type|	Description
|:----:|:----:|:----:|
id|String| Unique Id of the job.
name| string| User-defined name of the job.
description|string| Textual description of the job.
farmerId|string| Id of the farmer for which job was created.
message|string| Status message to capture more details of the job.
status|string|Various states a job can be in.
lastActionDateTime|string|Date-time when last action was taken on job, sample format: yyyy-MM-ddTHH:mm:ssZ.
isCancellationRequested| boolean|Flag that gets set when job cancellation is requested.
createdDateTime| string|Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.



#
## Sample events 
These event samples represent an event notification.

**Event type: Microsoft.AgFoodPlatform.FarmerChanged**

````
{
    "data": {
      "actionType": "Created",
      "status": "Sample status",
      "modifiedDateTime": "2021-03-05T10:53:28Z",
      "eTag": "860197cc-0000-0700-0000-60420da80000",
      "id": "UNIQUE-FARMER-ID",
      "name": "Microsoft FarmBeats farmer",
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
````

**Event type: Microsoft.AgFoodPlatform.FarmChanged**
````
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
````

**Event type: Microsoft.AgFoodPlatform.FieldChanged**

````
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
  ````

  
  
  **Event type: Microsoft.AgFoodPlatform.CropChanged**
````
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
  ````

**Event type: Microsoft.AgFoodPlatform.CropVarietyChanged**

````
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
````

**Event type: Microsoft.AgFoodPlatform.BoundaryChanged**

````
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
  ````

**Event type: Microsoft.AgFoodPlatform.SeasonChanged**
````
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
  ````

**Event type: Microsoft.AgFoodPlatform.SeasonalFieldChanged**
````
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
````
**Event type: Microsoft.AgFoodPlatform.ApplicationDataChanged**

````
  {
    "data": {
      "actionType": "Created",
      "farmerId": "UNIQUE-FARMER-ID",
      "source": "Sample source",
      "modifiedDateTime": "2021-03-05T11:27:24Z",
      "eTag": "87011311-0000-0700-0000-6042159c0000",
      "id": "UNIQUE-APPLICATION-DATA-ID",
      "status": "Sample status",
      "name": "Display name",
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
````

**Event type: Microsoft.AgFoodPlatform.HarvestDataChanged**
````
  {
    "data": {
      "actionType": "Created",
      "farmerId": "UNIQUE-FARMER-ID",
      "source": "Sample source",
      "modifiedDateTime": "2021-03-05T11:33:41Z",
      "eTag": "8701141b-0000-0700-0000-604217150000",
      "id": "UNIQUE-HARVEST-DATA-ID",
      "status": "Sample status",
      "name": "Display name",
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
````
**Event type: Microsoft.AgFoodPlatform.PlantingDataChanged**
````
  {
    "data": {
      "actionType": "Created",
      "farmerId": "UNIQUE-FARMER-ID",
      "source": "Sample source",
      "modifiedDateTime": "2021-03-05T11:41:18Z",
      "eTag": "8701242a-0000-0700-0000-604218de0000",
      "id": "UNIQUE-PLANTING-DATA-ID",
      "status": "Sample status",
      "name": "Display name",
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
````
**Event type: Microsoft.AgFoodPlatform.SatelliteDataIngestionJobStatusChanged**
````
[
  {
    "data": {
      "farmerId": "UNIQUE - FARMER - ID",
      "message": "Created job 'job1' to fetch satellite data for boundary 'boundary1' from startDate '06/01/2021' to endDate '06/01/2021' (both inclusive).",
      "status": "Running",
      "lastActionDateTime": "2021-06-01T11:25:37.8634096Z",
      "isCancellationRequested": false,
      "id": "UNIQUE - JOB - ID",
      "name": "testjob1",
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
````
**Event type: Microsoft.AgFoodPlatform.WeatherDataIngestionJobStatusChanged**
````
[
  {
    "data": {
      "farmerId": "UNIQUE-FARMER-ID
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

````
**Event type: Microsoft.AgFoodPlatform.FarmOperationDataIngestionJobStatusChanged**
````
[
  {
    "data": {
      "farmerId": "UNIQUE-FARMER-ID",
      "message": "Job completed successfully. Data statistics:{ Processed operations count = 6, Organizations count = 1, Processed organizations count = 1, Processed fields count = 2, Operations count = 6, ShapefileAttachmentsCount = 0, Fields count = 2 }",
      "status": "Succeeded",
      "lastActionDateTime": "2021-06-01T11:30:54.733625Z",
      "isCancellationRequested": false,
      "id": "UNIQUE-JOB-ID",
      "name": "string",
      "description": "string",
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


````
## Next steps
* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
