---
title: Azure Cloud Shell (Preview) Overview | Microsoft Docs
description: Overview of the Azure Cloud Shell.
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
# Azure Cloud Shell (Preview) Overview
Azure Cloud Shell is an interactive, browser-accessible shell for managing Azure resources.

## Cloud-based Azure workstation
Cloud Shell comes pre-installed with popular command-line tools and language support so you can work faster.
See the [full tooling list for Azure Cloud Shell](features.md).

## Secure automatic authentication
Cloud Shell securely authenticates for instant access to the Azure CLI 2.0.

## Persist your $HOME directory with Azure Files
Since Cloud Shell machines are temporary, Cloud Shell requires an Azure file share to be attached to persist your $Home directory.
On first launch Cloud Shell prompts for storage account and file share creation, this is a one-time step and will be automatically 
attached on all future sessions. An LRS storage account is created on your behalf with an Azure file share containing a 5-GB image.
This image is used to sync and persist your $Home directory. Regular storage costs apply.

[Explore more about how Cloud Shell persists files] (persisting-shell-storage.md).

## Concepts
* Cloud Shell runs on a temporary machine provided on a per-session, per-user basis
* Cloud Shell times out and recycles after 10 minutes without interactive activity
* Cloud Shell can only be accessed with a file share attached
* Cloud Shells are assigned one machine per user account
* Permissions are set as a regular Linux user

[Learn more about all Cloud Shell features.](features.md)

## Examples
* Create or edit scripts to manage Azure resources from any browser
* Simultaneously manage resources via Azure portal and Azure CLI 2.0
* Test-drive Azure CLI 2.0

## Pricing
The Cloud Shell machine is free, but requires 5-GB of Azure File storage. 
Regular storage costs apply.

## Supported browsers
Cloud Shell is recommended for Chrome, Edge, and Safari. 
While Cloud Shell is supported for Chrome, Firefox, Safari, IE, and Edge, Cloud Shell is subject to specific browser settings.
For specific known limitations, visit [limitations of Cloud Shell](limitations.md).