---
title: What is Azure Firewall?
description: Learn about Azure Firewall features.
author: vhorne
ms.service: firewall
ms.topic: overview
ms.custom: mvc
ms.date: 6/19/2018
ms.author: victorh
#Customer intent: As an administrator, I want to evaluate Azure Firewall so I can determine if I want to use it.
---
# What is Azure Firewall?

![Firewall overview](media/overview/firewall-overview.png)

Azure Firewall is a cloud-based network security service, providing filtering capabilities with built-in high availability, unrestricted cloud scalability and zero maintenance.

[!INCLUDE [firewall-preview-notice](../../includes/firewall-preview-notice.md)]

You can centrally create and enforce application and network connectivity policies to protect your Azure virtual network resources. It is fully integrated with the Azure platform, portal, and services.


## Features

The Azure Firewall public preview offers the following features:

### Built-in high availability
High availability is built in, so no additional load balancers are required and there is nothing you need to configure.

### Unrestricted cloud scalability 
Azure Firewall can scale up as much as you need  to accommodate changing network traffic flows, so you don't need to budget for your peak traffic.

### FQDN filtering 
You can limit outbound HTTP/S traffic to a specified list of fully qualified domain names (FQDN) including wild cards. This feature does not require SSL termination.

### Network traffic filtering rules

You can centrally create *allow* or *deny* network filtering rules by source and destination IP address, port, and protocol. Azure Firewall is fully stateful, so it can distinguish legitimate packets for different types of connections. Rules are enforced and logged across multiple subscriptions and virtual networks.

### Outbound SNAT support

All outbound virtual network traffic IP addresses are translated to the Azure Firewall public IP (Source Network Address Translation). You can identify and allow traffic originating from your virtual network to remote Internet destinations.

### Azure Monitor logging

All events are integrated with Azure Monitor, allowing you to archive logs to a storage account, stream events to your Event Hub, or send them to Log Analytics.

## Known issues

The Azure Firewall public preview has the following known issues:


|Issue  |Description  |Mitigation  |
|---------|---------|---------|
|Interoperability with NSGs     |If a network security group (NSG) is applied on the firewall subnet, it may block outbound Internet connectivity even if the NSG is configured to allow outbound internet access. Outbound Internet connections are marked as coming from a VirtualNetwork and the destination is Internet. A NSG has VirtualNetwork to VirtualNetwork *allow* by default, but not when destination is Internet.|To mitigate, add the following inbound rule to the NSG that is applied on the firewall subnet:<br><br>Source: VirtualNetwork Source ports: Any <br><br>Destination: Any Destination Ports: Any <br><br>Protocol: All Access: Allow|
|Access denied to blob.core.windows.net and  *win.data.microsoft.com|Windows VMs may generate https traffic to blob.core.windows.net which will be blocked by default. This will result in many Deny logs. These connections are initiated by These connections are initiated from the windows client by the following services.<br><br>- Windows Azure Guest Agent<br>-   Windows Azure Telemetry Service<br>-  RdAgent|Consider allowing these connections by adding *.blob.core.windows.net and *win.data.microsoft.com to your whitelist.|
|Delete does not wait|Service removal with or without keeping its configuration returns immediately before all backend components are removed. |Allow five minutes before creating a new firewall in the same VNet.|
|Hub and spoke with global peering doesn’t work|The hub and spoke model, where the hub and firewall are deployed in one Azure region, with the spokes in another Azure region, connected to the hub via Global VNet Peering is not supported.|For more infortmation, see [Create, change, or delete a virtual network peering](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-manage-peering#requirements-and-constraints)|



## Next steps

- [Tutorial: Configure Azure Firewall application and network rules using the Azure portal](tutorial-firewall-rules-portal.md)
- [Deploy Azure Firewall using a tempalte](deploy-template.md)

