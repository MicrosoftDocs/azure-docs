---
title: Azure Firewall Basic features
description: Learn about Azure Firewall Basic features
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 03/15/2023
ms.author: victorh
---

# Azure Firewall Basic features

[Azure Firewall](overview.md) Basic is a managed, cloud-based network security service that protects your Azure Virtual Network resources. 

:::image type="content" source="media/overview/firewall-basic-diagram.png" alt-text="Diagram showing Firewall Basic.":::

Azure Firewall Basic includes the following features: 
- Built-in high availability
- Availability Zones
- Application FQDN filtering rules
- Network traffic filtering rules
- FQDN tags
- Service tags
- Threat intelligence in alert mode
- Outbound SNAT support
- Inbound DNAT support
- Multiple public IP addresses
- Azure Monitor logging
- Certifications

To compare Azure Firewall features for all Firewall SKUs, see [Choose the right Azure Firewall SKU to meet your needs](choose-firewall-sku.md).
 
## Built-in high availability

High availability is built in, so no extra load balancers are required and there's nothing you need to configure.

## Availability Zones

Azure Firewall can be configured during deployment to span multiple Availability Zones for increased availability. You can also associate Azure Firewall to a specific zone for proximity reasons.  For more information on availability, see the Azure Firewall [Service Level Agreement (SLA)](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1).

There's no extra cost for a firewall deployed in more than one Availability Zone. However, there are added costs for inbound and outbound data transfers associated with Availability Zones. For more information, see [Bandwidth pricing details](https://azure.microsoft.com/pricing/details/bandwidth/).

Azure Firewall Availability Zones are available in regions that support Availability Zones. For more information, see [Regions that support Availability Zones in Azure](../reliability/availability-zones-service-support.md).

## Application FQDN filtering rules

You can limit outbound HTTP/S traffic or Azure SQL traffic to a specified list of fully qualified domain names (FQDN) including wild cards. This feature doesn't require TLS termination.

The following video shows how to create an application rule: <br><br>

> [!VIDEO https://learn-video.azurefd.net/vod/player?id=d8dbf4b9-4f75-4c88-b717-c3664b667e8b]

## Network traffic filtering rules

You can centrally create allow or deny network filtering rules by source and destination IP address, port, and protocol. Azure Firewall is fully stateful, so it can distinguish legitimate packets for different types of connections. Rules are enforced and logged across multiple subscriptions and virtual networks.

Azure Firewall supports stateful filtering of Layer 3 and Layer 4 network protocols. Layer 3 IP protocols can be filtered by selecting Any protocol in the Network rule and select the wild-card * for the port.

## FQDN tags

[FQDN tags](fqdn-tags.md) make it easy for you to allow well-known Azure service network traffic through your firewall. For example, say you want to allow Windows Update network traffic through your firewall. You create an application rule and include the Windows Update tag. Now network traffic from Windows Update can flow through your firewall.

## Service tags

A [service tag](service-tags.md) represents a group of IP address prefixes to help minimize complexity for security rule creation. You can't create your own service tag, nor specify which IP addresses are included within a tag. Microsoft manages the address prefixes encompassed by the service tag, and automatically updates the service tag as addresses change.

## Threat intelligence 

[Threat intelligence-based filtering](threat-intel.md) can be enabled for your firewall to alert traffic from/to known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

## Outbound SNAT support

All outbound virtual network traffic IP addresses are translated to the Azure Firewall public IP (Source Network Address Translation). You can identify and allow traffic originating from your virtual network to remote Internet destinations. Azure Firewall doesn't SNAT when the destination IP is a private IP range per [IANA RFC 1918](https://www.rfc-editor.org/rfc/rfc1918).

If your organization uses a public IP address range for private networks, Azure Firewall will SNAT the traffic to one of the firewall private IP addresses in AzureFirewallSubnet. You can configure Azure Firewall to not SNAT your public IP address range. For more information, see [Azure Firewall SNAT private IP address ranges](snat-private-range.md).

You can monitor SNAT port utilization in Azure Firewall metrics. Learn more and see our recommendation on SNAT port utilization in our [firewall logs and metrics documentation](logs-and-metrics.md#metrics).

## Inbound DNAT support

Inbound Internet network traffic to your firewall public IP address is translated (Destination Network Address Translation) and filtered to the private IP addresses on your virtual networks.

## Multiple public IP addresses

You can associate [multiple public IP addresses](deploy-multi-public-ip-powershell.md) with your firewall. 

This enables the following scenarios:

- DNAT - You can translate multiple standard port instances to your backend servers. For example, if you have two public IP addresses, you can translate TCP port 3389 (RDP) for both IP addresses.
- SNAT - More ports are available for outbound SNAT connections, reducing the potential for SNAT port exhaustion. At this time, Azure Firewall randomly selects the source public IP address to use for a connection. If you have any downstream filtering on your network, you need to allow all public IP addresses associated with your firewall. Consider using a [public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md) to simplify this configuration.

## Azure Monitor logging

All events are integrated with Azure Monitor, allowing you to archive logs to a storage account, stream events to your event hub, or send them to Azure Monitor logs. For Azure Monitor log samples, see [Azure Monitor logs for Azure Firewall](firewall-workbook.md).

For more information, see [Tutorial: Monitor Azure Firewall logs and metrics](firewall-diagnostics.md).

Azure Firewall Workbook provides a flexible canvas for Azure Firewall data analysis. You can use it to create rich visual reports within the Azure portal. For more information, see [Monitor logs using Azure Firewall Workbook](firewall-workbook.md).

## Certifications

Azure Firewall is Payment Card Industry (PCI), Service Organization Controls (SOC), and International Organization for Standardization (ISO) compliant. For more information, see [Azure Firewall compliance certifications](compliance-certifications.md).

