---
title: Azure Health Data Services known issues
description: Learn about the known issues of Azure Health Data Services.
services: healthcare-apis
author: kgaddam10
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: reference
ms.date: 05/15/2025
ms.author: kavitagaddam
---

# Known issues: Azure Health Data Services

This article describes known issues with Azure Health Data Services, which includes the FHIR&reg;, DICOM&reg;, and MedTech services.

Refer to the table for details about resolution dates or possible workarounds. 

## FHIR service

|Issue | Date discovered | Workaround | Date resolved |
| :------------------------------------- | :------------ | :------------- | :------------- |
| Customers are seeing inconsistent behavior with custom search parameters after reindex | Sept 16, 2025 | We recently updated the infrastructure with a reindex operation, which causes the recently updated or created custom search parameters to be out of sync for a period ranging from minutes to potentially days. Please create a support ticket to get the parameters synchronized.|September 23, 2025 |
| Due to an issue with the Event Grid service, the FHIR instance was unable to publish events, which primarily affected its ability to send requests successfully.|May 28, 2025 2:52 PM PST|--|May 29, 2025 8:28 AM PST|
| Customers are unable to select storage account in the FHIR instance export configuration. The issue is caused by throttling due to a large number of resource groups and storage accounts, leading to errors like "Storage account doesn't exist" on the Export blade. | May 15, 2025 2:05 pm PST | PowerShell commands to configure the storage account for export manually:<br><br>Run this command to install the Az Module: <br>```Install-Module -Name Az```<br><br> If Az module is already installed:<br>```Update-Module -Name Az```<br><br> Connect to Azure Account:<br>```Connect-AzAccount```<br><br>Initialize the variable resourceGroupName, fhirServiceName, and storageAccountName:<br>```$resourceGroupName = "YOUR_RESOURCEGROUP_NAME"```<br>```$fhirServiceName = "YOUR_FHIRSERVICE_NAME"```<br>```$exportConfig = @{ "storageAccountName" = "YOUR_STORAGEACCOUNT_NAME" }```<br><br>Run this command to set the storage account for export:<br>```Set-AzResource -ResourceGroupName $resourceGroupName -ResourceType "Microsoft.HealthcareApis/services" -ResourceName $fhirServiceName -ApiVersion "2021-11-01" -Properties @{ "exportConfiguration" = $exportConfig }```<br><br>Running this command confirms  if the setting was successful: <br>```Get-AzResource -ResourceGroupName $resourceGroupName -ResourceType "Microsoft.HealthcareApis/services" -ResourceName $fhirServiceName \| Select-Object -ExpandProperty Properties \| Select-Object -ExpandProperty exportConfiguration```| -- |
| Patient-everything operation returns a 500 error when run using a SMART patient fhirUser token. |  April 9, 2025 | A fix is being released in the upcoming FHIR release. | |
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
