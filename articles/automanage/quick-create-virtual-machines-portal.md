---
title: Quickstart - Enable Azure Automanage for VMs in the Azure portal
description: Learn how to quickly enable Automanage for virtual machines on a new or existing VM in the Azure portal.
author: ju-shim
ms.author: jushiman
ms.date: 02/17/2021
ms.topic: quickstart
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.custom:
  - mode-portal
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

Sign in to the [Azure portal](https://aka.ms/AutomanagePortal-Ignite21).

## Enable Automanage for a single VM

1. Browse to the Virtual Machine that you would like to enable.

2. Click on the **Automanage (Preview)** entry in the Table of Contents under **Operations**.

3. Select **Get Started**.

    :::image type="content" source="media\quick-create-virtual-machine-portal\vmmanage-getstartedbutton.png" alt-text="Get started single VM.":::

4. Choose your Automanage settings (Environment, Preferences, Automanage Account) and hit **Enable**.

    :::image type="content" source="media\quick-create-virtual-machine-portal\vmmanage-enablepane.png" alt-text="Enable on single VM.":::

## Enable Automanage for multiple VMs

1. In the search bar, search for and select **Automanage – Azure machine best practices**.

2. Select the **Enable on existing VM**.

    :::image type="content" source="media\quick-create-virtual-machine-portal\zero-vm-list-view.png" alt-text="Enable on existing VM.":::

3. On the **Select machines** blade:
    1. Filter the VMs list by your **Subscription** and **Resource group**.
    1. Check the checkbox of each virtual machine you want to onboard.
    1. Click the **Select** button.

    :::image type="content" source="media\quick-create-virtual-machine-portal\existing-vm-select-machine.png" alt-text="Select existing VM from list of available VMs.":::

4. Under **Environment**, select your environment type: **Dev/Test** or **Production**. 

    :::image type="content" source="media\quick-create-virtual-machine-portal\existing-vm-quick-create.png" alt-text="Select environments.":::

   Click **Compare Environment Details** to see the differences between the environments.
    1. Select an environment on the dropdown: *Dev/Test* for testing, *Production* for production.
    1. Click the **OK** button.

    :::image type="content" source="media\quick-create-virtual-machine-portal\browse-production-profile.png" alt-text="Browse production environment.":::

5. By default, the **Azure Best Practices** preference is selected for the configuration preferences. To change this, create a new preference or select an existing one. 

    :::image type="content" source="media\quick-create-virtual-machine-portal\create-preference.png" alt-text="Create preference.":::

6. Click the **Enable** button.


## Enable Automanage for a new VM

Sign into the Azure portal [here](https://aka.ms/AzureAutomanagePreview) to create a new VM and enable Automanage.

1. Fill out the **Basics** tab with your VM details.

> [!NOTE]
> Check the Automanage [supported regions](automanage-virtual-machines.md#supported-regions) and the Automanage supported [Linux distros](automanage-linux.md#supported-linux-distributions-and-versions) and [Windows Server versions](automanage-windows-server.md#supported-windows-server-versions).

2. Browse to the **Management** tab and choose your **Automanage Environment**.

    :::image type="content" source="media\quick-create-virtual-machine-portal\vmcreate-managementtab.png" alt-text="Enable Automanage in Management Tab.":::

3. Leave the remaining defaults and then select the **Review + create** button at the bottom of the page.

4. When you see the message that validation has passed, select **Create**.

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
> [Azure Automanage for VMs - Custom configuration preferences](virtual-machines-custom-preferences.md)
