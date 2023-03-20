---
title: Azure Data Manager for Agriculture
description: Describes the properties that are provided for Azure Data Manager for Agriculture events with Azure Event Grid.
ms.topic: conceptual
ms.date: 03/02/2023
---

# Azure Data Manager for Agriculture (Preview) as Event Grid source

This article provides the properties and schema for Azure Data Manager for Agriculture (Preview) events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md) and [Cloud event schema](cloud-event-schema.md).

## Available event types

### Farm management related event types

|Event Name | Description|
|:-----:|:----:|
|Microsoft.AgFoodPlatform.PartyChanged|Published when a `Party` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.FarmChangedV2| Published when a `Farm` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.FieldChangedV2|Published when a `Field` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.SeasonChanged|Published when a `Season` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.SeasonalFieldChangedV2|Published when a `Seasonal Field` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.BoundaryChangedV2|Published when a `Boundary` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.CropChanged|Published when a `Crop` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.CropProductChanged|Published when a `Crop Product` is created /updated/deleted.|
|Microsoft.AgFoodPlatform.AttachmentChangedV2|Published when an `Attachment` is created/updated/deleted.
|Microsoft.AgFoodPlatform.ManagementZoneChangedV2|Published when a `Management Zone` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.ZoneChangedV2|Published when an `Zone` is created/updated/deleted.|

### Satellite data related event types

|Event Name | Description|
|:-----:|:----:|
|Microsoft.AgFoodPlatform.SatelliteDataIngestionJobStatusChangedV2| Published when a satellite data ingestion job's status is changed, for example, job is created, has progressed or completed.|

### Weather data related event types

|Event Name | Description|
|:-----:|:----:|
|Microsoft.AgFoodPlatform.WeatherDataIngestionJobStatusChangedV2|Published when a weather data ingestion job's status is changed, for example, job is created, has progressed or completed.|
|Microsoft.AgFoodPlatform.WeatherDataRefresherJobStatusChangedV2| Published when a weather data refresher job status is changed, for example, job is created, has progressed or completed.|

### Farm activities data related event types

|Event Name | Description|
|:-----:|:----:|
|Microsoft.AgFoodPlatform.ApplicationDataChangedV2|Published when an `Application Data` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.HarvestDataChangedV2|Published when a `Harvesting Data` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.TillageDataChangedV2|Published when a `Tillage Data` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.PlantingDataChangedV2|Published when a `Planting Data` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.ImageProcessingRasterizeJobStatusChangedV2|Published when an image-processing rasterizes job's status is changed, for example, job is created, has progressed or completed.|
|Microsoft.AgFoodPlatform.FarmOperationDataIngestionJobStatusChangedV2| Published when a farm operations data ingestion job's status is changed, for example, job is created, has progressed or completed.|

### Sensor data related event types

|Event Name | Description|
|:-----:|:----:|
|Microsoft.AgFoodPlatform.SensorMappingChangedV2|Published when a `Sensor Mapping` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.SensorPartnerIntegrationChangedV2|Published when a `Sensor Partner Integration` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.DeviceDataModelChanged|Published when `Device Data Model` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.DeviceChanged|Published when a `Device` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.SensorDataModelChanged|Published when a `Sensor Data Model` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.SensorChanged|Published when a `Sensor` is created/updated/deleted.|

### Insight and observations related event types

|Event Name | Description|
|:-----:|:----:|
|Microsoft.AgFoodPlatform.PrescriptionChangedV2|Published when a `Prescription` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.PrescriptionMapChangedV2|Published when a `Prescription Map` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.PlantTissueAnalysisChangedV2|Published when a `Plant Tissue Analysis` data is created/updated/deleted.|
|Microsoft.AgFoodPlatform.NutrientAnalysisChangedV2|Published when a `Nutrient Analysis` data is created/updated/deleted.|
|Microsoft.AgFoodPlatform.InsightChangedV2| Published when an `Insight` is created/updated/deleted.|
|Microsoft.AgFoodPlatform.InsightAttachmentChangedV2| Published when an `Insight Attachment` is created/updated/deleted.|

### Model inference jobs related event types

|Event Name | Description|
|:-----:|:----:|
|Microsoft.AgFoodPlatform.BiomassModelJobStatusChangedV2|Published when a Biomass Model job's status is changed, for example, job is created, has progressed or completed.|
|Microsoft.AgFoodPlatform.SoilMoistureModelJobStatusChangedV2|Published when a Soil Moisture Model job's status is changed, for example, job is created, has progressed or completed.|
|Microsoft.AgFoodPlatform.SensorPlacementModelJobStatusChangedV2|Published when a Sensor Placement Model job's status is changed, for example, job is created, has progressed or completed.|

## Example events

# [Event Grid event schema](#tab/event-grid-event-schema)

The following example show schema for **Microsoft.AgFoodPlatform.PartyChanged**:

```JSON
[
  {
      "data": {
        "actionType": "Deleted",
        "modifiedDateTime": "2022-10-17T18:43:37Z",
        "eTag": "f700fdd7-0000-0700-0000-634da2550000",
        "properties": {
        "key1": "value1",
        "key2": 123.45
        },
        "id": "<YOUR-PARTY-ID>",
        "createdDateTime": "2022-10-17T18:43:30Z"
      },
      "id": "23fad010-ec87-40d9-881b-1f2d3ba9600b",
      "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
      "subject": "/parties/<YOUR-PARTY-ID>",
      "eventType": "Microsoft.AgFoodPlatform.PartyChanged",
      "dataVersion": "1.0",
      "metadataVersion": "1",
      "eventTime": "2022-10-17T18:43:37.3306735Z"
    }
]
```

# [Cloud event schema](#tab/cloud-event-schema)

The following example show schema for **Microsoft.AgFoodPlatform.PartyChanged**:

```JSON
[
  {
      "data": {
        "actionType": "Deleted",
        "modifiedDateTime": "2022-10-17T18:43:37Z",
        "eTag": "f700fdd7-0000-0700-0000-634da2550000",
        "properties": {
        "key1": "value1",
        "key2": 123.45
        },
        "id": "<YOUR-PARTY-ID>",
        "createdDateTime": "2022-10-17T18:43:30Z"
      },
      "id": "23fad010-ec87-40d9-881b-1f2d3ba9600b",
      "source": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
      "subject": "/parties/<YOUR-PARTY-ID>",
      "type": "Microsoft.AgFoodPlatform.PartyChanged",
      "specversion":"1.0",
      "time": "2022-10-17T18:43:37.3306735Z"
    }
]
```

---

## Event properties

# [Event Grid event schema](#tab/event-grid-event-schema)

An event has the following top-level data:

| Property | Type | Description |
|:-----:|:----:|:----:|
| `topic` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `eventType` | string | One of the registered event types for this event source. |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | App Configuration event data. |
| `dataVersion` | string | The schema version of the data object. The publisher defines the schema version. |
| `metadataVersion` | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

# [Cloud event schema](#tab/cloud-event-schema)

An event has the following top-level data:

| Property | Type | Description |
|:-----:|:----:|:----:|
| `source` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | Publisher-defined path to the event subject. |
| `type` | string | One of the registered event types for this event source. |
| `time` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | App Configuration event data. |
| `specversion` | string | CloudEvents schema specification version. |

---

The data object has the following common properties:

### For resource change related event types

|Property | Type| Description|
|:-----:|:----:|:----:|
|id| String| Unique ID of resource.|
|actionType| String| Indicates the change, which triggered publishing of the event. Applicable values are created, updated, deleted.|
|properties| Object| It contains user defined key–value pairs.|
|modifiedDateTime|String| Indicates the time at which the event was last modified.|
|createdDateTime| String| Indicates the time at which the resource was created.|
|status| String| Contains the user defined status of the object.|
|eTag| String| Implements optimistic concurrency.|
|description| string| Textual description of the resource.|
|name| string| Name to identify resource.|

### For job status change related event types

Property| Type| Description
|:-----:|:----:|:----:|
|id|String| Unique ID of the job.|
|name| string| User-defined name of the job.|
|status|string|Various states a job can be in.|
|isCancellationRequested| boolean|Flag that gets set when job cancellation is requested.|
|description|string| Textual description of the job.|
|partyId|string| Party ID for which job was created.|
|message|string| Status message to capture more details of the job.|
|lastActionDateTime|date-time|Date-time when last action was taken on the job, sample format: yyyy-MM-ddTHH:mm:ssZ.|
|createdDateTime|date-time|Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.|
|properties| Object| It contains user defined key-value pairs.|

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md).
* For more information about how to create an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
