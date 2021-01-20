---
title: Enable Automanage for virtual machines through Azure Policy
description: Learn how to enable Azure Automanage for VMs through a built-in Azure Policy in the Azure portal.
author: ju-shim
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: how-to
ms.date: 09/04/2020
ms.author: jushiman
---


# Enable Automanage for virtual machines through Azure Policy

If you want to enable Automanage for lots of VMs, you can do that using a built-in [Azure Policy](..\governance\azure-management.md). This article will walk you through finding the right policy and how to assign it in order to enable Automanage in the Azure portal.


## Prerequisites

If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/) before you begin.

> [!NOTE]
> Free trial accounts do not have access to the virtual machines used in this tutorial. Please upgrade to a Pay-As-You-Go subscription.

> [!IMPORTANT]
> The following Azure RBAC permission is needed to enable Automanage: **Owner** role or **Contributor** along with **User Access Administrator** roles.


## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/).


## Locate and assign the policy

1. Navigate to **Policy** in the Azure portal
1. Go to the **Definitions** pane
1. Click the **Categories** dropdown to see the available options
1. Select the **Enable Automanage – Azure virtual machine best practices** option
1. Now the list will update to show a built-in policy with a name that starts with *Enable Automanage…*
1. Click on the *Enable Automanage - Azure virtual machine best practices* built-in policy name
1. After clicking on the policy, you can now see the **Definition** tab

    > [!NOTE]
    > The Azure Policy definition is used to set Automanage parameters like the configuration profile or the account. It also sets filters that ensure the policy applies only to the correct VMs.

1. Click the **Assign** button to create an Assignment
1. Under the **Basics** tab, fill out **Scope** by setting the *Subscription* and *Resource Group*

    > [!NOTE]
    > The Scope lets you define which VMs this policy applies to. You can set application at the subscription level or resource group level. If you set a resource group, all VMs that are currently in that resource group or any future VMs we add to it will have Automanage automatically enabled. 

1. Click on the **Parameters** tab and set the **Automanage Account** and the desired **Configuration Profile** 
1. Under the **Review + create** tab, review the settings
1. Apply the Assignment by clicking **Create**
1. View your assignments in the **Assignments** tab next to **Definition**

> [!NOTE]
> It will take some time for that policy to begin taking effect on the VMs currently in the resource group or subscription.


## Next steps 

Learn another way to enable Azure Automanage for virtual machines through the Azure portal. 

> [!div class="nextstepaction"]
> [Enable Automanage for virtual machines in the Azure portal](quick-create-virtual-machines-portal.md)