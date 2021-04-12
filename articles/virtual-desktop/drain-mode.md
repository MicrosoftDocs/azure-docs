---
title: Set Windows Virtual Desktop drain mode - Azure
description: How to configure and use drain mode in Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 04/12/2021
ms.author: helohr
manager: femila
---

# Set drain mode

You can turn on drain mode to isolate a session host to apply patches and perform maintenance without disrupting user sessions. When isolated, the session host won't accept new user sessions. Any new connections will be redirected to another available session host. Existing connections in the session host will continue working until the user signs out or the administrator ends the session. Administrators can also remotely connect to the server without going through the Windows Virtual Desktop service while the session host is in drain mode. You can apply this setting to both pooled and personal desktops.

## Set drain mode using the Azure portal

To turn on drain mode in the Azure portal:

1. Open the Azure portal and go to the host pool you want to isolate.

2. In the navigation menu, select **Session hosts**.

3. Next, select the hosts you want to turn on drain mode for, then select **Turn drain mode on**.

4. To turn off drain mode, select the host pools that have drain mode turned on, then select **Turn drain mode off**.

## Set drain mode using PowerShell

You can set drain mode in Powershell with the *AllowNewSessions* parameter, which is part of the [Update-AzWvdSessionhostCmdlet](/powershell/module/az.desktopvirtualization/update-azwvdsessionhost?view=azps-5.4.0#code-try-2) command.

Run this cmdlet to enable drain mode:

```powershell
Update-AzWvdSessionHost -ResourceGroupName <resourceGroupName> -HostPoolName <hostpoolname> -Name <hostname> -AllowNewSession:$False
```

Run this cmdlet to disable drain mode:

```powershell
Update-AzWvdSessionHost -ResourceGroupName <resourceGroupName> -HostPoolName <hostpoolname> -Name <hostname> -AllowNewSession:$True
```

>[!IMPORTANT]
>You'll need to run this command for every session host you're applying the setting to.
