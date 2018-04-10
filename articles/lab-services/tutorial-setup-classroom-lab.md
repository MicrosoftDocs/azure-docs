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
ms.date: 04/09/2018
ms.author: spelluru

---
# Tutorial: Set up a classroom lab 
In this tutorial, you set up a classroom lab with a set of virtual machines that are used by students in the classroom.  

In this tutorial, you do the following actions:

> [!div class="checklist"]
> * Create a classroom lab
> * Configure the classroom lab
> * Send registration link to students

## Create a classroom lab

1. Navigate to [Azure Lab Services portal](https://labs.azure.com).
2. In the **New Lab** window, do the following actions: 
    1. Specify a **name** for the classroom lab. 
    2. Select the **size** of the virtual machine to use in the classroom.
    3. Select the **image** to use to create the virtual machine.
    4. Specify the **name of the user** who has access to the lab. 
    5. Specify the password for the user. 
    6. Confirm the password. 
    7. Select **Save**.
        ![Create a classroom lab](./media/tutorial-setup-classroom-lab/new-lab-window.png)
3. You see the **home page** for the lab. 
    
    ![Classroom lab home page](./media/tutorial-setup-classroom-lab/classroom-lab-home-page.png)

## Configure the classroom lab

1. Select **Usage policy**. 
2. In the **Usage policy**, settings, enter the **number of users** allowed to use the lab, and select **Save**. 
    ![Usage policy](./media/tutorial-setup-classroom-lab/usage-policy-settings.png)
3. Select **Availability** in the **Template** section. 
4. In the **Availability** page, select **Public**, and select **Save**.

    ![Availablity](./media/tutorial-setup-classroom-lab/public-access.png)
5. Select **User view** in the **Template** section.
6. In the **User view** window, specify a **title for the template**, **description for the template**, and select **Save**.

    ![Classroom lab description](./media/tutorial-setup-classroom-lab/lab-description.png)

## Send registration link to students

1. Select **User registration** tile.
2. You see the URL in the **User registration** window that you can send to students in the class. The link is copied to the clipboard, so you can paste it in an email editor, and send an email to the student. 

    ![Student registration link](./media/tutorial-setup-classroom-lab/registration-link.png)

## Next steps
In this tutorial, you created a classroom lab, and configured the lab. To learn how a student can access a VM in the lab using the registration link, advance to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Connect to a VM in the classroom lab](tutorial-connect-to-vm-in-classroom-lab.md)

