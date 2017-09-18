---
title: Azure Cloud Shell (Preview) troubleshooting | Microsoft Docs
description: Troubleshooting Azure Cloud Shell
services: azure
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
ms.author: damaerte
---

# Troubleshooting Azure Cloud Shell
Known resolutions for issues in Azure Cloud Shell:

## An error about [MissingSubscriptionRegistration](media/troubleshooting/storageRP-error.jpg) occurs during persistent storage creation
  - **Details**: The selected subscription does not have Storage RP registered.
  - **Resolution**: [Register your Storage resource provider](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-common-deployment-errors#noregisteredproviderfound).

## Error: 400 DisallowedOperation
 - **Details**: When using an Azure Active Directory subscription, you cannot create storage.
 - **Resolution**: Use an Azure subscription capable of creating storage resources. Azure AD subscriptions are not able to create Azure resources.

## PowerShell resolutions

### No $Home directory persistence
  - **Details**: Any application (such as: git, vim, and others) that writes data to $Home will not be persisted across PowerShell sessions.
  - **Resolution**: In your PowerShell profile, create a symbolic link to application specific folder in `clouddrive` to $Home.

### Ctrl+C doesn't exit out of a Cmdlet prompt
 - **Details**: When attemtping to exit a Cmdlet prompt, `Ctrl+C` does not exit the prompt.
 - **Resolution**: To exit the prompt, press `Ctrl+C` then `Enter`.

### GUI applications are not supported
  - **Details**: If a user launches a GUI app, the prompt does not return.  For example, when a user uses `git` to close a private repo that is two factor authentication enabled, a dialog box is displayed for the two factor authentication code.
  - **Resolution**: `Ctrl+C` to exit the command.

### Get-Help -online does not open the help page
 - **Details**: If a user types `Get-Help Find-Module -online`, one sees an error message such as:
 `Starting a browser to display online Help failed. No program or browser is associated to open the URI http://go.microsoft.com/fwlink/?LinkID=398574.`
 - **Resolution**: Copy the url and open it manually on your browser.
 