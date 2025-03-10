---
title: Set up a lab & lab VM & lab user
description: Use the Azure portal to create a lab, create a virtual machine in the lab, and add a lab user in Azure DevTest Labs.
ms.topic: tutorial
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: UpdateFrequency2
---

# Tutorial: Create a DevTest Labs lab and VM and add a user in the Azure portal

In this Azure DevTest Labs tutorial, you learn how to:

> [!div class="checklist"]
> * Create a lab in DevTest Labs.
> * Add an Azure virtual machine (VM) to the lab.
> * Add a user in the DevTest Labs User role.
> * Delete the lab when no longer needed.

In the [next tutorial](tutorial-use-custom-lab.md), lab users, such as developers, testers, and trainees, learn how to connect to the lab VM and claim and unclaim lab VMs.

## Prerequisite

- To create a lab, you need at least [Contributor](../role-based-access-control/built-in-roles.md#contributor) role in an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- To add users to a lab, you must have [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../role-based-access-control/built-in-roles.md#owner) role in the subscription the lab is in.

## Create a lab

To create a lab in Azure DevTest Labs, follow these steps.

1. In the [Azure portal](https://portal.azure.com), search for and select **DevTest Labs**.

   :::image type="content" source="./media/tutorial-create-custom-lab/portal-search-devtest-labs.png" alt-text="Screenshot of searching for DevTest Labs in the portal.":::

1. On the **DevTest Labs** page, select **Create**.

1. On the **Create Devtest Lab** page, on the **Basic Settings** tab, provide the following information:

   |Setting|Value|
   |---|---|
   |**Subscription**|Change the subscription if you want to use a different subscription for the lab.|
   |**Resource group**|Select an existing resource group from the dropdown list, or select **Create new** to create a new resource group so it's easy to delete later.|
   |**Lab name**|Enter a name for the lab.|
   |**Location**|If you're creating a new resource group, select an Azure region for the resource group and lab.|
   |**Artifacts storage account access**|You can configure whether the lab uses a User-assigned Managed Identity or a Shared Key to access the lab storage account. To use a User-assigned Managed Identity, select the appropriate managed identity from the list, otherwise select the Storage Account Shared Key option from the list.|
   |**Public environments**|Leave **On** for access to the [DevTest Labs public environment repository](https://github.com/Azure/azure-devtestlab/tree/master/Environments). Set to **Off** to disable access. For more information, see [Enable public environments when you create a lab](devtest-lab-create-environment-from-arm.md#set-public-environment-access-for-new-lab).|

   :::image type="content" source="./media/tutorial-create-custom-lab/portal-create-basic-settings-managed-identity.png" alt-text="Screenshot of the Basic Settings tab of the Create DevTest Labs form.":::

1. Optionally, select the [Auto-shutdown](devtest-lab-create-lab.md#auto-shutdown-tab), [Networking](devtest-lab-create-lab.md#networking-tab), or [Tags](devtest-lab-create-lab.md#tags-tab) tabs at the top of the page, and customize those settings. You can also apply or change most of these settings after lab creation.

1. After you complete all settings, select **Review + create** at the bottom of the page.

1. If the settings are valid, **Succeeded** appears at the top of the **Review + create** page. Review the settings, and then select **Create**.

   > [!TIP]
   > Select **Download a template for automation** at the bottom of the page to view and download the lab configuration as an Azure Resource Manager (ARM) template. You can use the ARM template to create more labs.

1. After the creation process finishes, from the deployment notification, select **Go to resource**.

   :::image type="content" source="./media/tutorial-create-custom-lab/creation-notification.png" alt-text="Screenshot of the DevTest Labs deployment notification.":::

## Add a VM to the lab

To add a VM to the lab, follow these steps. For more information, see [Create lab virtual machines in Azure DevTest Labs](devtest-lab-add-vm.md).

1. On the new lab's **Overview** page, select **Add** on the toolbar.

   :::image type="content" source="./media/tutorial-create-custom-lab/add-vm-to-lab-button.png" alt-text="Screenshot of a lab Overview page with Add highlighted.":::

1. On the **Choose a base** page, select **Windows Server 2019 Datacenter** as a Marketplace image for the VM. Some of the following options might be different if you use a different image.

1. On the **Basic Settings** tab of the **Create lab resource** screen, provide the following information:

   |Setting|Value|
   |---|---|
   |**Virtual machine name**|Keep the autogenerated name, or enter another unique VM name.|
   |**User name**|Keep the autogenerated user name, or enter another user name to grant administrator privileges on the VM.|
   |**Use a saved secret**|You can select this checkbox to use a secret from Azure Key Vault instead of a password to access the VM. For more information, see [Store secrets in a key vault](devtest-lab-store-secrets-in-key-vault.md). For this tutorial, don't select the checkbox.|
   |**Password**|If you don't use a secret, enter a VM password between 8 and 123 characters long.|
   |**Save as default password**|Select this checkbox to save the password in the Key Vault associated with the lab.|
   |**Virtual machine size**|Keep the default value for the base, or select **Change Size** to select a different size.|
   |**Hibernation**|Select **Enabled** to enable hibernation for this virtual machine, or select **Disabled** to disable hibernation for this virtual machine. If you enable Hibernation, you also must select **Public IP** in the Advanced settings as Private and Shared IP are currently not supported if Hibernation is enabled.|
   |**OS disk type**|Keep the default value for the base, or select a different option from the dropdown list.|
   |**Artifacts**|Optionally, select **Add or Remove Artifacts** to [select and configure artifacts](devtest-lab-add-vm.md#add-artifacts-during-installation) to add to the VM.|

   :::image type="content" source="./media/tutorial-create-custom-lab/portal-lab-vm-basic-settings.png" alt-text="Screenshot of the Basic Settings tab of the Create lab resource page.":::

1. Select the **Advanced Settings** tab on the **Create lab resource** screen, and change any of the following values:

   |Setting|Value|
   |---|---|
   |**Virtual network**|Keep the default, or select a network from the dropdown list. For more information, see [Add a virtual network](devtest-lab-configure-vnet.md).|
   |**Subnet**|If necessary, select a different subnet from the dropdown list.|
   |**IP address**|Leave at **Shared**, or select **Public** or **Private**. For more information, see [Understand shared IP addresses](devtest-lab-shared-ip.md).|
   |**Expiration date**|Leave at **Will not expire**, or [set an expiration date](devtest-lab-use-resource-manager-template.md#set-vm-expiration-date) and time for the VM.|
   |**Make this machine claimable**|The default is **No**, to keep the VM creator as the owner of the VM. For this tutorial, select **Yes**, so that another lab user can claim the VM after creation. For more information, see [Create and manage claimable VMs](devtest-lab-add-claimable-vm.md).|
   |**Number of instances**|To create more than one VM with this configuration, enter the number of VMs to create.|
   |**View ARM template**|Select to view and save the VM configuration as an Azure Resource Manager (ARM) template. You can use the ARM template to [deploy new VMs with Azure PowerShell](../azure-resource-manager/templates/overview.md).|

   :::image type="content" source="./media/tutorial-create-custom-lab/portal-lab-vm-advanced-settings.png" alt-text="Screenshot of the Advanced Settings tab of the Create lab resource page.":::

1. After you configure all settings, on the **Basic Settings** tab of the **Create lab resource** screen, select **Create**.

During VM deployment, you can select the **Notifications** icon at the top of the screen to see progress. Creating a VM takes a while.

From the lab **Overview** page, you can select **Claimable virtual machines** in the left navigation to see the VM listed on the **Claimable virtual machines** page. Select **Refresh** if the VM doesn't appear. To take ownership of a VM in the claimable list, see [Use a claimable VM](devtest-lab-add-claimable-vm.md#use-a-claimable-vm).

:::image type="content" source="./media/tutorial-create-custom-lab/portal-lab-vm-creation-status.png" alt-text="Screenshot of the lab Claimable virtual machines page.":::

## Add a user to the DevTest Labs User role

To add users to a lab, you must be a [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../role-based-access-control/built-in-roles.md#owner) of the subscription the lab is in. For more information, see [Add lab owners, contributors, and users in Azure DevTest Labs](devtest-lab-add-devtest-user.md).

1. On the lab's **Overview** page, under **Settings**, select **Configuration and policies**.

1. On the **Configuration and policies** page, select **Access control (IAM)** from the left navigation.

1. Select **Add**, and then select **Add role assignment**.

   :::image type="content" source="media/tutorial-create-custom-lab/add-role-assignment-menu-generic.png" alt-text="Screenshot of the Access control (IAM) page with the Add role assignment menu open.":::

1. On the **Role** tab, select the **DevTest Labs User** role.

   :::image type="content" source="media/tutorial-create-custom-lab/add-role-assignment-role-generic.png" alt-text="Screenshot of the Add role assignment page with the Role tab selected.":::

1. On the **Members** tab, select the user to assign the role to.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

## Share a link to the lab

1. In the [Azure portal](https://portal.azure.com), go to the lab.
2. Copy the **lab URL** from your browser, and then share it with your lab users.
          
> [!NOTE]
> If a lab user is an external user who has a Microsoft account, but who is not a member of your organization's Active Directory instance, the user might see an error message when they try to access the shared link. If an external user sees an error message, ask the user to first select their name in the upper-right corner of the Azure portal. Then, in the Directory section of the menu, the user can select the directory where the lab exists.
          

## Clean up resources

Use this lab for the next tutorial, [Access a lab in Azure DevTest Labs](tutorial-use-custom-lab.md). When you're done using the lab, delete it and its resources to avoid further charges.

1. On the lab **Overview** page, select **Delete** from the top menu.

   :::image type="content" source="./media/tutorial-create-custom-lab/portal-lab-delete.png" alt-text="Screenshot of the lab Delete button.":::

1. On the **Are you sure you want to delete it** page, enter the lab name, and then select **Delete**.

   During the deletion process, you can select **Notifications** at the top of your screen to view progress. Deleting a lab can take a while.

If you created the lab in an existing resource group, deleting the lab removes all of the lab resources.

If you created a resource group for the lab, you can now delete that resource group. You can't delete a resource group that has a lab in it. Deleting the resource group that contained the lab deletes all resources in the resource group. To delete the resource group:

1. Select the resource group that contained the lab from your subscription's **Resource groups** list.
1. At the top of the page, select **Delete resource group**.
1. On the **Are you sure you want to delete "\<resource group name>"** page, enter the resource group name, and then select **Delete**.

## Next steps

To learn how to access the lab and VMs as a lab user, go on to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Access the lab](tutorial-use-custom-lab.md)
