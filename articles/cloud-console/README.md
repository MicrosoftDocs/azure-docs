---
title: Azure Cloud Console Overview | Microsoft Docs
description: Overview of the Azure Cloud Console.
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
ms.date: 03/09/2017
ms.author: juluk
---
# Azure Cloud Console (preview)
This repo includes staged documents for the Azure Cloud Console. Please refer to these documents for updates throughout previews.

![](media/beta-screenshot.png)

* Access console via [aka.ms/accbeta] (https://www.aka.ms/accbeta)
* Access docs via [aka.ms/accbetadocs] (https://www.aka.ms/accbetadocs)

## About Cloud Console
Azure is excited to provide a free, browser-accessible BASH shell to every Azure user from the Azure Portal. 
This shell is your personal sandbox enabling you to deploy, manage, and develop Azure resources or integrate into your existing workflows.

### Concepts
* Machine state and files do not persist beyond the active session by default
  * You may [mount Azure storage to persist files.](/How-to/acc-persisting-storage.md) 
* Permissions are set as a regular user
* Console runs on an ephemeral container provided on a per-session, per-user basis
* Console times out after 10 minutes without output activity (Hit enter to reactivate)

### Features
* A browser-based BASH workstation built for Azure
* Automatic authentication
* Bring your own Azure Files for file persistence

Check the full [feature list here](Concepts/acc-features.md).

## Example use cases
* Try out the new Azure CLI 2.0
* SSH directly from the Azure Portal
* Manage resources via GUI or CLI, side-by-side
* Test documentation scripts without leaving your browser

## Preview access 
In order to receive internal access you must:

1. Be whitelisted
2. Navigate to [aka.ms/accbeta] (https://www.aka.ms/accbeta). This shortlink provides full Portal access so it can be used as a replacement link.
3. Launch the console via the terminal icon on the top navigation pane.

Your initial session will take ~90 seconds to configure, subsequent sessions will be much faster.

## Pricing
The Cloud Console is a free service to all Azure customers. Regular storage costs apply if mounting an Azure File share.

## Supported browsers
The Cloud Console is recommended for Chrome, Edge, and Safari. 
The console is supported for Chrome, Firefox, Safari, IE, and Edge, but shortcut functionality will be subject to specific browser settings.

## Feedback
[Internal] Please provide feedback on: <br>
1. [Yammer group](https://www.yammer.com/microsoft.com/groups/azurecloudconsole)
2. Cloud Console Teams discussion

## Known Preview Issues
1. CLI 2.0 cmd and autocomplete performance
2. Force kill/restart is coming soon, if your console freezes please open an issue with repro details. Refreshing the page and relaunching the console acts as a force restart for now.
3. Portal tabs left inactive for long periods of time will have tokens expire, this can disable reactivating the console. Please refresh your page to fix this.
4. Shortcuts (ctrl-v and ctrl-c) not supported on Windows in preview
5. Right-click paste not supported on IE/Firefox