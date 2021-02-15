---
title: Quickstart - Enable Azure Automanage for VMs in the Azure portal
description: Learn how to quickly enable Automanage for virtual machines on a new or existing VM in the Azure portal.
author: ju-shim
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: quickstart
ms.date: 09/04/2020
ms.author: jushiman
---


# Quickstart: Enable Azure Automanage for virtual machines in the Azure portal

Get started with Azure Automanage for virtual machines by using the Azure portal to enable automanagement on a new or existing virtual machine.


## Prerequisites

If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/) before you begin.

> [!NOTE]
> Free trial accounts do not have access to the virtual machines used in this tutorial. Please upgrade to a Pay-As-You-Go subscription.

> [!IMPORTANT]
> You need to have the **Contributor** role on the resource group containing your VMs to enable Automanage using an existing Automanage Account. If you are enabling Automanage with a new Automanage Account, you need the following permissions: **Owner** role or **Contributor** along with **User Access Administrator** roles on your subscription.


## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/).


## Enable Automanage for VMs on an existing VM

1. In the search bar, search for and select **Automanage – Azure virtual machine best practices**.

2. Select the **Enable on existing VM**.

    :::image type="content" source="media\quick-create-virtual-machine-portal\zero-vm-list-view.png" alt-text="Enable on existing VM.":::

3. On the **Select machines** blade:
    1. Filter the VMs list by your **Subscription** and **Resource group**.
    1. Check the checkbox of each virtual machine you want to onboard.
    1. Click the **Select** button.

    :::image type="content" source="media\quick-create-virtual-machine-portal\existing-vm-select-machine.png" alt-text="Select existing VM from list of available VMs.":::

4. Under **Configuration profile**, click **Browse and change profiles and preferences**.

    :::image type="content" source="media\quick-create-virtual-machine-portal\existing-vm-quick-create.png" alt-text="Browse and change profiles and preferences.":::

5. On the **Select configuration profile + preferences** blade:
    1. Select a profile on the left: *Dev/Test* for testing, *Prod* for production.
    1. Click the **Select** button.

    :::image type="content" source="media\quick-create-virtual-machine-portal\browse-production-profile.png" alt-text="Browse production configuration profile.":::

6. Click the **Enable** button.


## Enable Automanage for VMs on a new VM

Sign into the Azure portal [here](https://aka.ms/automanageportalnextstep) to create a new VM and enable Automanage.

1. Follow the creation steps in [Quickstart - create a Windows VM in the Azure portal](..\virtual-machines\windows\quick-create-portal.md).

2. After your VM is deployed, you will land on the deployment status page that has recommended **Next steps** at the bottom.

    :::image type="content" source="media\quick-create-virtual-machine-portal\create-next-steps.png" alt-text="Next steps section located at the bottom of deployment page.":::

3. Under **Next steps**, select **Enable Automanage virtual machine best practices**.

4. On the **Automanage – Azure virtual machine best practices** page, **Machines** will automatically be populated by your newly created VM.

    :::image type="content" source="media\quick-create-virtual-machine-portal\create-new-enable-overview.png" alt-text="Newly created VM will show up as selected machine.":::

5. Under **Configuration profile**, click **Browse and change profiles and preferences**.

6. On the **Select configuration profile + preferences** blade:
    1. Select a profile on the left: *Dev/Test* for testing, *Prod* for production.
    1. Click the **Select** button.

    :::image type="content" source="media\quick-create-virtual-machine-portal\browse-production-profile.png" alt-text="Browse production configuration profile.":::

7. Click the **Enable** button.

## Disable Automanage for VMs

Quickly stop using Azure Automanage for virtual machines by disabling automanagement.

:::image type="content" source="media\automanage-virtual-machines\disable-step-1.png" alt-text="Disabling Automanage on a virtual machine.":::

1. Go to the **Automanage – Azure virtual machine best practices** page that lists all of your auto-managed VMs.
1. Select the checkbox next to the virtual machine you want to disable.
1. Click on the **Disable automanagent** button.
1. Read carefully through the messaging in the resulting pop-up before agreeing to **Disable**.


## Clean up resources

If you created a new resource group to try Azure Automanage for virtual machines and no longer need it, you can delete the resource group. Deleting the group also deletes the VM and all of the resources in the resource group.

Azure Automanage creates default resource groups to store resources in. Check resource groups that have the naming convention "DefaultResourceGroupRegionName" and "AzureBackupRGRegionName" to clean up all resources.

1. Select the **Resource group**.
1. On the page for the resource group, select **Delete**.
1. When prompted, confirm the name of the resource group and then select **Delete**.


## Next steps

In this quickstart, you enabled Azure Automanage for VMs. 

Discover how you can create and apply customized preferences when enabling Automanage on your virtual machine. 

> [!div class="nextstepaction"]
> [Azure Automanage for VMS - Custom configuration profile](virtual-machines-custom-preferences.md)
