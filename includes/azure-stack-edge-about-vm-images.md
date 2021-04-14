---
author: v-dalc
ms.service: databox
ms.author: alkohli
ms.topic: include
ms.date: 04/14/2021
---

A Windows VHD or VHDX can be used to create a *generalized image* or a *specialized image*: 

 * Use a *generalized image* when you want to create multiple virtual machines that can be deployed on any system. Setup and configuration of each new VM are done on first boot.

 * Use a *specialized image* to create a fully pre-configured VM when you need to migrate or restore an existing virtual machine.

The following table summarizes key differences when you deploy virtual machines using a generalized vs. a specialized image.

|Image type  |Generalized  |Specialized  |
|---------|---------|---------|
|Target     |Deployed on any system         | Targeted to a specific system        |
|Setup after boot     | Setup required at first boot of the VM.          | Setup not needed. <br> Platform turns the VM on.        |
|Configuration     |Hostname, admin-user, and other VM-specific settings required.         |Completely pre-configured.         |
|Used when     |Creating multiple new VMs from the same image.         |Migrating a specific machine or restoring a VM from previous backup.         |

There are two ways to create a generalized image:<!--I added this to associate the conceptual section with the two how-tos for generalized images.-->

 * You can generalize an existing Windows VHD or VHDX.

 * You can start fresh with a new virtual machine and use an ISO image to install the operating system.