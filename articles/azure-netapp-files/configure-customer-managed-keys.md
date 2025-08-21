---
title: Configure customer-managed keys for Azure NetApp Files volume encryption
description: Describes how to configure customer-managed keys for Azure NetApp Files volume encryption.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 06/20/2025
ms.author: anfdocs
# Customer intent: As a cloud administrator, I want to configure customer-managed keys for Azure NetApp Files volume encryption so that I can maintain control over the key lifecycle and enhance the security of my encrypted data.
---

# Configure customer-managed keys for Azure NetApp Files volume encryption

Customer-managed keys for Azure NetApp Files volume encryption enable you to use your own keys rather than a platform-managed key when creating a new volume. With customer-managed keys, you can fully manage the relationship between a key's life cycle, key usage permissions, and auditing operations on keys.

The following diagram demonstrates how customer-managed keys work with Azure NetApp Files:

:::image type="content" source="./media/configure-customer-managed-keys/customer-managed-keys-diagram.png" alt-text="Conceptual diagram of customer-managed keys." lightbox="./media/configure-customer-managed-keys/customer-managed-keys-diagram.png":::

1. Azure NetApp Files grants permissions to encryption keys to a managed identity. The managed identity is either a user-assigned managed identity that you create and manage or a system-assigned managed identity associated with the NetApp account.
2. You configure encryption with a customer-managed key for the NetApp account.
3. You use the managed identity to which the Azure Key Vault admin granted permissions in step 1 to authenticate access to Azure Key Vault via Microsoft Entra ID.
4. Azure NetApp Files wraps the account encryption key with the customer-managed key in Azure Key Vault.

    Customer-managed keys don't affect performance of Azure NetApp Files. Its only difference from platform-managed keys is how the key is managed.
1. For read/write operations, Azure NetApp Files sends requests to Azure Key Vault to unwrap the account encryption key to perform encryption and decryption operations.

Cross-tenant customer-managed keys is available in all Azure NetApp Files supported regions.

## Considerations

* To create a volume using customer-managed keys, you must select the *Standard* network features. You can't use customer-managed key volumes with volume configured using Basic network features. Follow instructions in to [Set the Network Features option](configure-network-features.md#set-the-network-features-option) in the volume creation page.
* For increased security, you can select the **Disable public access** option within the network settings of your key vault. When selecting this option, you must also select **Allow trusted Microsoft services to bypass this firewall** to permit the Azure NetApp Files service to access your encryption key.
* Customer-managed keys support automatic Managed System Identity (MSI) certificate renewal. If your certificate is valid, you don't need to manually update it. 
* If Azure NetApp Files fails to create a customer-managed key volume, error messages are displayed. For more information, see [Error messages and troubleshooting](troubleshoot-customer-managed-keys.md).
* Do not make any changes to the underlying Azure Key Vault or Azure Private Endpoint after creating a customer-managed keys volume. Making changes can make the volumes inaccessible. If you must make changes, see [Update the private endpoint IP for customer-managed keys](#update-the-private-endpoint).
* Azure NetApp Files supports the ability to [transition existing volumes from platform-managed keys (PMK) to customer-managed keys (CMK) without data migration](#transition-volumes). This provides flexibility with the encryption key lifecycle (renewals, rotations) and extra security for regulated industry requirements.
* If Azure Key Vault becomes inaccessible, Azure NetApp Files loses its access to the encryption keys and the ability to read or write data to volumes enabled with customer-managed keys. In this situation, create a support ticket to have access manually restored for the affected volumes.
* Azure NetApp Files supports customer-managed keys on source and data replication volumes with cross-region replication or cross-zone replication relationships.
* Applying Azure network security groups (NSG) on the private link subnet to Azure Key Vault is supported for Azure NetApp Files customer-managed keys. NSGs don’t affect connectivity to private links unless a private endpoint network policy is enabled on the subnet.
* Wrap/unwrap is not supported. Customer-managed keys uses encrypt/decrypt. For more information, see [RSA algorithms](/azure/key-vault/keys/about-keys-details#rsa-algorithms).

## Requirements

Before creating your first customer-managed key volume, you must set up:
* An [Azure Key Vault](/azure/key-vault/general/overview), containing at least one key.
    * The key vault must have soft delete and purge protection enabled.
    * The key must be of type RSA.
* The key vault must have an [Azure Private Endpoint](../private-link/private-endpoint-overview.md).
    * The private endpoint must reside in a different subnet than the one delegated to Azure NetApp Files. The subnet must be in the same virtual network as the one delegated to Azure NetApp.

For more information about Azure Key Vault and Azure Private Endpoint, see:
* [Quickstart: Create a key vault ](/azure/key-vault/general/quick-create-portal)
* [Create or import a key into the vault](/azure/key-vault/keys/quick-create-portal)
* [Create a private endpoint](../private-link/create-private-endpoint-portal.md)
* [More about keys and supported key types](/azure/key-vault/keys/about-keys)
* [Network security groups](../virtual-network/network-security-groups-overview.md)
* [Manage network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md)

## Configure a NetApp account to use customer-managed keys

### [Portal](#tab/azure-portal)

1. In the Azure portal and under Azure NetApp Files, select **Encryption**.

    The **Encryption** page enables you to manage encryption settings for your NetApp account. It includes an option to let you set your NetApp account to use your own encryption key, which is stored in [Azure Key Vault](/azure/key-vault/general/basic-concepts). This setting provides a system-assigned identity to the NetApp account, and it adds an access policy for the identity with the required key permissions.

    :::image type="content" source="./media/configure-customer-managed-keys/encryption-menu.png" alt-text="Screenshot of the encryption menu." lightbox="./media/configure-customer-managed-keys/encryption-menu.png":::

1. When you set your NetApp account to use customer-managed key, you have two ways to specify the Key URI:
    * The **Select from key vault** option allows you to select a key vault and a key.
    :::image type="content" source="./media/configure-customer-managed-keys/select-key.png" alt-text="Screenshot of the select a key interface." lightbox="./media/configure-customer-managed-keys/select-key.png":::

    * The **Enter key URI** option allows you to enter manually the key URI.
    :::image type="content" source="./media/configure-customer-managed-keys/key-enter-uri.png" alt-text="Screenshot of the encryption menu showing key URI field." lightbox="./media/configure-customer-managed-keys/key-enter-uri.png":::

1. Select the identity type that you want to use for authentication to the Azure Key Vault. If your Azure Key Vault is configured to use Vault access policy as its permission model, both options are available. Otherwise, only the user-assigned option is available.
    * If you choose **System-assigned**, select the **Save** button. The Azure portal configures the NetApp account automatically by adding a system-assigned identity to your NetApp account. An access policy is also created on your Azure Key Vault with key permissions Get, Encrypt, Decrypt.

    :::image type="content" source="./media/configure-customer-managed-keys/encryption-system-assigned.png" alt-text="Screenshot of the encryption menu with system-assigned options." lightbox="./media/configure-customer-managed-keys/encryption-system-assigned.png":::

    * If you choose **User-assigned**, you must select an identity. Choose **Select an identity** to open a context pane where you select a user-assigned managed identity.

    :::image type="content" source="./media/configure-customer-managed-keys/encryption-user-assigned.png" alt-text="Screenshot of user-assigned submenu." lightbox="./media/configure-customer-managed-keys/encryption-user-assigned.png":::

    If you've configured your Azure Key Vault to use Vault access policy, the Azure portal configures the NetApp account automatically with the following process: The user-assigned identity you select is added to your NetApp account. An access policy is created on your Azure Key Vault with the key permissions Get, Encrypt, Decrypt.

    If you've configure your Azure Key Vault to use Azure role-based access control, then you need to make sure the selected user-assigned identity has a role assignment on the key vault with permissions for actions:
      * `Microsoft.KeyVault/vaults/keys/read` 
      * `Microsoft.KeyVault/vaults/keys/encrypt/action` 
      * `Microsoft.KeyVault/vaults/keys/decrypt/action` 
    The user-assigned identity you select is added to your NetApp account. Due to the customizable nature of role-based access control, the Azure portal doesn't configure access to the key vault. See [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](/azure/key-vault/general/rbac-guide) for details on configuring Azure Key Vault.

1. Select **Save** then observe the notification communicating the status of the operation. If the operation isn't successful, an error message displays. For assistance in resolving the error, see [error messages and troubleshooting](troubleshoot-customer-managed-keys.md).

### [Azure CLI](#tab/azure-cli)

How you configure a NetApp account with customer-managed keys with the Azure CLI depends on whether you're using a [system-assigned identity](#use-a-system-assigned-identity) or an [user-assigned identity](#use-a-new-user-assigned-identity).

#### Use a system-assigned identity

1. Update your NetApp account to use a system-assigned identity. 

    ```azurecli
    az netappfiles account update \
        --name <account_name> \
        --resource-group <resource_group> \
        --identity-type SystemAssigned
    ```

1. To use an access policy, create a variable that includes the principal ID of the account identity, then run `az keyvault set-policy` and assign permissions of "Get," "Encrypt," and "Decrypt." 

    ```azurecli
    netapp_account_principal=$(az netappfiles account show \
        --name <account_name> \
        --resource-group <resource_group> \
        --query identity.principalId \
        --output tsv)
    
    az keyvault set-policy \
        --name <key_vault_name> \
        --resource-group <resource-group> \
        --object-id $netapp_account_principal \
        --key-permissions get encrypt decrypt
    ```

1. Update the NetApp account with your key vault. 

    ```azurecli
    key_vault_uri=$(az keyvault show \
        --name <key-vault> \
        --resource-group <resource_group> \
        --query properties.vaultUri \
        --output tsv)
    az netappfiles account update --name <account_name> \  
        --resource-group <resource_group> \
        --key-source Microsoft.Keyvault \
        --key-vault-uri $key_vault_uri \
        --key-name <key>
    ```

#### Use a new user-assigned identity 

1. Create a new user-assigned identity.
    
    ```azurecli
    az identity create \
        --name <identity_name> \
        --resource-group <resource_group>
    ```

1. Set an access policy for the key vault. 
    ```azurecli
    user_assigned_identity_principal=$(az identity show \
        --name <identity_name> \
        --resource-group <resource_group> \
        --query properties.principalId \
        --output tsv)
    az keyvault set-policy \
        --name <key_vault_name> \
        --resource-group <resource-group> \
        --object-id $user_assigned_identity_principal \
        --key-permissions get encrypt decrypt
    ```
    
    >[!NOTE]
    >You can alternately [use role-based access control to grant access to the key vault](#use-role-based-access-control). 

1. Assign the user-assigned identity to the NetApp account and update the key vault encryption. 

    ```azurecli
    key_vault_uri=$(az keyvault show \
        --name <key-vault> \
        --resource-group <resource_group> \
        --query properties.vaultUri \
        --output tsv)
    user_assigned_identity=$(az identity show \
        --name <identity_name> \
        --resource-group <resource_group> \
        --query id \
        --output tsv)
    az netappfiles account update --name <account_name> \  
        --resource-group <resource_group> \
        --identity-type UserAssigned \
        --key-source Microsoft.Keyvault \
        --key-vault-uri $key_vault_uri \
        --key-name <key> \
        --keyvault-resource-id <key-vault> \   
        --user-assigned-identity $user_assigned_identity
    ```

### [Azure PowerShell](#tab/azure-powershell)

The process to configure a NetApp account with customer-managed keys in the Azure CLI depends on whether you're using a [system-assigned identity](#enable-access-for-system-assigned-identity) or an [user-assigned identity](#enable-access-for-user-assigned-identity).

#### Enable access for system-assigned identity 

1. Update your NetApp account to use system-assigned identity.

    ```azurepowershell
    $netappAccount = Update-AzNetAppFilesAccount -ResourceGroupName <resource_group> -Name <account_name> -AssignIdentity
    ```

1. To use an access policy, run `Set-AzKeyVaultAccessPolicy` with the key vault name, the principal ID of the account identity, and the permissions "Get," "Encrypt," and "Decrypt." 

    ```azurepowershell
    Set-AzKeyVaultAccessPolicy -VaultName <key_vault_name> -ResourceGroupname <resource_group> -ObjectId $netappAccount.Identity.PrincipalId -PermissionsToKeys get,encrypt,decrypt
    ```

1. Update your NetApp account with the key vault information.

    ```azurepowershell
    Update-AzNetAppFilesAccount -ResourceGroupName $netappAccount.ResourceGroupName -AccountName $netappAccount.Name -KeyVaultEncryption -KeyVaultUri <keyVaultUri> -KeyName <keyName>
    ```

#### Enable access for user-assigned identity

1. Create a new user-assigned identity.

    ```azurepowershell
    $userId = New-AzUserAssignedIdentity -ResourceGroupName <resourceGroupName> -Name $userIdName
    ```

1. Assign the access policy to the key vault. 

    ```azurepowershell
    Set-AzKeyVaultAccessPolicy -VaultName <key_vault_name> `
        -ResourceGroupname <resource_group> `
        -ObjectId $userId.PrincipalId `
        -PermissionsToKeys get,encrypt,decrypt `
        -BypassObjectIdValidation
    ```
    
    >[!NOTE]
    >You can alternately [use role-based access control to grant access to the key vault](#use-role-based-access-control). 

1. Assign the user-assigned identity to the NetApp account and update the key vault encryption. 

    ```azurepowershell
    $netappAccount = Update-AzNetAppFilesAccount -ResourceGroupName <resource_group> `
        -Name <account_name> `
        -IdentityType UserAssigned `
        -UserAssignedIdentityId $userId.Id `
        -KeyVaultEncryption `
        -KeyVaultUri <keyVaultUri> `
        -KeyName <keyName> `
        -EncryptionUserAssignedIdentity $userId.Id
    ```
---

## Use role-based access control

You can use an Azure Key Vault that is configured to use Azure role-based access control. To configure customer-managed keys through Azure portal, you need to provide a user-assigned identity.

1. In your Azure account, navigate to **Key vaults** then **Access policies**.
1. To create an access policy, under **Permission model**, select **Azure role-based access-control**.
    :::image type="content" source="./media/configure-customer-managed-keys/rbac-permission.png" alt-text="Screenshot of access configuration menu." lightbox="./media/configure-customer-managed-keys/rbac-permission.png":::
1. When creating the user-assigned role, there are three permissions required for customer-managed keys:
    1. `Microsoft.KeyVault/vaults/keys/read` 
    1. `Microsoft.KeyVault/vaults/keys/encrypt/action` 
    1. `Microsoft.KeyVault/vaults/keys/decrypt/action` 

    Although there are predefined roles that include these permissions, those roles grant more privileges than are required. It's recommended that you create a custom role with only the minimum required permissions. For more information, see [Azure custom roles](../role-based-access-control/custom-roles.md).

    ```json
    {
        "id": "/subscriptions/<subscription>/Microsoft.Authorization/roleDefinitions/<roleDefinitionsID>",
        "properties": {
            "roleName": "NetApp account",
            "description": "Has the necessary permissions for customer-managed key encryption: get key, encrypt and decrypt",
            "assignableScopes": [
                "/subscriptions/<subscriptionID>/resourceGroups/<resourceGroup>"
            ],
            "permissions": [
              {
                "actions": [],
                "notActions": [],
                "dataActions": [
                    "Microsoft.KeyVault/vaults/keys/read",
                    "Microsoft.KeyVault/vaults/keys/encrypt/action",
                    "Microsoft.KeyVault/vaults/keys/decrypt/action"
                ],
                "notDataActions": []
                }
            ]
          }
    }
    ```

1. Once the custom role is created and available to use with the key vault, you apply it to the user-assigned identity.

  :::image type="content" source="./media/configure-customer-managed-keys/rbac-review-assign.png" alt-text="Screenshot of role-based access control review and assign menu." lightbox="./media/configure-customer-managed-keys/rbac-review-assign.png":::

## Create an Azure NetApp Files volume using customer-managed keys

1. From Azure NetApp Files, select **Volumes** and then **+ Add volume**.
1. Follow the instructions in [Configure network features for an Azure NetApp Files volume](configure-network-features.md):
    * [Set the Network Features option in volume creation page](configure-network-features.md#set-the-network-features-option).
    * The network security group for the volume’s delegated subnet must allow incoming traffic from NetApp's storage VM.
1. For a NetApp account configured to use a customer-managed key, the Create Volume page includes an option Encryption Key Source.

    To encrypt the volume with your key, select **Customer-Managed Key** in the **Encryption Key Source** dropdown menu.

    When you create a volume using a customer-managed key, you must also select **Standard** for the **Network features** option. Basic network features are not supported.

    You must select a key vault private endpoint as well. The dropdown menu displays private endpoints in the selected virtual network. If there's no private endpoint for your key vault in the selected virtual network, then the dropdown is empty, and you won't be able to proceed. If you encounter this scenario, see [Azure Private Endpoint](../private-link/private-endpoint-overview.md).

    :::image type="content" source="./media/configure-customer-managed-keys/keys-create-volume.png" alt-text="Screenshot of create volume menu." lightbox="./media/configure-customer-managed-keys/keys-create-volume.png":::

1. Continue to complete the volume creation process. Refer to:
    * [Create an NFS volume](azure-netapp-files-create-volumes.md)
    * [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
    * [Create a dual-protocol volume](create-volumes-dual-protocol.md)

## <a name="transition"></a> Transition an Azure NetApp Files volume to customer-managed keys

Azure NetApp Files supports the ability to move existing volumes using platform-managed keys to customer-managed keys. Once you complete the migration, you can't revert to platform-managed keys.

### Transition volumes

>[!NOTE]
>When you transition volumes to use customer-managed keys, you must perform the transition for every virtual network where your Azure NetApp Files account has volumes. 

1. Ensure you [configured your Azure NetApp Files account to use customer-managed keys](#configure-a-netapp-account-to-use-customer-managed-keys).
1. In the Azure portal, navigate to **Encryption**. 
1. Select the **CMK Migration** tab.
1. From the drop-down menu, select the virtual network and key vault private endpoint you want to use. 
1. Azure generates a list of volumes to be encrypted by your customer-managed key.  
1. Select **Confirm** to initiate the migration.  

## Rekey all volumes under a NetApp account

If you have already configured your NetApp account for customer-managed keys and have one or more volumes encrypted with customer-managed keys, you can change the key that is used to encrypt all volumes under the NetApp account. You can select any key that is in the same key vault. Changing key vaults isn't supported.

1. Under your NetApp account, navigate to the **Encryption** menu. Under the **Current key** input field, select the **Rekey** link.
:::image type="content" source="./media/configure-customer-managed-keys/encryption-current-key.png" alt-text="Screenshot of the encryption key." lightbox="./media/configure-customer-managed-keys/encryption-current-key.png":::

1. In the **Rekey** menu, select one of the available keys from the dropdown menu. The chosen key must be different from the current key.
:::image type="content" source="./media/configure-customer-managed-keys/encryption-rekey.png" alt-text="Screenshot of the rekey menu." lightbox="./media/configure-customer-managed-keys/encryption-rekey.png":::

1. Select **OK** to save. The rekey operation can take several minutes.

## Switch from system-assigned to user-assigned identity

To switch from system-assigned to user-assigned identity, you must grant the target identity access to the key vault being used with read/get, encrypt, and decrypt permissions.

1. Update the NetApp account by sending a PATCH request using the `az rest` command:
    ```azurecli
    az rest -m PATCH -u <netapp-account-resource-id>?api-versions=2022-09-01 -b @path/to/payload.json
    ```
    The payload should use the following structure:
    ```json
    {
      "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
         "<identity-resource-id>": {}
        }
      },
      "properties": {
        "encryption": {
          "identity": {
            "userAssignedIdentity": "<identity-resource-id>"
          }
        }
      }
    }
    ```
1. Confirm the operation completed successfully with the `az netappfiles account show` command. The output includes the following fields:
    ```azurecli
        "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.NetApp/netAppAccounts/account",
        "identity": {
            "principalId": null,
            "tenantId": null,
            "type": "UserAssigned",
            "userAssignedIdentities": {
                "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity>": {
                    "clientId": "<client-id>",
                    "principalId": "<principalId>",
                    "tenantId": <tenantId>"
                }
            }
        },
    ```
    Ensure that:
    * `encryption.identity.principalId` matches the value in `identity.userAssignedIdentities.principalId`
    * `encryption.identity.userAssignedIdentity` matches the value in `identity.userAssignedIdentities[]`

    ```json
    "encryption": {
        "identity": {
            "principalId": "<principal-id>",
            "userAssignedIdentity": "/subscriptions/<subscriptionId>/resourceGroups/<resource-group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity>"
        },
        "KeySource": "Microsoft.KeyVault",
    },
    ```

## Update the private endpoint

Making changes to the Azure Private Endpoint after creating a customer-managed key volume can make the volume inaccessible. If you need to make changes, you must create a new endpoint and update the volume to point to the new endpoint.  

1. [Create a new endpoint between the virtual network and Azure Key Vault.](../private-link/create-private-endpoint-cli.md)
1. Update all volumes using the old endpoint to use the new endpoint. 
    ```azurecli
    az netappfiles volume update --g $resource-group-name --account-name $netapp-account-name --pool-name $pool-name --name $volume-name --key-vault-private-endpoint-resource-id $newendpoint
    ```
1. [Delete the old private endpoint](/cli/azure/network/private-endpoint#az-network-private-endpoint-delete).

## Next steps

* [Troubleshoot customer-managed keys](troubleshoot-customer-managed-keys.md)
* [Azure NetApp Files API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/netapp/resource-manager/Microsoft.NetApp/stable/2019-11-01)
* [Configure customer-managed keys with managed Hardware Security Module](configure-customer-managed-keys-hardware.md)
* [Configure cross-tenant customer-managed keys](customer-managed-keys-cross-tenant.md)
* [Understand data encryption in Azure NetApp Files](understand-data-encryption.md)