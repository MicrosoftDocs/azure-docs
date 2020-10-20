---
title: Azure Key Vault logging | Microsoft Docs
description: Learn how to monitor access to your key vaults by enabling logging for Azure Key Vault, which saves information in an Azure storage account that you provide.
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: how-to
ms.date: 08/12/2019
ms.author: mbaldwin
#Customer intent: As an Azure Key Vault administrator, I want to enable logging so I can monitor how my key vaults are accessed.
---
# Azure Key Vault logging

After you create one or more key vaults, you'll likely want to monitor how and when your key vaults are accessed, and by whom. You can do this by enabling logging for Azure Key Vault, which saves information in an Azure storage account that you provide. For step by step guidance on setting this up, see [How to enable Key Vault logging](howto-logging.md).

You can access your logging information 10 minutes (at most) after the key vault operation. In most cases, it will be quicker than this.  It's up to you to manage your logs in your storage account:

* Use standard Azure access control methods to secure your logs by restricting who can access them.
* Delete logs that you no longer want to keep in your storage account.

For overview information about Key Vault, see [What is Azure Key Vault?](overview.md). For information about where Key Vault is available, see the [pricing page](https://azure.microsoft.com/pricing/details/key-vault/). For information about using [Azure Monitor for Key Vault](https://docs.microsoft.com/azure/azure-monitor/insights/key-vault-insights-overview).

## Interpret your Key Vault logs

When you enable logging, a new container called **insights-logs-auditevent** is automatically created for your specified storage account. You can use this same storage account for collecting logs for multiple key vaults.

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
| **category** |Type of result. For Key Vault logs, `AuditEvent` is the single, available value. |
| **resultType** |Result of the REST API request. |
| **resultSignature** |HTTP status. |
| **resultDescription** |Additional description about the result, when available. |
| **durationMs** |Time it took to service the REST API request, in milliseconds. This does not include the network latency, so the time you measure on the client side might not match this time. |
| **callerIpAddress** |IP address of the client that made the request. |
| **correlationId** |An optional GUID that the client can pass to correlate client-side logs with service-side (Key Vault) logs. |
| **identity** |Identity from the token that was presented in the REST API request. This is usually a "user," a "service principal," or the combination "user+appId," as in the case of a request that results from an Azure PowerShell cmdlet. |
| **properties** |Information that varies based on the operation (**operationName**). In most cases, this field contains client information (the user agent string passed by the client), the exact REST API request URI, and the HTTP status code. In addition, when an object is returned as a result of a request (for example, **KeyCreate** or **VaultGet**), it also contains the key URI (as `id`), vault URI, or secret URI. |

The **operationName** field values are in *ObjectVerb* format. For example:

* All key vault operations have the `Vault<action>` format, such as `VaultGet` and `VaultCreate`.
* All key operations have the `Key<action>` format, such as `KeySign` and `KeyList`.
* All secret operations have the `Secret<action>` format, such as `SecretGet` and `SecretListVersions`.

The following table lists the **operationName** values and corresponding REST API commands:

### Operation names table

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
| **VaultAccessPolicyChangedEventGridNotification** | Vault access policy changed event published |
| **SecretNearExpiryEventGridNotification** |Secret near expiry event published |
| **SecretExpiredEventGridNotification** |Secret expired event published |
| **KeyNearExpiryEventGridNotification** |Key near expiry event published |
| **KeyExpiredEventGridNotification** |Key expired event published |
| **CertificateNearExpiryEventGridNotification** |Certificate near expiry event published |
| **CertificateExpiredEventGridNotification** |Certificate expired event published |

## Use Azure Monitor logs

You can use the Key Vault solution in Azure Monitor logs to review Key Vault `AuditEvent` logs. In Azure Monitor logs, you use log queries to analyze data and get the information you need. 

For more information, including how to set this up, see [Azure Key Vault in Azure Monitor](../../azure-monitor/insights/key-vault-insights-overview.md).

## Next steps

- [How to enable Key Vault logging](howto-logging.md)
- For a tutorial that uses Azure Key Vault in a .NET web application, see [Use Azure Key Vault from a web application](tutorial-net-create-vault-azure-web-app.md).
- For programming references, see [the Azure Key Vault developer's guide](developers-guide.md).
- For a list of Azure PowerShell 1.0 cmdlets for Azure Key Vault, see [Azure Key Vault cmdlets](/powershell/module/az.keyvault/?view=azps-1.2.0#key_vault).
