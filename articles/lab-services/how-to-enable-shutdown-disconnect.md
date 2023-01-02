---
title: Configure automatic shutdown of VMs for a lab in Azure Lab Services 
description: Learn how to enable or disable automatic shutdown of VMs when a remote desktop connection is disconnected.  
ms.topic: how-to
ms.date: 07/04/2022
ms.custom: devdivchpfy22
---

# Configure automatic shutdown of VMs for a lab

This article shows you how you can configure [automatic shut-down](classroom-labs-concepts.md#automatic-shut-down) of VMs for a lab.  To learn more about the benefits of auto-shutdown policies, see [Maximize cost control with auto-shutdown settings](cost-management-guide.md#automatic-shutdown-settings-for-cost-control).

A lab plan administrator can configure automatic shutdown policies for the lab plan that you use create labs. For more information, see [Configure automatic shutdown of VMs for a lab plan](how-to-configure-auto-shutdown-lab-plans.md). As a lab owner, you can override the settings when creating a lab or after the lab is created.

> [!IMPORTANT]
> Prior to the [August 2022 Update](lab-services-whats-new.md), Linux labs only support automatic shut down when users disconnect and when VMs are started but users don't connect.  Support also varies depending on [specific distributions and versions of Linux](../virtual-machines/extensions/diagnostics-linux.md#supported-linux-distributions).  Shutdown settings are not supported by the [Data Science Virtual Machine - Ubuntu](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?search=Data%20science%20Virtual%20machine&page=1&filters=microsoft%3Blinux) image.

## Configure for the lab level

You can configure the auto-shutdown settings when you create a lab or after it's created.  To configure policies during lab creation see, [Tutorial: Create and publish a lab](tutorial-setup-lab.md).  To modify automatic shutdown settings after lab creation, go to the **Settings** page for the lab.

:::image type="content" source="./media/how-to-enable-shutdown-disconnect/lab-settings.png" alt-text="Screenshot of Lab policies window for creating a new lab.":::


> [!WARNING]
> If you shutdown the Linux or Windows operating system (OS) on a VM before disconnecting an RDP session to the VM, the auto-shutdown feature will not work properly. For more information, see [Guide to controlling Windows shutdown behavior](how-to-windows-shutdown.md). 

## Next steps

- As an educator, learn about the different [shut-down policies](classroom-labs-concepts.md#automatic-shut-down) available.
- As an educator, see the [dashboard for labs](use-dashboard.md).
- As an admin, [maximize cost control with auto-shutdown settings](cost-management-guide.md#automatic-shutdown-settings-for-cost-control).
