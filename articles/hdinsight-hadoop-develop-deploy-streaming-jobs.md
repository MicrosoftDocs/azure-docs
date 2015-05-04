<properties 
	pageTitle="Develop C# Hadoop streaming programs for HDInsight | Azure" 
	description="Learn how to develop Hadoop streaming MapReduce programs in C#, and how to deploy them to Azure HDInsight." 
	services="hdinsight" 
	documentationCenter="" 
	authors="mumian" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/31/2015" 
	ms.author="jgao"/>



# Develop C# Hadoop streaming programs for HDInsight

Hadoop provides a streaming API for MapReduce that enables you to write map and reduce functions in languages other than Java. This tutorial walks you through creating a C# word-count program, which counts the occurrences of a given word in the input data you provide. The following illustration shows how the MapReduce framework does a word count:

![HDI.WordCountDiagram][image-hdi-wordcountdiagram]

> [AZURE.NOTE] The steps in this article apply only to Windows-based Azure HDInsight clusters. For an example of streaming for Linux-based HDInsight, see [Develop Python streaming programs for HDInsight](hdinsight-hadoop-streaming-python.md).

This tutorial shows you how to:

- Develop and test a Hadoop streaming MapReduce program by using C# on the HDInsight Emulator for Azure
- Run the same MapReduce job on Azure HDInsight 
- Retrieve the results of the MapReduce job

##<a name="prerequisites"></a>Prerequisites

Before you begin this tutorial, you must have done the following:

- Install the HDInsight Emulator. For instructions, see [Get started using HDInsight Emulator][hdinsight-get-started-emulator].
- Install Azure PowerShell on the emulator computer. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].
- Obtain an Azure subscription. For instructions, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].


##<a name="develop"></a>Develop a word-count Hadoop streaming program in C&#35;

The word-count solution contains two console application projects: mapper and reducer. The mapper application streams each word into the console, and the reducer application counts the number of words that are streamed from a document. Both the mapper and the reducer read characters, line by line, from the standard input stream (stdin) and write to the standard output stream (stdout).

**To create a C# console application**

1. Open Visual Studio 2013.
2. Click **FILE**, click **New**, and then click **Project**.
3. Type or select the following values:

	<table border="1">
	<tr><td>Field</td><td>Value</td></tr>
	<tr><td>Template</td><td>Visual C#/Windows/Console Application</td></tr>
	<tr><td>Name</td><td>WordCountMapper</td></tr>
	<tr><td>Location</td><td>C:\Tutorials</td></tr>
	<tr><td>Solution name</td><td>WordCount</td></tr>
	</table>
	
4. Click **OK** to create the project.

**To create the mapper program**

5. In Solution Explorer, right-click **Program.cs**, and then click **Rename**.
6. Rename the file to **WordCountMapper.cs**, and then press **ENTER**.
7. Click **Yes** to confirm renaming all references.
8. Double-click **WordCountMapper.cs** to open it.
9. Add the following **using** statement:

		using System.IO;

10. Replace the **Main()** function with the following:

		static void Main(string[] args)
		{
		    if (args.Length > 0)
		    {
		        Console.SetIn(new StreamReader(args[0]));
		    }
		
		    string line;
		    string[] words;
		
		    while ((line = Console.ReadLine()) != null)
		    {
		        words = line.Split(' ');
		
		        foreach (string word in words)
		            Console.WriteLine(word.ToLower());
		    }
		}

11. Click **BUILD**, and then click **Build Solution** to compile the mapper program.	


**To create the reducer program**

1. From Visual Studio 2013, click **FILE**, click **Add**, and then click **New Project**.
2. Type or select the following values:

	<table border="1">
	<tr><td>Field</td><td>Value</td></tr>
	<tr><td>Template</td><td>Visual C#/Windows/Console Application</td></tr>
	<tr><td>Name</td><td>WordCountReducer</td></tr>
	<tr><td>Location</td><td>C:\Tutorials\WordCount</td></tr>
	</table>
3. Clear the check box to **Create directory for solution**, and then click **OK** to create the project.
4. From Solution Explorer, right-click **Program.cs**, and then click **Rename**.
5. Rename the file to **WordCountReducer.cs**, and then press **ENTER**.
7. Click **Yes** to confirm renaming all references.
8. Double-click **WordCountReducer.cs** to open it.
9. Add the following **using** statement:

		using System.IO;

10. Replace the **Main()** function with the following:

		static void Main(string[] args)
		{
		    string word, lastWord = null;
		    int count = 0;
		
		    if (args.Length > 0)
		    {
		        Console.SetIn(new StreamReader(args[0]));
		    }
		
		    while ((word = Console.ReadLine()) != null)
		    {
		        if (word != lastWord)
		        {
		            if(lastWord != null)
		                Console.WriteLine("{0}[{1}]", lastWord, count);
		
		            count = 1;
		            lastWord = word;
		        }
		        else
		        {
		            count += 1; 
		        }
		    }
		    Console.WriteLine(count);
		}

11. Click **BUILD**, and then click **Build Solution** to compile the reducer program.	

The mapper and reducer executables are located at:

- C:\Tutorials\WordCount\WordCountMapper\bin\Debug\WordCountMapper.exe
- C:\Tutorials\WordCount\WordCountReducer\bin\Debug\WordCountReducer.exe


##<a name="test"></a>Test the program on the emulator

Do the following to test the program on the HDInsight Emulator:

1. Upload data to the emulator's file system
2. Upload the mapper and reducer applications to the emulator's file system
3. Submit a word-count MapReduce job
4. Check the job status
5. Retrieve the job results

By default, HDInsight emulator uses Hadoop Distributed File System (HDFS) as the file system. Optionally, you can configure the HDInsight Emulator to use Azure Blob storage. For details, see [Get started with HDInsight Emulator][hdinsight-emulator-wasb]. In this section, you will use the HDFS **copyFromLocal** command to upload the files. The next section shows you how to upload files by using Azure PowerShell. For other methods, see [Upload data to HDInsight][hdinsight-upload-data].

This tutorial uses the following folder structure:

<table border="1">
<tr><td>Folder</td><td>Note</td></tr>
<tr><td>\WordCount</td><td>The root folder for the word-count project. </td></tr>
<tr><td>\WordCount\Apps</td><td>The folder for the mapper and reducer executables.</td></tr>
<tr><td>\WordCount\Input</td><td>The MapReduce source file folder.</td></tr>
<tr><td>\WordCount\Output</td><td>The MapReduce output file folder.</td></tr>
<tr><td>\WordCount\MRStatusOutput</td><td>The job output folder.</td></tr>
</table></br>

This tutorial uses the .txt files located in the %hadoop_home% directory.

> [AZURE.NOTE] The Hadoop HDFS commands are case sensitive.

**To copy the text files to the emulator's file system**

1. From the Hadoop command-line window, run the following command to make a directory for the input files:

		hadoop fs -mkdir /WordCount/
		hadoop fs -mkdir /WordCount/Input

	The path used here is the relative path. It is equivalent to the following:

		hadoop fs -mkdir hdfs://localhost:8020/WordCount/Input

2. Run the following command to copy some text files to the input folder on HDFS:

		hadoop fs -copyFromLocal %hadoop_home%\share\doc\hadoop\common\*.txt \WordCount\Input

3. Run the following command to list the uploaded files:

		hadoop fs -ls \WordCount\Input

	


**To deploy the mapper and the reducer to the emulator's file system**

1. Open a Hadoop command line from your desktop and create the /Apps folder in HDFS:

		hadoop fs -mkdir /WordCount/Apps

2. Run the following commands:

		hadoop fs -copyFromLocal C:\Tutorials\WordCount\WordCountMapper\bin\Debug\WordCountMapper.exe /WordCount/Apps/WordCountMapper.exe
		hadoop fs -copyFromLocal C:\Tutorials\WordCount\WordCountReducer\bin\Debug\WordCountReducer.exe /WordCount/Apps/WordCountReducer.exe

3. Run the following command to list the uploaded files:

		hadoop fs -ls /WordCount/Apps

	You shall see the two .exe files.


**To run the MapReduce job by using Azure PowerShell**

1. Open Azure PowerShell. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure]. 
3. Run the following commands to set variables:

		$clusterName = "http://localhost:50111"
		
		$mrMapper = "WordCountMapper.exe"
		$mrReducer = "WordCountReducer.exe"
		$mrMapperFile = "/WordCount/Apps/WordCountMapper.exe"
		$mrReducerFile = "/WordCount/Apps/WordCountReducer.exe"
		$mrInput = "/WordCount/Input/"
		$mrOutput = "/WordCount/Output"
		$mrStatusOutput = "/WordCount/MRStatusOutput"

	The HDInsight emulator cluster name is "http://localhost:50111".  

4. Run the following commands to define the streaming job:

		$mrJobDef = New-AzureHDInsightStreamingMapReduceJobDefinition -JobName mrWordCountStreamingJob -StatusFolder $mrStatusOutput -Mapper $mrMapper -Reducer $mrReducer -InputPath $mrInput -OutputPath $mrOutput
		$mrJobDef.Files.Add($mrMapperFile)
		$mrJobDef.Files.Add($mrReducerFile)

5. Run the following command to create a credential object:

		$creds = Get-Credential -Message "Enter password" -UserName "hadoop"

	You will get a prompt to enter the password. The password can be any string. The user name must be "hadoop".

6. Run the following commands to submit the MapReduce job and wait for the job to finish:
		
		$mrJob = Start-AzureHDInsightJob -Cluster $clusterName -Credential $creds -JobDefinition $mrJobDef
		Wait-AzureHDInsightJob -Credential $creds -job $mrJob -WaitTimeoutInSeconds 3600

	When the job finishes, you will get an output similar to the following:

		StatusDirectory : /WordCount/MRStatusOutput
		ExitCode        : 
		Name            : mrWordCountStreamingJob
		Query           : 
		State           : Completed
		SubmissionTime  : 11/15/2013 7:18:16 PM
		Cluster         : http://localhost:50111
		PercentComplete : map 100%  reduce 100%
		JobId           : job_201311132317_0034
		
	You can see the job ID in the output, for example, *job-201311132317-0034*. 

**To check the job status**

1. From the desktop, click **Hadoop YARN Status**, or browse to **http://localhost:50030/jobtracker.jsp**.
2. Find the job by using the job ID under either the **RUNNING** or **FINISHED** category. 
3. If a job failed, you can find it under the **FAILED** category. You can also open the job details and find some helpful information for debugging.


**To display the output from HDFS**

1. Open the Hadoop command line.
2. Run the following commands to display the output:

		hadoop fs -ls /WordCount/Output/
		hadoop fs -cat /WordCount/Output/part-00000

	You can append "|more" at the end of the command to get the page view.

##<a id="upload"></a>Upload data to Azure Blob storage
Azure HDInsight uses Azure Blob storage as the default file system. You can configure an HDInsight cluster to use additional Blob storage for the data files. In this section, you will create an Azure Storage account and upload the data files to the Blob storage. The data files are the .txt files in the %hadoop_home%\share\doc\hadoop\common directory.


**To create a Storage account and a container**

1. Open Azure PowerShell.
2. Set the variables, and then run the commands:

		$subscriptionName = "<AzureSubscriptionName>"
		$storageAccountName = "<AzureStorageAccountName>"  
		$containerName = "<ContainerName>"
		$location = "<MicrosoftDataCenter>"  # For example, "East US"

3. Run the following commands to create a Storage account and a Blob storage container on the account:

		# Select an Azure subscription
		Select-AzureSubscription $subscriptionName
		
		# Create a Storage account
		New-AzureStorageAccount -StorageAccountName $storageAccountName -location $location
				
		# Create a Blob storage container
		$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
		$destContext = New-AzureStorageContext –StorageAccountName $storageAccountName –StorageAccountKey $storageAccountKey  
		New-AzureStorageContainer -Name $containerName -Context $destContext

4. Run the following commands to verify the Storage account and the container:

		Get-AzureStorageAccount -StorageAccountName $storageAccountName
		Get-AzureStorageContainer -Context $destContext

**To upload the data files**

1. In the Azure PowerShell window, set the values for the local and destination folders:

		$localFolder = "C:\hdp\hadoop-2.4.0.2.1.3.0-1981\share\doc\hadoop\common"
		$destFolder = "WordCount/Input"

	Notice the local source file folder is **C:\hdp\hadoop-2.4.0.2.1.3.0-1981\share\doc\hadoop\common**, and the destination folder is **WordCount/Input**. The source location is the location of the .txt files on the HDInsight Emulator. The destination is the folder structure that will be reflected under the Azure Blob container.

3. Run the following commands to get a list of the .txt files in the source file folder:

		# Get a list of the .txt files
		$filesAll = Get-ChildItem $localFolder
		$filesTxt = $filesAll | where {$_.Extension -eq ".txt"}
		
5. Run the following snippet to copy the files:

		# Copy the files from the local workstation to the Blob container        
		foreach ($file in $filesTxt){
		 
		    $fileName = "$localFolder\$file"
		    $blobName = "$destFolder/$file"
		
		    write-host "Copying $fileName to $blobName"
		
		    Set-AzureStorageBlobContent -File $fileName -Container $containerName -Blob $blobName -Context $destContext
		}

6. Run the following command to list the uploaded files:

		# List the uploaded files in the Blob storage container
		Get-AzureStorageBlob -Container $containerName  -Context $destContext -Prefix $destFolder


**To upload the word-count applications**

1. In the Azure PowerShell window, set the following variables:

		$mapperFile = "C:\Tutorials\WordCount\WordCountMapper\bin\Debug\WordCountMapper.exe"
		$reducerFile = "C:\Tutorials\WordCount\WordCountReducer\bin\Debug\WordCountReducer.exe"
		$blobFolder = "WordCount/Apps"

	Notice the destination folder is **WordCount/Apps**, which is the structure that will be reflected in the Azure Blob container.

2. Run the following commands to copy the applications:

		Set-AzureStorageBlobContent -File $mapperFile -Container $containerName -Blob "$blobFolder/WordCountMapper.exe" -Context $destContext
		Set-AzureStorageBlobContent -File $reducerFile -Container $containerName -Blob "$blobFolder/WordCountReducer.exe" -Context $destContext

3. Run the following command to list the uploaded files:

		# List the uploaded files in the Blob storage container
		Get-AzureStorageBlob -Container $containerName  -Context $destContext -Prefix $blobFolder

	You shall see both application files listed there.


##<a name="run"></a>Run the MapReduce job on Azure HDInsight

This section provides an Azure PowerShell script that performs all the tasks related to running a MapReduce job. The list of tasks includes:

1. Provision an HDInsight cluster
	
	1. Create a Storage account that will be used as the default HDInsight cluster file system
	2. Create a Blob storage container 
	3. Create an HDInsight cluster

2. Submit the MapReduce job

	1. Create a streaming MapReduce job definition
	2. Submit a MapReduce job
	3. Wait for the job to finish
	4. Display standard error
	5. Display standard output

3. Delete the cluster

	1. Delete the HDInsight cluster
	2. Delete the Storage account used as the default HDInsight cluster file system


**To run the Azure PowerShell script**

1. Open Notepad.
2. Copy and paste the following code:
		
		# ====== STORAGE ACCOUNT AND HDINSIGHT CLUSTER VARIABLES ======
		$subscriptionName = "<AzureSubscriptionName>"
		$stringPrefix = "<StringForPrefix>"     ### Prefix to cluster, Storage account, and container names
		$storageAccountName_Data = "<TheDataStorageAccountName>"
		$containerName_Data = "<TheDataBlobStorageContainerName>"
		$location = "<MicrosoftDataCenter>"     ### Must match the data storage account location
		$clusterNodes = 1
		
		$clusterName = $stringPrefix + "hdicluster"
		
		$storageAccountName_Default = $stringPrefix + "hdistore"
		$containerName_Default =  $stringPrefix + "hdicluster"

		# ====== THE STREAMING MAPREDUCE JOB VARIABLES ======
		$mrMapper = "WordCountMapper.exe"
		$mrReducer = "WordCountReducer.exe"
		$mrMapperFile = "wasb://$containerName_Data@$storageAccountName_Data.blob.core.windows.net/WordCount/Apps/WordCountMapper.exe"
		$mrReducerFile = "wasb://$containerName_Data@$storageAccountName_Data.blob.core.windows.net/WordCount/Apps/WordCountReducer.exe"
		$mrInput = "wasb://$containerName_Data@$storageAccountName_Data.blob.core.windows.net/WordCount/Input/"
		$mrOutput = "wasb://$containerName_Data@$storageAccountName_Data.blob.core.windows.net/WordCount/Output/"
		$mrStatusOutput = "wasb://$containerName_Data@$storageAccountName_Data.blob.core.windows.net/WordCount/MRStatusOutput/"
		
		Select-AzureSubscription $subscriptionName
		
		#====== CREATE A STORAGE ACCOUNT ======
		Write-Host "Create a storage account" -ForegroundColor Green
		New-AzureStorageAccount -StorageAccountName $storageAccountName_Default -location $location
		
		#====== CREATE A BLOB STORAGE CONTAINER ======
		Write-Host "Create a Blob storage container" -ForegroundColor Green
		$storageAccountKey_Default = Get-AzureStorageKey $storageAccountName_Default | %{ $_.Primary }
		$destContext = New-AzureStorageContext –StorageAccountName $storageAccountName_Default –StorageAccountKey $storageAccountKey_Default
		
		New-AzureStorageContainer -Name $containerName_Default -Context $destContext
		
		#====== CREATE AN HDINSIGHT CLUSTER ======
		Write-Host "Create an HDInsight cluster" -ForegroundColor Green
		$storageAccountKey_Data = Get-AzureStorageKey $storageAccountName_Data | %{ $_.Primary }
		
		$config = New-AzureHDInsightClusterConfig -ClusterSizeInNodes $clusterNodes |
		    Set-AzureHDInsightDefaultStorage -StorageAccountName "$storageAccountName_Default.blob.core.windows.net" -StorageAccountKey $storageAccountKey_Default -StorageContainerName $containerName_Default |
		    Add-AzureHDInsightStorage -StorageAccountName "$storageAccountName_Data.blob.core.windows.net" -StorageAccountKey $storageAccountKey_Data
		
		Select-AzureSubscription $subscriptionName
		New-AzureHDInsightCluster -Name $clusterName -Location $location -Config $config
		
		#====== CREATE A STREAMING MAPREDUCE JOB DEFINITION ======
		Write-Host "Create a streaming MapReduce job definition" -ForegroundColor Green
		
		$mrJobDef = New-AzureHDInsightStreamingMapReduceJobDefinition -JobName mrWordCountStreamingJob -StatusFolder $mrStatusOutput -Mapper $mrMapper -Reducer $mrReducer -InputPath $mrInput -OutputPath $mrOutput
		$mrJobDef.Files.Add($mrMapperFile)
		$mrJobDef.Files.Add($mrReducerFile)
		
		#====== RUN A STREAMING MAPREDUCE JOB ======
		Write-Host "Run a streaming MapReduce job" -ForegroundColor Green
		Select-AzureSubscription $subscriptionName
		$mrJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $mrJobDef 
		Wait-AzureHDInsightJob -Job $mrJob -WaitTimeoutInSeconds 3600 
		
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $mrJob.JobId -StandardError 
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $mrJob.JobId -StandardOutput
		
		#====== DELETE THE HDINSIGHT CLUSTER ======
		Write-Host "Delete the HDInsight cluster" -ForegroundColor Green
		Select-AzureSubscription $subscriptionName
		Remove-AzureHDInsightCluster -Name $clusterName 
		
		#====== DELETE THE STORAGE ACCOUNT ======
		Write-Host "Delete the storage account" -ForegroundColor Green
		Remove-AzureStorageAccount -StorageAccountName $storageAccountName_Default

3. Set the first four variables in the script. The **$stringPrefix** variable is used to prefix the specified string to the HDInsight cluster name, the Storage account name, and the Blob storage container name. Because the names for these must be 3 to 24 characters, make sure the string you specify and the names this script uses, together, do not exceed the character limit for the name. You must use all lowercase for **$stringPrefix**.

	The **$storageAccountName_Data** and **$containerName_Data** variables are the Storage account and container that you already created in the previous steps. So, you must provide the names for those. These are used for storing the data files and the applications. The **$location** variable must match the data storage account location.

4. Review the rest of the variables.
5. Save the script file.
6. Open Azure PowerShell.
7. Run the following command to set the execution policy to RemoteSigned:

		PowerShell -File <FileName> -ExecutionPolicy RemoteSigned

8. When prompted, enter the user name and password for the HDInsight cluster. Make sure the password is at least 10 characters and contains one uppercase letter, one lowercase letter, a number, and a special character. If you don't want to get prompted for the credentials, see [Working with Passwords, Secure Strings and Credentials in Windows PowerShell][powershell-PSCredential].

For an HDInsight .NET SDK sample on submitting Hadoop streaming jobs, see [Submit Hadoop jobs programmatically][hdinsight-submit-jobs].


##<a name="retrieve"></a>Retrieve the MapReduce job output
This section shows you how to download and display the output. For information on displaying the results in Excel, see [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver][hdinsight-ODBC] and [Connect Excel to HDInsight with Power Query][hdinsight-power-query].


**To retrieve the output**

1. Open the Azure PowerShell window.
2. Set the values, and then run the commands:

		$subscriptionName = "<AzureSubscriptionName>"
		$storageAccountName = "<TheDataStorageAccountName>"
		$containerName = "<TheDataBlobStorageContainerName>"
		$blobName = "WordCount/Output/part-00000"
	
3. Run the following commands to create an Azure Storage context object: 
		
		Select-AzureSubscription $subscriptionName
		$storageAccountKey = Get-AzureStorageKey $storageAccountName | %{ $_.Primary }
		$storageContext = New-AzureStorageContext –StorageAccountName $storageAccountName –StorageAccountKey $storageAccountKey  

4. Run the following commands to download and display the output:

		Get-AzureStorageBlobContent -Container $ContainerName -Blob $blobName -Context $storageContext -Force
		cat "./$blobName" | findstr "there"

	

##<a id="nextsteps"></a>Next steps
In this tutorial, you have learned how to develop a Hadoop streaming MapReduce job, how to test the application on the HDInsight Emulator, and how to write an Azure PowerShell script to provision an HDInsight cluster and run a MapReduce job on the cluster. To learn more, see the following articles:

- [Get started with Azure HDInsight](hdinsight-get-started.md)
- [Get started with the HDInsight Emulator][hdinsight-get-started-emulator]
- [Develop Java MapReduce programs for HDInsight][hdinsight-develop-mapreduce]
- [Use Azure Blob storage with HDInsight][hdinsight-storage]
- [Administer HDInsight using Azure PowerShell][hdinsight-admin-powershell]
- [Upload data to HDInsight][hdinsight-upload-data]
- [Use Hive with HDInsight][hdinsight-use-hive]
- [Use Pig with HDInsight][hdinsight-use-pig]

[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[hdinsight-develop-mapreduce]: hdinsight-develop-deploy-java-mapreduce.md
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md

[hdinsight-get-started-emulator]: hdinsight-get-started-emulator.md
[hdinsight-emulator-wasb]: hdinsight-get-started-emulator.md#blobstorage
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-storage]: hdinsight-use-blob-storage.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md

[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-ODBC]: hdinsight-connect-excel-hive-ODBC-driver.md
[hdinsight-power-query]: hdinsight-connect-excel-power-query.md

[powershell-PSCredential]: http://social.technet.microsoft.com/wiki/contents/articles/4546.working-with-passwords-secure-strings-and-credentials-in-windows-powershell.aspx
[Powershell-install-configure]: powershell-install-configure.md

[image-hdi-wordcountdiagram]: ./media/hdinsight-hadoop-develop-deploy-streaming-jobs/HDI.WordCountDiagram.gif "MapReduce wordcount application flow"






