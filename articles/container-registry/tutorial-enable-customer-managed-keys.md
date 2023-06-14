---
title: Enable a customer-managed key
description: In this tutorial, learn how to encrypt your Premium registry with a customer-managed key stored in Azure Key Vault.
ms.topic: tutorial
ms.custom: devx-track-azurecli
ms.date: 08/5/2022
ms.author: tejaswikolli
---

# Enable a customer-managed key

This article is part two in a four-part tutorial series. [Part one](tutorial-customer-managed-keys.md) provides an overview of customer-managed keys, their features, and considerations before you enable one on your registry. This article walks you through the steps of enabling a customer-managed key by using the Azure CLI, the Azure portal, or an Azure Resource Manager template.

## Prerequisites

* [Install the Azure CLI][azure-cli] or prepare to use [Azure Cloud Shell](../cloud-shell/quickstart.md).
* Sign in to the [Azure portal](https://portal.azure.com/). 

## Enable a customer-managed key by using the Azure CLI

### Create a resource group

Run the [az group create][az-group-create] command to create a resource group that will hold your key vault, container registry, and other required resources:

```azurecli
az group create --name <resource-group-name> --location <location>
```

### Create a user-assigned managed identity

Configure a user-assigned [managed identity](../active-directory/managed-identities-azure-resources/overview.md) for the registry so that you can access the key vault:

1. Run the [az identity create][az-identity-create] command to create the managed identity:

   ```azurecli
   az identity create \
     --resource-group <resource-group-name> \
     --name <managed-identity-name>
   ```

2. In the command output, take note of the `id` and `principalId` values to configure registry access with the key vault:

   ```JSON
   {
     "clientId": "xxxx2bac-xxxx-xxxx-xxxx-192cxxxx6273",
     "clientSecretUrl": "https://control-eastus.identity.azure.net/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myresourcegroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myidentityname/credentials?tid=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx&oid=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx&aid=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
     "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myresourcegroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myresourcegroup",
     "location": "eastus",
     "name": "myidentityname",
     "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
     "resourceGroup": "myresourcegroup",
     "tags": {},
     "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
     "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
   }
   ```

3. For convenience, store the `id` and `principalId` values in environment variables:

   ```azurecli
   identityID=$(az identity show --resource-group <resource-group-name> --name <managed-identity-name> --query 'id' --output tsv)

   identityPrincipalID=$(az identity show --resource-group <resource-group-name> --name <managed-identity-name> --query 'principalId' --output tsv)
   ```

### Create a key vault

1. Run the [az keyvault create][az-keyvault-create] command to create a key vault where you can store a customer-managed key for registry encryption. 

2. By default, the new key vault automatically enables the *soft delete* setting. To prevent data loss from accidental deletion of keys or key vaults, we recommend enabling the *purge protection* setting:

   ```azurecli
   az keyvault create --name <key-vault-name> \
     --resource-group <resource-group-name> \
     --enable-purge-protection
   ```

3. For convenience, take a note of the key vault's resource ID and store the value in environment variables:

   ```azurecli
   keyvaultID=$(az keyvault show --resource-group <resource-group-name> --name <key-vault-name> --query 'id' --output tsv)
   ```

#### Enable trusted services to access the key vault

If the key vault is in protection with a firewall or virtual network (private endpoint), you must enable the network settings to allow access by [trusted Azure services](../key-vault/general/overview-vnet-service-endpoints.md#trusted-services). For more information, see [Configure Azure Key Vault networking settings](../key-vault/general/how-to-azure-key-vault-network-security.md?tabs=azure-cli).

#### Enable managed identities to access the key vault

There are two ways to enable managed identities to access your key vault.

The first option is to configure the access policy for the key vault and set key permissions for access with a user-assigned managed identity:

1. Run the [az keyvault set policy][az-keyvault-set-policy] command. Pass the previously created and stored environment variable value of `principalID`.
 
2. Set key permissions to `get`, `unwrapKey`, and `wrapKey`:  

   ```azurecli
   az keyvault set-policy \
     --resource-group <resource-group-name> \
     --name <key-vault-name> \
     --object-id $identityPrincipalID \
     --key-permissions get unwrapKey wrapKey

   ```

The second option is to use [Azure role-based access control (RBAC)](../key-vault/general/rbac-guide.md) to assign permissions to the user-assigned managed identity and access the key vault. Run the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command and assign the `Key Vault Crypto Service Encryption User` role to a user-assigned managed identity:

```azurecli
az role assignment create --assignee $identityPrincipalID \
  --role "Key Vault Crypto Service Encryption User" \
  --scope $keyvaultID
```

### Create a key and get the key ID

1. Run the [az keyvault key create][az-keyvault-key-create] command to create a key in the key vault:

   ```azurecli
   az keyvault key create \
     --name <key-name> \
     --vault-name <key-vault-name>
   ```

2. In the command output, take note of the key ID (`kid`): 

   ```output
   [...]
     "key": {
       "crv": null,
       "d": null,
       "dp": null,
       "dq": null,
       "e": "AQAB",
       "k": null,
       "keyOps": [
         "encrypt",
         "decrypt",
         "sign",
         "verify",
         "wrapKey",
         "unwrapKey"
       ],
       "kid": "https://mykeyvault.vault.azure.net/keys/mykey/<version>",
       "kty": "RSA",
   [...]
   ```

3. For convenience, store the format that you choose for the key ID in the `$keyID` environment variable. You can use a key ID with or without a version.

#### Key rotation

You can choose manual or automatic key rotation.

Encrypting a registry with a customer-managed key that has a key version will allow only manual key rotation in Azure Container Registry. This example stores the key's `kid` property:

```azurecli
keyID=$(az keyvault key show \
  --name <keyname> \
  --vault-name <key-vault-name> \
  --query 'key.kid' --output tsv)
```

Encrypting a registry with a customer-managed key by omitting a key version will enable automatic key rotation to detect a new key version in Azure Key Vault. This example removes the version from the key's `kid` property:

```azurecli
keyID=$(az keyvault key show \
  --name <keyname> \
  --vault-name <key-vault-name> \
  --query 'key.kid' --output tsv)

keyID=$(echo $keyID | sed -e "s/\/[^/]*$//")
```

### Create a registry with a customer-managed key

1. Run the [az acr create][az-acr-create] command to create a registry in the *Premium* service tier and enable the customer-managed key. 

2. Pass the managed identity ID (`id`) and key ID (`kid`) values stored in the environment variables in previous steps:

   ```azurecli
   az acr create \
     --resource-group <resource-group-name> \
     --name <container-registry-name> \
     --identity $identityID \
     --key-encryption-key $keyID \
     --sku Premium
   ```

### Show encryption status

Run the [az acr encryption show][az-acr-encryption-show] command to show the status of the registry encryption with a customer-managed key:

```azurecli
az acr encryption show --name <container-registry-name>
```

Depending on the key that's used to encrypt the registry, the output is similar to:

```console
{
  "keyVaultProperties": {
    "identity": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "keyIdentifier": "https://myvault.vault.azure.net/keys/myresourcegroup/abcdefg123456789...",
    "keyRotationEnabled": true,
    "lastKeyRotationTimestamp": xxxxxxxx
    "versionedKeyIdentifier": "https://myvault.vault.azure.net/keys/myresourcegroup/abcdefg123456789...",
  },
  "status": "enabled"
}
```

## Enable a customer-managed key by using the Azure portal

### Create a user-assigned managed identity

To create a user-assigned [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) in the Azure portal: 

1. Follow the steps to [create a user-assigned identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

2. Save the identity's name to use it in later steps.

:::image type="content" source="media/container-registry-customer-managed-keys/create-managed-identity.png" alt-text="Screenshot of the options for creating a user-assigned identity in the Azure portal.":::

### Create a key vault

1. Follow the steps in [Quickstart: Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md).

2. When you're creating a key vault for a customer-managed key, on the **Basics** tab, enable the **Purge protection** setting. This setting helps prevent data loss from accidental deletion of keys or key vaults.

   :::image type="content" source="media/container-registry-customer-managed-keys/create-key-vault.png" alt-text="Screenshot of the options for creating a key vault in the Azure portal.":::

#### Enable trusted services to access the key vault

If the key vault is in protection with a firewall or virtual network (private endpoint), enable the network setting to allow access by [trusted Azure services](../key-vault/general/overview-vnet-service-endpoints.md#trusted-services). For more information, see [Configure Azure Key Vault networking settings](../key-vault/general/how-to-azure-key-vault-network-security.md?tabs=azure-portal).

#### Enable managed identities to access the key vault

There are two ways to enable managed identities to access your key vault.

The first option is to configure the access policy for the key vault and set key permissions for access with a user-assigned managed identity:

1. Go to your key vault.
2. Select **Settings** > **Access policies > +Add Access Policy**.
3. Select **Key permissions**, and then select **Get**, **Unwrap Key**, and **Wrap Key**.
4. In **Select principal**, select the resource name of your user-assigned managed identity.  
5. Select **Add**, and then select **Save**.

:::image type="content" source="media/container-registry-customer-managed-keys/add-key-vault-access-policy.png" alt-text="Screenshot of options for creating a key vault access policy.":::

The other option is to assign the `Key Vault Crypto Service Encryption User` RBAC role to the user-assigned managed identity at the key vault scope. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

### Create a key 

Create a key in the key vault and use it to encrypt the registry. Follow these steps if you want to select a specific key version as a customer-managed key. You might also need to create a key before creating the registry if key vault access is restricted to a private endpoint or selected networks. 

1. Go to your key vault.
1. Select **Settings** > **Keys**.
1. Select **+Generate/Import** and enter a unique name for the key.
1. Accept the remaining default values, and then select **Create**.
1. After creation, select the key and then select the current version. Copy the **Key identifier** for the key version.

### Create a container registry

1. Select **Create a resource** > **Containers** > **Container Registry**.
1. On the **Basics** tab, select or create a resource group, and then enter a registry name. In **SKU**, select **Premium**.
1. On the **Encryption** tab, for **Customer-managed key**, select **Enabled**.
1. For **Identity**, select the managed identity that you created.
1. For **Encryption**, choose one of the following options:
    * Choose **Select from Key Vault**, and then either select an existing key vault and key or select **Create new**. The key that you select is unversioned and enables automatic key rotation.
    * Select **Enter key URI**, and provide the identifier of an existing key. You can provide either a versioned key URI (for a key that must be rotated manually) or an unversioned key URI (which enables automatic key rotation). See the previous section for steps to create a key.
1. Select **Review + create**.
1. Select **Create** to deploy the registry instance.

:::image type="content" source="media/container-registry-customer-managed-keys/create-encrypted-registry.png" alt-text="Screenshot that shows options for creating an encrypted registry in the Azure portal.":::

### Show the encryption status

To see the encryption status of your registry in the portal, go to your registry. Under **Settings**, select **Encryption**.

## Enable a customer-managed key by using a Resource Manager template

You can use a Resource Manager template to create a container registry and enable encryption with a customer-managed key: 

1. Copy the following content of a Resource Manager template to a new file and save it as *CMKtemplate.json*:

   ```json
   {
     "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
     "contentVersion": "1.0.0.0",
     "parameters": {
       "vault_name": {
         "defaultValue": "",
         "type": "String"
       },
       "registry_name": {
         "defaultValue": "",
         "type": "String"
       },
       "identity_name": {
         "defaultValue": "",
         "type": "String"
       },
       "kek_id": {
         "type": "String"
       }
     },
     "variables": {},
     "resources": [
       {
         "type": "Microsoft.ContainerRegistry/registries",
         "apiVersion": "2019-12-01-preview",
         "name": "[parameters('registry_name')]",
         "location": "[resourceGroup().location]",
         "sku": {
           "name": "Premium",
           "tier": "Premium"
         },
         "identity": {
           "type": "UserAssigned",
           "userAssignedIdentities": {
             "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identity_name'))]": {}
           }
         },
         "dependsOn": [
           "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identity_name'))]"
         ],
         "properties": {
           "adminUserEnabled": false,
           "encryption": {
             "status": "enabled",
             "keyVaultProperties": {
               "identity": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identity_name')), '2018-11-30').clientId]",
               "KeyIdentifier": "[parameters('kek_id')]"
             }
           },
           "networkRuleSet": {
             "defaultAction": "Allow",
             "virtualNetworkRules": [],
             "ipRules": []
           },
           "policies": {
             "quarantinePolicy": {
               "status": "disabled"
             },
             "trustPolicy": {
               "type": "Notary",
               "status": "disabled"
             },
             "retentionPolicy": {
               "days": 7,
               "status": "disabled"
             }
           }
         }
       },
       {
         "type": "Microsoft.KeyVault/vaults/accessPolicies",
         "apiVersion": "2018-02-14",
         "name": "[concat(parameters('vault_name'), '/add')]",
         "dependsOn": [
           "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identity_name'))]"
         ],
         "properties": {
           "accessPolicies": [
             {
               "tenantId": "[subscription().tenantId]",
               "objectId": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('identity_name')), '2018-11-30').principalId]",
               "permissions": {
                 "keys": [
                   "get",
                   "unwrapKey",
                   "wrapKey"
                 ]
               }
             }
           ]
         }
       },
       {
         "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
         "apiVersion": "2018-11-30",
         "name": "[parameters('identity_name')]",
         "location": "[resourceGroup().location]"
       }
     ]
   }
   ```

2. Follow the steps in the previous sections to create the following resources:

   * Key vault, identified by name
   * Key vault key, identified by key ID

3. Run the [az deployment group create][az-deployment-group-create] command to create the registry by using the preceding template file. When indicated, provide a new registry name and a user-assigned managed identity name, along with the key vault name and key ID that you created.

   ```azurecli
   az deployment group create \
     --resource-group <resource-group-name> \
     --template-file CMKtemplate.json \
     --parameters \
       registry_name=<registry-name> \
       identity_name=<managed-identity> \
       vault_name=<key-vault-name> \
       key_id=<key-vault-key-id>
   ```

4. Run the [az acr encryption show][az-acr-encryption-show] command to show the status of registry encryption:

   ```azurecli
   az acr encryption show --name <registry-name>
   ```

## Next steps

Advance to the [next article](tutorial-rotate-revoke-customer-managed-keys.md) to walk through rotating customer-managed keys, updating key versions, and revoking a customer-managed key. 


<!-- LINKS - external -->

<!-- LINKS - internal -->

[azure-cli]: /cli/azure/install-azure-cli
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-show]: /cli/azure/feature#az_feature_show
[az-group-create]: /cli/azure/group#az_group_create
[az-identity-create]: /cli/azure/identity#az_identity_create
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-deployment-group-create]: /cli/azure/deployment/group#az_deployment_group_create
[az-keyvault-create]: /cli/azure/keyvault#az_keyvault_create
[az-keyvault-key-create]: /cli/azure/keyvault/key#az_keyvault_key_create
[az-keyvault-key]: /cli/azure/keyvault/key
[az-keyvault-set-policy]: /cli/azure/keyvault#az_keyvault_set_policy
[az-keyvault-delete-policy]: /cli/azure/keyvault#az_keyvault_delete_policy
[az-resource-show]: /cli/azure/resource#az_resource_show
[az-acr-create]: /cli/azure/acr#az_acr_create
[az-acr-show]: /cli/azure/acr#az_acr_show
[az-acr-encryption-rotate-key]: /cli/azure/acr/encryption#az_acr_encryption_rotate_key
[az-acr-encryption-show]: /cli/azure/acr/encryption#az_acr_encryption_show
