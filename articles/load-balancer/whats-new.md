---
title: What's new in Azure Load Balancer
description: Learn what's new with Azure Load Balancer, such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
services: load-balancer
author: anavinahar
ms.service: load-balancer
ms.topic: conceptual
ms.date: 07/07/2020
ms.author: anavin
---
# What's new in Azure Load Balancer?

Azure Load Balancer is updated regularly. Stay up to date with the latest announcements. This article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality (if applicable)

You can also find the latest Azure Load Balancer updates and subscribe to the RSS feed [here](https://azure.microsoft.com/updates/?category=networking&query=load%20balancer).

## Recent releases

| Type |Name |Description  |Date added  |
| ------ |---------|---------|---------|
| Feature | Support for moves across resource groups | Standard Load Balancer and Standard Public IP support for [resource group moves](https://azure.microsoft.com/updates/standard-resource-group-move/). | October 2020 |
| Feature | Support for IP-based backend pool management (Preview) | Azure Load Balancer supports adding and removing resources from a backend pool via an IPv4 or IPv6 addresses. This enables easy management of containers, virtual machines, and virtual machine scale sets associated with Load Balancer. It will also allow IP addresses to be reserved as part of a backend pool before the associated resources are created. Learn more [here](backend-pool-management.md)|July 2020 |
| Feature| Azure Load Balancer Insights using Azure Monitor | Built as part of Azure Monitor for Networks, customers now have topological maps for all their Load Balancer configurations and health dashboards for their Standard Load Balancers preconfigured with metrics in the Azure portal. [Get started and learn more](https://azure.microsoft.com/blog/introducing-azure-load-balancer-insights-using-azure-monitor-for-networks/) | June 2020 |
| Validation | Addition of validation for HA ports | A validation was added to ensure that HA port rules and non HA port rules are only configurable when Floating IP is enabled. Previously, the this configuration would go through, but not work as intended. No change to functionality was made. You can learn more [here](load-balancer-ha-ports-overview.md#limitations)| June 2020 |
| Feature| IPv6 support for Azure Load Balancer (generally available) | You can have IPv6 addresses as your frontend for your Azure Load Balancers. Learn how to [create a dual stack application here](../virtual-network/virtual-network-ipv4-ipv6-dual-stack-standard-load-balancer-powershell.md) |April 2020|
| Feature| TCP Resets on Idle Timeout (generally available)| Use TCP resets to create a more predictable application behavior. [Learn more](load-balancer-tcp-reset.md)| February 2020 |

## Known issues

The product group is actively working on resolutions for the following known issues:

|Issue |Description  |Mitigation  |
| ---------- |---------|---------|
| Log Analytics export | Log Analytics cannot export metrics for Standard Load Balancers nor health probe status logs for Basic Load Balancer  | [Utilize Azure Monitor for multi-dimensional metrics for your Standard Load Balancer](load-balancer-standard-diagnostics.md). While not able to use Log Analytics for monitoring, Azure Monitor provides visualization for a rich set of multi-dimensional metrics. You can leverage the pre-configured metrics dashboard via the Insights sub-blade of your Load Balancer. If using Basic Load Balancer [upgrade to Standard](upgrade-basic-standard.md) for production level metrics monitoring.

  

## Next steps

For more information about Azure Load Balancer, see [What is Azure Load Balancer?](load-balancer-overview.md) and [frequently asked questions](load-balancer-faqs.md).
