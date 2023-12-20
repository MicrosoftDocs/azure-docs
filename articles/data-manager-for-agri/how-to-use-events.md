---
title: Azure Data Manager for Agriculture events with Azure Event Grid.
description: Learn about properties that are provided for Azure Data Manager for Agriculture events with Azure Event Grid.
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: how-to
ms.date: 04/18/2023
ms.custom: template-how-to
---

# Azure Data Manager for Agriculture Preview as Event Grid source 

This article provides the properties and schema for Azure Data Manager for Agriculture events. For an introduction to event schemas, see [Azure Event Grid](/azure/event-grid/event-schema) event schema.

## Prerequisites

It's important that you have the following prerequisites completed before you begin the steps of deploying the Events feature in Azure Data Manager for Agriculture.

* [An active Azure account](https://azure.microsoft.com/free/search/?OCID=AID2100131_SEM_c4b0772dc7df1f075552174a854fd4bc:G:s&ef_id=c4b0772dc7df1f075552174a854fd4bc:G:s&msclkid=c4b0772dc7df1f075552174a854fd4bc)
* [Microsoft Azure Event Hubs namespace and an event hub deployed in the Azure portal](../event-hubs/event-hubs-create.md)

## Reacting to Data Manager for Agriculture events

Data Manager for Agriculture events allow applications to react to creation, deletion and updating of resources. Data Manager for Agriculture events are pushed using <a href="https://azure.microsoft.com/services/event-grid/" target="_blank"> Azure Event Grid</a>. 

Azure Functions, Azure Logic Apps, or even to your own http listener can subscribe to these events. Azure Event Grid provides reliable event delivery to your applications through rich retry policies and dead-lettering.

Here are example scenarios for consuming events in our service:
1. When downloading satellite or weather data or executing jobs, you can use events to respond to changes in job status. You can minimize long polling can and decreasing the number of API calls to the service. You can also get prompt notification of job completion. All our asynchronous ingestion jobs are capable of supporting events. 

> [!NOTE]
> Events related to ISV solutions flow are not currently supported.

2. If there are modifications to data-plane resources such as party, fields, farms and other similar elements, you can react to changes and you can trigger workflows.

## Filtering events
You can filter Data Manager for Agriculture <a href="/cli/azure/eventgrid/event-subscription" target="_blank"> events </a> by event type, subject, or fields in the data object. Filters in Event Grid match the beginning or end of the subject so that events that match can go to the subscriber.

For instance, for the PartyChanged event, to receive notifications for changes for a particular party with ID Party1234, you may use the subject filter "EndsWith" as shown:

EndsWith- /Party1234 
The subject for this event is of the format 
```"/parties/Party1234"```

Subjects in an event schema provide 'starts with' and 'exact match' filters as well.

Similarly, to filter the same event for a group of party IDs, use the Advanced filter on partyId field in the event data object. In a single subscription, you may add five advanced filters with a limit of 25 values for each key filtered.

To learn more about how to apply filters, see <a href = "/azure/event-grid/how-to-filter-events" target = "_blank"> filter events for Event Grid. </a>

## Subscribing to events
You can subscribe to Data Manager for Agriculture events by using Azure portal or Azure Resource Manager client. Each of these provide the user with a set of functionalities. Refer to following resources to know more about each method.

<a href = "/azure/event-grid/subscribe-through-portal" target = "_blank"> Subscribe to events using portal </a>

<a href = "/azure/event-grid/sdk-overview" target = "_blank"> Subscribe to events using the ARM template client </a>

## Practices for consuming events

Applications that handle Data Manager for Agriculture events should follow a few recommended practices:

* Check that the eventType is one you're prepared to process, and don't assume that all events you receive are the types you expect.
* As messages can arrive out of order, use the modifiedTime and etag fields to understand the order of events for any particular object.
* Data Manager for Agriculture events guarantees at-least-once delivery to subscribers, which ensures that all messages are outputted. However due to retries or availability of subscriptions, duplicate messages may occasionally occur. To learn more about message delivery and retry, see <a href = "/azure/event-grid/delivery-and-retry" target = "_blank">Event Grid message delivery and retry </a>
* Ignore fields you don't understand. This practice will help keep you resilient to new features that might be added in the future.


### Available event types

|Event Name | Description|
|:-----|:----|
|Microsoft.AgFoodPlatform.PartyChanged|Published when a party is created /updated/deleted in an Azure Data Manager for Agriculture resource
|Microsoft.AgFoodPlatform.FarmChangedV2| Published when a farm is created /updated/deleted in an Azure Data Manager for Agriculture resource
|Microsoft.AgFoodPlatform.FieldChangedV2|Published when a Field is created /updated/deleted in an Azure Data Manager for Agriculture resource
|Microsoft.AgFoodPlatform.SeasonalFieldChangedV2|Published when a Seasonal Field is created /updated/deleted in an Azure Data Manager for Agriculture resource
|Microsoft.AgFoodPlatform.CropChanged|Published when a Crop is created /updated/deleted in an Azure Data Manager for Agriculture resource
|Microsoft.AgFoodPlatform.CropProductChanged|Published when a Crop Product is created /updated/deleted in an Azure Data Manager for Agriculture resource
|Microsoft.AgFoodPlatform.SeasonChanged|Published when a Season is created /updated/deleted in an Azure Data Manager for Agriculture resource
|Microsoft.AgFoodPlatform.SatelliteDataIngestionJobStatusChangedV2| Published when a satellite data ingestion job's status changes, for example, job is created, has progressed or completed.
|Microsoft.AgFoodPlatform.WeatherDataIngestionJobStatusChangedV2|Published when a weather data ingestion job's status changes, for example, job is created, has progressed or completed.
|Microsoft.AgFoodPlatform.WeatherDataRefresherJobStatusChangedV2| Published when Weather Data Refresher job status is changed.
|Microsoft.AgFoodPlatform.SensorMappingChangedV2|Published when Sensor Mapping is changed
|Microsoft.AgFoodPlatform.SensorPartnerIntegrationChangedV2|Published when Sensor Partner Integration is changed
|Microsoft.AgFoodPlatform.DeviceDataModelChanged|Published when Device Data Model is changed
|Microsoft.AgFoodPlatform.DeviceChanged|Published when Device is changed
|Microsoft.AgFoodPlatform.SensorDataModelChanged|Published when Sensor Data Model is changed
|Microsoft.AgFoodPlatform.SensorChanged|Published when Sensor is changed
|Microsoft.AgFoodPlatform.FarmOperationDataIngestionJobStatusChangedV2| Published when a farm operations data ingestion job's status changes, for example, job is created, has progressed or completed.
|Microsoft.AgFoodPlatform.ApplicationDataChangedV2|Published when Application Data is created /updated/deleted in an Azure Data Manager for Agriculture resource
|Microsoft.AgFoodPlatform.HarvestDataChangedV2|Published when Harvesting Data is created /updated/deleted in an Azure Data Manager for Agriculture resource
|Microsoft.AgFoodPlatform.TillageDataChangedV2|Published when Tillage Data is created /updated/deleted in an Azure Data Manager for Agriculture resource
|Microsoft.AgFoodPlatform.PlantingDataChangedV2|Published when Planting Data is created /updated/deleted in an Azure Data Manager for Agriculture resource
|Microsoft.AgFoodPlatform.AttachmentChangedV2|Published when an attachment is created/updated/deleted.
|Microsoft.AgFoodPlatform.ZoneChangedV2|Published when a zone is created/updated/deleted.
|Microsoft.AgFoodPlatform.ManagementZoneChangedV2|Published when a management zone is created/updated/deleted.
|Microsoft.AgFoodPlatform.PrescriptionChangedV2|Published when a prescription is created/updated/deleted.
|Microsoft.AgFoodPlatform.PrescriptionMapChangedV2|Published when a prescription map is created/updated/deleted.
|Microsoft.AgFoodPlatform.PlantTissueAnalysisChangedV2|Published when plant tissue analysis data is created/updated/deleted.
|Microsoft.AgFoodPlatform.NutrientAnalysisChangedV2|Published when nutrient analysis data is created/updated/deleted.
|Microsoft.AgFoodPlatform.ImageProcessingRasterizeJobStatusChangedV2|Published when an image processing rasterize job status changes, for example, job is created, has progressed or completed.
|Microsoft.AgFoodPlatform.InsightChangedV2| Published when Insight is created/updated/deleted.
|Microsoft.AgFoodPlatform.InsightAttachmentChangedV2| Published when Insight Attachment is created/updated/deleted.
|Microsoft.AgFoodPlatform.BiomassModelJobStatusChangedV2|Published when Biomass Model job status is changed
|Microsoft.AgFoodPlatform.SoilMoistureModelJobStatusChangedV2|Published when Soil Moisture Model job status is changed
|Microsoft.AgFoodPlatform.SensorPlacementModelJobStatusChangedV2|Published when Sensor Placement Model Job status is changed


### Event properties

Each Azure Data Manager for Agriculture event has two parts, the first part is common across events and the second, data object contains properties specific to each event. 

The part common across events is elaborated in the **Event Grid event schema** and has the following top-level data:

|Property | Type| Description|
|:-----| :----| :----|
topic| string| Full resource path to the event source. This field isn't writeable. Event Grid provides this value.
subject| string| Publisher-defined path to the event subject.
eventType | string| One of the registered event types for this event source.
eventTime| string| The time the event is generated based on the provider's UTC time.
| ID | string| Unique identifier for the event.
data| object| Data object with properties specific to each event type.
dataVersion| string| The schema version of the data object. The publisher defines the schema version.
metadataVersion| string| The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value.

For party, season, crop, crop product changed events, the data object contains following properties:

|Property | Type| Description|
|:-----| :----| :----|
| ID |	string|	Unique ID of resource.
actionType|	string|	Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted
properties|	Object|	It contains user defined key – value pairs.
modifiedDateTime|string| Indicates the time at which the event was last modified.
createdDateTime| string| Indicates the time at which the resource was created.
status|	string|	Contains the user defined status of the object.
eTag|	string|	Implements optimistic concurrency.
description| string| Textual description of the resource.
name| string|	Name to identify resource.

For farm events, the data object contains following properties:

|Property | Type| Description|
|:-----| :----| :----|
| ID |	string|	Unique ID of resource.
actionType|	string|	Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted
properties|	Object|	It contains user defined key – value pairs.
modifiedDateTime|string|	Indicates the time at which the event was last modified.
createdDateTime|	string|	Indicates the time at which the resource was created.
status|	string|	Contains the user defined status of the object.
eTag|	string|	Implements optimistic concurrency.
description|	string|	Textual description of the resource.
name|	string|	Name to identify resource.
partyId| string| ID of the party it belongs to.

For device data model, and sensor data model events, the data object contains following properties:

|Property | Type| Description|
|:-----| :----| :----|
sensorPartnerId| string| ID associated with the sensorPartner.
| ID |	string|	Unique ID of resource.
actionType|	string|	Indicates the change which triggered publishing of the event. Applicable values are created, updated, deleted
properties|	Object|	It contains user defined key – value pairs.
modifiedDateTime|string| Indicates the time at which the event was last modified.
createdDateTime| string| Indicates the time at which the resource was created.
status|	string|	Contains the user defined status of the object.
eTag| string| Implements optimistic concurrency.
description| string| Textual description of the resource.
name| string| Name to identify resource.

For device events, the data object contains following properties:

|Property | Type| Description|
|:-----| :----| :----|
deviceDataModelId| string| ID associated with the deviceDataModel.
integrationId| string| ID associated with the integration.
sensorPartnerId| string| ID associated with the sensorPartner.
| ID |	string|	Unique ID of resource.
actionType|	string|	Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted
properties|	Object|	It contains user defined key – value pairs.
modifiedDateTime|string|	Indicates the time at which the event was last modified.
createdDateTime|	string|	Indicates the time at which the resource was created.
status|	string|	Contains the user defined status of the object.
eTag|	string|	Implements optimistic concurrency.
description|	string|	Textual description of the resource.
name|	string|	Name to identify resource.

For sensor events, the data object contains following properties:

|Property | Type| Description|
|:-----| :----| :----|
sensorDataModelId| string| ID associated with the sensorDataModel.
integrationId| string| ID associated with the integration.
deviceId| string| ID associated with the device.
sensorPartnerId| string| ID associated with the sensorPartner.
| ID |	string|	Unique ID of resource.
actionType|	string|	Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted
properties|	Object|	It contains user defined key – value pairs.
modifiedDateTime|string|	Indicates the time at which the event was last modified.
createdDateTime|	string|	Indicates the time at which the resource was created.
status|	string|	Contains the user defined status of the object.
eTag|	string|	Implements optimistic concurrency.
description|	string|	Textual description of the resource.
name|	string|	Name to identify resource.

For sensor mapping events, the data object contains following properties:

|Property | Type| Description|
|:-----| :----| :----|
sensorId| string| ID associated with the sensor.
partyId| string| ID associated with the party.
sensorPartnerId| string| ID associated with the sensorPartner.
| ID |	string|	Unique ID of resource.
actionType|	string|	Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted
properties|	Object|	It contains user defined key – value pairs.
modifiedDateTime|string|	Indicates the time at which the event was last modified.
createdDateTime|	string|	Indicates the time at which the resource was created.
status|	string|	Contains the user defined status of the object.
eTag|	string|	Implements optimistic concurrency.
description|	string|	Textual description of the resource.
name|	string|	Name to identify resource.

For sensor partner integration events, the data object contains following properties:

|Property | Type| Description|
|:-----| :----| :----|
integrationId| string| ID associated with the integration.
partyId| string| ID associated with the party.
sensorPartnerId| string| ID associated with the sensorPartner.
| ID |	string|	Unique ID of resource.
actionType|	string|	Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted
properties|	Object|	It contains user defined key – value pairs.
modifiedDateTime|string|	Indicates the time at which the event was last modified.
createdDateTime|	string|	Indicates the time at which the resource was created.
status|	string|	Contains the user defined status of the object.
eTag|	string|	Implements optimistic concurrency.
description|	string|	Textual description of the resource.
name|	string|	Name to identify resource.

Seasonal field events have the following data object:

Property|	Type|	Description
|:-----| :----| :----|
ID |	string|	User defined ID of the seasonal field
farmId|	string|	User defined ID of the farm that seasonal field is associated with.
partyId|	string|	ID of the party it belongs to.
seasonId|	string|	User defined ID of the season that seasonal field is associated with.
fieldId|	string|	User defined ID of the field that seasonal field is associated with.
name|	string|	User defined name of the seasonal field.
actionType|	string|	Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted.
properties|	Object|	It contains user defined key-value pairs.
modifiedDateTime|string|	Indicates the time at which the event was last modified.
createdDateTime|	string|	Indicates the time at which the resource was created.
status|	string|	Contains the user defined status of the object.
eTag|	string|	Implements optimistic concurrency.
description|	string|	Textual description of the resource.

Insight events have the following data object:

Property|	Type|	Description
|:-----| :----| :----|
modelId| string| ID of the associated model.|
resourceId| string| User-defined ID of the resource such as farm, field etc.|
resourceType| string | Name of the resource type. Applicable values are Party, Farm, Field, SeasonalField etc.|
partyId| string| ID of the party it belongs to.|
modelVersion| string| Version of the associated model.|
ID |	string|	User defined ID of the resource.|
status|	string|	Contains the status of the job. |
actionType|string| Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted. |
modifiedDateTime| date-time| Date-time when resource was last modified, sample format: yyyy-MM-ddTHH:mm:ssZ.|
createdDateTime| date-time| Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.|
eTag| string| Implements optimistic concurrency|
description| string| A list of key value pairs that describe the resource. Only string and numerical values are supported. |
name| string| User-defined name of the resource.|
properties|	object|	User-defined name of the resource.|

InsightAttachment events have the following data object:

Property|	Type|	Description
|:-----| :----| :----|
modelId| string| ID of the associated model.
resourceId| string| User-defined ID of the resource such as farm, field etc.
resourceType| string | Name of the resource type.
partyId| string| ID of the party it belongs to.
insightId| string| ID associated with the insight resource.
ID |	string|	User defined ID of the resource.
status|	string|	Contains the status of the job. 
actionType|string| Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted.
modifiedDateTime| date-time|Date-time when resource was last modified, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime|date-time|Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.
eTag|	string|	Implements optimistic concurrency
description|string|	A list of key value pairs that describe the resource. Only string and numerical values are supported.
name|	string|	User-defined name of the resource.
properties|	object|	User-defined name of the resource.

Field events have the following data object:

Property|	Type|	Description
|:-----| :----| :----|
| ID |	string|	User defined ID of the field.
farmId|	string|	User defined ID of the farm that  field is associated with.
partyId|	string|	ID of the party it belongs to.
name|	string|	User defined name of the field.
actionType|	string|	Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted.
properties|	Object| It contains user defined key-value pairs.
modifiedDateTime|string|Indicates the time at which the event was last modified.
createdDateTime|	string|	Indicates the time at which the resource was created.
status|	string|	Contains the user defined status of the object.
eTag|	string|	Implements optimistic concurrency.
description|	string|	Textual description of the resource.

ImageProcessingRasterizeJobStatusChanged event has the following data object:

Property|	Type|	Description
|:-----| :----| :----|
shapefileAttachmentId | string|User-defined ID name of the associated shape file.
partyId|string| Party ID for which job was created.
| ID |string| Unique ID of the job.
name| string| User-defined name of the job.
status|string|Various states a job can be in. Applicable values are Waiting, Running, Succeeded, Failed, Canceled etc.
isCancellationRequested| boolean|Flag that gets set when job cancellation is requested.
description|string| Textual description of the job.
message|string| Status message to capture more details of the job.
lastActionDateTime|date-time|Date-time when last action was taken on the job, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime|date-time|Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.
properties|	Object|	It contains user defined key-value pair

SatelliteDataIngestionJobChanged, WeatherDataIngestionJobChanged, WeatherDataRefresherJobChanged, BiomassModelJobStatusChanged, SoilMoistureModelJobStatusChanged, and FarmOperationDataIngestionJobChanged events have the following data object:

Property|	Type|	Description
|:-----| :----| :----|
| ID |string| Unique ID of the job.
name| string| User-defined name of the job.
status|string|Various states a job can be in.
isCancellationRequested| boolean|Flag that gets set when job cancellation is requested.
description|string| Textual description of the job.
partyId|string| Party ID for which job was created.
message|string| Status message to capture more details of the job.
lastActionDateTime|date-time|Date-time when last action was taken on the job, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime|date-time|Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.
properties|	Object|	It contains user defined key-value pairs.

Farm operations data events such as application data, harvesting data, planting data, and tillage data have the following data object:

Property|	Type|	Description
|:-----| :----| :----|
| ID |	string|	Unique ID of resource.
status|	string|	Contains the user defined status of the resource.
partyId| string| ID of the party it belongs to.
source|	string|	Message from Azure Data Manager for Agriculture giving details about the job.	
modifiedDateTime| string| Indicates the time at which the event was last modified
createdDateTime| string| Indicates the time at which the resource was created
eTag| string| Implements optimistic concurrency
name| string| Name to identify resource.
description| string| Textual description of the resource
actionType| string|Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted.
properties|	Object|	It contains user defined key-value pairs.


AttachmentChanged event has the following data object

Property|	Type|	Description
|:-----| :----| :----|
resourceId| string| User-defined ID of the resource such as farm, field etc.
resourceType| string | Name of the resource type.
partyId| string| ID of the party it belongs to.
| ID |	string|	User defined ID of the resource.
status|	string|	Contains the status of the job. 
actionType|string| Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted.
modifiedDateTime| date-time|Date-time when resource was last modified, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime|date-time|Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.
eTag|	string|	Implements optimistic concurrency
description|string|	Textual description of the resource
name|	string|	User-defined name of the resource.


ZoneChanged event has the following data object

Property|	Type|	Description
|:-----| :----| :----|
managementZoneId| string | Management Zone ID associated with the zone.
partyId| string | User-defined ID of associated field.
| ID |	string|	Id of the party it belongs to
status|	string|	Contains the user defined status of the resource. 
actionType| string| Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted.	
modifiedDateTime| date-time|Date-time when resource was last modified, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime|date-time|Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.
eTag|	string|	Implements optimistic concurrency
description|string|	Textual description of the resource
name|	string|	User-defined name of the resource.
properties|	object|	A list of key value pairs that describe the resource. Only string and numeral values are supported.

PrescriptionChanged event has the following data object

|Property | Type| Description|
|:-----| :----| :----|
prescriptionMapId|string|	User-defined ID of the associated prescription map.
partyId| string|ID of the party it belongs to.
| ID |	string|	User-defined ID of the prescription.
actionType|	string|	Indicates the change triggered during publishing of the event. Applicable values are Created, Updated, Deleted
status| string|	Contains the user-defined status of the prescription.
properties|	object|	It contains user-defined key-value pairs.
modifiedDateTime| date-time|Date-time when resource was last modified, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime|date-time|Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.
eTag|	string|	Implements optimistic concurrency
description| string| Textual description of the resource
name| string|	User-defined name of the prescription.

PrescriptionMapChanged and ManagementZoneChanged events have the following data object:

Property|	Type|	Description
|:-----| :----| :----|
|seasonId |string | User-defined ID of the associated season.
|cropId |string | User-defined ID of the associated crop.
|fieldId |string | User-defined ID of the associated field.
|partyId |string| ID of the party it belongs to.
| ID | string|	User-defined ID of the resource.
|actionType | string| Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted.
modifiedDateTime | date-time| Date-time when resource was last modified, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime | date-time| Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.
eTag| string | Implements optimistic concurrency
description | string| Textual description of the resource
name| string |	User-defined name of the prescription map.
properties |object|	It contains user-defined key-value pairs
status| string | Status of the resource.

PlantTissueAnalysisChanged event has the following data object:

Property|	Type|	Description
|:-----| :----| :----|
|seasonId|string|User-defined ID of the associated season.
|cropId| string | User-defined ID of the associated crop.
|cropProductId | string| Crop Product ID associated with the plant tissue analysis.
|fieldId| string | User-defined ID of the associated field.
|partyId| string | ID of the party it belongs to.
| ID| string | User-defined ID of the resource.
|actionType | string | Indicates the change that triggered publishing of the event. Applicable values are created, updated, deleted.
modifiedDateTime| date-time | Date-time when resource was last modified, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime| date-time | Date-time when resource was created, sample format: yyyy-MM-ddTHH:mm:ssZ.
eTag| string| Implements optimistic concurrency.
description | string| Textual description of the resource.
name| string| User-defined name of the prescription map.
properties | object| It contains user-defined key-value pairs.
status| string| Status of the resource.

NutrientAnalysisChanged event has the following data object:

|Property | Type| Description|
|:-----| :----| :----|
parentId| string| ID of the parent nutrient analysis belongs to.
parentType|	string|	Type of the parent nutrient analysis belongs to. Applicable value(s) are PlantTissueAnalysis.
partyId| string|ID of the party it belongs to.
| ID |	string|	User-defined ID of nutrient analysis.
actionType|	string|	Indicates the change that is triggered during publishing of the event. Applicable values are Created, Updated, Deleted.
properties|	object|	It contains user-defined key-value pairs.
modifiedDateTime| date-time|Date-time when nutrient analysis was last modified, sample format: yyyy-MM-ddTHH:mm:ssZ.
createdDateTime|date-time|Date-time when nutrient analysis was created, sample format: yyyy-MM-ddTHH:mm:ssZ.
status| string|	Contains user-defined status of the nutrient analysis.
eTag| string| Implements optimistic concurrency.
description| string| Textual description of resource.
name| string| User-defined name of the nutrient analysis.


## Sample events
For Sample events, refer to [this](./sample-events.md) page

## Next steps
* For an introduction to Azure Event Grid, see [What is Event Grid?](../event-grid/overview.md)
* Test our APIs [here](/rest/api/data-manager-for-agri).
