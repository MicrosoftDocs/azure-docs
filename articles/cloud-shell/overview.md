---
title: Azure Cloud Console (PREVIEW) Overview | Microsoft Docs
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
ms.date: 04/13/2017
ms.author: juluk
---
# Azure Cloud Console (PREVIEW)
Azure Cloud Console is an interactive, browser-based command-line interface for managing Azure resources.

## Preview FAQ
* [How do I persist files across sessions?](acc-persisting-storage.md) 
  * Mount an Azure file share via `createclouddrive -h` to receive file persistence in two areas:
    1. Entirety of your $Home directory will persist as a 5-GB image placed in the specified file share
    2. A `clouddrive` subdirectory under your $Home will sync to the file share for individual file interaction
  * Cloud Console will automatically mount the same share on subsequent sessions
  * **NOTE** You must restart Cloud Console to take effect
  * Learn how this works at [Persist Files in Cloud Console](acc-persisting-storage.md) 

* [How do I upload/download from local machine to Cloud Console?](https://github.com/jluk/ACC-Documentation/blob/master/acc-persisting-storage.md#upload-or-download-local-files)
  * The Azure Files portal GUI syncs to the `clouddrive` subdirectory and can be interacted via Azure portal
  * Follow [step-by-step upload/download instructions here](https://github.com/jluk/ACC-Documentation/blob/master/acc-persisting-storage.md#upload-or-download-local-files)

* [What does it cost?](acc-pricing.md)
  * Cloud Console is free, mounting storage incurs regular Azure Storage charges

* [What tools are installed on the console?](acc-features.md)
  * Check the full [feature list here](acc-features.md)

* Do I have sudo permissions?
  * Sudo permissions are not supported today given the ephemeral nature of Cloud Console

* [How do I copy and paste?](acc-use-console-window.md)
  * Currently Windows only supports right-click copy pasting in Chrome and Edge
  * OS X supports cmd-v and cmd-c across all browsers

## Concepts
* Machine state and files do not persist beyond the active session by default
  * You may [mount Azure storage to persist files.](acc-persisting-storage.md) 
* Consoles are assigned at one machine per unique user
  * Your Azure account is the only one with access to your user assigned Cloud Console
* Permissions are set as a regular Linux user
  * You may install packages via curl to your $Home directory

* Console runs on an ephemeral machine provided on a per-session, per-user basis
* Console times out after 10 minutes without output activity

## Features
* A browser-based BASH workstation built for Azure
* Automatic authentication
* Bring your own Azure Files for file persistence

Check the full [feature list here](acc-features.md).

## Examples
* Try out the new Azure CLI 2.0
* Manage resources via GUI or CLI, side-by-side
* Run scripts on Azure resources without leaving your browser

## Pricing
The Cloud Console is a free service to all Azure customers. Regular storage costs apply if mounting an Azure file share.

## Supported browsers
The Cloud Console is recommended for Chrome, Edge, and Safari. 

The console is supported for Chrome, Firefox, Safari, IE, and Edge, but shortcut functionality is subject to specific browser settings.

For all limitations visit [limitations of Cloud Console](acc-limitations.md).