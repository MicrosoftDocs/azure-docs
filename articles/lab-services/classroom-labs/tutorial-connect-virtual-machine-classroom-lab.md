---
title: Access a classroom lab in Azure Lab Services | Microsoft Docs
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
ms.date: 07/30/2018
ms.author: spelluru

---
# Tutorial: Access a classroom lab in Azure Lab Services
In this tutorial, you, as a student, connect to a virtual machine (VM) in a classroom lab. 

In this tutorial, you do the following actions:

> [!div class="checklist"]
> * Use registration link 
> * Connect to the virtual machine

## Use the registration link

1. Navigate to the **registration URL** that you received from the professor/educator. 
2. Sign in to the service using your school account to complete the registration. 
3. Once registered, confirm that you see the virtual machine for the lab you have access to. 
2. Wait until the virtual machine is ready, and then **start** the VM.

    ![Start the VM](../media/tutorial-connect-vm-in-classroom-lab/start-vm.png)

## Connect to the virtual machine

1. Select **Connect** on the tile that represents the virtual machine of the lab that you want to access. 

    ![Connect to VM](../media/tutorial-connect-vm-in-classroom-lab/connect-vm.png)
2. Save the RDP file to the hard disk and open it. 
3. Use the **user name** and **password** you get from your educator/professor for logging in to the machine. 

## Next steps
In this tutorial, you accessed a classroom lab using the registration link you get from your educator/professor.

As a lab owner, you want to view who is registered with your lab and track the usage of VMs. Advance to the next tutorial to learn how to do so:

> [!div class="nextstepaction"]
> [Track usage of a lab](tutorial-track-usage.md) 