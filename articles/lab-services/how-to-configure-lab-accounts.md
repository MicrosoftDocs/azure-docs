---
title: Configure automatic shutdown of VMs for a lab account in Azure Lab Services 
description: This article describes how to configure automatic shutdown of VMs in the lab account. 
ms.topic: how-to
ms.date: 08/17/2020
---

# Configure automatic shutdown of VMs for a lab account

[!INCLUDE [preview note](./includes/lab-services-labaccount-focused-article.md)]

You can enable several auto-shutdown cost control features to proactively prevent additional costs when the virtual machines are not being actively used. The combination of the following three automatic shutdown and disconnect features catches most of the cases where users accidentally leave their virtual machines running:

- Automatically disconnect users from virtual machines that the OS deems idle.
- Automatically shut down virtual machines when users disconnect.
- Automatically shut down virtual machines that are started but users don't connect.

Review more details about the auto-shutdown features in the [Maximize cost control with auto-shutdown settings](cost-management-guide.md#automatic-shutdown-settings-for-cost-control) section.

> [!IMPORTANT]
> Linux labs only support automatic shut down when users disconnect and when VMs are started but users don't connect.  Support also varies depending on [specific distributions and versions of Linux](../virtual-machines/extensions/diagnostics-linux.md#supported-linux-distributions).  Shutdown settings are not supported by the [Data Science Virtual Machine - Ubuntu](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?search=Data%20science%20Virtual%20machine&page=1&filters=microsoft%3Blinux) image. 

## Enable automatic shutdown

1. In the [Azure portal](https://portal.azure.com/) navigate to the **Lab Account** page.
1. Select **Labs settings** on the left menu.
1. Select the auto-shutdown setting(s) that is appropriate for your scenario.  

    > [!div class="mx-imgBorder"]
    > ![Automatic shutdown setting at lab account](./media/how-to-configure-lab-accounts/automatic-shutdown-vm-disconnect.png)

    The setting(s) apply to all the labs created in the lab account. A lab creator (educator) can override this setting at the lab level. The change to this setting at the lab account will only affect labs that are created after the change is made.

    To disable the setting(s), uncheck the checkbox(s) on this page.

## Next steps

To learn about how a lab owner can configure or override this setting at the lab level, see [Configure automatic shutdown of VMs for a lab](how-to-enable-shutdown-disconnect.md)
