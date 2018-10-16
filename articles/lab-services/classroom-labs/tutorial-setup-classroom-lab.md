---
title: Set up a classroom lab using Azure Lab Services | Microsoft Docs
description: In this tutorial, you set up a lab to use in a classroom. 
services: devtest-lab, lab-services, virtual-machines
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.custom: mvc
ms.date: 10/05/2018
ms.author: spelluru

---
# Tutorial: Set up a classroom lab 
In this tutorial, you set up a classroom lab with virtual machines that are used by students in the classroom.  

In this tutorial, you do the following actions:

> [!div class="checklist"]
> * Create a classroom lab
> * Configure the classroom lab
> * Send registration link to students

## Prerequisites
To set up a classroom lab in a lab account, you must be a member of the **Lab Creator** role in the lab account. The account you used to create a lab account is automatically added to this role. A lab owner can add other users to the Lab Creator role by using steps in the following article: [Add a user to the Lab Creator role](tutorial-setup-lab-account.md#add-a-user-to-the-lab-creator-role).


## Create a classroom lab

1. Navigate to [Azure Lab Services website](https://labs.azure.com). 
2. Select **Sign in** and enter your credentials. Azure Lab Services supports organizational accounts and Microsoft accounts. 
3. In the **New Lab** window, do the following actions: 
    1. Specify a **name** for your lab. 
    2. Specify the maximum **number of users** allowed into the lab. 
    6. Select **Save**.

        ![Create a classroom lab](../media/tutorial-setup-classroom-lab/new-lab-window.png)
4. On the **Select virtual machine specifications** page, do the following steps:
    1. Select a **size** for virtual machines (VMs) created in the lab. 
    2. Select the **region** in which you want the VMs to be created. 
    3. Select the **VM image** to be used to create VMs in the lab. 
    4. Select **Next**.

        ![Specify VM specifications](../media/tutorial-setup-classroom-lab/select-vm-specifications.png)    
5. On the **Set credentials** page, specify default credentials for all VMs in the lab. 
    1. Specify the **name of the user** for all VMs in the lab.
    2. Specify the **password** for the user. 

        > [!IMPORTANT]
        > Make a note of user name and password. They won't be shown again.
    3. Select **Create**. 

        ![Set credentials](../media/tutorial-setup-classroom-lab/set-credentials.png)
6. On the **Configure template** page, you see the status of lab creation process. The creation of the template in the lab takes up to 20 minutes. 

    ![Configure template](../media/tutorial-setup-classroom-lab/configure-template.png)
7. After the configuration of the template is complete, you see the following page: 

    ![Configure template page after it's done](../media/tutorial-setup-classroom-lab/configure-template-after-complete.png)
8. The following steps are optional steps in this tutorial: 
    1. Start the template VM by selecting **Start**.
    2. Connect to the template VM by selecting **Connect**. 
    3. Install and configure software on your template VM. 
    4. **Stop** the VM.  
    5. Enter a **description** for the template

        ![Next on Configure template page](../media/tutorial-setup-classroom-lab/configure-template-next.png)
9. Select **Next** on the template page. 
10. On **Publish the template** page, do the following actions. 
    1. To publish the template immediately, select the checkbox for *I understand I can't modify the template after publishing. This process can only be done once and can take up to an hour*, and select **Publish**.  

        > [!WARNING]
        > Once you publish, you can't unpublish. 
    2. To publish later, select **Save for later**. You can publish the template VM after the wizard completes. For details on how to configure and publish after the wizard completes, see [Publish the template](how-to-manage-classroom-labs.md#publish-the-template) section in the [How to manage classroom labs](how-to-manage-classroom-labs.md) article.

        ![Publish template](../media/tutorial-setup-classroom-lab/publish-template.png)
11. You see the **progress of publishing** the template. This process can take up to an hour. 

    ![Publish template - progress](../media/tutorial-setup-classroom-lab/publish-template-progress.png)
12. You see the following page when the template is published successfully. Select **Done**.

    ![Publish template - success](../media/tutorial-setup-classroom-lab/publish-success.png)
1. You see the **dashboard** for the lab. 
    
    ![Classroom lab dashboard](../media/tutorial-setup-classroom-lab/classroom-lab-home-page.png)
4. Switch to the **Virtual machines** page, and confirm that you see virtual machines that are in **Unassigned** state. These VMs are not assigned to students yet. They should be in **Stopped** state. You can start a student VM, connect to the VM, stop the VM, and delete the VM on this page. You can start them in this page or let your students start the VMs. 

    ![Virtual machines in stopped state](../media/tutorial-setup-classroom-lab/virtual-machines-stopped.png)

## Send registration link to students

1. Switch to the **Dashboard** view by selecting **Dashboard** on the left menu. 
2. Select **User registration** tile.

    ![Student registration link](../media/tutorial-setup-classroom-lab/dashboard-user-registration-link.png)
1. In the **User registration** dialog box, select the **Copy** button. The link is copied to the clipboard. Paste it in an email editor, and send an email to the student. 

    ![Student registration link](../media/tutorial-setup-classroom-lab/registration-link.png)
2. On the **User registration** dialog box, select **Close**. 
3. Share the registration link with a student so that the student can register for the class. 


## Next steps
In this tutorial, you created a classroom lab, and configured the lab. To learn how a student can access a VM in the lab using the registration link, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Connect to a VM in the classroom lab](tutorial-connect-virtual-machine-classroom-lab.md)

