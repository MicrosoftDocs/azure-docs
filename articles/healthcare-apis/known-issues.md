---
title: Azure Health Data Services known issues
description: This article provides details about the known issues of Azure Health Data Services.
services: healthcare-apis
author: mikaelweave
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 05/12/2022
ms.author: mikaelw
---

# Known issues: Azure Health Data Services 

This article describes the currently known issues with Azure Health Data Services that includes the different service types (FHIR service, DICOM service, MedTech service) that seamlessly work with one another. 

Use the lists and tables below to find details about resolution dates or possible workarounds. For more information about Azure Health Data Services, see [About Azure Health Data Services](healthcare-apis-overview.md) and [Release notes: Azure Health Data Services](release-notes.md).

### FHIR service
 
|Issue | Date discovered | Status | Date resolved |
| :------------------------------------- | :------------ | :------------- | :------------- |
|The SQL Provider will cause the `RawResource` column in the database to save incorrectly. This occurs in a few cases when a transient exception occurs that causes the provider to use its retry logic. |April 2022 |Doesn't have a workaround.  |Not resolved  |


## Next steps

For information about the features and bug fixes in Azure Health Data Services, see

>[!div class="nextstepaction"]
>[Release notes: Azure Health Data Services](release-notes.md)
