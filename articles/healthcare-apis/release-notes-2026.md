---
title: Release notes for 2026 Azure Health Data Services monthly releases
description: 2026 - Stay updated with the latest features and improvements for the FHIR, DICOM, and MedTech services in Azure Health Data Services in 2026. Read the monthly release notes and learn how to get the most out of healthcare data.
services: healthcare-apis
author: evachen96
ms.service: azure-health-data-services
ms.subservice: workspace
ms.topic: reference
ms.date: 1/1/2026
ms.author: evach
ms.custom:
  - references_regions
  - build-2026
---

# Release notes 2026: Azure Health Data Services

Release notes describe features, enhancements, and bug fixes released in 2026 for the FHIR&reg; service and DICOM&reg; service in Azure Health Data Services.

## March 2026
### FHIR service
**Token search behavior update**: After 2 March 2026, the Azure FHIR service was updated so that token values longer than 128 characters are no longer truncated during indexing. If your workspace is affected, you may notice changes in the number of resources returned for token-based queries, along with improved overall query performance. The goal for this update is to improve search behavior accuracy and strengthen service reliability. An Azure service notification was sent to affected accounts with more details.

**Bulk Export cancellation behavior update**: Added updates to align the FHIR server to support [Bulk Data Access 2.0](https://hl7.org/fhir/uv/bulkdata/STU2/export.html#bulk-data-delete-request). This includes a change to bulk export cancellation behavior. Previously, cancellation request of an already completed, canceled, or failed export job returned "200 OK." The behavior is now updated to return more informative operation outcomes:
  - Cancelling an already-cancelled export job returns "404 Job Not Found."
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
