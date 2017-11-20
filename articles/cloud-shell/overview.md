---
title: Azure Cloud Shell overview | Microsoft Docs
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
ms.date: 11/16/2017
ms.author: juluk
---
# Overview of Azure Cloud Shell
Azure Cloud Shell is an interactive, browser-accessible shell for managing Azure resources.
It gives you the flexibility of choosing the shell experience that best suits the way you work.
Linux users can opt for a Bash experience, while Windows users can opt for PowerShell.

Launch via Azure portal from the Cloud Shell icon:

![Portal launch](media/overview/portal-launch-icon.png)

Leverage Bash or PowerShell from the shell selector dropdown:

![Bash in Cloud Shell](media/overview/overview-bash-pic.png)

![PowerShell in Cloud Shell (Preview)](media/overview/overview-ps-pic.png)

## Features
### Browser-based shell experience
Cloud Shell enables access to a browser-based command-line experience built with Azure management tasks in mind.
Leverage Cloud Shell to work untethered from a local machine in a way only the cloud can provide.

### Choice of preferred shell experience
Azure Cloud Shell gives you the flexibility of choosing the shell experience that best suits the way you work.
Linux users can opt for Bash in Cloud Shell, while Windows users can opt for PowerShell in Cloud Shell (Preview).

### Authenticated and configured Azure workstation
Cloud Shell comes managed by Microsoft so it is pre-installed with popular command-line tools and language support so you can work faster. Additionally, Cloud Shell securely authenticates automatically for instant access to your resources through the Azure CLI 2.0 or Azure PowerShell cmdlets.

View the full tooling list for the [Bash experience](features.md#tools) and [PowerShell (Preview) experience.](features-powershell.md#tools)

### Multiple access points
In addition to Cloud Shell being available from the Azure portal, it can also be accessed from:
* [Azure CLI 2.0 "Try It" documentation](https://docs.microsoft.com/cli/azure/overview?view=azure-cli-latest)
* [Azure mobile app](https://azure.microsoft.com/features/azure-portal/mobile-app/)
* [Visual Studio Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account)

### Connect your Azure Files storage
Cloud Shell machines are temporary and as a result require an Azure Files share to be mounted as `clouddrive` to persist your $Home directory.
On first launch Cloud Shell prompts to create a resource group, storage account, and file share on your behalf. This is a one-time step and will be automatically attached for all sessions. A single file share can be mapped and will be used by both Bash and PowerShell in Cloud Shell (Preview).

#### Create new storage
![](media/overview/basic-storage.png)

A locally-redundant storage (LRS) account and Azure Files share can be created on your behalf. The Azure Files share will be used for both Bash and PowerShell environments if you choose to use both. Regular storage costs apply.

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
* Cloud Shell runs on a temporary host provided on a per-session, per-user basis
* Cloud Shell times out after 20 minutes without interactive activity
* Cloud Shell requires a file share to be mounted
* Cloud Shell uses the same file share for both Bash and PowerShell
* Cloud Shell is assigned one machine per user account
* Permissions are set as a regular Linux user in Bash

Learn more about features in [Bash in Cloud Shell](features.md) and [PowerShell in Cloud Shell (Preview)](features-powershell.md).

## Examples
* Use scripts to automate Azure management tasks
* Simultaneously manage Azure resources via Azure portal and Azure command-line tools
* Test-drive Azure CLI 2.0 or Azure PowerShell cmdlets

Try out these examples in quickstarts for [Bash in Cloud Shell](quickstart.md) and [PowerShell in Cloud Shell (Preview)](quickstart-powershell.md).

## Pricing
The machine hosting Cloud Shell is free, with a pre-requisite of a mounted Azure Files share. Regular storage costs apply.

## Next steps
[Bash in Cloud Shell quickstart](quickstart.md) <br>
[PowerShell in Cloud Shell (Preview) quickstart](quickstart-powershell.md)