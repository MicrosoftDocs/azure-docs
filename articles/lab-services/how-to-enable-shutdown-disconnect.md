---
title: Configure automatic shutdown of VMs for a lab in Azure Lab Services 
description: Learn how to enable or disable automatic shutdown of VMs when a remote desktop connection is disconnected.  
ms.topic: article
ms.date: 08/17/2020
---

# Configure automatic shutdown of VMs for a lab

This article shows you how you can configure automatic shutdown of VMs for a lab.

You can enable several auto-shutdown cost control features to proactively prevent additional costs when the virtual machines are not being actively used. The combination of the following three automatic shutdown and disconnect features catches most of the cases where users accidentally leave their virtual machines running:
 
* Automatically disconnect users from virtual machines that the OS deems idle (Windows-only).
* Automatically shut down virtual machines when users disconnect (Windows & Linux).
* Automatically shut down virtual machines that are started but users don't connect.

Review more details about the auto-shutdown features in the [Maximize cost control with auto-shutdown settings](cost-management-guide.md#automatic-shutdown-settings-for-cost-control) section.

A lab account administrator can configure this setting for the lab account in which you create labs. For more information, see [Configure automatic shutdown of VMs for a lab account](how-to-configure-lab-accounts.md). As a lab owner, you can override the setting when creating a lab or after the lab is created. 

## Configure for the lab level

You can configure the auto-shutdown setting in the [Azure Lab Services](https://labs.azure.com/).

* when creating a lab (in **Lab policies**), or
* after the lab is created (in **Settings**)

> [!div class="mx-imgBorder"]
> ![Configure at the time of lab creation](./media/how-to-enable-shutdown-disconnect/configure-lab-creation.png)

Make sure to review details about the auto-shutdown in the [Maximize cost control with auto-shutdown settings](cost-management-guide.md#automatic-shutdown-settings-for-cost-control) section.

> [!WARNING]
> If you shutdown the Windows operating system (OS) on a VM before disconnecting an RDP session to the VM, the autoshutdown feature will not work properly.  

## Next steps

[Dashboard for classroom labs](use-dashboard.md)
