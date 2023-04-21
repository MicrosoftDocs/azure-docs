---
description: Overview of limitations of Azure Cloud Shell
ms.contributor: jahelmic
ms.date: 03/03/2023
ms.topic: article
tags: azure-resource-manager
title: Azure Cloud Shell limitations
---
# Limitations of Azure Cloud Shell

Azure Cloud Shell has the following known limitations:

## General limitations

### System state and persistence

The machine that provides your Cloud Shell session is temporary, and it's recycled after your
session is inactive for 20 minutes. Cloud Shell requires an Azure file share to be mounted. As a
result, your subscription must be able to set up storage resources to access Cloud Shell. Other
considerations include:

- With mounted storage, only modifications within the `$HOME` directory are persisted.
- Azure file shares can be mounted only from within your [assigned region][01].
  - In Bash, run `env` to find your region set as `ACC_LOCATION`.

### Browser support

Cloud Shell supports the latest versions of Microsoft Edge, Google Chrome, Mozilla Firefox, and
Apple Safari. Safari in private mode isn't supported.

### Copy and paste

- Windows: <kbd>Ctrl</kbd>+<kbd>c</kbd> to copy is supported but use
  <kbd>Shift</kbd>+<kbd>Insert</kbd> to paste.
  - FireFox may not support clipboard permissions properly.
- macOS: <kbd>Cmd</kbd>+<kbd>c</kbd> to copy and <kbd>Cmd</kbd>+<kbd>v</kbd> to paste.

### Only one shell can be active for a given user

Users can only launch one Cloud Shell session at a time. However, you may have multiple instances of
Bash or PowerShell running within that session. Switching between Bash or PowerShell using the menu
terminates the existing session and starts a new Cloud Shell instance. To avoid losing your current
session, you can run `bash` inside PowerShell and you can run `pwsh` inside of Bash.

### Usage limits

Cloud Shell is intended for interactive use cases. As a result, any long-running non-interactive
sessions are ended without warning.

## Bash limitations

### User permissions

Permissions are set as regular users without sudo access. Any installation outside your `$Home`
directory isn't persisted.

## PowerShell limitations

### `AzureAD` module name

The `AzureAD` module name is currently `AzureAD.Standard.Preview`, the module provides the same
functionality.

### Default file location when created from Azure drive

You can't create files under the `Azure:` drive. When users create new files using other tools, such
as `vim` or `nano`, the files are saved to the `$HOME` by default.

### Large Gap after displaying progress bar

When the user performs an action that displays a progress bar, such as a tab completing while in the
`Azure:` drive, it's possible that the cursor isn't set properly and a gap appears where the
progress bar was previously.

## Next steps

- [Troubleshooting Cloud Shell][04]
- [Quickstart for Bash][03]
- [Quickstart for PowerShell][02]

<!-- link references -->
[01]: persisting-shell-storage.md#mount-a-new-clouddrive
[02]: quickstart-powershell.md
[03]: quickstart.md
[04]: troubleshooting.md
