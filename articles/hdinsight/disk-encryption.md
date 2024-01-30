---
title: Double encryption for data at rest
titleSuffix: Azure HDInsight
description: This article describes the two layers of encryption available for data at rest on Azure HDInsight clusters.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/23/2023
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
---
# Azure HDInsight double encryption for data at rest

This article discusses methods for encryption of data at rest in Azure HDInsight clusters. Data encryption at rest refers to encryption on managed disks (data disks, OS disks and temporary disks) attached to HDInsight cluster virtual machines. 

This document doesn't address data stored in your Azure Storage account. Your clusters may have one or more attached Azure Storage accounts where the encryption keys could also be Microsoft-managed or customer-managed, but the encryption service is different. For more information about Azure Storage encryption, see [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md).

## Introduction

There are three main managed disk roles in Azure: the data disk, the OS disk, and the temporary disk. For more information about different types of managed disks, see [Introduction to Azure managed disks](../virtual-machines/managed-disks-overview.md). 

HDInsight supports multiple types of encryption in two different layers:

- Server Side Encryption (SSE) - SSE is performed by the storage service. In HDInsight, SSE is used to encrypt OS disks and data disks. It is enabled by default. SSE is a layer 1 encryption service.
- Encryption at host using platform-managed key - Similar to SSE, this type of encryption is performed by the storage service. However, it is only for temporary disks and is not enabled by default. Encryption at host is also a layer 1 encryption service.
- Encryption at rest using customer managed key - This type of encryption can be used on data and temporary disks. It is not enabled by default and requires the customer to provide their own key through Azure key vault. Encryption at rest is a layer 2 encryption service.

These types are summarized in the following table.

|Cluster type |OS Disk (Managed disk) |Data disk (Managed disk) |Temp data disk (Local SSD) |
|---|---|---|---|
|Kafka, HBase with Accelerated writes|Layer1: [SSE Encryption](../virtual-machines/managed-disks-overview.md#encryption) by default|Layer1: [SSE Encryption](../virtual-machines/managed-disks-overview.md#encryption) by default, Layer2: Optional encryption at rest using CMK|Layer1: Optional Encryption at host using PMK, Layer2: Optional encryption at rest using CMK|
|All other clusters (Spark, Interactive, Hadoop, HBase without Accelerated writes)|Layer1: [SSE Encryption](../virtual-machines/managed-disks-overview.md#encryption) by default|N/A|Layer1: Optional Encryption at host using PMK, Layer2: Optional encryption at rest using CMK|

## Encryption at rest using Customer-managed keys

Customer-managed key encryption is a one-step process handled during cluster creation at no additional cost. All you need to do is to authorize a managed identity with Azure Key Vault and add the encryption key when you create your cluster.

Both data disks and temporary disks on each node of the cluster are encrypted with a symmetric Data Encryption Key (DEK). The DEK is protected using the Key Encryption Key (KEK) from your key vault. The encryption and decryption processes are handled entirely by Azure HDInsight.

For OS disks attached to the cluster VMs only one layer of encryption (PMK) is available. It is recommended that customers avoid copying sensitive data to OS disks if having a CMK encryption is required for their scenarios.

If the key vault firewall is enabled on the key vault where the disk encryption key is stored, the HDInsight regional Resource Provider IP addresses for the region where the cluster will be deployed must be added to the key vault firewall configuration. This is necessary because HDInsight is not a trusted Azure key vault service.

You can use the Azure portal or Azure CLI to safely rotate the keys in the key vault. When a key rotates, the HDInsight cluster starts using the new key within minutes. Enable the [Soft Delete](../key-vault/general/soft-delete-overview.md) key protection features to protect against ransomware scenarios and accidental deletion. Key vaults without this protection feature aren't supported.

### Get started with customer-managed keys

To create a customer-managed key enabled HDInsight cluster, we'll go through the following steps:

1. Create managed identities for Azure resources
1. Create Azure Key Vault
1. Create key
1. Create access policy
1. Create HDInsight cluster with customer-managed key enabled
1. Rotating the encryption key

Each step is explained in one of the following sections in detail.

### Create managed identities for Azure resources

Create a user-assigned managed identity to authenticate to Key Vault.

See [Create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md) for specific steps. For more information on how managed identities work in Azure HDInsight, see [Managed identities in Azure HDInsight](hdinsight-managed-identities.md). Be sure to save the managed identity resource ID for when you add it to the Key Vault access policy.

### Create Azure Key Vault

Create a key vault. See [Create Azure Key Vault](../key-vault/general/quick-create-portal.md) for specific steps.

HDInsight only supports Azure Key Vault. If you have your own key vault, you can import your keys into Azure Key Vault. Remember that the key vault must have **Soft delete** enabled. For more information about importing existing keys, visit [About keys, secrets, and certificates](../key-vault/general/about-keys-secrets-certificates.md).

### Create key

1. From your new key vault, navigate to **Settings** > **Keys** > **+ Generate/Import**.

    :::image type="content" source="./media/disk-encryption/create-new-key.png" alt-text="Generate a new key in Azure Key Vault":::

1. Provide a name, then select **Create**. Maintain the default **Key Type** of **RSA**.

    :::image type="content" source="./media/disk-encryption/create-key.png" alt-text="generates key name":::

1. When you return to the **Keys** page, select the key you created.

    :::image type="content" source="./media/disk-encryption/key-vault-key-list.png" alt-text="key vault key list":::

1. Select the version to open the **Key Version** page. When you use your own key for HDInsight cluster encryption, you need to provide the key URI. Copy the **Key identifier** and save it somewhere until you're ready to create your cluster.

    :::image type="content" source="./media/disk-encryption/get-key-identifier.png" alt-text="get key identifier":::

### Create access policy

1. From your new key vault, navigate to **Settings** > **Access policies** > **+ Add Access Policy**.

    :::image type="content" source="./media/disk-encryption/key-vault-access-policy.png" alt-text="Create new Azure Key Vault access policy":::

1. From the **Add access policy** page, provide the following information:

    |Property |Description|
    |---|---|
    |Key Permissions|Select **Get**, **Unwrap Key**, and **Wrap Key**.|
    |Secret Permissions|Select **Get**, **Set**, and **Delete**.|
    |Select principal|Select the user-assigned managed identity you created earlier.|

    :::image type="content" source="./media/disk-encryption/azure-portal-add-access-policy.png" alt-text="Set Select Principal for Azure Key Vault access policy":::

1. Select **Add**.

1. Select **Save**.

    :::image type="content" source="./media/disk-encryption/add-key-vault-access-policy-save.png" alt-text="Save Azure Key Vault access policy":::

### Create cluster with customer-managed key disk encryption

You're now ready to create a new HDInsight cluster. Customer-managed keys can only be applied to new clusters during cluster creation. Encryption can't be removed from customer-managed key clusters, and customer-managed keys can't be added to existing clusters.

Beginning with the November 2020 release, HDInsight supports the creation of clusters using both versioned and version-less key URIs. If you create the cluster with a version-less key URI, then the HDInsight cluster will try to perform key auto-rotation when the key is updated in your Azure Key Vault. If you create the cluster with a versioned key URI, you will have to perform a manual key rotation as discussed in [Rotating the encryption key](#rotating-the-encryption-key).

For clusters created before the November 2020 release, you will have to perform key rotation manually using the versioned key URI.

### VM types that support disk encryption

| Size | vCPU | Memory: GiB |
|-------------------|-----------|-------------|
| Standard_D4a_v4 | 4    | 16
| Standard_D8a_v4 | 8    | 32
| Standard_D16a_v4 | 16  | 64
| Standard_D32a_v4 | 32  | 128
| Standard_D48a_v4 | 48  | 192
| Standard_D64a_v4 | 64  | 256
| Standard_D96a_v4 | 96  | 384
| Standard_E64is_v3 | 64  | 432
| Standard_E20s_V3 | 20  | 160
| Standard_E2s_V3 | 2  | 16
| Standard_E2a_v4 | 2  | 16
| Standard_E4a_v4 | 4  | 32
| Standard_E8a_v4 | 8  | 64
| Standard_E16a_v4 | 16  | 128
| Standard_E20a_v4 | 20  | 160
| Standard_E32a_v4 | 32  | 256
| Standard_E48a_v4 | 48  | 384
| Standard_E64a_v4 | 64  | 512
| Standard_E96a_v4 | 96  | 672
| Standard_DS3_v2 | 4  | 14
| Standard_DS4_v2 | 8  | 28
| Standard_DS5_v2 | 16  | 56
| Standard_DS12_v2 | 4  | 28
| Standard_DS13_v2 | 8  | 56
| Standard_DS14_v2 | 16  | 112

#### Using the Azure portal

During cluster creation, you can either use a versioned key, or a versionless key in the following way:

- **Versioned** - During cluster creation, provide the full **Key identifier**, including the key version. For example, `https://contoso-kv.vault.azure.net/keys/myClusterKey/46ab702136bc4b229f8b10e8c2997fa4`.
- **Versionless** - During cluster creation, provide only the **Key identifier**. For example, `https://contoso-kv.vault.azure.net/keys/myClusterKey`.

You also need to assign the managed identity to the cluster.

:::image type="content" source="./media/disk-encryption/create-cluster-portal.png" alt-text="Create new cluster":::

#### Using Azure CLI

The following example shows how to use Azure CLI to create a new Apache Spark cluster with disk encryption enabled. For more information, see [Azure CLI az hdinsight create](/cli/azure/hdinsight#az-hdinsight-create). The parameter `encryption-key-version` is optional.

```azurecli
az hdinsight create -t spark -g MyResourceGroup -n MyCluster \
-p "HttpPassword1234!" --workernode-data-disks-per-node 2 \
--storage-account MyStorageAccount \
--encryption-key-name SparkClusterKey \
--encryption-key-version 00000000000000000000000000000000 \
--encryption-vault-uri https://MyKeyVault.vault.azure.net \
--assign-identity MyMSI
```

#### Using Azure Resource Manager templates

The following example shows how to use an Azure Resource Manager template to create a new Apache Spark cluster with disk encryption enabled. For more information, see [What are ARM templates?](../azure-resource-manager/templates/overview.md). The resource manager template property `diskEncryptionKeyVersion` is optional.

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

### Rotating the encryption key

You can change the encryption keys used on your running cluster, using the Azure portal or Azure CLI. For this operation, the cluster must have access to both the current key and the intended new key, otherwise the rotate key operation will fail. For clusters created after the November 2020 release you can choose if you want to your new key to have a version or not. For clusters created before the November 2020 release, you must use a versioned key when rotating the encryption key.

#### Using the Azure portal

To rotate the key, you need the base key vault URI. Once you've done that, go to the HDInsight cluster properties section in the portal and click on **Change Key** under **Disk Encryption Key URL**. Enter in the new key url and submit to rotate the key.

:::image type="content" source="./media/disk-encryption/change-key.png" alt-text="rotate disk encryption key":::

#### Using Azure CLI

The following example shows how to rotate the disk encryption key for an existing HDInsight cluster. For more information, see [Azure CLI az hdinsight rotate-disk-encryption-key](/cli/azure/hdinsight#az-hdinsight-rotate-disk-encryption-key).

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

:::image type="content" source="./media/disk-encryption/ambari-alert.png" alt-text="key access Ambari alert":::

**How can I recover the cluster if the keys are deleted?**

Since only "Soft Delete" enabled keys are supported, if the keys are recovered in the key vault, the cluster should regain access to the keys. To recover an Azure Key Vault key, see [Undo-AzKeyVaultKeyRemoval](/powershell/module/az.keyvault/Undo-AzKeyVaultKeyRemoval) or [az-keyvault-key-recover](/cli/azure/keyvault/key#az-keyvault-key-recover).


**If a cluster is scaled up, will the new nodes support customer-managed keys seamlessly?**

Yes. The cluster needs access to the key in the key vault during scale up. The same key is used to encrypt both managed disks and resource disks in the cluster.

**Are customer-managed keys available in my location?**

HDInsight customer-managed keys are available in all public clouds and national clouds.

## Encryption at host using platform-managed keys

### Enable in the Azure portal

Encryption at host can be enabled during cluster creation in the Azure portal.

> [!Note]
> When encryption at host is enabled, you cannot add applications to your HDInsight cluster from the Azure marketplace.

:::image type="content" source="media/disk-encryption/encryption-at-host.png" alt-text="Enable encryption at host.":::

This option enables [encryption at host](../virtual-machines/disks-enable-host-based-encryption-portal.md) for HDInsight VMs temp data disks using PMK. Encryption at host is only [supported on certain VM SKUs in limited regions](../virtual-machines/disks-enable-host-based-encryption-portal.md) and HDInsight supports the [following node configuration and SKUs](./hdinsight-supported-node-configuration.md).

To understand the right VM size for your HDInsight cluster see [Selecting the right VM size for your Azure HDInsight cluster](hdinsight-selecting-vm-size.md). The default VM SKU for Zookeeper node when encryption at host is enabled will be DS2V2.

### Enable using PowerShell

The following code snippet shows how you can create a new Azure HDInsight cluster that has encryption at host enabled using PowerShell. It uses the parameter `-EncryptionAtHost $true` to enable the feature.

```powershell
$storageAccountResourceGroupName = "Group"
$storageAccountName = "yourstorageacct001"
$storageAccountKey = Get-AzStorageAccountKey `
    -ResourceGroupName $storageAccountResourceGroupName `
    -Name $storageAccountName | %{ $_.Key1 }
$storageContainer = "container002"
# Cluster configuration info
$location = "East US 2"
$clusterResourceGroupName = "Group"
$clusterName = "your-hadoop-002"
$clusterCreds = Get-Credential
# If the cluster's resource group doesn't exist yet, run:
# New-AzResourceGroup -Name $clusterResourceGroupName -Location $location
# Create the cluster
New-AzHDInsightCluster `
    -ClusterType Hadoop `
    -ClusterSizeInNodes 4 `
    -ResourceGroupName $clusterResourceGroupName `
    -ClusterName $clusterName `
    -HttpCredential $clusterCreds `
    -Location $location `
    -DefaultStorageAccountName "$storageAccountName.blob.core.contoso.net" `
    -DefaultStorageAccountKey $storageAccountKey `
    -DefaultStorageContainer $storageContainer `
    -SshCredential $clusterCreds `
    -EncryptionAtHost $true `
```

### Enable using Azure CLI

The following code snippet shows how you can create a new Azure HDInsight cluster that has encryption at host enabled, using Azure CLI. It uses the parameter `--encryption-at-host true` to enable the feature.

```azurecli
az hdinsight create -t spark -g MyResourceGroup -n MyCluster \\
-p "yourpass" \\
--storage-account MyStorageAccount --encryption-at-host true
```

## Next steps

* For more information about Azure Key Vault, see [What is Azure Key Vault](../key-vault/general/overview.md).
* [Overview of enterprise security in Azure HDInsight](./domain-joined/hdinsight-security-overview.md).
