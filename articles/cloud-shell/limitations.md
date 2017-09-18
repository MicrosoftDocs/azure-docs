---
title: Azure Cloud Shell (Preview) limitations | Microsoft Docs
description: Overview of limitations of Azure Cloud Shell
services: 
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
ms.date: 09/25/2017
ms.author: juluk
---

# Limitations of Azure Cloud Shell
Azure Cloud Shell has the following known limitations:

## General Limitations

### System state and persistence
The machine that provides your Cloud Shell session is temporary, and it is recycled after your session is inactive for 20 minutes. Cloud Shell requires a file share to be mounted. As a result, your subscription must be able to set up storage resources to access Cloud Shell. Other considerations include:
* With mounted storage, only modifications within the `clouddrive` directory are persisted. In Bash your `$Home` directory is also persisted.
* File shares can be mounted only from within your [assigned region](persisting-shell-storage.md#mount-a-new-clouddrive).
  * In Bash, run `env` to find your region set as `ACC_LOCATION`.
* Azure Files supports only locally redundant storage and geo-redundant storage accounts.

### Browser support
Cloud Shell supports the latest versions of Microsoft Edge, Microsoft Internet Explorer, Google Chrome, Mozilla Firefox, and Apple Safari. Safari in private mode is not supported.

### Copy and paste
Ctrl+C and Ctrl+V do not function as copy/paste shortcuts in Cloud Shell on Windows machines, use Ctrl+Insert and Shift+Insert to copy and paste respectively. <br>
Right-click copy-and-paste options are also available, but right-click function is subject to browser-specific clipboard access. 

### For a given user, only one shell can be active
Users can only launch one type of shell at a time, either **Bash** or **PowerShell**. However, you may have multiple instances of Bash or PowerShell running at one time. Swapping between Bash or PowerShell will trigger a Cloud Shell restart which terminates existing sessions.

### Usage limits
Cloud Shell is intended for interactive use cases. As a result, any long-running non-interactive sessions are ended without warning.

## Bash Limitations

### User permissions
Permissions are set as regular users without sudo access. Any installation outside your `$Home` directory will not persist.
Although certain commands within the `clouddrive` directory, such as `git clone`, do not have proper permissions, your `$Home` directory does have permissions.

### Editing .bashrc
Take caution when editing .bashrc, doing so can cause unexpected errors in Cloud Shell. 

### .bash_history
Your history of bash commands may be inconsistent because of Cloud Shell session disruption or concurrent sessions.

## PowerShell Limitations

### Slow startup time
PowerShell in Azure Cloud Shell could take up to 60 seconds to initialize during preview.

### No $Home directory persistence
Any application (such as: git, vim, and others) that writes data to $Home will not be persisted across PowerShell sessions.  For a workaround [see here TODO]() 

## Next steps
[Troubleshooting Cloud Shell](troubleshooting.md) <br>
[Quickstart for Bash](quickstart.md) <br>
[Quickstart for PowerShell](quickstart-powershell.md)
