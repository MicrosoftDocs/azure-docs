---
title: When to use Basic Logs - Microsoft Sentinel
description: Learn what log sources might be appropriate for basic log ingestion and retention.
author: cwatson-cat
ms.author: cwatson
ms.topic: conceptual
ms.date: 03/07/2022
ms.custom: 
---
# Log sources to use for basic logs ingestion and retention

Log sources that don't have primary security data but provide additional context and clues for threat hunting and investigations might be good candidates for basic log ingestion and retention. This topic highlights log sources to consider configuring for basic logs.

Basic logs provide access to data in high-volume verbose logs in a cost-effective way. Threat hunters can correlate and collate activity from different sources, while enriching their primary data sources, like security incidents and alerts, with these secondary sources. The data in these secondary logs is often very simple, so the conclusions drawn from that data need to be correlated to be valuable.

## Storage access logs for cloud providers

Misconfigured access controls in major cloud storage providers have resulted in the exposure of sensitive data to unauthorized parties. Several of these incidents are in the news today and some of them involved Azure customers. Those in organizations with administrative rights are responsible for configure permissions according to what people and systems have a need to access the data. Most often they get it wrong. Many cloud providers provide the ability to log all activity, which can be used to investigate or threat hunt unusual or unauthorized activity or in response to an incident. I personally have used these logs for major Microsoft SSIRP type incidents. Currently Sentinel doesn’t have any connectors or solutions for these log types.

## Netflow logs

NetFlow is a network protocol developed by Cisco for collecting IP traffic information and monitoring network flow. Most people say “NetFlow” logs, but often they may be referring to logs derived from other protocols like sFlow, IPFIX, J-Flow, Netstream, etc. These all provide the same basic information.

Typically, NetFlow data is used to get a picture of the network traffic flow and volume.  Most commonly it is used to investigate command and control activity since it records source and destination IPs and ports. There are some sophisticated network monitoring systems that claim to use NetFlow combined with deep packet inspection logs to generate detections, but in absence of installing a system like that, the metadata provided by NetFlow helps provide a better fidelity when piecing together information about an adversary on the network.

## VPC flow logs for cloud providers

Virtual Private Cloud (VPC) flow logs have become very important for threat hunting. When organizations operate cloud environments, threat hunters will need to be able to examine network flows between clouds or between clouds and endpoints. Having that visibility with so many endpoints in the cloud has become critical. (Azure VPC Logs are named “NSG” logs)

## TLS/SSL certificate monitor logs

This log type had outsized relevance with regards to the SolarWinds hack incident. While TLS/SSL certificate monitoring is not a common log source, its value for specific attacks is valuable. They help understand the source of the certificate: Was it self-signed? Was it generated using a free service? Was the certificate issued from a reputable source?  Also, the certificate metadata can also be leveraged for hunting. For instance, hunters could identify certificates created using email addresses from their organization, from IP addresses outside their approved or known networks, or they might already be chasing down rouge certificates created by the attackers.

## Proxy logs

Many networks maintain a transparent proxy, providing visibility over traffic of internal users. Proxy server logs contain requests made by users and applications on a local network, as well as application or service requests made over the Internet, such as application updates. The logging will depend upon the appliance or solution; however, it is likely going to give you (at a minimum) the date, time, size, the internal host making the request, and what they requested. One thing to keep in mind is that when threat hunters are trying to dig into the network, log data overlap can be a very valuable resource.

## Firewall logs

Firewall data is often the most fundamental of network log sources for threat hunting and investigations. Firewall data can reveal abnormally large file transfers, volume, and frequency of communication by host, and important events such as failed sequential connection attempts. Firewall data is also very useful as a data source for various unstructured hunting techniques, such as stacking ephemeral ports, or grouping and clustering different communication patterns.

## IoT Logs

A new and growing source of log data is Internet of Things (IoT) connected devices. IoT devices may log their own activity and/or sensor data captured by the device. IoT visibility for security investigations and threat hunting is a major challenge. Advanced IoT deployments save log data to a central cloud service like Azure.


## Next steps

- [Log plans](../azure-monitor/log-analytics-workspace-overview.md#log-data-plans-preview) 
- [Configure Basic Logs in Azure Monitor (Preview)](../azure-monitor/basic-logs-configure.md)
- [Start an investigation by searching for events in large datasets (preview)](investigate-large-datasets.md)
