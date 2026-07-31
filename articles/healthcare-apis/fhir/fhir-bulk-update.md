---
title: Perform Bulk Updates on FHIR Data in Azure Health Data Services
description: Learn how to use $bulk-update to update FHIR resources at scale in Azure Health Data Services, monitor job outcomes, and get started with bulk updates.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: how-to
ms.date: 06/24/2026
ms.author: kesheth
---

# Perform bulk updates on FHIR data

The `$bulk-update` operation enables you to update multiple FHIR resources in bulk by using asynchronous processing. It supports: 
 - System-level updates across all resource types
 - Updates scoped to individual resource types
 - Multi-resource operations in a single request

> [!NOTE]
> Use the `$bulk-update` operation with caution. You can't roll back updated resources once committed. To verify the data you want to update, run a FHIR search with the same parameters as the bulk update job.

The `$bulk-update` operation uses the supported patch types listed in the following section to perform updates.
 - `replace`: Replace an existing value. It uses the FHIR patch `replace` semantic, which ensures updates stay idempotent.
 - `upsert`: Add a value if it doesn't exist, or replace it if it does.

> [!NOTE]
> Other patch operations, such as `add`, `move`, `delete`, and `insert`, aren't supported.

## Prerequisites for bulk update operation

### Required roles

To execute a bulk update, assign the application or user one of the following roles:
 - FHIR Data Bulk Operator: Provides access to bulk operations in the FHIR service.
 - FHIR Data Contributor: Provides administrative access to the FHIR service.

### Required headers

| Header | Value |
| ------ | ------ |
| Accept | application/fhir+json |
| Prefer | respond-async |

## Request

Use FHIR search parameters in the request. The bulk update operation supports standard search filters, such as `address:contains=Meadow` or `Patient.birthdate=1987-02-20`. You can also use `_include`, `_revinclude`, and `_not-referenced` to extend search criteria. Use `_meta-history` to configure versioning behavior for metadata-only updates. 

### Request examples

1. System-level bulk update: When you run the operation at the system level, you can update FHIR resources across all resource types on the FHIR server.

   ```rest
   PATCH https://{FHIR-SERVICE-HOST}/$bulk-update
   ```
 
1. Updates scoped to individual resource type: When you run the operation for individual resource types, you can update FHIR resources that map to the resource type in the URL.
 
   ```rest
   PATCH https://{FHIR-SERVICE-HOST}/[ResourceType]/$bulk-update
   ```

1. Querying resources to update based on search parameters. In this example, use `_include` and `_revinclude`.
   Update all Patient resources last updated before 2021-12-18 and any resources referencing them:

   ```rest
   PATCH {FHIR-SERVICE-HOST}/Patient/$bulk-update?_lastUpdated=lt2021-12-18&_revinclude=*
   ```
 
   ```rest
   PATCH {FHIR-SERVICE-HOST}/DiagnosticReport/$bulk-update?_lastUpdated=lt2021-12-12&_include=DiagnosticReport:based-on:ServiceRequest&_include:iterate=ServiceRequest:encounter
   ```

1. Metadata-only updates with `_meta-history` query parameter: When the FHIR server versioning policy is set to either `versioned` or `version-update`, the `_meta-history` parameter controls whether metadata-only changes to a resource create a new historical version of the resource. By default, any change to a resource, including metadata-only changes, creates a new version and saves the previous version as a historical record. When you set the `_meta-history` parameter to false, metadata-only changes don't create a new version, and the previous version isn't saved as a historical record. Use this option when metadata changes frequently and you want to avoid many history versions that differ only in metadata. For more information and examples, see [FHIR versioning policy and history management](fhir-versioning-policy-and-history-management.md#metadata-only-updates-and-versioning).  

   ```rest
   PATCH https://{FHIR-SERVICE-HOST}/$bulk-update?_meta-history=false
   ```

When you use bulk update with FHIR search parameters, consider using the same query in a FHIR search first, so that you can verify the data that you plan to update.

Example request body:

```json
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
 - Each patch path must begin with the `ResourceType` root (for example, the `Patient.meta.tag`) to clearly distinguish between meta-level and element updates. You can patch common properties by using the Resource root. You can perform bulk update at the system level, for a single resource type, or for multiple resource types. If you need to update different fields for different resource types, specify field-value mappings in separate operations.
 - If your search returns multiple resource types, the patch is only applied to resources whose type matches the `ResourceType` prefix in the patch path. The operation ignores other types.
 - `SearchParameter` and `StructureDefinition` are considered out of scope for bulk updates. Running a bulk-update job by resource type on `SearchParameter` or `StructureDefinition` also results in a 400 Bad Request error. If a bulk update query at the system or resource-type level returns resources of type `SearchParameter` or `StructureDefinition`, the operation ignores these resources. Only other resource types are updated.

## Response
When you submit a bulk update operation, the server returns a response in the following format. The response includes a `Content-Location` header that points to the polling endpoint.

`Content-Location: https://{hostname}/_operations/bulk-update/{job-id}`

### Polling endpoint outcomes
Requests to the polling endpoint result in one of four outcomes, depending on the status of the bulk update job. The FHIR response includes the outcome within `OperationOutcome`.

| Status | Description |
| ------ | ------ |
| 202 | Job in progress |
| 200 | Job completed or canceled by the user |
| Other | Failure status based on error type |

The response to a bulk update operation includes four key components:
1. **ResourceUpdatedCount**: Shows the number of resources successfully updated, grouped by resource type.
1. **ResourceIgnoredCount**: Indicates the number of resources ignored during the bulk update, by resource type. The operation ignores resources if there's no corresponding patch request for their type, or if they're excluded types such as `SearchParameter` or `StructureDefinition`.
1. **ResourcepatchFailedCount**: Displays the number of resources where the patch operation failed, by resource type. For example, if you attempt to replace a value that doesn't exist, the patch operation fails and is counted here. The job is considered a "soft fail" if some resources fail but others succeed. The `Issues` section provides a general message that recommends using the FHIR PATCH operation on individual resources to get detailed error information.
1. **Issues**: Provides details about any job failures or reasons for unsuccessful updates.

Example response body:

```json
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
| 400 | Job already running, unsupported operation type, or excluded resource type. Only one bulk-update job can run at a time. Attempting to start another job while one is already in progress results in a 400 Bad Request error. | Retry after resolving conflict. |
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

When audit logging is enabled, you can query audit logs from **MicrosoftHealthcareApisAuditLogs**:

 - Filter by `ResourceId`.
 - Look in the entries for: Job started, Job succeeded, and patch failures.

For more information, see [FHIR service diagnostic logs](fhir-service-diagnostic-logs.md).

## FAQ

**Why don't the updated resource counts match expectations?**
 - Fewer resources: Another job modified resources before this job ran.
 - More resources: A new import job inserted resources after the bulk update initiated.

**What are the steps for resolution if my bulk update job seems to be stuck?**
To check if a bulk update job is stuck, run a FHIR search with the same parameters as the bulk update job. Add the appropriate operation condition in the query and set `_summary=count`. If the count of resources is going down, the job is working. You can also cancel the bulk update job and try again.

**What is the impact to REST API calls when a bulk update operation job is executed concurrently?**
When you run a bulk update operation, you might see increased latency on concurrent calls to the service. To avoid a latency increase, cancel the bulk update job, and then rerun it during a period of lower traffic.

**Can I revert changes?**
Use the bulk update capability carefully. For example, if versioning is enabled, fetch historical versions and use `PUT` to restore them, or restore from a backup. Data is retained for 7–30 days depending on configuration.

**What is ResourcepatchFailedCount?**
This count tracks the resources that failed during the `PATCH` operation. Causes might include:
 - Replacing a nonexistent element
 - Attempting to update an immutable field

Check the audit log or submit a `PATCH` request individually for error details.

## Next step

>[!div class="nextstepaction"]
> Learn more about [FHIR Path patch](https://hl7.org/fhir/fhirpatch.html).

