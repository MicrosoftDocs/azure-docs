---
title: Add additional Azure storage accounts to HDInsight 
description: Learn how to add additional Azure storage accounts to an existing HDInsight cluster.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.topic: conceptual
ms.date: 04/23/2018
ms.author: jasonh

ms.custom: H1Hack27Feb2017,hdinsightactive
---

# Add additional storage accounts to HDInsight

Learn how to use script actions to add additional Azure storage accounts to HDInsight. The steps in this document add a storage account to an existing Linux-based HDInsight cluster.

> [!IMPORTANT]
> The information in this document is about adding additional storage to a cluster after it has been created. For information on adding storage accounts during cluster creation, see [Set up clusters in HDInsight with Hadoop, Spark, Kafka, and more](hdinsight-hadoop-provision-linux-clusters.md).

## How it works

This script takes the following parameters:

* __Azure storage account name__: The name of the storage account to add to the HDInsight cluster. After running the script, HDInsight can read and write data stored in this storage account.

* __Azure storage account key__: A key that grants access to the storage account.

* __-p__ (optional): If specified, the key is not encrypted and is stored in the core-site.xml file as plain text.

During processing, the script performs the following actions:

* If the storage account already exists in the core-site.xml configuration for the cluster, the script exits and no further actions are performed.

* Verifies that the storage account exists and can be accessed using the key.

* Encrypts the key using the cluster credential.

* Adds the storage account to the core-site.xml file.

* Stops and restarts the Oozie, YARN, MapReduce2, and HDFS services. Stopping and starting these services allows them to use the new storage account.

> [!WARNING]
> Using a storage account in a different location than the HDInsight cluster is not supported.

## The script

__Script location__: [https://hdiconfigactions.blob.core.windows.net/linuxaddstorageaccountv01/add-storage-account-v01.sh](https://hdiconfigactions.blob.core.windows.net/linuxaddstorageaccountv01/add-storage-account-v01.sh)

__Requirements__:

* The script must be applied on the __Head nodes__.

## To use the script

This script can be used from the Azure portal, Azure PowerShell, or the Azure Classic CLI. For more information, see the [Customize Linux-based HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md#apply-a-script-action-to-a-running-cluster) document.

> [!IMPORTANT]
> When using the steps provided in the customization document, use the following information to apply this script:
>
> * Replace any example script action URI with the URI for this script (https://hdiconfigactions.blob.core.windows.net/linuxaddstorageaccountv01/add-storage-account-v01.sh).
> * Replace any example parameters with the Azure storage account name and key of the storage account to be added to the cluster. If using the Azure portal, these parameters must be separated by a space.
> * You do not need to mark this script as __Persisted__, as it directly updates the Ambari configuration for the cluster.

## Known issues

### Storage accounts not displayed in Azure portal or tools

When viewing the HDInsight cluster in the Azure portal, selecting the __Storage Accounts__ entry under __Properties__ does not display storage accounts added through this script action. Azure PowerShell and Azure Classic CLI do not display the additional storage account either.

The storage information isn't displayed because the script only modifies the core-site.xml configuration for the cluster. This information is not used when retrieving the cluster information using Azure management APIs.

To view storage account information added to the cluster using this script, use the Ambari REST API. Use the following commands to retrieve this information for your cluster:

```PowerShell
$creds = Get-Credential -UserName "admin" -Message "Enter the cluster login credentials"
$resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/configurations/service_config_versions?service_name=HDFS&service_config_version=1" `
    -Credential $creds
$respObj = ConvertFrom-Json $resp.Content
$respObj.items.configurations.properties."fs.azure.account.key.$storageAccountName.blob.core.windows.net"
```

> [!NOTE]
> Set `$clusterName` to the name of the HDInsight cluster. Set `$storageAccountName` to the name of the storage account. When prompted, enter the cluster login (admin) and password.

```Bash
curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/configurations/service_config_versions?service_name=HDFS&service_config_version=1" | jq '.items[].configurations[].properties["fs.azure.account.key.$STORAGEACCOUNTNAME.blob.core.windows.net"] | select(. != null)'
```

> [!NOTE]
> Set `$PASSWORD` to the cluster login (admin) account password. Set `$CLUSTERNAME` to the name of the HDInsight cluster. Set `$STORAGEACCOUNTNAME` to the name of the storage account.
>
> This example uses [curl (http://curl.haxx.se/)](http://curl.haxx.se/) and [jq (https://stedolan.github.io/jq/)](https://stedolan.github.io/jq/) to retrieve and parse JSON data.

When using this command, replace __CLUSTERNAME__ with the name of the HDInsight cluster. Replace __PASSWORD__ with the HTTP login password for the cluster. Replace __STORAGEACCOUNT__ with the name of the storage account added using script action. Information returned from this command appears similar to the following text:

    "MIIB+gYJKoZIhvcNAQcDoIIB6zCCAecCAQAxggFaMIIBVgIBADA+MCoxKDAmBgNVBAMTH2RiZW5jcnlwdGlvbi5henVyZWhkaW5zaWdodC5uZXQCEA6GDZMW1oiESKFHFOOEgjcwDQYJKoZIhvcNAQEBBQAEggEATIuO8MJ45KEQAYBQld7WaRkJOWqaCLwFub9zNpscrquA2f3o0emy9Vr6vu5cD3GTt7PmaAF0pvssbKVMf/Z8yRpHmeezSco2y7e9Qd7xJKRLYtRHm80fsjiBHSW9CYkQwxHaOqdR7DBhZyhnj+DHhODsIO2FGM8MxWk4fgBRVO6CZ5eTmZ6KVR8wYbFLi8YZXb7GkUEeSn2PsjrKGiQjtpXw1RAyanCagr5vlg8CicZg1HuhCHWf/RYFWM3EBbVz+uFZPR3BqTgbvBhWYXRJaISwssvxotppe0ikevnEgaBYrflB2P+PVrwPTZ7f36HQcn4ifY1WRJQ4qRaUxdYEfzCBgwYJKoZIhvcNAQcBMBQGCCqGSIb3DQMHBAhRdscgRV3wmYBg3j/T1aEnO3wLWCRpgZa16MWqmfQPuansKHjLwbZjTpeirqUAQpZVyXdK/w4gKlK+t1heNsNo1Wwqu+Y47bSAX1k9Ud7+Ed2oETDI7724IJ213YeGxvu4Ngcf2eHW+FRK"

This text is an example of an encrypted key, which is used to access the storage account.

### Unable to access storage after changing key

If you change the key for a storage account, HDInsight can no longer access the storage account. HDInsight uses a cached copy of key in the core-site.xml for the cluster. This cached copy must be updated to match the new key.

Running the script action again does __not__ update the key, as the script checks to see if an entry for the storage account already exists. If an entry already exists, it does not make any changes.

To work around this problem, you must remove the existing entry for the storage account. Use the following steps to remove the existing entry:

1. In a web browser, open the Ambari Web UI for your HDInsight cluster. The URI is https://CLUSTERNAME.azurehdinsight.net. Replace __CLUSTERNAME__ with the name of your cluster.

    When prompted, enter the HTTP login user and password for your cluster.

2. From the list of services on the left of the page, select __HDFS__. Then select the __Configs__ tab in the center of the page.

3. In the __Filter...__ field, enter a value of __fs.azure.account__. This returns entries for any additional storage accounts that have been added to the cluster. There are two types of entries; __keyprovider__ and __key__. Both contain the name of the storage account as part of the key name.

    The following are example entries for a storage account named __mystorage__:

        fs.azure.account.keyprovider.mystorage.blob.core.windows.net
        fs.azure.account.key.mystorage.blob.core.windows.net

4. After you have identified the keys for the storage account you need to remove, use the red '-' icon to the right of the entry to delete it. Then use the __Save__ button to save your changes.

5. After changes have been saved, use the script action to add the storage account and new key value to the cluster.

### Poor performance

If the storage account is in a different region than the HDInsight cluster, you may experience poor performance. Accessing data in a different region sends network traffic outside the regional Azure data center and across the public internet, which can introduce latency.

> [!WARNING]
> Using a storage account in a different region than the HDInsight cluster is not supported.

### Additional charges

If the storage account is in a different region than the HDInsight cluster, you may notice additional egress charges on your Azure billing. An egress charge is applied when data leaves a regional data center. This charge is applied even if the traffic is destined for another Azure data center in a different region.

> [!WARNING]
> Using a storage account in a different region than the HDInsight cluster is not supported.

## Next steps

You have learned how to add additional storage accounts to an existing HDInsight cluster. For more information on script actions, see [Customize Linux-based HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md)
