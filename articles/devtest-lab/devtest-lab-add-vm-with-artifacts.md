---
title: Add a VM with artifacts to a lab in Azure DevTest Labs | Microsoft Docs
description: Learn how to add a VM with artifacts in Azure DevTest Labs
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
# Add a VM with artifacts to a lab in Azure DevTest Labs
> [!VIDEO https://channel9.msdn.com/Blogs/Windows-Azure/How-to-create-VMs-with-Artifacts-in-a-DevTest-Lab/player]
> 
> 

You create a VM in a lab from a *base* that is either a [custom image](devtest-lab-create-template.md), [formula](devtest-lab-manage-formulas.md), or [Marketplace image](devtest-lab-configure-marketplace-images.md).

DevTest Labs *artifacts* let you specify *actions* that are performed when the VM is created. 

Artifact actions can perform procedures such as running Windows PowerShell scripts, running Bash commands, and installing software. 

Artifact *parameters* let you customize the artifact for your particular scenario.

This article shows you how to create a VM in your lab with artifacts.

## Add a VM with artifacts
1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
2. Select **More Services**, and then select **DevTest Labs** from the list.
3. From the list of labs, select the lab in which you want to create the VM.  
4. On the lab's **Overview** blade, select **+ Virtual Machine**.  
    ![Add VM button](./media/devtest-lab-add-vm-with-artifacts/devtestlab-home-blade-add-vm.png)
5. On the **Choose a base** blade, select a base for the VM.
6. On the **Virtual machine** blade, enter a name for the new virtual machine in the **Virtual machine name** text box.
   
    ![Lab VM blade](./media/devtest-lab-add-vm-with-artifacts/devtestlab-lab-vm-blade.png)
7. Enter a **User Name** that will be granted administrator privileges on the virtual machine.  
8. If you want to use a password stored in your *secret store*, select **Use secrets from my secret store**, and specify a key value that corresponds to your secret (password). Otherwise, simply enter a password in the text field labeled **Type a value**.
9. Select **Virtual machine size** and select one of the predefined items that specify the processor cores, RAM size, and the hard drive size of the VM to create.
10. Select **Virtual network** and select the desired virtual network.
11. Select **Subnet** and select subnet.
12. If the lab policy is set to allow public IP addresses for the selected subnet, specify whether you want the IP address to be public by 
    selecting either **Yes** or **No**. Otherwise, this option is disabled and selected as **No**. 
13. Select **Artifacts** and - from the list of artifacts - select and configure the artifacts that you want to add to the base image. 
    **Note:** If you're new to DevTest Labs or configuring artifacts, skip to the [Add an existing artifact to a VM](#add-an-existing-artifact-to-a-vm) section, 
    and then return here when finished.
14. If you want to view or copy the Azure Resource Manager template, skip to the [Save Azure Resource Manager template](#save-arm-template) section, and return here when finished.
15. Select **Create** to add the specified VM to the lab.
16. The lab blade displays the status of the VM's creation; first as **Creating**, then as **Running** after the VM has been started.
17. Go to the [Next Steps](#next-steps) section. 

## Add an existing artifact to a VM
While creating a VM, you can add existing artifacts. Each lab includes artifacts from the Public DevTest Labs Artifact Repository as 
well as artifacts that you've created and added to your own Artifact Repository.
To discover how to create artifacts, see the article, [Learn how to author your own artifacts for use with DevTest Labs](devtest-lab-artifact-author.md).

1. On the **Virtual machine** blade, select **Artifacts**. 
2. On the **Add artifacts** blade, select the desired artifact.  
   
    ![Add Artifacts blade](./media/devtest-lab-add-vm-with-artifacts/devtestlab-add-artifact-blade.png)
3. Enter the required parameter values and any optional parameters that you need.  
4. Select **Add** to add the artifact and return to the **Add Artifacts** blade.
5. Continue adding artifacts as needed for your VM.
6. Once you've added your artifacts, you can [change the order in which the artifacts are run](#change-the-order-in-which-artifacts-are-run). You can 
   also go back to [view or modify an artifact](#view-or-modify-an-artifact).

## Change the order in which artifacts are run
By default, the actions of the artifacts are executed in the order in which they are added to the VM. 
The following steps illustrate how to change the order in which the artifacts are run.

1. At the top of the **Add Artifacts** blade, select the link indicating the number of artifacts that have been added to the VM.
   
    ![Number of artifacts added to VM](./media/devtest-lab-add-vm-with-artifacts/devtestlab-add-artifacts-blade-selected-artifacts.png)
2. To specify the order in which the artifacts are run, drag and drop the artifacts into the desired order. **Note:** If you have having trouble dragging the artifact, make sure that you are dragging from the left side of the artifact. 
3. Select **OK** when done.  

## View or modify an artifact
The following steps illustrate how to view or modify the parameters of an artifact:

1. At the top of the **Add Artifacts** blade, select the link indicating the number of artifacts that have been added to the VM.
   
    ![Number of artifacts added to VM](./media/devtest-lab-add-vm-with-artifacts/devtestlab-add-artifacts-blade-selected-artifacts.png)
2. On the **Selected Artifacts** blade, select the artifact that you want to view or edit.  
3. On the **Add Artifact** blade, make any needed changes, and select **OK** to close the **Add Artifact** blade.
4. Select **OK** to close the **Selected Artifacts** blade.

## Save Azure Resource Manager template
An Azure Resource Manager template provides a declarative way to define a repeatable deployment. 
The following steps explain how to save the Azure Resource Manager template for the VM being created.
Once saved, you can use the Azure Resource Manager template to [deploy new VMs with Azure PowerShell](../azure-resource-manager/resource-group-overview.md#template-deployment).

1. On the **Virtual machine** blade, select **View ARM Template**.
2. On the **View Azure Resource Manager Template blade**, select the template text.
3. Copy the selected text to the clipboard.
4. Select **OK** to close the **View Azure Resource Manager Template blade**.
5. Open a text editor.
6. Paste in the template text from the clipboard.
7. Save the file for later use.

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Next steps
* Once the VM has been created, you can connect to the VM by selecting **Connect** on the VM's blade.
* Learn how to [create custom artifacts for your DevTest Labs VM](devtest-lab-artifact-author.md).
* Explore the [DevTest Labs ARM QuickStart template gallery](https://github.com/Azure/azure-devtestlab/tree/master/ARMTemplates)

