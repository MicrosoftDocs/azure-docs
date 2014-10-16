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

When defining Pig or Hive activity in a pipeline JSON, the **type** property should be set to: **HDInsightActivity**.

## Pig JSON example

    {
		"name": "Pig Activity",
		"description": "description", 
		"type": "HDInsightActivity",
		"inputs":  [ { "name": "InputSqlDA"  } ],
		"outputs":  [ { "name": “OutputBlobDA” } ],
		“linkedServiceName”: "MyLinkedService",
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
		“linkedServiceName”: "MyLinkedService",
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
					"linkedServiceName": "HDInsightLinkedService",
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

## Parameterized Pig and Hive Queries
The ADF Pig and Hive activities enable you to specify values for parameters used in the Pig and Hive scripts, by using **extendedProperties**. The extendedProperties section consists of the name of the parameter, and value of the parameter.

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
				  	“linkedServiceName”: "Asset_HDI",
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