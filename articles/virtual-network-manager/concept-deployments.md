---
title: 'Configuration deployments in Azure Virtual Network Manager'
description: Learn about how configuration deployments work in Azure Virtual Network Manager.
author: mbender-ms    
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 3/22/2023
ms.custom: template-concept
---

# Configuration deployments in Azure Virtual Network Manager

In this article, you learn about how configurations are applied to your network resources. Also, you explore how updating a configuration deployment is different for each membership type. Then we go into details about *Deployment status* and *Goal state model*.

[!INCLUDE [virtual-network-manager-preview](../../includes/virtual-network-manager-preview.md)]

## Deployment

*Deployment* is the method Azure Virtual Network Manager uses to apply configurations to your virtual networks in network groups. Configurations don't take effect until they're deployed. When a deployment request is sent to Azure Virtual Network Manager, it calculates the [goal state](#goalstate) of all resources under your network manager in that region. Goal state is a combination of deployed configurations and network group membership. Network manager applies the necessary changes to your infrastructure.

When committing a deployment, you select the region(s) to which the configuration applies. The length of time for a deployment depends on how large the configuration is.  Once the virtual networks are members of a network group, deploying a configuration onto that network group takes a few minutes. This includes adding or removing group members directly, or configuring an Azure Policy resource. Safe deployment practices recommend gradually rolling out changes on a per-region basis.

> [!IMPORTANT]
> Only one security configuration can be deployed to a region. However, multiple connectivity configurations can exist in a region. To deploy multiple security admin configurations to a region, you can create multiple rule collections in a security configuration, instead of creating multiple security admin configurations.

## Deployment latency

Deployment latency is the time it takes for a deployment configuration to be applied and take effect. There are two factors in how quickly the configurations are applied: 

- The base time of applying a configuration is a few minutes. 

- The time to receive a notification of network group membership can vary. 

For manually added members, notification is immediate. For dynamic members where the scope is less than 1000 subscriptions, notification takes a few minutes. In environments with more than 1000 subscriptions, the notification mechanism works in a 24-hour window. Changes to network groups take effect without the need for configuration redeployment.   

Virtual network manager applies the configuration to the virtual networks in the network group even if your network group consists of dynamic members from more than 1000 subscriptions. When the virtual network manager is notified of group membership, the configuration is applied in a few minutes. 

## Deployment status

When you commit a configuration deployment, the API does a POST operation. Once the deployment request has been made, Azure Virtual Network Manager calculates the goal state of your networks in the deployed regions and request the underlying infrastructure to make the changes. You can see the deployment status on the *Deployment* page of the Virtual Network Manager.

:::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/deployment-in-progress.png" alt-text="Screenshot of deployment in progress in deployment list.":::

## <a name = "goalstate"></a> Goal state model

When you commit a deployment of configuration(s), you're describing the goal state of your network manager in that region. This goal state is enforced during the next deployment. For example, when you commit configurations named *Config1* and *Config2* into a region, these two configurations get applied and become the region's goal state. If you decided to commit configuration named *Config1* and *Config3* into the same region, *Config2* would then be removed, and *Config3* would be added. To remove all configurations, you would deploy a **None** configuration against the region(s) you no longer wish to have any configurations applied.

## Next steps

- Learn how to [create an Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md) in the Azure portal.
- Deploy an [Azure Virtual Network Manager](create-virtual-network-manager-terraform.md) instance using Terraform.
