---
title: Azure Key Vault Logging | Microsoft Docs
description: Use this tutorial to help you get started with Azure Key Vault logging.
services: key-vault
documentationcenter: ''
author: barclayn
manager: mbaldwin
tags: azure-resource-manager

ms.assetid: 43f96a2b-3af8-4adc-9344-bc6041fface8
ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 10/16/2017
ms.author: barclayn

---
# Azure Key Vault Logging
Azure Key Vault is available in most regions. For more information, see the [Key Vault pricing page](https://azure.microsoft.com/pricing/details/key-vault/).

## Introduction
After you have created one or more key vaults, you will likely want to monitor how and when your key vaults are accessed, and by whom. You can do this by enabling logging for Key Vault, which saves information in an Azure storage account that you provide. A new container named **insights-logs-auditevent** is automatically created for your specified storage account, and you can use this same storage account for collecting logs for multiple key vaults.

You can access your logging information at most, 10 minutes after the key vault operation. In most cases, it will be quicker than this.  It's up to you to manage your logs in your storage account:

* Use standard Azure access control methods to secure your logs by restricting who can access them.
* Delete logs that you no longer want to keep in your storage account.

Use this tutorial to help you get started with Azure Key Vault logging, to create your storage account, enable logging, and interpret the logging information collected.  

> [!NOTE]
> This tutorial does not include instructions for how to create key vaults, keys, or secrets. For this information, see [Get started with Azure Key Vault](key-vault-get-started.md). Or, for Cross-Platform Command-Line Interface instructions, see [this equivalent tutorial](key-vault-manage-with-cli2.md).
>
> Currently, you cannot configure Azure Key Vault in the Azure portal. Instead, use these Azure PowerShell instructions.
>
>

For overview information about Azure Key Vault, see [What is Azure Key Vault?](key-vault-whatis.md)

## Prerequisites
To complete this tutorial, you must have the following:

* An existing key vault that you have been using.  
* Azure PowerShell, **minimum version of 1.0.1**. To install Azure PowerShell and associate it with your Azure subscription, see [How to install and configure Azure PowerShell](/powershell/azure/overview). If you have already installed Azure PowerShell and do not know the version, from the Azure PowerShell console, type `(Get-Module azure -ListAvailable).Version`.  
* Sufficient storage on Azure for your Key Vault logs.

## <a id="connect"></a>Connect to your subscriptions
Start an Azure PowerShell session and sign in to your Azure account with the following command:  

    Connect-AzureRmAccount

In the pop-up browser window, enter your Azure account user name and password. Azure PowerShell will get all the subscriptions that are associated with this account and by default, uses the first one.

If you have multiple subscriptions, you might have to specify a specific one that was used to create your Azure Key Vault. Type the following to see the subscriptions for your account:

    Get-AzureRmSubscription

Then, to specify the subscription that's associated with your key vault you will be logging, type:

    Set-AzureRmContext -SubscriptionId <subscription ID>

> [!NOTE]
> This is an important step and especially helpful if you have multiple subscriptions associated with your account. You may receive an error to register Microsoft.Insights if this step is skipped.
>   
>

For more information about configuring Azure PowerShell, see  [How to install and configure Azure PowerShell](/powershell/azure/overview).

## <a id="storage"></a>Create a new storage account for your logs
Although you can use an existing storage account for your logs, we'll create a new storage account that will be dedicated to Key Vault logs. For convenience for when we have to specify this later, we'll store the details into a variable named **sa**.

For additional ease of management, we'll also use the same resource group as the one that contains our key vault. From the [getting started tutorial](key-vault-get-started.md), this resource group is named **ContosoResourceGroup** and we'll continue to use the East Asia location. Substitute these values for your own, as applicable:

    $sa = New-AzureRmStorageAccount -ResourceGroupName ContosoResourceGroup -Name contosokeyvaultlogs -Type Standard_LRS -Location 'East Asia'


> [!NOTE]
> If you decide to use an existing storage account, it must use the same subscription as your key vault and it must use the Resource Manager deployment model, rather than the Classic deployment model.
>
>

## <a id="identify"></a>Identify the key vault for your logs
In our getting started tutorial, our key vault name was **ContosoKeyVault**, so we'll continue to use that name and store the details into a variable named **kv**:

    $kv = Get-AzureRmKeyVault -VaultName 'ContosoKeyVault'


## <a id="enable"></a>Enable logging
To enable logging for Key Vault, we'll use the Set-AzureRmDiagnosticSetting cmdlet, together with the variables we created for our new storage account and our key vault. We'll also set the **-Enabled** flag to **$true** and set the category to AuditEvent (the only category for Key Vault logging), :

    Set-AzureRmDiagnosticSetting -ResourceId $kv.ResourceId -StorageAccountId $sa.Id -Enabled $true -Categories AuditEvent

The output for this includes:

    StorageAccountId   : /subscriptions/<subscription-GUID>/resourceGroups/ContosoResourceGroup/providers/Microsoft.Storage/storageAccounts/ContosoKeyVaultLogs
    ServiceBusRuleId   :
    StorageAccountName :
        Logs
        Enabled           : True
        Category          : AuditEvent
        RetentionPolicy
        Enabled : False
        Days    : 0


This confirms that logging is now enabled for your key vault, saving information to your storage account.

Optionally you can also set retention policy for your logs such that older logs will be automatically deleted. For example, set retention policy using **-RetentionEnabled** flag to **$true** and set **-RetentionInDays** parameter to **90** so that logs older than 90 days will be automatically deleted.

    Set-AzureRmDiagnosticSetting -ResourceId $kv.ResourceId -StorageAccountId $sa.Id -Enabled $true -Categories AuditEvent -RetentionEnabled $true -RetentionInDays 90

What's logged:

* All authenticated REST API requests are logged, which includes failed requests as a result of access permissions, system errors or bad requests.
* Operations on the key vault itself, which includes creation, deletion, setting key vault access policies, and updating key vault attributes such as tags.
* Operations on keys and secrets in the key vault, which includes creating, modifying, or deleting these keys or secrets; operations such as sign, verify, encrypt, decrypt, wrap and unwrap keys, get secrets, list keys and secrets and their versions.
* Unauthenticated requests that result in a 401 response. For example, requests that do not have a bearer token, or are malformed or expired, or have an invalid token.  

## <a id="access"></a>Access your logs
Key vault logs are stored in the **insights-logs-auditevent** container in the storage account you provided. To list all the blobs in this container, type:

First, create a variable for the container name. This will be used throughout the rest of the walk through.

    $container = 'insights-logs-auditevent'

To list all the blobs in this container, type:

    Get-AzureStorageBlob -Container $container -Context $sa.Context
The output will look something similar to this:

**Container Uri: https://contosokeyvaultlogs.blob.core.windows.net/insights-logs-auditevent**

**Name**

- - -
**resourceId=/SUBSCRIPTIONS/361DA5D4-A47A-4C79-AFDD-XXXXXXXXXXXX/RESOURCEGROUPS/CONTOSORESOURCEGROUP/PROVIDERS/MICROSOFT.KEYVAULT/VAULTS/CONTOSOKEYVAULT/y=2016/m=01/d=05/h=01/m=00/PT1H.json**

**resourceId=/SUBSCRIPTIONS/361DA5D4-A47A-4C79-AFDD-XXXXXXXXXXXX/RESOURCEGROUPS/CONTOSORESOURCEGROUP/PROVIDERS/MICROSOFT.KEYVAULT/VAULTS/CONTOSOKEYVAULT/y=2016/m=01/d=04/h=02/m=00/PT1H.json**

**resourceId=/SUBSCRIPTIONS/361DA5D4-A47A-4C79-AFDD-XXXXXXXXXXXX/RESOURCEGROUPS/CONTOSORESOURCEGROUP/PROVIDERS/MICROSOFT.KEYVAULT/VAULTS/CONTOSOKEYVAULT/y=2016/m=01/d=04/h=18/m=00/PT1H.json****

As you can see from this output, the blobs follow a naming convention: **resourceId=<ARM resource ID>/y=<year>/m=<month>/d=<day of month>/h=<hour>/m=<minute>/filename.json**

The date and time values use UTC.

Because the same storage account can be used to collect logs for multiple resources, the full resource ID in the blob name is very useful to access or download just the blobs that you need. But before we do that, we'll first cover how to download all the blobs.

First, create a folder to download the blobs. For example:

    New-Item -Path 'C:\Users\username\ContosoKeyVaultLogs' -ItemType Directory -Force

Then get a list of all blobs:  

    $blobs = Get-AzureStorageBlob -Container $container -Context $sa.Context

Pipe this list through 'Get-AzureStorageBlobContent' to download the blobs into our destination folder:

    $blobs | Get-AzureStorageBlobContent -Destination 'C:\Users\username\ContosoKeyVaultLogs'

When you run this second command, the **/** delimiter in the blob names create a full folder structure under the destination folder, and this structure will be used to download and store the blobs as files.

To selectively download blobs, use wildcards. For example:

* If you have multiple key vaults and want to download logs for just one key vault, named CONTOSOKEYVAULT3:

        Get-AzureStorageBlob -Container $container -Context $sa.Context -Blob '*/VAULTS/CONTOSOKEYVAULT3
* If you have multiple resource groups and want to download logs for just one resource group, use `-Blob '*/RESOURCEGROUPS/<resource group name>/*'`:

        Get-AzureStorageBlob -Container $container -Context $sa.Context -Blob '*/RESOURCEGROUPS/CONTOSORESOURCEGROUP3/*'
* If you want to download all the logs for the month of January 2016, use `-Blob '*/year=2016/m=01/*'`:

        Get-AzureStorageBlob -Container $container -Context $sa.Context -Blob '*/year=2016/m=01/*'

You're now ready to start looking at what's in the logs. But before moving onto that, two more parameters for Get-AzureRmDiagnosticSetting that you might need to know:

* To query the  status of diagnostic settings for your key vault resource: `Get-AzureRmDiagnosticSetting -ResourceId $kv.ResourceId`
* To disable logging for your key vault resource: `Set-AzureRmDiagnosticSetting -ResourceId $kv.ResourceId -StorageAccountId $sa.Id -Enabled $false -Categories AuditEvent`

## <a id="interpret"></a>Interpret your Key Vault logs
Individual blobs are stored as text, formatted as a JSON blob. This is an example log entry from running `Get-AzureRmKeyVault -VaultName 'contosokeyvault'`:

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


The following table lists the field names and descriptions.

| Field name | Description |
| --- | --- |
| time |Date and time (UTC). |
| resourceId |Azure Resource Manager Resource ID. For Key Vault logs, this is always the  Key Vault resource ID. |
| operationName |Name of the operation, as documented in the next table. |
| operationVersion |This is the REST API version requested by the client. |
| category |For Key Vault logs, AuditEvent is the single, available value. |
| resultType |Result of REST API request. |
| resultSignature |HTTP status. |
| resultDescription |Additional description about the result, when available. |
| durationMs |Time it took to service the REST API request, in milliseconds. This does not include the network latency, so the time you measure on the client side might not match this time. |
| callerIpAddress |IP address of the client who made the request. |
| correlationId |An optional GUID that the client can pass to correlate client-side logs with service-side (Key Vault) logs. |
| identity |Identity from the token that was presented when making the REST API request. This is usually a "user", a "service principal" or a combination "user+appId" as in case of a request resulting from a Azure PowerShell cmdlet. |
| properties |This field will contain different information based on the operation (operationName). In most cases, contains client information (the useragent string passed by the client), the exact REST API request URI, and HTTP status code. In addition, when an object is returned as a result of a request (for example, KeyCreate or VaultGet) it will also contain the Key URI (as "id"), Vault URI, or Secret URI. |

The **operationName** field values are in ObjectVerb format. For example:

* All key vault operations have the 'Vault`<action>`' format, such as `VaultGet` and `VaultCreate`.
* All  key operations have the 'Key`<action>`' format, such as `KeySign` and `KeyList`.
* All secret operations have the 'Secret`<action>`' format, such as `SecretGet` and `SecretListVersions`.

The following table lists the operationName and corresponding REST API command.

| operationName | REST API Command |
| --- | --- |
| Authentication |Via Azure Active Directory endpoint |
| VaultGet |[Get information about a key vault](https://msdn.microsoft.com/library/azure/mt620026.aspx) |
| VaultPut |[Create or update a key vault](https://msdn.microsoft.com/library/azure/mt620025.aspx) |
| VaultDelete |[Delete a key vault](https://msdn.microsoft.com/library/azure/mt620022.aspx) |
| VaultPatch |[Update a key vault](https://msdn.microsoft.com/library/azure/mt620025.aspx) |
| VaultList |[List all key vaults in a resource group](https://msdn.microsoft.com/library/azure/mt620027.aspx) |
| KeyCreate |[Create a key](https://msdn.microsoft.com/library/azure/dn903634.aspx) |
| KeyGet |[Get information about a key](https://msdn.microsoft.com/library/azure/dn878080.aspx) |
| KeyImport |[Import a key into a vault](https://msdn.microsoft.com/library/azure/dn903626.aspx) |
| KeyBackup |[Backup a key](https://msdn.microsoft.com/library/azure/dn878058.aspx). |
| KeyDelete |[Delete a key](https://msdn.microsoft.com/library/azure/dn903611.aspx) |
| KeyRestore |[Restore a key](https://msdn.microsoft.com/library/azure/dn878106.aspx) |
| KeySign |[Sign with a key](https://msdn.microsoft.com/library/azure/dn878096.aspx) |
| KeyVerify |[Verify with a key](https://msdn.microsoft.com/library/azure/dn878082.aspx) |
| KeyWrap |[Wrap a key](https://msdn.microsoft.com/library/azure/dn878066.aspx) |
| KeyUnwrap |[Unwrap a key](https://msdn.microsoft.com/library/azure/dn878079.aspx) |
| KeyEncrypt |[Encrypt with a key](https://msdn.microsoft.com/library/azure/dn878060.aspx) |
| KeyDecrypt |[Decrypt with a key](https://msdn.microsoft.com/library/azure/dn878097.aspx) |
| KeyUpdate |[Update a key](https://msdn.microsoft.com/library/azure/dn903616.aspx) |
| KeyList |[List the keys in a vault](https://msdn.microsoft.com/library/azure/dn903629.aspx) |
| KeyListVersions |[List the versions of a key](https://msdn.microsoft.com/library/azure/dn986822.aspx) |
| SecretSet |[Create a secret](https://msdn.microsoft.com/library/azure/dn903618.aspx) |
| SecretGet |[Get secret](https://msdn.microsoft.com/library/azure/dn903633.aspx) |
| SecretUpdate |[Update a secret](https://msdn.microsoft.com/library/azure/dn986818.aspx) |
| SecretDelete |[Delete a secret](https://msdn.microsoft.com/library/azure/dn903613.aspx) |
| SecretList |[List secrets in a vault](https://msdn.microsoft.com/library/azure/dn903614.aspx) |
| SecretListVersions |[List versions of a secret](https://msdn.microsoft.com/library/azure/dn986824.aspx) |

## <a id="loganalytics"></a>Use Log Analytics

You can use the Azure Key Vault solution in Log Analytics to review Azure Key Vault AuditEvent logs. For more information, including how to set this up, see [Azure Key Vault solution in Log Analytics](../log-analytics/log-analytics-azure-key-vault.md). This article also contains instructions if you need to migrate from the old Key Vault solution that was offered during the Log Analytics preview, where you first routed your logs to an Azure Storage account and configured Log Analytics to read from there.

## <a id="next"></a>Next steps
For a tutorial that uses Azure Key Vault in a web application, see [Use Azure Key Vault from a Web Application](key-vault-use-from-web-application.md).

For programming references, see [the Azure Key Vault developer's guide](key-vault-developers-guide.md).

For a list of Azure PowerShell 1.0 cmdlets for Azure Key Vault, see [Azure Key Vault Cmdlets](/powershell/module/azurerm.keyvault/#key_vault).

For a tutorial on key rotation and log auditing with Azure Key Vault, see [How to setup Key Vault with end to end key rotation and auditing](key-vault-key-rotation-log-monitoring.md).
