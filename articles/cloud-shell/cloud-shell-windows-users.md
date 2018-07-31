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
ms.date: 07/03/2018
ms.author: damaerte
---

# PowerShell in Azure Cloud Shell for Windows users

In May 2018, changes were [announced](https://azure.microsoft.com/blog/pscloudshellrefresh/) to PowerShell in Azure Cloud Shell.  The PowerShell experience in Azure Cloud Shell is now PowerShell Core 6 in Linux.
With this change, there are some aspects of PowerShell in Cloud Shell that may be different than what is expected in Windows PowerShell 5.1.

## Case sensitivity

In Windows, the file system is case-insensitive.  In Linux, the file system is case-sensitive.
This means that previously `file.txt` and `FILE.txt` were considered to be the same file, now they are considered to be different files.
Proper casing must be used while `tab` completing in the file system.  PowerShell specific experiences, such as `tab` cmdlets, are not case-sensitive. 

## Windows PowerShell alias vs Linux utilities

Existing commands in Linux, such as `ls`, `sort`, and `sleep` take precedence over their PowerShell aliases.  Below are common removed aliases as well as the equivalent commands:  

|Removed Alias   |Equivalent Command   |
|---|---|
|`ls`     | `dir` <br> `Get-ChildItem` |
|`sort`   | `Sort-Object` |
|`sleep`  | `Start-Sleep` |

## Persisting $home vs $home\clouddrive

For users of who persisted scripts and other files in their Cloud Drive, the $HOME directory is now persisted across sessions.

## PowerShell profile

By default, a PowerShell profile is not created.  To create your profile, create a `PowerShell` directory under `$HOME/.config`.  In `$HOME/.config/PowerShell`, you can create your profile under the name `Microsoft.PowerShell_profile.ps1`.

## What's new in PowerShell Core 6

For more information about what is new in PowerShell Core 6, reference the [PowerShell docs](https://docs.microsoft.com/powershell/scripting/whats-new/what-s-new-in-powershell-core-60?view=powershell-6) and the [Getting Started with PowerShell Core](https://blogs.msdn.microsoft.com/powershell/2017/06/09/getting-started-with-powershell-core-on-windows-mac-and-linux/) blog post
