---
title: Manage formulas in Azure DevTest Labs to create VMs | Microsoft Docs
description: Learn how to update and remove Azure DevTest Labs formulas
services: devtest-lab,virtual-machines
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.assetid: 841dd95a-657f-4d80-ba26-59a9b5104fe4
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/07/2017
ms.author: tarcher

ms.custom: H1Hack27Feb2017

---
# Manage Azure DevTest Labs formulas

[!INCLUDE [devtest-lab-formula-definition](../../includes/devtest-lab-formula-definition.md)]

This article illustrates how to create a formula from either a base (custom image, Marketplace image, or another formula) or an existing VM. This article also guides you through managing existing formulas.

## Create a formula
Anyone with DevTest Labs *Users* permissions is able to create VMs using a formula as a base. 
There are two ways to create formulas: 

* From a base - Use when you want to define all the characteristics of the formula.
* From an existing lab VM - Use when you want to create a formula based on the settings of an existing VM.

For more information about adding users and permissions, see [Add owners and users in Azure DevTest Labs](./devtest-lab-add-devtest-user.md).

### Create a formula from a base
The following steps guide you through the process of creating a formula from a custom image, Marketplace image, or another formula.

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

2. Select **More Services**, and then select **DevTest Labs** from the list.

3. From the list of labs, select the desired lab.  

4. On the lab's blade, select **Formulas (reusable bases)**.
   
    ![Formula menu](./media/devtest-lab-create-formulas/lab-settings-formulas.png)

5. On the **Formulas** blade, select **+ Add**.
   
    ![Add a formula](./media/devtest-lab-create-formulas/add-formula.png)

6. On the **Choose a base** blade, select the base (custom image, Marketplace image, or formula) from which you want to create the formula.
   
    ![Base list](./media/devtest-lab-create-formulas/base-list.png)

7. On the **Create formula** blade, specify the following values:
   
	* **Formula name** - Enter a name for your formula. This value is displayed in the list of base images when you create a VM. The name is validated as you type it, and if not valid, a message indicates the requirements for a valid name.
	* **Description** - Enter a meaningful description for your formula. This value is available from the formula's context menu when you create a VM.
	* **User name** - Enter a user name that is granted administrator privileges.
	* **Password** - Enter - or select from the dropdown - a value that is associated with the secret (password) that you want to use for the specified user. For more information about the secrets, see [Azure DevTest Labs: Personal secret store](https://azure.microsoft.com/updates/azure-devtest-labs-keep-your-secrets-safe-and-easy-to-use-with-the-new-personal-secret-store/).
	* **Virtual machine disk type** - Specify either HDD (hard-disk drive) or SSD (solid-state drive) to indicate which storage disk type is allowed for the virtual machines provisioned using this base image.
	* ** Virtual machine size** - Select one of the predefined items that specify the processor cores, RAM size, and the hard drive size of the VM to create. 
	* **Artifacts** - Select to open the **Add artifacts** blade, in which you select and configure the artifacts that you want to add to the base image. For more information about artifacts, see [Manage VM artifacts in Azure DevTest Labs](./devtest-lab-add-vm-with-artifacts.md).
	* **Advanced settings** - Select to open the **Advanced** blade where you configure the following settings:
		* **Virtual network** - Specify the desired virtual network.
		* **Subnet** - Specify the desired subnet.    
		* **IP address configuration** - Specify if you want the Public, Private, or Shared IP addresses. For more information about shared IP addresses, see [Understand shared IP addresses in Azure DevTest Labs](./devtest-lab-shared-ip.md).
		* **Make this machine claimable** - Making a machine "claimable" means that it will not be assigned ownership at the time of creation. Instead lab users will be able to take ownership ("claim") the machine in the lab's blade.     
	* **Image** - This field displays name of the base image you selected on the previous blade. 
     
       ![Create formula](./media/devtest-lab-create-formulas/create-formula.png)

8. Select **Create** to create the formula.

9. When the formula has been created, it displays in the list on the **Formulas** blade.

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
   
    ![Labs VMs](./media/devtest-lab-create-formulas/my-vms.png)
5. On the VM's blade, select **Create formula (reusable base)**.
   
    ![Create formula](./media/devtest-lab-create-formulas/create-formula-menu.png)
6. On the **Create formula** blade, enter a **Name** and **Description** for your new formula.
   
    ![Create formula blade](./media/devtest-lab-create-formulas/create-formula-blade.png)
7. Select **OK** to create the formula.

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

