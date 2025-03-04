---
title: Azure Health Data Services known issues
description: Learn about the known issues of Azure Health Data Services.
services: healthcare-apis
author: kgaddam10
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: reference
ms.date: 03/13/2024
ms.author: kavitagaddam
---

# Known issues: Azure Health Data Services

This article describes known issues with Azure Health Data Services, which includes the FHIR&reg;, DICOM&reg;, and MedTech services.

Refer to the table for details about resolution dates or possible workarounds. 

## FHIR service

|Issue | Date discovered | Workaround | Date resolved |
| :------------------------------------- | :------------ | :------------- | :------------- |
|Customers can't access FHIR, DICOM, or Medtech through the portal. | October 31, 2024 1:00 pm PST | ARM calls are still operational, and there's no disruption to existing services. | November 1, 2024  |
|For FHIR instances created after August 19, 2024, diagnostic logs aren't available in log analytics workspace. |September 19, 2024 9:00 am PST| -- | October 17, 2024  |
|For FHIR instances created after August 19, 2024, in metrics blade - Total requests, Total latency, and Total errors metrics are not being populated. |September 19, 2024 9:00 am PST| -- | October 28, 2024 |
|For FHIR instances created after August 19, 2024, changes in private link configuration at the workspace level causes FHIR service to be stuck in 'Updating' state. |September 24, 2024 9:00 am PST| Accounts deployed prior to September 27, 2024 and facing this issue can follow the steps: <br> 1. Remove private endpoint from the Azure Health Data Services workspace having this issue. On Azure blade, go to Workspace and then click on Networking blade. In networking blade, select existing private link connection and click on 'Remove' <br> 2. Create new private connection to link to the workspace.| September 27, 2024 |
|Changes in private link configuration at the workspace level don't propagate to the child services.|September 4, 2024 9:00 am PST| To fix this issue a service reprovisioning is required. To reprovision the service, reach out to FHIR service team| September 17, 2024|
|Customers accessing the FHIR Service via a private endpoint are experiencing difficulties, specifically receiving a 403 error when making API calls from within the vNet. This problem affects FHIR instances provisioned after August 19 that utilize private link.|August 22, 2024 11:00 am PST|-- | September 3, 2024 |
|FHIR Applications were down in EUS2 region|January 8, 2024 2 pm PST|--|January 8, 2024|
|API queries to FHIR service returned Internal Server error in UK south region |August 10, 2023 9:53 am PST|--|August 10, 2023|


## Related content

[Release notes 2021](release-notes-2021.md)

[Release notes 2022](release-notes-2022.md)

[Release notes 2023](release-notes-2023.md)

[Release notes 2024](release-notes-2024.md)

[!INCLUDE [FHIR and DICOM trademark statement](includes/healthcare-apis-fhir-dicom-trademark.md)]
