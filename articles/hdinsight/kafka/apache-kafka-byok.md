---
title: Bring your own keys for Apache Kafka on Azure HDInsight
description: This article describes how to use your own key from Azure Key Vault to encrypt data stored in Apache Kafka on Azure HDInsight.
services: hdinsight
ms.service: hdinsight
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.topic: conceptual
ms.date: 09/24/2018
---

# Bring your own keys for Apache Kafka on Azure HDInsight

All managed disks are protected with Azure Storage Service Encryption (SSE), and with Bring Your Own Key (BYOK) support for Apache Kafka on HDInsight, you can own and manage the keys used to encrypt data at rest. BYOK encryption is a one-step process handled during cluster creation at no additional cost. All you need to do is register HDInsight as a managed identity with Azure Key Vault and add the encryption key when you create your cluster.

All messages to the Kafka cluster (including replicas maintained by Kafka) are encrypted with a symmetric Data Encryption Key (DEK). The DEK is protected using the Key Encryption Key (KEK) from your key vault. The encryption and decryption processes are handled entirely by Azure HDInsight. 

You can use the Azure portal or Azure CLI to safely rotate the keys in the key vault. When a key rotates, the HDInsight Kafka cluster starts using the new key within minutes. You must enable the "Do Not Purge" and "Soft Delete" key protection features to protect against ransomware scenarios and accidental deletion. Keys without these protection features are not supported.

## Get started with BYOK

1. Create managed identities for Azure resources.

   To authenticate to Key Vault, create a user-assigned managed identity using the [Azure Portal](https://docs.microsoft.com/azure/active-directory/managed-service-identity/how-to-manage-ua-identity-portal), [Azure Powershell](https://docs.microsoft.com/azure/active-directory/managed-service-identity/how-to-manage-ua-identity-powershell), [Azure Resource Manager](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-arm), or [Azure CLI](https://docs.microsoft.com/azure/active-directory/managed-service-identity/how-to-manage-ua-identity-cli). While Azure Active directory is required for managed identities and BYOK to Kafka, Enterprise Security Package (ESP) isn't a requirement. Be sure to save the managed identity resource ID. You need to add it to the key vault access control list.

2. Create or import Azure Key Vault.

   HDInsight only supports Azure Key Vault. If you have your own key vault, you can import your keys into Azure Key Vault. Remember that the keys must have "Soft Delete" and "No Not Purge" enabled. 

   To create a new key vault, follow the [Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-get-started) quickstart. For more information about importing existing keys, visit [About keys, secrets, and certificates](https://docs.microsoft.com/azure/key-vault/about-keys-secrets-and-certificates).

3. Add managed identity to the key vault ACL.

   Add the user-assigned managed identity you created to the Key Vault access control list by setting an access control policy.

4. Create HDInsight cluster

   You're now ready to create a new HDInsight cluster. BYOK can only be applied to new clusters during cluster creation. Encryption can't be removed from BYOK clusters, and BYOK can't be added to old clusters.

   During cluster creation, provide the full key URL, including the key version. For example, `myakv.azure.com/KEK1/v1`. You also need to assign the managed identity to the cluster and provide the key UI.

## FAQ for BYOK to Kafka

**How does the Kafka cluster access my key vault?**

   You need to associate a managed identity with the HDInsight Kafka cluster during cluster creation. This managed identity can be created before or during cluster creation. You also need to grant the managed identity access to the key vault where the key is stored.

**Is this feature available for all Kafka clusters on HDInsight?**

   BYOK encryption is only possible for Kafka 1.1 clusters created on or after September 24, 2018.

**Can I have different keys for different topics/partitions?**

   No, all managed disks in the cluster are encrypted by the same key.

**How are keys rotated? How long is the old key valid?**
   
   You can create a new version of the existing key or create a new key. Rotating keys can be done using the [RotateKey API]() and in the Azure portal on the HDInsight cluster resource. The old key is valid as long as it exists in the key vault and the cluster has access.

   If the old key is inaccessible while rotating, the RotateKey API fails and a warning appears in the Azure portal. The cluster continues to function but in an unsupported state, even though it may keep functioning for some time. Once access to the old key is restored, the RotateKey API can be called again successfully.

**What if I lose access to my key vault used to encrypt the data disks of the Kafka cluster?**

   HDInsight Kafka clusters periodically check for access to the encryption key. If the cluster can't access the key vault or the key, the Azure portal produces a warning. The cluster may keep functioning for some time (until VMs reboot periodically) but in an unsupported state.

**What if keys are deleted in the key vault?**

   Only keys which have “Soft Delete” and “Do Not Purge” enabled are supported. HDInsight cluster loses access to the key if a key is deleted in the key vault. When a cluster cannot access the key vault or the key, the Azure portal produces a warning. The cluster may keep functioning for some time (until VMs reboot periodically), but in an unsupported state.

**How can I recover the cluster if the keys are deleted?**

   Since only “Soft Delete” enabled keys are supported, if the keys are restored in the key vault, the cluster should regain access to the keys. To restore an Azure Key Vault key, see [Restore-AzureKeyVaultKey](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.8.1).

**Can I have producer/consumer applications working with a BYOK cluster and a non-BYOK cluster simultaneously?**

   Yes. The use of BYOK is transparent to producer/consumer applications. Encryption happens at the OS layer. No changes need to be made to existing producer/consumer Kafka applications.

**Are OS disks/Resource disks also encrypted?**

   No. OS disks and Resource disks are not encrypted.

**If a cluster is scaled up, will the new brokers support BYOK seamlessly?**

   Yes. The cluster needs access to the key in the key vault during scale up. The same key is used to encrypt all managed disks in the cluster.

**Is this feature be available in all regions?**

   Yes, in all regions where HDInsight and Azure Key Vault and managed identities for Azure resources are available

## Next Steps

* For more information about Azure Key Vault, see [What is Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-whatis)?
* To get started with Azure Key Vault, see [Getting Started with Azure Key Vault](https://docs.microsoft.com/azure/key-vault/key-vault-get-started).
