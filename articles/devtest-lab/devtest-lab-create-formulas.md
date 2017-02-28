---
title: Create formulas in Azure DevTest Labs | Microsoft Docs
description: Learn how to create Azure DevTest Labs formulas, and use them to create new VMs.
services: devtest-lab,virtual-machines
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.assetid: 
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/28/2017
ms.author: tarcher

---
# Create Azure DevTest Labs formulas

[!INCLUDE [devtest-lab-formula-definition](../../includes/devtest-lab-formula-definition.md)]

This article illustrates how to create a formula from either a base (custom image, Marketplace image, or another formula) or an existing VM. 

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

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Related blog posts
* [Custom images or formulas?](https://blogs.msdn.microsoft.com/devtestlab/2016/04/06/custom-images-or-formulas/)

## Next steps
- [Add a VM to a lab in Azure DevTest Labs](devtest-lab-add-vm.md) - Once you've created a formula, you can create a VM based on the formula. 
- [Manage Azure DevTest Labs formulas](devtest-lab-manage-formulas.md) - Learn how to update and remove Azure DevTest Labs formulas