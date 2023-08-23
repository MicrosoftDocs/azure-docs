---
title: What's new in Azure Load Balancer
description: Learn what's new with Azure Load Balancer, such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: conceptual
ms.date: 04/17/2023
ms.author: mbender
ms.custom: template-concept, engagement-fy23
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
| Feature | [ Azure’s cross-region Load Balancer is now generally available ](https://azure.microsoft.com/updates/azure-s-crossregion-load-balancer-is-now-generally-available/) | Azure Load Balancer’s Global tier is a cloud-native global network load balancing solution. With cross-region Load Balancer, you can distribute traffic across multiple Azure regions with ultra-low latency and high performance. Azure cross-region Load Balancer provides customers a static globally anycast IP address. Through this global IP address, you can easily add or remove regional deployments without interruption. Learn more about [cross-region load balancer](cross-region-overview.md) | July 2023 | 
| Feature | [Inbound ICMPv6 pings and traceroute are now supported on Azure Load Balancer (General Availability)](https://azure.microsoft.com/updates/general-availability-inbound-icmpv6-pings-and-traceroute-are-now-supported-on-azure-load-balancer/) | Azure Load Balancer now supports ICMPv6 pings to its frontend and inbound traceroute support to both IPv4 and IPv6 frontends. Learn more about [how to test reachability of your load balancer](load-balancer-test-frontend-reachability.md). | June 2023 |
| Feature | [Inbound ICMPv4 pings are now supported on Azure Load Balancer (General Availability)](https://azure.microsoft.com/updates/general-availability-inbound-icmpv4-pings-are-now-supported-on-azure-load-balancer/) | Azure Load Balancer now supports ICMPv4 pings to its frontend, enabling the ability to test reachability of your load balancer. Learn more about [how to test reachability of your load balancer](load-balancer-test-frontend-reachability.md). | May 2023 |
| SKU | [Basic Load Balancer is retiring on September 30, 2025](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer/) | Basic Load Balancer will retire on 30 September 2025. Make sure to [migrate to Standard SKU](load-balancer-basic-upgrade-guidance.md) before this date. | September 2022 |
| SKU | [Gateway Load Balancer now generally available](https://azure.microsoft.com/updates/generally-available-azure-gateway-load-balancer/) | Gateway Load Balancer is a new SKU of Azure Load Balancer targeted for scenarios requiring transparent NVA (network virtual appliance) insertion. Learn more about [Gateway Load Balancer](gateway-overview.md) or our supported [third party partners](gateway-partners.md). | July 2022 |
| SKU | [Gateway Load Balancer public preview](https://azure.microsoft.com/updates/gateway-load-balancer-preview/) | Gateway Load Balancer is a fully managed service enabling you to deploy, scale, and enhance the availability of third party network virtual appliances (NVAs) in Azure. You can add your favorite third party appliance whether it's a firewall, inline DDoS appliance, deep packet inspection system, or even your own custom appliance into the network path transparently – all with a single action.| November 2021 |
| Feature | [Support for IP-based backend pools (General Availability)](https://azure.microsoft.com/updates/iplbga/) | Azure Load Balancer supports adding and removing resources from a backend pool via an IPv4 or IPv6 addresses. This enables easy management of containers, virtual machines, and Virtual Machine Scale Sets associated with Load Balancer. It will also allow IP addresses to be reserved as part of a backend pool before the associated resources are created. Learn more [here](backend-pool-management.md)|March 2021 |
| Feature | [Instance Metadata support for Standard SKU Load Balancers and Public IPs](https://azure.microsoft.com/updates/standard-load-balancer-and-ip-addresses-metadata-now-available-through-azure-instance-metadata-service-imds/)|Metadata of Standard Public IP addresses  and Standard Load Balancer can now be retrieved through Azure Instance Metadata Service (IMDS). The metadata is available from within the running instances of virtual machines (VMs) and Virtual Machine Scale Sets instances. You can use the metadata to manage your virtual machines. Learn more [here](instance-metadata-service-load-balancer.md)| February 2021 |
| Feature | [Public IP SKU upgrade from Basic to Standard without losing IP address](https://azure.microsoft.com/updates/public-ip-sku-upgrade-generally-available/) | As you move from Basic to Standard Load Balancers, retain your public IP address. Learn more [here](../virtual-network/ip-services/public-ip-upgrade-portal.md)| January 2021|
| Feature | Support for moves across resource groups | Standard Load Balancer and Standard Public IP support for [resource group moves](https://azure.microsoft.com/updates/standard-resource-group-move/). | October 2020 |
| Feature | [Cross-region load balancing with Global tier on Standard LB](https://azure.microsoft.com/updates/preview-azure-load-balancer-now-supports-crossregion-load-balancing/) | Azure Load Balancer supports Cross Region Load Balancing. Previously, Standard Load Balancer had a regional scope. With this release, you can load balance across multiple Azure regions via a single, static, global anycast Public IP address. | September 2020 |
| Feature| Azure Load Balancer Insights using Azure Monitor | Built as part of Azure Monitor for Networks, customers now have topological maps for all their Load Balancer configurations and health dashboards for their Standard Load Balancers preconfigured with metrics in the Azure portal. [Get started and learn more](https://azure.microsoft.com/blog/introducing-azure-load-balancer-insights-using-azure-monitor-for-networks/) | June 2020 |
| Validation | Addition of validation for HA ports | A validation was added to ensure that HA port rules and non HA port rules are only configurable when Floating IP is enabled. Previously, this configuration would go through, but not work as intended. No change to functionality was made. You can learn more [here](load-balancer-ha-ports-overview.md#limitations)| June 2020 |
| Feature| IPv6 support for Azure Load Balancer (generally available) | You can have IPv6 addresses as your frontend for your Azure Load Balancers. Learn how to [create a dual stack application here](./virtual-network-ipv4-ipv6-dual-stack-standard-load-balancer-powershell.md) |April 2020|
| Feature| TCP Resets on Idle Timeout (generally available)| Use TCP resets to create a more predictable application behavior. [Learn more](load-balancer-tcp-reset.md)| February 2020 |

## Known issues

The product group is actively working on resolutions for the following known issues:

|Issue |Description  |Mitigation  |
| ---------- |---------|---------|
| IP based LB outbound IP | IP based LB uses Azure's Default Outbound Access IP for outbound | In order to prevent outbound access from this IP, use NAT Gateway for a predictable IP address and to prevent SNAT port exhaustion |
| numberOfProbes, "Unhealthy threshold" | Health probe configuration property numberOfProbes, otherwise known as "Unhealthy threshold" in Portal, isn't respected. Load Balancer health probes will probe up/down immediately after one probe regardless of the property's configured value | To reflect the current behavior, set the value of numberOfProbes ("Unhealthy threshold" in Portal) as 1 |
                                        

  

## Next steps

For more information about Azure Load Balancer, see [What is Azure Load Balancer?](load-balancer-overview.md) and [frequently asked questions](load-balancer-faqs.yml).
