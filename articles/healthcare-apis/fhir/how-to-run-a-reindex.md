---
title: Run a Reindex Job in FHIR Service
description: Learn how to run a reindex job in FHIR service to index custom search and sort parameters, improve query accuracy, and keep production search reliable. Start now.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: how-to
ms.date: 08/10/2026
ms.author: kesheth
ai-usage: ai-assisted
---
# Run a reindex job in FHIR service

Some scenarios require reindexing search parameters in the FHIR&reg; service in Azure Health Data Services. This scenario is relevant when you define your own custom search parameters. Until a search parameter is indexed, you can't use it in live production. This article explains how to run a reindex job on your FHIR service database.

> [!Warning]
> Read this entire article before getting started. A reindex job can be very performance intensive. This article discusses options for how to throttle and control a reindex job.

> [!NOTE]
> Running a reindex job against specific custom search parameters is deprecated.

## How to run a reindex job 

You can run a reindex job against an entire FHIR service database.

To run a reindex job, use the following `POST` call with the JSON formatted `Parameters` resource in the request body.

```json
POST {{FHIR_URL}}/$reindex 
content-type: application/fhir+json
{ 

"resourceType": "Parameters",  

"parameter": [] 

}
 ```

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


 ## How to check the status of a reindex job

After you start a reindex job, check the status by using the following call.

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

The preceding response shows the following information:

| Parameter | Description |
| --- | --- |
| `totalResourcesToReindex` | The total number of resources that the job reindexes. |
| `resourcesSuccessfullyReindexed` | The total number of resources that the job reindexes. |
| `progress` | The reindex job percent complete. Equals `resourcesSuccessfullyReindexed` divided by `totalResourcesToReindex` times 100. |
| `status` | The status of the reindex job. It can be queued, running, complete, failed, or canceled. |
| `resources` | All the resource types that the reindex job impacts. |
| `resourceReindexProgressByResource (CountReindexed of Count)` | The reindexed count of the total count, per resource type. If reindexing for a specific resource type is queued, only Count is provided. |
| `searchParams` | The URL of the search parameters that the reindex job impacts. |
| `maximumNumberOfResourcesPerQuery` | The maximum number of resources number of resources processed in a data unit. |
| `maximumNumberOfResourcesPerWrite` | The maximum number of resources updated in the data store in a single transaction. |

## Cancel a reindex job

To cancel a reindex job, use a `DELETE` call and specify the reindex job ID.

`DELETE {{FHIR URL}}/_operations/reindex/{{reindexJobId}}`

## Performance considerations

A reindex job can be quite performance intensive. Though FHIR service automatically scales backend distributed compute infrastructure depending on load, running reindex can still affect API operations. If this is not acceptable, reindex compute consumption can be throttled by reducing write transaction size controlled by `maximumNumberOfResourcesPerWrite`. Other consideration is resource size which affects amount of memory required to process singe write transaction, and is controlled by the same `maximumNumberOfResourcesPerWrite`. Default value for m`aximumNumberOfResourcesPerWrite` is 200. You can set between 1-5000. Reduce to 1 (one resource per write) to handle very large resources or to throttle reindex. 

Sample request with the parameter:


```json
POST {{FHIR_URL}}/$reindex
content-type: application/fhir+json
{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "maximumNumberOfResourcesPerWrite",
      "valueInteger": 1
    }
  ]
}
```

> [!NOTE]
> It's not uncommon for a reindex job on large datasets to run for days.

## Next steps

In this article, you learned how to perform a reindex job in your FHIR service. To learn how to define custom search parameters, see 

>[!div class="nextstepaction"]
>[Defining custom search parameters](how-to-do-custom-search.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
