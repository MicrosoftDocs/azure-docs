---
title: Release notes for 2025 Azure Health Data Services monthly releases
description: 2025 - Stay updated with the latest features and improvements for the FHIR, DICOM, and MedTech services in Azure Health Data Services in 2025. Read the monthly release notes and learn how to get the most out of healthcare data.
services: healthcare-apis
author: KendalBond007
ms.service: azure-health-data-services
ms.subservice: workspace
ms.topic: reference
ms.date: 5/30/2025
ms.author: kesheth
ms.custom:
  - references_regions
  - build-2025
---

# Release notes 2025: Azure Health Data Services

This article describes features, enhancements, and bug fixes released in 2025 for the FHIR&reg; service, Azure API for FHIR, DICOM&reg; service, and MedTech service in Azure Health Data Services.

## December 2025
### FHIR service

**Enhancement to $expand operation**: Added support for "context" parameter for [$expand](./fhir/fhir-expand.md) operation for US Core 6 IG support.

**Enhancement to SMART v2**: Enabled support for _include and _revinclude searches when using [SMART v2](./fhir/smart-on-fhir.md) granular scopes.

#### Bug fixes:

**Bug fix for PUT request with new search parameters**: Resolved issue where PUT requests for new search parameters were failing due to validation. This issue has been resolved, and PUT requests for search parameters should now properly work as upserts, allowing new search parameters to be inserted using PUT if  the search parameter doesn't already exist in the system.

**Bug fix for PUT regression with metadata-only updates**: Resolved issue where metadata-only updates made via PATCH incremented the resource version without preserving the previous version. This issue was resolved on November 28, 2025.

## November 2025
### FHIR service

**Metadata-only updates and versioning configuration**: Introduced new query parameter "_meta-history" for PUT updates when versioning policy is set to either "versioned" or "version-update" to configure whether or not the old version is saved as a historical record. "_meta-history = true" is the default. By default, the resource version is incremented, a new version is created, and the old version is saved as a historical record. "_meta-history=false" can be configured so that the resource version is incremented, a new version is created, but the old version is not saved as a historical record. For more information, visit [metadata-only updates and versioning](./fhir/fhir-versioning-policy-and-history-management.md#metadata-only-updates-and-versioning).

**Composite search parameter collation fix**:  Corrected inconsistent collation handling for Token-String composite search parameters.

## October 2025
### FHIR service

#### Bulk Delete with references is in GA
We are excited to announce that Bulk Delete with references is GA. This feature enables customers to efficiently remove large sets of reference data in a single operation,  simplifying data retention workflows. For more information, visit [`$bulk-delete`](./fhir/fhir-bulk-delete.md).

#### Support for US Core 6 and USCDI v3 
The FHIR service now supports US Core Implementation Guide version 6.1.0 and USCDI v3 standards. For more information, visit [`US Core`](./fhir/us-core.md).

**Enhancement to _not-referenced search and delete**: Adds the ability to use not referenced search and delete to look for the lack of specific references. For example, to search for Patients without an Encounter listing them as a subject: /Patient?_not-referenced=Encounter:subject.

**Reindex job processing improvements**: Made improvements to reindex job processing, including improving background job reliability and flexibility by refining cache refresh timing and enhancing reindex job handling. This includes a change where Create, Update, Delete, and Patch changes to custom search parameters while a reindex job is running will no longer be allowed.

**Reindex improvements**: Updates to reindex, including more robust loading of soft-deleted search parameters, better logging, and performance improvements in filtering and status updates.

#### Bug fixes:

**URL construction for bundles with forwarded headers**: Fixed an issue with forwarded headers, like X-Forwarded-Host, where their values weren't respected when used with requests containing bundles. In some cases the paths could be erroneous while at other times they would be missing completely.

**SMART on FHIR compartment searches**: Previously, SMART compartment search expressions weren't properly comparing CompartmentId values and could return resources from different compartments. This issue has now been fixed.

**SMART on FHIR system level searches with historical records**:  Previously, if historical records were in the system and a SMART system level search on all resource types was conducted, the search could return an empty result set even if there exists resources in a compartment. This issue is fixed, and resources are correctly returned.

**Reindex fix**: Previously, after adding and reindexing a new search parameter, a warning would sometimes be returned "Search Parameter not recognized". This issue is fixed by improving background refresh and synchronization.

**Bulk delete remove references bug fix**: Previously, during bulk delete query with “_remove-references” parameter, resources with IDs that partially matched another reference ID were incorrectly removed. The issue is now fixed by changing the ID check from a “contains” match to an “exact” match, ensuring only the intended reference is removed.

**Conditional Create – Latency Improvement via Optimized Profile Loading**: Changed the way profiles are loaded by the validator to prevent long waits on locks when the cache isn’t expired. This update addresses intermittent delays reported by users during create operations, traced to validation. While the issue occurred only occasionally, this change aims to eliminate a potential source of latency.

**Reindex Orchestrator – Reliability and Performance Improvements**: Enhanced the reindex orchestrator for better reliability, accuracy, and performance. Updates include optimized surrogate ID range handling, improved job completion tracking, refined polling intervals to reduce database load, and fixes for query and parameter handling to ensure accurate progress reporting.

**SMART Wildcard _include and _revinclude Scope Enforcement**: Previously, SMART searches using wildcards for _include and _revinclude could return resource types that aren't part of the current scope of the SMART user. This issue has been addressed, and proper responses are returned for _include and _revinclude SMART wildcard searches now.

## September 2025
### FHIR service

#### Bulk Update capability is in GA
The $bulk-update operation allows you to update multiple FHIR resources in bulk using asynchronous processing. Follow this link to learn more [`$bulk-update`](./fhir/fhir-bulk-update.md).

#### Bug fixes:

**Bug fix for $status requests with empty parameters**: Previously, there were issues when using selectable search parameters SearchParameter/$status request with an unexpected request body returning misleading error messages. When the request body was omitted, 500 (Internal Server Error) was returned due to mishandling of the missing body. This issue is now fixed, and a 400 (Bad Request) will be returned. When the request body was an empty array of parameters, a 200 response was returned, which is misleading, as no search parameter status is actually updated. This issue is now fixed, and a 400 (Bad Request) response will be returned now, as the request requires search parameter URLs whose status need to be updated.

**Bug fix for uploading new search parameters that have no resources impacted**: Previously, search parameters that were added that have no current resources impacted (thus resulting in no need to reindex) were marked as not supported. Now, these search parameters that have no records to process will still be correctly enabled, so that they can be properly used as soon as relevant records are loaded.

**Bug fix for _revinclude wildcard search**: Previously, a wildcard search using _revinclude (for example,  GET [base]/Patient?_id=123&_revinclude=* ) would result in a 500 InternalServerError. After this fix, the service processes the request successfully with 200 code, aligning with the same behavior as _include.

**Bug fix for duplicate code value custom search parameters**: Previously, the FHIR server would block the creation of a new custom search parameter if it had the same resource type and code as a search parameter already existing on the FHIR server. This could be an issue when trying to upload certain search parameters for implementation guides (such as US Core). This issue has now been fixed, and new custom search parameters that have the same resource type and code as an existing search parameter can be successfully added to the server now, as long as it has a unique URL and expression that is a subset/superset of an existing search parameter on the server. 

## August 2025
### FHIR service

**Bulk Delete remove references feature**: The $bulk-delete operation now supports the option to remove references to resources that are being deleted. This means that if you delete a resource that is referenced by another resource, the reference is removed from the referencing resource. More information [here](/azure/healthcare-apis/fhir/fhir-bulk-delete#preview-capabilities-for-the-bulk-delete-operation). 

**Patient export improvement**: Improved performance of Patient/$export functionality by splitting patients into smaller groups and processing them in parallel.

#### Bug fixes:

**Bulk delete and custom search parameter fix**: Previously, there was a bug where after using $bulk-delete to hard delete a custom search parameter, it was not possible to then create the same custom search parameter with the same url or code. This issue has been fixed, and you can now create a custom search parameter after using $bulk-delete to hard delete a custom search parameter with the same url or code. 

**Custom search parameter creation and update issues**: Previously, there was a bug where duplicate custom search parameters could be created, and existing custom search parameters couldn't be updated. This fixes search parameter creation and update issues in some scenarios, with more fixes to follow soon.

**Headers for bundles for FHIR servers behind proxy**: Previously, X-Forwarded-Host and X-Forwarded-Prefix headers weren't being returned properly for requests within bundles when the FHIR server is behind a proxy. This issue has been fixed, and X-Forwarded-Host and X-Forwarded-Prefix will now be correctly used to return URLs for requests within bundles for FHIR servers behind a proxy.

**CHECK Constraint Conflict Error Status Code Fix**: For the issue identified with CHECK constraint conflict error, will be resolved with status code 400.

**Import Data Resource Versioning Conflict Fix**: When importing data with identical last updated times, multiple versions of the same resource can be created, leading to a key conflict during merging. This happens because a conflict wasn’t detected if allowNegativeVersions flag is enabled, allowing duplicate resources into the merge list.

**Enhanced error message for conditional references**: Previously, a conditional reference that returns multiple results would result in the error message "Given conditional reference doesn't resolve to a resource." This error message has been updated to be more descriptive, and is now changed to "Given conditional reference resolved to multiple resources."

**Returning correct count**: Not referenced search was counting soft deleted resources when using _summary=count and was not returning correct results when soft deleted resources are present in the database. The fix is implemented to filter correctly.

**Synchronization issue during search parameter update addressed**: Resolved an issue due to nodes not in synchronization causing sporadic failures when updating custom SearchParameter resources across multiple FHIR services and environments. PUT requests with unchanged JSON bodies were incorrectly returning HTTP 400 or 404 errors.

**Token search is case sensitive**: Fixed an issue with token search fields where only the first value was indexed if multiple values differed only by case. Now, all values—regardless of casing—are stored and searchable. Incase you were impacted by this issue, we suggest to run reindex on token search parameters.

**Handling of bulk job cancellation**: Cancellation requests for export, bulk update, or bulk delete jobs that are already completed no longer return HTTP 500.Instead, the server now returns HTTP 405 (Method Not Allowed) to correctly reflect the invalid operation.

**Reindex infrastructure**: Reindex infrastructure is updated to a new orchestrator that splits the reindex job into chunks and executes the task to complete in a parallel and distributed manner. As part of this change, certain reindex parameters, including maximumConcurrency and queryDelayIntervalInMilliseconds parameters are no longer supported as part of the reindex request. Unrecognized parameters will be ignored. Please see the updated list of reindex parameters [here](/azure/healthcare-apis/fhir/how-to-run-a-reindex).

**Fix multi parallel reference issue**: There was an issue identified where transaction bundles that have dynamic references to each other in the same bundle that did not use conditional operations could lead to references becoming invalidated. This issue has been fixed by changing how dynamically generated resource IDs are propagated—avoiding the use of the non-thread-safe ResourceIdProvider and instead passing IDs through inner requests—resolving issues where multiple generated identifiers could conflict or override each other during concurrent execution.

## July 2025
### FHIR service

#### Bug fixes:
**Conditional Create/Update Response Headers and Content Handling Fix**: Previously, there was a bug where conditional create or update may fail to return the content and appropriate headers (ETag, LastModified, and Location) when the condition provided matches that of a resource that already exists in the system. This issue has been fixed, and now, Content-Location, Etag, and LastModified headers are returned on conditional create and update requests. Additionally, added handling for the Prefer header to return content in the requested form (representation, minimal, and OperationOutcome). 

**$import Search Parameter Table Constraints Fix**: Previously, $import may surface 500 "InternalServerError" errors due to improperly defined constraints on Code and Code Overflow columns in Search Parameter tables. This issue has been fixed. 

## June 2025
### FHIR service
**Added configuration for eventual consistency option in $import**: Allows users to enable eventual consistency for the $import operation.

**Bulk delete enhancement**: Added a parameter to bulk delete that can receive a list of resources to exclude from the bulk delete operation.

#### Bug fixes:
**Support Added for Standalone Extensions on Primitive Type "code"**: Previously, extensions for primitive type "code" could not be uploaded individually, and would lead to a HTTP 400 Bad Request response. This bug has been fixed, and users can now upload extensions without their corresponding "origin" attributes.

**_summary Search Parameter Now Included in CapabilityStatement**: Previously, the CapabilityStatement was missing the _summary search parameter. We have fixed this and added the _summary search parameter to the CapabilityStatement.

**Intermittent HTTP 400 Errors Resolved for Custom Search Parameter Queries**: Previously, there were intermittent HTTP 400 error responses back when searching using custom search parameters that were created and reindexed successfully. This issue has been fixed. 

## May 2025
### FHIR service
**Enhanced error handling for $export**: Previously, 412 errors from Azure Storage weren't retried, and would be surfaced as 500 InternalServerError. The issue is fixed, and these requests are now retried. 

**Enhancement for _include and _revinclude searches**: Added a more descriptive message for truncated _include messages. For _include and _revinclude search queries, when the number of included items exceeds the limit on the page, the OperationOutcome in the bundle will now include the message "Included items are truncated. Use the related link in the response to retrieve all included items."

**Transaction handling improvement**: Fixed invisible transaction watchdog to limit number of transactions to process in a single batch to 10000 to avoid timeouts and improve transaction handling.

**Improved error handling for exports or imports that have missing Managed Identity**: Previously, exports or imports with missing Managed Identity would result in a 500 Unknown Server Error. We have added improved error handling for this case, and now, a more descriptive error message "Failed to get access token" will be shown. 

**Support multiple pages of include results in bulk delete**: Previously, bulk deletes with _include and _revinclude couldn't delete more than 100 included resources. We have made a fix to lift that limit by supporting multiple pages of include results, and bulk delete will be able to delete more than 100 included resources.

**Added ID in CapabilityStatement**: Previously, when retrieving the server's CapabilityStatement from the /metadata endpoint, the returned resource did not contain an ID. We have now added a dynamic ID to the CapabilityStatement 

**Added validation on resource ID for import**: Previously, the import process was not validating IDs, allowing unsupported characters, for example, "#", to cause errors. Now, we have added validation on resource ID for import, and have included the error message "Invalid resource ID".

#### Bug fixes:
**Creation after deletion of search parameters fix**: Previously, creating the same search parameter that was deleted in the past could fail due to an issue in updating the cache for Search Parameter definition manager. The issue is fixed, and now, the cache is synced before validating a search parameter in an incoming request.

**Patient-everything with SMART patient user fix**: An issue was discovered where the patient-everything operation with a SMART patient user was failing. The issue is fixed, and now, the patient-everything operation works as expected with a SMART patient user.

## April 2025
### FHIR service

**Enhanced error handling for READ operations with wrong cases on resource types**: Added validation on the resource type with wrong casing for READ operations (for example, GET /patient/ instead of GET /Patient/). In the past, a request with the wrong casing resource type was causing 500 status code (InternalServerError). After this change, a request with the wrong casing resource type will be rejected with 400 status code (ResourceNotSupported) as the resource type in any request should be validated in the case-sensitive manner.

**Stability improvements**: Introduced merge throttling to manage code execution waits, improving system stability under high concurrency conditions.


**Custom error container for $import**: Added ability for users to specify the name of the container where errors encountered during $import are logged. If not specified, the default container is used. More information [here](./fhir/import-data.md).


**Search for not referenced resources**: Added functionality to search for resources that aren't referenced by other resources. 

**Improved search error handling**: Previously, a search query with too many parameters returns a 500 error without any error message. Now, if a search query has too many parameters, the FHIR server will return a 400 error with the error message: "The incoming request has too many parameters. Reduce the number of parameters and resend the request."

**Search with _include and _revinclude enhancements**: Previously, searches with `_include` and `_revinclude` were limited to return a maximum of 100 items, truncating results over 100 items. That limit has been removed through the introduction of a "Related" link with the $includes operation, and a new search result parameter called `_includesCount` that allows customers to page through the `_include` and `_revinclude` items. The parameter `_includesCount` can be used to configure how many `_include` and _`revinclude` items are on each page. Its default value is 1000. Customers can use the "Related" link in the original search response, and the "Next" link in the response from the "Related" link to page through the `_include` and `_revinclude` items. More information [here](./fhir/overview-of-search.md). 


#### Bug fixes:
**Custom search parameters with same "code" value on different resource types fix**: An issue was discovered when running a delete or update search parameter operation. All other matched related search parameters on the same "code" value were being removed, regardless of resource type. This issue was fixed, and users are now able to update and delete custom search parameters without affecting other search parameters or resource types with the same "code" value.

**Fix for deleting and uploading custom search parameters**: An issue when deleting a custom search parameter and then using the PUT operation to reupload that same search parameter potentially causes a 424 Failed Dependency error. This issue is fixed. A check was added to ensure that if the previous version of the search parameter was already deleted, it's properly handled. Users are now able to delete a custom search parameter and then reupload that search parameter using PUT.

## March 2025
### FHIR service
**Selectable search parameters in GA**:
The selectable search parameter capability allows you to customize and optimize searches on FHIR resources. The capability lets you choose which inbuilt search parameters to enable or disable for the FHIR service. By enabling only the search parameters you need, you can store more FHIR resources and potentially improve performance of FHIR search queries.

Learn more:[Selectable search parameters for the FHIR service](fhir/selectable-search-parameters.md)

**Preview capability for the bulk delete operation**: Added support for _include and _revinclude to conditional and bulk delete requests. Users can now use _include and _revinclude as search criteria for conditional and bulk delete. This doesn't affect the current behavior of singular deletes, which doesn't support extra parameters. Learn more [here](./fhir/fhir-bulk-delete.md).

**Bundle Transactions Enhancement**: Improved bundle transactions for single-record bundles by applying new transaction logic, preventing HTTP 500 errors.

#### Bug fixes:

**ValueSet size increase**: The maximum ValueSet size was reduced to 500 codes, preventing large valuesets from loading. This has been fixed, and the limit is now increased to 20,000 codes.

**Search with _sort fix**: An issue in Search with the _sort parameter was resolved, where in some edge cases, the bundle response included a next link leading to an empty page. Now, the next link will only appear if there are more resources to retrieve.

## February 2025
### FHIR service
**Schema Upgrade Changes**: To improve customer experience during schema upgrades, the service now ensures that instances are initialized up to the minimum supported schema version. If a schema upgrade is in progress, the service continues to respond while initializing the instance in parallel.
 
**Incremental Import Enhancement**: Error handling has been added for `lastUpdated` input values marked in the future during ingestion using the import operation. The error handling includes a check to ensure that if the input `lastUpdated` is set to less than 10 seconds in the future, the input resources with dates in the future are rejected.

**Date Search Logic Update**: When searching for a date, the logic now ensures that any date range containing the searched date is included in the results. Previously, it only matched a date if the entire range was inside the searched date.

**Health Checks for Improved Resiliency**: Added health checks to enhance the resilience of the service such as retriable exceptions, enhanced diagnostic logging, and catching time out exceptions.

## January 2025

### FHIR service

#### Enhancement: Improved error handling and validation

**HTTP Method Validation for Transaction Bundle Requests**:
Added validation to ensure the HTTP method in the Request component of the transaction bundle is a valid HTTPVerb enum value. If the HTTP method is invalid or null, a `RequestNotValidException` is thrown with a `400 Bad Request` status, providing a clearer error message to users.

**CMK Error Handling**: Improved error handling for operations dependent on customer-managed keys. Users now see a more specific error message and a link to [Microsoft's troubleshooting guide](fhir/configure-customer-managed-keys.md) if issues occur related to CMK.

#### 100 items limit on include and revinclude searches

The FHIR® server has a limit of 100 items on `include` and `revinclude` searches. A recent update fixed an issue where this limit wasn't being applied in specific conditions. Customers will receive a warning and truncated results if the limit is exceeded. Details on limits can be found in the [Overview of FHIR search](./fhir/overview-of-search.md#search-result-parameters). To manage this, use the `_count` parameter to reduce the number of returned results. In the short term, we plan to increase the limit to 1000

### Bug Fixes

**Billing in Sweden Central region**: An issue was discovered where subscriptions in the Sweden Central region weren't being billed correctly. We corrected the error, and billing has now been enabled in Sweden Central region. If you were affected by this error, you won't be responsible for any missed charges prior to your January bill.

## Related content

[Release notes 2021](release-notes-2021.md)

[Release notes 2022](release-notes-2022.md)

[Release notes 2023](release-notes-2023.md)

[Release notes 2024](release-notes-2024.md)

[Known issues](known-issues.md)

[!INCLUDE [FHIR and DICOM trademark statement](includes/healthcare-apis-fhir-dicom-trademark.md)]
