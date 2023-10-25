---
title: Bulk-delete operation for Azure Health Data Services FHIR service
description: This article describes the bulk-delete operation for the FHIR service.
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 10/22/2022
ms.author: kesheth
---

# Bulk Delete operation

`$bulk-delete' allows you to delete resources from FHIR server asynchronously. Bulk delete operation can be executed at system level or for individual resource type. 
  * System level This endpoint enables to delete FHIR resources across all the resource types in FHIR server. 
    ```http
      DELETE  /$bulkDelete
    ```
  * Individual resource type: This endpoint allows to delete FHIR resources mapping to resource type mentioned in the url
    ```http
      DELETE /<Resource Type>/$bulkDelete
    ```
> [!NOTE]
> Bulk delete is a an operation to be used with caution. Resources in FHIR service once deleted cannot be reverted.

Bulk delete operation is currently in public preview. Review disclaimer below for details.
[!INCLUDE [public preview disclaimer](../includes/common-publicpreview-disclaimer.md)]


## Headers
Bulk-Delete operation requires two header parameters  
* Accept: application/fhir+json
* Prefer: respond-async
` is an operation that allows you to delete the history of a single Fast Healthcare Interoperability Resources (FHIR&#174;) resource. This operation isn't defined in the FHIR specification, but it's useful for [history management](fhir-versioning-policy-and-history-management.md) in large FHIR service instances.

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
## Next steps

In this article, you learned how to bulk delete resources in the FHIR service. For information about supported FHIR features, see

>[!div class="nextstepaction"]
>[Supported FHIR features](fhir-features-supported.md)

>[!div class="nextstepaction"]
>[FHIR REST API capabilities for Azure Health Data Services FHIR service](fhir-rest-api-capabilities.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
