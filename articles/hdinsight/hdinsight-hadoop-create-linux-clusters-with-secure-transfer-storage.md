---
title: Apache Hadoop & secure transfer storage - Azure HDInsight
description: Learn how to create HDInsight clusters with secure transfer enabled Azure storage accounts.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 07/10/2023
---

# Apache Hadoop clusters with secure transfer storage accounts in Azure HDInsight

The [Secure transfer required](../storage/common/storage-require-secure-transfer.md) feature enhances the security of your Azure Storage account by enforcing all requests to your account through a secure connection. This feature and the wasbs scheme are only supported by HDInsight cluster version 3.6 or newer.

> [!IMPORTANT]
> Enabling secure storage transfer after creating a cluster can result in errors using your storage account and is not recommended. It is better to create a new cluster using a storage account with secure transfer already enabled.

## Storage accounts

### Azure portal

By default, the secure transfer required property is enabled when you create a storage account in Azure portal.

To update an existing storage account with Azure portal, see [Require secure transfer with Azure portal](../storage/common/storage-require-secure-transfer.md#require-secure-transfer-for-an-existing-storage-account).

### PowerShell

For the PowerShell cmdlet [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount), ensure parameter `-EnableHttpsTrafficOnly` is set to `1`.

To update an existing storage account with PowerShell, see [Require secure transfer with PowerShell](../storage/common/storage-require-secure-transfer.md#require-secure-transfer-with-powershell).

### Azure CLI

For the Azure CLI command [az storage account create](/cli/azure/storage/account#az-storage-account-create), ensure parameter `--https-only` is set to `true`.

To update an existing storage account with Azure CLI, see [Require secure transfer with Azure CLI](../storage/common/storage-require-secure-transfer.md#require-secure-transfer-with-azure-cli).

### Secure transfer error(s)


If you accidentally enabled the 'Require secure transfer' option after creating the HDInsight cluster, you may be seeing error messages like the following:

`com.microsoft.azure.storage.StorageException: The account being accessed does not support http.`

For Hbase clusters only, you can try the following steps to restore the cluster functionality:
1. Stop HBase from Ambari.
2. Stop HDFS from Ambari.
3. In Ambari, navigate to HDFS --> Configs --> Advanced --> fs.defaultFS
4. Change wasb to wasbs and save it.
5. If you are using the Accelerated Writes feature, the 'hbase.rootDir' under the hbase configs also needs to be changed from wasb to wasbs.
6. Restart all required services.

## Add additional storage accounts

There are several options to add additional secure transfer enabled storage accounts:

* Modify the Azure Resource Manager template in the last section.
* Create a cluster using the [Azure portal](https://portal.azure.com) and specify linked storage account.
* Use script action to add additional secure transfer enabled storage accounts to an existing HDInsight cluster. For more information, see [Add additional storage accounts to HDInsight](hdinsight-hadoop-add-storage.md).

## Next steps

* The use of Azure Storage (WASB) instead of [Apache Hadoop HDFS](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsUserGuide.html) as the default data store
* For information on how HDInsight uses Azure Storage, see [Use Azure Storage with HDInsight](hdinsight-hadoop-use-blob-storage.md).
* For information on how to upload data to HDInsight, see [Upload data to HDInsight](hdinsight-upload-data.md).
