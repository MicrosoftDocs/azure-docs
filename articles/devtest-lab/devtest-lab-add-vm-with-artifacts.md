---
title: Manage VM artifacts in Azure DevTest Labs | Microsoft Docs
description: Learn how to manage VM artifacts in Azure DevTest Labs
services: devtest-lab,virtual-machines
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.assetid: 576509ce-6a33-4c26-87c7-de8b40271efa
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/24/2017
ms.author: tarcher

---
# Manage VM artifacts in Azure DevTest Labs
Azure DevTest Labs *artifacts* let you specify *actions* that are performed when the VM is provisioned. 

Artifact actions can perform procedures such as running Windows PowerShell scripts, running Bash commands, and installing software. 

Artifact *parameters* let you customize the artifact for your particular scenario.

This article shows you how to manage the artifacts for a VM in your lab.

## Add an existing artifact to a VM
While creating a VM, you can add existing artifacts. Each lab includes artifacts from the Public DevTest Labs Artifact Repository as 
well as artifacts that you've created and added to your own Artifact Repository.
To discover how to create artifacts, see the article, [Learn how to author your own artifacts for use with DevTest Labs](devtest-lab-artifact-author.md).

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
1. Select **More Services**, and then select **DevTest Labs** from the list.
1. From the list of labs, select the lab containing the VM with which you want to work.  
1. Select **My virtual machines**.
1. Select the desired VM.
1. Select **Artifacts**. 
1. Select **Apply artifacts**.
1. On the **Apply artifacts** blade, select the artifact you wish to add to the VM.
1. On the **Add artifact** blade, enter the required parameter values and any optional parameters that you need.  
1. Select **Add** to add the artifact and return to the **Apply artifacts** blade.
1. Continue adding artifacts as needed for your VM.
1. Once you've added your artifacts, you can [change the order in which the artifacts are run](#change-the-order-in-which-artifacts-are-run). You can also go back to [view or modify an artifact](#view-or-modify-an-artifact).
1. When you're done adding artifacts, select **Apply**

## Change the order in which artifacts are run
By default, the actions of the artifacts are executed in the order in which they are added to the VM. 
The following steps illustrate how to change the order in which the artifacts are run.

1. At the top of the **Apply artifacts** blade, select the link indicating the number of artifacts that have been added to the VM.
   
    ![Number of artifacts added to VM](./media/devtest-lab-add-vm-with-artifacts/devtestlab-add-artifacts-blade-selected-artifacts.png)
1. On the **Selected artifacts** blade, drag and drop the artifacts into the desired order. **Note:** If you have trouble dragging the artifact, make sure that you are dragging from the left side of the artifact. 
1. Select **OK** when done.  

## View or modify an artifact
The following steps illustrate how to view or modify the parameters of an artifact:

1. At the top of the **Apply artifacts** blade, select the link indicating the number of artifacts that have been added to the VM.
   
    ![Number of artifacts added to VM](./media/devtest-lab-add-vm-with-artifacts/devtestlab-add-artifacts-blade-selected-artifacts.png)
1. On the **Selected artifacts** blade, select the artifact that you want to view or edit.  
1. On the **Add artifact** blade, make any needed changes, and select **OK** to close the **Add artifact** blade.
1. Select **OK** to close the **Selected artifacts** blade.

## Save Azure Resource Manager template
An Azure Resource Manager template provides a declarative way to define a repeatable deployment. 
The following steps explain how to save the Azure Resource Manager template for the VM being created.
Once saved, you can use the Azure Resource Manager template to [deploy new VMs with Azure PowerShell](../azure-resource-manager/resource-group-overview.md#template-deployment).

1. On the **Virtual machine** blade, select **View ARM Template**.
2. On the **View Azure Resource Manager template** blade, select the template text.
3. Copy the selected text to the clipboard.
4. Select **OK** to close the **View Azure Resource Manager Template blade**.
5. Open a text editor.
6. Paste in the template text from the clipboard.
7. Save the file for later use.

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Next steps
* Learn how to [create custom artifacts for your DevTest Labs VM](devtest-lab-artifact-author.md).
