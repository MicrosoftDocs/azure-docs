---
title: Troubleshoot service connection Azure Virtual Desktop (classic) - Azure
description: How to resolve issues when you set up client connections in an Azure Virtual Desktop (classic) tenant environment.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 05/20/2020
ms.author: helohr
manager: femila
---
# Azure Virtual Desktop (classic) service connections

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../troubleshoot-service-connection.md).

Use this article to resolve issues with Azure Virtual Desktop client connections.

## Provide feedback

You can give us feedback and discuss the Azure Virtual Desktop Service with the product team and other active community members at the [Azure Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop).

## User connects but nothing is displayed (no feed)

A user can start Remote Desktop clients and is able to authenticate, however the user doesn't see any icons in the web discovery feed.

Confirm that the user reporting the issues has been assigned to application groups by using this command line:

```PowerShell
Get-RdsAppGroupUser <tenantname> <hostpoolname> <appgroupname>
```

Confirm that the user is logging in with the correct credentials.

If the web client is being used, confirm that there are no cached credentials issues.

## Next steps

- For an overview on troubleshooting Azure Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview-2019.md).
- To troubleshoot issues while creating a tenant and host pool in an Azure Virtual Desktop environment, see [Tenant and host pool creation](troubleshoot-set-up-issues-2019.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Azure Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration-2019.md).
- To troubleshoot issues when using PowerShell with Azure Virtual Desktop, see [Azure Virtual Desktop PowerShell](troubleshoot-powershell-2019.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
