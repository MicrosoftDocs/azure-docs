---
title: Install the Microsoft Dev Box Preview Azure CLI extension
titleSuffix: Microsoft Dev Box Preview
description: Learn how to install the Azure CLI and the Microsoft Dev Box Preview CLI extension so you can create Dev Box resources from the command line.
services: dev-box
ms.service: dev-box
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 10/12/2022
Customer intent: As a dev infra admin, I want to install the Dev Box CLI extension so that I can create Dev Box resources from the command line.
---

# Microsoft Dev Box Preview CLI

In addition to the Azure admin portal and the Dev Box user portal, you can use Dev Box's Azure CLI Extension to create resources.

## Install the Dev Box CLI extension 

1. Download and install the [Azure CLI](/cli/azure/install-azure-cli).

1. Install the Dev Box Azure CLI extension:
    #### [Install by using a PowerShell script](#tab/Option1/)
 
    Using <https://aka.ms/DevCenter/Install-DevCenterCli.ps1> uninstalls any existing Dev Box CLI extension and installs the latest version.

    ```azurepowershell
    write-host "Setting Up DevCenter CLI"
    
    # Get latest version
    $indexResponse = Invoke-WebRequest -Method Get -Uri "https://fidalgosetup.blob.core.windows.net/cli-extensions/index.json" -UseBasicParsing
    $index = $indexResponse.Content | ConvertFrom-Json
    $versions = $index.extensions.devcenter
    $latestVersion = $versions[0]
    if ($latestVersion -eq $null) {
        throw "Could not find a valid version of the CLI."
    }
    
    # remove existing
    write-host "Attempting to remove existing CLI version (if any)"
    az extension remove -n devcenter
    
    # Install new version
    $downloadUrl = $latestVersion.downloadUrl
    write-host "Installing from url " $downloadUrl
    az extension add --source=$downloadUrl -y
    ```

    To execute the script directly in PowerShell:

   ```azurecli
   iex "& { $(irm https://aka.ms/DevCenter/Install-DevCenterCli.ps1 ) }"
   ```

    The final line of the script enables you to specify the location of the source file to download. If you want to access the file from a different location, update 'source' in the script to point to the downloaded file in the new location.

    #### [Install manually](#tab/Option2/)
  
   Remove existing extension if one exists:
    
    ```azurecli
    az extension remove --name devcenter
    ```

    Manually run this command in the CLI:

    ```azurecli
    az extension add --source https://fidalgosetup.blob.core.windows.net/cli-extensions/devcenter-0.1.0-py3-none-any.whl
    ```
    ---
1. Verify that the Dev Box CLI extension installed successfully by using the following command:

    ```azurecli
    az extension list 
    ```

   You will see the devcenter extension listed:
   :::image type="content" source="media/how-to-install-dev-box-cli/dev-box-cli-installed.png" alt-text="Screenshot showing the dev box extension listed.":::

## Configure your Dev Box CLI

1. Log in to Azure CLI with your work account.

    ```azurecli
    az login
    ```

1. Set your default subscription to the sub where you'll be creating your specific Dev Box resources

    ```azurecli
    az account set --subscription {subscriptionId}
    ```

1. Set default resource group (which means no need to pass into each command)

    ```azurecli
    az configure --defaults group={resourceGroupName}
    ```

1. Get Help for a command

    ```azurecli
    az devcenter admin --help
    ```

## Next steps

Discover the Dev Box commands you can use at:

- [Microsoft Dev Box Preview Azure CLI reference](./cli-reference-subset.md)