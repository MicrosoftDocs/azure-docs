<properties 
	pageTitle="Try a Hadoop ecosystem with the HDInsight Emulator | Microsoft Azure" 
	description="Use an emulator on a desktop computer and a MapReduce tutorial to learn the Hadoop ecosystem in HDInsight. The HDInsight emulator works like a Hadoop sandbox." 
	editor="cgronlun" 
	manager="paulettm" 
	services="hdinsight" 
	authors="nitinme" 
	documentationCenter=""/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/29/2015" 
	ms.author="nitinme"/>

# Get started with the HDInsight Emulator 

This tutorial gets you started with Hadoop clusters in the Microsoft HDInsight Emulator for Azure (formerly HDInsight Server Developer Preview). The HDInsight Emulator comes with the same components from the Hadoop ecosystem as Azure HDInsight. For details, including information on the versions deployed, see [What version of Hadoop is in Azure HDInsight?](hdinsight-component-versioning.md).

> [AZURE.NOTE] The HDInsight Emulator includes only a Hadoop cluster. It does not include HBase or Storm.

The HDInsight Emulator provides a local development environment much like a Hadoop sandbox. If you are familiar with Hadoop, you can get started with the HDInsight Emulator by using the Hadoop Distributed File System (HDFS). In HDInsight, the default file system is Azure Blob storage. So eventually, you will want to develop your jobs by using Azure Blob storage. To use Azure Blob storage with the HDInsight Emulator, you must make changes to the configuration of the emulator. 

> [AZURE.NOTE] The HDInsight Emulator can use only a single node deployment. 


## Prerequisites	
Before you begin this tutorial, you must have the following:

- The HDInsight Emulator requires a 64-bit version of Windows. One of the following requirements must be satisfied:

	- Windows 7 Service Pack 1
	- Windows Server 2008 R2 Service Pack 1
	- Windows 8 
	- Windows Server 2012

- Install and configure Azure PowerShell. For instructions, see [Install and configure Azure PowerShell](install-configure-powershell.md). 


##<a name="install"></a>Install the HDInsight Emulator

The Microsoft HDInsight Emulator is installable via the Microsoft Web Platform Installer.  

> [AZURE.NOTE] The HDInsight Emulator currently supports only English operating systems. If you have a previous version of the emulator installed, you must uninstall the following two components from Control Panel/Programs and Features before installing the latest version of the emulator:
><ul>
<li>Microsoft HDInsight Emulator for Azure or HDInsight Developer Preview, whichever is installed</li>
<li>Hortonworks Data Platform</li>
</ul>


**To install the HDInsight Emulator**

1. Open Internet Explorer, and then browse to the [Microsoft HDInsight Emulator for Azure installation page][hdinsight-emulator-install].
2. Click **Install Now**. 
3. Click **Run** when prompted for the installation of HDINSIGHT.exe at the bottom of the page. 
4. Click the **Yes** button in the **User Account Control** window that pops up to complete the installation. The Web Platform Installer window appears.
6. Click **Install** on the bottom of the page.
7. Click **I Accept** to agree to the licensing terms.
8. Verify that the Web Platform Installer shows **The following products were successfully installed**, and then click **Finish**.
9. Click **Exit** to close the Web Platform Installer window.

**To verify the HDInsight Emulator installation**
	
The installation should have installed three icons on your desktop. The three icons are linked as follows: 
	
- **Hadoop Command Line** - The Hadoop command prompt from which MapReduce, Pig and Hive jobs are run in the HDInsight Emulator.

- **Hadoop NameNode Status** - The NameNode maintains a tree-based directory for all the files in HDFS. It also keeps track of where the data for all the files are kept in a Hadoop cluster. Clients communicate with the NameNode in order to figure out where the data nodes for all the files are stored.
	
- **Hadoop Yarn Status** - The job tracker that allocates MapReduce tasks to nodes in a cluster.

The installation should have also installed several local services. The following is a screenshot of the Services window:

![HDI.Emulator.Services][image-hdi-emulator-services]

The services related to the HDInsight Emulator are not started by default. To start the services, from the Hadoop command line, run **start\_local\_hdp_services.cmd** under C:\hdp (default location). To automatically start the services after the computer restarts, run **set-onebox-autostart.cmd**.  

For known issues with installing and running the HDInsight Emulator, see the [HDInsight Emulator Release Notes](hdinsight-emulator-release-notes.md). The installation log is located at **C:\HadoopFeaturePackSetup\HadoopFeaturePackSetupTools\gettingStarted.winpkg.install.log**.

##<a name="vstools"></a>Use Emulator with HDInsight Tools for Visual Studio

You can use HDInsight tools for Visual Studio to connect to the HDInsight Emulator. For information on how to use the Visual Studio tools with HDInsight clusters on Azure, see [Get started using HDInsight Hadoop Tools for Visual Studio](hdinsight-hadoop-visual-studio-tools-get-started.md).

### Install the HDInsight tools for Emulator

For instructions on how to install the HDInsight Visual Studio tools, see [here](hdinsight-hadoop-visual-studio-tools-get-started.md#installation).

### Connect to the HDInsight Emulator

1. Open Visual Studio.
2. From the **View** menu, click **Server Explorer** to open the Server Explorer window.
3. Expand **Azure**, right-click **HDInsight**, and then click **Connect to HDInsight Emulator**.

	 ![HDI.Emulator.Connect.VS](./media/hdinsight-get-started-emulator/hdi.emulator.connect.vs.png)

4. In the Connect to HDInsight Emulator dialog box, verify the values for WebHCat, HiveServer2, and WebHDFS endpoints, and then click **Next**. The values populated by default should work if you did not make any changes to the default configuration of the Emulator. If you made any changes, update the values in the dialog box and then click Next.

	![HDI.Emulator.Connect.VS.dialog](./media/hdinsight-get-started-emulator/hdi.emulator.connect.vs.dialog.png)

5. Once the connection is successfully established, click **Finish**. You should now see the HDInsight Emulator in the Server Explorer.

	![HDI.Emulator.Connect.VS.dialog](./media/hdinsight-get-started-emulator/hdi.emulator.vs.connected.png)

Once the connection is successfully established, you can use the HDInsight VS tools with Emulator, just like you would use it with an Azure HDInsight cluster. For instructions on how to use VS tools with Azure HDInsight clusters, see [Using HDInsight Hadoop Tools for Visual Studio](hdinsight-hadoop-visual-studio-tools-get-started.md).

### Troubleshoot: Connecting HDInsight Tools to the HDInsight Emulator

1. While connecting to the HDInsight Emulator, even though the dialog box shows that HiveServer2 connected successfully, you must manually set **hive.security.authorization.enabled property** to **false** in the Hive configuration file at C:\hdp\hive-*version*\conf\hive-site.xml, and then restart the local Emulator. HDInsight Tools for Visual Studio connects to HiveServer2 only when you are previewing the top 100 rows of your table. If you do not intend to use such a query, you can leave hive configuration as-is.

2. If you are using dynamic IP allocation (DHCP) on the computer running the HDInsight Emulator, you might need to update C:\hdp\hadoop-*version*\etc\hadoop\core-site.xml and change the value of property **hadoop.proxyuser.hadoop.hosts** to (*). This enables Hadoop user to connect from all hosts to impersonate the user you entered in Visual Studio.

		<property>
			<name>hadoop.proxyuser.hadoop.hosts</name>
			<value>*</value>
		</property>

3. You might get an error when Visual Studio tries to connect to WebHCat service (“error”: “Could not find job job_XXXX_0001”). In this case, you must restart the WebHCat service and try again. To restart the WebHCat service, start the **Services** MMC, right-click **Apache Hadoop Templeton** (this is the old name for WebHCat service), and click **Restart**.

##<a name="runwordcount"></a>Run a word-count MapReduce job

Now that you have the HDInsight Emulator configured on your workstation, you can run a MapReduce job to test the installation. You will first upload some data files to HDFS, and then run a word count MapReduce job to count the frequency of specific words in those files. 

The word-counting MapReduce program has been packaged into *hadoop-mapreduce-examples-2.4.0.2.1.3.0-1981.jar*. The jar file is located at the *C:\hdp\hadoop-2.4.0.2.1.3.0-1981\share\hadoop\mapreduce* folder.

The MapReduce job to count words takes two arguments:

- An input folder. You will use *hdfs://localhost/user/HDIUser* as the input folder.
- An output folder. You will use *hdfs://localhost/user/HDIUser/WordCount_Output* as the output folder. The output folder cannot be an existing folder, or the MapReduce job will fail. If you want to run the MapReduce job for the second time, you must either specify a different output folder or delete the existing output folder. 

**To run the word-count MapReduce job**

1. From the desktop, double-click **Hadoop Command Line** to open the Hadoop command-line window. The current folder should be:

		c:\hdp\hadoop-2.4.0.2.1.3.0-1981

	If not, run the following command:

		cd %hadoop_home%

2. Run the following Hadoop commands to make an HDFS folder for storing the input and output files:

		hadoop fs -mkdir /user
		hadoop fs -mkdir /user/HDIUser
	
3. Run the following Hadoop command to copy some local text files to HDFS:

		hadoop fs -copyFromLocal C:\hdp\hadoop-2.4.0.2.1.3.0-1981\share\doc\hadoop\common\*.txt /user/HDIUser

4. Run the following command to list the files in the /user/HDIUser folder:

		hadoop fs -ls /user/HDIUser

	You should see the following files:

		C:\hdp\hadoop-2.4.0.2.1.3.0-1981>hadoop fs -ls /user/HDIUser
		Found 4 items
		-rw-r--r--   1 username hdfs     574261 2014-09-08 12:56 /user/HDIUser/CHANGES.txt
		-rw-r--r--   1 username hdfs      15748 2014-09-08 12:56 /user/HDIUser/LICENSE.txt
		-rw-r--r--   1 username hdfs        103 2014-09-08 12:56 /user/HDIUser/NOTICE.txt
		-rw-r--r--   1 username hdfs       1397 2014-09-08 12:56 /user/HDIUser/README.txt

5. Run the following command to run the word-count MapReduce job:

		C:\hdp\hadoop-2.4.0.2.1.3.0-1981>hadoop jar C:\hdp\hadoop-2.4.0.2.1.3.0-1981\share\hadoop\mapreduce\hadoop-mapreduce-examples-2.4.0.2.1.3.0-1981.jar wordcount /user/HDIUser/*.txt /user/HDIUser/WordCount_Output

6. Run the following command to list the number of words with "windows" in them from the output file:

		hadoop fs -cat /user/HDIUser/WordCount_Output/part-r-00000 | findstr "windows"

	The output should be:

		C:\hdp\hadoop-2.4.0.2.1.3.0-1981>hadoop fs -cat /user/HDIUser/WordCount_Output/part-r-00000 | findstr "windows"
		windows 4
		windows.        2
		windows/cygwin. 1

For more information on Hadoop commands, see [Hadoop commands manual][hadoop-commands-manual].

##<a name="rungetstartedsamples"></a> Run the get-started sample

The HDInsight Emulator installation provides some samples to get users started with learning Apache Hadoop-based services on Windows. These samples cover some tasks that are typically needed when processing a big dataset. Going through the samples will help you become familiar with the concepts associated with the MapReduce programming model and its ecosystem.

The sample is organized around processing IIS World Wide Web Consortium (W3C) log data. A data generation tool is provided to create and import the datasets in various sizes to HDFS or Azure Blob storage. (See [Use Azure Blob storage for HDInsight](hdinsight-use-blob-storage.md) for more information). MapReduce, Pig, or Hive jobs can then be run on the pages of data generated by the Azure PowerShell script. Note that the Pig and Hive scripts are a layer of abstraction over MapReduce, and eventually compile to MapReduce programs. Users may run a series of jobs to observe the effects of using these different technologies and how the data size affects the execution of the processing tasks. 

### In this section

- [The IIS W3C log-data scenario](#scenarios)
- [Load sample W3C log data](#loaddata)
- [Run Java MapReduce job](#javamapreduce)
- [Run Hive job](#hive)
- [Run Pig job](#pig)
- [Rebuild the samples](#rebuild)

###<a name="scenarios"></a>The IIS W3C log-data scenarios

The W3C scenario generates and imports IIS W3C log data in three sizes into HDFS or Azure Blob storage: 1MB (small), 500MB (medium), and 2GB (large). It provides three job types and implements each of them in C#, Java, Pig and Hive.

- **totalhits** - Calculates the total number of requests for a given page. 
- **avgtime** - Calculates the average time taken (in seconds) for a request per page. 
- **errors** - Calculates the number of errors per page, per hour, for requests whose status was 404 or 500. 

These samples and their documentation do not provide an in-depth study or full implementation of the key Hadoop technologies. The cluster used has only a single node and so the effect of adding more nodes cannot, with this release, be observed. 

###<a name="loaddata"></a>Load sample W3C log data

Generating and importing the data to HDFS is done via the Azure PowerShell script importdata.ps1.

**To import sample W3C log data**

1. Open a Hadoop command line from the desktop.
2. Change the directory to **C:\hdp\GettingStarted**.
3. Run the following command to generate and import data to HDFS:

		powershell -File importdata.ps1 w3c -ExecutionPolicy unrestricted 

	If you want to load data into Azure Blob storage instead, see [Connect to Azure Blob storage](#blobstorage).

4. Run the following command from the Hadoop command line to list the imported files on HDFS:

		hadoop fs -ls -R /w3c

	The output should be similar to the following: 

		C:\hdp\GettingStarted>hadoop fs -ls -R /w3c
		drwxr-xr-x   - username hdfs          0 2014-09-08 15:40 /w3c/input
		drwxr-xr-x   - username hdfs          0 2014-09-08 15:41 /w3c/input/large
		-rw-r--r--   1 username hdfs  543683503 2014-09-08 15:41 /w3c/input/large/data_w3c_large.txt
		drwxr-xr-x   - username hdfs          0 2014-09-08 15:40 /w3c/input/medium
		-rw-r--r--   1 username hdfs  272435159 2014-09-08 15:40 /w3c/input/medium/data_w3c_medium.txt
		drwxr-xr-x   - username hdfs          0 2014-09-08 15:39 /w3c/input/small
		-rw-r--r--   1 username hdfs    1058423 2014-09-08 15:39 /w3c/input/small/data_w3c_small.txt

5. If you want to verify the file contents, run the following command to display one of the data files to the console window:

		hadoop fs -cat /w3c/input/small/data_w3c_small.txt

You now have the data files created and imported to HDFS. You can start running different Hadoop jobs.

###<a name="javamapreduce"></a> Run Java MapReduce jobs

MapReduce is the basic compute engine for Hadoop. By default, it is implemented in Java, but there are also examples that leverage .NET and Hadoop Streaming that use C#. The syntax for running a MapReduce job is:

	hadoop jar <jarFileName>.jar <className> <inputFiles> <outputFolder>

The jar file and the source files are located in the C:\Hadoop\GettingStarted\Java folder.

**To run a MapReduce job for calculating webpage hits**

1. Open the Hadoop command line.
2. Change the directory to **C:\hdp\GettingStarted**.
3. Run the following command to remove the output directory in case the folder exists. The MapReduce job will fail if the output folder already exists.

		hadoop fs -rm -r /w3c/output

3. Run the following command:

		hadoop jar .\Java\w3c_scenarios.jar "microsoft.hadoop.w3c.TotalHitsForPage" "/w3c/input/small/data_w3c_small.txt" "/w3c/output"

	The following table describes the elements of the command:
	<table border="1">
	<tr><td>Parameter</td><td>Note</td></tr>
	<tr><td>w3c_scenarios.jar</td><td>The jar file is located in the C:\hdp\GettingStarted\Java folder.</td></tr>
	<tr><td>microsoft.hadoop.w3c.TotalHitsForPage</td><td>The type can be substituted by one of the following: 
	<ul>
	<li>microsoft.hadoop.w3c.AverageTimeTaken</li>
	<li>microsoft.hadoop.w3c.ErrorsByPage</li>
	</ul></td></tr>
	<tr><td>/w3c/input/small/data_w3c_small.txt</td><td>The input file can be substituted by the following:
	<ul>
	<li>/w3c/input/medium/data_w3c_medium.txt</li>
	<li>/w3c/input/large/data_w3c_large.txt</li>
	</ul></td></tr>
	<tr><td>/w3c/output</td><td>This is the output folder name.</td></tr>
	</table>

4. Run the following command to display the output file:

		hadoop fs -cat /w3c/output/part-00000

	The output shall be similar to:

		c:\Hadoop\GettingStarted>hadoop fs -cat /w3c/output/part-00000
		/Default.aspx   3380
		/Info.aspx      1135
		/UserService    1126

	The Default.aspx page gets 3360 hits and so on. Try running the commands again by replacing the values as suggested in the table above and notice how the output changes based on the type of job and size of data.

### <a name="hive"></a>Run Hive jobs
The Hive query engine might feel familiar to analysts with strong Structured Query Language (SQL) skills. It provides a SQL-like interface and a relational data model for HDFS. Hive uses a language called HiveQL, which is very similar to SQL. Hive provides a layer of abstraction over the Java-based MapReduce framework, and the Hive queries are compiled to MapReduce at run time.

**To run a Hive job**

1. Open a Hadoop command line.
2. Change the directory to **C:\hdp\GettingStarted**.
3. Run the following command to remove the **/w3c/hive/input** folder in case the folder exists. The Hive job will fail if the folder exists.

		hadoop fs -rmr /w3c/hive/input

4. Run the following command to create the **/w3c/hive/input** folders and then copy the data files to the /hive/input folder:

        hadoop fs -mkdir /w3c/hive
		hadoop fs -mkdir /w3c/hive/input
        
		hadoop fs -cp /w3c/input/small/data_w3c_small.txt /w3c/hive/input

5. Run the following command to execute the **w3ccreate.hql** script file. The script creates a Hive table, and loads data to the Hive table:

	> [AZURE.NOTE] At this stage, you can also use the HDInsight Visual Studio tools to run the Hive query. Open Visual Studio, create a new Project, and from the HDInsight template, select **Hive Application**. Once the project opens, add the query as a new item. The query is available at **C:/hdp/GettingStarted/Hive/w3c**. Once the query is added to the project, replace **${hiveconf:input}** with **/w3c/hive/input**, and then press **Submit**.
        
		C:\hdp\hive-0.13.0.2.1.3.0-1981\bin\hive.cmd -f ./Hive/w3c/w3ccreate.hql -hiveconf "input=/w3c/hive/input/data_w3c_small.txt"

	The output shall be similar to the following:

		Logging initialized using configuration in file:/C:/hdp/hive-0.13.0.2.1.3.0-1981	/conf/hive-log4j.properties
		OK
		Time taken: 1.137 seconds
		OK
		Time taken: 4.403 seconds
		Loading data to table default.w3c
		Moved: 'hdfs://HDINSIGHT02:8020/hive/warehouse/w3c' to trash at: hdfs://HDINSIGHT02:8020/user/<username>/.Trash/Current
		Table default.w3c stats: [numFiles=1, numRows=0, totalSize=1058423, rawDataSize=0]
		OK
		Time taken: 2.881 seconds

6. Run the following command to run the **w3ctotalhitsbypage.hql** HiveQL script file:

	> [AZURE.NOTE] As explained earlier, you can run this query using the HDInsight Visual Studio Tools as well.  

        C:\hdp\hive-0.13.0.2.1.3.0-1981\bin\hive.cmd -f ./Hive/w3c/w3ctotalhitsbypage.hql

	The following table describes the elements of the command:
	<table border="1">
	<tr><td>File</td><td>Description</td></tr>
	<tr><td>C:\hdp\hive-0.13.0.2.1.3.0-1981\bin\hive.cmd</td><td>The Hive command script.</td></tr>
	<tr><td>C:\hdp\GettingStarted\Hive\w3c\w3ctotalhitsbypage.hql</td><td> You can substitute the Hive script file with one of the following:
	<ul>
	<li>C:\hdp\GettingStarted\Hive\w3c\w3caveragetimetaken.hql</li>
	<li>C:\hdp\GettingStarted\Hive\w3c\w3cerrorsbypage.hql</li>
	</ul>
	</td></tr>

	</table>

	The w3ctotalhitsbypage.hql HiveQL script is:

		SELECT filtered.cs_uri_stem,COUNT(*) 
		FROM (
		  SELECT logdate,cs_uri_stem from w3c WHERE logdate NOT RLIKE '.*#.*'
		) filtered
		GROUP BY (filtered.cs_uri_stem);

	The end of the output shall be similar to the following:
		
		MapReduce Total cumulative CPU time: 5 seconds 391 msec
		Ended Job = job_1410201800143_0008
		MapReduce Jobs Launched:
		Job 0: Map: 1  Reduce: 1   Cumulative CPU: 5.391 sec   HDFS Read: 1058638 HDFS Write: 53 SUCCESS
		Total MapReduce CPU Time Spent: 5 seconds 391 msec
		OK
		/Default.aspx   3380
		/Info.aspx      1135
		/UserService    1126
		Time taken: 49.304 seconds, Fetched: 3 row(s)

Note that as a first step in each of the jobs, a table will be created and data will be loaded into the table from the file created earlier. You can browse the file that was created by looking under the /Hive node in HDFS, using the following command:

	hadoop fs -lsr /apps/hive/

### <a name="pig"></a>Run Pig jobs

Pig processing uses a data-flow language called *Pig Latin*. Pig Latin abstractions provide richer data structures than MapReduce, and perform for Hadoop what SQL performs for relational database management systems. 


**To run the pig jobs**

1. Open a Hadoop command line.
2. Change the directory to the **C:\hdp\GettingStarted** folder.
3. Run the following command to submit a Pig job:

		C:\hdp\pig-0.12.1.2.1.3.0-1981\bin\pig.cmd -f ".\Pig\w3c\TotalHitsForPage.pig" -p "input=/w3c/input/small/data_w3c_small.txt"

	The following table shows the elements of the command:
	<table border="1">
	<tr><td>File</td><td>Description</td></tr>
	<tr><td>C:\hdp\pig-0.12.1.2.1.3.0-1981\bin\pig.cmd</td><td>The Pig command script.</td></tr>
	<tr><td>C:\hdp\GettingStarted\Pig\w3c\TotalHitsForPage.pig</td><td> You can substitute the Pig Latin script file with one of the following:
	<ul>
	<li>C:\hdp\GettingStarted\Pig\w3c\AverageTimeTaken.pig</li>
	<li>C:\hdp\GettingStarted\Pig\w3c\ErrorsByPage.pig</li>
	</ul>
	</td></tr>
	<tr><td>/w3c/input/small/data_w3c_small.txt</td><td> You can substitute the parameter with a larger file:
	
	<ul>
	<li>/w3c/input/medium/data_w3c_medium.txt</li>
	<li>/w3c/input/large/data_w3c_large.txt</li>
	</ul>
	
	</td></tr>
	</table>

	The output should be similar to the following:

		(/Info.aspx,1135)
		(/UserService,1126)
		(/Default.aspx,3380)
		
Note that since Pig scripts compile to MapReduce jobs, and potentially to more than one such job, you might see multiple MapReduce jobs executing in the course of processing a Pig job.

<!---
### <a name="rebuild"></a>Rebuild the samples
The samples currently contain all the required binaries, so building is not required. If you'd like to make changes to the Java or .NET samples, you can rebuild them by using either the Microsoft Build Engine (MSBuild) or the included Azure PowerShell script.


**To rebuild the samples**

1. Open a Hadoop command line.
2. Run the following command:

		powershell -F buildsamples.ps1
--->

##<a name="blobstorage"></a>Connect to Azure Blob storage
The HDInsight Emulator uses HDFS as the default file system. However, Azure HDInsight uses Azure Blob storage as the default file system. It is possible to configure the HDInsight Emulator to use Azure Blob storage instead of local storage. Follow the instructions below to create a storage container in Azure and to connect it to the HDInsight Emulator.

>[AZURE.NOTE] For more information on how HDInsight uses Azure Blob storage, see [Use Azure Blob storage with HDInsight](hdinsight-use-blob-storage.md).

Before you start with the instructions below, you must have created a storage account. For instructions, see [How To Create a Storage Account](storage-create-storage-account.md).

**To create a container**

1. Sign in to the [Azure portal][azure-management-portal].
2. Click **STORAGE** on the left. A list of storage accounts appears under your subscription.
3. Click the storage account where you want to create the container from the list.
4. Click **CONTAINERS** from the top of the page.
5. Click **ADD** on the bottom of the page.
6. Enter **NAME** and select **ACCESS**. You can use any of the three access levels. The default is **Private**.
7. Click **OK** to save the changes. The new container is now listed on the portal.

Before you can access an Azure Storage account, you must add the account name and the account key to the configuration file.

**To configure the connection to an Azure Storage account**

1. Open **C:\hdp\hadoop-2.4.0.2.1.3.0-1981\etc\hadoop\core-site.xml** in Notepad.
2. Add the following <property\> tag next to the other <property\> tags:

		<property>
		    <name>fs.azure.account.key.<StorageAccountName>.blob.core.windows.net</name>
		    <value><StorageAccountKey></value>
		</property>

	You must substitute <StorageAccountName\> and <StorageAccountKey\> with the values that match your Storage account information.

3. Save the change. You don't need to restart the Hadoop services.

Use the following syntax to access the Storage account:

	wasb://<ContainerName>@<StorageAccountName>.blob.core.windows.net/

For example:

	hadoop fs -ls wasb://myContainer@myStorage.blob.core.windows.net/


##<a name="powershell"></a> Run Azure PowerShell
Some of the Azure PowerShell cmdlets are also supported on the HDInsight Emulator. These cmdlets include:

- HDInsight job definition cmdlets
	
	- New-AzureHDInsightSqoopJobDefinition
	- New-AzureHDInsightStreamingMapReduceJobDefinition
	- New-AzureHDInsightPigJobDefinition                                                                                          
	- New-AzureHDInsightHiveJobDefinition                                                                                           
	- New-AzureHDInsightMapReduceJobDefinition
- Start-AzureHDInsightJob
- Get-AzureHDInsightJob
- Wait-AzureHDInsightJob

Here is a sample for submitting a Hadoop job:

	$creds = Get-Credential (hadoop as username, password can be anything)
	$hdinsightJob = <JobDefinition>
	Start-AzureHDInsightJob -Cluster http://localhost:50111 -Credential $creds -JobDefinition $hdinsightJob

You will get a prompt when calling Get-Credential. You must use **hadoop** as the user name. The password can be any string. The cluster name is always **http://localhost:50111**.

For more information about submitting Hadoop jobs, see [Submit Hadoop jobs programmatically](hdinsight-submit-hadoop-jobs-programmatically.md). For more information about the Azure PowerShell cmdlets for HDInsight, see [HDInsight cmdlet reference][hdinsight-powershell-reference].


##<a name="remove"></a> Remove the HDInsight Emulator
On the computer where you have the emulator installed, open Control Panel and under **Programs**, click **Uninstall a Program**. From the list of installed programs, right-click **Microsoft HDInsight Emulator for Azure**, and then click **Uninstall**. 


##<a name="nextsteps"></a> Next steps
In this tutorial, you installed the HDInsight Emulator and ran some Hadoop jobs. To learn more, see the following articles:

- [Get started using Azure HDInsight](hdinsight-get-started.md)
- [Develop Java MapReduce programs for HDInsight](hdinsight-develop-deploy-java-mapreduce.md)
- [Develop C# Hadoop streaming MapReduce programs for HDInsight](hdinsight-hadoop-develop-deploy-streaming-jobs.md)
- [HDInsight Emulator release notes](hdinsight-emulator-release-notes.md)
- [MSDN forum for discussing HDInsight](http://social.msdn.microsoft.com/Forums/hdinsight)



[azure-sdk]: http://azure.microsoft.com/downloads/
[azure-create-storage-account]: storage-create-storage-account.md
[azure-management-portal]: https://manage.windowsazure.com/
[netstat-url]: http://technet.microsoft.com/library/ff961504.aspx

[hdinsight-develop-mapreduce]: hdinsight-develop-deploy-java-mapreduce.md

[hdinsight-emulator-install]: http://www.microsoft.com/web/gallery/install.aspx?appid=HDINSIGHT
[hdinsight-emulator-release-notes]: hdinsight-emulator-release-notes.md

[hdinsight-storage]: hdinsight-use-blob-storage.md
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md
[hdinsight-powershell-reference]: http://msdn.microsoft.com/library/windowsazure/dn479228.aspx
[hdinsight-get-started]: hdinsight-get-started.md
[hdinsight-develop-deploy-streaming]: hdinsight-hadoop-develop-deploy-streaming-jobs.md
[hdinsight-versions]: hdinsight-component-versioning.md

[Powershell-install-configure]: install-configure-powershell.md

[hadoop-commands-manual]: http://hadoop.apache.org/docs/r1.1.1/commands_manual.html

[image-hdi-emulator-services]: ./media/hdinsight-get-started-emulator/HDI.Emulator.Services.png 
