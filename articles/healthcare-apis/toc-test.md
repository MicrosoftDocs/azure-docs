---
title: Azure Health Data Services TOC test
description: Test an article not in TOC for Azure Health Data Services.
services: healthcare-apis
author: kgaddam10
ms.service: healthcare-apis
ms.subservice: workspace
ms.topic: reference
ms.date: 02/15/2024
ms.author: kavitagaddam
---

# Known issues: Azure Health Data Services

This article describes the currently known issues with Azure Health Data Services and its different service types (FHIR&reg; service, DICOM&reg; service, and MedTech service) that seamlessly work with one another.

Refer to the table to find details about resolution dates or possible workarounds. For more information about the  feature enhancements and bug fixes in Azure Health Data Services, see the [Release notes](release-notes-2024.md).

## FHIR service

|Issue | Date discovered | Workaround | Date resolved |
| :------------------------------------- | :------------ | :------------- | :------------- |
|FHIR Applications were down in EUS2 region|January 8, 2024 2 pm PST|--|January 8, 2024 4:15 pm PST|
|API queries to FHIR service returned Internal Server error in UK south region |August 10, 2023 9:53 am PST|--|August 10, 2023 10:43 am PST|
|FHIR resources are not queryable by custom search parameters even after reindex is successful.| July 2023| Suggested workaround is to create support ticket to update the status of custom search parameters after reindex is successful.|--|

## Related content

[Release notes 2021](release-notes-2021.md)

[Release notes 2022](release-notes-2022.md)

[Release notes 2023](release-notes-2023.md)

[Release notes 2024](release-notes-2024.md)

[!INCLUDE [FHIR and DICOM trademark statement](includes/healthcare-apis-fhir-dicom-trademark.md)]
