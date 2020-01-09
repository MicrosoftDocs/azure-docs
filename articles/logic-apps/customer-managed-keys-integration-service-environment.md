---
title: Set up customer-managed keys to encrypt data at rest in ISEs
description: Create and manage your own encryption keys to secure data at rest for integration service environments (ISEs) in Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: klam, rarayudu, logicappspm
ms.topic: conceptual
ms.date: 01/14/2020
---

# Set up customer-managed keys to encrypt data at rest for integration service environments (ISEs) in Azure Logic Apps

Azure Logic Apps relies on Azure Storage to store data at rest and automatically [encrypt that data](../storage/common/storage-service-encryption.md) by using Azure Storage Service Encryption (Azure SSE). This encryption protects your data and helps you meet your organizational security and compliance commitments. By default, Azure Storage uses Microsoft-managed keys to encrypt your data.

When you create an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) for hosting your logic apps, and you want more control over the encryption keys used by Azure Storage, you can set up, use, and manage your own key by using [Azure Key Vault](../key-vault/key-vault-overview.md). This capability is also known as "Bring Your Own Key" (BYOK), and your key is called a "customer-managed key".

This topic shows how to set up and specify your own encryption key to use when you create your ISE. 

## Considerations

* You can specify a customer-managed key *only when you create your ISE*, not afterwards. You also can't disable this key after your ISE is created. Currently, no support exists for rotating a customer-managed key for an ISE.

* To support customer-managed keys, create an ISE that has an [external access endpoint](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md#ise-endpoint-access) and uses the [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md#how-does-the-managed-identities-for-azure-resources-work) to access resources in other Azure Active Directory (Azure AD) tenants. The managed identity authenticates access for your ISE so that you don't have to sign in with your own credentials.

* Currently, the only way to create an ISE that uses a customer-managed key and the system-assigned identity is by calling the Logic Apps REST API with an HTTPS PUT request. To perform this task, you can use a tool such as [Postman](https://www.getpostman.com/downloads/), or you can create a logic app.

* Within *30 minutes* after you send the HTTPS PUT request that creates your ISE, open your Azure key vault in the Azure portal, and [grant the system-assigned identity access to your key vault](#identity-access-to-key-vault). Otherwise, ISE creation fails and throws a permissions error.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* An Azure key vault, which has the **Soft Delete** and **Do Not Purge** properties enabled along with a key that you created with these property values:

  | Property | Value |
  |----------|-------|
  | **Key Type** | RSA |
  | **RSA Key Size** | 2048 |
  | **Enabled** | Yes |
  |||

  ![Create your customer-managed encryption key](./media/customer-managed-keys-integration-service-environment/create-customer-managed-key-for-encryption.png)

  If you're new to Azure Key Vault, learn [how to create a key vault](../key-vault/quick-create-portal.md#create-a-vault) and [how to configure customer-managed keys](../storage/common/storage-encryption-keys-portal.md) by using the Azure portal. Or, use the Azure PowerShell commands, [New-AzKeyVault](https://docs.microsoft.com/powershell/module/az.keyvault/new-azkeyvault) and [Add-AzKeyVaultKey](https://docs.microsoft.com/powershell/module/az.keyvault/Add-AzKeyVaultKey).

* A tool that you can use to create your ISE by calling the Logic Apps REST API with an HTTPS PUT request. For example, you can use [Postman](https://www.getpostman.com/downloads/), or you can build a logic app that performs this task.

<a name="enable-support-key-system-identity"></a>

## Create ISE with key and managed identity support

To create your ISE by calling the Logic Apps REST API, use this HTTPS PUT request:

`PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Logic/integrationServiceEnvironments/{integrationServiceEnvironmentName}?api-version=2018-07-01-preview`

In the request header, include the `Authorization` property and set the property's value to the bearer token associated with the customer who has access to the Azure subscription or resource group to use for the ISE. In the request body, enable support for these items in your ISE definition:

* External access endpoint
* Your key vault and the customer-managed key that you want to use
* The system-assigned managed identity that your ISE uses to access your key vault

Here's the syntax to use for these properties and values in your ISE definition:

```json
{
   <other-ISE-definition-properties>,
   "properties": {
      "networkConfiguration": {
         "accessEndpoint": {
            "type": "External"
         },
         "subnets": [
            {
               "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>/subnets/<subnet-1>",
               "type": "Microsoft.Network/virtualNetworks/subnets"
            },
            {
               "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>/subnets/<subnet-2>",
               "type": "Microsoft.Network/virtualNetworks/subnets"
            },
            {
               "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>/subnets/<subnet-3>",
               "type": "Microsoft.Network/virtualNetworks/subnets"
            },
            {
               "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group>/providers/Microsoft.Network/virtualNetworks/<virtual-network-name>/subnets/<subnet-4>",
               "type": "Microsoft.Network/virtualNetworks/subnets"
            }
         ]
      },
      "encryptionConfiguration": {
         "encryptionKeyReference": {
            "keyVault": {
               "name": "<key-vault-name>",
               "id": "subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group>/providers/Microsoft.KeyVault/vaults/<key-vault-name>",
               "type": "Microsoft.KeyVault/vaults"
            },
            "keyName": "<customer-managed-key-name>",
            "keyVersion": "<key-version-number>"
         }
      }
   },
   "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group>/providers/Microsoft.Logic/integrationServiceEnvironments/<ISE-name>",
   "name": "<ISE-name>",
   "type": "Microsoft.Logic/integrationServiceEnvironments",
   "location": "<Azure-region>",
   "identity": {
      "type": "SystemAssigned"
   }
}
```

For example:

```json
{
   <other-ISE-definition-properties>,
   "properties": {
      "networkConfiguration": {
         "accessEndpoint": {
            "type": "External"
         },
         "subnets": [
            {
               "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Network/virtualNetworks/Fabrikam-VNET/subnets/subnet-1",
               "type": "Microsoft.Network/virtualNetworks/subnets"
            },
            {
               "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Network/virtualNetworks/Fabrikam-VNET/subnets/subnet-2",
               "type": "Microsoft.Network/virtualNetworks/subnets"
            },
            {
               "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Network/virtualNetworks/Fabrikam-VNET/subnets/subnet-3",
               "type": "Microsoft.Network/virtualNetworks/subnets"
            },
            {
               "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Network/virtualNetworks/Fabrikam-VNET/subnets/subnet-4",
               "type": "Microsoft.Network/virtualNetworks/subnets"
            }
         ]
      },
      "encryptionConfiguration": {
         "encryptionKeyReference": {
            "keyVault": {
               "name": "FabrikamKeyVault",
               "id": "subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.KeyVault/vaults/FabrikamKeyVault",
               "type": "Microsoft.KeyVault/vaults"
            },
            "keyName": "Fabrikam-Encryption-Key",
            "keyVersion": "********************"
         }
      }
   },
   "id": "/subscriptions/********************/resourceGroups/Fabrikam-RG/providers/Microsoft.Logic/integrationServiceEnvironments/Fabrikam-ISE",
   "name": "Fabrikam-ISE",
   "type": "Microsoft.Logic/integrationServiceEnvironments",
   "location": "WestUS",
   "identity": {
      "type": "SystemAssigned"
   }
}
```

<a name="identity-access-to-key-vault"></a>

## Grant access to your key vault

Within *30 minutes* after you send the HTTP PUT request to create your ISE, you must give your ISE's system-assigned identity access to your key vault. Otherwise, creation for your ISE fails, and you get a permissions error. You can use either the Azure PowerShell [Set-AzKeyVaultAccessPolicy](https://docs.microsoft.com/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy) command, or you can follow these steps for the Azure portal:

1. In the [Azure portal](https://portal.azure.com), open your Azure key vault. From your key vault's menu, select **Access control (IAM)**.

1. On the toolbar, select **Add** > **Add role assignment**.

   > [!TIP]
   > If the Add role assignment option is disabled, you most likely don't have permissions. 
   > For more information about the permissions that let you manage roles for resources, see 
   > [Administrator role permissions in Azure Active Directory](../active-directory/users-groups-roles/directory-assign-admin-roles.md).

1. On the **Add role assignment** pane, select these values:

   * **Role**: Contributor
   * **Assign access to**: Azure AD user, group, or service principal
   * **Select**: The name for your ISE

1. When you're done, select **Save**.

For more information, see [Add or remove role assignments using Azure RBAC and the Azure portal](../role-based-access-control/role-assignments-portal.md).

## Next steps

* Learn more about [Azure Key Vault](../key-vault/key-vault-overview.md)