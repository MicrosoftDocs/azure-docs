---
title: Create a lab in Azure DevTest Labs | Microsoft Docs
description: Create a lab in Azure DevTest Labs for virtual machines
services: devtest-lab,virtual-machines
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.assetid: 8b6d3e70-6528-42a4-a2ef-449575d0f928
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/12/2016
ms.author: tarcher

---
# Create a lab in Azure DevTest Labs
## Prerequisites
To create a lab, you need:

* An Azure subscription. To learn about Azure purchase options, see [How to buy Azure](https://azure.microsoft.com/pricing/purchase-options/) or [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/). You must be the owner of the subscription to create the lab.

## Steps to create a lab in Azure DevTest Labs
The following steps illustrate how to use the Azure portal to create a lab in Azure DevTest Labs. 

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
2. Select **More services**, and then select **DevTest Labs** from the list.
3. On the **DevTest Labs** blade, select **Add**.
   
    ![Add a lab](./media/devtest-lab-create-lab/add-lab-button.png)
4. On the **Create a DevTest Lab** blade:
   
   1. Enter a **Lab Name** for the new lab.
   2. Select the **Subscription** to associate with the lab.
   3. Select a **Location** in which to store the lab.
   4. Select **Auto-shutdown** to specify if you want to enable - and define the parameters for - the automatic shutting down of all the lab's VMs. 
   5. Select **Pin to Dashboard** if you want a shortcut of the lab to appear on the portal dashboard.
   6. Select **Automation options** to get Azure Resource Manager templates for configuration automation. 
   7. Select **Create**.
    
    ![Create a lab blade](./media/devtest-lab-create-lab/create-devtestlab-blade.png)

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Next steps
Once you've created your lab, here are some next steps to consider:

* [Secure access to a lab](devtest-lab-add-devtest-user.md).
* [Set lab policies](devtest-lab-set-lab-policy.md).
* [Create a lab template](devtest-lab-create-template.md).
* [Create custom artifacts for your VMs](devtest-lab-artifact-author.md).
* [Add a VM with artifacts to a lab](devtest-lab-add-vm-with-artifacts.md).

