---
title: How to enable Azure Key Vault logging
description: How to enable logging for Azure Key Vault, which saves information in an Azure storage account that you provide.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: how-to
ms.date: 10/01/2020
ms.author: mbaldwin
#Customer intent: As an Azure Key Vault administrator, I want to enable logging so I can monitor how my key vaults are accessed.
---
# How to enable Key Vault logging

After you create one or more key vaults, you'll likely want to monitor how and when your key vaults are accessed, and by whom. For full details on the feature, see [Key Vault logging](logging.md).

## Prerequisites

To complete this tutorial, you must have the following:

* An existing key vault that you have been using.  
* The Azure CLI or Azure PowerShell.
* Sufficient storage on Azure for your Key Vault logs.

If you choose to install and use the CLI locally, you will need the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). To sign in to Azure using the CLI you can type:

```azurecli-interactive
az login
```

If you choose to install and use PowerShell locally, you will need the Azure PowerShell module version 1.0.0 or later. Type `$PSVersionTable.PSVersion` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

```powershell-interactive
Connect-AzAccount
```

## Connect to your Key Vault subscription

The first step in setting up key logging is connecting to subscription containing your key vault. This is especially important if you have multiple subscriptions associated with your account.

With the Azure CLI, you can view all your subscriptions using the [az account list](/cli/azure/account?view=azure-cli-latest#az_account_list) command, and then connect to one using [az account set](/cli/azure/account?view=azure-cli-latest#az_account_set):

```azurecli-interactive
az account list

az account set --subscription "<subscriptionID>"
```

With Azure PowerShell, you can first list your subscriptions using the [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription?view=azps-4.7.0) cmdlet, and then connect to one using the [Set-AzContext](/powershell/module/az.accounts/set-azcontext?view=azps-4.7.0) cmdlet: 

```powershell-interactive
Get-AzSubscription

Set-AzContext -SubscriptionId "<subscriptionID>"
```

## Create a storage account for your logs

Although you can use an existing storage account for your logs, we'll create a new storage account dedicated to Key Vault logs. 

For additional ease of management, we'll also use the same resource group as the one that contains the key vault. In the [Azure CLI quickstart](quick-create-cli.md) and [Azure PowerShell quickstart](quick-create-powershell.md), this resource group is named **myResourceGroup**, and the location is *eastus*. Replace these values with your own, as applicable. 

We will also need to provide a storage account name. Storage account names must be unique, between 3 and 24 characters in length, and use numbers and lower-case letters only.  Lastly, we will be creating a storage account of the "Standard_LRS" SKU.

With the Azure CLI, use the [az storage account create](/cli/azure/storage/account?view=azure-cli-latest#az_storage_account_create) command.

```azurecli-interactive
az storage account create --name "<your-unique-storage-account-name>" -g "myResourceGroup" --sku "Standard_LRS"
```

With Azure PowerShell, use the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount?view=azps-4.7.0) cmdlet. You will need to provide the location that corresponds to the resource group.

```powershell
 New-AzStorageAccount -ResourceGroupName myResourceGroup -Name "<your-unique-storage-account-name>" -Type "Standard_LRS" -Location "eastus"
```

In either case, note the "id" of the storage account. The Azure CLI operation returns the "id" in the output. To obtain the "id" with Azure PowerShell, use [Get-AzStorageAccount](/powershell/module/az.storage/get-azstorageaccount?view=azps-4.7.0) and assigned the output to a the variable $sa. You can then see the storage account with $sa.id. (The "$sa.Context" property will also be used, later in this article.)

```powershell-interactive
$sa = Get-AzStorageAccount -Name "<your-unique-storage-account-name>" -ResourceGroup "myResourceGroup"
$sa.id
```

The "id" of the storage account will be in the format "/subscriptions/<your-subscription-ID>/resourceGroups/myResourceGroup/providers/Microsoft.Storage/storageAccounts/<your-unique-storage-account-name>".

> [!NOTE]
> If you decide to use an existing storage account, it must use the same subscription as your key vault, and it must use the Azure Resource Manager deployment model, rather than the classic deployment model.

## Obtain your key vault Resource ID

In the [CLI quickstart](quick-create-cli.md) and [PowerShell quickstart](quick-create-powershell.md), you created a key with a unique name.  Use that name again in the steps below.  If you cannot remember the name of your key vault, you can use the Azure CLI [az keyvault list](/cli/azure/keyvault?view=azure-cli-latest#az_keyvault_list) command or the Azure PowerShell [Get-AzKeyVault](/powershell/module/az.keyvault/get-azkeyvault?view=azps-4.7.0) cmdlet to list them.

Use the name of your key vault to find its Resource ID.  With Azure CLI, use the [az keyvault show](/cli/azure/keyvault?view=azure-cli-latest#az_keyvault_show) command.

```azurecli-interactive
az keyvault show --name "<your-unique-keyvault-name>"
```

With Azure PowerShell, use the [Get-AzKeyVault](/powershell/module/az.keyvault/get-azkeyvault?view=azps-4.7.0) cmdlet.

```powershell-interactive
Get-AzKeyVault -VaultName "<your-unique-keyvault-name>"
```

The Resource ID for your key vault will be on the format "/subscriptions/<your-subscription-ID>/resourceGroups/myResourceGroup/providers/Microsoft.KeyVault/vaults/<your-unique-keyvault-name>". Note it for the next step.

## Enable logging using Azure PowerShell

To enable logging for Key Vault, we'll use the Azure CLI [az monitor diagnostic-settings create](/cli/azure/monitor/diagnostic-settings?view=azure-cli-latest) command, or the [Set-AzDiagnosticSetting](/powershell/module/az.monitor/set-azdiagnosticsetting?view=azps-4.7.0) cmdlet, together with the storage account ID and the key vault Resource ID.

```azurecli-interactive
az monitor diagnostic-settings create --storage-account "<storage-account-id>" --resource "<key-vault-resource-id>" --name "Key vault logs" --logs '[{"category": "AuditEvent","enabled": true}]' --metrics '[{"category": "AllMetrics","enabled": true}]'
```

With Azure PowerShell, we'll use the [Set-AzDiagnosticSetting](/powershell/module/az.monitor/set-azdiagnosticsetting?view=azps-4.7.0) cmdlet, with the **-Enabled** flag set to **$true** and the category set to `AuditEvent` (the only category for Key Vault logging):

```powershell-interactive
Set-AzDiagnosticSetting -ResourceId "<key-vault-resource-id>" -StorageAccountId $sa.id -Enabled $true -Category "AuditEvent"
```

Optionally, you can set a retention policy for your logs, so that older logs are automatically deleted after a specified amount of time. For example, you could set set retention policy that automatically deletes logs older than 90 days.

<!-- With the Azure CLI, use the [az monitor diagnostic-settings update](/cli/azure/monitor/diagnostic-settings?view=azure-cli-latest#az_monitor_diagnostic_settings_update) command. 

```azurecli-interactive
az monitor diagnostic-settings update 
```
-->

With Azure PowerShell, use the [Set-AzDiagnosticSetting](/powershell/module/az.monitor/set-azdiagnosticsetting?view=azps-4.7.0) cmdlet. 

```powershell-interactive
Set-AzDiagnosticSetting "<key-vault-resource-id>" -StorageAccountId $sa.id -Enabled $true -Category AuditEvent -RetentionEnabled $true -RetentionInDays 90
```

What is logged:

* All authenticated REST API requests, including failed requests as a result of access permissions, system errors, or bad requests.
* Operations on the key vault itself, including creation, deletion, setting key vault access policies, and updating key vault attributes such as tags.
* Operations on keys and secrets in the key vault, including:
  * Creating, modifying, or deleting these keys or secrets.
  * Signing, verifying, encrypting, decrypting, wrapping and unwrapping keys, getting secrets, and listing keys and secrets (and their versions).
* Unauthenticated requests that result in a 401 response. Examples are requests that don't have a bearer token, that are malformed or expired, or that have an invalid token.  
* Event Grid notification events for near expiry, expired and vault access policy changed (new version event is not logged). Events are logged regardless if there is event subscription created on key vault. For more information see, [Event Grid event schema for Key Vault](../../event-grid/event-schema-key-vault.md)

## Access your logs

Key Vault logs are stored in the "insights-logs-auditevent" container in the storage account that you provided. To view the logs, you have to download blobs.

First, list all the blobs in the container.  With the Azure CLI, use the [az storage blob list](/cli/azure/storage/blob?view=azure-cli-latest#az_storage_blob_list) command.

```azurecli-interactive
az storage blob list --account-name "<your-unique-storage-account-name>" --container-name "insights-logs-auditevent"
```

With Azure PowerShell, use the [Get-AzStorageBlob](/powershell/module/az.storage/get-azstorageblob?view=azps-4.7.0) list all the blobs in this container, enter:

```powershell
Get-AzStorageBlob -Container $container -Context $sa.Context
```

As you will see from the output of either the Azure CLI command or the Azure PowerShell cmdlet, the name of the blobs are in the format `resourceId=<ARM resource ID>/y=<year>/m=<month>/d=<day of month>/h=<hour>/m=<minute>/filename.json`. The date and time values use UTC.

Because you can use the same storage account to collect logs for multiple resources, the full resource ID in the blob name is useful to access or download just the blobs that you need. But before we do that, we'll first cover how to download all the blobs.

With the Azure CLI, use the [az storage blob download](/cli/azure/storage/blob?view=azure-cli-latest#az_storage_blob_download) command, pass it the names of the blobs, and the path to the file where you wish to save the results.

```azurecli-interactive
az storage blob download --container-name "insights-logs-auditevent" --file <path-to-file> --name "<blob-name>" --account-name "<your-unique-storage-account-name>"
```

With Azure PowerShell, use the [Gt-AzStorageBlobs](/powershell/module/az.storage/get-azstorageblob?view=azps-4.7.0) cmdlet to get a list of the blobs, then pipe that to the [Get-AzStorageBlobContent](/powershell/module/az.storage/get-azstorageblobcontent?view=azps-4.7.0) cmdlet to download the logs to your chosen path.

```powershell-interactive
$blobs = Get-AzStorageBlob -Container $container -Context $sa.Context | Get-AzStorageBlobContent -Destination "<path-to-file>"
```

When you run this second cmdlet in PowerShell, the **/** delimiter in the blob names creates a full folder structure under the destination folder. You'll use this structure to download and store the blobs as files.

To selectively download blobs, use wildcards. For example:

* If you have multiple key vaults and want to download logs for just one key vault, named CONTOSOKEYVAULT3:

  ```powershell
  Get-AzStorageBlob -Container $container -Context $sa.Context -Blob '*/VAULTS/CONTOSOKEYVAULT3
  ```

* If you have multiple resource groups and want to download logs for just one resource group, use `-Blob '*/RESOURCEGROUPS/<resource group name>/*'`:

  ```powershell
  Get-AzStorageBlob -Container $container -Context $sa.Context -Blob '*/RESOURCEGROUPS/CONTOSORESOURCEGROUP3/*'
  ```

* If you want to download all the logs for the month of January 2019, use `-Blob '*/year=2019/m=01/*'`:

  ```powershell
  Get-AzStorageBlob -Container $container -Context $sa.Context -Blob '*/year=2016/m=01/*'
  ```

You're now ready to start looking at what's in the logs. But before we move on to that, you should know two more commands:

For details on how to read the logs, see [Key Vault logging: Interpret your Key Vault logs](logging.md#interpret-your-key-vault-logs)

## Use Azure Monitor logs

You can use the Key Vault solution in Azure Monitor logs to review Key Vault `AuditEvent` logs. In Azure Monitor logs, you use log queries to analyze data and get the information you need.

For more information, including how to set this up, see [Azure Key Vault in Azure Monitor](../../azure-monitor/insights/key-vault-insights-overview.md).

## Next steps

- For conceptual information, including how to interpret Key Vault logs, see [Key Vault logging](logging.md)
- For a tutorial that uses Azure Key Vault in a .NET web application, see [Use Azure Key Vault from a web application](tutorial-net-create-vault-azure-web-app.md).
- For programming references, see [the Azure Key Vault developer's guide](developers-guide.md).