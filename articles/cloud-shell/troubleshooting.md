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
ms.date: 02/22/2018
ms.author: damaerte
---

# Troubleshooting & Limitations of Azure Cloud Shell

Known resolutions for troubleshooting issues in Azure Cloud Shell include:

## General troubleshooting

### Early timeouts in FireFox
- **Details**: Cloud Shell utilizes an open websocket to pass input/output to your browser. FireFox has preset policies that can close the websocket prematurely causing early timeouts in Cloud Shell.
- **Resolution**: Open FireFox and navigate to "about:config" in the URL box. Search for "network.websocket.timeout.ping.request" and change the value from 0 to 10.

### Storage Dialog - Error: 403 RequestDisallowedByPolicy
- **Details**: When creating a storage account through Cloud Shell, it is unsuccessful due to an Azure policy placed by your admin. Error message will include: `The resource action 'Microsoft.Storage/storageAccounts/write' is disallowed by one or more policies.`
- **Resolution**: Contact your Azure administrator to remove or update the Azure policy denying storage creation.

### Storage Dialog - Error: 400 DisallowedOperation
 - **Details**: When using an Azure Active Directory subscription, you cannot create storage.
 - **Resolution**: Use an Azure subscription capable of creating storage resources. Azure AD subscriptions are not able to create Azure resources.

### Terminal output - Error: Failed to connect terminal: websocket cannot be established. Press `Enter` to reconnect.
 - **Details**: Cloud Shell requires the ability to establish a websocket connection to Cloud Shell infrastructure.
 - **Resolution**: Check you have configured your network settings to enable sending https requests and websocket requests to domains at *.console.azure.com.

## Bash troubleshooting

### Cannot run az login

- **Details**: Running `az login` will not work as you are already authenticated under the account used to sign into Cloud Shell or Azure portal.
- **Resolution**: Utilize your account used to sign in or sign out and reauthenticate with your intended Azure account.

### Cannot run the docker daemon

- **Details**: Cloud Shell utilizes a container to host your shell environment, as a result running the daemon is disallowed.
- **Resolution**: Utilize [docker-machine](https://docs.docker.com/machine/overview/), which is installed by default, to manage docker containers from a remote Docker host.

## PowerShell troubleshooting

### No $Home directory persistence

- **Details**: Any data that application (such as: git, vim, and others) writes to `$Home` is not persisted across PowerShell sessions.
- **Resolution**: In your PowerShell profile, create a symbolic link to application specific folder in `clouddrive` to $Home.

### Ctrl+C doesn't exit out of a Cmdlet prompt

- **Details**: When attempting to exit a Cmdlet prompt, `Ctrl+C` does not exit the prompt.
- **Resolution**: To exit the prompt, press `Ctrl+C` then `Enter`.

### GUI applications are not supported

- **Details**: If a user launches a GUI app, the prompt does not return. For example, when a user clones a private GitHub repo that is two factor authentication enabled, a dialog box is displayed for completing the two factor authentication.  
- **Resolution**: Close and reopen the shell.

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

## General limitations
Azure Cloud Shell has the following known limitations:

### System state and persistence

The machine that provides your Cloud Shell session is temporary, and it is recycled after your session is inactive for 20 minutes. Cloud Shell requires an Azure file share to be mounted. As a result, your subscription must be able to set up storage resources to access Cloud Shell. Other considerations include:

* With mounted storage, only modifications within the `clouddrive` directory are persisted. In Bash, your `$Home` directory is also persisted.
* Azure file shares can be mounted only from within your [assigned region](persisting-shell-storage.md#mount-a-new-clouddrive).
  * In Bash, run `env` to find your region set as `ACC_LOCATION`.
* Azure Files supports only locally redundant storage and geo-redundant storage accounts.

### Browser support

Cloud Shell supports the latest versions of Microsoft Edge, Microsoft Internet Explorer, Google Chrome, Mozilla Firefox, and Apple Safari. Safari in private mode is not supported.

### Copy and paste

[!include [copy-paste](../../includes/cloud-shell-copy-paste.md)]

### For a given user, only one shell can be active

Users can only launch one type of shell at a time, either **Bash** or **PowerShell**. However, you may have multiple instances of Bash or PowerShell running at one time. Swapping between Bash or PowerShell causes Cloud Shell to restart, which terminates existing sessions.

### Usage limits

Cloud Shell is intended for interactive use cases. As a result, any long-running non-interactive sessions are ended without warning.

## Bash limitations

### User permissions

Permissions are set as regular users without sudo access. Any installation outside your `$Home` directory is not persisted.

### Editing .bashrc

Take caution when editing .bashrc, doing so can cause unexpected errors in Cloud Shell.

## PowerShell limitations

### Slow startup time

PowerShell in Azure Cloud Shell (Preview) could take up to 60 seconds to initialize during preview.

### Default file location when created from Azure drive:

Using PowerShell cmdlets, users can not create files under the Azure drive. When users create new files using other tools, such as vim or nano, the files are saved to C:\Users folder by default. 

### GUI applications are not supported

If the user runs a command that would create a Windows dialog box, such as `Connect-AzureAD` or `Connect-AzureRmAccount`, one sees an error message such as: `Unable to load DLL 'IEFRAME.dll': The specified module could not be found. (Exception from HRESULT: 0x8007007E)`.

## GDPR compliance for Cloud Shell

Azure Cloud Shell takes your personal data seriously, the data captured and stored by the Azure Cloud Shell service are used to provide defaults for your experience such as your most recently used shell, preferred font size, preferred font type, and file share details that back clouddrive. Should you wish to export or delete this data, we have included the following instructions.

### Export
In order to **export** the user settings Cloud Shell saves for you such as preferred shell, font size, and font type run the following commands.

1. Launch Bash in Cloud Shell
2. Run the following commands:
```
user@Azure:~$ token="Bearer $(curl http://localhost:50342/oauth2/token --data "resource=https://management.azure.com/" -H Metadata:true -s | jq -r ".access_token")"
user@Azure:~$ curl https://management.azure.com/providers/Microsoft.Portal/usersettings/cloudconsole?api-version=2017-12-01-preview -H Authorization:"$token" -s | jq
```

### Delete
In order to **delete** your user settings Cloud Shell saves for you such as preferred shell, font size, and font type run the following commands. The next time you start Cloud Shell you will be asked to onboard a file share again. 

The actual Azure Files share will not be deleted if you delete your user settings, go to Azure Files to complete that action.

1. Launch Bash in Cloud Shell
2. Run the following commands:
```
user@Azure:~$ token="Bearer $(curl http://localhost:50342/oauth2/token --data "resource=https://management.azure.com/" -H Metadata:true -s | jq -r ".access_token")"
user@Azure:~$ curl -X DELETE https://management.azure.com/providers/Microsoft.Portal/usersettings/cloudconsole?api-version=2017-12-01-preview -H Authorization:"$token"
```
