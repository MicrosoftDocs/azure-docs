---
title: How to ingest and egress farm operations data into Azure Data Manager for Agriculture
description: Learn how to create data ingestion job for farm operations data and to egress the same
author: lbpudi
ms.author: lbethapudi
ms.service: data-manager-for-agri
ms.topic: how-to
ms.date: 07/14/2023
ms.custom: template-how-to
---
# Create a farm operations job (data ingestion)
Users can create a farm operation data ingestion job to **pull farm, field & boundary** information associated with the given farmerId and also pull the **associated farm operations data** that is being requested.

> [!NOTE]
>
> 1. Azure Data Manager for Agriculture currently supports fetching **Climate FieldView** operations data for your farmer.
>
> 2. Before creating farm operations job, it is mandatory to successfully [**integrate with Farm Operations data provider oAuth flow**](./how-to-integrate-with-farm-ops-data-provider.md)
>

## Step 1: Create FarmOperations Job

Create a farm-operations job with an ID of your choice. Users are expected to use this job ID to monitor the status of the job using get farm operations job API.

API documentation:[FarmOperations_CreateDataIngestionJob](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/farm-operations/create-data-ingestion-job)

[!NOTE]
`shapeType` and `shapeResolution` are provider specific attributes. If they aren't applicable to your provider, set the value to "none"

Based on the startYear & operations list provided, ADMA fetches the operations data from the start year to the current date. Along with specific data (geometry), FieldView also gives us the DAT file for the activity performed on your farm/field or boundary. The DAT file contains a boundary for which the activity is performed.

## Step 2: Get ingested Farm Operations data 
You can get the data that is ingested from the previous operation and use it for further geo spatial analysis.
API documentation: [FarmOperations_GetDataIngestionJobDetails](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/farm-operations/get-data-ingestion-job-details)
  
Now that the data is ingested into ADMA, you can take one of the below paths:
1. Get Farm Operations data using geometry 
2. Download attachment files, which is a DAT file of the Farm Operation

## Check and Download Attachments

The message attribute in the response of `GetDataIngestionJobDetails` API shows how much data was processed and how many attachments were created. To check the attachments associated to the partyId, go to attachment API. The response gives you all the attachments created under the partyId.

API documentation: [Attachments_ListByPartyId](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/attachments/list-by-party-id)

To see metadata associated with the attachment, pick up the id of attachment from the response of Attachments List API and go to `getAttachment`. 
API documentation: [Attachments_Get](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/attachments/get)

To download the attachment, go to `attachmentDownload` and give the `attachmentId` and `partyId`
API documentation: [Attachments_Download](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/attachments/download)

## Get Farm Operations data using geometry 
Step 1: Get geometry for each operation

To continue geo spatial analysis, you can fetch the list of farm operations data associated to the `partyId` and then get geometry data for a specific operation ID (ex: `plantingId`). 

API documentation:
[PlantingData_ListByPartyId](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/planting-data/list-by-party-id)
[HarvestData_ListByPartyId](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/harvest-data/list-by-party-id)
[ApplicationData_ListByPartyId](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/application-data/list-by-party-id)

You can also see `sourceActivityId` and `providerFieldId` are passed on from FieldView Account and stored in ADMA.

Now, pick up specific `id` from the response of the list API and run the get API for geometry data
API documentation:
[PlantingData_Get](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/planting-data/get)
[HarvestData_Get](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/harvest-data/get)
[ApplicationData_Get](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/application-data/get)

Step 2: Get farm operations data for a geometry

Using the geometry in the response of above Get operation, you can get planting, harvest or application data
API documentation:
[PlantingData_Search](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/planting-data/search)
[HarvestData_Search](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/harvest-data/search)
[ApplicationData_Search](/rest/api/data-manager-for-agri/dataplane-version2023-07-01-preview/application-data/search)

You can also use the ID like `plantingId` to fetch the above data in the same API. if you remove the Id, you're able to see any other data that intersects with the same geometry across party. So it shows data for the same boundary across different parties.

