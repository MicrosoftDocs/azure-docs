---
ms.topic: include
ms.date: 09/10/2020
author: dbradish-microsoft
ms.author: dbradish
manager: barbkess
---

## Prepare your environment

1. Do a [local install](/cli/azure/install-azure-cli) of the Azure CLI, or start [Azure Cloud Shell](/cli/azure/start-azure-cloud-shell).
1. Sign in using the [az login](/cli/azure/reference-index#az-login) command if you're using a local install.  Follow the steps displayed in your terminal to complete the authentication process.  See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli) for additional sign in options.
1. If you don't have a resource group, create one using the [az group create](/cli/azure/group#az-group-create) command.  See [What is Azure Resource Manager](/azure/azure-resource-manager/management/overview) to learn more about resource groups.

   ```azurecli
   az group create --name myNewResourceGroupName --location eastus
   ```
1. When working with extension references for the Azure CLI, you must first install the extension. Azure CLI extensions give you access to experimental and pre-release commands that Haven't shipped as part of the core CLI. To learn more about extensions including updating and uninstalling, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).

   Get a list of available extensions

    ```azurecli
    az extension list-available
   ```

   Install the Azure CLI extension replacing **extensionName** with the actual name of the extension.

   ```azurecli
   az extension add --name extensionName
   ```
