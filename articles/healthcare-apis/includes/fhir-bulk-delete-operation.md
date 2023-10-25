---
title: "include file"
description: Explains bulk delete operation capability
services: healthcare-apis
ms.service: fhir
ms.topic: "include"
ms.date: 10/24/2023
ms.author: kesheth
ms.custom: "include file"
---

`$bulk-delete' allows you to delete resources from FHIR server asynchronously. Bulk delete operation can be executed at system level or for individual resource type. 
  * System level This endpoint enables to delete FHIR resources across all the resource types in FHIR server. 
    ```http
      DELETE  /$bulkDelete
    ```
  * Individual resource type : This endpoint allows to delete FHIR resources mapping to resource type mentioned in the url
    ```http
      DELETE /<Resource Type>/$bulkDelete
    ```

> [!NOTE]
> Bulk delete is a an operation to be used with caution. Resources in FHIR service once deleted cannot be reverted. 

## Headers
Bulk-Delete operation requires two header parameters  
* Accept: application/fhir+json
* Prefer: respond-async
` is an operation that allows you to delete the history of a single Fast Healthcare Interoperability Resources (FHIR&#174;) resource. This operation isn't defined in the FHIR specification, but it's useful for [history management](fhir-versioning-policy-and-history-management.md) in large FHIR service instances.

## Query Parameters
Query parameters allow you to filter raw resources you intend to delete. To support filtering, FHIR service supports below query parameters. 
All the query parameters are optional.

|Query parameter        | Default Value   |  Description|
|------------------------|---|------------|
|_hardDelete|False|For deletion of resource including history version, pass value true.|
|_purgeHistory|False|Allows to delete history versions associated with resource.|
|<search parameters>||Allows to specify search criteria and resources matching the search criteria will be deleted.Example : address:contains=Meadow subject:Patient.birthdate=1987-02-20|

## $bulk-delete Response 
After request is made to bulk delete FHIR resources, in response you should receive Content-Location header with the absolute URL of an endpoint for subsequent status requests, such as a polling endpoint.

**Polling endpoint:**
Request to polling endpoint will have one of the below four outcomes depending on the status of the bulk-delete job. The outcome will be provided within OperationOutcome of FHIR response
1.	Jobs in progress: This states the job is in progress. Status Code 202
2.	Completed: This states the job has successfully completed. At completion the information of number of resources deleted would be provided at individual resource type level. Status code 200
3.	Cancelled: This states job is cancelled by the user and provides information on number of resources delete at individual resource type level. Status code 200
4.	Failed: This states Job has failed. Status code depends on failure type

Below is the sample request and response for determining the status 
Request : 
  ```
  {{fhir_url}}/_operations/bulk-delete/<id>
  ```
Response: Below is sample response of successfully completed delete job. 
```
{
    "resourceType": "Parameters",
    "parameter": [
        {
            "name": "ResourceDeletedCount",
            "part": [
                {
                    "name": "Practitioner",
                    "valueDecimal": 10.0
                },
                {
                    "name": "Specimen",
                    "valueDecimal": 7.0
                },
                {
                    "name": "Device",
                    "valueDecimal": 3.0
                }
            ]
        }
    ]
}
```



