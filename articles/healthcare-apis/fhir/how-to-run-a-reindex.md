---
title:  How to run a reindex job in FHIR service - Azure Health Data Services
description: How to run a reindex job to index any search or sort parameters that haven't yet been indexed in your database
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 08/22/2022
ms.author: kesheth
---
# Running a reindex job

There are scenarios where you may have search parameters in the FHIR service in Azure Health Data Services that haven't yet been indexed. This is the case when you define your own custom search parameters. Until the search parameter is indexed, it can't be used in live production. This article covers how to run a reindex job to index any custom search parameters that haven't yet been indexed in your FHIR service database.

> [!Warning]
> It's important that you read this entire article before getting started. A reindex job can be very performance intensive. This article discusses options for how to throttle and control a reindex job.

## How to run a reindex job 

To reindex the entire FHIR service database and make your custom search parameter operational, use the following `POST` call with the JSON formatted `Parameters` resource in the request body:

```json
POST {{FHIR_URL}}/$reindex 

{ 

“resourceType”: “Parameters”,  

“parameter”: [] 

}
 ```

Leave the `"parameter": []` field blank (as shown) if you don't need to tweak the compute resources allocated to the reindex job. If the request is successful, you will receive a **201 Created** status code in addition to a `Parameters` resource in response:

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
> To check the status of a reindex job or to cancel the job, you'll need the reindex ID. This is the `"id"` carried in the `"parameter"` value returned in the response. In the example above, the ID for the reindex job would be `560c7c61-2c70-4c54-b86d-c53a9d29495e`.

 ## How to check the status of a reindex job

Once you’ve started a reindex job, you can check the status of the job using the following call:

`GET {{FHIR_URL}}/_operations/reindex/{{reindexJobId}}`

An example response is shown below:

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
      "{{LIST_OF_IMPACTED_RESOURCES}}"
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

## Delete a reindex job

If you need to cancel a reindex job, use a `DELETE` call and specify the reindex job ID:

`DELETE {{FHIR URL}}/_operations/reindex/{{reindexJobId}}`

## Performance considerations

A reindex job can be quite performance intensive. The FHIR service offers some throttling controls to help you manage how a reindex job will run on your database.

> [!NOTE]
> It is not uncommon on large datasets for a reindex job to run for days.

Below is a table outlining the available parameters, defaults, and recommended ranges for controlling reindex job compute resources. You can use these parameters to either speed up the process (use more compute) or slow down the process (use less compute). 

| **Parameter**                     | **Description**              | **Default**        | **Available Range**            |
| --------------------------------- | ---------------------------- | ------------------ | ------------------------------- |
| `QueryDelayIntervalInMilliseconds`  | The delay between each batch of resources being kicked off during the reindex job. A smaller number will speed up the job while a larger number will slow it down. | 500 MS (.5 seconds) | 50 to 500000 |
| `MaximumResourcesPerQuery`  | The maximum number of resources included in the batch of resources to be reindexed.  | 100 | 1-5000 |
| `MaximumConcurrency`  | The number of batches done at a time.  | 1 | 1-10 |

If you want to use any of the parameters above, you can pass them into the `Parameters` resource when you send the initial `POST` request to start a reindex job.

```json

POST {{FHIR_URL}}/$reindex 

{
  "resourceType": "Parameters",
  "parameter": [
    {
      "name": "maximumConcurrency",
      "valueInteger": "3"
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

In this article, you've learned how to perform a reindex job in your FHIR service. To learn how to define custom search parameters, see 

>[!div class="nextstepaction"]
>[Defining custom search parameters](how-to-do-custom-search.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
