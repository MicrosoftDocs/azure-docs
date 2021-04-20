---
title: Encrypt registry with a customer-managed key
description: Learn about encryption-at-rest of your Azure container registry, and how to encrypt your Premium registry with a customer-managed key stored in Azure Key Vault
ms.topic: article
ms.date: 03/03/2021
ms.custom:
---

# Encrypt registry using a customer-managed key

When you store images and other artifacts in an Azure container registry, Azure automatically encrypts the registry content at rest with [service-managed keys](../security/fundamentals/encryption-models.md). You can supplement default encryption with an additional encryption layer using a key that you create and manage in Azure Key Vault (a customer-managed key). This article walks you through the steps using the Azure CLI, the Azure portal, or a Resource Manager template.

Server-side encryption with customer-managed keys is supported through integration with [Azure Key Vault](../key-vault/general/overview.md): 

* You can create your own encryption keys and store them in a key vault, or use Azure Key Vault's APIs to generate keys. 
* With Azure Key Vault, you can also audit key usage.
* Azure Container Registry supports automatic rotation of registry encryption keys when a new key version is available in Azure Key Vault. You can also manually rotate registry encryption keys.

This feature is available in the **Premium** container registry service tier. For information about registry service tiers and limits, see [Azure Container Registry service tiers](container-registry-skus.md).


## Things to know

* You can currently enable a customer-managed key only when you create a registry. When enabling the key, you configure a *user-assigned* managed identity to access the key vault.
* After enabling encryption with a customer-managed key on a registry, you can't disable the encryption.  
* Azure Container Registry supports only RSA or RSA-HSM keys. Elliptic curve keys aren't currently supported.
* [Content trust](container-registry-content-trust.md) is currently not supported in a registry encrypted with a customer-managed key.
* In a registry encrypted with a customer-managed key, run logs for [ACR Tasks](container-registry-tasks-overview.md) are currently retained for only 24 hours. If you need to retain logs for a longer period, see guidance to [export and store task run logs](container-registry-tasks-logs.md#alternative-log-storage).


> [!IMPORTANT]
> If you plan to store the registry encryption key in an existing Azure key vault that denies public access and allows only private endpoint or selected virtual networks, extra configuration steps are needed. See [Advanced scenario: Key Vault firewall](#advanced-scenario-key-vault-firewall) in this article.

## Automatic or manual update of key versions

An important consideration for the security of a registry encrypted with a customer-managed key is how frequently you update (rotate) the encryption key. Your organization might have compliance policies that require regularly updating key [versions](../key-vault/general/about-keys-secrets-certificates.md#objects-identifiers-and-versioning) stored in Azure Key Vault when used as customer-managed keys. 

When you configure registry encryption with a customer-managed key, you have two options for updating the key version used for encryption:

* **Automatically update the key version** - To automatically update a customer-managed key when a new version is available in Azure Key Vault, omit the key version when you enable registry encryption with a customer-managed key. When a registry is encrypted with a non-versioned key, Azure Container Registry regularly checks the key vault for a new key version and updates the customer-managed key within 1 hour. Azure Container Registry automatically uses the latest version of the key.

* **Manually update the key version** - To use a specific version of a key for registry encryption, specify that key version when you enable registry encryption with a customer-managed key. When a registry is encrypted with a specific key version, Azure Container Registry uses that version for encryption until you manually rotate the customer-managed key.

For details, see [Choose key ID with or without key version](#choose-key-id-with-or-without-key-version) and [Update key version](#update-key-version), later in this article.

## Prerequisites

To use the Azure CLI steps in this article, you need Azure CLI version 2.2.0 or later, or Azure Cloud Shell. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Enable customer-managed key - CLI

### Create a resource group

If needed, run the [az group create][az-group-create] command to create a resource group for creating the key vault, container registry, and other required resources.

```azurecli
az group create --name <resource-group-name> --location <location>
```

### Create a user-assigned managed identity

Create a user-assigned [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) with the [az identity create][az-identity-create] command. This identity will be used by your registry to access the Key Vault service.

```azurecli
az identity create \
  --resource-group <resource-group-name> \
  --name <managed-identity-name>
```

In the command output, take note of the following values: `id` and `principalId`. You need these values in later steps to configure registry access to the key vault.

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

For convenience, store these values in environment variables:

```azurecli
identityID=$(az identity show --resource-group <resource-group-name> --name <managed-identity-name> --query 'id' --output tsv)

identityPrincipalID=$(az identity show --resource-group <resource-group-name> --name <managed-identity-name> --query 'principalId' --output tsv)
```

### Create a key vault

Create a key vault with [az keyvault create][az-keyvault-create] to store a customer-managed key for registry encryption. 

By default, the **soft delete** setting is automatically enabled in a new key vault. To prevent data loss caused by accidental key or key vault deletions, also enable the **purge protection** setting.

```azurecli
az keyvault create --name <key-vault-name> \
  --resource-group <resource-group-name> \
  --enable-purge-protection
```

For use in later steps, get the resource ID of the key vault:

```azurecli
keyvaultID=$(az keyvault show --resource-group <resource-group-name> --name <key-vault-name> --query 'id' --output tsv)
```

### Enable key vault access

Configure a policy for the key vault so that the identity can access it. In the following [az keyvault set-policy][az-keyvault-set-policy] command, you pass the principal ID of the managed identity that you created, stored previously in an environment variable. Set key permissions to **get**, **unwrapKey**, and **wrapKey**.  

```azurecli
az keyvault set-policy \
  --resource-group <resource-group-name> \
  --name <key-vault-name> \
  --object-id $identityPrincipalID \
  --key-permissions get unwrapKey wrapKey
```

Alternatively, use [Azure RBAC for Key Vault](../key-vault/general/rbac-guide.md) to assign permissions to the identity to access the key vault. For example, assign the Key Vault Crypto Service Encryption role to the identity using the [az role assignment create](/cli/azure/role/assignment#az_role_assignment_create) command:

```azurecli 
az role assignment create --assignee $identityPrincipalID \
  --role "Key Vault Crypto Service Encryption User" \
  --scope $keyvaultID
```

### Create key and get key ID

Run the [az keyvault key create][az-keyvault-key-create] command to create a key in the key vault.

```azurecli
az keyvault key create \
  --name <key-name> \
  --vault-name <key-vault-name>
```

In the command output, take note of the key's ID, `kid`. You use this ID in the next step:

```JSON
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

### Choose key ID with or without key version

For convenience, store the format you choose for the key ID in the $keyID environment variable. You can use a key ID with a version or a key without a version.

#### Manual key rotation - key ID with version

When used to encrypt a registry with a customer-managed key, this key allows only manual key rotation in Azure Container Registry.

This example stores the key's `kid` property:

```azurecli
keyID=$(az keyvault key show \
  --name <keyname> \
  --vault-name <key-vault-name> \
  --query 'key.kid' --output tsv)
```

#### Automatic key rotation - key ID omitting version 

When used to encrypt a registry with a customer-managed key, this key enables automatic key rotation when a new key version is detected in Azure Key Vault.

This example removes the version from the key's `kid` property:

```azurecli
keyID=$(az keyvault key show \
  --name <keyname> \
  --vault-name <key-vault-name> \
  --query 'key.kid' --output tsv)

keyID=$(echo $keyID | sed -e "s/\/[^/]*$//")
```

### Create a registry with customer-managed key

Run the [az acr create][az-acr-create] command to create a registry in the Premium service tier and enable the customer-managed key. Pass the managed identity ID and the key ID, stored previously in environment variables:

```azurecli
az acr create \
  --resource-group <resource-group-name> \
  --name <container-registry-name> \
  --identity $identityID \
  --key-encryption-key $keyID \
  --sku Premium
```

### Show encryption status

To show whether registry encryption with a customer-managed key is enabled, run the [az acr encryption show][az-acr-encryption-show] command:

```azurecli
az acr encryption show --name <registry-name>
```

Depending on the key used to encrypt the registry, output is similar to:

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

## Enable customer-managed key - portal

### Create a managed identity

Create a user-assigned [managed identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) in the Azure portal. For steps, see [Create a user-assigned identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

You use the identity's name in later steps.

:::image type="content" source="media/container-registry-customer-managed-keys/create-managed-identity.png" alt-text="Create user-assigned identity in the Azure portal":::

### Create a key vault

For steps to create a key vault, see [Quickstart: Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md).

When creating a key vault for a customer-managed key, in the **Basics** tab, enable the **Purge protection** setting. This setting helps prevent data loss caused by accidental key or key vault deletions.

:::image type="content" source="media/container-registry-customer-managed-keys/create-key-vault.png" alt-text="Create key vault in the Azure portal":::

### Enable key vault access

Configure a policy for the key vault so that the identity can access it.

1. Navigate to your key vault.
1. Select **Settings** > **Access policies > +Add Access Policy**.
1. Select **Key permissions**, and select **Get**, **Unwrap Key**, and **Wrap Key**.
1. In **Select principal**, select the resource name of your user-assigned managed identity.  
1. Select **Add**, then select **Save**.

:::image type="content" source="media/container-registry-customer-managed-keys/add-key-vault-access-policy.png" alt-text="Create key vault access policy":::

Alternatively, use [Azure RBAC for Key Vault](../key-vault/general/rbac-guide.md) to assign permissions to the identity to access the key vault. For example, assign the Key Vault Crypto Service Encryption role to the identity.

1. Navigate to your key vault.
1. Select **Access control (IAM)** > **+Add** > **Add role assignment**.
1. In the **Add role assignment** window:
    1. Select **Key Vault Crypto Service Encryption User** role. 
    1. Assign access to **User assigned managed identity**.
    1. Select the resource name of your user-assigned managed identity, and select **Save**.

### Create key (optional)

Optionally create a key in the key vault for use to encrypt the registry. Follow these steps if you want to select a specific key version as a customer-managed key. 

1. Navigate to your key vault.
1. Select **Settings** > **Keys**.
1. Select **+Generate/Import** and enter a unique name for the key.
1. Accept the remaining default values and select **Create**.
1. After creation, select the key and then select the current version. Copy the **Key identifier** for the key version.

### Create Azure container registry

1. Select **Create a resource** > **Containers** > **Container Registry**.
1. In the **Basics** tab, select or create a resource group, and enter a registry name. In **SKU**, select **Premium**.
1. In the **Encryption** tab, in **Customer-managed key**, select **Enabled**.
1. In **Identity**, select the managed identity you created.
1. In **Encryption**, choose either of the following:
    * Select **Select from Key Vault**, and select an existing key vault and key, or **Create new**. The key you select is non-versioned and enables automatic key rotation.
    * Select **Enter key URI**, and provide a key identifier directly. You can provide either a versioned key URI (for a key that must be rotated manually) or a non-versioned key URI (which enables automatic key rotation). 
1. In the **Encryption** tab, select **Review + create**.
1. Select **Create** to deploy the registry instance.

:::image type="content" source="media/container-registry-customer-managed-keys/create-encrypted-registry.png" alt-text="Create encrypted registry in the Azure portal":::

To see the encryption status of your registry in the portal, navigate to your registry. Under **Settings**, select  **Encryption**.

## Enable customer-managed key - template

You can also use a Resource Manager template to create a registry and enable encryption with a customer-managed key.

The following template creates a new container registry and a user-assigned managed identity. Copy the following contents to a new file and save it using a filename such as `CMKtemplate.json`.

```JSON
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

Follow the steps in the previous sections to create the following resources:

* Key vault, identified by name
* Key vault key, identified by key ID

Run the following [az deployment group create][az-deployment-group-create] command to create the registry using the preceding template file. Where indicated, provide a new registry name and managed identity name, as well as the key vault name and key ID you created.

```bash
az deployment group create \
  --resource-group <resource-group-name> \
  --template-file CMKtemplate.json \
  --parameters \
    registry_name=<registry-name> \
    identity_name=<managed-identity> \
    vault_name=<key-vault-name> \
    kek_id=<key-vault-key-id>
```

### Show encryption status

To show the status of registry encryption, run the [az acr encryption show][az-acr-encryption-show] command:

```azurecli
az acr encryption show --name <registry-name>
```

## Use the registry

After enabling a customer-managed key in a registry, you can perform the same registry operations that you perform in a registry that's not encrypted with a customer-managed key. For example, you can authenticate with the registry and push Docker images. See example commands in [Push and pull an image](container-registry-get-started-docker-cli.md).

## Rotate key

Update the key version in Azure Key Vault, or create a new key, and then update the registry to encrypt data using the key. You can perform these steps using the Azure CLI or in the portal.

When rotating a key, typically you specify the same identity used when creating the registry. Optionally, configure a new user-assigned identity for key access, or enable and specify the registry's system-assigned identity.

> [!NOTE]
> Ensure that the required [key vault access](#enable-key-vault-access) is set for the identity you configure for key access.

### Update key version

A common scenario is to update the version of the key used as a customer-managed key. Depending on how the registry encryption is configured, the customer-managed key in Azure Container Registry is automatically updated, or must be manually updated.

### Azure CLI

Use [az keyvault key][az-keyvault-key] commands to create or manage your key vault keys. To create a new key version, run the [az keyvault key create][az-keyvault-key-create] command:

```azurecli
# Create new version of existing key
az keyvault key create \
  –-name <key-name> \
  --vault-name <key-vault-name>
```

The next step depends on how the registry encryption is configured:

* If the registry is configured to detect key version updates, the customer-managed key is updated automatically within 1 hour.

* If the registry is configured to require manual updating for a new key version, run the [az acr encryption rotate-key][az-acr-encryption-rotate-key] command, passing the new key ID and the identity you want to configure:

To update the customer-managed key version manually:

```azurecli
# Rotate key and use user-assigned identity
az acr encryption rotate-key \
  --name <registry-name> \
  --key-encryption-key <new-key-id> \
  --identity <principal-id-user-assigned-identity>

# Rotate key and use system-assigned identity
az acr encryption rotate-key \
  --name <registry-name> \
  --key-encryption-key <new-key-id> \
  --identity [system]
```

> [!TIP]
> When you run `az acr encryption rotate-key`, you can pass either a versioned key ID or a non-versioned key ID. If you use a non-versioned key ID, the registry is then configured to automatically detect later key version updates.

### Portal

Use the registry's **Encryption** settings to update the key vault, key, or identity settings used for the customer-managed key.

For example, to configure a new key:

1. In the portal, navigate to your registry.
1. Under **Settings**, select  **Encryption** > **Change key**.

    :::image type="content" source="media/container-registry-customer-managed-keys/rotate-key.png" alt-text="Rotate key in the Azure portal":::
1. In **Encryption**, choose one of the following:
    * Select **Select from Key Vault**, and select an existing key vault and key, or **Create new**. The key you select is non-versioned and enables automatic key rotation.
    * Select **Enter key URI**, and provide a key identifier directly. You can provide either a versioned key URI (for a key that must be rotated manually) or a non-versioned key URI (which enables automatic key rotation).
1. Complete the key selection and select **Save**.

## Revoke key

Revoke the customer-managed encryption key by changing the access policy or permissions on the key vault or by deleting the key. For example, use the [az keyvault delete-policy][az-keyvault-delete-policy] command to change the access policy of the managed identity used by your registry:

```azurecli
az keyvault delete-policy \
  --resource-group <resource-group-name> \
  --name <key-vault-name> \
  --object-id $identityPrincipalID
```

Revoking the key effectively blocks access to all registry data, since the registry can't access the encryption key. If access to the key is enabled or the deleted key is restored, your registry will pick the key so you can again access the encrypted registry data.

## Advanced scenario: Key Vault firewall

You might want to store the encryption key using an existing Azure key vault configured with a [Key Vault firewall](../key-vault/general/network-security.md), which denies public access and allows only private endpoint or selected virtual networks. 

For this scenario, first create a new user-assigned identity, key vault, and container registry encrypted with a customer-managed key, using the [Azure CLI](#enable-customer-managed-key---cli), [portal](#enable-customer-managed-key---portal), or [template](#enable-customer-managed-key---template). Detailed steps are in preceding sections in this article.
   > [!NOTE]
   > The new key vault is deployed outside the firewall. It's only used temporarily to store the customer-managed key.

After registry creation, continue with the following steps. Details are in the following sections.

1. Enable the registry's system-assigned identity.
1. Grant the system-assigned identity permissions to access keys in the key vault that's restricted with the Key Vault firewall.
1. Ensure that the Key Vault firewall allows bypass by trusted services. Currently, an Azure container registry can only bypass the firewall when using its system-managed identity. 
1. Rotate the customer-managed key by selecting one in the key vault that's restricted with the Key Vault firewall.
1. When no longer needed, you may delete the key vault that was created outside the firewall.


### Step 1 - Enable registry's system-assigned identity

1. In the portal, navigate to your registry.
1. Select **Settings** >  **Identity**.
1. Under **System assigned**, set **Status** to **On**. Select **Save**.
1. Copy the **Object ID** of the identity.

### Step 2 - Grant system-assigned identity access to your key vault

1. In the portal, navigate to your key vault.
1. Select **Settings** > **Access policies > +Add Access Policy**.
1. Select **Key permissions**, and select **Get**, **Unwrap Key**, and **Wrap Key**.
1. Choose **Select principal** and search for the object ID of your system-assigned managed identity, or the name of your registry.  
1. Select **Add**, then select **Save**.

### Step 3 - Enable key vault bypass

To access a key vault configured with a Key Vault firewall, the registry must bypass the firewall. Ensure that the key vault is configured to allow access by any [trusted service](../key-vault/general/overview-vnet-service-endpoints.md#trusted-services). Azure Container Registry is one of the trusted services.

1. In the portal, navigate to your key vault.
1. Select **Settings** > **Networking**.
1. Confirm, update, or add virtual network settings. For detailed steps, see [Configure Azure Key Vault firewalls and virtual networks](../key-vault/general/network-security.md).
1. In **Allow Microsoft Trusted Services to bypass this firewall**, select **Yes**. 

### Step 4 - Rotate the customer-managed key

After completing the preceding steps, rotate to a key that's stored in the key vault behind a firewall.

1. In the portal, navigate to your registry.
1. Under **Settings**, select **Encryption** > **Change key**.
1. In **Identity**, select **System Assigned**.
1. Select **Select from Key Vault**, and select the name of the key vault that's behind a firewall.
1. Select an existing key, or **Create new**. The key you select is non-versioned and enables automatic key rotation.
1. Complete the key selection and select **Save**.

## Troubleshoot

### Removing managed identity


If you try to remove a user-assigned or system-assigned managed identity from a registry that is used to configure encryption, you might see an error message similar to:
 
```
Azure resource '/subscriptions/xxxx/resourcegroups/myGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry' does not have access to identity 'xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx' Try forcibly adding the identity to the registry <registry name>. For more information on bring your own key, please visit 'https://aka.ms/acr/cmk'.
```
 
You will also be unable to change (rotate) the encryption key. The resolution steps depend on the type of identity used for encryption.

**User-assigned identity**

If this issue occurs with a user-assigned identity, first reassign the identity using the GUID displayed in the error message. For example:

```azurecli
az acr identity assign -n myRegistry --identities xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx
```
        
Then, after changing the key and assigning a different identity, you can remove the original user-assigned identity.

**System-assigned identity**

If this issue occurs with a system-assigned identity, please [create an Azure support ticket](https://azure.microsoft.com/support/create-ticket/) for assistance to restore the identity.


## Next steps

* Learn more about [encryption at rest in Azure](../security/fundamentals/encryption-atrest.md).
* Learn more about access policies and how to [secure access to a key vault](../key-vault/general/security-overview.md).


<!-- LINKS - external -->

<!-- LINKS - internal -->

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
