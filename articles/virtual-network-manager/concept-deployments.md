---
title: 'Configuration deployments in Azure Virtual Network Manager (Preview)'
description: Learn about how configuration deployments work in Azure Virtual Network Manager.
author: mbender-ms    
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 06/09/2022
ms.custom: template-concept, ignite-fall-2021
---

# Configuration deployments in Azure Virtual Network Manager (Preview)

In this article, you'll learn about how configurations are applied to your network resources. You'll also explore how updating a configuration deployment is different for each membership type. Then we'll go into details about *Deployment status* and *Goal state model*.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Deployment

*Deployment* is the method Azure Virtual Network Manager uses to apply configurations to your virtual networks in network groups. Configurations won't take effect until they are deployed. Changes to network groups, including events such as removal and addition of a virtual network into a network group, will take effect without the need of re-deployment. When committing a deployment, you select the region(s) to which the configuration will be applied. When a deployment request is sent to Azure Virtual Network Manager, it will calculate the [goal state](#goalstate) of network resources and request the necessary changes to your infrastructure. The changes can take about 15-20 minutes depending on how large the configuration is.

## <a name="deployment"></a>Deployment against network group membership types

Changing the definition of a network group won't have an impact unless the configuration using this network group is deployed. As such, deployment updates are different for static and dynamic group members in a network group. When you have dynamic group membership defined, such as all virtual networks whose name contains "production", Azure Virtual Network Manager will automatically determine if the dynamic members meet the requirements of the configuration and adjust without you needing to deploy the configuration again. This is because you already defined the condition of the membership, and the definition didn't change. However, if you have virtual networks that are added as static members, you'll need to deploy the configuration again for the changes to apply. For example, if you add a new virtual network as a static member, you'll need to deploy the configuration again to take effect.

## Deployment status

When you commit a configuration deployment, the API does a POST operation and you won't see the completion of the deployment afterward. Once the deployment request has been made, Azure Virtual Network Manager will calculate the goal state of your networks and request the underlying infrastructure to make the changes. You can see the deployment status on the *Deployment* page of the Virtual Network Manager.

:::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/deployment-in-progress.png" alt-text="Screenshot of deployment in progress in deployment list.":::

## <a name = "goalstate"></a> Goal state model

When you commit a deployment of configuration(s), you're describing the goal state of the configuration you want as an end result. For example, when you commit configurations named *Config1* and *Config2* into a region, these two configurations gets applied. If you decided to commit configuration named *Config1* and *Config3* into the same region, *Config2* would then be removed and *Config3* would be added. To remove all configurations, you would deploy a **None** configuration against the region(s) you no longer wish to have any configurations applied.

## Next steps

Learn how to [create an Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md).
