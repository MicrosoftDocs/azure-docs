---
title: Azure Monitor network requirements
description: Azure Monitor network requirements
ms.topic: conceptual
ms.date: 07/27/2021
author: noakup
ms.author: noakuper
---

# Azure Monitor network requirements

[Azure Monitor](../overview.md) is comprised of a number of products - Metrics, Application Insights Logs and Log Analytics - hosted on Azure and available for use from customer environments. In essence, you can ingest and query monotiroing data from any source through various Azure Monitor endpoints.

Setting network access from your environment to Azure Monitor endpoints can be done in different ways. In this article we review all Azure Monitor endpoints and how you can set your environments to access them in a secure, sustainable manner.

## Setting up access to Azure Monitor endpoints
Intro - 
* Public vs Private access 
* Service tags vs specific IPs
* Can FW set access to endpoint names (instead of IPs)?

## List of endpoints
* List of endpoints
* Reference to [IP addresses used by Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/app/ip-addresses).

## Implement security for internal traffic
Azure Monitor resources are not deploy into a virtual network, but can be accessed from clients on virtual networks. In order to control network access to your Azure Monitor resources, we recommend using [Private Links](https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security) from your VNets, and [carefully setting the needed access to each resource](https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security#configure-access-to-your-resources). To complement that, you should use additional means to control traffic from your VNet, such as security groups and a firewall.

Azure Monitor should be configured to use TLS 1.2, this configuration can be configured on all clients interacting with Azure Monitor resources, and specifically on agents, as explained [here](https://docs.microsoft.com/azure/azure-monitor/logs/data-security#sending-data-securely-using-tls-12). Azure Monitor still supports some legacy protocols for backwards compatibility.

In terms of network access, communicating with your Log Analytics workspaces and Application Insights components requires outgoing traffic (from your network) to list of endpoints, typically over or ports 443 or 80. Some Application Insights features (such as Availability Tests) require inbound traffic (into your network). All requirements are detailed in [this article](https://docs.microsoft.com/azure/azure-monitor/app/ip-addresses). Agent specific requirements are detailed [here](https://docs.microsoft.com/azure/azure-monitor/agents/log-analytics-agent#firewall-requirements).

## Connect private networks together
Use Azure ExpressRoute or Azure virtual private network (VPN) to create private connections between Azure datacenters and on-premises infrastructure in a colocation environment. ExpressRoute connections do not go over the public internet, and they offer more reliability, faster speeds, and lower latencies than typical internet connections. For point-to-site VPN and site-to-site VPN, you can connect on-premises devices or networks to a virtual network using any combination of these VPN options and Azure ExpressRoute.

To connect two or more virtual networks in Azure together, use virtual network peering. Network traffic between peered virtual networks is private and is kept on the Azure backbone network. Once you have your networks peered, we recommend that you use a Private Link to communicate with your Azure Monitor resources privately. See [Planning your Private Link setup](https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security#planning-your-private-link-setup) to plan how it applied to your network topology.

What are the ExpressRoute connectivity models: https://docs.microsoft.com/azure/expressroute/expressroute-connectivity-models 

Azure VPN overview: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways 

Virtual network peering: https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview 

## Establish private network access to Azure services
Azure Monitor can be used to monitor resources on private networks, such as VMs on Azure VNets with no public internet access, or on-premises resources connecting to such VNets. Our recommendation is to use [Private Links](https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security) to create a private, secure, direct connection from your VNet to your Azure monitor resources specific monitoring resources (i.e. Log Analytics workspaces and Application Insights components). Private access is an additional defense in depth measure in addition to authentication and traffic security offered by Azure services.
Setting up a Private Link between your network and Azure Monitor means traffic from your network will reach Azure Monitor private endpoints, instead of the public ones. That covers queries, ingestion, configuration and installation endpoints, as detailed [here](https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security#review-and-validate-your-private-link-setup).
How Private Link should be deployed to your network depends on network topology, your DNS and specific needs. To plan accordingly, see [Planning your Private Link setup](https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security#planning-your-private-link-setup).

Note that can configure each of your monitoring resources to accept only private link connections or both Private Links and public connections, for either log ingestion or queries. See [Configure access to your resources](https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security) for more details.

Understand Azure Private Link: https://docs.microsoft.com/azure/private-link/private-link-overview 
Learn about Azure Monitor Private Links: https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security

## Protect applications and services from external network attacks
Azure Monitor resources are not deployed into a virtual network and aren't intended to run web applications. It doesn't require you to configure any additional settings or deploy any extra network services to protect it from external network attacks targeting your resources or web applications.
Note that you can still limit your Azure Monitor resources' exposure to only specific networks, by using [Azure Monitor Private Links](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/private-link-security) on your networks, and configuring your resources' Network Isolation settings as explained [here](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/private-link-security#configure-access-to-your-resources).

## Simplify network security rules
Azure Monitor can monitor resources deployed to your network. That means your network must allow outgoing traffic to Azure Monitor endpoints (such as log ingestion). We recommend using a [Private Link](https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security) between your network and your Azure Monitor resources. If you prefer not to use Private Links, your can still limit your network's outgoing traffic to Azure Monitor endpoints by using Azure Virtual Network Service Tags on network security groups or Azure Firewall. 

You can use service tags in place of specific IP addresses when creating security rules. By specifying the service tag name (For example: AzureMonitor) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.
The required Service Tags depend on the services you use (Log Analytics, Application Insights) and the exact features (such as availability tests). See [Available service tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview#available-service-tags) for detailed information.

* AzureMonitor (outbound). May also require additional service tags, such as Storage or GuestAndHybridManagement, see above link for details.
* AzureResourceManager (outbound). See also [Azure Monitor agent overview](https://docs.microsoft.com/azure/azure-monitor/agents/azure-monitor-agent-overview#networking), [Install the Azure Monitor agent](https://docs.microsoft.com/azure/azure-monitor/agents/azure-monitor-agent-install) and [Programmatic access](https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security#programmatic-access).
* AzureActiveDirectory (outbound). See also [Azure Portal](https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security#azure-portal) and [Programmatic access](https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security#programmatic-access).
* AzureFrontDoor.Frontend and AzureFrontDoor.FirstParty. See also [Azure Portal](https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security#azure-portal).
* ApplicationInsightsAvailability (inbound). See also [Private testing](https://docs.microsoft.com/azure/azure-monitor/app/availability-private-test).
* ActionGroup (inbound). See also [Action Group webhooks](https://docs.microsoft.com/azure/azure-monitor/app/ip-addresses#action-group-webhooks).

Service Tags overview: https://docs.microsoft.com/azure/virtual-network/service-tags-overview

## Secure Domain Name Service (DNS)
Typically, Azure Monitor doesn't require you to configure your DNS or manage it in any specific way. However, if you use Azure Monitor Private Links your DNS must be updated to include DNS zones that map the Azure Monitor endpoints to your private IP addresses. Updating the DNS can be done automatically when you configure your Private Endpoint (see section 5b [here](https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security#connect-to-a-private-endpoint)) or manually. To create the DNS zones manually, follow the guidance for [Azure Monitor in Azure services DNS zone configuration](https://docs.microsoft.com/azure/private-link/private-endpoint-dns#azure-services-dns-zone-configuration) and [Review and validate your Private Link setup](https://docs.microsoft.com/azure/azure-monitor/logs/private-link-security#review-and-validate-your-private-link-setup).

When Azure DNS is used as your authoritative DNS service, ensure DNS zones and records are protected from accidental or malicious
modification using Azure RBAC and resource locks.

Azure DNS overview: https://docs.microsoft.com/azure/dns/dns-overview 

Secure Domain Name System (DNS) Deployment Guide: https://csrc.nist.gov/publications/detail/sp/800-81/2/final 

Prevent dangling DNS entries and avoid subdomain takeover: https://docs.microsoft.com/azure/security/fundamentals/subdomain-takeover 