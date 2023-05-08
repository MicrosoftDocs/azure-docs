---
title: How to use drain mode to isolate session hosts - Azure Virtual Desktop
description: How to use drain mode to isolate session hosts to perform maintenance in Azure Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 04/14/2021
ms.author: helohr 
manager: femila
---

# Use drain mode to isolate session hosts and apply patches

Drain mode isolates a session host when you want to apply patches and do maintenance without disrupting user sessions. When isolated, the session host won't accept new user sessions. Any new connections will be redirected to the next available session host. Existing connections in the session host will keep working until the user signs out or the administrator ends the session. When the session host is in drain mode, admins can also remotely connect to the server without going through the Azure Virtual Desktop service. You can apply this setting to both pooled and personal desktops.

## Set drain mode using the Azure portal

To turn on drain mode in the Azure portal:

1. Open the Azure portal and go to the host pool you want to isolate.

2. In the navigation menu, select **Session hosts**.

3. Next, select the hosts you want to turn on drain mode for, then select **Turn drain mode on**.

4. To turn off drain mode, select the host pools that have drain mode turned on, then select **Turn drain mode off**.

## Set drain mode using PowerShell

You can set drain mode in PowerShell with the *AllowNewSessions* parameter, which is part of the [Update-AzWvdSessionhost](/powershell/module/az.desktopvirtualization/update-azwvdsessionhost) command.

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

## Next steps

If you want to learn more about the Azure portal for Azure Virtual Desktop, check out [our tutorials](create-host-pools-azure-marketplace.md). If you're already familiar with the basics, check out some of the other features you can use with the Azure portal, such as [MSIX app attach](app-attach-azure-portal.md) and [Azure Advisor](../advisor/advisor-overview.md).

If you're using the PowerShell method and want to see what else the module can do, check out [Set up the PowerShell module for Azure Virtual Desktop](powershell-module.md) and our [PowerShell reference](/powershell/module/az.desktopvirtualization/).
