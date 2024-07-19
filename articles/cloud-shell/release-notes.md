---
title: Azure Cloud Shell release notes
description: This article lists the new features and changes released in Azure Cloud Shell.
ms.date: 06/25/2024
ms.topic: release-notes
---

# Azure Cloud Shell release notes

The following document outlines the changes to Azure Cloud Shell. The Cloud Shell container image is
updated on a monthly basis to reflect the latest changes. Changes can include new or updated
features and tools, security updates, and bug fixes.

## May 2024

### New features

- Updated user interface

  Cloud Shell recently updated the user interface for the Cloud Shell terminal window. The new
  toolbar uses text-based menu items rather than icons, making it easier to find the desired action.

  For more information, see
  [How to use the new user interface for Azure Cloud Shell](new-ui-shell-window.md).

- Support for ephemeral sessions

  Ephemeral sessions don't require a storage account. You can upload or create new files in your
  Cloud Shell session. Those files are removed shortly after the window is closed or when Cloud
  Shell is restarted.

  For more information, see
  [Get started with Azure Cloud Shell ephemeral sessions](./get-started/ephemeral.md?tabs=powershell).

### Deprecated Packages

The following packages were removed for security compliance. These packages were deprecated by the
package owners or are no longer maintained. If you need to use these tools, you can install them in
your Cloud Shell session. For installation instructions, consult the documentation for the package
you require.

- [Batch-Shipyard](https://github.com/Azure/batch-shipyard)
- [blobxfer](https://github.com/Azure/blobxfer)
- [Yeoman (yo)](https://yeoman.io/)
- [generator-az-terra module](https://github.com/Azure/generator-az-terra-module)
- [Azure-functions-cli](https://github.com/Azure/azure-functions-core-tools)
