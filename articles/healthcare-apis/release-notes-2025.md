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

## January 2025

### FHIR service

#### Enhancement: Improved error handling and validation

HTTP Method Validation for Transaction Bundle Requests:
Added validation to ensure the HTTP method in the Request component of the transaction bundle is a valid HTTPVerb enum value. If the HTTP method is invalid or null, a `RequestNotValidException` is thrown with a `400 Bad Request` status, providing a clearer error message to users.

CMK Error Handling: Improved error handling for operations dependent on customer-managed keys. Users will now see a more specific error message and a link to [Microsoft's troubleshooting guide](fhir/configure-customer-managed-keys.md) if issues occur related to CMK.

#### 100 items limit on include and revinclude searches

The FHIR® server has a limit of 100 items on `include` and `revinclude` searches. A recent update fixed an issue where this limit was not being applied in specific conditions. Customers will receive a warning and truncated results if the limit is exceeded. Details on limits can be found in the [Overview of FHIR search](./fhir/overview-of-search.md#search-result-parameters). To manage this, use the `_count` parameter to reduce the number of returned results. In the short term, we plan to increase the limit to 1000

### Bug Fixes

Billing in Sweden Central region: An issue was discovered where subscriptions in the Sweden Central region were not being billed correctly. We corrected the error, and billing has now been enabled in Sweden Central region. If you were affected by this error, you will not be responsible for any missed charged prior to your January bill.

## Related content

[Release notes 2021](release-notes-2021.md)

[Release notes 2022](release-notes-2022.md)

[Release notes 2023](release-notes-2023.md)

[Release notes 2024](release-notes-2024.md)

[Known issues](known-issues.md)

[!INCLUDE [FHIR and DICOM trademark statement](includes/healthcare-apis-fhir-dicom-trademark.md)]
