---
title: "Microsoft 365 Defender connector for Microsoft Sentinel"
description: "Learn how to install the connector Microsoft 365 Defender to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Microsoft 365 Defender connector for Microsoft Sentinel

Microsoft 365 Defender​ is a unified, natively integrated, pre- and post-breach enterprise defense suite that protects endpoint, identity, email, and applications and helps you detect, prevent, investigate, and automatically respond to sophisticated threats.

Microsoft 365 Defender suite includes: 
- Microsoft Defender for Endpoint
- Microsoft Defender for Identity
- Microsoft Defender for Office 365
- Threat & Vulnerability Management
- Microsoft Defender for Cloud Apps

For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/p/?linkid=2220004&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | SecurityIncident<br/> SecurityAlert<br/> DeviceEvents<br/> DeviceFileEvents<br/> DeviceImageLoadEvents<br/> DeviceInfo<br/> DeviceLogonEvents<br/> DeviceNetworkEvents<br/> DeviceNetworkInfo<br/> DeviceProcessEvents<br/> DeviceRegistryEvents<br/> DeviceFileCertificateInfo<br/> EmailEvents<br/> EmailUrlInfo<br/> EmailAttachmentInfo<br/> EmailPostDeliveryEvents<br/> IdentityLogonEvents<br/> IdentityQueryEvents<br/> IdentityDirectoryEvents<br/> CloudAppEvents<br/> AlertEvidence<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |


## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-microsoft365defender?tab=Overview) in the Azure Marketplace.
