---
title: Configure cross-tenant customer-managed keys for your Azure Cosmos DB account with Azure Key Vault (preview)
description: Learn how to configure encryption with customer-managed keys for Azure Cosmos DB using an Azure Key Vault that resides in a different tenant.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.custom: ignite-2022, devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template
ms.topic: how-to
ms.date: 09/27/2022
ms.reviewer: turao
---

# Configure cross-tenant customer-managed keys for your Azure Cosmos DB account with Azure Key Vault

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Data stored in your Azure Cosmos DB account is automatically and seamlessly encrypted with service-managed keys managed by Microsoft. However, you can choose to add a second layer of encryption with keys you manage. These keys are known as customer-managed keys (or CMK). Customer-managed keys are stored in an Azure Key Vault instance.

This article walks through how to configure encryption with customer-managed keys at the time that you create an Azure Cosmos DB account. In this example cross-tenant scenario, the Azure Cosmos DB account resides in a tenant managed by an Independent Software Vendor (ISV) referred to as the service provider. The key used for encryption of the Azure Cosmos DB account resides in a key vault in a different tenant that is managed by the customer.


[!INCLUDE [active-directory-msi-cross-tenant-cmk-overview](../../includes/active-directory-msi-cross-tenant-cmk-overview.md)]

[!INCLUDE [active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault](../../includes/active-directory-msi-cross-tenant-cmk-create-identities-authorize-key-vault.md)]

## Create a new Azure Cosmos DB account encrypted with a key from a different tenant


Up to this point, you've configured the multi-tenant application on the service provider's tenant. You've also installed the application on the customer's tenant and configured the key vault and key on the customer's tenant. Next you can create an Azure Cosmos DB account on the service provider's tenant and configure customer-managed keys with the key from the customer's tenant.

When creating an Azure Cosmos DB account with customer-managed keys, we must ensure that it has access to the keys the customer used. In single-tenant scenarios, either give direct key vault access to the Azure Cosmos DB principal or use a specific managed identity. In a cross-tenant scenario, we can no longer depend on direct access to the key vault as it is in another tenant managed by the customer. This constraint is the reason in the previous sections we created a cross-tenant application and registered a managed identity inside the application to give it access to the customer's key vault. This managed identity, coupled with the cross-tenant application ID, is what we'll use when creating the cross-tenant CMK Azure Cosmos DB Account. For more information, see the [Phase 3 - The service provider encrypts data in an Azure resource using the customer-managed key](#phase-3---the-service-provider-encrypts-data-in-an-azure-resource-using-the-customer-managed-key) section of this article.

Whenever a new version of the key is available in the key vault, it will be automatically updated on the Azure Cosmos DB account.

## Using Azure Resource Manager JSON templates

Deploy an ARM template with the following specific parameters:

> [!NOTE]
> If you are recreating this sample in one of your Azure Resource Manager templates, use an `apiVersion` of `2022-05-15`.

| Parameter | Description | Example value |
| --- | --- | --- |
| `keyVaultKeyUri` | Identifier of the customer-managed key residing in the service provider's key vault. | `https://my-vault.vault.azure.com/keys/my-key` |
| `identity` | Object specifying that the managed identity should be assigned to the Azure Cosmos DB account. | `"identity":{"type":"UserAssigned","userAssignedIdentities":{"/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-identity":{}}}` |
| `defaultIdentity` | Combination of the resource ID of the managed identity and the application ID of the multi-tenant Azure Active Directory application. | `UserAssignedIdentity=/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-identity&FederatedClientId=11111111-1111-1111-1111-111111111111` |

Here's an example of a template segment with the three parameters configured:

```json
{
  "kind": "GlobalDocumentDB",
  "location": "East US 2",
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-identity": {}
    }
  },
  "properties": {
    "locations": [
      {
        "locationName": "East US 2",
        "failoverPriority": 0,
        "isZoneRedundant": false
      }
    ],
    "databaseAccountOfferType": "Standard",
    "keyVaultKeyUri": "https://my-vault.vault.azure.com/keys/my-key",
    "defaultIdentity": "UserAssignedIdentity=/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-identity&FederatedClientId=11111111-1111-1111-1111-111111111111"
  }
}
```

> [!IMPORTANT]
> This feature is not yet supported in Azure PowerShell, Azure CLI, or the Azure portal.

You can't configure customer-managed keys with a specific version of the key version when you create a new Azure Cosmos DB account. The key itself must be passed with no versions and no trailing backslashes.

To Revoke or Disable customer-managed keys, see [configure customer-managed keys for your Azure Cosmos DB account with Azure Key Vault](how-to-setup-customer-managed-keys.md)

## See also

- [Configure customer-managed keys for your Azure Cosmos account with Azure Key Vault](how-to-setup-cmk.md)
