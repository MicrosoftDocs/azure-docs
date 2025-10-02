---
title: Log retention tiers in Microsoft Sentinel
description: Learn about the different log retention plans that are available in Microsoft Sentinel and how they're meant to be used to ensure maximum coverage at minimum expenditure.
author: guywi-ms
ms.author: guywild
ms.topic: conceptual
ms.date: 09/30/2025
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security
---
# Log retention tiers in Microsoft Sentinel

For Microsoft Sentinel workspaces connected to Defender, tiering and retention management must be done from the new table management experience in the Defender portal. For unattached Microsoft Sentinel workspaces, continue to use the experiences described below to manage data in your workspaces. 

There are two competing aspects of log collection and retention that are critical to a successful threat detection program. On the one hand, you want to maximize the number of log sources that you collect, so that you have the most comprehensive security coverage possible. On the other hand, you need to minimize the costs incurred by the ingestion of all that data.

These competing needs require a log management strategy that balances data accessibility, query performance, and storage costs.

This article discusses categories of data and the retention states used to store and access your data. It also describes the log tiers Microsoft Sentinel offers you to build a log management and retention strategy.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Categories of ingested data

Microsoft recommends classifying data ingested into Microsoft Sentinel into two general categories:

- **Primary security data** is data that contains critical security value. This data is used for real-time proactive monitoring, scheduled alerts, and analytics to detect security threats. The data needs to be readily available to all Microsoft Sentinel experiences in near real time.

- **Secondary security data** is supplemental data, often in high-volume, verbose logs. This data is of limited security value, but it can provide added richness and context to detections and investigations, helping to draw the full picture of a security incident. It doesn't need to be readily available, but should be accessible on-demand as needed and in appropriate doses.

### Primary security data

This category consists of logs that hold critical security value for your organization. Primary security data use cases for security operations include:

- **Frequent monitoring**. [Threat detection (analytics) rules](threat-detection.md) are run on this data at frequent intervals or in near real time.

- **On-demand hunting**. Complex queries are run on this data to execute interactive, high-performance hunting for security threats.

- **Correlation**. Data from these sources is correlated with data from other primary security data sources to detect threats and build attack stories.

- **Regular reporting**. Data from these sources is readily available for compiling into regular reports of the organization's security health, for both security and general decision makers.

- **Behavior analytics**. Data from these sources is used to build baseline behavior profiles for your users and devices, enabling you to identify outlying behaviors as suspicious.

Some examples of primary data sources include:
+ Logs from antivirus or enterprise detection and response (EDR) systems
+ Authentication logs
+ Audit trails from cloud platforms
+ Threat intelligence feeds
+ Alerts from external systems

Logs containing primary security data should be stored using the [**analytics tier**](#analytics-tier). 

### Secondary security data

This category encompasses logs whose individual security value is limited but are essential for providing a comprehensive view of a security incident or breach. Typically, these logs are high-volume and can be verbose. The security operations use cases for this data include the following:

- **Threat intelligence**. Primary data can be checked against lists of Indicators of Compromise (IoC) or Indicators of Attack (IoA) to quickly and easily detect threats.

- **Ad-hoc hunting/investigations**. Data can be queried interactively for 30 days, facilitating crucial analysis for threat hunting and investigations.

- **Large-scale searches**. Data can be ingested and searched in the background at petabyte scale, while being stored efficiently with minimal processing.

- **Summarization via KQL jobs**. Summarize high-volume logs into aggregate information and store the results in the analytics tier.

Some examples of secondary data log sources are cloud storage access logs, NetFlow logs, TLS/SSL certificate logs, firewall logs, proxy logs, and IoT logs. 

For logs containing secondary security data, use the  [Microsoft Sentinel data lake](datalake/sentinel-lake-overview.md), which is designed to offer enhanced scalability, flexibility, and integration capabilities for advanced security and compliance scenarios.


## Log management tiers

Microsoft Sentinel provides two different log storage tiers, or types, to accommodate these categories of ingested data.

- The [**analytics tier**](#analytics-tier) plan is designed to store primary security data and make it easily and constantly accessible at high performance.

- The [**data lake tier**](#data-lake-tier) is optimized for storing secondary security data cost-effectively over extended periods, while maintaining accessibility.

### Analytics tier

The **analytics tier** keeps data in the **interactive retention** state for **90 days** by default, extensible for up to two years. This interactive state, while expensive, allows you to query your data in unlimited fashion, with high performance, at no charge per query.

### Data lake tier

Microsoft Sentinel data lake is a fully managed, modern data lake that unifies and retains security data at scale, enabling advanced analytics across multiple modalities and AI agentic powered threat detection. It empowers security teams to investigate long-term threats, enrich alerts, and build behavioral baselines using months of data.

When total retention is configured to be longer than the analytics tier retention, or when the analytics tier retention period ends, data stored beyond the analytics tier retention continue to be accessible in the data lake tier. 



## Related content

- To understand more about Microsoft Sentinel data lake, see [Microsoft Sentinel data lake](datalake/sentinel-lake-overview.md).
- To onboard to Microsoft Sentinel data lake, see [Onboard data to Microsoft Sentinel data lake](datalake/sentinel-lake-onboarding.md).
