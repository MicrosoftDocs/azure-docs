---
title: Quickstart - Enable Azure Automanage for VMs in the Azure portal
description: Get started with your deployments by learning how to quickly enable Automanage for VMs on a new or existing VM in the Azure portal.
author: DavidCBerry13
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: quickstart
ms.date: 08/31/2020
ms.author: daberry
---


# Quickstart: Enable Azure Automanage for virtual machines in the Azure portal

Get started with Azure Automanage for virtual machines by using the Azure portal to enable automanagement on a new or existing virtual machine.


## Prerequisites

If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/) before you begin.

> [!NOTE]
> Free trial accounts do not have access to the virtual machines used in this tutorial. Please upgrade to a Pay-As-You-Go subscription.


## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/).


## Enable Automanage for VMs on an existing VM

1. In the search bar, search for and select **Automanage – virtual machines**
1. Select the **Enable on existing VM** button
1. On the **Select machines** blade:
    1. Set your **Subscription** and **Resource group**
    1. Check the checkbox of each virtual machine you want to onboard
    1. Click the **Select** button
1. Leave the **Configuration profile**, click **Browse and change profiles and preferences**
1. On the **Select configuration profile + preferences** blade:
    1. Select a profile on the left: *DevTest* for testing, *Prod* for production
    1. Click the **Select** button 
1. Click the **Enable** button


## Enable Automanage for VMs on a new VM
((waiting for final steps to be complete by engineering))



## Clean up resources

When no longer needed, you can delete the resource group, virtual machine, and all related resources. 

Select the resource group for the virtual machine, then select **Delete**. Confirm the name of the resource group to finish deleting the resources.

## Next steps

In this quickstart, you enabled Azure Automanage for VMs. 

Discover how you can create and apply a custom configuration profile when enabling Automanage on your virtual machine. 

> [!div class="nextstepaction"]
> [Azure Automanage for VMS - Custom configuration profile](virtual-machines-custom-config-profile.md)
