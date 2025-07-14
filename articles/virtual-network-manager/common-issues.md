---
title: 'Common issues seen with Azure Virtual Network Manager'
description: Learn about common issues with Azure Virtual Network Manager and how to resolve them quickly. Find solutions and troubleshoot effectively.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 07/11/2025
ms.custom: template-concept
---

# Common issues seen with Azure Virtual Network Manager

This article describes common issues with Azure Virtual Network Manager and provides solutions to help you quickly troubleshoot and resolve them.

## Configuration changes aren't applied 

The following are some common reasons why your configuration changes aren't applied:

### The configuration isn't deployed

You must deploy the configuration to your desired regions that contain your intended virtual networks after you create or modify the configuration. The configuration is only applied to the virtual networks after the configuration is deployed to the regions of those virtual networks.

To resolve this issue, you need to [deploy the configuration](./concept-deployments.md) after you create or modify the configuration.

### Updated configuration changes aren't reflected in my virtual network

Upon modifying your configuration, you must deploy the configuration again in the desired regions for those changes to take effect. 

### The configuration isn't deployed to the region where the virtual network is located

Verify the region where the virtual network is located is a part of the region set where you deployed your configuration. To take effect, the configuration must be deployed to the region where the virtual network is located. If you have a virtual network in a region that isn't targeted by the configuration's deployment, the configuration isn't applied to that virtual network.

To resolve this issue, you need to [deploy the configuration](./concept-deployments.md) to the region where the virtual network is located.

### Configuration changes didn't have enough time to apply

You need to wait for the configuration changes to finish deploying. Upon deployment, it can take up to 15-20 minutes for configuration changes to apply across the virtual networks in your targeted regions. When there's an update to your network group membership, it can take about 10 minutes for the appropriate configuration changes to reflect.


## Connectivity configuration isn't working as expected 

The following are some common reasons why your connectivity configuration isn't working as expected:

### The virtual network peering creation fails

In a hub-and-spoke topology, if you enable the option to *use the hub as a gateway*, you need to have a gateway in the hub virtual network. Otherwise, the creation of the virtual network peering between the hub and the spoke virtual networks fails. 

### Members in the network group can't communicate with each other

If you want to have members in the network group communicate with each other across regions, you need to enable the global mesh option.

In a hub-and-spoke topology, if you want the members of your spoke network group to communicate with each other, you need to enable the direct connectivity option. This option connects the members of a spoke network group among each other without going through the hub virtual network. If your topology contains multiple spoke network groups, it's important to note that this direct connectivity option only enables connectivity *within* each network group, meaning cross-network group communication is *not* established.

## Next steps

- [Azure Virtual Network Manager overview](overview.md)
- [Azure Virtual Network Manager FAQ](faq.md)

