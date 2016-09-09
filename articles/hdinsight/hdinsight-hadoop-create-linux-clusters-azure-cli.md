<properties
   	pageTitle="Create Hadoop, HBase, or Storm clusters on Linux in HDInsight using the cross-platform Azure CLI | Microsoft Azure"
   	description="Learn how to create Linux-based HDInsight clusters using the cross-platform Azure CLI, Azure Resource Manager templates, and the Azure REST API. You can specify the cluster type (Hadoop, HBase, or Storm,) or use scripts to install custom components.."
   	services="hdinsight"
   	documentationCenter=""
   	authors="Blackmist"
   	manager="paulettm"
   	editor="cgronlun"
	tags="azure-portal"/>

<tags
   	ms.service="hdinsight"
   	ms.devlang="na"
   	ms.topic="article"
   	ms.tgt_pltfrm="na"
   	ms.workload="big-data"
   	ms.date="06/13/2016"
   	ms.author="larryfr"/>

#Create Linux-based clusters in HDInsight using the Azure CLI

[AZURE.INCLUDE [selector](../../includes/hdinsight-selector-create-clusters.md)]

The Azure CLI is a cross-platform command-line utility that allows you to manage Azure Services. It can be used, along with Azure Resource management templates, to create an HDInsight cluster, along with associated storage accounts and other services.

Azure Resource Management templates are JSON documents that describe a __resource group__ and all resources in it (such as HDInsight.) This template based approach allows you to define all the resources that you need for HDInsight in one template, and to manage changes to the group as a whole through __deployments__ that apply changes to the group.

The steps in this document walk through the process of creating a new HDInsight cluster using the Azure CLI and a template.

> [AZURE.IMPORTANT] The steps in this document use the default number of worker nodes (4) for an HDInsight cluster. If you plan on more than 32 worker nodes, either at cluster creation or by scaling the cluster after creation, then you must select a head node size with at least 8 cores and 14GB ram.
>
> For more information on node sizes and associated costs, see [HDInsight pricing](https://azure.microsoft.com/pricing/details/hdinsight/).

##Prerequisites

[AZURE.INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- __Azure CLI__. The steps in this document were last tested with Azure CLI version 0.10.1.

    [AZURE.INCLUDE [use-latest-version](../../includes/hdinsight-use-latest-cli.md)] 

##Login to your Azure subscription

Follow the steps documented in [Connect to an Azure subscription from the Azure Command-Line Interface (Azure CLI)](../xplat-cli-connect.md) and connect to your subscription using the __login__ method.

##Create a cluster

The following steps should be performed from a command-prompt, shell or terminal session after installing and configuring the Azure CLI.

1. Use the following command to authenticate to your Azure subscription:

        azure login

    You will be prompted to provide your name and password. If you have multiple Azure subscriptions, you can use `azure account set <subscriptionname>` to set the subscription that the Azure CLI commands will use.

3. Switch to Azure Resource Manager mode using the following command:

        azure config mode arm

4. Create a new resource group. This will contain the HDInsight cluster and associated storage account.

        azure group create groupname location
        
    * Replace __groupname__ with a unique name for the group. 
    * Replace __location__ with the geographic region that you want to create the group in. 
    
        For a list of valid locations, use the `azure locations list` command, and then use one of the locations from the __Name__ column.

5. Create a new storage account. This will be used as the default storage for the HDInsight cluster.

        azure storage account create -g groupname --sku-name RAGRS -l location --kind Storage storagename
        
     * Replace __groupname__ with the name of the group created in the previous step.
     * Replace __location__ with the same location used in the previous step. 
     * Replace __storagename__ with a unique name for the storage account.
     
     > [AZURE.NOTE] For more information on the parameters used in this command, use `azure storage account create -h` to view help for this command.

5. Retrieve the key used to access the storage account.

        azure storage account keys list -g groupname storagename
        
    * Replace __groupname__ with the resource group name.
    * Replace __storagename__ with the name of the storage account.
    
    In the data that is returned, save the __key__ value for __key1__.

6. Create a new HDInsight cluster.

        azure hdinsight cluster create -g groupname -l location -y Linux --clusterType Hadoop --defaultStorageAccountName storagename.blob.core.windows.net --defaultStorageAccountKey storagekey --defaultStorageContainer clustername --workerNodeCount 2 --userName admin --password httppassword --sshUserName sshuser --sshPassword sshuserpassword clustername

    * Replace __groupname__ with the resource group name.
    * Replace __location__ with the same location used in previous steps.
    * Replace __storagename__ with the storage account name.
    * Replace __storagekey__ with the key obtained in the previous step. 
    * For the `--defaultStorageContainer` parameter, use the same name as you are using for the cluster.
    * Replace __admin__ and __httppassword__ with the name and password you wish to use when accessing the cluster through HTTPS.
    * Replace __sshuser__ and __sshuserpassword__ with the username and password you wish to use when accessing the cluster using SSH

    It may take several minutes for the cluster creation process to finish. Usually around 15.

##Next steps

Now that you have successfully created an HDInsight cluster using the Azure CLI, use the following to learn how to work with your cluster:

###Hadoop clusters

* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)

###HBase clusters

* [Get started with HBase on HDInsight](hdinsight-hbase-tutorial-get-started-linux.md)
* [Develop Java applications for HBase on HDInsight](hdinsight-hbase-build-java-maven-linux.md)

###Storm clusters

* [Develop Java topologies for Storm on HDInsight](hdinsight-storm-develop-java-topology.md)
* [Use Python components in Storm on HDInsight](hdinsight-storm-develop-python-topology.md)
* [Deploy and monitor topologies with Storm on HDInsight](hdinsight-storm-deploy-monitor-topology-linux.md)
