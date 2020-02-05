---
title: Troubleshoot service connection Windows Virtual Desktop - Azure
description: How to resolve issues when you set up client connections in a Windows Virtual Desktop tenant environment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 12/13/2019
ms.author: helohr
---
# Windows Virtual Desktop service connections

Use this article to resolve issues with Windows Virtual Desktop client connections.

## Provide feedback

You can give us feedback and discuss the Windows Virtual Desktop Service with the product team and other active community members at the [Windows Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop).

## User connects but nothing is displayed (no feed)

A user can start Remote Desktop clients and is able to authenticate, however the user doesn't see any icons in the web discovery feed.

Confirm that the user reporting the issues has been assigned to application groups by using this command line:

```PowerShell
Get-RdsAppGroupUser <tenantname> <hostpoolname> <appgroupname>
```

Confirm that the user is logging in with the correct credentials.

If the web client is being used, confirm that there are no cached credentials issues.

## Windows 10 Enterprise multi-session virtual machines don't respond

If a virtual machine isn't responsive and you can't access it through RDP, you'll need to troubleshoot it with the diagnostics feature by checking the host status.

To check the host status, run this cmdlet:

```powershell
Get-RdsSessionHost -TenantName $TenantName -HostPoolName $HostPool | ft SessionHostName, LastHeartBeat, AllowNewSession, Status
```

If the host status is `NoHeartBeat`, that means the VM isn't responding and the agent can't communicate with the Windows Virtual Desktop service.

```powershell
SessionHostName          LastHeartBeat     AllowNewSession    Status 
---------------          -------------     ---------------    ------ 
WVDHost1.contoso.com     21-Nov-19 5:21:35            True 	Available 
WVDHost2.contoso.com     21-Nov-19 5:21:35            True 	Available 
WVDHost3.contoso.com     21-Nov-19 5:21:35            True 	NoHeartBeat 
WVDHost4.contoso.com     21-Nov-19 5:21:35            True 	NoHeartBeat 
WVDHost5.contoso.com     21-Nov-19 5:21:35            True 	NoHeartBeat 
```

There are a few things you can do to fix the NoHeartBeat status.

### Update FSLogix

If your FSLogix isn't up to date, especially if it's version 2.9.7205.27375 of frxdrvvt.sys, it could cause a deadlock. Make sure to [update FSLogix to the latest version](https://go.microsoft.com/fwlink/?linkid=2084562).

### Disable BgTaskRegistrationMaintenanceTask

If updating FSLogix doesn't work, the issue might be that a BiSrv component is exhausting system resources during a weekly maintenance task. Temporarily disable the maintenance task by disabling the BgTaskRegistrationMaintenanceTask with one of these two methods:

- Go to the Start menu and search for **Task Scheduler**. Navigate to **Task Scheduler Library** > **Microsoft** > **Windows** > **BrokerInfrastructure**. Look for a task named **BgTaskRegistrationMaintenanceTask**. When you find it, right-click it and select **Disable** from the drop-down menu.
- Open a command-line menu as administrator and run the following command:
    
    ```cmd
    schtasks /change /tn "\Microsoft\Windows\BrokerInfrastructure\BgTaskRegistrationMaintenanceTask" /disable 
    ```

## Next steps

- For an overview on troubleshooting Windows Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating a tenant and host pool in a Windows Virtual Desktop environment, see [Tenant and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Windows Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues when using PowerShell with Windows Virtual Desktop, see [Windows Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
