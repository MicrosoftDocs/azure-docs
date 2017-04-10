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
ms.date: 04/10/2017
ms.author: juluk
---
# About Cloud Console
Azure Cloud Console is a free, browser-accessible BASH shell available to every Azure user from the Azure Portal. 
This shell is your personal sandbox enabling you to deploy, manage, and develop Azure resources or integrate into your existing workflows.

## Concepts
- Machine state and files do not persist beyond the active session by default. You may [mount Azure storage to persist files](acc-persisting-storage.md).
- Permissions are set as a regular user
- Console runs on an ephemeral container provided on a per-session, per-user basis
- Console times out after 10 minutes without output activity (Hit enter to reactivate)

## Features
- A browser-based BASH workstation built for Azure
- Automatic authentication
- Bring your own Azure Files for file persistence

Check the full [feature list here](acc-features.md).

## Examples
- Test drive the new Azure CLI 2.0
- Deploy and edit scripts from a browser command line

## Pricing
The Cloud Console is a free service to all Azure customers. Regular storage costs apply if mounting Azure Files.

## Supported browsers
The Cloud Console is recommended for Chrome, Edge, and Safari. 
The console is supported for Chrome, Firefox, Safari, IE, and Edge, but shortcut functionality will be subject to specific browser settings.

## Next steps
- [ACC Quickstart](acc-quickstart.md) 