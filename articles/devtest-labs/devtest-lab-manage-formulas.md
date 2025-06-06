---
title: Manage formulas in Azure DevTest Labs and create VMs
description: Explore how to create formulas from a base (shared gallery image or Marketplace image) or an existing virtual machine in your lab.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/06/2024
ms.custom: UpdateFrequency2

#customer intent: As a developer, I want to create and manage formulas in DevTest Labs so I can use formulas to create virtual machines.
---

# Manage Azure DevTest Labs formulas

This article describes how to create and manage formulas in Azure DevTest Labs. A formula in DevTest Labs is a list of default property values that are used to create a virtual machine (VM). When you create a VM from a formula, the default values can be used as-is, or modified.

Formulas are similar to [custom images](devtest-lab-create-template.md) and [Marketplace images](devtest-lab-configure-marketplace-images.md), as they provide a mechanism for fast VM provisioning. Similar to custom images, formulas enable you to create a base image from a virtual hard disk (VHD) file. The base image can then be used to provision a new VM. To help decide which approach is right for your particular environment, see [Comparing custom images and formulas in DevTest Labs](devtest-lab-comparing-vm-base-image-types.md).

## Use formulas in DevTest Labs

You need _Owner_ permissions in DevTest Labs to create, modify, and delete formulas for a lab.

There are two ways to create formulas: 

- **From a base**: Create a formula from a base and define all configuration settings for the formula. This approach supports Marketplace images and images in a shared image gallery attached to the lab.
- **From an existing lab VM**: Create a formula from an existing VM in your lab and reuse the existing configuration and settings. For this approach, the existing VM must have a creation date later than March 30, 2016.

Anyone with DevTest Labs _Users_ permissions can create VMs by using a formula as a base.

For more information about adding users and permissions, see [Add owners and users in Azure DevTest Labs](./devtest-lab-add-devtest-user.md).

## Create formula from base image

You can create a formula by selecting a base image in DevTest Labs. The base image can be any Marketplace image or an image from a shared image gallery attached to your lab.

> [!NOTE]
> Depending on your base selection for the formula, the **Basic** or **Advanced** configuration settings might be different from the values described in this section. If your base is an image from a shared image gallery, you might not be able to change certain **Basic > Authentication** settings like the **User name** and **Password**. Settings that can't be changed are either not visible on the configuration page or the field isn't available for editing. You might also see extra settings, such as the **Advanced > Image version** field.

Follow these steps to create a formula from a base image:

1. In the [Azure portal](https://portal.azure.com), go to your DevTest Labs resource where you want to create the formula.

1. On your lab **Overview** page, expand the **Settings** section in the left menu, and select **Configuration and policies**.

1. On the **Configuration and policies** screen, expand the **Virtual machine bases** section in the left menu, and select **Formulas (reusable bases)**.

1. On the **Formulas (reusable bases)** page, select **Add**:

   :::image type="content" source="./media/devtest-lab-create-formulas/add-formula.png" border="false" alt-text="Screenshot that shows how to select the Add option for Formulas and reusable bases for DevTest Labs." lightbox="./media/devtest-lab-create-formulas/add-formula-large.png":::

1. On the **Choose a base** page, select the base (custom image, Marketplace image, or a shared image gallery image) that you want to use to create the formula.

1. On the **Basic Settings** tab of the **Create formula** page, configure the following values for the new formula:

   :::image type="content" source="./media/devtest-lab-create-formulas/basic-settings.png" alt-text="Screenshot of the standard Basic Settings configuration tab for adding a formula in DevTest Labs." lightbox="./media/devtest-lab-create-formulas/basic-settings-large.png":::

   - **Formula name**: Enter a name for your formula. This value displays in the list of base images when lab users create a VM. The formula name is validated as you type. A message indicates the requirements for a valid name. As an option, you can provide a **Description** for the formula. 

   - **User Name**: Enter the name for a user with administrator privileges for the lab.

   - **Authentication type** (_Marketplace and custom bases only_): Select the type of authentication to apply to VMs created from the formula, and then configure the security settings. If your base selection for the formula is from a shared image gallery, these options aren't visible on the configuration page.

      - For **Password** authentication, provide a **Password** for the user with administrator privileges.

      - For **SSH Public Key** authentication, provide an **SSH Public Key** for the user with administrator privileges.
      
      - **Use a saved secret**: You can also save secrets in your Azure key vault first and then use the secrets when you create formulas and other resources in your lab. To use a password or SSH public key stored in your key vault, select **Use a saved secret**, and then specify a key value that corresponds to your stored secret (password or SSH public key). For more information, see [Store secrets in a key vault](devtest-lab-store-secrets-in-key-vault.md). 

   - **Virtual machine size**: A common size is prefilled according to the base image you selected for the formula. The size specifies the processor cores, RAM size, and hard drive size of the VM to create from the formula. To use a different size, select **Change size** and choose from a list of available sizes and support options.

   - **OS disk type**: The selected base image for the formula determines your options for the disk type. Depending on the base, you can choose from the following options:

      - **Premium SSD disks** offer high-performance, low-latency disk support for I/O-intensive applications and production workloads. 
      - **Standard SSD disks** are a cost effective storage option optimized for workloads that need consistent performance at lower I/O operations per second (IOPS) levels.
      - **Standard HDD disks** are ideal for Dev/Test scenarios and less critical workloads at lowest cost.

   - **Artifacts**: Zero or more artifacts are added by default according to the selected base image for the formula. You can also select **Add or Remove Artifacts** to change the artifacts for the formula.
    
      > [!IMPORTANT] 
      > If you're new to DevTest Labs or configuring artifacts, review the guidance in [Add artifacts to DevTest Labs VMs](./add-artifact-vm.md) and [Create custom artifacts for your Azure DevTest Labs VM](devtest-lab-artifact-author.md) before you set up the artifacts for the formula.

1. On the **Advanced settings** tab, configure the following settings:

   :::image type="content" source="./media/devtest-lab-create-formulas/advanced-settings.png" alt-text="Screenshot of an example Advanced Settings configuration tab for adding a formula in DevTest Labs." lightbox="./media/devtest-lab-create-formulas/advanced-settings-large.png":::

   - **Virtual network**: The virtual network for your lab or the selected base is prefilled in the text field. Use the dropdown list to select from available networks.

   - **Subnet Selector**: The subnet for the selected virtual network for your lab or the selected base is prefilled in the text field. Use the dropdown list to select from available subnets.

   - **IP address**: Specify the type of IP address for VMs created from the formula: **Public**, **Private**, or **Shared**. For more information about shared IP addresses, see [Understand shared IP addresses in Azure DevTest Labs](./devtest-lab-shared-ip.md).

   - **Expiration date**: To automatically delete the VM, specify the **expiration date** and **expiration time**.
    
   - **Expiration date and time**: This setting field isn't available for editing when creating a formula. The default setting is **Will not expire**.

   - **Make this machine claimable**: When you make a machine _claimable_, a VM created from the formula isn't assigned ownership at the time of creation. Instead, lab users can take ownership ("claim") the machine as needed from the **Claimable virtual machines** list for the lab.  

   - **Image version** (_Shared image gallery only_): If your base selection for the formula is from a shared image gallery, you see this field. Use this setting to specify the version of the image to use for VMs created from the formula. 

1. Select **Submit** to create the formula.

After DevTest Labs creates the formula, it's visible in the list on the **Formulas (reusable bases)** page:

:::image type="content" source="./media/devtest-lab-create-formulas/lab-formulas.png" alt-text="Screenshot that shows the list of Formulas and reusable bases for a lab in DevTest Labs." lightbox="./media/devtest-lab-create-formulas/lab-formulas-large.png":::

## Create formula from existing VM

You can also create a formula by using an existing VM in your lab as the base.

> [!NOTE]
> The creation date for the existing VM must be later than March 30, 2016. 

Follow these steps to create a formula from an existing VM in your lab:

1. In the [Azure portal](https://portal.azure.com), go to your DevTest Labs resource where you want to create the formula.

1. On your lab **Overview** page, select the VM to use as the base for the formula:

   :::image type="content" source="./media/devtest-lab-create-formulas/select-virtual-machine.png" alt-text="Screenshot that shows how to select an existing VM in the lab to use as the base for a formula in DevTest Labs." lightbox="./media/devtest-lab-create-formulas/select-virtual-machine-large.png":::

1. On the **Overview** page for the VM, expand the **Operations** section in the left menu, and select **Create formula (reusable base)**:

   :::image type="content" source="./media/devtest-lab-create-formulas/create-formula-from-machine.png" alt-text="Screenshot that shows how to create a formula from an existing VM in the lab in DevTest Labs." lightbox="./media/devtest-lab-create-formulas/create-formula-from-machine-large.png":::
    
1. On the **Create formula** pane, enter a **Name** and optional **Description** for your new formula.
   
   :::image type="content" source="./media/devtest-lab-create-formulas/create-formula-pane.png" alt-text="Screenshot that shows how to configure the formula from an existing VM in DevTest Labs.":::

1. Select **OK** to create the formula.

After DevTest Labs creates the formula from the VM, it's visible in the list on the **Formulas (reusable bases)** page for the lab.

## Modify formula

To modify any formula in your lab, follow these steps:

1. In the [Azure portal](https://portal.azure.com), go to the **Formulas (reusable bases)** page for your DevTest Labs lab resource.

1. In the list of formulas, select the formula you want to modify.

1. On the **Update formula** page, modify the configuration settings for the formula. The settings are similar to the options on the **Create formula** page.

   Follow the instructions in [Create formula from base image](#create-formula-from-base-image) and update the formula configuration as needed.

1. Select **Update Formula**.

DevTest Labs updates the formula with your configuration changes and returns to the **Formulas (reusable bases)** page for the lab.

## Delete formula

To delete any formula in your lab, follow these steps:

1. In the [Azure portal](https://portal.azure.com), go to the **Formulas (reusable bases)** page for your DevTest Labs lab resource.

1. In the list of formulas, locate the formula you want to remove.

1. Select **More options** (...) for the formula, and then select **Delete**:

   :::image type="content" source="./media/devtest-lab-create-formulas/delete-formula.png" alt-text="Screenshot that shows how to delete a formula in DevTest Labs.":::

1. In the confirmation popup dialog, select **Yes** to confirm the deletion.

DevTest Labs deletes the formula and removes it from the list on the **Formulas (reusable bases)** page for the lab.

## Related content

- [Add a VM to your lab](devtest-lab-add-vm.md)
- Choose between [custom images or formulas](./devtest-lab-comparing-vm-base-image-types.md)
