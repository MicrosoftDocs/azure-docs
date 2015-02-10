<properties 
	pageTitle="Get started using Hadoop with Hive in HDInsight | Azure" 
	description="Get started using Hadoop in HDInsight, a big data solution in the cloud. Learn how to provision clusters, query data with Hive, and output to Excel for analysis." 
	services="hdinsight" 
	documentationCenter="" 
	authors="nitinme" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/14/2014" 
	ms.author="nitinme"/>


# Get started using Hadoop with Hive in HDInsight to analyze mobile handset use

<!--div class="dev-center-tutorial-selector sublanding">
<a href="../hdinsight-get-started" title="Get started using Hadoop 2.4 in HDInsight" class="current">Hadoop 2.4</a>
<a href="../hdinsight-get-started-30" title="Get started using Hadoop 2.2 in HDInsight">Hadoop 2.2</a>
<!--a href="../hdinsight-get-started-21" title="Get started using Hadoop 1.2 in HDInsight">Hadoop 1.2</a>
</div-->

To get you started quickly using HDInsight, this tutorial shows you how to run a Hive query to extract meaningful information from unstructured data in a Hadoop cluster. Then, you’ll analyze the results in Microsoft Excel.


> [AZURE.NOTE] If you are new to Hadoop and Big Data, you can read more about the terms [Apache Hadoop][apache-hadoop], [MapReduce][apache-mapreduce], [HDFS][apache-hdfs], and  [Hive][apache-hive]. To understand how HDInsight enables Hadoop in Azure, see [Introduction to Hadoop in HDInsight][hadoop-hdinsight-intro].

In conjunction with the general availability of Azure HDInsight, Microsoft also provides HDInsight Emulator for Azure, formerly known as *Microsoft HDInsight Developer Preview*. The Emulator targets developer scenarios and only supports single-node deployments. For using HDInsight Emulator, see [Get Started with the HDInsight Emulator][hdinsight-emulator].

> [AZURE.NOTE] For instructions on how to provision an HBase cluster, see [Provision HBase cluster in HDInsight][hdinsight-hbase-custom-provision]. See <a href="http://go.microsoft.com/fwlink/?LinkId=510237">What's the difference between Hadoop and HBase?</a> to understand why you might choose one over the other.   

## What does this tutorial achieve? ##

Assume you have a large unstructured data set and you want to run queries on it to extract some meaningful information. That's exactly what we are going to do in this tutorial. Here's how we achieve this:

   !["Get started using Hadoop with Hive in HDInsight" tutorial steps illustrated: create an account; provision a cluster; query data; and analyze in Excel.][image-hdi-getstarted-flow]

You can also watch a demo video of this tutorial:

<center><iframe width="560" height="315" src="http://www.youtube.com/embed/v=Y4aNjnoeaHA?list=PLDrz-Fkcb9WWdY-Yp6D4fTC1ll_3lU-QS" frameborder="0" allowfullscreen></iframe></center>

<!--center><a href="https://www.youtube.com/watch?v=Y4aNjnoeaHA&list=PLDrz-Fkcb9WWdY-Yp6D4fTC1ll_3lU-QS" target="_blank">![HDI.getstarted.video][img-hdi-getstarted-video]</a></center-->



**Prerequisites:**

Before you begin this tutorial, you must have the following:


- An Azure subscription. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].
- A computer with Office 2013 Professional Plus, Office 365 Pro Plus, Excel 2013 Standalone, or Office 2010 Professional Plus.

**Estimated time to complete:** 30 minutes

##In this tutorial

* [Create an Azure storage account](#storage)
* [Provision an HDInsight cluster](#provision)
* [Run samples from the portal](#sample)
* [Run a HIVE job](#hivequery)
* [Next steps](#nextsteps)

##<a name="storage"></a>Create an Azure Storage account

HDInsight uses Azure Blob Storage for storing data. It is called *WASB* or *Azure Storage - Blob*. WASB is Microsoft's implementation of HDFS on Azure Blob storage. For more information see [Use Azure Blob storage with HDInsight][hdinsight-storage].

When you provision an HDInsight cluster, you specify an Azure Storage account. A specific Blob storage container from that account is designated as the default file system, just like in HDFS. The HDInsight cluster is by default provisioned in the same data center as the storage account you specify.

In addition to this storage account, you can add additional storage accounts when you custom-configure an HDInsight cluster. This additional storage account can either be from the same Azure subscription or different Azure subscriptions. For instructions, see [Provision HDInsight clusters using custom options][hdinsight-provision]. 

To simplify this tutorial, only the default blob container and the default storage account are used. In practice, the data files are usually stored in a designated storage account.

**To create an Azure Storage account**

1. Sign in to the [Azure Management Portal][azure-management-portal].
2. Click **NEW** on the lower left corner, point to **DATA SERVICES**, point to **STORAGE**, and then click **QUICK CREATE**.

	![Azure portal where you can use Quick Create to set up a new storage account.][image-hdi-storageaccount-quickcreate]

3. Enter **URL**, **LOCATION** and **REPLICATION**, and then click **CREATE STORAGE ACCOUNT**. Affinity groups are not supported. You will see the new storage account in the storage list.

	>[AZURE.NOTE]  The quick-create option to provision an HDInsight cluster, like the one we use in this tutorial, does not ask for a location while provisioning the cluster. Instead, it by default co-locates the cluster in the same data center as the storage account. So, make sure you create your storage account in the locations supported for the cluster, which are:  **East Asia**, **Southeast Asia**, **North Europe**, **West Europe**, **East US**, **West US**, **North Central US**, **South Central US**.

4. Wait until the **STATUS** of the new storage account is changed to **Online**.
5. Select the new storage account from the list and click **MANAGE ACCESS KEYS** from the bottom of the page.
7. Make a note of the **STORAGE ACCOUNT NAME** and the **PRIMARY ACCESS KEY** (or the **SECONDARY ACCESS KEY**. Either of the keys work).  You will need them later in the tutorial.


For more information, see
[How to Create a Storage Account][azure-create-storageaccount] and [Use Azure Blob Storage with HDInsight][hdinsight-storage].
	
##<a name="provision"></a>Provision an HDInsight cluster

When you provision an HDInsight cluster, you provision Azure compute resources that contains Hadoop and related applications. In this section you provision a HDInsight cluster version 3.1, which is based on Hadoop version 2.4. You can also create Hadoop clusters for other versions using the Azure portal, HDInsight PowerShell cmdlets, or the HDInsight .NET SDK. For instructions, see [Provision HDInsight clusters using custom options][hdinsight-provision]. For information about different HDInsight versions and their SLA, see [HDInsight component versioning](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-component-versioning/) page.

[AZURE.INCLUDE [provisioningnote](../includes/hdinsight-provisioning.md)]


**To provision an HDInsight cluster** 

1. Sign in to the [Azure Management Portal][azure-management-portal]. 

2. Click **HDInsight** on the left to list the status of the clusters in your account. In the following screenshot, there are no existing HDInsight clusters.

	![Status of HDInsight clusters in the Azure portal.][image-hdi-clusterstatus]

3. Click **NEW** on the lower left side, click **Data Services**, click **HDInsight**, and then click **Hadoop**.

	![Creation of a Hadoop cluster in HDInsight.][image-hdi-quickcreatecluster]

4. Enter or select the following values:

	<table border="1">
	<tr><th>Name</th><th>Value</th></tr>
	<tr><td>Cluster Name</td><td>Name of the cluster</td></tr>
	<tr><td>Cluster Size</td><td>Number of data nodes you want to deploy. The default value is 4. But the option to use 1 or 2 data nodes is also available from the drop-down. Any number of cluster nodes can be specified by using the <strong>Custom Create</strong> option. Pricing details on the billing rates for various cluster sizes are available. Click the <strong>?</strong> symbol just above the dropdown box and follow the link on the pop up.</td></tr>
	<tr><td>Password</td><td>The password for the <i>admin</i> account. The cluster user name "admin" is specified when you are not using the <strong>Custom Create</strong> option. Note that this is NOT the Windows Administrator account for the VMs on which the clusters are provisioned. The account name can be changed by using the <strong>Custom Create</strong> wizard.</td></tr>
	<tr><td>Storage Account</td><td>Select the storage account you created from the dropdown box. <br/>

	Once a storage account is chosen, it cannot be changed. If the storage account is removed, the cluster will no longer be available for use.

	The HDInsight cluster is co-located in the same datacenter as the storage account. 
	</td></tr>
	</table>

	Keep a copy of the cluster name.  You will need it later in the tutorial.

	
5. Click **Create HDInsight Cluster**. When the provisioning completes, the  status column shows **Running**.

	>[AZURE.NOTE] The procedure above creates cluster with HDInsight cluster version 3.1. To create other cluster versions, use the custom create method from the management portal, or use Azure PowerShell. For information on what's different between each cluster version, see [What's new in the cluster versions provided by HDInsight?][hdinsight-versions] For information on using the **CUSTOM CREATE** option, see [Provision HDInsight clusters using custom options][hdinsight-provision].


##<a name="sample"></a>Run samples from the portal

A successfully provisioned HDInsight cluster provides a query console to run samples directly from the portal. You can use the samples to learn how to work with HDInsight by walking through some basic scenarios. These samples come with all the required components, such as the data to analyze and the queries to run on the data. 

**To run the sample**, from the Azure Management Portal, click the cluster name where you want to run the sample, and then click **Query Console** from the bottom of the page. From the web page that opens, click the **Getting Started Gallery** tab, and then under the **Samples** category, click the sample that you want to run. Follow the instructions on the web page to finish the sample. To know more about what each sample does, click the links below.

Sample | What does it do?
------ | ---------------
[Sensor data analysis][hdinsight-sensor-data-sample] | Learn how to use HDInsight to process historical data produced by heating, ventilation, and air conditioning (HVAC) systems to identify systems that are not able to reliably maintain a set temperature
[Website log analysis][hdinsight-weblogs-sample] | Learn how to use HDInsight to analyze website log files to get insight into the frequency of visits to the website in a day from external websites, and a summary of website errors that the users experience


##<a name="hivequery"></a>Run a HIVE query from the portal
Now that you have an HDInsight cluster provisioned, the next step is to run a Hive job to query a sample Hive table, *hivesampletable*, which comes with HDInsight clusters. The table contains data on mobile device manufacturer, platforms, and models. We query this table to retrieve data for mobile devices by a specific manufacturer.

> [AZURE.NOTE] HDInsight Tools for Visual Studio comes with Azure SDK for .NET version 2.5 or later.  Using the tools from Visual Studio, you can connect to HDInsight cluster, create Hive tables, and run Hive queries.  For more information see [Get started using HDInsight Hadoop Tools for Visual Studio][1].

**To run a Hive job from cluster dashboard**

1. Sign in to the [Azure Management Portal][azure-management-portal]. 
2. Click **HDINSIGHT** from the left pane. You shall see a list of clusters created, including the one you just created in the last section.
3. Click the cluster name where you want to run the Hive job and then click **QUERY CONSOLE** from the bottom of the page. 
4. It opens a Web page on a different browser tab. Enter the Hadoop user account and password.  The default user name is **admin**; the password is what you entered while provisioning the cluster.  The dashboard looks like:

	![Hive Editor tab in the HDInsight cluster dashboard.][img-hdi-dashboard]

	There are several tabs on the top.  The default tab is **Hive Editor**, while the other tabs are **Job History** and **File Browser**.  Using the dashboard, you can submit Hive queries, check Hadoop job logs, and browse WASB files.

	> [AZURE.NOTE] Note that the URL of the Web page is *&lt;ClusterName&gt;.azurehdinsight.net*. So, instead of opening the dashboard from the Management portal, you can also open the dashboard from a Web browser using the URL.

6. On the **Hive Editor** tab, for **Query Name**, enter **HTC20**.  The query name is the job title.

7. In the query pane, enter the following query: 

		SELECT * FROM hivesampletable
			WHERE devicemake LIKE "HTC%"
			LIMIT 20;

	![Query entered in the query pane of the Hive Editor.][img-hdi-dashboard-query-select]

4. Click **Submit**. It takes a few moments to get the results back. The screen refreshes every 30 seconds. You can also click **Refresh** to refresh the screen.

    Once completed, the screen looks like:

	![Results from a Hive query in listed at the bottom of the cluster dashboard.][img-hdi-dashboard-query-select-result]

5. Click the query name on the screen to see the output. Make a note of **Job Start Time (UTC)**. You will need it later. 

    ![Job Start Time listed in the Job History tab of the HDInsight cluster dashboard.][img-hdi-dashboard-query-select-result-output]

    The page also shows the **Job Output** and the **Job Log**. You also have the option to download the output file (\_stdout) and the log file \(_stderr).


	> [AZURE.NOTE] The **Job Session** table on the **Hive Editor** tab lists completed or running jobs as long as you stay on that tab. The table does not list any jobs if you navigate away from the page. The **Job History** tab maintains a list of all jobs, completed or running.
 

**To browse to the output file**

1. From the cluster dashboard, click **File Browser** at the top. 
2. Click your storage account name, click your container name (which is the same as your cluster name), and then click **user**.
3. Click **admin** and then click the GUID which has the last modified time a little after the job start time you noted earlier. Make a note of this GUID. You will need it in the next section.


   	![The output file GUID listed in the File Browser tab.][img-hdi-dashboard-query-browse-output]


###<a name="powerquery"></a>Connect to Microsoft business intelligence tools 

You can use the Power Query add-in for Microsoft Excel to import the job output from HDInsight into Excel, where Microsoft Business Intelligence (BI) tools can be used to further analysis of results. 

You must have Excel 2010 or 2013 installed to complete this part of the tutorial. 

**To download Microsoft Power Query for Excel**

- Download Microsoft Power Query for Microsoft Excel from the [Microsoft Download Center](http://www.microsoft.com/en-us/download/details.aspx?id=39379) and install it.

**To import HDInsight data**

1. Open Excel, and create a new blank workbook.
3. Click the **Power Query** menu, click **From Other Sources**, and then click **From Azure HDInsight**.

	![Excel PowerQuery Import menu open for Azure HDInsight.][image-hdi-gettingstarted-powerquery-importdata]

3. Enter the **Account Name** of the Azure Blob Storage Account associated with your cluster, and then click **OK**. This is the storage account you created earlier in the tutorial.
4. Enter the **Account Key** for the Azure Blob Storage Account, and then click **Save**. 
5. In the Navigator pane on the right, double-click the Blob storage container name. By default the container name is the same name as the cluster name. 

6. Locate **stdout** in the **Name** column. Verify the GUID in the corresponding **Folder Path** column matches the GUID you noted down earlier. A match suggests that the output data corresponds to the job you submitted. Click **Binary** on the left of **stdout**.

	![Finding the data output by GUID in the list of content.][image-hdi-gettingstarted-powerquery-importdata2]

9. Click **Close & Load** in the upper left corner to import the Hive job output into Excel.


##<a name="nextsteps"></a>Next steps
In this tutorial, you have learned how to provision a cluster with HDInsight, run a MapReduce job on it, and import the results into Excel where they can be further processed and graphically displayed using BI tools. To learn more, see the following articles:

- [Get started using HDInsight Hadoop Tools for Visual Studio][1]
- [Get started with the HDInsight Emulator][hdinsight-emulator]
- [Use Azure Blob storage with HDInsight][hdinsight-storage]
- [Administer HDInsight using PowerShell][hdinsight-admin-powershell]
- [Upload data to HDInsight][hdinsight-upload-data]
- [Use MapReduce with HDInsight][hdinsight-use-mapreduce]
- [Use Hive with HDInsight][hdinsight-use-hive]
- [Use Pig with HDInsight][hdinsight-use-pig]
- [Use Oozie with HDInsight][hdinsight-use-oozie]
- [Develop C# Hadoop streaming programs for HDInsight][hdinsight-develop-streaming]
- [Develop Java MapReduce programs for HDInsight][hdinsight-develop-mapreduce]


[1]: ../hdinsight-hadoop-visual-studio-tools-get-started/

[hdinsight-versions]: ../hdinsight-component-versioning/

[hdinsight-get-started-30]: ../hdinsight-get-started-30/
[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-admin-powershell]: ../hdinsight-administer-use-powershell/
[hdinsight-upload-data]: ../hdinsight-upload-data/
[hdinsight-use-mapreduce]: ../hdinsight-use-mapreduce
[hdinsight-use-hive]: ../hdinsight-use-hive/
[hdinsight-use-pig]: ../hdinsight-use-pig/
[hdinsight-use-oozie]: ../hdinsight-use-oozie/
[hdinsight-storage]: ../hdinsight-use-blob-storage/
[hdinsight-emulator]: ../hdinsight-get-started-emulator/
[hdinsight-develop-streaming]: ../hdinsight-hadoop-develop-deploy-streaming-jobs/
[hdinsight-develop-mapreduce]: ../hdinsight-develop-deploy-java-mapreduce/
[hadoop-hdinsight-intro]: ../hdinsight-hadoop-introduction/
[hdinsight-weblogs-sample]: ../hdinsight-hive-analyze-website-log/
[hdinsight-sensor-data-sample]: ../hdinsight-hive-analyze-sensor-data/

[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: ../storage-create-storage-account/ 

[apache-hadoop]: http://go.microsoft.com/fwlink/?LinkId=510084
[apache-hive]: http://go.microsoft.com/fwlink/?LinkId=510085
[apache-mapreduce]: http://go.microsoft.com/fwlink/?LinkId=510086
[apache-hdfs]: http://go.microsoft.com/fwlink/?LinkId=510087
[hdinsight-hbase-custom-provision]: http://azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-get-started/


[powershell-download]: http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409
[powershell-install-configure]: ../install-configure-powershell/
[powershell-open]: ../install-configure-powershell/#Install


[img-hdi-dashboard]: ./media/hdinsight-get-started/HDI.dashboard.png
[img-hdi-dashboard-query-select]: ./media/hdinsight-get-started/HDI.dashboard.query.select.png
[img-hdi-dashboard-query-select-result]: ./media/hdinsight-get-started/HDI.dashboard.query.select.result.png
[img-hdi-dashboard-query-select-result-output]: ./media/hdinsight-get-started/HDI.dashboard.query.select.result.output.png
[img-hdi-dashboard-query-browse-output]: ./media/hdinsight-get-started/HDI.dashboard.query.browse.output.png

[img-hdi-getstarted-video]: ./media/hdinsight-get-started/HDI.GetStarted.Video.png


[image-hdi-storageaccount-quickcreate]: ./media/hdinsight-get-started/HDI.StorageAccount.QuickCreate.png
[image-hdi-clusterstatus]: ./media/hdinsight-get-started/HDI.ClusterStatus.png
[image-hdi-quickcreatecluster]: ./media/hdinsight-get-started/HDI.QuickCreateCluster.png
[image-hdi-getstarted-flow]: ./media/hdinsight-get-started/HDI.GetStartedFlow.png

[image-hdi-gettingstarted-powerquery-importdata]: ./media/hdinsight-get-started/HDI.GettingStarted.PowerQuery.ImportData.png
[image-hdi-gettingstarted-powerquery-importdata2]: ./media/hdinsight-get-started/HDI.GettingStarted.PowerQuery.ImportData2.png
