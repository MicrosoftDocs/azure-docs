---
title: Azure Cloud Shell (Preview) limitations | Microsoft Docs
description: Overview of limitations of Azure Cloud Shell
services: 
documentationcenter: ''
author: jluk
manager: timlt
tags: azure-resource-manager
 
ms.assetid: 
ms.service: 
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 05/10/2017
ms.author: juluk
---

# Limitations for Azure Cloud Shell
Azure Cloud Shell has the following known limitations.

## System state and persistence
The machine providing your Cloud Shell session is temporary and is recycled after your session is inactive for 10 minutes. Cloud Shell requires a file share to be mounted. As a result your subscription must be able to provision storage resources to access Cloud Shell.
* With mounted storage only modifications within your `$Home` directory or `clouddrive` directory are persisted
  * File shares can only be mounted from within your [assigned region](persisting-shell-storage.md#pre-requisites-for-manual-mounting)
  * Azure Files only supports LRS and GRS storage accounts

## User permissions
Permissions are set as regular users without sudo access. Any installation outside of your $Home will not persist.
Certain commands such as `git clone` within the `clouddrive` directory do not have proper permissions, however your $Home directory does.

## Browser support
Cloud Shell supports the latest versions of Microsoft Edge, Microsoft Internet Explorer, Google Chrome, Mozilla Firefox, and Apple Safari. Safari in private mode is not supported.

## Copy and paste
Ctrl-v and Ctrl-c do not function as copy/paste on Windows machines, please use Ctrl-insert and Shift-insert to copy/paste.
Right-click copy paste options are also available, however this is subject to browser-specific clipboard access.

## Usage limits
Cloud Shell is intended for interactive use cases, as a result any long-running non-interactive sessions are ended without warning.

## Network connectivity
Any latency in Cloud Shell is subject to local internet connectivity, Cloud Shell will continue to attempt functioning with any instructions sent.

## Next steps
[Cloud Shell Quickstart](quickstart.md)
