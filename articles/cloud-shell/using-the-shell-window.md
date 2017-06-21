---
title: Using the Azure Cloud Shell (Preview) window | Microsoft Docs
description: Walkthrough the Azure Cloud Shell window.
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
ms.date: 06/14/2017
ms.author: juluk
---

# Using the Azure Cloud Shell window

This document explains how to use the Azure Cloud Shell window.

## Concurrent sessions
Cloud Shell enables multiple concurrent sessions across browser tabs by allowing each session to exist as a separate Bash process.
If exiting a session, be sure to exit from each session window as each process runs independently although they run on the same machine.

## Restart Cloud Shell
![](media/recycle.png)
> [!WARNING]
> Restarting Cloud Shell will reset machine state and any files not persisted by your file share will be lost.

* Click the restart icon on the toolbar to reset the Cloud Shell machine.

## Minimize & maximize Cloud Shell window
![](media/minmax.png)
* Click the minimize icon on the top right of the window to hide it. Click the Cloud Shell icon again to unhide.
* Click the maximize icon to set window to max height. To restore window to previous size, click restore.

## Copy and paste
* Windows: `Ctrl-insert` and `Shift-insert` or right-click dropdown to copy/paste
  * FireFox/IE may not support clipboard permissions properly
* Mac OS: `Cmd-c` and `Cmd-v` or right-click dropdown to copy/paste

## Resize Cloud Shell window
* Click and drag the top edge of the toolbar up or down to resize the Cloud Shell window.

## Scrolling text display
* Scroll with your mouse or touchpad

## Exit command
Running `exit` terminates the active session. This behavior occurs by default after 10 minutes without interaction.

## Next Steps
[Cloud Shell Quickstart](quickstart.md)  