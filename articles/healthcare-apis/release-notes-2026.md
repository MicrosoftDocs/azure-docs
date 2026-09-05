---
title: Release notes for 2026 Azure Health Data Services monthly releases
description: 2026 - Stay updated with the latest features and improvements for the FHIR, DICOM, and MedTech services in Azure Health Data Services in 2026. Read the monthly release notes and learn how to get the most out of healthcare data.
services: healthcare-apis
author: evachen96
ms.service: azure-health-data-services
ms.subservice: workspace
ms.topic: reference
ms.date: 04/10/2026
ms.author: evach
ms.custom:
  - references_regions
  - build-2026
---

# Release notes 2026: Azure Health Data Services

Release notes describe features, enhancements, and bug fixes released in 2026 for the FHIR&reg; service and DICOM&reg; service in Azure Health Data Services.

## September 2026
### FHIR service

**SMART-on-FHIR compartment authorization enforced on `_include` and `_revinclude`**: SMART-on-FHIR compartment authorization is now enforced on `_include` and `_revinclude` query results. Previously, included resources could be returned without verifying they belonged to the authorized patient compartment. Queries using `_include` or `_revinclude` under SMART scopes might now return fewer results.

**Reindex operation optimizations**: Reindex operations are significantly optimized with reduced memory usage, removal of unnecessary database scans, and a fail-fast approach for improved reliability.

#### Bug fixes:

**Fix for conditional patch with required ETags**: Fixed an issue where conditional patch requests failed when ETags were required. Conditional patches now correctly pass the ETag for optimistic concurrency checks.

**Fix for intermittent errors from non-thread-safe HTTP header access**: Fixed intermittent errors in request processing caused by non-thread-safe HTTP header access, improving overall service stability.

**Fix for NullReferenceException in security provider during background jobs**: Fixed a NullReferenceException in the security provider that occurred during background jobs when the capability statement cache hadn't yet been built.

**Fix for HTTP 500 on mixed SMART v1 and v2 scopes**: Fixed an incorrect HTTP 500 error response when a request contained a mix of SMART v1 and v2 scopes. The service now returns a proper authorization error.

**Fix for `$import` status endpoint HTTP 500 with processing job ID**: Fixed an HTTP 500 error from the `$import` status endpoint when polling with a processing job ID instead of the orchestrator's ID.

## August 2026
### FHIR service

**Security enhancements for FHIR resource narrative content**: Improved security protections for FHIR resource narrative content to help prevent potential cross-site scripting (XSS) scenarios.

**Rejection of mixed-context SMART clinical scopes**: SMART clinical scopes that mix `patient`, `user`, and `system` contexts are now rejected with HTTP 400 Bad Request, ensuring consistent authorization enforcement.

**Null-safety improvements in resource validation**: Added null-safety checks to improve the reliability of resource validation.

**Reindex reliability improvement**: The running reindex check was moved to the data store, improving reliability of the reindex operation.

#### Bug fixes:

**Fix for date filtering in bulk delete jobs**: Fixed an issue where the date filter was not correctly applied to bulk delete jobs, which could result in deletions beyond the intended date range.

**Fix for race condition in bundle processing**: Fixed a race condition in bundle processing that could cause intermittent failures.

**Fix for search parameter deletion in sequential transaction bundles**: Fixed a bug where deleting a search parameter in a sequential transaction bundle could fail.

**Fix for search parameters retained on deleted resources**: Fixed an issue where deleted resources could incorrectly retain search parameters.

**Fix for validation ordering in convert-data operations**: Fixed validation ordering for convert-data operations.

**Fix for `$validate` ignoring canonical profile version**: Fixed an issue where the `$validate` operation ignored the version specified in a canonical profile URL (for example, `|1.0.0`) and resolved whichever profile version was last loaded instead of the requested version.

**Fix for orphaned SearchParameter URLs after update**: Fixed an issue where updating a SearchParameter's URL left the previous URL orphaned with an unchanged status, preventing proper cleanup.

**Fix for SearchParameter URL collision on create**: Fixed an issue where creating a SearchParameter with a URL already owned by a different active resource was allowed, which could cause errors during bundle processing.

## July 2026
### FHIR service

**Improved handling of invalid bundle types**: The FHIR service now returns proper error responses when an invalid bundle type is submitted (HTTP 400 Bad Request instead of HTTP 500 Internal Server Error).

**New configuration options for date search behavior**: Added new configuration options to control date search behavior, allowing the Date Equality Rewriter to be used only when Date Containment is enabled. This provides more control over how date-based searches are optimized.

**Improved search parameter statistics handling for `:missing` modifier**: Improved search parameter statistics handling for searches using the `:missing` modifier, resulting in better query performance for these types of searches.

**Improved stability of standalone FHIR operations**: Improved stability of standalone FHIR operations by making them more resilient to transient database conflicts. Sporadic deadlock errors are now automatically retried instead of being returned to the caller.

**Improved reliability of reindex operations for large datasets**: Improved reliability of reindex operations for large datasets by increasing timeout thresholds and fixing sliding window logic.

**Search modifiers rejected in SMART v2 clinical scopes**: FHIR search modifiers (such as `:not`, `:missing`, `:exact` and others) are now explicitly rejected when used in SMART v2 clinical scopes. Previously, these modifiers could bypass scope restrictions. Requests that use search modifiers in clinical scopes now receive an HTTP 400 Bad Request response.

#### Bug fixes:

**Fix for `$bulk-delete` and `$bulk-update` without search parameters**: Fixed an issue where `$bulk-delete` and `$bulk-update` operations would fail when no search parameters were provided. These operations now work correctly without parameters.

**Fix for iterative includes exceeding maximum count**: Fixed an issue where searches with iterative includes exceeding the maximum count would return a server error. The service now returns a proper warning instead.

**Fix for search parameter delete workflow with pending delete statuses**: Fixed the search parameter delete workflow to correctly handle parameters with pending delete statuses, preventing stale search parameter data from being included in query results. For more information, see [Selectable search parameters for the FHIR service in Azure Health Data Services](./fhir/selectable-search-parameters.md#get-the-status-of-search-parameters).

**Fix for authorization check on conditional delete**: Fixed an issue where conditional delete operations didn't correctly verify that the caller had the required delete data action permission. Conditional delete now enforces the delete permission check consistently.

**Fix for `$bulk-update` with only `_lastUpdated` as a search parameter**: Fixed an issue where a `$bulk-update` request that used `_lastUpdated` as the only search parameter would update all resources instead of only the filtered subset. The `_lastUpdated` filter is now correctly applied.

## June 2026
### FHIR service

**Bug fix for chained searches with birthdates**: A previous improvement for birthdate search performance introduced a bug in chained searches with birthdates. This issue has been fixed.

**`$expand` operation returns HTTP 404 for missing ValueSet**: The `$expand` operation now correctly returns HTTP 404 (instead of HTTP 200) when the requested ValueSet isn't found, aligning with FHIR spec requirements.

**Rework of search parameter concurrency handling**: To guarantee store data integrity, FHIR server implemented strict concurrency control for search parameter writes. When requests to write search parameters are sent in parallel, depending on timing, some requests might fail with concurrency conflict errors. This is because each write operation requires validation against the reference set, and concurrent modifications might lead to data integrity issues, therefore they are restricted. When writing search parameters, avoid sending multiple parallel requests. If you need to process multiple search parameters, send requests one after another, or use a single bundle call. 

**Transaction bundle conflict handling**: Transaction bundle conflict handling has been improved. When concurrent transaction bundles encounter conflicts, the service now returns HTTP 409 Conflict instead of HTTP 500 Internal Server Error, allowing clients to retry appropriately.

**Improved error handling for malformed continuation tokens**: Malformed continuation tokens now return HTTP 400 Bad Request instead of HTTP 500 Internal Server Error, improving error classification for invalid client requests.

**Birthdate search performance improvement**: Birthdate search performance has been improved. Date-of-birth equality queries now use a more efficient query pattern, reducing database load for common patient birthdate searches.

**Reject JWT access tokens in URL**: Requests containing JWT access tokens in URL paths or query strings are now rejected with HTTP 400 Bad Request, helping prevent accidental token exposure in logs and telemetry.

**HTTP 404 for mis-cased FHIR resource types**: Requests with incorrectly cased FHIR resource types, such as `/patient` instead of `/Patient`, now return HTTP 404 Not Found, aligning behavior more clearly with FHIR resource type casing expectations.

**Parallel bundle error handling improvement**: Parallel bundle error handling has been improved. Client-side errors now return HTTP 400 Bad Request, and dependent operations are marked as HTTP 424 Failed Dependency.

**Deduplication of duplicate query parameters**: Duplicate query parameters with identical key-value pairs are now deduplicated before query parsing, reducing unnecessary database load. 

## May 2026
### FHIR service

**Improved bundle error handling**: When a bundle request was throttled (HTTP 429) and the client canceled the request during the retry wait, the server could exhibit unexpected behavior. The server now properly handles cancellation during retry delays and returns HTTP 408 (Request Timeout) for affected bundle entries. The maximum Retry-After delay is also capped at 15 seconds.

**Improved error handling for incorrectly cased resource types**: Requests with incorrectly cased resource types (for example, `GET /patient/{id}` instead of `GET /Patient/{id}`) now return 404 Not Found instead of 405 Method Not Allowed.

**Security enhancements for export**: Added validation to reject path traversal sequences in $export endpoint parameters to prevent unauthorized access to blob storage paths.

**Case change for custom headers in diagnostic logs**: Custom headers in diagnostic logs will now appear in lowercase to align with modern HTTP standards. This does not impact API functionality, but customers using case-sensitive parsing in logging or monitoring pipelines may need to update their logic. We recommend ensuring header processing is case-insensitive.

**Improved error handling for unknown resource types**: Previously, an unknown or mis-cased resource type in a query would result in a 500 Internal Server Error. Error reporting is updated to return 404 Not Found.

## April 2026

### DICOM service

**DICOM Bulk Update Enhancements**: Enhancements to the Bulk Update capability in the DICOM service now enable more efficient updates to Study, Series, and SOP Instance UIDs—without requiring re‑upload of imaging data. Updates are processed asynchronously, with original instances preserved and all changes recorded for new UIDs. For more information, visit [Update files in the DICOM service in Azure Health Data Services | Microsoft Learn](dicom/update-files.md).

### FHIR service

**Improved processing for custom search parameters in bundles**: Enhanced validation has been added to identify and prevent conflicting custom search parameters within bundle requests. This improvement helps ensure more consistent and reliable search parameter processing when submitting bundle operations.

**Security enhancements for narrative sanitizer**: Enhanced security by detecting and handling dangerous href schemes (javascript:, data:, vbscript:, etc.) in FHIR narrative HTML. These types of links inside an href property will not pass validation and are rejected by the FHIR service.

#### Bug fixes:

**Fix for versioning errors**: There was an issue where impacted customers could face errors when accessing or updating certain resources (when different resource types shared the same resource ID), where the most recent version may not be returned as expected. The issue was fixed on 11 April 2026 by fixing the resource comparison logic from string-based ID comparison to proper ResourceKey comparison. This fix ensures that resources with the same ID but different resource types are treated as completely separate resources, preventing versioning confusion.

**Fix for capability statement intermittent failures**: Previously, users could experience intermittent failures as a side-effect of background in-process attempts to update the capability statements. This issue is fixed by ensuring that access to the resources of the capability statement are using thread-safe components to help prevent these errors.

**Batch oversized bulk operation audit logs**: Previously, some bulk delete audit logs could exceed the maximum body size, preventing their processing. This issue has been fixed by splitting the items into size-bounded batches.

**Fix for reindex orchestrator's handling of search parameter status promotion logic**: There was an issue that caused reindex job timeouts and blocked certain search parameter promotion from Supported to Enabled status. The issue has been fixed by improving the reindex orchestrator's handling of Search Parameter hash mismatches and status promotion logic.


## March 2026
### FHIR service
**Token search behavior update**: After 2 March 2026, the Azure FHIR service was updated so that token values longer than 128 characters are no longer truncated during indexing. If your workspace is affected, you may notice changes in the number of resources returned for token-based queries, along with improved overall query performance. The goal for this update is to improve search behavior accuracy and strengthen service reliability. An Azure service notification was sent to affected accounts with more details.

**Bulk Export cancellation behavior update**: Added updates to align the FHIR server to support [Bulk Data Access 2.0](https://hl7.org/fhir/uv/bulkdata/STU2/export.html#bulk-data-delete-request). This includes a change to bulk export cancellation behavior. Previously, cancellation request of an already completed, canceled, or failed export job returned "200 OK." The behavior is now updated to return more informative operation outcomes:
  - Cancelling an already-canceled export job returns "404 Job Not Found."
  - Cancelling a completed or failed export job returns "404 Job Not Found" if the job has already been canceled or failed; otherwise returns "202 Accepted."
  - Cancelling a queued or running export job returns "202 Accepted"; no behavior change.
  - Trying to get the status of a user-requested canceled job returns "404 Job Not Found."

#### Bug fixes:
**Added validation for search parameter URL length**: There was an issue where custom search parameter URLs that were longer than the 128-character limit were allowed into the FHIR server and truncated, resulting in faulty search parameter behavior. This issue has been fixed by adding a validation for search parameter URL length. If the URL length exceeds the limit, the validation will fail and return an error: "Search Parameter URL exceeds the maximum length limit of 128".

**Fix for token search with system values only**: A regression was introduced in the 12 March 2026 release where searches for token search parameters that only included a system value, and not a code, were returning incorrect results. The  issue was fixed on 14 March 2026.

**Fix for versioning configuration issue**:  On 10 March 2026, a release rolled out that fixed a bug that prevented the resource versioning policy default setting from being honored in the FHIR server. This fix revealed another bug involving a bad configuration setting value that resulted in some requests failing with 500 errors. The issue was fixed on 10 March 2026.


**Bug fix for `$bulk-delete` with `_remove-references`**: Previously, there was an issue when using `$bulk-delete` with `_remove-references` where the version number wasn't being displayed in the resources after they had their references removed. This issue is fixed.

**Versioning policy regression fix**: Versioning policy behavior wasn't consistently enforced following infrastructure changes introduced after 1 September 2025. Beginning with the 20 February 2026 FHIR service release, a regression in how the service enforces configured FHIR resource versioning policies has been corrected. This update restores behavior so that it aligns with the versioning configuration already set on your FHIR service. An Azure service notification was sent to affected accounts with more details.

## February 2026
### FHIR service
**Metadata-only updates and versioning configuration with `$bulk-update`**: Introduced new query parameter "_meta-history" for bulk update when versioning policy is set to either "versioned" or "version-update". The new query parameter is used to configure whether or not the old version is saved as a historical record. "_meta-history=true" is the default. By default, the resource version is incremented, a new version is created, and the old version is saved as a historical record. "_meta-history=false" can be configured so that the resource version is incremented, a new version is created, but the old version isn't saved as a historical record. For more information, visit [metadata-only updates and versioning](./fhir/fhir-versioning-policy-and-history-management.md#metadata-only-updates-and-versioning).  

#### Bug fixes:

**Bug fix for `$bulk-delete` queries with paged results exceeding 100 included items**: There was an issue where some `$bulk-delete` queries that return paged results exceeding 1,000 included items with related links could return an HTTP 500 Internal Server Error. The issue is fixed, and the results are returned correctly now.

**Bug fix for queries combining `_include` and `_revinclude`**: There was an issue where queries combining `_include` and `_revinclude` (for example, `GET /Patient?_include=Patient:organization&_revinclude=Observation:patient`) could return an HTTP 500 Internal Server Error. This issue is fixed, and results are returned correctly now.

**Pagination bug in FHIR search fix**: There was an issue where a pagination bug in FHIR search queries caused resources to be intermittently skipped when results span multiple pages and use continuation tokens. The issue is fixed.

**Allow `_meta-history` in transaction bundles**: Previously, there was a limitation where `_meta-history` parameter wasn't working in [transaction bundles](./fhir/rest-api-capabilities.md#batch-and-transaction-bundles). This issue has been fixed, and the `_meta-history` parameter can now be used in transaction bundles.

**Soft deletes in transaction bundles**: For a [transaction bundle](./fhir/rest-api-capabilities.md#batch-and-transaction-bundles), all supported interactions or operations either succeed or fail together. When a transaction bundle fails, the FHIR service returns a single OperationOutcome. Previously, there was an issue where soft delete operations were not being considered for the transaction bundle scope, which could cause a discrepancy in the all-or-nothing behavior of the transaction bundle if soft delete operations were part of the transaction bundle. The issue has been fixed. 

## January 2026
### FHIR service

**Metadata-only updates and versioning configuration with PATCH**: Introduced new query parameter "_meta-history" for PATCH updates when versioning policy is set to either "versioned" or "version-update." The new query is used to configure whether or not the old version is saved as a historical record. "_meta-history = true" is the default. By default, the resource version is incremented, a new version is created, and the old version is saved as a historical record. "_meta-history=false" can be configured so that the resource version is incremented, a new version is created, but the old version isn't saved as a historical record. For more information, visit [metadata-only updates and versioning](./fhir/fhir-versioning-policy-and-history-management.md#metadata-only-updates-and-versioning).

**Updates to responses for update and deletion of FHIR spec-defined search parameters**: There are a few updates to the behaviors and responses for update and deletion of FHIR spec-defined search parameters:
  - Deletion of out-of-box FHIR spec-defined search parameters previously returned a "204 No Content" and the parameter wasn't deleted. The response is updated to correctly return "405 Method Not Allowed."
  - Update of out-of-box FHIR spec-defined search parameters previously returned "201 Created," which can cause unintended behavior. The response is updated to return "405 Method Not Allowed." If you wish to update an out-of-box FHIR spec-defined search parameter, create a new custom search parameter with a different URL.

**Enhanced response logging for deletion of non-existent search parameters**:  Deletion of nonexistent search parameters previously returned a "204 No Content." The response is improved to be more informative and now returns "404 Not Found."

**Improved error handling for PATCH requests with an empty body**:  Previously, [PATCH](./fhir/rest-api-capabilities.md#patch-and-conditional-patch) requests sent to the FHIR with an empty body returned "HTTP 500 Internal Server Error." The error is improved to return "HTTP 400 Bad Request" with more informative messaging to inform users that Content-Type and body are required.

**Improved capability statement refresh after profile updates**: Improved latency for profile updates to reflect in the Capability Statement.

#### Bug fixes:

**Bug fix for duplicate IDs used in search**: There was a regression where searching for duplicate IDs with `_id` and no other search parameters would return an "HTTP 500 Internal Server Error". This issue has been fixed, and correct search results are now returned.

**Bug fix for `_sort` with multiple _include/_revinclude parameters**: Resolved issue where using multiple `_include`/`_revinclude` parameters in a search with `_sort` could lead to the includes continuation tokens to get into an infinite loop if there are more than two pages of results. This issue is fixed, and the includes continuation tokens are correct now. 

**Bug fix for profile version in capability statement**: The [capability statement](./fhir/store-profiles-in-fhir.md#profiles-in-the-capability-statement) lists details of the stored profiles on the FHIR server. There was a bug where the capability statement wasn't showing the profile version that is currently loaded into the FHIR server. The issue is fixed, and the capability statement now correctly states the profile version that is loaded on the FHIR server. 


## Related content

[Release notes 2025](release-notes-2025.md)

[Known issues](known-issues.md)

[!INCLUDE [FHIR and DICOM trademark statement](includes/healthcare-apis-fhir-dicom-trademark.md)]
