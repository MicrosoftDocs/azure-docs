---
title: 'Common issues seen with Azure Virtual Network Manager'
description: Learn about common issues with Azure Virtual Network Manager and how to resolve them quickly. Find solutions and troubleshoot effectively.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 05/06/2025
ms.custom: template-concept
---

# Common issues seen with Azure Virtual Network Manager

This article describes common issues with Azure Virtual Network Manager and provides solutions to help you quickly troubleshoot and resolve them.

## Configuration changes aren't applied 

These are some common reasons why your configuration changes aren't applied:


### The configuration isn't applied to the regions where virtual networks are located.

You need to check the regions where the virtual networks are located. The configuration is only applied to the regions where the virtual networks are located. If you have a virtual network in a region that isn't included in the configuration, the configuration isn't applied to that virtual network.

To resolve this issue, you need to add the region where the virtual network is located to the configuration. 

### Configuration isn't deployed

You need to deploy the configuration after the configuration is created or modified. The configuration is only applied to the virtual networks after the configuration is deployed.

To resolve this issue, you need to deploy the configuration after the configuration is created or modified.

### Configuration changes didn't have enough time to apply

You need to wait for the configuration changes to apply. The time it takes for the configuration changes to apply after you commit the configuration is around 15-20 minutes. When there's an update to your network group membership, it would take about 10 minutes for the changes to reflect.

### Updated configuration changes aren't reflected in Azure Virtual Network Manager

You need to deploy the new configuration after the configuration is modified. 

## Connectivity configuration isn't working as expected 

Here are common reasons why your connectivity configuration isn't working as expected:

### The virtual network peering creation fails

In a hub-and-spoke topology, if you enable the option to *use the hub as a gateway*, you need to have a gateway in the hub virtual network. Otherwise, the creation of the virtual network peering between the hub and the spoke virtual networks fails. 

### Members in the network group can't communicate with each other

If you want to have members in the network group to communicate with each other across regions in a hub and spoke topology configuration, you need to enable the global mesh option. 

## Next steps

- [Azure Virtual Network Manager overview](overview.md)
- [Azure Virtual Network Manager FAQ](faq.md)

