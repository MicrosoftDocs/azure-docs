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
ms.date: 04/20/2018
ms.author: spelluru

---
# How to access a classroom lab in Azure Lab Services
This article describes how to access a classroom lab, connect to the VM in the lab, and stop the VM. 

## View all the labs

Navigate to the **registration URL** that you received from the professor/educator. Confirm that you see the labs that you have access to.     

![View all labs](./media/how-to-use-classroom-lab/all-labs.png)

## Connect to the virtual machine in a lab

1. Select **Connect** on the tile that represents the classroom lab. It takes sometime for the virtual machine to be ready.

    ![View all labs](./media/how-to-use-classroom-lab/connect-button.png)
2. It takes a few minutes for the virtual machine to be ready.

    ![Getting the virtual machine to be ready](./media/how-to-use-classroom-lab/getting-virtual-machine-ready.png)
3. Save the RDP file to the hard disk and open it. 
    
    ![Save the RDP file](./media/how-to-use-classroom-lab/save-rdp-file.png)
4. Use the **user name** and **password** you get from your educator/professor to log in to the machine. 

## Stop the virtual machine in a lab

Select **Stop** on the tile that represents the classroom lab. When the VM is stopped, the **Start** button on the tile is enabled. 

## Next steps
Get started with setting up a lab using Azure Lab Services:

- [Set up a classroom lab](how-to-manage-classroom-labs.md)
- [Set up a custom lab](tutorial-create-custom-lab.md)

 