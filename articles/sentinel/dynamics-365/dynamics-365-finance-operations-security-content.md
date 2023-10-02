---
title: Microsoft Sentinel solution for Dynamics 365 Finance and Operations - security content reference
description: Learn about the built-in security content provided by the Microsoft Sentinel solution for Dynamics 365 Finance and Operations.
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.date: 05/14/2023
---

# Microsoft Sentinel solution for Dynamics 365 Finance and Operations: security content reference

This article details the security content available for the Microsoft Sentinel solution for Dynamics 365 Finance and Operations.

> [!IMPORTANT]
> - The Microsoft Sentinel solution for Dynamics 365 Finance and Operations is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - The solution is a premium offering. Pricing information will be available before the solution becomes generally available.

[Learn more about the solution](dynamics-365-finance-operations-solution-overview.md).

## Built-in analytics rules

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
|**F&O – Non-interactive account mapped to self or sensitive privileged user** |Identifies changes to Azure AD Client Apps registered for Finance & Operations, specifically when a new client is mapped to a predefined list of sensitive privileged user accounts, or when a user associates a client app with their own account. |Mapping modifications in Finance and Operations portal, under **Modules > System Administration > Azure Active Directory Applications**. <br><br>Data source: `FinanceOperationsActivity_CL` |Credential Access, Persistence, Privilege Escalation |
|**F&O – Mass update or deletion of user account records** |Identifies large delete or update operations on Finance and Operations user records based on predefined thresholds. <br><br>Default update threshold: **50**<br>Default delete threshold: **10** |Deletions or modifications in Finance and Operations portal, under **Modules > System Administration > Users**<br><br>Data source: `FinanceOperationsActivity_CL` |Impact |
|**F&O – Bank account change following network alias reassignment** |Identifies updates to bank account number by a user account which his alias was recently modified to a new value. |Changes in bank account number, in Finance and Operations portal, under **Workspaces > Bank management > All bank accounts** correlated with a relevant change in the user account to alias mapping.<br><br>Data source: `FinanceOperationsActivity_CL` |Credential Access, Lateral Movement, Privilege Escalation |
|**F&O – Reverted bank account number modifications** |Identifies changes to bank account numbers in Finance & Operations, whereby a bank account number is modified but then subsequently reverted a short time later. |Changes in bank account number, in Finance and Operations portal, under **Workspaces > Bank management > All bank accounts**.<br><br>Data source: `FinanceOperationsActivity_CL` |Impact |
|**F&O – Unusual sign-in activity using single factor authentication** |Identifies successful sign-in events to Finance & Operations and Lifecycle Services using single factor/password authentication. Sign-in events from tenants not using MFA, coming from an Azure AD trusted network location, or from geolocations seen previously in the last 14 days are excluded.<br><br>This detection uses logs ingested from Azure Active Directory. Therefore, you should enable the Azure Active Directory data connector. |Sign-ins to the monitored Finance and Operations environment.<br><br>Data source: `Singinlogs` |Credential Access, Initial Access |

## Next steps

In this article, you learned about the security content provided with the Microsoft Sentinel solution for Dynamics 365 Finance and Operations.

- [Deploy Microsoft Sentinel solution for Dynamics 365 Finance and Operations](deploy-dynamics-365-finance-operations-solution.md)
- [Microsoft Sentinel solution for Dynamics 365 Finance and Operations overview](dynamics-365-finance-operations-solution-overview.md)
