---
title: Azure API for FHIR monthly releases 2026
description: This article provides details about the Azure API for FHIR monthly features and enhancements in 2026.
services: healthcare-apis
author: evachen96
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: reference
ms.date: 04/10/2026
ms.custom:
  - references_regions
  - build-2026
ms.author: evach
---

# Release notes 2026: Azure API for FHIR

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

Azure API for FHIR&reg; provides a fully managed deployment of the Microsoft FHIR Server for Azure. The server is an implementation of the [FHIR](https://hl7.org/fhir) standard. This document provides details about the features and enhancements made to Azure API for FHIR.

## September 2026
### FHIR service

**SMART-on-FHIR compartment authorization enforced on `_include` and `_revinclude`**: SMART-on-FHIR compartment authorization is now enforced on `_include` and `_revinclude` query results. Previously, included resources could be returned without verifying they belonged to the authorized patient compartment. Queries using `_include` or `_revinclude` under SMART scopes might now return fewer results.

#### Bug fixes:

**Fix for conditional patch with required ETags**: Fixed an issue where conditional patch requests failed when ETags were required. Conditional patches now correctly pass the ETag for optimistic concurrency checks.

**Fix for intermittent errors from non-thread-safe HTTP header access**: Fixed intermittent errors in request processing caused by non-thread-safe HTTP header access, improving overall service stability.

**Fix for capability statement rebuild exceptions from stale request context**: Fixed unexpected exceptions during capability statement rebuilds caused by stale request context in background processing.

## August 2026
### FHIR service

**Rejection of mixed-context SMART clinical scopes**: SMART clinical scopes that mix `patient`, `user`, and `system` contexts are now rejected with HTTP 400 Bad Request, ensuring consistent authorization enforcement.

**Null-safety improvements in resource validation**: Added null-safety checks to improve the reliability of resource validation.

**Reindex reliability improvement**: The running reindex check was moved to the data store, improving reliability of the reindex operation.

**Microsoft Entra security group support removed for local RBAC**: Assigning data plane access to a Microsoft Entra security group in the **Allowed object IDs** list is no longer supported. Grant access directly to individual users or service principals instead. This change keeps Azure API for FHIR aligned with current security practices and limits the access the service needs to your directory. For more information, see [Configure local RBAC for FHIR](configure-local-rbac.md).

#### Bug fixes:

**Fix for date filtering in bulk delete jobs**: Fixed an issue where the date filter was not correctly applied to bulk delete jobs, which could result in deletions beyond the intended date range.

**Fix for race condition in bundle processing**: Fixed a race condition in bundle processing that could cause intermittent failures.

**Fix for search parameter deletion in sequential transaction bundles**: Fixed a bug where deleting a search parameter in a sequential transaction bundle could fail.

**Fix for `$validate` ignoring canonical profile version**: Fixed an issue where the `$validate` operation ignored the version specified in a canonical profile URL (for example, `|1.0.0`) and resolved whichever profile version was last loaded instead of the requested version.

**Fix for orphaned SearchParameter URLs after update**: Fixed an issue where updating a SearchParameter's URL left the previous URL orphaned with an unchanged status, preventing proper cleanup.

## July 2026
### FHIR service

**Improved handling of invalid bundle types**: The FHIR service now returns proper error responses when an invalid bundle type is submitted (HTTP 400 Bad Request instead of HTTP 500 Internal Server Error).

**New configuration options for date search behavior**: Added new configuration options to control date search behavior, allowing the Date Equality Rewriter to be used only when Date Containment is enabled. This provides more control over how date-based searches are optimized.

**Search modifiers rejected in SMART v2 clinical scopes**: FHIR search modifiers (such as `:not`, `:missing`, `:exact` and others) are now explicitly rejected when used in SMART v2 clinical scopes. Previously, these modifiers could bypass scope restrictions. Requests that use search modifiers in clinical scopes now receive an HTTP 400 Bad Request response.

#### Bug fixes:

**Fix for `$bulk-delete` and `$bulk-update` without search parameters**: Fixed an issue where `$bulk-delete` and `$bulk-update` operations would fail when no search parameters were provided. These operations now work correctly without parameters.

**Fix for authorization check on conditional delete**: Fixed an issue where conditional delete operations didn't correctly verify that the caller had the required delete data action permission. Conditional delete now enforces the delete permission check consistently.

**Fix for `$bulk-update` with only `_lastUpdated` as a search parameter**: Fixed an issue where a `$bulk-update` request that used `_lastUpdated` as the only search parameter would update all resources instead of only the filtered subset. The `_lastUpdated` filter is now correctly applied.

## June 2026
### FHIR service

**Parallel bundle error handling improvement**: Parallel bundle error handling has been improved. Client-side errors now return HTTP 400 Bad Request, and dependent operations are marked as HTTP 424 Failed Dependency.

**Deduplication of duplicate query parameters**: Duplicate query parameters with identical key-value pairs are now deduplicated before query parsing, reducing unnecessary database load.

## May 2026
### FHIR service

**Improved bundle error handling**: When a bundle request was throttled (HTTP 429) and the client canceled the request during the retry wait, the server could exhibit unexpected behavior. The server now properly handles cancellation during retry delays and returns HTTP 408 (Request Timeout) for affected bundle entries. The maximum Retry-After delay is also capped at 15 seconds.

**Security enhancements for export**: Added validation to reject path traversal sequences in $export endpoint parameters to prevent unauthorized access to blob storage paths.

**Case change for custom headers in diagnostic logs**: Custom headers in diagnostic logs will now appear in lowercase to align with modern HTTP standards. This does not impact API functionality, but customers using case-sensitive parsing in logging or monitoring pipelines may need to update their logic. We recommend ensuring header processing is case-insensitive.


## April 2026
### FHIR service
**Security enhancements for narrative sanitizer**: Enhanced security by detecting and handling dangerous href schemes (`javascript:`, `data:`, `vbscript:`, etc.) in FHIR narrative HTML. The FHIR service rejects links with these schemes in an href property because they don't pass validation.

#### Bug fixes:
**Improved monitoring accuracy for Azure API for FHIR**: An issue was identified and resolved that affected Azure Monitor metrics under Microsoft.HealthcareAPIs: CosmosDbThrottleRate, CosmosDbRequests, TotalErrors, and TotalRequests. An unsupported aggregation configuration caused inconsistency in metric data. This issue was limited to observability scenarios and did not impact service availability, performance, or data processing. After the fix, customers may now observe improved accuracy and consistency in monitoring experiences without requiring any action.

**Fix for reindex orchestrator's handling of search parameter status promotion logic**: There was an issue that caused reindex job timeouts and blocked certain search parameter promotion from Supported to Enabled status. The fix improves the reindex orchestrator's handling of Search Parameter hash mismatches and status promotion logic.

## March 2026
### FHIR service
**Bulk Export cancellation behavior update**: Added updates to align the FHIR server to support [Bulk Data Access 2.0](https://hl7.org/fhir/uv/bulkdata/STU2/export.html#bulk-data-delete-request). This update includes a change to bulk export cancellation behavior. Previously, cancellation request of an already completed, canceled, or failed export job returned "200 OK." The behavior is now updated to return more informative operation outcomes:
  - Cancelling an already-canceled export job returns "404 Job Not Found."
  - Cancelling a completed or failed export job returns "404 Job Not Found" if the job is already canceled or failed; otherwise returns "202 Accepted."
  - Cancelling a queued or running export job returns "202 Accepted"; no behavior change.
  - Trying to get the status of a user-requested canceled job returns "404 Job Not Found."


#### Bug fixes:
**Added validation for search parameter URL length**: There was an issue where custom search parameter URLs that were longer than the 128-character limit were allowed into the FHIR server and truncated, resulting in faulty search parameter behavior. This issue is fixed by adding a validation for search parameter URL length. If the URL length exceeds the limit, the validation fails and returns an error: "Search Parameter URL exceeds the maximum length limit of 128."

**Fix for versioning configuration issue**:  On 10 March 2026, a release rolled out that fixed a bug that prevented the resource versioning policy default setting from being honored in the FHIR server. This fix revealed another bug involving a bad configuration setting value that resulted in some requests failing with 500 errors. The issue was fixed on 10 March 2026.

## February 2026
### FHIR service

#### Bug fixes:
**Pagination bug in FHIR search fix**: A pagination bug in FHIR search queries caused the service to skip resources intermittently when results spanned multiple pages and used continuation tokens. The issue is fixed.


## January 2026
### FHIR service

**Improved capability statement refresh after profile updates**: Improved latency for profile updates to reflect in the Capability Statement.

**Updates to responses for update and deletion of FHIR spec-defined search parameters**: There are a few updates to the behaviors and responses for update and deletion of FHIR spec-defined search parameters:
  - Deletion of out-of-box FHIR spec-defined search parameters previously returned a "204 No Content" and the parameter wasn't deleted. The response is updated to correctly return "405 Method Not Allowed."
  - Update of out-of-box FHIR spec-defined search parameters previously returned "201 Created," which can cause unintended behavior. The response is updated to return "405 Method Not Allowed." If you wish to update an out-of-box FHIR spec-defined search parameter, create a new custom search parameter with a different URL.

**Enhanced response logging for deletion of non-existent search parameters**:  Deletion of nonexistent search parameters previously returned a "204 No Content." The response is improved to be more informative and now returns "404 Not Found."

#### Bug fixes:

**Bug fix for profile version in capability statement**: The [capability statement](store-profiles-in-fhir.md#profiles-in-the-capability-statement) lists details of the stored profiles on the FHIR server. There was a bug where the capability statement wasn't showing the profile version that is currently loaded into the FHIR server. The issue is fixed, and the capability statement now correctly states the profile version that is loaded on the FHIR server. 

## Related content
[Release notes 2025](release-notes-2025.md)


[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
