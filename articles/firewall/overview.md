---
title: What is Azure Firewall?
description: Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources.
author: vhorne
ms.service: firewall
services: firewall
ms.topic: overview
ms.custom: mvc
ms.date: 05/22/2020
ms.author: victorh
Customer intent: As an administrator, I want to evaluate Azure Firewall so I can determine if I want to use it.
---

# What is Azure Firewall?

![ICSA certification](media/overview/icsa-cert-firewall-small.png)

Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability.

![Firewall overview](media/overview/firewall-threat.png)

You can centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks. Azure Firewall uses a static public IP address for your virtual network resources allowing outside firewalls to identify traffic originating from your virtual network.  The service is fully integrated with Azure Monitor for logging and analytics.

Azure Firewall offers the following features:

## Built-in high availability

High availability is built in, so no additional load balancers are required and there's nothing you need to configure.

## Availability Zones

Azure Firewall can be configured during deployment to span multiple Availability Zones for increased availability. With Availability Zones, your availability increases to 99.99% uptime. For more information, see the Azure Firewall [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/azure-firewall/v1_0/). The 99.99% uptime SLA is offered when two or more Availability Zones are selected.

You can also associate Azure Firewall to a specific zone just for proximity reasons, using the service standard 99.95% SLA.

There's no additional cost for a firewall deployed in an Availability Zone. However, there are additional costs for inbound and outbound data transfers associated with Availability Zones. For more information, see [Bandwidth pricing details](https://azure.microsoft.com/pricing/details/bandwidth/).

Azure Firewall Availability Zones are available in regions that support Availability Zones. For more information, see [Regions that support Availability Zones in Azure](../availability-zones/az-region.md)

> [!NOTE]
> Availability Zones can only be configured during deployment. You can't configure an existing firewall to include Availability Zones.

For more information about Availability Zones, see [Regions and Availability Zones in Azure](../availability-zones/az-overview.md)

## Unrestricted cloud scalability

Azure Firewall can scale up as much as you need  to accommodate changing network traffic flows, so you don't need to budget for your peak traffic.

## Application FQDN filtering rules

You can limit outbound HTTP/S traffic or Azure SQL traffic (preview) to a specified list of fully qualified domain names (FQDN) including wild cards. This feature doesn't require TLS termination.

## Network traffic filtering rules

You can centrally create *allow* or *deny* network filtering rules by source and destination IP address, port, and protocol. Azure Firewall is fully stateful, so it can distinguish legitimate packets for different types of connections. Rules are enforced and logged across multiple subscriptions and virtual networks.

## FQDN tags

[FQDN tags](fqdn-tags.md) make it easy for you to allow well-known Azure service network traffic through your firewall. For example, say you want to allow Windows Update network traffic through your firewall. You create an application rule and include the Windows Update tag. Now network traffic from Windows Update can flow through your firewall.

## Service tags

A [service tag](service-tags.md) represents a group of IP address prefixes to help minimize complexity for security rule creation. You can't create your own service tag, nor specify which IP addresses are included within a tag. Microsoft manages the address prefixes encompassed by the service tag, and automatically updates the service tag as addresses change.

## Threat intelligence

[Threat intelligence](threat-intel.md)-based filtering can be enabled for your firewall to alert and deny traffic from/to known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

## Outbound SNAT support

All outbound virtual network traffic IP addresses are translated to the Azure Firewall public IP (Source Network Address Translation). You can identify and allow traffic originating from your virtual network to remote Internet destinations. Azure Firewall doesn't SNAT when the destination IP is a private IP range per [IANA RFC 1918](https://tools.ietf.org/html/rfc1918). 

If your organization uses a public IP address range for private networks, Azure Firewall will SNAT the traffic to one of the firewall private IP addresses in AzureFirewallSubnet. You can configure Azure Firewall to **not** SNAT your public IP address range. For more information, see [Azure Firewall SNAT private IP address ranges](snat-private-range.md).

## Inbound DNAT support

Inbound Internet network traffic to your firewall public IP address is translated (Destination Network Address Translation) and filtered to the private IP addresses on your virtual networks.

## Multiple public IP addresses

You can associate [multiple public IP addresses](deploy-multi-public-ip-powershell.md) (up to 250) with your firewall.

This enables the following scenarios:

- **DNAT** - You can translate multiple standard port instances to your backend servers. For example, if you have two public IP addresses, you can translate TCP port 3389 (RDP) for both IP addresses.
- **SNAT** - Additional ports are available for outbound SNAT connections, reducing the potential for SNAT port exhaustion. At this time, Azure Firewall randomly selects the source public IP address to use for a connection. If you have any downstream filtering on your network, you need to allow all public IP addresses associated with your firewall. Consider using a [public IP address prefix](../virtual-network/public-ip-address-prefix.md) to simplify this configuration.

## Azure Monitor logging

All events are integrated with Azure Monitor, allowing you to archive logs to a storage account, stream events to your Event Hub, or send them to Azure Monitor logs. For more information, see [Tutorial: Monitor Azure Firewall logs and metrics](tutorial-diagnostics.md).

## Forced tunneling

You can configure Azure Firewall to route all Internet-bound traffic to a designated next hop instead of going directly to the Internet. For example, you may have an on-premises edge firewall or other network virtual appliance (NVA) to process network traffic before it's passed to the Internet. For more information, see [Azure Firewall forced tunneling](forced-tunneling.md).

## Certifications

Azure Firewall is Payment Card Industry (PCI), Service Organization Controls (SOC), International Organization for Standardization (ISO), and ICSA Labs compliant. For more information, see [Azure Firewall compliance certifications](compliance-certifications.md).


## Known issues

Azure Firewall has the following known issues:

|Issue  |Description  |Mitigation  |
|---------|---------|---------|
Network filtering rules for non-TCP/UDP protocols (for example ICMP) don't work for Internet bound traffic|Network filtering rules for non-TCP/UDP protocols don't work with SNAT to your public IP address. Non-TCP/UDP protocols are supported between spoke subnets and VNets.|Azure Firewall uses the Standard Load Balancer, [which doesn't support SNAT for IP protocols today](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview). We're exploring options to support this scenario in a future release.|
|Missing PowerShell and CLI support for ICMP|Azure PowerShell and CLI don't support ICMP as a valid protocol in network rules.|It's still possible to use ICMP as a protocol via the portal and the REST API. We're working to add ICMP in PowerShell and CLI soon.|
|FQDN tags require a protocol: port to be set|Application rules with FQDN tags require port: protocol definition.|You can use **https** as the port: protocol value. We're working to make this field optional when FQDN tags are used.|
|Moving a firewall to a different resource group or subscription isn't supported|Moving a firewall to a different resource group or subscription isn't supported.|Supporting this functionality is on our road map. To move a firewall to a different resource group or subscription, you must delete the current instance and recreate it in the new resource group or subscription.|
|Threat intelligence alerts may get masked|Network rules with destination 80/443 for outbound filtering masks threat intelligence alerts when configured to alert only mode.|Create outbound filtering for 80/443 using application rules. Or, change the threat intelligence mode to **Alert and Deny**.|
|Azure Firewall uses Azure DNS only for name resolution|Azure Firewall resolves FQDNs using Azure DNS only. A custom DNS server isn't supported. There's no impact on DNS resolution on other subnets.|We're working to relax this limitation.|
|Azure Firewall DNAT doesn't work for private IP destinations|Azure Firewall DNAT support is limited to Internet egress/ingress. DNAT doesn't currently work for private IP destinations. For example, spoke to spoke.|This is a current limitation.|
|Can't remove first public IP configuration|Each Azure Firewall public IP address is assigned to an *IP configuration*.  The first IP configuration is assigned during the firewall deployment, and typically also contains a reference to the firewall subnet (unless configured explicitly differently via a template deployment). You can't delete this IP configuration because it would de-allocate the firewall. You can still change or remove the public IP address associated with this IP configuration if the firewall has at least one other public IP address available to use.|This is by design.|
|Availability zones can only be configured during deployment.|Availability zones can only be configured during deployment. You can't configure Availability Zones after a firewall has been deployed.|This is by design.|
|SNAT on inbound connections|In addition to DNAT, connections via the firewall public IP address (inbound) are SNATed to one of the firewall private IPs. This requirement today (also for Active/Active NVAs) to ensure symmetric routing.|To preserve the original source for HTTP/S, consider using [XFF](https://en.wikipedia.org/wiki/X-Forwarded-For) headers. For example, use a service such as [Azure Front Door](../frontdoor/front-door-http-headers-protocol.md#front-door-to-backend) or [Azure Application Gateway](../application-gateway/rewrite-http-headers.md) in front of the firewall. You can also add WAF as part of Azure Front Door and chain to the firewall.
|SQL FQDN filtering support only in proxy mode (port 1433)|For Azure SQL Database, Azure SQL Data Warehouse, and Azure SQL Managed Instance:<br><br>During the preview, SQL FQDN filtering is supported in proxy-mode only (port 1433).<br><br>For Azure SQL IaaS:<br><br>If you're using non-standard ports, you can specify those ports in the application rules.|For SQL in redirect mode (the default if connecting from within Azure), you can instead filter access using the SQL service tag as part of Azure Firewall network rules.
|Outbound traffic on TCP port 25 isn't allowed| Outbound SMTP connections that use TCP port 25 are blocked. Port 25 is primarily used for unauthenticated email delivery. This is the default platform behavior for virtual machines. For more information, see more [Troubleshoot outbound SMTP connectivity issues in Azure](../virtual-network/troubleshoot-outbound-smtp-connectivity.md). However, unlike virtual machines, it isn't currently possible to enable this functionality on Azure Firewall. Note: to allow authenticated SMTP (port 587) or SMTP over a port other than 25, please make sure you configure a network rule and not an application rule as SMTP inspection is not supported at this time.|Follow the recommended method to send email, as documented in the SMTP troubleshooting article. Or, exclude the virtual machine that needs outbound SMTP access from your default route to the firewall. Instead, configure outbound access directly to the internet.
|Active FTP isn't supported|Active FTP is disabled on Azure Firewall to protect against FTP bounce attacks using the FTP PORT command.|You can use Passive FTP instead. You must still explicitly open TCP ports 20 and 21 on the firewall.
|SNAT port utilization metric shows 0%|The Azure Firewall SNAT port utilization metric may show 0% usage even when SNAT ports are used. In this case, using the metric as part of the firewall health metric provides an incorrect result.|This issue has been fixed and rollout to production is targeted for May 2020. In some cases, firewall redeployment resolves the issue, but it's not consistent. As an intermediate workaround, only use the firewall health state to look for *status=degraded*, not for *status=unhealthy*. Port exhaustion will show as *degraded*. *Not healthy* is reserved for future use when the are more metrics to impact the firewall health.
|DNAT isn't supported with Forced Tunneling enabled|Firewalls deployed with Forced Tunneling enabled can't support inbound access from the Internet because of asymmetric routing.|This is by design because of asymmetric routing. The return path for inbound connections goes via the on-premises firewall, which hasn't seen the connection established.
|Outbound Passive FTP doesn't work for Firewalls with multiple public IP addresses|Passive FTP establishes different connections for control and data channels. When a Firewall with multiple public IP addresses sends data outbound, it randomly selects one of its public IP addresses for the source IP address. FTP fails when data and control channels use different source IP addresses.|An explicit SNAT configuration is planned. In the meantime, consider using a single IP address in this situation.|
|NetworkRuleHit metric is missing a protocol dimension|The ApplicationRuleHit metric allows filtering based protocol, but this capability is missing in the corresponding NetworkRuleHit metric.|A fix is being investigated.|
|NAT rules with ports between 64000 and 65535 are unsupported|Azure Firewall allows any port in the 1-65535 range in network and application rules, however NAT rules only support ports in the 1-63999 range.|This is a current limitation.
|Configuration updates may take five minutes on average|An Azure Firewall configuration update can take three to five minutes on average, and parallel updates aren't supported.|A fix is being investigated.|
|Azure Firewall uses SNI TLS headers to filter HTTPS and MSSQL traffic|If browser or server software does not support the Server Name Indicator (SNI) extension, you won't be able to connect through Azure Firewall.|If browser or server software does not support SNI, then you may be able to control the connection using a network rule instead of an application rule. See [Server Name Indication](https://wikipedia.org/wiki/Server_Name_Indication) for software that supports SNI.

## Next steps

- [Tutorial: Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal.md)
- [Deploy Azure Firewall using a template](deploy-template.md)
- [Create an Azure Firewall test environment](scripts/sample-create-firewall-test.md)
