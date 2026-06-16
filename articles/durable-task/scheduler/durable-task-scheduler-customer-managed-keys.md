---
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: wangbill
title: "Configure customer-managed keys for Durable Task Scheduler (Preview)"
titleSuffix: Durable Task
description: Learn how to configure customer-managed keys for Durable Task Scheduler data encryption by using Azure Key Vault or Azure Managed HSM.
ms.topic: how-to
ms.service: durable-task
ms.subservice: durable-task-scheduler
ms.date: 06/08/2026
---

# Configure customer-managed keys for Durable Task Scheduler (preview)

Durable Task Scheduler encrypts data at rest by default. Customer-managed keys let you use a key that you own in Azure Key Vault or Azure Managed HSM for Durable Task Scheduler data encryption. Use customer-managed keys when your organization requires separation of duties, control over key lifecycle operations, or centralized auditing of key access.

With customer-managed keys, you're responsible for creating, protecting, rotating, and preserving the key. For detailed key lifecycle requirements and operational guidance, see [Azure SQL transparent data encryption with customer-managed key](/azure/azure-sql/database/transparent-data-encryption-byok-overview?view=azuresql).

> [!NOTE]
> Customer-managed keys for Durable Task Scheduler are currently in preview and require a [Dedicated SKU](/azure/durable-task/scheduler/durable-task-scheduler-billing#dedicated-sku-pricing-and-capacity) scheduler in a supported region.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli).
- A [Durable Task Scheduler](/azure/durable-task/scheduler/durable-task-scheduler) resource that uses the Dedicated SKU.
- An Azure Key Vault key or Azure Managed HSM key that meets the [requirements for configuring a TDE protector](/azure/azure-sql/database/transparent-data-encryption-byok-overview?view=azuresql&tabs=azurekeyvault%2Cazurekeyvaultrequirements%2Cazurekeyvaultrecommendations#key-requirements-for-configuring-tde-protector).
- Permissions to grant data-plane access on the key vault or managed HSM.

> [!IMPORTANT]
> Enable soft-delete and purge protection on the key vault or managed HSM before you configure customer-managed keys. If the key, key vault, or managed HSM is deleted, purged, disabled, expired, or no longer accessible to Durable Task Scheduler, the scheduler can become unavailable until access is restored.

## Prepare the key

Create or choose an Azure Key Vault key or Azure Managed HSM key. The key URI must use one of the following formats:

| Key store | Key URI format |
| --- | --- |
| Azure Key Vault | `https://<vault-name>.vault.azure.net/keys/<key-name>[/<key-version>]` |
| Azure Managed HSM | `https://<hsm-name>.managedhsm.azure.net/keys/<key-name>[/<key-version>]` |

Versioned and versionless key URIs are both supported. When you enable automatic rotation, we recommend a versionless key URI, such as `https://<vault-name>.vault.azure.net/keys/<key-name>`, so the Durable Task Scheduler configuration doesn't embed a specific key version. For more information, see [Using versioned and versionless Azure Key Vault keys for TDE](/azure/azure-sql/database/transparent-data-encryption-byok-overview?view=azuresql&tabs=azurekeyvault%2Cazurekeyvaultrequirements%2Cazurekeyvaultrecommendations#using-versioned-and-versionless-azure-key-vault-keys-for-tde).

## Grant Durable Task Scheduler access to the key

Durable Task Scheduler needs permission to read and use the key for encryption operations. Grant the Durable Task Scheduler service identity the minimum permissions required by your key store.

The Durable Task Scheduler service identity uses application ID `887c6b43-ba92-4adb-a82b-73670fc48dac`. This application ID isn't a secret.

### Ensure the service principal exists

The Durable Task Scheduler Microsoft application must have a service principal in your Microsoft Entra tenant before you assign key permissions. Creating the service principal makes the Durable Task Scheduler Microsoft application available in your tenant for permission assignment.

You can create the service principal by using Microsoft Entra methods such as [Azure CLI](https://learn.microsoft.com/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create), [Azure PowerShell](https://learn.microsoft.com/powershell/module/az.resources/new-azadserviceprincipal), or [Microsoft Graph](https://learn.microsoft.com/graph/api/serviceprincipal-post-serviceprincipals). Use the service principal object ID returned by any method when you grant key permissions.

The Azure CLI examples in this article use the following commands:

```azurecli
DTS_SERVICE_PRINCIPAL_APP_ID="887c6b43-ba92-4adb-a82b-73670fc48dac"

DTS_SERVICE_PRINCIPAL_OBJECT_ID=$(az ad sp show \
  --id "$DTS_SERVICE_PRINCIPAL_APP_ID" \
  --query id \
  --output tsv 2>/dev/null)

if [ -z "$DTS_SERVICE_PRINCIPAL_OBJECT_ID" ]; then
  DTS_SERVICE_PRINCIPAL_OBJECT_ID=$(az ad sp create \
    --id "$DTS_SERVICE_PRINCIPAL_APP_ID" \
    --query id \
    --output tsv)
fi
```

If you use Azure PowerShell, use the Durable Task Scheduler application ID to get or create the service principal:

```azurepowershell
$dtsServicePrincipalAppId = "887c6b43-ba92-4adb-a82b-73670fc48dac"

$dtsServicePrincipal = Get-AzADServicePrincipal `
  -ApplicationId $dtsServicePrincipalAppId

if ($null -eq $dtsServicePrincipal) {
  $dtsServicePrincipal = New-AzADServicePrincipal `
    -ApplicationId $dtsServicePrincipalAppId
}

$dtsServicePrincipalObjectId = $dtsServicePrincipal.Id
```

### Grant key permissions

Grant key permissions by using the access model for your key store.

### Azure Key Vault with Azure RBAC

Assign the **Key Vault Crypto Service Encryption User** role on the key vault:

```azurecli
KEY_VAULT_NAME="<key-vault-name>"

KEY_VAULT_ID=$(az keyvault show \
  --name "$KEY_VAULT_NAME" \
  --query id \
  --output tsv)

az role assignment create \
  --assignee-object-id "$DTS_SERVICE_PRINCIPAL_OBJECT_ID" \
  --assignee-principal-type ServicePrincipal \
  --role "Key Vault Crypto Service Encryption User" \
  --scope "$KEY_VAULT_ID"
```

For more information, see [Azure Key Vault RBAC built-in roles](/azure/key-vault/general/rbac-guide#azure-built-in-roles-for-key-vault-data-plane-operations).

### Azure Key Vault access policy

If your key vault uses the vault access policy permission model, grant `get`, `wrapKey`, and `unwrapKey` permissions:

```azurecli
KEY_VAULT_NAME="<key-vault-name>"

az keyvault set-policy \
  --name "$KEY_VAULT_NAME" \
  --object-id "$DTS_SERVICE_PRINCIPAL_OBJECT_ID" \
  --key-permissions get wrapKey unwrapKey
```

### Azure Managed HSM

Managed HSM uses local RBAC. Assign the **Managed HSM Crypto Service Encryption User** role at the key scope:

```azurecli
MANAGED_HSM_NAME="<managed-hsm-name>"
KEY_NAME="<key-name>"

az keyvault role assignment create \
  --hsm-name "$MANAGED_HSM_NAME" \
  --role "Managed HSM Crypto Service Encryption User" \
  --assignee "$DTS_SERVICE_PRINCIPAL_OBJECT_ID" \
  --scope "/keys/$KEY_NAME"
```

For more information, see [Managed HSM role management](/azure/key-vault/managed-hsm/role-management).

## Configure customer-managed keys

Use the `transparentDataEncryptions/default` child resource to configure the scheduler to use your key.

The Azure CLI examples in this article use the following variables:

```azurecli
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
RESOURCE_GROUP_NAME="<resource-group-name>"
SCHEDULER_NAME="<scheduler-name>"
KEY_VAULT_KEY_URI="https://<vault-name>.vault.azure.net/keys/<key-name>"

TDE_RESOURCE_URI="https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP_NAME}/providers/Microsoft.DurableTask/schedulers/${SCHEDULER_NAME}/transparentDataEncryptions/default?api-version=2026-05-01-preview"
```

### Azure CLI

Create or update the customer-managed key configuration:

```azurecli
az rest \
  --method put \
  --uri "$TDE_RESOURCE_URI" \
  --body "{
    \"properties\": {
      \"keySource\": \"CustomerManaged\",
      \"keyVaultKeyUri\": \"${KEY_VAULT_KEY_URI}\",
      \"autoRotationEnabled\": true
    }
  }"
```

### Bicep

Create a Bicep file:

```bicep
@description('Name of the existing Durable Task Scheduler resource.')
param schedulerName string

@description('Azure Key Vault or Azure Managed HSM key URI.')
param keyVaultKeyUri string

@description('Whether Durable Task Scheduler should automatically use the latest key version when one is available.')
param autoRotationEnabled bool = true

resource scheduler 'Microsoft.DurableTask/schedulers@2026-05-01-preview' existing = {
  name: schedulerName
}

resource transparentDataEncryption 'Microsoft.DurableTask/schedulers/transparentDataEncryptions@2026-05-01-preview' = {
  parent: scheduler
  name: 'default'
  properties: {
    keySource: 'CustomerManaged'
    keyVaultKeyUri: keyVaultKeyUri
    autoRotationEnabled: autoRotationEnabled
  }
}
```

Deploy the Bicep file:

```azurecli
az deployment group create \
  --resource-group "<resource-group-name>" \
  --template-file main.bicep \
  --parameters schedulerName="<scheduler-name>" keyVaultKeyUri="https://<vault-name>.vault.azure.net/keys/<key-name>" autoRotationEnabled=true
```

The update runs asynchronously. The response includes the current provisioning state for the `transparentDataEncryptions/default` child resource.

## Verify the configuration

Use the following command to read the customer-managed key configuration:

```azurecli
az rest \
  --method get \
  --uri "$TDE_RESOURCE_URI" \
  --query "properties.{provisioningState:provisioningState,keySource:keySource,keyVaultKeyUri:keyVaultKeyUri,autoRotationEnabled:autoRotationEnabled}" \
  --output table
```

The `provisioningState` value should become `Succeeded` after the update completes. If the state is `Failed`, restore key access and repeat the configure command.

## Rotate keys

When `autoRotationEnabled` is `true`, Durable Task Scheduler automatically uses the latest supported version of the configured key after a new version is available. Use a versionless key URI if you don't want the scheduler configuration to include a specific key version.

Keep previous key versions in the key vault or managed HSM. Older key versions can be required for backup and restore scenarios. For more information, see [Rotate the Transparent data encryption protector](/azure/azure-sql/database/transparent-data-encryption-byok-key-rotation?view=azuresql) and [Azure Key Vault key rotation](/azure/key-vault/keys/how-to-configure-key-rotation).

## Revert to Microsoft-managed encryption

To revert a scheduler to Microsoft-managed encryption, delete the `transparentDataEncryptions/default` child resource:

```azurecli
az rest \
  --method delete \
  --uri "$TDE_RESOURCE_URI"
```

After the delete operation completes, a `GET` request for the child resource returns `404 Not Found`, which indicates that no customer-managed key configuration exists for the scheduler.

## Important considerations

- **Dedicated SKU only**: Customer-managed keys are supported only for Dedicated SKU schedulers. Requests for Consumption SKU schedulers fail validation.
- **Key availability affects scheduler availability**: Don't disable, delete, purge, expire, or revoke access to the configured key unless you're intentionally making the scheduler unavailable. If access is lost, restore the key and permissions, then repeat the configure command to retry validation.
- **Key permissions are required before configuration**: The Durable Task Scheduler service identity must have `get`, `wrapKey`, and `unwrapKey` permissions before you create or update the customer-managed key configuration.
- **Use the latest key guidance**: Follow the Azure SQL customer-managed key recommendations for key protection, rotation, backup, restore, and inaccessible-key recovery. For more information, see [Azure SQL transparent data encryption with customer-managed key](/azure/azure-sql/database/transparent-data-encryption-byok-overview?view=azuresql).

## Related content

- [Durable Task Scheduler](/azure/durable-task/scheduler/durable-task-scheduler)
- [Durable Task Scheduler billing](/azure/durable-task/scheduler/durable-task-scheduler-billing)
- [Azure SQL transparent data encryption with customer-managed key](/azure/azure-sql/database/transparent-data-encryption-byok-overview?view=azuresql)
- [Azure Key Vault RBAC guide](/azure/key-vault/general/rbac-guide)
- [Managed HSM role management](/azure/key-vault/managed-hsm/role-management)
