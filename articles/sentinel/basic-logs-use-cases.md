---
title: When to use Basic Logs - Microsoft Sentinel
description: Learn what log sources might be appropriate for basic log ingestion and retention.
author: cwatson-cat
ms.author: cwatson
ms.topic: conceptual
ms.date: 03/07/2022
ms.custom: 
---
# Log sources to use for basic logs ingestion and retention (preview)

Log sources that don't have primary security data but provide more context and clues for threat hunting and investigations might be good candidates for basic log ingestion and retention. This topic highlights log sources to consider configuring for basic logs when they're stored in Log Analytics tables.

Basic logs provide access to data in high-volume verbose logs in a cost-effective way. Threat hunters can correlate and collate activity from different sources, while enriching their primary data sources, like security incidents and alerts, with these secondary sources. The data in these secondary logs is often simple, so the conclusions drawn from that data need to be correlated to be valuable.

> [!IMPORTANT]
> The basic logs feature is currently in **PREVIEW**. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Storage access logs for cloud providers

Storage access logs can provide a secondary source of information for investigations that involve exposure of sensitive data to unauthorized parties. These logs can help you identify issues with system or user permissions granted to the data.

Many cloud providers allow you to log all activity, which you can use to investigate or threat hunt unusual or unauthorized activity or in response to an incident.

Currently, Microsoft Sentinel doesn’t have connectors or solutions for these log types (which log types? External to MS storage access logs?).

## Netflow logs

NetFlow is a network protocol developed by Cisco to collect IP traffic information and monitor network flow. Most people say “NetFlow” logs. But, they might be referring to logs derived from other protocols like sFlow, IPFIX, J-Flow, Netstream, etc. These logs all provide the same basic information.

Typically, you use NetFlow data to get a picture of the network traffic flow and volume.  Most commonly, you use this data to investigate command and control activity because it records source and destination IPs and ports.

Some sophisticated network monitoring systems use NetFlow combined with deep packet inspection logs to generate detections. But when you don't have a system like that installed, use the metadata provided by NetFlow to help you piece together information about an adversary on the network.

## VPC flow logs for cloud providers

Virtual Private Cloud (VPC) flow logs have become important for threat hunting. When organizations operate cloud environments, threat hunters need to be able to examine network flows between clouds or between clouds and endpoints.

In Azure, VPC Logs are named network security group (NSG) logs.

## TLS/SSL certificate monitor logs

TLS/SSL certificate monitor logs have an outsized relevance since the SolarWinds hack incident. While TLS/SSL certificate monitoring isn't a common log source, it's valuable data for specific attacks. They help understand the source of the certificate:

- Was it self-signed?
- Was it generated using a free service?
- Was the certificate issued from a reputable source?  

Also, use the certificate metadata for hunting. For example, you could identify certificates:

- Created by using email addresses from your organization
- Created from IP addresses outside your approved or known networks

## Proxy logs

Many networks maintain a transparent proxy to provide visibility over traffic of internal users. Proxy server logs contain requests made by users and applications on a local network. These logs also contain application or service requests made over the Internet, such as application updates. What's logged depends on the appliance or solution. But the logs will likely give you at least the:

- Date
- Time
- Size
- Internal host that made the request 
- What the host requested

When you dig into the network as you're threat hunting, log data overlap can be a valuable resource.

## Firewall logs

Firewall data is often the most fundamental of network log sources for threat hunting and investigations. Firewall data can reveal abnormally large file transfers, volume, and frequency of communication by a host. These logs can also show important events such as failed sequential connection attempts. Firewall data is also very useful as a data source for various unstructured hunting techniques, such as stacking ephemeral ports, or grouping and clustering different communication patterns.

## IoT Logs

A new and growing source of log data is Internet of Things (IoT) connected devices. IoT devices might log their own activity and/or sensor data captured by the device. IoT visibility for security investigations and threat hunting is a major challenge. Advanced IoT deployments save log data to a central cloud service like Azure.


## Next steps

- [Log plans](../azure-monitor/logs/log-analytics-workspace-overview.md#log-data-plans-preview)
- [Configure Basic Logs in Azure Monitor (Preview)](../azure-monitor/logs/basic-logs-configure.md)
- [Start an investigation by searching for events in large datasets (preview)](investigate-large-datasets.md)
