---
title: Configure Windows Virtual Desktop Drain Mode - Azure
description: How to configure and use Drain Mode in Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 04/12/2021
ms.author: helohr
manager: femila
---

# Configure Drain Mode

This feature is useful when performing maintenance (e.g.) applying patches to the session host which may need restarts that would interrupt the user experience. When troubleshooting issues, you might want to apply drain mode to isolate the host. In this state the session host will no longer accept new user sessions. Those connections may be redirected to another session host in the pool when available. Any existing connection will continue working until the user logs off or the administrator terminates the session. The setting can be applied to both pooled and personal desktops.

While the respective session hosts are in drain mode the administrator can still remotely connect to the server without going through the service.

## Set drain mode using the Azure portal

In the Azure Portal:

1. Navigate to the host pool you want to apply the setting.

2. Select Session Hosts in the navigation menu.

3. Next select the hosts you want to turn on drain mode for and click “Turn drain mode on”.

![Graphical user interface, text, application Description automatically generated](media/2801754989ea070ce80ac71eed276bad.png)

Similarly, to disable/ turn off drain mode, select hosts and click "Turn drain mode off".

## Set drain mode using PowerShell

Use the AllowNewSessions parameter part of the [Update-AzWvdSessionhostCmdlet](/powershell/module/az.desktopvirtualization/update-azwvdsessionhost?view=azps-5.4.0#code-try-2).

Enable drain mode:

```powershell
Update-AzWvdSessionHost -ResourceGroupName <resourceGroupName> -HostPoolName <hostpoolname> -Name <hostname> -AllowNewSession:$False
```

To disable drain mode:

```powershell
Update-AzWvdSessionHost -ResourceGroupName <resourceGroupName> -HostPoolName <hostpoolname> -Name <hostname> -AllowNewSession:$True
```

>[!IMPORTANT]
>You will need to repeat the command for every Session host you want to apply the setting.
