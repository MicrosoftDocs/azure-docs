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

***(REMOVE THIS ALTOGETHER?)***  
Some scheduled analytics rule templates produce alerts that are correlated by the Fusion engine with alerts from other systems to produce high-fidelity incidents. For more information, see [Advanced multistage attack detection](configure-fusion-rules.md#configure-scheduled-analytics-rules-for-fusion-detections).

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

