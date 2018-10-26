---
title: Configure usage settings in classroom labs of Azure Lab Services | Microsoft Docs
description: Learn how to configure the number of users for the lab, get them registered with the lab, control the number of hours they can use the VM, and more. 
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
ms.date: 10/01/2018
ms.author: spelluru

---
# Configure usage settings and policies
This article describes how to configure the number of users for the lab, get them registered with the lab, control the number of hours they can use the VM, and more. 


## Specify the number of users allowed into the lab

1. Select **Usage policy**. 
2. In the **Usage policy**, settings, enter the **number of users** allowed to use the lab.
3. Select **Save**. 

    ![Usage policy](../media/how-to-manage-classroom-labs/usage-policy-settings.png)

## Send registration link to users

1. Switch to the **Dashboard** view. 
2. Select **User registration** tile.

    ![Student registration link](../media/tutorial-setup-classroom-lab/dashboard-user-registration-link.png)
1. In the **User registration** dialog box, select the **Copy** button. The link is copied to the clipboard. Paste it in an email editor, and send an email to the student. Students use the link to navigate to the page that helps them with registering with the lab. 

    ![Student registration link](../media/tutorial-setup-classroom-lab/registration-link.png)
2. On the **User registration** dialog box, select **Close**. 

## View users registered with the lab

Select **Users** on the left menu to see the list of users registered with the lab. 

![List of users registered with the lab](../media/how-to-configure-student-usage/users-list.png)

## Set quotas per user

1. Select **User settings** on the left menu.
2. Select **Quta per user** tile. 
3. Select **Limit the number of hours a user can use a VM**. 
4. For **How many hours do you want to give to each user?**, enter the number of hours, and select **Save**. 

    ![Number of hours per user](../media/how-to-configure-student-usage/number-of-hours-per-user.png)
5. You see the number of hours on the **Quota per user** tile now. 

    ![Quota per user](../media/how-to-configure-student-usage/quota-per-user.png)

## Manage user VMs
Once students register with Azure Lab Services using the registration link you provided to them, you see the VMs assigned to students on the **Virtual machines** tab. 

![Virtual machines assigned to students](../media/how-to-manage-classroom-labs/virtual-machines-students.png)

You can do the following tasks on a student VM: 

- Stop a VM if the VM is running. 
- Start a VM if the VM is stopped. 
- Connect to the VM. 
- Delete the VM. 
- View the number of hours that users used the virtual machine. 


## Next steps
Get started with setting up a lab using Azure Lab Services:

- [Set up a classroom lab](how-to-manage-classroom-labs.md)
- [Set up a lab](../tutorial-create-custom-lab.md)
