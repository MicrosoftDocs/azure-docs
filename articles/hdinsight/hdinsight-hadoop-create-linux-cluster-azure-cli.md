<properties
   	pageTitle="Create Hadoop, HBase, or Storm clusters on Linux in HDInsight using the Azure CLI | Microsoft Azure"
   	description="Learn how to create Hadoop, HBase, or Storm clusters on Linux for HDInsight using the Azure CLI."
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
   	ms.date="10/05/2015"
   	ms.author="larryfr"/>

#Create Linux-based clusters in HDInsight using the Azure CLI

The Azure CLI is a cross-platform command-line utility that allows you to manage Azure Services. It can be used, along with Azure Resource management templates, to create an HDInsight cluster, along with associated storage accounts and other services.

Azure Resource Management templates are JSON documents that describe a __resource group__ and all resources in it (such as HDInsight.) This template based approach allows you to define all the resources that you need for HDInsight in one template, and to manage changes to the group as a whole through __deployments__ that apply changes to the group.

The steps in this document walk through the process of creating a new HDInsight cluster using the Azure CLI and a template:

##Prerequisites

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

- __Azure CLI__. For information on installing the CLI, see [Install the Azure CLI](xplat-cli-install.md).

##Login to your Azure subscription

Follow the steps documented in [Connect to an Azure subscription from the Azure Command-Line Interface (Azure CLI)](xplat-cli-connect.md) and connect to your subscription using the __login__ method.

##Create a cluster

The following steps should be performed from a command-prompt, shell or terminal session after installing and configuring the Azure CLI.

1. Use the following command to authenticate to your Azure subscription:

        azure login

    You will be prompted to provide your name and password. If you have multiple Azure subscriptions, you can use `azure account set <subscriptionname>` to set the subscription that the Azure CLI commands will use.

3. Switch to Azure Resource Manager mode using the following command:

        azure config mode arm

4. Create a template for your HDInsight cluster. The following are some basic example templates:

    * [Linux-based cluster, using an SSH public key](https://github.com/Azure/azure-quickstart-templates/tree/master/hdinsight-linux-ssh-publickey)
    * [Linux-based cluster, using a password for the SSH account](https://github.com/Azure/azure-quickstart-templates/tree/master/hdinsight-linux-ssh-password)

    Both of these templates also create the default Azure Storage Account used by HDInsight.

    The files you will need are the __azuredeploy.json__ and __azuredeploy.parameters.json__. Copy these files locally before continuing.

5. Open the __azuredeploy.parameters.json__ file in an editor, and provide values for the items in the `parameters` section:

    * __location__: The data center that the resources will be created in. You can view the `location` section in the __azuredeploy.json__ file for a list of allowed locations.
    * __clusterName__: The name of the HDInsight cluster. This name must be unique, or the deployment will fail.
    * __clusterStorageAccountName__: The name of the Azure Storage Account that will be created for the HDInsight cluster. This name must be unique, or the deployment will fail.
    * __clusterLoginPassword__: The password for the cluster admin user. This should be a secure password, as it is used to access web sites and REST services on the cluster.
    * __sshUserName__: The name of the first SSH user to create for this cluster. SSH will be used to remotely access the cluster using this account. The name must be unique, and cannot be the name of an account already in use on the cluster. Invalid names include root, storm, and hbase.
    * __sshPublicKey__: If you are using the template that requires an SSH public key, you must add your public key on this line. For more information on generating and working with public keys, see the following articles:

        * [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)
        * [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

    * __sshPassword__: If you are using the template that requires an SSH password, you must add a password on this line.

    Once you are done, save and close the file.

5. Use the following to create an empty resource group. Replace __RESOURCEGROUPNAME__ with the name you wish to use for this group. Replace __LOCATION__ with the data center that you want to create your HDInsight cluster in:

        azure group create RESOURCEGROUPNAME LOCATION
    
    > [AZURE.NOTE] If the location name contains spaces, put it in quotes. For example "South Central US".

6. Use the following command to create the initial deployment for this resource group. Replace __PATHTOTEMPLATE__ with the path to the __azuredeploy.json__ template file. Replace __PATHTOPARAMETERSFILE__ with the path to the __azuredeploy.parameters.json__ file. Replace __RESOURCEGROUPNAME__ with the name of the group you created in the previous step:

        azure group deployment create -f PATHTOTEMPLATE -e PATHTOPARAMETERSFILE -g RESOURCEGROUPNAME -n InitialDeployment

    Once the deployment has been accepted, you should see a message similar to `group deployment create command ok`.

7. It may take some time for the deployment to complete, around 15 minutes. you can view information about the deployment using the following command. Replace __RESOURCEGROUPNAME__ with the name of the resource group used in the previous step:

        azure group log show -l RESOURCEGROUPNAME
    
    Once the deployment completes, the __Status__ field will contain the value __Succeeded__.  If a failure occurs during deployment, you can get more information on the failure using the following command

        azure group log show -l -v RESOURCEGROUPNAME

##Next steps

Now that you have successfully created an HDInsight cluster, use the following to learn how to work with your cluster:

###Hadoop clusters

* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)

###HBase clusters

* [Get started with HBase on HDInsight](hdinsight-hbase-tutorial-get-stared-linux.md)
* [Develop Java applications for HBase on HDInsight](hdinsight-hbase-build-java-maven-linux)

###Storm clusters

* [Develop Java topologies for Storm on HDInsight](hdinsight-storm-develop-java-topology.md)
* [Use Python components in Storm on HDInsight](hdinsight-storm-develop-python.md)
* [Deploy and monitor topologies with Storm on HDInsight](hdinsight-storm-deploy-monitor-topology-linux.md)