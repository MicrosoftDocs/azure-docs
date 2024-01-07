---
author: sdwheeler
description: Overview of limitations of Azure Cloud Shell
manager: mkluck
ms.author: sewhee
ms.contributor: jahelmic
ms.date: 11/14/2022
ms.service: cloud-shell
ms.tgt_pltfrm: vm-linux
ms.topic: article
ms.workload: infrastructure-services
services: azure
tags: azure-resource-manager
title: Azure Cloud Shell limitations
---
# Limitations of Azure Cloud Shell

Azure Cloud Shell has the following known limitations:

## General limitations

### System state and persistence
<!--
TODO:
- verify the regions
-->
The machine that provides your Cloud Shell session is temporary, and it's recycled after your
session is inactive for 20 minutes. Cloud Shell requires an Azure file share to be mounted. As a
result, your subscription must be able to set up storage resources to access Cloud Shell. Other
considerations include:

- With mounted storage, only modifications within the `$HOME` directory are persisted.
- Azure file shares can be mounted only from within your [assigned region][02].
  - In Bash, run `env` to find your region set as `ACC_LOCATION`.

### Browser support
<!--
TODO:
- Do we still support Microsoft Internet Explorer?
-->
Cloud Shell supports the latest versions of Microsoft Edge, Microsoft Internet Explorer, Google
Chrome, Mozilla Firefox, and Apple Safari. Safari in private mode isn't supported.

### Copy and paste

- Windows: <kbd>Ctrl</kbd>-<kbd>C</kbd> to copy is supported but use
  <kbd>Shift</kbd>-<kbd>Insert</kbd> to paste.
  - FireFox/IE may not support clipboard permissions properly.
- macOS: <kbd>Cmd</kbd>-<kbd>C</kbd> to copy and <kbd>Cmd</kbd>-<kbd>V</kbd> to paste.

### Only one shell can be active for a given user

Users can only launch one Cloud Shell session at a time. However, you may have multiple instances of
Bash or PowerShell running within that session. Switching between Bash or PowerShell using the menu
restarts the Cloud Shell session and terminate the existing session. To avoid losing your current
session, you can run `bash` inside PowerShell and you can run `pwsh` inside of Bash.

### Usage limits

Cloud Shell is intended for interactive use cases. As a result, any long-running non-interactive
sessions are ended without warning.

## Bash limitations

### User permissions

Permissions are set as regular users without sudo access. Any installation outside your `$Home`
directory isn't persisted.

## PowerShell limitations
<!--
TODO:
- outdated info about AzureAD and SQL
- Not running on Windows so the GUI comment not valid
-->
### `AzureAD` module name

The `AzureAD` module name is currently `AzureAD.Standard.Preview`, the module provides the same
functionality.

### `SqlServer` module functionality

The `SqlServer` module included in Cloud Shell has only prerelease support for PowerShell Core. In
particular, `Invoke-SqlCmd` isn't available yet.

### Default file location when created from Azure drive

You can't create files under the `Azure:` drive. When users create new files using other tools, such
as vim or nano, the files are saved to the `$HOME` by default.

### GUI applications aren't supported

If the user runs a command that would create a dialog box, one sees an error message such
as:

> Unable to load DLL 'IEFRAME.dll': The specified module couldn't be found.


### Large Gap after displaying progress bar

When the user performs an action that displays a progress bar, such as a tab completing while in the
`Azure:` drive, it's possible that the cursor isn't set properly and a gap appears where the
progress bar was previously.

## Next steps

- [Troubleshooting Cloud Shell][05]
- [Quickstart for Bash][04]
- [Quickstart for PowerShell][03]

<!-- link references -->
[02]: persisting-shell-storage.md#mount-a-new-clouddrive
[03]: quickstart-powershell.md
[04]: quickstart.md
[05]: troubleshooting.md
