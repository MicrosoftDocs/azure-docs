---
title: Troubleshoot service connection Windows Virtual Desktop - Azure
description: How to resolve issues when you set up client connections in a Windows Virtual Desktop tenant environment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 12/09/2019
ms.author: helohr
---
# Windows Virtual Desktop service connections

Use this article to resolve issues with Windows Virtual Desktop client connections.

## Provide feedback

You can give us feedback and discuss the Windows Virtual Desktop Service with the product team and other active community members at the [Windows Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop).

## You can't open a web client

First, test your internet connection by opening another website in your browser; for example, [www.bing.com](https://www.bing.com).

Use **nslookup** to confirm DNS can resolve the FQDN:

```cmd
nslookup rdweb.wvd.microsoft.com
```

Try connecting with another client, like Remote Desktop client for Windows 7 or Windows 10, and check to see if you can open the web client.

### Error: Opening another site fails

**Cause:** Network issues and/or outages.

**Fix:** Contact network support.

### Error: Nslookup cannot resolve the name

**Cause:** Network issues and/or outages.

**Fix:** Contact network support

### Error: You can't connect but other clients can connect

**Cause:** The browser isn't behaving as expected and stopped working.

**Fix:** Follow these instructions to troubleshoot the browser.

1. Restart the browser.
2. Clear browser cookies. See [How to delete cookie files in Internet Explorer](https://support.microsoft.com/help/278835/how-to-delete-cookie-files-in-internet-explorer).
3. Clear browser cache. See [clear browser cache for your browser](https://binged.it/2RKyfdU).
4. Open browser in Private mode.

## Web client stops responding or disconnects

Try connecting using another browser or client.

### Error: Other browsers and clients also malfunction or fail to open

**Cause:** Network and/or operation system issues or outages

**Fix:** Contact support teams.

## Web client keeps prompting for credentials

If the Web client keeps prompting for credentials, follow these instructions.

1. Confirm web client URL is correct.
2. Confirm that credentials are for the Windows Virtual Desktop environment tied to the URL.
3. Clear browser cookies. See [How to delete cookie files in Internet Explorer](https://support.microsoft.com/help/278835/how-to-delete-cookie-files-in-internet-explorer).
4. Clear browser cache. See [Clear browser cache for your browser](https://binged.it/2RKyfdU).
5. Open browser in Private mode.

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

Once you've disabled the task, check again to see if the host responds.

## Next steps

- For an overview on troubleshooting Windows Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating a tenant and host pool in a Windows Virtual Desktop environment, see [Tenant and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Windows Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues when using PowerShell with Windows Virtual Desktop, see [Windows Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/resource-manager-tutorial-troubleshoot.md).
