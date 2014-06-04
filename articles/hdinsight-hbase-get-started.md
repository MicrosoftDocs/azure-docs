<properties linkid="manage-services-hdinsight-hbase-get-started-hdinsight-hadoop" urlDisplayName="Get Started" pageTitle="Get started using HBase with Hadoop in HDInsight | Azure" metaKeywords="" description="Get started using HBase with Hadoop in HDInsight. learn how to created HBase tables and query them with Hive." metaCanonical="" services="hdinsight" documentationCenter="" title="Get started using HBase with Hadoop in HDInsight" authors="bradsev" solutions="" manager="paulettm" editor="cgronlun" />



# Get started using HBase with Hadoop in HDInsight
Apache HBase is an open source, distributed, large-scale data store that provides low latency for random reads and writes. HDInsight makes HBase available as part of its [Apache Hadoop][apache-hadoop] cloud service. 

In this tutorial, you learn how to create and query HBase tables with HDInsight. The following procedures are described:

- How to provision an HBase cluster from the HDInsight portal and  how to enable and use RDP to access the cluster.
- How to create an HBase sample table, add rows, and then list the rows in the table.
- How to create a Hive table that maps to an existing HBase table and use HiveQL to query the data in the HBase table.
- How to use PowerShell to create a new HBase table, list the HBase tables in your account, and how to add and retrieve the rows from your tables.


> [WACOM.NOTE] HBase is currently only available in preview for use with HDInsight 3.1 clusters on HDInsight (based on Hadoop 2.4.0). For version information, see [What's new in the Hadoop cluster versions provided by HDInsight?][hdinsight-versions]


**Prerequisites:**

Before you begin this tutorial, you must have the following:

- An Azure subscription. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].
- The latest version of Azure PowerShell installed and configured. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].

**Estimated time to complete:** 45 minutes

##In this tutorial

* [Provision an HBase cluster](#create-hbase-cluster)
* [Create an HBase sample table](#create-sample-table)
* [Use Hive to query an HBase table](#hive-query)
* [Use PowerShell to create an HBase table and retrieve data from the table](#hbase-powershell)
* [Next steps](#next-steps)

	
##<a name="create-hbase-cluster"></a>Provision an HBase cluster


**To provision an HDInsight cluster** 

1. Sign in to the [Azure Management Portal][azure-management-portal]. 

2. Click **HDInsight** on the left to list the status of the clusters in your account.

3. Click **NEW** on the lower left side, click **Data Services**, click **HDInsight**, and then click **HBase**.

	![](http://i.imgur.com/gyEJ23t.jpg)

4. On the Cluster Details wizard, provide values for the cluster name and subscription name, and select HBase in the  field of the **CLUSTER TYPE** box. 

	![](http://i.imgur.com/5ZYLUrb.jpg)

5. Continue to the next **Cluster Size** page to configure cluster size and region.
6. Provide user information for the cluster on the next **Configure Cluster User** page.
7. Select the *Create New Storage* in the **STORAGE ACCOUNT** field on the next **Storage Account** page, provide your subscription credentials and click the circled check on the lower left to create the cluster.



##<a name="create-sample-table"></a>Create an HBase sample table

How to create an HBase sample table, add rows, and then list the rows in the table. It assumes you have completed the procedure outlined in the first section, and so have successfully created an HBase cluster.

**Enable the RDP connection to the HBase cluster**

1. To enable a Remote Desktop Connection to the HDInsight cluster, select the HBase cluster you have created and click the **CONFIGURATION** tab. Click the **ENABLE REMOTE** button at the bottom of the page to enable the RDP connection to the cluster.
2. Provide the credentials and expiration date on the CONFIGURE REMOTE DESKTOP wizard and click the checked circle on the lower right. (It might take a few minutes for the operation to complete.)
3. To connect to the HDInsight cluster, click on the **CONNECT** button at the bottom of the **CONFIGURATION** tab.

 
**Open the HBase Shell**

1. Within your RDP session, click on the **Hadoop Command Prompt** shortcut located on the desktop.

2. Change the folder to the HBase home directory:
	cd %HBASE_HOME%\bin

3. Open the HBase shell:
	hbase shell


**Create a sample table, add data and retrieve the data**

1. Create a sample table:
	create 'sampletable1', 'cf1'

2. Add a row to the sample table:

put 'sampletable1', 'row1', 'cf1:col1', 'value1'

3. List the rows in the sample table:
	scan 'sampletable1'

##<a name="hive-query"></a>Use Hive to query an HBase table

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

	
##<a name="hbase-powershell"></a>Use PowerShell to create an HBase table and retrieve data from the table



##<a name="next-steps"></a>Next steps
In this tutorial, you have learned how to provision an HBase cluster with HDInsight, create tables, and and view the data in those tables. You also learned how use Hive to query the data in HBase tables. To learn more about using Hive, see the following article:

- [Use Hive with HDInsight][hdinsight-use-hive]



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
