---
title: Azure Cloud Shell (Preview) overview | Microsoft Docs
description: Overview of the Azure Cloud Shell.
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
# Overview of Azure Cloud Shell (Preview)
Azure Cloud Shell is an interactive, browser-accessible shell for managing Azure resources.
It gives you the flexibility of choosing the shell experience that best suits the way you work.
Linux users can opt for a Bash experience, while Windows users can opt for PowerShell.

<p float="left">
  <img src="media/overview/overview-bash-pic.png" width="480" />
  <img src=" " width="20" /> 
  <img src="media/overview/overview-ps-pic.png" width="480" /> 
</p>

## Features
### Browser-based shell experience
Cloud Shell enables access to a browser-based command-line experience built with Azure management tasks in mind.
Leverage Cloud Shell to work untethered from a local machine in a way only the cloud can provide.

### Choice of preferred shell experience
Azure Cloud Shell gives you the flexibility of choosing the shell experience that best suits the way you work.
Linux users can opt for a Bash experience, while Windows users can opt for PowerShell.

### Pre-configured Azure workstation
Cloud Shell comes pre-installed with popular command-line tools and language support so you can work faster.

View the full tooling list for [Bash experience](features.md#tools) and [PowerShell experience.](features-powershell.md#tools)

### Automatic authentication
Cloud Shell securely authenticates automatically on each session for instant access to your resources through the Azure CLI 2.0.

### Connect your Azure File storage
Cloud Shell machines are temporary and as a result require an Azure file share to be mounted as `clouddrive` to persist your $Home directory.
On first launch Cloud Shell prompts to create a resource group, storage account, and file share on your behalf. This is a one-time step and will be automatically attached for all sessions. A single file share can be mapped and will be used by both Bash and PowerShell in Cloud Shell.

#### Create new storage
![](media/overview/basic-storage.png)

A locally-redundant storage (LRS) account and Azure File share can be created on your behalf. The Azure File share will be used for both Bash and PowerShell environments if you choose to use both. Regular storage costs apply.

Three resources will be created on your behalf:
1. Resource Group named: `cloud-shell-storage-<region>`
2. Storage Account named: `cs<uniqueGuid>`
3. File Share named: `cs-<user>-<domain>-com-<uniqueGuid>`

> [!Note]
> Bash in Cloud Shell also creates a default 5-GB disk image to persist `$Home`. All files in your $Home directory such as SSH keys are persisted in your user disk image stored in your mounted file share. Apply best practices when saving files in your $Home directory and mounted file share.

#### Use existing resources
![](media/overview/advanced-storage.png)

An advanced option is provided to associate existing resources to Cloud Shell.
At the storage setup prompt, click "Show advanced settings" to show additional options.
Dropdowns are filtered for your assigned Cloud Shell region and locally/globally-redundant storage accounts.

[Learn about Cloud Shell storage, updating file shares, and uploading/downloading files.](persisting-shell-storage.md)

## Concepts
* Cloud Shell runs on a temporary machine provided on a per-session, per-user basis
* Cloud Shell times out after 20 minutes without interactive activity
* Cloud Shell can only be accessed with a file share attached
* Cloud Shell uses a the same file share for both Bash and PowerShell
* Cloud Shell is assigned one machine per user account
* Permissions are set as a regular Linux user (Bash)

Learn more about features in [Bash in Cloud Shell](features.md) and [PowerShell in Cloud Shell](features-powershell.md).

## Examples
* Use scripts to automate Azure management tasks
* Simultaneously manage Azure resources via Azure portal and Azure command-line tools
* Test-drive Azure CLI 2.0 or Azure PowerShell cmdlets

Try out these examples in quickstarts for [Bash in Cloud Shell](quickstart.md) and [PowerShell in Cloud Shell](quickstart-powershell.md).

## Pricing
The machine hosting Cloud Shell is free, with a pre-requisite of a mounted Azure file share. Regular storage costs apply.

## Supported browsers
Cloud Shell is recommended for Chrome, Edge, and Safari.
While Cloud Shell is supported for Chrome, Firefox, Safari, IE, and Edge, Cloud Shell is subject to specific browser settings.