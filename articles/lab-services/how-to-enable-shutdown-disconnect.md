---
title: Configure automatic shutdown of VMs for a lab in Azure Lab Services 
description: Learn how to enable or disable automatic shutdown of VMs when a remote desktop connection is disconnected.  
ms.topic: how-to
ms.date: 11/13/2021
---

# Configure automatic shutdown of VMs for a lab

This article shows you how you can configure automatic shutdown of VMs for a lab.

You can enable several auto-shutdown cost control features to proactively prevent additional costs when the virtual machines are not being actively used. The combination of the following three automatic shutdown and disconnect features catches most of the cases where users accidentally leave their virtual machines running:

- Disconnect users when virtual machines are idle
- Shutdown virtual machines when users disconnect
- Shutdown virtual machines when users do not connect

Idle detection examines both mouse/keyboard input (user absence) and disk/CPU usage (resource usage). By selecting resource usage as an idle setting, operations such as long-running queries are accounted for.
Review more details about the auto-shutdown features in the [Maximize cost control with auto-shutdown settings](cost-management-guide.md#automatic-shutdown-settings-for-cost-control) section.

A lab plan administrator can configure this setting for the lab plan in which you create labs. For more information, see [Configure automatic shutdown of VMs for a lab plan](how-to-configure-lab-plans.md). As a lab owner, you can override the setting when creating a lab or after the lab is created.

> [!IMPORTANT]
> Linux labs only support automatic shut down when users disconnect and when VMs are started but users don't connect.  Support also varies depending on [specific distributions and versions of Linux](../virtual-machines/extensions/diagnostics-linux.md#supported-linux-distributions).  Shutdown settings are not supported by the [Data Science Virtual Machine - Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-1804) image.

## Configure for the lab level

You can configure the auto-shutdown setting in the [Azure Lab Services](https://labs.azure.com/).

- When creating a lab (in **Lab policies**), or
- After the lab is created (in **Settings**)

> [!div class="mx-imgBorder"]
> ![Configure at the time of lab creation](./media/tutorial-setup-classroom-lab/quota-for-each-user.png)

Make sure to review details about the auto-shutdown in the [Maximize cost control with auto-shutdown settings](cost-management-guide.md#automatic-shutdown-settings-for-cost-control) section.

> [!WARNING]
> If you shutdown the Linux or Windows operating system (OS) on a VM before disconnecting an RDP session to the VM, the auto-shutdown feature will not work properly.  

## Next steps

[Dashboard for labs](use-dashboard.md)
