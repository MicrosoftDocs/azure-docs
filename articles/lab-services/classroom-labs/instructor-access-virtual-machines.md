---
title: Instructor accessing VMs in Azure Lab Services
description: This article shows how instructors can access their student VMs from the instructor view. For example, a teaching assistant can be an instructor for one class but a student for other classes.  
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
ms.date: 04/17/2020
ms.author: spelluru

---

# Instructors accessing their student virtual machines from the instructor view
This article shows how instructors can access their student VMs in classes conducted by other instructors. For example, a teaching assistant can be an instructor for one class but a student in other classes. 

## Access VMs from instructor view

1. Sign in to the [Azure Lab Services website](https://labs.azure.com). You see the labs that you own. These labs may be labs you created yourself or the labs that admin assigned to you as owner. For more information, see [How to add additional owners to an existing lab](how-to-add-user-lab-owner.md)
2. To access VMs for classes that you attend as a student, select the computer icon in the top-right corner. Confirm that you see VMs you can access a student. In the following example, the user is a teaching assistant for the Python lab, but a student of the Java lab. So, the user sees the VM from the Java lab in the drop-down list. You can start the VM and connect to it. 
    
    ![Access student VMs](../media/instructors-access-virtual-machines/access-student-virtual-machines.png)

## Next steps
See the following articles:

- [Connect to a VM](how-to-use-classroom-lab.md#connect-to-the-vm)
- [Connect to a VM using RDP on a Mac](connect-virtual-machine-mac-rdp.md)
- [Use remote desktop for Linux virtual machines](how-to-use-remote-desktop-linux-student.md)
