---
title: Perform bulk updates on FHIR data in Azure Health Data Services
description: Learn how to bulk update resources from the FHIR service in Azure Health Data Services.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: conceptual
ms.date: 09/17/2025
ms.author: kesheth
---

# Perform bulk updates on FHIR data

The `$bulk-update` operation allows you to update multiple FHIR resources in bulk using asynchronous processing. It supports: 
 - System-level updates across all resource types
 - Updates scoped to individual resource types
 - Multi-resource operations in a single request

> [!NOTE]
> Use the `$bulk-update` operation with caution. Updated resources can't be rolled back once committed. We recommend that you first run a FHIR search with the same parameters as the bulk update job to verify the data that you want to update.

The `$bulk-update` operation uses the supported patch types listed below to perform updates.
 - replace: Replace an existing value. It leverages the FHIR Patch "replace" semantic, ensuring updates remain idempotent
 - upsert: This operation adds a value if it doesn’t exist, or replace if it does

> [!NOTE]
> Other Patch operations (for example: add, move, delete, insert) are not supported.

## Prerequisites for bulk update operation
### Required roles

To execute a bulk update, the application or user must be assigned one of the following roles:
 - FHIR Data Bulk Operator: Provides access to bulk operations in the FHIR service.
 - FHIR Data Contributor: Administrative access to the FHIR service.

### Required headers

| Header | Value |
| ------ | ------ |
| Accept | application/fhir+json |
| Prefer | respond-async |

## Request

You can use FHIR search parameters in the request. The bulk update operation supports standard search filters, for example: address:contains=Meadow, or Patient.birthdate=1987-02-20. You can also use _include, _revinclude, and _not-referenced to extend search criteria.

### Request examples

1. System level bulk update: Execution of the operation at system-level enables update on FHIR resources across all the resource types on the FHIR server.

 `PATCH https://{FHIR-SERVICE-HOST}/$bulk-update`
 
2. Updates scoped to individual resource type: Execution of the operation for individual resource types allows update on FHIR resources that map to the resource type in the URL.
 
 `PATCH https://{FHIR-SERVICE-HOST}/[ResourceType]/$bulk-update`

3. Querying resources to update based on search parameters. In this example we will be using `_include` and `_revinclude`
   Update all Patient resources last updated before 2021-12-18 and any resources referencing them:

 `PATCH {FHIR-SERVICE-HOST}/Patient/$bulk-update?_lastUpdated=lt2021-12-18&_revinclude=*`
 
 `PATCH {FHIR-SERVICE-HOST}/DiagnosticReport/$bulk-update?_lastUpdated=lt2021-12-12&_include=DiagnosticReport:based-on:ServiceRequest&_include:iterate=ServiceRequest:encounter`

When using bulk update with FHIR search parameters, consider using the same query in a FHIR search first, so that you can verify the data that you plan to update.

The following is an example request body.
```
{ 
  "resourceType": "Parameters", 
  "parameter": [ 
    { 
      "name": "operation", 
      "part": [ 
        { 
          "name": "type", 
          "valueCode": "upsert" 
        }, 

        { 
          "name": "path", 
          "valueString": "Resource.meta" 
        }, 

        { 
          "name": "name", 
          "valueString": "security" 
        }, 

        { 
          "name": "value", 
          "valueCoding": { 
            "system": "http://example.org/security-system", 
            "code": "SECURITY_TAG_CODE", 
            "display": "Updated Security Tag Display" 
          } 
        } 
      ] 
    } 
  ] 
}
```

### Key points
 - Each patch path must begin with the `ResourceType` root (for example, the `Patient.meta.tag`) to clearly distinguish between meta-level and element updates. Common properties can be patched using the Resource root. Bulk update can be performed at the system level, for a single resource type, or for multiple resource types. If you need to update different fields for different resource types, you can specify field-value mappings in separate operations.
 - If your search returns multiple resource types, the patch is only applied to resources whose type matches the `ResourceType` prefix in the patch path; other types are ignored.
 - `SearchParameter` and `StructureDefinition` are considered out of scope for bulk updates. Running a bulk-update job by resource type on `SearchParameter` or `StructureDefinition` will also result in a 400 Bad Request error. If a bulk update query at the system- or resource-type level returns resources of type `SearchParameter` or `StructureDefinition`, these will be ignored during the operation. Only other resource types will be updated.

## Response
On submission of a bulk update operation, a response of the following format is returned, with a Content-Location header pointing to the polling endpoint.

`Content-Location: https://{hostname}/_operations/bulk-update/{job-id}`

### Polling endpoint outcomes
Requests to the polling endpoint will lead to one of four outcomes, depending on the status of the bulk update job. The outcome is provided within `OperationOutcome` in the FHIR response.

| Status | Description |
| ------ | ------ |
| 202 | Job in progress |
| 200 | Job completed or canceled by the user |
| Other | Failure status based on error type |

The response to a bulk update operation includes four key components:
1. **ResourceUpdatedCount**: Shows the number of resources successfully updated, grouped by resource type.
2. **ResourceIgnoredCount**: Indicates the number of resources ignored during the bulk update, by resource type. Resources are ignored if there is no corresponding Patch request for their type, or if they are excluded types such as `SearchParameter` or `StructureDefinition`.
3. **ResourcePatchFailedCount**: Displays the number of resources where the Patch operation failed, by resource type. For instance, if a replacement is attempted for a value that does not exist, the Patch will fail and be counted here. The job is considered a "soft fail" if some resources fail but others succeed. A general message is provided in the Issues section, recommending the use of the FHIR PATCH operation on individual resources to get detailed error information.
4. **Issues**: Provides details about any job failures or reasons for unsuccessful updates.

The following is an example response body.
```
{ 

  "resourceType": "Parameters", 

  "parameter": [ 
    { 
      "name": "ResourceUpdatedCount", 
      "part": [ 
        { "name": "Practitioner", "valueInteger64": 10 }, 
        { "name": "Specimen", "valueInteger64": 7 }, 
        { "name": "Device", "valueInteger64": 3 } 
      ] 
    }, 

    { 
      "name": "ResourceIgnoredCount", 
      "part": [ 
        { "name": "StructureDefinition", "valueInteger64": 9 }, 
        { "name": "SearchParameter", "valueInteger64": 8 } 
      ] 
    } 
  ] 
}
```

### Response error handling

| HTTP status | Cause | Action |
| ------ | ------ | ------ |
| 400 | Job already running, unsupported operation type, or excluded resource type. Only one bulk-update job can run at a time. Attempting to start another job while one is already in progress will result in a 400 Bad Request error. | Retry after resolving conflict. |
| 403 | Unauthorized | Assign the required role. |
| 429 | Throttled | Retry with reduced load. |
| 500 | Server error | Create a support ticket. |
| 503 | Database issues | Retry after some time. |

## Cancel a bulk update job
Send a DELETE request to the job’s polling endpoint as follows.

`DELETE https://{FHIR-SERVICE-HOST}/_operations/bulk-update/{job-id}`

> [!NOTE]
> Canceling a job resumes the deletion process from where it left off if retried.

## Audit logs
Audit logs can be queried from **MicrosoftHealthcareApisAuditLogs**:
 - Filter by `ResourceId`.
 - Look in the entries for: Job started, Job succeeded and Patch failures.

## FAQ

**Why do updated resource counts not match expectations?**
 - Fewer: Resources may have been modified by another job before this job ran.
 - More: A new import job may have inserted resources after the bulk update was initiated.

**What are the steps for resolution if my bulk update job seems to be stuck?**
To check if a bulk update job is stuck, run a FHIR search with the same parameters as the bulk update job, where the appropriate operation condition is added in the query and _summary=count. If the count of resources is going down, the job is working. You can also cancel the bulk update job and try again.

**What is the impact to REST API calls when a bulk update operation job is executed concurrently?**
When you run a bulk update operation, you might see increased latency on concurrent calls to the service. To avoid a latency increase, we recommend that you cancel the bulk update job, and then rerun it during a period of lower traffic.

**Can I revert changes?**
You should use the bulk update capability carefully. For example, if versioning is enabled, fetch historical versions and use PUT to restore them, or restore from a backup (Data is retained for 7–30 days depending on configuration).

**What is ResourcePatchFailedCount?**
This is a count of the Resources that failed during the `PATCH` operation. Causes may include:
 - Replacing a non-existent element
 - Attempting to update an immutable field

Check the audit log or submit a PATCH request individually for error details.

## Next steps
 - Learn more about [FHIR Path Patch](https://hl7.org/fhir/fhirpatch.html)
 - Explore Azure Health Data Services FHIR documentation
 - Manage roles and access 
