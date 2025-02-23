---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/16/2024
ms.author: glenga
---

## Create supporting Azure resources for your function

Before you can deploy your function code to Azure, you need to create these resources:

- A [resource group](../articles/azure-resource-manager/management/overview.md), which is a logical container for related resources.
- A default [Storage account](../articles/storage/common/storage-account-create.md), which is used by the Functions host to maintain state and other information about your functions. 
- A [user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview), which the Functions host uses to connect to the default storage account.
- A function app, which provides the environment for executing your function code. A function app maps to your local function project and lets you group functions as a logical unit for easier management, deployment, and sharing of resources.

Use the following commands to create these items. Both Azure CLI and PowerShell are supported.

1. If you haven't done so already, sign in to Azure:

    <!---Replace the PowerShell examples after we get the Flex support in the Functions cmdlets. 
    ### [Azure CLI](#tab/azure-cli)-->

    ```azurecli
    az login
    ```

    The [az login](/cli/azure/reference-index#az-login) command signs you into your Azure account.
    <!---
    ### [Azure PowerShell](#tab/azure-powershell) 
    ```azurepowershell
    Connect-AzAccount
    ```

    The [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet signs you into your Azure account.

    ---
    -->

1. Create a resource group named `AzureFunctionsQuickstart-rg` in your chosen region:
    <!---
    ### [Azure CLI](#tab/azure-cli)-->
    
    ```azurecli
    az group create --name AzureFunctionsQuickstart-rg --location <REGION>
    ```
 
    The [az group create](/cli/azure/group#az-group-create) command creates a resource group. In the above command, replace `<REGION>` with a region near you that supports the Flex Consumption plan. Use an available region code returned from the [az functionapp list-flexconsumption-locations](/cli/azure/functionapp#az-functionapp-list-flexconsumption-locations) command.
    <!---
    ### [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzResourceGroup -Name AzureFunctionsQuickstart-rg -Location <REGION>
    ```

    The [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command creates a resource group. You generally create your resource group and resources in a region near you, using an available region returned from the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) cmdlet.

    ---
    -->

1. Create a general-purpose storage account in your resource group and region:
    <!---
    ### [Azure CLI](#tab/azure-cli)
    -->
    ```azurecli
    az storage account create --resource-group AzureFunctionsQuickstart-rg --sku Standard_LRS --allow-blob-public-access false --allow-shared-key-access false --name <STORAGE_NAME> --location <REGION> 
    ```

    This [az storage account create](/cli/azure/storage/account#az-storage-account-create) command creates a storage account. 
    <!---
    ### [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzStorageAccount -ResourceGroupName AzureFunctionsQuickstart-rg -Name <STORAGE_NAME> -SkuName Standard_LRS -Location <REGION> -AllowBlobPublicAccess $false
    ```

    The [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) cmdlet creates the storage account.

    ---
    -->
    In this example, replace `<STORAGE_NAME>` with a name that is appropriate to you and unique in Azure Storage. Names must contain three to 24 characters numbers and lowercase letters only. `Standard_LRS` specifies a general-purpose account, which is [supported by Functions](../articles/azure-functions/storage-considerations.md#storage-account-requirements). This new account can only be accessed by using Micrososft Entra-authenticated identities that have been granted permissions to specific resources. 

1. Create a user-assigned managed identity, then capture and parse the returned JSON properties of the object using `jq`: 

    ```azurecli
    # Create a user-assigned managed identity.
    output=$(az identity create --name func-host-storage-user --resource-group AzureFunctionsQuickstart-rg --location <REGION> --query "{userId:id, principalId: principalId, clientId: clientId}" -o json)
    
    # Use jq to parse the JSON and assign the properties to variables.
    userId=$(echo $output | jq -r '.userId')
    principalId=$(echo $output | jq -r '.principalId')
    clientId=$(echo $output | jq -r '.clientId')
    ```

    If you don't have the `jq` utility in your local Bash shell, it's available in Azure Cloud Shell. The [az identity create](/cli/azure/identity#az-identity-create) command creates a new identity in the resource group named `func-host-storage-user`. The returned `principalId` is used to assign permissions to this new identity in the default storage account by using the [`az role assignment create`](/cli/azure/role/assignment#az-role-assignment-create) command. The [`az storage account show`](/cli/azure/storage/account#az-storage-account-show) command is used to obtain the storage account ID. 

1. Grant to the new identity the required access in the default storage account by using the built-in `Storage Blob Data Owner` role:

    ```azurecli
    # Get the storage ID and create a role assignment (Storage Blob Data Owner) for the UAMI in storage.
    storageId=$(az storage account show --resource-group AzureFunctionsQuickstart-rg --name <STORAGE_NAME> --query 'id' -o tsv)
    az role assignment create --assignee-object-id $principalId --assignee-principal-type ServicePrincipal --role "Storage Blob Data Owner" --scope $storageId
    ```

    In this example, replace `<STORAGE_NAME>` and `<REGION>` with your default storage account name and region, respectively. 
