---
description: This article answers common questions and explains how to troubleshoot Cloud Shell issues.
ms.contributor: jahelmic
ms.date: 11/08/2023
ms.topic: article
tags: azure-resource-manager
ms.custom: has-azure-ad-ps-ref
title: Azure Cloud Shell Frequently Asked Questions (FAQ)
---
# Azure Cloud Shell frequently asked questions (FAQ)

This article answers common questions and explains how to troubleshoot Cloud Shell issues.

## Browser support

Cloud Shell supports the latest versions of following browsers:

- Microsoft Edge
- Google Chrome
- Mozilla Firefox
- Apple Safari
  - Safari in private mode isn't supported.

### Copy and paste

The keys used for copy and paste vary by operating system and browser. The following list contains
the most common key combinations:

- Windows: <kbd>Ctrl</kbd>+<kbd>c</kbd> to copy and <kbd>CTRL</kbd>+<kbd>Shift</kbd>+<kbd>v</kbd> or
  <kbd>Shift</kbd>+<kbd>Insert</kbd> to paste.
  - FireFox might not support clipboard permissions properly.
- macOS: <kbd>Cmd</kbd>+<kbd>c</kbd> to copy and <kbd>Cmd</kbd>+<kbd>v</kbd> to paste.
- Linux: <kbd>CTRL</kbd>+<kbd>c</kbd> to copy and <kbd>CTRL</kbd>+<kbd>Shift</kbd>+<kbd>v</kbd> to
  paste.

> [!NOTE]
> If no text is selected when you type <kbd>Ctrl</kbd>+<kbd>C</kbd>, Cloud Shell sends the `Ctrl-c`
> character to the shell. The shell can interpret `Ctrl-c` as a **Break** signal and terminate the
> currently running command.

## Frequently asked questions

### Is there a time limit for Cloud Shell sessions?

Cloud Shell is intended for interactive use cases. Cloud Shell sessions time out after 20 minutes
without interactive activity. As a result, any long-running non-interactive sessions are ended
without warning.

Cloud Shell is a free service for managing your Azure environment. It's not a general purpose
computing platform. Excessive usage might be considered a breach of the Azure Terms of Service,
which result in having your access to Cloud Shell blocked.

### How many concurrent sessions can I have open?

Azure Cloud Shell has a limit of 20 concurrent users per tenant. Opening more than 20 simultaneous
sessions produces a "Tenant User Over Quota" error. If you have a legitimate need to have more than
20 sessions open, such as for training sessions, contact Support to request a quota increase before
your anticipated usage date.

### I created some files in Cloud Shell, but they're gone. What happened?

The machine that provides your Cloud Shell session is temporary and is recycled after your session
is inactive for 20 minutes. Cloud Shell uses an Azure fileshare mounted to the `clouddrive` folder
in your session. The fileshare contains the image file that contains your `$HOME` directory. Only
files that you upload or create in the `clouddrive` folder are persisted across sessions. Any files
created outside your `clouddrive` directory aren't persisted.

Files stored in the `clouddrive` directory are visible in the Azure portal using Storage browser.
However, any files created in the `$HOME` directory are stored in the image file and aren't visible
in the portal.

### I create a file in the Azure: drive, but I don't see it. What happened?

PowerShell users can use the `Azure:` drive to access Azure resources. The `Azure:` drive is created
by a PowerShell provider that structures data as a file system drive. The `Azure:` drive is a
virtual drive that doesn't allow you to create files.

Files that you create a new file using other tools, such as `vim` or `nano` while your current
location is the `Azure:` drive, are saved to your `$HOME` directory.

### I want to install a tool in Cloud Shell that requires `sudo`. Is that possible?

No. Your user account in Cloud Shell is an unprivileged account. You can't use `sudo` or run any
command that requires elevated permissions.

## Troubleshoot errors

### Storage Dialog - Error: 403 RequestDisallowedByPolicy

- **Details**: When creating the Cloud Shell storage account for first-time users, it's
  unsuccessful due to an Azure Policy assignment placed by your admin. The error message includes:

  > The resource action 'Microsoft.Storage/storageAccounts/write' is disallowed by
  > one or more policies.

- **Resolution**: Contact your Azure administrator to remove or update the Azure Policy assignment
  denying storage creation.

### Storage Dialog - Error: 400 DisallowedOperation

- **Details**: You can't create the Cloud Shell storage account when using a Microsoft Entra
  subscription.
- **Resolution**: Microsoft Entra ID subscriptions aren't able to create Azure resources. Use an
  Azure subscription capable of creating storage resources.

### Terminal output - Error: Failed to connect terminal

- **Details**: Cloud Shell requires the ability to establish a websocket connection to Cloud Shell
  infrastructure.
- **Resolution**: Confirm that your network allows sending HTTPS and websocket requests to the
  following domains:
  - `*.console.azure.com`
  - `*.servicebus.windows.net`

## Managing Cloud Shell

### Manage personal data

Microsoft Azure takes your personal data seriously. The Azure Cloud Shell service stores information
about your Cloud Shell storage and your terminal preferences. You can view this information using
one of the following examples.

- Run the following commands from the bash command prompt:

  ```bash
  URL="https://management.azure.com/providers/Microsoft.Portal/usersettings/cloudconsole?api-version=2017-12-01-preview"
  az rest --method get --url $URL
  ```

- Run the following commands from the PowerShell command prompt:

  ```powershell
  $invokeAzRestMethodSplat = @{
      Uri    = 'https://management.azure.com/providers/Microsoft.Portal/usersettings/cloudconsole?api-version=2017-12-01-preview'
      Method = 'GET'
  }
  $userdata = (Invoke-AzRestMethod @invokeAzRestMethodSplat).Content
  ($userdata | ConvertFrom-Json).properties | Format-List
  ```

You can delete this personal data by resetting your user settings. Resetting user settings
terminates your current session and unmounts your linked storage account. The Azure fileshare used
by Cloud Shell isn't deleted.

When reconnecting to Cloud Shell, you're prompted to attach a storage account. You can create a new
storage account or reattach the existing storage account that you used previously.

Use the following steps to delete your user settings.

1. Launch Cloud Shell.
1. Select the **Settings** menu (gear icon) from the Cloud Shell toolbar.
1. Select **Reset user settings** from the menu.
1. Select the **Reset** button to confirm the action.

### Block Cloud Shell in a locked down network environment

- **Details**: Administrators might wish to disable access to Cloud Shell for their users. Cloud
  Shell depends on access to the `ux.console.azure.com` domain, which can be denied, stopping any
  access to Cloud Shell's entry points including `portal.azure.com`, `shell.azure.com`, Visual
  Studio Code Azure Account extension, and `learn.microsoft.com`. In the US Government cloud, the
  entry point is `ux.console.azure.us`; there's no corresponding `shell.azure.us`.
- **Resolution**: Restrict access to `ux.console.azure.com` or `ux.console.azure.us` from your
  network. The Cloud Shell icon still exists in the Azure portal, but you can't connect to the
  service.
