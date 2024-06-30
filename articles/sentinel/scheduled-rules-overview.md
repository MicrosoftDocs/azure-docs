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

By far the most common type of analytics rule, **Scheduled** rules are based on [Kusto queries](kusto-overview.md) that are configured to run at regular intervals and examine raw data from a defined "lookback" period. Queries can perform complex statistical operations on their target data, revealing baselines and outliers in groups of events. If the number of results captured by the query passes the threshold configured in the rule, the rule produces an alert.

This article helps you understand how scheduled analytics rules are built, and introduces you to all the configuration options and their meanings.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Scheduled query logic

The queries in [scheduled rule templates](create-analytics-rule-from-template.md) were written by security and data science experts, either from Microsoft or from the vendor of the solution providing the template.

The query logic is displayed in the rule configuration. You can use the query logic and the scheduling and lookback settings as defined in the template, or customize them to create new rules. You can also [create new queries from scratch](create-analytics-rules.md), though to do this effectively, you should have a thorough grounding in data science and Kusto query language.

## Use analytics rule templates

Use an analytics rule template by selecting a template name from the list of templates and creating a rule based on it.

Each template has a list of required data sources. When you open the template, the data sources are automatically checked for availability. Availability means that the data source is connected, and that data is being ingested regularly through it. If any of the required data sources are not available, you won’t be allowed to create the rule, and you might also see an error message to that effect.

When you create a rule from a template, the rule creation wizard opens based on the selected template. All the details are automatically filled in, and you can customize the logic and other rule settings to better suit your specific needs. You can repeat this process to create more rules based on the template. When you reach the end of the rule creation wizard, your customizations are validated, and the rule is created. The new rules appear in the **Active rules** tab on the **Analytics** page. Likewise, on the **Rule templates** tab, the template from which you created the rule is now displayed with the `In use` tag.

Analytics rule templates are constantly maintained by their authors, either to fix bugs or to refine the query. When a template receives an update, any rules based on that template are displayed with the `Update` tag, and you have the chance to modify those rules to include the changes made to the template. You can also revert any changes you made in a rule back to its original template-based version. For more information, see [Manage template versions for your scheduled analytics rules in Microsoft Sentinel](manage-analytics-rule-templates.md).

The rest of this article explains all the possibilities for customizing the configuration of your rules.

## Analytics rule configuration

This section describes the configuration options available in the analytics rule wizard, giving you the information required to understand how to configure a rule in a given situation.

### *General* tab



#### Analytics rule details



### *Set rule logic* tab

#### Rule query



#### Best practices for analytics rule queries

- It's recommended to use an [Advanced Security Information Model (ASIM) parser](normalization-about-parsers.md) as your query source, instead of using a native table. This will ensure that the query supports any current or future relevant data source or family of data sources, rather than relying on a single data source.

- The query length should be between 1 and 10,000 characters and cannot contain "`search *`" or "`union *`". You can use [user-defined functions](/azure/data-explorer/kusto/query/functions/user-defined-functions) to overcome the query length limitation.

- Using ADX functions to create Azure Data Explorer queries inside the Log Analytics query window **is not supported**.

- When using the **`bag_unpack`** function in a query, if you [project the columns](/azure/data-explorer/kusto/query/projectoperator) as fields using "`project field1`" and the column doesn't exist, the query will fail. To guard against this happening, you must [project the column](/azure/data-explorer/kusto/query/projectoperator) as follows:

   `project field1 = column_ifexists("field1","")`



> [!TIP]
> Rule scheduling options include configuring the rule to run every specified number of minutes, hours, or days, with the clock starting when you enable the rule. 
>
> We recommend being mindful of when you enable a new or edited analytics rule to ensure that the rules get the new stack of incidents in time. For example, you might want to run a rule in synch with when your SOC analysts begin their workday, and enable the rules then.

#### Alert enhancement

If you want your alerts to surface their findings so that they can be tracked and investigated appropriately, use the alert enhancement configuration to surface all the important information in the alerts.

This alert enhancement has the added benefit of presenting findings in an easily visible and accessible way.

There are three types of alert enhancements you can configure:

- Entity mapping
- Custom details
- Alert details (also known as dynamic content)

#### Entity mapping



### Custom details



### Alert details



## Event grouping



## Incident creation and alert grouping



## Automated response



## Next steps

