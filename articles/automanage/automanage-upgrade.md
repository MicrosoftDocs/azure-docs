---
title: Upgrade your Azure Automanage machines to the latest Automanage version
description: Learn how to upgrade your machines to the latest Azure Automanage version
author: mmccrory
ms.service: automanage
ms.workload: infrastructure
ms.topic: how-to
ms.date: 10/20/2021
ms.author: memccror
---


# Upgrade your machines to the latest Automanage version

Automanage released a new version of the machine best practices offering in November 2021. The new API now supports creating custom profiles where you can pick and choose the services and settings you want to apply to your machines. Also, with this new version, the Automanage account is no longer required. This article describes the differences in the versions and how to upgrade. 

## How to upgrade your machines

Below are the set of instructions on how to upgrade your machines to the latest API version of Automanage. 

### Prerequisites

If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/) before you begin.

> [!NOTE]
> Free trial accounts do not have access to the virtual machines used in this tutorial. Please upgrade to a Pay-As-You-Go subscription.

> [!IMPORTANT]
> The following Azure RBAC permission is needed to enable Automanage for the first time on a subscription with the new Automanage version: **Owner** role, or **Contributor** along with **User Access Administrator** roles.

### Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/).


### Check to see which machines need to be upgraded

All machines that need to be upgraded will have the status **Needs upgrade**. You will also see a banner on the Automanage overview page indicating that you need to upgrade you machines. 

:::image type="content" source="media\automanage-upgrade\overview-blade.png" alt-text="Needs upgrade status.":::

### Disable Automanage machines that need to be upgrade

Before a machine can upgrade to the new Automanage version, the machine must be disabled from the previous version of Automanage. To disable the machines follow these steps:
1. Select the checkbox next to the virtual machine you want to disable.
1. Click on the **Disable** button.
1. Read carefully through the messaging in the resulting pop-up before agreeing to **Disable**.

:::image type="content" source="media\automanage-upgrade\disable-automanage.png" alt-text="Disable automanage.":::

### Re-enable Automanage on your machines

After your machines are off-boarded from Automanage, you can now re-enable Automanage. When you re-enable Automanage, Automanage will automatically use the latest Automanage version. 

1. Select the **Enable on existing VM**.

    :::image type="content" source="media\automanage-upgrade\zero-vm-list-view.png" alt-text="Enable on existing VM.":::

2. Under **Configuration profile**, select your profile type: **Azure Best Practices - Production** or **Azure Best Practices - Dev/Test** or [**Custom profile**](virtual-machines-custom-profile.md)

    :::image type="content" source="media\quick-create-virtual-machine-portal\existing-vm-quick-create.png" alt-text="Select environments.":::

    > [!NOTE]
    > The **Production** environment maps to the **Azure Best Practices - Production** Configuration Profile. 
    > The **Dev/Test** environment maps to the **Azure Best Practices - Dev/Test** Configuration Profile. 
    > If you took advantage of **Configuration Preferences**, you can create a **Custom Profile** with those same modifications. 

3. On the **Select machines** blade:
    1. Filter the list by your **Subscription** and **Resource group**.
    1. Check the checkbox of each virtual machine you want to onboard.
    1. Click the **Select** button.
    > [!NOTE]
    > You may select both Azure VMs and Azure Arc-enabled servers.

    :::image type="content" source="media\automanage-upgrade\existing-vm-select-machine.png" alt-text="Select existing VM from list of available VMs.":::

4. Click the **Enable** button.

Now, your machines will be onboarded to the latest version of Automanage.

## Differences in the Automanage versions

### Environment and Configuration Profiles
In the previous version of Automanage, you selected your Environment type: Dev/Test or Production. In the new version of Automanage, the environment maps to configuration profiles. The configuration profile options are Azure Best Practices - Dev/Test, Azure Best Practices - Production, Custom Profile. The set of services and settings from the **Dev/Test** environment are the same in the **Azure Best Practices - Dev/Test** configuration profile. Similarly, the set of services and settings from the **Production** environment are the same in the **Azure Best Practices - Production** configuration profile. 

### Configuration Preferences and Custom Profiles
In the previous version of Automanage, you were able to customer a subset of settings through **Configuration Preferences**. In the latest version of Automanage, we have enhanced the customization so you can pick and choose each service you want to onboard and support modifying some settings on the services through **Custom Profiles**. 

### Automanage Account and First party application
In the previous version of Automanage, the Automanage Account was used as an MSI to preform actions on your machine. However, in the latest version of Automanage, Automanage uses a first party application (Application Id : d828acde-4b48-47f5-a6e8-52460104a052) to order to perform actions on the Automanage machines. 

For both the previous version and the new version of Automanage, you need the following permissions:
* If onboarding Automanage for the first time in a subscription, you need **Owner** role, or **Contributor** along with **User Access Administrator** roles.
* If onboarding Automanage on a subscription that already has Automanage machines, you need **Contributor** on the resource group where the machine resides. 
> [!NOTE]
> If the machine you are onboarding to Automanage is already connected to a log analytics workspace in a difference subscription than the machine, you also need the permissions outlined above on the log analytics workspace subscription.

## Next steps 

Get the most frequently asked questions answered in our FAQ. 

> [!div class="nextstepaction"]
> [Frequently Asked Questions](faq.yml)

