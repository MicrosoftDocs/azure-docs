---
title: How to connect to an Azure Lab Services VM from Chromebook | Microsoft Docs
description: Learn how to connect from a Chromebook to a virtual machine in Azure Lab Services.
services: devtest-lab, lab-services, virtual-machines
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/11/2020
ms.author: nicolela

---

# Connect to a VM using Remote Desktop Protocol on a Chromebook
This section shows how a student can connect to a classroom lab VM from a Chromebook by using RDP.

## Install Microsoft Remote Desktop on a Chromebook
1. Open the App Store on your Chromebook, and search for **Microsoft Remote Desktop**.

    ![Microsoft Remote Desktop](../media/how-to-use-classroom-lab/install-ms-remote-desktop-chromebook.png)
1. Install the latest version of Microsoft Remote Desktop. 

## Access the VM from your Chromebook using RDP
1. Open the **RDP** file that's downloaded on your computer with **Microsoft Remote Desktop** installed. It should start connecting to the VM. 

    ![Connect to VM](../media/how-to-use-classroom-lab/connect-vm-chromebook.png)

1. When prompted, enter your password.
    ![Connect to VM](../media/how-to-use-classroom-lab/password-chromebook.png)


1. Select **Continue** if you receive the following warning. 

    ![Certificate warning](../media/how-to-use-classroom-lab/certificate-error-chromebook.png)

1. You should see the desktop of the VM that you are connecting to.

## Next steps
To learn more about connecting to Linux VMs, see [Connect to Linux virtual machines](how-to-use-remote-desktop-linux-student.md)


