---
title: 'Removing Azure Virtual Network Manager components checklist'
description: This article is a checklist for deleting components within Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 07/11/2025
---

# Remove and update Azure Virtual Network Manager components checklist

This article provides a checklist of steps you need to complete to remove or update a configuration component of Azure Virtual Network Manager.

## <a name="remove"></a>Remove components checklist

| Action | Steps | 
| ------ | ----- |
| Undeploy a connectivity configuration deployment | Deploy a **None** connectivity configuration to target regions. |
| Undeploy a security admin configuration deployment | Deploy a **None** security admin configuration to target regions. |
| Undeploy a routing configuration deployment | Deploy a **None** routing configuration to target regions. |
| Remove a security admin rule | 1. Undeploy the security admin configuration deployment. </br> 2. Delete security admin rules associated with the security admin configuration. |
| Remove a security rule collection | 1. Undeploy the security admin configuration deployment. </br> 2. Delete security admin rules associated with the security admin configuration. </br> 3. Delete the rule collection. |
| Remove a security admin configuration | 1. Undeploy the security admin configuration deployment. </br> 2. Delete security admin rules associated with the security admin configuration. </br> 3. Delete the rule collection. </br> 4. Delete the security admin configuration. |
| Remove a routing rule | 1. Undeploy the routing configuration deployment. </br> 2. Delete routing rules associated with the routing configuration. |
| Remove a routing rule collection | 1. Undeploy the routing configuration deployment. </br> 2. Delete routing rules associated with the routing configuration. </br> 3. Delete the rule collection. |
| Remove a routing configuration | 1. Undeploy the routing configuration deployment. </br> 2. Delete routing rules associated with the routing configuration. </br> 3. Delete the rule collection. </br> 4. Delete the routing configuration. |
| Remove a connectivity configuration | 1. Undeploy the connectivity configuration deployment. </br> 2. Delete the connectivity configuration. |
| Remove a network group | 1. Delete the connectivity configuration associated with the network group </br> 2. Delete all security admin rules associated with the network group. </br> 3. Delete all routing rules associated with the network group. </br> 4. Delete any Azure Policy resources attached to the network group. </br> 5. Delete the network group. |
| Delete the Azure Virtual Network Manager instance | 1. Delete all connectivity, security admin, and routing configurations. </br> 2. Delete all network groups. </br> 3. Delete the Azure Virtual Network Manager instance. |

## Update components checklist

The information presented in this table assumes you have a connectivity, security admin, or routing configuration deployed to a target region.

| Action | Steps |
| ------ | ----- |
| Add or remove a virtual network to or from a network group manually | Modify the network group's membership by adding or deleting the virtual network. |
| Add a virtual network to a network group conditionally with Azure Policy | 1. Create or update the network group's associated policy definition with a condition that includes your desired virtual network. </br> 2. Assign the policy definition to a scope that includes your desired virtual network. |
| Remove a virtual network from a network group conditionally with Azure Policy | 1. Modify the network group's policy definition such that the virtual network no longer meets the conditions for membership. You can also deactivate the policy definition by deleting the policy assignment resource. </br> 2. If a virtual network is added to the network group by multiple sources, all sources must be removed before the virtual network can leave the network group. |
| Add, remove, or update configurations | 1. Make the necessary changes to your configurations. </br> 2. Redeploy your configuration and goal state to each desired region. |

## Next steps

[Create an Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.
