---
title: Configure customer-managed key encryption at rest in Azure VMware Solution
description: Learn how to encrypt data in Azure VMware Solution with customer-managed keys using Azure Key Vault.
ms.topic: how-to 
ms.custom: devx-track-azurecli
ms.date: 6/30/2022
---

# Configure customer-managed key encryption at rest in Azure VMware Solution

This article illustrates how to encrypt VMware vSAN Key Encryption Keys (KEKs) with customer-managed keys (CMKs) managed by customer-owned Azure Key Vault.

When CMK encryptions are enabled on your Azure VMware Solution private cloud, Azure VMware Solution uses the CMK from your key vault to encrypt the vSAN KEKs. Each ESXi host that participates in the vSAN cluster uses randomly generated Disk Encryption Keys (DEKs) that ESXi uses to encrypt disk data at rest. vSAN encrypts all DEKs with a KEK provided by Azure VMware Solution key management system (KMS). Azure VMware Solution private cloud and Azure Key Vault don't need to be in the same subscription.

When managing your own encryption keys, you can do the following actions:

- Control Azure access to vSAN keys.
- Centrally manage the lifecycle of CMKs.
- Revoke Azure from accessing the KEK.

The Customer-managed keys (CMKs) feature supports the following key types. See the following key types, shown by key type and key size.

- RSA: 2048, 3072, 4096
- RSA-HSM: 2048, 3072, 4096

## Topology

The following diagram shows how Azure VMware Solution uses Microsoft Entra ID and a key vault to deliver the customer-managed key.

:::image type="content" source="media/configure-customer-managed-keys/customer-managed-keys-diagram-topology.png" alt-text="Diagram showing the customer-managed keys topology." border="false" lightbox="media/configure-customer-managed-keys/customer-managed-keys-diagram-topology.png":::

## Prerequisites

Before you begin to enable customer-managed key (CMK) functionality, ensure the following listed requirements are met:

- You'll need an Azure Key Vault to use CMK functionality. If you don't have an Azure Key Vault, you can create one using [Quickstart: Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md).
- If you enabled restricted access to key vault, you'll need to allow Microsoft Trusted Services to bypass the Azure Key Vault firewall. Go to [Configure Azure Key Vault networking settings](../key-vault/general/how-to-azure-key-vault-network-security.md?tabs=azure-portal) to learn more.
    >[!NOTE]
    >After firewall rules are in effect, users can only perform Key Vault [data plane](../key-vault/general/security-features.md#privileged-access) operations when their requests originate from allowed VMs or IPv4 address ranges. This also applies to accessing key vault from the Azure portal. This also affects the key vault Picker by Azure VMware Solution. Users may be able to see a list of key vaults, but not list keys, if firewall rules prevent their client machine or user does not have list permission in key vault.

- Enable **System Assigned identity** on your Azure VMware Solution private cloud if you didn't enable it during software-defined data center (SDDC) provisioning.

    # [Portal](#tab/azure-portal)
    
    Use the following steps to enable System Assigned identity:

    1. Sign in to Azure portal.

    2. Navigate to **Azure VMware Solution** and locate your SDDC.

    3. From the left navigation, open **Manage** and select **Identity**.

    4. In **System Assigned**, check **Enable** and select **Save**.
        1. **System Assigned identity** should now be enabled.

    Once System Assigned identity is enabled, you'll see the tab for **Object ID**. Make note of the Object ID for use later.

    # [Azure CLI](#tab/azure-cli)

    Get the private cloud resource ID and save it to a variable. You'll need this value in the next step to update resource with system assigned identity.
    
    ```azurecli-interactive
    privateCloudId=$(az vmware private-cloud show --name $privateCloudName --resource-group $resourceGroupName --query id | tr -d '"')
    ```
     
    To configure the system-assigned identity on Azure VMware Solution private cloud with Azure CLI, call [az-resource-update](/cli/azure/resource?view=azure-cli-latest#az-resource-update&preserve-view=true) and provide the variable for the private cloud resource ID that you previously retrieved.
    
    ```azurecli-interactive
    az resource update --ids $privateCloudId --set identity.type=SystemAssigned --api-version "2021-12-01"
    ```

- Configure the key vault access policy to grant permissions to the managed identity. It will be used to authorize access to the key vault.
    
    # [Portal](#tab/azure-portal)

    1. Sign in to Azure portal.
    1. Navigate to **Key vaults** and locate the key vault you want to use.
    1. From the left navigation, under **Settings**, select **Access policies**.
    1. In **Access policies**, select **Add Access Policy**.
        1. From the Key Permissions drop-down, check: **Select**, **Get**, **Wrap Key**, and **Unwrap Key**.
        1. Under Select principal, select **None selected**. A new **Principal** window with a search box will open.
        1. In the search box, paste the **Object ID** from the previous step, or search the private cloud name you want to use. Choose **Select** when you're done.
        1. Select **ADD**.
        1. Verify the new policy appears under the current policy's Application section.
        1. Select **Save** to commit changes.

    # [Azure CLI](#tab/azure-cli)

   Get the principal ID for the system-assigned managed identity and save it to a variable. You'll need this value in the next step to create the key vault access policy.
    
    ```azurecli-interactive
    principalId=$(az vmware private-cloud show --name $privateCloudName --resource-group $resourceGroupName --query identity.principalId | tr -d '"')
    ```
    
    To configure the key vault access policy with Azure CLI, call [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy) and provide the variable for the principal ID that you previously retrieved for the managed identity.

    ```azurecli-interactive
    az keyvault set-policy --name $keyVault --resource-group $resourceGroupName --object-id $principalId --key-permissions get unwrapKey wrapKey
    ```

    Learn more about how to [Assign an Azure Key Vault access policy](../key-vault/general/assign-access-policy.md?tabs=azure-portal).


## Customer-managed key version lifecycle

You can change the customer-managed key (CMK) by creating a new version of the key. The creation of a new version won't interrupt the virtual machine (VM) workflow.

In Azure VMware Solution, CMK key version rotation will depend on the key selection setting you've chosen during CMK setup.

**Key selection setting 1**

A customer enables CMK encryption without supplying a specific key version for CMK. Azure VMware Solution selects the latest key version for CMK from the customer's key vault to encrypt the vSAN Key Encryption Keys (KEKs). Azure VMware Solution tracks the CMK for version rotation. When a new version of the CMK key in Azure Key Vault is created, it's captured by Azure VMware Solution automatically to encrypt vSAN KEKs.

>[!NOTE]
>Azure VMware Solution can take up to ten minutes to detect a new auto-rotated key version.

**Key selection setting 2**

A customer can enable CMK encryption for a specified CMK key version to supply the full key version URI under the **Enter Key from URI** option. When the customer's current key expires, they'll need to extend the CMK key expiration or disable CMK.

## Enable CMK with system-assigned identity

System-assigned identity is restricted to one per resource and is tied to the lifecycle of the resource. You can grant permissions to the managed identity on Azure resource. The managed identity is authenticated with Microsoft Entra ID, so you don't have to store any credentials in code.

>[!IMPORTANT]
> Ensure that key vault is in the same region as the Azure VMware Solution private cloud.

# [Portal](#tab/azure-portal)

Navigate to your **Azure Key Vault** and provide access to the SDDC on Azure Key Vault using the Principal ID captured in the **Enable MSI** tab.

1. From your Azure VMware Solution private cloud, under **Manage**, select **Encryption**, then select **Customer-managed keys (CMK)**.
1. CMK provides two options for **Key Selection** from Azure Key Vault.
    
    **Option 1**

    1. Under **Encryption key**, choose the **select from Key Vault** button.
    1. Select the encryption type, then the **Select Key Vault and key** option.
    1. Select the **Key Vault and key** from the drop-down, then choose **Select**.
    
    **Option 2**

      1. Under **Encryption key**, choose the **Enter key from URI** button.
      1. Enter a specific Key URI in the **Key URI** box.

    > [!IMPORTANT]
    > If you want to select a specific key version instead of the automatically selected latest version, you'll need to specify the key URI with key version. This will affect the CMK key version life cycle.

    > [!NOTE]
    > The Azure key vault Managed HSM option is only supported with the Key URI option.

1. Select **Save** to grant access to the resource.

# [Azure CLI](#tab/azure-cli)

To configure customer-managed keys for an Azure VMware Solution private cloud with automatic updating of the key version, call [az vmware private-cloud add-cmk-encryption](/cli/azure/vmware/private-cloud?view=azure-cli-latest#az-vmware-private-cloud-add-cmk-encryption&preserve-view=true). Get the key vault URL and save it to a variable. You'll need this value in the next step to enable CMK.
    
```azurecli-interactive
keyVaultUrl =$(az keyvault show --name <keyvault_name> --resource-group <resource_group_name> --query properties.vaultUri --output tsv)
```

Option 1 and 2 below demonstrate the difference between not providing a specific key version and providing one.

**Option 1**

This example shows the customer not providing a specific key version.
    
```azurecli-interactive
az vmware private-cloud add-cmk-encryption --private-cloud <private_cloud_name> --resource-group <resource_group_name> --enc-kv-url $keyVaultUrl --enc-kv-key-name <keyvault_key_name>
```

**Option 2**

Supply key version as argument to use customer-managed keys with a specific key version, same as mentioned above in Azure portal option 2. The following example shows the customer providing a specific key version.
    
```azurecli-interactive
az vmware private-cloud add-cmk-encryption --private-cloud <private_cloud_name> --resource-group <resource_group_name> --enc-kv-url $keyVaultUrl --enc-kv-key-name --enc-kv-key-version <keyvault_key_keyVersion>
```
---

## Change from customer-managed key to Microsoft managed key

When a customer wants to change from a customer-managed key (CMK) to a Microsoft managed key (MMK), it won't interrupt VM workload. To make the change from CMK to MMK, use the following steps.

1. Select **Encryption**, located under **Manage** from your Azure VMware Solution private cloud.
2. Select **Microsoft-managed keys (MMK)**.
3. Select **Save**.
  
## Limitations

The Azure Key Vault must be configured as recoverable.

- Configure Azure Key Vault with the **Soft Delete** option.
- Turn on **Purge Protection** to guard against force deletion of the secret vault, even after soft delete.

Updating CMK settings won't work if the key is expired or the Azure VMware Solution access key has been revoked.

## Troubleshooting and best practices

**Accidental deletion of a key**

If you accidentally delete your key in the Azure Key Vault, private cloud won't be able to perform some cluster modification operations. To avoid this scenario, we recommend that you keep soft deletes enabled on key vault. This option ensures that, if a key is deleted, it can be recovered within a 90-day period as part of the default soft-delete retention. If you are within the 90-day period, you can restore the key in order to resolve the issue.

**Restore key vault permission**

If you have a private cloud that lost access to the customer managed key, check if Managed System Identity (MSI) requires permissions in key vault. The error notification returned from Azure may not correctly indicate MSI requiring permissions in key vault as the root cause. Remember, the required permissions are: get, wrapKey, and unwrapKey. See step 4 in [Prerequisites](#prerequisites).

**Fix expired key**

If you aren't using the auto-rotate function and the Customer Managed Key has expired in key vault, you can change the expiration date on key.  

**Restore key vault access**

Ensure Managed System Identity (MSI) is used for providing private cloud access to key vault.

**Deletion of MSI**

If you accidentally delete the Managed System Identity (MSI) associated with private cloud, you'll need to disable CMK, then follow the steps to enable CMK from start.

## Next steps

Learn about [Azure Key Vault backup and restore](../key-vault/general/backup.md?tabs=azure-cli)

Learn about [Azure Key Vault recovery](../key-vault/general/key-vault-recovery.md?tabs=azure-portal#list-recover-or-purge-a-soft-deleted-key-vault)
