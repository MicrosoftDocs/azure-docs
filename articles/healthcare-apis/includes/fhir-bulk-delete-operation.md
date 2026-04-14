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
Bulk delete capability header parameters are:
  
- **Accept**: application/fhir+json

- **Prefer**: respond-async

## Role requirements

- A user or application needs to be assigned to the `FHIR Data Writer` role, to perform the bulk delete capability.
- a user or application needs to be assigned to the `FHIR Data Contributor` role, to perform bulk delete capability with a hard delete query parameter and bulk delete on soft deleted resources.
  
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
> Use the `$bulk-delete` operation with caution. Deleted resources can't be restored. We recommend that you first run a FHIR search with the same parameters as the bulk delete job to verify the data that you want to delete.


#### Query parameters

Query parameters allow you to filter the raw resources you plan to delete. To support filtering, the query parameters are: 

|Query parameter        | Default Value   |  Description|
|------------------------|---|------------|
|_hardDelete|False|Allows you to hard delete a resource. If you don't pass this parameter or set hardDelete to false, the historic versions of the resource are still available.|
|_purgeHistory|False|Allows you to delete history versions associated with resource. It doesn't delete the current version of the resource and soft deleted resources. Note: When _purgeHistory used with the _hardDelete parameter set to true, it permanently deletes all versions associated with the resource.|
|excludedResourceTypes|empty|Allows you to exclude specified resource types (comma-separated) from being deleted in a bulk delete request. For example, `DELETE [base]/$bulk-delete?excludedResourceTypes=patient,observation` deletes all resources in your FHIR server, except for the Patient and Observation resource types. |
|_remove-references|False|Allows you to remove references to resources that are being deleted. This parameter must be used with _hardDelete=true. After you use this parameter to remove references, the reference that was removed is now replaced with the following value: `“display”: “Referenced resource deleted”`. For example,  `DELETE [base]/Patient/$bulk-delete?_remove-references=true&_hardDelete=true` bulk hard deleted all Patient resources, and remove references to those patients from other resources. So, if a Patient resource was referenced by an Observation resource, the reference to that Patient, which was previously `"subject": { "reference": "Patient/example-patient-id", }`,  is removed from the Observation resource after using bulk delete and removing references, and will be replaced with `"subject": { "display": "Referenced resource deleted" }`. |
|_not-referenced|empty| Allows you to use the [`_not-referenced`](/azure/healthcare-apis/fhir/overview-of-search#search-result-parameters)search parameter to search for resources that aren't referenced by other resources. See below section for more examples of using FHIR service supported search parameters.|
|FHIR service supported search parameters||Allows you to specify search criteria and resources matching the search criteria are deleted. For example: `address:contains=Meadow subject:Patient.birthdate=1987-02-20`. The section below provides more examples of using FHIR service supported search parameters, including how to use `_include` and `_revinclude` to use bulk delete with references, and _not-referenced to look for resources not referenced by other resources. |


All the query parameters are optional.
### Examples of using `$bulk-delete` with FHIR service supported search parameters
The $bulk-delete operation supports using FHIR service supported search parameters as a query parameter. Please note that singular deletes do not support extra parameters. When using bulk delete with FHIR search parameters, consider using the same query in a FHIR search first, so that you can verify the data that you want to delete. 

#### `$bulk-delete` with `_include` and `_revinclude`
`$bulk-delete` can be used with `_include` and `_revinclude` to use bulk delete with references. More information about `_include` and `_revinclude` as search result parameters can be found here. Some examples of using `$bulk-delete` with `_include` and `_revinclude`:

The following example using `_revinclude` will bulk delete all Patient resources that were last updated before December 18, 2021, and all resources that reference to those patients: 

`DELETE [base]/Patient/$bulk-delete?_lastUpdated=lt2021-12-18&_revinclude=*:* `

The following example using `_include` will bulk delete all DiagnosticReport resources that were last updated before 12/18/2021, as well as all ServiceRequest resources that are referenced by those DiagnosticReport resources (via DiagnosticReport.basedOn relationship), and all Encounter resources that are referenced by those ServiceRequest resources (via ServiceRequest.encounters relationship): 

`DELETE [base]/DiagnosticReport/$bulk-delete?_lastUpdated=lt2021-12-12&_include=DiagnosticReport:based-on:ServiceRequest&_include:iterate=ServiceRequest:encounter`

#### `$bulk-delete` with `_not-referenced`
>[!Note]
> The `_not-referenced` feature is available in Azure Health Data Services FHIR Server only, and isn't available in Azure API for FHIR.

Utilizing $bulk-delete with the [_not-referenced parameter](/azure/healthcare-apis/fhir/overview-of-search#search-result-parameters) allows you to search for and delete resources that are not referenced by other resources.  

The following example will bulk delete all Patient resources that are not referenced by Encounter resources that list them as a subject: 

`DELETE [base]/Patient/$bulk-delete?_not-referenced=Encounter:subject`    

The following example will bulk delete all Patient resources that are not referenced by Encounter resources in any field: 

`DELETE [base]/Patient/$bulk-delete?_not-referenced=Encounter:*` 

The following example will bulk delete all Patient resources that are not referenced by Encounter and DiagnosticReport resources: 

`DELETE [base]/Patient/$bulk-delete?_not-referenced=Encounter:subject&_not-referenced=DiagnosticReport:subject` 

The following example will bulk delete all Patient resources that are not referenced by any other resources: 

`DELETE [base]/Patient/$bulk-delete?_not-referenced=*:* `

 

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
|500 |Connection to database failed | To resolve the issue, create a Get Support ticket.|
|429 |Throttling errors | For Azure API for FHIR, you can increase RUs and retry the job. For Azure Health Data Services FHIR Server, you can try to delete a smaller amount of data at a time. |

## FAQ

- What are the steps for resolution if my bulk delete job seems to be stuck?<br/><br/>   To check if a bulk delete job is stuck, run a FHIR search with the same parameters as the bulk delete job and _summary=count. If the count of resources is going down, the job is working. You can also cancel the bulk delete job and try again. 

- Do API interactions see any latency when a bulk delete operation job is executed concurrently?<br/><br/>When you run a bulk delete operation, you might see increased latency on concurrent calls to the service. To avoid a latency increase, we recommend that you cancel the bulk delete job, and then rerun it during a period of lower traffic.

> [!NOTE]
> If you cancel and then restart a bulk delete job, the deletion process resumes from where it was stopped.