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
ms.date: 07/10/2017
ms.author: juluk
---

# Limitations of Azure Cloud Shell
Azure Cloud Shell has the following known limitations:

## System state and persistence
The machine that provides your Cloud Shell session is temporary, and it is recycled after your session is inactive for 20 minutes. Cloud Shell requires a file share to be mounted. As a result, your subscription must be able to set up storage resources to access Cloud Shell. Other considerations include:
* With mounted storage, only modifications within your `$Home` directory or `clouddrive` directory are persisted.
* File shares can be mounted only from within your [assigned region](persisting-shell-storage.md#pre-requisites-for-manual-mounting).
* Azure Files supports only locally redundant storage (LRS) and geo-redundant storage (GRS) storage accounts.

## User permissions
Permissions are set as regular users without sudo access. Any installation outside of your `$Home` directory will not persist.
Although certain commands within the `clouddrive` directory, such as `git clone`, do not have proper permissions, your `$Home` directory does have permissions.

## Browser support
Cloud Shell supports the latest versions of Microsoft Edge, Microsoft Internet Explorer, Google Chrome, Mozilla Firefox, and Apple Safari. Safari in private mode is not supported.

## Copy and paste
Because Ctrl+C and Ctrl+V do not function as keyboard shortcuts for copy and paste on Windows machines, use Ctrl+Insert and Shift+Insert to copy and paste.

Right-click copy-and-paste options are also available, but the right-click function is subject to browser-specific clipboard access.

## Editing .bashrc
Take caution when you edit .bashrc, because doing so can cause unexpected errors in Cloud Shell.

## .bash_history
Your history of bash commands might be inconsistent because of Cloud Shell session disruption or concurrent sessions.

## Usage limits
Cloud Shell is intended for interactive use cases. As a result, any long-running non-interactive sessions are ended without warning.

## Network connectivity
Any latency in Cloud Shell is subject to local internet connectivity, and Cloud Shell will continue to attempt to function with any instructions sent.

## Next steps
[Cloud Shell Quickstart](quickstart.md)
