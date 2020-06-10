---
title: Customer-managed key disk encryption for Azure HDInsight
description: This article describes how to use your own encryption key from Azure Key Vault to encrypt data stored on managed disks in Azure HDInsight clusters.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: hrasheed
ms.service: hdinsight
ms.topic: conceptual
ms.date: 04/15/2020
---

# Customer-managed key disk encryption

Azure HDInsight supports customer-managed key encryption for data on managed disks and resource disks attached to HDInsight cluster virtual machines. This feature allows you to use Azure Key Vault to manage the encryption keys that secure data at rest on your HDInsight clusters.

All managed disks in HDInsight are protected with Azure Storage Service Encryption (SSE). By default, the data on those disks is encrypted using Microsoft-managed keys. If you enable customer-managed keys for HDInsight, you provide the encryption keys for HDInsight to use and manage those keys using Azure Key Vault.

This document doesn't address data stored in your Azure Storage account. For more information about Azure Storage encryption, see [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md). Your clusters may have one or more attached Azure Storage accounts where the encryption keys could also be Microsoft-managed or customer-managed, but the encryption service is different.

## Introduction

Customer-managed key encryption is a one-step process handled during cluster creation at no additional cost. All you need to do is register HDInsight as a managed identity with Azure Key Vault and add the encryption key when you create your cluster.

Both resource disk and managed disks on each node of the cluster are encrypted with a symmetric Data Encryption Key (DEK). The DEK is protected using the Key Encryption Key (KEK) from your key vault. The encryption and decryption processes are handled entirely by Azure HDInsight.

If the key vault firewall is enabled on the key vault where the disk encryption key is stored, the HDInsight regional Resource Provider IP addresses for the region where the cluster will be deployed must be added to the key vault firewall configuration. This is necessary because HDInsight is not a trusted Azure key vault service.

You can use the Azure portal or Azure CLI to safely rotate the keys in the key vault. When a key rotates, the HDInsight cluster starts using the new key within minutes. Enable the [Soft Delete](../key-vault/general/overview-soft-delete.md) key protection features to protect against ransomware scenarios and accidental deletion. Key vaults without this protection feature aren't supported.

|Cluster type |OS Disk (Managed disk) |Data disk (Managed disk) |Temp data disk (Local SSD) |
|---|---|---|---|
|Kafka, HBase with Accelerated writes|[SSE Encryption](https://docs.microsoft.com/azure/virtual-machines/windows/managed-disks-overview#encryption)|SSE Encryption + Optional CMK encryption|Optional CMK encryption|
|All other clusters (Spark, Interactive, Hadoop, HBase without Accelerated writes)|SSE Encryption|N/A|Optional CMK encryption|

## Get started with customer-managed keys

To create a customer-managed key enabled HDInsight cluster, we'll go through the following steps:

1. Create managed identities for Azure resources
1. Create Azure Key Vault
1. Create key
1. Create access policy
1. Create HDInsight cluster with customer-managed key enabled
1. Rotating the encryption key

## Create managed identities for Azure resources

Create a user-assigned managed identity to authenticate to Key Vault.

See [Create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md) for specific steps. For more information on how managed identities work in Azure HDInsight, see [Managed identities in Azure HDInsight](hdinsight-managed-identities.md). Be sure to save the managed identity resource ID for when you add it to the Key Vault access policy.

## Create Azure Key Vault

Create a key vault. See [Create Azure Key Vault](../key-vault/secrets/quick-create-portal.md) for specific steps.

HDInsight only supports Azure Key Vault. If you have your own key vault, you can import your keys into Azure Key Vault. Remember that the key vault must have **Soft delete** enabled. For more information about importing existing keys, visit [About keys, secrets, and certificates](../key-vault/about-keys-secrets-and-certificates.md).

## Create key

1. From your new key vault, navigate to **Settings** > **Keys** > **+ Generate/Import**.

    ![Generate a new key in Azure Key Vault](./media/disk-encryption/create-new-key.png "Generate a new key in Azure Key Vault")

1. Provide a name, then select **Create**. Maintain the default **Key Type** of **RSA**.

    ![generates key name](./media/disk-encryption/create-key.png "Generate key name")

1. When you return to the **Keys** page, select the key you created.

    ![key vault key list](./media/disk-encryption/key-vault-key-list.png)

1. Select the version to open the **Key Version** page. When you use your own key for HDInsight cluster encryption, you need to provide the key URI. Copy the **Key identifier** and save it somewhere until you're ready to create your cluster.

    ![get key identifier](./media/disk-encryption/get-key-identifier.png)

## Create access policy

1. From your new key vault, navigate to **Settings** > **Access policies** > **+ Add Access Policy**.

    ![Create new Azure Key Vault access policy](./media/disk-encryption/key-vault-access-policy.png)

1. From the **Add access policy** page, provide the following information:

    |Property |Description|
    |---|---|
    |Key Permissions|Select **Get**, **Unwrap Key**, and **Wrap Key**.|
    |Secret Permissions|Select **Get**, **Set**, and **Delete**.|
    |Select principal|Select the user-assigned managed identity you created earlier.|

    ![Set Select Principal for Azure Key Vault access policy](./media/disk-encryption/azure-portal-add-access-policy.png)

1. Select **Add**.

1. Select **Save**.

    ![Save Azure Key Vault access policy](./media/disk-encryption/add-key-vault-access-policy-save.png)

## Create cluster with customer-managed key disk encryption

You're now ready to create a new HDInsight cluster. Customer-managed key can only be applied to new clusters during cluster creation. Encryption can't be removed from customer-managed key clusters, and customer-managed key can't be added to existing clusters.

### Using the Azure portal

During cluster creation, provide the full **Key identifier**, including the key version. For example, `https://contoso-kv.vault.azure.net/keys/myClusterKey/46ab702136bc4b229f8b10e8c2997fa4`. You also need to assign the managed identity to the cluster and provide the key URI.

![Create new cluster](./media/disk-encryption/create-cluster-portal.png)

### Using Azure CLI

The following example shows how to use Azure CLI to create a new Apache Spark cluster with disk encryption enabled. For more information, see [Azure CLI az hdinsight create](https://docs.microsoft.com/cli/azure/hdinsight?view=azure-cli-latest#az-hdinsight-create).

```azurecli
az hdinsight create -t spark -g MyResourceGroup -n MyCluster \
-p "HttpPassword1234!" --workernode-data-disks-per-node 2 \
--storage-account MyStorageAccount \
--encryption-key-name SparkClusterKey \
--encryption-key-version 00000000000000000000000000000000 \
--encryption-vault-uri https://MyKeyVault.vault.azure.net \
--assign-identity MyMSI
```

### Using Azure Resource Manager templates

The following example shows how to use an Azure Resource Manager template to create a new Apache Spark cluster with disk encryption enabled. For more information, see [What are ARM templates?](https://docs.microsoft.com/azure/azure-resource-manager/templates/overview).

This example uses PowerShell to call the template.

```powershell
$templateFile = "azuredeploy.json"
$ResourceGroupName = "MyResourceGroup"
$clusterName = "MyCluster"
$password = ConvertTo-SecureString 'HttpPassword1234!' -AsPlainText -Force
$diskEncryptionVaultUri = "https://MyKeyVault.vault.azure.net"
$diskEncryptionKeyName = "SparkClusterKey"
$diskEncryptionKeyVersion = "00000000000000000000000000000000"
$managedIdentityName = "MyMSI"

New-AzResourceGroupDeployment `
  -Name mySpark `
  -TemplateFile $templateFile `
  -ResourceGroupName $ResourceGroupName `
  -clusterName $clusterName `
  -clusterLoginPassword $password `
` -sshPassword $password `
  -diskEncryptionVaultUri $diskEncryptionVaultUri `
  -diskEncryptionKeyName $diskEncryptionKeyName `
  -diskEncryptionKeyVersion $diskEncryptionKeyVersion `
  -managedIdentityName $managedIdentityName
```

The contents of the resource management template, `azuredeploy.json`:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "0.9.0.0",
  "parameters": {
    "clusterName": {
      "type": "string",
      "metadata": {
        "description": "The name of the HDInsight cluster to create."
      }
    },
    "clusterLoginUserName": {
      "type": "string",
      "defaultValue": "admin",
      "metadata": {
        "description": "These credentials can be used to submit jobs to the cluster and to log into cluster dashboards."
      }
    },
    "clusterLoginPassword": {
      "type": "securestring",
      "metadata": {
        "description": "The password must be at least 10 characters in length and must contain at least one digit, one non-alphanumeric character, and one upper or lower case letter."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "The location where all azure resources will be deployed."
      }
    },
    "sshUserName": {
      "type": "string",
      "defaultValue": "sshuser",
      "metadata": {
        "description": "These credentials can be used to remotely access the cluster."
      }
    },
    "sshPassword": {
      "type": "securestring",
      "metadata": {
        "description": "The password must be at least 10 characters in length and must contain at least one digit, one non-alphanumeric character, and one upper or lower case letter."
      }
    },
    "headNodeSize": {
      "type": "string",
      "defaultValue": "Standard_D12_v2",
      "metadata": {
        "description": "The VM size of the head nodes."
      }
    },
    "workerNodeSize": {
      "type": "string",
      "defaultValue": "Standard_D13_v2",
      "metadata": {
        "description": "The VM size of the worker nodes."
      }
    },
    "diskEncryptionVaultUri": {
      "type": "string",
      "metadata": {
        "description": "The Key Vault DNSname."
      }
    },
    "diskEncryptionKeyName": {
      "type": "string",
      "metadata": {
        "description": "The Key Vault key name."
      }
    },
    "diskEncryptionKeyVersion": {
      "type": "string",
      "metadata": {
        "description": "The Key Vault key version for the selected key."
      }
    },
    "managedIdentityName": {
      "type": "string",
      "metadata": {
        "description": "The user-assigned managed identity."
      }
    }
  },
  "variables": {
    "defaultStorageAccount": {
      "name": "[uniqueString(resourceGroup().id)]",
      "type": "Standard_LRS"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[variables('defaultStorageAccount').name]",
      "location": "[parameters('location')]",
      "apiVersion": "2019-06-01",
      "sku": {
        "name": "[variables('defaultStorageAccount').type]"
      },
      "kind": "Storage",
      "properties": {}
    },
    {
      "apiVersion": "2018-06-01-preview",
      "name": "[parameters('clusterName')]",
      "type": "Microsoft.HDInsight/clusters",
      "location": "[parameters('location')]",
      "properties": {
        "clusterVersion": "3.6",
        "osType": "Linux",
        "tier": "standard",
        "clusterDefinition": {
          "kind": "spark",
          "componentVersion": {
            "Spark": "2.3"
          },
          "configurations": {
            "gateway": {
              "restAuthCredential.isEnabled": true,
              "restAuthCredential.username": "[parameters('clusterLoginUserName')]",
              "restAuthCredential.password": "[parameters('clusterLoginPassword')]"
            }
          }
        },
        "storageProfile": {
          "storageaccounts": [
            {
              "name": "[replace(replace(reference(resourceId('Microsoft.Storage/storageAccounts', variables('defaultStorageAccount').name), '2019-06-01').primaryEndpoints.blob,'https://',''),'/','')]",
              "isDefault": true,
              "container": "[parameters('clusterName')]",
              "key": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('defaultStorageAccount').name), '2019-06-01').keys[0].value]"
            }
          ]
        },
        "computeProfile": {
          "roles": [
            {
              "name": "headnode",
              "minInstanceCount": 1,
              "targetInstanceCount": 2,
              "hardwareProfile": {
                "vmSize": "[parameters('headNodeSize')]"
              },
              "osProfile": {
                "linuxOperatingSystemProfile": {
                  "username": "[parameters('sshUserName')]",
                  "password": "[parameters('sshPassword')]"
                },
              },
            },
            {
              "name": "workernode",
              "targetInstanceCount": 1,
              "hardwareProfile": {
                "vmSize": "[parameters('workerNodeSize')]"
              },
              "osProfile": {
                "linuxOperatingSystemProfile": {
                  "username": "[parameters('sshUserName')]",
                  "password": "[parameters('sshPassword')]"
                },
              },
            }
          ]
        },
        "minSupportedTlsVersion": "1.2",
        "diskEncryptionProperties": {
          "vaultUri": "[parameters('diskEncryptionVaultUri')]",
          "keyName": "[parameters('diskEncryptionKeyName')]",
          "keyVersion": "[parameters('diskEncryptionKeyVersion')]",
          "msiResourceId": "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/', parameters('managedIdentityName'))]"
        }
      },
      "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
          "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/', parameters('managedIdentityName'))]": {}
        }
      }
    }
  ]
}
```

## Rotating the encryption key

There might be scenarios where you might want to change the encryption keys used by the HDInsight cluster after it has been created. This can be easily via the portal. For this operation, the cluster must have access to both the current key and the intended new key, otherwise the rotate key operation will fail.

### Using the Azure portal

To rotate the key, you need the base key vault URI. Once you've done that, go to the HDInsight cluster properties section in the portal and click on **Change Key** under **Disk Encryption Key URL**. Enter in the new key url and submit to rotate the key.

![rotate disk encryption key](./media/disk-encryption/change-key.png)

### Using Azure CLI

The following example shows how to rotate the disk encryption key for an existing HDInsight cluster. For more information, see [Azure CLI az hdinsight rotate-disk-encryption-key](https://docs.microsoft.com/cli/azure/hdinsight?view=azure-cli-latest#az-hdinsight-rotate-disk-encryption-key).

```azurecli
az hdinsight rotate-disk-encryption-key \
--encryption-key-name SparkClusterKey \
--encryption-key-version 00000000000000000000000000000000 \
--encryption-vault-uri https://MyKeyVault.vault.azure.net \
--name MyCluster \
--resource-group MyResourceGroup
```

## FAQ for customer-managed key encryption

**How does the HDInsight cluster access my key vault?**

HDInsight accesses your Azure Key Vault instance using the managed identity that you associate with the HDInsight cluster. This managed identity can be created before or during cluster creation. You also need to grant the managed identity access to the key vault where the key is stored.

**Is this feature available for all clusters on HDInsight?**

Customer-managed key encryption is available for all cluster types except Spark 2.1 and 2.2.

**Can I use multiple keys to encrypt different disks or folders?**

No, all managed disks and resource disks are encrypted by the same key.

**What happens if the cluster loses access to the key vault or the key?**

If the cluster loses access to the key, warnings will be shown in the Apache Ambari portal. In this state, the **Change Key** operation will fail. Once key access is restored, Ambari warnings will go away and operations such as key rotation can be successfully performed.

![key access Ambari alert](./media/disk-encryption/ambari-alert.png)

**How can I recover the cluster if the keys are deleted?**

Since only "Soft Delete" enabled keys are supported, if the keys are recovered in the key vault, the cluster should regain access to the keys. To recover an Azure Key Vault key, see [Undo-AzKeyVaultKeyRemoval](/powershell/module/az.keyvault/Undo-AzKeyVaultKeyRemoval) or [az-keyvault-key-recover](/cli/azure/keyvault/key?view=azure-cli-latest#az-keyvault-key-recover).

**Which disk types are encrypted? Are OS disks/resource disks also encrypted?**

Resource disks and data/managed disks are encrypted. OS disks aren't encrypted.

**If a cluster is scaled up, will the new nodes support customer-managed keys seamlessly?**

Yes. The cluster needs access to the key in the key vault during scale up. The same key is used to encrypt both managed disks and resource disks in the cluster.

**Are customer-managed keys available in my location?**

HDInsight customer-managed keys are available in all public clouds and national clouds.

## Next steps

* For more information about Azure Key Vault, see [What is Azure Key Vault](../key-vault/general/overview.md).
* [Overview of enterprise security in Azure HDInsight](./domain-joined/hdinsight-security-overview.md).
