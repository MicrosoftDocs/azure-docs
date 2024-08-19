---
title: Log retention plans in Microsoft Sentinel
description: Learn about the different log retention plans that are available in Microsoft Sentinel and how they're meant to be used to ensure maximum coverage at minimum expenditure.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 07/15/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---
# Log retention plans in Microsoft Sentinel

There are two competing aspects of log collection and retention that are critical to a successful threat detection program. On the one hand, you want to maximize the number of log sources that you collect, so that you have the most comprehensive security coverage possible. On the other hand, you need to minimize the costs incurred by the ingestion of all that data.

These competing needs require a log management strategy that balances data accessibility, query performance, and storage costs.

This article discusses categories of data and the retention states used to store and access your data. It also describes the log plans Microsoft Sentinel offers you to build a log management and retention strategy.

> [!IMPORTANT]
>
> The **Auxiliary Logs** log type is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> [!INCLUDE [unified-soc-preview](includes/unified-soc-preview-without-alert.md)]

## Categories of ingested data

Microsoft recommends classifying data ingested into Microsoft Sentinel into two general categories:

- **Primary security data** is data that contains critical security value. This data is used for real-time proactive monitoring, scheduled alerts, and analytics to detect security threats. The data needs to be readily available to all Microsoft Sentinel experiences in near real time.

- **Secondary security data** is supplemental data, often in high-volume, verbose logs. This data is of limited security value, but it can provide added richness and context to detections and investigations, helping to draw the full picture of a security incident. It doesn't need to be readily available, but should be accessible on-demand as needed and in appropriate doses.

### Primary security data

This category consists of logs that hold critical security value for your organization. Primary security data can be described by the following use cases for security operations:

- **Frequent monitoring**. [Threat detection (analytics) rules](threat-detection.md) are run on this data at frequent intervals or in near real time.

- **On-demand hunting**. Complex queries are run on this data to execute interactive, high-performance hunting for security threats.

- **Correlation**. Data from these sources is correlated with data from other primary security data sources to detect threats and build attack stories.

- **Regular reporting**. Data from these sources is readily available for compiling into regular reports of the organization's security health, for both security and general decision makers.

- **Behavior analytics**. Data from these sources is used to build baseline behavior profiles for your users and devices, enabling you to identify outlying behaviors as suspicious.

Some examples of primary data sources include logs from antivirus or enterprise detection and response (EDR) systems, authentication logs, audit trails from cloud platforms, threat intelligence feeds, and alerts from external systems.

Logs containing primary security data should be stored using the [**Analytics logs**](#analytics-logs-plan) plan described later in this article. 

### Secondary security data

This category encompasses logs whose individual security value is limited but are essential for providing a comprehensive view of a security incident or breach. Typically, these logs are high-volume and can be verbose. The security operations use cases for this data include the following:

- **Threat intelligence**. Primary data can be checked against lists of Indicators of Compromise (IoC) or Indicators of Attack (IoA) to quickly and easily detect threats.

- **Ad-hoc hunting/investigations**. Data can be queried interactively for 30 days, facilitating crucial analysis for threat hunting and investigations.

- **Large-scale searches**. Data can be ingested and searched in the background at petabyte scale, while being stored efficiently with minimal processing.

- **Summarization via summary rules**. Summarize high-volume logs into aggregate information and store the results as primary security data. To learn more about summary rules, see [Aggregate Microsoft Sentinel data with summary rules](../azure-monitor/logs/summary-rules.md).

Some examples of secondary data log sources are cloud storage access logs, NetFlow logs, TLS/SSL certificate logs, firewall logs, proxy logs, and IoT logs. To learn more about how each of these sources brings value to security detections without being needed all the time, see [Log sources to use for Auxiliary Logs ingestion](basic-logs-use-cases.md).

Logs containing secondary security data should be stored using the [**Auxiliary logs**](#auxiliary-logs-plan) plan (now in Preview) described later in this article.

For a non-preview option, you can use [**Basic logs**](#basic-logs-plan) instead.

## Log management plans

Microsoft Sentinel provides two different log storage plans, or types, to accommodate these categories of ingested data.

- The [**Analytics logs**](#analytics-logs-plan) plan is designed to store primary security data and make it easily and constantly accessible at high performance.

- The [**Auxiliary logs**](#auxiliary-logs-plan) plan is designed to store secondary security data at very low cost for long periods of time, while still allowing for limited accessibility.

- A third plan, [**Basic logs**](#basic-logs-plan), is the predecessor of the auxiliary logs plan, and can be used as a substitute for it while the auxiliary logs plan remains in preview.

**Each of these plans preserves data in two different states:**

- The **interactive retention** state is the initial state into which the data is ingested. This state allows different levels of access to the data, depending on the plan, and costs for this state vary widely, depending on the plan.

- The **long-term retention** state preserves older data in its original tables for up to 12 years, at **extremely low cost**, regardless of the plan.

To learn more about retention states, see [Manage data retention in a Log Analytics workspace](../azure-monitor/logs/data-retention-configure.md).

The following diagram summarizes and compares these two log management plans.

:::image type="content" border="false" source="media/log-plans/analytics-auxiliary-log-plans.png" alt-text="Diagram of available log plans in Microsoft Sentinel.":::

### Analytics logs plan

The **Analytics logs** plan keeps data in the **interactive retention** state for **90 days** by default, extensible for up to two years. This interactive state, while expensive, allows you to query your data in unlimited fashion, with high performance, at no charge per query.

When the interactive retention period ends, data goes into the **long-term retention** state, while remaining in its original table. The long-term retention period is not defined by default, but you can define it to last up to 12 years. This retention state preserves your data at extremely low cost, for regulatory compliance or internal policy purposes. You can access the data in this state only by using a [**search job**](investigate-large-datasets.md) or [**restore**](restore.md) to pull out limited sets of data into a new table in interactive retention, where you can bring the full query capabilities to bear on it.

### Auxiliary logs plan

The **Auxiliary logs** plan keeps data in the **interactive retention** state for **30 days**. In the Auxiliary plan, this state has very low retention costs as compared to the Analytics plan. However, the query capabilities are limited: queries are charged per gigabyte of data scanned and are limited to a single table, and performance is significantly lower. While this data remains in the interactive retention state, you can run [summary rules](../azure-monitor/logs/summary-rules.md) on this data to create tables of aggregate, summary data in the Analytics logs plan, so that you have the full query capabilities on this aggregate data.

When the interactive retention period ends, data goes into the **long-term retention** state, remaining in its original table. Long-term retention in the auxiliary logs plan is similar to long-term retention in the analytics logs plan, except that the only option to access the data is with a [**search job**](investigate-large-datasets.md). [Restore](restore.md) is not supported for the auxiliary logs plan.

### Basic logs plan

A third plan, known as **Basic logs**, provides similar functionality to the auxiliary logs plan, but at a higher interactive retention cost (though not as high as the analytics logs plan). While the auxiliary logs plan remains in preview, basic logs can be an option for long-term, low-cost retention if your organization doesn't use preview features. To learn more about the basic logs plan, see [Table plans](../azure-monitor/logs/data-platform-logs.md#table-plans) in the Azure Monitor documentation.

## Related content

- For a more in-depth comparison of log data plans, and more general information about log types, see [Azure Monitor Logs overview | Table plans](../azure-monitor/logs/data-platform-logs.md#table-plans).

- To set up a table in the Auxiliary logs plan, see [Set up a table with the Auxiliary plan in your Log Analytics workspace (Preview)](../azure-monitor/logs/create-custom-table-auxiliary.md).

- To understand more about retention periods&mdash;which exist across plans&mdash;see [Manage data retention in a Log Analytics workspace](../azure-monitor/logs/data-retention-configure.md).
