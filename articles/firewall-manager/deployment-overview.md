---
title: Azure Firewall Manager deployment overview
description: Learn the high-level deployment steps required for Azure Firewall Manager
author: vhorne
ms.service: firewall-manager
services: firewall-manager
ms.topic: overview
ms.date: 06/30/2020
ms.author: victorh
---

# Azure Firewall Manager deployment overview

There's more than one way to deploy Azure Firewall Manager, but the following general process is recommended.

## General deployment process

### Hub virtual networks

1.	Create a firewall policy

    - Create a new policy
<br>*or*<br>
    - Derive a base policy and customize a local policy
<br>*or*<br>
    - Import rules from an existing Azure Firewall. Make sure to remove NAT rules from policies that should be applied across multiple firewalls
1. Create your hub and spoke architecture
   - Create a Hub Virtual Network using Azure Firewall Manager and peer spoke virtual networks to it using virtual network peering
<br>*or*<br>
    - Create a virtual network and add virtual network connections and peer spoke virtual networks to it using virtual network peering

3. Select security providers and associate firewall policy. Currently, only Azure Firewall is a supported provider.

   - This is done while you create a Hub Virtual Network
<br>*or*<br>
    - Convert an existing virtual network to a Hub Virtual Network. It is also possible to convert multiple virtual networks.

4. Configure User Define Routes to route traffic to your Hub Virtual Network firewall.


### Secured virtual hubs

1. Create your hub and spoke architecture

   - Create a Secured Virtual Hub using Azure Firewall Manager and add virtual network connections.<br>*or*<br>
   - Create a Virtual WAN Hub and add virtual network connections.
2. Select security providers

   - Done while creating a Secured Virtual Hub.<br>*or*<br>
   - Convert an existing Virtual WAN Hub to Secure Virtual Hub.
3. Create a firewall policy and associate it with your hub

   - Applicable only if using Azure Firewall.
   - Third-party security as a service (SECaaS) policies are configured via partners management experience.
4. Configure route settings to route traffic to your secured hub

   - Easily route traffic to your secured hub for filtering and logging without User Defined Routes (UDR) on spoke Virtual Networks using the Secured Virtual Hub Route Setting page.

> [!NOTE]
> - You can't have more than one hub per virtual wan per region. But you can add multiple virtual WANs in the region to achieve this.
> - You can't have overlapping IP spaces for hubs in a vWAN.
> - Your hub VNet connections must be in the same region as the hub.

## Next steps

- [Tutorial: Secure your cloud network with Azure Firewall Manager using the Azure portal](secure-cloud-network.md)