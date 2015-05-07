<properties 
	pageTitle="Learn to use Visual Studio Hadoop tools for HDInsight | Microsoft Azure" 
	description="Learn how to install and use Visual Studio Hadoop tools for HDInsight to connect to a Hadoop cluster and run a Hive query." 
	keywords="hadoop tools,hive query,visual studio"
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
	ms.date="04/08/2015" 
	ms.author="jgao"/>

# Get started using Visual Studio Hadoop tools for HDInsight to run a Hive query

Learn how to use HDInsight Tools for Visual Studio to connect to HDInsight clusters and submit Hive queries. For more information about using HDInsight, see [Introduction to HDInsight][hdinsight.introduction] and [Get started with HDInsight][hdinsight.get.started]. For more information about connecting to a Storm cluster, see [Develop C# topologies for Apache Storm on HDInsight using Visual Studio][hdinsight.storm.visual.studio.tools]. 

>[AZURE.NOTE] The most recent release introduced some new features, such as Hive editor IntelliSense support, Hive script local validation, and YARN log access.


## Prerequisites

To complete this tutorial and use the Hadoop tools in Visual Studio, you'll need the following:

- A workstation with the following software:

	- Windows 8.1, Windows 8, or Windows 7
	- Visual Studio (one of the following versions):
		- Visual Studio 2012 Professional/Premium/Ultimate with [Update 4](http://www.microsoft.com/download/details.aspx?id=39305)
		- Visual Studio 2013 Community/Professional/Premium/Ultimate with [Update 4](https://www.microsoft.com/download/details.aspx?id=44921)
		- Visual Studio 2015 RC (Community/Enterprise)

	>[AZURE.NOTE] Currently, the HDInsight Tools for Visual Studio only come with the English version. 


## Install Hadoop tools for Visual Studio

HDInsight Tools for Visual Studio is packaged with Microsoft Azure SDK for .NET version 2.5.1 or later. It can be installed by using the [Web Platform Installer](http://go.microsoft.com/fwlink/?LinkId=255386). You must choose the one that matches your version of Visual Studio. This Hadoop tools package also installs the Microsoft Hive ODBC Driver (32-bit and 64-bit).

![Hadoop tools: HDinsight Tools for Visual Studio Web Platform installer.][1]


>[AZURE.NOTE] If you have Visual Studio 2015 or 2012, and you have installed Azure SDK 2.5, you must manually remove the older version before installing the latest version. Visual Studio 2013 supports a direct update.

## Connect to your Azure subscription
The HDInsight Tools for Visual Studio allows you to connect to your HDInsight clusters, perform some basic management operations, and run Hive queries.

>[AZURE.NOTE] For information on connecting to HDInsight Emulator, see [Get started with the HDInsight Emulator](hdinsight-get-started-emulator.md/#vstools).

>[AZURE.NOTE] For information on connecting to a generic Hadoop cluster (preview), see [Write and submit Hive queries using Visual Studio](http://blogs.msdn.com/b/xiaoyong/archive/2015/05/04/how-to-write-and-submit-hive-queries-using-visual-studio.aspx).


**To connect to your Azure subscription**

1.	Open Visual Studio.
2.	From the **View** menu, click **Server Explorer** to open the Server Explorer window.
3.	Expand **Azure**, and then expand **HDInsight**. 

	>[AZURE.NOTE]Notice the **HDInsight Task List** window should be open. If you do not see it, click **Other Windows** from the **View** menu, and then click **HDInsight Task List Window**.  
4.	Enter your Azure subscription credentials, and then click **Sign In**. This is only required if you have never connected to the Azure subscription from Visual Studio on this workstation.
5.	In Server Explorer, you will see a list of existing HDInsight clusters. If you do not have any clusters, you can provision one by using the Azure portal, Azure PowerShell, or the HDInsight SDK. For more information, see [Provision HDInsight clusters][hdinsight-provision].

	![Hadoop tools: HDInsight Tools for Visual Studio Server Explorer cluster list][5]
6.	Expand an HDInsight cluster. You will see **Hive Databases**, a default storage account, linked storage accounts, and **Hadoop Service log**. You can further expand the entities. 

After you have connected to your Azure subscription, you will be able to do the following:

**To connect to the Azure portal from Visual Studio**

- From Server Explorer, expand **Azure** > **HDInsight**, right-click an HDInsight cluster, and then click **Manage Cluster in Azure Portal**.

**To ask questions and provide feedback from Visual Studio**

- From the **Tools** menu, click **HDInsight**, and then click **MSDN Forum** to ask questions, or click **Give Feedback**.

## Navigate the linked resources 

From Server Explorer, you can see the default storage account and any linked storage accounts. If you expand the default storage account, you can see the containers on the storage account. The default storage account and the default container are marked. You can also right-click any of the containers to view the contents.

![HDInsight Tools for Visual Studio server explorer cluster list][2]

## Run a Hive query
[Apache Hive][apache.hive] is a data warehouse infrastructure built on Hadoop for providing data summarization, queries, and analysis. HDInsight Tools for Visual Studio supports running Hive queries from Visual Studio. For more information about Hive, see [Use Hive with HDInsight][hdinsight.hive].

It is time consuming to test Hive script against an HDInsight cluster. It could take several minutes or more. HDInsight Tools for Visual Studio is capable of validating Hive script locally without connecting to a live cluster.

HDInsight Tools for Visual Studio also enables users to see what’s inside the Hive job by collecting and surfacing the YARN logs of certain Hive jobs.

###View the **hivesampletable** 
All HDInsight clusters come with a sample Hive table called *hivesampletable*. We will use this table to show you how to list Hive tables, view the table schemas, and list the rows in the Hive table.



**To list Hive tables and view Hive table schema**

1.	From **Server Explorer**, expand **Azure** > **HDInsight** > the cluster of your choice > **Hive Databases** > **Default** > **hivesampletable** to see the table schema.
4.	Right-click **hivesampletable**, and then click **View Top 100 Rows** to list the rows. It is equivalent to running the following Hive query using Hive ODBC driver:

		SELECT * FROM hivesampletable LIMIT 100

	You can customize the row count. 
 
	![Hadoop tools: HDinsight Hive Visual Studio schema query][6]

###Create Hive tables

You can use the GUI to create a Hive table or use Hive queries. For information about using Hive queries, see [Run Hive queries](#run.queries).

**To create a Hive table**

1. From **Server Explorer**, expand **Azure** > **HDInsight Clusters** an HDInsight cluster > **Hive Databases**, then right-click **default**, and click **Create Table**.
2. Configure the table.
3. Click **Create Table** to submit the job to create the new Hive table.

	![Hadoop tools: hdinsight visual studio tools create hive table][7]

###<a name="run.queries"></a>Validate and run Hive queries
There are two ways to create and run Hive queries:

- Create ad-hoc queries
- Create a Hive application

**To create, validate, and run ad-hoc queries**

1. From **Server Explorer**, expand **Azure**, and then expand **HDInsight Clusters**.
2. Right-click the cluster where you want to run the query, and then click **Write a Hive Query**. 
3. Enter the Hive queries. Notice the Hive editor supports IntelliSense. HDInsight Tools for Visual Studio supports loading the remote metadata when you are editing your hive script. For example, when you type "SELECT * FROM", the intellisense will list all the suggested table names. When a table name is specified, the column names will be listed by the intellisense. 

	![Hadoop tools: HDInsight Visual Studio Tools Intellisense][13]

	![Hadoop tools: HDInsight Visual Studio Tools Intellisense][14]

	> [AZURE.NOTE] Only the metadata of the clusters that is selected in HDInsight Toolbar will be suggested.
4. (Optional): Click **Validate Script** to check the script syntax errors.

	![Hadoop tools: hdinsight tools for Visual Studio local validation][10]

4. Click **Submit** or **Submit (Advanced)**. With the advanced submit option, you will configure **Job Name**, **Arguments**, **Additional Configurations**, and **Status Directory** for the script:

	![hdinsight hadoop hive query][9]

	After you submit the job, you can see a **Hive Job Summary** window.

	![Summary of an HDInsight Hadoop Hive query][8]
5. Use the **Refresh** button to update the status until the job status changes to **Completed**.
6. Click the links at the bottom to see the following: **Job Query**, **Job Output**, **Job log**, or **Yarn log**.



**To create and run a Hive solution**

1. From the **FILE** menu, click **New**, and then click **Project**.
2. Select **HDInsight** from the left pane, select **Hive Application** in the middle pane, enter the properties, and then click **OK**.

	![Hadoop tools: hdinsight visual studio tools new hive project][11]
3. From **Solution Explorer**, double-click **Script.hql** to open it. 
4. To validate the Hive script, you can click the **Validate Script** button, or right-click the script in the Hive editor, and then click **Validate Script** from the context menu.

 
###View Hive jobs
You can view job queries, job output, job logs, and Yarn logs for Hive jobs. For more information, see the previous screenshot.

The most recent release of the tool allows you to see what’s inside your Hive jobs by collecting and surfacing  YARN logs. A YARN log can help you investigating performance issues. For more information about how HDInsight collects YARN logs, see [Access HDInsight Application Logs Programmatically][hdinsight.access.application.logs].

**To view Hive jobs**

1. From **Server Explorer**, expand **Azure**, and then expand **HDInsight**. 
2. Right-click an HDInsight cluster, and then click **View Hive Jobs**. You will see a list of the Hive jobs that ran on the cluster. 
3. Click a job in the job list to select it, and then use the **Hive Job Summary** window to open **Job Query**, **Job Output**, **Job Log**, or **Yarn log**.

	![Hadoop tools: HDInsight Visual Studio Tools view Hive jobs][12]
## Next steps
In this article, you have learned how to connect to HDInsight clusters from Visual Studio, using the Hadoop tools package, and how to run a Hive query. For more information, see:

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
[11]: ./media/hdinsight-hadoop-visual-studio-tools-get-started/hdinsight.visual.studio.tools.new.hive.project.png
[12]: ./media/hdinsight-hadoop-visual-studio-tools-get-started/hdinsight.visual.studio.tools.view.hive.jobs.png
[13]: ./media/hdinsight-hadoop-visual-studio-tools-get-started/hdinsight.visual.studio.tools.intellisense.table.names.png
[14]: ./media/hdinsight-hadoop-visual-studio-tools-get-started/hdinsight.visual.studio.tools.intellisense.column.names.png

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
