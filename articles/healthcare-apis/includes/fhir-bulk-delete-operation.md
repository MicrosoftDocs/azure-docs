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
  * System level: Execution of the operation at system-level enables deletion of FHIR resources across all the resource types in FHIR server.
    
    ```http
      DELETE  /$bulkDelete
    ```
  * Individual resource type: Execution of the operation at individual resource types allows deletion of FHIR resources mapping to specified resource type in the url.
    
    ```http
      DELETE /<Resource Type>/$bulkDelete
    ```
> [!NOTE]
> Bulk delete is a an operation to be used with caution. Resources in FHIR service once deleted cannot be reverted.

## Headers
Bulk-Delete operation requires two header parameters  
* Accept: application/fhir+json
* Prefer: respond-async

## Role
To perform bulk delete operation, user or application needs to be assigned to FHIR Data Contributor role.

## Query Parameters
Query parameters allow you to filter raw resources you intend to delete. 

To support filtering, query parameters are: 

|Query parameter        | Default Value   |  Description|
|------------------------|---|------------|
|_hardDelete|False|Allows to hard delete resource.If you don't pass this parameter or set hardDelete to false, the historic versions of the resource will still be available.|
|_purgeHistory|False|Allows to delete history versions associated with resource.|
|FHIR service supported search parameters||Allows to specify search criteria and resources matching the search criteria are deleted.Example: address:contains=Meadow subject:Patient.birthdate=1987-02-20|

All the query parameters are optional.

## Bulk Delete operation response 
After request is made to bulk delete FHIR resources, in response you should receive Content-Location header with the absolute URL of an endpoint for subsequent status requests, such as a polling endpoint.

**Polling endpoint:**
Request to polling endpoint has one of the four outcomes depending on the status of the bulk-delete job. The outcome is provided within OperationOutcome of FHIR response
1.	Jobs in progress: This outcome states the job is in progress. Status Code 202
2.	Completed: This outcome states the job has successfully completed. At completion, the information of number of resources deleted would be provided at individual resource type level. Status code 200
3.	Canceled: This outcome states job is canceled by the user and provides information on number of resources delete at individual resource type level. Status code 200
4.	Failed: This outcome states job has failed. Status code depends on failure type.

Sample request and response for determining the status 
Request: 
  ```
  {{fhir_url}}/_operations/bulk-delete/<id>
  ```
Sample response of successfully completed delete job. 
```
{
    "resourceType": "Parameters",
    "parameter": [
        {
            "name": "ResourceDeletedCount",
            "part": [
                {
                    "name": "Practitioner",
                    "valueInteger64": 10.0
                },
                {
                    "name": "Specimen",
                    "valueInteger64": 7.0
                },
                {
                    "name": "Device",
                    "valueInteger64": 3.0
                }
            ]
        }
    ]
}
```
## Bulk Delete operation error messages

Here are the list of error messages that can occur if bulk delete operation fails

|HTTP Status Code | Details | Recommended action |
|-----------------|---------|--------------------|
|202 |Bulk delete job is stuck | Cancel the bulk delete job and try again.|
|500 |Connection to database failed | Create support ticket to resolve the issue.|
|429 |Throttling errors | For Azure API for FHIR, you can increase RUs and retry the job. For Azure Health Data Services FHIR Server, you can try to delete a smaller amount of data at a time. |

## FAQ
1. Will API interactions see latency impact when bulk delete operation job is executed concurrently?

When running a bulk delete operation there is the possibility to see increased latency on concurrent calls to the service. To avoid latency increase, the recommendation is to cancel the bulk delete job and rerun it during a period of lower traffic.
> [!NOTE]
> If you cancel and then restart a bulk delete operation, it will resume the deletion process from where it previously stopped.

