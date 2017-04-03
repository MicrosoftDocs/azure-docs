---
title: Install Presto on Azure HDInsight Linux clusters| Microsoft Docs
description: Learn how to install Presto and Airpal on Linux-based HDInsight Hadoop clusters using Script Actions.
services: hdinsight
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/31/2017
ms.author: nitinme

---
# Install and use Presto on HDInsight Hadoop clusters

In this topic, you learn how to install Presto on HDInsight Hadoop clusters by using Script Action. You also learn how to install Airpal on an existing Presto HDInsight cluster

> [!IMPORTANT]
> The steps in this document require an HDInsight 3.5 cluster that uses Linux. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight versions](hdinsight-component-versioning.md#hdi-version-32-and-33-nearing-deprecation-date).

## What is Presto?
[Presto](https://prestodb.io/) is a fast distributed SQL query engine for big data. Presto is suitable for interactive querying of petabytes of data. For more information on what are the different components of Presto, and how they all work together, see [Presto concepts](https://github.com/prestodb/presto/blob/master/presto-docs/src/main/sphinx/overview/concepts.rst)

> [!WARNING]
> Components provided with the HDInsight cluster are fully supported and Microsoft Support will help to isolate and resolve issues related to these components.
> 
> Custom components, such as Presto, receive commercially reasonable support to help you to further troubleshoot the issue. This might result in resolving the issue OR asking you to engage available channels for the open source technologies where deep expertise for that technology is found. For example, there are many community sites that can be used, like: [MSDN forum for HDInsight](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=hdinsight), [http://stackoverflow.com](http://stackoverflow.com). Also Apache projects have project sites on [http://apache.org](http://apache.org), for example: [Hadoop](http://hadoop.apache.org/).
> 
> 


## Install Presto using script action

A sample script to install Presto on an HDInsight cluster is available at the following location.

    https://raw.githubusercontent.com/hdinsight/presto-hdinsight/master/installpresto.sh

This section provides instructions on how to use the sample script when creating a new cluster by using the Azure portal. 

> [!NOTE]
> Azure PowerShell, the Azure CLI, the HDInsight .NET SDK, or Azure Resource Manager templates can also be used to apply script actions. You can also apply script actions to already running clusters. For more information, see [Customize HDInsight clusters with Script Actions](hdinsight-hadoop-customize-cluster-linux.md).
> 
> 

1. Start provisioning a cluster by using the steps in [Provision Linux-based HDInsight clusters](hdinsight-hadoop-create-linux-clusters-portal.md). Make sure you start creating the HDInsight cluster using the **Custom** cluster creation flow.

	![HDInsight cluster creation using custom options](./media/hdinsight-hadoop-install-presto/hdinsight-install-custom.png)

2. On the **Advanced settings** blade, select **Script Actions**, and provide the information below:
   
   * **NAME**: Enter a friendly name for the script action.
   * **Bash script URI**: https://raw.githubusercontent.com/hdinsight/presto-hdinsight/master/installpresto.sh
   * **HEAD**: Check this option
   * **WORKER**: Check this option
   * **ZOOKEEPER**: Clear this check box
   * **PARAMETERS**: Leave this field blank


3. At the bottom of the **Script Actions** blade, click the **Select** button to save the configuration. Finally, click  the **Select** button at the bottom of the **Advanced Settings** blade to save the configuration information.

4. Continue provisioning the cluster as described in [Provision Linux-based HDInsight clusters](hdinsight-hadoop-create-linux-clusters-portal.md).

## Use Presto with HDInsight

Perform the following steps to use Presto in an HDInsight cluster after you have installed it using the steps described above.

1. Connect to the HDInsight cluster using SSH:
   
        ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net
   
    For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).
     

2. Start the Presto shell using the following command.
   
        presto --schema default

3. Run a query on a sample table, hivesampletable, which is available on all HDInsight clusters by default.
   
		select count (*) from hivesampletable;
   
	By default, [Hive](https://prestodb.io/docs/current/connector/hive.html) and [TPCH](https://prestodb.io/docs/current/connector/tpch.html) connectors for Presto are already configured. Hive connector is configured to use the default installed Hive installation, so all the tables from Hive will be automatically visible in Presto. You can also play around with TPCH or TPCDS datasets.

## Using Airpal with Presto

[Airpal]() is an open-source web-based query interface for Presto. For more information on Airpal, see [Airpal documentation](https://github.com/airbnb/airpal#airpal).

In this section, we look at the steps to **install Airpal on the edgenode** of an HDInsight Hadoop cluster, that already has Presto installed. This ensures that the Airpal web query interface is available over the Internet.

1. Using SSH, connect to the headnode of the HDInsight cluster that has Presto installed:
   
        ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net
   
    For more information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

2. Once you are connected, run the following command.

		sudo slider registry  --name presto1 --getexp presto 
   
    You should see an output like the following:

		{
  			"coordinator_address" : [ {
    			"value" : "10.0.0.12:9090",
    			"level" : "application",
    			"updatedTime" : "Mon Apr 03 20:13:41 UTC 2017"
  		} ]

3. From the output, note the value for the **value** property. You will need this while installing Airpal on the cluster edgenode. From the output above, the value that you will need is **10.0.0.12:9090**.

4. Use the template **[here](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdharmeshkakadia%2Fpresto-hdinsight%2Fmaster%2Fairpal-deploy.json)** to create an HDInsight cluster edgenode and provide the values as shown in the following screenshot.

	![HDInsight install Airpal on Presto cluster](./media/hdinsight-hadoop-install-presto/hdinsight-install-airpal.png)

5. Click **Purchase**.

6. Once the changes are applied to the cluster configuration, you can access the Airpal web interface by using the following steps.

	a. From the cluster blade, click **Applications**.

	![HDInsight launch Airpal on Presto cluster](./media/hdinsight-hadoop-install-presto/hdinsight-presto-launch-airpal.png)

	b. From the **Installed Apps** blade, click **Portal** against airpal.

	![HDInsight launch Airpal on Presto cluster](./media/hdinsight-hadoop-install-presto/hdinsight-presto-launch-airpal-1.png)

	c. When prompted, enter the admin credentials that you specified while creating the HDInsight Hadoop cluster.

 


## See also
* [Install and use Hue on HDInsight clusters](hdinsight-hadoop-hue-linux.md). Hue is a web UI that makes it easy to create, run and save Pig and Hive jobs, as well as browse the default storage for your HDInsight cluster.
* [Install R on HDInsight clusters][hdinsight-install-r]. Use cluster customization to install R on HDInsight Hadoop clusters. R is an open-source language and environment for statistical computing. It provides hundreds of built-in statistical functions and its own programming language that combines aspects of functional and object-oriented programming. It also provides extensive graphical capabilities.
* [Install Giraph on HDInsight clusters](hdinsight-hadoop-giraph-install-linux.md). Use cluster customization to install Giraph on HDInsight Hadoop clusters. Giraph allows you to perform graph processing by using Hadoop, and can be used with Azure HDInsight.
* [Install Hue on HDInsight clusters](hdinsight-hadoop-hue-linux.md). Use cluster customization to install Hue on HDInsight Hadoop clusters. Hue is a set of Web applications used to interact with a Hadoop cluster.

[hdinsight-install-r]: hdinsight-hadoop-r-scripts-linux.md
[hdinsight-cluster-customize]: hdinsight-hadoop-customize-cluster-linux.md
