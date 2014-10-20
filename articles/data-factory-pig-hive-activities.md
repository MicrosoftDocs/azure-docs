<properties title="Use Pig and Hive with Azure Data Factory" pageTitle="Use Pig and Hive with Azure Data Factory" description="Learn how to process data by running Pig and Hive scripts on an Azure HDInsight cluster from an Azure data factory." metaKeywords=""  services="data-factory" solutions=""  documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar" />

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="spelluru" />

# Use Pig and Hive with Data Factory
A pipeline in an Azure data factory processes data in linked storage services by using linked compute services. It contains a sequence of activities where each activity performs  a specific processing operation. For example, a Copy activity copies data from a source storage to a destination storage and Hive/Pig activities use an Azure HDInsight cluster to process data using Hive queries or Pig scripts.

<table border="1">	
	<tr>
	<th>Activity</th>
	<th>Descritpion</th>
	<th>No. of inputs</th>
	<th>No. of outputs</th>
	</tr>	

	<tr>
	<td>Pig</td>
	<td>Specifies the Pig script used to process the data from input tables, and produces data to output tables. 	</td>
	<td>>=1</td>
	<td>>=1</td>
	</tr>	

	<td>Hive</td>
	<td>Specifies the Hive script used to process the data from the input tables, and produces data to output tables.	</td>
	<td>>=1</td>
	<td>>=1</td>
	</tr>	

</table>

> [WACOM.NOTE] See [Developer Reference](http://go.microsoft.com/fwlink/?LinkId=516908) for details about cmdlets, JSON schemas, and properties in the schema. 

When defining Pig or Hive activity in a pipeline JSON, the **type** property should be set to: **HDInsightActivity**.

## Pig JSON example

    {
		"name": "Pig Activity",
		"description": "description", 
		"type": "HDInsightActivity",
		"inputs":  [ { "name": "InputSqlDA"  } ],
		"outputs":  [ { "name": “OutputBlobDA” } ],
		“linkedServiceName”: "MyHDInsightLinkedService",
		"transformation":
		{
			"type": "Pig",
			"script": "pig script",
			"extendedProperties":
			{	
				"param1": "param1Value"
 			}
		}
	}

## Hive JSON example


    {
		"name": "Hive Activity",
		"description": "description", 
		"type": "HDInsightActivity",
		"inputs":  [ { "name": "InputSqlDA"  } ],
		"outputs":  [ { "name": “OutputBlobDA” } ],
		“linkedServiceName”: "MyHDInsightLinkedService",
		"transformation":
		{
			"type": "Hive",
			"script": "Hive script",
			"extendedProperties":
			{	
				"param1": "param1Value"
            }
		}
	}

## Using Pig and Hive Queries that are stored in Azure Blob storage
You can store Pig/Hive scripts in an Azure blob storage associated with the HDInsight cluster and refer to them from Pig/Hive activities by using the following properties in the JSON: 

* **scriptPath** – Path to the Pig or Hive script file
* **scriptLinkedService** – Azure storage account that contains the script file

The following JSON example for a sample pipeline uses a Hive activity that refers to **transformdata.hql** file stored in scripts folder in the **adfwalkthrough** container in the Azure blob storage represented by the **StorageLinkedService**.

    {
    	"name": "AnalyzeMarketingCampaignPipeline",
    	"properties":
    	{
	        "description" : " Enriched Gamer Fact Data and push to SQL Azure",
    	    "activities":
    	    [
    	        {
					"name": "JoinData",
					"description": "Join Regional Campaign data with Enriched Gamer Fact Data",
					"type": "HDInsightActivity",
					"inputs": [ {"name": "EnrichedGameEventsTable"}, 
                            {"name": "RefMarketingCampaignTable"} ],
					"outputs": [ {"name": "MarketingCampaignEffectivenessBlobTable"} ],
					"linkedServiceName": "MyHDInsightLinkedService",
					"transformation":
					{
    					"type": "Hive",
    					"scriptpath": "adfwalkthrough\\scripts\\transformdata.hql",    		
						"scriptLinkedService": "StorageLinkedService", 
						"extendedProperties":
						{
						},		
					},
					"policy":
					{
						"concurrency": 1,
						"executionPriorityOrder": "NewestFirst",
						"retry": 1,
						"timeout": "01:00:00"
					}
            	}
        	]
      	}
	}

> [WACOM.NOTE] See [Developer Reference](http://go.microsoft.com/fwlink/?LinkId=516908) for details about cmdlets, JSON schemas, and properties in the schema.

## Parameterized Pig and Hive Queries
The Data Factory Pig and Hive activities enable you to specify values for parameters used in the Pig and Hive scripts, by using **extendedProperties**. The extendedProperties section consists of the name of the parameter, and value of the parameter.

See the following example for specifying parameters for a Hive script using **extendedProperties**. To use parameterized Hive  scripts, do the following:

1.	Define the parameters in **extendedProperties**.
2.	In the in-line Hive script (or) Hive script file stored in the blog storage, refer to the parameter using **${hiveconf:parameterName}**.

   
    		
    	{
			"name": "ParameterizedHivePipeline",
			"properties": 
			{
	    		"description" : "Example - Parameterized Hive Pipeline",
		   	 "activities": 
				[
					{
						"name": "ProcessLog",
					  	"type": "HDInsightActivity",
					  	"inputs": [{"Name": "DA_Input"}],
						"outputs": [{"Name": "DA_Output1"}, {"Name": "DA_Output2"},],
				  		“linkedServiceName”: "MyHDInsightLinkedService",
				  		"transformation":
				  		{
							"type": "Hive", 
							"extendedProperties":
							{
								"Param1": "$$Text.Format('{0:yyyy-MM-dd}', SliceStart)",
								"Param2": "value",
						  	},
    						"script": "
								ADD FILE ${hiveconf:Param1}://${hiveconf:Param2}/MyFile.DLL;
								-- Hive script
    	            		"
    					},
					}
			   	]
			}
		}

## Walkthrough: Use Hive with Azure Data Factory
### Pre-requisites
1. Complete the tutorial from [Get started with Azure Data Factory][adfgetstarted] article.
2. Create **HiveQuery.hql** file in a subfolder named **Hive** under **C:\ADFGetStarted** with the following content.
    		
    	DROP TABLE IF EXISTS adftutorialhivetable; 
		CREATE EXTERNAL TABLE  adftutorialhivetable
		(                                  
 			country         string,                                   
 			state           string,   
 			sessioncount int                                 
		) ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' LINES TERMINATED BY '10' STORED AS TEXTFILE LOCATION '${hiveconf:RESULTOUTPUT}/${hiveconf:Year}/${hiveconf:Month}/${hiveconf:Day}'; 

		INSERT OVERWRITE TABLE adftutorialhivetable 
		SELECT  country, state, count(*) 
		FROM hivesampletable 
		group by country, state;
		
3.  Upload the **HiveQuery.hql** to the **adftutorial** container in your blob storage

### Walkthrough

#### Create input table
1. Create a JSON file named **HiveInputBlobTable.json** in **C:\ADFGetStarted\Hive** folder with the following content.
    		
		{
    		"name": "HiveInputBlobTable",
    		"properties":
    		{
        		"location": 
        		{
            		"type": "AzureBlobLocation",
            		"blobPath": "adftutorial/hiveinput",
            		"linkedServiceName": "MyBlobStore"
        		},
        		"availability": 
        		{
            		"frequency": "Day",
            		"interval": 1,
            		"waitonexternal": {}
        		}
    		}
		}

 
2. Launch **Azure PowerShell** and switch to **AzureResourceManager** mode if needed.
    		
    	Switch-AzureMode AzureResourceManager

5. Switch to the folder: **C:\ADFGetStarted\Hive**.
6. Execute the following command to create the input table in the **ADFTutorialDataFactory**.

		New-AzureDataFactoryTable –ResourceGroupName ADFTutorialResourceGroup –DataFactoryName ADFTutorialDataFactory -File .\HiveInputBlobTable.json

#### Create output table
        
1. Create a JSON file named **HiveOutputBlobTable.json** with the following content and save it in the **C:\ADFGetStarted\Hive** folder.

		{
    		"name": "HiveOutputBlobTable",
    		"properties":
    		{
        		"location": 
        		{
            		"type": "AzureBlobLocation",
	    			blobPath: "adftutorial/hiveoutput/",
            		"linkedServiceName": "MyBlobStore"
        		},
        		"availability": 
        		{
            		"frequency": "Day",
            		"interval": 1,
        		}
    		}
		}

2. Execute the following command to create the output table in the **ADFTutorialDataFactory**.
 
		New-AzureDataFactoryTable –ResourceGroupName ADFTutorialResourceGroup –DataFactoryName ADFTutorialDataFactory -File .\HiveOutputBlobTable.json

### Create a linked service for an HDInsight cluster
The Azure Data Factory service supports creation of an on-demand cluster and use it to process input to produce output data. You can also your own cluster to perform the same. When you use on-demand HDInsight cluster, a cluster gets created for each slice. Whereas, if you use your own HDInsight cluster, the cluster is ready to process the slice immediately. Therefore, when you use on-demand cluster, you may not see the output data as quickly as when you use your own cluster. For the purpose of the sample, let's use an on-demand cluster. 

1. Create a JSON file named **HDInsightOnDemandCluster.json** with the following content and save it to **C:\ADFGetStarted\Hive** folder.


		{
    		"name": "HDInsightOnDemandCluster",
    		"properties": 
    		{
        		"type": "HDInsightOnDemandLinkedService",
				"clusterSize": 4,
        		"jobsContainer": "adftutorialjobscontainer",
        		"timeToLive": "00:05:00",
        		"version": "3.1",
        		"linkedServiceName": "MyBlobStore"
    		}
		}

2. Execute the following command to create the linked service for the on-demand HDInsight cluster.
 
		New-AzureDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -File .\HDInsightOnDemandCluster.json
  
3. You should see the tables and linked services on the **DATA FACTORY** blade in the **Azure Preview Portal**.    
   
#### To use your own cluster: 

1. Create a JSON file named **HDInsightOnDemandCluster.json** with the following content and save it to **C:\ADFGetStarted\Hive** folder. Replace clustername, username, and password with appropriate values before saving the JSON file.  

		{
   			Name: "MyHDInsightCluster",
    		Properties: 
			{
        		"Type": "HDInsightBYOCLinkedService",
	        	"ClusterUri": "https://<clustername>.azurehdinsight.net/",
    	    	"UserName": "<username>",
    	    	"Password": "<password>",
    	    	"LinkedServiceName": "MyBlobStore"
    		}
		}

2. Execute the following command to create the linked service for the on-demand HDInsight cluster.
 
		New-AzureDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -File .\MyHDInsightCluster.json

### Create and schedule pipeline
   
1. Create a JSON file named **ADFTutorialHivePipeline.json** with the following content and save it in the **C:\ADFGetStarted\Hive** folder. If you want to use your own cluster and followed the steps to create the **MyHDInsightCluster** linked service, replaced **HDInsightOnDemandCluster** with **MyHDInsightCluster** in the following JSON. 


    	{
    		"name": "ADFTutorialHivePipeline",
    		"properties":
    		{
        		"description" : "It runs a HiveQL query and stores the result set in a blob",
        		"activities":
        		[
            		{
						"name": "RunHiveQuery",
						"description": "Runs a hive query",
						"type": "HDInsightActivity",
						"inputs": [{"name": "HiveInputBlobTable"}],
						"outputs": [ {"name": "HiveOutputBlobTable"} ],
						"linkedServiceName": "HDInsightOnDemandCluster",
						"transformation":
						{
                    		"type": "Hive",
                    		"extendedProperties":
                    		{
                        		"RESULTOUTPUT": "wasb://adftutorial@spestore.blob.core.windows.net/hiveoutput/",
		                        "Year":"$$Text.Format('{0:yyyy}',SliceStart)",
		                        "Month":"$$Text.Format('{0:%M}',SliceStart)",
		                        "Day":"$$Text.Format('{0:%d}',SliceStart)"
		                    },
		                    "scriptpath": "adftutorial\\hivequery.hql",
						    "scriptLinkedService": "MyBlobStore"
						},
						"policy":
						{
							"concurrency": 1,
							"executionPriorityOrder": "NewestFirst",
							"retry": 1,
							"timeout": "01:00:00"
						}
            		}
        		]
      		}
		}

2. Execute the following command to create the pipeline.
    	
		New-AzureDataFactoryPipeline –ResourceGroupName ADFTutorialResourceGroup –DataFactoryName ADFTutorialDataFactory –File .\ADFTutorialHivePipeline.json
    	
3. Schedule the pipeline.
    	
		Set-AzureDataFactoryPipelineActivePeriod -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -StartDateTime 2014-09-27 –EndDateTime 2014-09-30 –Name ADFTutorialHivePipeline 

	> [WACOM.NOTE] Replace **StartDateTime** value with the three days prior to current day and **EndDateTime** value with the current day. Both StartDateTime and EndDateTime are UTC times and must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. 
  	

4. See [Monitor datasets and pipeline][adfgetstartedmonitoring] section of [Get started with Data Factory][adfgetstarted] article.   

## See Also


- [Move and process log files using Data Factory][adftutorial]
- [Developer Reference][Developer Reference] 
 


[adfgetstarted]: ../data-factory-get-started
[adfgetstartedmonitoring]:../data-factory-get-started#MonitorDataSetsAndPipeline 
[adftutorial]: ../data-factory-tutorial

[Developer Reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[Azure Portal]: http://portal.azure.com
