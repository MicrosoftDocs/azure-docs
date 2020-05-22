---
title: Troubleshoot service connection Windows Virtual Desktop - Azure
description: How to resolve issues when you set up client connections in a Windows Virtual Desktop tenant environment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 05/20/2020
ms.author: helohr
manager: lizross
---
# Windows Virtual Desktop service connections

>[!IMPORTANT]
>This content applies to the Spring 2020 update with Azure Resource Manager Windows Virtual Desktop objects. If you're using the Windows Virtual Desktop Fall 2019 release without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/troubleshoot-service-connection-2019.md).
>
> The Windows Virtual Desktop Spring 2020 update is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Use this article to resolve issues with Windows Virtual Desktop client connections.

## Provide feedback

You can give us feedback and discuss the Windows Virtual Desktop Service with the product team and other active community members at the [Windows Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop).

## User connects but nothing is displayed (no feed)

A user can start Remote Desktop clients and is able to authenticate, however the user doesn't see any icons in the web discovery feed.

Confirm that the user reporting the issues has been assigned to application groups by using this command line:

```PowerShell
Get-AzRoleAssignment -SignInName <userupn>
```

Confirm that the user is signing in with the correct credentials.

If the web client is being used, confirm that there are no cached credentials issues.

## Next steps

- For an overview on troubleshooting Windows Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating a Windows Virtual Desktop environment and host pool in a Windows Virtual Desktop environment, see [Environment and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Windows Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues when using PowerShell with Windows Virtual Desktop, see [Windows Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
