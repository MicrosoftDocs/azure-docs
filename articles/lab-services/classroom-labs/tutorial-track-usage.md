---
title: Track usage of a lab in Azure Lab Services | Microsoft Docs
description: In this tutorial, you, as a lab creator/owner, track the usage of your lab. 
services: lab-services
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
ms.date: 01/17/2019
ms.author: spelluru

---
# Tutorial: Track usage of a lab in Azure Lab Service
This tutorial shows you how a lab creator/owner can track usage of a lab.

In this tutorial, you do the following actions:

> [!div class="checklist"]
> * View users registered with your lab
> * View the usage of VMs in the lab
> * Manage student VMs 


## View users registered with the lab

1. Navigate to [Azure Lab Services website](https://labs.azure.com). 
2. Select **Sign in** and enter your credentials. Azure Lab Services supports organizational accounts and Microsoft accounts.
3. On the **My labs** page, select the lab for which you want to track the usage. 
4. Select **Users** on the left menu or **Users** tile. You see students who have registered with your lab. Select **Registration link**, copy the link, and send it any new student who hasn't registered with your lab yet. 

    ![Registered users](../media/tutorial-track-usage/registered-users.png)

## View the usage of VMs in the lab 

1. Select **Virtual machines** on menu to the left. 
2. Confirm that you see the status of VMs and the number of hours the VMs have been running. The time that a lab owner spends on a student VM doesn't count against the usage time shown in the last column. 

    ![VM usage](../media/tutorial-track-usage/vm-usage.png)

## Manage student VMs 
As you hover the mouse over a row in the list of virtual machine, you see controls to do the following tasks (as shown in the image in the previous section): 

- Connect to a VM
- Start a VM
- Stop a VM
- Delete a VM


![VM controls](../media/tutorial-track-usage/vm-controls.png)

You can also use toolbar buttons to start, stop, or delete a VM. 



## Next steps
To learn more about classroom labs, see articles under [How-to guides](how-to-manage-lab-accounts.md).
