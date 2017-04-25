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
ms.date: 04/21/2017
ms.author: juluk
---
# Azure Cloud Shell (Preview) Overview
Azure Cloud Shell is an interactive, browser-accessible shell for managing Azure resources.

## Cloud-based Azure workstation
Cloud Shell comes pre-installed with popular command-line tools and language support so you can work faster.
See the [full tooling list for Azure Cloud Shell](features.md).

## Secured automatic authentication
Cloud Shell securely authenticates for instant access to the Azure CLI 2.0.

## Persist your $HOME directory with Azure Files
Since Cloud Shell machines are temporary, Cloud Shell requires an Azure file share to be attached in order to persist your $Home directory.
On first launch Cloud Shell prompts for storage account and file share creation, this is a one-time step and will be automatically 
attached on all future sessions. An LRS storage account will be created on your behalf with an Azure file share containing a 5-GB image.
This image is used to sync and persist your $Home directory.

[Explore more about how Cloud Shell persists files] (persisting-shell-storage.md).

## Concepts
* Cloud Shell runs on an ephemeral machine provided on a per-session, per-user basis
* Cloud Shell times out and recycles after 10 minutes without interactive activity
* Cloud Shell cannot be accessed without a file share attached
* Cloud Shells are assigned one machine at the user account level
* Permissions are set as a regular Linux user

## Examples
* Create or edit scripts to manage Azure resources from any browser
* Simultaneously manage resources via portal and command line
* Test-drive Azure CLI 2.0

## Pricing
The Cloud Shell machine is free, but requires 5-GB of Azure File storage. 
Regular storage costs apply.

## Supported browsers
The Cloud Shell is recommended for Chrome, Edge, and Safari. 
While Cloud Shell is supported for Chrome, Firefox, Safari, IE, and Edge, Cloud Shell is subject to specific browser settings.

As a result, clipboard permissions are limited in Firefox and IE.
For all limitations visit [limitations of Cloud Shell](limitations.md).