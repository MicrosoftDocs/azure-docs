---
title: Customer-managed keys for Azure Fluid Relay encryption
description: Better understand the data encryption with CMK
ms.date: 10/08/2021
ms.service: azure-app-service
ms.topic: reference
---

# Customer-managed keys for Azure Fluid Relay encryption

You can use your own encryption key to protect the data in your Azure Fluid Relay resource. When you specify a customer-managed key (CMK), that key is used to protect and control access to the key that encrypts your data. CMK offers greater flexibility to manage access controls.

You must use one of the following Azure key stores to store your CMK:
- [Azure Key Vault](/azure/key-vault/general/overview)
- [Azure Key Vault Managed Hardware Security Module (HSM)](/azure/key-vault/managed-hsm/overview)

You must create a new Azure Fluid Relay resource to enable CMK. You cannot change the CMK enablement/disablement on an existing Fluid Relay resource.

Also, CMK of Fluid Relay relies on Managed Identity, and you need to assign a managed identity to the Fluid Relay resource when enabling CMK. Only user-assigned identity is allowed for Fluid Relay resource CMK. For more information about managed identities, see [here](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types).

Configuring a Fluid Relay resource with CMK can't be done through Azure portal yet.

When you configure the Fluid Relay resource with CMK, the Azure Fluid Relay service configures the appropriate CMK encrypted settings on the Azure Storage account scope where your Fluid session artifacts are stored. For more information about CMK in Azure Storage, see [here](../../storage/common/customer-managed-keys-overview.md).

To verify a Fluid Relay resource is using CMK, you can check the property of the resource by sending GET and see if it has valid, non-empty property of encryption.customerManagedKeyEncryption.

## Prerequisites:

Before configuring CMK on your Azure Fluid Relay resource, the following prerequisites must be met:
- Keys must be stored in an Azure Key Vault.
- Keys must be RSA key and not EC key since EC key doesn’t support WRAP and UNWRAP.
- A user assigned managed identity must be created with necessary permission (GET, WRAP and UNWRAP) to the key vault in step 1. More information [here](../../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-nonaad.md). Please grant GET, WRAP and UNWRAP under Key Permissions in AKV.
- Azure Key Vault, user assigned identity, and the Fluid Relay resource must be in the same region and in the same Microsoft Entra tenant.
- If you provide the key URL with a specific key version, **only that version** will be used for CMK purposes.
If you later add a new key version, you must **manually** update the key URL in the CMK settings of the Fluid Relay resource to make the new version effective.
The Fluid Relay service will fail if the specified key version is deleted or disabled without updating the resource to use a valid version.
- To allow the Fluid Relay service to automatically use the latest key version of the key from your key vault, you can **omit the key version** in the encryption key URL. This enables automatic key version updates on the Fluid Relay side.
  However, you are still responsible for managing and rotating key versions in your Key Vault.
  > Due to resource limitations, switching to this auto-update setting may fail. If that happens, please specify a key version explicitly and perform a manual update on your Fluid Relay resource for newer key versions.


## Create a Fluid Relay resource with CMK

### [REST API](#tab/rest)
```
PUT https://management.azure.com/subscriptions/<subscription ID>/resourceGroups/<resource group name> /providers/Microsoft.FluidRelay/fluidRelayServers/< Fluid Relay resource name>?api-version=2022-06-01 @"<path to request payload>"
```

Request payload format:

```
{
    "location": "<the region you selected for Fluid Relay resource>",
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            “<User assigned identity resource ID>": {}
        }
    },
    "properties": {
       "encryption": {
            "customerManagedKeyEncryption": {
                "keyEncryptionKeyIdentity": {
                    "identityType": "UserAssigned",
                    "userAssignedIdentityResourceId":  "<User assigned identity resource ID>"
                },
                "keyEncryptionKeyUrl": "<key identifier>"
            }
        }
    }
}
```

Example userAssignedIdentities and userAssignedIdentityResourceId:
/subscriptions/ xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/testGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/testUserAssignedIdentity

Example keyEncryptionKeyUrl: `https://test-key-vault.vault.azure.net/keys/testKey/testKeyVersionGuid`

Notes:
- Identity.type must be UserAssigned. It is the identity type of the managed identity that is assigned to the Fluid Relay resource.
- Properties.encryption.customerManagedKeyEncryption.keyEncryptionKeyIdentity.identityType must be UserAssigned. It is the identity type of the managed identity that should be used for CMK.
- Although you can specify more than one in Identity.userAssignedIdentities, only one user identity assigned to Fluid Relay resource specified will be used for CMK access the key vault for encryption.
- Properties.encryption.customerManagedKeyEncryption.keyEncryptionKeyIdentity.userAssignedIdentityResourceId is the resource ID of the user assigned identity that should be used for CMK. Notice that it should be one of the identities in Identity.userAssignedIdentities (You must assign the identity to Fluid Relay resource before it can use it for CMK). Also, it should have necessary permissions on the key (provided by keyEncryptionKeyUrl).
- Properties.encryption.customerManagedKeyEncryption.keyEncryptionKeyUrl is the key identifier used for CMK.

### [Azure CLI](#tab/azure-cli)
To create Fluid Relay with CMK enabled using Azure CLI, you need to install [fluid-relay](/cli/azure/fluid-relay) extension first. See [instructions](/cli/azure/azure-cli-extensions-overview).

And make sure you complete all the prerequsite steps.

```azurecli
az fluid-relay server create --server-name <Fluid Relay Service name> --resource-group <resource group name> --identity '{"type":"UserAssigned","user-assigned-identities":{"<user assigned resource id>":{}}}' --key-identity '{"identity-type":"UserAssigned","user-assigned-identities":"<user assigned resource id>"}' --key-url "https://akv-cuseuap-cmktest-02.vault.azure.net/keys/key-rsa-4096/81b15c848e874aabb6f13839b43b16fc" --location <location> --sku <standard or basic>
```

For more information about the command, see [az fluid-relay server create](/cli/azure/fluid-relay/server?view=azure-cli-latest#az-fluid-relay-server-create)

**Notes:**

- Some arguments must be provided in **stringified JSON** format.
- The `type` field under `identity` **must be** `UserAssigned`. This specifies the identity type of the managed identity assigned to the Fluid Relay resource.
- The `identity-type` field under `key-identity` **must also be** `UserAssigned`. This indicates the identity type to be used for Customer-Managed Key (CMK) encryption.
- While multiple identities can be specified in the `identity` argument, **only** the identity defined in `key-identity` will be used to access the Key Vault for CMK encryption.
- The `user-assigned-identities` field under `key-identity` should be set to the **resource ID** of the user-assigned identity intended for CMK access.
  - This identity must already be listed in the `identity` field.
  - It must also be assigned to the Fluid Relay resource **before** it can be used for CMK.
  - Additionally, it needs the necessary permissions on the key specified in `key-url`.
- `key-url` is the **key identifier** used for CMK.

---

## Update CMK settings of an existing Fluid Relay resource

You can update the following CMK settings on existing Fluid Relay resource:
- Change the identity that is used for accessing the key encryption key.
- Change the key encryption key identifier (key URL).
- Change the key version of the key encryption key.

Note that you cannot disable CMK on existing Fluid Relay resource once it is enabled.

Before updating the key encryption key (by identifier or version), ensure that the previous key version is still enabled and has not expired in your key vault. Otherwise, the update operation will fail.

When using the update command, you may specify only the parameters that have changed—unchanged arguments can be omitted.

All updates must satisfy the prerequisites described above.

### [REST API](#tab/rest)
Request URL:

```
PATCH https://management.azure.com/subscriptions/<subscription id>/resourceGroups/<resource group name>/providers/Microsoft.FluidRelay/fluidRelayServers/<fluid relay server name>?api-version=2022-06-01 @"path to request payload"
```

Request payload example for updating key encryption key URL:

```
{
    "properties": {
       "encryption": {
            "customerManagedKeyEncryption": {
                "keyEncryptionKeyUrl": "https://test_key_vault.vault.azure.net/keys/testKey /xxxxxxxxxxxxxxxx"
            }
        }
    }
}
```

### [Azure CLI](#tab/azure-cli)

Update encryption key URL
```azurecli
az fluid-relay server update --server-name <Fluid Relay Service name> --resource-group <resource group> --key-url <new key URL>
```

Updating `identity` and `key-identity` follows the same format as when creating the resource. However, during an update, you only need to provide the parts that have changed.

Update assigned identity for CMK
```azurecli
az fluid-relay server update --server-name <Fluid Relay Service name> --resource-group <resource group> --key-identity '{"user-assigned-identities":"<new user assigned resource id>"}'
```

For more information about the command, see [az fluid-relay server update](/cli/azure/fluid-relay/server?view=azure-cli-latest#az-fluid-relay-server-update)

---

## See also

- [Overview of Azure Fluid Relay architecture](architecture.md)
- [Data storage in Azure Fluid Relay](../concepts/data-storage.md)
- [Data encryption in Azure Fluid Relay](../concepts/data-encryption.md)
