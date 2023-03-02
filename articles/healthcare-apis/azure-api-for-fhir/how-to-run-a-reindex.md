---
title:  How to run a reindex job in Azure API for FHIR 
description: This article describes how to run a reindex job to index any search or sort parameters that haven't yet been indexed in your database.   
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.custom: ignite-2022
ms.topic: reference
ms.date: 06/03/2022
ms.author: kesheth
---
# Running a reindex job in Azure API for FHIR

There are scenarios where you may have search or sort parameters in the Azure API for FHIR that haven't yet been indexed. This scenario is relevant when you define your own search parameters. Until the search parameter is indexed, it can't be used in search. This article covers an overview of how to run a reindex job to index any search or sort parameters that haven't yet been indexed in your database.

> [!Warning]
> It's important that you read this entire article before getting started. A reindex job can be very performance intensive. This article includes options for how to throttle and control the reindex job.

## How to run a reindex job 

To start a reindex job, use the following code example:

```json
POST {{FHIR URL}}/$reindex 

{ 

“resourceType”: “Parameters”,  

“parameter”: [] 

}
 ```

If the request is successful, a status of **201 Created** gets returned. The result of this message will look like:

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
      "name": "queuedTime",
      "valueDateTime": "2021-04-19T18:02:17.0118558+00:00"
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
      "valueDecimal": 1.0
    },
    {
      "name": "resources",
      "valueString": ""
    },
    {
      "name": "searchParams",
      "valueString": ""
    }
  ]
}
```

> [!NOTE]
> To check the status of or to cancel a reindex job, you’ll need the reindex ID. This is the ID of the resulting Parameters resource. In the example above, the ID for the reindex job would be `560c7c61-2c70-4c54-b86d-c53a9d29495e`.

 ## How to check the status of a reindex job

Once you’ve started a reindex job, you can check the status of the job using the following call:

`GET {{FHIR URL}}/_operations/reindex/{{reindexJobId}`

The status of the reindex job result is shown below:

```json
{

  "resourceType": "Parameters",
  "id": "b65fd841-1c62-47c6-898f-c9016ced8f77",
  "meta": {

    "versionId": "\"1800f05f-0000-0100-0000-607a1a7c0000\""
  },
  "parameter": [

    {

      "name": "id",
      "valueString": "b65fd841-1c62-47c6-898f-c9016ced8f77"
    },
    {

      "name": "startTime",
      "valueDateTime": "2021-04-16T23:11:35.4223217+00:00"
    },
    {

      "name": "queuedTime",
      "valueDateTime": "2021-04-16T23:11:29.0288163+00:00"
    },
    {

      "name": "totalResourcesToReindex",
      "valueDecimal": 262544.0
    },
    {

      "name": "resourcesSuccessfullyReindexed",
      "valueDecimal": 5754.0
    },
    {

      "name": "progress",
      "valueDecimal": 2.0
    },
    {

      "name": "status",
      "valueString": "Running"
    },
    {

      "name": "maximumConcurrency",
      "valueDecimal": 1.0
    },
    {

      "name": "resources",
      "valueString": 
      "{LIST OF IMPACTED RESOURCES}"
    },
    {
```

The following information is shown in the reindex job result:

* **totalResourcesToReindex**: Includes the total number of resources that are being reindexed as part of the job.

* **resourcesSuccessfullyReindexed**: The total that have already been successfully reindexed.

* **progress**: Reindex job percent complete. Equals resourcesSuccessfullyReindexed/totalResourcesToReindex x 100.

* **status**: States if the reindex job is queued, running, complete, failed, or canceled.

* **resources**: Lists all the resource types impacted by the reindex job.

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
