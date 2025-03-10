---
title: Security content reference for Dynamics 365 Finance and Operations
description: Learn about the built-in security content provided by the Microsoft Sentinel solution for Dynamics 365 Finance and Operations.
author: batamig
ms.author: bagol
ms.topic: reference
ms.date: 11/14/2024


#Customer intent: As a security analyst, I want to understand the security content available for Dynamics 365 Finance and Operations so that I can effectively monitor and respond to potential threats.

---

# Security content reference for Dynamics 365 Finance and Operations

This article details the security content available for the Microsoft Sentinel solution for Dynamics 365 Finance and Operations.

> [!IMPORTANT]
> - The Microsoft Sentinel solution for Dynamics 365 Finance and Operations is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - The solution is a premium offering. Pricing information will be available before the solution becomes generally available.

[Learn more about the solution](dynamics-365-finance-operations-solution-overview.md).

## Built-in analytics rules

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
|**F&O – Non-interactive account mapped to self or sensitive privileged user** |Identifies changes to Microsoft Entra Client Apps registered for Finance & Operations, specifically when: <br><br>- A new client is mapped to a predefined list of sensitive privileged user accounts, or <br><br>- When a user associates a client app with their own account. |Mapping modifications in Finance and Operations portal, under **Modules > System Administration > Microsoft Entra Applications**. <br><br>Data source: `FinanceOperationsActivity_CL` |Credential Access, Persistence, Privilege Escalation |
|**F&O – Mass update or deletion of user account records** |Identifies large delete or update operations on Finance and Operations user records based on predefined thresholds. <br><br>Default update threshold: **50**<br>Default delete threshold: **10** |Deletions or modifications in Finance and Operations portal, under **Modules > System Administration > Users**<br><br>Data source: `FinanceOperationsActivity_CL` |Impact |
|**F&O – Bank account change following network alias reassignment** |Identifies updates to bank account number by a user account which his alias was recently modified to a new value. |Changes in bank account number, in Finance and Operations portal, under **Workspaces > Bank management > All bank accounts** correlated with a relevant change in the user account to alias mapping.<br><br>Data source: `FinanceOperationsActivity_CL` |Credential Access, Lateral Movement, Privilege Escalation |
|**F&O – Reverted bank account number modifications** |Identifies changes to bank account numbers in Finance & Operations, whereby a bank account number is modified but then subsequently reverted a short time later. |Changes in bank account number, in Finance and Operations portal, under **Workspaces > Bank management > All bank accounts**.<br><br>Data source: `FinanceOperationsActivity_CL` |Impact |
|**F&O – Unusual sign-in activity using single factor authentication** |Identifies successful sign-in events to Finance & Operations and Lifecycle Services using single factor/password authentication. <br><Br>Sign-in events from tenants that aren't using MFA, coming from a Microsoft Entra ID trusted network location, or from geographic locations seen in the last 14 days are excluded.<br><br>This detection uses logs ingested from Microsoft Entra ID and you must enable the [Microsoft Entra data connector](../data-connectors/microsoft-entra-id.md). |Sign-ins to the monitored Finance and Operations environment.<br><br>Data source: `Signinlogs` |Credential Access, Initial Access |

## Related content

In this article, you learned about the security content provided with the Microsoft Sentinel solution for Dynamics 365 Finance and Operations.

- [Deploy Microsoft Sentinel solution for Dynamics 365 Finance and Operations](deploy-dynamics-365-finance-operations-solution.md)
- [Microsoft Sentinel solution for Dynamics 365 Finance and Operations overview](dynamics-365-finance-operations-solution-overview.md)
