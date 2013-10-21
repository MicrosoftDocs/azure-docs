<properties linkid="manage-services-hdinsight-sample-sqoop-import-export" urlDisplayName="HDInsight Samples" pageTitle="Samples topic title TBD - Windows Azure" metaKeywords="hdinsight, hdinsight administration, hdinsight administration azure" metaDescription="Learn how to run a sample TBD." umbracoNaviHide="0" disqusComments="1" writer="bradsev" editor="cgronlun" manager="paulettm" />

# Sqoop Import-Export Sample
 
This sample topic shows how to use Apache Sqoop to import data from a SQL database on Windows Azure to an Hadoop on Azure HDFS cluster.

While Hadoop is a natural choice for processing unstructured and semi-structured data, such as logs and files, there may also be a need to process structured data stored in relational databases.

Sqoop is a tool designed to transfer data between Hadoop clusters and relational databases. You can use it to import data from a relational database management system (RDBMS) such as SQL or MySQL or Oracle into the Hadoop Distributed File System (HDFS), transform the data in Hadoop with MapReduce or Hive, and then export the data back into an RDBMS. In this tutorial, you are using a SQL Database for your relational database.

Sqoop is an open source software product of Cloudera, Inc. Software development for Sqoop moved in 2011 from gitHub to the [Apache Sqoop](http://sqoop.apache.org/) site.

In Windows Azure HDInsight, Sqoop is deployed from the Hadoop Command Shell on the head node of the HDFS cluster. You use the Remote Desktop feature available in the Hadoop on Azure portal to access the head node of the cluster for this deployment.

 
**You will learn:**		
* How to use Windows Azure PowerShell to run a MapReduce program on the Windows Azure HDInsight service that analyzes data contained in a file.



**Prerequisites**:	
You have a Windows Azure Account and have enabled the HDInsight Service for your subscription. You have installed Windows Azure PowerShell and the Powershell tools for Windows Azure HDInsight, and have configured them for use with your account. For instructions on how to do this, see [Getting Started with Windows Azure HDInsight Service](/en-us/manage/services/hdinsight/get-started-hdinsight/)

You will also need your outward facing IP address for your current location when configuring your firewall on SQL Database. To obtain it, go to the site [WhatIsMyIP][what-is-my-ip] and make a note of it. Later in the procedure, you also need the outward facing IP address for the head of the Hadoop cluster. You can obtain this IP address in the same way.

**Outline**		
This topic shows you how to run the sample, presents the Java code for the MapReduce program, summarizes what you have learned, and outlines some next steps. It has the following sections.
	
1. [Set up a SQL database](#set-up-sql)	
2. [Use Sqoop from HDInsigh to import data to a cluster](#java-code)
3. [Summary](#summary)	
4. [Next Steps](#next-steps)	

<h2><a id="set-up-sql"></a>Set up a SQL database</h2>
TBD: screen shots for this section - this is the RDP approach still.

1. Log in into your Windows Azure account. To create a database server, click the **Database** icon in the lower left-hand corner on the page.

2. On the **Getting Started** page, click the **Create a new SQL Database Server** option.

3. Select the type of subscription (such as **Pay-As-You-Go**) associated with you account in the **Create Server** window and press **Next**.

4. Select the appropriate **Region** in the **Create Server** window and click **Next**.

5. Specify the login and password of the server-level principal of your SQL Database server and then press **Next**.

6. Press **Add** to specify a firewall rule that allows your current location access to SQL Database to upload the AdventureWorks database. The firewall grants access based on the originating IP address of each request. Use the IP address found with the configuration preliminaries of this tutorial for the values to add. Specify a Rule name, such as shown, but remember to use your IP address, not the one used for illustration purposes below. (You must also add the outward IP address of the head node in you Hadoop cluster. If you know it already, add it now.) Then press the **Finish** button.

7. Download the AdventureWorks2012 database onto your local machine from Recommended Downloads link on the Adventure Works for SQL Database site.

8. Unzip the file, open an Administrator Command Prompt, and navigate to the AdventureWorks directory inside the AdventureWorks2012ForSQLAzure folder.

9. Run CreateAdventureWorksForSQLAzure.cmd by typing the following:

 	CreateAdventureWorksForSQLAzure.cmd servername username password

	For example, if the assigned SQL Database server is named b1gl33p, the administrator user name "Fred", and the password "Secret", you would type the following:

	CreateAdventureWorksForSQLAzure.cmd b1gl33p.database.windows.net Fred@b1gl33p Secret

	The script creates the database, installs the schema, and populates the database with sample data.

10. Return to the **WindowsAzurePlatform** portal page, click your subscription on the left-hand side (**Pay-As-You-Go** in the example below) and select your database (here named wq6xlbyoq0). The AventureWorks2012 should be listed in the **Database Name** column. Select it and press the **Manage** icon at the top of the page.

11. Enter the credentials for the SQL database when prompted and press **Log on**.

12. This opens the Web interface for the Adventure Works database on SQL Database. Press the **New Query** icon at the top to open the query editor.

13. Since Sqoop currently adds square brackets to the table name, we need to add a synonym to support two-part naming for SQL Server tables. To do so, run the following query:

 	`CREATE SYNONYM [Sales.SalesOrderDetail] FOR Sales.SalesOrderDetail` 

14. Run the following query and review its result. 

 	`select top 200 * from [Sales.SalesOrderDetail] `


<h2><a id="java-code"></a>Use Sqoop from HDInsigh to import data to a cluster</h2>

1. From your Account page, scroll down to the Open Ports icon in the Your cluster section and click the icon to open the ODBC Server port on the head node in your cluster. 

2. Return to your Account page, scroll down to the Your cluster section and click the **Remote Desktop** icon this time to open the head node in your cluster. TBD: update to use with PS.

3. Select **Open** when prompted to open the .rdp file.

4. Select Connect in the Remote Desktop Connection window.

5. Enter your credentials for the Hadoop cluster (not your Hadoop on Azure account) into the **Windows Security** window and select **OK**.

6. Open Internet Explorer and go to the site WhatIsMyIP   to obtain the outward facing IP address for the head node of the cluster. Return the SQL Database management page and add a firewall rule that allows your Hadoop cluster access to SQL Database. The firewall grants access based on the originating IP address of each request. 

7. Double-click on the Hadoop Command Shell icon in the upper left hand of the Desktop to open it. Navigate to the "c:\Apps\dist\sqoop\bin" directory and run the following command:

	`sqoop import --connect "jdbc:sqlserver://[serverName].database.windows.net;username=[userName]@[serverName];password=[password];database=AdventureWorks2012" --table Sales.SalesOrderDetail --target-dir /data/lineitemData -m 1`

	So, for example, for the following values:
 * server name: wq6xlbyoq0
 * username: HadoopOnAzureSqoopAdmin
 * password: Pa$$w0rd

	The sqoop command is:

	`sqoop import --connect "jdbc:sqlserver://wq6xlbyoq0.database.windows.net;username=HadoopOnAzureSqoopAdmin@wq6xlbyoq0;password=Pa$$w0rd;;database=AdventureWorks2012" --table Sales.SalesOrderDetail --target-dir /data/lineitemData -m 1`

8. Return to the **Accounts** page of the Hadoop on Azure portal and open the Interactive Console this time. Run the #lsr command from the JavaScript console to list the files and directories on your HDFS cluster. TBD Update for GA.

9. Run the #tail command to view selected results from the part-m-0000 file.
	`tail /user/RAdmin/data/SalesOrderDetail/part-m-00000` 

<h2><a id="summary"></a>Summary</h2>

In this tutorial, you saw how to transfer data between a Hadoop cluster managed by Windows Azure HDInsight and a relational database using Apache Sqoop.

<h2><a id="next-steps"></a>Next Steps</h2>

For tutorials runnng other samples and providing instructions on using Pig, Hive, and MapReduce jobs on Windows Azure HDInsight with Windows Azure PowerShell, see the following topics:


* [Sample: Pi Estimator][pi-estimator]

* [Sample: WordCount] [wordcount]

* [Sample: C# Steaming][cs-streaming]

* [Sample: 10GB GraySort][10gb-graysort]


* [Tutorial: Using Pig][pig]

* [Tutorial: Using Hive][hive]

* [Tutorial: Using MapReduce][mapreduce]


[getting-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/
[what-is-my-ip]:http://www.whatismyip.com/
[wordcount]: /en-us/manage/services/hdinsight/sample-wordcount/
[pi-estimator]: /en-us/manage/services/hdinsight/sample-pi-estimator/
[cs-streaming]: /en-us/manage/services/hdinsight/sample-csharp-streaming/
[10gb-graysort]: /en-us/manage/services/hdinsight/sample-10gb-graysort/
[scoop]: /en-us/manage/services/hdinsight/sample-sqoop-import-export/
[mapreduce]: /en-us/manage/services/hdinsight/using-mapreduce-with-hdinsight/
[hive]: /en-us/manage/services/hdinsight/using-hive-with-hdinsight/
[pig]: /en-us/manage/services/hdinsight/using-pig-with-hdinsight/
 

