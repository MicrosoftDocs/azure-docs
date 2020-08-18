---
title: Troubleshoot service connection Windows Virtual Desktop - Azure
description: How to resolve issues when you set up client connections in a Windows Virtual Desktop tenant environment.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 06/19/2020
ms.author: helohr
manager: lizross
---
# Windows Virtual Desktop service connections

>[!IMPORTANT]
>This content applies to Windows Virtual Desktop with Azure Resource Manager Windows Virtual Desktop objects. If you're using Windows Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/troubleshoot-service-connection-2019.md).

Use this article to resolve issues with Windows Virtual Desktop client connections.

## Provide feedback

You can give us feedback and discuss the Windows Virtual Desktop Service with the product team and other active community members at the [Windows Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop).

## User connects but nothing is displayed (no feed)

A user can start Remote Desktop clients and is able to authenticate, however the user doesn't see any icons in the web discovery feed.

1. Confirm that the user reporting the issues has been assigned to application groups by using this command line:

     ```powershell
     Get-AzRoleAssignment -SignInName <userupn>
     ```

2. Confirm that the user is signing in with the correct credentials.

3. If the web client is being used, confirm that there are no cached credentials issues.

4. If the user is part of an Azure Active Directory (AD) user group, make sure the user group is a security group instead of a distribution group. Windows Virtual Desktop doesn't support Azure AD distribution groups.

## Next steps

- For an overview on troubleshooting Windows Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating a Windows Virtual Desktop environment and host pool in a Windows Virtual Desktop environment, see [Environment and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Windows Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues when using PowerShell with Windows Virtual Desktop, see [Windows Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
