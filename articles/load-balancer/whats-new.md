---
title: What's new in Azure Load Balancer
description: Learn what's new with Azure Load Balancer, such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: concept-article
ms.date: 12/06/2024
ms.author: mbender
---

# What's new in Azure Load Balancer?

Azure Load Balancer is updated regularly. Stay up to date with the latest announcements. This article provides you with information about:

- The latest releases
- Known issues
- Bug fixes
- Deprecated functionality (if applicable)

You can also find the latest Azure Load Balancer updates and subscribe to the RSS feed [here](https://azure.microsoft.com/updates?filters=%5B%22Load+Balancer%22%5D).

## Recent releases

| Type |Name |Description  |Date added  |
| ------ |---------|---------|---------|
| Feature | [Azure Load Balancer health status general availability](https://azure.microsoft.com/updates?id=467610) | Announcing the general availability of Azure Load Balancer Health Status, a powerful feature designed to provide detailed information about the health of backend instances in your Azure Load Balancer backend pool. The Health Status feature offers valuable insights into the state of health of your backend instances and specific reasons for their health status. Learn more [here](https://go.microsoft.com/fwlink/?linkid=2296757). | November 2024 |
| Feature | [Azure Load Balancer Admin State general availability](https://azure.microsoft.com/updates?id=467625) | Admin State enables you to override the health probe behavior for each instance without additional configuration changes to your Load Balancer such as changing network security rules or closing ports. This makes management, especially during maintenance easy, allowing you to set instances as up or down and control connection behavior with no additional overhead. Learn more [here](https://go.microsoft.com/fwlink/?linkid=2296089). | November 2024 |
| Feature | [Azure cross-subscription Load Balancer general availability](https://azure.microsoft.com/updates?id=467605) | Cross-subscription load balancing enables the load balancers components to be located in different subscriptions. For example, the frontend IP address or the backend instances could be located in a different subscription from the one that the load balancer belongs to. Learn more [here](https://go.microsoft.com/fwlink/?linkid=2277544). | November 2024 |
| Feature | [Azure Load Balancer health event logs public preview](https://azure.microsoft.com/updates/?id=public-preview-azure-load-balancer-health-event-logs) | With health event logs, you can collect, store, and analyze information to help understand the health of your Azure Load Balancer resource. These built-in logs help you troubleshoot specific scenarios and allow you to identify and alert on availability issues affecting your load balancer. Learn more [here](https://aka.ms/lbhealthoverview). | May 2024|
| Feature | [Gateway Load Balancer IPv6 support is now generally available](https://azure.microsoft.com/updates/?id=general-availability-gateway-load-balancer-ipv6-support/) | Azure Gateway Load Balancer now supports IPv6 traffic, enabling you to distribute IPv6 traffic through Gateway Load Balancer before it reaches your dual-stack applications. Now you can add IPv6 frontend IP addresses and backend pools to Gateway Load Balancer. This allows you to inspect, protect, or mirror both IPv4 and IPv6 traffic flows using third-party or custom network virtual appliances (NVAs). Both internet inbound and outbound IPv6 traffic flows can now be routed through Gateway Load Balancer. Learn more about [Gateway Load Balancer](gateway-overview.md) or our supported [third-party partners](gateway-partners.md). | September 2023 |
| Feature | [Azure’s cross-region Load Balancer is now generally available](https://azure.microsoft.com/updates/azure-s-crossregion-load-balancer-is-now-generally-available/) | Azure Load Balancer’s Global tier is a cloud-native global network load balancing solution. With cross-region Load Balancer, you can distribute traffic across multiple Azure regions with ultra-low latency and high performance. Azure cross-region Load Balancer provides customers a static globally anycast IP address. Through this global IP address, you can easily add or remove regional deployments without interruption. Learn more about [cross-region load balancer](cross-region-overview.md) | July 2023 | 
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

## Retirements

| Name |Description  | Retirement Date  |
|---------|---------|---------|
| [Azure Load Balancer numberOfProbes property](https://azure.microsoft.com/updates/?id=end-of-support-announcement-for-azure-load-balancer-numberofprobes-property-on-1-september-2027) | Support for [Azure Load Balancer numberOfProbes property](https://aka.ms/VersionHowTo) ends on September 1, 2027. To avoid service disruption, upgrade your apps to API version 2022-05-01 or higher and start using Azure Load Balancer probeThreshold property. We will not be supporting the property numberOfProbes after September 1, 2027. | September 2027 |
| [Inbound NAT rule V1 for Azure Virtual Machines and Azure Virtual Machine Scale Sets](https://azure.microsoft.com/updates/?id=retirement-notice-azure-load-balancer-inbound-nat-rule-v1-for-azure-vms-and-azure-vmss-will-be-retired) | On September 30, 2027, Inbound NAT rule V1 for Azure Virtual Machines and Azure Virtual Machine Scale Sets in Azure Load Balancer will be retired. To avoid service disruptions, you’ll need to [migrate](https://go.microsoft.com/fwlink/?linkid=2286671) to Inbound NAT rule V2 by that date. | September 2027 |
| [Azure Basic Load Balancer](https://azure.microsoft.com/updates/?id=azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer) | On 30 September 2025, Azure Basic Load Balancer will be [retired](https://aka.ms/lbbasictostandard). You can continue to use your existing Basic Load Balancers until then, but you'll no longer be able to deploy new ones after 31 March 2025. | September 2025 |

## Known issues

The product group is actively working on resolutions for the following known issues:

|Issue |Description  |Mitigation  |
| ---------- |---------|---------|
| IP-based Load Balancer outbound IP | IP-based Load Balancers are currently not secure-by-default and will use the backend instances' default outbound access IPs for outbound connections. If the Load Balancer is a public Load Balancer, either the default outbound access IPs or the Load Balancer's frontend IP may be used. | In order to prevent backend instances behind an IP-based Load Balancer from using default outbound access, use NAT Gateway for a predictable IP address and to prevent SNAT port exhaustion, or use the private subnet feature to secure your Load Balancer. |
| numberOfProbes, "Unhealthy threshold" | Health probe configuration property numberOfProbes, otherwise known as "Unhealthy threshold" in Portal, isn't respected. Load Balancer health probes will probe up/down immediately after one probe regardless of the property's configured value. | To control the number of successful or failed consecutive probes necessary to mark backend instances as healthy or unhealthy, use the property ["probeThreshold"](/azure/templates/microsoft.network/loadbalancers?pivots=deployment-language-arm-template#probepropertiesformat-1) instead. |
                                        

  

## Next steps

For more information about Azure Load Balancer, see [What is Azure Load Balancer?](load-balancer-overview.md) and [frequently asked questions](load-balancer-faqs.yml).
