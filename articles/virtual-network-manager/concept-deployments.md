---
title: 'Manage Configuration Deployments in Azure Virtual Network Manager'
description: Learn how configuration deployments work in Azure Virtual Network Manager, and discover best practices to manage your network configurations effectively.
author: mbender-ms    
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 07/11/2025
---

# Manage configuration deployments in Azure Virtual Network Manager

Learn how configuration deployments in Azure Virtual Network Manager are applied to your network resources. Explore how updating a configuration deployment differs by network group membership type, and understand details about [deployment status](#deployment-status-and-monitoring) and the [goal state model](#goalstate).

## How deployment works

*Deployment* is the method Azure Virtual Network Manager uses to apply configurations to your network groups' virtual networks. Configurations don't take effect until they're deployed. When a deployment request is sent to Azure Virtual Network Manager, it calculates the [goal state](#goalstate) of all targeted resources under your network manager in the targeted regions. The goal state is a combination of deployed configurations and network group membership. Azure Virtual Network Manager applies the necessary changes to your resources' settings to achieve the desired goal state.

When committing a deployment, you select the regions where you want the selected configurations to apply. The time it takes for a deployment to complete depends on how large the configuration is. Once the virtual networks are members of a network group targeted by a configuration, deploying that configuration onto that network group can take a few minutes. This scenario includes adding or removing virtual networks to or from the targeted network group manually or conditionally with Azure Policy. Safe deployment practices recommend gradually rolling out changes on a per-region basis.

> [!IMPORTANT]
> For security admin and routing configurations, only one of each configuration can be deployed from a single network manager to a region at a time. However, multiple connectivity configurations can exist in a region. To deploy multiple sets of security admin rules or routing rules to a region, you can create multiple rule collections within those respective configurations.

## Deployment latency and timing

There are two factors in how quickly a deployment's configurations are applied and take effect: 

- The base time of applying a configuration is a few minutes.

- The time to update network group membership (and thus the members onto which active configurations are newly applied to or removed from) can vary.

For manually added members, the network group membership immediately updates. For conditionally added members where the scope is less than 1,000 subscriptions, the network group membership can take a few minutes to update. For conditionally added members in environments with more than 1,000 subscriptions, the network group gets notified by Azure Policy in a 24-hour window; after that notification, active configurations are applied to the updated network group members in a few minutes. Changes to network group membership take effect without the need for configuration redeployment.

For example, if a virtual network is newly added to a network group with an active configuration already deployed onto it in the same region as that new virtual network member, that virtual network automatically receives the configuration without manually deploying the configuration again.

## Deployment status and monitoring

When you commit a configuration deployment, the API forms a POST operation. Once the deployment request is made, Azure Virtual Network Manager calculates the goal state of your networks in the deployed regions and requests the underlying infrastructure to make the changes. You can see the deployment status on the *Deployment* page of your Azure Virtual Network Manager instance, or network manager.

:::image type="content" source="./media/tutorial-create-secured-hub-and-spoke/deployment-in-progress.png" alt-text="Screenshot of deployment in progress in deployment list.":::

### Deployment Status Visibility
The deployment status is visible on the Deployment page of your Azure Virtual Network Manager instance. This status reflects only the overall success or failure of the configuration deployment, not the individual resource-level (e.g., virtual network or subnet) results.
### Error Message Emission
Error messages are only populated when the deployment status is "Failed." If the deployment is successful, the error message field remains empty. This ensures customers focus on actionable errors and avoids confusion from internal or resource-level failures that do not impact the overall deployment.
### Error Message Content
For failed deployments, the error message should provide the reason for the failure.
### Resource-Level Monitoring
Detailed status for individual virtual networks or subnets, such as why a specific resource failed,  is available through deployment details and logs.

## <a name = "goalstate"></a> Goal state model

When you commit a deployment of configurations, you describe the goal state of your network manager in the targeted regions. This goal state is enforced during the next deployment. For example, when you commit configurations *Config1* and *Config2* into a region, these two configurations get applied and become the region's goal state. If you decided to commit configurations *Config1* and *Config3* into the same region, *Config2* would then be removed, and *Config3* would be added. To remove all configurations, you would deploy **None** to the regions where you no longer wish to have any configurations applied.

You may have multiple connectivity configurations deployed simultaneously in a given region. The connectivity defined in each configuration is additive. If you modify one configuration, under this goal state model you must still deploy all connectivity configurations you want to take effect in that region. For example, given the *East US* region has *Config1* and *Config2* deployed there, if you modify *Config1*, you must deploy both *Config1* and *Config2* again in *East US* in order for both the changes from *Config1* and the behavior from *Config2* to take effect on the virtual networks in the region.

## Configuration availability

A network manager is available in a region as long as the region is up and running. Should a region with a network manager go down, the network manager is no longer available to submit new configuration deployments or modify existing configurations. However, the configurations that were deployed to the targeted network groups' virtual networks in the targeted regions are still in effect unless those virtual networks are in the region that went down.

For example, if a network manager exists in *regionA* and has deployed configurations onto virtual networks in *regionB*, those configurations are still in effect even if *regionA* goes down. However, you won't be able to create new, modify existing, or deploy configurations from the network manager in *regionA*. As another example, if *regionB* goes down, those configurations are no longer in effect. In this case, further deployments to virtual networks in *regionB* won't be successful.

## Next steps

- Learn how to [create an Azure Virtual Network Manager instance](create-virtual-network-manager-portal.md) in the Azure portal.
- Deploy an [Azure Virtual Network Manager](create-virtual-network-manager-terraform.md) instance using Terraform.
