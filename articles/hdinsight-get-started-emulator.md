<properties linkid="manage-services-hdinsight-get-started-hdinsight" urlDisplayName="Get Started" pageTitle="Get Started with HDInsight Emulator for Windows Azure" metaKeywords="hdinsight, Windows Azure hdinsight, hdinsight azure, get started hdinsight, emulator, hdinsight emulator" metaDescription="Learn how to use HDInsight Emulator for Windows Azure." umbracoNaviHide="0" disqusComments="1" writer="jgao" editor="cgronlun" manager="paulettm" />



# Get started with the HDInsight Emulator 

This tutorial gets you started using the Microsoft HDInsight Emulator for Windows Azure (formerly HDInsight Server Developer Preview). The HDInsight Emulator comes with the same components from the Hadoop ecosystem as Windows Azure HDInsight. For details, including information on the versions deployed, see [What version of Hadoop is in Windows Azure HDInsight?](http://www.windowsazure.com/en-us/manage/services/hdinsight/howto-hadoop-version/ "HDInsight components and versions"). 

HDInsight Emulator provides a local development environment for the Windows Azure HDInsight. If you are familiar with Hadoop, you can get started with the Emulator using HDFS. But, in HDInsight, the default file system is Windows Azure Blob storage (WASB, aka Windows Azure Storage - Blobs), so eventually, you will want to develop your jobs using WASB. You can get started developing against WASB by using the Windows Azure Storage Emulator ??? probably only want to use a small subset of your data (no config changes required in the HDInsight Emulator, just a different storage account name). Then, you test your jobs locally against Windows  Azure Storage ??? again, only using a subset of your data (requires a config change in the HDInsight Emulator). Finally, you are ready to move the compute portion of your job to HDInsight and run a job against production data.

<div class="dev-callout">??
<b>Note</b>??
<p>The HDInsight Emulator can use only a single node deployment. </p>??
</div>

For a tutorial using HDInsight, see [Get started using Windows Azure HDInsight][hdinsight-get-started].

**Prerequisites**	
Before you begin this tutorial, you must have the following:

- The HDInsight Emulator requires a 64-bit version of Windows. One of the following requirements must be satisfied:

	- Windows 7 Service Pack 1
	- Windows Server 2008 R2 Service Pack1
	- Windows 8 
	- Windows Server 2012.

- Install and configure PowerShell for HDInsight. For instructions, see [Install and configure PowerShell for HDInsight][hdinsight-configure-powershell]. 

## In this tutorial

* [Install the HDInsight Emulator](#install)
* [Run the word count sample](#runwordcount)
* [Run the getting started samples](#rungetstartedsamples)
* [Connect to Windows Azure Blob storage](#blobstorage)
* [Run HDInsight PowerShell](#powershell)
* [Next steps](#nextsteps)

##<a name="install"></a>Install the HDInsight Emulator

The Microsoft HDInsight Emulator is installable via the Microsoft Web Platform Installer.  

<div class="dev-callout">??
<b>Note</b>??
<p>If you have had Microsoft HDInsight Developer Preview installed, you must uninstall the following two components from Control Panel/Program and Features first.</p>

<ul>
<li>HDInsight Developer Preview</li>
<li>Hortonworks Data Platform Developer Preview</li>
</ul>??
</div>

**To install HDInsight Emulator**

1. Open Internet Explorer, and then browse to the [Microsoft HDInsight Emulator for Windows Azure installation page][hdinsight-emulator-install].
2. Click **Install Now**. 
3. Click **Run** when prompted for the installation of HDINSIGHT.exe at the bottom of the page. 
4. Click the **Yes** button in the **User Account Control** window that pops up to complete the installation. You shall see the Web Platform Installer 4.6 window.
6. Click **Install** on the bottom of the page.
7. Click **I Accept** to agree to the licensing terms.
8. Verify the Web Platform Installer shows **the following products were successfully installed**, and then click **Finish**.
9. Click **Exit** to close the Web Platform Installer 4.6 window.

	The installation should have installed three icons on your desktop. The three icons are linked as follows: 
	
	- **Hadoop Command Line**: The Hadoop command prompt from which MapReduce, Pig and Hive jobs are run in the HDInsight Emulator.

	- **Hadoop Name Node Status**: The NameNode maintains a tree-based directory for all the files in HDFS. It also keep tracks of where the data for all the files are kept in a Hadoop cluster. Clients communicate with the NameNode in order to figure out where the data nodes for all the files are stored.
	
	- **Hadoop MapReduce Status**: The job tracker that allocates MapReduce tasks to nodes in a cluster.

	The installation should have also installed several local services. The following is a screenshot of the Services window:

	![HDI.Emulator.Services][image-hdi-emulator-services]

	For known issues with installing and running HDInsight Server, see the [HDInsight Emulator Release Notes][hdinsight-emulator-release-notes]. The installation log is located at **C:\HadoopFeaturePackSetup\HadoopFeaturePackSetupTools\gettingStarted.winpkg.install.log**.




##<a name="runwordcount"></a>Run a word count MapReduce job

Now you have the HDInsight emulator configured on your workstation. You can run a MapReduce job to test the installation. You will first upload some text files to HDFS, and then run a word count MapReduce job to count the word frequencies of those files. 

**To run the word count MapReduce job**

1. From the desktop, double-click **Hadoop Command Line** to open the Hadoop command line window.  The current folder should be:

		c:\Hadoop\hadoop-1.1.0-SNAPSHOT>

	If not, use the *cd* command to change directory to the folder.

2. Run the following Hadoop command to make a HDFS folder for storing the input and output files:

		hadoop fs -mkdir /user/HDIUser
	
3. Run the following Hadoop command to copy some local files to HDFS:

		hadoop fs -copyFromLocal *.txt /user/HDIUser/

4. Run the following command to list the files in the /user/HDIUser folder:

		hadoop fs -ls /user/HDIUser

	You should see the following files:

		c:\Hadoop\hadoop-1.1.0-SNAPSHOT>hadoop fs -ls /user/HDIUser
		Found 8 items
		-rw-r--r--   1 username supergroup      16372 2013-10-30 12:07 /user/HDIUser/CHANGES.branch-1-win.txt
		-rw-r--r--   1 username supergroup     463978 2013-10-30 12:07 /user/HDIUser/CHANGES.txt
		-rw-r--r--   1 username supergroup       6631 2013-10-30 12:07 /user/HDIUser/Jira-Analysis.txt
		-rw-r--r--   1 username supergroup      13610 2013-10-30 12:07 /user/HDIUser/LICENSE.txt
		-rw-r--r--   1 username supergroup       1663 2013-10-30 12:07 /user/HDIUser/Monarch-CHANGES.txt
		-rw-r--r--   1 username supergroup        103 2013-10-30 12:07 /user/HDIUser/NOTICE.txt
		-rw-r--r--   1 username supergroup       2295 2013-10-30 12:07 /user/HDIUser/README.Monarch.txt
		-rw-r--r--   1 username supergroup       1397 2013-10-30 12:07 /user/HDIUser/README.txt

5. Run the following command to run the word count MapReduce job:

		hadoop jar hadoop-examples.jar wordcount /user/HDIUser/*.txt /user/HDIUser/WordCount_Output

6. Run the following command to list the words with "windows" in them from the output file:

		hadoop fs -cat /user/HDIUser/WordCount_Output/part-r-00000 | findstr "windows"

	The output should be:

		c:\Hadoop\hadoop-1.1.0-SNAPSHOT>hadoop fs -cat /user/HDIUser/WordCount_Output/pa
		rt-r-00000 | findstr "windows"
		windows 12
		windows+java6.  1
		windows.        3


##<a name="rungetstartedsamples"></a> Run the get started samples

The HDInsight Emulator installation provides some samples to get new users started learning Apache Hadoop-based Services on Windows quickly. These samples covers some tasks that are typically needed when processing a big data set. Going through the samples can familiarize yourself with concepts associated with the MapReduce programming model and its ecosystem.

The samples are organized around the processing IIS W3C log data scenarios. A data generation tool is provided to create and import the data sets in various sizes to HDFS or WASB (Windows Azure Blob storage). See [Use Windows Azure Blob storage for HDInsight][hdinsight-blob-store] for more information). MapReduce, Pig or Hive jobs may then be run on the pages of data generated by the PowerShell script. Note that the Pig and Hive scripts used both compile to MapReduce programs. Users may run a series of jobs to observe, for themselves, the effects of using these different technologies and the effects of the size of the data on the execution of the processing tasks. 

### In this section

- [The IIS w3c log data scenarios](#scenarios)
- [Load sample w3c log data](#loaddata)
- [Run Java MapReduce jobs](#javamapreduce)
- [Run Hive jobs](#hive)
- [Run Pig jobs](#pig)
- [Rebuild the samples](#rebuild)

###<a name="scenarios"></a>The IIS w3c log data scenarios

The w3c scenario generates and imports IIS W3C log data in three sizes into HDFS or WASB: 1MB, 500MB, and 2GB. It provides three job types and implements each of them in C#, Java, Pig and Hive.

- **totalhits**: Calculates the total number of requests for a given page 
- **avgtime**: Calculates the average time taken (in seconds) for a request per page 
- **errors**: Calculates the number of errors per page, per hour, for requests whose status was 404 or 500 

These samples and their documentation do not provide an in-depth study or full implementation of the key Hadoop technologies. The cluster used has only a single node and so the effect of adding more nodes cannot, with this release, be observed. 

###<a name="loaddata"></a>Load sample W3c log data

Generating and importing the data to HDFS is done using the PowerShell script importdata.ps1.

**To import sample w3c log data:**

1. Open Hadoop command line from desktop.
2. Run the following command to change directory to **C:\Hadoop\GettingStarted**:

		cd \Hadoop\GettingStarted

3. Run the following command to generate and import data to HDFS:

		powershell ???File importdata.ps1 w3c -ExecutionPolicy unrestricted 

	If you want to load data into WASB instead, see [Connect to Windows Azure Blob storage](#blobstorage).

4. Run the following command from Hadoop command line to list the imported files on the HDFS:

		hadoop fs -lsr /w3c

	The output should be similar to the following: 

		c:\Hadoop\GettingStarted\w3c>hadoop fs -lsr /w3c
		drwxr-xr-x   - username supergroup          0 2013-10-30 13:29 /w3c/input
		drwxr-xr-x   - username supergroup          0 2013-10-30 13:29 /w3c/input/large
		-rw-r--r--   1 username supergroup  543692369 2013-10-30 13:29 /w3c/input/large/data_w3c_large.txt
		drwxr-xr-x   - username supergroup          0 2013-10-30 13:28 /w3c/input/medium
		-rw-r--r--   1 username supergroup  272394671 2013-10-30 13:28 /w3c/input/medium/data_w3c_medium.txt
		drwxr-xr-x   - username supergroup          0 2013-10-30 13:28 /w3c/input/small
		-rw-r--r--   1 username supergroup    1058328 2013-10-30 13:28 /w3c/input/small/data_w3c_small.txt

5. Run the following command to display one of the data files to the console window:

		hadoop fs -cat /w3c/input/small/data_w3c_small.txt

Now you have the data file created and imported to HDFS.  You can run different Hadoop jobs.

###<a name="javamapreduce"></a> Run Java MapReduce jobs

MapReduce is the basic compute engine for Hadoop. By default, it is implemented in Java, but there are also examples that leverage .NET and Hadoop Streaming that use C#. The syntax for running a MapReduce job is:

	hadoop jar <jarFileName>.jar <className> <inputFiles> <outputFolder>

The jar file and the source files are located in the C:\Hadoop\GettingStarted\Java folder.

**To run a MapReduce job for calculating web page hits**

1. Open the Hadoop command line.
2. Run the following command to change directory to **C:\Hadoop\GettingStarted**:

		cd \Hadoop\GettingStarted

3. Run the following command to remove the output directory in case the folder exists.  The MapReduce job will fail if the output folder already exists.

		hadoop fs -rmr /w3c/output

3. Run the following command:

		hadoop jar .\Java\w3c_scenarios.jar "microsoft.hadoop.w3c.TotalHitsForPage" "/w3c/input/small/data_w3c_small.txt" "/w3c/output"

	The following table describes the elements of the command:
	<table border="1">
	<tr><td>Parameter</td><td>Note</td></tr>
	<tr><td>w3c_scenarios.jar</td><td>The jar file is located in the C:\Hadoop\GettingStarted\Java folder.</td></tr>
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
		/Default.aspx   3409
		/Info.aspx      1115
		/UserService    1130

	So, the Default.aspx page gets 3409 hits and so on. 

### <a name="hive"></a>Run Hive jobs
The Hive query engine will feel familiar to analysts with strong SQL skills. It provides a SQL-like interface and a relational data model for HDFS. Hive uses a language called HiveQL (or HQL), which is a dialect of SQL.

**To run a Hive job**

1. Open Hadoop command line.
2. Change directory to the **C:\Hadoop\GettingStarted** folder
3. Run the following command to remove the **/w3c/hive/input** folder in case the folder exists.  The hive job will fail if the folder exists.

		hadoop fs -rmr /w3c/hive/input

4. Run the following command to create the **/w3c/hive/input** folder and copy the data file from the workstation to HDFS:

        hadoop fs -mkdir /w3c/hive/input
        hadoop fs -cp /w3c/input/small/data_w3c_small.txt /w3c/hive/input

5. Run the following command to execute the **w3ccreate.hql** script file.  The script creates a Hive table, and loads data to the Hive table:
        
		C:\Hadoop\hive-0.9.0\bin\hive.cmd -f ./Hive/w3c/w3ccreate.hql -hiveconf "input=/w3c/hive/input/data_w3c_small.txt"

	The HiveQL script is:
		
		DROP TABLE w3c;

		CREATE TABLE w3c(
		 logdate string,
		 logtime string,
		 c_ip string,
		 cs_username string,
		 s_ip string,
		 s_port string,
		 cs_method string,
		 cs_uri_stem string,
		 cs_uri_query string,
		 sc_status int,
		 sc_bytes int,
		 cs_bytes int,
		 time_taken int,
		 cs_agent string, 
		 cs_Referrer string)
		ROW FORMAT delimited
		FIELDS TERMINATED BY ' ';

		LOAD DATA INPATH '${hiveconf:input}' OVERWRITE INTO TABLE w3c;

	The output shall be similar to the following:

		c:\Hadoop\GettingStarted>C:\Hadoop\hive-0.9.0\bin\hive.cmd -f ./Hive/w3c/w3ccrea	te.hql -hiveconf "input=/w3c/hive/input/data_w3c_small.txt"
		Hive history file=c:\hadoop\hive-0.9.0\logs\history/hive_job_log_username_201310311452_1053491002.txt
		Logging initialized using configuration in file:/C:/Hadoop/hive-0.9.0/conf/hive-log4j.properties
		OK
		Time taken: 0.616 seconds
		OK
		Time taken: 0.139 seconds
		Loading data to table default.w3c
		Moved to trash: hdfs://localhost:8020/apps/hive/warehouse/w3c
		OK
		Time taken: 0.573 seconds

6. Run the following command to run the **w3ctotalhitsbypate.hql** HiveQL script file.  

        C:\Hadoop\hive-0.9.0\bin\hive.cmd -f ./Hive/w3c/w3ctotalhitsbypage.hql

	The following table describes the elements of the command:
	<table border="1">
	<tr><td>File</td><td>Description</td></tr>
	<tr><td>C:\Hadoop\hive-0.9.0\bin\hive.cmd</td><td>The Hive command script.</td></tr>
	<tr><td>C:\Hadoop\GettingStarted\Hive\w3c\w3ctotalhitsbypage.hql</td><td> You can substitute the Hive script file with one of the following:
	<ul>
	<li>C:\Hadoop\GettingStarted\Hive\w3c\w3caveragetimetaken.hql</li>
	<li>C:\Hadoop\GettingStarted\Hive\w3c\w3cerrorsbypage.hql</li>
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
		
		MapReduce Total cumulative CPU time: 3 seconds 47 msec
		Ended Job = job_201310291309_0006
		MapReduce Jobs Launched:
		Job 0: Map: 1  Reduce: 1   Cumulative CPU: 3.047 sec   HDFS Read: 1058546 HDFS W
		rite: 53 SUCCESS
		Total MapReduce CPU Time Spent: 3 seconds 47 msec
		OK
		/Default.aspx   3409
		/Info.aspx      1115
		/UserService    1130
		Time taken: 34.68 seconds

Note that as a first step in each of the jobs, a table will be created and data will be loaded into the table from the file created earlier. You can browse the file that was created by looking under the /Hive node in HDFS using the following command:

	hadoop fs -lsr /apps/hive/







### <a name="pig"></a>Run Pig jobs

Pig processing uses a data flow language, called *Pig Latin*. Pig Latin abstractions provide richer data structures than MapReduce, and perform for Hadoop what SQL performs for RDBMS systems. 



**To run the pig jobs:**

1. Open Hadoop command line.
2. Change directory to the C:\Hadoop\GettingStarted folder.
3. Run the following command to submit a Pig job:

		C:\Hadoop\pig-0.9.3-SNAPSHOT\bin\pig.cmd -f ".\Pig\w3c\TotalHitsForPage.pig" -p "input=/w3c/input/small/data_w3c_small.txt"

	The following table shows the elements of the command:
	<table border="1">
	<tr><td>File</td><td>Description</td></tr>
	<tr><td>C:\Hadoop\pig-0.9.3-SNAPSHOT\bin\pig.cmd</td><td>The Pig command script.</td></tr>
	<tr><td>C:\Hadoop\GettingStarted\Pig\w3c\TotalHitsForPage.pig</td><td> You can substitute the Pig Latin script file with one of the following:
	<ul>
	<li>C:\Hadoop\GettingStarted\Pig\w3c\AverageTimeTaken.pig</li>
	<li>C:\Hadoop\GettingStarted\Pig\w3c\ErrorsByPage.pig</li>
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

		(/Info.aspx,1115)
		(/UserService,1130)
		(/Default.aspx,3409)
		
Note that since Pig scripts compile to MapReduce jobs, and potentially to more than one such job, users may see multiple MapReduce jobs executing in the course of processing a Pig job.


### <a name="rebuild"></a>Rebuild the samples
The samples currently contain all of the required binaries, so building is not required. If you'd like to make changes to the Java or .NET samples, you can rebuild them using either msbuild, or the included PowerShell script.

**To rebuilt the samples**

1. Open Hadoop command line.
2. Run the following command:

		powershell ???F buildsamples.ps1






##<a name="blobstorage"></a>Connect to Windows Azure Blob storage
Windows Azure HDInsight uses Windows Azure Blob storage as the default file system. For more information, see [Use Windows Azure blob Storage with HDInsight][hdinsight-blob-store]. 

It is possible to configure a local cluster in the HDInsight Emulator to use Windows Azure Blob storage instead of local storage. The section covers:

- connect to the storage emulator
- connect to a Windows Azure Blob storage
- configure a Windows Azure Blob storage as the default file system for the HDInsight Emulator

### Connect to the storage emulator

The Windows Azure Storage emulator comes with [Windows Azure SDK for .NET][azure-sdk]. The storage emulator don't start automatically. You must manually start it.  The application name is *Windows Azure Storage Emulator*. To start/stop the emulators, right-click the blue Windows Azure icon in the Windows System Tray, and then click Show Storage Emulator UI.

<div class="dev-callout">??
<b>Note</b>??
<p>You might get the following error message when you start the storage emulator:</p>

<pre><code>
The process cannot access the file because it is being used by another process.
</code></pre>

<p>This is because one of the Hadoop Hive services also uses port 10000. To work around the problem, use the following procedure:</p>

<ol>
<li>Stop the two Hadoop Hive services using services.msc: Apache Hadoop hiveserver and Apache Hadoop Hiveserver2.</li>
<li>Start the Blob storage emulator. </li>
<li>Restart the two Hadoop Hive services. </li>
</ol>

</div>

The syntax for access the storage emulator is: 

	WASB://<ContainerName>@storageemulator

For example:

	hadoop fs -ls wasb://myContainer@storageemulator

<div class="dev-callout">??
<b>Note</b>??
<p>If you get the following error message:</p>

<pre><code>ls: No FileSystem for scheme: wasb</code></pre>

<p>It is because you are still using the Developer Preview version. Please follow the instructions found in the Install the HDInsight Emulator section of this article to uninstall the developer preview version, and then reinstall the application.</p> 
</div>

### Connect to Windows Azure Blob storage
For the instructions of creating a storage account, see [How To Create a Storage Account][azure-create-storage-account].

**To create a container**

1. Sign in to the [Management Portal][azure-management-portal].
2. Click **STORAGE** on the left. You shall see a list of storage accounts under your subscription.
3. Click the storage account where you want to create the container from the list.
4. Click **CONTAINERS** from the top of the page.
5. Click **ADD** on the bottom of the page.
6. Enter **NAME** and select **ACCESS**. You can use any of the three access level.  The default is **Private**.
7. Click **OK** to save the changes. You shall see the new container listed on the portal.

Before you can access a Windows Azure Storage account, you must add the account name and the account key to the configuration file.

**To configure the connection to a Windows Azure Storage account**

1. Open **C:\Hadoop\hadoop-1.1.0-SNAPSHOT\conf\core-site.xml** in Notepad.
2. Add the following &lt;property> tag next to the other &lt;property> tags:

		<property>
		    <name>fs.azure.account.key.<StorageAccountName>.blob.core.windows.net</name>
		    <value><StorageAccountKey></value>
		</property>

	You must substitute &lt;StorageAccountName> and &lt;StorageAccountKey> with the values that match your storage account information.

3. Save the change.  You don't need to restart the Hadoop services.

Use the following syntax to access the storage account:

	WASB://<ContainerName>@<StorageAccountName>.blob.core.windows.net/

For example:

	hadoop fs -ls wasb://myContainer@myStorage.blob.core.windows.net/


### Use a Windows Azure Blob storage container as the default file system

It is also possible to use a Windows Azure Blob storage container as the default file system, as is the case in Windows Azure HDInsight.  



**To configure the default file system using a Windows Azure Blob storage container**

1. Open **C:\Hadoop\hadoop-1.1.0-SNAPSHOT\conf\core-site.xml** in Notepad.
2. Locate the following &lt;property> tag:

		<property>
		  <name>fs.default.name</name>
		  <!-- cluster variant -->
		  <value>hdfs://localhost:8020</value>
		  <description>The name of the default file system.  Either the	literal string "local" or a host:port for NDFS.</description>
		  <final>true</final>
		</property>
	
3. Replace it with the following two &lt;property> tags:

		<property>
		  <name>fs.default.name</name>
		  <!-- cluster variant -->
		  <!--<value>hdfs://localhost:8020</value>-->
		  <value>wasb://<ContainerName>@<StorageAccountName>.blob.core.windows.net</value>
		  <description>The name of the default file system.  Either the	literal string "local" or a host:port for NDFS.</description>
		  <final>true</final>
		</property>
		
		<property>
		  <name>dfs.namenode.rpc-address</name>
		  <value>hdfs://localhost:8020</value>
		  <description>A base for other temporary directories.</description>
		</property>

	You must substitute &lt;StorageAccountName> and &lt;StorageAccountKey> with the values that match your storage account information.

4. Save the changes.
5. Open the Hadoop command line on your desktop in elevated mode (Run as administrator)
6. Run the following commands to restart the Hadoop services:

		C:\Hadoop\stop-onebox.cmd
		C:\Hadoop\start-onebox.cmd

7. Run the following command to test the connection to the default file system:

		hadoop fs -ls /

	The following commands list the contents in the same folder:
	
		hadoop fs -ls wasb:///
		hadoop fs -ls wasb://<ContainerName>@<StorageAccountName>.blob.core.windows.net/
		hadoop fs -ls wasbs://<ContainerName>@<StorageAccountName>.blob.core.windows.net/
	
	To access HDFS, use the following command:
	
		hadoop fs -ls hdfs://localhost:8020/
	

##<a name="powershell"></a> Run HDInsight PowerShell
Some of the HDInsight PowerShell cmdlets are supported on HDInsight Emulator.  These cmdlets include:

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
	Start-AzureHDInsightJob ???Cluster http://localhost:50111 ???Credential $creds ???JobDefinition $hdinsightJob

You will get a prompt when calling Get-Credential. You must use **hadoop** as the username. The password can be any string. The cluster name is always **http://localhost:50111**.

For more information for submitting Hadoop jobs, see [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]. For more information about the HDInsight PowerShell cmdlets, see [HDInsight cmdlet reference][hdinsight-powershell-reference].



##<a name="nextsteps"></a> Next steps
In this tutorial, you have an HDInsight Emulator installed, and have ran some Hadoop jobs. To learn more, see the following articles:

- [Get started using Windows Azure HDInsight][hdinsight-get-started]
- [Develop and deploy Hadoop streaming jobs to HDInsight][hdinsight-develop-deploy-streaming]
- [HDInsight emulator release notes](https://gettingstarted.hadooponazure.com/releaseNotes.html)
- [MSDN forum for discussing HDInsight](http://social.msdn.microsoft.com/Forums/en-US/hdinsight)



[azure-sdk]: http://www.windowsazure.com/en-us/downloads/
[azure-create-storage-account]: /en-us/manage/services/storage/how-to-create-a-storage-account/
[azure-management-portal]: https://manage.windowsazure.com/


[hdinsight-emulator-install]: http://www.microsoft.com/web/gallery/install.aspx?appid=HDINSIGHT
[hdinsight-emulator-release-notes]: http://gettingstarted.hadooponazure.com/releaseNotes.html

[hdinsight-blob-store]: /en-us/manage/services/hdinsight/howto-blob-store/
[hdinsight-configure-powershell]: /en-us/manage/services/hdinsight/install-and-configure-powershell-for-hdinsight/ 
[hdinsight-submit-jobs]: /en-us/manage/services/hdinsight/submit-hadoop-jobs-programmatically/
[hdinsight-powershell-reference]: http://msdn.microsoft.com/en-us/library/windowsazure/dn479228.aspx
[hdinsight-get-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/
[hdinsight-develop-deploy-streaming]: /en-us/manage/services/hdinsight/develop-deploy-hadoop-streaming-jobs/

[image-hdi-emulator-services]: ./media/hdinsight-get-started-emulator/HDI.Emulator.Services.png 
