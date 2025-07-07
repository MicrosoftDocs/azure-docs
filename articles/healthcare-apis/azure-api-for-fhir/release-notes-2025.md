---
title: Azure API for FHIR monthly releases 2025
description: This article provides details about the Azure API for FHIR monthly features and enhancements in 2025.
services: healthcare-apis
author: KendalBond007
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: reference
ms.date: 5/30/2025
ms.custom:
  - references_regions
  - build-2025
ms.author: kesheth
---

# Release notes 2025: Azure API for FHIR

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

Azure API for FHIR&reg; provides a fully managed deployment of the Microsoft FHIR Server for Azure. The server is an implementation of the [FHIR](https://hl7.org/fhir) standard. This document provides details about the features and enhancements made to Azure API for FHIR.

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
