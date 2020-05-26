---
title: Encryption of secure assets in Azure Automation
description: This article provides concepts for configuring the Automation account to use encryption.
services: automation
ms.service: automation
ms.subservice: process-automation
author: snehithm
ms.author: snmuvva
ms.date: 01/11/2020
ms.topic: conceptual
manager: kmadnani
---

# Encryption of secure assets in Azure Automation

Secure assets in Azure Automation include credentials, certificates, connections, and encrypted variables. These assets are protected in Azure Automation using multiple levels of encryption. Based on the top-level key used for the encryption, there are two models for encryption:

- Using Microsoft-managed keys
- Using keys that you manage

## Microsoft-managed Keys

By default, your Azure Automation account uses Microsoft-managed keys.

Each secure asset is encrypted and stored in Azure Automation using a unique key (Data Encryption key) that is generated for each automation account. These keys themselves are encrypted and stored in Azure Automation using yet another unique key that is generated for each account called an Account Encryption Key (AEK). These account encryption keys encrypted and stored in Azure Automation using Microsoft-managed Keys. 

## Keys that you manage with Key Vault (preview)

You can manage encryption of secure assets for your Automation account with your own keys. When you specify a customer-managed key at the level of the Automation account, that key is used to protect and control access to the account encryption key for the Automation account. This in turn is used to encrypt and decrypt all the secure assets. Customer-managed keys offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your secure assets.

Use Azure Key Vault to store customer-managed keys. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys.  For more information about Azure Key Vault, see [What is Azure Key Vault?](../key-vault/general/overview.md)

## Use of customer-managed keys for an Automation account

When you use encryption with customer-managed keys for an Automation account, Azure Automation wraps the account encryption key with the customer-managed key in the associated key vault. Enabling customer-managed keys does not impact performance, and the account is encrypted with the new key immediately, without any delay.

A new Automation account is always encrypted using Microsoft-managed keys. It's not possible to enable customer-managed keys at the time that the account is created. Customer-managed keys are stored in Azure Key Vault, and the key vault must be provisioned with access policies that grant key permissions to the managed identity that is associated with the Automation account. The managed identity is available only after the storage account is created.

When you modify the key being used for Azure Automation secure asset encryption, by enabling or disabling customer-managed keys, updating the key version, or specifying a different key, the encryption of the account encryption key changes but the secure assets in your Azure Automation account do not need to be re-encrypted.

> [!NOTE] 
> To enable customer-managed keys, you need to make Azure Automation REST API calls using api version 2020-01-13-preview

### Prerequisites for using customer-managed keys in Azure Automation

Before enabling customer-managed keys for an Automation account, you must ensure the following prerequisites are met:

 - The customer-manged key is stored in an Azure Key Vault. 
 - Enable both the **Soft Delete** and **Do Not Purge** properties on the key vault. These features are required to allow for recovery of keys in case of accidental deletion.
 - Only RSA keys are supported with Azure Automation encryption. For more information about keys, see [About Azure Key Vault keys, secrets, and certificates](../key-vault/about-keys-secrets-and-certificates.md#key-vault-keys).
- The Automation account and the key vault can be in different subscriptions, but need to be in the same Azure Active Directory tenant.

### Assignment of an identity to the Automation account

To use customer-managed keys with an Automation account, your Automation account needs to authenticate against the key vault storing customer-managed keys. Azure Automation uses system assigned managed identities to authenticate the account with Azure Key Vault. For more information about managed identities, see [What are managed identities for Azure resources?](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)

Configure a system assigned managed identity to the Automation account using the following REST API call:

```http
PATCH https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.Automation/automationAccounts/automation-account-name?api-version=2020-01-13-preview
```

Request body:

```json
{ 
 "identity": 
 { 
  "type": "SystemAssigned" 
  } 
}
```

System-assigned identity for the Automation account is returned in a response similar to the following:

```json
{
 "name": "automation-account-name",
 "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.Automation/automationAccounts/automation-account-name",
 ..
 "identity": {
    "type": "SystemAssigned",
    "principalId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "tenantId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
 },
..
}
```

### Configuration of the Key Vault access policy

Once a managed identity is assigned to the Automation account, you configure access to the key vault storing customer-managed keys. Azure Automation requires **get**, **recover**, **wrapKey**, **UnwrapKey** on the customer-managed keys.

Such an access policy can be set using the following REST API call:

```http
PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/sample-group/providers/Microsoft.KeyVault/vaults/sample-vault/accessPolicies/add?api-version=2018-02-14
```

Request body:

```json
{
  "properties": {
    "accessPolicies": [
      {
        "tenantId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        "objectId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "permissions": {
          "keys": [
            "get",
            "recover",
            "wrapKey",
            "unwrapKey"
          ],
          "secrets": [],
          "certificates": []
        }
      }
    ]
  }
}
```

> [!NOTE]
> The **tenantId** and **objectId** fields must be provided with values of **identity.tenantId** and **identity.principalId** respectively from the response of managed identity for the Automation account.

### Change the configuration of Automation account to use customer-managed key

Finally, you can switch your Automation account from Microsoft-managed keys to customer-managed keys, using the following REST API call:

```http
PATCH https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.Automation/automationAccounts/automation-account-name?api-version=2020-01-13-preview
```

Request body:

```json
 {
    "properties": {
      "encryption": {
        "keySource": "Microsoft.Keyvault",
        "keyvaultProperties": {
          "keyName": "sample-vault-key",
          "keyvaultUri": "https://sample-vault-key12.vault.azure.net",
          "keyVersion": "7c73556c521340209371eaf623cc099d"
        }
      }
    }
  }
```

Sample response

```json
{
  "name": "automation-account-name",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resource-group-name/providers/Microsoft.Automation/automationAccounts/automation-account-name",
  ..
  "properties": {
    ..
    "encryption": {
      "keyvaultProperties": {
         "keyName": "sample-vault-key",
          "keyvaultUri": "https://sample-vault-key12.vault.azure.net",
          "keyVersion": "7c73556c521340209371eaf623cc099d"
      },
      "keySource": "Microsoft.Keyvault"
    },
    ..
  }
}
```

## Rotation of a customer-managed key

You can rotate a customer-managed key in Azure Key Vault according to your compliance policies. When the key is rotated, you must update the Automation account to use the new key URI.

Rotating the key does not trigger re-encryption of secure assets in the Automation account. There is no further action required.

## Revocation of access to a customer-managed key

To revoke access to customer-managed keys, use PowerShell or the Azure CLI. For more information, see [Azure Key Vault PowerShell](https://docs.microsoft.com/powershell/module/az.keyvault/) or [Azure Key Vault CLI](https://docs.microsoft.com/cli/azure/keyvault). Revoking access effectively blocks access to all secure assets in the Automation account, as the encryption key is inaccessible by Azure Automation.

## Next steps

- To understand Azure Key Vault, see [What is Azure Key Vault?](../key-vault/general/overview.md).
- To work with certificates, see [Manage certificates in Azure Automation](shared-resources/certificates.md).
- To handle credentials, see [Manage credentials in Azure Automation](shared-resources/credentials.md).
- To use Automation variables, [Manage variables in Azure Automation](shared-resources/variables.md).
- For help when working with connections, see [Manage connections in Azure Automation](automation-connections.md).
