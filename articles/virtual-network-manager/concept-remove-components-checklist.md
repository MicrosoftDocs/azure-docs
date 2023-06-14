---
title: 'Removing Azure Virtual Network Manager components checklist'
description: This article is a checklist for deleting components within Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 03/15/2023
ms.custom: ignite-fall-2021
---

# Remove and update Azure Virtual Network Manager components checklist

In this article, you see a checklist of steps you need to complete to remove or update a configuration component of Azure Virtual Network Manager.

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub and spoke connectivity configurations. 
>
> Mesh connectivity configurations and security admin rules remain in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## <a name="remove"></a>Remove components checklist

| Action | Steps | 
| ------ | ----- |
| Undeploy a connectivity configuration deployment | Deploy a **None** connectivity configuration to target regions. |
| Undeploy a security admin configuration deployment | Deploy a **None** connectivity configuration to target regions. |
| Remove a security admin rule | 1. Undeploy the security admin configuration deployment. </br> 2. Delete security admin rules associated with the security configuration. |
| Remove a security rule collection | 1. Undeploy the security admin configuration deployment. </br> 2. Delete security admin rules associated with the security configuration. </br> 3. Delete the rule collection. |
| Remove a security admin configuration | 1. Undeploy the security admin configuration deployment. </br> 2. Delete security admin rules associated with the security configuration. </br> 3. Delete the rule collection. </br> 4. Delete the security admin configuration. |
| Remove a connectivity configuration | 1. Undeploy connectivity configuration deployment. </br> 2. Delete the connectivity configuration. |
| Remove a network group | 1. Delete the connectivity configuration associated with this network group </br> 2. Delete all security rules associated with the network group. </br> 3. Delete any Policy resources attached to the network group. </br> 4. Delete the network group. |
| Delete the Azure Virtual Network Manager instance | 1. Delete all connectivity and security admin configurations. </br> 2. Delete all network groups. </br> 3. Delete the Azure Virtual Network Manager instance. |

## Update components checklist

The information presented in this table assumes you have a connectivity or security admin configuration deployed to a target region.

| Action | Steps |
| ------ | ----- |
| Add or remove a virtual network using static membership | Modify the network group's static membership by adding or deleting a virtual network. |
| Add a virtual network using Azure Policy | 1. Create/Update a definition with a conditional that includes your resource.  </br> 2. Assign definition to a scope that includes your resource |
| Remove a virtual network using Azure Policy | 1. Modify the policy definition condition that includes your virtual network so the virtual network is no longer meets the condition, or deactivate the policy definition by deleting the Assignment resource.  </br> 2. If a virtual network is added to the network group by multiple sources, all sources must be removed before the virtual network can leave the network group. |
| Add, remove, or update configurations | 1. Make the necessary changes to your configuration resources. </br> 2. Redeploy your configuration and goal state to each region. |
## Next steps

Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.
