---
title: Create a custom profile in Azure Automanage for VMs
description: Learn how to create a custom profile in Azure Automanage and select your services and settings.
author: ju-shim
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: how-to
ms.date: 02/22/2021
ms.author: jushiman
---


# Create a custom profile in Azure Automanage for VMs

Azure Automanage for machine best practices has default best practice profiles that cannot be edited. However, if you need more flexibility, you can pick and choose the set of services and settings by creating a custom profile.

We support toggling services ON and OFF. We also currently support customizing settings on [Azure Backup](..\backup\backup-azure-arm-vms-prepare.md#create-a-custom-policy) and [Microsoft Antimalware](../security/fundamentals/antimalware.md#default-and-custom-antimalware-configuration).


## Prerequisites

If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/) before you begin.

> [!NOTE]
> Free trial accounts do not have access to the virtual machines used in this tutorial. Please upgrade to a Pay-As-You-Go subscription.

> [!IMPORTANT]
> The following Azure RBAC permission is needed to enable Automanage for the first time on a subscription: **Owner** role, or **Contributor** along with **User Access Administrator** roles.


## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/).


## Enable Automanage for VMs on an existing VM

1. In the search bar, search for and select **Automanage – Azure machine best practices**.

2. Select the **Enable on existing VM**.

3. Under **Configuration profile**, select **Custom profile**.

4. Select an existing custom profile from the dropdown if one exists or create a new custom profile by clicking **Create new**.

5. On the **Create new profile** blade, fill out the details:
    1. Profile Name
    1. Subscription
    1. Resource Group
    1. Region

    :::image type="content" source="media\virtual-machine-custom-profile\create-custom-profile.png" alt-text="Fill out custom profile details.":::

6. Adjust the profile with the desired services and settings and click **Create**.

7. On the **Select machines** blade:
    1. Filter the VMs list by your **Subscription** and **Resource group**.
    1. Check the checkbox of each virtual machine you want to onboard.
    1. Click the **Select** button.

    :::image type="content" source="media\virtual-machine-custom-profile\existing-vm-select-machine.png" alt-text="Select existing VM from list of available VMs.":::

    > [!NOTE]
    > Click the **Show ineligible machines** to see the list of unsupported machines and the reasoning. 

## Disable Automanage for VMs

Quickly stop using Azure Automanage for virtual machines by disabling automanagement.

:::image type="content" source="media\virtual-machine-custom-profile\disable-step-1.png" alt-text="Disabling Automanage on a virtual machine.":::

1. Go to the **Automanage – Azure machine best practices** page that lists all of your auto-managed VMs.
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
> [Frequently Asked Questions](faq.yml)