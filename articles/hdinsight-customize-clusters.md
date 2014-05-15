<properties linkid="manage-services-hdinsight-customize HDInsight Hadoop clusters" urlDisplayName="Get Started" pageTitle="Customize HDInsight Hadoop clusters | Azure" metaKeywords="" description="Customize HDInsight Hadoop clusters" metaCanonical="" services="hdinsight" documentationCenter="" title="Customize HDInsight Hadoop clusters" authors="jgao" solutions="" manager="paulettm" editor="cgronlun" />




# Customize HDInsight Hadoop clusters

bla, bla, bla ...

Make changes direction to the configuration files can't be retained during the life time of the cluster.
change certain hadoop configurations from default values and would like to preserve the changes throughout the lifetime of the cluster


##In this tutorial

* [Understand Hadoop configuration](#config)
* [Customize Hadoop cluster during provision](#provision)
* [Customize Hadoop cluster after provision](#post-provision)
* [Next steps](#nextsteps)


##<a id="config"></a>Understand Hadoop configuration


##<a id="provision"></a>Customize Hadoop cluster during provision



There are several ways to submit MapReduce jobs to HDInsight. In this tutorial, you will use Azure PowerShell. To install Azure PowerShell, run the [Microsoft Web Platform Installer][powershell-download]. Click **Run** when prompted, click **Install**, and then follow the instructions. For more information, see [Install and configure Azure PowerShell][powershell-install-configure].

The PowerShell cmdlets require your subscription information so that it can be used to manage your services.

**To connect to your subscription using Azure AD**

1. Open the Azure PowerShell console, as instructed in [How to: Install Azure PowerShell][powershell-open].
2. Run the following command:

		Add-AzureAccount

3. In the window, type the email address and password associated with your account. Azure authenticates and saves the credential information, and then closes the window. The connection will expired in several hours. 

The other method to connect to  your subscription is using the certificate method. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].

>[WACOM.NOTE] To go back to the certificate method after using the Azure AD method with the Add-AzureAccount cmdlet, run the Remove-AzureAccount cmdlet.
	
##<a name="provision"></a>Provision an HDInsight cluster

HDInsight uses Azure Blob Storage for storing data. It is called *WASB* or *Azure Storage - Blob*. WASB is Microsoft's implementation of HDFS on Azure Blob storage. For more information see [Use Azure Blob storage with HDInsight][hdinsight-storage].

When provision an HDInsight cluster, an Azure Storage account and a specific Blob storage container from that account is designated as the default file system, just like in HDFS. The storage account must be located in the same data center as the HDInsight compute resources. Currently, you can only provision HDInsight clusters in the following data centers:

- Southeast Asia
- North Europe
- West Europe
- East US
- West US

In addition to this storage account, you can add additional storage accounts from either the same Azure subscription or different Azure subscriptions. For instructions on adding additional storage accounts, see [Provision HDInsight clusters][hdinsight-provision]. 

To simply this tutorial, only the default storage account is used, and all of the files are stored in the default file system container, located at */tutorials/getstarted/*.

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
	<tr><td>Password (cluster admin)</td><td>The password for the account <i>admin</i>. The cluster user name is specified to be "admin" by default when using the Quick Create option. This can only be changed by using the <strong>Custom Create</strong> wizard. The password field must be at least 10 characters and must contain an uppercase letter, a lowercase letter, a number, and a special character.</td></tr>
	<tr><td>Storage Account</td><td>Select the storage account you created from the dropdown box. <br/>

	Once a storage account is chosen, it cannot be changed. If the storage account is removed, the cluster will no longer be available for use.

	The HDInsight cluster location will be the same as the storage account.
	</td></tr>
	</table>

	Keep a copy of the cluster name.  You will need it later in the tutorial.

	>[WACOM.NOTE] The quick create method creates a HDInsight version 2.1 cluster. To create version 1.6 or 3.0 clusters, use the custom create method from the management portal, or use Azure PowerShell.

5. Click **Create HDInsight Cluster** on the lower right. When the provision process completes, the  status column will show **Running**.

For information on using the **CUSTOM CREATE** option, see [Provision HDInsight Clusters][hdinsight-provision].













##<a name="sample"></a>Run a WordCount MapReduce job

Now you have an HDInsight cluster provisioned. The next step is to run a MapReduce job to count word occurrences in a text file. 

Running a MapReduce job requires the following elements:

* A MapReduce program. In this tutorial, you will use the WordCount sample that comes with  HDInsight clusters so you don't need to write your own. It is located on */example/jars/hadoop-examples.jar*. For instructions on writing your own MapReduce job, see [Develop Java MapReduce programs for HDInsight][hdinsight-develop-MapReduce] and [Develop C# Hadoop streaming programs for HDInsight][hdinsight-develop-streaming].

	>[WACOM.NOTE] On the HDInsight version 3.0 clusters, the jar file name is */example/jars/hadoop-mapreduce-examples.jar*.

* An input file folder. In this tutorial, you will specify one file, */example/data/gutenberg/davinci.txt*. For information on upload our own data files, see [Upload Data to HDInsight][hdinsight-upload-data].
* An output file folder. You will use */tutorials/getstarted/WordCountOutput* as the output file folder. This folder can't be an existing folder. Otherwise you will get an exception.

The URI scheme for accessing files in Blob storage is:

	wasb[s]://<containername>@<storageaccountname>.blob.core.windows.net/<path>

> [WACOM.NOTE] By default, the provision process creates the default Blob container with the same name as the HDInsight cluster name. If a container with the same name already exists, the provision process will name the default container as <ClusterName>-x, x is a sequence number, for example, mycluster-1. 

The URI scheme provides both unencrypted access with the *wasb:* prefix, and SSL encrypted access with WASBS. It is recommended using wasbs wherever possible, even when accessing data that lives inside the same Azure data center.

Because HDInsight uses a Blob Storage container as the default file system, you can refer to files and directories inside the default file system using relative or absolute paths.

For example, to access the hadoop-examples.jar, you can use one of the following options:

	● wasb://<containername>@<storageaccountname>.blob.core.windows.net/example/jars/hadoop-examples.jar
	● wasb:///example/jars/hadoop-examples.jar
	● /example/jars/hadoop-examples.jar
				
For more information, see [Use Azure Blob Storage with HDInsight][hdinsight-storage].





















**To run the WordCount sample**

1. Open **Azure PowerShell** or **PowerShell ISE**. For instructions of opening Azure PowerShell console window, see [Install and configure Azure PowerShell][powershell-install-configure].

2. If you haven't connected to your Azure subscription, run the following command:

		Add-AzureAccount
 
	For more information, see [Set up local environment for running PowerShell](#setup) in this article.

3. If you have multiple Azure subscriptions, you can use the following command to select the current subscription used in this PowerShell session:

		$subscriptionName = "<SubscriptionName>" 
		Select-AzureSubscription $subscriptionName

	To get the subscription name, sign in to the [management portal](https://manage.windows.azure.com). Click **SETTINGS** from the left pane.

3. Set the first variable in the following script, and run the script:  
		
		$clusterName = "<HDInsightClusterName>"

		$jarFile = "wasb:///example/jars/hadoop-examples.jar"
		$className = "wordcount"
		$statusFolder = "/tutorials/getstarted/wordCountStatus"
		$inputFolder = "wasb:///example/data/gutenberg/davinci.txt"
		$outputFolder = "wasb:///tutorials/getstarted/WordCountOutput"



	|Variable|Note|
    |--------|----|
	|$clusterName|The cluster name must match the one you created earlier in the tutorial using the Azure Managment portal.|
    |$jarFile|This is the MapReduce jar file that you will run.  It comes with HDInsight clusters.|
	|$className|The class name is hard-coded in the MapReduce program.|
	|$statusFolder|The -StatusFolder parameter is optional. If specified, the standard error and standard output files will be put into the folder. There is a bug with -StatusFolder. You will get an exception with the Get-AzureHDInsightJobOuput cmdlet if you prefix the folder path with "wasb://".|
    |$inputFolder|This is the source data file folder for the MapReduce job. The word counting MapReduce job will be counting the words in the files located in this folder.  You can either specify a folder name or a file name.|
	|$outputFolder|The MapReduce job will generate an output file in this folder.  The output file has a list of the words and their count. The default output file name is part-r-00000.|
		
5. Run the following commands to create a MapReduce job definition:

		# Define the MapReduce job
		$wordCountJobDefinition = New-AzureHDInsightMapReduceJobDefinition -JarFile "wasb:///example/jars/hadoop-examples.jar" -ClassName "wordcount" -StatusFolder $statusFolder -Arguments "wasb:///example/data/gutenberg/davinci.txt", "wasb:///tutorials/getstarted/WordCountOutput"

	The job definition uses the variables you defined in the last step.

6. Run the following command to submit the MapReduce job:

		# Submit the job
		$wordCountJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $wordCountJobDefinition 
		
	In addition to the MapReduce job definition, you must also provide the HDInsight cluster name where you want to run the MapReduce job. 

	The *Start-AzureHDInsightJob* is an asynchroized call.  To check the completion of the job, use the *Wait-AzureHDInsightJob* cmdlet.

6. Run the following command to check the completion of the MapReduce job:

		Wait-AzureHDInsightJob -Job $wordCountJob -WaitTimeoutInSeconds 3600 
		
8. Run the following command to check any errors with running the MapReduce job:	
	
		# Get the job output
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $wordCountJob.JobId -StandardError
		
	The following screenshot shows the output of a successful run. Otherwise, you will see some error messages.

	![HDI.GettingStarted.RunMRJob][image-hdi-gettingstarted-runmrjob]

	Using the *-StandardOuput* switch with the cmdlet, you can also get the standard output log.






























**To retrieve the results of the MapReduce job**

1. Open **Azure PowerShell**.
2. Run the following commands to create a C:\Tutorials folder, and change directory to the folder:

		mkdir \Tutorials
		cd \Tutorials
	
	The default Azure Powershell directory is *C:\Windows\System32\WindowsPowerShell\v1.0*. By default, you don't have the write permission on this folder. Later in the script,  you will download a copy of the output file to the current directory. You must change directory to a folder where you have write permission.
	
2. Set the three variables in the following commands, and then run them:

		$storageAccountName = "<StorageAccountName>"   
		$containerName = "<ContainerName>"		

		$blobName = "tutorials/getstarted/WordCountOutput/part-r-00000"   

	The Azure Storage account is the one you created earlier in the tutorial. The storage account is used to host the Blob container that is used as the default HDInsight cluster file system.  The Blob storage container name usually share the same name as the HDInsight cluster unless you specify a different name when you provision the cluster.

3. Run the following commands to create an Azure storage context object:
		
		# Create the storage account context object
		$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
		$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  

	The *Select-AzureSubscription* is used to set the current subscription in case you have multiple subscriptions, and the default subscription is not the one to use. 

4. Run the following command to download the MapReduce job output from the Blob container to the workstation:

		# Download the job output to the workstation
		Get-AzureStorageBlobContent -Container $ContainerName -Blob $blobName -Context $storageContext -Force

	The *example/data/WordCountOutput* folder is the output folder specified when you run the MapReduce job. *part-r-00000* is the default file name for MapReduce job output.  The file will be download to the same folder structure on the local folder. For example, in the following screenshot, the current folder is the C root folder. The file will be downloaded to the *C:\example\data\WordCountOutput&#92;* folder.

5. Run the following command to print the MapReduce job output file:

		cat ./example/data/WordCountOutput/part-r-00000 | findstr "there"

	![HDI.GettingStarted.MRJobOutput][image-hdi-gettingstarted-mrjoboutput]

	The MapReduce job produces a file named *part-r-00000* with the words and the counts.  The script uses the findstr command to list all of the words that contains *"there"*.


> [WACOM.NOTE] If you open <i>./example/data/WordCountOutput/part-r-00000</i>, a multi-line output from a MapReduce job, in Notepad, you will notice the line breaks are not renter correctly. This is expected.

The output folder can't be an existing folder. Otherwise MapReduce job will fail.  If you want to run the MapReduce job again, you must delete the output folder and the output file.  Here is a PowerShell script for doing the job:

		# set the variables
		$storageAccountName = "<StorageAccountName>"   
		$containerName = "<ContainerName>"		

		$blobName = "tutorials/getstarted/WordCountOutput/part-r-00000" 
		$blobFolderName = "tutorials/getstarted/WordCountOutput" 
		
		# Create the storage account context object
		$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
		$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey  
		
		# Download the output to local computer
		Remove-AzureStorageBlob -Container $ContainerName -Blob $blobName -Context $storageContext -Force
		Remove-AzureStorageBlob -Container $ContainerName -Blob $blobFolderName -Context $storageContext -Force
	
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

6. Locate **part-r-00000** in the **Name** column (the path is *.../example/data/WordCountOutput*), and then click **Binary** on the left of **part-r-00000**.

	![HDI.GettingStarted.PowerQuery.ImportData2][image-hdi-gettingstarted-powerquery-importdata2]

8. Right-click **Column1.1**, and then select **Rename**.
9. Change the name to **Word**.
10. Repeat the process to rename **Column1.2** to **Count**.

	![HDI.GettingStarted.PowerQuery.ImportData3][image-hdi-gettingstarted-powerquery-importdata3]

9. Click **Apply & Close** in the upper left corner. The query then imports the word counting MapReduce job output into Excel.


##<a name="nextsteps"></a>Next steps
In this tutorial, you have learned how to provision a cluster with HDInsight, run a MapReduce job on it, and import the results into Excel where they can be further processed and graphically displayed using BI tools. To learn more, see the following articles:

- [Get started using Hadoop 2.2 clusters with HDInsight][hdinsight-get-started-30]
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

[hdinsight-version]: ../hdinsight-component-versioning/

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

[azure-purchase-options]: https://www.windowsazure.com/en-us/pricing/purchase-options/
[azure-member-offers]: https://www.windowsazure.com/en-us/pricing/member-offers/
[azure-free-trial]: https://www.windowsazure.com/en-us/pricing/free-trial/
[azure-management-portal]: https://manage.windowsazure.com/
[azure-create-storageaccount]: ../storage-create-storage-account/ 

[apache-hadoop]: http://hadoop.apache.org/

[powershell-download]: http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409
[powershell-install-configure]: ../install-configure-powershell/
[powershell-open]: ../install-configure-powershell/#Install

[image-hdi-storageaccount-quickcreate]: ./media/hdinsight-get-started/HDI.StorageAccount.QuickCreate.png
[image-hdi-clusterstatus]: ./media/hdinsight-get-started/HDI.ClusterStatus.png
[image-hdi-quickcreatecluster]: ./media/hdinsight-get-started/HDI.QuickCreateCluster.png
[image-hdi-wordcountdiagram]: ./media/hdinsight-get-started/HDI.WordCountDiagram.gif
[image-hdi-gettingstarted-mrjoboutput]: ./media/hdinsight-get-started/HDI.GettingStarted.MRJobOutput.png
[image-hdi-gettingstarted-runmrjob]: ./media/hdinsight-get-started/HDI.GettingStarted.RunMRJob.png
[image-hdi-gettingstarted-powerquery-importdata]: ./media/hdinsight-get-started/HDI.GettingStarted.PowerQuery.ImportData.png
[image-hdi-gettingstarted-powerquery-importdata2]: ./media/hdinsight-get-started/HDI.GettingStarted.PowerQuery.ImportData2.png
[image-hdi-gettingstarted-powerquery-importdata3]: ./media/hdinsight-get-started/HDI.GettingStarted.PowerQuery.ImportData3.png
