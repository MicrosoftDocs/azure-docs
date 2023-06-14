---
title: Azure Key Vault logging | Microsoft Docs
description: Learn how to monitor access to your key vaults by enabling logging for Azure Key Vault, which saves information in an Azure storage account that you provide.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: how-to
ms.date: 01/20/2023
ms.author: mbaldwin
#Customer intent: As an Azure Key Vault administrator, I want to enable logging so I can monitor how my key vaults are accessed.
---

# Azure Key Vault logging

After you create one or more key vaults, you'll likely want to monitor how and when your key vaults are accessed, and by whom. Enabling logging for Azure Key Vault saves this information in an Azure storage account that you provide. For step by step guidance, see [How to enable Key Vault logging](howto-logging.md).

You can access your logging information 10 minutes (at most) after the key vault operation. In most cases, it will be quicker.  It's up to you to manage your logs in your storage account:

* Use standard Azure access control methods in your storage account to secure your logs by restricting who can access them.
* Delete logs that you no longer want to keep in your storage account.

For overview information about Key Vault, see [What is Azure Key Vault?](overview.md). For information about where Key Vault is available, see the [pricing page](https://azure.microsoft.com/pricing/details/key-vault/). For information about using [Azure Monitor for Key Vault](../key-vault-insights-overview.md).

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
| **resourceId** |Azure Resource Manager resource ID. For Key Vault logs, it is always the Key Vault resource ID. |
| **operationName** |Name of the operation, as documented in the next table. |
| **operationVersion** |REST API version requested by the client. |
| **category** |Type of result. For Key Vault logs, `AuditEvent` is the single, available value. |
| **resultType** |Result of the REST API request. |
| **resultSignature** |HTTP status. |
| **resultDescription** |More description about the result, when available. |
| **durationMs** |Time it took to service the REST API request, in milliseconds. The time does not include the network latency, so the time you measure on the client side might not match this time. |
| **callerIpAddress** |IP address of the client that made the request. |
| **correlationId** |An optional GUID that the client can pass to correlate client-side logs with service-side (Key Vault) logs. |
| **identity** | Identity from the token that was presented in the REST API request. Usually a "user," a "service principal," or the combination "user+appId", for instance when the request comes from an Azure PowerShell cmdlet. |
| **properties** |Information that varies based on the operation (**operationName**). In most cases, this field contains client information (the user agent string passed by the client), the exact REST API request URI, and the HTTP status code. In addition, when an object is returned as a result of a request (for example, **KeyCreate** or **VaultGet**), it also contains the key URI (as `id`), vault URI, or secret URI. |

The **operationName** field values are in *ObjectVerb* format. For example:

* All key vault operations have the `Vault<action>` format, such as `VaultGet` and `VaultCreate`.
* All key operations have the `Key<action>` format, such as `KeySign` and `KeyList`.
* All secret operations have the `Secret<action>` format, such as `SecretGet` and `SecretListVersions`.

The following table lists the **operationName** values and corresponding REST API commands:

### Operation names table

# [Vault](#tab/Vault)

| operationName | REST API command |
| --- | --- |
| **Authentication** |Authenticate via Azure Active Directory endpoint |
| **VaultGet** |[Get information about a key vault](/rest/api/keyvault/keyvault/vaults) |
| **VaultPut** |[Create or update a key vault](/rest/api/keyvault/keyvault/vaults) |
| **VaultDelete** |[Delete a key vault](/rest/api/keyvault/keyvault/vaults) |
| **VaultPatch** |[Update a key vault](/rest/api/keyvault/keyvault/vaults) |
| **VaultList** |[List all key vaults in a resource group](/rest/api/keyvault/keyvault/vaults) |
| **VaultPurge** |[Purge deleted vault](/rest/api/keyvault/keyvault/vaults/purge-deleted) |
| **VaultRecover** |Recover deleted vault|
| **VaultGetDeleted** |[Get deleted vault](/rest/api/keyvault/keyvault/vaults/get-deleted) |
| **VaultListDeleted** |[List deleted vaults](/rest/api/keyvault/keyvault/vaults/list-deleted) |
| **VaultAccessPolicyChangedEventGridNotification** | Vault access policy changed event published.  It is logged regardless if an Event Grid subscription exists. |

# [Keys](#tab/Keys)

| operationName | REST API command |
| --- | --- |
| **KeyCreate** |[Create a key](/rest/api/keyvault/keys/create-key) |
| **KeyGet** |[Get information about a key](/rest/api/keyvault/keys/get-key) |
| **KeyImport** |[Import a key into a vault](/rest/api/keyvault/keyvault/vaults) |
| **KeyDelete** |[Delete a key](/rest/api/keyvault/keys/delete-key) |
| **KeySign** |[Sign with a key](/rest/api/keyvault/keys/sign) |
| **KeyVerify** |[Verify with a key](/rest/api/keyvault/keyvault/vaults) |
| **KeyWrap** |[Wrap a key](/rest/api/keyvault/keys/wrap-key) |
| **KeyUnwrap** |[Unwrap a key](/rest/api/keyvault/keys/unwrap-key) |
| **KeyEncrypt** |[Encrypt with a key](/rest/api/keyvault/keys/encrypt) |
| **KeyDecrypt** |[Decrypt with a key](/rest/api/keyvault/keys/decrypt) |
| **KeyUpdate** |[Update a key](/rest/api/keyvault/keys/update-key) |
| **KeyList** |[List the keys in a vault](/rest/api/keyvault/keys/get-keys) |
| **KeyListVersions** |[List the versions of a key](/rest/api/keyvault/keys/get-key-versions) |
| **KeyPurge** |[Purge a key](/rest/api/keyvault/keys/purge-deleted-key) |
| **KeyBackup** |[Backup a key](/rest/api/keyvault/keys/backup-key) |
| **KeyRestore** |[Restore a key](/rest/api/keyvault/keys/restore-key) |
| **KeyRecover** |[Recover a key](/rest/api/keyvault/keys/recover-deleted-key) |
| **KeyGetDeleted** |[Get deleted key](/rest/api/keyvault/keys/get-deleted-key) |
| **KeyListDeleted** |[List the deleted keys in a vault](/rest/api/keyvault/keys/get-deleted-keys) |
| **KeyNearExpiryEventGridNotification** |Key near expiry event published.  It is logged regardless if an Event Grid subscription exists. |
| **KeyExpiredEventGridNotification** |Key expired event published.  It is logged regardless if an Event Grid subscription exists. |
| **KeyRotate** |[Rotate key](/rest/api/keyvault/keys/rotate-key) |
| **KeyRotateIfDue** |Scheduled automated key rotation operation based on defined rotation policy |
| **KeyRotationPolicyGet** |[Get Key Rotation Policy](/rest/api/keyvault/keys/get-key-rotation-policy) |
| **KeyRotationPolicySet** |[Update Key Rotation Policy](/rest/api/keyvault/keys/update-key-rotation-policy) |


# [Secrets](#tab/Secrets)

| operationName | REST API command |
| --- | --- |
| **SecretSet** |[Create a secret](/rest/api/keyvault/secrets/set-secret) |
| **SecretGet** |[Get a secret](/rest/api/keyvault/secrets/get-secret) |
| **SecretUpdate** |[Update a secret](/rest/api/keyvault/secrets/update-secret) |
| **SecretDelete** |[Delete a secret](/rest/api/keyvault/secrets/delete-secret) |
| **SecretList** |[List secrets in a vault](/rest/api/keyvault/secrets/get-secret) |
| **SecretListVersions** |[List versions of a secret](/rest/api/keyvault/secrets/get-secret-versions) |
| **SecretPurge** |[Purge a secret](/rest/api/keyvault/secrets/purge-deleted-secret) |
| **SecretBackup** |[Backup a secret](/rest/api/keyvault/secrets/backup-secret) |
| **SecretRestore** |[Restore a secret](/rest/api/keyvault/secrets/restore-secret) |
| **SecretRecover** |[Recover a secret](/rest/api/keyvault/secrets/recover-deleted-secret) |
| **SecretGetDeleted** |[Get deleted secret](/rest/api/keyvault/secrets/get-deleted-secret) |
| **SecretListDeleted** |[List the deleted secrets in a vault](/rest/api/keyvault/secrets/get-deleted-secrets) |
| **SecretNearExpiryEventGridNotification** |Secret near expiry event published.  It is logged regardless if an Event Grid subscription exists. |
| **SecretExpiredEventGridNotification** |Secret expired event published.  It is logged regardless if an Event Grid subscription exists. |

# [Certificates](#tab/Cerificates)

| operationName | REST API command |
| --- | --- |
| **CertificateGet** |[Get information about a certificate](/rest/api/keyvault/certificates/get-certificate) |
| **CertificateCreate** |[Create a certificate](/rest/api/keyvault/certificates/create-certificate) |
| **CertificateImport** |[Import a certificate into a vault](/rest/api/keyvault/certificates/import-certificate) |
| **CertificateUpdate** |[Update a certificate](/rest/api/keyvault/certificates/update-certificate) |
| **CertificateList** |[List the certificates in a vault](/rest/api/keyvault/certificates/get-certificate) |
| **CertificateListVersions** |[List the versions of a certificate](/rest/api/keyvault/certificates/get-certificate-versions) |
| **CertificateDelete** |[Delete a certificate](/rest/api/keyvault/certificates/delete-certificate) |
| **CertificatePurge** |[Purge a certificate](/rest/api/keyvault/certificates/purge-deleted-certificate) |
| **CertificateBackup** |[Backup a certificate](/rest/api/keyvault/certificates/backup-certificate) |
| **CertificateRestore** |[Restore a certificate](/rest/api/keyvault/certificates/restore-certificate) |
| **CertificateRecover** |[Recover a certificate](/rest/api/keyvault/certificates/recover-deleted-certificate) |
| **CertificateGetDeleted** |[Get deleted certificate](/rest/api/keyvault/certificates/get-deleted-certificate) |
| **CertificateListDeleted** |[List the deleted certificates in a vault](/rest/api/keyvault/certificates/get-deleted-certificates) |
| **CertificatePolicyGet** |[Get certificate policy](/rest/api/keyvault/certificates/get-certificate-policy) |
| **CertificatePolicyUpdate** |[Update certificate policy](/rest/api/keyvault/certificates/update-certificate-policy) |
| **CertificatePolicySet** |[Create certificate policy](/rest/api/keyvault/certificates/create-certificate) |
| **CertificateContactsGet** |[Get certificate contacts](/rest/api/keyvault/certificates/get-certificate-contacts) |
| **CertificateContactsSet** |[Set certificate contacts](/rest/api/keyvault/certificates/set-certificate-contacts) |
| **CertificateContactsDelete** |[Delete certificate contacts](/rest/api/keyvault/certificates/delete-certificate-contacts) |
| **CertificateIssuerGet** |[Get certificate issuer](/rest/api/keyvault/certificates/get-certificate-issuer) |
| **CertificateIssuerSet** |[Set certificate issuer](/rest/api/keyvault/certificates/set-certificate-issuer) |
| **CertificateIssuerUpdate** |[Update certificate issuer](/rest/api/keyvault/certificates/update-certificate-issuer) |
| **CertificateIssuerDelete** |[Delete certificate issuer](/rest/api/keyvault/certificates/delete-certificate-issuer) |
| **CertificateIssuersList** |[List the certificate issuers](/rest/api/keyvault/certificates/get-certificate-issuers) |
| **CertificateEnroll** |Enroll a certificate |
| **CertificateRenew** |Renew a certificate |
| **CertificatePendingGet** |Retrieve pending certificate |
| **CertificatePendingMerge** | The merger of the certificate is pending |
| **CertificatePendingUpdate** | The update of the certificate is pending |
| **CertificatePendingDelete** |Delete pending certificate |
| **CertificateNearExpiryEventGridNotification** |Certificate near expiry event published. It is logged regardless if an Event Grid subscription exists. |
| **CertificateExpiredEventGridNotification** |Certificate expired event published. It is logged regardless if an Event Grid subscription exists. |

---

## Use Azure Monitor logs

You can use the Key Vault solution in Azure Monitor logs to review Key Vault `AuditEvent` logs. In Azure Monitor logs, you use log queries to analyze data and get the information you need.

For more information, including how to set it up, see [Azure Key Vault in Azure Monitor](../key-vault-insights-overview.md).

For understanding how to analyze logs, see [Sample Kusto log queries](./monitor-key-vault.md#analyzing-logs)

## Next steps

- [How to enable Key Vault logging](howto-logging.md)
- [Azure monitor](../../azure-monitor/index.yml)
- For a tutorial that uses Azure Key Vault in a .NET web application, see [Use Azure Key Vault from a web application](tutorial-net-create-vault-azure-web-app.md).
- For programming references, see [the Azure Key Vault developer's guide](developers-guide.md).
- For a list of Azure PowerShell 1.0 cmdlets for Azure Key Vault, see [Azure Key Vault cmdlets](/powershell/module/az.keyvault/#key_vault).
