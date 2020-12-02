---
title: Create a custom preference in Azure Automanage for VMs
description: Learn how to adjust the configuration profile in Azure Automanage for VMs and set your own preferences.
author: ju-shim
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: how-to
ms.date: 09/04/2020
ms.author: jushiman
---


# Create a custom preference in Azure Automanage for VMs

Azure Automanage for virtual machine best practices has default configuration profiles that can be adjusted if needed. This article will explain how you can set your own configuration profile preferences when you enable automanagement on a new or existing VM.

We currently support customizations on [Azure Backup](..\backup\backup-azure-arm-vms-prepare.md#create-a-custom-policy) and [Microsoft Antimalware](../security/fundamentals/antimalware.md#default-and-custom-antimalware-configuration).


> [!NOTE]
> You cannot change the configuration profile or preference on your VM while Automanage is enabled. You will need to disable Automanage for that VM and then re-enable Automanage with the desired configuration profile and preferences.


## Prerequisites

If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/) before you begin.

> [!NOTE]
> Free trial accounts do not have access to the virtual machines used in this tutorial. Please upgrade to a Pay-As-You-Go subscription.

> [!IMPORTANT]
> The following Azure RBAC permission is needed to enable Automanage: **Owner** role, or **Contributor** along with **User Access Administrator** roles.


## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/).


## Enable Automanage for VMs on an existing VM

1. In the search bar, search for and select **Automanage – Azure virtual machine best practices**.

2. Select the **Enable on existing VM**.

3. On the **Select machines** blade:
    1. Filter the VMs list by your **Subscription** and **Resource group**.
    1. Check the checkbox of each virtual machine you want to onboard.
    1. Click the **Select** button.

    :::image type="content" source="media\virtual-machine-custom-preferences\existing-vm-select-machine.png" alt-text="Select existing VM from list of available VMs.":::

4. Under **Configuration profile**, click **Browse and change profiles and preferences**.

    :::image type="content" source="media\virtual-machine-custom-preferences\existing-vm-quick-create.png" alt-text="Browse and change profiles and preferences.":::

5. On the **Select configuration profile + preferences** blade, select a profile on left hand side: *Dev/Test* for testing, *Prod* for production.

    :::image type="content" source="media\virtual-machine-custom-preferences\browse-production-profile.png" alt-text="Browse production configuration profile.":::

6. On the chosen profile, under **Configuration preferences** there is a dropdown where you can adjust for certain services.
    1. Click **Create new preferences**.
    1. In the **Create a configuration preference** blade, fill out the Basics tab:
        1. Subscription
        1. Resource group
        1. Preference name
        1. Region

    :::image type="content" source="media\virtual-machine-custom-preferences\create-preference.png" alt-text="Fill out configuration preferences.":::

7. Go to the Preferences tab and adjust the configuration preferences you want.
        
    > [!NOTE]
    > Only adjustments that still fit within our best practices upper and lower bounds will be allowed when changing profile configurations.

8. Review your configuration profile.
9. Click the **Create** button.

10. Click the **Enable** button.


## Disable Automanage for VMs

Quickly stop using Azure Automanage for virtual machines by disabling automanagement.

:::image type="content" source="media\virtual-machine-custom-preferences\disable-step-1.png" alt-text="Disabling Automanage on a virtual machine.":::

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

Get the most frequently asked questions answered in our FAQ. 

> [!div class="nextstepaction"]
> [Frequently Asked Questions](faq.md)