---
title: Enable logging for Azure Data Manager for Agriculture
description: Learn how enable logging and debugging in Azure Data Manager for Agriculture
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: how-to
ms.date: 04/10/2023
ms.custom: template-how-to
---

# Azure Data Manager for Agriculture logging

After you create a Data Manager for Agriculture resource instance, you can monitor how and when your resources are accessed, and by whom. You can also debug reasons for failure for data-plane requests. To do this, you need to enable logging for Azure Data Manager for Agriculture. You can then save log information at a destination such as a storage account, event hub or a log analytics workspace, that you provide. 

This article provides you with the steps to set up logging for Azure Data Manager for Agriculture.

## Enable collection of logs

After creating a Data Manager for Agriculture service resource, navigate to diagnostics settings and then select `add diagnostics settings`. Follow these steps to start collecting and storing logs:

1. Provide a name for the diagnostic setting.
2. Select the categories that you want to start collecting logs for.
3. Choose the destination for collection from storage account, event hub or a log analytics workspace.

:::image type="content" source="./media/how-to-set-up-audit-logs/create-diagnostics-settings.png" alt-text="Screenshot showing steps to create diagnostics setting in Azure portal.":::

Now you can navigate to the destination you specified in the diagnostic setting to access logs. You can access your logging information 10 minutes (at most) after the Data Manager for Agriculture operation. In most cases, it's quicker.

## Interpret your logs
Each log follows the schema listed in the table. The table contains the field names and descriptions:

| Field name | Description |
| --- | --- |
| **time** |Date and time in UTC. |
| **resourceId** |Azure Resource Manager resource ID. For logs, this is the Data Manager for Agriculture resource ID. |
| **operationName** |Name of the operation, as documented. |
| **operationVersion** |REST API version requested by the client. |
| **category** |Type of result. |
| **resultType** |Result of the REST API request (success or failure). |
| **resultSignature** |HTTP status. |
| **resultDescription** |Extra description about the result, when available. |
| **durationMs** |Time it took to service the REST API request, in milliseconds.|
| **callerIpAddress** |IP address of the client that made the request. |
|**level**|The severity level of the event (Informational, Warning, Error, or Critical).
| **correlationId** |An optional GUID that can be used to correlate logs. |
| **identity** |Identity from the token that was presented in the REST API request. This is usually an object ID and an application ID or either of the two.|
|**location**|The region of the resource emitting the event such as "East US" |
| **properties** |For each `operationName` this contains: `requestUri` (URI of the API request), `partyId`(partyId associated with the request, wherever applicable),`dataPlaneResourceId` (ID that uniquely identifies the data-plane resource in the request) and `requestBody` (contains the request body for the API call associated with the `operationName` for all categories other than ApplicationAuditLogs). </br> Other than the common one's mentioned before `jobProcessesLogs` category has: </br> 1. This list is of fields across operationNames: </br> `jobRunType` (can be oneTime or periodic), `jobId` (ID of the job),  `initiatedBy` (indicates whether a job was triggered by a user or by the service). </br> 2. This list is of fields for failed farmOperation related jobs: </br> `farmOperationEntityId` (ID of the entity that failed to be created by the farmOperation job), `farmOperationEntityType`(type of the entity that failed to be created), `errorCode`(code for job failure), `errorMessage`(description of failure), `internalErrorCode`(failure code provide by the provider), `internalErrorMessage`(description of the failure provided by the provider), `providerId`(ID of the provider).


The `categories` field for Data Manager for Agriculture can have values that are listed in the following table:
### Categories table
| category| Description |
| --- | --- |
|FarmManagementLogs| Logs for CRUD operations for party, Farm, Field, Seasonal Field, Crop, CropVariety, Season, Attachment, prescription maps, prescriptions, management zones, zones, plant tissue analysis and nutrient analyses.
|FarmOperationsLogs|Logs for CRUD operations for FarmOperations data ingestion job, ApplicationData, PlantingData, HarvestingData, TillageData
|SatelliteLogs| Logs for create and get operations for Satellite data ingestion job
|WeatherLogs|Logs for create, delete and get operations for weather data ingestion job
|ProviderAuthLogs| Logs for create, update, delete, cascade delete, get and get all for Oauth providers. It also has logs for get, get all, cascade delete for oauth tokens.
|JobProcessedLogs| Logs for indicating success or failure and reason of failure for jobs. In addition to logs for resource cascade delete jobs, data-ingestion jobs, it also contains logs for farm operations and event handling jobs.
|ModelInferenceLogs| Logs for create and get operations for biomass model job.
|InsightLogs| Logs for get and get all operations for insights.
|ApplicationAuditLogs| Logs for privileged actions such as data-plane resource create, update, delete and subscription management operations. Complete list is in the operation name table below.

The `operationName` field values are in *Microsoft.AgFoodPlatform/resource-name/read or write or delete or action* format. 
* `/write` suffix in the operation name corresponds to a create or update the resource-name
* `/read`suffix in the operation name corresponds to a GET/ LIST /GET ALL API calls or GET status for a cascade delete job for the resource-name
* `/delete` suffix corresponds to the deletion of the resource-name
* `/action` suffix corresponds to POST method calls for a resource name
* `/processed` suffix corresponds to completion of a job (a PUT method call). This indicates status of the job (success or failure).
* `/failures` suffix corresponds to failure of a farm operation job (a PUT method call) and contains description about the reason of failure.

The nomenclature for Jobs is as following:
* For data-ingestion jobs:  *Microsoft.AgFoodPlatform/ingestionJobs/<'resource-name'>DataingestionJobs/write*
* For deletion jobs: *Microsoft.AgFoodPlatform/deletionJobs/<'resource-name'>cascadeDeleteJobs/write*

The following table lists the **operationName** values and corresponding REST API commands for a category as a tab:

### FarmManagementLogs

| operationName | 
| --- |
|Microsoft.AgFoodPlatform/farmers/write| 
|Microsoft.AgFoodPlatform/farmers/read| 
|Microsoft.AgFoodPlatform/deletionJobs/farmersCascadeDeleteJobs/write|
|Microsoft.AgFoodPlatform/farms/write| 
|Microsoft.AgFoodPlatform/farms/read| 
|Microsoft.AgFoodPlatform/farms/delete|
|Microsoft.AgFoodPlatform/deletionJobs/farmsCascadeDeleteJobs/write|
|Microsoft.AgFoodPlatform/field/write|
|Microsoft.AgFoodPlatform/field/read|
|Microsoft.AgFoodPlatform/field/delete| 
|Microsoft.AgFoodPlatform/deletionJobs/fieldsCascadeDeleteJobs/write|
|Microsoft.AgFoodPlatform/seasonalField/write|
|Microsoft.AgFoodPlatform/seasonalField/read|
|Microsoft.AgFoodPlatform/seasonalField/delete|
|Microsoft.AgFoodPlatform/deletionJobs/seasonalFieldsCascadeDeleteJobs/write| 
|Microsoft.AgFoodPlatform/boundaries/write| 
|Microsoft.AgFoodPlatform/boundaries/read|
|Microsoft.AgFoodPlatform/boundaries/delete|
|Microsoft.AgFoodPlatform/boundaries/action|
|Microsoft.AgFoodPlatform/deletionJobs/fieldsCascadeDeleteJobs/write| 
|Microsoft.AgFoodPlatform/crops/write|
|Microsoft.AgFoodPlatform/crops/read| 
|Microsoft.AgFoodPlatform/crops/delete|
|Microsoft.AgFoodPlatform/cropVarieties/write|
|Microsoft.AgFoodPlatform/cropVarieties/read|
|Microsoft.AgFoodPlatform/cropVarieties/delete|
|Microsoft.AgFoodPlatform/seasons/write| 
|Microsoft.AgFoodPlatform/seasons/read| 
|Microsoft.AgFoodPlatform/seasons/delete|
|Microsoft.AgFoodPlatform/attachments/write| 
|Microsoft.AgFoodPlatform/attachments/read|
|Microsoft.AgFoodPlatform/attachments/delete|
|Microsoft.AgFoodPlatform/prescriptions/write|
|Microsoft.AgFoodPlatform/prescriptions/read| 
|Microsoft.AgFoodPlatform/prescriptions/delete|
|Microsoft.AgFoodPlatform/deletionJobs/prescriptionsCascadeDeleteJobs/write|
|Microsoft.AgFoodPlatform/prescriptionMaps/write|
|Microsoft.AgFoodPlatform/prescriptionMaps/read|
|Microsoft.AgFoodPlatform/prescriptionMaps/delete|
|Microsoft.AgFoodPlatform/deletionJobs/prescriptionMapsCascadeDeleteJobs/write| 
|Microsoft.AgFoodPlatform/managementZones/write| 
|Microsoft.AgFoodPlatform/managementZones/read|
|Microsoft.AgFoodPlatform/managementZones/delete|
|Microsoft.AgFoodPlatform/deletionJobs/managementZonescascadeDeletejobs/write|
|Microsoft.AgFoodPlatform/zones/write|
|Microsoft.AgFoodPlatform/zones/read|
|Microsoft.AgFoodPlatform/zones/delete|
|Microsoft.AgFoodPlatform/deletionJobs/zonesCascadedeleteJobs/write|
|Microsoft.AgFoodPlatform/plantTissueanalyses/write|
|Microsoft.AgFoodPlatform/plantTissueanalyses/read|
|Microsoft.AgFoodPlatform/plantTissueanalyses/delete|
|Microsoft.AgFoodPlatform/deletionJobs/plantTissueanalysesCascadedeleteJobs/write|
|Microsoft.AgFoodPlatform/nutrientAnalyses/write|
|Microsoft.AgFoodPlatform/nutrientAnalyses/read|
|Microsoft.AgFoodPlatform/nutrientAnalyses/delete|
|Microsoft.AgFoodPlatform//deletionJobs/nutrientAnalysescascadeDeletejobs/delete|


### FarmOperationLogs

| operationName |
| --- |
|Microsoft.AgFoodPlatform/ingetsionJobs/farmOperationsdataIngestionjobs/write|
|Microsoft.AgFoodPlatform/applicationData/read|
|Microsoft.AgFoodPlatform/applicationData/write|
|Microsoft.AgFoodPlatform/applicationData/delete|
|Microsoft.AgFoodPlatform/deletionJobs/applicationDatacascadeDeletejob/write|
|Microsoft.AgFoodPlatform/plantingData/write|
|Microsoft.AgFoodPlatform/plantingData/read|
|Microsoft.AgFoodPlatform/plantingData/delete|
|Microsoft.AgFoodPlatform/deletionJobs/plantingDatacascadeDeletejob/write|
|Microsoft.AgFoodPlatform/harvestingData/write|
|Microsoft.AgFoodPlatform/harvestingData/read|
|Microsoft.AgFoodPlatform/harvestingData/delete|
|Microsoft.AgFoodPlatform/deletionJobs/harvestingDatacascadeDeletejob/write|
|Microsoft.AgFoodPlatform/tillageData/Write|
|Microsoft.AgFoodPlatform/tillageData/Read|
|Microsoft.AgFoodPlatform/tillageData/Delete|
|Microsoft.AgFoodPlatform/deletionJobs/tillageDatacascadeDeletejob/write|

### SatelliteLogs

| operationName |
| --- |
|Microsoft.AgFoodPlatform/ingestionJobs/satelliteDataingestionJob/write|
|Microsoft.AgFoodPlatform/scenes/read|


### WeatherLogs

| operationName |
| --- |
|Microsoft.AgFoodPlatform/ingestionJobs/weatherDataingestionJob/write|
|Microsoft.AgFoodPlatform/weather/read|
|Microsoft.AgFoodPlatform/deletionJobs/weatherDeletejob/delete|

### ProviderAuthLogs

| operationName|
| --- |
|Microsoft.AgFoodPlatform/oauthProviders/write|
|Microsoft.AgFoodPlatform/oauthProviders/read|
|Microsoft.AgFoodPlatform/oauthProviders/delete|
|Microsoft.AgFoodPlatform/oauthTokens/read|
|Microsoft.AgFoodPlatform/oauthTokens/delete|
  
### JobProcessesLogs
 |operationName|
 | --- |
 |Microsoft.AgFoodPlatform/ingestionJobs/satelliteDataIngestionJobs/processed
 |Microsoft.AgFoodPlatform/deletionJobs/satelliteDataDeletionJobs/processed
 |Microsoft.AgFoodPlatform/ingestionJobs/weatherDataIngestionJobs/processed
 |Microsoft.AgFoodPlatform/deletionJobs/weatherDataDeletionJobs/processed
 |Microsoft.AgFoodPlatform/deletionJobs/oauthProvidersCascadeDeleteJobs/processed
 |Microsoft.AgFoodPlatform/deletionJobs/oauthTokensRemoveJobs/processed
 |Microsoft.AgFoodPlatform/ingestionJobs/biomassModelJobs/processed
 |Microsoft.AgFoodPlatform/ingestionJobs/ImageProcessingRasterizeJobs/processed
 |Microsoft.AgFoodPlatform/ingestionJobs/farmOperationDataIngestionJobs/processed
 |Microsoft.AgFoodPlatform/ingestionJobs/farmOperationDataIngestionJobs/processed/failures
 |Microsoft.AgFoodPlatform/ingestionJobs/farmOperationPeriodicJobs/processed
 |Microsoft.AgFoodPlatform/ingestionJobs/farmOperationPeriodicJobs/processed/failures
 |Microsoft.AgFoodPlatform/ingestionJobs/farmOperationEventHandlingJobs/processed
 |Microsoft.AgFoodPlatform/ingestionJobs/farmOperationEventHandlingJobs/processed/failures
 |Microsoft.AgFoodPlatform/deletionJobs/applicationDataCascadeDeletionJobs/processed
 |Microsoft.AgFoodPlatform/deletionJobs/tillageDataCascadeDeletionJobs/processed
 |Microsoft.AgFoodPlatform/deletionJobs/plantingDataCascadeDeletionJobs/processed
 |Microsoft.AgFoodPlatform/deletionJobs/harvestDataCascadeDeletionJobs/processed
 |Microsoft.AgFoodPlatform/deletionJobs/managementZonesCascadeDeletionJobs/processed
 |Microsoft.AgFoodPlatform/deletionJobs/zonesCascadeDeletionJobs/processed
 |Microsoft.AgFoodPlatform/deletionJobs/plantTissueAnalysesCascadeDeletionJobs/processed
 |Microsoft.AgFoodPlatform/deletionJobs/prescriptionsCascadeDeletionJobs/processed
 |Microsoft.AgFoodPlatform/deletionJobs/prescriptionMapsCascadeDeletionJobs/processed
 |Microsoft.AgFoodPlatform/deletionJobs/insightsCascadeDeletionJobs/processed
 |Microsoft.AgFoodPlatform/deletionJobs/farmersCascadeDeletionJobs/processed 
 |Microsoft.AgFoodPlatform/deletionJobs/farmsCascadeDeletionJobs/processed 
 |Microsoft.AgFoodPlatform/deletionJobs/fieldsCascadeDeletionJobs/processed 
 |Microsoft.AgFoodPlatform/deletionJobs/seasonalFieldsCascadeDeletionJobs/processed  
  
### ApplicationAuditLogs
The write and delete logs present in other categories are also present in this category. The difference between the logs in this category and other categories for the same API call is that, ApplicationAuditLogs doesn't log the request-body, while in other categories the request-body is populated. Use the correlation-id to relate logs of two different categories to get more details. Some of the control plane operations that aren't part of the rest of the categories are listed below.

|operationName|
| --- |
|Create Data Manager for Agriculture Resource|
|Update Data Manager for Agriculture Resource|
|Delete Data Manager for Agriculture Resource|
|Create Subscription|
|Update Subscription|
|Data Plane Authentication|

## Query resource logs in a log analytics workspace
All the `categories` of resource logs are mapped as a table in log analytics. To access logs for each category, you need to create a diagnostic setting to send data to a log analytics workspace. In this workspace, you can query any of the tables listed to obtain the relevant logs.

### List of tables in log analytics and their mapping to categories in resource logs
| Table name in log analytics| Categories in resource logs |Description
| --- | --- | --- |
|AgriFoodFarmManagementLogs|FarmManagementLogs| Logs for CRUD operations for party, Farm, Field, Seasonal Field, Crop, CropVariety, Season, Attachment, prescription maps, prescriptions, management zones, zones, plant tissue analysis and nutrient analyses.
|AgriFoodFarmOperationsLogs|FarmOperationsLogs| Logs for CRUD operations for FarmOperations data ingestion job, ApplicationData, PlantingData, HarvestingData, TillageData.
|AgriFoodSatelliteLogs|SatelliteLogs| Logs for create and get operations for satellite data ingestion job.
|AgriFoodWeatherLogs|WeatherLogs|Logs for create, delete and get operations for weather data ingestion job.
|AgriFoodProviderAuthLogs|ProviderAuthLogs| Logs for create, update, delete, cascade delete, get and get all for oauth providers. It also has logs for get, get all, cascade delete for oauth tokens.
|AgriFoodInsightLogs|InsightLogs| Logs for get and get all operations for insights.
|AgriFoodModelInferenceLogs|ModelInferenceLogs| Logs for create and get operations for biomass model job.
|AgriFoodJobProcessedLogs|JobProcessedLogs| Logs for indicating success or failure and reason of failure for jobs. In addition to logs for resource cascade delete jobs, data-ingestion jobs. It also contains logs for farm operations and event handling jobs.
|AgriFoodApplicationAuditLogs|ApplicationAuditLogs| Logs for privileged actions such as data-plane resource create, update, delete and subscription management operations.


### List of columns in log analytics tables
| Field name | Description |
| --- | --- |
|**Time** |Date and time in UTC. |
|**ResourceId** |Azure Resource Manager resource ID for Data Manager for Agriculture logs.|
|**OperationName** |Name of the operation, as documented in the earlier table. |
|**OperationVersion** |REST API version requested by the client. |
|**Category** |Category details in the  Data Manager for Agriculture logs, this can be any value as listed in the category table. |
|**ResultType** |Result of the REST API request (success or failure). |
|**ResultSignature** |HTTP status. |
|**ResultDescription** |More description about the result, when available. |
|**DurationMs** |Time it took to service the REST API request, in milliseconds.|
|**CallerIpAddress** |IP address of the client that made the request. |
|**Level**|The severity level of the event (informational, warning, error, or critical).|
|**CorrelationId** |An optional GUID that can be used to correlate logs. |
|**ApplicationId**| Application ID indicating identity of the caller.|
|**ObjectId**| Object ID indicating identity of the caller.|
|**ClientTenantId**| ID of the tenant of the caller.|
|**SubscriptionId**| ID of the subscription used by the caller.
|**Location**|The region of the resource emitting the event such as "East US" |
|**JobRunType**| Available only in `AgriFoodJobProcessesLogs` table, indicates type of the job run. Value can be either of periodic or one time. |
|**JobId**| Available in`AgriFoodJobProcessesLogs`, `AgriFoodSatelliteLogs`, `AgriFoodWeatherLogs`, and `AgriFoodModelInferenceLogs`, indicates ID of the job. |
|**InitiatedBy**| Available only in `AgriFoodJobProcessesLogs` table. Indicates whether a job was initiated by a user or by the service. |
|**partyId**| ID of the party associated with the operation. |
|**Properties** | Available only in`AgriFoodJobProcessesLogs` table, it contains: `farmOperationEntityId` (ID of the entity that failed to be created by the farmOperation job), `farmOperationEntityType`(Type of the entity that failed  to be created, can be ApplicationData, PeriodicJob, etc.), `errorCode`(Code for failure of the job at Data Manager for Agriculture end),`errorMessage`(Description of failure at the Data Manager for Agriculture end),`internalErrorCode`(Code of failure of the job provide by the provider),`internalErrorMessage`(Description of the failure provided by the provider),`providerId`(ID of the provider such as JOHN-DEERE). |

Each of these tables can be queried by creating a log analytics workspace. Reference for query language is [here](/azure/data-explorer/kql-quick-reference).

### List of sample queries in the log analytics workspace
| Query name | Description |
| --- | --- |
|**Status of farm management operations for a party** |Fetches a count of successes and failures of operations within the `FarmManagementLogs` category for each party. 
|**Job execution statistics for a party**| Provides a count of successes and failures of for all operations in the `JobProcessedLogs` category for each party.
|**Failed Authorization**|Identifies a list of users who failed to access your resource and the reason for this failure.
|**Status of all operations for a party**|Aggregates failures and successes across categories for a party.
|**Usage trends for top 100 parties based on the operations performed**|Retrieves a list of top 100 parties based on the number of hits received across categories. This query can be edited to track trend of usage for a particular party.|

All the queries listed above can be used as base queries to form custom queries in a log analytics workspace. This list of queries can also be accessed in the `Logs` tab in your Azure Data Manager for Agriculture resource on Azure portal.

## Next steps

Learn how to [setup private links](./how-to-set-up-private-links.md).