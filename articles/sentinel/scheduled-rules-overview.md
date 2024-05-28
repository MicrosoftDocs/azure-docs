---
title: Scheduled analytics rules in Microsoft Sentinel | Microsoft Docs
description: Understand how scheduled analytics rules work in Microsoft Sentinel. Learn about all the configuration options for this rule type.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 05/27/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---

# Scheduled analytics rules in Microsoft Sentinel

By far the most common type of analytics rule, **Scheduled** rules are based on [Kusto queries](kusto-overview.md) that are configured to run at regular intervals and examine raw data from a defined "lookback" period. If the number of results captured by the query passes the threshold configured in the rule, the rule produces an alert.

This article helps you understand how scheduled analytics rules are built, and introduces you to all the configuration options and their meanings.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Scheduled query logic

The queries in scheduled rule templates are written by security and data science experts, either from Microsoft or from the vendor of the solution providing the template. Queries can perform complex statistical operations on their target data, revealing baselines and outliers in groups of events.

The query logic is displayed in the rule configuration. You can use the query logic and the scheduling and lookback settings as defined in the template, or customize them to create new rules. You can also create new queries from scratch, though to do this effectively, you should have a thorough grounding in data science and Kusto query language.

### Best practices for analytics rule queries

- It's recommended to use an [Advanced Security Information Model (ASIM) parser](normalization-about-parsers.md) as your query source, instead of using a native table. This will ensure that the query supports any current or future relevant data source or family of data sources, rather than relying on a single data source.

- The query length should be between 1 and 10,000 characters and cannot contain "`search *`" or "`union *`". You can use [user-defined functions](/azure/data-explorer/kusto/query/functions/user-defined-functions) to overcome the query length limitation.

- Using ADX functions to create Azure Data Explorer queries inside the Log Analytics query window **is not supported**.

- When using the **`bag_unpack`** function in a query, if you [project the columns](/azure/data-explorer/kusto/query/projectoperator) as fields using "`project field1`" and the column doesn't exist, the query will fail. To guard against this happening, you must [project the column](/azure/data-explorer/kusto/query/projectoperator) as follows:

   `project field1 = column_ifexists("field1","")`



> [!TIP]
> Rule scheduling options include configuring the rule to run every specified number of minutes, hours, or days, with the clock starting when you enable the rule. 
>
> We recommend being mindful of when you enable a new or edited analytics rule to ensure that the rules get the new stack of incidents in time. For example, you might want to run a rule in synch with when your SOC analysts begin their workday, and enable the rules then.

## Alert enhancement

If you want your alerts to surface their findings so that they can be tracked and investigated appropriately, use the alert enhancement configuration to surface all the important information in the alerts.

This alert enhancement has the added benefit of presenting findings in an easily visible and accessible way.

There are three types of alert enhancements you can configure:

- Entity mapping
- Custom details
- Alert details (also known as dynamic content)

### Entity mapping



### Custom details



### Alert details



## Event grouping



## Incident creation and alert grouping



## Automated response



## Next steps

