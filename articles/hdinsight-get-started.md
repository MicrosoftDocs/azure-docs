<properties linkid="manage-services-hdinsight-get-started-hdinsight-hadoop" urlDisplayName="Get Started" pageTitle="Get started using Hadoop in HDInsight | Azure" metaKeywords="" description="Get started using Hadoop in HDInsight, a big data solution. Learn how to provision clusters, run hive jobs, and output data to Excel for analysis." metaCanonical="" services="hdinsight" documentationCenter="" title="Get started using Hadoop in HDInsight" authors="jgao" solutions="" manager="paulettm" editor="cgronlun" />




# Get started using Hadoop 2.2 in HDInsight

<div class="dev-center-tutorial-selector sublanding">
<a href="../hdinsight-get-started" title="Get started using Hadoop 2.2 in HDInsight" class="current">Hadoop 2.2</a>
<a href="../hdinsight-get-started-31" title="Get started using Hadoop 2.4 in HDInsight">Hadoop 2.4</a>
<a href="../hdinsight-get-started-21" title="Get started using Hadoop 1.2 in HDInsight">Hadoop 1.2</a>
</div>

HDInsight makes [Apache Hadoop][apache-hadoop] available as a service in the cloud. The MapReduce software framework is available in a simpler, more scalable, and more cost-efficient Azure environment. HDInsight also provides a cost-efficient approach to the managing and storing of data using Azure Blob storage. 

In this tutorial, you will provision an Hadoop cluster in HDInsight using the Azure Management Portal, submit an Hive job to query against a sample Hive table using the cluster dashboard, and then import the Hive job output data into Excel for examination.

> [WACOM.NOTE] This tutorial covers using Hadoop 2.2 clusters on HDInsight. For other supported version, click the selector on the top of the page. For version information, see [What's new in the cluster versions provided by HDInsight?][hdinsight-versions]

The live demo of this article:

<center><a href="https://www.youtube.com/watch?v=Y4aNjnoeaHA&list=PLDrz-Fkcb9WWdY-Yp6D4fTC1ll_3lU-QS" target = "_blank">![HDI.getstarted.video][img-hdi-getstarted-video]</a></center>

In conjunction with the general availability of Azure HDInsight, Microsoft has also released HDInsight Emulator for Azure, formerly known as *Microsoft HDInsight Developer Preview*. This product targets developer scenarios and as such only supports single-node deployments. For using HDInsight Emulator, see [Get Started with the HDInsight Emulator][hdinsight-emulator].

**Prerequisites:**

Before you begin this tutorial, you must have the following:


- An Azure subscription. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].
- A computer with Office 2013 Professional Plus, Office 365 Pro Plus, Excel 2013 Standalone, or Office 2010 Professional Plus.

**Estimated time to complete:** 30 minutes

##In this tutorial

* [Provision an HDInsight cluster](#provision)
* [Run an Hive job](#sample)
* [Connect to Microsoft business intelligence tools](#powerquery)
* [Next steps](#nextsteps)

	
##<a name="provision"></a>Provision an HDInsight cluster

HDInsight uses Azure Blob Storage for storing data. It is called *WASB* or *Azure Storage - Blob*. WASB is Microsoft's implementation of HDFS on Azure Blob storage. For more information see [Use Azure Blob storage with HDInsight][hdinsight-storage].

When provision an HDInsight cluster, an Azure Storage account and a specific Blob storage container from that account is designated as the default file system, just like in HDFS. The storage account must be located in the same data center as the HDInsight compute resources. Currently, you can only provision HDInsight clusters in the following data centers:

- Southeast Asia
- North Europe
- West Europe
- East US
- West US

In addition to this storage account, you can add additional storage accounts from either the same Azure subscription or different Azure subscriptions. For instructions on adding additional storage accounts, see [Provision HDInsight clusters][hdinsight-provision]. 

To simply this tutorial, only the default blob container and the default storage account are used, and all of the files are stored in the default file system container, located at */tutorials/getstarted/*. In practice, the data files are usually stored in a designated storage account.

**To create an Azure Storage account**

1. Sign in to the [Azure Management Portal][azure-management-portal].
2. Click **NEW** on the lower left corner, point to **DATA SERVICES**, point to **STORAGE**, and then click **QUICK CREATE**.

	![HDI.StorageAccount.QuickCreate][image-hdi-storageaccount-quickcreate]

3. Enter **URL**, **LOCATION** and **REPLICATION**, and then click **CREATE STORAGE ACCOUNT**. Affinity groups are not supported. You will see the new storage account in the storage list. 
4. Wait until the **STATUS** of the new storage account is changed to **Online**.
5. Click the new storage account from the list to select it.
6. Click **MANAGE ACCESS KEYS** from the bottom of the page.
7. Make a note of the **STORAGE ACCOUNT NAME** and the **PRIMARY ACCESS KEY** (or the **SECONDARY ACCESS KEY**.  Either of the keys works).  You will need them later in the tutorial.


For more information, see
[How to Create a Storage Account][azure-create-storageaccount] and [Use Azure Blob Storage with HDInsight][hdinsight-storage].




















**To provision an HDInsight cluster** 

1. Sign in to the [Azure Management Portal][azure-management-portal]. 

2. Click **HDInsight** on the left to list the status of the clusters in your account. In the following screenshot, there is no existing HDInsight cluster.

	![HDI.ClusterStatus][image-hdi-clusterstatus]

3. Click **NEW** on the lower left side, click **Data Services**, click **HDInsight**, and then click **Quick Create**.

	![HDI.QuickCreateCluster][image-hdi-quickcreatecluster]

4. Enter or select the following values:

	<table border="1">
	<tr><th>Name</th><th>Value</th></tr>
	<tr><td>Cluster Name</td><td>Name of the cluster</td></tr>
	<tr><td>Cluster Size</td><td>Number of data nodes you want to deploy. The default value is 4. But 8, 16 and 32 data node clusters are also available on the dropdown menu. Any number of data nodes may be specified when using the <strong>Custom Create</strong> option. Pricing details on the billing rates for various cluster sizes are available. Click the <strong>?</strong> symbol just above the dropdown box and follow the link on the pop up.</td></tr>
	<tr><td>Password</td><td>The password for the account <i>admin</i>. The cluster user name is specified to be "admin" by default when using the Quick Create option. Please note, this is NOT the Windows Administrator account for the VM. The account name can be changed by using the <strong>Custom Create</strong> wizard. The password field must be at least 10 characters and must contain an uppercase letter, a lowercase letter, a number, and a special character.</td></tr>
	<tr><td>Storage Account</td><td>Select the storage account you created from the dropdown box. <br/>

	Once a storage account is chosen, it cannot be changed. If the storage account is removed, the cluster will no longer be available for use.

	The HDInsight cluster location will be the same as the storage account.
	</td></tr>
	</table>

	Keep a copy of the cluster name.  You will need it later in the tutorial.

	>[WACOM.NOTE] The quick create method creates a HDInsight version 2.1 cluster. To create version 1.6 or 3.0 clusters, use the custom create method from the management portal, or use Azure PowerShell.

5. Click **Create HDInsight Cluster** on the lower right. When the provision process completes, the  status column will show **Running**.

For information on using the **CUSTOM CREATE** option, see [Provision HDInsight Clusters][hdinsight-provision].













##<a name="sample"></a>Run an Hive job

Now you have an HDInsight cluster provisioned. The next step is to run an Hive job to query a sample Hive table that comes with HDInsight clusters.  The table name is *hivesampletable*.

**To open cluster dashboard**

1. Sign in to the [Azure Management Portal][azure-management-portal]. 
2. Click **HDINSIGHT** from the left pane. You shall see a list of clusters created including the one you just created in the last section.
3. Click the cluster name where you want to run the Hive job.
4. Click **MANAGE CLUSTER** from the bottom of the page to open cluster dashboard. It opens a Web page on a different browser tab.   
5. Enter the Hadoop User account username and password.  The default username is **admin**, the password is what you entered during the provision process.  The dashboard looks like :

	![hdi.dashboard][img-hdi-dashboard]

	There are several tabs on the top.  The default tab is *Hive Editor*, other tabs include Jobs and Files.  Using the dashboard, you can submit Hive queryes, check Hadoop job logs, and browse WASB files. 

> [wacom.note] Notice is the URL is *&lt;ClusterName&gt;.azurehdinsight.net*. Instead of opening the dashboard from the Management portal, you can also open the dashboard from a Web browser using the URL.

**To run an Hive query**

1. From HDInsight cluster dashboard, click **Hive Editor** from the top.
2. In **Query Name**, enter **HTC20**.  The query name is job title.
3. In the query pane, enter the following query: 

		SELECT * FROM hivesampletable
			WHERE devicemake LIKE "HTC%"
			LIMIT 20;

	![hdi.dashboard.query.select][img-hdi-dashboard-query-select]

4. Click **Submit**. It takes a few moments to get the results back. The screen refreshes every 30 seconds. You can also click **Refresh** to refresh the screen.
 
	Once completed, the screen looks like:

	![hdi.dashboard.query.select.result][img-hdi-dashboard-query-select-result]

	Make a note of **Job Start Time (UTC)**. You will need it later.

	Scroll down a little more, you will see **Job Log**. Job Output is stdout, Job Log is stderr.

5. If you want to reopen the log file again in the future, you can click **Jobs** from the top of the screen, and then click the job title (query name). For example **HTC20** in this case.

**To browse the output file**

1. From the cluster dashboard, click **Files** from the top.
2. Click **Templeton-Job-Status**.
3. Click the GUID number which has the last Modified time a little after the Job Start Time you wrote down earlier. Make a note of this GUID.  You will need it in the next section.
4. The **stdout** file has the data you need in the next section. You can click **stdout** to download a copy of the data file if you want.
	
##<a name="powerquery"></a>Connect to Microsoft business intelligence tools 

The Power Query add-in for Excel can be used to export output from HDInsight into Excel where Microsoft Business Intelligence (BI) tools can be used to further process or display the results. 

You must have Excel 2010 or 2013 installed to complete this part of the tutorial. 

**To download Microsoft Power Query for Excel**

- Download Microsoft Power Query for Excel from the [Microsoft Download Center](http://www.microsoft.com/en-us/download/details.aspx?id=39379) and install it.

**To import HDInsight data**

1. Open Excel, and create a new blank workbook.
3. Click the **Power Query** menu, click **From Other Sources**, and then click **From Azure HDInsight**.

	![HDI.GettingStarted.PowerQuery.ImportData][image-hdi-gettingstarted-powerquery-importdata]

3. Enter the **Account Name** of the Azure Blob Storage Account associated with your cluster, and then click **OK**. This is the storage account you created earlier in the tutorial.
4. Enter the **Account Key** for the Azure Blob Storage Account, and then click **Save**. 
5. In the Navigator pane on the right, double-click the Blob storage container name. By default the container name is the same name as the cluster name. 

6. Locate **stdout** in the **Name** column (the path is *.../Templeton-Job-Status/<GUID>*), and then click **Binary** on the left of **stdout**.  The <GUID> must match the one you wrote down in the last section.

	![HDI.GettingStarted.PowerQuery.ImportData2][image-hdi-gettingstarted-powerquery-importdata2]

9. Click **Apply & Close** in the upper left corner. The query then imports the Hive job output into Excel.


##<a name="nextsteps"></a>Next steps
In this tutorial, you have learned how to provision a cluster with HDInsight, run a MapReduce job on it, and import the results into Excel where they can be further processed and graphically displayed using BI tools. To learn more, see the following articles:

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

[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: ../storage-create-storage-account/ 

[apache-hadoop]: http://hadoop.apache.org/

[powershell-download]: http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409
[powershell-install-configure]: ../install-configure-powershell/
[powershell-open]: ../install-configure-powershell/#Install


[img-hdi-dashboard]: ./media/hdinsight-get-started/HDI.dashboard.png
[img-hdi-dashboard-query-select]: ./media/hdinsight-get-started/HDI.dashboard.query.select.png
[img-hdi-dashboard-query-select-result]: ./media/hdinsight-get-started/HDI.dashboard.query.select.result.png

[img-hdi-getstarted-video]: ./media/hdinsight-get-started/HDI.GetStarted.Video.png


[image-hdi-storageaccount-quickcreate]: ./media/hdinsight-get-started/HDI.StorageAccount.QuickCreate.png
[image-hdi-clusterstatus]: ./media/hdinsight-get-started/HDI.ClusterStatus.png
[image-hdi-quickcreatecluster]: ./media/hdinsight-get-started/HDI.QuickCreateCluster.png

[image-hdi-gettingstarted-powerquery-importdata]: ./media/hdinsight-get-started/HDI.GettingStarted.PowerQuery.ImportData.png
[image-hdi-gettingstarted-powerquery-importdata2]: ./media/hdinsight-get-started/HDI.GettingStarted.PowerQuery.ImportData2.png
