---
title: 'Common issues seen with Azure Virtual Network Manager'
description: Learn about common issues seen when using Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 3/22/2023
ms.custom: template-concept, ignite-fall-2021
---

# Common issues seen with Azure Virtual Network Manager

In this article, we cover common issues you may face when using Azure Virtual Network Manager and provide some possible solutions.

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub and spoke connectivity configurations. 
>
> Mesh connectivity configurations and security admin rules remain in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Why isn't my configuration getting applied? 

**Common reasons for configurations not being applied:** 

* The configuration isn't deployed to the regions where virtual networks are located. 

* You haven't deployed the configuration yet. You need to deploy the configuration to have it take effect. 

* The configuration didn't have enough time to effect. The time it takes for the configuration to apply after you commit the configuration is around 15-20 minutes. When there's an update to your network group membership, it would take about 10 minutes for the changes to reflect. 

## I updated my configuration, but the changes aren't reflected in my environment. 

You need to deploy the new configuration after the configuration is modified. 

## Why is my connectivity configuration not working? 

**You'll need to consider the following items:** 

* In a hub-and-spoke topology, if you enable the option to *use the hub as a gateway*, you need to have a gateway in the hub virtual network. Otherwise, the creation of the virtual network peering between the hub and the spoke virtual networks fails. 

* If you want to have members in the network group to communicate with each other across regions in a hub and spoke topology configuration, you need to enable the global mesh option. 

## Next steps

See [Azure Virtual Network Manager FAQ](faq.md), for answers to frequently asked questions.
