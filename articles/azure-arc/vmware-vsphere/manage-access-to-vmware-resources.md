---
title: Manage access to VMware resources through Azure Role-based Access Control
description: Learn how to manage access to VMware resources through Azure Role-based Access Control. 
ms.topic: how-to
ms.date: 10/10/2023
ms.service: azure-arc
ms.subservice: azure-arc-vmware-vsphere
author: Farha-Bano
ms.author: v-farhabano
manager: jsuri

---
In this article, you'll learn how to use built-in user roles to manage access to VMware resources through Azure Role-based Access Control.

## Azure Arc VMware user roles

The following table lists the user roles used to manage the granular access to Arc-enabled VMware vSphere resources through Azure Role-based Access Control:

| **User Role** | **Description**|
| --- | --- |
| Azure Arc VMware solution administrator role | Provides permissions to perform all the possible operations for the *Microsoft.ConnectedVMwarevSphere* resource provider. This role must be assigned to users or groups that are managing the deployment of Azure Arc-enabled VMware vSphere. |
| Azure Arc VMware private clouds onboarding role | Provides permissions to provision all the required resources for onboarding and deboarding vCenter instances to Azure. |
| Azure Arc VMware solution private cloud user role | Gives the user permission to use the Arc-enabled vSphere resources that are accessible through Azure. This role must be assigned to any users or groups that need to deploy, update, or delete VMs.</br> We recommend assigning this role at the individual resource pool (host or cluster), virtual network, or template that you want the user to deploy VMs with. |
| Azure Arc VMware solution VM contributor role | Gives the user permission to perform all VMware VM operations. This role must be assigned to any users or groups that need to deploy, update, or delete VMs. </br> We recommend assigning this role at the subscription level or resource group you want the user to deploy VMs with.|

[Create your own Azure custom roles](https://learn.microsoft.com/articles/role-based-access-control/custom-roles-portal.md) if the Azure built-in roles don't meet the specific needs of your organization.

## Next steps

[Create a VM using Azure Arc-enabled vSphere](quick-start-create-a-vm.md).
