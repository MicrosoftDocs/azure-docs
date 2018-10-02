---
title: What is Azure Firewall?
description: Learn about Azure Firewall features.
author: vhorne
ms.service: firewall
services: firewall
ms.topic: overview
ms.custom: mvc
ms.date: 9/26/2018
ms.author: victorh
#Customer intent: As an administrator, I want to evaluate Azure Firewall so I can determine if I want to use it.
---
# What is Azure Firewall?

Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It is a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability. 

![Firewall overview](media/overview/firewall-overview.png)

You can centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks. Azure Firewall uses a static public IP address for your virtual network resources allowing outside firewalls to identify traffic originating from your virtual network.  The service is fully integrated with Azure Monitor for logging and analytics.

## Features

Azure Firewall offers the following features:

### Built-in high availability
High availability is built in, so no additional load balancers are required and there is nothing you need to configure.

### Unrestricted cloud scalability 
Azure Firewall can scale up as much as you need  to accommodate changing network traffic flows, so you don't need to budget for your peak traffic.

### Application FQDN filtering rules

You can limit outbound HTTP/S traffic to a specified list of fully qualified domain names (FQDN) including wild cards. This feature does not require SSL termination.

### Network traffic filtering rules

You can centrally create *allow* or *deny* network filtering rules by source and destination IP address, port, and protocol. Azure Firewall is fully stateful, so it can distinguish legitimate packets for different types of connections. Rules are enforced and logged across multiple subscriptions and virtual networks.

### FQDN tags

FQDN tags make it easy for you to allow well known Azure service network traffic through your firewall. For example, say you want to allow Windows Update network traffic through your firewall. You create an application rule and include the Windows Update tag. Now network traffic from Windows Update can flow through your firewall.

### Outbound SNAT support

All outbound virtual network traffic IP addresses are translated to the Azure Firewall public IP (Source Network Address Translation). You can identify and allow traffic originating from your virtual network to remote Internet destinations.

### Inbound DNAT support

Inbound network traffic to your firewall public IP address is translated (Destination Network Address Translation) and filtered to the private IP addresses on your virtual networks. 

### Azure Monitor logging

All events are integrated with Azure Monitor, allowing you to archive logs to a storage account, stream events to your Event Hub, or send them to Log Analytics.

## Known issues

Azure Firewall has the following known issues:


|Issue  |Description  |Mitigation  |
|---------|---------|---------|
|Conflict with Azure Security Center (ASC) Just-in-Time (JIT) feature|If a virtual machine is accessed using JIT, and is in a subnet with a user-defined route that points to Azure Firewall as a default gateway, ASC JIT doesn’t work. This is a result of asymmetric routing – a packet comes in via the virtual machine public IP (JIT opened the access), but the return path is via the firewall, which drops the packet because no session is established on the firewall.|To work around this issue, place the JIT virtual machines on a separate subnet that doesn’t have a user-defined route to the firewall.|
|Hub and spoke with global peering doesn’t work|The hub and spoke model, where the hub and firewall are deployed in one Azure region, with the spokes in another Azure region, connected to the hub via Global VNet Peering is not supported.|For more information, see [Create, change, or delete a virtual network peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering#requirements-and-constraints)|
Network filtering rules for non-TCP/UDP protocols (for example ICMP) don't work for Internet bound traffic|Network filtering rules for non-TCP/UDP protocols don’t work with SNAT to your public IP address. Non-TCP/UDP protocols are supported between spoke subnets and VNets.|Azure Firewall uses the Standard Load Balancer, [which doesn't support SNAT for IP protocols today](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-overview#limitations). We are exploring options to support this scenario in a future release.|
|Destination NAT (DNAT) doesn’t work for port 80 and 22.|Destination Port field in NAT rule collection cannot include port 80 or port 22.|We are working to fix this in the near future. Meanwhile, use any other port as the destination port in NAT rules. Port 80 or 22 can still be used as the translated port (for example, you can map public ip:81 to private ip:80).|
|Missing PowerShell and CLI support for ICMP|Azure PowerShell and CLI don’t support ICMP as a valid protocol in network rules.|It is still possible to use ICMP as a protocol via the portal and the REST API. We are working to add ICMP in PowerShell and CLI soon.|
|FQDN tags require a protocol: port to be set|Application rules with FQDN tags require port:protocol definition.|You can use **https** as the port: protocol value. We are working to make this field optional when FQDN tags are used.|
|Moving a firewall to a different resource group or subscription is not supported.|Moving a firewall to a different resource group or subscription is not supported.|Supporting this functionality is on our roadmap. To move a firewall to a different resource group or subscription, you must delete the current instance and recreate it in the new resource group or subscription.|

## Next steps

- [Tutorial: Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal.md)
- [Deploy Azure Firewall using a template](deploy-template.md)
- [Create an Azure Firewall test environment](scripts/sample-create-firewall-test.md)

