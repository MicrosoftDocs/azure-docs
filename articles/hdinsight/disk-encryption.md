---
title: Bring your own key disk encryption for Azure HDInsight
description: This article describes how to use your own encryption key from Azure Key Vault to encrypt data stored on managed disks in Azure HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: hrasheed
ms.service: hdinsight
ms.topic: conceptual
ms.date: 01/06/2019
---

# Bring your own key disk encryption on Azure HDInsight

Azure HDInsight supports Bring Your Own Key (BYOK) encryption for data on managed disks and resource disks attached to HDInsight cluster VMs. This feature, similar to [Azure Disk Encryption](../security/fundamentals/azure-disk-encryption-vms-vmss.md), allows you to use Azure Key Vault to manage the encryption keys that secure data at rest on your HDInsight clusters. This feature is different than  [Azure Storage encryption](../storage/common/storage-service-encryption.md).  Your clusters may have one or more attached Azure Storage accounts where the encryption keys could also be Microsoft-managed or customer-managed, but the encryption service is different.

The following HDInsight 3.6 cluster types are not supported for BYOK disk encryption:

* Spark 2.1 and 2.2
* Kafka 1.0
* ML Services
* Storm

All managed disks and resource disks in HDInsight are protected with Azure Storage Service Encryption (SSE). By default, the data on those disks is encrypted using Microsoft-managed keys. If you enable BYOK, you provide the encryption key for HDInsight to use and manage it using Azure Key Vault.

BYOK encryption is a one-step process handled during cluster creation at no additional cost. All you need to do is register HDInsight as a managed identity with Azure Key Vault and add the encryption key when you create your cluster.

Both resource disk and managed disks on each node of the cluster are encrypted with a symmetric Data Encryption Key (DEK). The DEK is protected using the Key Encryption Key (KEK) from your key vault. The encryption and decryption processes are handled entirely by Azure HDInsight.

You can use the Azure portal or Azure CLI to safely rotate the keys in the key vault. When a key rotates, the HDInsight cluster starts using the new key within minutes. Enable the "Soft Delete" key protection features to protect against ransomware scenarios and accidental deletion. Key vaults without this protection feature aren't supported.

## Get started with BYOK

To create a BYOK enabled HDInsight cluster, we'll go through the following steps:

1. Create managed identities for Azure resources
2. Setup Azure Key Vault and keys
3. Create HDInsight cluster with BYOK enabled
4. Rotating the encryption key

## Create managed identities for Azure resources

To authenticate to Key Vault, create a user-assigned managed identity using the [Azure portal](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md), [Azure PowerShell](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-powershell.md), [Azure Resource Manager](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-arm.md), or [Azure CLI](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli.md). For more information on how managed identities work in Azure HDInsight, see [Managed identities in Azure HDInsight](../hdinsight-managed-identities.md). Be sure to save the managed identity resource ID for when you add it to the Key Vault access policy.

![Create user-assigned managed identity in Azure portal](./media/disk-encryption/user-managed-identity-portal.png)

## Set up the Key Vault and keys

HDInsight only supports Azure Key Vault. If you have your own key vault, you can import your keys into Azure Key Vault. Remember that the keys must have "Soft Delete". The "Soft Delete" feature is available through the REST, .NET/C#, PowerShell, and Azure CLI interfaces.

1. To create a new key vault, follow the [Azure Key Vault](../key-vault/key-vault-overview.md) quickstart. For more information about importing existing keys, visit [About keys, secrets, and certificates](../key-vault/about-keys-secrets-and-certificates.md).

1. Enable "soft-delete" on the key-vault by using the [az keyvault update](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-update) CLI command.

    ```azurecli
    az keyvault update --name <Key Vault Name> --enable-soft-delete
    ```

1. Create keys.

    a. To create a new key, select **Generate/Import** from the **Keys** menu under **Settings**.

    ![Generate a new key in Azure Key Vault](./media/disk-encryption/create-new-key.png "Generate a new key in Azure Key Vault")

    b. Set **Options** to **Generate** and give the key a name.

    ![generates key name](./media/disk-encryption/create-key.png "Generate key name")

    c. Select the key you created from the list of keys.

    ![key vault key list](./media/disk-encryption/key-vault-key-list.png)

    d. When you use your own key for HDInsight cluster encryption, you need to provide the key URI. Copy the **Key identifier** and save it somewhere until you're ready to create your cluster.

    ![get key identifier](./media/disk-encryption/get-key-identifier.png)

1. Add managed identity to the key vault access policy.

    a. Create a new Azure Key Vault access policy.

    ![Create new Azure Key Vault access policy](./media/disk-encryption/add-key-vault-access-policy.png)

    b. Under **Select Principal**, choose the user-assigned managed identity you created.

    ![Set Select Principal for Azure Key Vault access policy](./media/disk-encryption/add-key-vault-access-policy-select-principal.png)

    c. Set **Key Permissions** to **Get**, **Unwrap Key**, and **Wrap Key**.

    ![Set Key Permissions for Azure Key Vault access policy1](./media/disk-encryption/add-key-vault-access-policy-keys.png "Set Key Permissions for Azure Key Vault access policy1")

    d. Set **Secret Permissions** to **Get**, **Set**, and **Delete**.

    ![Set Key Permissions for Azure Key Vault access policy2](./media/disk-encryption/add-key-vault-access-policy-secrets.png "Set Key Permissions for Azure Key Vault access policy2")

    e. Select **Save**.

    ![Save Azure Key Vault access policy](./media/disk-encryption/add-key-vault-access-policy-save.png)

## Create HDInsight cluster

You're now ready to create a new HDInsight cluster. BYOK can only be applied to new clusters during cluster creation. Encryption can't be removed from BYOK clusters, and BYOK can't be added to existing clusters.

During cluster creation, provide the full key URL, including the key version. For example, `https://contoso-kv.vault.azure.net/keys/myClusterKey/46ab702136bc4b229f8b10e8c2997fa4`. You also need to assign the managed identity to the cluster and provide the key URI.

## Rotating the Encryption key

There might be scenarios where you might want to change the encryption keys used by the HDInsight cluster after it has been created. This can be easily via the portal. For this operation, the cluster must have access to both the current key and the intended new key, otherwise the rotate key operation will fail.

To rotate the key, you must have the full url of the new key (See Step 3 of [Setup the Key Vault and Keys](#set-up-the-key-vault-and-keys)). Once you've done that, go to the HDInsight cluster properties section in the portal and click on **Change Key** under **Disk Encryption Key URL**. Enter in the new key url and submit to rotate the key.

![rotate disk encryption key](./media/disk-encryption/change-key.png)

## FAQ for BYOK

**How does the HDInsight cluster access my key vault?**

Associate a managed identity with the HDInsight cluster during cluster creation. This managed identity can be created before or during cluster creation. You also need to grant the managed identity access to the key vault where the key is stored.

**Is this feature available for all clusters on HDInsight?**

BYOK encryption is available for all cluster types except Spark 2.1 and 2.2.

**Can I use multiple keys to encrypt different disks or folders?**

No, all managed disks and resource disks are encrypted by the same key.

**What happens if the cluster loses access to the key vault or the key?**

If the cluster loses access to the key, warnings will be shown in the Apache Ambari portal. In this state, the **Change Key** operation will fail. Once key access is restored, Ambari warnings will go away and operations such as key rotation can be successfully performed.

![key access Ambari alert](./media/disk-encryption/ambari-alert.png)

**How can I recover the cluster if the keys are deleted?**

Since only “Soft Delete” enabled keys are supported, if the keys are recovered in the key vault, the cluster should regain access to the keys. To recover an Azure Key Vault key, see [Undo-AzKeyVaultKeyRemoval](/powershell/module/az.keyvault/Undo-AzKeyVaultKeyRemoval) or [az-keyvault-key-recover](/cli/azure/keyvault/key?view=azure-cli-latest#az-keyvault-key-recover).

**Which disk types are encrypted? Are OS disks/resource disks also encrypted?**

Resource disks and data/managed disks are encrypted. OS disks are not encrypted.

**If a cluster is scaled up, will the new nodes support BYOK seamlessly?**

Yes. The cluster needs access to the key in the key vault during scale up. The same key is used to encrypt both managed disks and resource disks in the cluster.

**Is BYOK available in my location?**

HDInsight BYOK is available in all public clouds and national clouds.

## Next steps

* [Azure Disk Encryption](../security/fundamentals/azure-disk-encryption-vms-vmss.md)
* [Encrypt OS and attached data disks in a virtual machine scale set with the Azure CLI](https://docs.microsoft.com/en-us/azure/virtual-machine-scale-sets/disk-encryption-cli)
