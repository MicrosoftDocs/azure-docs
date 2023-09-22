---
title: Upgrade your Azure Automanage machines to the latest Automanage version
description: Learn how to upgrade your machines to the latest Azure Automanage version
author: mmccrory
ms.service: automanage
ms.workload: infrastructure
ms.topic: how-to
ms.date: 9/1/2022
ms.author: memccror
---


# Upgrade your machines to the latest Automanage version

Automanage machine best practices released the generally available API version. The API now supports creating custom profiles where you can pick and choose the services and settings you want to apply to your machines. This article describes the differences in the versions and how to upgrade. 

## How to upgrade your machines

1. In the [Automanage portal](https://aka.ms/automanageportal), if your machine status is **Needs Upgrade** on the Automanage machines tab, please follow these [steps](automanage-upgrade.md#upgrade-your-machines-to-the-latest-automanage-version). You will also see a banner on the Automanage overview page indicating that you need to upgrade your machines. 

    :::image type="content" source="media\automanage-upgrade\overview-blade.png" alt-text="Needs upgrade status.":::

2. Update any onboarding automation to reference the GA API version: 2022-05-04. For instance, if you have onboarding templates saved, you will need to update the template to reference the new GA API version as the preview versions will no longer be supported. Also, if you have deployed the [Automanage built-in policy](virtual-machines-policy-enable.md) that references the preview APIs, you will need to redeploy the built-in policy which now references the GA API version. 


## Upgrade your machines to the latest Automanage version
If your machine status is **Needs Upgrade** on the Automanage machines tab, you will need to do the following:
1. [Disable Automanage on the machine](automanage-upgrade.md#disable-automanage-machines-that-need-to-be-upgraded)
1. [Re-enable Automanage on the machine](automanage-upgrade.md#re-enable-automanage-on-your-machines)

### Disable Automanage machines that need to be upgraded

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
In the previous version of Automanage, the Automanage Account was used as an MSI to perform actions on your machine. However, in the latest version of Automanage, Automanage uses a first party application (Application ID: d828acde-4b48-47f5-a6e8-52460104a052) in order to perform actions on the Automanage machines. 

For both the previous version and the new version of Automanage, you need the following permissions:
* If onboarding Automanage for the first time in a subscription, you need **Owner** role, or **Contributor** along with **User Access Administrator** roles.
* If onboarding Automanage on a subscription that already has Automanage machines, you need **Contributor** on the resource group where the machine resides. 
> [!NOTE]
> If the machine you are onboarding to Automanage is already connected to a log analytics workspace in a difference subscription than the machine, you also need the permissions outlined above on the log analytics workspace subscription.

## Next steps 

Get the most frequently asked questions answered in our FAQ. 

> [!div class="nextstepaction"]
> [Frequently Asked Questions](faq.yml)
