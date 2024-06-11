---
title: Azure Firewall performance 
description: Compare Azure Firewall performance for Azure Firewall Basic, Standard, and Premium.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 01/30/2024
ms.author: victorh
---

# Azure Firewall performance

Reliable firewall performance is essential to operate and protect your virtual networks in Azure. More advanced features (like those found in Azure Firewall Premium) require more processing complexity, and affect firewall performance and overall network performance.

Azure Firewall has three versions: Basic, Standard, and Premium.

- Azure Firewall Basic
   
   Azure Firewall Basic is intended for small and medium size (SMB) customers to secure their Azure cloud environments. It provides the essential protection SMB customers need at an affordable price point.

- Azure Firewall Standard

   Azure Firewall Standard became generally available in September 2018. It's cloud native, highly available, with built-in auto scaling firewall-as-a-service. You can centrally govern and log all your traffic flows using a DevOps approach. The service supports both application and network level-filtering rules, and is integrated with the Microsoft Threat Intelligence feed for filtering known malicious IP addresses and domains. 
- Azure Firewall Premium

   Azure Firewall Premium is a next generation firewall. It has capabilities that are required for highly sensitive and regulated environments. The features that might affect the performance of the Firewall are TLS (Transport Layer Security) inspection and IDPS (Intrusion Detection and Prevention).

For more information about Azure Firewall, see [What is Azure Firewall?](overview.md)

## Performance testing

Before you deploy Azure Firewall, the performance needs to be tested and evaluated to ensure it meets your expectations. Not only should Azure Firewall handle the current traffic on a network, but it should also be ready for potential traffic growth. You should evaluate on a test network and not in a production environment. The testing should attempt to replicate the production environment as close as possible. You should account for the network topology, and emulate the actual characteristics of the expected traffic through the firewall.

## Performance data

The following set of performance results demonstrates the maximal Azure Firewall throughput in various use cases. All use cases were measured while Threat intelligence mode was set to alert/deny. Azure Firewall Premium performance boost feature is enabled on all Azure Firewall premium deployments by default.  This feature includes enabling Accelerated Networking on the underlying firewall virtual machines.


|Firewall type and use case  |TCP/UDP bandwidth (Gbps)  |HTTP/S bandwidth (Gbps)  |
|---------|---------|---------|
|Basic|0.25|0.25|
|Standard     |30|30|
|Premium (no TLS/IDPS)     |100|100|
|Premium with TLS (no IDS/IPS)     |-|100|
|Premium with TLS and IDS     |100|100|
|Premium with TLS and IPS      |10|10|

> [!NOTE]
> IPS (Intrusion Prevention System) takes place when one or more signatures are configured to *Alert and Deny* mode.

### Throughput for single connections

|Firewall use case  |Throughput (Gbps)|
|---------|---------|
|Basic|up to 250 Mbps|
|Standard<br>Max bandwidth for single TCP connection     |up to 1.5|
|Premium<br>Max bandwidth for single TCP connection     |up to 9|
|Premium single TCP connection with IDPS on *Alert and Deny* mode|up to 300 Mbps|

### Total throughput  for initial firewall deployment

The following throughput numbers are for an Azure Firewall Standard and Premium deployments before autoscale (out of the box deployment). Azure Firewall gradually scales out when the average throughput and CPU consumption is at 60% or if the number of connections usage is at 80%. Scale out takes five to seven minutes. Azure Firewall gradually scales in when the average throughput, CPU consumption, or number of connections is below 20%.

When performance testing, make sure you test for at least 10 to 15 minutes, and start new connections to take advantage of newly created firewall nodes.


|Firewall use case  |Throughput (Gbps)|
|---------|---------|
|Standard<br>Max bandwidth      |up to 3 |
|Premium<br>Max bandwidth      |up to 18|

> [!NOTE]
> Azure Firewall Basic doesn't autoscale.

## Next steps

- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md).