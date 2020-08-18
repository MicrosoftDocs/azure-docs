---
title: Configure automatic shutdown of VMs in Azure Lab Services
description: This article describes how to configure automatic shutdown of VMs in the lab account. 
ms.topic: article
ms.date: 08/17/2020
---

# Configure automatic shutdown of VMs on disconnect setting for a lab account

You can enable or disable automatic shutdown of Windows lab VMs (template or student) after a remote desktop connection is disconnected. You can also specify how long Lab Services should wait for the user to reconnect before automatically shutting down.

Review details about the automatic shutdown in the [Maximize cost control with auto-shutdown settings](cost-management-guide.md#maximize-cost-control-with-auto-shutdown-settings) section.

## Enable automatic shutdown

1. In the [Azure portal](https://portal.azure.com/) navigate to the **Lab Account** page.
1. Select **Labs settings** on the left menu.
1. Select the auto-shutdown setting(s) that is appropriate for your scenario.  

    > [!div class="mx-imgBorder"]
    > ![Automatic shutdown setting at lab account](./media/how-to-configure-lab-accounts/automatic-shutdown-vm-disconnect.png)
    
    The setting(s) apply to all the labs created in the lab account. A lab creator (educator) can override this setting at the lab level. The change to this setting at the lab account will only affect labs that are created after the change is made.

    To disable the setting(s), uncheck the checkbox(s) on this page. 

## Next steps

To learn about how a lab owner can configure or override this setting at the lab level, see [Enable automatic shutdown of VMs on disconnect](how-to-enable-shutdown-disconnect.md)
