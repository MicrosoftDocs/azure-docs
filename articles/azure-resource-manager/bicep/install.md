---
title: Set up Bicep development and deployment environments
description: How to configure Bicep development and deployment environments
ms.topic: conceptual
ms.date: 08/08/2022
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Install Bicep tools

Let's make sure your environment is set up for working with Bicep files. To author and deploy Bicep files, we recommend any of the following options:

| Tasks | Options | Bicep CLI installation |
| ------ | ------- | ----------- |
| Author | [VS Code and Bicep extension](#vs-code-and-bicep-extension) | automatic |
| Deploy | [Azure CLI](#azure-cli) | automatic |
|  | [Azure PowerShell](#azure-powershell) | [manual](#install-manually) |
|  | [VS Code and Bicep extension](#vs-code-and-bicep-extension) | automatic |
|  | [Air-gapped cloud](#install-on-air-gapped-cloud) | download |

## VS Code and Bicep extension

To create Bicep files, you need a good Bicep editor. We recommend:

- **Visual Studio Code** - If you don't already have Visual Studio Code, [install it](https://code.visualstudio.com/).
- **Bicep extension for Visual Studio Code**.  Visual Studio Code with the Bicep extension provides language support and resource autocompletion. The extension helps you create and validate Bicep files.

  To install the extension, search for *bicep* in the **Extensions** tab or in the [Visual Studio marketplace](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).

  Select **Install**.

  :::image type="content" source="./media/install/install-extension.png" alt-text="Install Bicep extension":::

To verify you've installed the extension, open any file with the `.bicep` file extension. You should see the language mode in the lower right corner change to **Bicep**.

:::image type="content" source="./media/install/language-mode.png" alt-text="Bicep language mode":::

If you get an error during installation, see [Troubleshoot Bicep installation](installation-troubleshoot.md).

You can deploy your Bicep files directly from the VS Code editor. For more information, see [Deploy Bicep files from Visual Studio Code](deploy-vscode.md).

## Azure CLI

When you use Azure CLI with Bicep, you have everything you need to [deploy](deploy-cli.md) and [decompile](decompile.md) Bicep files. Azure CLI automatically installs the Bicep CLI when a command is executed that needs it.

You must have Azure CLI version **2.20.0 or later** installed. To install or update Azure CLI, see:

- [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows)
- [Install Azure CLI on Linux](/cli/azure/install-azure-cli-linux)
- [Install Azure CLI on macOS](/cli/azure/install-azure-cli-macos)

To verify your current version, run:

```azurecli
az --version
```

To validate your Bicep CLI installation, use:

```azurecli
az bicep version
```

To upgrade to the latest version, use:

```azurecli
az bicep upgrade
```

For more commands, see [Bicep CLI](bicep-cli.md).

> [!IMPORTANT]
> Azure CLI installs a self-contained instance of the Bicep CLI. This instance doesn't conflict with any versions you may have manually installed. Azure CLI doesn't add Bicep CLI to your PATH.

You're done with setting up your Bicep environment. The rest of this article describes installation steps that you don't need when using Azure CLI.

## Azure PowerShell

You must have Azure PowerShell version **5.6.0 or later** installed. To update or install, see [Install Azure PowerShell](/powershell/azure/install-az-ps).

Azure PowerShell doesn't automatically install the Bicep CLI. Instead, you must [manually install the Bicep CLI](#install-manually).

> [!IMPORTANT]
> The self-contained instance of the Bicep CLI installed by Azure CLI isn't available to PowerShell commands. Azure PowerShell deployments fail if you haven't manually installed the Bicep CLI.

When you manually install the Bicep CLI, run the Bicep commands with the `bicep` syntax, instead of the `az bicep` syntax for Azure CLI.

To check your Bicep CLI version, run:

```cmd
bicep --version
```

## Install manually

The following methods install the Bicep CLI and add it to your PATH. You must manually install for any use other than Azure CLI.

When installing manually, select a location that is different than the one managed by Azure CLI. All of the following examples use a location named **bicep** or **.bicep**. This location won't conflict with the location managed by Azure CLI, which uses **.azure**.

- [Linux](#linux)
- [macOS](#macos)
- [Windows](#windows)

### Linux

```sh
# Fetch the latest Bicep CLI binary
curl -Lo bicep https://github.com/Azure/bicep/releases/latest/download/bicep-linux-x64
# Mark it as executable
chmod +x ./bicep
# Add bicep to your PATH (requires admin)
sudo mv ./bicep /usr/local/bin/bicep
# Verify you can now access the 'bicep' command
bicep --help
# Done!
```

> [!NOTE]
> For lightweight Linux distributions like [Alpine](https://alpinelinux.org/), use **bicep-linux-musl-x64** instead of **bicep-linux-x64** in the preceding script.

### macOS

#### Via homebrew

```sh
# Add the tap for bicep
brew tap azure/bicep

# Install the tool
brew install bicep
```

#### Via BASH

```sh
# Fetch the latest Bicep CLI binary
curl -Lo bicep https://github.com/Azure/bicep/releases/latest/download/bicep-osx-x64
# Mark it as executable
chmod +x ./bicep
# Add Gatekeeper exception (requires admin)
sudo spctl --add ./bicep
# Add bicep to your PATH (requires admin)
sudo mv ./bicep /usr/local/bin/bicep
# Verify you can now access the 'bicep' command
bicep --help
# Done!

```

### Windows

#### Windows Installer

Download and run the [latest Windows installer](https://github.com/Azure/bicep/releases/latest/download/bicep-setup-win-x64.exe). The installer doesn't require administrative privileges. After the installation, Bicep CLI is added to your user PATH. Close and reopen any open command shell windows for the PATH change to take effect.

#### Chocolatey

```powershell
choco install bicep
```

#### Winget

```powershell
winget install -e --id Microsoft.Bicep
```

#### Manual with PowerShell

```powershell
# Create the install folder
$installPath = "$env:USERPROFILE\.bicep"
$installDir = New-Item -ItemType Directory -Path $installPath -Force
$installDir.Attributes += 'Hidden'
# Fetch the latest Bicep CLI binary
(New-Object Net.WebClient).DownloadFile("https://github.com/Azure/bicep/releases/latest/download/bicep-win-x64.exe", "$installPath\bicep.exe")
# Add bicep to your PATH
$currentPath = (Get-Item -path "HKCU:\Environment" ).GetValue('Path', '', 'DoNotExpandEnvironmentNames')
if (-not $currentPath.Contains("%USERPROFILE%\.bicep")) { setx PATH ($currentPath + ";%USERPROFILE%\.bicep") }
if (-not $env:path.Contains($installPath)) { $env:path += ";$installPath" }
# Verify you can now access the 'bicep' command.
bicep --help
# Done!
```

## Install on air-gapped cloud

The `bicep install` and `bicep upgrade` commands don't work in an air-gapped environment. To install Bicep CLI in an air-gapped environment, you need to download the Bicep CLI executable manually and save it to **.azure/bin**. This location is where the instance managed by Azure CLI is installed.

- **Linux**

    1. Download **bicep-linux-x64** from the [Bicep release page](https://github.com/Azure/bicep/releases/latest/) in a non-air-gapped environment.
    1. Copy the executable to the **$HOME/.azure/bin** directory on an air-gapped machine. Rename file to **bicep**.

- **macOS**

    1. Download **bicep-osx-x64** from the [Bicep release page](https://github.com/Azure/bicep/releases/latest/) in a non-air-gapped environment.
    1. Copy the executable to the **$HOME/.azure/bin** directory on an air-gapped machine. Rename file to **bicep**.

- **Windows**

    1. Download **bicep-win-x64.exe** from the [Bicep release page](https://github.com/Azure/bicep/releases/latest/) in a non-air-gapped environment.
    1. Copy the executable to the **%UserProfile%/.azure/bin** directory on an air-gapped machine. Rename file to **bicep.exe**.

## Install the nightly builds

If you'd like to try the latest pre-release bits of Bicep before they're released, see [Install nightly builds](https://github.com/Azure/bicep/blob/main/docs/installing-nightly.md).

> [!WARNING]
> These pre-release builds are much more likely to have known or unknown bugs.

## Next steps

For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).

If you have problems with your Bicep installation, see [Troubleshoot Bicep installation](installation-troubleshoot.md).

To deploy Bicep files from an Azure Pipeline, see [Integrate Bicep with Azure Pipelines](add-template-to-azure-pipelines.md). To deploy Bicep files through GitHub Actions, see [Deploy Bicep files by using GitHub Actions](deploy-github-actions.md).
