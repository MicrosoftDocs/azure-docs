<properties 
	pageTitle="Use Pig and Hive with Azure Data Factory" 
	description="Learn how to process data by running Pig and Hive scripts on an Azure HDInsight cluster from an Azure data factory." 
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

# Use Pig and Hive with Data Factory
A pipeline in an Azure data factory processes data in linked storage services by using linked compute services. It contains a sequence of activities where each activity performs  a specific processing operation. This article describes using the HDInsight Activity with Pig/Hive transformation in an Azure Data Factory pipeline. See [Invoke MapReduce Programs from Data Factory][data-factory-map-reduce] for details about running MapReduce programs on an HDInsight cluster from an Azure data factory pipeline. 

## Walkthrough: Use Hive with Azure Data Factory
This walkthrough provides step-by-step instructions for using a HDInsight Activity with Hive transformation in a Data Factory pipeline. 

### Pre-requisites
1. Complete the tutorial from [Get started with Azure Data Factory][adfgetstarted] article.
2. Upload **emp.txt** file you created in the above tutorial as **hiveinput\emp.txt** to the adftutorial container in the blob storage. The **hiveinput** folder is automatically created in the **adftutorial** container when you upload emp.txt file with this syntax.

	> [AZURE.NOTE] The emp.txt file is only a dummy file for this walkthrough. The actual input data comes from the **hivesampletable** that already exists on the HDInsight cluster. The pipeline does not use the emp.txt file at all.    
	
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

	> [AZURE.NOTE] To use the **Tez** engine to execute Hive queries in the HQL file, add "**set hive.execution.engine=tez**;" at the top of the file.
		
3.  Upload the **hivequery.hql** to the **adftutorial** container in your blob storage


### Walkthrough

#### Create input table
1. In the **DATA FACTORY** blade for the **ADFTutorialDataFactory**, click **Author and deploy** to launch Data Factory Editor.
	
	![Data Factory Blade][data-factory-blade]

2. In the **Data Factory editor**, click **New dataset**, and then click **Azure Blob storage** from the command bar.
3. Replace the JSON script in the right pane with the following JSON script:    
    		
		{
    		"name": "HiveInputBlobTable",
    		"properties":
    		{
        		"location": 
        		{
            		"type": "AzureBlobLocation",
            		"folderPath": "adftutorial/hiveinput",
            		"linkedServiceName": "StorageLinkedService"
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
	- **linkedServiceName** is set to **StorageLinkedService** that defines an Azure storage account.
	- **folderPath** specifies the blob container\folder for the input data. 
	- **frequency=Day** and **interval=1** means the slices are available daily
	- **waitOnExternal** means that this data is not produced by another pipeline, it is rather produced externally to the data factory. 
	

	See [Data Factory Developer Reference][developer-reference] for descriptions of JSON properties.  

2. Click **Deploy** on the command bar to deploy the table. 
  
#### Create output table
        
1. In the **Data Factory editor**, click **New dataset**, and then click **Azure Blob storage** from the command bar.
2. Replace the JSON script in the right pane with the following JSON script:

		{
    		"name": "HiveOutputBlobTable",
    		"properties":
    		{
        		"location": 
        		{
            		"type": "AzureBlobLocation",
	    			"folderPath": "adftutorial/hiveoutput/",
            		"linkedServiceName": "StorageLinkedService"
        		},
        		"availability": 
        		{
            		"frequency": "Day",
            		"interval": 1
        		}
    		}
		}

2. Click **Deploy** on the command bar to deploy the table.


### Create a linked service for an HDInsight cluster
The Azure Data Factory service supports creation of an on-demand cluster and use it to process input to produce output data. You can also use your own cluster to perform the same. When you use on-demand HDInsight cluster, a cluster gets created for each slice. Whereas, when you use your own HDInsight cluster, the cluster is ready to process the slice immediately. Therefore, when you use on-demand cluster, you may not see the output data as quickly as when you use your own cluster. For the purpose of the sample, let's use an on-demand cluster. 

#### To use an on-demand HDInsight cluster
1. Click **New compute** from the command bar and select **On-demand HDInsight cluster** from the menu.
2. Do the following in the JSON script: 
	1. For the **clusterSize** property, specify the size of the HDInsight cluster.
	2. For the **jobsContainer** property, specify the name of the default container where the cluster logs will be stored. For the purpose of this tutorial, specify **adfjobscontainer**.
	3. For the **timeToLive** property, specify how long the cluster can be idle before it is deleted. 
	4. For the **version** property, specify the HDInsight version you want to use. If you exclude this property, the latest version is used.  
	5. For the **linkedServiceName**, specify **StorageLinkedService** that you had created in the Get started tutorial. 

			{
		    	"name": "HDInsightOnDemandLinkedService",
				    "properties": {
		    	    "type": "HDInsightOnDemandLinkedService",
		    	    "clusterSize": "4",
		    	    "jobsContainer": "adfjobscontainer",
		    	    "timeToLive": "00:05:00",
		    	    "version": "3.1",
		    	    "linkedServiceName": "StorageLinkedService"
		    	}
			}

2. Click **Deploy** on the command bar to deploy the linked service.
   
   
#### To use your own HDInsight cluster: 

1. Click **New compute** from the command bar and select **HDInsight cluster** from the menu.
2. Do the following in the JSON script: 
	1. For the **clusterUri** property, enter the URL for your HDInsight. For example: https://<clustername>.azurehdinsight.net/     
	2. For the **UserName** property, enter the user name who has access to the HDInsight cluster.
	3. For the **Password** property, enter the password for the user. 
	4. For the **LinkedServiceName** property, enter **StorageLinkedService**. This is the linked service you had created in the Get started tutorial. 

2. Click **Deploy** on the command bar to deploy the linked service.

### Create and schedule pipeline
   
1. Click **New pipeline** on the command bar. If you do not see the command, click **... (Ellipsis)** to see it. 
2. Replace the JSON in the right pane with the following JSON script. If you want to use your own cluster and followed the steps to create the **HDInsightLinkedService** linked service, replace **HDInsightOnDemandLinkedService** with **HDInsightLinkedService** in the following JSON. 


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
						"linkedServiceName": "HDInsightLinkedService",
						"transformation":
						{
                    		"type": "Hive",
                    		"extendedProperties":
                    		{
                        		"RESULTOUTPUT": "wasb://adftutorial@<your storage account>.blob.core.windows.net/hiveoutput/",
		                        "Year":"$$Text.Format('{0:yyyy}',SliceStart)",
		                        "Month":"$$Text.Format('{0:%M}',SliceStart)",
		                        "Day":"$$Text.Format('{0:%d}',SliceStart)"
		                    },
		                    "scriptpath": "adftutorial\\hivequery.hql",
						    "scriptLinkedService": "StorageLinkedService"
						},
						"policy":
						{
							"concurrency": 1,
							"executionPriorityOrder": "NewestFirst",
							"retry": 1,
							"timeout": "01:00:00"
						}
            		}
        		],
				"start": "2015-02-13T00:00:00Z",
        		"end": "2015-02-14T00:00:00Z",
        		"isPaused": false

      		}
		}

	> [AZURE.NOTE] Replace **StartDateTime** value with the three days prior to current day and **EndDateTime** value with the current day. Both StartDateTime and EndDateTime must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. The output table is scheduled to be produced every day, so there will be three slices produced.
	
	> [AZURE.NOTE] Replace **your storage account** in the JSON with the name of your storage account. 
	
	See [JSON Scripting Reference](http://go.microsoft.com/fwlink/?LinkId=516971) for details about JSON properties.
2. Click **Deploy** on the command bar to deploy the pipeline.
4. See [Monitor datasets and pipeline][adfgetstartedmonitoring] section of [Get started with Data Factory][adfgetstarted] article. 

	> [AZURE.NOTE] In the **ACTIVITY RUN DETAILS** blade for a slice of an output table (select output table -> select slice -> select an activity run in the portal), you will see links to logs created by the HDInsight cluster. You can review them in the portal itself or download them to your computer.  
  

## Pig JSON example
When defining a Pig or Hive activity in a pipeline JSON, the **type** property must be set to: **HDInsightActivity**.

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
- **linkedServiceName** is set to **MyHDInsightLinkedService**. See the HDInsight linked service section below for details on creating an HDInsight linked service.
- The **type** of the **transformation** is set to **Pig**.
- You can specify Pig script inline for the **script** property or store script files in an Azure blob storage and refer to the file using **scriptPath** property, which is explained later in this article. 
- You specify parameters for the Pig script by using the **extendedProperties**. More details are provided later in this article. 


## Hive JSON example


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

> [AZURE.NOTE] See [Developer Reference](http://go.microsoft.com/fwlink/?LinkId=516908) for details about cmdlets, JSON schemas, and properties in the schema. 


## Using Pig and Hive scripts in HDInsight Activity
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


> [AZURE.NOTE] To use the **Tez** engine to execute a Hive query, run "**set hive.execution.engine=tez**;" before running the Hive query.
> 
> See [Developer Reference](http://go.microsoft.com/fwlink/?LinkId=516908) for details about cmdlets, JSON schemas, and properties in the schema.

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


## See Also

Article | Description
------ | ---------------
[Tutorial: Move and process log files using Data Factory][adf-tutorial] | This article provides an end-to-end walkthrough that shows how to implement a near real world scenario using Azure Data Factory to transform data from log files into insights.
[Azure Data Factory Developer Reference][developer-reference] | The Developer Reference has the comprehensive reference content for cmdlets, JSON script, functions, etc… 

[data-factory-copy-activity]: ..//data-factory-copy-activity
[data-factory-map-reduce]: ..//data-factory-map-reduce

[adf-getstarted]: data-factory-get-started.md
[use-onpremises-datasources]: data-factory-use-onpremises-datasources.md
[adf-tutorial]: data-factory-tutorial.md
[use-custom-activities]: data-factory-use-custom-activities.md
[monitor-manage-using-powershell]: data-factory-monitor-manage-using-powershell.md
[troubleshoot]: data-factory-troubleshoot.md
[data-factory-introduction]: data-factory-introduction.md

[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456


[data-factory-blade]:./media/data-factory-pig-hive-activities/DataFactoryBlade.png


[adfgetstarted]: data-factory-get-started.md
[adfgetstartedmonitoring]:data-factory-get-started.md#MonitorDataSetsAndPipeline 
[adftutorial]: data-factory-tutorial.md

[Developer Reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[Azure Portal]: http://portal.azure.com
