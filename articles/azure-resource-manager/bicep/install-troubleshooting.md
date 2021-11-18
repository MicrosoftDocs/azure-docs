---
title: Set up Bicep development and deployment environments
description: How to configure Bicep development and deployment environments
ms.topic: conceptual
ms.date: 10/20/2021
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Troubleshoot Bicep installation

This article describes how to resolve potential errors in your Bicep installation.

## .NET runtime error

When installing the Bicep extension for Visual Studio Code, you may run into the following error messages:

```error
Failed to install .NET runtime v5.0
```

```error
Failed to download .NET 5.0.x ....... Error!
```

To solve the problem, you can manually install .NET from the [.NET website](https://aka.ms/dotnet-core-download), and then configure Visual Studio Code to reuse an existing installation of .NET. with the following settings:

**Windows**

```json
"dotnetAcquisitionExtension.existingDotnetPath": [
  {
    "extensionId": "ms-azuretools.vscode-bicep",
    "path": "C:\\Program Files\\dotnet\\dotnet.exe"
  }
]

```

**macOS**

```json
"dotnetAcquisitionExtension.existingDotnetPath": [
  {
    "extensionId": "ms-azuretools.vscode-bicep",
    "path": "/usr/local/share/dotnet/dotnet"
  }
]
```

See [User and Workspace Settings](https://code.visualstudio.com/docs/getstarted/settings) for configuring Visual Studio Code settings.

## Two versions of Bicep CLI installed

If you manually install the Bicep CLI to more than one location, you may notice unexpected behavior such as the Bicep CLI not updating when you run the [upgrade command](bicep-cli.md#upgrade). Or, you may notice that running `az bicep version` returns one version, but `bicep --version` returns a different version.

To resolve this issue, you can either update both locations, or delete one location and add the other location to your path.

To **keep both installation locations**, use `az bicep upgrade` to update one version. For the other version, use the same method you used earlier to [manually install the Bicep CLI](install.md#install-manually).

To **keep only one installation location**, use the following steps:

1. Open your command prompt (not PowerShell), and run `where bicep`. This command returns the location of the Bicep installation.
1. Delete the installation that was returned in the previous step.
1. Remove the location from your **PATH** environment variable.
1. Add your other installation location to the **PATH** variable. Use the location maintained by Azure CLI. For Windows, the location is `%USERPROFILE%\.Azure\bin`.

## Next steps

For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
