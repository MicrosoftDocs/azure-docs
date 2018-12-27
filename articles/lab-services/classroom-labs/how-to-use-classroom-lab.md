---
title: How to access a classroom lab in Azure Lab Services | Microsoft Docs
description: In this tutorial, you access virtual machines in a classroom lab that's set up by a professor. 
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
ms.date: 11/15/2018
ms.author: spelluru

---
# How to access a classroom lab in Azure Lab Services
This article describes how to access a classroom lab, connect to the VM in the lab, and stop the VM. 

## Register to a lab
1. Navigate to the **registration URL** that you received from the professor/educator. 
2. Sign in to the service using your school account to complete the registration. 
3. Once registered, confirm that you see the virtual machine for the lab you have access to. 
2. Wait until the virtual machine is ready, and then **start** the VM. This process takes some time.  

    ![Start the VM](../media/tutorial-connect-vm-in-classroom-lab/start-vm.png)


## View all the classroom labs
After you register to the labs, you can view all the classroom labs by taking the following steps: 

1. Navigate to [https://labs.azure.com](https://labs.azure.com). 
2. Sign in to the service by using the user account that you used to register to the lab. 
3. Confirm that you see all the labs you have access to. 

    ![View all labs](../media/how-to-use-classroom-lab/all-labs.png)

## Connect to the virtual machine in a classroom lab

1. Start the VM if it's not already started, select **Start**.
2. Select **Connect** on the tile that represents the virtual machine of the lab that you want to access. 

    ![View all labs](../media/how-to-use-classroom-lab/connect-button.png)
3. Save the RDP file (for Windows VM) to the hard disk and open it. 
4. Use the **user name** and **password** you get from your educator/professor for logging in to the machine. 

## Stop the virtual machine in a classroom lab

To stop your VM, select **Stop** on the tile. When the VM is stopped, the **Start** button on the tile is enabled. 

## Next steps
See the following articles:

- [As an admin, create and manage lab accounts](how-to-manage-lab-accounts.md)
- [As a lab owner, create and manage labs](how-to-manage-classroom-labs.md)
- [As a lab owner, set up and publish templates](how-to-create-manage-template.md)
- [As a lab owner, configure and control usage of a lab](how-to-configure-student-usage.md)
 