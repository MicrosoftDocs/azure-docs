---
title: Useful resources when working with Azure Sentinel| Microsoft Docs
description: This document provides you with a list of useful resources when working with Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: 9b4c8e38-c986-4223-aa24-a71b01cb15ae
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/02/2019
ms.author: yelevin

---
# Useful resources for working with Azure Sentinel



This article lists resources that can help you get more information about working with Azure Sentinel.

Azure Logic Apps connectors: <https://docs.microsoft.com/connectors/>


## Auditing and reporting
Audit logs of Azure Sentinel are maintained in [Azure Activity Logs](../azure-monitor/platform/platform-logs-overview.md).

The following supported operations can be audited.

|Operation name|	Resource type|
|----|----|
|Create or update workbook	|Microsoft.Insights/workbooks|
|Delete Workbook	|Microsoft.Insights/workbooks|
|Set Workflow	|Microsoft.Logic/workflows|
|Delete Workflow	|Microsoft.Logic/workflows|
|Create Saved Search	|Microsoft.OperationalInsights/workspaces/savedSearches|
|Delete Saved Search	|Microsoft.OperationalInsights/workspaces/savedSearches|
|Update Alert Rules	|Microsoft.SecurityInsights/alertRules|
|Delete Alert Rules	|Microsoft.SecurityInsights/alertRules|
|Update Alert Rule Response Actions	|Microsoft.SecurityInsights/alertRules/actions|
|Delete Alert Rule Response Actions	|Microsoft.SecurityInsights/alertRules/actions|
|Update Bookmarks	|Microsoft.SecurityInsights/bookmarks|
|Delete Bookmarks	|Microsoft.SecurityInsights/bookmarks|
|Update Cases	|Microsoft.SecurityInsights/Cases|
|Update Case Investigation	|Microsoft.SecurityInsights/Cases/investigations|
|Create Case Comments	|Microsoft.SecurityInsights/Cases/comments|
|Update Data Connectors	|Microsoft.SecurityInsights/dataConnectors|
|Delete Data Connectors	|Microsoft.SecurityInsights/dataConnectors|
|Update Settings	|Microsoft.SecurityInsights/settings|

### View audit and reporting data in Azure Sentinel

You can view this data by streaming it from the Azure Activity log into Azure Sentinel where you can then perform research and analytics on it.

1. Connect the [Azure Activity](connect-azure-activity.md) data source. After doing this, audit events are streamed into a new table in the **Logs** screen called AzureActivity.
2. Then, query the data using KQL, like you would any other table.



## Vendor documentation

| **Vendor**  | **Use incident in Azure Sentinel** | **Link**|
|----|----|----|
| GitHub| Used to access Community page| <https://github.com/Azure/Azure-Sentinel> |
| PaloAlto| Configure CEF| <https://www.paloaltonetworks.com/documentation/misc/cef.html>|
| PluralSight | Kusto Query Language course| [https://www.pluralsight.com/courses/kusto-query-language-kql-from-scratch](https://www.pluralsight.com/courses/kusto-query-language-kql-from-scratch)|

## Blogs and forums

Post your questions on the [TechCommunity space](https://techcommunity.microsoft.com/t5/Azure-Sentinel/bd-p/AzureSentinel) for Azure Sentinel.

View Azure Sentinel blog posts from the [TechCommunity](https://techcommunity.microsoft.com/t5/Azure-Sentinel/bg-p/AzureSentinelBlog) and [Microsoft Azure](https://azure.microsoft.com/blog/tag/azure-sentinel/).


## Next steps
In this document, you got a list of resources that are useful when you're working with Azure Sentinel. You'll find additional information about Azure security and compliance on the [Microsoft Azure Security and Compliance blog](https://blogs.msdn.com/b/azuresecurity/).
