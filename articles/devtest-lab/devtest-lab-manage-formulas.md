---
title: Manage formulas in Azure DevTest Labs to create VMs | Microsoft Docs
description: Learn how to create, update, and remove Azure DevTest Labs formulas, and use them to create new VMs.
services: devtest-lab,virtual-machines
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/30/2016
ms.author: tarcher

---
# Manage DevTest Labs formulas to create VMs
A formula in Azure DevTest Labs is a list of default property values used to create a virtual machine (VM). When creating a VM from a formula, the default values can be used as-is, or modified. Like [custom images](devtest-lab-create-template.md) and [Marketplace images](devtest-lab-configure-marketplace-images.md), formulas provide a mechanism for fast VM provisioning.  

In this article, you'll learn how to perform the following tasks:

* [Create a formula](#create-a-formula)
* [Use a formula to provision a VM](#use-a-formula-to-provision-a-vm)
* [Modify a formula](#modify-a-formula)
* [Delete a formula](#delete-a-formula)

> [!NOTE]
> Formulas - like [custom images](devtest-lab-create-template.md) - enable you to create a base image from a VHD file. The base image can then be used to provision a new VM. To help decide which is right
> for your particular environment, refer to the article, [Comparing custom images and formulas in DevTest Labs](devtest-lab-comparing-vm-base-image-types.md).
> 
> 

## Create a formula
Anyone with DevTest Labs *Users* permissions is able to create VMs using a formula as a base. 
There are two ways to create formulas: 

* From a base - Use when you want to define all the characteristics of the formula.
* From an existing lab VM - Use when you want to create a formula based on the settings of an existing VM.

### Create a formula from a base
The following steps guide you through the process of creating a formula from a custom image, Marketplace image, or another formula.

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
2. Select **More Services**, and then select **DevTest Labs** from the list.
3. From the list of labs, select the desired lab.  
4. On the lab's blade, select **Formulas (reusable bases)**.
   
    ![Formula menu](./media/devtest-lab-manage-formulas/lab-settings-formulas.png)
5. On the **Lab formulas** blade, select **+ Add**.
   
    ![Add a formula](./media/devtest-lab-manage-formulas/add-formula.png)
6. On the **Choose a base** blade, select the base (custom image, Marketplace image, or formula) from which you want to create the formula.
   
    ![Base list](./media/devtest-lab-manage-formulas/base-list.png)
7. On the **Create formula** blade, specify the following values:
   
   * **Formula name** - Enter a name for your formula. This value will be displayed in the list of base images when you create a VM. The name is validated as you type it, and if not valid, a message will indicate the requirements for a valid name.
   * **Description** - Enter a meaningful description for your formula. This value is available from the formula's context menu when you create a VM.
   * **User name** - Enter a user name that will be granted administrator privileges.
   * **Password** - Enter - or select from the dropdown - a value that is associated with the secret (password) that you want to use for the specified user.  
   * **Image** - This field displays name of the base image you selected on the previous blade. 
   * **Virtual machine size** - Select one of the predefined items that specify the processor cores, RAM size, and the hard drive size of the VM to create.
   * **Virtual network** - Specify the desired virtual network.
   * **Subnet** - Specify the desired subnet.
   * **Public IP address** - If the lab policy is set to allow public IP addresses for the selected subnet, specify whether you want the IP address to be public by selecting either **Yes** or **No**. Otherwise, this option is disabled and selected as **No**.
   * **Artifacts** - Select and configure the artifacts that you want to add to the base image. Secure string values are not saved with the formula. Therefore, artifact parameters that are secure strings are not displayed. 
     
       ![Create formula](./media/devtest-lab-manage-formulas/create-formula.png)
8. Select **Create** to create the formula.

### Create a formula from a VM
The following steps guide you through the process of creating a formula based on an existing VM. 

> [!NOTE]
> To create a formula from a VM, the VM must have been created after March 30, 2016. 
> 
> 

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
2. Select **More Services**, and then select **DevTest Labs** from the list.
3. From the list of labs, select the desired lab.  
4. On the lab's **Overview** blade, select the VM from which you wish to create the formula.
   
    ![Labs VMs](./media/devtest-lab-manage-formulas/my-vms.png)
5. On the VM's blade, select **Create formula (reusable base)**.
   
    ![Create formula](./media/devtest-lab-manage-formulas/create-formula-menu.png)
6. On the **Create formula** blade, enter a **Name** and **Description** for your new formula.
   
    ![Create formula blade](./media/devtest-lab-manage-formulas/create-formula-blade.png)
7. Select **OK** to create the formula.

## Use a formula to provision a VM
Once you've created a formula, you can create a VM based on that formula. The section
[Add a VM with artifacts](devtest-lab-add-vm-with-artifacts.md#add-a-vm-with-artifacts) walks you through the process.

## Modify a formula
To modify a formula, follow these steps:

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
2. Select **More Services**, and then select **DevTest Labs** from the list.
3. From the list of labs, select the desired lab.  
4. On the lab's blade, select **Formulas (reusable bases)**.
   
    ![Formula menu](./media/devtest-lab-manage-formulas/lab-settings-formulas.png)
5. On the **Lab formulas** blade, select the formula you wish to modify.
6. On the **Update formula** blade, make the desired edits, and select **Update**.

## Delete a formula
To delete a formula, follow these steps:

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
2. Select **More Services**, and then select **DevTest Labs** from the list.
3. From the list of labs, select the desired lab.  
4. On the lab **Settings** blade, select **Formulas**.
   
    ![Formula menu](./media/devtest-lab-manage-formulas/lab-settings-formulas.png)
5. On the **Lab formulas** blade, select the ellipsis to the right of the formula you wish to delete.
   
    ![Formula menu](./media/devtest-lab-manage-formulas/lab-formulas-blade.png)
6. On the formula's context menu, select **Delete**.
   
    ![Formula context menu](./media/devtest-lab-manage-formulas/formula-delete-context-menu.png)
7. Select **Yes** to the deletion confirmation dialog.

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Related blog posts
* [Custom images or formulas?](https://blogs.msdn.microsoft.com/devtestlab/2016/04/06/custom-images-or-formulas/)

## Next steps
Once you have created a formula for use when creating a VM, the next step is to [add a VM to your lab](devtest-lab-add-vm-with-artifacts.md).

