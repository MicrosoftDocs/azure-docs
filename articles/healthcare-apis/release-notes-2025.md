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

## June 2025
### FHIR service
**Added a configuration option in $import**: Allows users to enable eventual consistency for the $import operation.

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
