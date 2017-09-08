---
title: Azure Cloud Shell (Preview) troubleshooting | Microsoft Docs
description: Troubleshooting of Azure Cloud Shell
services: 
documentationcenter: ''
author: maertendMSFT
manager: angelc
tags: azure-resource-manager
 
ms.assetid: 
ms.service: azure
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 09/05/2017
ms.author: maertendMSFT
---

# Troubleshooting Azure Cloud Shell
Known resolutions for issues in Azure Cloud Shell:

## An error about [MissingSubscriptionRegistration](media/troubleshooting/storageRP-error.jpg) occurs during persistent storage creation
  - **Details**: The selected subscription does not have Storage RP registered.
  - **Resolution**: [Register your Storage resource provider](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-common-deployment-errors#noregisteredproviderfound)

## [TODO]
When using an Azure Active Directory subscription, I cannot create storage due to Error: 400 DisallowedOperation. To resolve this, please use an Azure subscription capable of creating storage resources. AD subscriptions are not able to create Azure resources.


## PowerShell Resolutions

### No $Home directory persistence
  - **Details**: Any application (such as: git, vim, and others) that writes data to $Home will not be persisted across PowerShell sessions.
  - **Resolution**: In your PowerShell profile, create a symbolic link to application specific folder in `clouddrive` to $Home
  [TODO] Add an example

### Ctrl+C doesn't exit out of a Cmdlet prompt

[TODO] from an issue

### GUI applications are not supported
  - **Details**: If a user tries to launch a GUI app (for example, git clone a 2FA enabled private repo. It pops up a 2FA authentication dialog box), the console prompt does not return.
  - **Resolution**: `Ctrl+C` to exit the command.

### Get-Help -online does not open the help page
 - **Details**: If a user types `Get-Help Find-Module -online`, one sees an error message such as:\
 `Starting a browser to display online Help failed. No program or browser is associated to open the URI http://go.microsoft.com/fwlink/?LinkID=398574.`
 - **Resolution**: Copy the url and open it manually on your browser.
 