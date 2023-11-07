---
title:  How to run a reindex job in Azure API for FHIR 
description: This article describes how to run a reindex job to index any search or sort parameters that haven't yet been indexed in your database.   
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.custom: ignite-2022
ms.topic: reference
ms.date: 09/27/2023
ms.author: kesheth
---
# Running a reindex job in Azure API for FHIR

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

There are scenarios where you may have search or sort parameters in the Azure API for FHIR that haven't yet been indexed. This scenario is relevant when you define your own search parameters. Until the search parameter is indexed, it can't be used in search. This article covers how to run a reindex job to index search parameters that haven't yet been indexed in your FHIR service database.

> [!Warning]
> It's important that you read this entire article before getting started. A reindex job can be very performance intensive. This article includes options for how to throttle and control the reindex job.

## How to run a reindex job 

Reindex job can be executed against entire FHIR service database and against specific custom search parameter.

### Run reindex job on entire FHIR service database
To run reindex job, use the following `POST` call with the JSON formatted `Parameters` resource in the request body:

```json
POST {{FHIR URL}}/$reindex 

{ 

“resourceType”: “Parameters”,  

“parameter”: [] 

}
 ```

Leave the `"parameter": []` field blank (as shown) if you don't need to tweak the resources allocated to the reindex job.

If the request is successful, you receive a **201 Created** status code in addition to a `Parameters` resource in the response.

```json
HTTP/1.1 201 Created 
Content-Location: https://{{FHIR URL}}/_operations/reindex/560c7c61-2c70-4c54-b86d-c53a9d29495e 

{
  "resourceType": "Parameters",
  "id": "560c7c61-2c70-4c54-b86d-c53a9d29495e",
  "meta": {
    "versionId": "\"4c0049cd-0000-0100-0000-607dc5a90000\""
  },
  "parameter": [
    {
      "name": "id",
      "valueString": "560c7c61-2c70-4c54-b86d-c53a9d29495e"
    },
    {
       "name": "lastModified",
       "valueDateTime": "2023-06-08T04:52:44.0974408+00:00"
    },
    {
       "name": "queuedTime",
       "valueDateTime": "2023-06-08T04:52:44.0974406+00:00"
    },
    {
       "name": "totalResourcesToReindex",
       "valueDecimal": 0.0
    },
    {
       "name": "resourcesSuccessfullyReindexed",
       "valueDecimal": 0.0
    },
    {
       "name": "progress",
       "valueDecimal": 0.0
    },
    {
       "name": "status",
       "valueString": "Queued"
    },
    {
       "name": "maximumConcurrency",
       "valueDecimal": 3.0
    },
    {
        "name": "queryDelayIntervalInMilliseconds",
        "valueDecimal": 500.0
    },
    {
        "name": "maximumNumberOfResourcesPerQuery",
        "valueDecimal": 100.0
    }
  ]
}
```
### Run reindex job against specific custom search parameter
To run reindex job against specific custom search parameter, use the following `POST` call with the JSON formatted `Parameters` resource in the request body:

```json
POST {{FHIR_URL}}/$reindex 
content-type: application/fhir+json
{ 

"resourceType": "Parameters",  

"parameter": [
    {
      "name": "targetSearchParameterTypes",
      "valueString": "{url of custom search parameter. In case of multiple custom search parameters, url list can be comma seperated.}"
    }
] 

}
 ```
 
> [!NOTE]
> To check the status of a reindex job or to cancel the job, you'll need the reindex ID. This is the `"id"` carried in the `"parameter"` value returned in the response. In the example above, the ID for the reindex job would be `560c7c61-2c70-4c54-b86d-c53a9d29495e`.

 ## How to check the status of a reindex job

Once you’ve started a reindex job, you can check the status of the job using the following call:

`GET {{FHIR URL}}/_operations/reindex/{{reindexJobId}`

An example response:

```json
{
    "resourceType": "Parameters",
    "id": "560c7c61-2c70-4c54-b86d-c53a9d29495e",
    "meta": {
        "versionId": "138087"
    },
    "parameter": [
        {
            "name": "id",
            "valueString": "560c7c61-2c70-4c54-b86d-c53a9d29495e"
        },
        {
            "name": "startTime",
            "valueDateTime": "2023-06-08T04:54:53.2943069+00:00"
        },
        {
            "name": "endTime",
            "valueDateTime": "2023-06-08T04:54:54.4052272+00:00"
        },
        {
            "name": "lastModified",
            "valueDateTime": "2023-06-08T04:54:54.4053002+00:00"
        },
        {
            "name": "queuedTime",
            "valueDateTime": "2023-06-08T04:52:44.0974406+00:00"
        },
        {
            "name": "totalResourcesToReindex",
            "valueDecimal": 2.0
        },
        {
            "name": "resourcesSuccessfullyReindexed",
            "valueDecimal": 2.0
        },
        {
            "name": "progress",
            "valueDecimal": 100.0
        },
        {
            "name": "status",
            "valueString": "Completed"
        },
        {
            "name": "maximumConcurrency",
            "valueDecimal": 3.0
        },
        {
            "name": "resources",
            "valueString": "{{LIST_OF_IMPACTED_RESOURCES}}"
        },
        {
            "name": "resourceReindexProgressByResource (CountReindexed of Count)",
            "valueString": "{{RESOURCE_TYPE:REINDEXED_COUNT OF TOTAL_COUNT}}"
        },
        {
            "name": "searchParams",
            "valueString": "{{LIST_OF_SEARCHPARAM_URLS}}h"
        },
        {
            "name": "queryDelayIntervalInMilliseconds",
            "valueDecimal": 500.0
        },
        {
            "name": "maximumNumberOfResourcesPerQuery",
            "valueDecimal": 100.0
        }
    ]
}
```

The following information is shown in the above response:

* `totalResourcesToReindex`: Includes the total number of resources that are being reindexed in this job.

* `resourcesSuccessfullyReindexed`: The total number of resources that have already been reindexed in this job.

* `progress`: Reindex job percent complete. Equals `resourcesSuccessfullyReindexed`/`totalResourcesToReindex` x 100.

* `status`: States if the reindex job is queued, running, complete, failed, or canceled.

* `resources`: Lists all the resource types impacted by the reindex job.

* 'resourceReindexProgressByResource (CountReindexed of Count)': Provides reindexed count of the total count, per resource type. In cases where reindexing for a specific resource type is queued, only Count is provided.

* 'searchParams': Lists url of the search parameters impacted by the reindex job.

## Delete a reindex job

If you need to cancel a reindex job, use a delete call and specify the reindex job ID:

`Delete {{FHIR URL}}/_operations/reindex/{{reindexJobId}`

## Performance considerations

A reindex job can be quite performance intensive. We’ve implemented some throttling controls to help you manage how a reindex job will run on your database.

> [!NOTE]
> It is not uncommon on large datasets for a reindex job to run for days. For a database with 30,000,000 million resources, we noticed that it took 4-5 days at 100K RUs to reindex the entire database.

Below is a table outlining the available parameters, defaults, and recommended ranges. You can use these parameters to either speedup the process (use more compute) or slow down the process (use less compute). For example, you could run the reindex job on a low traffic time and increase your compute to get it done quicker. Instead, you could use the settings to ensure a low usage of compute and have it run for days in the background. 

| **Parameter**                     | **Description**              | **Default**        | **Available Range**           |
| --------------------------------- | ---------------------------- | ------------------ | ------------------------------- |
| QueryDelayIntervalInMilliseconds  | The delay between each batch of resources being kicked off during the reindex job. A smaller number will speed up the job while a higher number will slow it down. | 500 MS (.5 seconds) | 50-500000 |
| MaximumResourcesPerQuery  | The maximum number of resources included in the batch of resources to be reindexed.  | 100 | 1-5000 |
| MaximumConcurrency  | The number of batches done at a time.  | 1 | 1-10 |
| targetDataStoreUsagePercentage | Allows you to specify what percent of your data store to use for the reindex job. For example, you could specify 50% and that would ensure that at most the reindex job would use 50% of available RUs on Azure Cosmos DB. | Not present, which means that up to 100% can be used. | 0-100 |

If you want to use any of the parameters above, you can pass them into the Parameters resource when you start the reindex job.

```json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "maximumConcurrency",
      "valueInteger": "3"
    },
    {
      "name": "targetDataStoreUsagePercentage",
      "valueInteger": "20"
    },
    {
      "name": "queryDelayIntervalInMilliseconds",
      "valueInteger": "1000"
    },
    {
      "name": "maximumNumberOfResourcesPerQuery",
      "valueInteger": "1"
    }
  ]
}
```

## Next steps

In this article, you’ve learned how to start a reindex job. To learn how to define new search parameters that require the reindex job, see 

>[!div class="nextstepaction"]
>[Defining custom search parameters](how-to-do-custom-search.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
