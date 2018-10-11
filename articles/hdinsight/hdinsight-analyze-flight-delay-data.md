---
title: Analyze flight delay data with Hadoop in HDInsight - Azure 
description: Learn how to use one Windows PowerShell script to create an HDInsight cluster, run a Hive job, run a Sqoop job, and delete the cluster.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/25/2017
ms.author: jasonh
ROBOTS: NOINDEX

---
# Analyze flight delay data by using Hive in HDInsight
Hive provides a means of running Hadoop MapReduce jobs through an SQL-like scripting language called *[HiveQL][hadoop-hiveql]*, which can be applied towards summarizing, querying, and analyzing large volumes of data.

> [!IMPORTANT]
> The steps in this document require a Windows-based HDInsight cluster. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdinsight-windows-retirement). For steps that work with a Linux-based cluster, see [Analyze flight delay data by using Hive in HDInsight (Linux)](hdinsight-analyze-flight-delay-data-linux.md).

One of the major benefits of Azure HDInsight is the separation of data storage and compute. HDInsight uses Azure Blob storage for data storage. A typical job involves three parts:

1. **Store data in Azure Blob storage.**  For example, weather data, sensor data, web logs, and in this case, flight delay data are saved into Azure Blob storage.
2. **Run jobs.** When it is time to process the data, you run a Windows PowerShell script (or a client application) to create an HDInsight cluster, run jobs, and delete the cluster. The jobs save output data to Azure Blob storage. The output data is retained even after the cluster is deleted. This way, you pay for only what you have consumed.
3. **Retrieve the output from Azure Blob storage**, or in this tutorial, export the data to an Azure SQL database.

The following diagram illustrates the scenario and the structure of this tutorial:

![HDI.FlightDelays.flow][img-hdi-flightdelays-flow]

Note that the numbers in the diagram correspond to the section titles. **M** stands for the main process. **A** stands for the content in the appendix.

The main portion of the tutorial shows you how to use one Windows PowerShell script to perform the following tasks:

* Create an HDInsight cluster.
* Run a Hive job on the cluster to calculate average delays at airports. The flight delay data is stored in an Azure Blob storage account.
* Run a Sqoop job to export the Hive job output to an Azure SQL database.
* Delete the HDInsight cluster.

In the appendixes, you can find the instructions for uploading flight delay data, creating/uploading a Hive query string, and preparing the Azure SQL database for the Sqoop job.

> [!NOTE]
> The steps in this document are specific to Windows-based HDInsight clusters. For steps that work with a Linux-based cluster, see [Analyze flight delay data using Hive in HDInsight (Linux)](hdinsight-analyze-flight-delay-data-linux.md)

### Prerequisites
Before you begin this tutorial, you must have the following items:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
* **A workstation with Azure PowerShell**.

    > [!IMPORTANT]
    > Azure PowerShell support for managing HDInsight resources using Azure Service Manager is **deprecated**, and was removed on January 1, 2017. The steps in this document use the new HDInsight cmdlets that work with Azure Resource Manager.
    >
    > Please follow the steps in [Install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs) to install the latest version of Azure PowerShell. If you have scripts that need to be modified to use the new cmdlets that work with Azure Resource Manager, see [Migrating to Azure Resource Manager-based development tools for HDInsight clusters](hdinsight-hadoop-development-using-azure-resource-manager.md) for more information.

**Files used in this tutorial**

This tutorial uses the on-time performance of airline flight data from
[Research and Innovative Technology Administration, Bureau of Transportation Statistics or RITA][rita-website].
A copy of the data has been uploaded to an Azure Blob storage container with the Public Blob access permission.
A part of your PowerShell script copies the data from the public blob container to the default blob container of
your cluster. The HiveQL script is also copied to the same Blob container.
If you want to learn how to get/upload the data to your own Storage account, and how to create/upload the HiveQL script file, see [Appendix A](#appendix-a) and [Appendix B](#appendix-b).

The following table lists the files used in this tutorial:

<table border="1">
<tr><th>Files</th><th>Description</th></tr>
<tr><td>wasb://flightdelay@hditutorialdata.blob.core.windows.net/flightdelays.hql</td><td>The HiveQL script file used by the Hive job. This script has been uploaded to an Azure Blob storage account with the public access. <a href="#appendix-b">Appendix B</a> has instructions on preparing and uploading this file to your own Azure Blob storage account.</td></tr>
<tr><td>wasb://flightdelay@hditutorialdata.blob.core.windows.net/2013Data</td><td>Input data for the Hive job. The data has been uploaded to an Azure Blob storage account with the public access. <a href="#appendix-a">Appendix A</a> has instructions on getting the data and uploading the data to your own Azure Blob storage account.</td></tr>
<tr><td>\tutorials\flightdelays\output</td><td>The output path for the Hive job. The default container is used for storing the output data.</td></tr>
<tr><td>\tutorials\flightdelays\jobstatus</td><td>The Hive job status folder on the default container.</td></tr>
</table>

## Create cluster and run Hive/Sqoop jobs
Hadoop MapReduce is batch processing. The most cost-effective way to run a Hive job is to create a cluster for the job,
and delete the job after the job is completed. The following script covers the whole process.
For more information on creating an HDInsight cluster and running Hive jobs, see [Create Hadoop clusters in HDInsight][hdinsight-provision] and [Use Hive with HDInsight][hdinsight-use-hive].

**To run the Hive queries by Azure PowerShell**

1. Create an Azure SQL database and the table for the Sqoop job output by using the instructions in [Appendix C](#appendix-c).
2. Open Windows PowerShell ISE, and run the following script:

    ```powershell
    $subscriptionID = "<Azure Subscription ID>"
    $nameToken = "<Enter an Alias>"

    ###########################################
    # You must configure the follwing variables
    # for an existing Azure SQL Database
    ###########################################
    $existingSqlDatabaseServerName = "<Azure SQL Database Server>"
    $existingSqlDatabaseLogin = "<Azure SQL Database Server Login>"
    $existingSqlDatabasePassword = "<Azure SQL Database Server login password>"
    $existingSqlDatabaseName = "<Azure SQL Database name>"

    $localFolder = "E:\Tutorials\Downloads\" # A temp location for copying files.
    $azcopyPath = "C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy" # depends on the version, the folder can be different

    ###########################################
    # (Optional) configure the following variables
    ###########################################

    $namePrefix = $nameToken.ToLower() + (Get-Date -Format "MMdd")

    $resourceGroupName = $namePrefix + "rg"
    $location = "EAST US 2"

    $HDInsightClusterName = $namePrefix + "hdi"
    $httpUserName = "admin"
    $httpPassword = "<Enter the Password>"

    $defaultStorageAccountName = $namePrefix + "store"
    $defaultBlobContainerName = $HDInsightClusterName # use the cluster name

    $existingSqlDatabaseTableName = "AvgDelays"
    $sqlDatabaseConnectionString = "jdbc:sqlserver://$existingSqlDatabaseServerName.database.windows.net;user=$existingSqlDatabaseLogin@$existingSqlDatabaseServerName;password=$existingSqlDatabaseLogin;database=$existingSqlDatabaseName"

    $hqlScriptFile = "/tutorials/flightdelays/flightdelays.hql"

    $jobStatusFolder = "/tutorials/flightdelays/jobstatus"

    ###########################################
    # Login
    ###########################################
    try{
        $acct = Get-AzureRmSubscription
    }
    catch{
        Connect-AzureRmAccount
    }
    Select-AzureRmSubscription -SubscriptionID $subscriptionID

    ###########################################
    # Create a new HDInsight cluster
    ###########################################

    # Create ARM group
    New-AzureRmResourceGroup -Name $resourceGroupName -Location $location

    # Create the default storage account
    New-AzureRmStorageAccount -ResourceGroupName $resourceGroupName -Name $defaultStorageAccountName -Location $location -Type Standard_LRS

    # Create the default Blob container
    $defaultStorageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $resourceGroupName -Name $defaultStorageAccountName)[0].Value
    $defaultStorageAccountContext = New-AzureStorageContext -StorageAccountName $defaultStorageAccountName -StorageAccountKey $defaultStorageAccountKey
    New-AzureStorageContainer -Name $defaultBlobContainerName -Context $defaultStorageAccountContext

    # Create the HDInsight cluster
    $pw = ConvertTo-SecureString -String $httpPassword -AsPlainText -Force
    $httpCredential = New-Object System.Management.Automation.PSCredential($httpUserName,$pw)

    New-AzureRmHDInsightCluster `
        -ResourceGroupName $resourceGroupName `
        -ClusterName $HDInsightClusterName `
        -Location $location `
        -ClusterType Hadoop `
        -OSType Windows `
        -ClusterSizeInNodes 2 `
        -HttpCredential $httpCredential `
        -DefaultStorageAccountName "$defaultStorageAccountName.blob.core.windows.net" `
        -DefaultStorageAccountKey $defaultStorageAccountKey `
        -DefaultStorageContainer $existingDefaultBlobContainerName

    ###########################################
    # Prepare the HiveQL script and source data
    ###########################################

    # Create the temp location
    New-Item -Path $localFolder -ItemType Directory -Force

    # Download the sample file from Azure Blob storage
    $context = New-AzureStorageContext -StorageAccountName "hditutorialdata" -Anonymous
    $blobs = Get-AzureStorageBlob -Container "flightdelay" -Context $context
    #$blobs | Get-AzureStorageBlobContent -Context $context -Destination $localFolder

    # Upload data to default container

    $azcopycmd = "cmd.exe /C '$azcopyPath\azcopy.exe' /S /Source:'$localFolder' /Dest:'https://$defaultStorageAccountName.blob.core.windows.net/$defaultBlobContainerName/tutorials/flightdelays' /DestKey:$defaultStorageAccountKey"

    Invoke-Expression -Command:$azcopycmd

    ###########################################
    # Submit the Hive job
    ###########################################
    Use-AzureRmHDInsightCluster -ClusterName $HDInsightClusterName -HttpCredential $httpCredential
    $response = Invoke-AzureRmHDInsightHiveJob `
                    -Files $hqlScriptFile `
                    -DefaultContainer $defaultBlobContainerName `
                    -DefaultStorageAccountName $defaultStorageAccountName `
                    -DefaultStorageAccountKey $defaultStorageAccountKey `
                    -StatusFolder $jobStatusFolder

    write-Host $response

    ###########################################
    # Submit the Sqoop job
    ###########################################
    $exportDir = "wasb://$defaultBlobContainerName@$defaultStorageAccountName.blob.core.windows.net/tutorials/flightdelays/output"

    $sqoopDef = New-AzureRmHDInsightSqoopJobDefinition `
                    -Command "export --connect $sqlDatabaseConnectionString --table $sqlDatabaseTableName --export-dir $exportDir --fields-terminated-by \001 "
    $sqoopJob = Start-AzureRmHDInsightJob `
                    -ResourceGroupName $resourceGroupName `
                    -ClusterName $hdinsightClusterName `
                    -HttpCredential $httpCredential `
                    -JobDefinition $sqoopDef #-Debug -Verbose

    Wait-AzureRmHDInsightJob `
        -ResourceGroupName $resourceGroupName `
        -ClusterName $HDInsightClusterName `
        -HttpCredential $httpCredential `
        -WaitTimeoutInSeconds 3600 `
        -Job $sqoopJob.JobId

    Get-AzureRmHDInsightJobOutput `
        -ResourceGroupName $resourceGroupName `
        -ClusterName $hdinsightClusterName `
        -HttpCredential $httpCredential `
        -DefaultContainer $existingDefaultBlobContainerName `
        -DefaultStorageAccountName $defaultStorageAccountName `
        -DefaultStorageAccountKey $defaultStorageAccountKey `
        -JobId $sqoopJob.JobId `
        -DisplayOutputType StandardError

    ###########################################
    # Delete the cluster
    ###########################################
    Remove-AzureRmHDInsightCluster -ResourceGroupName $resourceGroupName -ClusterName $hdinsightClusterName
    ```
3. Connect to your SQL database and see average flight delays by city in the AvgDelays table:

    ![HDI.FlightDelays.AvgDelays.Dataset][image-hdi-flightdelays-avgdelays-dataset]

- - -

## <a id="appendix-a"></a>Appendix A - Upload flight delay data to Azure Blob storage
Uploading the data file and the HiveQL script files (see [Appendix B](#appendix-b)) requires some planning. The idea is to store the data files and the HiveQL file before creating an HDInsight cluster and running the Hive job. You have two options:

* **Use the same Azure Storage account that will be used by the HDInsight cluster as the default file system.** Because the HDInsight cluster will have the Storage account access key, you don't need to make any additional changes.
* **Use a different Azure Storage account from the HDInsight cluster default file system.** If this is the case, you must modify the creation part of the Windows PowerShell script found in [Create HDInsight cluster and run Hive/Sqoop jobs](#runjob) to link the Storage account as an additional Storage account. For instructions, see [Create Hadoop clusters in HDInsight][hdinsight-provision]. The HDInsight cluster then knows the access key for the Storage account.

> [!NOTE]
> The Blob storage path for the data file is hard coded in the HiveQL script file. You must update it accordingly.

**To download the flight data**

1. Browse to [Research and Innovative Technology Administration, Bureau of Transportation Statistics][rita-website].
2. On the page, select the following values:

    <table border="1">
    <tr><th>Name</th><th>Value</th></tr>
    <tr><td>Filter Year</td><td>2013 </td></tr>
    <tr><td>Filter Period</td><td>January</td></tr>
    <tr><td>Fields</td><td>*Year*, *FlightDate*, *UniqueCarrier*, *Carrier*, *FlightNum*, *OriginAirportID*, *Origin*, *OriginCityName*, *OriginState*, *DestAirportID*, *Dest*, *DestCityName*, *DestState*, *DepDelayMinutes*, *ArrDelay*, *ArrDelayMinutes*, *CarrierDelay*, *WeatherDelay*, *NASDelay*, *SecurityDelay*, *LateAircraftDelay* (clear all other fields)</td></tr>
    </table>

3. Click **Download**.
4. Unzip the file to the **C:\Tutorials\FlightDelay\2013Data** folder. Each file is a CSV file and is approximately 60GB in size.
5. Rename the file to the name of the month that it contains data for. For example, the file containing the January data would be named *January.csv*.
6. Repeat steps 2 and 5 to download a file for each of the 12 months in 2013. You will need a minimum of one file to run the tutorial.

**To upload the flight delay data to Azure Blob storage**

1. Prepare the parameters:

    <table border="1">
    <tr><th>Variable Name</th><th>Notes</th></tr>
    <tr><td>$storageAccountName</td><td>The Azure Storage account where you want to upload the data to.</td></tr>
    <tr><td>$blobContainerName</td><td>The Blob container where you want to upload the data to.</td></tr>
    </table>
    
2. Open Azure PowerShell ISE.
3. Paste the following script into the script pane:

    ```powershell
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
    $localFolder = "C:\Tutorials\FlightDelay\2013Data"  # The source folder
    $destFolder = "tutorials/flightdelay/2013data"     #The blob name prefix for the files to be uploaded
    #EndRegion

    #Region - Connect to Azure subscription
    Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
    try{Get-AzureRmContext}
    catch{Connect-AzureRmAccount}
    #EndRegion

    #Region - Validate user input
    Write-Host "`nValidating the Azure Storage account and the Blob container..." -ForegroundColor Green
    # Validate the Storage account
    if (-not (Get-AzureRmStorageAccount|Where-Object{$_.StorageAccountName -eq $storageAccountName}))
    {
        Write-Host "The storage account, $storageAccountName, doesn't exist." -ForegroundColor Red
        exit
    }
    else{
        $resourceGroupName = (Get-AzureRmStorageAccount|Where-Object{$_.StorageAccountName -eq $storageAccountName}).ResourceGroupName
    }

    # Validate the container
    $storageAccountKey = (Get-AzureRmStorageAccountKey -StorageAccountName $storageAccountName -ResourceGroupName $resourceGroupName)[0].Value
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

    # List the uploaded files on HDInsight
    Get-AzureStorageBlob -Container $blobContainerName  -Context $storageContext -Prefix $destFolder
    #EndRegion
    ```
4. Press **F5** to run the script.

If you choose to use a different method for uploading the files, please make sure the file path is tutorials/flightdelay/data. The syntax for accessing the files is:

    wasb://<ContainerName>@<StorageAccountName>.blob.core.windows.net/tutorials/flightdelay/data

The path tutorials/flightdelay/data is the virtual folder you created when you uploaded the files. Verify that there are 12 files, one for each month.

> [!NOTE]
> You must update the Hive query to read from the new location.
>
> You must either configure the container access permission to be public or bind the Storage account to the HDInsight cluster. Otherwise, the Hive query string will not be able to access the data files.

- - -

## <a id="appendix-b"></a>Appendix B - Create and upload a HiveQL script
Using Azure PowerShell, you can run multiple HiveQL statements one at a time, or package the HiveQL statement into a script file. This section shows you how to create a HiveQL script and upload the script to Azure Blob storage by using Azure PowerShell. Hive requires the HiveQL scripts to be stored in Azure Blob storage.

The HiveQL script will perform the following:

1. **Drop the delays_raw table**, in case the table already exists.
2. **Create the delays_raw external Hive table** pointing to the Blob storage location with the flight delay files. This query specifies that fields are delimited by "," and that lines are terminated by "\n". This poses a problem when field values contain commas because Hive cannot differentiate between a comma that is a field delimiter and a one that is part of a field value (which is the case in field values for ORIGIN\_CITY\_NAME and DEST\_CITY\_NAME). To address this, the query creates TEMP columns to hold data that is incorrectly split into columns.
3. **Drop the delays table**, in case the table already exists.
4. **Create the delays table**. It is helpful to clean up the data before further processing. This query creates a new table, *delays*, from the delays_raw table. Note that the TEMP columns (as mentioned previously) are not copied, and that the **substring** function is used to remove quotation marks from the data.
5. **Compute the average weather delay and groups the results by city name.** It will also output the results to Blob storage. Note that the query will remove apostrophes from the data and will exclude rows where the value for **weather_delay** is null. This is necessary because Sqoop, used later in this tutorial, doesn't handle those values gracefully by default.

For a full list of the HiveQL commands, see [Hive Data Definition Language][hadoop-hiveql]. Each HiveQL command must terminate with a semicolon.

**To create a HiveQL script file**

1. Prepare the parameters:

    <table border="1">
    <tr><th>Variable Name</th><th>Notes</th></tr>
    <tr><td>$storageAccountName</td><td>The Azure Storage account where you want to upload the HiveQL script to.</td></tr>
    <tr><td>$blobContainerName</td><td>The Blob container where you want to upload the HiveQL script to.</td></tr>
    </table>
    
2. Open Azure PowerShell ISE.  

3. Copy and paste the following script into the script pane:  

    ```powershell
    [CmdletBinding()]
    Param(

        # Azure Blob storage variables
        [Parameter(Mandatory=$True,
                    HelpMessage="Enter the Azure storage account name for creating a new HDInsight cluster. If the account doesn't exist, the script will create one.")]
        [String]$storageAccountName,

        [Parameter(Mandatory=$True,
                    HelpMessage="Enter the Azure blob container name for creating a new HDInsight cluster. If not specified, the HDInsight cluster name will be used.")]
        [String]$blobContainerName
    )

    #region - Define variables
    # Treat all errors as terminating
    $ErrorActionPreference = "Stop"

    # The HiveQL script file is exported as this file before it's uploaded to Blob storage
    $hqlLocalFileName = "e:\tutorials\flightdelay\flightdelays.hql"

    # The HiveQL script file will be uploaded to Blob storage as this blob name
    $hqlBlobName = "tutorials/flightdelay/flightdelays.hql"

    # These two constants are used by the HiveQL script file
    #$srcDataFolder = "tutorials/flightdelay/data"
    $dstDataFolder = "/tutorials/flightdelay/output"
    #endregion

    #Region - Connect to Azure subscription
    Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
    try{Get-AzureRmContext}
    catch{Connect-AzureRmAccount}
    #EndRegion

    #Region - Validate user input
    Write-Host "`nValidating the Azure Storage account and the Blob container..." -ForegroundColor Green
    # Validate the Storage account
    if (-not (Get-AzureRmStorageAccount|Where-Object{$_.StorageAccountName -eq $storageAccountName}))
    {
        Write-Host "The storage account, $storageAccountName, doesn't exist." -ForegroundColor Red
        exit
    }
    else{
        $resourceGroupName = (Get-AzureRmStorageAccount|Where-Object{$_.StorageAccountName -eq $storageAccountName}).ResourceGroupName
    }

    # Validate the container
    $storageAccountKey = (Get-AzureRmStorageAccountKey -StorageAccountName $storageAccountName -ResourceGroupName $resourceGroupName)[0].Value
    $storageContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey

    if (-not (Get-AzureStorageContainer -Context $storageContext |Where-Object{$_.Name -eq $blobContainerName}))
    {
        Write-Host "The Blob container, $blobContainerName, doesn't exist" -ForegroundColor Red
        Exit
    }
    #EngRegion

    #region - Validate the file and file path

    # Check if a file with the same file name already exists on the workstation
    Write-Host "`nvalidating the folder structure on the workstation for saving the HQL script file ..."  -ForegroundColor Green
    if (test-path $hqlLocalFileName){

        $isDelete = Read-Host 'The file, ' $hqlLocalFileName ', exists.  Do you want to overwirte it? (Y/N)'

        if ($isDelete.ToLower() -ne "y")
        {
            Exit
        }
    }

    # Create the folder if it doesn't exist
    $folder = split-path $hqlLocalFileName
    if (-not (test-path $folder))
    {
        Write-Host "`nCreating folder, $folder ..." -ForegroundColor Green

        new-item $folder -ItemType directory
    }
    #end region

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
    $storageAccountKey = (Get-AzureRmStorageAccountKey -StorageAccountName $storageAccountName -ResourceGroupName $resourceGroupName)[0].Value
    $destContext = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey

    # Upload the file from local workstation to Blob storage
    Set-AzureStorageBlobContent -File $hqlLocalFileName -Container $blobContainerName -Blob $hqlBlobName -Context $destContext
    #endregion

    Write-host "`nEnd of the PowerShell script" -ForegroundColor Green
    ```

    Here are the variables used in the script:

   * **$hqlLocalFileName** - The script saves the HiveQL script file locally before uploading it to Blob storage. This is the file name. The default value is <u>C:\tutorials\flightdelay\flightdelays.hql</u>.
   * **$hqlBlobName** - This is the HiveQL script file blob name used in the Azure Blob storage. The default value is tutorials/flightdelay/flightdelays.hql. Because the file will be written directly to Azure Blob storage, there is NOT a "/" at the beginning of the blob name. If you want to access the file from Blob storage, you will need to add a "/" at the beginning of the file name.
   * **$srcDataFolder** and **$dstDataFolder** - = "tutorials/flightdelay/data"
     = "tutorials/flightdelay/output"

- - -
## <a id="appendix-c"></a>Appendix C - Prepare an Azure SQL database for the Sqoop job output
**To prepare the SQL database (merge this with the Sqoop script)**

1. Prepare the parameters:

    <table border="1">
    <tr><th>Variable Name</th><th>Notes</th></tr>
    <tr><td>$sqlDatabaseServerName</td><td>The name of the Azure SQL database server. Enter nothing to create a new server.</td></tr>
    <tr><td>$sqlDatabaseUsername</td><td>The login name for the Azure SQL database server. If $sqlDatabaseServerName is an existing server, the login and login password are used to authenticate with the server. Otherwise they are used to create a new server.</td></tr>
    <tr><td>$sqlDatabasePassword</td><td>The login password for the Azure SQL database server.</td></tr>
    <tr><td>$sqlDatabaseLocation</td><td>This value is used only when you're creating a new Azure database server.</td></tr>
    <tr><td>$sqlDatabaseName</td><td>The SQL database used to create the AvgDelays table for the Sqoop job. Leaving it blank will create a database called HDISqoop. The table name for the Sqoop job output is AvgDelays. </td></tr>
    </table>
    
2. Open Azure PowerShell ISE.

3. Copy and paste the following script into the script pane:  

    ```powershell
    [CmdletBinding()]
    Param(

        # Azure Resource group variables
        [Parameter(Mandatory=$True,
                HelpMessage="Enter the Azure resource group name. It will be created if it doesn't exist.")]
        [String]$resourceGroupName,

        # SQL database server variables
        [Parameter(Mandatory=$True,
                HelpMessage="Enter the Azure SQL Database Server Name. It will be created if it doesn't exist.")]
        [String]$sqlDatabaseServer,

        [Parameter(Mandatory=$True,
                HelpMessage="Enter the Azure SQL Database admin user.")]
        [String]$sqlDatabaseLogin,

        [Parameter(Mandatory=$True,
                HelpMessage="Enter the Azure SQL Database admin user password.")]
        [String]$sqlDatabasePassword,

        [Parameter(Mandatory=$True,
                HelpMessage="Enter the region to create the Database in.")]
        [String]$sqlDatabaseLocation,   #For example, West US.

        # SQL database variables
        [Parameter(Mandatory=$True,
                HelpMessage="Enter the database name. It will be created if it doesn't exist.")]
        [String]$sqlDatabaseName # specify the database name if you have one created. Otherwise use "" to have the script create one for you.
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

    #Region - Connect to Azure subscription
    Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
    try{Get-AzureRmContext}
    catch{Connect-AzureRmAccount}
    #EndRegion

    #region - Create and validate Azure resouce group
    try{
        Get-AzureRmResourceGroup -Name $resourceGroupName
    }
    catch{
        New-AzureRmResourceGroup -Name $resourceGroupName -Location $sqlDatabaseLocation
    }

    #EndRegion

    #region - Create and validate Azure SQL database server
    try{
        Get-AzureRmSqlServer -ServerName $sqlDatabaseServer -ResourceGroupName $resourceGroupName}
    catch{
        Write-Host "`nCreating SQL Database server ..."  -ForegroundColor Green

        $sqlDatabasePW = ConvertTo-SecureString -String $sqlDatabasePassword -AsPlainText -Force
        $credential = New-Object System.Management.Automation.PSCredential($sqlDatabaseLogin,$sqlDatabasePW)

        $sqlDatabaseServer = (New-AzureRmSqlServer -ResourceGroupName $resourceGroupName -ServerName $sqlDatabaseServer -SqlAdministratorCredentials $credential -Location $sqlDatabaseLocation).ServerName
        Write-Host "`tThe new SQL database server name is $sqlDatabaseServer." -ForegroundColor Cyan

        Write-Host "`nCreating firewall rule, $fireWallRuleName ..." -ForegroundColor Green
        $workstationIPAddress = Invoke-RestMethod $ipAddressRestService
        New-AzureRmSqlServerFirewallRule -ResourceGroupName $resourceGroupName -ServerName $sqlDatabaseServer -FirewallRuleName "$fireWallRuleName-workstation" -StartIpAddress $workstationIPAddress -EndIpAddress $workstationIPAddress

        #To allow other Azure services to access the server add a firewall rule and set both the StartIpAddress and EndIpAddress to 0.0.0.0. Note that this allows Azure traffic from any Azure subscription to access the server.
        New-AzureRmSqlServerFirewallRule -ResourceGroupName $resourceGroupName -ServerName $sqlDatabaseServer -FirewallRuleName "$fireWallRuleName-Azureservices" -StartIpAddress "0.0.0.0" -EndIpAddress "0.0.0.0"
    }

    #endregion

    #region - Create and validate Azure SQL database

    try {
        Get-AzureRmSqlDatabase -ResourceGroupName $resourceGroupName -ServerName $sqlDatabaseServer -DatabaseName $sqlDatabaseName
    }
    catch {
        Write-Host "`nCreating SQL Database, $sqlDatabaseName ..."  -ForegroundColor Green
        New-AzureRMSqlDatabase -ResourceGroupName $resourceGroupName -ServerName $sqlDatabaseServer -DatabaseName $sqlDatabaseName -Edition "Standard" -RequestedServiceObjectiveName "S1"
    }

    #endregion

    #region -  Execute an SQL command to create the AvgDelays table

    Write-Host "`nCreating SQL Database table ..."  -ForegroundColor Green
    $conn = New-Object System.Data.SqlClient.SqlConnection
    $conn.ConnectionString = "Data Source=$sqlDatabaseServer.database.windows.net;Initial Catalog=$sqlDatabaseName;User ID=$sqlDatabaseLogin;Password=$sqlDatabasePassword;Encrypt=true;Trusted_Connection=false;"
    $conn.open()
    $cmd = New-Object System.Data.SqlClient.SqlCommand
    $cmd.connection = $conn
    $cmd.commandtext = $sqlCreateAvgDelaysTable
    $cmd.executenonquery()

    $conn.close()

    Write-host "`nEnd of the PowerShell script" -ForegroundColor Green
    ```

   > [!NOTE]
   > The script uses a representational state transfer (REST) service, http://bot.whatismyipaddress.com, to retrieve your external IP address. The IP address is used for creating a firewall rule for your SQL database server.

    Here are some variables used in the script:

   * **$ipAddressRestService** - The default value is http://bot.whatismyipaddress.com. It is a public IP address REST service for getting your external IP address. You can use other services if you want. The external IP address retrieved through the service will be used to create a firewall rule for your Azure SQL database server, so that you can access the database from your workstation (by using a Windows PowerShell script).
   * **$fireWallRuleName** - This is the name of the firewall rule for the Azure SQL database server. The default name is <u>FlightDelay</u>. You can rename it if you want.
   * **$sqlDatabaseMaxSizeGB** - This value is used only when you're creating a new Azure SQL database server. The default value is 10GB. 10GB is sufficient for this tutorial.
   * **$sqlDatabaseName** - This value is used only when you're creating a new Azure SQL database. The default value is HDISqoop. If you rename it, you must update the Sqoop Windows PowerShell script accordingly.
4. Press **F5** to run the script.
5. Validate the script output. Make sure the script ran successfully.

## <a id="nextsteps"></a> Next steps
Now you understand how to upload a file to Azure Blob storage, how to populate a Hive table by using the data from Azure Blob storage, how to run Hive queries, and how to use Sqoop to export data from HDFS to an Azure SQL database. To learn more, see the following articles:

* [Get started with HDInsight][hdinsight-get-started]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Oozie with HDInsight][hdinsight-use-oozie]
* [Use Sqoop with HDInsight][hdinsight-use-sqoop]
* [Use Pig with HDInsight][hdinsight-use-pig]
* [Develop Java MapReduce programs for HDInsight][hdinsight-develop-mapreduce]

[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[rita-website]: http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time
[powershell-install-configure]: /powershell/azureps-cmdlets-docs

[hdinsight-use-oozie]: hdinsight-use-oozie.md
[hdinsight-use-hive]:hadoop/hdinsight-use-hive.md
[hdinsight-provision]: hdinsight-hadoop-provision-linux-clusters.md
[hdinsight-storage]: hdinsight-hadoop-use-blob-storage.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-get-started]:hadoop/apache-hadoop-linux-tutorial-get-started.md
[hdinsight-use-sqoop]:hadoop/hdinsight-use-sqoop.md
[hdinsight-use-pig]:hadoop/hdinsight-use-pig.md
[hdinsight-develop-mapreduce]:hadoop/apache-hadoop-develop-deploy-java-mapreduce-linux.md

[hadoop-hiveql]: https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL
[hadoop-shell-commands]: http://hadoop.apache.org/docs/r0.18.3/hdfs_shell.html

[technetwiki-hive-error]: http://social.technet.microsoft.com/wiki/contents/articles/23047.hdinsight-hive-error-unable-to-rename.aspx

[image-hdi-flightdelays-avgdelays-dataset]: ./media/hdinsight-analyze-flight-delay-data/HDI.FlightDelays.AvgDelays.DataSet.png
[img-hdi-flightdelays-run-hive-job-output]: ./media/hdinsight-analyze-flight-delay-data/HDI.FlightDelays.RunHiveJob.Output.png
[img-hdi-flightdelays-flow]: ./media/hdinsight-analyze-flight-delay-data/HDI.FlightDelays.Flow.png
