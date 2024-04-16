---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 08/18/2021
ms.author: glenga
---

## Create supporting Azure resources for your function

Before you can deploy your function code to Azure, you need to create three resources:

- A [resource group](../articles/azure-resource-manager/management/overview.md), which is a logical container for related resources.
- A [Storage account](../articles/storage/common/storage-account-create.md), which is used to maintain state and other information about your functions.
- A function app, which provides the environment for executing your function code. A function app maps to your local function project and lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

Use the following commands to create these items. Both Azure CLI and PowerShell are supported.

1. If you haven't done so already, sign in to Azure:

    # [Azure CLI](#tab/azure-cli)
    ```azurecli
    az login
    ```

    The [az login](/cli/azure/reference-index#az-login) command signs you into your Azure account.

    # [Azure PowerShell](#tab/azure-powershell) 
    ```azurepowershell
    Connect-AzAccount
    ```

    The [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet signs you into your Azure account.

    ---

1. Create a resource group named `AzureFunctionsQuickstart-rg` in your chosen region:

    # [Azure CLI](#tab/azure-cli)
    
    ```azurecli
    az group create --name AzureFunctionsQuickstart-rg --location <REGION>
    ```
 
    The [az group create](/cli/azure/group#az-group-create) command creates a resource group. In the above command, replace `<REGION>` with a region near you, using an available region code returned from the [az account list-locations](/cli/azure/account#az-account-list-locations) command.

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzResourceGroup -Name AzureFunctionsQuickstart-rg -Location <REGION>
    ```

    The [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command creates a resource group. You generally create your resource group and resources in a region near you, using an available region returned from the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) cmdlet.

    ---

1. Create a general-purpose storage account in your resource group and region:

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az storage account create --name <STORAGE_NAME> --location <REGION> --resource-group AzureFunctionsQuickstart-rg --sku Standard_LRS --allow-blob-public-access false
    ```

    The [az storage account create](/cli/azure/storage/account#az-storage-account-create) command creates the storage account. 

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzStorageAccount -ResourceGroupName AzureFunctionsQuickstart-rg -Name <STORAGE_NAME> -SkuName Standard_LRS -Location <REGION> -AllowBlobPublicAccess $false
    ```

    The [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) cmdlet creates the storage account.

    ---

    In the previous example, replace `<STORAGE_NAME>` with a name that is appropriate to you and unique in Azure Storage. Names must contain three to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account, which is [supported by Functions](../articles/azure-functions/storage-considerations.md#storage-account-requirements).

[!INCLUDE [functions-storage-access-note](./functions-storage-access-note.md)]
