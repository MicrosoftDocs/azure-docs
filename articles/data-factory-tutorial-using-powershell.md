<properties 
	pageTitle="Move and process log files using Azure Data Factory" 
	description="This advanced tutorial describes a near real-world scenario and implements the scenario using Azure Data Factory service." 
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
	ms.date="04/14/2015" 
	ms.author="spelluru"/>

# Tutorial: Move and process log files using Data Factory [PowerShell]
This article provides an end-to-end walkthrough of a canonical scenario of log processing using Azure Data Factory to transform data from log files into insights. 

## Scenario
Contoso is a gaming company that creates games for multiple platforms: game consoles, hand held devices, and personal computers (PCs). Each of these games produces tons of logs. Contoso’s goal is to collect and analyze the logs produced by these games to get usage information, identify up-sell and cross-sell opportunities, develop new compelling features etc. to improve business and provide better experience to customers.
 
In this walkthrough, we will collect sample logs, process and enrich them with reference data, and transform the data to evaluate the effectiveness of a marketing campaign that Contoso has recently launched.

## Getting ready for the tutorial
1.	Read [Introduction to Azure Data Factory][adfintroduction] to get an overview of Azure Data Factory and understanding of the top level concepts.
2.	You must have an Azure subscription to perform this tutorial. For information about obtaining a subscription, see [Purchase Options] [azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].
3.	You must download and install [Azure PowerShell][download-azure-powershell] on your computer. 
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
	- Run **Add-AzureAccount** and enter the  user name and password that you use to sign-in to the Azure Preview Portal.  
	- Run **Get-AzureSubscription** to view all the subscriptions for this account.
	- Run **Select-AzureSubscription** to select the subscription that you want to work with. This subscription should be the same as the one you used in the Azure Preview Portal.
	

## Overview
The end-to-end workflow is depicted below:
	![Tutorial End to End Flow][image-data-factory-tutorial-end-to-end-flow]

1. The **PartitionGameLogsPipeline** reads the raw game events from a blob storage (RawGameEventsTable) and creates partitions based on year, month, and day (PartitionedGameEventsTable).
2. The **EnrichGameLogsPipeline** joins partitioned game events (PartitionedGameEvents table, which is an output of the PartitionGameLogsPipeline) with geo code (RefGetoCodeDictionaryTable) and enriches the data by mapping an IP address to the corresponding geo-location (EnrichedGameEventsTable).
3. The **AnalyzeMarketingCampaignPipeline** pipeline leverages the enriched data (EnrichedGameEventTable produced by the EnrichGameLogsPipeline) and processes it with the advertising data (RefMarketingCampaignnTable) to create the final output of marketing campaign effectiveness, which is copied to the Azure SQL database (MarketingCampainEffectivensessSQLTable) and an Azure blob storage (MarketingCampaignEffectivenessBlobTable) for analytics.
    
## Walkthrough: Creating, deploying, and monitoring workflows
1. [Step 1: Upload sample data and scripts](#MainStep1). In this step, you will upload all the sample data (including all the logs and reference data) and Hive/Pig scripts that will be executed by the workflows. The scripts you execute also create an Azure SQL database (named MarketingCampaigns), tables, user-defined types, and stored procedures.
2. [Step 2: Create an Azure data factory](#MainStep2). In this step, you will create an Azure data factory named LogProcessingFactory.
3. [Step 3: Create linked services](#MainStep3). In this step, you will create the following linked services: 
	
	- 	**StorageLinkedService**. Links the Azure storage location that contains raw game events, partitioned game events, enriched game events, marketing campaign effective information, reference geo-code data, and reference marketing campaign data to the LogProcessingFactory   
	- 	**AzureSqlLinkedService**. Links an Azure SQL database that contains marketing campaign effectiveness information. 
	- 	**HDInsightStorageLinkedService**. Links an Azure blob storage that is associated with the HDInsight cluster that the HDInsightLinkedService refers to. 
	- 	**HDInsightLinkedService**. Links an Azure HDInsight cluster to the LogProcessingFactory. This cluster is used to perform pig/hive processing on the data. 
 		
4. [Step 4: Create tables](#MainStep4). In this step, you will create the following tables:  	
	
	- **RawGameEventsTable**. This table specifies the location of the raw game event data within the Azure blob storage defined by StorageLinkedService (adfwalkthrough/logs/rawgameevents/) . 
	- **PartitionedGameEventsTable**. This table specifies the location of the partitioned game event data within the Azure blob storage defined by StorageLinkedService (adfwalkthrough/logs/partitionedgameevents/) . 
	- **RefGeoCodeDictionaryTable**. This table specifies the location of the refernce geo-code data within the Azure blob storage defined by StorageLinkedService (adfwalkthrough/refdata/refgeocodedictionary/).
	- **RefMarketingCampaignTable**. This table specifies the location of the refernce marketing campaign data within the Azure blob storage defined by StorageLinkedService (adfwalkthrough/refdata/refmarketingcampaign/).
	- **EnrichedGameEventsTable**. This table specifies the location of the enriched game event data within the Azure blob storage defined by StorageLinkedService (adfwalkthrough/logs/enrichedgameevents/).
	- **MarketingCampaignEffectivenessSQLTable**.This table specifies the SQL table (MarketingCampaignEffectiveness) in the Azure SQL Database defined by AzureSqlLinkedService that contains the marketing campaign effectiveness data. 
	- **MarketingCampaignEffectivenessBlobTable**. This table specifies the location of the marketing campaign effectiveness data within the Azure blob storage defined by StorageLinkedService (adfwalkthrough/marketingcampaigneffectiveness/). 

	
5. [Step 5: Create and schedule pipelines](#MainStep5). In this step, you will create the following pipelines:
	- **PartitionGameLogsPipeline**. This pipeline reads the raw game events from a blob storage (RawGameEventsTable) and creates partitions based on year, month, and day (PartitionedGameEventsTable). 


		![PartitionGamesLogs pipeline][image-data-factory-tutorial-partition-game-logs-pipeline]


	- **EnrichGameLogsPipeline**. This pipeline joins partitioned game events (PartitionedGameEvents table, which is an output of the PartitionGameLogsPipeline) with geo-code (RefGetoCodeDictionaryTable) and enriches the data by mapping an IP address to the corresponding geo-location (EnrichedGameEventsTable) 

		![EnrichedGameLogsPipeline][image-data-factory-tutorial-enrich-game-logs-pipeline]

	- **AnalyzeMarketingCampaignPipeline**. This pipeline leverages the enriched game event data (EnrichedGameEventTable produced by the EnrichGameLogsPipeline) and processes it with the advertising data (RefMarketingCampaignnTable) to create the final output of marketing campaign effectiveness, which is copied to the Azure SQL database (MarketingCampainEffectivensessSQLTable) and an Azure blob storage (MarketingCampaignEffectivenessBlobTable) for analytics


		![MarketingCampaignPipeline][image-data-factory-tutorial-analyze-marketing-campaign-pipeline]


6. [Step 6: Monitor pipelines and data slices](#MainStep6). In this step, you will monitor the pipelines, tables, and data slices by using the Azure Portal.

## <a name="MainStep1"></a> Step 1: Upload sample data and scripts
In this step, you upload all the sample data (including all the logs and reference data) and Hive/Pig scripts that are invoked by the workflows. The scripts you execute also create an Azure SQL database called **MarketingCampaigns**, tables, user-defined types, and stored procedures. 

The tables, user-defined types and stored procedures are used when moving the Marketing Campaign Effectiveness results from Azure blob storage to the Azure SQL database.

1. Open **uploadSampleDataAndScripts.ps1** from **C:\ADFWalkthrough** folder (or the folder that contains the extracted files) in your favorite editor, replace the highlighted with your cluster information, and save the file.


		$storageAccount = <storage account name>
		$storageKey = <storage account key>
		$azuresqlServer = <sql azure server>.database.windows.net
		$azuresqlUser = <sql azure user>@<sql azure server>
		$azuresqlPassword = <sql azure password>

 
	> [AZURE.NOTE] This script requires you have sqlcmd utility installed on your machine. If you have SQL Server isntalled, you already have it. Otherwise, [download][sqlcmd-install] and install the utility. 
	> Alternatively, you can use the files in the folder: C:\ADFWalkthrough\Scripts to upload pig/hive scripts and sample files to the adfwalkthrough container in the blob storage, and create MarketingCampaignEffectiveness table in the MarketingCamapaigns Azure SQL database.   
2. Confirm that your local machine is allowed to access the Azure SQL Database. To enable access, use the **Azure Management Portal** or **sp_set_firewall_rule** on the master database to create a firewall rule for the IP address of your machine. It may take up to five minutes for this change to take effect. See [Setting firewall rules for Azure SQL][azure-sql-firewall].
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


## <a name="MainStep2"></a> Step 2: Create an Azure data factory
In this step, you create an Azure data factory named **LogProcessingFactory**.

1.	After logging into the [Azure Preview Portal][azure-preview-portal], click **NEW** from the bottom-left corner, and click **Data Factory** on the **New** blade. 

	![New->DataFactory][image-data-factory-new-datafactory-menu] 
	
	If you do not see **Data Factory** on the **New** blade, scroll down. 
	
5. In the **New data factory** blade, enter **LogProcessingFactory** for the **Name**.

	![Data Factory Blade][image-data-factory-tutorial-new-datafactory-blade]

6. If you haven’t created an Azure resource group named **ADF** already, do the following:
	1. Click **RESOURCE GROUP NAME**, and click **Create a new resource group**.
	
		![Resource Group Blade][image-data-factory-tutorial-resourcegroup-blade]
	2. In the **Create resource group** blade, enter **ADF** for the name of the resource group, and click **OK**.
	
		![Create Resource Group][image-data-factory-tutorial-create-resourcegroup]
7. Select **ADF** for the **RESOURCE GROUP NAME**.  
8.	In the **New data factory** blade, notice that **Add to Startboard** is selected by default. This add a link to data factory on the startboard (what you see when you login to Azure Preview Portal).

	![Create Data Factory Blade][image-data-factory-tutorial-create-datafactory]

9.	In the **New data factory** blade, click **Create** to create the data factory.
10.	After the data factory is created, you should see the **DATA FACTORY** blade titled **LogProcessingFactory**.

	![Data Factory Homepage][image-data-factory-tutorial-datafactory-homepage]

	
	If you do not see it, do one of the following:

	- Click **LogProcessingFactory** on the **Startboard** (home page)
	- Click **BROWSE** on the left, click **Everything**, click **Data factories**, and click the data factory.
 
	> [AZURE.NOTE] The name of the Azure data factory must be globally unique. If you receive the error: **Data factory name “LogProcessingFactory” is not available**, change the name (for example, yournameLogProcessingFactory). Use this name in place of LogProcessingFactory while performing steps in this tutorial.
 
## <a name="MainStep3"></a> Step 3: Create linked services

> [AZURE.NOTE] This articles uses the Azure PowerShell to create linked services, tables, and pipelines. See [Tutorial using Data Factory Editor][adftutorial-using-editor] if you want to perform this tutorial using Azure Portal, specifically Data Factory Editor. 

In this step, you will create the following linked services: StorageLinkedService, AzureSqlLinkedService, HDInsightStorageLinkedService, and HDInsightLinkedService.


1.	In the **LogProcessingFactory** blade, click **Linked Services** tile.

	![Linked Services Tile][image-data-factory-tutorial-linkedservice-tile]

2. In the **Linked Services** blade, click **+ Data Store** from the command bar.	

	![Linked Services - Add Store][image-data-factory-tutorial-linkedservices-add-datstore]

3. In the **New data store** blade, enter **StorageLinkedService** for the **Name**, click **TYPE (settings required)**, and select **Azure storage account**.

	![Data Store Type - Azure Storage][image-data-factory-tutorial-datastoretype-azurestorage]

4. In the **New data store** blade, you will see two new fields: **Account Name** and **Account Key**. Enter account name and account key for your **Azure Storage Account**.

	![Azure Storage Settings][image-data-factory-tutorial-azurestorage-settings]

	You can get account name and account key your Azure storage account from the portal as shown below:

	![Storage Key][image-data-factory-tutorial-storage-key]
  
5. After you click **OK** on the New data store blade, you should see **StorageLinkedService** in the list of **DATA STORES** on the **Linked Services** blade. Check **NOTIFICATIONS** Hub (on the left) to see any messages.

	![Linked Services Blade with Storage][image-data-factory-tutorial-linkedservices-blade-storage]
   
6. Repeat **steps 2-5** to create another linked service named: **HDInsightStorageLinkedService**. This is the storage used by your HDInsight cluster.
7. Confirm that you see both **StorageLinkedService** and **HDInsightStorageLinkedService** in the list in the Linked Services blade.
8. In the **Linked Services** blade, click **Add (+) Data Store** from the command bar.
9. Enter **AzureSqlLinkedService** for the name.
10. Click **TYPE (settings required)**, select **Azure SQL Database**.
11. Now, you should the following additional fields on the **New data store** blade. Enter name of the Azure SQL Database **server**, **database** name, **user name**, and **password**, and click **OK**.
	1. Enter **MarketingCampaigns** for the **database**. This is the Azure SQL database created by the scripts you ran in Step 1. You should confirm that this database was indeed created by the scripts (in case there were errors).
		
 		![Azure SQL Settings][image-data-factory-tutorial-azuresql-settings]

		To get these values from the Azure Management Portal: click View SQL Database connection strings for MarketingCampaigns database

		![Azure SQL Database Connection String][image-data-factory-tutorial-azuresql-database-connection-string]

12. Confirm that you see all the three data stores you have created: **StorageLinkedService**, **HDInsightStorageLinkedService**, and **AzureSqlLinkedService**.
13. You need to create another linked service, but this one is to a Compute service, specifically **Azure HDInsight cluster**. The portal does not support creating a compute linked service yet. Therefore, you need to use Azure PowerShell to create this linked service. 
14. Switch to **Azure PowerShell** if you have it already open (or) launch **Azure PowerShell**. If you had closed and reopened Azure PowerShell, you need to run the following commands: 
	- Run **Add-AzureAccount** and enter the  user name and password that you use to sign-in to the Azure Preview Portal.  
	- Run **Get-AzureSubscription** to view all the subscriptions for this account.
	- Run **Select-AzureSubscription** to select the subscription that you want to work with. This subscription should be the same as the one you used in the Azure Preview Portal. 
15. Switch to **AzureResourceManager** mode as the Azure Data Factory cmdlets are available in this mode.

		Switch-AzureMode AzureResourceManager

16. Navigate to the **LinkedServices** subfolder in **C:\ADFWalkthrough** (or) from the folder from the location where you have extracted the files.
17. Open **HDInsightLinkedService.json** in your favorite editor and notice that the type is set to **HDInsightOnDemandLinkedService**.


	> [AZURE.NOTE] The Azure Data Factory service supports creation of an on-demand cluster and use it to process input to produce output data. You can also use your own cluster to perform the same. When you use on-demand HDInsight cluster, a cluster gets created for each slice. Whereas, when you use your own HDInsight cluster, the cluster is ready to process the slice immediately. Therefore, when you use on-demand cluster, you may not see the output data as quickly as when you use your own cluster. For the purpose of the sample, let's use an on-demand cluster. 
	> The HDInsightLinkedService links an on-demand HDInsight cluster to the data factory. To use your own HDInsight cluster, update the Properties section of the HDInsightLinkedService.json file as shown below (replace clustername, username, and password with appropriate values): 
	> 
			"Properties": 
			{
        		"Type": "HDInsightBYOCLinkedService",
	        	"ClusterUri": "https://<clustername>.azurehdinsight.net/",
    	    	"UserName": "<username>",
    	    	"Password": "<password>",
    	    	"LinkedServiceName": "HDInsightStorageLinkedService"
    		}
		

18. Use the following command to set $df variable to the name of the data factory.

		$df = “LogProcessingFactory”
19. Use the cmdlet **New-AzureDataFactoryLinkedService** to create a Linked Service as follows. Start with the storage account:

		New-AzureDataFactoryLinkedService -ResourceGroupName ADF -DataFactoryName $df -File .\HDInsightLinkedService.json
 
	If you are using a different name for ResourceGroupName, DataFactoryName or LinkedService name, refer them in the above cmdlet. Also, provide the full file path of the Linked Service JSON file if the file cannot be found.
20. You should see all the four linked services in the **Linked Services** blade as shown below. If the Linked services blade is not open, click Linked Services in the **DATA FACTORY** page for **LogProcessingFactory**. It may take a few seconds for the Linked services blade to refresh.

	![Linked Services All][image-data-factory-tutorial-linkedservices-all]
 

## <a name="MainStep4"></a> Step 4: Create tables 
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

The Azure Portal does not support creating data sets/tables yet, so you will need to use Azure PowerShell to create tables in this release.

### To create the tables

1.	In the Azure PowerShell, navigate to the **Tables** folder (**C:\ADFWalkthrough\Tables\**) from the location where you have extracted the samples. 
2.	Use the cmdlet **New-AzureDataFactoryTable** to create the Tables as follows for **RawGameEventsTable**.json	


		New-AzureDataFactoryTable -ResourceGroupName ADF -DataFactoryName $df –File .\RawGameEventsTable.json

	If you are using a different name for ResourceGroupName and DataFactoryName, refer them in the above cmdlet. Also, provide the full file path of the Table JSON file if the file cannot be found by the cmdlet.

3. Repeat the previous step to create the following tables:	
		
		New-AzureDataFactoryTable -ResourceGroupName ADF -DataFactoryName $df –File .\PartitionedGameEventsTable.json
		
		New-AzureDataFactoryTable -ResourceGroupName ADF -DataFactoryName $df –File .\RefGeoCodeDictionaryTable.json
			
		New-AzureDataFactoryTable -ResourceGroupName ADF -DataFactoryName $df –File .\RefMarketingCampaignTable.json
			
		New-AzureDataFactoryTable -ResourceGroupName ADF -DataFactoryName $df –File .\EnrichedGameEventsTable.json
			
		New-AzureDataFactoryTable -ResourceGroupName ADF -DataFactoryName $df –File .\MarketingCampaignEffectivenessSQLTable.json
			
		New-AzureDataFactoryTable -ResourceGroupName ADF -DataFactoryName $df –File .\MarketingCampaignEffectivenessBlobTable.json



4. In the **Azure Preview Portal**, click **Datasets** in the **DATA FACTORY** blade for **LogProcessingFactory** and confirm that you see all the datasets (tables are rectangular datasets). 

	![Data Sets All][image-data-factory-tutorial-datasets-all]

	You can also use the following command from Azure PowerShell:
			
		Get-AzureDataFactoryTable –ResourceGroupName ADF –DataFactoryName $df

	


## <a name="MainStep5"></a> Step 5: Create and schedule pipelines
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
5.  Use the cmdlet **New-AzureDataFactoryPipeline** to create the Pipelines as follows for **PartitionGameLogspeline**.json	 
			
		New-AzureDataFactoryPipeline -ResourceGroupName ADF -DataFactoryName $df –File .\PartitionGameLogsPipeline.json

	If you are using a different name for ResourceGroupName, DataFactoryName or Pipeline name, refer them in the above cmdlet. Also, provide the full file path of the Pipeline JSON file.
6. Repeat the previous step to create the following pipelines:
	1. **EnrichGameLogsPipeline**
			
			New-AzureDataFactoryPipeline -ResourceGroupName ADF -DataFactoryName $df –File .\EnrichGameLogsPipeline.json

	2. **AnalyzeMarketingCampaignPipeline**
				
			New-AzureDataFactoryPipeline -ResourceGroupName ADF -DataFactoryName $df –File .\AnalyzeMarketingCampaignPipeline.json

7. Use the cmdlet **Get-AzureDataFactoryPipeline** to get the listing of the Pipelines.
			
		Get-AzureDataFactoryPipeline –ResourceGroupName ADF –DataFactoryName $df

8. Once the pipelines are created, you can specify the duration in which data processing will occur. By specifying the active period for a pipeline, you are defining the time duration in which the data slices will be processed based on the Availability properties that were defined for each ADF table.

To specify the active period for the pipeline, you can use the cmdlet Set-AzureDataFactoryPipelineActivePeriod. In this walkthrough, the sample data is from 05/01 to 05/05. Use 2014-05-01 as the StartDateTime. EndDateTime is optional.
			
		Set-AzureDataFactoryPipelineActivePeriod -ResourceGroupName ADF -DataFactoryName $df -StartDateTime 2014-05-01Z -EndDateTime 2014-05-05Z –Name PartitionGameLogsPipeline
  
9. Confirm to set the active period for the pipeline.
			
			Confirm
			Are you sure you want to set pipeline 'PartitionGameLogsPipeline' active period from '05/01/2014 00:00:00' to '05/05/2014 00:00:00'?
			[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): n

10. Repeat the previous two steps to set active period for the following pipelines.
	1. **EnrichGameLogsPipeline**
			
			Set-AzureDataFactoryPipelineActivePeriod -ResourceGroupName ADF -DataFactoryName $df -StartDateTime 2014-05-01Z –EndDateTime 2014-05-05Z –Name EnrichGameLogsPipeline

	2. **AnalyzeMarketingCampaignPipeline** 
			
			Set-AzureDataFactoryPipelineActivePeriod -ResourceGroupName ADF -DataFactoryName $df -StartDateTime 2014-05-01Z -EndDateTime 2014-05-05Z –Name AnalyzeMarketingCampaignPipeline

11. In the **Azure Preview Portal**, click **Pipelines** tile (not on the names of the pipelines) in the **DATA FACTORY** blade for the **LogProcessingFactory**, you should see the pipelines you created.

	![All Pipelines][image-data-factory-tutorial-pipelines-all]

12. In the **DATA FACTORY** blade for the **LogProcessingFactory**, click **Diagram**.

	![Diagram Link][image-data-factory-tutorial-diagram-link]

13. You can rearrange the diagram you see and here is a rearranged diagram that shows direct inputs at the top and outputs at the bottom. You can see that the output of the **PartitionGameLogsPipeline** is passed in as an input to the EnrichGameLogsPipeline and output of the **EnrichGameLogsPipeline** is passed to the **AnalyzeMarketingCampaignPipeline**. Double-click on a title to see details about the artifact that the blade represents.

	![Diagram View][image-data-factory-tutorial-diagram-view]

	**Congratulations!** You have successfully created the Azure Data Factory, Linked Services, Pipelines, Tables and started the workflow. 


## <a name="MainStep6"></a> Step 6: Monitor pipelines and data slices 

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

	If there was an error, you would see a **Failed **status here.  You might also see either both slices with status **Ready**, or both with status **PendingValidation**, depending on how quickly the slices are processed.
 
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
[useonpremisesdatasources]: data-factory-use-onpremises-datasources.md
[usepigandhive]: data-factory-pig-hive-activities.md
[tutorial-onpremises-using-powershell]: data-factory-tutorial-extend-onpremises-using-powershell.md
[download-azure-powershell]: powershell-install-configure.md

[azure-preview-portal]: http://portal.azure.com
[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[sqlcmd-install]: http://www.microsoft.com/download/details.aspx?id=35580
[azure-sql-firewall]: http://msdn.microsoft.com/library/azure/jj553530.aspx


[adfwalkthrough-download]: http://go.microsoft.com/fwlink/?LinkId=517495
[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908


[image-data-factory-tutorial-end-to-end-flow]: ./media/data-factory-tutorial-using-powershell/EndToEndWorkflow.png

[image-data-factory-tutorial-partition-game-logs-pipeline]: ./media/data-factory-tutorial-using-powershell/PartitionGameLogsPipeline.png

[image-data-factory-tutorial-enrich-game-logs-pipeline]: ./media/data-factory-tutorial-using-powershell/EnrichGameLogsPipeline.png

[image-data-factory-tutorial-analyze-marketing-campaign-pipeline]: ./media/data-factory-tutorial-using-powershell/AnalyzeMarketingCampaignPipeline.png


[image-data-factory-tutorial-egress-to-onprem-pipeline]: ./media/data-factory-tutorial-using-powershell/EgreeDataToOnPremPipeline.png

[image-data-factory-tutorial-set-firewall-rules-azure-db]: ./media/data-factory-tutorial-using-powershell/SetFirewallRuleForAzureDatabase.png

[image-data-factory-tutorial-portal-new-everything]: ./media/data-factory-tutorial-using-powershell/PortalNewEverything.png

[image-data-factory-tutorial-datastorage-cache-backup]: ./media/data-factory-tutorial-using-powershell/DataStorageCacheBackup.png

[image-data-factory-tutorial-dataservices-blade]: ./media/data-factory-tutorial-using-powershell/DataServicesBlade.png

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

[image-data-factory-datamanagementgateway-configuration-manager]: ./media/data-factory-tutorial-using-powershell/DataManagementGatewayConfigurationManager.png

[image-data-factory-new-datafactory-menu]: ./media/data-factory-tutorial-using-powershell/NewDataFactoryMenu.png

[image-data-factory-new-datafactory-create-button]: ./media/data-factory-tutorial-using-powershell/DataFactoryCreateButton.png