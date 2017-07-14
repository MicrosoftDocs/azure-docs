---
title: Create Hadoop clusters using the command-line - Azure HDInsight | Microsoft Docs
description: Learn how to create HDInsight clusters using the cross-platform Azure CLI 1.0.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: 50b01483-455c-4d87-b754-2229005a8ab9
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/04/2017
ms.author: larryfr

---
# Create HDInsight clusters using the Azure CLI

[!INCLUDE [selector](../../includes/hdinsight-create-linux-cluster-selector.md)]

The steps in this document walk-through creating a HDInsight 3.5 cluster using the Azure CLI 1.0.

> [!IMPORTANT]
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdi-version-33-nearing-retirement-date).


## Prerequisites

[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

* **Azure CLI**. The steps in this document were last tested with Azure CLI version 0.10.1.

    > [!IMPORTANT]
    > The steps in this document do not work with Azure CLI 2.0. Azure CLI 2.0 does not support creating an HDInsight cluster.

## Log in to your Azure subscription

Follow the steps documented in [Connect to an Azure subscription from the Azure Command-Line Interface (Azure CLI)](../xplat-cli-connect.md) and connect to your subscription using the **login** method.

## Create a cluster

The following steps should be performed from a command-prompt, shell, or terminal session after installing and configuring the Azure CLI.

1. Use the following command to authenticate to your Azure subscription:

        azure login

    You are prompted to provide your name and password. If you have multiple Azure subscriptions, use `azure account set <subscriptionname>` to set the subscription that the Azure CLI commands use.

2. Switch to Azure Resource Manager mode using the following command:

        azure config mode arm

3. Create a resource group. This resource group contains the HDInsight cluster and associated storage account.

        azure group create groupname location

    * Replace **groupname** with a unique name for the group.

    * Replace **location** with the geographic region that you want to create the group in.

       For a list of valid locations, use the `azure location list` command, and then use one of the locations from the **Name** column.

4. Create a storage account. This storage account is used as the default storage for the HDInsight cluster.

        azure storage account create -g groupname --sku-name RAGRS -l location --kind Storage storagename

    * Replace **groupname** with the name of the group created in the previous step.

    * Replace **location** with the same location used in the previous step.

    * Replace **storagename** with a unique name for the storage account.

        > [!NOTE]
        > For more information on the parameters used in this command, use `azure storage account create -h` to view help for this command.

5. Retrieve the key used to access the storage account.

        azure storage account keys list -g groupname storagename

    * Replace **groupname** with the resource group name.
    * Replace **storagename** with the name of the storage account.

     In the data that is returned, save the **key** value for **key1**.

6. Create an HDInsight cluster.

        azure hdinsight cluster create -g groupname -l location -y Linux --clusterType Hadoop --defaultStorageAccountName storagename.blob.core.windows.net --defaultStorageAccountKey storagekey --defaultStorageContainer clustername --workerNodeCount 2 --userName admin --password httppassword --sshUserName sshuser --sshPassword sshuserpassword clustername

    * Replace **groupname** with the resource group name.

    * Replace **Hadoop** with the cluster type that you wish to create. For example, Hadoop, HBase, Storm, or Spark.

     > [!IMPORTANT]
     > HDInsight clusters come in various types, which correspond to the workload or technology that the cluster is tuned for. There is no supported method to create a cluster that combines multiple types, such as Storm and HBase on one cluster.

    * Replace **location** with the same location used in previous steps.

    * Replace **storagename** with the storage account name.

    * Replace **storagekey** with the key obtained in the previous step.

    * For the `--defaultStorageContainer` parameter, use the same name as you are using for the cluster.

    * Replace **admin** and **httppassword** with the name and password you wish to use when accessing the cluster through HTTPS.

    * Replace **sshuser** and **sshuserpassword** with the username and password you wish to use when accessing the cluster using SSH

    > [!IMPORTANT]
    > This example creates a cluster with two worker notes. If you plan on more than 32 worker nodes (during cluster creation or by scaling the cluster,) then you must select a head node size with at least 8 cores and 14-GB RAM. You can set the head node size by using the `--headNodeSize` parameter.
    >
    > For more information on node sizes and associated costs, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

    It may take several minutes for the cluster creation process to finish. Usually around 15.

## Troubleshoot

If you run into issues with creating HDInsight clusters, see [access control requirements](hdinsight-administer-use-portal-linux.md#create-clusters).

## Next steps

Now that you have successfully created an HDInsight cluster using the Azure CLI, use the following to learn how to work with your cluster:

### Hadoop clusters

* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)

### HBase clusters

* [Get started with HBase on HDInsight](hdinsight-hbase-tutorial-get-started-linux.md)
* [Develop Java applications for HBase on HDInsight](hdinsight-hbase-build-java-maven-linux.md)

### Storm clusters

* [Develop Java topologies for Storm on HDInsight](hdinsight-storm-develop-java-topology.md)
* [Use Python components in Storm on HDInsight](hdinsight-storm-develop-python-topology.md)
* [Deploy and monitor topologies with Storm on HDInsight](hdinsight-storm-deploy-monitor-topology-linux.md)
