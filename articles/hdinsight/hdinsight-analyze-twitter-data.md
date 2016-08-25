<properties
	pageTitle="Analyze Twitter data with Hadoop in HDInsight | Microsoft Azure"
	description="Learn how to use Hive to analyze Twitter data on Hadoop in HDInsight to find the usage frequency of a particular word."
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
	ms.date="07/25/2016"
	ms.author="jgao"/>

# Analyze Twitter data using Hive in HDInsight

Social websites are one of the major driving forces for big-data adoption. Public APIs provided 
by sites like Twitter are a useful source of data for analyzing and understanding popular trends. 
In this tutorial, you will get tweets by using a Twitter streaming API, and then use Apache Hive 
on Azure HDInsight to get a list of Twitter users who sent the most tweets that contained a certain word.

> [AZURE.NOTE] The steps in this document require a Windows-based HDInsight cluster. For steps specific 
to a Linux-based cluster, see [Analyze Twitter data using Hive in HDInsight (Linux)](hdinsight-analyze-twitter-data-linux.md).


##Prerequisites

Before you begin this tutorial, you must have the following:

- **A workstation** with Azure PowerShell installed and configured. 

    To execute Windows PowerShell scripts, you must run Azure PowerShell as administrator and set the execution policy to *RemoteSigned*. See [Run Windows PowerShell scripts][powershell-script].

    Before running Windows PowerShell scripts, make sure you are connected to your Azure subscription by using the following cmdlet:

        Login-AzureRmAccount

    If you have multiple Azure subscriptions, use the following cmdlet to set the current subscription:

        Select-AzureRmSubscription -SubscriptionID <Azure Subscription ID>

	[AZURE.INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]

- **An Azure HDInsight cluster**. For instructions on cluster provisioning, see [Get started using HDInsight][hdinsight-get-started] or [Provision HDInsight clusters] [hdinsight-provision]. You will need the cluster name later in the tutorial.

The following table lists the files used in this tutorial:

Files|Description
---|---
/tutorials/twitter/data/tweets.txt|The source data for the Hive job.
/tutorials/twitter/output|The output folder for the Hive job. The default Hive job output file name is **000000_0**.
tutorials/twitter/twitter.hql|The HiveQL script file.
/tutorials/twitter/jobstatus|The Hadoop job status.


##Get Twitter feed

In this tutorial, you will use the [Twitter streaming APIs][twitter-streaming-api]. The specific Twitter streaming API you will use is [statuses/filter][twitter-statuses-filter].

>[AZURE.NOTE] A file containing 10,000 tweets and the Hive script file (covered in the next section) have been uploaded in a public Blob container. You can skip this section if you want to use the uploaded files.

[Tweets data](https://dev.twitter.com/docs/platform-objects/tweets) is stored in the JavaScript Object Notation (JSON) format that contains a complex nested structure. Instead of writing many lines of code by using a conventional programming language, you can transform this nested structure into a Hive table, so that it can be queried by a Structured Query Language (SQL)-like language called HiveQL.

Twitter uses OAuth to provide authorized access to its API. OAuth is an authentication protocol that allows users to approve applications to act on their behalf without sharing their password. More information can be found at [oauth.net](http://oauth.net/) or in the excellent [Beginner's Guide to OAuth](http://hueniverse.com/oauth/) from Hueniverse.

The first step to use OAuth is to create a new application on the Twitter Developer site.

**To create a Twitter application**

1. Sign in to [https://apps.twitter.com/](https://apps.twitter.com/). Click the **Sign up now** link if you don't have a Twitter account.
2. Click **Create New App**.
3. Enter **Name**, **Description**, **Website**. You can make up a URL for the **Website** field. The following table shows some sample values to use:

	Field|Value
	---|---
	Name|MyHDInsightApp
	Description|MyHDInsightApp
	Website|http://www.myhdinsightapp.com

4. Check **Yes, I agree**, and then click **Create your Twitter application**.
5. Click the **Permissions** tab. The default permission is **Read only**. This is sufficient for this tutorial.
6. Click the **Keys and Access Tokens** tab.
7. Click **Create my access token**.
8. Click **Test OAuth** in the upper-right corner of the page.
9. Write down **consumer key**, **Consumer secret**, **Access token**, and **Access token secret**. You will need the values later in the tutorial.

In this tutorial, you will use Windows PowerShell to make the web service call. For a .NET C# sample, see [Analyze real-time Twitter sentiment with HBase in HDInsight][hdinsight-hbase-twitter-sentiment]. The other popular tool to make web service calls is [*Curl*][curl]. Curl can be downloaded from [here][curl-download].

>[AZURE.NOTE] When you use the curl command in Windows, use double quotes instead of single quotes for the option values.

**To get tweets**

1. Open the Windows PowerShell Integrated Scripting Environment (ISE). (On the Windows 8 Start screen, type **PowerShell_ISE** and then click **Windows PowerShell ISE**. See [Start Windows PowerShell on Windows 8 and Windows][powershell-start].)

2. Copy the following script into the script pane:

		#region - variables and constants
		$clusterName = "<HDInsightClusterName>" # Enter the HDInsight cluster name

		# Enter the OAuth information for your Twitter application
		$oauth_consumer_key = "<TwitterAppConsumerKey>";
		$oauth_consumer_secret = "<TwitterAppConsumerSecret>";
		$oauth_token = "<TwitterAppAccessToken>";
		$oauth_token_secret = "<TwitterAppAccessTokenSecret>";

		$destBlobName = "tutorials/twitter/data/tweets.txt" # This script saves the tweets into this blob.

		$trackString = "Azure, Cloud, HDInsight" # This script gets the tweets containing these keywords.
		$track = [System.Uri]::EscapeDataString($trackString);
		$lineMax = 10000  # The script will get this number of tweets. It is about 3 minutes every 100 lines.
		#endregion

		#region - Connect to Azure subscription
		Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
		Login-AzureRmAccount
		#endregion

		#region - Create a block blob object for writing tweets into Blob storage
		Write-Host "Get the default storage account name and Blob container name using the cluster name ..." -ForegroundColor Green
		$myCluster = Get-AzureRmHDInsightCluster -Name $clusterName
		$resourceGroupName = $myCluster.ResourceGroup
		$storageAccountName = $myCluster.DefaultStorageAccount.Replace(".blob.core.windows.net", "")
		$containerName = $myCluster.DefaultStorageContainer
		Write-Host "`tThe storage account name is $storageAccountName." -ForegroundColor Yellow
		Write-Host "`tThe blob container name is $containerName." -ForegroundColor Yellow

		Write-Host "Define the Azure storage connection string ..." -ForegroundColor Green
		$storageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName)[0].Value
		$storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=$storageAccountName;AccountKey=$storageAccountKey"
		Write-Host "`tThe connection string is $storageConnectionString." -ForegroundColor Yellow

		Write-Host "Create block blob object ..." -ForegroundColor Green
		$storageAccount = [Microsoft.WindowsAzure.Storage.CloudStorageAccount]::Parse($storageConnectionString)
		$storageClient = $storageAccount.CreateCloudBlobClient();
		$storageContainer = $storageClient.GetContainerReference($containerName)
		$destBlob = $storageContainer.GetBlockBlobReference($destBlobName)
		#end region

		# region - Format OAuth strings
		Write-Host "Format oauth strings ..." -ForegroundColor Green
		$oauth_nonce = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes([System.DateTime]::Now.Ticks.ToString()));
		$ts = [System.DateTime]::UtcNow - [System.DateTime]::ParseExact("01/01/1970", "dd/MM/yyyy", $null)
		$oauth_timestamp = [System.Convert]::ToInt64($ts.TotalSeconds).ToString();

		$signature = "POST&";
		$signature += [System.Uri]::EscapeDataString("https://stream.twitter.com/1.1/statuses/filter.json") + "&";
		$signature += [System.Uri]::EscapeDataString("oauth_consumer_key=" + $oauth_consumer_key + "&");
		$signature += [System.Uri]::EscapeDataString("oauth_nonce=" + $oauth_nonce + "&");
		$signature += [System.Uri]::EscapeDataString("oauth_signature_method=HMAC-SHA1&");
		$signature += [System.Uri]::EscapeDataString("oauth_timestamp=" + $oauth_timestamp + "&");
		$signature += [System.Uri]::EscapeDataString("oauth_token=" + $oauth_token + "&");
		$signature += [System.Uri]::EscapeDataString("oauth_version=1.0&");
		$signature += [System.Uri]::EscapeDataString("track=" + $track);

		$signature_key = [System.Uri]::EscapeDataString($oauth_consumer_secret) + "&" + [System.Uri]::EscapeDataString($oauth_token_secret);

		$hmacsha1 = new-object System.Security.Cryptography.HMACSHA1;
		$hmacsha1.Key = [System.Text.Encoding]::ASCII.GetBytes($signature_key);
		$oauth_signature = [System.Convert]::ToBase64String($hmacsha1.ComputeHash([System.Text.Encoding]::ASCII.GetBytes($signature)));

		$oauth_authorization = 'OAuth ';
		$oauth_authorization += 'oauth_consumer_key="' + [System.Uri]::EscapeDataString($oauth_consumer_key) + '",';
		$oauth_authorization += 'oauth_nonce="' + [System.Uri]::EscapeDataString($oauth_nonce) + '",';
		$oauth_authorization += 'oauth_signature="' + [System.Uri]::EscapeDataString($oauth_signature) + '",';
		$oauth_authorization += 'oauth_signature_method="HMAC-SHA1",'
		$oauth_authorization += 'oauth_timestamp="' + [System.Uri]::EscapeDataString($oauth_timestamp) + '",'
		$oauth_authorization += 'oauth_token="' + [System.Uri]::EscapeDataString($oauth_token) + '",';
		$oauth_authorization += 'oauth_version="1.0"';

		$post_body = [System.Text.Encoding]::ASCII.GetBytes("track=" + $track);
		#endregion

		#region - Read tweets
		Write-Host "Create HTTP web request ..." -ForegroundColor Green
		[System.Net.HttpWebRequest] $request = [System.Net.WebRequest]::Create("https://stream.twitter.com/1.1/statuses/filter.json");
		$request.Method = "POST";
		$request.Headers.Add("Authorization", $oauth_authorization);
		$request.ContentType = "application/x-www-form-urlencoded";
		$body = $request.GetRequestStream();

		$body.write($post_body, 0, $post_body.length);
		$body.flush();
		$body.close();
		$response = $request.GetResponse() ;

		Write-Host "Start stream reading ..." -ForegroundColor Green

		Write-Host "Define a MemoryStream and a StreamWriter for writing ..." -ForegroundColor Green
		$memStream = New-Object System.IO.MemoryStream
		$writeStream = New-Object System.IO.StreamWriter $memStream

		$sReader = New-Object System.IO.StreamReader($response.GetResponseStream())

		$inrec = $sReader.ReadLine()
		$count = 0
		while (($inrec -ne $null) -and ($count -le $lineMax))
		{
			if ($inrec -ne "")
			{
				Write-Host "`n`t $count tweets received." -ForegroundColor Yellow

				$writeStream.WriteLine($inrec)
				$count ++
			}

			$inrec=$sReader.ReadLine()
		}
		#endregion

		#region - Write tweets to Blob storage
		Write-Host "Write to the destination blob ..." -ForegroundColor Green
		$writeStream.Flush()
		$memStream.Seek(0, "Begin")
		$destBlob.UploadFromStream($memStream)

		$sReader.close()
		#endregion

		Write-Host "Completed!" -ForegroundColor Green

3. Set the first five to eight variables in the script:


	Variable|Description
	---|---
	$clusterName|This is the name of the HDInsight cluster where you want to run the application.
	$oauth_consumer_key|This is the Twitter application **consumer key** you wrote down earlier when you created the Twitter application.
	$oauth_consumer_secret|This is the Twitter application **consumer secret** you wrote down earlier.
	$oauth_token|This is the Twitter application **access token** you wrote down earlier.
	$oauth_token_secret|This is the Twitter application **access token secret** you wrote down earlier.
	$destBlobName|This is the output blob name. The default value is **tutorials/twitter/data/tweets.txt**. If you change the default value, you will need to update the Windows PowerShell scripts accordingly.
	$trackString|The web service will return tweets related to these keywords. The default value is **Azure, Cloud, HDInsight**. If you change the default value, you will update the Windows PowerShell scripts accordingly.
	$lineMax|The value determines how many tweets the script will read. It takes about three minutes to read 100 tweets. You can set a larger number, but it will take more time to download.

5. Press **F5** to run the script. If you run into problems, as a workaround, select all the lines, and then press **F8**.
6. You shall see "Complete!" at the end of the output. Any error messages will be displayed in red.

As a validation procedure, you can check the output file, **/tutorials/twitter/data/tweets.txt**, on your Azure Blob storage by using an Azure storage explorer or Azure PowerShell. For a sample Windows PowerShell script for listing files, see [Use Blob storage with HDInsight][hdinsight-storage-powershell].



##Create HiveQL script

Using Azure PowerShell, you can run multiple HiveQL statements one at a time, or package the HiveQL statement into a script file. In this tutorial, you will create a HiveQL script. The script file must be uploaded to Azure Blob storage. In the next section, you will run the script file by using Azure PowerShell.

>[AZURE.NOTE] The Hive script file and a file containing 10,000 tweets have been uploaded in a public Blob container. You can skip this section if you want to use the uploaded files.

The HiveQL script will perform the following:

1. **Drop the tweets_raw table** in case the table already exists.
2. **Create the tweets_raw Hive table**. This temporary Hive structured table holds the data for further extract, transform, and load (ETL) processing. For information on partitions, see [Hive tutorial][apache-hive-tutorial].  
3. **Load data** from the source folder, /tutorials/twitter/data. The large tweets dataset in nested JSON format has now been transformed into a temporary Hive table structure.
3. **Drop the tweets table** in case the table already exists.
4. **Create the tweets table**. Before you can query against the tweets dataset by using Hive, you need to run another ETL process. This ETL process defines a more detailed table schema for the data that you have stored in the "twitter_raw" table.  
5. **Insert overwrite table**. This complex Hive script will kick off a set of long MapReduce jobs by the Hadoop cluster. Depending on your dataset and the size of your cluster, this could take about 10 minutes.
6. **Insert overwrite directory**. Run a query and output the dataset to a file. This query will return a list of Twitter users who sent most tweets that contained the word "Azure".

**To create a Hive script and upload it to Azure**

1. Open Windows PowerShell ISE.
2. Copy the following script into the script pane:

		#region - variables and constants
		$clusterName = "<Existing HDInsight Cluster Name>" # Enter your HDInsight cluster name
		$subscriptionID = "<Azure Subscription ID>"
		
		$sourceDataPath = "/tutorials/twitter/data"
		$outputPath = "/tutorials/twitter/output"
		$hqlScriptFile = "tutorials/twitter/twitter.hql"
		
		$hqlStatements = @"
		set hive.exec.dynamic.partition = true;
		set hive.exec.dynamic.partition.mode = nonstrict;
		
		DROP TABLE tweets_raw;
		CREATE EXTERNAL TABLE tweets_raw (
			json_response STRING
		)
		STORED AS TEXTFILE LOCATION '$sourceDataPath';
		
		DROP TABLE tweets;
		CREATE TABLE tweets
		(
			id BIGINT,
			created_at STRING,
			created_at_date STRING,
			created_at_year STRING,
			created_at_month STRING,
			created_at_day STRING,
			created_at_time STRING,
			in_reply_to_user_id_str STRING,
			text STRING,
			contributors STRING,
			retweeted STRING,
			truncated STRING,
			coordinates STRING,
			source STRING,
			retweet_count INT,
			url STRING,
			hashtags array<STRING>,
			user_mentions array<STRING>,
			first_hashtag STRING,
			first_user_mention STRING,
			screen_name STRING,
			name STRING,
			followers_count INT,
			listed_count INT,
			friends_count INT,
			lang STRING,
			user_location STRING,
			time_zone STRING,
			profile_image_url STRING,
			json_response STRING
		);
		
		FROM tweets_raw
		INSERT OVERWRITE TABLE tweets
		SELECT
			cast(get_json_object(json_response, '$.id_str') as BIGINT),
			get_json_object(json_response, '$.created_at'),
			concat(substr (get_json_object(json_response, '$.created_at'),1,10),' ',
			substr (get_json_object(json_response, '$.created_at'),27,4)),
			substr (get_json_object(json_response, '$.created_at'),27,4),
			case substr (get_json_object(json_response, '$.created_at'),5,3)
				when "Jan" then "01"
				when "Feb" then "02"
				when "Mar" then "03"
				when "Apr" then "04"
				when "May" then "05"
				when "Jun" then "06"
				when "Jul" then "07"
				when "Aug" then "08"
				when "Sep" then "09"
				when "Oct" then "10"
				when "Nov" then "11"
				when "Dec" then "12" end,
			substr (get_json_object(json_response, '$.created_at'),9,2),
			substr (get_json_object(json_response, '$.created_at'),12,8),
			get_json_object(json_response, '$.in_reply_to_user_id_str'),
			get_json_object(json_response, '$.text'),
			get_json_object(json_response, '$.contributors'),
			get_json_object(json_response, '$.retweeted'),
			get_json_object(json_response, '$.truncated'),
			get_json_object(json_response, '$.coordinates'),
			get_json_object(json_response, '$.source'),
			cast (get_json_object(json_response, '$.retweet_count') as INT),
			get_json_object(json_response, '$.entities.display_url'),
			array(
				trim(lower(get_json_object(json_response, '$.entities.hashtags[0].text'))),
				trim(lower(get_json_object(json_response, '$.entities.hashtags[1].text'))),
				trim(lower(get_json_object(json_response, '$.entities.hashtags[2].text'))),
				trim(lower(get_json_object(json_response, '$.entities.hashtags[3].text'))),
				trim(lower(get_json_object(json_response, '$.entities.hashtags[4].text')))),
			array(
				trim(lower(get_json_object(json_response, '$.entities.user_mentions[0].screen_name'))),
				trim(lower(get_json_object(json_response, '$.entities.user_mentions[1].screen_name'))),
				trim(lower(get_json_object(json_response, '$.entities.user_mentions[2].screen_name'))),
				trim(lower(get_json_object(json_response, '$.entities.user_mentions[3].screen_name'))),
				trim(lower(get_json_object(json_response, '$.entities.user_mentions[4].screen_name')))),
			trim(lower(get_json_object(json_response, '$.entities.hashtags[0].text'))),
			trim(lower(get_json_object(json_response, '$.entities.user_mentions[0].screen_name'))),
			get_json_object(json_response, '$.user.screen_name'),
			get_json_object(json_response, '$.user.name'),
			cast (get_json_object(json_response, '$.user.followers_count') as INT),
			cast (get_json_object(json_response, '$.user.listed_count') as INT),
			cast (get_json_object(json_response, '$.user.friends_count') as INT),
			get_json_object(json_response, '$.user.lang'),
			get_json_object(json_response, '$.user.location'),
			get_json_object(json_response, '$.user.time_zone'),
			get_json_object(json_response, '$.user.profile_image_url'),
			json_response
		WHERE (length(json_response) > 500);
		
		INSERT OVERWRITE DIRECTORY '$outputPath'
		SELECT name, screen_name, count(1) as cc
			FROM tweets
			WHERE text like "%Azure%"
			GROUP BY name,screen_name
			ORDER BY cc DESC LIMIT 10;
		"@
		#endregion
		
		#region - Connect to Azure subscription
		Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
		
		Try{
			Get-AzureRmSubscription
		}
		Catch{
			Login-AzureRmAccount
		}
		
		Select-AzureRmSubscription -SubscriptionId $subscriptionID
		
		#endregion
		
		#region - Create a block blob object for writing the Hive script file
		Write-Host "Get the default storage account name and container name based on the cluster name ..." -ForegroundColor Green
		$myCluster = Get-AzureRmHDInsightCluster -ClusterName $clusterName
		$resourceGroupName = $myCluster.ResourceGroup
		$defaultStorageAccountName = $myCluster.DefaultStorageAccount.Replace(".blob.core.windows.net", "")
		$defaultBlobContainerName = $myCluster.DefaultStorageContainer
		Write-Host "`tThe storage account name is $defaultStorageAccountName." -ForegroundColor Yellow
		Write-Host "`tThe blob container name is $defaultBlobContainerName." -ForegroundColor Yellow
		
		Write-Host "Define the connection string ..." -ForegroundColor Green
		$defaultStorageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $resourceGroupName -Name $defaultStorageAccountName)[0].Value
		$storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=$defaultStorageAccountName;AccountKey=$defaultStorageAccountKey"
		
		Write-Host "Create block blob objects referencing the hql script file" -ForegroundColor Green
		$storageAccount = [Microsoft.WindowsAzure.Storage.CloudStorageAccount]::Parse($storageConnectionString)
		$storageClient = $storageAccount.CreateCloudBlobClient();
		$storageContainer = $storageClient.GetContainerReference($defaultBlobContainerName)
		$hqlScriptBlob = $storageContainer.GetBlockBlobReference($hqlScriptFile)
		
		Write-Host "Define a MemoryStream and a StreamWriter for writing ... " -ForegroundColor Green
		$memStream = New-Object System.IO.MemoryStream
		$writeStream = New-Object System.IO.StreamWriter $memStream
		$writeStream.Writeline($hqlStatements)
		#endregion
		
		#region - Write the Hive script file to Blob storage
		Write-Host "Write to the destination blob ... " -ForegroundColor Green
		$writeStream.Flush()
		$memStream.Seek(0, "Begin")
		$hqlScriptBlob.UploadFromStream($memStream)
		#endregion
		
		Write-Host "Completed!" -ForegroundColor Green

		

4. Set the first two variables in the script:

	Variable|Description
	---|---
	$clusterName|Enter the HDInsight cluster name where you want to run the application.
	$subscriptionID|Enter your Azure subscription ID.
	$sourceDataPath|The Azure Blob storage location where the Hive queries will read the data from. You don't need to change this variable.
	$outputPath|The Azure Blob storage location where the Hive queries will output the results. You don't need to change this variable.
	$hqlScriptFile|The location and the file name of the HiveQL script file. You don't need to change this variable.

5. Press **F5** to run the script. If you run into problems, as a workaround, select all the lines, and then press **F8**.
6. You shall see "Complete!" at the end of the output. Any error messages will be displayed in red.

As a validation procedure, you can check the output file, **/tutorials/twitter/twitter.hql**, on your Azure Blob storage by using an Azure storage explorer or Azure PowerShell. For a sample Windows PowerShell script for listing files, see [Use Blob storage with HDInsight][hdinsight-storage-powershell].  


##Process Twitter data by using Hive

You have finished all the preparation work. Now, you can invoke the Hive script and check the results.

### Submit a Hive job

Use the following Windows PowerShell script to run the Hive script. You will need to set the first variable.

>[AZURE.NOTE] To use the tweets and the HiveQL script you uploaded in the last two sections, set $hqlScriptFile to "/tutorials/twitter/twitter.hql". To use the ones that have been uploaded to a public blob for you, set $hqlScriptFile to "wasbs://twittertrend@hditutorialdata.blob.core.windows.net/twitter.hql".

	#region variables and constants
	$clusterName = "<Existing Azure HDInsight Cluster Name>"
	$httpUserName = "admin"
	$httpUserPassword = "<HDInsight Cluster HTTP User Password>"
	
	#use one of the following
	$hqlScriptFile = "wasbs://twittertrend@hditutorialdata.blob.core.windows.net/twitter.hql"
	$hqlScriptFile = "/tutorials/twitter/twitter.hql"
	
	$statusFolder = "/tutorials/twitter/jobstatus"
	#endregion
	
	$myCluster = Get-AzureRmHDInsightCluster -ClusterName $clusterName
	$resourceGroupName = $myCluster.ResourceGroup
	$defaultStorageAccountName = $myCluster.DefaultStorageAccount.Replace(".blob.core.windows.net", "")
	$defaultStorageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $resourceGroupName -Name $defaultStorageAccountName)[0].Value
	
	$defaultBlobContainerName = $myCluster.DefaultStorageContainer
	
	
	#region - Invoke Hive
	Write-Host "Invoke Hive ... " -ForegroundColor Green
	
	# Create the HDInsight cluster
	$pw = ConvertTo-SecureString -String $httpUserPassword -AsPlainText -Force
	$httpCredential = New-Object System.Management.Automation.PSCredential($httpUserName,$pw)
	
	Use-AzureRmHDInsightCluster -ResourceGroupName $resourceGroupName -ClusterName $clusterName -HttpCredential $httpCredential 
	$response = Invoke-AzureRmHDInsightHiveJob -DefaultStorageAccountName $defaultStorageAccountName -DefaultStorageAccountKey $defaultStorageAccountKey -DefaultContainer $defaultBlobContainerName -file $hqlScriptFile -StatusFolder $statusFolder #-OutVariable $outVariable
	
	Write-Host "Display the standard error log ... " -ForegroundColor Green
	$jobID = ($response | Select-String job_ | Select-Object -First 1) -replace ‘\s*$’ -replace ‘.*\s’
	Get-AzureRmHDInsightJobOutput -ClusterName $clusterName -JobId $jobID -DefaultContainer $defaultBlobContainerName -DefaultStorageAccountName $defaultStorageAccountName -DefaultStorageAccountKey $defaultStorageAccountKey -HttpCredential $httpCredential
	#endregion

### Check the results

Use the following Windows PowerShell script to check the Hive job output. You will need to set the first two variables.

	#region variables and constants
	$clusterName = "<Existing Azure HDInsight Cluster Name>"
	
	$blob = "tutorials/twitter/output/000000_0" # The name of the blob to be downloaded.
	#engregion
	
	#region - Create an Azure storage context object
	Write-Host "Get the default storage account name and container name based on the cluster name ..." -ForegroundColor Green
	$myCluster = Get-AzureRmHDInsightCluster -ClusterName $clusterName
	$resourceGroupName = $myCluster.ResourceGroup
	$defaultStorageAccountName = $myCluster.DefaultStorageAccount.Replace(".blob.core.windows.net", "")
	$defaultStorageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $resourceGroupName -Name $defaultStorageAccountName)[0].Value
	$defaultBlobContainerName = $myCluster.DefaultStorageContainer
	
	Write-Host "`tThe storage account name is $defaultStorageAccountName." -ForegroundColor Yellow
	Write-Host "`tThe blob container name is $defaultBlobContainerName." -ForegroundColor Yellow
	
	Write-Host "Create a context object ... " -ForegroundColor Green
	$storageContext = New-AzureStorageContext -StorageAccountName $defaultStorageAccountName -StorageAccountKey $defaultStorageAccountKey  
	#endregion
	
	#region - Download blob and display blob
	Write-Host "Download the blob ..." -ForegroundColor Green
	cd $HOME
	Get-AzureStorageBlobContent -Container $defaultBlobContainerName -Blob $blob -Context $storageContext -Force
	
	Write-Host "Display the output ..." -ForegroundColor Green
	Write-Host "==================================" -ForegroundColor Green
	cat "./$blob"
	Write-Host "==================================" -ForegroundColor Green
	#end region

> [AZURE.NOTE] The Hive table uses \001 as the field delimiter. The delimiter is not visible in the output.

After the analysis results have been placed in Azure Blob storage, you can export the data to an Azure SQL database/SQL server, export the data to Excel by using Power Query, or connect your application to the data by using the Hive ODBC Driver. For more information, see [Use Sqoop with HDInsight][hdinsight-use-sqoop], [Analyze flight delay data using HDInsight][hdinsight-analyze-flight-delay-data], [Connect Excel to HDInsight with Power Query][hdinsight-power-query], and [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver][hdinsight-hive-odbc].

##Next steps

In this tutorial we have seen how to transform an unstructured JSON dataset into a structured Hive table to query, explore, and analyze data from Twitter by using HDInsight on Azure. To learn more, see:

- [Get started with HDInsight][hdinsight-get-started]
- [Analyze real-time Twitter sentiment with HBase in HDInsight][hdinsight-hbase-twitter-sentiment]
- [Analyze flight delay data using HDInsight][hdinsight-analyze-flight-delay-data]
- [Connect Excel to HDInsight with Power Query][hdinsight-power-query]
- [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver][hdinsight-hive-odbc]
- [Use Sqoop with HDInsight][hdinsight-use-sqoop]

[curl]: http://curl.haxx.se
[curl-download]: http://curl.haxx.se/download.html

[apache-hive-tutorial]: https://cwiki.apache.org/confluence/display/Hive/Tutorial

[twitter-streaming-api]: https://dev.twitter.com/docs/streaming-apis
[twitter-statuses-filter]: https://dev.twitter.com/docs/api/1.1/post/statuses/filter

[powershell-start]: http://technet.microsoft.com/library/hh847889.aspx
[powershell-install]: powershell-install-configure.md
[powershell-script]: http://technet.microsoft.com/library/ee176961.aspx


[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-get-started]: hdinsight-hadoop-linux-tutorial-get-started.md
[hdinsight-storage-powershell]: ../hdinsight-hadoop-use-blob-storage.md#powershell
[hdinsight-analyze-flight-delay-data]: hdinsight-analyze-flight-delay-data.md
[hdinsight-storage]: ../hdinsight-hadoop-use-blob-storage.md
[hdinsight-use-sqoop]: hdinsight-use-sqoop.md
[hdinsight-power-query]: hdinsight-connect-excel-power-query.md
[hdinsight-hive-odbc]: hdinsight-connect-excel-hive-ODBC-driver.md
[hdinsight-hbase-twitter-sentiment]: hdinsight-hbase-analyze-twitter-sentiment.md
