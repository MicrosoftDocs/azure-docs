---
title: Install Presto on Azure HDInsight Linux clusters 
description: Learn how to install Presto and Airpal on Linux-based HDInsight Hadoop clusters by using script actions.
services: hdinsight
author: hrasheed-msft
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 01/01/2019
ms.author: hrasheed

---
# Install and use Presto on Hadoop-based HDInsight clusters

This article explains how to install Presto on Hadoop-based Azure HDInsight clusters by using script actions. You also learn how to install Airpal on an existing Presto HDInsight cluster.

HDInsight also offers the Starburst Presto application for Apache Hadoop clusters. For more information, see [Install third-party Apache Hadoop applications on Azure HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-apps-install-applications).

> [!IMPORTANT]  
> The steps in this article require an HDInsight 3.5 Hadoop cluster that uses Linux. Linux is the only operating system used on HDInsight version 3.4 or later. For more information, see [HDInsight versions](hdinsight-component-versioning.md).

## What is Presto?
[Presto](https://prestodb.io/overview.html) is a fast-distributed SQL query engine for big data. Presto is suitable for interactive querying of petabytes of data. For more information on the components of Presto and how they work together, see [Presto concepts](https://github.com/prestodb/presto/blob/master/presto-docs/src/main/sphinx/overview/concepts.rst).

> [!WARNING]  
> Components provided with the HDInsight cluster are fully supported. Microsoft Support will help to isolate and resolve issues related to these components.
> 
> Custom components like Presto receive commercially reasonable support to help you further troubleshoot the issue. This support might resolve the issue. Or you might be asked to engage available channels for the open-source technologies where deep expertise for that technology is found. There are many community sites that can be used. Examples are [MSDN forum for HDInsight](https://social.msdn.microsoft.com/Forums/azure/home?forum=hdinsight) and [Stack Overflow](https://stackoverflow.com). 
>
> Apache projects also have project sites on the [Apache website](https://apache.org). An example is [Hadoop](https://hadoop.apache.org/).


## Install Presto by using script actions

This section explains how to use the sample script when you create a new cluster by using the Azure portal: 

1. Start to provision a cluster by taking the steps in [Create Linux-based clusters in HDInsight by using the Azure portal](hdinsight-hadoop-create-linux-clusters-portal.md). Make sure you create the cluster by using the **Custom** cluster creation flow. The cluster must meet the following requirements:

   * It must be a Hadoop cluster with HDInsight version 3.6.

   * It must use Azure Storage as the data store. Using Presto on a cluster that uses Azure Data Lake Storage as the storage option isn't an option yet.

     ![HDInsight, Custom (size, settings, apps)](./media/hdinsight-hadoop-install-presto/hdinsight-install-custom.png)

2. In the **Advanced settings** area, select **Script Actions**. Provide the following information. You can also choose the **Install Presto** option for the script type:
   
   * **NAME**. Enter a friendly name for the script action.
   * **Bash script URI**. `https://raw.githubusercontent.com/hdinsight/presto-hdinsight/master/installpresto.sh`.
   * **HEAD**. Select this option.
   * **WORKER**. Select this option.
   * **ZOOKEEPER**. Leave this check box blank.
   * **PARAMETERS**. Leave this field blank.


3. At the bottom of the **Script Actions** area, choose the **Select** button to save the configuration. Finally, choose the **Select** button at the bottom of the **Advanced Settings** area to save the configuration information.

4. Continue to provision the cluster as described in [Create Linux-based clusters in HDInsight by using the Azure portal](hdinsight-hadoop-create-linux-clusters-portal.md).

    > [!NOTE]  
    > Azure PowerShell, the Azure Classic CLI, the HDInsight .NET SDK, or Azure Resource Manager templates can also be used to apply script actions. You can also apply script actions to already running clusters. For more information, see [Customize Linux-based HDInsight clusters by using script actions](hdinsight-hadoop-customize-cluster-linux.md).
    > 
    > 

## Use Presto with HDInsight

To work with Presto in an HDInsight cluster, take the following steps:

1. Connect to the HDInsight cluster by using SSH:
   
    `ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net`
   
    For more information, see [Connect to HDInsight (Apache Hadoop) by using SSH](hdinsight-hadoop-linux-use-ssh-unix.md).
     

2. Start the Presto shell by running the following command:
   
    `presto --schema default`

3. Run a query on a sample table, **hivesampletable**, which is available on all HDInsight clusters by default:
   
	`select count (*) from hivesampletable;`
   
	By default, [Apache Hive](https://prestodb.io/docs/current/connector/hive.html) and [TPCH](https://prestodb.io/docs/current/connector/tpch.html) connectors for Presto are already configured. The Hive connector is configured to use the default Hive installation. So all the tables from Hive are automatically visible in Presto.

	For more information, see [Presto documentation](https://prestodb.io/docs/current/index.html).

## Use Airpal with Presto

[Airpal](https://github.com/airbnb/airpal#airpal) is an open-source web-based query interface for Presto. For more information on Airpal, see [Airpal documentation](https://github.com/airbnb/airpal#airpal).

Take the following steps to install Airpal on the edge node:

1. By using SSH, connect to the head node of the HDInsight cluster that has Presto installed:
   
    `ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net`
   
    For more information, see [Connect to HDInsight (Apache Hadoop) by using SSH](hdinsight-hadoop-linux-use-ssh-unix.md).

2. After you're connected, run the following command:

	`sudo slider registry  --name presto1 --getexp presto` 
   
    You see output similar to the following JSON:

		{
  			"coordinator_address" : [ {
    			"value" : "10.0.0.12:9090",
    			"level" : "application",
    			"updatedTime" : "Mon Apr 03 20:13:41 UTC 2017"
  		} ]

3. From the output, note the value for the **value** property. You need this value while you install Airpal on the cluster edge node. From the preceding output, the value that you need is **10.0.0.12:9090**.

4. Use [this template](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fhdinsight%2Fpresto-hdinsight%2Fmaster%2Fairpal-deploy.json) to create an HDInsight cluster edge node. Provide the values shown in the following screenshot.

	![Custom deployment](./media/hdinsight-hadoop-install-presto/hdinsight-install-airpal.png)

5. Select **Purchase**.

6. After the changes are applied to the cluster configuration, access the Airpal web interface by taking the following steps from the [Azure portal](https://portal.azure.com):

    1. From the left menu, select **All services**.

    1. Under **ANALYTICS**, select **HDInsight clusters**.

    1. Select your cluster from the list, which opens the default view.

    1. From the default view, under **Settings**, select **Applications**.

	    ![HDInsight, Applications](./media/hdinsight-hadoop-install-presto/hdinsight-presto-launch-airpal.png)

	1. From the **Installed Apps** page, locate the table entry for **airpal**. Select **Portal**.

	    ![Installed apps](./media/hdinsight-hadoop-install-presto/hdinsight-presto-launch-airpal-1.png)

	1. When prompted, enter the admin credentials that you specified when you created the Hadoop-based HDInsight cluster.

## Customize a Presto installation on HDInsight cluster

To customize the installation, take the following steps:

1. By using SSH, connect to the head node of the HDInsight cluster that has Presto installed:
   
    `ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net`
   
    For more information, see [Connect to HDInsight (Apache Hadoop) by using SSH](hdinsight-hadoop-linux-use-ssh-unix.md).

2. Make your configuration changes in the file `/var/lib/presto/presto-hdinsight-master/appConfig-default.json`. For more information on Presto configuration, see [Presto configuration options for YARN-based clusters](https://prestodb.io/presto-yarn/installation-yarn-configuration-options.html).

3. Stop and kill the current running instance of Presto:

	`sudo slider stop presto1 --force`
	`sudo slider destroy presto1 --force`

4. Start a new instance of Presto with the customization:

	`sudo slider create presto1 --template /var/lib/presto/presto-hdinsight-master/appConfig-default.json --resources /var/lib/presto/presto-hdinsight-master/resources-default.json`

5. Wait for the new instance to be ready. Note the Presto coordinator address:

    `sudo slider registry --name presto1 --getexp presto`

## Generate benchmark data for HDInsight clusters that run Presto

TPC-DS is the industry standard for measuring the performance of many decision-support systems, including big data systems. You can use Presto to generate data and evaluate how it compares with your own HDInsight benchmark data. For more information, see [tpcds-hdinsight](https://github.com/hdinsight/tpcds-datagen-as-hive-query/blob/master/README.md).



## Next steps
* [Install and use Hue on HDInsight Hadoop clusters](hdinsight-hadoop-hue-linux.md). Hue is a web UI that makes it easy to create, run, and save Apache Pig and Hive jobs.

* [Install Apache Giraph on HDInsight Hadoop clusters, and use Giraph to process large-scale graphs](hdinsight-hadoop-giraph-install-linux.md). Use cluster customization to install Giraph on Hadoop-based HDInsight clusters. With Giraph, you can perform graph processing by using Hadoop. It can also be used with Azure HDInsight.

[hdinsight-install-r]: hdinsight-hadoop-r-scripts-linux.md
[hdinsight-cluster-customize]: hdinsight-hadoop-customize-cluster-linux.md
