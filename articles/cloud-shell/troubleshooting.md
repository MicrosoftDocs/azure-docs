---
title: Azure Cloud Shell troubleshooting | Microsoft Docs
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
ms.date: 11/2/2017
ms.author: damaerte
---

# Troubleshooting Azure Cloud Shell

Known resolutions for issues in Azure Cloud Shell include:

## General resolutions

### Storage Dialog - Error: 403 RequestDisallowedByPolicy
- **Details**: When creating a storage account through Cloud Shell, it is unsuccessful due to an Azure policy placed by your admin. Error message will include: `The resource action 'Microsoft.Storage/storageAccounts/write' is disallowed by one or more policies.`
- **Resolution**: Contact your Azure administrator to remove or update the Azure policy denying storage creation.

### Storage Dialog - Error: 400 DisallowedOperation
 - **Details**: When using an Azure Active Directory subscription, you cannot create storage.
 - **Resolution**: Use an Azure subscription capable of creating storage resources. Azure AD subscriptions are not able to create Azure resources.

### Terminal output - Error: Failed to connect terminal: websocket cannot be established. Press `Enter` to reconnect.
 - **Details**: Cloud Shell requires the ability to establish a websocket connection to Cloud Shell infrastructure.
 - **Resolution**: Check you have configured your network settings to enable sending https requests and websocket requests to domains at *.console.azure.com.

## PowerShell resolutions

### No $Home directory persistence

- **Details**: Any data that application (such as: git, vim, and others) writes to `$Home` is not persisted across PowerShell sessions.
- **Resolution**: In your PowerShell profile, create a symbolic link to application specific folder in `clouddrive` to $Home.

### Ctrl+C doesn't exit out of a Cmdlet prompt

- **Details**: When attempting to exit a Cmdlet prompt, `Ctrl+C` does not exit the prompt.
- **Resolution**: To exit the prompt, press `Ctrl+C` then `Enter`.

### GUI applications are not supported

- **Details**: If a user launches a GUI app, the prompt does not return. For example, when a user clones a private GitHub repo that is two factor authentication enabled, a dialog box is displayed for completing the two factor authentication.
- **Resolution**: `Ctrl+C` to exit the command.

### Get-Help -online does not open the help page

- **Details**: If a user types `Get-Help Find-Module -online`, one sees an error message such as:
 `Starting a browser to display online Help failed. No program or browser is associated to open the URI http://go.microsoft.com/fwlink/?LinkID=398574.`
- **Resolution**: Copy the url and open it manually on your browser.

### Troubleshooting remote management of Azure VMs

- **Details**: Due to the default Windows Firewall settings for WinRM the user may see the following error:
 `Ensure the WinRM service is running. Remote Desktop into the VM for the first time and ensure it can be discovered.`
- **Resolution**:  Make sure your VM is running. You can run `Get-AzureRmVM -Status` to find out the VM Status.  Next, add a new firewall rule on the remote VM to allow WinRM connections from any subnet, for example,

 ``` Powershell
 New-NetFirewallRule -Name 'WINRM-HTTP-In-TCP-PSCloudShell' -Group 'Windows Remote Management' -Enabled True -Protocol TCP -LocalPort 5985 -Direction Inbound -Action Allow -DisplayName 'Windows Remote Management - PSCloud (HTTP-In)' -Profile Public
 ```
 You can use [Azure custom script extension](https://docs.microsoft.com/azure/virtual-machines/windows/extensions-customscript) to avoid logon to your remote VM for adding the new firewall rule.
 You can save the preceding script to a file, say `addfirerule.ps1`, and upload it to your Azure storage container.
 Then try the following command:

 ``` Powershell
 Get-AzureRmVM -Name MyVM1 -ResourceGroupName MyResourceGroup | Set-AzureRmVMCustomScriptExtension -VMName MyVM1 -FileUri https://mystorageaccount.blob.core.windows.net/mycontainer/addfirerule.ps1 -Run 'addfirerule.ps1' -Name myextension
 ```

### `dir` caches the result in Azure drive

- **Details**: The result of `dir` is cached in Azure drive.
- **Resolution**: After you create or remove a resource in the Azure drive view, run `dir -force` to update.
