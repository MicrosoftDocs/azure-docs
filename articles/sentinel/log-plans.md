---
title: Log retention plans in Microsoft Sentinel
description: Learn about the different log retention plans that are available in Microsoft Sentinel and how they are meant to be used to ensure maximum coverage at minimum expenditure.
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

This article discusses categories of data storage and accessibility, and describes the tools Microsoft Sentinel gives you to build a log management and retention strategy.

> [!IMPORTANT]
>
> The **Auxiliary Logs** log type is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> <!--[!INCLUDE [unified-soc-preview](includes/unified-soc-preview-without-alert.md)] -->

## Categories of ingested data

Microsoft recommends classifying data ingested into Microsoft Sentinel into two general categories:

- **Primary security data** is data that contains critical security value. This data is used for real-time monitoring, alerts, and analytics. It needs to be readily available to all Microsoft Sentinel experiences in near real time.

- **Secondary security data** is supplemental data, often in high-volume, verbose logs. This data is of limited security value, but it can provide added richness and context to detections and investigations, helping to draw the full picture of a security incident. It doesn't need to be readily available, but should be accessible as needed and in appropriate doses.

### Primary security data

This category consists of logs that hold critical security value for your organization. Primary security data can be described by the following use cases for security operations:

- **Frequent monitoring**. [Threat detection (analytics) rules](threat-detection.md) are run on this data at frequent intervals or in near real time.

- **On-demand hunting**. Complex queries are run on this data to execute interactive, high-performance hunting for security threats.

- **Correlation**. Data from these sources is correlated with data from other primary security data sources to detect threats and build attack stories

- **Regular reporting**. Data from these sources is readily available for compiling into regular reports of the organization's security health, for both security and general decision makers.

- **Behavior analytics**. Data from these sources is used to build baseline behavior profiles for your users and devices, enabling you to identify outlying behaviors as suspicious.

Some examples of primary data sources include logs from antivirus or enterprise detection and response (EDR) systems, authentication logs, audit trails from cloud platforms, threat intelligence feeds, and alerts from external systems.

Logs containing primary security data should be stored using the **Analytics logs** plan. This plan keeps data in an **interactive retention** state for 90 days by default, extensible for up to two years. In this state, your data can be queried in unlimited fashion and with high performance.

When the interactive retention period ends, data goes into a **long-term retention** state, remaining in its original table. Long-term retention is not defined by default, but you can define it to last up to 12 years. This state preserves your data for regulatory compliance or internal policy purposes. Data in this state can be queried in limited fashion and with much slower performance, but you can use a **search job** or **restore** to pull out limited sets of data into interactive retention, where you can bring the full query capabilities to bear on it.

### Secondary security data

This category encompasses logs that have limited individual security value but are essential for providing a comprehensive view of a security incident or breach. Typically, these logs are high-volume and can be verbose. The security operations use cases for this data include the following:

- **Threat intelligence**. Primary data can be checked against lists of Indicators of Compromise (IoC) or Indicators of A____? (IoA) to quickly and easily detect threats.

- **Ad-hoc hunting/investigations**.

- **Large scale searches**.

- **Summarization via summary rules**. 

Some examples of secondary data log sources are cloud storage access logs, NetFlow logs, TLS/SSL certificate logs, firewall logs, and proxy logs. The value of each of these as secondary security log sources is described later in this article.


## Log management plans

Microsoft Sentinel provides two different log storage plans, or types, to accommodate these categories of ingested data:

- **Analytics logs** are designed to store primary security data and make it easily and constantly accessible at high performance.

- **Auxiliary logs** are designed to store secondary security data at very low cost for long periods of time, while still allowing for limited accessibility.

    There is a third plan, known as **Basic logs**, that provide similar functionality to auxiliary logs, but at a higher cost (though not as high as analytics logs). While the auxiliary logs plan remains in preview, basic logs can be an option for long-term, low-cost retention if your organization doesn't use preview features.

The primary log sources used for detection often contain the metadata and context of what was detected. But sometimes you need secondary log sources to provide a complete picture of the security incident or breach. Unfortunately, many of these secondary log sources are high-volume, verbose logs with limited security detection value. They're useful for providing rich context for a security incident investigation or a threat hunt, but their high volume makes them expensive to store and retain when they're not being used. That is where Basic Logs and Auxiliary Logs come in. These two log types provide lower-cost and super-low-cost options for ingestion of high-volume, verbose logs into your Log Analytics workspace.

Event log data in Basic and Auxiliary Logs can't be used as the primary log source for security incidents and alerts. But these log types' event data is useful to correlate with and enrich your primary log data, and draw more informed conclusions, when you investigate an incident or hunt for threats.

This topic highlights log sources to consider configuring for Basic or Auxiliary Logs when they're stored in Log Analytics tables. Before choosing a log type for which to configure a given table, do the research to see which is most appropriate. For more information about log data plans, see [Select a table plan based on data usage in a Log Analytics workspace](../azure-monitor/logs/basic-logs-configure.md).

## Log types and retention plans

:::image type="content" source="media/log-plans/analytics-auxiliary-log-plans.png" alt-text="Diagram of available log plans in Microsoft Sentinel.":::

### Storage access logs for cloud providers

Storage access logs can provide a secondary source of information for investigations that involve exposure of sensitive data to unauthorized parties. These logs can help you identify issues with system or user permissions granted to the data.

Many cloud providers allow you to log all activity. You can use these logs to hunt for unusual or unauthorized activity, or to investigate in response to an incident.

### NetFlow logs

NetFlow logs are used to understand network communication within your infrastructure, and between your infrastructure and other services over Internet. Most often, you use this data to investigate command and control activity because it includes source and destination IPs and ports. Use the metadata provided by NetFlow to help you piece together information about an adversary on the network.

### VPC flow logs for cloud providers

Virtual Private Cloud (VPC) flow logs have become important for investigations and threat hunting. When organizations operate cloud environments, threat hunters need to be able to examine network flows between clouds or between clouds and endpoints.

### TLS/SSL certificate monitor logs

TLS/SSL certificate monitor logs have had outsized relevance in recent high profile cyber-attacks. While TLS/SSL certificate monitoring isn't a common log source, the logs provide valuable data for several types of attacks where certificates are involved. They help you understand the source of the certificate:

- Whether it was self-signed
- How it was generated
- If the certificate was issued from a reputable source  

### Proxy logs

Many networks maintain a transparent proxy to provide visibility over traffic of internal users. Proxy server logs contain requests made by users and applications on a local network. These logs also contain application or service requests made over the Internet, such as application updates. What is logged depends on the appliance or solution. But the logs often provide:

- Date
- Time
- Size
- Internal host that made the request
- What the host requested

When you dig into the network as part of an investigation, proxy log data overlap can be a valuable resource.

### Firewall logs

Firewall event logs are often the most fundamental network log sources for threat hunting and investigations. Firewall event logs can reveal abnormally large file transfers, volume, frequency of communication by a host, probing connection attempts, and port scanning. Firewall logs are also useful as a data source for various unstructured hunting techniques, such as stacking ephemeral ports, or grouping and clustering different communication patterns.

### IoT Logs

A new and growing source of log data is Internet of Things (IoT)-connected devices. IoT devices might log their own activity and/or sensor data captured by the device. IoT visibility for security investigations and threat hunting is a major challenge. Advanced IoT deployments save log data to a central cloud service like Azure.

## Next steps

- [Set a table's log data plan in Azure Monitor Logs](../azure-monitor/logs/basic-logs-configure.md)
- [Start an investigation by searching for events in large datasets (preview)](investigate-large-datasets.md)
