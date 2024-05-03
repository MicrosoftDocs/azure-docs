---
title: Troubleshoot problems with Bicep installation
description: How to resolve errors and problems with your Bicep installation.
ms.topic: conceptual
ms.custom: devx-track-bicep, devx-track-dotnet
ms.date: 03/20/2024
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

> [!WARNING]
> This is a last resort solution that may cause problems when updating versions.

To solve the problem, you can manually install .NET from the [.NET website](https://aka.ms/dotnet-core-download), and then configure Visual Studio Code to reuse an existing installation of .NET with the following settings:

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

If you need an **x64** installation, use:

```json
"dotnetAcquisitionExtension.existingDotnetPath": [
  {
    "extensionId": "ms-azuretools.vscode-bicep",
    "path": "/usr/local/share/dotnet/x64/dotnet"
  }
]
```

For other **macOS** installations, use:

```json
"dotnetAcquisitionExtension.existingDotnetPath": [
  {
    "extensionId": "ms-azuretools.vscode-bicep",
    "path": "/usr/local/share/dotnet/dotnet"
  }
]
```

See [User and Workspace Settings](https://code.visualstudio.com/docs/getstarted/settings) for configuring Visual Studio Code settings.

## Visual Studio Code error

If you see the following error message popup in Visual Studio Code:

```error
The Bicep server crashed 5 times in the last 3 minutes. The server will not be restarted.
```

From VS Code, open the **Output** view in the pane at the bottom of the screen, and then select **Bicep**:

  :::image type="content" source="./media/installation-troubleshoot/visual-studio-code-output-pane-bicep.png" alt-text="Visual Studio Code output pane":::

If you see the following output in the pane, and you're using Bicep CLI **version 0.4.1124** or later, check whether you have added the `dotnetAcquisitionExtension.existingDotnetPath` configuration option to VS Code. See [.NET runtime error](#net-runtime-error). If this configuration option is present, remove it and restart VS Code.

  ```error
  It was not possible to find any compatible framework version.
  ```

Otherwise, raise an issue in the [Bicep repo](https://github.com/Azure/bicep/issues), and include the output messages.

## Multiple versions of Bicep CLI installed

If you manually install the Bicep CLI to more than one location, you may notice unexpected behavior such as the Bicep CLI not updating when you run the [upgrade command](bicep-cli.md#upgrade). Or, you may notice that running `az bicep version` returns one version, but `bicep --version` returns a different version.

To resolve this issue, you can either update all locations, or select one location to maintain and delete the other locations.

First, open your command prompt (not PowerShell), and run `where bicep`. This command returns the locations of your Bicep installations. If you're using the instance of Bicep CLI that is managed by Azure CLI, you won't see this installation because it's not added to the PATH. If `where bicep` returns only one location, it may be that the conflicting versions you're seeing is between the manual installation and the Azure CLI installation.

To **keep all installation locations**, use the same method you used earlier to [manually install the Bicep CLI](install.md#install-manually) for all locations you want to maintain. If you're using Azure CLI, run `az bicep upgrade` to update that version.

To **keep only one installation location**, use the following steps:

1. Delete the files for the installations you don't want to keep.
1. Remove those locations from your **PATH** environment variable.

If you have both a **manual installation and the instance managed by Azure CLI**, you can combine your usage to one instance.

1. Delete the manual installation location.
1. Add the location of the Bicep CLI installed by Azure CLI to the **PATH** variable. For Windows, the location maintained by Azure CLI is `%USERPROFILE%\.Azure\bin`.

After adding the Azure CLI instance to the PATH, you can use that version with either `az bicep` or `bicep`.

## Next steps

For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
