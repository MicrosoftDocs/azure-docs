---
title: Bring your own key for Apache Kafka on Azure HDInsight (Preview)
description: This article describes how to use your own key from Azure Key Vault to encrypt data stored in Apache Kafka on Azure HDInsight.
services: hdinsight
ms.service: hdinsight
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.topic: conceptual
ms.date: 09/24/2018
---

# Bring your own key for Apache Kafka on Azure HDInsight (Preview)

Azure HDInsight includes Bring Your Own Key (BYOK) support for Apache Kafka. This capability lets you own and manage the keys used to encrypt data at rest. 

All managed disks in HDInsight are protected with Azure Storage Service Encryption (SSE). By default, the data on those disks is encrypted using Microsoft-managed keys. If you enable BYOK, you provide the encryption key for HDInsight to use and manage it using Azure Key Vault. 

BYOK encryption is a one-step process handled during cluster creation at no additional cost. All you need to do is register HDInsight as a managed identity with Azure Key Vault and add the encryption key when you create your cluster.

All messages to the Kafka cluster (including replicas maintained by Kafka) are encrypted with a symmetric Data Encryption Key (DEK). The DEK is protected using the Key Encryption Key (KEK) from your key vault. The encryption and decryption processes are handled entirely by Azure HDInsight. 

You can use the Azure portal or Azure CLI to safely rotate the keys in the key vault. When a key rotates, the HDInsight Kafka cluster starts using the new key within minutes. Enable the "Do Not Purge" and "Soft Delete" key protection features to protect against ransomware scenarios and accidental deletion. Keys without these protection features are not supported.

## Get started with BYOK

1. Create managed identities for Azure resources.

   To authenticate to Key Vault, create a user-assigned managed identity using the [Azure Portal](../../active-directory/managed-service-identity/how-to-manage-ua-identity-portal.md), [Azure PowerShell](../../active-directory/managed-service-identity/how-to-manage-ua-identity-powershell.md), [Azure Resource Manager](../../active-directory/managed-service-identity/how-to-manage-ua-identity-arm.md), or [Azure CLI](../../active-directory/managed-service-identity/how-to-manage-ua-identity-cli.md). While Azure Active directory is required for managed identities and BYOK to Kafka, Enterprise Security Package (ESP) isn't a requirement. Be sure to save the managed identity resource ID for when you add it to the Key Vault access policy.

   ![Create user-assigned managed identity in Azure portal](./media/apache-kafka-byok/user-managed-identity-portal.png)

2. Import an existing key vault or create a new one.

   HDInsight only supports Azure Key Vault. If you have your own key vault, you can import your keys into Azure Key Vault. Remember that the keys must have "Soft Delete" and "Do Not Purge" enabled. The "Soft Delete" and "Do Not Purge" features are available through the REST, .NET/C#, PowerShell, and Azure CLI interfaces.

   To create a new key vault, follow the [Azure Key Vault](../../key-vault/key-vault-get-started.md) quickstart. For more information about importing existing keys, visit [About keys, secrets, and certificates](../../key-vault/about-keys-secrets-and-certificates.md).

   To create a new key, select **Generate/Import** from the **Keys** menu under **Settings**.

   ![Generate a new key in Azure Key Vault](./media/apache-kafka-byok/kafka-create-new-key.png)

   Set **Options** to **Generate** and give the key a name.

   ![Generate a new key in Azure Key Vault](./media/apache-kafka-byok/kafka-create-a-key.png)

   Select the key you created from the list of keys.

   ![Azure Key Vault key list](./media/apache-kafka-byok/kafka-key-vault-key-list.png)

   When you use your own key for Kafka cluster encryption, you need to provide the key URI. Copy the **Key identifier** and save it somewhere until you're ready to create your cluster.

   ![Copy key identifier](./media/apache-kafka-byok/kafka-get-key-identifier.png)
   
3. Add managed identity to the key vault access policy.

   Create a new Azure Key Vault access policy.

   ![Create new Azure Key Vault access policy](./media/apache-kafka-byok/add-key-vault-access-policy.png)

   Under **Select Principal**, choose the user-assigned managed identity you created.

   ![Set Select Principal for Azure Key Vault access policy](./media/apache-kafka-byok/add-key-vault-access-policy-select-principal.png)

   Set **Key Permissions** to **Get**, **Unwrap Key**, and **Wrap Key**.

   ![Set Key Permissions for Azure Key Vault access policy](./media/apache-kafka-byok/add-key-vault-access-policy-keys.png)

   Set **Secret Permissions** to **Get**, **Set**, and **Delete**.

   ![Set Key Permissions for Azure Key Vault access policy](./media/apache-kafka-byok/add-key-vault-access-policy-secrets.png)

4. Create HDInsight cluster

   You're now ready to create a new HDInsight cluster. BYOK can only be applied to new clusters during cluster creation. Encryption can't be removed from BYOK clusters, and BYOK can't be added to existing clusters.

   ![Kafka disk encryption in Azure portal](./media/apache-kafka-byok/apache-kafka-byok-portal.png)

   During cluster creation, provide the full key URL, including the key version. For example, `https://contoso-kv.vault.azure.net/keys/kafkaClusterKey/46ab702136bc4b229f8b10e8c2997fa4`. You also need to assign the managed identity to the cluster and provide the key URI.

## FAQ for BYOK to Kafka

**How does the Kafka cluster access my key vault?**

   Associate a managed identity with the HDInsight Kafka cluster during cluster creation. This managed identity can be created before or during cluster creation. You also need to grant the managed identity access to the key vault where the key is stored.

**Is this feature available for all Kafka clusters on HDInsight?**

   BYOK encryption is only possible for Kafka 1.1 and above clusters.

**Can I have different keys for different topics/partitions?**

   No, all managed disks in the cluster are encrypted by the same key.

**How can I recover the cluster if the keys are deleted?**

   Since only “Soft Delete” enabled keys are supported, if the keys are restored in the key vault, the cluster should regain access to the keys. To restore an Azure Key Vault key, see [Restore-AzureKeyVaultKey](/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey).

**Can I have producer/consumer applications working with a BYOK cluster and a non-BYOK cluster simultaneously?**

   Yes. The use of BYOK is transparent to producer/consumer applications. Encryption happens at the OS layer. No changes need to be made to existing producer/consumer Kafka applications.

**Are OS disks/Resource disks also encrypted?**

   No. OS disks and Resource disks are not encrypted.

**If a cluster is scaled up, will the new brokers support BYOK seamlessly?**

   Yes. The cluster needs access to the key in the key vault during scale up. The same key is used to encrypt all managed disks in the cluster.

**Is BYOK available in my location?**

   Kafka BYOK is available in all public clouds.

## Next steps

* For more information about Azure Key Vault, see [What is Azure Key Vault](../../key-vault/key-vault-whatis.md)?
* To get started with Azure Key Vault, see [Getting Started with Azure Key Vault](../../key-vault/key-vault-get-started.md).
