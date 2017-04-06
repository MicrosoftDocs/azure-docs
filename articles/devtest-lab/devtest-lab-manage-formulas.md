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

The article, [Create Azure DevTest Labs formulas](devtest-lab-create-formulas.md#create-a-formula), walks you through the process of creating a formula in Azure DevTest Labs. Once you have a formula, this article guides you through managing formulas.

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

