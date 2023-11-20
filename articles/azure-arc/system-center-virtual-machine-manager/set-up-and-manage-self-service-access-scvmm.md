---
title: Set up and manage self-service access to SCVMM resources
description: Learn how to switch to the new preview version and use its capabilities
ms.service: azure-arc
ms.subservice: azure-arc-scvmm
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.topic: how-to 
ms.date: 10/18/2023
keywords: "VMM, Arc, Azure"
---

# Set up and manage self-service access to SCVMM resources

Once your SCVMM resources are enabled in Azure, as a final step, provide your teams with the required access for a self-service experience. This article describes how to use built-in roles to manage granular access to SCVMM resources through Azure Role-based Access Control (RBAC) and allow your teams to deploy and manage VMs.

## Prerequisites

- Your SCVMM instance must be connected to Azure Arc.
- Your SCVMM resources such as virtual machines, clouds, VM networks and VM templates must be Azure enabled.
- You must have **User Access Administrator** or **Owner** role at the scope (resource group/subscription) to assign roles to other users.

## Provide access to use Arc-enabled SCVMM resources

To provision SCVMM VMs and change their size, add disks, change network interfaces, or delete them, your users need to have permission on the compute, network, storage, and to the VM template resources that they will use. These permissions are provided by the built-in Azure Arc SCVMM Private Cloud User role.

You must assign this role to an individual cloud, VM network, and VM template that a user or a group needs to access.

1. Go to the [SCVMM management servers (preview)](https://ms.portal.azure.com/#view/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/~/scVmmManagementServer) list in Arc center.
2. Search and select your SCVMM management server.
3. Navigate to the **Clouds** in **SCVMM inventory** section in the table of contents.
4. Find and select the cloud for which you want to assign permissions. 
     This will take you to the Arc resource representing the SCVMM Cloud.
1. Select **Access control (IAM)** in the table of contents.
1. Select **Add role assignments** on the **Grant access to this resource**.
1. Select **Azure Arc ScVmm Private Cloud User** role and select **Next**.
1. Select **Select members** and search for the Microsoft Entra user or group that you want to provide access to.
1. Select the Microsoft Entra user or group name. Repeat this for each user or group to which you want to grant this permission.
1. Select **Review + assign** to complete the role assignment.
1. Repeat steps 3-9 for each VM network and VM template that you want to provide access to.

If you have organized your SCVMM resources into a resource group, you can provide the same role at the resource group scope.

Your users now have access to SCVMM cloud resources. However, your users will also need to have permission on the subscription/resource group where they would like to deploy and manage VMs.

## Provide access to subscription or resource group where VMs will be deployed

In addition to having access to SCVMM resources through the **Azure Arc ScVmm Private Cloud User** role, your users must have permissions on the subscription and resource group where they deploy and manage VMs.

The **Azure Arc ScVmm VM Contributor** role is a built-in role that provides permissions to conduct all SCVMM virtual machine operations.

1. Go to the [Azure portal](https://ms.portal.azure.com/#home).
2. Search and navigate to the subscription or resource group to which you want to provide access.
3. Select **Access control (IAM)** from the table of contents on the left.
4. Select **Add role assignments** on the **Grant access to this resource**.
5. Select **Azure Arc ScVmm VM Contributor** role and select **Next**.
6. Select the option **Select members**, and search for the Microsoft Entra user or group that you want to provide access to.
7. Select the Microsoft Entra user or group name. Repeat this for each user or group to which you want to grant this permission.
8. Select on **Review + assign** to complete the role assignment.

## Next steps

[Create an Azure Arc VM](https://learn.microsoft.com/azure/azure-arc/system-center-virtual-machine-manager/create-virtual-machine).