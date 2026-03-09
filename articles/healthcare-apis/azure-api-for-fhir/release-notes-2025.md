---
title: Azure API for FHIR monthly releases 2025
description: This article provides details about the Azure API for FHIR monthly features and enhancements in 2025.
services: healthcare-apis
author: KendalBond007
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: reference
ms.date: 10/31/2025
ms.custom:
  - references_regions
  - build-2025
ms.author: kesheth
---

# Release notes 2025: Azure API for FHIR

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

Azure API for FHIR&reg; provides a fully managed deployment of the Microsoft FHIR Server for Azure. The server is an implementation of the [FHIR](https://hl7.org/fhir) standard. This document provides details about the features and enhancements made to Azure API for FHIR.

## December 2025
### FHIR service

**Enhancement to $expand operation**: Added support for "context" parameter for [$expand](../fhir/fhir-expand.md) operation for US Core 6 IG support.

## October 2025
### FHIR service

#### Bug fixes:

**Reindex fix**: Previously, after adding and reindexing a new search parameter, a warning would sometimes be returned "Search Parameter not recognized". This issue got fixed by improving background refresh and synchronization.

**Conditional Create – Latency Improvement via Optimized Profile Loading**: Changed the way profiles are loaded by the validator to prevent long waits on locks when the cache isn’t expired. This update addresses intermittent delays reported by users during create operations, traced to validation. While the issue occurred only occasionally, this change aims to eliminate a potential source of latency.

**Reindex Orchestrator – Reliability and Performance Improvements**: Enhanced the reindex orchestrator for better reliability, accuracy, and performance. Updates include optimized surrogate ID range handling, improved job completion tracking, refined polling intervals to reduce database load, and fixes for query and parameter handling to ensure accurate progress reporting.

## September 2025
### FHIR service

#### Bug fixes:

**Bug fix for $status requests with empty parameters**: Previously, there were issues when using selectable search parameters SearchParameter/$status request with an unexpected request body returning misleading error messages. When the request body was omitted, 500 (Internal Server Error) was returned due to mishandling of the missing body. This issue is now fixed, and a 400 (Bad Request) will be returned. When the request body was an empty array of parameters, a 200 response was returned, which is misleading, as no search parameter status is actually updated. This issue is now fixed, and a 400 (Bad Request) response will be returned now, as the request requires search parameter URLs whose status need to be updated.

**Bug fix for uploading new search parameters that have no resources impacted**: Previously, search parameters that were added that have no current resources impacted (thus resulting in no need to reindex) were marked as not supported. Now, these search parameters that have no records to process will still be correctly enabled, so that they can be properly used as soon as relevant records are loaded.

**Bug fix for _revinclude wildcard search**: Previously, a wildcard search using _revinclude (for example,  GET [base]/Patient?_id=123&_revinclude=* ) would result in a 500 InternalServerError. After this fix, the service processes the request successfully with 200 code, aligning with the same behavior as _include.

**Bug fix for duplicate code value custom search parameters**: Previously, the FHIR server would block the creation of a new custom search parameter if it had the same resource type and code as a search parameter already existing on the FHIR server. This could be an issue when trying to upload certain search parameters for implementation guides (such as US Core). This issue has now been fixed, and new custom search parameters that have the same resource type and code as an existing search parameter can be successfully added to the server now, as long as it has a unique URL and expression that is a subset/superset of an existing search parameter on the server. 

## August 2025
### FHIR service

**Bulk Delete remove references feature**: The $bulk-delete operation now supports the option to remove references to resources that are being deleted. This means that if you delete a resource that is referenced by another resource, the reference is removed from the referencing resource. More information [here](/azure/healthcare-apis/fhir/fhir-bulk-delete#preview-capabilities-for-the-bulk-delete-operation). 

**Patient export improvement**: Improved performance of Patient/$export functionality by splitting patients into smaller groups and processing them in parallel.

**Provisioning new account with invalid CMK improved error handling**: Previously, provisioning an API for FHIR account with invalid CMK (Customer Managed Key) would return an Unhealthy Status. This has been corrected to return Degraded status.

#### Bug fixes:

**Bulk delete and custom search parameter fix**: Previously, there was a bug where after using $bulk-delete to hard delete a custom search parameter, it was not possible to then create the same custom search parameter with the same url or code. This issue has been fixed, and you can now create a custom search parameter after using $bulk-delete to hard delete a custom search parameter with the same url or code.

**Enhanced error message for conditional references**: Previously, a conditional reference that returns multiple results would result in the error message "Given conditional reference doesn't resolve to a resource." This error message has been updated to be more descriptive, and is now changed to "Given conditional reference resolved to multiple resources."

**Returning correct count**: Not referenced search was counting soft deleted resources when using _summary=count and was not returning correct results when soft deleted resources are present in the database. The fix is implemented to filter correctly.

**Synchronization issue during search parameter update addressed**: Resolved an issue due to nodes not in synchronization causing sporadic failures when updating custom SearchParameter resources across multiple FHIR services and environments. PUT requests with unchanged JSON bodies were incorrectly returning HTTP 400 or 404 errors.

**Token search is case sensitive**: Fixed an issue with token search fields where only the first value was indexed if multiple values differed only by case. Now, all values—regardless of casing—are stored and searchable. Incase you were impacted by this issue, we suggest to run reindex on token search parameters.

**Handling of bulk job cancellation**: Cancellation requests for export, bulk update, or bulk delete jobs that are already completed no longer return HTTP 500.Instead, the server now returns HTTP 405 (Method Not Allowed) to correctly reflect the invalid operation.

**Reindex infrastructure**: Reindex infrastructure is updated to a new orchestrator that splits the reindex job into chunks and executes the task to complete in a parallel and distributed manner.

## July 2025

#### Bug fixes:
**Conditional Create/Update Response Headers and Content Handling Fix**: Previously, there was a bug where conditional create or update may fail to return the content and appropriate headers (ETag, LastModified, and Location) when the condition provided matches that of a resource that already exists in the system. This issue has been fixed, and now, Content-Location, Etag, and LastModified headers will be returned on conditional create and update requests. Additionally, added handling for the Prefer header to return content in the requested form (representation, minimal, and OperationOutcome). 

## June 2025
**Enhanced error logging for $export**: Previously, $export would return a 500 Internal Server Error if there was no associated storage account for the export. Now, the error message has been improved to state to the user "The storage account not found."

#### Bug fixes:
**Support Added for Standalone Extensions on Primitive Type "code"**: Previously, extensions for primitive type "code" could not be uploaded individually, and would lead to a HTTP 400 Bad Request response. This bug has been fixed, and users can now upload extensions without their corresponding "origin" attributes.

**_summary Search Parameter Now Included in CapabilityStatement**: Previously, the CapabilityStatement was missing the _summary search parameter. We have fixed this and added the _summary search parameter to the CapabilityStatement.

## May 2025
**Enhanced error handling for $export**: Previously, 409 and 412 errors from Cosmos DB weren't retried, and would be surfaced as 500 InternalServerError. The issue is fixed, and these requests are now retried. 

**Improved error handling for exports or imports that have missing Managed Identity**: Previously, export or import jobs with a missing Managed Identity would result in an unknown server error (HTTP status code 500). We have improved error handling for this case, expect message—'Failed to get access token'—to be shown. 

**Support multiple pages of include results in bulk delete**: Previously, bulk deletes with _include and _revinclude couldn't delete more than 100 included resources. We have made a fix to lift that limit by supporting multiple pages of include results, and bulk delete will be able to delete more than 100 included resources.

#### Bug fixes:
**Creation after deletion of search parameters fix**: Previously, creating the same search parameter that was deleted in the past could fail due to an issue in updating the cache for Search Parameter definition manager. The issue is fixed, and now, the cache is synced before validating a search parameter in an incoming request.

**Export duplicates fix**: Previously, there was a bug where exports with _isParallel = on and _maxCount set to 1000 or lower could result in duplication of exported resources. This issue has been fixed. 

## April 2025
**Enhanced error handling for READ operations with wrong cases on resource types**: Added validation on the resource type with wrong casing for READ operations (for example, GET /patient/ instead of GET /Patient/). In the past, a request with the wrong casing resource type was causing 500 status code (InternalServerError). After this change, a request with the wrong casing resource type will be rejected with 400 status code (ResourceNotSupported) as the resource type in any request should be validated in the case-sensitive manner.

#### Bug fixes:
**Custom search parameters with same "code" value on different resource types fix**: An issue was discovered when running a delete or update search parameter operation. All other matched related search parameters on the same "code" value were being removed, regardless of resource type. This issue was fixed, and users are now able to update and delete custom search parameters without affecting other search parameters or resource types with the same "code" value.

**Fix for deleting and uploading custom search parameters**: An issue when deleting a custom search parameter and then using the PUT operation to reupload that same search parameter potentially causes a 424 Failed Dependency error. This issue is fixed. A check was added to ensure that if the previous version of the search parameter was already deleted, it's properly handled. Users are now able to delete a custom search parameter and then reupload that search parameter using PUT.

## March 2025

**Improved Error Handling for $export**: Added retry logic for certain export queries that previously wouldn't be retried.

**Billing for API for FHIR**: An issue was discovered that may have caused subscriptions to be underbilled in several regions, including North Europe, East US 2, Australia East, West Europe, Central India, Southeast Asia, and UK South. We corrected the billing error on March 1, 2025. If you were affected by this error, you won't be responsible for any missed charges prior to your March bill.

**Preview capability for the bulk delete operation**: Added support for _include and _revinclude to conditional and bulk delete requests. Users can now use _include and _revinclude in the search criteria for conditional and bulk delete. Please note that this doesn't affect current behavior of singular deletes, which doesn't support extra parameters. Learn more [here](./bulk-delete-operation.md).

**ValueSet size bug fix**: The maximum ValueSet size was reduced to 500 codes, preventing large valuesets from loading. This has been fixed, and the limit is now increased to 20,000 codes.


## February 2025

**Date Search Logic Update**: When searching for a date, the logic now ensures that any date range containing the searched date is included in the results. Previously, it only matched a date if the entire range was inside the searched date.

**Health Checks for Improved Resiliency**: Added health checks to enhance the resilience of the service such as retriable exceptions, enhanced diagnostic logging, and catching time out exceptions.

## January 2025

### Enhancement: Improved error handling and validation

**HTTP Method Validation for Transaction Bundle Requests**: Added validation to ensure the HTTP method in the Request component of the transaction bundle is a valid HTTPVerb enum value. If the HTTP method is invalid or null, a `RequestNotValidException` is thrown with a `400 Bad Request` status, providing a clearer error message to users.

**Partition Size Error Handling**: When a partition exceeds 20GB, a `PreconditionFailedException` is raised, replacing the previous HTTP 500 errors with HTTP 400 errors. This indicates to customers that the failure is due to an issue on their end (partition size).

**Transaction Failure Exception**: A new FHIR-specific exception type has been introduced to handle Cosmos DB transaction failures, replacing the generic `InvalidOperationExceptions`.

**CMK Error Handling**: Improved error handling for operations dependent on customer-managed keys. Users now see a more specific error message and a link to [Microsoft's troubleshooting guide](../fhir/configure-customer-managed-keys.md) if issues occur related to CMK.

## Related content

[Release notes pre-2025](release-notes.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
