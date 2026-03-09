---
title: Azure Cloud Shell release notes
description: This article lists the new features and changes released in Azure Cloud Shell.
ms.date: 02/05/2026
ms.topic: release-notes
---

# Azure Cloud Shell release notes

The following article outlines the changes to Azure Cloud Shell. Changes can include new or updated
features and tools, security updates, and bug fixes.

Cloud Shell regularly updates Azure CLI and Azure PowerShell, including breaking change releases.
For more information about upcoming breaking changes, see the following articles:

- [Upcoming breaking changes in Azure PowerShell][10]
- [Azure CLI upcoming breaking changes][07]

For a tool to be included in Cloud Shell, it must meet certain criteria. For security compliance,
tool packages become deprecated when they're no longer actively maintained. There's usually a 30-day
notice before a package is removed from the image. We can remove a package sooner if there's a
security vulnerability or other critical issue. For more information about the package inclusion
criteria, see [Cloud Shell Package inclusion guide][16].

You can install any tool you need in your Cloud Shell session as long as it doesn't require root
access. For installation instructions, consult the documentation for the package you require.

## February 2026

Tool updates

- Az CLI v2.82.0. This release includes breaking changes. For more information, see
  [Release notes & updates - Azure CLI][05].
- Azure PowerShell v15.2.0. This release includes breaking changes. For more information, see
  [Azure PowerShell release notes][09].

New supported token audience

- The `https://appservice.azure.com/` audience was added as a supported token audience in Cloud
  Shell for the public cloud. For other token audiences or clouds, see the troubleshooting section
  in the [Azure Cloud Shell Frequently Asked Questions (FAQ)][06].

## November 2025

User experience improvements

- You can now use <kbd>Ctrl</kbd>+<kbd>V</kbd> to paste on Windows and Linux. Previously, you had to
  use <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> to paste.
- You can now drag and drop files in the new UI. Previously, this feature was only available in the
  old UI. You can use this feature to upload individual files, but not folders.

Tool updates

- Az CLI v2.79.0
- PostgreSQL v16.10
- Azure PowerShell v14.6.0

## June 2025

Tool updates

- Updated Azure CLI to v2.74.0
- Updated Azure PowerShell to v14.1.0
- Updated .NET to v9.0.3
- Updated Microsoft.PowerShell.PSResourceGet to v1.1.1. This version includes support for MAR as a
  PSRepository.
- Added [Inspektor Gadget][14] and `kubectl-gadget` packages. Inspektor Gadget offers tools for data
  collection and system inspection on Kubernetes clusters and Linux hosts using eBPF.
- `msodbcsql18` and `mssql-tools18` were readded to the image.

## April 2025

The base image for Azure Cloud Shell was updated to use the latest version of **Azure Linux
3.0**. With this release, the following changes were made:

- Upgraded versions of many packages including Python 3.12.9, PostgreSQL 16.7, and Node.js v20.14.0
- [Azure Functions Core Tools][02] was readded to the image.
- The following packages were removed:
  - `msodbcsql18` and `mssql-tools18`
  - `Apparmor` is primarily used in Ubuntu and not in Azure Linux.
  - `redis` was removed due to changes in licensing. For more information, see
    [Redis license update: What you need to know][11].

## January 2025

Tool updates

- Updated Azure CLI to [v2.68.0][04]
- Updated Azure PowerShell to [v13.1.0][08]
- Removed guava-android Java library

## December 2024

Tool updates

- The mysql client was replaced with the mariadb client. You can still run `mysql` commands in Cloud
  Shell, but the client is now the mariadb client.
- .NET was upgraded from .NET 7 to .NET 8
- The moby-cli and docker packages were removed since you can't start the daemons in Cloud Shell.

Deprecated Packages

The following packages were removed for compliance with our package inclusion policy.

- [packer][12]
- [sfctl][03]

Published policy for inclusion of new tools

- [Package inclusion guide][16]

## May 2024

New features

- Updated user interface

  Cloud Shell recently updated the user interface for the Cloud Shell terminal window. The new
  toolbar uses text-based menu items rather than icons, making it easier to find the desired action.

  For more information, see
  [How to use the new user interface for Azure Cloud Shell][16].

- Support for ephemeral sessions

  Ephemeral sessions don't require a storage account. You can upload or create new files in your
  Cloud Shell session. Those files are removed shortly after the window is closed or when Cloud
  Shell is restarted.

  For more information, see
  [Get started with Azure Cloud Shell ephemeral sessions][01].

Deprecated Packages

The following packages were removed for security compliance. The maintainers deprecated these
packages or are no longer maintained. If you need to use these tools, you can install them in your
Cloud Shell session. For installation instructions, consult the documentation for the package you
require.

- [Batch-Shipyard][14]
- [blobxfer][15]
- [Yeoman (yo)][15]
- [generator-az-terra module][13]
- [Azure-functions-cli][13]

<!-- link references -->
[01]: ./get-started/ephemeral.md?tabs=powershell
[02]: /azure/azure-functions/functions-core-tools-reference?tabs=v2
[03]: /azure/service-fabric/service-fabric-cli
[04]: /cli/azure/release-notes-azure-cli
[05]: /powershell/azure/release-notes-azureps?view=azps-13.1.0&preserve-view=true
[06]: faq-troubleshooting.md#terminal-output---audience-service-audience-url-is-not-a-supported-msi-token-audience
[07]: https://azure.microsoft.com/blog/redis-license-update-what-you-need-to-know/
[08]: https://developer.hashicorp.com/packer/docs/intro
[09]: https://github.com/Azure/azure-functions-core-tools
[10]: https://github.com/Azure/batch-shipyard
[11]: https://github.com/Azure/blobxfer
[12]: https://github.com/Azure/CloudShell/blob/master/docs/package-inclusion-guide.md
[13]: https://github.com/Azure/generator-az-terra-module
[14]: https://inspektor-gadget.io/
[15]: https://yeoman.io/
[16]: new-ui-shell-window.md
