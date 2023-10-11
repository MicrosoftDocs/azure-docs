---
title: Add additional Azure Storage accounts to HDInsight 
description: Learn how to add additional Azure Storage accounts to an existing HDInsight cluster.
ms.service: hdinsight
ms.topic: how-to
ms.custom: seoapr2020
ms.date: 10/11/2023
---

# Add additional storage accounts to HDInsight

Learn how to use script actions to add additional Azure Storage *accounts* to HDInsight. The steps in this document add a storage *account* to an existing HDInsight cluster. This article applies to storage *accounts* (not the default cluster storage account), and not additional storage such as [`Azure Data Lake Storage Gen1`](hdinsight-hadoop-use-data-lake-storage-gen1.md) and [`Azure Data Lake Storage Gen2`](hdinsight-hadoop-use-data-lake-storage-gen2.md).

> [!IMPORTANT]  
> The information in this document is about adding additional storage account(s) to a cluster after it has been created. For information on adding storage accounts during cluster creation, see [Set up clusters in HDInsight with Apache Hadoop, Apache Spark, Apache Kafka, and more](hdinsight-hadoop-provision-linux-clusters.md).

## Prerequisites

* A Hadoop cluster on HDInsight. See [Get Started with HDInsight on Linux](./hadoop/apache-hadoop-linux-tutorial-get-started.md).
* Storage account name and key. See [Manage storage account access keys](../storage/common/storage-account-keys-manage.md).
* If using PowerShell, you'll need the AZ module.  See [Overview of Azure PowerShell](/powershell/azure/).

## How it works

During processing, the script does the following actions:

* If the storage account already exists in the core-site.xml configuration for the cluster, the script exits and no further actions are done.

* Verifies that the storage account exists and can be accessed using the key.

* Encrypts the key using the cluster credential.

* Adds the storage account to the core-site.xml file.

* Stops and restarts the Apache Oozie, Apache Hadoop YARN, Apache Hadoop MapReduce2, and Apache Hadoop HDFS services. Stopping and starting these services allows them to use the new storage account.

> [!WARNING]  
> Using a storage account in a different location than the HDInsight cluster is not supported.

## Add storage account

Use [Script Action](hdinsight-hadoop-customize-cluster-linux.md#script-action-to-a-running-cluster) to apply the changes with the following considerations:

|Property | Value |
|---|---|
|Bash script URI|`https://hdiconfigactions.blob.core.windows.net/linuxaddstorageaccountv01/add-storage-account-v01.sh`|
|Node type(s)|Head|
|Parameters|`ACCOUNTNAME` `ACCOUNTKEY` `-p` (optional)|

* `ACCOUNTNAME` is the name of the storage account to add to the HDInsight cluster.
* `ACCOUNTKEY` is the access key for `ACCOUNTNAME`.
* `-p` is optional. If specified, the key isn't encrypted and is stored in the core-site.xml file as plain text.

## Verification

When viewing the HDInsight cluster in the Azure portal, selecting the __Storage Accounts__ entry under __Properties__ doesn't display storage accounts added through this script action. Azure PowerShell and Azure CLI don't display the additional storage account either. The storage information isn't displayed because the script only modifies the `core-site.xml` configuration for the cluster. This information isn't used when retrieving the cluster information using Azure management APIs.

To verify the additional storage use one of the methods shown below:

### PowerShell

The script will return the Storage Account name(s) associated with the given cluster. Replace `CLUSTERNAME` with the actual cluster name, and then run the script.

```powershell
# Update values
$clusterName = "CLUSTERNAME"

$creds = Get-Credential -UserName "admin" -Message "Enter the cluster login credentials"

$clusterName = $clusterName.ToLower();

# getting service_config_version
$resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName`?fields=Clusters/desired_service_config_versions/HDFS" `
    -Credential $creds -UseBasicParsing
$respObj = ConvertFrom-Json $resp.Content

$configVersion=$respObj.Clusters.desired_service_config_versions.HDFS.service_config_version

$resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/configurations/service_config_versions?service_name=HDFS&service_config_version=$configVersion" `
    -Credential $creds
$respObj = ConvertFrom-Json $resp.Content

# extract account names
$value = ($respObj.items.configurations | Where type -EQ "core-site").properties | Get-Member -membertype properties | Where Name -Like "fs.azure.account.key.*"
foreach ($name in $value ) { $name.Name.Split(".")[4]}
```

### Apache Ambari

1. From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net`, where `CLUSTERNAME` is the name of your cluster.

1. Navigate to **HDFS** > **Configs** > **Advanced** > **Custom core-site**.

1. Observe the keys that begin with `fs.azure.account.key`. The account name will be a part of the key as seen in this sample image:

   :::image type="content" source="./media/hdinsight-hadoop-add-storage/apache-ambari-verification.png" alt-text="verification through Apache Ambari":::

## Remove storage account

1. From a web browser, navigate to `https://CLUSTERNAME.azurehdinsight.net`, where `CLUSTERNAME` is the name of your cluster.

1. Navigate to **HDFS** > **Configs** > **Advanced** > **Custom core-site**.

1. Remove the following keys:
    * `fs.azure.account.key.<STORAGE_ACCOUNT_NAME>.blob.core.windows.net`
    * `fs.azure.account.keyprovider.<STORAGE_ACCOUNT_NAME>.blob.core.windows.net`

After removing these keys and saving the configuration, you need to restart Oozie, Yarn, MapReduce2, HDFS, and Hive one by one.

## Known issues

### Storage firewall

If you choose to secure your storage account with the **Firewalls and virtual networks** restrictions on **Selected networks**, be sure to enable the exception **Allow trusted Microsoft services** so that HDInsight can access your storage account.

### Unable to access storage after changing key

If you change the key for a storage account, HDInsight can no longer access the storage account. HDInsight uses a cached copy of key in the core-site.xml for the cluster. This cached copy must be updated to match the new key.

Running the script action again **doesn't** update the key, as the script checks to see if an entry for the storage account already exists. If an entry already exists, it doesn't make any changes.

To work around this problem:

* See [Update storage account access keys](hdinsight-rotate-storage-keys.md) on how to rotate the access keys.

* You can also remove the storage account and then add back the storage account.

## Next steps

You've learned how to add additional storage accounts to an existing HDInsight cluster. For more information on script actions, see [Customize Linux-based HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md)
