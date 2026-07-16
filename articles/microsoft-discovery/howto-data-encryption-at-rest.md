---
title: Configure customer-managed keys for Microsoft Discovery resources
description: Learn how to configure customer-managed keys for supported Microsoft Discovery resources by using Azure Key Vault, managed identities, and resource-specific settings.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 03/25/2026
---

# Configure customer-managed keys for Microsoft Discovery resources

This article shows how to configure customer-managed keys (CMK) for supported Microsoft Discovery resources. Use this article when you need to create a Bookshelf, Supercomputer, or Workspace resource that uses a key you manage in Azure Key Vault.

For background on encryption at rest and the difference between Microsoft-managed keys and customer-managed keys, see [Data encryption at rest in Microsoft Discovery](concept-data-encryption-at-rest.md).

## Prerequisites

Before you begin, make sure you have:

- An Azure subscription enabled for Microsoft Discovery.
- Permissions to create or update Azure Key Vault, managed identity, Log Analytics, and Microsoft Discovery resources.
- A supported Microsoft Discovery resource plan. Customer-managed keys are supported for Bookshelf, Supercomputer, and Workspace resources.
- All related resources deployed in the same Azure region.

> [!IMPORTANT]
> Customer-managed keys are a create-time setting for Microsoft Discovery resources. After a Bookshelf, Supercomputer, or Workspace resource is created, you can't switch that resource between Microsoft-managed keys and customer-managed keys.

## Create the shared CMK dependencies

Complete the following steps before you create a CMK-enabled Microsoft Discovery resource.

### Create an Azure Key Vault

Create an Azure Key Vault to store the encryption key.

The Key Vault must meet these requirements:

- Soft delete is enabled.
- Purge protection is enabled.
- The vault is in the same region as your Microsoft Discovery resource.
- Azure RBAC is enabled for access control.

```azurecli
az keyvault create \
  --name <your-key-vault-name> \
  --resource-group <your-resource-group> \
  --location <region> \
  --enable-purge-protection true \
  --enable-rbac-authorization true
```

For more information, see [Create a key vault](/azure/key-vault/general/quick-create-portal).

### Create an RSA key

Create an RSA key in Azure Key Vault. Microsoft Discovery supports RSA keys with sizes 2048, 3072, and 4096.

```azurecli
az keyvault key create \
  --vault-name <your-key-vault-name> \
  --name <your-key-name> \
  --kty RSA \
  --size 2048
```

Record these values for later use:

| Value | Description | Example |
| --- | --- | --- |
| Key Vault URI | The vault URI | `https://my-keyvault.vault.azure.net` |
| Key name | The name of the key | `my-cmk-key` |
| Key version | The specific key version | `abc123def456...` |

> [!NOTE]
> Microsoft Discovery currently requires an explicit key version. If you rotate the key in Azure Key Vault, you must update the Microsoft Discovery resource to use the new key version.

### Create a user-assigned managed identity

Create a user-assigned managed identity that Microsoft Discovery can use to access the Key Vault key.

```azurecli
az identity create \
  --name <your-identity-name> \
  --resource-group <your-resource-group> \
  --location <region>
```

Get the client ID and resource ID:

```azurecli
az identity show \
  --name <your-identity-name> \
  --resource-group <your-resource-group> \
  --query '{clientId: clientId, id: id}' \
  --output table
```

For more information, see [Create a user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal#create-a-user-assigned-managed-identity).

### Grant the managed identity access to the key

Assign the **Key Vault Crypto Service Encryption User** role to the managed identity at the Key Vault scope.

```azurecli
# Get the Key Vault resource ID
KV_RESOURCE_ID=$(az keyvault show \
  --name <your-key-vault-name> \
  --query id \
  --output tsv)

# Get the managed identity principal ID
IDENTITY_PRINCIPAL_ID=$(az identity show \
  --name <your-identity-name> \
  --resource-group <your-resource-group> \
  --query principalId \
  --output tsv)

# Assign the role
az role assignment create \
  --role "Key Vault Crypto Service Encryption User" \
  --assignee-object-id $IDENTITY_PRINCIPAL_ID \
  --assignee-principal-type ServicePrincipal \
  --scope $KV_RESOURCE_ID
```

For more information, see [Azure built-in roles for Key Vault](../role-based-access-control/built-in-roles.md#key-vault-crypto-service-encryption-user).

### Create a Log Analytics dedicated cluster

All CMK-enabled Microsoft Discovery resources require a Log Analytics dedicated cluster configured for customer-managed keys so that diagnostic logs are encrypted with your key.

```azurecli
az monitor log-analytics cluster create \
  --name <your-cluster-name> \
  --resource-group <your-resource-group> \
  --location <region> \
  --sku-capacity 100 \
  --identity-type SystemAssigned
```

After the cluster is created, configure it to use your Key Vault key. For instructions, see [Customer-managed keys in Azure Monitor](/azure/azure-monitor/logs/customer-managed-keys).

## Configure a Bookshelf resource with CMK

Use this section when you create a Bookshelf resource that uses customer-managed keys.

Bookshelf has an extra requirement: `keyVaultProperties.identityClientId` must match the client ID of one of the workload identities assigned to the Bookshelf resource.

### Bookshelf properties

| Property | Description | Mutability |
| --- | --- | --- |
| `customerManagedKeys` | Set to `Enabled` | Create only |
| `keyVaultProperties.keyVaultUri` | Key Vault URI | Create only |
| `keyVaultProperties.keyName` | Key name in Key Vault | Create, update |
| `keyVaultProperties.keyVersion` | Key version in Key Vault | Create, update |
| `keyVaultProperties.identityClientId` | Client ID of the managed identity used to access Key Vault | Create only |
| `logAnalyticsClusterId` | Resource ID of the Log Analytics dedicated cluster | Create only |

### Example Bookshelf request

Use a PUT request when you create the Bookshelf resource.

```json
{
  "location": "<region>",
  "properties": {
    "workloadIdentities": {
      "/subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>": {}
    },
    "customerManagedKeys": "Enabled",
    "keyVaultProperties": {
      "keyVaultUri": "https://<your-key-vault>.vault.azure.net",
      "keyName": "<your-key-name>",
      "keyVersion": "<your-key-version>",
      "identityClientId": "<managed-identity-client-id>"
    },
    "logAnalyticsClusterId": "/subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>"
  }
}
```

You can submit the payload by using `az rest --method put` against the `Microsoft.Discovery/bookshelves` resource.

## Configure a Supercomputer resource with CMK

Use this section when you create a Supercomputer resource that uses customer-managed keys.

Supercomputer uses an Azure Disk Encryption Set to apply customer-managed keys to compute disks.

### Create a Disk Encryption Set

Create the Disk Encryption Set by using the Key Vault key.

```azurecli
# Get the Key Vault key URL
KEY_URL=$(az keyvault key show \
  --vault-name <your-key-vault-name> \
  --name <your-key-name> \
  --query 'key.kid' \
  --output tsv)

# Create the Disk Encryption Set
az disk-encryption-set create \
  --name <your-des-name> \
  --resource-group <your-resource-group> \
  --location <region> \
  --key-url $KEY_URL \
  --encryption-type EncryptionAtRestWithCustomerKey
```

Grant the Disk Encryption Set access to the key:

```azurecli
DES_IDENTITY=$(az disk-encryption-set show \
  --name <your-des-name> \
  --resource-group <your-resource-group> \
  --query 'identity.principalId' \
  --output tsv)

az role assignment create \
  --role "Key Vault Crypto Service Encryption User" \
  --assignee-object-id $DES_IDENTITY \
  --assignee-principal-type ServicePrincipal \
  --scope $KV_RESOURCE_ID
```

> [!IMPORTANT]
> The Disk Encryption Set must be in the same region as the Supercomputer resource.

### Supercomputer properties

| Property | Description | Mutability |
| --- | --- | --- |
| `customerManagedKeys` | Set to `Enabled` | Create only |
| `diskEncryptionSetId` | Resource ID of the Disk Encryption Sets | Create only |
| `logAnalyticsClusterId` | Resource ID of the Log Analytics dedicated cluster | Create only |

### Example Supercomputer request

Use a PUT request when you create the Supercomputer resource.

```json
{
  "location": "<region>",
  "properties": {
    "subnetId": "/subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.Network/virtualNetworks/<vnet>/subnets/<subnet>",
    "identities": {
      "clusterIdentity": {
        "id": "/subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<cluster-id>"
      },
      "kubeletIdentity": {
        "id": "/subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<kubelet-id>"
      },
      "workloadIdentities": {
        "/subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<workload-id>": {}
      }
    },
    "customerManagedKeys": "Enabled",
    "diskEncryptionSetId": "/subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.Compute/diskEncryptionSets/<des-name>",
    "logAnalyticsClusterId": "/subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>"
  }
}
```

You can submit the payload by using `az rest --method put` against the `Microsoft.Discovery/supercomputers` resource.

> [!NOTE]
> Supercomputer CMK settings are create-only. To change the key later, update the associated Disk Encryption Set rather than the Microsoft Discovery resource.

## Configure a Workspace resource with CMK

Use this section when you create a Workspace resource that uses customer-managed keys.

### Workspace properties

| Property | Description | Mutability |
| --- | --- | --- |
| `customerManagedKeys` | Set to `Enabled` | Create only |
| `keyVaultProperties.keyVaultUri` | Key Vault URI | Create only |
| `keyVaultProperties.keyName` | Key name in Key Vault | Create, update |
| `keyVaultProperties.keyVersion` | Key version in Key Vault | Create, update |
| `logAnalyticsClusterId` | Resource ID of the Log Analytics dedicated cluster | Create only |

### Example Workspace request

Use a PUT request when you create the Workspace resource.

```json
{
  "location": "<region>",
  "properties": {
    "customerManagedKeys": "Enabled",
    "keyVaultProperties": {
      "keyVaultUri": "https://<your-key-vault>.vault.azure.net",
      "keyName": "<your-key-name>",
      "keyVersion": "<your-key-version>"
    },
    "logAnalyticsClusterId": "/subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.OperationalInsights/clusters/<cluster-name>"
  }
}
```

You can submit the payload by using `az rest --method put` against the `Microsoft.Discovery/workspaces` resource.

## Rotate a customer-managed key

When you rotate a key in Azure Key Vault, create a new key version first and then update the Microsoft Discovery resource to reference that version.

### Create a new key version

```azurecli
az keyvault key create \
  --vault-name <your-key-vault-name> \
  --name <your-key-name> \
  --kty RSA \
  --size 2048
```

### Update a Bookshelf or Workspace resource

For Bookshelf and Workspace resources, update `keyVaultProperties.keyName` or `keyVaultProperties.keyVersion` by using a PATCH request.

```json
{
  "properties": {
    "keyVaultProperties": {
      "keyName": "<your-key-name>",
      "keyVersion": "<new-key-version>"
    }
  }
}
```

### Update a Supercomputer resource

For Supercomputer resources, update the key on the associated Disk Encryption Set. For guidance, see [Server-side encryption with customer-managed keys for managed disks](/azure/virtual-machines/disks-enable-customer-managed-keys-portal).

> [!WARNING]
> Don't disable or delete the old key version until you confirm that the updated Microsoft Discovery resource or Disk Encryption Set is using the new key version successfully.

### Verify that the old key version is no longer in use

Before you disable the old key version, verify that no dependent service is still using it. A practical way to do this change is to enable Azure Key Vault diagnostic logging and check for cryptographic operations against the previous key version.

If diagnostic logging isn't already enabled for the Key Vault, configure it to send audit events to a Log Analytics workspace. For setup guidance, see [Enable logging for Azure Key Vault](/azure/key-vault/general/howto-logging).

Use a query like the example here in Log Analytics to check whether the old key version is still being used:

```kusto
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.KEYVAULT"
| where OperationName in ("KeyWrap", "KeyUnwrap", "KeyEncrypt", "KeyDecrypt")
| where requestUri_s contains "<old-key-version>"
| project TimeGenerated, OperationName, CallerIPAddress, requestUri_s, ResultType
| order by TimeGenerated desc
```

If the query returns no results over an appropriate observation period, you can proceed to disable the old key version.

### Disable the old key version

After you confirm that the old key version is no longer in use, disable it in Azure Key Vault.

```azurecli
az keyvault key set-attributes \
  --vault-name <your-key-vault-name> \
  --name <your-key-name> \
  --version <old-key-version> \
  --enabled false
```

> [!TIP]
> Prefer disabling an old key version before deleting it. This approach gives you a recovery option if you need to re-enable the previous version during troubleshooting.

## Related content

- [Data encryption at rest in Microsoft Discovery](concept-data-encryption-at-rest.md)
- [Role assignments in Microsoft Discovery](concept-role-assignments.md)
- [Customer-managed keys in Azure Monitor](/azure/azure-monitor/logs/customer-managed-keys)
- [Azure Key Vault documentation](/azure/key-vault/general/overview)