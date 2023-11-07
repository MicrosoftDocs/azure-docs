---
description: Overview of the Azure Cloud Shell.
ms.contributor: jahelmic
ms.date: 03/03/2023
ms.topic: article
tags: azure-resource-manager
title: What is Azure Cloud Shell?
---
# What is Azure Cloud Shell?

Azure Cloud Shell is an interactive, authenticated, browser-accessible terminal for managing Azure
resources. It provides the flexibility of choosing the shell experience that best suits the way you
work, either Bash or PowerShell.

Cloud Shell runs on a temporary host provided on a per-session, per-user basis. Your Cloud Shell
session times out after 20 minutes without interactive activity. Cloud Shell persists your files in
your `$HOME` location using a 5-GB file share.

## Multiple access points

Cloud Shell is a flexible tool that can be used from:

- [portal.azure.com][06]
- [shell.azure.com][07]
- [Azure CLI documentation][01]
- [Azure PowerShell documentation][02]
- [Azure mobile app][04]
- [Visual Studio Code Azure Account extension][05]

## Authenticated and configured Azure workstation

Microsoft manages Cloud Shell so you don't have to. Cloud Shell comes with popular command-line
tools and language support. Cloud Shell automatically securely authenticates for instant access to
your resources through the Azure CLI or Azure PowerShell cmdlets. See the
[list of tools installed][03] in Cloud Shell.

Cloud Shell offers an integrated graphical text editor so you can create and edit files for seamless
deployment through Azure CLI or Azure PowerShell. For more information, see
[Using the Azure Cloud Shell editor][09].

## Security and compliance

- Encryption at rest

  All Cloud Shell infrastructure is compliant with double encryption at rest by default. You don't
  have to configure anything.

- Shell permissions

  Your user account has the permissions of a regular Linux user.

## Pricing

Use of the machine hosting Cloud Shell is free. Cloud Shell requires a storage account to host the
mounted Azure Files share. Regular storage costs apply.

## Next steps

- [Cloud Shell quickstart][08]

<!-- link references -->
[01]: /cli/azure
[02]: /powershell/azure
[03]: features.md#pre-installed-tools
[04]: https://azure.microsoft.com/features/azure-portal/mobile-app/
[05]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account
[06]: https://portal.azure.com
[07]: https://shell.azure.com
[08]: quickstart.md
[09]: using-cloud-shell-editor.md
