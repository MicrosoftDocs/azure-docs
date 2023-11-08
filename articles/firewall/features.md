---
title: Azure Firewall Standard features
description: Learn about Azure Firewall features
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 08/30/2023
ms.author: victorh
---

# Azure Firewall Standard features

[Azure Firewall](overview.md) Standard is a managed, cloud-based network security service that protects your Azure Virtual Network resources.

:::image type="content" source="media/features/firewall-standard.png" alt-text="Azure Firewall Standard features":::

Azure Firewall includes the following features:

- Built-in high availability
- Availability Zones
- Unrestricted cloud scalability
- Application FQDN filtering rules
- Network traffic filtering rules
- FQDN tags
- Service tags
- Threat intelligence
- DNS proxy
- Custom DNS
- FQDN in network rules
- Deployment without public IP address in Forced Tunnel Mode
- Outbound SNAT support
- Inbound DNAT support
- Multiple public IP addresses
- Azure Monitor logging
- Forced tunneling
- Web categories
- Certifications

To compare Azure Firewall features for all Firewall SKUs, see [Choose the right Azure Firewall SKU to meet your needs](choose-firewall-sku.md).

## Built-in high availability

High availability is built in, so no extra load balancers are required and there's nothing you need to configure.

## Availability Zones

Azure Firewall can be configured during deployment to span multiple Availability Zones for increased availability. With Availability Zones, your availability increases to 99.99% uptime. For more information, see the Azure Firewall [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/azure-firewall/v1_0/). The 99.99% uptime SLA is offered when two or more Availability Zones are selected.

You can also associate Azure Firewall to a specific zone just for proximity reasons, using the service standard 99.95% SLA.

There's no extra cost for a firewall deployed in more than one Availability Zone. However, there are added costs for inbound and outbound data transfers associated with Availability Zones. For more information, see [Bandwidth pricing details](https://azure.microsoft.com/pricing/details/bandwidth/).

As the firewall scales, it creates instances in the zones it's in. So, if the firewall is in Zone 1 only, new instances are created in Zone 1. If the firewall is in all three zones, then it creates instances across the three zones as it scales.

Azure Firewall Availability Zones are available in regions that support Availability Zones. For more information, see [Regions that support Availability Zones in Azure](../availability-zones/az-region.md)

> [!NOTE]
> Availability Zones can only be configured during deployment. You can't configure an existing firewall to include Availability Zones.

For more information about Availability Zones, see [Regions and Availability Zones in Azure](../availability-zones/az-overview.md).

## Unrestricted cloud scalability

Azure Firewall can scale out as much as you need to accommodate changing network traffic flows, so you don't need to budget for your peak traffic.

## Application FQDN filtering rules

You can limit outbound HTTP/S traffic or Azure SQL traffic to a specified list of fully qualified domain names (FQDN) including wild cards. This feature doesn't require TLS termination.

The following video shows how to create an application rule: <br><br>

> [!VIDEO https://learn-video.azurefd.net/vod/player?id=d8dbf4b9-4f75-4c88-b717-c3664b667e8b]

## Network traffic filtering rules

You can centrally create *allow* or *deny* network filtering rules by source and destination IP address, port, and protocol. Azure Firewall is fully stateful, so it can distinguish legitimate packets for different types of connections. Rules are enforced and logged across multiple subscriptions and virtual networks.

Azure Firewall supports stateful filtering of Layer 3 and Layer 4 network protocols. Layer 3 IP protocols can be filtered by selecting **Any** protocol in the Network rule and  select the wild-card **\*** for the port.

## FQDN tags

[FQDN tags](fqdn-tags.md) make it easy for you to allow well-known Azure service network traffic through your firewall. For example, say you want to allow Windows Update network traffic through your firewall. You create an application rule and include the Windows Update tag. Now network traffic from Windows Update can flow through your firewall.

## Service tags

A [service tag](service-tags.md) represents a group of IP address prefixes to help minimize complexity for security rule creation. You can't create your own service tag, nor specify which IP addresses are included within a tag. Microsoft manages the address prefixes encompassed by the service tag, and automatically updates the service tag as addresses change.

## Threat intelligence

[Threat intelligence](threat-intel.md)-based filtering can be enabled for your firewall to alert and deny traffic from/to known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

## DNS proxy

With DNS proxy enabled, Azure Firewall can process and forward DNS queries from a Virtual Network(s) to your desired DNS server. This functionality is crucial and required to have reliable FQDN filtering in network rules. You can enable DNS proxy in Azure Firewall and Firewall Policy settings. To learn more about DNS proxy, see [Azure Firewall DNS settings](dns-settings.md).

## Custom DNS

Custom DNS allows you to configure Azure Firewall to use your own DNS server, while ensuring the firewall outbound dependencies are still resolved with Azure DNS. You may configure a single DNS server or multiple servers in Azure Firewall and Firewall Policy DNS settings. Learn more about Custom DNS, see [Azure Firewall DNS settings](dns-settings.md).

Azure Firewall can also resolve names using Azure Private DNS. The virtual network where the Azure Firewall resides must be linked to the Azure Private Zone. To learn more, see [Using Azure Firewall as DNS Forwarder with Private Link](https://github.com/adstuart/azure-privatelink-dns-azurefirewall).

## FQDN in network rules

You can use fully qualified domain names (FQDNs) in network rules based on DNS resolution in Azure Firewall and Firewall Policy. 

The specified FQDNs in your rule collections are translated to IP addresses based on your firewall DNS settings. This capability allows you to filter outbound traffic using FQDNs with any TCP/UDP protocol (including NTP, SSH, RDP, and more). As this capability is based on DNS resolution, it's highly recommended you enable the DNS proxy to ensure name resolution is consistent with your protected virtual machines and firewall.

## Deploy Azure Firewall without public IP address in Forced Tunnel mode

The Azure Firewall service requires a public IP address for operational purposes. While secure, some deployments prefer not to expose a public IP address directly to the Internet. 

In such cases, you can deploy Azure Firewall in Forced Tunnel mode. This configuration creates a management NIC that is used by Azure Firewall for its operations. The Tenant Datapath network can be configured without a public IP address, and Internet traffic can be forced tunneled to another firewall or completely blocked.

Forced Tunnel mode can't be configured at run time. You can either redeploy the Firewall or use the stop and start facility to reconfigure an existing Azure Firewall in Forced Tunnel mode. Firewalls deployed in Secure Hubs are always deployed in Forced Tunnel mode.

## Outbound SNAT support

All outbound virtual network traffic IP addresses are translated to the Azure Firewall public IP (Source Network Address Translation). You can identify and allow traffic originating from your virtual network to remote Internet destinations. Azure Firewall doesn't SNAT when the destination IP is a private IP range per [IANA RFC 1918](https://tools.ietf.org/html/rfc1918). 

If your organization uses a public IP address range for private networks, Azure Firewall will SNAT the traffic to one of the firewall private IP addresses in AzureFirewallSubnet. You can configure Azure Firewall to **not** SNAT your public IP address range. For more information, see [Azure Firewall SNAT private IP address ranges](snat-private-range.md).

You can monitor SNAT port utilization in Azure Firewall metrics. Learn more and see our recommendation on SNAT port utilization in our [firewall logs and metrics documentation](logs-and-metrics.md#metrics).

## Inbound DNAT support

Inbound Internet network traffic to your firewall public IP address is translated (Destination Network Address Translation) and filtered to the private IP addresses on your virtual networks.

## Multiple public IP addresses

You can associate [multiple public IP addresses](deploy-multi-public-ip-powershell.md) (up to 250) with your firewall.

This enables the following scenarios:

- **DNAT** - You can translate multiple standard port instances to your backend servers. For example, if you have two public IP addresses, you can translate TCP port 3389 (RDP) for both IP addresses.
- **SNAT** - More ports are available for outbound SNAT connections, reducing the potential for SNAT port exhaustion. At this time, Azure Firewall randomly selects the source public IP address to use for a connection. If you have any downstream filtering on your network, you need to allow all public IP addresses associated with your firewall. Consider using a [public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md) to simplify this configuration.

For more information about NAT behaviors, see [Azure Firewall NAT Behaviors](https://techcommunity.microsoft.com/t5/azure-network-security-blog/azure-firewall-nat-behaviors/ba-p/3825834).


## Azure Monitor logging

All events are integrated with Azure Monitor, allowing you to archive logs to a storage account, stream events to your event hub, or send them to Azure Monitor logs. For Azure Monitor log samples, see [Azure Monitor logs for Azure Firewall](./firewall-workbook.md).

For more information, see [Tutorial: Monitor Azure Firewall logs and metrics](./firewall-diagnostics.md). 

Azure Firewall Workbook provides a flexible canvas for Azure Firewall data analysis. You can use it to create rich visual reports within the Azure portal. For more information, see [Monitor logs using Azure Firewall Workbook](firewall-workbook.md).

## Forced tunneling

You can configure Azure Firewall to route all Internet-bound traffic to a designated next hop instead of going directly to the Internet. For example, you may have an on-premises edge firewall or other network virtual appliance (NVA) to process network traffic before it's passed to the Internet. For more information, see [Azure Firewall forced tunneling](forced-tunneling.md).

## Web categories

Web categories let administrators allow or deny user access to web site categories such as gambling websites, social media websites, and others. Web categories are included in Azure Firewall Standard, but it's more fine-tuned in Azure Firewall Premium. As opposed to the Web categories capability in the Standard SKU that matches the category based on an FQDN, the Premium SKU matches the category according to the entire URL for both HTTP and HTTPS traffic. For more information about Azure Firewall Premium, see [Azure Firewall Premium features](premium-features.md).

For example, if Azure Firewall intercepts an HTTPS request for `www.google.com/news`, the following categorization is expected: 

- Firewall Standard – only the FQDN part is examined, so `www.google.com` is categorized as *Search Engine*. 

- Firewall Premium – the complete URL is examined, so `www.google.com/news` is categorized as *News*.

The categories are organized based on severity under **Liability**, **High-Bandwidth**, **Business Use**, **Productivity Loss**, **General Surfing**, and **Uncategorized**.

### Category exceptions

You can create exceptions to your web category rules. Create a separate allow or deny rule collection with a higher priority within the rule collection group. For example, you can configure a rule collection that allows `www.linkedin.com` with priority 100, with a rule collection that denies **Social networking** with priority 200. This creates the exception for the predefined **Social networking** web category.



## Certifications

Azure Firewall is Payment Card Industry (PCI), Service Organization Controls (SOC), and International Organization for Standardization (ISO) compliant. For more information, see [Azure Firewall compliance certifications](compliance-certifications.md).

## Next steps

- [Azure Firewall Premium features](premium-features.md)
- [Learn more about Azure network security](../networking/security/index.yml)
