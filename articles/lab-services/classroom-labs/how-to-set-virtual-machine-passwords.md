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
ms.date: 08/20/2019
ms.author: spelluru

---
# Set or reset password for virtual machines in classroom labs (instructor)
A lab owner (teacher) can set/reset the password for VMs at the time of creating the lab (lab creation wizard) or after creating the lab (on dashboard). 

## Set password at the time of lab creation
A lab owner (teacher) can set a password for VMs in the lab on the **Set credentials** page of the lab creation wizard.

![Set credentials](../media/tutorial-setup-classroom-lab/set-credentials.png)

By enabling/disabling the **Use same password for all virtual machines** option on this page, a teacher can choose to use same password for all VMs in the lab or allow students to set passwords for their VMs. By default, this setting is enabled for all Windows and Linux operating system images except Ubuntu. When this setting is disabled, students will be prompted to set a password when they try to connect to the VM for the first time. 

The lab owner can reset this password (if needed) on the **Configure template** page of the lab creation wizard. 

![Configure template page after it's done](../media/tutorial-setup-classroom-lab/configure-template-after-complete.png)

The lab owner can also reset the password after the lab is created, on the dashboard. 

## Reset password on the dashboard

1. Select the overflow menu (vertical three dots) on the lab tile, and select **Reset password**. 

    ![Reset password menu on the home page](../media/how-to-set-virtual-machine-passwords/reset-password-menu-dashboard.png)
1. On the **Set password** dialog box, enter a password, and select **Set password**.
    
    ![Set password dialog box](../media/how-to-set-virtual-machine-passwords/set-password.png)

## Next steps
To learn about other student usage options you (as a lab owner) can configure, see the following article: [Configure student usage](how-to-configure-student-usage.md).

To learn about how students can reset passwords for their VMs, see [Set or reset password for virtual machines in classroom labs (students)](how-to-set-virtual-machine-passwords-student.md).