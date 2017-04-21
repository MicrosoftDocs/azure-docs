---
title: Azure Cloud Shell (Preview) Limitations | Microsoft Docs
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
ms.date: 04/13/2017
ms.author: juluk
---

# Limitations
Azure Cloud Shell has the following known limitations.

## User permissions
Permissions are set as regular users without sudo access. Any installation outside of your $Home will not persist.
Certain commands such as `git clone` within the `clouddrive` directory do not have proper permissions, however your $Home directory does.

## System state and persistence
The container providing your Cloud Shell session is temporary and is recycled after your session is inactive for 10 minutes. If a file share is not mounted, no files will persist.
* With mounted storage only modifications within your `$Home` are persisted
  * File shares can only be mounted from supported [regions](persisting-shell-storage.md)
  * Azure Files only supports LRS and GRS storage accounts

## Browser support
Cloud Shell supports the latest versions of Microsoft Edge, Microsoft Internet Explorer, Google Chrome, Mozilla Firefox, and Apple Safari.
However, Safari in private mode is not supported.

Currently Windows machines do not support keyboard shortcuts. 
Utilize right-click copy paste options if needed, however Firefox and Internet Explorer do not support right-click permissions.

## Usage limits
Cloud Shell is intended for interactive use cases, as a result any long-running non-interactive sessions are ended without warning.

## Network connectivity
Any latency in the Cloud Shell is subject to local internet connectivity, Cloud Shell will continue to attempt functioning to any instructions sent.

## Next steps
[Quickstart](quickstart.md) <br>
[Persist files by attaching a file share to Cloud Shell](persisting-shell-storage.md) 