---
title: How to enable Key Vault logging
description: How to enable logging for Azure Key Vault, which saves information in an Azure storage account that you provide.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: how-to
ms.date: 09/30/2020
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

With Azure PowerShell, you can first list your subscriptions using the [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription?view=azps-4.7.0) command, and then connect to one using [Set-AzContext](/powershell/module/az.accounts/set-azcontext?view=azps-4.7.0): 

```powershell-interactive
Get-AzSubscription

Set-AzContext -SubscriptionId "<subscriptionID>"
```

## Create a storage account for your logs

Although you can use an existing storage account for your logs, we'll create a new storage account dedicated to Key Vault logs. For additional ease of management, we'll also use the same resource group as the one that contains the key vault. In the [Azure CLI quickstart](quick-create-cli.md) and [Azure PowerShell quickstart](quick-create-powershell.md), this resource group is named **myResourceGroup**, and the location is *eastus*. Replace these values with your own, as applicable.

With the Azure CLI, use the 

```powershell
 $sa = New-AzStorageAccount -ResourceGroupName ContosoResourceGroup -Name contosokeyvaultlogs -Type Standard_LRS -Location 'East Asia'
```

> [!NOTE]
> If you decide to use an existing storage account, it must use the same subscription as your key vault, and it must use the Azure Resource Manager deployment model, rather than the classic deployment model.

## Identify the key vault for your logs

In the [getting-started tutorial](../secrets/quick-create-cli.md), the key vault name was **ContosoKeyVault**. We'll continue to use that name and store the details in a variable named **kv**:

```powershell
$kv = Get-AzKeyVault -VaultName 'ContosoKeyVault'
```

## Enable logging using Azure PowerShell

To enable logging for Key Vault, we'll use the **Set-AzDiagnosticSetting** cmdlet, together with the variables that we created for the new storage account and the key vault. We'll also set the **-Enabled** flag to **$true** and set the category to `AuditEvent` (the only category for Key Vault logging):

```powershell
Set-AzDiagnosticSetting -ResourceId $kv.ResourceId -StorageAccountId $sa.Id -Enabled $true -Category AuditEvent
```

The output looks like this:

```output
StorageAccountId   : /subscriptions/<subscription-GUID>/resourceGroups/ContosoResourceGroup/providers/Microsoft.Storage/storageAccountContosoKeyVaultLogs
ServiceBusRuleId   :
StorageAccountName :
    Logs
    Enabled           : True
    Category          : AuditEvent
    RetentionPolicy
    Enabled : False
    Days    : 0
```

This output confirms that logging is now enabled for your key vault, and it will save information to your storage account.

Optionally, you can set a retention policy for your logs such that older logs are automatically deleted. For example, set retention policy by setting the **-RetentionEnabled** flag to **$true**, and set the **-RetentionInDays** parameter to **90** so that logs older than 90 days are automatically deleted.

```powershell
Set-AzDiagnosticSetting -ResourceId $kv.ResourceId -StorageAccountId $sa.Id -Enabled $true -Category AuditEvent -RetentionEnabled $true -RetentionInDays 90
```

What's logged:

* All authenticated REST API requests, including failed requests as a result of access permissions, system errors, or bad requests.
* Operations on the key vault itself, including creation, deletion, setting key vault access policies, and updating key vault attributes such as tags.
* Operations on keys and secrets in the key vault, including:
  * Creating, modifying, or deleting these keys or secrets.
  * Signing, verifying, encrypting, decrypting, wrapping and unwrapping keys, getting secrets, and listing keys and secrets (and their versions).
* Unauthenticated requests that result in a 401 response. Examples are requests that don't have a bearer token, that are malformed or expired, or that have an invalid token.  
* Event Grid notification events for near expiry, expired and vault access policy changed (new version event is not logged). Events are logged regardless if there is event subscription created on key vault. For more information see, [Event Grid event schema for Key Vault](https://docs.microsoft.com/azure/event-grid/event-schema-key-vault)

## Enable logging using Azure CLI

```azurecli
az login

az account set --subscription {AZURE SUBSCRIPTION ID}

az provider register -n Microsoft.KeyVault

az monitor diagnostic-settings create  \
--name KeyVault-Diagnostics \
--resource /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.KeyVault/vaults/mykeyvault \
--logs    '[{"category": "AuditEvent","enabled": true}]' \
--metrics '[{"category": "AllMetrics","enabled": true}]' \
--storage-account /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount \
--workspace /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/oi-default-east-us/providers/microsoft.operationalinsights/workspaces/myworkspace \
--event-hub-rule /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myresourcegroup/providers/Microsoft.EventHub/namespaces/myeventhub/authorizationrules/RootManageSharedAccessKey
```

## Access your logs

Key Vault logs are stored in the **insights-logs-auditevent** container in the storage account that you provided. To view the logs, you have to download blobs.

First, create a variable for the container name. You'll use this variable throughout the rest of the walkthrough.

```powershell
$container = 'insights-logs-auditevent'
```

To list all the blobs in this container, enter:

```powershell
Get-AzStorageBlob -Container $container -Context $sa.Context
```

The output looks similar to this:

```
Container Uri: https://contosokeyvaultlogs.blob.core.windows.net/insights-logs-auditevent

Name

---
resourceId=/SUBSCRIPTIONS/361DA5D4-A47A-4C79-AFDD-XXXXXXXXXXXX/RESOURCEGROUPS/CONTOSORESOURCEGROUP/PROVIDERS/MICROSOFT.KEYVAULT/VAULTS/CONTOSOKEYVAULT/y=2016/m=01/d=05/h=01/m=00/PT1H.json

resourceId=/SUBSCRIPTIONS/361DA5D4-A47A-4C79-AFDD-XXXXXXXXXXXX/RESOURCEGROUPS/CONTOSORESOURCEGROUP/PROVIDERS/MICROSOFT.KEYVAULT/VAULTS/CONTOSOKEYVAULT/y=2016/m=01/d=04/h=02/m=00/PT1H.json

resourceId=/SUBSCRIPTIONS/361DA5D4-A47A-4C79-AFDD-XXXXXXXXXXXX/RESOURCEGROUPS/CONTOSORESOURCEGROUP/PROVIDERS/MICROSOFT.KEYVAULT/VAULTS/CONTOSOKEYVAULT/y=2016/m=01/d=04/h=18/m=00/PT1H.json
```

As you can see from this output, the blobs follow a naming convention: `resourceId=<ARM resource ID>/y=<year>/m=<month>/d=<day of month>/h=<hour>/m=<minute>/filename.json`

The date and time values use UTC.

Because you can use the same storage account to collect logs for multiple resources, the full resource ID in the blob name is useful to access or download just the blobs that you need. But before we do that, we'll first cover how to download all the blobs.

Create a folder to download the blobs. For example:

```powershell 
New-Item -Path 'C:\Users\username\ContosoKeyVaultLogs' -ItemType Directory -Force
```

Then get a list of all blobs:  

```powershell
$blobs = Get-AzStorageBlob -Container $container -Context $sa.Context
```

Pipe this list through **Get-AzStorageBlobContent** to download the blobs to the destination folder:

```powershell
$blobs | Get-AzStorageBlobContent -Destination C:\Users\username\ContosoKeyVaultLogs'
```

When you run this second command, the **/** delimiter in the blob names creates a full folder structure under the destination folder. You'll use this structure to download and store the blobs as files.

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

* To query the status of diagnostic settings for your key vault resource: `Get-AzDiagnosticSetting -ResourceId $kv.ResourceId`
* To disable logging for your key vault resource: `Set-AzDiagnosticSetting -ResourceId $kv.ResourceId -StorageAccountId $sa.Id -Enabled $false -Category AuditEvent`

For details on how to read the logs, see [Key Vault logging: Interpret your Key Vault logs](logging.md#interpret-your-key-vault-logs)

## Use Azure Monitor logs

You can use the Key Vault solution in Azure Monitor logs to review Key Vault `AuditEvent` logs. In Azure Monitor logs, you use log queries to analyze data and get the information you need. 

For more information, including how to set this up, see [Azure Key Vault in Azure Monitor](../../azure-monitor/insights/key-vault-insights-overview.md).

## Next steps

- For conceptual information, including how to interpret Key Vault logs, see [Key Vault logging](logging.md)
- For a tutorial that uses Azure Key Vault in a .NET web application, see [Use Azure Key Vault from a web application](tutorial-net-create-vault-azure-web-app.md).
- For programming references, see [the Azure Key Vault developer's guide](developers-guide.md).