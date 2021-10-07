---
title: 'Configuration deployments in Azure Virtual Network Manager (Preview)'
description: Learn about how configuration deployments work in Azure Virtual Network Manager.
author: duongau
ms.author: duau
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 11/02/2021
ms.custom: template-concept
---

# Configuration deployments in Azure Virtual Network Manager (Preview)

In this article you will learn about how configurations are applied to your network resources. You will also explore how updating a configuration deployment is different for each membership types. Then we'll go into details about *Deployment status* and *Goal state model*.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Deployment

*Deployment* is the method Azure Virtual Network Manager uses to apply configurations to your virtual networks in network groups. Changes made to network groups, connectivity and security admin configuration won't take effect unless a deployment has been committed. When committing a deployment, you select the region(s) to which the configuration will be applied to. When a deployment request is sent to AVNM, it will calculate the [goal state](#goalstate) of network resources and request the necessary changes to your infrastructure. The changes can take up to 15 minutes depending on how large the configuration is.

## <a name="deployment"></a>Deployment against network group membership types

Deployment updates are different for static and dynamic group members in a network group. With dynamic group members a goal state model is used. Azure Virtual Network Manager will automatically determine if the conditional virtual network members meet the requirements of the configuration and adjust accordingly without you needing to deploy the configuration again. However, if you have virtual networks added as static members to the network group you will need to deploy the configuration again to have the changes applied. For example, if you add a new virtual network as a static member you will need to deploy the configuration again to take affect.

## <a name = "goalstate"></a> Goal state model

When you commit a deployment of configuration(s), you're describing the goal state configuration(s) you want as an end result. For example, when you commit configurations named *Config1* and *Config2* into a region, these two configuration gets applied. If you decided to commit configuration named *Config1* and *Config3* into the same region, *Config2* would then be removed and *Config3* would be added. To remove all configurations, you would deploy a **None** configuration against region(s) you no longer wish to have any configurations applied.

## Next steps

Learn how to [create an Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md).