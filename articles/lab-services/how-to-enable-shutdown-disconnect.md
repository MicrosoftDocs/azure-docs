---
title: Configure automatic shutdown for a lab
titleSuffix: Azure Lab Services
description: Learn how to enable or disable automatic shutdown of lab VMs in Azure Lab Services by configuring the lab settings. Automatic shutdown happens when a user disconnects from the remote connection.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 03/01/2023
---

# Configure automatic shutdown of VMs for a lab

This article shows you how you can configure automatic shutdown of VMs for a lab.  To learn more about the benefits of auto-shutdown policies, see [Maximize cost control with auto-shutdown settings](cost-management-guide.md#automatic-shutdown-settings-for-cost-control).

A lab plan administrator can configure automatic shutdown policies for the lab plan that you use create labs. For more information, see [Configure automatic shutdown of VMs for a lab plan](how-to-configure-auto-shutdown-lab-plans.md). As a lab owner, you can override the settings when creating a lab or after the lab is created.

Azure Lab Services supports automatic shutdown for both Windows-based and Linux-based virtual machines. For Linux-based VMs, [support depends on the specific Linux distribution and version](#supported-linux-distributions-for-automatic-shutdown).

## Configure for the lab level

You can configure the auto-shutdown settings when you create a lab or after it's created.  To configure policies during lab creation see, [Tutorial: Create and publish a lab](tutorial-setup-lab.md).  To modify automatic shutdown settings after lab creation, go to the **Settings** page for the lab.

:::image type="content" source="./media/how-to-enable-shutdown-disconnect/lab-settings.png" alt-text="Screenshot of Lab policies window for creating a new lab.":::


> [!WARNING]
> If you shutdown the Linux or Windows operating system (OS) on a VM before disconnecting an RDP session to the VM, the auto-shutdown feature will not work properly. For more information, see [Guide to controlling Windows shutdown behavior](how-to-windows-shutdown.md). 

## Supported Linux distributions for automatic shutdown

Azure Lab Services supports automatic shutdown for many Linux distributions and versions. Support varies depending on whether you're using a lab plan or lab account.

### Lab plan-based labs

[!INCLUDE [supported linux distributions for automatic shutdown](./includes/lab-services-auto-shutdown-linux-support.md)]

### Lab account-based labs

If you're using lab account-based labs, Linux labs only support automatic shut down when users disconnect and when VMs are started but users don't connect.

Support varies depending on [specific distributions and versions of Linux](../virtual-machines/extensions/diagnostics-linux.md#supported-linux-distributions). 

Shutdown settings are not supported by the [Data Science Virtual Machine - Ubuntu](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?search=Data%20science%20Virtual%20machine&page=1&filters=microsoft%3Blinux) image.

## Next steps

- As an educator, learn how to [maximize cost control with auto-shutdown settings](cost-management-guide.md#automatic-shutdown-settings-for-cost-control).
- As an educator, see the [dashboard for labs](use-dashboard.md).
- As an admin, [maximize cost control with auto-shutdown settings](cost-management-guide.md#automatic-shutdown-settings-for-cost-control).
