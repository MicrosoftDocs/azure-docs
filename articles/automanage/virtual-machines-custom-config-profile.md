---
title: Create a custom configuration profile in Azure Automanage for VMs
description: Get started with your deployments by learning how to quickly enable Automanage for VMs on a new or existing VM in the Azure portal.
author: DavidCBerry13
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: how-to
ms.date: 08/31/2020
ms.author: daberry
---


# Create a custom configuration profile in Azure Automanage for VMs

Get started with Azure Automanage for virtual machines by using the Azure portal to enable automanagement on a new or existing virtual machines.


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
1. Under **Configuration profile**, click **Browse and change profiles and preferences**
1. On the **Select configuration profile + preferences** blade:
    1. Select a profile on left hand side: *DevTest* for testing, *Prod* for production
    1. On the chosen profile, under **Configuration preferences** there is a dropdown where you can adjust for certain services
    1. Click **Create new**
    1. In the **Create a configuration preference** blade, fill out the Basics tab:
        1. Subscription
        1. Resource group
        1. Preference name
        1. Region
        1. Configuration type (*DevTest* for testing, *Production* for production)
    1. Go to the Preferences tab and adjust the configuration preferences you want to change while still fitting into flex your preferences within upper and lower bound that does not breach our definition of best practices.
        1. Frequency (Daily / Weekly)
        1. Days
        1. Time
        1. Timezone
        1. Etc. (more will be added…)
    1. Go to the Review + create tab and review your configuration profile
    1. Click the **Create** button 
1. Click the **Enable** button


Simplest path:
Enable on existing VM > select checkbox next to VM(s) name > click Select button > leave the Configuration profile as the default (either DevTest or Production, will show the last profile you used – make a note of this) > click Enable



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
