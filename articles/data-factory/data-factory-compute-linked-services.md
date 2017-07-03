---
title: Compute environments supported by Azure Data Factory | Microsoft Docs
description: Learn about compute environments that you can use in Azure Data Factory pipelines to transform/process data.
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: monicar

ms.assetid: 6877a7e8-1a58-4cfb-bbd3-252ac72e4145
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/05/2017
ms.author: shlo

---
# Compute environments supported by Azure Data Factory
This article explains different compute environments that you can use to process or transform data. It also provides details about different configurations (on-demand vs. bring your own) supported by Data Factory when configuring linked services linking these compute environments to an Azure data factory.

The following table provides a list of compute environments supported by Data Factory and the activities that can run on them. 

| Compute environment | activities |
| --- | --- |
| [On-demand HDInsight cluster](#azure-hdinsight-on-demand-linked-service) or [your own HDInsight cluster](#azure-hdinsight-linked-service) |[DotNet](data-factory-use-custom-activities.md), [Hive](data-factory-hive-activity.md), [Pig](data-factory-pig-activity.md), [MapReduce](data-factory-map-reduce.md), [Hadoop Streaming](data-factory-hadoop-streaming-activity.md) |
| [Azure Batch](#azure-batch-linked-service) |[DotNet](data-factory-use-custom-activities.md) |
| [Azure Machine Learning](#azure-machine-learning-linked-service) |[Machine Learning activities: Batch Execution and Update Resource](data-factory-azure-ml-batch-execution-activity.md) |
| [Azure Data Lake Analytics](#azure-data-lake-analytics-linked-service) |[Data Lake Analytics U-SQL](data-factory-usql-activity.md) |
| [Azure SQL](#azure-sql-linked-service), [Azure SQL Data Warehouse](#azure-sql-data-warehouse-linked-service), [SQL Server](#sql-server-linked-service) |[Stored Procedure](data-factory-stored-proc-activity.md) |

## Supported HDInsight versions in Azure Data Factory
Azure HDInsight supports multiple Hadoop cluster versions that can be deployed at any time. Each version choice creates a specific version of the Hortonworks Data Platform (HDP) distribution and a set of components that are contained within that distribution. Microsoft keeps updating the list of supported versions of HDInsight to provide latest Hadoop ecosystem components and fixes. The HDInsight 3.2 is deprecated on 04/01/2017, for more detailed information, refer to [supported HDInsight versions](../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions).

This impacts existing Azure Data Factories that have Activities running against HDInsight 3.2 clusters. We recommend users to follow the guidelines in the following section to update the impacted Data Factories:

### For Linked Services pointing to your own HDInsight clusters
* **HDInsight Linked Services pointing to your own HDInsight 3.2 or below clusters:**

  Azure Data Factory supports submitting jobs to your own HDInsight clusters from HDI 3.1 to [the latest supported HDInsight version](../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions). However, you can no longer create HDInsight 3.2 cluster after 04/01/2017 based on the deprecation policy documented in [supported HDInsight versions](../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions).  

  **Recommendations:** 
  * Perform tests to ensure the compatibility of the Activities that reference this Linked Services to [the latest supported HDInsight version](../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions) with information documented in [Hadoop components available with different HDInsight versions](../hdinsight/hdinsight-component-versioning.md#hadoop-components-available-with-different-hdinsight-versions) and [Hortonworks release notes associated with HDInsight versions](../hdinsight/hdinsight-component-versioning.md#hortonworks-release-notes-associated-with-hdinsight-versions).
  * Upgrade your HDInsight 3.2 cluster to [the latest supported HDInsight version](../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions) to get the latest Hadoop ecosystem components and fixes. 

* **HDInsight Linked Services pointing to your own HDInsight 3.3 or above clusters:**

  Azure Data Factory supports submitting jobs to your own HDInsight clusters from HDI 3.1 to [the latest supported HDInsight version](../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions). 
  
  **Recommendations:** 
  * No action is required from Data Factory perspective. However, if you are on a lower version of HDInsight, we still recommend upgrading to [the latest supported HDInsight version](../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions) to get the latest Hadoop ecosystem components and fixes.

### For HDInsight On-Demand Linked Services
* **Version 3.2 or below is specified in HDInsight On-Demand Linked Services JSON definition:**
  
  Azure Data Factory will support creation of On-Demand HDInsight clusters of version 3.3 or more from **05/15/2017** onwards. And, the end of support for existing on-demand HDInsight 3.2 linked services is extended to **07/15/2017**.  

  **Recommendations:** 
  * Perform tests to ensure the compatibility of the Activities that reference this Linked Services to  [the latest supported HDInsight version](../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions) with information documented in [Hadoop components available with different HDInsight versions](../hdinsight/hdinsight-component-versioning.md#hadoop-components-available-with-different-hdinsight-versions) and [Hortonworks release notes associated with HDInsight versions](../hdinsight/hdinsight-component-versioning.md#hortonworks-release-notes-associated-with-hdinsight-versions).
  * Before **07/15/2017**, update the Version property in On-Demand HDI Linked Service JSON definition to [the latest supported HDInsight version](../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions) to get the latest Hadoop ecosystem components and fixes. For detailed JSON definition, refer to the [Azure HDInsight On-Demand Linked Service sample](#azure-hdinsight-on-demand-linked-service). 

* **Version not specified in On-Demand HDInsight Linked Services:**
  
  Azure Data Factory will support creation of on-demand HDInsight clusters of version 3.3 or more from **05/15/2017** onwards. And, the end of support to existing dn-demand HDInsight 3.2 linked services is extended to **07/15/2017**. 

  Before **05/15/2017**, if left blank, the default values for version and osType properties are: 

  | Property | Default Value | Required |
  | --- | --- | --- |
  Version	| HDI 3.1 for Windows cluster and HDI 3.2 for Linux cluster.| No
  osType | The default is Windows | No

  After **05/15/2017**, if left blank, the default values for version and osType properties are:

  | Property | Default Value | Required |
  | --- | --- | --- |
  Version	| HDI 3.3 for Windows cluster and 3.5 for Linux cluster.	| No
  osType | The default is Linux	| No

  **Recommendations:** 
  * Before **05/15/2017**, update the Linked Service to explicitly define the expected Version and osType combination in On-Demand HDInsight Linked Services JSON definition. You can set Version to 3.2 to ensure backward compatibility. 
  * Between **05/15/2017** and **07/15/2017**, perform tests to ensure the compatibility of the Activities that reference this Linked Services to [the latest supported HDInsight version](../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions) with information documented in [Hadoop components available with different HDInsight versions](../hdinsight/hdinsight-component-versioning.md#hadoop-components-available-with-different-hdinsight-versions) and [Hortonworks release notes associated with HDInsight versions](../hdinsight/hdinsight-component-versioning.md#hortonworks-release-notes-associated-with-hdinsight-versions).  
  * Before **07/15/2017**, set the Version property in On-Demand HDInsight Linked Services JSON definition to [the latest supported HDInsight version](../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions), or use the default value, which is HDInsight 3.5 to get the latest Hadoop ecosystem components and fixes. For detailed JSON definition, refer to the [Azure HDInsight On-Demand Linked Service sample](#azure-hdinsight-on-demand-linked-service).

>[!Note]
>Currently Azure Data Factory does not support HDInsight clusters using Azure Data Lake Store as primary store. Use Azure Storage as primary store for HDInsight clusters. 
>  
>  

## On-demand compute environment
In this type of configuration, the computing environment is fully managed by the Azure Data Factory service. It is automatically created by the Data Factory service before a job is submitted to process data and removed when the job is completed. You can create a linked service for the on-demand compute environment, configure it, and control granular settings for job execution, cluster management, and bootstrapping actions.

> [!NOTE]
> The on-demand configuration is currently supported only for Azure HDInsight clusters.
> 
> 

## Azure HDInsight On-Demand Linked Service
The Azure Data Factory service can automatically create a Windows/Linux-based on-demand HDInsight cluster to process data. The cluster is created in the same region as the storage account (linkedServiceName property in the JSON) associated with the cluster.

Note the following **important** points about on-demand HDInsight linked service:

* You do not see the on-demand HDInsight cluster created in your Azure subscription. the Azure Data Factory service manages the on-demand HDInsight cluster on your behalf.
* The logs for jobs that are run on an on-demand HDInsight cluster are copied to the storage account associated with the HDInsight cluster. You can access these logs from the Azure portal in the **Activity Run Details** blade. See [Monitor and Manage Pipelines](data-factory-monitor-manage-pipelines.md) article for details.
* You are charged only for the time when the HDInsight cluster is up and running jobs.

> [!IMPORTANT]
> It typically takes **20 minutes** or more to provision an Azure HDInsight cluster on demand.
> 
> 

### Example
The following JSON defines a Linux-based on-demand HDInsight linked service. The Data Factory service automatically creates a **Linux-based** HDInsight cluster when processing a data slice. 

```json
{
    "name": "HDInsightOnDemandLinkedService",
    "properties": {
        "type": "HDInsightOnDemand",
        "typeProperties": {
            "clusterSize": 4,
            "timeToLive": "00:05:00",
            "osType": "linux",
            "linkedServiceName": "StorageLinkedService"
        }
    }
}
```

To use a Windows-based HDInsight cluster, set **osType** to **windows** or do not use the property as the default value is: windows.  

> [!IMPORTANT]
> The HDInsight cluster creates a **default container** in the blob storage you specified in the JSON (**linkedServiceName**). HDInsight does not delete this container when the cluster is deleted. This behavior is by design. With on-demand HDInsight linked service, a HDInsight cluster is created every time a slice needs to be processed unless there is an existing live cluster (**timeToLive**) and is deleted when the processing is done. 
> 
> As more slices are processed, you see many containers in your Azure blob storage. If you do not need them for troubleshooting of the jobs, you may want to delete them to reduce the storage cost. The names of these containers follow a pattern: `adf**yourdatafactoryname**-**linkedservicename**-datetimestamp`. Use tools such as [Microsoft Storage Explorer](http://storageexplorer.com/) to delete containers in your Azure blob storage.
> 
> 

### Properties
| Property | Description | Required |
| --- | --- | --- |
| type |The type property should be set to **HDInsightOnDemand**. |Yes |
| clusterSize |Number of worker/data nodes in the cluster. The HDInsight cluster is created with 2 head nodes along with the number of worker nodes you specify for this property. The nodes are of size Standard_D3 that has 4 cores, so a 4 worker node cluster takes 24 cores (4\*4 = 16 cores for worker nodes, plus 2\*4 = 8 cores for head nodes). See [Create Linux-based Hadoop clusters in HDInsight](../hdinsight/hdinsight-hadoop-provision-linux-clusters.md) for details about the Standard_D3 tier. |Yes |
| timetolive |The allowed idle time for the on-demand HDInsight cluster. Specifies how long the on-demand HDInsight cluster stays alive after completion of an activity run if there are no other active jobs in the cluster.<br/><br/>For example, if an activity run takes 6 minutes and timetolive is set to 5 minutes, the cluster stays alive for 5 minutes after the 6 minutes of processing the activity run. If another activity run is executed with the 6-minutes window, it is processed by the same cluster.<br/><br/>Creating an on-demand HDInsight cluster is an expensive operation (could take a while), so use this setting as needed to improve performance of a data factory by reusing an on-demand HDInsight cluster.<br/><br/>If you set timetolive value to 0, the cluster is deleted as soon as the activity run in processed. On the other hand, if you set a high value, the cluster may stay idle unnecessarily resulting in high costs. Therefore, it is important that you set the appropriate value based on your needs.<br/><br/>Multiple pipelines can share the instance of the on-demand HDInsight cluster if the timetolive property value is appropriately set |Yes |
| version |Version of the HDInsight cluster. The default value is 3.1 for Windows cluster and 3.2 for Linux cluster. |No |
| linkedServiceName | Azure Storage linked service to be used by the on-demand cluster for storing and processing data. The HDInsight cluster is created in the same region as this Azure Storage account.<p>Currently, you cannot create an on-demand HDInsight cluster that uses an Azure Data Lake Store as the storage. If you want to store the result data from HDInsight processing in an Azure Data Lake Store, use a Copy Activity to copy the data from the Azure Blob Storage to the Azure Data Lake Store. </p>  | Yes |
| additionalLinkedServiceNames |Specifies additional storage accounts for the HDInsight linked service so that the Data Factory service can register them on your behalf. These storage accounts must be in the same region as the HDInsight cluster, which is created in the same region as the storage account specified by linkedServiceName. |No |
| osType |Type of operating system. Allowed values are: Windows (default) and Linux |No |
| hcatalogLinkedServiceName |The name of Azure SQL linked service that point to the HCatalog database. The on-demand HDInsight cluster is created by using the Azure SQL database as the metastore. |No |

#### additionalLinkedServiceNames JSON example

```json
"additionalLinkedServiceNames": [
    "otherLinkedServiceName1",
    "otherLinkedServiceName2"
  ]
```

### Advanced Properties
You can also specify the following properties for the granular configuration of the on-demand HDInsight cluster.

| Property | Description | Required |
|:--- |:--- |:--- |
| coreConfiguration |Specifies the core configuration parameters (as in core-site.xml) for the HDInsight cluster to be created. |No |
| hBaseConfiguration |Specifies the HBase configuration parameters (hbase-site.xml) for the HDInsight cluster. |No |
| hdfsConfiguration |Specifies the HDFS configuration parameters (hdfs-site.xml) for the HDInsight cluster. |No |
| hiveConfiguration |Specifies the hive configuration parameters (hive-site.xml) for the HDInsight cluster. |No |
| mapReduceConfiguration |Specifies the MapReduce configuration parameters (mapred-site.xml) for the HDInsight cluster. |No |
| oozieConfiguration |Specifies the Oozie configuration parameters (oozie-site.xml) for the HDInsight cluster. |No |
| stormConfiguration |Specifies the Storm configuration parameters (storm-site.xml) for the HDInsight cluster. |No |
| yarnConfiguration |Specifies the Yarn configuration parameters (yarn-site.xml) for the HDInsight cluster. |No |

#### Example – On-demand HDInsight cluster configuration with advanced properties

```json
{
  "name": " HDInsightOnDemandLinkedService",
  "properties": {
    "type": "HDInsightOnDemand",
    "typeProperties": {
      "clusterSize": 16,
      "timeToLive": "01:30:00",
      "linkedServiceName": "adfods1",
      "coreConfiguration": {
        "templeton.mapper.memory.mb": "5000"
      },
      "hiveConfiguration": {
        "templeton.mapper.memory.mb": "5000"
      },
      "mapReduceConfiguration": {
        "mapreduce.reduce.java.opts": "-Xmx4000m",
        "mapreduce.map.java.opts": "-Xmx4000m",
        "mapreduce.map.memory.mb": "5000",
        "mapreduce.reduce.memory.mb": "5000",
        "mapreduce.job.reduce.slowstart.completedmaps": "0.8"
      },
      "yarnConfiguration": {
        "yarn.app.mapreduce.am.resource.mb": "5000",
        "mapreduce.map.memory.mb": "5000"
      },
      "additionalLinkedServiceNames": [
        "datafeeds",
        "adobedatafeed"
      ]
    }
  }
}
```

### Node sizes
You can specify the sizes of head, data, and zookeeper nodes using the following properties: 

| Property | Description | Required |
|:--- |:--- |:--- |
| headNodeSize |Specifies the size of the head node. The default value is: Standard_D3. See the **Specifying node sizes** section for details. |No |
| dataNodeSize |Specifies the size of the data node. The default value is: Standard_D3. |No |
| zookeeperNodeSize |Specifies the size of the Zoo Keeper node. The default value is: Standard_D3. |No |

#### Specifying node sizes
See the [Sizes of Virtual Machines](../virtual-machines/linux/sizes.md) article for string values you need to specify for the properties mentioned in the previous section. The values need to conform to the **CMDLETs & APIS** referenced in the article. As you can see in the article, the data node of Large (default) size has 7-GB memory, which may not be good enough for your scenario. 

If you want to create D4 sized head nodes and worker nodes, specify **Standard_D4** as the value for headNodeSize and dataNodeSize properties. 

```json
"headNodeSize": "Standard_D4",    
"dataNodeSize": "Standard_D4",
```

If you specify a wrong value for these properties, you may receive the following **error:** Failed to create cluster. Exception: Unable to complete the cluster create operation. Operation failed with code '400'. Cluster left behind state: 'Error'. Message: 'PreClusterCreationValidationFailure'. When you receive this error, ensure that you are using the **CMDLET & APIS** name from the table in the [Sizes of Virtual Machines](../virtual-machines/linux/sizes.md) article.  

## Bring your own compute environment
In this type of configuration, users can register an already existing computing environment as a linked service in Data Factory. The computing environment is managed by the user and the Data Factory service uses it to execute the activities.

This type of configuration is supported for the following compute environments:

* Azure HDInsight
* Azure Batch
* Azure Machine Learning
* Azure Data Lake Analytics
* Azure SQL DB, Azure SQL DW, SQL Server

## Azure HDInsight Linked Service
You can create an Azure HDInsight linked service to register your own HDInsight cluster with Data Factory.

### Example

```json
{
  "name": "HDInsightLinkedService",
  "properties": {
    "type": "HDInsight",
    "typeProperties": {
      "clusterUri": " https://<hdinsightclustername>.azurehdinsight.net/",
      "userName": "admin",
      "password": "<password>",
      "linkedServiceName": "MyHDInsightStoragelinkedService"
    }
  }
}
```

### Properties
| Property | Description | Required |
| --- | --- | --- |
| type |The type property should be set to **HDInsight**. |Yes |
| clusterUri |The URI of the HDInsight cluster. |Yes |
| username |Specify the name of the user to be used to connect to an existing HDInsight cluster. |Yes |
| password |Specify password for the user account. |Yes |
| linkedServiceName | Name of the Azure Storage linked service that refers to the Azure blob storage used by the HDInsight cluster. <p>Currently, you cannot specify an Azure Data Lake Store linked service for this property. You may access data in the Azure Data Lake Store from Hive/Pig scripts if the HDInsight cluster has access to the Data Lake Store. </p>  |Yes |

## Azure Batch Linked Service
You can create an Azure Batch linked service to register a Batch pool of virtual machines (VMs) to a data factory. You can run .NET custom activities using either Azure Batch or Azure HDInsight.

See following topics if you are new to Azure Batch service:

* [Azure Batch basics](../batch/batch-technical-overview.md) for an overview of the Azure Batch service.
* [New-AzureBatchAccount](https://msdn.microsoft.com/library/mt125880.aspx) cmdlet to create an Azure Batch account (or) [Azure portal](../batch/batch-account-create-portal.md) to create the Azure Batch account using Azure portal. See [Using PowerShell to manage Azure Batch Account](http://blogs.technet.com/b/windowshpc/archive/2014/10/28/using-azure-powershell-to-manage-azure-batch-account.aspx) topic for detailed instructions on using the cmdlet.
* [New-AzureBatchPool](https://msdn.microsoft.com/library/mt125936.aspx) cmdlet to create an Azure Batch pool.

### Example

```json
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
```

Append "**.\<region name\>**" to the name of your batch account for the **accountName** property. Example:

```json
"accountName": "mybatchaccount.eastus"
```

Another option is to provide the batchUri endpoint as shown in the following sample.  

```json
"accountName": "adfteam",
"batchUri": "https://eastus.batch.azure.com",
```

### Properties
| Property | Description | Required |
| --- | --- | --- |
| type |The type property should be set to **AzureBatch**. |Yes |
| accountName |Name of the Azure Batch account. |Yes |
| accessKey |Access key for the Azure Batch account. |Yes |
| poolName |Name of the pool of virtual machines. |Yes |
| linkedServiceName |Name of the Azure Storage linked service associated with this Azure Batch linked service. This linked service is used for staging files required to run the activity and storing the activity execution logs. |Yes |

## Azure Machine Learning Linked Service
You create an Azure Machine Learning linked service to register a Machine Learning batch scoring endpoint to a data factory.

### Example

```json
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
```

### Properties
| Property | Description | Required |
| --- | --- | --- |
| Type |The type property should be set to: **AzureML**. |Yes |
| mlEndpoint |The batch scoring URL. |Yes |
| apiKey |The published workspace model’s API. |Yes |

## Azure Data Lake Analytics Linked Service
You create an **Azure Data Lake Analytics** linked service to link an Azure Data Lake Analytics compute service to an Azure data factory before using the [Data Lake Analytics U-SQL activity](data-factory-usql-activity.md) in a pipeline.

The following example provides JSON definition for an Azure Data Lake Analytics linked service.

```json
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
```

The following table provides descriptions for the properties used in the JSON definition.

| Property | Description | Required |
| --- | --- | --- |
| Type |The type property should be set to: **AzureDataLakeAnalytics**. |Yes |
| accountName |Azure Data Lake Analytics Account Name. |Yes |
| dataLakeAnalyticsUri |Azure Data Lake Analytics URI. |No |
| authorization |Authorization code is automatically retrieved after clicking **Authorize** button in the Data Factory Editor and completing the OAuth login. |Yes |
| subscriptionId |Azure subscription id |No (If not specified, subscription of the data factory is used). |
| resourceGroupName |Azure resource group name |No (If not specified, resource group of the data factory is used). |
| sessionId |session id from the OAuth authorization session. Each session id is unique and may only be used once. This ID is auto-generated in the Data Factory Editor. |Yes |

The authorization code you generated by using the **Authorize** button expires after sometime. See the following table for the expiration times for different types of user accounts. You may see the following error message when the authentication **token expires**: Credential operation error: invalid_grant - AADSTS70002: Error validating credentials. AADSTS70008: The provided access grant is expired or revoked. Trace ID: d18629e8-af88-43c5-88e3-d8419eb1fca1 Correlation ID: fac30a0c-6be6-4e02-8d69-a776d2ffefd7 Timestamp: 2015-12-15 21:09:31Z

| User type | Expires after |
|:--- |:--- |
| User accounts NOT managed by Azure Active Directory (@hotmail.com, @live.com, @outlook.com, for example) |12 hours |
| Users accounts managed by Azure Active Directory (AAD) |14 days after the last slice run. <br/><br/>90 days, if a slice based on OAuth-based linked service runs at least once every 14 days. |

To avoid/resolve this error, reauthorize using the **Authorize** button when the **token expires** and redeploy the linked service. You can also generate values for sessionId and authorization properties programmatically using code in the following section: 

### To programmatically generate sessionId and authorization values
The following code generates **sessionId** and **authorization** values.  

```CSharp

if (linkedService.Properties.TypeProperties is AzureDataLakeStoreLinkedService ||
    linkedService.Properties.TypeProperties is AzureDataLakeAnalyticsLinkedService)
{
    AuthorizationSessionGetResponse authorizationSession = this.Client.OAuth.Get(this.ResourceGroupName, this.DataFactoryName, linkedService.Properties.Type);

    WindowsFormsWebAuthenticationDialog authenticationDialog = new WindowsFormsWebAuthenticationDialog(null);
    string authorization = authenticationDialog.AuthenticateAAD(authorizationSession.AuthorizationSession.Endpoint, new Uri("urn:ietf:wg:oauth:2.0:oob"));

    AzureDataLakeStoreLinkedService azureDataLakeStoreProperties = linkedService.Properties.TypeProperties as AzureDataLakeStoreLinkedService;
    if (azureDataLakeStoreProperties != null)
    {
        azureDataLakeStoreProperties.SessionId = authorizationSession.AuthorizationSession.SessionId;
        azureDataLakeStoreProperties.Authorization = authorization;
    }

    AzureDataLakeAnalyticsLinkedService azureDataLakeAnalyticsProperties = linkedService.Properties.TypeProperties as AzureDataLakeAnalyticsLinkedService;
    if (azureDataLakeAnalyticsProperties != null)
    {
        azureDataLakeAnalyticsProperties.SessionId = authorizationSession.AuthorizationSession.SessionId;
        azureDataLakeAnalyticsProperties.Authorization = authorization;
    }
}
```

See [AzureDataLakeStoreLinkedService Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakestorelinkedservice.aspx), [AzureDataLakeAnalyticsLinkedService Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakeanalyticslinkedservice.aspx), and [AuthorizationSessionGetResponse Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.authorizationsessiongetresponse.aspx) topics for details about the Data Factory classes used in the code. You need to add a reference to: Microsoft.IdentityModel.Clients.ActiveDirectory.WindowsForms.dll for the WindowsFormsWebAuthenticationDialog class. 

## Azure SQL Linked Service
You create an Azure SQL linked service and use it with the [Stored Procedure Activity](data-factory-stored-proc-activity.md) to invoke a stored procedure from a Data Factory pipeline. See [Azure SQL Connector](data-factory-azure-sql-connector.md#linked-service-properties) article for details about this linked service.

## Azure SQL Data Warehouse Linked Service
You create an Azure SQL Data Warehouse linked service and use it with the [Stored Procedure Activity](data-factory-stored-proc-activity.md) to invoke a stored procedure from a Data Factory pipeline. See [Azure SQL Data Warehouse Connector](data-factory-azure-sql-data-warehouse-connector.md#linked-service-properties) article for details about this linked service.

## SQL Server Linked Service
You create a SQL Server linked service and use it with the [Stored Procedure Activity](data-factory-stored-proc-activity.md) to invoke a stored procedure from a Data Factory pipeline. See [SQL Server connector](data-factory-sqlserver-connector.md#linked-service-properties) article for details about this linked service.

