<properties 
	pageTitle="Get started using HDInsight Tools for Visual Studio | Azure" 
	description="Learn how to install and use HDInsight Tools for Visual Studio to connect to HDInsight and run Hive queries." 
	services="HDInsight" 
	documentationCenter="" 
	authors="mumian" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="hdinsight" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="big-data" 
	ms.date="2/17/2015" 
	ms.author="jgao"/>

# Get started using HDInsight Hadoop Tools for Visual Studio

Learn how to use HDInsight Tools for Visual Studio to connect to HDInsight clusters and submit Hive queries. For more information on using HDInsight, see [Introduction to HDInsight][hdinsight.introduction], and [Get started with HDInsight][hdinsight.get.started]. For more information on connecting to Storm cluster, see [Develop C# topologies for Apache Storm on HDInsight using Visual Studio][hdinsight.storm.visual.studio.tools]. 

>[WACOM.NOTE] All of the HDInsight Tools' features that are available for Windows clusters also work in Linux clusters, except a few features that are not supported in Humboldt today, such as show YARN logs of a certain Hive job. 

>The most recent release has introduced some new features, such as Hive editor Intellisense support, Hive script local validation, and accessing Yarn logs.


##Prerequisites

- A workstation with the following

	- Windows 7, Windows 8, or Windows 8.1
	- Visual Studio with the following versions:
		- Visual Studio 2012 Professional/Premium/Ultimate with [Update 4](http://www.microsoft.com/download/details.aspx?id=39305)
		- Visual Studio 2013 Community/Professional/Premium/Ultimate with [Update 4](https://www.microsoft.com/download/details.aspx?id=44921)
		- Visual Studio 2015 Preview.

	>[WACOM.NOTE] Currently the tools only come with the English version. 


## Installation

HDInsight Tools for Visual Studio can be installed using the [Web Platform Installer](http://go.microsoft.com/fwlink/?LinkId=255386). You can query the tools using the keyword "hdinsight". There is one package for each of the Visual Studio versions. You must choose the one that matches to your Visual Studio.  The package will also install both Microsoft Hive ODBC Driver 32 bit and 64 bit.

![HDinsight Tools for Visual Studio Web Platform installer][1]


>[WACOM.NOTE] If you have visual studio 2012 or 2015, and you have the older version of Azure SDK installed, you must manually remove the older version before installing the latest version. Visual Studio 2013 supports direct update.

## Connect to your Azure subscription
The HDInsight Tools for Visual Studio allows you to connect to your HDInsight clusters, perform some basic management operations, and run Hive queries.

**To connect to Azure subscription**

1.	Run Visual Studio.
2.	From the **View** menu, click **Server Explorer** to open the Server Explorer window.
3.	Expand **Azure**, and then expand **HDInsight**. 

	>[WACOM.NOTE]Notice the **HDInsight Task List** window is opened. If you do not see it, you can open it by clicking **Other Windows** from the **VIEW** menu, and then click **HDInsight Task List Window**.  
4.	Enter your azure subscription credentials, and then click **Sign In**. This is only required if you haven’t never connected to the Azure subscription from the Visual Studio on this workstation.
5.	In Server Explorer, you will see a list of existing HDInsight clusters. If you do not have any clusters, you can provision one using the Management portal, Azure PowerShell, or HDInsight SDK.  For more information, see [Provision HDInsight clusters][hdinsight-provision].

	![HDInsight Tools for visual studio server explorer cluster list][5]
6.	Expand an HDInsight cluster. You will see **Hive Databases**, default Storage account, linked storage accounts and **Hadoop Service log**. You can further expand the entities. 

After you have connected to your Azure subscription, you will be able to perform the following:

**To connect to the Management portal from Visual Studio**

- From Server Explorer, expand **Azure**, **HDInsight**, right-click an HDInsight cluster, and then click **Manage Cluster in Azure Portal**.

**To ask questions and provide feedback from Visual Studio**

- From the **TOOLS** menu, click **HDInsight** and then click **MSDN Forum** to ask questions, or **Give Feedback**.

## Navigate the linked resources 

From Server Explorer, you can see the default storage account, and any linked storage accounts. Expand the default storage account, you can see the containers on the storage account. Both default storage account and default container are marked. You can also right-click any of the containers to view the container.

![HDInsight Tools for visual studio server explorer cluster list][2]

## Run Hive queries
[Apache Hive][apache.hive] is a data warehouse infrastructure built on top of Hadoop for providing data summarization, query, and analysis. HDInsight Tools for Visual Studio supports running Hive queries from Visual Studio. For more information about Hive, see [Use Hive with HDInsight][hdinsight.hive].

It is time consuming to test Hive script against an HDInsight cluster. It could take several minutes or more.  The HDInsight Tools for Visual Studio is capable of validating Hive script grammar locally without connecting to a live cluster.

HDInsight Tools for Visual Studio also enables users to see what’s inside the Hive job by collecting and surfacing the Yarn logs of certain Hive jobs.

###View the hivesampletable Hive table
All HDInsight clusters come with a sample Hive table called *hivesampletable*. We will use this table to show you how to list Hive tables, view the table schemas, and list the rows in the Hive table.



**To list Hive tables and view Hive table schema**

1.	From **Server Explorer**, expand **Azure**, expand **HDInsight**, expand a cluster, expand **Hive Databases**, expand **Default**, and then expand **hivesampletable** to see the table schema.
4.	Right-click **hivesampletable**, and then click **View Top 100 Rows** to list the rows. It is equivalent to running the following Hive query using Hive ODBC driver:

		SELECT * FROM hivesampletable LIMIT 100

	You can customize the row count. 
 
	![HDinsight Hive Visual Studio schema query][6]

###Create Hive tables

You can either use the GUI to create an Hive table, or use Hive queries. For using Hive queries, see [Run Hive queries](#run.queries).

**To create an Hive table**

1. From **Server Explorer**, expand **Azure**, **HDInsight Clusters**, an HDInsight cluster, **Hive Databases**, right-click **default**, and then click **Create Table**.
2. Configure the table.
3. Click **Create Table** to submit the job for creating the new Hive table.

	![hdinsight visual studio tools create hive table][7]

###<a name="run.queries"></a>Validate and run Hive queries
There are two ways to create and run Hive queries:

- Create ad-hoc queries
- Create an Hive application

**To create, validate and run ad-hoc queries**

1. From **Service Explorer**, expand **Azure**, and then expand **HDInsight Clusters**.
2. Right-click the cluster where you want to run the query, and then click **Write a Hive Query**. 
3. Enter Hive queries. Notice the Hive editor supports Intellisense.
4. (optional) Click **Validate Script** to check the script syntax errors.

	![hdinsight tools for Visual Studio local validation][10]

4. Click **Submit** or **Submit (Advanced)**. With the advanced submit, you will configure **Job Name**, **Arguments**, **Additional Configurations**, and **Status Directory** for the script:

	![hdinsight hadoop hive query][9]

	After you have submitted the job, you can see an **Hive Job Summary** window.

	![hdinsight hadoop hive query][8]
5. Use the **Refresh** button to fresh the status until the job status is changed to **Completed**.
6. Click the links on the bottom to see **Job Query**, **Job Output**, **Job log** or **Yarn log**.



**To Create/run an Hive solution**

1. From the **FILE** menu, click **New**, and then click **Project**.
2. Select **HDInsight** from the left pane, select **Hive Application** in the middle pane, enter the properties, and then click **OK**.
3. From **Solution Explorer**, double-click **Script.hql** to open it. 
4. To validate the Hive script, you can either click the Validate Script button, or right-click the script in the Hive editor, and then click “Validate Script” from the the context menu.

 
###View Hive jobs
You can view job query, job output, job log, and Yarn log for Hive jobs.  See the previous screenshot.

The most recent release of the tool allows you to see what’s inside your Hive jobs by collecting and surfacing  Yarn logs. Yarn log can help you investigating performance issues. For more information about how HDInsight collects YARN logs, see [Access HDInsight Application Logs Programmatically][hdinsight.access.application.logs].

**To view Hive jobs**

1. From **Server Explorer**, expand **Azure**, and then expand **HDInsight**. 
2. Right click an HDInsight cluster, and then click **View Hive Jobs**. You will see a list of the Hive jobs ran on the cluster. 
3. Click a job in the job list to select it, and then use the **Hive Job Summary** window to open **Job Query**, **Job Output**, **Job Log** or **Yarn log**.

## Next steps
In this article, you have learned how to connect to HDInsight clusters from Visual Studio, and run Hive queries. For more information, see:

- [Use Hadoop Hive in HDInsight][hdinsight.hive]
- [Get started using Hadoop in HDInsight][hdinsight.get.started]
- [Submit Hadoop jobs in HDInsight][hdinsight.submit.jobs]
- [Analyze Twitter data with Hadoop in HDInsight][hdinsight.analyze.twitter.data]


<!--Anchors-->
[Installation]: #installation
[Connect to your Azure subscription]: #connect-to-your-azure-subscription
[Navigate the linked resources]: #navigate-the-linked-resources
[Run Hive queries]: #run-hive-queries
[Next steps]: #next-steps

<!--Image references-->
[1]: ./media/hdinsight-hadoop-visual-studio-tools-get-started/hdinsight.visual.studio.tools.wpi.png
[2]: ./media/hdinsight-hadoop-visual-studio-tools-get-started/hdinsight.visual.studio.tools.linked.resources.png
[5]: ./media/hdinsight-hadoop-visual-studio-tools-get-started/hdinsight.visual.studio.tools.server.explorer.png
[6]: ./media/hdinsight-hadoop-visual-studio-tools-get-started/hdinsight.visual.studio.tools.hive.schema.png
[7]: ./media/hdinsight-hadoop-visual-studio-tools-get-started/hdinsight.visual.studio.tools.create.hive.table.png
[8]: ./media/hdinsight-hadoop-visual-studio-tools-get-started/hdinsight.visual.studio.tools.run.hive.job.summary.png
[9]: ./media/hdinsight-hadoop-visual-studio-tools-get-started/hdinsight.visual.studio.tools.submit.jobs.advanced.png
[10]: ./media/hdinsight-hadoop-visual-studio-tools-get-started/hdinsight.visual.studio.tools.validate.hive.script.png


<!--Link references-->
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight.introduction]: hdinsight-introduction.md
[hdinsight.get.started]: hdinsight-get-started.md
[hdinsight.hive]: hdinsight-use-hive.md
[hdinsight.submit.jobs]: hdinsight-submit-hadoop-jobs-programmatically.md
[hdinsight.analyze.twitter.data]: hdinsight-analyze-twitter-data.md
[hdinsight.storm.visual.studio.tools]: hdinsight-storm-develop-csharp-visual-studio-topology.md
[hdinsight.access.application.logs]: hdinsight-hadoop-access-yarn-app-logs.md

[apache.hive]: http://hive.apache.org