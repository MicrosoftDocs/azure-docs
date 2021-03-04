---
title: Setup Bicep development and deployment environments
description: How to configure Bicep development and deployment environments
ms.topic: conceptual
ms.date: 03/04/2021
---

# Setup Bicep development and deployment environment

Learn how to setup Bicep development and deployment environments.

## Deployment environment

You can deploy Bicep files by using Azure CLI or Azure PowerShell. For Azure CLI, you need version 2.20.0 or later; for Azure PowerShell, you need version 5.6.0 or later. For the installation instructions, see:

- [Install Azure PowerShell](/powershell/azure/install-az-ps)
- [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows)
- [Install Azure CLI on Linux](/cli/azure/install-azure-cli-linux)
- [Install Azure CLI on macOS](/cli/azure/install-azure-cli-macos)

> [!NOTE]
> Currently, both Azure CLI and Azure PowerShell can only deploy local Bicep files. For more information, see [Deploy - CLI](/deploy-cli.md#deploy-remote-template) and [Deploy - PowerShell](/deploy-powershell.md#deploy-remote-template).

## Development environment

To get the best Bicep authoring experience, you need two components:

- **Bicep extension for Visual Studio Code**. To create Bicep files, you need a good Bicep editor. We recommend [Visual Studio Code](https://code.visualstudio.com/) with the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). These tools provides language support and resource autocompletion. They help create and validate Bicep files. For more information, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code).
- **Bicep CLI**. Use Bicep CLI to compile Bicep files to ARM JSON templates, and decompile ARM JSON templates to Bicep files.

### Install Bicep CLI by using Azure CLI

If you already have the latest version of Az CLI installed (v2.20.0 or later), the Bicep CLI is automatically installed when a command that depends on it is executed (`az deployment ... -f *.bicep` or `az bicep ...`).

You can also manually install the CLI using the built-in commands:

```bash
az bicep install
```

To upgrade to the latest version:

```bash
az bicep upgrade
```

To install a specific version:

```bash
az bicep install --version v0.2.212
```

> [!NOTE]
> Az CLI installs a separate version of the Bicep CLI that is not conflict with any other Bicep installs you may have,  and Az CLI does not add Bicep to your PATH.

To show the installed versions:

```bash
az bicep version
```

To list all available versions of Bicep CLI:

```bash
az bicep list-versions
```

### Install Bicep CLI by using Azure PowerShell

The Azure PowerShell module does not yet have the capability to install the Bicep CLI. Azure PowerShell (v5.6.0 or later) expects that the Bicep CLI is already installed and available on the PATH. Follow one of the [manual install methods](#manually-install). Once the Bicep CLI is installed, Bicep CLI is called whenever it is required for a deployment cmdlet. For example, `New-AzResourceGroupDeployment ... -TemplateFile main.bicep`.

### Manually install Bicep CLI

All of the following methods install the Bicep CLI and add it to your PATH.

#### Linux

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

#### macOS

##### via homebrew

```sh
# Add the tap for bicep
brew tap azure/bicep https://github.com/azure/bicep

# Install the tool
brew install azure/bicep/bicep
```

##### macOS manual install

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

#### Windows

#### Windows Installer

Download and run the [latest Windows installer](https://github.com/Azure/bicep/releases/latest/download/bicep-setup-win-x64.exe). The installer does not require administrative privileges. After the installation, Bicep CLI is added to your user PATH. If you have any command shell windows open (`cmd`, `PowerShell`, or similar), close and reopen them for the PATH change to take effect.

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

#### Install the nightly builds of bicep (experimental)

If you'd like to try the latest pre-release bits of Bicep before they are released, you can [follow instructions for installing the nightly builds](./installing-nightly.md).

> [!WARNING]
> These builds are much more likely to have known or unknown bugs.

## Next steps

Get started with the [Bicep quickstart](./bicep-tutorial-create-first-bicep.md).
