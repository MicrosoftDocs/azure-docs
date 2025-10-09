---
title:  How to run a reindex job in FHIR service - Azure Health Data Services
description: How to run a reindex job to index any search or sort parameters that are not yet indexed in your database
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: reference
ms.date: 10/09/2025
ms.author: kesheth
---
# Running a reindex job

There are scenarios where you may have search parameters in the FHIR&reg; service in Azure Health Data Services that have yet to be indexed. This scenario is relevant when you define your own custom search parameters. Until a search parameter is indexed, it can't be used in live production. This article covers how to run a reindex job to index any custom search parameters in your FHIR service database.

> [!Warning]
> It's important that you read this entire article before getting started. A reindex job can be very performance intensive. This article discusses options for how to throttle and control a reindex job.

## How to run a reindex job 

A reindex job can be executed against an entire FHIR service database, and against specific custom search parameters.

### Run a reindex job on entire FHIR service database
To run a reindex job, use the following `POST` call with the JSON formatted `Parameters` resource in the request body.

```json
POST {{FHIR_URL}}/$reindex 
content-type: application/fhir+json
{ 

"resourceType": "Parameters",  

"parameter": [] 

}
 ```

Leave the `"parameter": []` field blank (as shown) if you don't need to adjust the resources allocated to the reindex job.

If the request is successful, you receive a **201 Created** status code in addition to a `Parameters` resource in the response.

```json
HTTP/1.1 201 Created 
Content-Location: https://{{FHIR URL}}/_operations/reindex/560c7c61-2c70-4c54-b86d-c53a9d29495e 

{
    "resourceType": "Parameters",
    "id": "560c7c61-2c70-4c54-b86d-c53a9d29495e",
    "meta": {
        "versionId": "138035"
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
            "name": "maximumNumberOfResourcesPerQuery",
            "valueDecimal": 100.0
        },
        {
            "name": "maximumNumberOfResourcesPerWrite",
            "valueDecimal": 100.0
        }
    ]
}
```

### Run a reindex job against a specific custom search parameter
To run a reindex job against a specific custom search parameter, use the following `POST` call with the JSON formatted `Parameters` resource in the request body.

```json
POST {{FHIR_URL}}/$reindex 
content-type: application/fhir+json
{ 

"resourceType": "Parameters",  

"parameter": [
    {
      "name": "targetSearchParameterTypes",
      "valueString": "{url of custom search parameter. In case of multiple custom search parameters, url list can be comma separated.}"
    }
] 

}
 ```
> [!NOTE]
> To check the status of, or cancel a reindex job, you need the reindex ID. Reindex ID is the `"id"` carried in the `"parameter"` value of the response. In the preceding example, the ID for the reindex job would be `560c7c61-2c70-4c54-b86d-c53a9d29495e`.

 ## How to check the status of a reindex job

Once you start a reindex job, you can check the status of the job using the following call.

`GET {{FHIR_URL}}/_operations/reindex/{{reindexJobId}}`

Here's an example response.

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
            "name": "resources",
            "valueString": "{{LIST_OF_IMPACTED_RESOURCES}}"
        },
        {
            "name": "resourceReindexProgressByResource (CountReindexed of Count)",
            "valueString": "{{RESOURCE_TYPE:REINDEXED_COUNT OF TOTAL_COUNT}}"
        },
        {
            "name": "searchParams",
            "valueString": "{{LIST_OF_SEARCHPARAM_URLS}}"
        },
        {
            "name": "maximumNumberOfResourcesPerQuery",
            "valueDecimal": 100.0
        },
        {
            "name": "maximumNumberOfResourcesPerWrite",
            "valueDecimal": 100.0
        }
    ]
}
```

The following information is shown in the preceding response:

* `totalResourcesToReindex`: Includes the total number of resources that are being reindexed in this job.

* `resourcesSuccessfullyReindexed`: The total number of resources reindexed in this job.

* `progress`: Reindex job percent complete. Equals `resourcesSuccessfullyReindexed`/`totalResourcesToReindex` x 100.

* `status`: States if the reindex job is queued, running, complete, failed, or canceled.

* `resources`: Lists all the resource types impacted by the reindex job.

* 'resourceReindexProgressByResource (CountReindexed of Count)': Provides a reindexed count of the total count, per resource type. In cases where reindexing for a specific resource type is queued, only Count is provided.

* 'searchParams': Lists url of the search parameters impacted by the reindex job.

## Delete a reindex job

If you need to cancel a reindex job, use a `DELETE` call and specify the reindex job ID.

`DELETE {{FHIR URL}}/_operations/reindex/{{reindexJobId}}`

## Performance considerations

A reindex job can be quite performance intensive. The FHIR service offers throttling controls to help manage how a reindex job runs on your database. You can use `MaximumResourcesPerQuery` parameter to either speed up the process (use more compute) or slow down the process (use less compute). `MaximumResourcesPerQuery` parameter allows to set the maximum number of resources included in the batch to be reindexed. The default value is 100 and you can set value between 1-5000. 
Sample request with the parameter:

```json

POST {{FHIR_URL}}/$reindex 
content-type: application/fhir+json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "maximumNumberOfResourcesPerQuery",
      "valueInteger": "1"
    }
  ]
}
```

> [!NOTE]
> It is not uncommon on large datasets for a reindex job to run for days.

## Next steps

In this article, you learned how to perform a reindex job in your FHIR service. To learn how to define custom search parameters, see 

>[!div class="nextstepaction"]
>[Defining custom search parameters](how-to-do-custom-search.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
