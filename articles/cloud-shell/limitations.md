---
title: Azure Cloud Shell limitations | Microsoft Docs
description: Overview of limitations of Azure Cloud Shell
services: azure
documentationcenter: ''
author: jluk
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: azure
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 02/15/2018
ms.author: juluk
---

# Limitations of Azure Cloud Shell

Azure Cloud Shell has the following known limitations:

## General limitations

### System state and persistence

The machine that provides your Cloud Shell session is temporary, and it is recycled after your session is inactive for 20 minutes. Cloud Shell requires an Azure file share to be mounted. As a result, your subscription must be able to set up storage resources to access Cloud Shell. Other considerations include:

* With mounted storage, only modifications within the `clouddrive` directory are persisted. In Bash, your `$Home` directory is also persisted.
* Azure file shares can be mounted only from within your [assigned region](persisting-shell-storage.md#mount-a-new-clouddrive).
  * In Bash, run `env` to find your region set as `ACC_LOCATION`.

### Browser support

Cloud Shell supports the latest versions of Microsoft Edge, Microsoft Internet Explorer, Google Chrome, Mozilla Firefox, and Apple Safari. Safari in private mode is not supported.

### Copy and paste

[!INCLUDE [copy-paste](../../includes/cloud-shell-copy-paste.md)]

### For a given user, only one shell can be active

Users can only launch one type of shell at a time, either **Bash** or **PowerShell**. However, you may have multiple instances of Bash or PowerShell running at one time. Swapping between Bash or PowerShell causes Cloud Shell to restart, which terminates existing sessions.

### Usage limits

Cloud Shell is intended for interactive use cases. As a result, any long-running non-interactive sessions are ended without warning.

## Bash limitations

### User permissions

Permissions are set as regular users without sudo access. Any installation outside your `$Home` directory is not persisted.

### Editing .bashrc

Take caution when editing .bashrc, doing so can cause unexpected errors in Cloud Shell.

## PowerShell limitations

### Slow startup time

PowerShell in Azure Cloud Shell (Preview) could take up to 60 seconds to initialize during preview.

### No $Home directory persistence

Data written to `$Home` by any application (such as: git, vim, and others) does not persist across PowerShell sessions. For a workaround, [see here](troubleshooting.md#powershell-troubleshooting).

### Default file location when created from Azure drive:

Using PowerShell cmdlets, users can not create files under the Azure drive. When users create new files using other tools, such as vim or nano, the files are saved to C:\Users folder by default. 

### GUI applications are not supported

If the user runs a command that would create a Windows dialog box, such as `Connect-AzureAD` or `Login-AzureRMAccount`, one sees an error message such as: `Unable to load DLL 'IEFRAME.dll': The specified module could not be found. (Exception from HRESULT: 0x8007007E)`.

## Next steps

[Troubleshooting Cloud Shell](troubleshooting.md) <br>
[Quickstart for Bash](quickstart.md) <br>
[Quickstart for PowerShell](quickstart-powershell.md)
