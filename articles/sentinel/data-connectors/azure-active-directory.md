---
title: "Azure Active Directory connector for Microsoft Sentinel"
description: "Learn how to install the connector Azure Active Directory to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Azure Active Directory connector for Microsoft Sentinel

Gain insights into Azure Active Directory by connecting Audit and Sign-in logs to Microsoft Sentinel to gather insights around Azure Active Directory scenarios. You can learn about app usage, conditional access policies, legacy auth relate details using our Sign-in logs. You can get information on your Self Service Password Reset (SSPR) usage, Azure Active Directory Management activities like user, group, role, app management using our Audit logs table. For more information, see the [Microsoft Sentinel documentation](https://go.microsoft.com/fwlink/?linkid=2219715&wt.mc_id=sentinel_dataconnectordocs_content_cnl_csasci).

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | SigninLogs<br/> AuditLogs<br/> AADNonInteractiveUserSignInLogs<br/> AADServicePrincipalSignInLogs<br/> AADManagedIdentitySignInLogs<br/> AADProvisioningLogs<br/> ADFSSignInLogs<br/> AADUserRiskEvents<br/> AADRiskyUsers<br/> NetworkAccessTraffic<br/> AADRiskyServicePrincipals<br/> AADServicePrincipalRiskEvents<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com/) |


## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-azureactivedirectory?tab=Overview) in the Azure Marketplace.
