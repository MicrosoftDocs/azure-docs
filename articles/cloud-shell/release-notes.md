---
title: Azure Cloud Shell release notes
description: This article lists the new features and changes released in Azure Cloud Shell.
ms.date: 06/27/2025
ms.topic: release-notes
---

# Azure Cloud Shell release notes

The following document outlines the changes to Azure Cloud Shell. The Cloud Shell container image is
updated on a monthly basis. Changes can include new or updated features and tools, security updates,
and bug fixes.

> [!NOTE]
> For a tool to be included in Cloud Shell, it must meet the criteria defined in the
> [Cloud Shell Package inclusion guide][11]. For security compliance, tool packages become
> deprecated when they're no longer actively maintained. There's usually a 30-day notice before a
> package is removed from the image. The package may be removed sooner if there's a security
> vulnerability or other critical issue. As with any other tool, if there's a tool you need, you
> can install them in your Cloud Shell session as long as it doesn't require root access. For
> installation instructions, consult the documentation for the package you require.

## June 2025

Tool changes

- Updated Azure CLI to v2.74.0
- Updated Azure PowerShell to v14.1.0
- Updated .NET to v9.0.3
- Updated Microsoft.PowerShell.PSResourceGet to v1.1.1. This version includes support for MAR as a
  PSRepository.
- Added [Inspektor Gadget][13] and `kubectl-gadget` packages. Inspektor Gadget offers tools for data
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
    [Redis license update: What you need to know][06].

## January 2025

Tool changes

- Updated Azure CLI to [v2.68.0][04]
- Updated Azure PowerShell to [v13.1.0][05]
- Removed guava-android Java library

## December 2024

Tool changes

- The mysql client was replaced with the mariadb client. You can still run `mysql` commands in Cloud
  Shell, but the client is now the mariadb client.
- .NET was upgraded from .NET 7 to .NET 8
- The moby-cli and docker packages were removed since you can't start the daemons in Cloud Shell.

Deprecated Packages

The following packages were removed for compliance with our package inclusion policy.

- [packer][07]
- [sfctl][03]

Published policy for inclusion of new tools

- [Package inclusion guide][11]

## May 2024

New features

- Updated user interface

  Cloud Shell recently updated the user interface for the Cloud Shell terminal window. The new
  toolbar uses text-based menu items rather than icons, making it easier to find the desired action.

  For more information, see
  [How to use the new user interface for Azure Cloud Shell][15].

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

- [Batch-Shipyard][09]
- [blobxfer][10]
- [Yeoman (yo)][14]
- [generator-az-terra module][12]
- [Azure-functions-cli][08]

<!-- link references -->
[01]: ./get-started/ephemeral.md?tabs=powershell
[02]: /azure/azure-functions/functions-core-tools-reference?tabs=v2
[03]: /azure/service-fabric/service-fabric-cli
[04]: /cli/azure/release-notes-azure-cli
[05]: /powershell/azure/release-notes-azureps?view=azps-13.1.0&preserve-view=true
[06]: https://azure.microsoft.com/blog/redis-license-update-what-you-need-to-know/
[07]: https://developer.hashicorp.com/packer/docs/intro
[08]: https://github.com/Azure/azure-functions-core-tools
[09]: https://github.com/Azure/batch-shipyard
[10]: https://github.com/Azure/blobxfer
[11]: https://github.com/Azure/CloudShell/blob/master/docs/package-inclusion-guide.md
[12]: https://github.com/Azure/generator-az-terra-module
[13]: https://yeoman.io/
[14]: new-ui-shell-window.md
<!-- updated link references -->
[01]: ./get-started/ephemeral.md?tabs=powershell
[02]: /azure/azure-functions/functions-core-tools-reference?tabs=v2
[03]: /azure/service-fabric/service-fabric-cli
[04]: /cli/azure/release-notes-azure-cli
[05]: /powershell/azure/release-notes-azureps?view=azps-13.1.0&preserve-view=true
[06]: https://azure.microsoft.com/blog/redis-license-update-what-you-need-to-know/
[07]: https://developer.hashicorp.com/packer/docs/intro
[08]: https://github.com/Azure/azure-functions-core-tools
[09]: https://github.com/Azure/batch-shipyard
[10]: https://github.com/Azure/blobxfer
[11]: https://github.com/Azure/CloudShell/blob/master/docs/package-inclusion-guide.md
[12]: https://github.com/Azure/generator-az-terra-module
[13]: https://inspektor-gadget.io/
[14]: https://yeoman.io/
[15]: new-ui-shell-window.md
