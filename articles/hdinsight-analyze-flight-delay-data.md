<properties urlDisplayName="Analyze flight delay data with Hadoop in HDInsight" pageTitle="Analyze flight delay data using Hadoop in HDInsight | Azure" metaKeywords="" description="Learn how to  use one PowerShell script to provision HDInsight cluster, run Hive job, run Sqool job, and delete the cluster." metaCanonical="" services="hdinsight" documentationCenter="" title="Analyze flight delay data using Hadoop in HDInsight " authors="jgao" solutions="" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/05/2014" ms.author="jgao" />

#Analyze flight delay data using Hadoop in HDInsight

Hive provides means of running Hadoop MapReduce jobs through an SQL-like scripting language, called *[HiveQL][hadoop-hiveql]*, which can be applied towards summarizing, querying, and analyzing large volumes of data. 

One of the major benefits of HDInsight is the separation of data storage and compute. HDInsight use Azure Blob storage for data storage. A common MapReduce process can be broken into 3 parts:

1. **Store data in Azure blob storage.**  This can be a continuous process. For example, weather data, sensor data, web logs, and in this case, flight delays data are saved into blob storage.
2. **Run jobs.**  When it is time to process the data, you run a PowerShell script (or a client application) to provision an HDInsight cluster, run jobs, and delete the cluster.  The jobs save output data to Azure Blob storage. The output data retains even after the  the cluster is deleted. This way, you only pay for what you have consumed. 
3. **Retrieve the output from blob storage**, or in this tutorial, export the data to an Azure SQL database.

The following diagram illustrate the scenario and the structure of this article:

![HDI.FlightDelays.flow][img-hdi-flightdelays-flow]

**Note**: The numbers in the diagram correspond to the section titles.

The main portion of the tutorial shows you how to use one PowerShell script to perform the following:

- Provision an HDInsight cluster.
- Run an Hive job on the cluster to calculate average delays at airports.  The flight delay data is stored in an Azure blob storage account 
- Run a Sqoop job to export the Hive job output to an Azure SQL database.
- Delete the HDInsight cluster. 

In the appendixes, you can find the instructions for uploading flight delay data, creating/uploading Hive query string, and preparing Azure SQL database for the Sqoop job.

##In this tutorial

* [Prerequisites](#prerequisite)
* [Provision HDInsight cluster and run Hive/Sqoop jobs (M1)](#runjob)
* [Appendix A: Upload flight delay data to Azure Blob storage (A1)](#appendix-a)
* [Appendix B: Create and upload HiveQL script (A2)](#appendix-b)
* [Appendix C: Prepare Azure SQL database for the Sqoop Job output (A3)](#appendix-c)
* [Next steps](#nextsteps)

##<a id="prerequisite"></a>Prerequisites

Before you begin this tutorial, you must have the following:

* A workstation with Azure PowerShell installed and configured. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].
* An Azure subscription. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].

###Understand HDInsight storage

Hadoop clusters in HDInsight use Azure Blob storage for data storage.  It is called *WASB* or *Azure Storage - Blob*. WASB is Microsoft's implementation of *HDFS* on Azure Blob storage. For more information see [Use Azure Blob storage with HDInsight][hdinsight-storage]. 

When provisioning an HDInsight cluster, a Blob storage container of an Azure storage account is designated as the default file system, just like HDFS. This storage account is referred as the *default storage account*, and the Blob container is referred as the *default Blob container* or *default container*. The default storage account must co-locate in the same data center as the HDInsight cluster. Deleting an HDInsight cluster does not delete the default container or the default storage account.

In addition to the default storage account, other Azure storage accounts can be bound to an HDInsight cluster during the provision process. The binding is to add the storage account and storage account key to the configuration file. So the cluster can access those storage accounts at run-time. For instructions on adding additional storage accounts, see [Provision Hadoop clusters in HDInsight][hdinsight-provision]. 

The WASB syntax is:

	wasb[s]://<ContainerName>@<StorageAccountName>.blob.core.windows.net/<path>/<filename>

>[WACOM.NOTE] The WASB path is virtual path.  For more information see [Use Azure Blob storage with HDInsight][hdinsight-storage]. 

For files stored in the default container. it can be accessed from HDInsight using any of the following URIs (using flightdelays.hql as an example):

	wasb://mycontainer@mystorageaccount.blob.core.windows.net/tutorials/flightdelays/flightdelays.hql
	wasb:///tutorials/flightdelays/flightdelays.hql
	/tutorials/flightdelays/flightdelays.hql

To access the file directly from the storage account, the blob name for the file is:

	tutorials/flightdelays/flightdelays.hql

Notice there is no "/" in the front of the blob name.

**Files used in this tutorial**

This tutorial uses the on-time performance of airline flights data from [Research and Innovative Technology Administration, Bureau of Transportation Statistics][rita-website] (RITA). The data has been uploaded to an Azure Blob storage container with the Public Blob access permission. Because it is a public blob container, you do not need to bind this storage account to the HDInsight cluster running the Hive script. The HiveQL script is also uploaded to the same Blob container. If you want to learn how to get/upload the data to your own storage account, and how to create/upload the HiveQL script file, see [Appendix A](#appendix-a) and [Appendix B](#appendix-b).

The following table lists the files used in this tutorial:

<table border="1">
<tr><th>Files</th><th>Description</th></tr>
<tr><td>wasb://flightdelay@hditutorialdata.blob.core.windows.net/flightdelays.hql</td><td>The HiveQL script file used by the Hive job that you will run. This script has been uploaded to an Azure Blob storage account with the public access.  The <a href="#appendix-b">Appendix B</a> has the instructions on preparing and uploading this file to your own Azure Blob storage account.</td></tr>
<tr><td>wasb://flightdelay@hditutorialdata.blob.core.windows.net/2013Data</td><td>Input data for the Hive jobs. The data has been uploaded to an Azure Blob storatge account with the public access.  The <a href="#appendix-a">Appendix A</a> has the instruction on getting the data and uploading the data to your own Azure Blob storage account.</td></tr>
<tr><td>\tutorials\flightdelays\output</td><td>Output path for the Hive job. The default container is used for storing the output data.</td></tr>
<tr><td>\tutorials\flightdelays\jobstatus</td><td>The Hive job status folder on the default container.</td></tr>
</table>



###Understand Hive internal table and external table

There are a few things you need to know about Hive internal table and external table:

- The CREATE TABLE command creates an internal table. The data file must be located in the default container.
- The CREATE TABLE command moves the data file to the /hive/warehouse/<TableName> folder.
- The CREATE EXTERNAL TABLE command creates an external table. The data file can be located outside the default container.
- The CREATE EXTERNAL TABLE command does not move the data file.
- The CREATE EXTERNAL TABLE command doesn't allow any folders in the LOCATION. This is the reason why the tutorial makes a copy of the sample.log file.

For more information, see [HDInsight: Hive Internal and External Tables Intro][cindygross-hive-tables].

> [WACOM.NOTE] One of the HiveQL statements creates an Hive external table. Hive external table keeps the data file in the original location. Hive internal table moves the data file to hive\warehouse. Hive internal table requires the data file to be located in the default container. For data stored outside default Blob container, you must use Hive external tables.









##<a id="runjob"></a>Provision HDInsight cluster and run Hive/Sqoop jobs 

Hadoop MapReduce is batch processing. The most cost-effective way to run an Hive job is to provision a cluster for the job, and delete the job after the job is completed. The following script covers the whole process. For more information on provision HDInsight cluster and running Hive jobs, see [Provision Hadoop clusters in HDInsight][hdinsight-provision] and  [Use Hive with HDInsight][hdinsight-use-hive]. 

**To run the Hive queries using PowerShell**

1. If you don't have an Azure SQL database, create one using the instructions in [Appendix C](#appendix-c).
2. Prepare the parameters:

	<table border="1">
	<tr><th>Variable Name</th><th>Notes</th></tr>
	<tr><td>$hdinsightClusterName</td><td>HDInsight cluster name. If the cluster doesn't exist, the script will create one with the name entered.</td></tr>
	<tr><td>$storageAccountName</td><td>The Azure storage account that will be used as the default storage account. This value is only needed when the script needs to create an HDInsight cluster. Leave it blank if you have specified an existing HDInsight cluster name for $hdinsightClusterName. If the storage account with the value enter doesn't exist, the script will create one with the name.</td></tr>
	<tr><td>$blobContainerName</td><td>Blob container that will be used for the default file system. If you leave it blank, the $hdinsightClusterName value will be used. </td></tr>
	<tr><td>$sqlDatabaseServerName</td><td>Azure SQL database server name. It has to be an existing server. See <a href="#appendix-c">Appendix C</a> for creating one.</td></tr>
	<tr><td>$sqlDatabaseUsername</td><td>The Azure SQL database server login name.</td></tr>
	<tr><td>$sqlDatabasePassword</td><td>The Azure SQL database server login password.</td></tr>
	<tr><td>$sqlDatabaseName</td><td>The SQL Database where Sqoop will export data to. The default name is "HDISqoop". The table name for the Sqooop job output is "AvgDelays". </td></tr>
	</table>
2. Open PowerShell ISE.
2. Copy and paste the following script into the script pane:

		[CmdletBinding()]
		Param(
		
		    # HDInsight cluster variables
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the HDInsight cluster name. If the cluster doesn't exist, the script will create one.")]
		    [String]$hdinsightClusterName,
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure storage account name for creating a new HDInsight cluster. If the account doesn't exist, the script will create one.")]
		    [AllowEmptyString()]
		    [String]$storageAccountName,
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure blob container name for creating a new HDInsight cluster. If not specified, the HDInsight cluster name will be used.")]
		    [AllowEmptyString()]
		    [String]$blobContainerName,
		
		    #SQL database server variables
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure SQL Database Server Name where to export data.")]
		    [String]$sqlDatabaseServerName,  # specify the Azure SQL database server name where you want to export data to.
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure SQL Database login username.")]
		    [String]$sqlDatabaseUsername,
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure SQL Database login user password.")]
		    [String]$sqlDatabasePassword,
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the database name where data will be exported to.")]
		    [String]$sqlDatabaseName  # the default value is HDISqoop
		)
		
		# Treat all errors as terminating
		$ErrorActionPreference = "Stop"
		
		#region - HDinsight cluster variables
		[int]$clusterSize = 1                # One data node is sufficient for this tutorial.
		[String]$location = "Central US"     # For better performance, choose a data center near you.
		[String]$hadoopUserLogin = "admin"   # Use "admin" as the Hadoop login name
		[String]$hadoopUserpw = "Pass@word1" # Use "Pass@word1" as te the Hadoop login password
		
		[Bool]$isNewCluster = $false      # Indicates whether a new HDInsight cluster is created by the script.  
		                                  # If this variable is true, then the script can optionally delete the cluster after running the Hive and Sqoop jobs.
		
		[Bool]$isNewStorageAccount = $false
		
		$storageAccountName = $storageAccountName.ToLower() # Storage account names must be between 3 and 24 characters in length and use numbers and lower-case letters only.
		#endregion
		
		#region - Hive job variables
		[String]$hqlScriptFile = "wasb://flightdelay@hditutorialdata.blob.core.windows.net/flightdelays.hql" # The HiveQL script is located in a public Blob container. Update this URI if you want to use your own script file.
		
		[String]$jobStatusFolder = "/tutorials/flightdelays/jobstatus" # The script saves both the output data and the job status file to the default container.
		                                                               # The output data path is set in the HiveQL file.
		
		#[String]$jobOutputBlobName = "tutorials/flightdelays/output/000000_0" # This is the output file of the Hive job. The path is set in the HiveQL script.
		#endregion
		
		#region - Sqoop job variables
		[String]$sqlDatabaseTableName = "AvgDelays" 
		[String]$sqlDatabaseConnectionString = "jdbc:sqlserver://$sqlDatabaseServerName.database.windows.net;user=$sqlDatabaseUserName@$sqlDatabaseServerName;password=$sqlDatabasePassword;database=$sqlDatabaseName"
		#endregion Constants and variables
		
		#region - Connect to Azure subscription
		Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
		Write-Host "`tCurrent system time: " (get-date) -ForegroundColor Yellow
		if (-not (Get-AzureAccount)){ Add-AzureAccount}
		#endregion
		
		#region - Validate user input, and provision HDInsight cluster if needed
		Write-Host "`nValidating user input ..." -ForegroundColor Green
		
		# Both the Azure SQL database server and database must exist.
		if (-not (Get-AzureSqlDatabaseServer|Where-Object{$_.ServerName -eq $sqlDatabaseServerName})){
		    Write-host "The Azure SQL database server, $sqlDatabaseServerName doesn't exist." -ForegroundColor Red
		    Exit
		}
		else
		{
		    if (-not ((Get-AzureSqlDatabase -ServerName $sqlDatabaseServerName)|Where-Object{$_.Name -eq $sqlDatabaseName})){
		        Write-host "The Azure SQL database, $sqlDatabaseName doesn't exist." -ForegroundColor Red
		        Exit
		    }
		}
		
		if (Test-AzureName -Service -Name $hdinsightClusterName)     # If it is an existing HDInsight cluster ...
		{
		    Write-Host "`tThe HDInsight cluster, $hdinsightClusterName, exists. This cluster will be used to run the Hive job." -ForegroundColor Cyan
		
		    #region - Retrieve the default storage account/container names of the cluster exists
		    # The Hive job output will be stored in the default container. The 
		    # information is used to download a copy of the output file from 
		    # Blob storage to workstation for the validation purpose.
		    Write-Host "`nRetrieving the HDInsight cluster default storage account information ..." `
		                -ForegroundColor Green
		
		    $hdi = Get-AzureHDInsightCluster -Name $HDInsightClusterName
		
		    # Use the default storage account and the default container even if the names are different from the user input
		    $storageAccountName = $hdi.DefaultStorageAccount.StorageAccountName `
		                            -replace ".blob.core.windows.net"
		    $blobContainerName = $hdi.DefaultStorageAccount.StorageContainerName
		
		    Write-Host "`tThe default storage account for the cluster is $storageAccountName." `
		                -ForegroundColor Cyan
		    Write-Host "`tThe default Blob container for the cluster is $blobContainerName." `
		                -ForegroundColor Cyan
		    #endregion
		}
		else     #If the cluster doesn't exist, a new one will be provisioned.
		{
		    if ([string]::IsNullOrEmpty($storageAccountName))
		    {
		        Write-Host "You must provide a storage account name" -ForegroundColor Red
		        EXit           
		    }
		    else
		    {
		        # If the container name is not specified, use the cluster name as the container name
		        if ([string]::IsNullOrEmpty($blobContainerName))
		        {
		            $blobContainerName = $hdinsightClusterName
		        }
		        $blobContainerName = $blobContainerName.ToLower()
		
		        #region - Provision HDInsigtht cluster
		        # Create an Azure storage account if it doesn't exist
		        if (-not (Get-AzureStorageAccount|Where-Object{$_.Label -eq $storageAccountName}))
		        {
		            Write-Host "`nCreating the Azure storage account, $storageAccountName ..." -ForegroundColor Green
		            if (-not (New-AzureStorageAccount -StorageAccountName $storageAccountName.ToLower() -Location $location)){
		                Write-Host "Error creating the storage account, $storageAccountName" -ForegroundColor Red
		                Exit
		            }
		            $isNewStorageAccount = $True
		        }
		
		        # Create a Blob container used as the default container
		        $storageAccountKey = get-azurestoragekey -StorageAccountName $storageAccountName | %{$_.Primary}
		        $storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
		
		        if (-not (Get-AzureStorageContainer -Context $storageContext |Where-Object{$_.Name -eq $blobContainerName}))
		        {
		            Write-Host "`nCreating the Azure Blob container, $blobContainerName ..." -ForegroundColor Green
		            if (-not (New-AzureStorageContainer -name $blobContainerName -Context $storageContext)){
		                Write-Host "Error creating the Blob container, $blobContainerName" -ForegroundColor Red
		                Exit
		            }
		        }
		
		        # Create a new HDInsight cluster
		        Write-Host "`nProvisioning the HDInsight cluster, $hdinsightClusterName ..." -ForegroundColor Green
		        Write-Host "`tCurrent system time: " (get-date) -ForegroundColor Yellow
		        $hadoopUserPassword = ConvertTo-SecureString -String $hadoopUserpw -AsPlainText -Force     
		        $credential = New-Object System.Management.Automation.PSCredential($hadoopUserLogin,$hadoopUserPassword)
		        if (-not $credential)
		        {
		            Write-Host "Error creating the PSCredential object" -ForegroundColor Red
		            Exit
		        }
		
		        if (-not (New-AzureHDInsightCluster -Name $hdinsightClusterName -Location $location -Credential $credential -DefaultStorageAccountName "$storageAccountName.blob.core.windows.net" -DefaultStorageAccountKey $storageAccountKey -DefaultStorageContainerName $blobContainerName -ClusterSizeInNodes $clusterSize)){
		            Write-Host "Error provisioning the cluster, $hdinsightClusterName." -ForegroundColor Red
		            Exit
		        }
		        Else
		        {
		            $isNewCluster = $True
		        }
		        #endregion
		    }
		}
		#endregion
		
		#region - Submit Hive job
		Write-Host "`nSubmitting the Hive job ..." -ForegroundColor Green
		Write-Host "`tCurrent system time: " (get-date) -ForegroundColor Yellow
		
		Use-AzureHDInsightCluster $HDInsightClusterName
		$response = Invoke-Hive –File $hqlScriptFile -StatusFolder $jobStatusFolder
		
		Write-Host "`nThe Hive job status" -ForegroundColor Cyan
		Write-Host "---------------------------------------------------------" -ForegroundColor Cyan
		write-Host $response
		Write-Host "---------------------------------------------------------" -ForegroundColor Cyan
		#endregion 
		
		#region - run Sqoop job
		Write-Host "`nSubmitting the Sqoop job ..." -ForegroundColor Green
		Write-Host "`tCurrent system time: " (get-date) -ForegroundColor Yellow
		
		[String]$exportDir = "wasb://$blobContainerName@$storageAccountName.blob.core.windows.net/tutorials/flightdelays/output"
		
		
		$sqoopDef = New-AzureHDInsightSqoopJobDefinition -Command "export --connect $sqlDatabaseConnectionString --table $sqlDatabaseTableName --export-dir $exportDir --fields-terminated-by \001 "
		$sqoopJob = Start-AzureHDInsightJob -Cluster $hdinsightClusterName -JobDefinition $sqoopDef #-Debug -Verbose
		Wait-AzureHDInsightJob -WaitTimeoutInSeconds 3600 -Job $sqoopJob
		
		Write-Host "Standard Error" -BackgroundColor Green
		Get-AzureHDInsightJobOutput -Cluster $hdinsightClusterName -JobId $sqoopJob.JobId -StandardError
		Write-Host "Standard Output" -BackgroundColor Green
		Get-AzureHDInsightJobOutput -Cluster $hdinsightClusterName -JobId $sqoopJob.JobId -StandardOutput
		#endregion
		
		#region - Delete the HDInsight cluster
		if ($isNewCluster -eq $True)
		{
		    $isDelete = Read-Host 'Do you want to delete the HDInsight Hadoop cluster ' $hdinsightClusterName '? (Y/N)'
		
		    if ($isDelete.ToLower() -eq "y")
		    {
		        Write-Host "`nDeleting the HDInsight cluster ..." -ForegroundColor Green
		        Write-Host "`tCurrent system time: " (get-date) -ForegroundColor Yellow
		        Remove-AzureHDInsightCluster -Name $hdinsightClusterName
		    }
		}
		#endregion
		
		#region - Delete the storage account
		if ($isNewStorageAccount -eq $True)
		{
		    $isDelete = Read-Host 'Do you want to delete the Azure storage account ' $storageAccountName '? (Y/N)'
		
		    if ($isDelete.ToLower() -eq "y")
		    {
		        Write-Host "`nDeleting the Azure storage account ..." -ForegroundColor Green
		        Write-Host "`tCurrent system time: " (get-date) -ForegroundColor Yellow
		        Remove-AzureStorageAccount -StorageAccountName $storageAccountName
		    }
		}
		#endregion
		
		Write-Host "End of the PowerShell script" -ForegroundColor Green
		Write-Host "`tCurrent system time: " (get-date) -ForegroundColor Yellow

4. Press **F5** to run the script. The output shall be similar to:

	![HDI.FlightDelays.RunHiveJob.output][img-hdi-flightdelays-run-hive-job-output]
		
5. Connect to your SQL Database and see average flight delays by city in the *AvgDelays* table:

	![HDI.FlightDelays.AvgDelays.Dataset][image-hdi-flightdelays-avgdelays-dataset]



---
##<a id="appendix-a"></a>Appendix A - Upload flight delay data to Azure Blob storage
Prior to uploading the data file and the HiveQL script files (see [Appendix B](#appendix-b), it requires some planning. The idea is to store the data files and the HiveQL file before provision an HDInsight cluster and run the Hive job.  You have two options:

- **Use the same Azure storage account that will be used by the HDInsight cluster as the default file system.** Because the HDInsight cluster will have the storage account access key, you don't need to make any additional changes.
- **Use a different Azure storage account from the HDInsight cluster default file system.** If this is the case, you must modified the provision part of the PowerShell script found in [Provision HDInsight cluster and run Hive/Sqoop jobs](#runjob) to include the storage account as an additional storage account. For the instructions, see [Provision Hadoop clusters in HDInsight][hdinsight-provision]. By doing so, the HDInsight cluster knows the access key for the storage account.

>[WACOM.NOTE] The WASB path for the data file is hard coded in the HiveQL script file. You must update it accordingly.

**To download the flight data**

1. Browse to [Research and Innovative Technology Administration, Bureau of Transportation Statistics][rita-website] (RITA).
2. On the page, select the following values:

	<table border="1">
	<tr><th>Name</th><th>Value</th></tr>
	<tr><td>Filter Year</td><td>2013 </td></tr>
	<tr><td>Filter Period</td><td>January</td></tr>
	<tr><td>Fields:</td><td>*Year*, *FlightDate*, *UniqueCarrier*, *Carrier*, *FlightNum*, *OriginAirportID*, *Origin*, *OriginCityName*, *OriginState*, *DestAirportID*, *Dest*, *DestCityName*, *DestState*, *DepDelayMinutes*, *ArrDelay*, *ArrDelayMinutes*, *CarrierDelay*, *WeatherDelay*, *NASDelay*, *SecurityDelay*, *LateAircraftDelay* (clear all other fields)</td></tr>
	</table>

3. Click **Download**. 
4. Unzip the file to the **C:\Tutorials\FlightDelays\Data** folder.  Each file is a CSV file and is approximately 60 GB in size.
5.	Rename the file to the name of the month that it contains data for. For example, the file containing the January data would be named *January.csv*.
6. Repeat step 2 and 5 to download a file for each of the 12 months in 2013. You will need minimum one file to run the tutorial.  

**To upload the flight delay data to Azure Blob storage**

1. Prepare the parameters:

	<table border="1">
	<tr><th>Variable Name</th><th>Notes</th></tr>
	<tr><td>$storageAccountName</td><td>The Azure storage account where you want to upload the data to.</td></tr>
	<tr><td>$blobContainerName</td><td>The Blob container where you want to upload the data to.</td></tr>
	</table>
2. Open PowerShell ISE.
2. Paste the following script into the script pane:

		[CmdletBinding()]
		Param(
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure storage account name for creating a new HDInsight cluster. If the account doesn't exist, the script will create one.")]
		    [String]$storageAccountName,
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure blob container name for creating a new HDInsight cluster. If not specified, the HDInsight cluster name will be used.")]
		    [String]$blobContainerName
		)
		
		#Region - Variables
		$localFolder = "C:\Tutorials\FlightDelays\Data"  # the source folder
		$destFolder = "tutorials/flightdelays/data"     #the blob name prefix for the files to be uploaded
		#EndRegion
		
		#Region - Connect to Azure subscription
		Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
		if (-not (Get-AzureAccount)){ Add-AzureAccount}
		#EndRegion
		
		#Region - Validate user inpute
		# Validate the storage account
		if (-not (Get-AzureStorageAccount|Where-Object{$_.Label -eq $storageAccountName}))
		{
		    Write-Host "The storage account, $storageAccountName, doesn't exist." -ForegroundColor Red
		    exit
		}
		
		# Validate the container
		$storageAccountKey = get-azurestoragekey -StorageAccountName $storageAccountName | %{$_.Primary}
		$storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
		
		if (-not (Get-AzureStorageContainer -Context $storageContext |Where-Object{$_.Name -eq $blobContainerName}))
		{
		    Write-Host "The Blob container, $blobContainerName, doesn't exist" -ForegroundColor Red
		    Exit
		}
		#EngRegion
		
		#Region - Copy the file from local workstation to Azure Blob storage  
		if (test-path -Path $localFolder)
		{
		    foreach ($item in Get-ChildItem -Path $localFolder){
		        $fileName = "$localFolder\$item"
		        $blobName = "$destFolder/$item"
		
		        Write-Host "Copying $fileName to $blobName" -ForegroundColor Green
		
		        Set-AzureStorageBlobContent -File $fileName -Container $blobContainerName -Blob $blobName -Context $storageContext
		    }
		}
		else
		{
		    Write-Host "The source folder on the workstation doesn't exist" -ForegroundColor Red
		}
		
		# List the uploaded files on HDinsight
		Get-AzureStorageBlob -Container $blobContainerName  -Context $storageContext -Prefix $destFolder
		#EndRegion

3. Press **F5** to run the script.

If you choose to use a different method for uploading the files, please make sure the file path is *tutorials/flightdelays/data*. The syntax for accessing the files is:

	wasb://<ContainerName>@<StorageAccountName>.blob.core.windows.net/tutorials/flightdelays/data

*tutorials/flightdelays/data* is the virtual folder you created when you uploaded the files. Verify that there are 12 files, one for each month.

>[WACOM.NOTE] You must update the Hive query to read from the new location.

> You must either configure the container access permission to be public or bind the storage account to the HDInsight cluster.  Otherwise, the Hive query string will not be able to access the data files. 

---
##<a id="appendix-b"></a>Appendix B - Create and upload HiveQL script

Using Azure PowerShell, you can run multiple HiveQL statements one at a time, or package the HiveQL statement into a script file. The section shows you how to create a HiveQL script and upload the script to Azure Blob storage using PowerShell. Hive requires the HiveQL scripts to be stored on WASB.

The HiveQL script will perform the following:

1. **Drop the delays_raw table**, in case the table already exists.
2. **Create the delays_raw external Hive table** pointing to the WASB location with the flight delay files. This query specifies that fields are delimited by "," and that lines are terminated by "\n". This poses a problem when field values *contain* commas because Hive cannot differentiate between a comma that is a field delimiter and a one that is part of a field value (which is the case in field values for ORIGIN\_CITY\_NAME and DEST\_CITY\_NAME). To address this, the query creates TEMP columns to hold data that is incorrectly split into columns.  
3. **Drop the delays table**, in case the table already exists;
4. **Create the delays table**. It is helpful to clean up the data before further processing. This query creates a new table, *delays* from the *delays_raw* table. Note that the TEMP columns (as mentioned previously) are not copied, and that the *substring* function is used to remove quotation marks from the data. 
5. **Computes the average weather delay and groups the results by city name.** It will also output the results to WASB. Note that the query will remove apostrophes from the data and will exclude rows where the value for *weather_deal*y is *null*, which is necessary because Sqoop, used later in this tutorial, doesn't handle those values gracefully by default.

For a full list of the HiveQL commands, see [Hive Data Definition Language][hadoop-hiveql]. Each HiveQL command must terminate with a semicolon.

**To create an HiveQL script file**

1. Prepare the parameters:

	<table border="1">
	<tr><th>Variable Name</th><th>Notes</th></tr>
	<tr><td>$storageAccountName</td><td>The Azure storage account where you want to upload the HiveQL script to.</td></tr>
	<tr><td>$blobContainerName</td><td>The Blob container where you want to upload the HiveQL script to.</td></tr>
	</table>
2. Open Azure PowerShell ISE.

2. Copy and paste the following script into the script pane:

		[CmdletBinding()]
		Param(
		
		    # Azure blob storage variables
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure storage account name for creating a new HDInsight cluster. If the account doesn't exist, the script will create one.")]
		    [String]$storageAccountName,
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure blob container name for creating a new HDInsight cluster. If not specified, the HDInsight cluster name will be used.")]
		    [String]$blobContainerName
		
		)
		
		#region - define variables
		# Treat all errors as terminating
		$ErrorActionPreference = "Stop"
		
		# the HQL script file is exported as this file before uploaded to WASB
		$hqlLocalFileName = "C:\tutorials\flightdelays\flightdelays.hql" 
		
		# the HQL script file will be upload to WASB as this blob name
		$hqlBlobName = "tutorials/flightdelays/flightdelays.hql" 
		
		# this two constants are used by the HQL scrpit file
		#$srcDataFolder = "tutorials/flightdelays/data" 
		$dstDataFolder = "/tutorials/flightdelays/output"
		#endregion
		
		#region - Validate the file and file path
		
		# check if a file with the same file name already exist on the workstation
		Write-Host "`nvalidating the folder structure on the workstation for saving the HQL script file ..."  -ForegroundColor Green
		if (test-path $hqlLocalFileName){
		
		    $isDelete = Read-Host 'The file, ' $hqlLocalFileName ', exists.  Do you want to overwirte it? (Y/N)'
		
		    if ($isDelete.ToLower() -ne "y")
		    {
		        Exit
		    }
		}
		
		# create the folder if it doesn't exist
		$folder = split-path $hqlLocalFileName
		if (-not (test-path $folder))
		{
		    Write-Host "`nCreating folder, $folder ..." -ForegroundColor Green
		
		    new-item $folder -ItemType directory  
		}
		#end region
		
		#region - Add the Azure account 
		Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
		$azureAccounts= Get-AzureAccount
		if (! $azureAccounts)
		{
		    Add-AzureAccount
		}
		#endregion
		
		#region - Write the Hive script into a local file
		Write-Host "`nWriting the Hive script into a file on your workstation ..." `
		            -ForegroundColor Green
		
		$hqlDropDelaysRaw = "DROP TABLE delays_raw;"
		
		$hqlCreateDelaysRaw = "CREATE EXTERNAL TABLE delays_raw (" +
		        "YEAR string, " +
		        "FL_DATE string, " +
		        "UNIQUE_CARRIER string, " +
		        "CARRIER string, " +
		        "FL_NUM string, " +
		        "ORIGIN_AIRPORT_ID string, " +
		        "ORIGIN string, " +
		        "ORIGIN_CITY_NAME string, " +
		        "ORIGIN_CITY_NAME_TEMP string, " +
		        "ORIGIN_STATE_ABR string, " +
		        "DEST_AIRPORT_ID string, " +
		        "DEST string, " +
		        "DEST_CITY_NAME string, " +
		        "DEST_CITY_NAME_TEMP string, " +
		        "DEST_STATE_ABR string, " +
		        "DEP_DELAY_NEW float, " +
		        "ARR_DELAY_NEW float, " +
		        "CARRIER_DELAY float, " +
		        "WEATHER_DELAY float, " +
		        "NAS_DELAY float, " +
		        "SECURITY_DELAY float, " +
		        "LATE_AIRCRAFT_DELAY float) " +
		    "ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' " +
		    "LINES TERMINATED BY '\n' " +
		    "STORED AS TEXTFILE " +
		    "LOCATION 'wasb://flightdelay@hditutorialdata.blob.core.windows.net/2013Data';" 
		
		$hqlDropDelays = "DROP TABLE delays;"
		
		$hqlCreateDelays = "CREATE TABLE delays AS " +
		    "SELECT YEAR AS year, " +
		        "FL_DATE AS flight_date, " +
		        "substring(UNIQUE_CARRIER, 2, length(UNIQUE_CARRIER) -1) AS unique_carrier, " +
		        "substring(CARRIER, 2, length(CARRIER) -1) AS carrier, " +
		        "substring(FL_NUM, 2, length(FL_NUM) -1) AS flight_num, " +
		        "ORIGIN_AIRPORT_ID AS origin_airport_id, " +
		        "substring(ORIGIN, 2, length(ORIGIN) -1) AS origin_airport_code, " +
		        "substring(ORIGIN_CITY_NAME, 2) AS origin_city_name, " +
		        "substring(ORIGIN_STATE_ABR, 2, length(ORIGIN_STATE_ABR) -1)  AS origin_state_abr, " +
		        "DEST_AIRPORT_ID AS dest_airport_id, " +
		        "substring(DEST, 2, length(DEST) -1) AS dest_airport_code, " +
		        "substring(DEST_CITY_NAME,2) AS dest_city_name, " +
		        "substring(DEST_STATE_ABR, 2, length(DEST_STATE_ABR) -1) AS dest_state_abr, " +
		        "DEP_DELAY_NEW AS dep_delay_new, " +
		        "ARR_DELAY_NEW AS arr_delay_new, " +
		        "CARRIER_DELAY AS carrier_delay, " +
		        "WEATHER_DELAY AS weather_delay, " +
		        "NAS_DELAY AS nas_delay, " +
		        "SECURITY_DELAY AS security_delay, " +
		        "LATE_AIRCRAFT_DELAY AS late_aircraft_delay " +
		    "FROM delays_raw;" 
		
		$hqlInsertLocal = "INSERT OVERWRITE DIRECTORY '$dstDataFolder' " +
		    "SELECT regexp_replace(origin_city_name, '''', ''), " +
		        "avg(weather_delay) " +
		    "FROM delays " +
		    "WHERE weather_delay IS NOT NULL " +
		    "GROUP BY origin_city_name;"
		
		$hqlScript = $hqlDropDelaysRaw + $hqlCreateDelaysRaw + $hqlDropDelays + $hqlCreateDelays + $hqlInsertLocal
		
		$hqlScript | Out-File $hqlLocalFileName -Encoding ascii -Force 
		#endregion
		
		#region - Upload the Hive script to the default Blob container
		Write-Host "`nUploading the Hive script to the default Blob container ..." -ForegroundColor Green
		
		# Create a storage context object
		$storageAccountKey = get-azurestoragekey $storageAccountName | %{$_.Primary}
		$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
		
		# Upload the file from local workstation to WASB
		Set-AzureStorageBlobContent -File $hqlLocalFileName -Container $blobContainerName -Blob $hqlBlobName -Context $destContext 
		#endregion
		
		Write-host "`nEnd of the PowerShell script" -ForegroundColor Green

	Here are the variables used in the script:

	- **$hqlLocalFileName**: The script saves the HiveQL script file locally before uploading it to WASB. This is the file name. The default values is <u>C:\tutorials\flightdelays\flightdelays.hql</u>.
	- **$hqlBlobName**: This is the HiveQL script file blob name used in the Azure Blob storage. The default values is <u>tutorials/flightdelays/flightdelays.hql</u>. Because the file will be written directly to Azure Blob storage, there is NOT a "/" at the beginning of the blob name. If you want to access the file from WASB, you will need to add a "/" at the beginning of the file name.
	- **$srcDataFolder** and **$dstDataFolder**:  = "tutorials/flightdelays/data" 
 = "tutorials/flightdelays/output"


---
##<a id="appendix-c"></a>Appendix C - Prepare Azure SQL database for the Sqoop job output
**To prepare the SQL database (merge this with the Sqoop script)**

1. Prepare the parameters:

	<table border="1">
	<tr><th>Variable Name</th><th>Notes</th></tr>
	<tr><td>$sqlDatabaseServerName</td><td>The Azure SQL database server name. Enter nothing to create a new server.</td></tr>
	<tr><td>$sqlDatabaseUsername</td><td>The Azure SQL database server login name. If $sqlDatabaseServerName is an existing server, the login and login password are used to authenticate with the server.  Otherwise they are used to create a new server.</td></tr>
	<tr><td>$sqlDatabasePassword</td><td>The Azure SQL database server login password.</td></tr>
	<tr><td>$sqlDatabaseLocation</td><td>This value is only used when creating a new Azure database server.</td></tr>
	<tr><td>$sqlDatabaseName</td><td>The SQL Database used to create the AvgDelays table for the Sqoop job. Leave it blank will result a database called "HDISqoop" created. The table name for the Sqooop job output is "AvgDelays". </td></tr>
	</table>
2. Open PowerShell ISE. 
2. Copy and paste the following script into the script pane:
	
		[CmdletBinding()]
		Param(
		
		    # SQL database server variables
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure SQL Database Server Name to use an existing one. Enter nothing to create a new one.")]
		    [AllowEmptyString()]
		    [String]$sqlDatabaseServer,  # specify the Azure SQL database server name if you have one created. Otherwise use "".
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure SQL Database admin user.")]
		    [String]$sqlDatabaseUsername,
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the Azure SQL Database admin user password.")]
		    [String]$sqlDatabasePassword,
		
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the region to create the Database in.")]
		    [AllowEmptyString()]
		    [String]$sqlDatabaseLocation,   #For example, West US.
		
		    # SQL database variables
		    [Parameter(Mandatory=$True,
		               HelpMessage="Enter the database name if you have created one. Enter nothing to create one.")]
		    [AllowEmptyString()]
		    [String]$sqlDatabaseName # specify the database name if you have one created.  Otherwise use "" to have the script create one for you.
		)
		
		# Treat all errors as terminating
		$ErrorActionPreference = "Stop"
		
		#region - Constants and variables
		
		# IP address REST service used for retrieving external IP address and creating firewall rules
		[String]$ipAddressRestService = "http://bot.whatismyipaddress.com"
		[String]$fireWallRuleName = "FlightDelay"
		
		# SQL database variables
		[String]$sqlDatabaseMaxSizeGB = 10
		
		#SQL query string for creating AvgDelays table
		[String]$sqlDatabaseTableName = "AvgDelays"
		[String]$sqlCreateAvgDelaysTable = " CREATE TABLE [dbo].[$sqlDatabaseTableName](
		            [origin_city_name] [nvarchar](50) NOT NULL,
		            [weather_delay] float,
		        CONSTRAINT [PK_$sqlDatabaseTableName] PRIMARY KEY CLUSTERED   
		        (
		            [origin_city_name] ASC
		        )
		        )"
		#endregion

		#region - Add the Azure account 
		Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
		$azureAccounts= Get-AzureAccount
		if (! $azureAccounts)
		{
		Add-AzureAccount
		}
		#endregion
		
		#region - Create and validate Azure SQL Database server
		if ([string]::IsNullOrEmpty($sqlDatabaseServer))
		{
			Write-Host "`nCreating SQL Database server ..."  -ForegroundColor Green
			$sqlDatabaseServer = (New-AzureSqlDatabaseServer -AdministratorLogin $sqlDatabaseUsername -AdministratorLoginPassword $sqlDatabasePassword -Location $sqlDatabaseLocation).ServerName
		    Write-Host "`tThe new SQL database server name is $sqlDatabaseServer." -ForegroundColor Cyan
		
		    Write-Host "`nCreating firewall rule, $fireWallRuleName ..." -ForegroundColor Green
		    $workstationIPAddress = Invoke-RestMethod $ipAddressRestService
		    New-AzureSqlDatabaseServerFirewallRule -ServerName $sqlDatabaseServer -RuleName "$fireWallRuleName-workstation" -StartIpAddress $workstationIPAddress -EndIpAddress $workstationIPAddress	
		    New-AzureSqlDatabaseServerFirewallRule -ServerName $sqlDatabaseServer -RuleName "$fireWallRuleName-Azureservices" -AllowAllAzureServices 
		}
		else
		{
		    $dbServer = Get-AzureSqlDatabaseServer -ServerName $sqlDatabaseServer
		    if (! $dbServer)
		    {
		        throw "The Azure SQL database server, $sqlDatabaseServer, doesn't exist!" 
		    }
		    else
		    {
			    Write-Host "`nUse an existing SQL Database server, $sqlDatabaseServer" -ForegroundColor Green
		    }
		}
		#endregion
		
		#region - Create and validate Azure SQL database
		if ([string]::IsNullOrEmpty($sqlDatabaseName))
		{
			Write-Host "`nCreating SQL Database, HDISqoop ..."  -ForegroundColor Green
		
			$sqlDatabaseName = "HDISqoop"
			$sqlDatabaseServerCredential = new-object System.Management.Automation.PSCredential($sqlDatabaseUsername, ($sqlDatabasePassword  | ConvertTo-SecureString -asPlainText -Force)) 
		
		    $sqlDatabaseServerConnectionContext = New-AzureSqlDatabaseServerContext -ServerName $sqlDatabaseServer -Credential $sqlDatabaseServerCredential 
			
			$sqlDatabase = New-AzureSqlDatabase -ConnectionContext $sqlDatabaseServerConnectionContext -DatabaseName $sqlDatabaseName -MaxSizeGB $sqlDatabaseMaxSizeGB
		}
		else
		{
		    $db = Get-AzureSqlDatabase -ServerName $sqlDatabaseServer -DatabaseName $sqlDatabaseName
		    if (! $db)
		    {
		        throw "The Azure SQL database server, $sqlDatabaseServer, doesn't exist!" 
		    }
		    else
		    {
			    Write-Host "`nUse an existing SQL Database, $sqlDatabaseName" -ForegroundColor Green
		    }
		}
		#endregion
			
		#region -  Excute a SQL command to create the AvgDelays table
			
		Write-Host "`nCreating SQL Database table ..."  -ForegroundColor Green
		$conn = New-Object System.Data.SqlClient.SqlConnection
		$conn.ConnectionString = "Data Source=$sqlDatabaseServer.database.windows.net;Initial Catalog=$sqlDatabaseName;User ID=$sqlDatabaseUsername;Password=$sqlDatabasePassword;Encrypt=true;Trusted_Connection=false;"
		$conn.open()
		$cmd = New-Object System.Data.SqlClient.SqlCommand
		$cmd.connection = $conn
		$cmd.commandtext = $sqlCreateAvgDelaysTable
		$cmd.executenonquery()
			
		$conn.close()
		
		Write-host "`nEnd of the PowerShell script" -ForegroundColor Green

	> WACOM.NOTE The script uses a REST service, http://bot.whatismyipaddress.com, to retrieve your external IP address. The IP address is used for creating a firewall rule for your SQL Database server.  

	Here are some variables used in the script:

	- **$ipAddressRestService**: The default value is <u>http://bot.whatismyipaddress.com</u>. It is a public IP address Rest service for getting your external IP address. You can use other services if you want. The external IP address retrieved using the service will be used to create a firewall rule for your Azure SQL database server, so that you can access the database from your workstation (using PowerShell script).
	- **$fireWallRuleName**: This is the Azure SQL database server firewall rule name. The default name is <u>FlightDelay</u>. You can rename it if you want.
	- **$sqlDatabaseMaxSizeGB**: This value is only used when creating a new Azure SQL database server. The default value is <u>10GB</u>. 10GB is sufficient for this tutorial.
	- **$sqlDatabaseName**: This value is used only when creating a new Azure SQL database. The default value is <u>HDISqoop</u>. If you rename it, you must update the Sqoop PowerShell script accordingly. 

4. Press **F5** to run the script. 
5. Validate the script output. Make sure the script ran successfully.	

##<a id="nextsteps"></a> Next steps
Now that you understand how to upload file to Blob storage, how to populate a Hive table using the data from Blob storage, how to run Hive queries, and how to use Sqoop to export data from HDFS to Azure SQL Database. To learn more, see the following articles:

* [Getting Started with HDInsight][hdinsight-get-started]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Oozie with HDInsight][hdinsight-use-oozie]
* [Use Sqoop with HDInsight][hdinsight-use-sqoop]
* [Use Pig with HDInsight][hdinsight-use-pig]
* [Develop Java MapReduce programs for HDInsight][hdinsight-develop-mapreduce]
* [Develop C# Hadoop streaming programs for HDInsight][hdinsight-develop-streaming]



[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/


[rita-website]: http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time
[cindygross-hive-tables]: http://blogs.msdn.com/b/cindygross/archive/2013/02/06/hdinsight-hive-internal-and-external-tables-intro.aspx
[Powershell-install-configure]: ../install-configure-powershell/

[hdinsight-use-oozie]: ../hdinsight-use-oozie/
[hdinsight-use-hive]: ../hdinsight-use-hive/
[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-storage]: ../hdinsight-use-blob-storage/
[hdinsight-upload-data]: ../hdinsight-upload-data/
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-use-sqoop]: ../hdinsight-use-sqoop/
[hdinsight-use-pig]: ../hdinsight-use-pig/
[hdinsight-develop-streaming]: ../hdinsight-hadoop-develop-deploy-streaming-jobs/
[hdinsight-develop-mapreduce]: ../hdinsight-develop-deploy-java-mapreduce/

[hadoop-hiveql]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL
[hadoop-shell-commands]: http://hadoop.apache.org/docs/r0.18.3/hdfs_shell.html

[technetwiki-hive-error]: http://social.technet.microsoft.com/wiki/contents/articles/23047.hdinsight-hive-error-unable-to-rename.aspx

[image-hdi-flightdelays-avgdelays-dataset]: ./media/hdinsight-analyze-flight-delay-data/HDI.FlightDelays.AvgDelays.DataSet.png
[img-hdi-flightdelays-run-hive-job-output]: ./media/hdinsight-analyze-flight-delay-data/HDI.FlightDelays.RunHiveJob.Output.png
[img-hdi-flightdelays-flow]: ./media/hdinsight-analyze-flight-delay-data/HDI.FlightDelays.Flow.png

