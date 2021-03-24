---
title: Setup Bicep development and deployment environments
description: How to configure Bicep development and deployment environments
ms.topic: conceptual
ms.date: 03/17/2021
---

# Setup Bicep development and deployment environment

Learn how to setup Bicep development and deployment environments.

## Development environment

To get the best Bicep authoring experience, you need two components:

- **Bicep extension for Visual Studio Code**. To create Bicep files, you need a good Bicep editor. We recommend [Visual Studio Code](https://code.visualstudio.com/) with the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). These tools provide language support and resource autocompletion. They help create and validate Bicep files. For more information about using Visual Studio Code and the Bicep extension, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
- **Bicep CLI**. Use Bicep CLI to compile Bicep files to ARM JSON templates, and decompile ARM JSON templates to Bicep files. For more information, see [Install Bicep CLI](#install-bicep-cli).

## Deployment environment

You can deploy Bicep files by using Azure CLI or Azure PowerShell. For Azure CLI, you need version 2.20.0 or later; for Azure PowerShell, you need version 5.6.0 or later. For the installation instructions, see:

- [Install Azure PowerShell](/powershell/azure/install-az-ps)
- [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows)
- [Install Azure CLI on Linux](/cli/azure/install-azure-cli-linux)
- [Install Azure CLI on macOS](/cli/azure/install-azure-cli-macos)

> [!NOTE]
> Currently, both Azure CLI and Azure PowerShell can only deploy local Bicep files. For more information about deploying Bicep files by using Azure CLI, see [Deploy - CLI](/azure/azure-resource-manager/templates/deploy-cli#deploy-remote-template). For more information about deploying Bicep files by using Azure PowerShell, see [Deploy - PowerShell](/azure/azure-resource-manager/templates/deploy-powershell#deploy-remote-template).

After the supported version of Azure PowerShell or Azure CLI is installed, you can deploy a Bicep file with:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name ExampleDeployment `
  -ResourceGroupName ExampleGroup `
  -TemplateFile <path-to-template-or-bicep> `
  -storageAccountType Standard_GRS
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file <path-to-template-or-bicep> \
  --parameters storageAccountType=Standard_GRS
```

---

## Install Bicep CLI

You can install Bicep CLI by using Azure CLI, by using Azure PowerShell or manually.

### Use Azure CLI

With Az CLI version 2.20.0 or later installed, the Bicep CLI is automatically installed when a command that depends on it is executed. For example, `az deployment ... -f *.bicep` or `az bicep ...`.

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
> Az CLI installs a separate version of the Bicep CLI that is not in conflict with any other Bicep installs you may have, and Az CLI does not add Bicep to your PATH.

To show the installed versions:

```bash
az bicep version
```

To list all available versions of Bicep CLI:

```bash
az bicep list-versions
```

### Use Azure PowerShell

Azure PowerShell does not have the capability to install the Bicep CLI yet. Azure PowerShell (v5.6.0 or later) expects that the Bicep CLI is already installed and available on the PATH. Follow one of the [manual install methods](#install-manually). Once the Bicep CLI is installed, Bicep CLI is called whenever it is required for a deployment cmdlet. For example, `New-AzResourceGroupDeployment ... -TemplateFile main.bicep`.

### Install manually

The following methods install the Bicep CLI and add it to your PATH.

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

##### Windows Installer

Download and run the [latest Windows installer](https://github.com/Azure/bicep/releases/latest/download/bicep-setup-win-x64.exe). The installer does not require administrative privileges. After the installation, Bicep CLI is added to your user PATH. Close and reopen any opened command shell windows for the PATH change to take effect.

##### Chocolatey

```powershell
choco install bicep
```

##### Winget

```powershell
winget install -e --id Microsoft.Bicep
```

##### Manual with PowerShell

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

## Install the nightly builds

If you'd like to try the latest pre-release bits of Bicep before they are released, see [Install nightly builds](https://github.com/Azure/bicep/blob/main/docs/installing-nightly.md).

> [!WARNING]
> These pre-release builds are much more likely to have known or unknown bugs.

## Next steps

Get started with the [Bicep quickstart](./quickstart-create-bicep-use-visual-studio-code.md).
