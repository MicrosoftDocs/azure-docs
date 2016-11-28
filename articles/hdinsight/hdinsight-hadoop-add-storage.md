---
title: Add additional Azure storage accounts to HDInsight | Microsoft Docs
description: Learn how to add additional Azure storage accounts to an existing HDInsight cluster.
services: hdinsight
documentationCenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.service: hdinsight
ms.devlang: ''
ms.topic: article
ms.tgt_pltfrm: 'na'
ms.workload: big-data
ms.date: 11/28/2016
ms.author: larryfr

---

# Add additional Azure storage accounts to HDInsight

Learn how to use script actions to add additional Azure storage accounts to an existing HDInsight cluster.

> [!IMPORTANT]
> The information in this document is about adding additional storage to a cluster after it has been created. For information on adding additional storage accounts during cluster creation, see the __Use additional storage__ section of the [Create Linux-based HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md#use-additional-storage) document.

## How it works

This script takes the following parameters:

* __Azure storage account name__: The name of the storage account to add to the HDInsight cluster. After running the script, HDInsight will be able to read and write data stored in this storage account.

* __Azure storage account key__: A key that grants access to the storage account.

* __-p__ (optional): If specified, the key is not encrypted and is stored in the core-site.xml file as plain text.

During processing, the script performs the following actions:

* If the storage account already exists in the core-site.xml configuration for the cluster, the script exits and no further actions are performed.

* Verifies that the storage account exists and can be accessed using the key.

* Encrypts the key using the cluster credential. This prevents HDInsight users from being able to easily extract and use the storage account key from Ambari.

* Adds the storage account to the core-site.xml file.

* Stops and restarts the Oozie, YARN, MapReduce2, and HDFS services so that they pick up the new storage account information.

> [!WARNING]
> If the storage account is in a different region than the HDInsight cluster, you may experience poor performance. Accessing data in a different region sends network traffic outside the regional Azure data center and across the public internet, which can introduce latency. Also, sending data out of a regional data center may cost more, as an egress charge is applied when data leaves a data center.

## The script

__Script location__: [https://hdiconfigactions.blob.core.windows.net/linuxaddstorageaccountv01/add-storage-account-v01.sh](https://hdiconfigactions.blob.core.windows.net/linuxaddstorageaccountv01/add-storage-account-v01.sh)

__Requirements__:

* The script must be applied on the __Head nodes__.

## To use the script

See the Apply a script action to a running cluster section of the [Customize Linux-based HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md#apply-a-script-action-to-a-running-cluster) document for information on using script actions through the Azure portal, Azure PowerShell, and the Azure CLI.

When using the information provided in the customization document, replace any example script action URI with the URI for this script (https://hdiconfigactions.blob.core.windows.net/linuxaddstorageaccountv01/add-storage-account-v01.sh). Replace any example parameters with the Azure storage account name and key of the storage account to be added to the cluster.

> [!NOTE]
> You do not need to mark this script as __Persisted__, as it directly updates the Ambari configuration for the cluster.

## Next steps

In this document you have learned how to add additional storage accounts to an existing HDInsight cluster. For more information on script actions, see [Customize Linux-based HDInsight clusters using script action](hdinsight-hadoop-customize-cluster-linux.md)