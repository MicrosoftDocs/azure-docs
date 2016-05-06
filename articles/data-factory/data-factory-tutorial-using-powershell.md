<properties 
	pageTitle="Move and process log files using Azure Data Factory (Azure PowerShell)" 
	description="This advanced tutorial describes a near real-world scenario and implements the scenario using Azure Data Factory service and Azure PowerShell." 
	services="data-factory" 
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/01/2016" 
	ms.author="spelluru"/>

# Tutorial: Move and process log files using Data Factory (PowerShell)
This article provides an end-to-end walkthrough of a canonical scenario of log processing using Azure Data Factory to transform data from log files into insights.

## Scenario
Contoso is a gaming company that creates games for multiple platforms: game consoles, hand held devices, and personal computers (PCs). Each of these games produces tons of logs. Contoso’s goal is to collect and analyze the logs produced by these games to get usage information, identify up-sell and cross-sell opportunities, develop new compelling features etc. to improve business and provide better experience to customers.
 
In this walkthrough, we will collect sample logs, process and enrich them with reference data, and transform the data to evaluate the effectiveness of a marketing campaign that Contoso has recently launched.

## Prerequisites
1.	Read [Introduction to Azure Data Factory][adfintroduction] to get an overview of Azure Data Factory and understanding of the top level concepts.
2.	You must have an Azure subscription to perform this tutorial. For information about obtaining a subscription, see [Purchase Options] [azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].
3.	You must download and install [Azure PowerShell][download-azure-powershell] on your computer.

	This article does not cover all the Data Factory cmdlets. See [Data Factory Cmdlet Reference](https://msdn.microsoft.com/library/dn820234.aspx) for comprehensive documentation on Data Factory cmdlets.
    
	1. Run **Add-AzureAccount** and enter the  user name and password that you use to sign in to the Azure Portal.
	2. Run **Get-AzureSubscription** to view all the subscriptions for this account.
	3. Run **Select-AzureSubscription** to select the subscription that you want to work with. This subscription should be the same as the one you used in the Azure portal.
	
	Keep Azure PowerShell open until the end of this tutorial. If you close and reopen, you need to run these commands again.


2.	**(recommended)** Review and practice the tutorial in the [Get started with Azure Data Factory][adfgetstarted] article for a simple tutorial to get familiar with the portal and cmdlets.
3.	**(recommended)** Review and practice the walkthrough in the [Use Pig and Hive with Azure Data Factory][usepigandhive] article for a walkthrough on creating a pipeline to move data from on-premises data source to an Azure blob store.
4.	Download [ADFWalkthrough][adfwalkthrough-download] files to **C:\ADFWalkthrough** folder **preserving the folder structure**:
	- **Pipelines:** It includes  JSON files containing the definition of the pipelines.
	- **Tables:** It includes  JSON files containing the definition of the Tables.
	- **LinkedServices:** It includes JSON files containing the definition of your storage and compute (HDInsight) cluster 
	- **Scripts:** It includes Hive and Pig scripts that are used for processing the data and invoked from the pipelines
	- **SampleData:** It includes sample data for this walkthrough
	- **OnPremises:** It includes JSON files and script that are used for demonstrating accessing your on-premises data
	- **uploadSampleDataAndScripts.ps1:** This script uploads the sample data & scripts to Azure.
5. Make sure you have created the following Azure Resources:			
	- Azure Storage Account.
	- Azure SQL Database
	- Azure HDInsight Cluster of version 3.1 or above (or use an on-demand HDInsight cluster that the Data Factory service will create automatically)	
7. Once the Azure Resources are created, make sure you have the information needed to connect to each of these resources.
 	- **Azure Storage Account** - Account name and account key.  
	- **Azure SQL Database** - Server, database, user name, and password.
	- **Azure HDInsight Cluster**. - Name of the HDInsight cluster, user name, password, and account name and account key for the Azure storage associated with this cluster. If you want to use an on-demand HDInsight cluster instead of your own HDInsight cluster you can skip this step.  
8. Launch **Azure PowerShell** and execute the following commands. Keep the Azure PowerShell open. If you close and reopen, you need to run these commands again.
	- Run **Login-AzureRmAccount** and enter the  user name and password that you use to sign-in to the Azure Portal.  
	- Run **Get-AzureSubscription** to view all the subscriptions for this account.
	- Run **Select-AzureSubscription** to select the subscription that you want to work with. This subscription should be the same as the one you used in the Azure Portal.
	

## Overview
The end-to-end workflow is depicted below:
	![Tutorial End to End Flow][image-data-factory-tutorial-end-to-end-flow]

1. The **PartitionGameLogsPipeline** reads the raw game events from a blob storage (RawGameEventsTable) and creates partitions based on year, month, and day (PartitionedGameEventsTable).
2. The **EnrichGameLogsPipeline** joins partitioned game events (PartitionedGameEvents table, which is an output of the PartitionGameLogsPipeline) with geo code (RefGetoCodeDictionaryTable) and enriches the data by mapping an IP address to the corresponding geo-location (EnrichedGameEventsTable).
3. The **AnalyzeMarketingCampaignPipeline** pipeline leverages the enriched data (EnrichedGameEventTable produced by the EnrichGameLogsPipeline) and processes it with the advertising data (RefMarketingCampaignnTable) to create the final output of marketing campaign effectiveness, which is copied to the Azure SQL database (MarketingCampainEffectivensessSQLTable) and an Azure blob storage (MarketingCampaignEffectivenessBlobTable) for analytics.
    
You will perform the following steps in this tutorial: 

1. [Upload sample data and scripts](#upload-sample-data-and-scripts). In this step, you will upload all the sample data (including all the logs and reference data) and Hive/Pig scripts that will be executed by the workflows. The scripts you execute also create an Azure SQL database (named MarketingCampaigns), tables, user-defined types, and stored procedures.
2. [Create an Azure data factory](#create-data-factory). In this step, you will create an Azure data factory named LogProcessingFactory.
3. [Create linked services](#create-linked-services). In this step, you will create the following linked services: 
	
	- 	**StorageLinkedService**. Links the Azure storage location that contains raw game events, partitioned game events, enriched game events, marketing campaign effective information, reference geo-code data, and reference marketing campaign data to the LogProcessingFactory   
	- 	**AzureSqlLinkedService**. Links an Azure SQL database that contains marketing campaign effectiveness information. 
	- 	**HDInsightStorageLinkedService**. Links an Azure blob storage that is associated with the HDInsight cluster that the HDInsightLinkedService refers to. 
	- 	**HDInsightLinkedService**. Links an Azure HDInsight cluster to the LogProcessingFactory. This cluster is used to perform pig/hive processing on the data. 
 		
4. [Create datasets](#create-datasets). In this step, you will create the following tables:  	
	
	- **RawGameEventsTable**. This table specifies the location of the raw game event data within the Azure blob storage defined by StorageLinkedService (adfwalkthrough/logs/rawgameevents/) . 
	- **PartitionedGameEventsTable**. This table specifies the location of the partitioned game event data within the Azure blob storage defined by StorageLinkedService (adfwalkthrough/logs/partitionedgameevents/) . 
	- **RefGeoCodeDictionaryTable**. This table specifies the location of the refernce geo-code data within the Azure blob storage defined by StorageLinkedService (adfwalkthrough/refdata/refgeocodedictionary/).
	- **RefMarketingCampaignTable**. This table specifies the location of the refernce marketing campaign data within the Azure blob storage defined by StorageLinkedService (adfwalkthrough/refdata/refmarketingcampaign/).
	- **EnrichedGameEventsTable**. This table specifies the location of the enriched game event data within the Azure blob storage defined by StorageLinkedService (adfwalkthrough/logs/enrichedgameevents/).
	- **MarketingCampaignEffectivenessSQLTable**.This table specifies the SQL table (MarketingCampaignEffectiveness) in the Azure SQL Database defined by AzureSqlLinkedService that contains the marketing campaign effectiveness data. 
	- **MarketingCampaignEffectivenessBlobTable**. This table specifies the location of the marketing campaign effectiveness data within the Azure blob storage defined by StorageLinkedService (adfwalkthrough/marketingcampaigneffectiveness/). 

	
5. [Create and schedule pipelines](#create-pipelines). In this step, you will create the following pipelines:
	- **PartitionGameLogsPipeline**. This pipeline reads the raw game events from a blob storage (RawGameEventsTable) and creates partitions based on year, month, and day (PartitionedGameEventsTable). 


		![PartitionGamesLogs pipeline][image-data-factory-tutorial-partition-game-logs-pipeline]


	- **EnrichGameLogsPipeline**. This pipeline joins partitioned game events (PartitionedGameEvents table, which is an output of the PartitionGameLogsPipeline) with geo-code (RefGetoCodeDictionaryTable) and enriches the data by mapping an IP address to the corresponding geo-location (EnrichedGameEventsTable) 

		![EnrichedGameLogsPipeline][image-data-factory-tutorial-enrich-game-logs-pipeline]

	- **AnalyzeMarketingCampaignPipeline**. This pipeline leverages the enriched game event data (EnrichedGameEventTable produced by the EnrichGameLogsPipeline) and processes it with the advertising data (RefMarketingCampaignnTable) to create the final output of marketing campaign effectiveness, which is copied to the Azure SQL database (MarketingCampainEffectivensessSQLTable) and an Azure blob storage (MarketingCampaignEffectivenessBlobTable) for analytics


		![MarketingCampaignPipeline][image-data-factory-tutorial-analyze-marketing-campaign-pipeline]


6. [Monitor pipelines and data slices](#monitor-pipelines). In this step, you will monitor the pipelines, tables, and data slices by using the Azure Classic Portal.

## Upload sample data and scripts
In this step, you upload all the sample data (including all the logs and reference data) and Hive/Pig scripts that are invoked by the workflows. The scripts you execute also create an Azure SQL database called **MarketingCampaigns**, tables, user-defined types, and stored procedures. 

The tables, user-defined types and stored procedures are used when moving the Marketing Campaign Effectiveness results from Azure blob storage to the Azure SQL database.

1. Open **uploadSampleDataAndScripts.ps1** from **C:\ADFWalkthrough** folder (or the folder that contains the extracted files) in your favorite editor, replace the highlighted with your cluster information, and save the file.


		$storageAccount = <storage account name>
		$storageKey = <storage account key>
		$azuresqlServer = <sql azure server>.database.windows.net
		$azuresqlUser = <sql azure user>@<sql azure server>
		$azuresqlPassword = <sql azure password>

 
	This script requires you have sqlcmd utility installed on your machine. If you have SQL Server isntalled, you already have it. Otherwise, [download][sqlcmd-install] and install the utility. 
	
	Alternatively, you can use the files in the folder: C:\ADFWalkthrough\Scripts to upload pig/hive scripts and sample files to the adfwalkthrough container in the blob storage, and create MarketingCampaignEffectiveness table in the MarketingCamapaigns Azure SQL database.
   
2. Confirm that your local machine is allowed to access the Azure SQL Database. To enable access, use the [Azure Classic Portal](http://manage.windowsazure.com) or **sp_set_firewall_rule** on the master database to create a firewall rule for the IP address of your machine. It may take up to five minutes for this change to take effect. See [Setting firewall rules for Azure SQL][azure-sql-firewall].
4. In Azure PowerShell, navigate to the location where you have extracted the samples (for example: **C:\ADFWalkthrough**)
5. Run **uploadSampleDataAndScripts.ps1** 
6. Once the script executes successfully, you will see the following:

		$storageAccount = <storage account name>
		PS C:\ ADFWalkthrough> & '.\uploadSampleDataAndScripts.ps1'

		Name			PublicAccess		LastModified
		-----			--------		------
		ADFWalkthrough		off			6/6/2014 6:53:34 PM +00:00
	
		Uploading sample data and script files to the storage container [adfwalkthrough]

		Container Uri: https://<yourblobstorage>.blob.core.windows.net/adfwalkthrough

		Name                        BlobType   Length   ContentType               LastModified                        
		----                        --------   ------   -----------               ------------                        
		logs/rawgameevents/raw1.csv  BlockBlob  12308   application/octet-stream  6/6/2014 6:54:35 PM 
		logs/rawgameevents/raw2.csv  BlockBlob  16119   application/octet-stream  6/6/2014 6:54:35 PM 
		logs/rawgameevents/raw3.csv  BlockBlob  16062   application/octet-stream  6/6/2014 6:54:35 PM 
		logs/rawgameevents/raw4.csv  BlockBlob  16245   application/octet-stream  6/6/2014 6:54:35 PM 
		refdata/refgeocodedictiona.. BlockBlob  18647   application/octet-stream  6/6/2014 6:54:36 PM 
		refdata/refmarketingcampai.. BlockBlob  8808    application/octet-stream  6/6/2014 6:54:36 PM
		scripts/partitionlogs.hql    BlockBlob  2449    application/octet-stream  6/6/2014 6:54:36 PM 
		scripts/enrichlogs.pig       BlockBlob  1631    application/octet-stream  6/6/2014 6:54:36 PM
		scripts/transformdata.hql    BlockBlob  1753    application/octet-stream  6/6/2014 6:54:36 PM

		6/6/2014 11:54:36 AM Summary
		6/6/2014 11:54:36 AM 1. Uploaded Sample Data Files to blob container.
		6/6/2014 11:54:36 AM 2. Uploaded Sample Script Files to blob container.
		6/6/2014 11:54:36 AM 3. Created ‘MarketingCampaigns’ Azure SQL database and tables.
		6/6/2014 11:54:36 AM You are ready to deploy Linked Services, Tables and Pipelines. 


## Create data factory
In this step, you create an Azure data factory named **LogProcessingFactory**.

1. Switch to **Azure PowerShell** if you have it already open (or) launch **Azure PowerShell**. If you had closed and reopened Azure PowerShell, you need to run the following commands: 
	- Run **Login-AzureRmAccount** and enter the  user name and password that you use to sign-in to the Azure Portal.  
	- Run **Get-AzureSubscription** to view all the subscriptions for this account.
	- Run **Select-AzureSubscription** to select the subscription that you want to work with. This subscription should be the same as the one you used in the Azure Portal. 

2. Create an Azure resource group named **ADFTutorialResourceGroup** (if you haven't already created) by running the following command.

		New-AzureRmResourceGroup -Name ADFTutorialResourceGroup  -Location "West US"

	Some of the steps in this tutorial assume that you use the resource group named ADFTutorialResourceGroup. If you use a different resource group, you will need to use it in place of ADFTutorialResourceGroup in this tutorial.
4. Run the **New-AzureRmDataFactory** cmdlet to create a data factory named DataFactoryMyFirstPipelinePSH.  

		New-AzureRmDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name LogProcessingFactory –Location "West US"

	> [AZURE.IMPORTANT] The name of the Azure Data Factory must be globally unique. If you receive the error **Data factory name “LogProcessingFactory” is not available**, change the name (for example, yournameLogProcessingFactory). Use this name in place of LogProcessingFactory while performing steps in this tutorial. See [Data Factory - Naming Rules](data-factory-naming-rules.md) topic for naming rules for Data Factory artifacts.
	> 
	> The name of the data factory may be registered as a DNS name in the future and hence become publically visible.

 
## Create linked services

> [AZURE.NOTE] This articles uses the Azure PowerShell to create linked services, tables, and pipelines. See [Tutorial using Data Factory Editor][adftutorial-using-editor] if you want to perform this tutorial using Azure Portal, specifically Data Factory Editor. 

In this step, you will create the following linked services: StorageLinkedService, AzureSqlLinkedService, HDInsightStorageLinkedService, and HDInsightLinkedService.

16. In Azure PowerShell, Navigate to the **LinkedServices** subfolder in **C:\ADFWalkthrough** (or) from the folder from the location where you have extracted the files.
17. Use the following command to set $df variable to the name of the data factory.

		$df = “LogProcessingFactory”
17. Open **StorageLinkedService.json** in your favorite editor, enter **account name** and **account key** values, and save the file.
17. Use the cmdlet **New-AzureRmDataFactoryLinkedService** to create a Linked Service as follows. 

		New-AzureRmDataFactoryLinkedService -ResourceGroupName ADF -DataFactoryName $df -File .\StorageLinkedService.json
	
18. Open **StorageLinkedService.json** in your favorite editor, enter **account name** and **account key** values, and save the file.
19. Create the **HDInsightStorageLinkedService**.

		New-AzureRmDataFactoryLinkedService -ResourceGroupName ADF -DataFactoryName $df -File .\HDInsightStorageLinkedService.json
 
19. Open **AzureSqlLinkedService.json** in your favorite editor, enter **azure sql server** name , **user name** and **password** values, and save the file.
19. Use the cmdlet **New-AzureRmDataFactoryLinkedService** to create a Linked Service as follows. 

		New-AzureRmDataFactoryLinkedService -ResourceGroupName ADF -DataFactoryName $df -File .\AzureSqlLinkedService.json
19. Open **HDInsightLinkedService.json** in your favorite editor and notice that the type is set to **HDInsightOnDemandLinkedService**.

	The Azure Data Factory service supports creation of an on-demand cluster and use it to process input to produce output data. You can also use your own cluster to perform the same. When you use on-demand HDInsight cluster, a cluster gets created for each slice. Whereas, when you use your own HDInsight cluster, the cluster is ready to process the slice immediately. Therefore, when you use on-demand cluster, you may not see the output data as quickly as when you use your own cluster. For the purpose of the sample, let's use an on-demand cluster. 
	
	The HDInsightLinkedService links an on-demand HDInsight cluster to the data factory. To use your own HDInsight cluster, update the Properties section of the HDInsightLinkedService.json file as shown below (replace clustername, username, and password with appropriate values): 
	
		"Properties": 
		{
    		"Type": "HDInsightBYOCLinkedService",
        	"ClusterUri": "https://<clustername>.azurehdinsight.net/",
	    	"UserName": "<username>",
	    	"Password": "<password>",
	    	"LinkedServiceName": "HDInsightStorageLinkedService"
		}
		


19. Use the cmdlet **New-AzureRmDataFactoryLinkedService** to create a Linked Service as follows. Start with the storage account:

		New-AzureRmDataFactoryLinkedService -ResourceGroupName ADF -DataFactoryName $df -File .\HDInsightLinkedService.json
 
	If you are using a different name for ResourceGroupName, DataFactoryName or LinkedService name, refer them in the above cmdlet. Also, provide the full file path of the Linked Service JSON file if the file cannot be found.

 

## Create datasets
In this step, you will create the following tables: 

- RawGameEventsTable
- PartitionedGameEventsTable
- RefGeoCodeDictionaryTable
- RefMarketingCampaignTable
- EnrichedGameEventsTable
- MarketingCampaignEffectivenessSQLTable
- MarketingCampaignEffectivenessBlobTable

	![Tutorial End-to-End Flow][image-data-factory-tutorial-end-to-end-flow]
 
The picture above displays pipelines in the middle row and tables in the top and bottom rows. 

The Azure Classic Portal does not support creating data sets/tables yet, so you will need to use Azure PowerShell to create tables in this release.

### To create the tables

1.	In the Azure PowerShell, navigate to the **Tables** folder (**C:\ADFWalkthrough\Tables\**) from the location where you have extracted the samples. 
2.	Use the cmdlet **New-AzureRmDataFactoryDataset** to create the datasets as follows for **RawGameEventsTable**.json	


		New-AzureRmDataFactoryDataset -ResourceGroupName ADF -DataFactoryName $df –File .\RawGameEventsTable.json

	If you are using a different name for ResourceGroupName and DataFactoryName, refer them in the above cmdlet. Also, provide the full file path of the Table JSON file if the file cannot be found by the cmdlet.

3. Repeat the previous step to create the following tables:	
		
		New-AzureRmDataFactoryDataset -ResourceGroupName ADF -DataFactoryName $df –File .\PartitionedGameEventsTable.json
		
		New-AzureRmDataFactoryDataset -ResourceGroupName ADF -DataFactoryName $df –File .\RefGeoCodeDictionaryTable.json
			
		New-AzureRmDataFactoryDataset -ResourceGroupName ADF -DataFactoryName $df –File .\RefMarketingCampaignTable.json
			
		New-AzureRmDataFactoryDataset -ResourceGroupName ADF -DataFactoryName $df –File .\EnrichedGameEventsTable.json
			
		New-AzureRmDataFactoryDataset -ResourceGroupName ADF -DataFactoryName $df –File .\MarketingCampaignEffectivenessSQLTable.json
			
		New-AzureRmDataFactoryDataset -ResourceGroupName ADF -DataFactoryName $df –File .\MarketingCampaignEffectivenessBlobTable.json



4. In the **Azure Portal**, click **Datasets** in the **DATA FACTORY** blade for **LogProcessingFactory** and confirm that you see all the datasets (tables are rectangular datasets). 

	![Data Sets All][image-data-factory-tutorial-datasets-all]

	You can also use the following command from Azure PowerShell:
			
		Get-AzureRmDataFactoryDataset –ResourceGroupName ADF –DataFactoryName $df

	


## Create pipelines
In this step, you will create the following pipelines: PartitionGameLogsPipeline, EnrichGameLogsPipeline, and AnalyzeMarketingCampaignPipeline.

1. In **Windows Explorer**, navigate to the **Pipelines** sub folder in **C:\ADFWalkthrough** folder (or from the location where you have extracted the samples).
2.	Open **PartitionGameLogsPipeline.json** in your favorite editor, replace the highlighted with your storage account for the data storage account information and save the file.
			
		"RAWINPUT": "wasb://adfwalkthrough@<storageaccountname>.blob.core.windows.net/logs/rawgameevents/",
		"PARTITIONEDOUTPUT": "wasb://adfwalkthrough@<storageaccountname>.blob.core.windows.net/logs/partitionedgameevents/",

3. Repeat the step to create the following pipelines:
	1. **EnrichGameLogsPipeline**.json (3 occurrences)
	2. **AnalyzeMarketingCampaignPipeline**.json (3 occurrences)

	**IMPORTANT:** Confirm that you have replaced all <storageaccountname> with your storage account name. 
 
4.  In **Azure PowerShell**, navigate to the **Pipelines** sub folder in **C:\ADFWalkthrough** folder (or from the location where you have extracted the samples).
5.  Use the cmdlet **New-AzureRmDataFactoryPipeline** to create the Pipelines as follows for **PartitionGameLogspeline**.json	 
			
		New-AzureRmDataFactoryPipeline -ResourceGroupName ADF -DataFactoryName $df –File .\PartitionGameLogsPipeline.json

	If you are using a different name for ResourceGroupName, DataFactoryName or Pipeline name, refer them in the above cmdlet. Also, provide the full file path of the Pipeline JSON file.
6. Repeat the previous step to create the following pipelines:
	1. **EnrichGameLogsPipeline**
			
			New-AzureRmDataFactoryPipeline -ResourceGroupName ADF -DataFactoryName $df –File .\EnrichGameLogsPipeline.json

	2. **AnalyzeMarketingCampaignPipeline**
				
			New-AzureRmDataFactoryPipeline -ResourceGroupName ADF -DataFactoryName $df –File .\AnalyzeMarketingCampaignPipeline.json

7. Use the cmdlet **Get-AzureRmDataFactoryPipeline** to get the listing of the Pipelines.
			
		Get-AzureRmDataFactoryPipeline –ResourceGroupName ADF –DataFactoryName $df

8. Once the pipelines are created, you can specify the duration in which data processing will occur. By specifying the active period for a pipeline, you are defining the time duration in which the data slices will be processed based on the Availability properties that were defined for each ADF table.

To specify the active period for the pipeline, you can use the cmdlet Set-AzureRmDataFactoryPipelineActivePeriod. In this walkthrough, the sample data is from 05/01 to 05/05. Use 2014-05-01 as the StartDateTime. EndDateTime is optional.
			
		Set-AzureRmDataFactoryPipelineActivePeriod -ResourceGroupName ADF -DataFactoryName $df -StartDateTime 2014-05-01Z -EndDateTime 2014-05-05Z –Name PartitionGameLogsPipeline
  
9. Confirm to set the active period for the pipeline.
			
			Confirm
			Are you sure you want to set pipeline 'PartitionGameLogsPipeline' active period from '05/01/2014 00:00:00' to '05/05/2014 00:00:00'?
			[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): n

10. Repeat the previous two steps to set active period for the following pipelines.
	1. **EnrichGameLogsPipeline**
			
			Set-AzureRmDataFactoryPipelineActivePeriod -ResourceGroupName ADF -DataFactoryName $df -StartDateTime 2014-05-01Z –EndDateTime 2014-05-05Z –Name EnrichGameLogsPipeline

	2. **AnalyzeMarketingCampaignPipeline** 
			
			Set-AzureRmDataFactoryPipelineActivePeriod -ResourceGroupName ADF -DataFactoryName $df -StartDateTime 2014-05-01Z -EndDateTime 2014-05-05Z –Name AnalyzeMarketingCampaignPipeline

11. In the **Azure Portal**, click **Pipelines** tile (not on the names of the pipelines) in the **DATA FACTORY** blade for the **LogProcessingFactory**, you should see the pipelines you created.

	![All Pipelines][image-data-factory-tutorial-pipelines-all]

12. In the **DATA FACTORY** blade for the **LogProcessingFactory**, click **Diagram**.

	![Diagram Link][image-data-factory-tutorial-diagram-link]

13. You can rearrange the diagram you see and here is a rearranged diagram that shows direct inputs at the top and outputs at the bottom. You can see that the output of the **PartitionGameLogsPipeline** is passed in as an input to the EnrichGameLogsPipeline and output of the **EnrichGameLogsPipeline** is passed to the **AnalyzeMarketingCampaignPipeline**. Double-click on a title to see details about the artifact that the blade represents.

	![Diagram View][image-data-factory-tutorial-diagram-view]

	**Congratulations!** You have successfully created the Azure Data Factory, Linked Services, Pipelines, Tables and started the workflow. 


## Monitor pipelines 

1.	If you do not have the DATA FACTORY blade for the LogProcessingFactory open, you can do one of the following:
	1.	Click **LogProcessingFactory** on the **Startboard**. While creating the data factory, the **Add to Startboard** option was automatically checked.

		![Monitoring Startboard][image-data-factory-monitoring-startboard]

	2. Click **BROWSE** hub, and click **Everything**.
	 	
		![Monitoring Hub Everything][image-data-factory-monitoring-hub-everything]

		In the **Browse** blade, select **Data factories** and select **LogProcessingFactory** in the **Data factories** blade.

		![Monitoring Browse Datafactories][image-data-factory-monitoring-browse-datafactories]
2. You can monitor your data factory in several ways. You can start with pipelines or data sets. Let’s start with Pipelines and drill further. 
3.	Click **Pipelines** on the **DATA FACTORY** blade. 
4.	Click **PartitionGameLogsPipeline** in the Pipelines blade. 
5.	In the **PIPELINE** blade for **PartitionGameLogsPipeline**, you see that the pipeline consumes **RawGameEventsTable** dataset.  Click **RawGameEventsTable**.

	![Pipeline Consumed and Produced][image-data-factory-monitoring-pipeline-consumed-produced]

6. In the TABLE blade for **RawGameEventsTable**, you see all the slices. In the following screen shot, all the slices are in **Ready** state and there are no problem slices. It means that the data is ready to be processed.	

	![RawGameEventsTable TABLE blade][image-data-factory-monitoring-raw-game-events-table]
 
7. Now, on the **PIPELINE** blade for **PartiionGameLogsPipeline**, click **Produced**. 
8. You should see the list of data sets that this pipeline produces: 
9. Click **PartitionedGameEvents** table in the **Produced datasets** blade. 
10.	Confirm that the **status** of all slices is set to **Ready**. 
11.	Click on one of the slices that is **Ready** to see the **DATA SLICE** blade for that slice.

	![RawGameEventsTable DATA SLICE blade][image-data-factory-monitoring-raw-game-events-table-dataslice-blade]

	If there was an error, you would see a **Failed **status here.  You might also see either both slices with status **Ready**, or both with status **Waiting**, depending on how quickly the slices are processed.
 
	Refer to the [Azure Data Factory Developer Reference][developer-reference] to get an understanding of all possible slice statuses.

12.	In the **DATA SLICE** blade, click the run from the **Activity Runs** list. You should see the Activity Run blade for that slice. You should see the following **ACTIVITY RUN DETAILS** blade.

	![Activity Run Details blade][image-data-factory-monitoring-activity-run-details]

13.	Click **Download** to download the files. This screen is especially useful when you are troubleshooting errors from HDInsight processing. 
	 
	
When all the pipeline have completed execution, you can look into the **MarketingCampaignEffectivenessTable** in the **MarketingCampaigns** Azure SQL database to view the results. 

**Congratulations!** You can now monitor and troubleshoot the workflows. You have learned how to use Azure Data Factory to process data and get analytics.

## Extend the tutorial to use on-premises data
In the last step of log processing scenario from the walkthrough in this article, the marketing campaign effectiveness output was copied to an Azure SQL database. You could also move this data to on-premises SQL Server for analytics within your organization.
 
In order to copy the marketing campaign effectiveness data from Azure Blob to on-premises SQL Server, you need to create additional on-premises Linked Service, Table and Pipeline introduced in the walkthrough in this article.

Practice the [Walkthrough: Using on-premises data source][tutorial-onpremises-using-powershell] to learn how to create a pipeline to copy marketing campaign effectiveness data to an on-premises SQL Server database.
 

[monitor-manage-using-powershell]: data-factory-monitor-manage-using-powershell.md
[use-custom-activities]: data-factory-use-custom-activities.md
[troubleshoot]: data-factory-troubleshoot.md
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456

[adftutorial-using-editor]: data-factory-tutorial.md

[adfgetstarted]: data-factory-get-started.md
[adfintroduction]: data-factory-introduction.md
[usepigandhive]: data-factory-data-transformation-activities.md
[tutorial-onpremises-using-powershell]: data-factory-tutorial-extend-onpremises-using-powershell.md
[download-azure-powershell]: ../powershell-install-configure.md

[azure-portal]: http://portal.azure.com
[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[sqlcmd-install]: http://www.microsoft.com/download/details.aspx?id=35580
[azure-sql-firewall]: http://msdn.microsoft.com/library/azure/jj553530.aspx


[adfwalkthrough-download]: http://go.microsoft.com/fwlink/?LinkId=517495
[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908

[old-cmdlet-reference]: https://msdn.microsoft.com/library/azure/dn820234(v=azure.98).aspx


[image-data-factory-tutorial-end-to-end-flow]: ./media/data-factory-tutorial-using-powershell/EndToEndWorkflow.png

[image-data-factory-tutorial-partition-game-logs-pipeline]: ./media/data-factory-tutorial-using-powershell/PartitionGameLogsPipeline.png

[image-data-factory-tutorial-enrich-game-logs-pipeline]: ./media/data-factory-tutorial-using-powershell/EnrichGameLogsPipeline.png

[image-data-factory-tutorial-analyze-marketing-campaign-pipeline]: ./media/data-factory-tutorial-using-powershell/AnalyzeMarketingCampaignPipeline.png


[image-data-factory-tutorial-new-datafactory-blade]: ./media/data-factory-tutorial-using-powershell/NewDataFactoryBlade.png

[image-data-factory-tutorial-resourcegroup-blade]: ./media/data-factory-tutorial-using-powershell/ResourceGroupBlade.png

[image-data-factory-tutorial-create-resourcegroup]: ./media/data-factory-tutorial-using-powershell/CreateResourceGroup.png

[image-data-factory-tutorial-datafactory-homepage]: ./media/data-factory-tutorial-using-powershell/DataFactoryHomePage.png

[image-data-factory-tutorial-create-datafactory]: ./media/data-factory-tutorial-using-powershell/CreateDataFactory.png

[image-data-factory-tutorial-linkedservice-tile]: ./media/data-factory-tutorial-using-powershell/LinkedServiceTile.png

[image-data-factory-tutorial-linkedservices-add-datstore]: ./media/data-factory-tutorial-using-powershell/LinkedServicesAddDataStore.png

[image-data-factory-tutorial-datastoretype-azurestorage]: ./media/data-factory-tutorial-using-powershell/DataStoreTypeAzureStorageAccount.png

[image-data-factory-tutorial-azurestorage-settings]: ./media/data-factory-tutorial-using-powershell/AzureStorageSettings.png

[image-data-factory-tutorial-storage-key]: ./media/data-factory-tutorial-using-powershell/StorageKeyFromAzurePortal.png

[image-data-factory-tutorial-linkedservices-blade-storage]: ./media/data-factory-tutorial-using-powershell/LinkedServicesBladeWithAzureStorage.png

[image-data-factory-tutorial-azuresql-settings]: ./media/data-factory-tutorial-using-powershell/AzureSQLDatabaseSettings.png

[image-data-factory-tutorial-azuresql-database-connection-string]: ./media/data-factory-tutorial-using-powershell/DatabaseConnectionString.png

[image-data-factory-tutorial-linkedservices-all]: ./media/data-factory-tutorial-using-powershell/LinkedServicesAll.png

[image-data-factory-tutorial-datasets-all]: ./media/data-factory-tutorial-using-powershell/DataSetsAllTables.png

[image-data-factory-tutorial-pipelines-all]: ./media/data-factory-tutorial-using-powershell/AllPipelines.png

[image-data-factory-tutorial-diagram-link]: ./media/data-factory-tutorial-using-powershell/DataFactoryDiagramLink.png

[image-data-factory-tutorial-diagram-view]: ./media/data-factory-tutorial-using-powershell/DiagramView.png

[image-data-factory-monitoring-startboard]: ./media/data-factory-tutorial-using-powershell/MonitoringStartBoard.png

[image-data-factory-monitoring-hub-everything]: ./media/data-factory-tutorial-using-powershell/MonitoringHubEverything.png

[image-data-factory-monitoring-browse-datafactories]: ./media/data-factory-tutorial-using-powershell/MonitoringBrowseDataFactories.png

[image-data-factory-monitoring-pipeline-consumed-produced]: ./media/data-factory-tutorial-using-powershell/MonitoringPipelineConsumedProduced.png

[image-data-factory-monitoring-raw-game-events-table]: ./media/data-factory-tutorial-using-powershell/MonitoringRawGameEventsTable.png

[image-data-factory-monitoring-raw-game-events-table-dataslice-blade]: ./media/data-factory-tutorial-using-powershell/MonitoringPartitionGameEventsTableDataSliceBlade.png

[image-data-factory-monitoring-activity-run-details]: ./media/data-factory-tutorial-using-powershell/MonitoringActivityRunDetails.png

[image-data-factory-new-datafactory-menu]: ./media/data-factory-tutorial-using-powershell/NewDataFactoryMenu.png