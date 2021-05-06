---
title: Network security for Azure Video Analyzer resources
description: This article describes how to use service tags for egress with Azure Video Analyzer
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 05/04/2021
---

# Network security for Azure Video Analyzer resources
This article describes how to use the service tag feature for Azure Video Analyzer.
<!--Note: eventually, we will add information about private links here -->

## Service tags
A service tag represents a group of IP address prefixes from a given Azure service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change, minimizing the complexity of frequent updates to network security rules. For more information about service tags, see [Service tags overview](../../virtual-network/service-tags-overview.md).

You can use service tags to define network access controls on [network security groups](../../virtual-network/network-security-groups-overview.md#security-rules) or [Azure Firewall](../../firewall/service-tags.md). Use service tags in place of specific IP addresses when you create security rules. By specifying the service tag name (for example, **AzureVideoAnalyzer**) in the appropriate *source* or *destination* field of a rule, you can allow or deny the traffic for the corresponding service.

| Service tag | Purpose | Can use inbound or outbound? | Can be regional? | Can use with Azure Firewall? |
| --- | -------- |:---:|:---:|:---:|
| AzureVideoAnalyzer | Azure Video Analyzer | Both | No | No |

