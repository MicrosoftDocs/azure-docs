---
title: Configure automatic shutdown of VMs in Azure Lab Services
description: This article describes how to configure automatic shutdown of VMs in the lab plan. 
ms.topic: how-to
ms.date: 11/13/2021
---

# Configure automatic shutdown of VMs for a lab plan

You can enable several auto-shutdown cost control features to proactively prevent additional costs when the virtual machines are not being actively used. The combination of the following three automatic shutdown and disconnect features catches most of the cases where users accidentally leave their virtual machines running:

- Disconnect users when virtual machines are idle
- Shutdown virtual machines when users disconnect
- Shutdown virtual machines when users do not connect

Idle detection examines both mouse/keyboard input (user absence) and disk/CPU usage (resource usage). By selecting resource usage, that is, disk/CPU usage, operations such as long-running queries are accounted for.

Review more details about the auto-shutdown features in the [Maximize cost control with auto-shutdown settings](cost-management-guide.md#automatic-shutdown-settings-for-cost-control) section.

> [!IMPORTANT]
> Linux labs only support automatic shut down when users disconnect and when VMs are started but users don't connect.  Support also varies depending on [specific distributions and versions of Linux](../virtual-machines/extensions/diagnostics-linux.md#supported-linux-distributions).  Shutdown settings are not supported by the [Data Science Virtual Machine - Ubuntu 18.04](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-1804) image.

## Enable automatic shutdown

1. In the [Azure portal](https://portal.azure.com/) navigate to the **Lab Plan** page.
1. Select **Labs settings** on the left menu.
1. Select the auto-shutdown setting(s) that is appropriate for your scenario.  

    :::image type="content" source="./media/how-to-configure-lab-plan/automatic-shutdown-vm-disconnect.png" alt-text="Automatic shutdown setting at lab plan":::

    The setting(s) apply to all the labs associated with the lab plan. A lab creator (educator) can override this setting at the lab level. The change to this setting at the lab plan will only affect labs that are created after the change is made.

    To disable the setting(s), uncheck the checkbox(s) on this page.

## Next steps

To learn about how a lab owner can configure or override this setting at the lab level, see [Configure automatic shutdown of VMs for a lab](how-to-enable-shutdown-disconnect.md)
