---
title: Azure Cloud Shell for Windows users | Microsoft Docs
description: Guide for users who are not familiar with Linux systems
services: azure
documentationcenter: ''
author: maertendMSFT
manager: hemantm
tags: azure-resource-manager
 
ms.assetid: 
ms.service: azure
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 08/03/2018
ms.author: damaerte
---

# PowerShell in Azure Cloud Shell for Windows users

In May 2018, changes were [announced](https://azure.microsoft.com/blog/pscloudshellrefresh/) to PowerShell in Azure Cloud Shell.
The PowerShell experience in Azure Cloud Shell now runs [PowerShell Core 6](https://github.com/powershell/powershell) in a Linux environment.
With this change, there may be some differences in the PowerShell experience in Cloud Shell compared to what is expected in a Windows PowerShell experience.

## File system case sensitivity

The file system is case-insensitive in Windows, whereas on Linux, the file system is case-sensitive.
Previously `file.txt` and `FILE.txt` were considered to be the same file, but now they are considered to be different files.
Proper casing must be used while `tab-completing` in the file system.
PowerShell specific experiences, such as `tab-completing` cmdlet names, parameters, and values, are not case-sensitive.

## Windows PowerShell aliases vs Linux utilities

Some existing PowerShell aliases have the same names as built-in Linux commands, such as `cat`,`ls`, `sort`, `sleep`, etc.
In PowerShell Core 6, aliases that collide with built-in Linux commands have been removed.
Below are the common aliases that have been removed as well as their equivalent commands:  

|Removed Alias   |Equivalent Command   |
|---|---|
|`cat`    | `Get-Content` |
|`curl`   | `Invoke-WebRequest` |
|`diff`   | `Compare-Object` |
|`ls`     | `dir` <br> `Get-ChildItem` |
|`mv`     | `Move-Item`   |
|`rm`     | `Remove-Item` |
|`sleep`  | `Start-Sleep` |
|`sort`   | `Sort-Object` |
|`wget`   | `Invoke-WebRequest` |

## Persisting $HOME

Earlier users could only persist scripts and other files in their Cloud Drive.
Now, the user's $HOME directory is also persisted across sessions.

## PowerShell profile

By default, a user's PowerShell profile is not created.
To create your profile, create a `PowerShell` directory under `$HOME/.config`.

```azurepowershell-interactive
mkdir (Split-Path $profile.CurrentUserAllHosts)
```

Under `$HOME/.config/PowerShell`, you can create your profile files - `profile.ps1` and/or `Microsoft.PowerShell_profile.ps1`.

## What's new in PowerShell Core 6

For more information about what is new in PowerShell Core 6, reference the [PowerShell docs](https://docs.microsoft.com/powershell/scripting/whats-new/what-s-new-in-powershell-core-60?view=powershell-6) and the [Getting Started with PowerShell Core](https://blogs.msdn.microsoft.com/powershell/2017/06/09/getting-started-with-powershell-core-on-windows-mac-and-linux/) blog post.
