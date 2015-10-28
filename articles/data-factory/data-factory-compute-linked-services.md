<properties 
	pageTitle="Compute Linked Services | Microsoft Azure" 
	description="Learn about compute enviornments that you can use in Azure Data Factory pipelines to transform/process data." 
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
	ms.date="09/28/2015" 
	ms.author="spelluru"/>

# Compute Linked Services

This article explains different compute environments that you can use to process or transform data. It also provides details about different configurations (on-demand vs. bring your own) supported by Data Factory when configuring linked services linking these compute environments to an Azure data factory.

## On-demand compute environment

In this type of configuration, the computing environment is fully managed by the Azure Data Factory service. It is automatically created by the Data Factory service before a job is submitted to process data and removed when the job is completed. You can create a linked service for the on-demand compute environment, configure it, and control granular settings for job execution, cluster management, and bootstrapping actions.

> [AZURE.NOTE] The on-demand configuration is currently supported only for Azure HDInsight clusters. 

## Azure HDInsight On-Demand Linked Service

The on-demand HDInsight cluster is automatically created by the Azure Data Factory service to process data. The cluster is created in the region that is same as that of the storage account (linkedServiceName property in the JSON) associated with the cluster.

Note the following **important** points about on-demand HDInsight linked service: 

- You will not see the on-demand HDInsight cluster created in your Azure subscription; the Azure Data Factory service manages the on-demand HDInsight cluster on your behalf.
- The logs for jobs that are run on an on-demand HDInsight cluster are copied to the storage account associated with the HDInsight cluster. You can access these logs from the Azure Portal in the **Activity Run Details** blade. See [Monitor and Manage Pipelines](data-factory-monitor-manage-pipelines.md) article for details. 
- You will be charged only for the time when the HDInsight cluster is up and running jobs.

> [AZURE.IMPORTANT] It typically takes more than **15 minutes** to provision an Azure HDInsight cluster on demand.

### Example

	{
	  "name": "HDInsightOnDemandLinkedService",
	  "properties": {
	    "type": "HDInsightOnDemand",
	    "typeProperties": {
	      "clusterSize": 4,
	      "jobsContainer": "adfjobs",
	      "timeToLive": "00:05:00",
	      "version": "3.1",
	      "linkedServiceName": "MyBlobStore"
	      "additionalLinkedServiceNames": [
	        "otherLinkedServiceName1",
	        "otherLinkedServiceName2"
	      ]
	    }
	  }
	}

### Properties

Property | Description | Required
-------- | ----------- | --------
type | The type property should be set to **HDInsightOnDemand**. | Yes
clusterSize | The size of the on-demand cluster. Specify how many nodes you want to be in this on-demand cluster. | Yes 
jobscontainer | The blob container that holds data used by pig/hive/package jobs and where the cluster logs will be stored. | Yes
timetolive | <p>The allowed idle time for the on-demand HDInsight cluster. Specifies how long the on-demand HDInsight cluster will stay alive after completion of an activity run if there are no other active jobs in the cluster.</p><p>For example, if an activity run takes 6 minutes and timetolive is set to 5 minutes, the cluster stays alive for 5 minutes after the 6 minutes of processing the activity run. If another activity run is executed with the 6 minutes window, it is processed by the same cluster.</p><p>Creating an on-demand HDInsight cluster is an expensive operation (could take a while), so use this setting as needed to improve performance of a data factory by reusing an on-demand HDInsight cluster.</p><p>If you set timetolive value to 0, the cluster is deleted as soon as the activity run in processed. On the other hand, if you set a high value, the cluster may stay idle unnecessarily resulting in high costs. Therefore, it is important that you set the appropriate value based on your needs.</p><p>Multiple pipelines can share the same instance of the on-demand HDInsight cluster if the timetolive property value is appropriately set</p> | Yes
version | Version of the HDInsight cluster | No
linkedServiceName | The blob store to be used by the on-demand cluster for storing and processing data. | Yes
additionalLinkedServiceNames | Specifies additional storage accounts for the HDInsight linked service so that the Data Factory service can register them on your behalf. | No

### Advanced Properties

You can also specify the following properties for the granular configuration of the on-demand HDInsight cluster. 

Property | Description | Required
-------- | ----------- | --------
coreConfiguration | Specifies the core configuration parameters (as in core-site.xml) for the HDInsight cluster to be created. | No
hBaseConfiguration | Specifies the HBase configuration parameters (hbase-site.xml) for the HDInsight cluster. | No
hdfsConfiguration | Specifies the HDFS configuration parameters (hdfs-site.xml) for the HDInsight cluster. | No
hiveConfiguration | Specifies the hive configuration parameters (hive-site.xml) for the HDInsight cluster. | No
mapReduceConfiguration | Specifies the MapReduce configuration parameters (mapred-site.xml) for the HDInsight cluster. | No
oozieConfiguration | Specifies the Oozie configuration parameters (oozie-site.xml) for the HDInsight cluster. | No
stormConfiguration | Specifies the Storm configuration parameters (storm-site.xml) for the HDInsight cluster. | No
yarnConfiguration | Specifies the Yarn configuration parameters (yarn-site.xml) for the HDInsight cluster. | No

#### Example – On-demand HDInsight cluster configuration with advanced properties

	{
	  "name": " HDInsightOnDemandLinkedService",
	  "properties": {
	    "type": "HDInsightOnDemand",
	    "typeProperties": {
	      "clusterSize": 16,
	      "jobsContainer": "adfjobs",
	      "timeToLive": "01:30:00",
	      "version": "3.1",
	      "linkedServiceName": "adfods1",
	      "coreConfiguration": {
	        "templeton.mapper.memory.mb": "5000"
	      },
	      "hiveConfiguration": {
	        "templeton.mapper.memory.mb": "5000"
	      },
	      "mapReduceConfiguration": {
	        "mapreduce.reduce.java.opts": "-Xmx8000m",
	        "mapreduce.map.java.opts": "-Xmx8000m",
	        "mapreduce.map.memory.mb": "5000",
	        "mapreduce.reduce.memory.mb": "5000",
	        "mapreduce.job.reduce.slowstart.completedmaps": "0.8"
	      },
	      "yarnConfiguration": {
	        "yarn.app.mapreduce.am.resource.mb": "5000"
	      },
	      "additionalLinkedServiceNames": [
	        "datafeeds",
	        "adobedatafeed"
	      ]
	    }
	  }
	}

## Bring your own compute environment 

In this type of configuration, users can register an already existing computing environment as a linked service in Data Factory. The computing environment is managed by the user and the Data Factory service uses it to execute the activities.
 
This type of configuration is supported for the following compute environments: 

- Azure HDInsight
- Azure Batch 
- Azure Machine Learning.

## Azure HDInsight Linked Service

You can create an Azure HDInsight linked service to register your own HDInsight cluster with Data Factory. 

### Example

	{
	  "name": "HDInsightLinkedService",
	  "properties": {
	    "type": "HDInsight",
	    "typeProperties": {
	      "clusterUri": " https://<hdinsightclustername>.azurehdinsight.net/",
	      "userName": "admin",
	      "password": "<password>",
	      "location": "WestUS",
	      "linkedServiceName": "MyHDInsightStoragelinkedService"
	    }
	  }
	}

### Properties

Property | Description | Required
-------- | ----------- | --------
type | The type property should be set to **HDInsight**. | Yes
clusterUri | The URI of the HDInsight cluster. | Yes
username | Specify the name of the user to be used to connect to an existing HDInsight cluster. | Yes
password | Specify password for the user account. | Yes
location | Specify the location of the HDInsight cluster (for example: WestUS). | Yes
linkedServiceName | Name of the linked service for the blob storage used by this HDInsight cluster. | Yes

## Azure Batch Linked Service

You can create an Azure Batch linked service to register a Batch pool of virtual machines (VMs) to a data factory. You can run .NET custom activities using either Azure Batch or Azure HDInsight.

See following topics if you are new to Azure Batch service:
 

- [Azure Batch Technical Overview](../batch/batch-technical-overview.md) for an overview of the Azure Batch service.
- [New-AzureBatchAccount](https://msdn.microsoft.com/library/mt125880.aspx) cmdlet to create an Azure Batch account (or) [Azure Management Portal](../batch/batch-technical-overview.md) to create the Azure Batch account using Azure Management Portal. See [Using PowerShell to manage Azure Batch Account](http://blogs.technet.com/b/windowshpc/archive/2014/10/28/using-azure-powershell-to-manage-azure-batch-account.aspx) topic for detailed instructions on using the cmdlet.
- [New-AzureBatchPool](https://msdn.microsoft.com/library/mt125936.aspx) cmdlet to create an Azure Batch pool.

### Example

	{
	  "name": "AzureBatchLinkedService",
	  "properties": {
	    "type": "AzureBatch",
	    "typeProperties": {
	      "accountName": "<Azure Batch account name>",
	      "accessKey": "<Azure Batch account key>",
	      "poolName": "<Azure Batch pool name>",
	      "linkedServiceName": "<Specify associated storage linked service reference here>"
	    }
	  }
	}

Append "**.<region name**" to the name of your batch account for the **accountName** property. Example: 
	
			"accountName": "mybatchaccount.eastus" 

Another option is to provide the batchUri endpoint as shown below.  

			accountName: "adfteam",
			batchUri: "https://eastus.batch.azure.com",

### Properties

Property | Description | Required
-------- | ----------- | --------
type | The type property should be set to **AzureBatch**. | Yes
accountName | Name of the Azure Batch account. | Yes
accessKey | Access key for the Azure Batch account. | Yes
poolName | Name of the pool of virtual machines. | Yes
linkedServiceName | Name of the Azure Storage linked service associated with this Azure Batch linked service. This linked service is used for staging files required to run the activity and storing the activity execution logs. | Yes


## Azure Machine Learning Linked Service

You create an Azure Machine Learning linked service to register a Machine Learning batch scoring endpoint to a data factory.

### Example

	{
	  "name": "AzureMLLinkedService",
	  "properties": {
	    "type": "AzureML",
	    "typeProperties": {
	      "mlEndpoint": "https://[batch scoring endpoint]/jobs",
	      "apiKey": "<apikey>"
	    }
	  }
	}

### Properties

Property | Description | Required
-------- | ----------- | --------
Type | The type property should be set to: **AzureML**. | Yes
mlEndpoint | The batch scoring URL. | Yes
apiKey | The published workspace model’s API. | Yes


## Azure Data Lake Analytics Linked Service
You create an **Azure Data Lake Analytics** linked service to link an Azure Data Lake Analytics compute service to an Azure data factory before using the [Data Lake Analytics U-SQL activity](data-factory-usql-activity.md) in a pipeline. 

The following example provides JSON definition for an Azure Data Lake Analytics linked service. 

	{
	    "name": "AzureDataLakeAnalyticsLinkedService",
	    "properties": {
	        "type": "AzureDataLakeAnalytics",
	        "typeProperties": {
	            "accountName": "adftestaccount",
	            "dataLakeAnalyticsUri": "datalakeanalyticscompute.net",
	            "authorization": "<authcode>",
				"sessionId": "<session ID>", 
	            "subscriptionId": "<subscription id>",
	            "resourceGroupName": "<resource group name>"
	        }
	    }
	}


The following table provides descriptions for the properties used in the JSON definition. 

Property | Description | Required
-------- | ----------- | --------
Type | The type property should be set to: **AzureDataLakeAnalytics**. | Yes
accountName | Azure Data Lake Analytics Account Name. | Yes
dataLakeAnalyticsUri | Azure Data Lake Analytics URI. |  No 
authorization | Authorization code is automatically retrieved after clicking **Authorize** button in the Data Factory Editor and completing the OAuth login. | Yes 
subscriptionId | Azure subscription id | No (If not specified, subscription of the data factory is used). 
resourceGroupName | Azure resource group name |  No (If not specified, resource group of the data factory is used).
sessionId | session id from the OAuth authorization session. Each session id is unique and may only be used once. This is auto-generated in the Data Factory Editor. | Yes


## Azure SQL Linked Service

You create an Azure SQL linked service and use it with the [Stored Procedure Activity](data-factory-stored-proc-activity.md) to invoke a stored procedure from a Data Factory pipeline. See [Azure SQL Connector](data-factory-azure-sql-connector.md#azure-sql-linked-service-properties) article for details about this linked service.


  



     
 
   
