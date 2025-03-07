---
title: Common content for the `$bulk-delete` operation
description: Explains the `$bulk-delete` operation for the FHIR service and the Azure API for FHIR service in Azure Health Data Services.
ms.service: azure-health-data-services
ms.topic: include
ms.date: 04/01/2024
ms.author: kesheth
---

The bulk delete capability allows you to delete resources from FHIR&reg; service asynchronously. Bulk delete capability in FHIR service is supported with operations: `$bulk-delete` and `$bulk-delete-soft-deleted`. `$bulk-delete` operation allows you to delete resources in the FHIR service, except soft deleted resources. To delete soft deleted FHIR resources, you need to use `$bulk-delete-soft-deleted` operation.

FHIR service requires specific headers and roles enabled to use bulk delete capability

## Headers
To perform bulk delete capability header parameters needed are:
  
- **Accept**: application/fhir+json

- **Prefer**: respond-async

## Role requirements

- A user or application needs to be assigned to the `FHIR Data Writer` role, to perform the bulk delete capability.
- a user or application needs to be assigned to the `FHIR Data Contributor` role, to perform
-- bulk delete capability with a hard delete query parameter.
-- bulk delete on soft deleted resources.
  
## Bulk delete operation details
### `$bulk-delete` operation
You can execute the `$bulk-delete` operation at the system level or for individual resource types. 

  - **System level**: Execution of the operation at system-level enables deletion of FHIR resources across all the resource types on the FHIR server.
    
    ```http
      DELETE  /$bulk-delete
    ```
  
  - **Individual resource types**: Execution of the operation for individual resource types allows deletion of FHIR resources that map to the resource type in the URL.
    
    ```http
      DELETE /<Resource Type>/$bulk-delete
    ```

> [!NOTE]
> Use the `$bulk-delete` operation with caution. Deleted resources can't be restored.


#### Query parameters

Query parameters allow you to filter the raw resources you plan to delete. To support filtering, the query parameters are: 

|Query parameter        | Default Value   |  Description|
|------------------------|---|------------|
|_hardDelete|False|Allows you to hard delete a resource. If you don't pass this parameter or set hardDelete to false, the historic versions of the resource are still available.|
|_purgeHistory|False|Allows you to delete history versions associated with resource. It will not delete current version of the resource and soft deleted resources. Note: When _purgeHistory used with the _hardDelete parameter set to true, it permanently deletes all versions associated with the resource.|
|FHIR service supported search parameters||Allows you to specify search criteria and resources matching the search criteria are deleted. For example: `address:contains=Meadow subject:Patient.birthdate=1987-02-20`|

All the query parameters are optional.

### `$bulk-delete-soft-deleted` operation
To delete soft deleted resources within a FHIR service -$bulk-delete-soft-deleted operation can be used. This operation can be executed at the system level or for individual resource types. 

## Bulk delete operation response 

After a request is made to bulk delete FHIR resources, in response you receive a Content-Location header with the absolute URL of an endpoint for subsequent status requests, such as a polling endpoint.

### Polling endpoint

Request to the polling endpoint is one of the four outcomes depending on the status of the bulk delete job. The outcome is provided within OperationOutcome of the FHIR response.

1. **Jobs in progress**: This outcome states the job is in progress. Status Code 202.

1. **Completed**: This outcome states the job completed successfully. At completion, the information about the number of resources deleted is provided at individual resource type level. Status code 200.

1. **Canceled**: This outcome states the user canceled the job and provides information on the number of resources deleted at the individual resource level. Status code 200.

1. **Failed**: This outcome states the job failed. Status code depends on the failure type.

Sample request and response for determining the status 
request: 

  ```
  {{fhir_url}}/_operations/bulk-delete/<job id>
  ```
Here's a sample response for a successfully completed delete job:
 
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

## Error messages

Here's a list of error messages that might occur if the bulk delete operation fails.

|HTTP Status Code | Details | Recommended action |
|-----------------|---------|--------------------|
|500 |Connection to database failed | Create a gitsupport ticket to resolve the issue.|
|429 |Throttling errors | For Azure API for FHIR, you can increase RUs and retry the job. For Azure Health Data Services FHIR Server, you can try to delete a smaller amount of data at a time. |

## FAQ

- My bulk delete job seems to be stuck. What are the steps for resolution?<br/><br/>   To check if a bulk delete job is stuck, run a FHIR search with the same parameters as the bulk delete job and _summary=count. If the count of resources is going down, the job is working. You can also cancel the bulk delete job and try again. 

- Do API interactions see any latency impact when a bulk delete operation job is executed concurrently?<br/><br/>When you run a bulk delete operation, you might see increased latency on concurrent calls to the service. To avoid a latency increase, we recommend that you cancel the bulk delete job, and then rerun it during a period of lower traffic.

> [!NOTE]
> If you cancel and then restart a bulk delete job, the deletion process resumes from where it was stopped.

