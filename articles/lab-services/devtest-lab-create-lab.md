---
title: Create a lab in Azure DevTest Labs | Microsoft Docs
description: Create a lab in Azure DevTest Labs for virtual machines
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila
editor: ''

ms.assetid: 8b6d3e70-6528-42a4-a2ef-449575d0f928
ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/25/2019
ms.author: spelluru	

---
# Create a lab in Azure DevTest Labs
A lab in Azure DevTest Labs is the infrastructure that encompasses a group of resources, such as Virtual Machines (VMs), that lets you better manage those resources by specifying limits and quotas. This article walks you through the process of creating a lab using the Azure portal.

## Prerequisites
To create a lab, you need:

* An Azure subscription. To learn about Azure purchase options, see [How to buy Azure](https://azure.microsoft.com/pricing/purchase-options/) or [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/). You must be the owner of the subscription to create the lab.

## Steps to create a lab in Azure DevTest Labs
The following steps illustrate how to use the Azure portal to create a lab in Azure DevTest Labs. 

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).
1. From the main menu on the left side, select **All Services** (at the top of the list). Select * (star) next to **DevTest Labs** in the **DEVOPS** section. This action adds **DevTest Labs** to the left navigational menu so that you can access it easily the next time. 

	![All services - select DevTest Labs](./media/devtest-lab-create-lab/all-services-select.png)
2. Now, select **DevTest Labs** on the left navigational menu. Select **Add** on the toolbar. 
   
    ![Add a lab](./media/devtest-lab-create-lab/add-lab-button.png)
1. On the **Create a DevTest Lab** page, do the following actions: 
    1. Enter a **name** for the lab.
    2. Select the **Subscription** to associate with the lab.
    3. Enter a **name for the resource group** for the lab. 
    4. Select a **location** in which to store the lab.
	4. Select **Auto-shutdown** to specify if you want to enable - and define the parameters for - the automatic shutting down of all the lab's VMs. The auto-shutdown feature is mainly a cost-saving feature whereby you can specify when you want the VM to automatically be shut down. You can change auto-shutdown settings after creating the lab by following the steps outlined in the article [Manage all policies for a lab in Azure DevTest Labs](./devtest-lab-set-lab-policy.md#set-auto-shutdown).
	1. Enter **NAME** and **VALUE** information for **Tags** if you want to create custom tagging that is added to every resource you will create in the lab. Tags are useful to help you manage and organize lab resources by category. For more information about tags, including how to add tags after creating the lab, see [Add tags to a lab](devtest-lab-add-tag.md).
	6. Select **Automation options** to get Azure Resource Manager templates for configuration automation. 
	7. Select **Create**. You can monitor the status of the lab creation process by watching the **Notifications** area. 
    
        ![Create a lab section of DevTest Labs](./media/devtest-lab-create-lab/create-devtestlab-blade.png)
    8. Once completed, select **Go to resource** in the notification. Alternatively, refresh the **DevTest Labs** page to see the newly created lab in the list of labs.  Select the lab in the list. You see the home page for your lab. 

        ![Home page for the lab](./media/devtest-lab-create-lab/lab-home-page.png)

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Next steps
Once you've created your lab, here are some next steps to consider:

* [Secure access to a lab](devtest-lab-add-devtest-user.md)
* [Set lab policies](devtest-lab-set-lab-policy.md)
* [Create a lab template](devtest-lab-create-template.md)
* [Create custom artifacts for your VMs](devtest-lab-artifact-author.md)
* [Add a VM to a lab](devtest-lab-add-vm.md)

