---
title: When to use Auxiliary Logs in Microsoft Sentinel
description: Learn what log sources might be appropriate for Auxiliary Log or Basic Log ingestion.
author: cwatson-cat
ms.author: cwatson
ms.topic: conceptual
ms.date: 07/21/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---
# Log sources to use for Auxiliary Logs ingestion

This article highlights log sources to consider configuring as Auxiliary Logs (or Basic Logs) when they're stored in Log Analytics tables. Before choosing a log type for which to configure a given table, do the research to see which is most appropriate. For more information about data categories and log data plans, see [Log retention plans in Microsoft Sentinel](log-plans.md).

> [!IMPORTANT]
>
> The **Auxiliary Logs** log type is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> [!INCLUDE [unified-soc-preview](includes/unified-soc-preview-without-alert.md)]

## Storage access logs for cloud providers

Storage access logs can provide a secondary source of information for investigations that involve exposure of sensitive data to unauthorized parties. These logs can help you identify issues with system or user permissions granted to the data.

Many cloud providers allow you to log all activity. You can use these logs to hunt for unusual or unauthorized activity, or to investigate in response to an incident.

## NetFlow logs

NetFlow logs are used to understand network communication within your infrastructure, and between your infrastructure and other services over Internet. Most often, you use this data to investigate command and control activity because it includes source and destination IPs and ports. Use the metadata provided by NetFlow to help you piece together information about an adversary on the network.

## VPC flow logs for cloud providers

Virtual Private Cloud (VPC) flow logs have become important for investigations and threat hunting. When organizations operate cloud environments, threat hunters need to be able to examine network flows between clouds or between clouds and endpoints.

## TLS/SSL certificate monitor logs

TLS/SSL certificate monitor logs have had outsized relevance in recent high profile cyber-attacks. While TLS/SSL certificate monitoring isn't a common log source, the logs provide valuable data for several types of attacks where certificates are involved. They help you understand the source of the certificate:

- Whether it was self-signed
- How it was generated
- If the certificate was issued from a reputable source  

## Proxy logs

Many networks maintain a transparent proxy to provide visibility over traffic of internal users. Proxy server logs contain requests made by users and applications on a local network. These logs also contain application or service requests made over the Internet, such as application updates. What is logged depends on the appliance or solution. But the logs often provide:

- Date
- Time
- Size
- Internal host that made the request
- What the host requested

When you dig into the network as part of an investigation, proxy log data overlap can be a valuable resource.

## Firewall logs

Firewall event logs are often the most fundamental network log sources for threat hunting and investigations. Firewall event logs can reveal abnormally large file transfers, volume, frequency of communication by a host, probing connection attempts, and port scanning. Firewall logs are also useful as a data source for various unstructured hunting techniques, such as stacking ephemeral ports, or grouping and clustering different communication patterns.

## IoT Logs

A new and growing source of log data is Internet of Things (IoT)-connected devices. IoT devices might log their own activity and/or sensor data captured by the device. IoT visibility for security investigations and threat hunting is a major challenge. Advanced IoT deployments save log data to a central cloud service like Azure.

## Next steps

- [Select a table plan based on data usage in a Log Analytics workspace](../azure-monitor/logs/logs-table-plans.md)
- [Set up a table with the Auxiliary plan in your Log Analytics workspace (Preview)](../azure-monitor/logs/create-custom-table-auxiliary.md)
- [Manage data retention in a Log Analytics workspace](../azure-monitor/logs/data-retention-configure.md)
- [Start an investigation by searching for events in large datasets (preview)](investigate-large-datasets.md)
