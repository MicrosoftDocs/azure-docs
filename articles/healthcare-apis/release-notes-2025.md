---
title: Release notes for 2025 Azure Health Data Services monthly releases
description: 2025 - Stay updated with the latest features and improvements for the FHIR, DICOM, and MedTech services in Azure Health Data Services in 2025. Read the monthly release notes and learn how to get the most out of healthcare data.
services: healthcare-apis
author: KendalBond007
ms.service: azure-health-data-services
ms.subservice: workspace
ms.topic: reference
ms.date: 01/22/2025
ms.author: kesheth
ms.custom: references_regions
---

# Release notes 2025: Azure Health Data Services

This article describes features, enhancements, and bug fixes released in 2025 for the FHIR&reg; service, Azure API for FHIR, DICOM&reg; service, and MedTech service in Azure Health Data Services.

## March 2025
### FHIR Service
**Preview capability for the bulk delete operation**: Added support for _include and _revinclude to conditional and bulk delete requests. Users can now use _include and _revinclude as search criteria for conditional and bulk delete. This doesn't affect the current behavior of singular deletes, which doesn't support extra parameters. Learn more [here](./fhir/fhir-bulk-delete.md).

**Bundle Transactions Enhancement**: Improved bundle transactions for single-record bundles by applying new transaction logic, preventing HTTP 500 errors.

### Bug fixes

**ValueSet size increase**: The maximum ValueSet size was reduced to 500 codes, preventing large valuesets from loading. This has been fixed, and the limit is now increased to 20,000 codes.

**Search with _sort fix**: Resolved an issue in Search with the _sort parameter, where the bundle response included a next link leading to an empty page in some edge cases. Now, the next link will only appear if there are more resources to retrieve.

## February 2025

**Selectable Search Parameters**: Customers can tune search parameters using the [selectable search parameters](./fhir/selectable-search-parameters.md) capability. The capability provides a `$status` endpoint to validate the status of the search parameter. To avoid conflicts, the change now prevents updates to the search parameter status when a reindex job is in progress.
 
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
