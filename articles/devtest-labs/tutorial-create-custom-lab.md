---
title: Set up a lab, lab VM, and lab user
description: Learn how to use the Azure portal to create a lab, create a virtual machine (VM) in the lab, and add a lab user in Azure DevTest Labs.
ms.topic: tutorial
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/12/2025
ms.custom: UpdateFrequency2

#customer intent: As a lab administrator, I want to learn how to create and delete labs, add virtual machines (VMs) to labs, and add users to labs, so I can better manage my labs.
---

# Tutorial: Create a lab and VM and add a user in DevTest Labs

This tutorial shows Azure DevTest Labs administrators how to use the Azure portal to:

> [!div class="checklist"]
> * Create a lab in DevTest Labs.
> * Add an Azure virtual machine (VM) to the lab.
> * Add a user to the DevTest Labs User role.
> * Delete the lab resources when no longer needed.

If you're a developer, tester, or trainee, see [Access a lab in Azure DevTest Labs](tutorial-use-custom-lab.md) to learn how to claim and connect to lab VMs.

## Prerequisites

- To create a lab, you need at least [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role in an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- To add a VM to a lab, you need at least [DevTest Labs User](/azure/role-based-access-control/built-in-roles#devtest-labs-user) role in the lab.

- To add users to a lab, you must have [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the Azure subscription the lab is in.

## Create a lab

To create a lab, follow these steps. For more information, see [Quickstart: Create a lab in the Azure portal](devtest-lab-create-lab.md).

1. In the [Azure portal](https://portal.azure.com), search for and select **DevTest Labs**.

   :::image type="content" source="./media/tutorial-create-custom-lab/portal-search-devtest-labs.png" alt-text="Screenshot of searching for DevTest Labs in the portal.":::

1. On the **DevTest Labs** page, select **Create**. The **Create DevTest Lab** page appears.
1. On the **Basic Settings** tab, provide the following information:
   - **Subscription**: Change the subscription if you want to use a different subscription for the lab.
   - **Resource group**: Select an existing resource group from the dropdown list, or select **Create new** to create a new resource group so it's easy to delete later.
   - **Lab name**: Enter a name for the lab.
   - **Location**: Change the location if you want to use a different Azure region for the lab.
   - **Artifacts storage account access**: You can select whether the lab uses a user-assigned managed identity or a shared key to access the lab storage account. To use a user-assigned managed identity, select it from the dropdown list. Otherwise, keep the option set to **Storage account Shared Key**.
   - **Public environments**: Leave **On** for access to the [DevTest Labs public environment repository](https://github.com/Azure/azure-devtestlab/tree/master/Environments), or set to **Off** to disable access. For more information, see [Enable public environments when you create a lab](devtest-lab-create-environment-from-arm.md#set-public-environment-access-for-new-lab).

   :::image type="content" source="media/tutorial-create-custom-lab/portal-create-basic-settings-managed-identity.png" alt-text="Screenshot of the Basic Settings tab of the lab creation form.":::

1. Optionally, select the [Auto-shutdown](devtest-lab-create-lab.md#auto-shutdown-tab), [Networking](devtest-lab-create-lab.md#networking-tab), and [Tags](devtest-lab-create-lab.md#tags-tab) tabs at the top of the page, and customize those settings. You can also apply or change most of these settings after lab creation.
1. After you complete all settings, select **Review + create**.
1. Once **Succeeded** appears on the **Review + create** page, review the settings and then select **Create**.

   > [!TIP]
   > Select **Download a template for automation** at the bottom of the page to view and download the lab configuration as an Azure Resource Manager (ARM) template. You can use the ARM template to create more labs. For more information, see [Quickstart: Use ARM templates to create labs in Azure DevTest Labs](create-lab-windows-vm-template.md).

1. After the lab creation process finishes, select **Go to resource** from the deployment notification.

   :::image type="content" source="./media/tutorial-create-custom-lab/creation-notification.png" alt-text="Screenshot of the DevTest Labs deployment notification.":::

## Add a VM to the lab

To add a VM to the lab, follow these steps. For more information, see [Create lab virtual machines in Azure DevTest Labs](devtest-lab-add-vm.md).

1. On the new lab's **Overview** page, select **Add** on the toolbar.

   :::image type="content" source="./media/tutorial-create-custom-lab/add-vm-to-lab-button.png" alt-text="Screenshot of a lab Overview page with Add highlighted.":::

1. On the **Choose a base** page, search for and select a **Windows Server 2019 Datacenter** base for the VM. Some of the following options might be different if you use a different image.

1. On the **Basic Settings** tab of the **Create lab resource** screen, provide the following information:

   - **Virtual machine name**: Keep the autogenerated name, or enter another unique VM name.
   - **User name**: Keep the autogenerated user name, or enter another user name to grant administrator privileges on the VM.
   - **Use a saved secret**: You can select this checkbox to use a secret from Azure Key Vault instead of a password to access the VM. For more information, see [Store secrets in a key vault](devtest-lab-store-secrets-in-key-vault.md). For this tutorial, deselect the checkbox.
   - **Password**: Enter a VM password between 8 and 123 characters long.
   - **Save as default password**: Select the checkbox to save the password in the Key Vault associated with the lab.
   - **Virtual machine size**: Keep the default value for the base, or select **Change Size** to select a different size.
   - **Allow hibernation**: You can select this checkbox to enable hibernation for this VM. For this tutorial, keep the checkbox deselected.
     >[!NOTE]
     >If you enable hibernation, you must also select either **Public** or **Private** for **IP Address** in the **Advanced settings**, because hibernation for **Shared** IPs isn't currently supported.
   - **OS disk type**: You can select a disk type from the dropdown list. For this tutorial, keep the default value.
   - **Artifacts**: You can select **Add or Remove Artifacts** to select and configure artifacts to add to the VM. For more information, see [Add artifacts](devtest-lab-add-vm.md#add-optional-artifacts).

   :::image type="content" source="./media/tutorial-create-custom-lab/portal-lab-vm-basic-settings.png" alt-text="Screenshot of the Basic Settings tab for creating a VM.":::

1. Optionally, select the **Advanced Settings** tab to change any of the following settings:

   - **Virtual network**: Keep the default, or select a network from the dropdown list. For more information, see [Add a virtual network](devtest-lab-configure-vnet.md).
   - **Subnet**: If necessary, select a different subnet from the dropdown list.
   - **IP address**: Leave at **Shared**, or select **Public** or **Private**. For more information, see [Understand shared IP addresses](devtest-lab-shared-ip.md).
   - **Expiration date**: Leave at **Will not expire**, or [set an expiration date](devtest-lab-use-resource-manager-template.md#set-vm-expiration-date) and time for the VM.
   - **Make this machine claimable**: The default of **No** keeps the VM creator as the owner of the VM. For this tutorial, select **Yes** to allow any lab user to claim the VM after creation. For more information, see [Create and manage claimable VMs](devtest-lab-add-claimable-vm.md).
   - **Number of instances**: To create more than one VM with this configuration, enter the number of VMs to create.
   - **View ARM template**: Select this button to view and save the VM configuration as an Azure Resource Manager (ARM) template. You can use the ARM template to [deploy new VMs](/azure/azure-resource-manager/templates/overview).

   :::image type="content" source="./media/tutorial-create-custom-lab/portal-lab-vm-advanced-settings.png" alt-text="Screenshot of the Advanced Settings tab of lab resource creation page.":::

1. You can also select the **Tags** tab to apply tags to the VM. After you configure all settings, select **Create** at the bottom of the screen.

   During VM deployment, you can select the **Notifications** icon at the top of the screen to see progress. Creating a VM takes a while.

After the VM is created, select **Claimable virtual machines** under **My Lab** in the left navigation of the lab **Overview** page to see the VM listed on the **Claimable virtual machines** page. Select **Refresh** if the VM doesn't appear. To take ownership of a VM in the claimable list, see [Use a claimable VM](devtest-lab-add-claimable-vm.md#use-a-claimable-vm).

:::image type="content" source="./media/tutorial-create-custom-lab/portal-lab-vm-creation-status.png" alt-text="Screenshot of the lab Claimable virtual machines page.":::

## Add a user to the DevTest Labs User role

To add users to a lab, you must be a [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner) of the subscription the lab is in. For more information, see [Add lab owners, contributors, and users in Azure DevTest Labs](devtest-lab-add-devtest-user.md).

1. On the lab's **Overview** page in the Azure portal, under **Settings**, select **Configuration and policies**.

1. On the **Configuration and policies** page, select **Access control (IAM)** from the left navigation.

1. Select **Add** > **Add role assignment**.

   :::image type="content" source="media/tutorial-create-custom-lab/add-role-assignment-menu-generic.png" alt-text="Screenshot of the Access control (IAM) page with the role assignment menu open.":::

1. On the **Role** tab of the **Add role assignment** page, select the **DevTest Labs User** role, and then select **Next**.

   :::image type="content" source="media/tutorial-create-custom-lab/add-role-assignment-role-generic.png" alt-text="Screenshot of the role assignment page with the Role tab selected.":::

1. On the **Members** tab, select **Select members**.

1. On the **Select members** screen, select the user or users to assign to the **DevTest Labs User** role, and then select **Select**.

1. Select **Review + assign** and then select **Review + assign** again to assign the role.

### Share a link to the lab

To share a link to the lab with your users, go to the lab home page in the [Azure portal](https://portal.azure.com) and copy the URL from your browser. Share the copied link with your lab users.

Lab users must have a Microsoft account, but they don't need an Azure account. If a lab user isn't a member of your Active Directory, they might see an error message when they try to access the shared link. If that happens, ask the user to first select their name in the upper-right corner of the Azure portal. They can then select the directory where the lab exists from the **Directory** section of the menu.

## Clean up resources

You can use this lab for the next tutorial, [Access a lab in Azure DevTest Labs](tutorial-use-custom-lab.md), or for other uses. When you're done using the lab, delete it and its resources to avoid further charges.

1. On the lab **Overview** page, select **Delete** from the top menu.

   :::image type="content" source="./media/tutorial-create-custom-lab/portal-lab-delete.png" alt-text="Screenshot of the lab Delete button.":::

1. On the **Are you sure you want to delete it** page, enter the lab name, and then select **Delete**.

   During the deletion process, you can select **Notifications** at the top of your screen to view progress. Deleting a lab can take a while.

Deleting the lab removes all of the lab resources from the resource group. If you created the resource group for the lab, you can now delete the resource group. You can't delete a resource group that has a lab in it.

Deleting the resource group that contained the lab deletes all resources in the resource group. To delete the resource group:

1. Select the resource group that contained the lab from your subscription's **Resource groups** list.
1. At the top of the page, select **Delete resource group**.
1. On the **Delete a resource group** screen, enter the resource group name, and then select **Delete**.

## Related content

To learn how to access the lab and VMs as a lab user, go on to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Access the lab](tutorial-use-custom-lab.md)
