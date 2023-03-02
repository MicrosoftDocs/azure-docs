---
title: Enable Automanage for virtual machines through Azure Policy
description: Learn how to enable Azure Automanage for VMs through a built-in Azure Policy in the Azure portal.
author: ju-shim
ms.service: automanage
ms.workload: infrastructure
ms.topic: how-to
ms.date: 12/10/2021
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

## Direct link to Policy
There are two Automanage built-in policies: 
1. Built-in Automanage profiles (dev/test and production): The Automanage policy definition can be found in the Azure portal by the name of [Configure virtual machines to be onboarded to Azure Automanage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff889cab7-da27-4c41-a3b0-de1f6f87c550).
1. Custom configuration profiles: The Automanage policy definition can be found in the Azure portal by the name of [Configure virtual machines to be onboarded to Azure Automanage with Custom Configuration Profile](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb025cfb4-3702-47c2-9110-87fe0cfcc99b0).

If you click on this link, skip directly to step 8 in [Locate and assign the policy](#locate-and-assign-the-policy) below.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/).


## Locate and assign the policy

1. Navigate to **Policy** in the Azure portal
1. Go to the **Definitions** pane
1. Click the **Categories** dropdown to see the available options
1. Select the **Automanage** option
1. Now the list will update to show a built-in policy with a name that starts with *Configure virtual machines to be onboarded to Azure Automanage*
1. Click on the *Configure virtual machines to be onboarded to Azure Automanage* built-in policy name. Choose the *Configure virtual machines to be onboarded to Azure Automanage with Custom Configuration Profile* policy if you would like to use an Automanage custom profile. 
1. After clicking on the policy, you can now see the **Definition** tab

    > [!NOTE]
    > The Azure Policy definition is used to set Automanage parameters like the configuration profile. It also sets filters that ensure the policy applies only to the correct VMs.

1. Click the **Assign** button to create an Assignment
1. Under the **Basics** tab, fill out **Scope** by setting the *Subscription* and *Resource Group*

    > [!NOTE]
    > The Scope lets you define which VMs this policy applies to. You can set application at the subscription level or resource group level. If you set a resource group, all VMs that are currently in that resource group or any future VMs we add to it will have Automanage automatically enabled.

1. Click on the **Parameters** tab and set the **Configuration Profile** and the desired **Effect**
    > [!NOTE]
    > If you would like the policy to only apply to resources with a certain tag (key/value pair) you can add this into the "Inclusion Tag Name" and "Inclusion Tag Values". You need to uncheck the "Only show parameters that need input or review" to see this option. 
1. Under the **Review + create** tab, review the settings
1. Apply the Assignment by clicking **Create**
1. View your assignments in the **Assignments** tab next to **Definition**

> [!NOTE]
> It will take some time for that policy to begin taking effect on the VMs currently in the resource group or subscription.


## Next steps

Learn another way to enable Azure Automanage for virtual machines through the Azure portal.

> [!div class="nextstepaction"]
> [Enable Automanage for virtual machines in the Azure portal](quick-create-virtual-machines-portal.md)