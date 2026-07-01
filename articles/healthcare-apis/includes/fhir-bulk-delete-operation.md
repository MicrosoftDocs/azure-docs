---
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: include
ms.date: 05/05/2026
ms.author: kesheth
author: expekesheth
---

The bulk delete capability enables you to delete resources from a FHIR&reg; service asynchronously. The FHIR service supports bulk delete capability with two operations: `$bulk-delete` and `$bulk-delete-soft-deleted`. The `$bulk-delete` operation deletes resources in the FHIR service, except for soft deleted resources. To delete soft deleted FHIR resources, use the `$bulk-delete-soft-deleted` operation.

## Configure headers and roles for bulk delete

### Headers

Bulk delete capability header parameters are:
  
- **Accept**: application/fhir+json

- **Prefer**: respond-async

### Role requirements

- Assign the `FHIR Data Writer` role to a user or application to perform the bulk delete capability.
- Assign the `FHIR Data Contributor` role to a user or application to perform bulk delete capability with a hard delete query parameter and bulk delete on soft deleted resources.
  
## Bulk delete operation details

### `$bulk-delete` operation

You can execute the `$bulk-delete` operation at the system level or for individual resource types. 

  - **System level**: When you execute the operation at the system level, you can delete FHIR resources across all the resource types on the FHIR server.
    
    ```rest
      DELETE  [base]/$bulk-delete
    ```
  
  - **Individual resource types**: When you execute the operation for individual resource types, you can delete FHIR resources that map to the resource type in the URL.
    
    ```rest
      DELETE [base]/<Resource Type>/$bulk-delete
    ```

> [!NOTE]
> Use the `$bulk-delete` operation with caution. You can't restore deleted resources. Run a FHIR search with the same parameters as the bulk delete job to verify the data you want to delete.


#### Parameters for bulk delete

Parameters allow you how to control the behavior of the bulk delete operation and filter the resources that are deleted. You can use these parameters to specify whether the delete is soft or hard, whether to purge history, exclude certain resource types, remove references, and filter resources using FHIR search parameters.

|Parameter        | Default Value   |  Description|
|------------------------|---|------------|
|_hardDelete|False|Deletes a resource permanently. If you don't pass this parameter or set `hardDelete` to false, the operation only soft deletes the resource.|
|_purgeHistory|False|Deletes history versions associated with resource. It doesn't delete the current version of the resource and soft deleted resources. Note: When you use `_purgeHistory` with the `_hardDelete` parameter set to true, it permanently deletes all versions associated with the resource.|
|excludedResourceTypes|empty|Excludes specified resource types (comma-separated) from being deleted in a bulk delete request. For example, `DELETE [base]/$bulk-delete?excludedResourceTypes=patient,observation` deletes all resources in your FHIR server, except for the Patient and Observation resource types. |
|_remove-references|False|Removes references to resources that are being deleted. You must use this parameter with `_hardDelete=true`. After you use this parameter to remove references, the removed references are replaced with the following value: `“display”: “Referenced resource deleted”`. For example,  `DELETE [base]/Patient/$bulk-delete?_remove-references=true&_hardDelete=true` bulk hard deletes all Patient resources, and removes references to those patients from other resources. So, if an Observation resource references a deleted Patient resource, the reference to that Patient, which was previously `"subject": { "reference": "Patient/example-patient-id", }`, is replaced with `"subject": { "display": "Referenced resource deleted" }`. |
|_not-referenced|empty| Use the [`_not-referenced`](/azure/healthcare-apis/fhir/overview-of-search#search-result-parameters) search parameter to search for resources that no other resources reference. See the following section for more examples of using FHIR service supported search parameters.|
|FHIR service supported search parameters||Specify search criteria. The operation deletes resources that match the search criteria. For example: `address:contains=Meadow subject:Patient.birthdate=1987-02-20`. The following section provides more examples of using FHIR service supported search parameters, including how to use `_include` and `_revinclude` to use bulk delete with references, and `_not-referenced` to look for resources not referenced by other resources. |


All the parameters are optional.

### Use bulk delete with FHIR search parameters

The `$bulk-delete` operation supports using FHIR service supported search parameters as query parameters. Singular deletes don't support extra parameters. When you use bulk delete with FHIR search parameters, consider using the same query in a FHIR search first, so that you can verify the data you want to delete. 

#### Bulk delete resources with references

Use `$bulk-delete` with `_include` and `_revinclude` to bulk delete resources that have references. For more information about `_include` and `_revinclude` as search result parameters, see [Include and RevInclude](../fhir/overview-of-search.md#search-result-parameters). 

Here are some examples of using `$bulk-delete` with `_include` and `_revinclude`:

The following example uses `_revinclude` to bulk delete all Patient resources that were last updated before December 18, 2021, and all resources that reference those patients: 

```rest
DELETE [base]/Patient/$bulk-delete?_lastUpdated=lt2021-12-18&_revinclude=*:* 
```

The following example uses `_include` to bulk delete all DiagnosticReport resources that were last updated before December 18, 2021, and all ServiceRequest resources referenced by those DiagnosticReport resources (via DiagnosticReport.basedOn relationship), and all Encounter resources referenced by those ServiceRequest resources (via ServiceRequest.encounters relationship): 

```rest
DELETE [base]/DiagnosticReport/$bulk-delete?_lastUpdated=lt2021-12-12&_include=DiagnosticReport:based-on:ServiceRequest&_include:iterate=ServiceRequest:encounter
```

#### Bulk delete resources that aren't referenced

>[!Note]
> The `_not-referenced` feature is available in Azure Health Data Services FHIR Server only, and isn't available in Azure API for FHIR.

By using `$bulk-delete` with the [_not-referenced parameter](/azure/healthcare-apis/fhir/overview-of-search#search-result-parameters), you can search for and delete resources that no other resources reference.  

This example bulk deletes all Patient resources that no Encounter resources list as a subject.

```rest
DELETE [base]/Patient/$bulk-delete?_not-referenced=Encounter:subject
```    

This example bulk deletes all Patient resources that Encounter resources don’t reference in any field.

```rest
DELETE [base]/Patient/$bulk-delete?_not-referenced=Encounter:* 
``` 

This example bulk deletes all Patient resources that Encounter and DiagnosticReport resources don’t reference. 

```rest
DELETE [base]/Patient/$bulk-delete?_not-referenced=Encounter:subject&_not-referenced=DiagnosticReport:subject
``` 

This example bulk deletes all Patient resources that no other resources reference.

```rest
DELETE [base]/Patient/$bulk-delete?_not-referenced=*:* 
```

### `$bulk-delete-soft-deleted` operation

To delete soft-deleted resources within a FHIR service, use the `$bulk-delete-soft-deleted` operation. You can run this operation at the system level or for individual resource types. 

## Understand bulk delete operation responses 

After you request to bulk delete FHIR resources, you receive a Content-Location header with the absolute URL of an endpoint for subsequent status requests, such as a polling endpoint.

### Polling endpoint

A request to the polling endpoint returns one of four outcomes depending on the status of the bulk delete job. The FHIR response's OperationOutcome provides the outcome.

1. **Jobs in progress**: This outcome states the job is in progress. Status code 202.

1. **Completed**: This outcome states the job completed successfully. At completion, the response provides information about the number of resources deleted at the individual resource type level. Status code 200.

1. **Canceled**: This outcome states the user canceled the job and provides information on the number of resources deleted at the individual resource level. Status code 200.

1. **Failed**: This outcome states the job failed. Status code depends on the failure type.

Sample request and response for determining the status request: 

`{{fhir_url}}/_operations/bulk-delete/<job id>`

Here's a sample response for a successfully completed delete job:
 
```json
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

### What are the steps for resolution if my bulk delete job seems to be stuck?

To check if a bulk delete job is stuck, run a FHIR search with the same parameters as the bulk delete job and _summary=count. If the count of resources is going down, the job is working. You can also cancel the bulk delete job and try again. 

### Do API interactions see any latency when a bulk delete operation job is executed concurrently?

When you run a bulk delete operation, you might see increased latency on concurrent calls to the service. To avoid a latency increase, cancel the bulk delete job, and then rerun it during a period of lower traffic.

> [!NOTE]
> If you cancel and then restart a bulk delete job, the deletion process resumes from where it was stopped.