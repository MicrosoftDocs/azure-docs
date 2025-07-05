---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/05/2025
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

1. If you haven't already done so, install the Application Insights extension:

    :::code language="azurecli" source="~/azure_cli_scripts/azure-functions/create-function-app-flex-plan-identities/create-function-app-flex-plan-identities.md" range="12":::

1. Create a resource group named `AzureFunctionsQuickstart-rg` in your chosen region:
    <!---
    ### [Azure CLI](#tab/azure-cli)-->
    
    :::code language="azurecli" source="~/azure_cli_scripts/azure-functions/create-function-app-flex-plan-identities/create-function-app-flex-plan-identities.md" range="15":::
 
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
    :::code language="azurecli" source="~/azure_cli_scripts/azure-functions/create-function-app-flex-plan-identities/create-function-app-flex-plan-identities.md" range="18-19":::

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

    :::code language="azurecli" source="~/azure_cli_scripts/azure-functions/create-function-app-flex-plan-identities/create-function-app-flex-plan-identities.md" range="22-23,26-28":::

    If you don't have the `jq` utility in your local Bash shell, it's available in Azure Cloud Shell. The [az identity create](/cli/azure/identity#az-identity-create) command creates a new identity in the resource group named `func-host-storage-user`. The returned `principalId` is used to assign permissions to this new identity in the default storage account by using the [`az role assignment create`](/cli/azure/role/assignment#az-role-assignment-create) command. The [`az storage account show`](/cli/azure/storage/account#az-storage-account-show) command is used to obtain the storage account ID. 

1. Grant to the new identity the required access in the default storage account by using the built-in `Storage Blob Data Owner` role:

    :::code language="azurecli" source="~/azure_cli_scripts/azure-functions/create-function-app-flex-plan-identities/create-function-app-flex-plan-identities.md" range="31-33":::

    In this example, replace `<STORAGE_NAME>` and `<REGION>` with your default storage account name and region, respectively. 

1. Use the [az functionapp create](/cli/azure/functionapp#az-functionapp-create) command to create the function app in Azure:
    <!---Replace tabs when PowerShell cmdlets support Flex Consumption plans.
    ### [Azure CLI](#tab/azure-cli)
    -->
    ::: zone pivot="programming-language-csharp" 
    az functionapp create --resource-group "AzureFunctionsQuickstart-rg" --name <APP_NAME> --flexconsumption-location <REGION> \
    --runtime dotnet-isolated --runtime-version <LANGUAGE_VERSION> --storage-account <STORAGE_NAME> \
    --deployment-storage-auth-type UserAssignedIdentity --deployment-storage-auth-value <USER_NAME>
    ::: zone-end
    ::: zone pivot="programming-language-java" 
    az functionapp create --resource-group "AzureFunctionsQuickstart-rg" --name <APP_NAME> --flexconsumption-location <REGION> \
    --runtime java --runtime-version <LANGUAGE_VERSION> --storage-account <STORAGE_NAME> \
    --deployment-storage-auth-type UserAssignedIdentity --deployment-storage-auth-value <USER_NAME>
    ::: zone-end
    ::: zone pivot="programming-language-javascript,programming-language-typescript" 
    az functionapp create --resource-group "AzureFunctionsQuickstart-rg" --name <APP_NAME> --flexconsumption-location <REGION> \
    --runtime node --runtime-version <LANGUAGE_VERSION> --storage-account <STORAGE_NAME> \
    --deployment-storage-auth-type UserAssignedIdentity --deployment-storage-auth-value <USER_NAME>
    ::: zone-end
    ::: zone pivot="programming-language-python" 
    az functionapp create --resource-group "AzureFunctionsQuickstart-rg" --name <APP_NAME> --flexconsumption-location <REGION> \
    --runtime python --runtime-version <LANGUAGE_VERSION> --storage-account <STORAGE_NAME> \
    --deployment-storage-auth-type UserAssignedIdentity --deployment-storage-auth-value <USER_NAME>
    ::: zone-end
    ::: zone pivot="programming-language-powershell" 
    az functionapp create --resource-group "AzureFunctionsQuickstart-rg" --name <APP_NAME> --flexconsumption-location <REGION> \
    --runtime python --runtime-version <LANGUAGE_VERSION> --storage-account <STORAGE_NAME> \
    --deployment-storage-auth-type UserAssignedIdentity --deployment-storage-auth-value <USER_NAME>
    ::: zone-end
    <!---
    ### [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzFunctionApp -Name <APP_NAME> -ResourceGroupName AzureFunctionsQuickstart-rg -StorageAccount <STORAGE_NAME> -Runtime dotnet-isolated -FunctionsVersion 4 -Location '<REGION>'
    ```

    The [New-AzFunctionApp](/powershell/module/az.functions/new-azfunctionapp) cmdlet creates the function app in Azure.

    ---
    -->
    In this example, replace these placholders:

    + `<STORAGE_NAME>`: the name of the account you used in the previous step.
    + `<REGION>`: your region. 
    + `<APP_NAME>`: a globally unique name appropriate to you. The `<APP_NAME>` is also the default DNS domain for the function app.
    + `<USER_NAME>`: the name of the user-assigned managed identity.
    + `<LANGUAGE_VERSION>`: use the [supported language stack version](../articles/azure-functions/supported-languages.md) you verified locally.

    This command creates a function app running in your specified language runtime on Linux in the [Flex Consumption Plan](flex-consumption-plan.md), which is free for the amount of usage you incur here. The command also creates an associated Azure Application Insights instance in the same resource group, with which you can monitor your function app and view logs. For more information, see [Monitor Azure Functions](functions-monitoring.md). The instance incurs no costs until you activate it.

1. Add your user-assigned managed identity to the [Monitoring Metrics Publisher](../role-based-access-control/built-in-roles/monitor.md#monitoring-metrics-publisher) role in your Application Insights instance:

    :::code language="azurecli" source="~/azure_cli_scripts/azure-functions/create-function-app-flex-plan-identities/create-function-app-flex-plan-identities.md" range="42-44":::

    The [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command adds your user to the role. The resource ID of your Application Insights instance is obtained by using [az monitor app-insights component show](/cli/azure/monitor/app-insights/component#az-monitor-app-insights-component-show).
