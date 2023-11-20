---
description: This article covers troubleshooting Cloud Shell common scenarios.
ms.contributor: jahelmic
ms.date: 09/29/2023
ms.topic: article
tags: azure-resource-manager
ms.custom: has-azure-ad-ps-ref
title: Azure Cloud Shell troubleshooting
---
# Troubleshooting & Limitations of Azure Cloud Shell

This article covers troubleshooting Cloud Shell common scenarios.

## General troubleshooting

### Error running AzureAD cmdlets in PowerShell

- **Details**: When you run AzureAD cmdlets like `Get-AzureADUser` in Cloud Shell, you might see an
  error: `You must call the Connect-AzureAD cmdlet before calling any other cmdlets`.
- **Resolution**: Run the `Connect-AzureAD` cmdlet. Previously, Cloud Shell ran this cmdlet
  automatically during PowerShell startup. To speed up start time, the cmdlet no longer runs
  automatically. You can choose to restore the previous behavior by adding `Connect-AzureAD` to the
  $PROFILE file in PowerShell.

  > [!NOTE]
  > These cmdlets are part of the **AzureAD.Standard.Preview** module. That module is being
  > deprecated and won't be supported after June 30, 2023. You can use the AD cmdlets in the
  > **Az.Resources** module or use the Microsoft Graph API instead. The **Az.Resources** module is
  > installed by default. The **Microsoft Graph API PowerShell SDK** modules aren't installed by
  > default. For more information, [Upgrade from AzureAD to Microsoft Graph][06].

### Early timeouts in FireFox

- **Details**: Cloud Shell uses an open websocket to pass input/output to your browser. FireFox has
  preset policies that can close the websocket prematurely causing early timeouts in Cloud Shell.
- **Resolution**: Open FireFox and navigate to "about:config" in the URL box. Search for
  "network.websocket.timeout.ping.request" and change the value from 0 to 10.

### Disabling Cloud Shell in a locked down network environment

- **Details**: Administrators might want to disable access to Cloud Shell for their users. Cloud Shell
  depends on access to the `ux.console.azure.com` domain, which can be denied, stopping any access
  to Cloud Shell's entry points including `portal.azure.com`, `shell.azure.com`, Visual Studio Code
  Azure Account extension, and `learn.microsoft.com`. In the US Government cloud, the entry point is
  `ux.console.azure.us`; there's no corresponding `shell.azure.us`.
- **Resolution**: Restrict access to `ux.console.azure.com` or `ux.console.azure.us` via network
  settings to your environment. Even though the Cloud Shell icon still exists in the Azure portal,
  you can't connect to the service.

### Storage Dialog - Error: 403 RequestDisallowedByPolicy

- **Details**: When creating a storage account through Cloud Shell, it's unsuccessful due to an
  Azure Policy assignment placed by your admin. The error message includes:

  > The resource action 'Microsoft.Storage/storageAccounts/write' is disallowed by
  > one or more policies.

- **Resolution**: Contact your Azure administrator to remove or update the Azure Policy assignment
  denying storage creation.

### Storage Dialog - Error: 400 DisallowedOperation

- **Details**: When using a Microsoft Entra subscription, you can't create storage.
- **Resolution**: Use an Azure subscription capable of creating storage resources. Microsoft Entra
  ID subscriptions aren't able to create Azure resources.

### Terminal output - Error: Failed to connect terminal: websocket can't be established

- **Details**: Cloud Shell requires the ability to establish a websocket connection to Cloud Shell
  infrastructure.
- **Resolution**: Confirm that your network settings to allow sending HTTPS and websocket requests
  to domains at `*.console.azure.com` and `*.servicebus.windows.net`.

### Set your Cloud Shell connection to support using TLS 1.2

 - **Details**: To define the version of TLS for your connection to Cloud Shell, you must set
   browser-specific settings.
 - **Resolution**: Navigate to the security settings of your browser and select the checkbox next to
   **Use TLS 1.2**.

## Bash troubleshooting

### You can't run the docker daemon

- **Details**: Cloud Shell uses a container to host your shell environment, as a result running
  the daemon is disallowed.
- **Resolution**: Use the [docker CLI][04], which is installed by default, to remotely manage docker
  containers.

## PowerShell troubleshooting

### GUI applications aren't supported

- **Details**: If a user launches a GUI application, the prompt doesn't return. For example, when
  one clone a private GitHub repo that has two factor authentication enabled, a dialog box is
  displayed for completing the two factor authentication.
- **Resolution**: Close and reopen the shell.

### Troubleshooting remote management of Azure VMs

> [!NOTE]
> Azure VMs must have a Public facing IP address.

- **Details**: Due to the default Windows Firewall settings for WinRM the user might see the following
  error:

  > Ensure the WinRM service is running. Remote Desktop into the VM for the first time and ensure
  > it can be discovered.

- **Resolution**: Run `Enable-AzVMPSRemoting` to enable all aspects of PowerShell remoting on the
  target machine.

### `dir` doesn't update the result in Azure drive

- **Details**: By default, to optimize for user experience, the results of `dir` is cached in Azure
  drive.
- **Resolution**: After you create, update or remove an Azure resource, run `dir -force` to update
  the results in the Azure drive.

## General limitations

Azure Cloud Shell has the following known limitations:

### Quota limitations

Azure Cloud Shell has a limit of 20 concurrent users per tenant. Opening more than 20 simultaneous
sessions produces a "Tenant User Over Quota" error. If you have a legitimate need to have more than
20 sessions open, such as for training sessions, contact Support to request a quota increase before
your anticipated usage.

Cloud Shell is provided as a free service for managing your Azure environment. It's not as a general
purpose computing platform. Excessive automated usage can be considered in breach to the Azure Terms
of Service and could lead to Cloud Shell access being blocked.

### System state and persistence

The machine that provides your Cloud Shell session is temporary, and it's recycled after your
session is inactive for 20 minutes. Cloud Shell requires an Azure fileshare to be mounted. As a
result, your subscription must be able to set up storage resources to access Cloud Shell. Other
considerations include:

- With mounted storage, only modifications within the `clouddrive` directory are persisted. In Bash,
  your `$HOME` directory is also persisted.
- Azure Files supports only locally redundant storage and geo-redundant storage accounts.

### Browser support

Cloud Shell supports the latest versions of following browsers:

- Microsoft Edge
- Microsoft Internet Explorer
- Google Chrome
- Mozilla Firefox
- Apple Safari
  - Safari in private mode isn't supported.

### Copy and paste

- Windows: <kbd>Ctrl</kbd>+<kbd>c</kbd> to copy is supported but use
  <kbd>Shift</kbd>+<kbd>Insert</kbd> to paste.
  - FireFox might not support clipboard permissions properly.
- macOS: <kbd>Cmd</kbd>+<kbd>c</kbd> to copy and <kbd>Cmd</kbd>+<kbd>v</kbd> to paste.
- Linux: <kbd>CTRL</kbd>+<kbd>c</kbd> to copy and <kbd>CTRL</kbd>+<kbd>Shift</kbd>+<kbd>v</kbd> to paste.

> [!NOTE]
> If no text is selected when you type <kbd>Ctrl</kbd>+<kbd>C</kbd>, Cloud Shell sends the `Ctrl C`
> character to the shell. This could terminate the currently running command.

### Usage limits

Cloud Shell is intended for interactive use cases. Cloud Shell sessions time out after 20 minutes
without interactive activity. As a result, any long-running non-interactive sessions are ended
without warning.

### User permissions

Permissions are set as regular users without sudo access. Any installation outside your `$Home`
directory isn't persisted.

### Supported entry point limitations

Cloud Shell entry points beside the Azure portal, such as Visual Studio Code and Windows Terminal,
don't support various Cloud Shell functionalities:

- Use of commands that modify UX components in Cloud Shell, such as `Code`
- Fetching non-ARM access tokens

## Bash limitations

### Editing .bashrc

Take caution when editing .bashrc, doing so can cause unexpected errors in Cloud Shell.

## PowerShell limitations

### Preview version of AzureAD module

Currently, `AzureAD.Standard.Preview`, a preview version of .NET Standard-based, module is
available. This module provides the same functionality as `AzureAD`.

## Personal data in Cloud Shell

Azure Cloud Shell takes your personal data seriously. The Azure Cloud Shell service stores your
preferences, such as your most recently used shell, font size, font type, and details of the
fileshare that backs cloud drive. You can export or delete this data using the following
instructions.

<!--
TODO:
- Are there cmdlets or CLI to do this now, instead of REST API?
-->
### Export

Use the following commands to **export** Cloud Shell the user settings, such as preferred shell,
font size, and font type.

1. Launch Cloud Shell.

1. Run the following commands in Bash or PowerShell:

   Bash:
<!--
TODO:
- Is there a way to wrap the lines for bash?
- Why are we getting the token this way? The next example uses az cli.
- The URLs used are not consistent across all the examples
- Should we be using a newer API version?
-->
   ```bash
   token=$(curl http://localhost:50342/oauth2/token --data "resource=https://management.azure.com/" -H Metadata:true -s | jq -r ".access_token")
   curl https://management.azure.com/providers/Microsoft.Portal/usersettings/cloudconsole?api-version=2017-12-01-preview -H Authorization:"Bearer $token" -s | jq
   ```

   PowerShell:

   ```powershell
   $parameters = @{
       Uri = "$env:MSI_ENDPOINT`?resource=https://management.core.windows.net/"
       Headers = @{Metadata='true'}
   }
   $token= ((Invoke-WebRequest @parameters ).content |  ConvertFrom-Json).access_token
   $parameters = @{
       Uri = 'https://management.azure.com/providers/Microsoft.Portal/usersettings/cloudconsole?api-version=2017-12-01-preview'
       Headers = @{Authorization = "Bearer $token"}
   }
   ((Invoke-WebRequest @parameters ).Content | ConvertFrom-Json).properties | Format-List
   ```

### Delete

Run the following commands to **delete** Cloud Shell user settings, such as preferred shell, font
size, and font type. The next time you start Cloud Shell you'll be asked to onboard a fileshare
again.

> [!NOTE]
> If you delete your user settings, the actual Azure fileshare is not deleted. Go to your Azure
> Files to complete that action.

1. Launch Cloud Shell or a local shell with either Azure PowerShell or Azure CLI installed.

1. Run the following commands in Bash or PowerShell:

   Bash:

   ```bash
   TOKEN=$(az account get-access-token --resource "https://management.azure.com/" -o tsv --query accessToken)
   curl -X DELETE https://management.azure.com/providers/Microsoft.Portal/usersettings/cloudconsole?api-version=2017-12-01-preview -H Authorization:"Bearer $TOKEN"
   ```

   PowerShell:

   ```powershell
   $token= (Get-AzAccessToken -Resource  https://management.azure.com/).Token
   $parameters = @{
       Method = 'Delete'
       Uri = 'https://management.azure.com/providers/Microsoft.Portal/usersettings/cloudconsole?api-version=2017-12-01-preview'
       Headers = @{Authorization = "Bearer $token"}
   }
   Invoke-WebRequest @parameters
   ```

## Azure Government limitations

Azure Cloud Shell in Azure Government is only accessible through the Azure portal.

> [!NOTE]
> Connecting to GCC-High or Government DoD Clouds for Exchange Online is currently not supported.

<!-- link references -->
[04]: https://docs.docker.com/desktop/
[06]: /powershell/microsoftgraph/migration-steps
