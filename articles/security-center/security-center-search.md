---
title: Azure Security Center search | Microsoft Docs
description: Learn how Azure Security Center uses Log Analytics search to retrieve and analyze your security data.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 45b9756b-6449-49ec-950b-5ed1e7c56daa
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/11/2017
ms.author: terrylan

---
# Azure Security Center search
Azure Security Center uses [Log Analytics search](../log-analytics/log-analytics-log-searches.md) to retrieve and analyze your security data. Log Analytics includes a query language to quickly retrieve and consolidate data. From Security Center, you can leverage Log Analytics search to construct queries and analyze collected data.

Search is available in both the Free tier and Standard tier of Security Center.  The data available in your log searches is dependent on the tier level applied to your workspace.  See the Security Center [pricing page](../security-center/security-center-pricing.md) for more information.


> [!NOTE]
> Security Center does not save security data for a workspace under the Free tier. You can send a variety of logs to a workspace under the Free tier and search on that data but search results do not include data from Security Center. Security Center only saves data to a workspace under the Standard tier.
>
>

## Access search
1. Under the Security Center main menu, select **Search**.

  ![Select Log search][1]

2. Security Center lists all workspaces under your Azure subscriptions. Select a workspace. (If you have only one workspace, this workspace selector does not appear.)

  ![Select a workspace][2]

3. **Log Search** opens. To query for more data under the selected workspace, enter this example query:

  SecurityEvent | where EventID == 4625 | summarize count() by TargetAccount

  Result shows all accounts that failed to logon (event 4625).

  ![Search results][3]

See [Log Analytics query language](../log-analytics/log-analytics-search-reference.md) for more information on how to query for data under the selected workspace.

## Next steps
In this article you learned how to access search in Security Center. Security Center uses Log Analytics search. To learn more about Log Analytics search, see:

- [What is Log Analytics?](../log-analytics/log-analytics-overview.md) – Overview on Log Analytics
- [Understanding log searches in Log Analytics](../log-analytics/log-analytics-log-search-new.md) - Describes how log searches are used in Log Analytics and provides concepts that should be understood before creating a log search
- [Find data using log searches in Log Analytics](../log-analytics/log-analytics-log-searches.md) – Tutorial on using log search
- [Log Analytics search reference](../log-analytics/log-analytics-search-reference.md) – Describes the query language in Log Analytics

To learn more about Security Center, see:

- [Security Center Overview](security-center-intro.md) – Describes Security Center’s key capabilities

<!--Image references-->
[1]: ./media/security-center-search/search.png
[2]: ./media/security-center-search/workspace-selector.png
[3]: ./media/security-center-search/log-search.png
