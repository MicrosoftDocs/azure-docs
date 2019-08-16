---
title: Enable remote desktop for Linux in Azure Lab Services | Microsoft Docs
description: Learn how to enable remote desktop for Linux virtual machines in a lab in Azure Lab Services.  
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
ms.date: 05/24/2019
ms.author: spelluru

---

# Enable and use remote desktop for Linux virtual machines in a lab in Azure Lab Services
This article shows you how to do the following tasks:

- Enable remote desktop for Linux VM
- How teacher can connect to the template VM via Remote Desktop Connection (RDP).
- How students connect to the student VM via RDP

## Enable remote desktop for Linux VM
During lab creation, teachers can enable **remote desktop connection** for **Linux** images. The **Enable Remote Desktop Connection** option is shown when a Linux image is selected for the template. When this option is enabled, teachers can connect to template VM and student VMs via RDP (Remote Desktop). 

![Enable remote desktop connection for a Linux image](../media/how-to-enable-remote-desktop-linux/enable-rdp-option.png)

On the **Enabling Remote Desktop Connection** message box, select **Continue with Remote Desktop**. 

![Enable remote desktop connection for a Linux image](../media/how-to-enable-remote-desktop-linux/enabling-remote-desktop-connection-dialog.png)

> [!IMPORTANT] 
> Enabling **remote desktop connection** only opens the **RDP** port on Linux machines. You, as a teacher, connect to the Linux machine using SSH for the first time, and install RDP and GUI packages so that you can connect to the Linux machine using RDP later. Then, you **publish** the image so that students can RDP in to the student Linux VMs. 

## Supported operating systems
Currently, the remote desktop connection is supported for the following operating systems:

- openSUSE Leap 42.3
- CentOS-based 7.5
- Debian 9 "Stretch"
- Ubuntu Server 16.04 LTS

## Teachers connecting to the template VM using RDP
Teachers must connect to the template VM using SSH first, and install RDP and GUI packages on it. Then, the teachers can use the following steps to connect to the Linux VMs using RDP: 

You see the **Remote Desktop** option to connect to the template VM at the time of creating the lab. 

![Connect to template via RDP at the time of creation](../media/how-to-enable-remote-desktop-linux/connect-at-creation.png)

You see the **Remote Desktop** option on the lab's home page after the lab is created and the template VM is started. Start the template VM if it's not started already. 

![Connect to template via RDP after the lab is created](../media/how-to-enable-remote-desktop-linux/rdp-after-lab-creation.png) 

For more information on connecting to the VM using SSH or RDP, see [Connect using SSH or RDP]((#connect-using-ssh-or-rdp). 

## Teachers connecting to a student VM using RDP
A teacher/professor can connect to a student VM by switching to the **Virtual Machines** view, and selecting the **connect** icon. Before that, teachers must **publish** the template image with RDP and GUI packages installed on it. 

![Teachers connecting to the student VM](../media/how-to-enable-remote-desktop-linux/teacher-connect-to-student-vm.png)

For more information on connecting to the VM using SSH or RDP, see [Connect using SSH or RDP]((#connect-using-ssh-or-rdp). 

## Students connecting to the student VM
Student can RDP in to their Linux VMs after the lab owner (teacher/professor) **publishes** the template VM with RDP and GUI packages installed on the machine. Here are the steps: 

1. When a student signs in to the Labs portal directly (`https://labs.azure.com`) or by using a registration link (`https://labs.azure.com/register/<registrationCode>`), a tile for each lab the student has access to is displayed. 
2. On the tile, select **Start** if the VM is stopped. 
3. Select **Connect**. You see two options to connect to the VM: **SSH** and **Remote Desktop**.

    ![Student VM - connection options](../media/how-to-enable-remote-desktop-linux/student-vm-connect-options.png)

## Connect using SSH or RDP
If you select the **SSH** option, you see the following **Connect to your virtual machine** dialog box:  

![SSH connection string](../media/how-to-enable-remote-desktop-linux/ssh-connection-string.png)

Select the **Copy** button next to the text box to copy it to the clipboard. Save the SSH connection string. Use this connection string from an SSH terminal (like [Putty](https://www.putty.org/)) to connect to the virtual machine.

If you select the **RDP** option, an RDP file is downloaded on to your machine. Save it and open it to connect to the machine. 

## Next steps
See the following articles:

- [As an admin, create and manage lab accounts](how-to-manage-lab-accounts.md)
- [As a lab owner, create and manage labs](how-to-manage-classroom-labs.md)
- [As a lab owner, set up and publish templates](how-to-create-manage-template.md)
- [As a lab user, access classroom labs](how-to-use-classroom-lab.md)

