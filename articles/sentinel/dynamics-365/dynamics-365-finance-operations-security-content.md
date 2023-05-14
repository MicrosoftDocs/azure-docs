---
title: Microsoft Sentinel solution for D365 F&O - security content reference
description: Learn about the built-in security content provided by the Microsoft Sentinel solution for D365 F&O.
author: limwainstein
ms.author: lwainstein
ms.topic: reference
ms.date: 05/14/2023
---

# Microsoft Sentinel solution for D365 F&O: security content reference

This article details the security content available for the Microsoft Sentinel solution for D365 F&O.

> [!IMPORTANT]
> The Microsoft Sentinel solution for D365 F&O is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

You can also add related [watchlists](../watchlists.md) to use in your search, detection rules, threat hunting, and response playbooks.

[Learn more about the solution](dynamics-365-finance-operations-solution-overview.md).

## Built-in analytics rules

| Rule name | Description | Source action | Tactics |
| --------- | --------- | --------- | --------- |
|**F&O - Network alias reassignment** |Identifies changes to user accounts where the network alias was modified to a new value. Changes to this field allow the new network alias to assume the same authentication context and privileges of the former. | | |
|**F&O - Successful sign-in without MFA** |Identifies successful sign-in events to Finance and operations and Lifecycle services using single factor or password authentication. | | |
|**F&O - Workload identity monitor** |Identifies changes to workload identities registered in Finance and operations, including user association reassignment. | | |
|**F&O - Mass update or deletion of user records** |Identifies large delete or update operations on Finance and operations user records based on predefined thresholds.<br><br>Default update threshold: **50**<br>Default delete threshold: **10** | | |
|**F&O - Bank account number changed** |Identifies changes to bank account numbers in Finance and operations. | | |

## Next steps

In this article, you learned about the security content provided with the Microsoft Sentinel solution for D365 F&O.

- [Deploy Microsoft Sentinel solution for D365 F&O](deploy-dynamics-365-finance-operations-solution.md)
- [Microsoft Sentinel solution for D365 F&O overview](dynamics-365-finance-operations-solution-overview.md)