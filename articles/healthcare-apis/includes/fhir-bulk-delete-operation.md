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

Bulk delete operation is currently in public preview. Review disclaimer for details.
[!INCLUDE [public preview disclaimer](../includes/common-publicpreview-disclaimer.md)]


## Headers
Bulk-Delete operation requires two header parameters  
* Accept: application/fhir+json
* Prefer: respond-async

## Query Parameters
Query parameters allow you to filter raw resources you intend to delete. To support filtering, FHIR service query parameters are: 

|Query parameter        | Default Value   |  Description|
|------------------------|---|------------|
|_hardDelete|False|For deletion of resource including history version, pass value true.|
|_purgeHistory|False|Allows to delete history versions associated with resource.|
|FHIR service supported search parameters||Allows to specify search criteria and resources matching the search criteria are deleted.Example: address:contains=Meadow subject:Patient.birthdate=1987-02-20|

All the query parameters are optional.

## $bulk-delete Response 
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
