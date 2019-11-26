---
title: Manage a template of a classroom lab in Azure Lab Services | Microsoft Docs
description: Learn how to create and manage a classroom lab template in Azure Lab Services. 
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/31/2019
ms.author: spelluru

---
# Create and manage a classroom template in Azure Lab Services
A template in a lab is a base virtual machine image from which all users’ virtual machines are created. Set up the template virtual machine so that it is configured with exactly what you want to provide to the lab users. You can provide a name and description of the template that the lab users see. Then, you publish the template to make instances of the template VM available to your lab users. When you publish a template, Azure Lab Services creates VMs in the lab by using the template. The number of VMs created in this process is same as the maximum number of users allowed into the lab, which you can set in the usage policy of the lab. All virtual machines have the same configuration as the template.

This article describes how to create and manage a template virtual machine in a classroom lab of Azure Lab Services. 

## Publish a template while creating a classroom lab
To learn how to publish a template while creating a classroom lab, see [Create a classroom lab](how-to-manage-classroom-labs.md#create-a-classroom-lab)
 
## Set or update template title and description
Use the following steps to set title and description for the first time, and update them later. 

1. On the **Template** page, enter the new **title** for the lab.  
2. Enter the new **description** for the template. When you move the focus out of the text box, it's automatically saved. 

    ![Template name and description](../media/how-to-create-manage-template/template-name-description.png)

## Update a template VM
Use the following steps to update a template VM.  

1. On the **Template** page, select **Customize template** on the toolbar. 
2. On the **Customize template** dialog, select **Continue**. Once you start the template and make changes, it will no longer have the same setup as the virtual machines last published to your users. Template changes will not be reflected on your users' existing virtual machines until after you publish again.

    ![Customize dialog box](../media/how-to-create-manage-template/customize-template-dialog.png)
1. Wait until the template VM is started, and then select **Connect to template** on the toolbar to connect to the template VM, and follow instructions. If it's a Windows machine, you will see an option to download the RDP file. 

    ![Connect to the template VM](../media/how-to-create-manage-template/connect-template-vm.png)
1. Install any software that's required for students to do the lab (for example, Visual Studio, Azure Storage Explorer, etc.). 
2. Disconnect (close your remote desktop session) from the template VM. 
3. **Stop** the template VM by selecting **Stop template**. 
4. Follow steps in the next section to **publish** the updated template VM. 

## Publish the template VM  
If you don't publish the template while creating the lab, you can publish it later. Before publishing, you may want to connect to the template VM, and update it with any software. When you publish a template, Azure Lab Services creates VMs in the lab by using the template. The number of VMs created in this process are the number of VMs you specified when you published it for the first time or what you specified on the Virtual machine pool page. All virtual machines have the same configuration as the template. 

1. On the **Template** page, select **Publish** on the toolbar. 
1. On the **Publish the template** message box, review the message, and select **Publish**. This process may take some time depending on how many VMs are being created.

    ![Publish button](../media/how-to-create-manage-template/publish-button.png)

    > [!IMPORTANT]
    > Once a template is published, it can't be unpublished. You can republish the template though. 
4. You can see the status of the publishing process on the Template page. Wait for the status of the template to change to **Published**. 

    ![Publish status](../media/how-to-create-manage-template/publish-status.png)
1. Switch to the **Virtual machines** page, and confirm that you see virtual machines that are in **Unassigned** state. These VMs are not assigned to students yet. Wait until the VMs are created. They should be in **Stopped** state. You can start a student VM, connect to the VM, stop the VM, and delete the VM on this page. You can start them on this page or let your students start the VMs. 

    ![Virtual machines in stopped state](../media/tutorial-setup-classroom-lab/virtual-machines-stopped.png)


## Next steps
See the following articles:

- [As an admin, create and manage lab accounts](how-to-manage-lab-accounts.md)
- [As a lab owner, create and manage labs](how-to-manage-classroom-labs.md)
- [As a lab owner, configure and control usage of a lab](how-to-configure-student-usage.md)
- [As a lab user, access classroom labs](how-to-use-classroom-lab.md)
