<properties title="Use Pig and Hive with Azure Data Factory" pageTitle="Use Pig and Hive with Azure Data Factory" description="Learn how to process data by running Pig and Hive scripts on an Azure HDInsight cluster from an Azure data factory." metaKeywords=""  services="data-factory" solutions=""  documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar" />

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/13/2014" ms.author="spelluru" />

# Use Pig and Hive with Data Factory
A pipeline in an Azure data factory processes data in linked storage services by using linked compute services. It contains a sequence of activities where each activity performs  a specific processing operation. 

- **Copy Activity** copies data from a source storage to a destination storage. To learn more about the Copy Activity, see [Copy data with Data Factory][data-factory-copy-activity]. 
- **HDInsight Activity** processes data by running Hive/Pig scripts or MapReduce programs on an HDInsight cluster. The HDInsight Activity supports three transformation: **Hive**, **Pig**, and **MapReduce**. The HDInsight Activity can consume 1 or more input and produce 1 or more outputs.
 
See [Invoke MapReduce Programs from Data Factory][data-factory-map-reduce] for details about running MapReduce programs on an HDInsight cluster from an Azure data factory pipeline by using MapReduce transformations of the HDInsight Activity. This article describes using Pig/Hive transformation of the HDInsight Activity.

## In This Article

Section | Description
------- | -----------
[Pig JSON example](#PigJSON) | This section provides JSON schema for defining a HDInsight Activity that uses a Pig transformation. 
[Hive JSON example](#HiveJSON) | This section provides JSON schema for defining a HDInsight Activity that uses a Hive transformation. 
[Using Pig and Hive scripts that are stored in Azure Blob storage](#ScriptInBlob) | Describes how to refer to Pig/Hive scripts stored in an Azure blob storage from an HDInsight Activity using Pig/Hive transformation.
[Parameterized Pig and Hive Queries](#ParameterizeQueries) | Describes how to specify specify values for parameters used in the Pig and Hive scripts, by using **extendedProperties** property in JSON.
[Walkthrough: Use Hive with Azure Data Factory](#Waltkthrough) | Provides step-by-step instructions to create a pipeline that use Hive to process data.  



When defining a Pig or Hive activity in a pipeline JSON, the **type** property should be set to: **HDInsightActivity**.

## <a name="PigJSON"></a> Pig JSON example

    {
		"name": "Pig Activity",
		"description": "description", 
		"type": "HDInsightActivity",
		"inputs":  [ { "name": "InputSqlDA"  } ],
		"outputs":  [ { "name": "OutputBlobDA" } ],
		"linkedServiceName": "MyHDInsightLinkedService",
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

**Note the following:**
	
- Activity **type** is set to **HDInsightActivity**.
- **linkedServiceName** is set to **MyHDInsightLinkedService**. 
- The **type** of the **transformation** is set to **Pig**.
- You can specify Pig script inline for the **script** property or store script files in an Azure blob storage and refer to the file using **scriptPath** property, which is explained later in this article. 
- You specify parameters for the Pig script by using the **extendedProperties**. More details are provided later in this article. 


## <a name="HiveJSON"></a> ## Hive JSON example


    {
		"name": "Hive Activity",
		"description": "description", 
		"type": "HDInsightActivity",
		"inputs":  [ { "name": "InputSqlDA"  } ],
		"outputs":  [ { "name": "OutputBlobDA" } ],
		"linkedServiceName": "MyHDInsightLinkedService",
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

**Note the following:**
	
- Activity **type** is set to **HDInsightActivity**.
- **linkedServiceName** is set to **MyHDInsightLinkedService**. 
- The **type** of the **transformation** is set to **Hive**.
- You can specify Hive script inline for the **script** property or store script files in an Azure blob storage and refer to the file using **scriptPath** property, which is explained later in this article. 
- You specify parameters for the Hive script by using the **extendedProperties**. More details are provided later in this article. 

> [WACOM.NOTE] See [Developer Reference](http://go.microsoft.com/fwlink/?LinkId=516908) for details about cmdlets, JSON schemas, and properties in the schema. 


## <a name="ScriptInBlob"></a>Using Pig and Hive scripts that are stored in Azure Blob storage
You can store Pig/Hive scripts in an Azure blob storage associated with the HDInsight cluster and refer to them from Pig/Hive activities by using the following properties in the JSON: 

* **scriptPath** – Path to the Pig or Hive script file
* **scriptLinkedService** – Azure storage account that contains the script file

The following JSON example for a sample pipeline uses a Hive activity that refers to **transformdata.hql** file stored in **scripts** folder in the **adfwalkthrough** container in the Azure blob storage represented by the **StorageLinkedService**.

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
						}		
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

## <a name="ParameterizeQueries"></a>Parameterized Pig and Hive Queries
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
						"outputs": [{"Name": "DA_Output1"}, {"Name": "DA_Output2"}],
				  		"linkedServiceName": "MyHDInsightLinkedService",
				  		"transformation":
				  		{
							"type": "Hive", 
							"extendedProperties":
							{
								"Param1": "$$Text.Format('{0:yyyy-MM-dd}', SliceStart)",
								"Param2": "value"
						  	},
    						"script": "ADD FILE ${hiveconf:Param1}://${hiveconf:Param2}/MyFile.DLL;"
    					}
					}
			   	]
			}
		}


-  

## <a name="Walkthrough"></a>Walkthrough: Use Hive with Azure Data Factory
### Pre-requisites
1. Complete the tutorial from [Get started with Azure Data Factory][adfgetstarted] article.
2. Upload **emp.txt** file you created in the above tutorial as **hiveinput\emp.txt** to the adftutorial container in the blob storage. The **hiveinput** folder is automatically created in the **adftutorial** container when you upload emp.txt file with this syntax. 
2. Create **hivequery.hql** file in a subfolder named **Hive** under **C:\ADFGetStarted** with the following content.
    		
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
		
3.  Upload the **hivequery.hql** to the **adftutorial** container in your blob storage


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
            		"folderPath": "adftutorial/hiveinput",
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

 
	**Note the following:**
	
	- location **type** is set to **AzureBlobLocation**.
	- **linkedServiceName** is set to **MyBlobStore** that defines an Azure storage account.
	- **folderPath** specifies the blob container\folder for the input data. 
	- **frequency=Day** and **interval=1** means the slices are available daily
	- **waitOnExternal** means that this data is not produced by another pipeline, it is rather produced externally to the data factory. 
	

	See [Data Factory Developer Reference][developer-reference] for descriptions of JSON properties.  

2. Launch **Azure PowerShell** and switch to the **AzureResourceManager** mode if needed.
    		
    	Switch-AzureMode AzureResourceManager

5. Switch to the folder: **C:\ADFGetStarted\Hive**.
6. Execute the following command to create the input table in the **ADFTutorialDataFactory**.

		New-AzureDataFactoryTable –ResourceGroupName ADFTutorialResourceGroup –DataFactoryName ADFTutorialDataFactory -File .\HiveInputBlobTable.json

	See [Data Factory Cmdlet Reference][cmdlet-reference] for detailed overview of Data Factory cmdlets. 
#### Create output table
        
1. Create a JSON file named **HiveOutputBlobTable.json** with the following content and save it in the **C:\ADFGetStarted\Hive** folder.

		{
    		"name": "HiveOutputBlobTable",
    		"properties":
    		{
        		"location": 
        		{
            		"type": "AzureBlobLocation",
	    			"folderPath": "adftutorial/hiveoutput/",
            		"linkedServiceName": "MyBlobStore"
        		},
        		"availability": 
        		{
            		"frequency": "Day",
            		"interval": 1
        		}
    		}
		}

2. Execute the following command to create the output table in the **ADFTutorialDataFactory**.
 
		New-AzureDataFactoryTable –ResourceGroupName ADFTutorialResourceGroup –DataFactoryName ADFTutorialDataFactory -File .\HiveOutputBlobTable.json

### Create a linked service for an HDInsight cluster
The Azure Data Factory service supports creation of an on-demand cluster and use it to process input to produce output data. You can also use your own cluster to perform the same. When you use on-demand HDInsight cluster, a cluster gets created for each slice. Whereas, when you use your own HDInsight cluster, the cluster is ready to process the slice immediately. Therefore, when you use on-demand cluster, you may not see the output data as quickly as when you use your own cluster. For the purpose of the sample, let's use an on-demand cluster. 

#### To use an on-demand HDInsight cluster
1. Create a JSON file named **HDInsightOnDemandCluster.json** with the following content and save it to **C:\ADFGetStarted\Hive** folder.


		{
    		"name": "HDInsightOnDemandCluster",
    		"properties": 
    		{
        		"type": "HDInsightOnDemandLinkedService",
				"clusterSize": "4",
        		"timeToLive": "00:05:00",
        		"linkedServiceName": "MyBlobStore"
    		}
		}

2. Launch **Azure PowerShell** and execute the following command to switch to the **AzureResourceManager** mode.The Azure Data Factory cmdlets are available in the **AzureResourceManager** mode.

         switch-azuremode AzureResourceManager
		

3. Switch to **C:\ADFGetstarted\Hive** folder.
4. Execute the following command to create the linked service for the on-demand HDInsight cluster.
 
		New-AzureDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -File .\HDInsightOnDemandCluster.json
  
3. You should see the tables and linked services on the **Data Factory** blade in the **Azure Preview Portal**.    
   
#### To use your own HDInsight cluster: 

1. Create a JSON file named **MyHDInsightCluster.json** with the following content and save it to **C:\ADFGetStarted\Hive** folder. Replace clustername, username, and password with appropriate values before saving the JSON file.  

		{
   			"Name": "MyHDInsightCluster",
    		"Properties": 
			{
        		"Type": "HDInsightBYOCLinkedService",
	        	"ClusterUri": "https://<clustername>.azurehdinsight.net/",
    	    	"UserName": "<username>",
    	    	"Password": "<password>",
    	    	"LinkedServiceName": "MyBlobStore"
    		}
		}

2. Launch **Azure PowerShell** and execute the following command to switch the **AzureResourceManager** mode.The Azure Data Factory cmdlets are available in the **AzureResourceManager** mode.

         switch-azuremode AzureResourceManager
		

3. Switch to **C:\ADFGetstarted\Hive** folder.
4. Execute the following command to create the linked service for your own HDInsight cluster.
 
		New-AzureDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -File .\MyHDInsightCluster.json

### Create and schedule pipeline
   
1. Create a JSON file named **ADFTutorialHivePipeline.json** with the following content and save it in the **C:\ADFGetStarted\Hive** folder. If you want to use your own cluster and followed the steps to create the **MyHDInsightCluster** linked service, replace **HDInsightOnDemandCluster** with **MyHDInsightCluster** in the following JSON. 


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
	> If you do not specify **EndDateTime**, it is calculated as "**StartDateTime + 48 hours**". To run the pipeline indefinitely, specify **9/9/9999** as the **EndDateTime**.
  	
	The output table is scheduled to be produced every day, so there will be three slices produced. 

4. See [Monitor datasets and pipeline][adfgetstartedmonitoring] section of [Get started with Data Factory][adfgetstarted] article.   

## See Also

Article | Description
------ | ---------------
[Introduction to Azure Data Factory][data-factory-introduction] | This article introduces you to the Azure Data Factory service, concepts, the value it provides, and scenarios it supports.
[Get started with Azure Data Factory][adf-getstarted] | This article provides an end-to-end tutorial that shows you how to create a sample Azure data factory that copies data from an Azure blob to an Azure SQL database.
[Enable your pipelines to work with on-premises data][use-onpremises-datasources] | This article has a walkthrough that shows how to copy data from an on-premises SQL Server database to an Azure blob.
[Tutorial: Move and process log files using Data Factory][adf-tutorial] | This article provides an end-to-end walkthrough that shows how to implement a near real world scenario using Azure Data Factory to transform data from log files into insights.
[Use custom activities in a Data Factory][use-custom-activities] | This article provides a walkthrough with step-by-step instructions for creating a custom activity and using it in a pipeline. 
[Troubleshoot Data Factory issues][troubleshoot] | This article describes how to troubleshoot Azure Data Factory issues.  
[Azure Data Factory Developer Reference][developer-reference] | The Developer Reference has the comprehensive reference content for cmdlets, JSON script, functions, etc… 

[data-factory-copy-activity]: ..//data-factory-copy-activity
[data-factory-map-reduce]: ..//data-factory-map-reduce

[adf-getstarted]: ../data-factory-get-started
[use-onpremises-datasources]: ../data-factory-use-onpremises-datasources
[adf-tutorial]: ../data-factory-tutorial
[use-custom-activities]: ../data-factory-use-custom-activities
[monitor-manage-using-powershell]: ../data-factory-monitor-manage-using-powershell
[troubleshoot]: ../data-factory-troubleshoot
[data-factory-introduction]: ../data-factory-introduction

[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456


[adfgetstarted]: ../data-factory-get-started
[adfgetstartedmonitoring]:../data-factory-get-started#MonitorDataSetsAndPipeline 
[adftutorial]: ../data-factory-tutorial

[Developer Reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[Azure Portal]: http://portal.azure.com
