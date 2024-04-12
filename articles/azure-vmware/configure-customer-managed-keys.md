---
title: Configure CMK encryption at rest in Azure VMware Solution
description: Learn how to encrypt data in Azure VMware Solution with customer-managed keys by using Azure Key Vault.
ms.topic: how-to 
ms.custom: devx-track-azurecli, engagement-fy23
ms.date: 4/12/2024
---

# Configure customer-managed key encryption at rest in Azure VMware Solution

This article illustrates how to encrypt VMware vSAN key encryption keys (KEKs) with customer-managed keys (CMKs) managed by a customer-owned Azure Key Vault instance.

When CMK encryptions are enabled on your Azure VMware Solution private cloud, Azure VMware Solution uses the CMK from your key vault to encrypt the vSAN KEKs. Each ESXi host that participates in the vSAN cluster uses randomly generated disk encryption keys (DEKs) that ESXi uses to encrypt disk data at rest. vSAN encrypts all DEKs with a KEK provided by the Azure VMware Solution key management system. The Azure VMware Solution private cloud and the key vault don't need to be in the same subscription.

When you manage your own encryption keys, you can:

- Control Azure access to vSAN keys.
- Centrally manage the lifecycle of CMKs.
- Revoke Azure access to the KEK.

The CMKs feature supports the following key types and their key sizes:

- **RSA**: 2048, 3072, 4096
- **RSA-HSM**: 2048, 3072, 4096

## Topology

The following diagram shows how Azure VMware Solution uses Microsoft Entra ID and a key vault to deliver the CMK.

:::image type="content" source="media/configure-customer-managed-keys/customer-managed-keys-diagram-topology.png" alt-text="Diagram that shows the customer-managed keys topology." border="false" lightbox="media/configure-customer-managed-keys/customer-managed-keys-diagram-topology.png":::

## Prerequisites

Before you begin to enable CMK functionality, ensure that the following requirements are met:

- You need a key vault to use CMK functionality. If you don't have a key vault, you can create one by using [Quickstart: Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md).
- If you enabled restricted access to Key Vault, you need to allow Microsoft Trusted Services to bypass the Key Vault firewall. Go to [Configure Azure Key Vault networking settings](../key-vault/general/how-to-azure-key-vault-network-security.md?tabs=azure-portal) to learn more.
    >[!NOTE]
    >After firewall rules are in effect, users can only perform Key Vault [data plane](../key-vault/general/security-features.md#privileged-access) operations when their requests originate from allowed VMs or IPv4 address ranges. This restriction also applies to accessing Key Vault from the Azure portal. It also affects the Key Vault Picker by Azure VMware Solution. Users might be able to see a list of key vaults, but not list keys, if firewall rules prevent their client machine or the user doesn't have list permission in Key Vault.

- Enable System Assigned identity on your Azure VMware Solution private cloud if you didn't enable it during software-defined datacenter (SDDC) provisioning.

    # [Portal](#tab/azure-portal)
    
    To enable System Assigned identity:

    1. Sign in to the Azure portal.

    1. Go to **Azure VMware Solution** and locate your private cloud.

    1. On the leftmost pane, open **Manage** and select **Identity**.

    1. In **System Assigned**, select **Enable** > **Save**.
        **System Assigned identity** should now be enabled.

    After System Assigned identity is enabled, you see the tab for **Object ID**. Make a note of the Object ID for use later.

    # [Azure CLI](#tab/azure-cli)

    Get the private cloud resource ID and save it to a variable. You need this value in the next step to update the resource with System Assigned identity.
    
    ```azurecli-interactive
    privateCloudId=$(az vmware private-cloud show --name $privateCloudName --resource-group $resourceGroupName --query id | tr -d '"')
    ```
     
    To configure the system-assigned identity on Azure VMware Solution private cloud with the Azure CLI, call [az-resource-update](/cli/azure/resource?view=azure-cli-latest#az-resource-update&preserve-view=true) and provide the variable for the private cloud resource ID that you previously retrieved.
    
    ```azurecli-interactive
    az resource update --ids $privateCloudId --set identity.type=SystemAssigned --api-version "2021-12-01"
    ```

- Configure the key vault access policy to grant permissions to the managed identity. You use it to authorize access to the key vault.
    
    # [Portal](#tab/azure-portal)

    1. Sign in to the Azure portal.
    1. Go to **Key vaults** and locate the key vault you want to use.
    1. On the leftmost pane, under **Settings**, select **Access policies**.
    1. In **Access policies**, select **Add Access Policy** and then:
        1. In the **Key Permissions** dropdown, choose **Select**, **Get**, **Wrap Key**, and **Unwrap Key**.
        1. Under **Select principal**, select **None selected**. A new **Principal** window with a search box opens.
        1. In the search box, paste the **Object ID** from the previous step. Or search for the private cloud name you want to use. Choose **Select** when you're finished.
        1. Select **ADD**.
        1. Verify that the new policy appears under the current policy's Application section.
        1. Select **Save** to commit changes.

    # [Azure CLI](#tab/azure-cli)

   Get the principal ID for the system-assigned managed identity and save it to a variable. You need this value in the next step to create the key vault access policy.
    
    ```azurecli-interactive
    principalId=$(az vmware private-cloud show --name $privateCloudName --resource-group $resourceGroupName --query identity.principalId | tr -d '"')
    ```
    
    To configure the key vault access policy with the Azure CLI, call [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy). Provide the variable for the principal ID that you previously retrieved for the managed identity.

    ```azurecli-interactive
    az keyvault set-policy --name $keyVault --resource-group $resourceGroupName --object-id $principalId --key-permissions get unwrapKey wrapKey
    ```

    Learn more about how to [assign a Key Vault access policy](../key-vault/general/assign-access-policy.md?tabs=azure-portal).

## Customer-managed key version lifecycle

You can change the CMK by creating a new version of the key. The creation of a new version doesn't interrupt the virtual machine (VM) workflow.

In Azure VMware Solution, CMK key version rotation depends on the key selection setting that you chose during CMK setup.

### Key selection setting 1

A customer enables CMK encryption without supplying a specific key version for CMK. Azure VMware Solution selects the latest key version for CMK from the customer's key vault to encrypt the vSAN KEKs. Azure VMware Solution tracks the CMK for version rotation. When a new version of the CMK key in Key Vault is created, it gets captured by Azure VMware Solution automatically to encrypt vSAN KEKs.

>[!NOTE]
>Azure VMware Solution can take up to 10 minutes to detect a new autorotated key version.

### Key selection setting 2

A customer can enable CMK encryption for a specified CMK key version to supply the full key version URI under the **Enter Key from URI** option. When the customer's current key expires, they need to extend the CMK key expiration or disable CMK.

## Enable CMK with system-assigned identity

System-assigned identity is restricted to one per resource and is tied to the lifecycle of the resource. You can grant permissions to the managed identity on Azure resource. The managed identity is authenticated with Microsoft Entra ID, so you don't have to store any credentials in code.

>[!IMPORTANT]
> Ensure that Key Vault is in the same region as the Azure VMware Solution private cloud.

# [Portal](#tab/azure-portal)

Go to your Key Vault instance and provide access to the SDDC on Key Vault by using the principal ID captured on the **Enable MSI** tab.

1. From your Azure VMware Solution private cloud, under **Manage**, select **Encryption**. Then select **Customer-managed keys (CMKs)**.
1. CMK provides two options for **Key Selection** from Key Vault:
    
    Option 1:

    1. Under **Encryption key**, choose **select from Key Vault**.
    1. Select the encryption type. Then select the **Select Key Vault and key** option.
    1. Select the **Key Vault and key** from the dropdown. Then choose **Select**.
    
    Option 2:

    1. Under **Encryption key**, select **Enter key from URI**.
    1. Enter a specific Key URI in the **Key URI** box.

    > [!IMPORTANT]
    > If you want to select a specific key version instead of the automatically selected latest version, you need to specify the Key URI with the key version. This choice affects the CMK key version lifecycle.

    The Key Vault Managed Hardware Security Module (HSM) option is only supported with the Key URI option.

1. Select **Save** to grant access to the resource.

# [Azure CLI](#tab/azure-cli)

To configure CMKs for an Azure VMware Solution private cloud with automatic updating of the key version, call [az vmware private-cloud add-cmk-encryption](/cli/azure/vmware/private-cloud?view=azure-cli-latest#az-vmware-private-cloud-add-cmk-encryption&preserve-view=true). Get the key vault URL and save it to a variable. You need this value in the next step to enable CMK.
    
```azurecli-interactive
keyVaultUrl =$(az keyvault show --name <keyvault_name> --resource-group <resource_group_name> --query properties.vaultUri --output tsv)
```

The following options 1 and 2 demonstrate the difference between not providing a specific key version and providing one.

### Option 1

This example shows the customer not providing a specific key version.
    
```azurecli-interactive
az vmware private-cloud add-cmk-encryption --private-cloud <private_cloud_name> --resource-group <resource_group_name> --enc-kv-url $keyVaultUrl --enc-kv-key-name <keyvault_key_name>
```

### Option 2

Supply the key version as an argument to use CMKs with a specific key version, as previously mentioned in the Azure portal option 2. The following example shows the customer providing a specific key version.
    
```azurecli-interactive
az vmware private-cloud add-cmk-encryption --private-cloud <private_cloud_name> --resource-group <resource_group_name> --enc-kv-url $keyVaultUrl --enc-kv-key-name --enc-kv-key-version <keyvault_key_keyVersion>
```
---

## Change from a customer-managed key to a Microsoft managed key

When a customer wants to change from a CMK to a Microsoft-managed key (MMK), the VM workload isn't interrupted. To make the change from a CMK to an MMK:

1. Under **Manage**, select **Encryption** from your Azure VMware Solution private cloud.
1. Select **Microsoft-managed keys (MMK)**.
1. Select **Save**.
  
## Limitations

Key Vault must be configured as recoverable. You need to:

- Configure Key Vault with the **Soft Delete** option.
- Turn on **Purge Protection** to guard against force deletion of the secret vault, even after soft delete.

Updating CMK settings don't work if the key is expired or the Azure VMware Solution access key was revoked.

## Troubleshooting and best practices

Here are troubleshooting tips for some common issues you might encounter and also best practices to follow.

### Accidental deletion of a key

If you accidentally delete your key in the key vault, the private cloud can't perform some cluster modification operations. To avoid this scenario, we recommend that you keep soft deletes enabled in the key vault. This option ensures that if a key is deleted, it can be recovered within a 90-day period as part of the default soft-delete retention. If you're within the 90-day period, you can restore the key to resolve the issue.

### Restore key vault permission

If you have a private cloud that has lost access to the CMK, check if Managed System Identity (MSI) requires permissions in the key vault. The error notification returned from Azure might not correctly indicate MSI requiring permissions in the key vault as the root cause. Remember, the required permissions are `get`, `wrapKey`, and `unwrapKey`. See step 4 in [Prerequisites](#prerequisites).

### Fix an expired key

If you aren't using the autorotate function and the CMK expired in Key Vault, you can change the expiration date on the key.

### Restore key vault access

Ensure that the MSI is used for providing private cloud access to the key vault.

### Deletion of MSI

If you accidentally delete the MSI associated with a private cloud, you need to disable the CMK. Then follow the steps to enable the CMK from the start.

## Next steps

- Learn about [Azure Key Vault backup and restore](../key-vault/general/backup.md?tabs=azure-cli).
- Learn about [Azure Key Vault recovery](../key-vault/general/key-vault-recovery.md?tabs=azure-portal#list-recover-or-purge-a-soft-deleted-key-vault).
