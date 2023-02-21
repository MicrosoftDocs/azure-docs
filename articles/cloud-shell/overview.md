---
author: sdwheeler
description: Overview of the Azure Cloud Shell.
manager: mkluck
ms.author: sewhee
ms.contributor: jahelmic
ms.date: 11/14/2022
ms.service: cloud-shell
ms.tgt_pltfrm: vm-linux
ms.topic: article
ms.workload: infrastructure-services
tags: azure-resource-manager
title: Azure Cloud Shell overview
---
# Overview of Azure Cloud Shell

Azure Cloud Shell is an interactive, authenticated, browser-accessible shell for managing Azure
resources. It provides the flexibility of choosing the shell experience that best suits the way you
work, either Bash or PowerShell.

You can access Cloud Shell in three ways:

- **Direct link**: Open a browser to [https://shell.azure.com][11].

- **Azure portal**: Select the Cloud Shell icon on the [Azure portal][10]:

  ![Icon to launch Cloud Shell from the Azure portal][14]

- **Code samples**: In Microsoft [technical documentation][02] and [training resources][05], select
  the **Try It** button that appears with Azure CLI and Azure PowerShell code snippets:

    ```azurecli-interactive
    az account show
    ```

    ```azurepowershell-interactive
    Get-AzSubscription
    ```

    The **Try It** button opens Cloud Shell directly alongside the documentation using Bash (for
    Azure CLI snippets) or PowerShell (for Azure PowerShell snippets).

    To run the command, use **Copy** in the code snippet, use
    <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> (Windows/Linux) or
    <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> (macOS) to paste the command, and then press
    <kbd>Enter</kbd>.

## Features

### Browser-based shell experience

Cloud Shell enables access to a browser-based command-line experience built with Azure management
tasks in mind. Use Cloud Shell to work untethered from a local machine in a way only the cloud
can provide.

### Choice of preferred shell experience

Users can choose between Bash or PowerShell.

1. Select **Cloud Shell**.

   ![Cloud Shell icon][13]

1. Select **Bash** or **PowerShell**.

   ![Choose either Bash or PowerShell][12]

   After first launch, you can use the shell type drop-down control to switch between Bash and
   PowerShell:

   ![Drop-down control to select Bash or PowerShell][15]

### Authenticated and configured Azure workstation

Cloud Shell is managed by Microsoft so it comes with popular command-line tools and language
support. Cloud Shell also securely authenticates automatically for instant access to your resources
through the Azure CLI or Azure PowerShell cmdlets.

View the full [list of tools installed in Cloud Shell.][07]

### Integrated Cloud Shell editor

Cloud Shell offers an integrated graphical text editor based on the open source Monaco Editor.
Create and edit configuration files by running `code .` for seamless deployment through Azure CLI or
Azure PowerShell.

[Learn more about the Cloud Shell editor][20].

### Multiple access points

Cloud Shell is a flexible tool that can be used from:

- [portal.azure.com][10]
- [shell.azure.com][11]
- [Azure CLI documentation][03]
- [Azure PowerShell documentation][04]
- [Azure mobile app][08]
- [Visual Studio Code Azure Account extension][09]

### Connect your Microsoft Azure Files storage

Cloud Shell machines are temporary, but your files are persisted in two ways: through a disk image,
and through a mounted file share named `clouddrive`. On first launch, Cloud Shell prompts to create
a resource group, storage account, and Azure Files share on your behalf. This is a one-time step and
the resources created are automatically attached for all future sessions. A single file share can be
mapped and is used by both Bash and PowerShell in Cloud Shell.

Read more to learn how to mount a [new or existing storage account][16] or to learn about the
[persistence mechanisms used in Cloud Shell][17].

> [!NOTE]
> Azure storage firewall isn't supported for cloud shell storage accounts.

## Concepts

- Cloud Shell runs on a temporary host provided on a per-session, per-user basis
- Cloud Shell times out after 20 minutes without interactive activity
- Cloud Shell requires an Azure file share to be mounted
- Cloud Shell uses the same Azure file share for both Bash and PowerShell
- Cloud Shell is assigned one machine per user account
- Cloud Shell persists $HOME using a 5-GB image held in your file share
- Permissions are set as a regular Linux user in Bash

Learn more about features in [Bash in Cloud Shell][06] and [PowerShell in Cloud Shell][01].

## Compliance

### Encryption at rest

All Cloud Shell infrastructure is compliant with double encryption at rest by default. No action is
required by users.

## Pricing

The machine hosting Cloud Shell is free, with a pre-requisite of a mounted Azure Files share.
Regular storage costs apply.

## Next steps

- [Bash in Cloud Shell quickstart][19]
- [PowerShell in Cloud Shell quickstart][18]

<!-- link references -->
[01]: ./features.md
[02]: /samples/browse
[03]: /cli/azure
[04]: /powershell/azure
[05]: /training
[06]: features.md
[07]: features.md#pre-installed-tools
[08]: https://azure.microsoft.com/features/azure-portal/mobile-app/
[09]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account
[10]: https://portal.azure.com
[11]: https://shell.azure.com
[12]: media/overview/overview-choices.png
[13]: media/overview/overview-cloudshell-icon.png
[14]: media/overview/portal-launch-icon.png
[15]: media/overview/select-shell-drop-down.png
[16]: persisting-shell-storage.md
[17]: persisting-shell-storage.md#how-cloud-shell-storage-works
[18]: quickstart-powershell.md
[19]: quickstart.md
[20]: using-cloud-shell-editor.md
