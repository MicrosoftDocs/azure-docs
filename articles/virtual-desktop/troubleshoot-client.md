---
title: Troubleshoot Remote Desktop client Windows Virtual Desktop - Azure
description: How to resolve issues when you set up client connections in a Windows Virtual Desktop tenant environment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: troubleshooting
ms.date: 12/09/2019
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

## User connects but nothing is displayed (no feed)

A user can start Remote Desktop clients and is able to authenticate, however the user doesn't see any icons in the web discovery feed.

Confirm that the user reporting the issues has been assigned to application groups by using this command line:

```PowerShell
Get-RdsAppGroupUser <tenantname> <hostpoolname> <appgroupname>
```

Confirm that the user is logging in with the correct credentials.

If the web client is being used, confirm that there are no cached credentials issues.