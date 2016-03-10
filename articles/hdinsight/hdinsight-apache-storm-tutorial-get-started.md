<properties
	pageTitle="Apache Storm tutorial: Get started with Storm | Microsoft Azure"
	description="Get started with big data analytics using Apache Storm and the Storm Starter samples on HDInsight. Learn how to use Storm to process data real-time."
	keywords="apache storm,apache storm tutorial,big data analytics,storm starter"
	services="hdinsight"
	documentationCenter=""
	authors="Blackmist"
	manager="paulettm"
	editor="cgronlun"
	tags="azure-portal"/>

<tags
   ms.service="hdinsight"
   ms.devlang="java"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="03/10/2016"
   ms.author="larryfr"/>


# Apache Storm tutorial: Get started with the Storm Starter samples for big data analytics on HDInsight

Apache Storm is a scalable, fault-tolerant, distributed, real-time computation system for processing streams of data. With Storm on Microsoft Azure HDInsight, you can create a cloud-based Storm cluster that performs big data analytics in real time. 

> [AZURE.NOTE] The steps in this article create a Windows-based HDInsight cluster. For steps to create a Linux-based Storm on HDInsight cluster, see [Apache Storm tutorial: Get started with the Storm Starter sample using data analytics on HDInsight](hdinsight-apache-storm-tutorial-get-started-linux.md)

## Before you begin

[AZURE.INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

You must have the following to successfully complete this Apache Storm tutorial:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

## Create a Storm cluster

In this section, you create an HDInsight version 3.2 cluster (Storm version 0.9.3) using an Azure ARM template. For information about HDInsight versions and their SLAs, see [HDInsight component versioning](hdinsight-component-versioning.md). For other cluster creation methods, see [Create HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md).

1. Click the following image to open an ARM template in the Azure Portal.         

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Fusesqoop%2Fcreate-linux-based-storm-cluster-in-hdinsight.json" target="_blank"><img src="https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/docarticles/dpsmedia-prod/azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-tutorial-get-started-linux/20160201111850/deploy-to-azure.png" alt="Deploy to Azure"></a>
    
    The ARM template is located in a public blob container, *https://hditutorialdata.blob.core.windows.net/armtemplates/create-linux-based-storm-cluster-in-hdinsight.json*. 
   
2. From the Parameters blade, enter the following:

    - **ClusterName**: Enter a name for the Hadoop cluster that you will create.
    - **Cluster login name and password**: The default login name is admin.
    - **SSH user name and password**.
    
    Please write down these values.  You will need them later in the tutorial.

    > [AZURE.NOTE] SSH is used to remotely access the HDInsight cluster using a command-line. The user name and password you use here is used when connecting to the cluster through SSH. Also, the SSH user name must be unique, as it creates a user account on all the HDInsight cluster nodes. The following are some of the account names reserved for use by services on the cluster, and cannot be used as the SSH user name:
    >
    > root, hdiuser, storm, hbase, ubuntu, zookeeper, hdfs, yarn, mapred, hbase, hive, oozie, falcon, sqoop, admin, tez, hcat, hdinsight-zookeeper.

	> For more information on using SSH with HDInsight, see one of the following articles:

	> * [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)
	> * [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

    
3.Click **OK** to save the parameters.

4.From the **Custom deployment** blade, click **Resource group** dropdown box, and then click **New** to create a new resource group. The resource group is a container that groups the cluster, the dependent storage account and other linked resource.

5.Click **Legal terms**, and then click **Create**.

6.Click **Create**. You will see a new tile titled Submitting deployment for Template deployment. It takes about around 20 minutes to create the cluster and SQL database.

## Run a Storm Starter sample on HDInsight

This Apache Storm tutorial introduces you to big data analytics using the Storm Starter samples on GitHub.

Each Storm on HDInsight cluster comes with the Storm Dashboard, which can be used to upload and run Storm topologies on the cluster. Each cluster also comes with sample topologies that can be run directly from the Storm Dashboard.

### <a id="connect"></a>Connect to the dashboard

The dashboard is located at **https://&lt;clustername>.azurehdinsight.net//**, where **clustername** is the name of the cluster. You can also find a link to the dashboard by selecting the cluster from the Startboard and selecting the __Dashboard__ link at the top of the blade.

![Azure portal with Storm Dashboard link](./media/hdinsight-apache-storm-tutorial-get-started/dashboard.png)

> [AZURE.NOTE] When connecting to the dashboard, you are prompted to enter a user name and password. This is the administrator name (**admin**) and password used when you created the cluster.

Once the Storm Dashboard has loaded, you will see the **Submit Topology** form.

![Submit your Storm Starter topology with the Storm Dashboard.](./media/hdinsight-apache-storm-tutorial-get-started/submit.png)

The **Submit Topology** form can be used to upload and run .jar files that contain Storm topologies. It also includes several basic samples that are provided with the cluster.

### <a id="run"></a>Run the word-count sample from the Storm Starter project in GitHub

The samples provided with the cluster include several variations of a word-counting topology. These samples include a **spout** that randomly emits sentences, and **bolts** that break each sentence into individual words, then count how many times each word has occurred. These samples are from the [Storm Starter samples](https://github.com/apache/storm/tree/master/examples/storm-starter), which are a part of Apache Storm.

Perform the following steps to run a Storm Starter sample:

1. Select **StormStarter - WordCount** from the **Jar File** drop-down. This populates the **Class Name** and **Additional Parameters** fields with the parameters for this sample.

	![Storm Starter WordCount selected on Storm Dashboard.](./media/hdinsight-apache-storm-tutorial-get-started/submit.png)

	* **Class Name** - The class in the .jar file that submits the topology.
	* **Additional Parameters** - Any parameters required by the topology. In this example, the field is used to provide a friendly name for the submitted topology.

2. Click  **Submit**. After a moment, the **Result** field displays the command used to submit the job, as well as the results of the command. The **Error** field displays any errors that occur in submitting the topology.

	![Submit button and results of Storm Starter WordCount.](./media/hdinsight-apache-storm-tutorial-get-started/submit-results.png)

	> [AZURE.NOTE] The results do not indicate that the topology has finished - **a Storm topology, once started, runs until you stop it.** The word-count topology generates random sentences, and keeps a count of how many times it encounters each word, until you stop it.

### <a id="monitor"></a>Monitor the topology

The Storm UI can be used to monitor the topology.

1. Select **Storm UI** from the top of the Storm Dashboard. This displays summary information for the cluster and all running topologies.

	![Storm dashboard showing the Storm Starter WordCount topology summary.](./media/hdinsight-apache-storm-tutorial-get-started/stormui.png)

	From the page above, you can see the time the topology has been active, as well as the number of workers, executors, and tasks being used.

	> [AZURE.NOTE] The **Name** column contains the friendly name supplied earlier via the **Additional Parameters** field.

4. Under **Topology summary**, select the **wordcount** entry in the **Name** column. This displays more information about the topology.

	![Storm Dashboard with Storm Starter WordCount topology information.](./media/hdinsight-apache-storm-tutorial-get-started/topology-summary.png)

	This page provides the following information:

	* **Topology stats** - Basic information on the topology performance, organized into time windows.

		> [AZURE.NOTE] Selecting a specific time window changes the time window for information displayed in other sections of the page.

	* **Spouts** - Basic information about spouts, including the last error returned by each spout.

	* **Bolts** - Basic information about bolts.

	* **Topology configuration** - Detailed information about the topology configuration.

	This page also provides actions that can be taken on the topology:

	* **Activate** - Resumes processing of a deactivated topology.

	* **Deactivate** - Pauses a running topology.

	* **Rebalance** - Adjusts the parallelism of the topology. You should rebalance running topologies after you have changed the number of nodes in the cluster. This allows the topology to adjust parallelism to compensate for the increased/decreased number of nodes in the cluster. For more information, see [Understanding the parallelism of a Storm topology](http://storm.apache.org/documentation/Understanding-the-parallelism-of-a-Storm-topology.html).

	* **Kill** - Terminates a Storm topology after the specified timeout.

5. From this page, select an entry from the **Spouts** or **Bolts** section. This displays information about the selected component.

	![Storm Dachborad with information about selected components.](./media/hdinsight-apache-storm-tutorial-get-started/component-summary.png)

	This page displays the following information:

	* **Spout/Bolt stats** - Basic information on the component performance, organized into time windows.

		> [AZURE.NOTE] Selecting a specific time window changes the time window for information displayed in other sections of the page.

	* **Input stats** (bolt only) - Information on components that produce data consumed by the bolt.

	* **Output stats** - Information on data emitted by this bolt.

	* **Executors** - Information on instances of this component.

	* **Errors** - Errors produced by this component.

5. When viewing the details of a spout or bolt, select an entry from the **Port** column in the **Executors** section to view details for a specific instance of the component.

		2015-01-27 14:18:02 b.s.d.task [INFO] Emitting: split default ["with"]
		2015-01-27 14:18:02 b.s.d.task [INFO] Emitting: split default ["nature"]
		2015-01-27 14:18:02 b.s.d.executor [INFO] Processing received message source: split:21, stream: default, id: {}, [snow]
		2015-01-27 14:18:02 b.s.d.task [INFO] Emitting: count default [snow, 747293]
		2015-01-27 14:18:02 b.s.d.executor [INFO] Processing received message source: split:21, stream: default, id: {}, [white]
		2015-01-27 14:18:02 b.s.d.task [INFO] Emitting: count default [white, 747293]
		2015-01-27 14:18:02 b.s.d.executor [INFO] Processing received message source: split:21, stream: default, id: {}, [seven]
		2015-01-27 14:18:02 b.s.d.task [INFO] Emitting: count default [seven, 1493957]

	From this data, you can see that the word **seven** has occurred 1,493,957 times. That is how many times it has been encountered since this topology was started.

### Stop the topology

Return to the **Topology summary** page for the word-count topology, and then select **Kill** from the **Topology actions** section. When prompted, enter 10 for the seconds to wait before stopping the topology. After the timeout period, the topology no longer appears when you visit the **Storm UI** section of the dashboard.

##Delete the cluster

[AZURE.INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

## Summary

In this Apache Storm tutorial, you used the Storm Starter to learn how to create a Storm on HDInsight cluster and use the Storm Dashboard to deploy, monitor, and manage Storm topologies.

## <a id="next"></a>Next steps

* **HDInsight Tools for Visual Studio** - HDInsight Tools allows you to use Visual Studio to submit, monitor, and manage Storm topologies similar to the Storm Dashboard mentioned earlier. HDInsight Tools also provides the ability to create C# Storm topologies, and includes sample topologies that you can deploy and run on your cluster.

	For more information, see [Get Started using the HDInsight Tools for Visual Studio](hdinsight-hadoop-visual-studio-tools-get-started.md).

* **Sample files** - The HDInsight Storm cluster provides several examples in the **%STORM_HOME%\contrib** directory. Each example should contain the following:

	* The source code - for example, storm-starter-0.9.1.2.1.5.0-2057-sources.jar

	* The Java docs - for example, storm-starter-0.9.1.2.1.5.0-2057-javadoc.jar

	* The example - for example, storm-starter-0.9.1.2.1.5.0-2057-jar-with-dependencies.jar

	Use the 'jar' command to extract the source code or Java docs. For example, 'jar -xvf storm-starter-0.9.1.2.1.5.0.2057-javadoc.jar'.

	> [AZURE.NOTE] Java docs consist of webpages. Once extracted, use a browser to view the **index.html** file.

	To access these samples, you must enable Remote Desktop for the Storm on HDInsight cluster, and then copy the files from **%STORM_HOME%\contrib**.

* The following document contains a list of other examples that can be used with Storm on HDInsight:

	* [Example topologies for Storm on HDInsight](hdinsight-storm-example-topology.md)

[apachestorm]: https://storm.incubator.apache.org
[stormdocs]: http://storm.incubator.apache.org/documentation/Documentation.html
[stormstarter]: https://github.com/apache/storm/tree/master/examples/storm-starter
[stormjavadocs]: https://storm.incubator.apache.org/apidocs/
[azureportal]: https://manage.windowsazure.com/
[hdinsight-provision]: hdinsight-provision-clusters.md
[preview-portal]: https://portal.azure.com/
