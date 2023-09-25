---
title: Working with Farm Activities and in-field activity data in Azure Data Manager for Agriculture
description: Learn how to manage Farm Activities data with manual and auto sync data ingestion jobs
author: lbpudi
ms.author: lbethapudi
ms.service: data-manager-for-agri
ms.topic: how-to
ms.date: 09/04/2023
ms.custom: template-how-to
---
# Working with Farm Activities and activity data in Azure Data Manager for Agriculture

Users can create a farm operation data ingestion job to **pull associated Farm Activities activity data** from a specified data provider into your Azure Data Manager for Agriculture instance, associated with a specific party. The job handles any required auth refresh, and by default detects and syncs any changes daily. In some cases, the job will also **pull farm and field** information associated with the given account into the party. 

> [!NOTE]
>
>Before creating Farm Activities job, it is mandatory to successfully [**integrate with Farm Activities data provider oAuth flow**](./how-to-integrate-with-farm-ops-data-provider.md)
>

## Create FarmOperations Job

Create a farm-operations job to ingest Farm Activity data with an ID of your choice. This job ID is used to monitor the status of the job using GET Farm Operations job.

API documentation:[FarmOperations_CreateDataIngestionJob](/rest/api/data-manager-for-agri/farm-operations)

> [!NOTE] 
>`shapeType` and `shapeResolution` are provider specific attributes. If they aren't applicable to your provider, set the value to "None". 

Based on the `startYear` and `operations` list provided, Azure Data Manager for Agriculture fetches the data from the start year to the current date.

Along with specific data (geometry), Farm Activities data provider also gives us the DAT file for the activity performed on your farm or field. The DAT file, Shape File etc. contain a geometry that reflects where the activity was performed.

Job status and details can be retrieved with: [FarmOperations_GetDataIngestionJobDetails](/rest/api/data-manager-for-agri/farm-operations)


## Finding and retrieving Farm Activities data

Now that the data is ingested into Azure Data Manager for Agriculture, it can be queried or listed with the following methods:

### Method 1: search Farm Activities data using geometry intersect
To account for the high degree of change found in field definitions, Azure Data Manager for Agriculture supports a search by intersect feature that allows you to organize data by space and time across parties, without needing to first know the farm/field hierarchy or association. If you have the partyId, you can use it in the input, and it gives you the list of farm activity data items for the specified party. 

[API Documentation](/rest/api/data-manager-for-agri/#farm-operations)

You can also use the ID like `plantingId` to fetch the above data in the same API. If you remove the ID, you're able to see any other data that intersects with the same geometry across party. So it shows data for the same geometry across different parties.

### Method 2: List data by type

Retrieved data is sorted by activity type under the party. These can be listed, with standard filters applied. Individual data items may be retrieved to view the properties and metadata, including the `sourceActivityId`, `providerFieldId` and `Geometry`.

[API Documentation](/rest/api/data-manager-for-agri/#farm-operations)

## List and Download Attachments

The message attribute in the response of `FarmOperations_GetDataIngestionJobDetails` API shows how much data was processed and how many attachments were created. To check the attachments associated to the partyId, go to attachment API. The response gives you all the attachments created under the partyId.

API documentation: [Attachments](/rest/api/data-manager-for-agri/attachments)

## Next steps

* Understand our APIs [here](/rest/api/data-manager-for-agri).