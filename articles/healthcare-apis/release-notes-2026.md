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

## January 2026
### FHIR service

**Updates to responses for update and deletion of FHIR spec-defined search parameters**: There are a few updates to the behaviors and responses for update and deletion of FHIR spec-defined search parameters:
  - Deletion of out-of-box FHIR spec-defined search parameters previously returned a "204 No Content" and the parameter was not deleted. The response is updated to correctly return "405 Method Not Allowed."
  - Update of out-of-box FHIR spec-defined search parameters previously returned "201 Created", which can cause unintended behavior. The response is updated to return "405 Method Not Allowed." If you wish to update an out-of-box FHIR spec-defined search parameter, please create a new custom search parameter with a different URL.

**Enhanced response logging for deletion of non-existent search parameters**:  Deletion of nonexistent search parameters previously returned a "204 No Content." The response is improved to be more informative and now returns "404 Not Found."

#### Bug fixes:

**Bug fix for profile version in capability statement**: The [capability statement](./fhir/store-profiles-in-fhir.md#profiles-in-the-capability-statement) lists details of the stored profiles on the FHIR server. There was a bug where the capability statement wasn't showing the profile version that is currently loaded into the FHIR server. The issue is fixed, and the capability statement now correctly states the profile version that is loaded on the FHIR server. 


## Related content

[Release notes 2025](release-notes-2025.md)

[Known issues](known-issues.md)

[!INCLUDE [FHIR and DICOM trademark statement](includes/healthcare-apis-fhir-dicom-trademark.md)]
