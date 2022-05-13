---
title: Azure Health Data Services known issues
description: This article provides details about the known issues of Azure Health Data Services.
services: healthcare-apis
author: mikaelweave
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 05/13/2022
ms.author: mikaelw
---

# Known issues: Azure Health Data Services 

This article describes the currently known issues with Azure Health Data Services and its different service types (FHIR service, DICOM service, and MedTech service) that seamlessly work with one another. 

Refer to the table below to find details about resolution dates or possible workarounds. For more information about the different feature enhancements and bug fixes in Azure Health Data Services, see [Release notes: Azure Health Data Services](release-notes.md).

## FHIR service
 
|Issue | Date discovered | Status | Date resolved |
| :------------------------------------- | :------------ | :------------- | :------------- |
|The SQL Provider will cause the `RawResource` column in the database to save incorrectly. This issue occurs in a few cases when a transient exception occurs that causes the provider to use its retry logic. |April 2022 |Doesn't have a workaround.  |Not resolved  |


## Next steps

In this article, you learned about the currently known issues with Azure Health Data Services. For more information about Azure Health Data Services, see

>[!div class="nextstepaction"]
>[About Azure Health Data Services](healthcare-apis-overview.md)

For information about the features and bug fixes in Azure API for FHIR, see

>[!div class="nextstepaction"]
>[Release notes: Azure API for FHIR](./azure-api-for-fhir/release-notes.md)
