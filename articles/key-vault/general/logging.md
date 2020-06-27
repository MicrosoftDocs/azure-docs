---
title: Azure Key Vault logging | Microsoft Docs
description: Use this tutorial to help you get started with Azure Key Vault logging.
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 08/12/2019
ms.author: mbaldwin
#Customer intent: As an Azure Key Vault administrator, I want to enable logging so I can monitor how my key vaults are accessed.
---
# Azure Key Vault logging

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

After you create one or more key vaults, you'll likely want to monitor how and when your key vaults are accessed, and by whom. You can do this by enabling logging for Azure Key Vault, which saves information in an Azure storage account that you provide. A new container named **insights-logs-auditevent** is automatically created for your specified storage account. You can use this same storage account for collecting logs for multiple key vaults.

You can access your logging information 10 minutes (at most) after the key vault operation. In most cases, it will be quicker than this.  It's up to you to manage your logs in your storage account:

* Use standard Azure access control methods to secure your logs by restricting who can access them.
* Delete logs that you no longer want to keep in your storage account.

Use this tutorial to help you get started with Azure Key Vault logging. You'll create a storage account, enable logging, and interpret the collected log information.  

> [!NOTE]
> This tutorial does not include instructions for how to create key vaults, keys, or secrets. For this information, see [What is Azure Key Vault?](overview.md)). Or, for cross-platform Azure CLI instructions, see [this equivalent tutorial](manage-with-cli2.md)).
>
> This article provides Azure PowerShell instructions for updating diagnostic logging. You can also update diagnostic logging by using Azure Monitor in the **Diagnostic logs** section of the Azure portal. 
>

For overview information about Key Vault, see [What is Azure Key Vault?](overview.md)). For information about where Key Vault is available, see the [pricing page](https://azure.microsoft.com/pricing/details/key-vault/).

## Prerequisites

To complete this tutorial, you must have the following:

* An existing key vault that you have been using.  
* Azure PowerShell, minimum version of 1.0.0. To install Azure PowerShell and associate it with your Azure subscription, see [How to install and configure Azure PowerShell](/powershell/azure/overview). If you have already installed Azure PowerShell and don't know the version, from the Azure PowerShell console, enter `$PSVersionTable.PSVersion`.  
* Sufficient storage on Azure for your Key Vault logs.

## <a id="connect"></a>Connect to your key vault subscription

The first step in setting up key logging is to point Azure PowerShell to the key vault that you want to log.

Start an Azure PowerShell session and sign in to your Azure account by using the following command:  

```powershell
Connect-AzAccount
```

In the pop-up browser window, enter your Azure account user name and password. Azure PowerShell gets all the subscriptions that are associated with this account. By default, PowerShell uses the first one.

You might have to specify the subscription that you used to create your key vault. Enter the following command to see the subscriptions for your account:

```powershell
Get-AzSubscription
```

Then, to specify the subscription that's associated with the key vault you'll be logging, enter:

```powershell
Set-AzContext -SubscriptionId <subscription ID>
```

Pointing PowerShell to the right subscription is an important step, especially if you have multiple subscriptions associated with your account. For more information about configuring Azure PowerShell, see [How to install and configure Azure PowerShell](/powershell/azure/overview).

## <a id="storage"></a>Create a storage account for your logs

Although you can use an existing storage account for your logs, we'll create a storage account that will be dedicated to Key Vault logs. For convenience for when we have to specify this later, we'll store the details in a variable named **sa**.

For additional ease of management, we'll also use the same resource group as the one that contains the key vault. From the [getting-started tutorial](../secrets/quick-create-cli.md), this resource group is named **ContosoResourceGroup**, and we'll continue to use the East Asia location. Replace these values with your own, as applicable:

```powershell
 $sa = New-AzStorageAccount -ResourceGroupName ContosoResourceGroup -Name contosokeyvaultlogs -Type Standard_LRS -Location 'East Asia'
```

> [!NOTE]
> If you decide to use an existing storage account, it must use the same subscription as your key vault. And it must use the Azure Resource Manager deployment model, rather than the classic deployment model.
>
>

## <a id="identify"></a>Identify the key vault for your logs

In the [getting-started tutorial](../secrets/quick-create-cli.md), the key vault name was **ContosoKeyVault**. We'll continue to use that name and store the details in a variable named **kv**:

```powershell
$kv = Get-AzKeyVault -VaultName 'ContosoKeyVault'
```

## <a id="enable"></a>Enable logging using Azure PowerShell

To enable logging for Key Vault, we'll use the **Set-AzDiagnosticSetting** cmdlet, together with the variables that we created for the new storage account and the key vault. We'll also set the **-Enabled** flag to **$true** and set the category to **AuditEvent** (the only category for Key Vault logging):

```powershell
Set-AzDiagnosticSetting -ResourceId $kv.ResourceId -StorageAccountId $sa.Id -Enabled $true -Category AuditEvent
```

The output looks like this:

    StorageAccountId   : /subscriptions/<subscription-GUID>/resourceGroups/ContosoResourceGroup/providers/Microsoft.Storage/storageAccounts/ContosoKeyVaultLogs
    ServiceBusRuleId   :
    StorageAccountName :
        Logs
        Enabled           : True
        Category          : AuditEvent
        RetentionPolicy
        Enabled : False
        Days    : 0

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

## <a id="access"></a>Access your logs

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

* To query the  status of diagnostic settings for your key vault resource: `Get-AzDiagnosticSetting -ResourceId $kv.ResourceId`
* To disable logging for your key vault resource: `Set-AzDiagnosticSetting -ResourceId $kv.ResourceId -StorageAccountId $sa.Id -Enabled $false -Category AuditEvent`


## <a id="interpret"></a>Interpret your Key Vault logs

Individual blobs are stored as text, formatted as a JSON blob. Let's look at an example log entry. 

```json
    {
        "records":
        [
            {
                "time": "2016-01-05T01:32:01.2691226Z",
                "resourceId": "/SUBSCRIPTIONS/361DA5D4-A47A-4C79-AFDD-XXXXXXXXXXXX/RESOURCEGROUPS/CONTOSOGROUP/PROVIDERS/MICROSOFT.KEYVAULT/VAULTS/CONTOSOKEYVAULT",
                "operationName": "VaultGet",
                "operationVersion": "2015-06-01",
                "category": "AuditEvent",
                "resultType": "Success",
                "resultSignature": "OK",
                "resultDescription": "",
                "durationMs": "78",
                "callerIpAddress": "104.40.82.76",
                "correlationId": "",
                "identity": {"claim":{"http://schemas.microsoft.com/identity/claims/objectidentifier":"d9da5048-2737-4770-bd64-XXXXXXXXXXXX","http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn":"live.com#username@outlook.com","appid":"1950a258-227b-4e31-a9cf-XXXXXXXXXXXX"}},
                "properties": {"clientInfo":"azure-resource-manager/2.0","requestUri":"https://control-prod-wus.vaultcore.azure.net/subscriptions/361da5d4-a47a-4c79-afdd-XXXXXXXXXXXX/resourcegroups/contosoresourcegroup/providers/Microsoft.KeyVault/vaults/contosokeyvault?api-version=2015-06-01","id":"https://contosokeyvault.vault.azure.net/","httpStatusCode":200}
            }
        ]
    }
```

The following table lists the field names and descriptions:

| Field name | Description |
| --- | --- |
| **time** |Date and time in UTC. |
| **resourceId** |Azure Resource Manager resource ID. For Key Vault logs, this is always the Key Vault resource ID. |
| **operationName** |Name of the operation, as documented in the next table. |
| **operationVersion** |REST API version requested by the client. |
| **category** |Type of result. For Key Vault logs, **AuditEvent** is the single, available value. |
| **resultType** |Result of the REST API request. |
| **resultSignature** |HTTP status. |
| **resultDescription** |Additional description about the result, when available. |
| **durationMs** |Time it took to service the REST API request, in milliseconds. This does not include the network latency, so the time you measure on the client side might not match this time. |
| **callerIpAddress** |IP address of the client that made the request. |
| **correlationId** |An optional GUID that the client can pass to correlate client-side logs with service-side (Key Vault) logs. |
| **identity** |Identity from the token that was presented in the REST API request. This is usually a "user," a "service principal," or the combination "user+appId," as in the case of a request that results from an Azure PowerShell cmdlet. |
| **properties** |Information that varies based on the operation (**operationName**). In most cases, this field contains client information (the user agent string passed by the client), the exact REST API request URI, and the HTTP status code. In addition, when an object is returned as a result of a request (for example, **KeyCreate** or **VaultGet**), it also contains the key URI (as "id"), vault URI, or secret URI. |

The **operationName** field values are in *ObjectVerb* format. For example:

* All key vault operations have the `Vault<action>` format, such as `VaultGet` and `VaultCreate`.
* All key operations have the `Key<action>` format, such as `KeySign` and `KeyList`.
* All secret operations have the `Secret<action>` format, such as `SecretGet` and `SecretListVersions`.

The following table lists the **operationName** values and corresponding REST API commands:

| operationName | REST API command |
| --- | --- |
| **Authentication** |Authenticate via Azure Active Directory endpoint |
| **VaultGet** |[Get information about a key vault](https://msdn.microsoft.com/library/azure/mt620026.aspx) |
| **VaultPut** |[Create or update a key vault](https://msdn.microsoft.com/library/azure/mt620025.aspx) |
| **VaultDelete** |[Delete a key vault](https://msdn.microsoft.com/library/azure/mt620022.aspx) |
| **VaultPatch** |[Update a key vault](https://msdn.microsoft.com/library/azure/mt620025.aspx) |
| **VaultList** |[List all key vaults in a resource group](https://msdn.microsoft.com/library/azure/mt620027.aspx) |
| **KeyCreate** |[Create a key](https://msdn.microsoft.com/library/azure/dn903634.aspx) |
| **KeyGet** |[Get information about a key](https://msdn.microsoft.com/library/azure/dn878080.aspx) |
| **KeyImport** |[Import a key into a vault](https://msdn.microsoft.com/library/azure/dn903626.aspx) |
| **KeyBackup** |[Back up a key](https://msdn.microsoft.com/library/azure/dn878058.aspx) |
| **KeyDelete** |[Delete a key](https://msdn.microsoft.com/library/azure/dn903611.aspx) |
| **KeyRestore** |[Restore a key](https://msdn.microsoft.com/library/azure/dn878106.aspx) |
| **KeySign** |[Sign with a key](https://msdn.microsoft.com/library/azure/dn878096.aspx) |
| **KeyVerify** |[Verify with a key](https://msdn.microsoft.com/library/azure/dn878082.aspx) |
| **KeyWrap** |[Wrap a key](https://msdn.microsoft.com/library/azure/dn878066.aspx) |
| **KeyUnwrap** |[Unwrap a key](https://msdn.microsoft.com/library/azure/dn878079.aspx) |
| **KeyEncrypt** |[Encrypt with a key](https://msdn.microsoft.com/library/azure/dn878060.aspx) |
| **KeyDecrypt** |[Decrypt with a key](https://msdn.microsoft.com/library/azure/dn878097.aspx) |
| **KeyUpdate** |[Update a key](https://msdn.microsoft.com/library/azure/dn903616.aspx) |
| **KeyList** |[List the keys in a vault](https://msdn.microsoft.com/library/azure/dn903629.aspx) |
| **KeyListVersions** |[List the versions of a key](https://msdn.microsoft.com/library/azure/dn986822.aspx) |
| **SecretSet** |[Create a secret](https://msdn.microsoft.com/library/azure/dn903618.aspx) |
| **SecretGet** |[Get a secret](https://msdn.microsoft.com/library/azure/dn903633.aspx) |
| **SecretUpdate** |[Update a secret](https://msdn.microsoft.com/library/azure/dn986818.aspx) |
| **SecretDelete** |[Delete a secret](https://msdn.microsoft.com/library/azure/dn903613.aspx) |
| **SecretList** |[List secrets in a vault](https://msdn.microsoft.com/library/azure/dn903614.aspx) |
| **SecretListVersions** |[List versions of a secret](https://msdn.microsoft.com/library/azure/dn986824.aspx) |

## <a id="loganalytics"></a>Use Azure Monitor logs

You can use the Key Vault solution in Azure Monitor logs to review Key Vault **AuditEvent** logs. In Azure Monitor logs, you use log queries to analyze data and get the information you need. 

For more information, including how to set this up, see [Azure Key Vault solution in Azure Monitor logs](../../azure-monitor/insights/azure-key-vault.md). This article also contains instructions if you need to migrate from the old Key Vault solution that was offered during the Azure Monitor logs preview, where you first routed your logs to an Azure storage account and configured Azure Monitor logs to read from there.

## <a id="next"></a>Next steps

For a tutorial that uses Azure Key Vault in a .NET web application, see [Use Azure Key Vault from a web application](tutorial-net-create-vault-azure-web-app.md).

For programming references, see [the Azure Key Vault developer's guide](developers-guide.md).

For a list of Azure PowerShell 1.0 cmdlets for Azure Key Vault, see [Azure Key Vault cmdlets](/powershell/module/az.keyvault/?view=azps-1.2.0#key_vault).
