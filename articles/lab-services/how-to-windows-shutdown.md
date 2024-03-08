---
title: Control shutdown for Windows lab VMs
description: Remove the shutdown command from the Windows Start menu in a lab virtual machine in Azure Lab Services.
services: lab-services
ms.service: lab-services
ms.author: nicktrog
author: ntrogh
ms.topic: how-to
ms.date: 06/02/2023
---

# Control Windows shutdown behavior in lab virtual machines

In this article, you learn how to remove the shutdown command from the Windows Start menu in lab virtual machines in Azure Lab Services. When a lab user performs a shutdown in the operating system instead of stopping the lab virtual machine, the shutdown might interfere with the Azure Lab Services cost control measures.

Azure Lab Services provides different cost control measures, such as [lab schedules](./how-to-create-schedules.md), [quota hours](./how-to-manage-lab-users.md#set-quotas-for-users), and [automatic shutdown policies](./how-to-enable-shutdown-disconnect.md).

When the Windows shutdown command is used to turn off a lab virtual machine, the service considers the lab virtual machine to still be running and accumulating costs. Instead, lab users should use the [stop functionality of the lab virtual machine](./how-to-use-lab.md#start-or-stop-the-vm). To prevent inadvertently shutting down the lab virtual machine, you can remove the shutdown command from the Windows Start menu.

Lab users can still disconnect from the lab virtual machine. The Windows disconnect command triggers the lab policy (if enabled) that shuts down the lab virtual machine when users disconnect.

## Remove Windows shutdown command from Start menu

You can use Windows local group policy settings to remove the shutdown command from the Windows Start menu. Modify this policy on the lab template virtual machine to ensure that the change applies to all lab virtual machines.

To configure a local group policy setting by using PowerShell:

1. Connect to the lab template virtual machine by using RDP.

1. Run the following PowerShell command to disable the shutdown option in the Start menu:

    ```powershell
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "HidePowerOptions" -Value 1 -Force
    ```

Alternately, you can manually change the local group policy setting:

1. Connect to the lab template virtual machine by using RDP.

1. Press the Windows key, type **gpedit**, then select **Edit group policy (Control panel)**.

1. Go to **Computer Configuration > Administrative Templates > Start Menu and Taskbar**.  

    :::image type="content" source="./media/how-to-windows-shutdown/group-policy-shutdown.png" alt-text="Screenshot of Group Policy Editor in Windows." lightbox="./media/how-to-windows-shutdown/group-policy-shutdown.png":::

1. Right-select **Remove and prevent access to the Shut Down, Restart, Sleep, and Hibernate commands**, and then select **Edit**.

1. Select the **Enabled** setting, and then select **OK**.
 
    :::image type="content" source="./media/how-to-windows-shutdown/edit-shutdown.png" alt-text="Screenshot of Remove and prevent access to the Shut Down, Restart, Sleep, and Hibernate commands dialog in Windows.":::
 
1. Notice that the shutdown command no longer appears under Windows **Start** menu. Only the **Disconnect** command appears.

    :::image type="content" source="./media/how-to-windows-shutdown/start-menu.png" alt-text="Screenshot of the Start menu in Windows.  The power button and disconnect item are highlighted.":::


## Next steps
- As an educator, enable [automatic shutdown policies](./how-to-enable-shutdown-disconnect.md).
- As an educator, [prepare Windows template VM](how-to-prepare-windows-template.md) for the lab.
- As an educator, [publish the template VM](how-to-create-manage-template.md#publish-the-template-vm).