---
title: Set passwords for VMs in Azure Lab Services | Microsoft Docs
description: Learn how to set and reset passwords for virtual machines (VMs) in classroom labs of Azure Lab Services. 
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
ms.date: 06/11/2019
ms.author: spelluru

---
# Set or reset password for virtual machines in classroom labs
This article provides different ways of setting and resettings passwords for accessing VMs in classroom labs. 

## Lab owners (teachers)
A lab owner (teacher) can set a password for VMs in the lab on the **Set credentials** page of the lab creation wizard.

![Set credentials](../media/tutorial-setup-classroom-lab/set-credentials.png)

Then, the lab owner can reset the password (if needed) on the **Configure template** page of the lab creation wizard. 

![Configure template page after it's done](../media/tutorial-setup-classroom-lab/configure-template-after-complete.png)

The lab owner can also reset the password after the lab is created, on the dashboard. 

![Reset password menu on the home page](../media/how-to-set-virtual-machine-passwords/reset-password-menu-dashboard.png)

Then, enter the new password in the **Set password** page, and select **Set password**. 

![Reset password menu on the home page](../media/how-to-set-virtual-machine-passwords/set-password.png)

## Lab users (students)
At the time of creating the lab. At the same time, the lab owner can enable or disable allowing students to set their own passwords for the VMs. If the lab owner (teacher) enables this option, the lab user (student) will have an option to set the password for the VM when the student logs in to the VM for the first time. On a **Windows VM**, press **CTRL + ALT + END**, and select **Change password**. 

## Next steps
To learn about other student usage options you (as a lab owner) can configure, see the following article: [Configure student usage](how-to-configure-student-usage.md).
