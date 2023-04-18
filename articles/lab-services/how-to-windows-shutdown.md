---
title: Guide to controlling Windows shutdown behavior in Azure Lab Services | Microsoft Docs
description: Steps to automatically shutdown an idle Windows virtual machine and remove the Windows shutdown command.
ms.topic: how-to
ms.date: 02/04/2022
---

# Guide to controlling Windows shutdown behavior

Azure Lab Services provides cost controls to ensure that Windows virtual machines (VMs) aren't running unexpectedly:

- [Set a schedule](how-to-create-schedules.md)
- [Set quotas for students](./how-to-configure-student-usage.md#set-quotas-for-users)
- [Automatic shutdown policies](./how-to-enable-shutdown-disconnect.md)
    - Disconnect users when virtual machines are idle
    - Shut down virtual machines when users disconnect
    - Shut down virtual machines when users don't connect

However, a student may use Windows shutdown command to turn off the VM.  If Azure Lab Services' [stop button](./how-to-use-lab.md#start-or-stop-the-vm) or [automatic shutdown policies](./how-to-enable-shutdown-disconnect.md) aren't used, of Azure Lab Services still thinks the VM is being used.
   
To help you prevent this situation from happening, this guide provides steps to remove the Windows shutdown command from the **Start** menu.  The disconnect command is still available for students.  The Windows disconnect command will trigger the lab policy (if enabled) that shuts down the VM when users disconnect.  

## Remove Windows shutdown command from Start menu

Windows **Local Group Policy** settings also allow you to remove the shutdown command from the **Start** menu.

To remove the shutdown command, you can connect to the template VM and execute the below PowerShell script.

```powershell
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "HidePowerOptions" -Value 1 -Force
```

Or, you can choose to follow these manual steps using the template VM:

1. Press the Windows key, type **gpedit**, then select **Edit group policy (Control panel)**.
1. Go to **Computer Configuration > Administrative Templates > Start Menu and Taskbar**.  

    :::image type="content" source="./media/how-to-windows-shutdown/group-policy-shutdown.png" alt-text="Screenshot of Group Policy Editor in Windows." lightbox="./media/how-to-windows-shutdown/group-policy-shutdown.png":::

1. Right-click **Remove and prevent access to the Shut Down, Restart, Sleep, and Hibernate commands**, and select **Edit**.
1. Select the **Enabled** setting. Select **OK**:
 
    :::image type="content" source="./media/how-to-windows-shutdown/edit-shutdown.png" alt-text="Screenshot of Remove and prevent access to the Shut Down, Restart, Sleep, and Hibernate commands dialog in Windows.":::
 
1. Notice that the shutdown command no longer appears under Windows **Start** menu. Only the **Disconnect** command appears.

    :::image type="content" source="./media/how-to-windows-shutdown/start-menu.png" alt-text="Screenshot of the Start menu in Windows.  The power button and disconnect item are highlighted.":::


## Next steps
- As an educator, enable [automatic shutdown policies](./how-to-enable-shutdown-disconnect.md).
- As an educator, [prepare Windows template VM](how-to-prepare-windows-template.md) for the lab.
- As an educator, [publish the template VM](how-to-create-manage-template.md#publish-the-template-vm).