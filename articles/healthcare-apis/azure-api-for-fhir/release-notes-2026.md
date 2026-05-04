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

## April 2026
### FHIR service
**Security enhancements for narrative sanitizer**: Enhanced security by detecting and handling dangerous href schemes (javascript:, data:, vbscript:, etc.) in FHIR narrative HTML. The FHIR service rejects links with these schemes in an href property because they don't pass validation.

#### Bug fixes:
**Improved monitoring accuracy for Azure API for FHIR**: An issue was identified and resolved that affected Azure Monitor metrics under Microsoft.HealthcareAPIs: CosmosDbThrottleRate, CosmosDbRequests, TotalErrors, and TotalRequests. An unsupported aggregation configuration caused inconsistency in metric data. This issue was limited to observability scenarios and did not impact service availability, performance, or data processing. After the fix, customers may now observe improved accuracy and consistency in monitoring experiences without requiring any action.

**Fix for reindex orchestrator's handling of search parameter status promotion logic**: There was an issue that caused reindex job timeouts and blocked certain search parameter promotion from Supported to Enabled status. The fix improves the reindex orchestrator's handling of Search Parameter hash mismatches and status promotion logic.

## March 2026
### FHIR service
**Bulk Export cancellation behavior update**: Added updates to align the FHIR server to support [Bulk Data Access 2.0](https://hl7.org/fhir/uv/bulkdata/STU2/export.html#bulk-data-delete-request). This update includes a change to bulk export cancellation behavior. Previously, cancellation request of an already completed, cancelled, or failed export job returned "200 OK." The behavior is now updated to return more informative operation outcomes:
  - Cancelling an already-cancelled export job returns "404 Job Not Found."
  - Cancelling a completed or failed export job returns "404 Job Not Found" if the job is already cancelled or failed; otherwise returns "202 Accepted."
  - Cancelling a queued or running export job returns "202 Accepted"; no behavior change.
  - Trying to get the status of a user-requested cancelled job returns "404 Job Not Found."


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
