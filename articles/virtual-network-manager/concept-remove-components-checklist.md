---
title: 'Removing Azure Virtual Network Manager Preview components checklist'
description: This article is a checklist for deleting components within Azure Virtual Network Manager.
author: duongau
ms.author: duau
ms.service: virtual-network-manager
ms.topic: conceptual
ms.date: 11/02/2021
ms.custom: ignite-fall-2021
---

# Remove and update Azure Virtual Network Manager Preview components checklist

In this article, you'll see a checklist of steps you need to complete to remove or update a configuration component of Azure Virtual Network Manager Preview.

## <a name="remove"></a>Remove components checklist

| Action | Steps | 
| ------ | ----- |
| Undeploy a connectivity configuration deployment | Deploy a **None** connectivity configuration to target regions. |
| Undeploy a security admin configuration deployment | Deploy a **None** connectivity configuration to target regions. |
| Remove a security admin rule | 1. Undeploy the security admin configuration deployment. </br> 2. Delete security admin rules associated with the security configuration. |
| Remove a security rule collection | 1. Undeploy the security admin configuration deployment. </br> 2. Delete security admin rules associated with the security configuration. </br> 3. Delete the rule collection. |
| Remove a security admin configuration | 1. Undeploy the security admin configuration deployment. </br> 2. Delete security admin rules associated with the security configuration. </br> 3. Delete the rule collection. </br> 4. Delete the security admin configuration. |
| Remove a connectivity configuration | 1. Undeploy connectivity configuration deployment. </br> 2. Delete the connectivity configuration. |
| Remove a network group | 1. Delete the connectivity configuration associated with this network group </br> 2. Delete all security rules associated with the network group. </br> 3. Delete the network group. |
| Delete the Azure Virtual Network Manager instance | 1. Delete all connectivity and security admin configurations. </br> 2. Delete all network groups. </br> 3. Delete the Azure Virtual Network Manager instance. |

## Update components checklist

The information presented in this table assumes you have a connectivity or security admin configuration deployed to a target region.

| Action | Steps |
| ------ | ----- |
| Add or remove a virtual network using static membership | 1. Add the virtual network to the network group. </br> 2. Commit the connectivity or security configuration containing the network group. |
| Add or remove a virtual network using dynamic membership | Azure Virtual Network Manager will automatically make changes to match conditional statements. |
| Add, remove, or update security rules | * If the security configuration is applied to a network group containing static members, you'll need to deploy the configuration again to take effect. </br> * Network groups containing dynamic members are updated automatically. |
| Add, remove, or update rule collections | * If the security configuration is applied to a network group containing static members, you'll need to deploy the configuration again to take effect. </br> * Network groups containing dynamic members are updated automatically. |

## Next steps

Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance using the Azure portal.
