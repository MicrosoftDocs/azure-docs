---
title: When to use Basic Logs - Microsoft Sentinel
description: Learn what log sources might be appropriate for Basic Log ingestion.
author: cwatson-cat
ms.author: cwatson
ms.topic: conceptual
ms.date: 01/05/2023
ms.custom: 
---
# Log sources to use for Basic Logs ingestion

Log collection is critical to a successful security analytics program. The more log sources you have for an investigation or threat hunt, the more you might accomplish.

The primary log sources used for detection often contain the metadata and context of what was detected. But sometimes you need secondary log sources to provide a complete picture of the security incident or breach. Unfortunately, many of these secondary log sources are high-volume verbose logs with limited security detection value. They aren't useful until they're needed for a security incident or threat hunt. That is where Basic Logs come in. Basic Logs provides a lower cost option for ingestion of high-volume, verbose logs into your Log Analytics workspace.

Event log data in Basic Logs can't be used as the primary log source for security incidents and alerts. But Basic Log event data is useful to correlate and draw conclusions when you investigate an incident or perform threat hunting.

This topic highlights log sources to consider configuring for Basic Logs when they're stored in Log Analytics tables. Before configuring tables as Basic Logs, [compare log data plans](../azure-monitor/logs/basic-logs-configure.md).

## Storage access logs for cloud providers

Storage access logs can provide a secondary source of information for investigations that involve exposure of sensitive data to unauthorized parties. These logs can help you identify issues with system or user permissions granted to the data.

Many cloud providers allow you to log all activity. You can use these logs to investigate or threat hunt unusual or unauthorized activity or in response to an incident.

## NetFlow logs

NetFlow logs are used to understand network communication within your infrastructure, and between your infrastructure and other services over Internet. Most often, you use this data to investigate command and control activity because it records source and destination IPs and ports. Use the metadata provided by NetFlow to help you piece together information about an adversary on the network.

## VPC flow logs for cloud providers

Virtual Private Cloud (VPC) flow logs have become important for investigations and threat hunting. When organizations operate cloud environments, threat hunters need to be able to examine network flows between clouds or between clouds and endpoints.

## TLS/SSL certificate monitor logs

TLS/SSL certificate monitor logs have an out sized relevance in recent high profile cyber-attacks. While TLS/SSL certificate monitoring isn't a common log source, the logs provide valuable data for several types of attacks where certificates are involved. They help you understand the source of the certificate:

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

A new and growing source of log data is Internet of Things (IoT) connected devices. IoT devices might log their own activity and/or sensor data captured by the device. IoT visibility for security investigations and threat hunting is a major challenge. Advanced IoT deployments save log data to a central cloud service like Azure.

## Next steps

- [Set a table's log data plan in Azure Monitor Logs](../azure-monitor/logs/basic-logs-configure.md)
- [Start an investigation by searching for events in large datasets (preview)](investigate-large-datasets.md)
