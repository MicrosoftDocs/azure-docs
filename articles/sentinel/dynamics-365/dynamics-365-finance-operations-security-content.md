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
|**F&O - Network alias reassignment** |Identifies changes to user accounts where the network alias was modified to a new value. Changes to this field allow the new network alias to assume the same authentication context and privileges of the original network alias. |In the Finance and Operations portal, select any user under **Modules > System Administration > Users** and update the user's email address.<br><br>Data source: `FinanceOperationsActivity_CL` |Credential Access, Lateral Movement, Privilege Escalation |
|**F&O - Successful sign-in without MFA** |Identifies successful sign-in events to Finance and Operations and Lifecycle services using single factor or password authentication. |Log in to the monitored Finance and Operations environment as a non-MFA enabled Azure Active Directory user.<br><br>Data Source: `SigninLogs`<br><br>For this detection to use the logs ingested from Azure Active Directory, enable the Azure Active Directory data connector. |- Credential Access<br>- Initial Access |
|**F&O - Workload identity monitor** |Identifies changes to workload identities registered in Finance and Operations, including user association reassignment. |In the Finance and Operations portal, under **Modules > System Administration > Azure Active Directory Applications**, modify the user ID associated with one of the client IDs in the table.<br><br>Data source: `FinanceOperationsActivity_CL` |Credential Access, Persistence, Privilege Escalation |
|**F&O - Mass update or deletion of user records** |Identifies large delete or update operations on Finance and Operations user records based on predefined thresholds.<br><br>Default update threshold: **50**<br>Default delete threshold: **10** |In the Finance and Operations portal, under **Modules > System Administration > Users**, delete or update more than the defined threshold number of users.<br><br>Data source: `FinanceOperationsActivity_CL` |Impact |
|**F&O - Bank account number changed** |Identifies changes to bank account numbers in Finance and Operations. |In the Finance and Operations portal, under **Workspaces > Bank management > All bank accounts**, change one of the bank account's account number.<br><br>Data source: `FinanceOperationsActivity_CL` |Impact |

## Next steps

In this article, you learned about the security content provided with the Microsoft Sentinel solution for Dynamics 365 Finance and Operations.

- [Deploy Microsoft Sentinel solution for Dynamics 365 Finance and Operations](deploy-dynamics-365-finance-operations-solution.md)
- [Microsoft Sentinel solution for Dynamics 365 Finance and Operations overview](dynamics-365-finance-operations-solution-overview.md)