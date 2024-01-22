---
title: Azure Health Data Services known issues
description: This article provides details about the known issues of Azure Health Data Services.
services: healthcare-apis
author: kgaddam10
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 06/07/2022
ms.author: mikaelw
---

# Known issues: Azure Health Data Services

This article describes the currently known issues with Azure Health Data Services and its different service types (FHIR service, DICOM service, and MedTech service) that seamlessly work with one another.

Refer to the table below to find details about resolution dates or possible workarounds. For more information about the different feature enhancements and bug fixes in Azure Health Data Services, see [Release notes: Azure Health Data Services](release-notes.md).

## FHIR service

|Issue | Date discovered | Workaround | Date resolved |
| :------------------------------------- | :------------ | :------------- | :------------- |
|FHIR Applications were down in EUS2 region|January 8, 2024 2 pm PST|--|January 8, 2024 4:15 pm PST|
|API queries to FHIR service returned Internal Server error in UK south region |August 10, 2023 9:53 am PST|--|August 10, 2023 10:43 am PST|
|FHIR resources are not queryable by custom search parameters even after reindex is successful.| July 2023| Suggested workaround is to create support ticket to update the status of custom search parameters after reindex is successful.|--|

## Next steps

In this article, you learned about the currently known issues with Azure Health Data Services. For more information about Azure Health Data Services, see

>[!div class="nextstepaction"]
>[About Azure Health Data Services](healthcare-apis-overview.md)

For information about the features and bug fixes in Azure API for FHIR, see

>[!div class="nextstepaction"]
>[Release notes: Azure API for FHIR](./azure-api-for-fhir/release-notes.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7. 
