---
title: Troubleshoot Remote Desktop client Windows Virtual Desktop - Azure
description: How to resolve issues when you set up client connections in a Windows Virtual Desktop tenant environment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 12/13/2019
ms.author: helohr
---
# Troubleshoot the Remote Desktop client

This article describes common issues with the Remote Desktop client and how to fix them.

## Remote Desktop client for Windows 7 or Windows 10 stops responding or cannot be opened

Use the following PowerShell cmdlets to clean up out-of-band (OOB) client registries.

```PowerShell
Remove-ItemProperty 'HKCU:\Software\Microsoft\Terminal Server Client\Default' - Name FeedURLs

#Remove RdClientRadc registry key
Remove-Item 'HKCU:\Software\Microsoft\RdClientRadc' -Recurse

#Remove all files under %appdata%\RdClientRadc
Remove-Item C:\Users\pavithir\AppData\Roaming\RdClientRadc\* -Recurse
```

Navigate to **%AppData%\RdClientRadc** and delete all content.

Uninstall and reinstall Remote Desktop client for Windows 7 and Windows 10.

## Web client won't open

First, test your internet connection by opening another website in your browser; for example, [www.bing.com](https://www.bing.com).

Use **nslookup** to confirm DNS can resolve the FQDN:

```cmd
nslookup rdweb.wvd.microsoft.com
```

Try connecting with another client, like Remote Desktop client for Windows 7 or Windows 10, and check to see if you can open the web client.

### Opening another site fails

This is usually caused by network connection problems or a network outage. We recommend you contact network support.

### Nslookup cannot resolve the name

This is usually caused by network connection problems or a network outage. We recommend you contact network support.

### Your client can't connect but other clients on your network can connect

If your browser starts acting up or stops working while you're using the web client, follow these instructions to troubleshoot it:

1. Restart the browser.
2. Clear browser cookies. See [How to delete cookie files in Internet Explorer](https://support.microsoft.com/help/278835/how-to-delete-cookie-files-in-internet-explorer).
3. Clear browser cache. See [clear browser cache for your browser](https://binged.it/2RKyfdU).
4. Open browser in Private mode.

## Web client stops responding or disconnects

Try connecting using another browser or client.

### Other browsers and clients also malfunction or fail to open

If issues continue even after you've switched browsers, the problem may not be with your browser, but with your network. We recommend you contact network support.

## Web client keeps prompting for credentials

If the Web client keeps prompting for credentials, follow these instructions:

1. Confirm the web client URL is correct.
2. Confirm that the credentials you're using are for the Windows Virtual Desktop environment tied to the URL.
3. Clear browser cookies. For more details, see [How to delete cookie files in Internet Explorer](https://support.microsoft.com/help/278835/how-to-delete-cookie-files-in-internet-explorer).
4. Clear browser cache. For more details, see [Clear browser cache for your browser](https://binged.it/2RKyfdU).
5. Open your browser in Private mode.

## Next steps

- For an overview on troubleshooting Windows Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating a tenant and host pool in a Windows Virtual Desktop environment, see [Tenant and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Windows Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues when using PowerShell with Windows Virtual Desktop, see [Windows Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).