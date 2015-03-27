<properties
   pageTitle="Deploying and managing Storm topologies on HDInsight | Azure"
   description="Learn how to deploy, monitor and manage Storm topologies using the Storm Dashboard included with Apache Storm on HDInsight."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="java"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="03/27/2015"
   ms.author="larryfr"/>

#Deploy and manage Apache Storm topologies on HDInsight

The Storm Dashboard allows you to easily deploy and run Apache Storm topologies to your HDInsight cluster using your web browser. You can also use the dashboard to monitor and manage running topologies. If you use Visual Studio, the HDInsight Tools for Visual Studio provide similar features in Visual Studio.

Both the Storm Dashboard and Storm features of the HDInsight Tools rely on the Storm REST API, which can be used to create your own monitoring and management solutions.

##Prerequisites

* **Apache Storm on HDInsight** - see <a href="../hdinsight-storm-getting-started/" target="_blank">Get started with Apache Storm on HDInsight</a> for steps on creating a cluster

* For the **Storm Dashboard** - a modern web browser that supports HTML5

* For **Visual Studio** - Azure SDK 2.5.1 or newer and the HDInsight Tools for Visual Studio. See <a href="../hdinsight-hadoop-visual-studio-tools-get-started/" target="_blank">Get started using HDInsight Tools for Visual Studio</a> to install and configure the HDInsight tools for Visual Studio.

	One of the following versions of Visual Studio:

	* Visual Studio 2012 with <a href="http://www.microsoft.com/download/details.aspx?id=39305" target="_blank">Update 4</a>

	* Visual Studio 2013 with <a href="http://www.microsoft.com/download/details.aspx?id=44921" target="_blank">Update 4</a> or <a href="http://go.microsoft.com/fwlink/?LinkId=517284" target="_blank">Visual Studio 2013 Community</a>

	* <a href="http://visualstudio.com/downloads/visual-studio-2015-ctp-vs" target="_blank">Visual Studio 2015 CTP6</a>

	> [AZURE.NOTE] Currently the HDInsight Tools for Visual Studio only support Storm on HDInsight cluster versions 3.2.

##Storm Dashboard

The Storm Dashboard is available on your Storm cluster. The URL is **https://&lt;clustername>.azurehdinsight.net/**, where **clustername** is the name of your Storm on HDInsight cluster. You can also access the dashboard using the **Storm Dashboard** link from your cluster dashboard in the Azure Portal.

![the portal with storm dashboard highlighted][hdinsight-dashboard]

From the top of the Storm Dashboard, select **Submit Topology**. Follow the instructions on the page to either run a sample toplogy or upload and run a topology you have created.

![the submit topology page][storm-dashboard-submit]

###Storm UI

From the Storm Dashboard, select the **Storm UI** link. This will display information on the cluster, as well as any running topologies.

![the storm ui][storm-dashboard-ui]

> [AZURE.NOTE] With some versions of Internet Explorer, you may discover that the Storm UI does not refresh after you have first visited it. For example, not showing new topologies you have submitted or showing a topology as active when you have previously killed it. Microsoft is aware of this problem and is working on a solution.

####Main page

The main page of the Storm UI provides the following information.

* **Cluster Summary** - basic information about the Storm cluster

* **Topology summary** - a list of running topologies. Use the links in this section to view more information about specific topologies

* **Supervisor summary** - information about the Storm supervisor

* **Nimbus Configuration** - Nimbus configuration for the cluster

####Topology summary

Selecting a link from the **Topology summary** section will display the following information about the topology.

* **Topology summary** - basic information about the topology

* **Topology actions** - management actions you can perform for the topology

	* **Activate** - resumes processing of a deactivated topology

	* **Deactivate** - pauses a running topology

	* **Rebalance** - adjusts the parallelism of the topology. You should rebalance running topologies after you have changed the number of nodes in the cluster. This allows the topology to adjust parallelism to compensate for the increased/decreased number of nodes in the cluster

		For more information, see <a href="http://storm.apache.org/documentation/Understanding-the-parallelism-of-a-Storm-topology.html" target="_blank">Understanding the parllelism of a Storm topology</a>

	* **Kill** - terminates a Storm topology after the specified timeout

* **Topology stats** - statistics about the topology. Use the links in the **Window** column to set the time frame for the remaining entries on the page.

* **Spouts** - the spouts used by the topology. Use the links in this section to view more information about specific spouts

* **Bolts** - the bolts used by the topology. Use the links in this section to view more information about specific bolts

* **Topology configuration** - the configuration of the selected topology

####Spout and Bolt summary

Selecting a spout from the **Spouts** or **Bolts** section will display the following information about the selected item.

* **Component summary** - basic information about the spout or bolt

* **Spout/Bolt stats** - statistics about the spout or bolt. Us the links in the **Window** column to set the time frame for the remaining entries on the page

* **Input stats** (bolt only) - information about the input stream(s) consumed by the bolt

* **Output stats** - information about the streams emitted by this spout or bolt

* **Executors** - information about the instances of the spout or bolt. Select the **Port** entry for a specific executor to view a log of diagnostic information produced for this instance

* **Errors** - any error information for this spout or bolt.

##HDInsight Tools for Visual Studio

The HDInsight Tools can be used to submit C# or hybrid topologies to your Storm Cluster. The following steps use a sample application. For information on creating your own topologies using the HDInsight Tools, see [develop C# topologies using the HDInsight Tools for Visual Studio](hdinsight-storm-develop-csharp-visual-studio-topology.md).

Use the following steps to deploy a sample to your Storm on HDInsight cluster, then view and manage the topology.

1. If you have not already installed the latest version of the HDInsight Tools for Visual Studio, see <a href="../hdinsight-hadoop-visual-studio-tools-get-started/" target="_blank">Get started using HDInsight Tools for Visual Studio</a>.

2. Open Visual Studio, select **File**, **New**, and then **Project**.

3. From the **New Project** dialog, expand **Installed**, **Templates**, and select **HDInsight**. From the list of templates, select **Storm Sample**. At the bottom of the dialog, enter a name for the application.

	![image](./media/hdinsight-storm-deploy-monitor/sample.png)

1. In **Solution Explorer**, right-click on the project and select **Submit to Storm on HDInsight**.

	> [AZURE.NOTE] If prompted, enter the login credentials for your Azure subscription. If you have more than one subscription, login to the one that contains your Storm on HDInsight cluster.

2. Select your Storm on HDInsight cluster from the **Storm Cluster** dropdown, and then select **Submit**. You can monitor whether the submission is successful or not using the **Output** window.

3. Once the topology has been successfully submitted, the **Storm Topologies** for the cluster should appear. Select the topology from the list to view information about the running topology.

	![visual studio monitor](./media/hdinsight-storm-deploy-monitor/vsmonitor.png)

	> [AZURE.NOTE] You can also view **Storm Topologies** from **Server Explorer** by expanding **Azure**, **HDInsight**, and then right-clicking a Storm on HDInsight cluster and selecting **View Storm Topologies**.

	Use the links for the spouts or bolts to view information on these components. A new window will be opened for each item selected.

4. From the **Topology Summary** view, select **Kill** to stop the topology.

	> [AZURE.NOTE] Storm topologies continue running until they are killed, or the cluster is deleted.

##REST API

The Storm UI is built on top of the REST API, so you can perform similar management and monitoring functionality using the API. Using the REST API, you can create custom tools for managing and monitoring Storm topologies.

The Storm REST API is documented at <a href="https://github.com/apache/storm/blob/master/STORM-UI-REST-API.md" target="_base">https://github.com/apache/storm/blob/master/STORM-UI-REST-API.md</a>. The following information is specific to using the REST API with Apache Storm on HDInsight.

###Base URI

The base URI for the REST API on HDInsight clusters is **https://&lt;clustername>.azurehdinsight.net/stormui/api/v1/**, where **clustername** is the name of your Storm on HDInsight cluster.

###Authentication

Requests to the REST API must use **basic authentication** using the HDInsight cluster administrator name and password.

> [AZURE.NOTE] Since basic authentication is sent using clear text, you should **always** use HTTPS to secure communications with the cluster.

###Return values

Information returned from the REST API may only be usable from within the cluster or machines on the same Azure Virtual Network as the cluster. For example, the fully qualified domain name (FQDN) returned for Zookeeper servers will not be accessible from the Internet.

##Next Steps

Now that you've learned how to deploy and monitor topologies using the Storm Dashboard, learn how to [develop C# topologies using the HDInsight Tools for Visual Studio](hdinsight-storm-develop-csharp-visual-studio-topology.md), or how to [develop Java-based topologies using Maven](hdinsight-storm-develop-java-topology.md).


[hdinsight-dashboard]: ./media/hdinsight-storm-deploy-monitor/dashboard-link.png
[storm-dashboard-submit]: ./media/hdinsight-storm-deploy-monitor/submit.png
[storm-dashboard-ui]: ./media/hdinsight-storm-deploy-monitor/storm-ui-summary.png
