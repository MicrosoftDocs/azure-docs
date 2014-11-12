<properties urlDisplayName="Get Started" pageTitle="Get started with the HDInsight Emulator | Azure" metaKeywords="hdinsight, Azure hdinsight, hdinsight azure, get started hdinsight, emulator, hdinsight emulator" description="Learn how to use HDInsight Emulator for Azure." umbracoNaviHide="0" disqusComments="1" editor="cgronlun" manager="paulettm" services="hdinsight" title="Get started with the HDInsight Emulator" author="nitinme" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/25/2014" ms.author="nitinme" />

# Get started with the HDInsight Emulator 

This tutorial gets you started with Hadoop clusters in the Microsoft HDInsight Emulator for Azure (formerly HDInsight Server Developer Preview). The HDInsight Emulator comes with the same components from the Hadoop ecosystem as Azure HDInsight. For details, including information on the versions deployed, see [What version of Hadoop is in Azure HDInsight?][hdinsight-versions].

>[WACOM.NOTE] The HDInsight Emulator only includes a Hadoop cluster. It does not include HBase.

HDInsight Emulator provides a local development environment for Azure HDInsight. If you are familiar with Hadoop, you can get started with the Emulator using HDFS. In HDInsight, the default file system is Azure Blob storage (WASB, aka Azure Storage - Blobs). So eventually, you will want to develop your jobs using WASB. To use WASB with HDInsight Emulator, you must make changes to HDInsight Emulator configuration. 

> [WACOM.NOTE] The HDInsight Emulator can use only a single node deployment. 


**Prerequisites**	
Before you begin this tutorial, you must have the following:

- The HDInsight Emulator requires a 64-bit version of Windows. One of the following requirements must be satisfied:

	- Windows 7 Service Pack 1
	- Windows Server 2008 R2 Service Pack1
	- Windows 8 
	- Windows Server 2012

- Install and configure Azure PowerShell. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure]. 

## In this tutorial

* [Install the HDInsight Emulator](#install)
* [Run the word count sample](#runwordcount)
* [Run the getting started samples](#rungetstartedsamples)
* [Connect to Azure Blob storage](#blobstorage)
* [Run HDInsight PowerShell](#powershell)
* [Next steps](#nextsteps)

##<a name="install"></a>Install the HDInsight Emulator

The Microsoft HDInsight Emulator is installable via the Microsoft Web Platform Installer.  

> [WACOM.NOTE] The HDInsight Emulator currently only supports English OS. If you a previous version of the Emulator installed, you must uninstall the following two components from Control Panel/Program and Features before installing the latest version of Emulator.
><ul>
<li>Microsoft HDInsight Emulator for Windows Azure or HDInsight Developer Preview, whichever is installed.</li>
<li>Hortonworks Data Platform</li>
</ul>


**To install HDInsight Emulator**

1. Open Internet Explorer, and then browse to the [Microsoft HDInsight Emulator for Azure installation page][hdinsight-emulator-install].
2. Click **Install Now**. 
3. Click **Run** when prompted for the installation of HDINSIGHT.exe at the bottom of the page. 
4. Click the **Yes** button in the **User Account Control** window that pops up to complete the installation. You shall see the Web Platform Installer dialog box.
6. Click **Install** on the bottom of the page.
7. Click **I Accept** to agree to the licensing terms.
8. Verify the Web Platform Installer shows **The following products were successfully installed** status, and then click **Finish**.
9. Click **Exit** to close the Web Platform Installer window.

**To verify the HDInsight Emulator installation**
	
The installation should have installed three icons on your desktop. The three icons are linked as follows: 
	
- **Hadoop Command Line**: The Hadoop command prompt from which MapReduce, Pig and Hive jobs are run in the HDInsight Emulator.

- **Hadoop Name Node Status**: The NameNode maintains a tree-based directory for all the files in HDFS. It also keep tracks of where the data for all the files are kept in a Hadoop cluster. Clients communicate with the NameNode in order to figure out where the data nodes for all the files are stored.
	
- **Hadoop Yarn Status**: The job tracker that allocates MapReduce tasks to nodes in a cluster.

The installation should have also installed several local services. The following is a screenshot of the Services window:

![HDI.Emulator.Services][image-hdi-emulator-services]

The services related to HDInsight Emulator are not started by default. To start the services, from the Hadoop command line, run **start\_local\_hdp_services.cmd** under <system drive\>\hdp. To automatically start the services after the computer restarts, run **set-onebox-autostart.cmd**.  

For known issues with installing and running HDInsight Server, see the [HDInsight Emulator Release Notes][hdinsight-emulator-release-notes]. The installation log is located at **C:\HadoopFeaturePackSetup\HadoopFeaturePackSetupTools\gettingStarted.winpkg.install.log**.


##<a name="runwordcount"></a>Run a word count MapReduce job

Now that you have the HDInsight emulator configured on your workstation,  you can run a MapReduce job to test the installation. You will first upload some data files to HDFS, and then run a word count MapReduce job to count the frequency of specific words in those files. 

The word counting MapReduce program has been packaged into *hadoop-mapreduce-examples-2.4.0.SNAPSHOT.jar*.  The jar file is located at the *C:\hdp\hadoop-2.4.0.SNAPSHOT\share\hadoop\mapreduce* folder.

The MapReduce job to count words takes two arguments:

- An input folder. You will use *hdfs://localhost/user/HDIUser* as the input folder.
- An output folder. You will use *hdfs://localhost/user/HDIUser/WordCount_Output* as the output directory. The output folder can not be an existing folder, otherwise the MapReduce job will fail. If you want to run the MapReduce job for the second time, you must either specify a different output folder or delete the existing output folder. 

**To run the word count MapReduce job**

1. From the desktop, double-click **Hadoop Command Line** to open the Hadoop command line window.  The current folder should be:

		c:\hdp\hadoop-2.4.0.SNAPSHOT

	If not, run the following command:

		cd %hadoop_home%

2. Run the following Hadoop commands to make an HDFS folder for storing the input and output files:

		hadoop fs -mkdir /user
		hadoop fs -mkdir /user/HDIUser
	
3. Run the following Hadoop command to copy some local text files to HDFS:

		hadoop fs -copyFromLocal C:\hdp\hadoop-2.4.0.SNAPSHOT\share\doc\hadoop\common\*.txt /user/HDIUser

4. Run the following command to list the files in the /user/HDIUser folder:

		hadoop fs -ls /user/HDIUser

	You should see the following files:

		C:\hdp\hadoop-2.4.0.SNAPSHOT>hadoop fs -ls /user/HDIUser
		Found 4 items
		-rw-r--r--   1 username hdfs     574261 2014-09-08 12:56 /user/HDIUser/CHANGES.txt
		-rw-r--r--   1 username hdfs      15748 2014-09-08 12:56 /user/HDIUser/LICENSE.txt
		-rw-r--r--   1 username hdfs        103 2014-09-08 12:56 /user/HDIUser/NOTICE.txt
		-rw-r--r--   1 username hdfs       1397 2014-09-08 12:56 /user/HDIUser/README.txt

5. Run the following command to run the word count MapReduce job:

		C:\hdp\hadoop-2.4.0.SNAPSHOT> hadoop jar C:\hdp\hadoop-2.4.0.SNAPSHOT\share\hadoop\mapreduce\hadoop-mapreduce-examples-2.4.0.SNAPSHOT.jar wordcount /user/HDIUser/*.txt /user/HDIUser/WordCount_Output

6. Run the following command to list the number of words with "windows" in them from the output file:

		hadoop fs -cat /user/HDIUser/WordCount_Output/part-r-00000 | findstr "windows"

	The output should be:

		C:\hdp\hadoop-2.4.0.SNAPSHOT>hadoop fs -cat /user/HDIUser/WordCount_Output/part-r-00000 | findstr "windows"
		windows 4
		windows.        2
		windows/cygwin. 1

For more information on Hadoop commands, see [Hadoop commands manual][hadoop-commands-manual].

##<a name="rungetstartedsamples"></a> Run the get started samples

The HDInsight Emulator installation provides some samples to get users started with learning Apache Hadoop-based Services on Windows. These samples cover some tasks that are typically needed when processing a big data set. Going through the samples will help you familiarize with the concepts associated with the MapReduce programming model and its ecosystem.

The samples are organized around processing IIS W3C log data scenarios. A data generation tool is provided to create and import the data sets in various sizes to HDFS or WASB (Azure Blob storage). See [Use Azure Blob storage for HDInsight][hdinsight-storage] for more information). MapReduce, Pig, or Hive jobs can then be run on the pages of data generated by the PowerShell script. Note that the Pig and Hive scripts are a layer of abstraction over MapReduce, and eventually compile to MapReduce programs. Users may run a series of jobs to observe the effects of using these different technologies and how the data size affects the execution of the processing tasks. 

### In this section

- [The IIS w3c log data scenarios](#scenarios)
- [Load sample w3c log data](#loaddata)
- [Run Java MapReduce jobs](#javamapreduce)
- [Run Hive jobs](#hive)
- [Run Pig jobs](#pig)
- [Rebuild the samples](#rebuild)

###<a name="scenarios"></a>The IIS w3c log data scenarios

The w3c scenario generates and imports IIS W3C log data in three sizes into HDFS or WASB: 1MB (small), 500MB (medium), and 2GB (large). It provides three job types and implements each of them in C#, Java, Pig and Hive.

- **totalhits**: Calculates the total number of requests for a given page 
- **avgtime**: Calculates the average time taken (in seconds) for a request per page 
- **errors**: Calculates the number of errors per page, per hour, for requests whose status was 404 or 500 

These samples and their documentation do not provide an in-depth study or full implementation of the key Hadoop technologies. The cluster used has only a single node and so the effect of adding more nodes cannot, with this release, be observed. 

###<a name="loaddata"></a>Load sample W3c log data

Generating and importing the data to HDFS is done using the PowerShell script importdata.ps1.

**To import sample w3c log data:**

1. Open Hadoop command line from desktop.
2. Change the directory to **C:\hdp\GettingStarted**.
3. Run the following command to generate and import data to HDFS:

		powershell -File importdata.ps1 w3c -ExecutionPolicy unrestricted 

	If you want to load data into WASB instead, see [Connect to Azure Blob storage](#blobstorage).

4. Run the following command from Hadoop command line to list the imported files on HDFS:

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

**To run a MapReduce job for calculating web page hits**

1. Open the Hadoop command line.
2. Change the directory to **C:\hdp\GettingStarted**.
3. Run the following command to remove the output directory in case the folder exists.  The MapReduce job will fail if the output folder already exists.

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

		c:\Hadoop\GettingStarted\Java>hadoop fs -cat /w3c/output/part-00000
		/Default.aspx   3360
		/Info.aspx      1156
		/UserService    1137

	The Default.aspx page gets 3360 hits and so on. Try running the commands again by replacing the values as suggested in the table above and notice how the output changes based on the type of job and size of data.

### <a name="hive"></a>Run Hive jobs
The Hive query engine might feel familiar to analysts with strong SQL skills. It provides a SQL-like interface and a relational data model for HDFS. Hive uses a language called HiveQL, which is very similar to SQL. Hive provides a layer of abstraction over the Java-based MapReduce framework and the Hive queries are compiled to MapReduce at runtime.

**To run a Hive job**

1. Open Hadoop command line.
2. Change the directory to **C:\hdp\GettingStarted**.
3. Run the following command to remove the **/w3c/hive/input** folder in case the folder exists.  The hive job will fail if the folder exists.

		hadoop fs -rmr /w3c/hive/input

4. Run the following command to create the **/w3c/hive/input** folders and then copy the data files to the /hive/input folder:

        hadoop fs -mkdir /w3c/hive
		hadoop fs -mkdir /w3c/hive/input
        
		hadoop fs -cp /w3c/input/small/data_w3c_small.txt /w3c/hive/input

5. Run the following command to execute the **w3ccreate.hql** script file.  The script creates a Hive table, and loads data to the Hive table:
        
		C:\hdp\hive-0.13.0.SNAPSHOT\bin\hive.cmd -f ./Hive/w3c/w3ccreate.hql -hiveconf "input=/w3c/hive/input/data_w3c_small.txt"

	The output shall be similar to the following:

		Logging initialized using configuration in file:/C:/hdp/hive-0.13.0.SNAPSHOT	/conf/hive-log4j.properties
		OK
		Time taken: 1.137 seconds
		OK
		Time taken: 4.403 seconds
		Loading data to table default.w3c
		Moved: 'hdfs://HDINSIGHT02:8020/hive/warehouse/w3c' to trash at: hdfs://HDINSIGHT02:8020/user/<username>/.Trash/Current
		Table default.w3c stats: [numFiles=1, numRows=0, totalSize=1058423, rawDataSize=0]
		OK
		Time taken: 2.881 seconds

6. Run the following command to run the **w3ctotalhitsbypage.hql** HiveQL script file.  

        C:\hdp\hive-0.13.0\bin\hive.cmd -f ./Hive/w3c/w3ctotalhitsbypage.hql

	The following table describes the elements of the command:
	<table border="1">
	<tr><td>File</td><td>Description</td></tr>
	<tr><td>C:\hdp\hive-0.13.0.SNAPSHOT\bin\hive.cmd</td><td>The Hive command script.</td></tr>
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
		/Default.aspx   3360
		/Info.aspx      1156
		/UserService    1137
		Time taken: 49.304 seconds, Fetched: 3 row(s)

Note that as a first step in each of the jobs, a table will be created and data will be loaded into the table from the file created earlier. You can browse the file that was created by looking under the /Hive node in HDFS using the following command:

	hadoop fs -lsr /apps/hive/

### <a name="pig"></a>Run Pig jobs

Pig processing uses a data flow language, called *Pig Latin*. Pig Latin abstractions provide richer data structures than MapReduce, and perform for Hadoop what SQL performs for RDBMS systems. 


**To run the pig jobs:**

1. Open Hadoop command line.
2. Change directory to the **C:\hdp\GettingStarted** folder.
3. Run the following command to submit a Pig job:

		C:\hdp\pig-0.12.1.SNAPSHOT\bin\pig.cmd -f ".\Pig\w3c\TotalHitsForPage.pig" -p "input=/w3c/input/small/data_w3c_small.txt"

	The following table shows the elements of the command:
	<table border="1">
	<tr><td>File</td><td>Description</td></tr>
	<tr><td>C:\hdp\pig-0.12.1.SNAPSHOT\bin\pig.cmd</td><td>The Pig command script.</td></tr>
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

		(/Info.aspx,1156)
		(/UserService,1137)
		(/Default.aspx,3360)
		
Note that since Pig scripts compile to MapReduce jobs, and potentially to more than one such job, you might see multiple MapReduce jobs executing in the course of processing a Pig job.


### <a name="rebuild"></a>Rebuild the samples
The samples currently contain all the required binaries, so building is not required. If you'd like to make changes to the Java or .NET samples, you can rebuild them using either msbuild, or the included PowerShell script.

**To rebuild the samples**

1. Open Hadoop command line.
2. Run the following command:

		powershell -F buildsamples.ps1


##<a name="blobstorage"></a>Connect to Azure Blob storage
The HDInsight Emulator uses HDFS as the default file system. However, Azure HDInsight uses Azure Blob storage as the default file system. It is possible to configure HDInsight Emulator to use Azure Blob storage instead of local storage. Follow the instructions below to create a storage container in Azure and to connect it to the HDInsight Emulator.

>[WACOM.NOTE] For more information on how HDInsight uses Azure Blob storage, see [Use Azure blob Storage with HDInsight][hdinsight-storage].

Before you start with the instructions below, you must have created a storage account. For instructions, see [How To Create a Storage Account][azure-create-storage-account].

**To create a container**

1. Sign in to the [Management Portal][azure-management-portal].
2. Click **STORAGE** on the left. You shall see a list of storage accounts under your subscription.
3. Click the storage account where you want to create the container from the list.
4. Click **CONTAINERS** from the top of the page.
5. Click **ADD** on the bottom of the page.
6. Enter **NAME** and select **ACCESS**. You can use any of the three access level.  The default is **Private**.
7. Click **OK** to save the changes. You shall see the new container listed on the portal.

Before you can access an Azure Storage account, you must add the account name and the account key to the configuration file.

**To configure the connection to an Azure Storage account**

1. Open **C:\hdp\hadoop-2.4.0.SNAPSHOT\etc\hadoop\core-site.xml** in Notepad.
2. Add the following <property\> tag next to the other <property\> tags:

		<property>
		    <name>fs.azure.account.key.<StorageAccountName>.blob.core.windows.net</name>
		    <value><StorageAccountKey></value>
		</property>

	You must substitute <StorageAccountName\> and <StorageAccountKey\> with the values that match your storage account information.

3. Save the change.  You don't need to restart the Hadoop services.

Use the following syntax to access the storage account:

	wasb://<ContainerName>@<StorageAccountName>.blob.core.windows.net/

For example:

	hadoop fs -ls wasb://myContainer@myStorage.blob.core.windows.net/


##<a name="powershell"></a> Run HDInsight PowerShell
Some of the Azure HDInsight PowerShell cmdlets are also supported on HDInsight Emulator. These cmdlets include:

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

You will get a prompt when calling Get-Credential. You must use **hadoop** as the username. The password can be any string. The cluster name is always **http://localhost:50111**.

For more information for submitting Hadoop jobs, see [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]. For more information about the HDInsight PowerShell cmdlets, see [HDInsight cmdlet reference][hdinsight-powershell-reference].



##<a name="nextsteps"></a> Next steps
In this tutorial, you have an HDInsight Emulator installed, and have ran some Hadoop jobs. To learn more, see the following articles:

- [Get started using Azure HDInsight][hdinsight-get-started]
- [Develop Java MapReduce programs for HDInsight][hdinsight-develop-mapreduce]
- [Develop C# Hadoop streaming MapReduce programs for HDInsight][hdinsight-develop-deploy-streaming]
- [HDInsight emulator release notes][hdinsight-emulator-release-notes]
- [MSDN forum for discussing HDInsight](http://social.msdn.microsoft.com/Forums/en-US/hdinsight)



[azure-sdk]: http://azure.microsoft.com/en-us/downloads/
[azure-create-storage-account]: ../storage-create-storage-account/
[azure-management-portal]: https://manage.windowsazure.com/
[netstat-url]: http://technet.microsoft.com/en-us/library/ff961504.aspx

[hdinsight-develop-mapreduce]: ../hdinsight-develop-deploy-java-mapreduce/

[hdinsight-emulator-install]: http://www.microsoft.com/web/gallery/install.aspx?appid=HDINSIGHT
[hdinsight-emulator-release-notes]: ../hdinsight-emulator-release-notes/

[hdinsight-storage]: ../hdinsight-use-blob-storage/
[hdinsight-submit-jobs]: ../hdinsight-submit-hadoop-jobs-programmatically/
[hdinsight-powershell-reference]: http://msdn.microsoft.com/en-us/library/windowsazure/dn479228.aspx
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-develop-deploy-streaming]: ../hdinsight-hadoop-develop-deploy-streaming-jobs/
[hdinsight-versions]: ../hdinsight-component-versioning/

[Powershell-install-configure]: ../install-configure-powershell/

[hadoop-commands-manual]: http://hadoop.apache.org/docs/r1.1.1/commands_manual.html

[image-hdi-emulator-services]: ./media/hdinsight-get-started-emulator/HDI.Emulator.Services.png 
