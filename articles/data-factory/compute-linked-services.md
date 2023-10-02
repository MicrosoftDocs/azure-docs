---
title: Compute environments 
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about compute environments that can be used with Azure Data Factory and Synapse Analytics pipelines (such as Azure HDInsight) to transform or process data.
ms.service: data-factory
ms.subservice: concepts
ms.topic: conceptual
author: nabhishek
ms.author: abnarain
ms.date: 10/25/2022
ms.custom: synapse
---

# Compute environments supported by Azure Data Factory and Synapse pipelines

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[ML Studio (classic) retirement](../../includes/machine-learning-studio-classic-deprecation.md)] 

This article explains different compute environments that you can use to process or transform data. It also provides details about different configurations (on-demand vs. bring your own) supported when configuring linked services linking these compute environments.

The following table provides a list of supported compute environments and the activities that can run on them. 

| Compute environment                                          | Activities                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [On-demand HDInsight cluster](#azure-hdinsight-on-demand-linked-service) or [your own HDInsight cluster](#azure-hdinsight-linked-service) | [Hive](transform-data-using-hadoop-hive.md), [Pig](transform-data-using-hadoop-pig.md), [Spark](transform-data-using-spark.md), [MapReduce](transform-data-using-hadoop-map-reduce.md), [Hadoop Streaming](transform-data-using-hadoop-streaming.md) |
| [Azure Batch](#azure-batch-linked-service)                   | [Custom](transform-data-using-dotnet-custom-activity.md)     |
| [ML Studio (classic)](#machine-learning-studio-classic-linked-service) | [ML Studio (classic) activities: Batch Execution and Update Resource](transform-data-using-machine-learning.md) |
| [Azure Machine Learning](#azure-machine-learning-linked-service) | [Azure Machine Learning Execute Pipeline](transform-data-machine-learning-service.md) |
| [Azure Data Lake Analytics](#azure-data-lake-analytics-linked-service) | [Data Lake Analytics U-SQL](transform-data-using-data-lake-analytics.md) |
| [Azure SQL](#azure-sql-database-linked-service), [Azure Synapse Analytics](#azure-synapse-analytics-linked-service), [SQL Server](#sql-server-linked-service) | [Stored Procedure](transform-data-using-stored-procedure.md) |
| [Azure Databricks](#azure-databricks-linked-service)         | [Notebook](transform-data-databricks-notebook.md), [Jar](transform-data-databricks-jar.md), [Python](transform-data-databricks-python.md) |
| [Azure Synapse Analytics (Artifacts)](#azure-synapse-analytics-artifacts-linked-service) | [Synapse Notebook activity](transform-data-synapse-notebook.md), [Synapse Spark job definition](transform-data-synapse-spark-job-definition.md) |
| [Azure Function](#azure-function-linked-service)         | [Azure Function activity](control-flow-azure-function-activity.md)


>  

## HDInsight compute environment

Refer to below table for details about the supported storage linked service types for configuration in On-demand and BYOC (Bring your own compute) environment.

| In Compute Linked Service | Property Name                | Description                                                  | Blob | ADLS Gen2 | Azure SQL DB | ADLS Gen 1 |
| ------------------------- | ---------------------------- | ------------------------------------------------------------ | ---- | --------- | ------------ | ---------- |
| On-demand                 | linkedServiceName            | Azure Storage linked service to   be used by the on-demand cluster for storing and processing data. | Yes  | Yes       | No           | No         |
|                           | additionalLinkedServiceNames | Specifies additional storage   accounts for the HDInsight linked service so that the service   can register them on your behalf. | Yes  | No        | No           | No         |
|                           | hcatalogLinkedServiceName    | The name of Azure SQL linked   service that point to the HCatalog database. The on-demand HDInsight cluster   is created by using the Azure SQL database as the metastore. | No   | No        | Yes          | No         |
| BYOC                      | linkedServiceName            | The Azure Storage linked service   reference.                | Yes  | Yes       | No           | No         |
|                           | additionalLinkedServiceNames | Specifies additional storage   accounts for the HDInsight linked service so that the service can register them on your behalf. | No   | No        | No           | No         |
|                           | hcatalogLinkedServiceName    | A reference to the Azure SQL   linked service that points to the HCatalog database. | No   | No        | No           | No         |

### Azure HDInsight on-demand linked service

In this type of configuration, the computing environment is fully managed by the service. It is automatically created by the service before a job is submitted to process data and removed when the job is completed. You can create a linked service for the on-demand compute environment, configure it, and control granular settings for job execution, cluster management, and bootstrapping actions.

> [!NOTE]
> The on-demand configuration is currently supported only for Azure HDInsight clusters. Azure Databricks also supports on-demand jobs using job clusters. For more information, see [Azure databricks linked service](#azure-databricks-linked-service).

The service can automatically create an on-demand HDInsight cluster to process data. The cluster is created in the same region as the storage account (linkedServiceName property in the JSON) associated with the cluster. The storage account `must` be a general-purpose standard Azure Storage account. 

Note the following **important** points about on-demand HDInsight linked service:

* The on-demand HDInsight cluster is created under your Azure subscription. You are able to see the cluster in your Azure portal when the cluster is up and running. 
* The logs for jobs that are run on an on-demand HDInsight cluster are copied to the storage account associated with the HDInsight cluster. The clusterUserName, clusterPassword, clusterSshUserName, clusterSshPassword defined in your linked service definition are used to log in to the cluster for in-depth troubleshooting during the lifecycle of the cluster. 
* You are charged only for the time when the HDInsight cluster is up and running jobs.
* You can use a **Script Action** with the Azure HDInsight on-demand linked service.  

> [!IMPORTANT]
> It typically takes **20 minutes** or more to provision an Azure HDInsight cluster on demand.

#### Example

The following JSON defines a Linux-based on-demand HDInsight linked service. The service automatically creates a **Linux-based** HDInsight cluster to process the required activity. 

```json
{
  "name": "HDInsightOnDemandLinkedService",
  "properties": {
    "type": "HDInsightOnDemand",
    "typeProperties": {
      "clusterType": "hadoop",
      "clusterSize": 1,
      "timeToLive": "00:15:00",
      "hostSubscriptionId": "<subscription ID>",
      "servicePrincipalId": "<service principal ID>",
      "servicePrincipalKey": {
        "value": "<service principal key>",
        "type": "SecureString"
      },
      "tenant": "<tenent id>",
      "clusterResourceGroup": "<resource group name>",
      "version": "3.6",
      "osType": "Linux",
      "linkedServiceName": {
        "referenceName": "AzureStorageLinkedService",
        "type": "LinkedServiceReference"
      }
    },
    "connectVia": {
      "referenceName": "<name of Integration Runtime>",
      "type": "IntegrationRuntimeReference"
    }
  }
}
```

> [!IMPORTANT]
> The HDInsight cluster creates a **default container** in the blob storage you specified in the JSON (**linkedServiceName**). HDInsight does not delete this container when the cluster is deleted. This behavior is by design. With on-demand HDInsight linked service, a HDInsight cluster is created every time a slice needs to be processed unless there is an existing live cluster (**timeToLive**) and is deleted when the processing is done. 
>
> As more activity runs, you see many containers in your Azure blob storage. If you do not need them for troubleshooting of the jobs, you may want to delete them to reduce the storage cost. The names of these containers follow a pattern: `adf**yourfactoryorworkspacename**-**linkedservicename**-datetimestamp`. Use tools such as [Microsoft Azure Storage Explorer](https://storageexplorer.com/) to delete containers in your Azure blob storage.

#### Properties

| Property                     | Description                              | Required |
| ---------------------------- | ---------------------------------------- | -------- |
| type                         | The type property should be set to **HDInsightOnDemand**. | Yes      |
| clusterSize                  | Number of worker/data nodes in the cluster. The HDInsight cluster is created with 2 head nodes along with the number of worker nodes you specify for this property. The nodes are of size Standard_D3 that has 4 cores, so a 4 worker node cluster takes 24 cores (4\*4 = 16 cores for worker nodes, plus 2\*4 = 8 cores for head nodes). See [Set up clusters in HDInsight with Hadoop, Spark, Kafka, and more](../hdinsight/hdinsight-hadoop-provision-linux-clusters.md) for details. | Yes      |
| linkedServiceName            | Azure Storage linked service to be used by the on-demand cluster for storing and processing data. The HDInsight cluster is created in the same region as this Azure Storage account. Azure HDInsight has limitation on the total number of cores you can use in each Azure region it supports. Make sure you have enough core quotas in that Azure region to meet the required clusterSize. For details, refer to [Set up clusters in HDInsight with Hadoop, Spark, Kafka, and more](../hdinsight/hdinsight-hadoop-provision-linux-clusters.md)<p>Currently, you cannot create an on-demand HDInsight cluster that uses an Azure Data Lake Storage (Gen 2) as the storage. If you want to store the result data from HDInsight processing in an Azure Data Lake Storage (Gen 2), use a Copy Activity to copy the data from the Azure Blob Storage to the Azure Data Lake Storage (Gen 2). </p> | Yes      |
| clusterResourceGroup         | The HDInsight cluster is created in this resource group. | Yes      |
| timetolive                   | The allowed idle time for the on-demand HDInsight cluster. Specifies how long the on-demand HDInsight cluster stays alive after completion of an activity run if there are no other active jobs in the cluster. The minimal allowed value is 5 minutes (00:05:00).<br/><br/>For example, if an activity run takes 6 minutes and timetolive is set to 5 minutes, the cluster stays alive for 5 minutes after the 6 minutes of processing the activity run. If another activity run is executed with the 6-minutes window, it is processed by the same cluster.<br/><br/>Creating an on-demand HDInsight cluster is an expensive operation (could take a while), so use this setting as needed to improve performance of the service by reusing an on-demand HDInsight cluster.<br/><br/>If you set timetolive value to 0, the cluster is deleted as soon as the activity run completes. Whereas, if you set a high value, the cluster may stay idle for you to log on for some troubleshooting purpose but it could result in high costs. Therefore, it is important that you set the appropriate value based on your needs.<br/><br/>If the timetolive property value is appropriately set, multiple pipelines can share the instance of the on-demand HDInsight cluster. | Yes      |
| clusterType                  | The type of the HDInsight cluster to be created. Allowed values are "hadoop" and "spark". If not specified, default value is hadoop. Enterprise Security Package enabled cluster cannot be created on-demand, instead use an [existing cluster/ bring your own compute](#azure-hdinsight-linked-service). | No       |
| version                      | Version of the HDInsight cluster. If not specified, it's using the current HDInsight defined default version. | No       |
| hostSubscriptionId           | The Azure subscription ID used to create HDInsight cluster. If not specified, it uses the Subscription ID of your Azure login context. | No       |
| clusterNamePrefix           | The prefix of HDI cluster name, a timestamp automatically appends at the end of the cluster name| No       |
| sparkVersion                 | The version of spark if the cluster type is "Spark" | No       |
| additionalLinkedServiceNames | Specifies additional storage accounts for the HDInsight linked service so that the service can register them on your behalf. These storage accounts must be in the same region as the HDInsight cluster, which is created in the same region as the storage account specified by linkedServiceName. | No       |
| osType                       | Type of operating system. Allowed values are: Linux and Windows (for HDInsight 3.3 only). Default is Linux. | No       |
| hcatalogLinkedServiceName    | The name of Azure SQL linked service that point to the HCatalog database. The on-demand HDInsight cluster is created by using the Azure SQL Database as the metastore. | No       |
| connectVia                   | The Integration Runtime to be used to dispatch the activities to this HDInsight linked service. For on-demand HDInsight linked service, it only supports Azure Integration Runtime. If not specified, it uses the default Azure Integration Runtime. | No       |
| clusterUserName                   | The username to access the cluster. | No       |
| clusterPassword                   | The password in type of secure string to access the cluster. | No       |
| clusterSshUserName         | The username to SSH remotely connects to cluster's node (for Linux). | No       |
| clusterSshPassword         | The password in type of secure string to SSH remotely connect cluster's node (for Linux). | No       |
| scriptActions | Specify script for [HDInsight cluster customizations](../hdinsight/hdinsight-hadoop-customize-cluster-linux.md) during on-demand cluster creation. <br />Currently, the UI authoring tool supports specifying only 1 script action, but you can get through this limitation in the JSON (specify multiple script actions in the JSON). | No |


> [!IMPORTANT]
> HDInsight supports multiple Hadoop cluster versions that can be deployed. Each version choice creates a specific version of the Hortonworks Data Platform (HDP) distribution and a set of components that are contained within that distribution. The list of supported HDInsight versions keeps being updated to provide latest Hadoop ecosystem components and fixes. Make sure you always refer to latest information of [Supported HDInsight version and OS Type](../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions) to ensure you are using supported version of HDInsight. 
>
> [!IMPORTANT]
> Currently, HDInsight linked services does not support HBase, Interactive Query (Hive LLAP), Storm. 

* additionalLinkedServiceNames JSON example

```json
"additionalLinkedServiceNames": [{
    "referenceName": "MyStorageLinkedService2",
    "type": "LinkedServiceReference"          
}]
```

#### Service principal authentication

The On-Demand HDInsight linked service requires a service principal authentication to create HDInsight clusters on your behalf. To use service principal authentication, register an application entity in Azure Active Directory (Azure AD) and grant it the **Contributor** role of the subscription or the resource group in which the HDInsight cluster is created. For detailed steps, see [Use portal to create an Azure Active Directory application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md). Make note of the following values, which you use to define the linked service:

- Application ID
- Application key 
- Tenant ID

Use service principal authentication by specifying the following properties:

| Property                | Description                              | Required |
| :---------------------- | :--------------------------------------- | :------- |
| **servicePrincipalId**  | Specify the application's client ID.     | Yes      |
| **servicePrincipalKey** | Specify the application's key.           | Yes      |
| **tenant**              | Specify the tenant information (domain name or tenant ID) under which your application resides. You can retrieve it by hovering the mouse in the upper-right corner of the Azure portal. | Yes      |

#### Advanced Properties

You can also specify the following properties for the granular configuration of the on-demand HDInsight cluster.

| Property               | Description                              | Required |
| :--------------------- | :--------------------------------------- | :------- |
| coreConfiguration      | Specifies the core configuration parameters (as in core-site.xml) for the HDInsight cluster to be created. | No       |
| hBaseConfiguration     | Specifies the HBase configuration parameters (hbase-site.xml) for the HDInsight cluster. | No       |
| hdfsConfiguration      | Specifies the HDFS configuration parameters (hdfs-site.xml) for the HDInsight cluster. | No       |
| hiveConfiguration      | Specifies the hive configuration parameters (hive-site.xml) for the HDInsight cluster. | No       |
| mapReduceConfiguration | Specifies the MapReduce configuration parameters (mapred-site.xml) for the HDInsight cluster. | No       |
| oozieConfiguration     | Specifies the Oozie configuration parameters (oozie-site.xml) for the HDInsight cluster. | No       |
| stormConfiguration     | Specifies the Storm configuration parameters (storm-site.xml) for the HDInsight cluster. | No       |
| yarnConfiguration      | Specifies the Yarn configuration parameters (yarn-site.xml) for the HDInsight cluster. | No       |

* Example - On-demand HDInsight cluster configuration with advanced properties

```json
{
    "name": " HDInsightOnDemandLinkedService",
    "properties": {
      "type": "HDInsightOnDemand",
      "typeProperties": {
          "clusterSize": 16,
          "timeToLive": "01:30:00",
          "hostSubscriptionId": "<subscription ID>",
          "servicePrincipalId": "<service principal ID>",
          "servicePrincipalKey": {
            "value": "<service principal key>",
            "type": "SecureString"
          },
          "tenant": "<tenent id>",
          "clusterResourceGroup": "<resource group name>",
          "version": "3.6",
          "osType": "Linux",
          "linkedServiceName": {
              "referenceName": "AzureStorageLinkedService",
              "type": "LinkedServiceReference"
            },
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
            "additionalLinkedServiceNames": [{
                "referenceName": "MyStorageLinkedService2",
                "type": "LinkedServiceReference"          
            }]
        }
    },
      "connectVia": {
      "referenceName": "<name of Integration Runtime>",
      "type": "IntegrationRuntimeReference"
    }
}
```

#### Node sizes
You can specify the sizes of head, data, and zookeeper nodes using the following properties: 

| Property          | Description                              | Required |
| :---------------- | :--------------------------------------- | :------- |
| headNodeSize      | Specifies the size of the head node. The default value is: Standard_D3. See the **Specifying node sizes** section for details. | No       |
| dataNodeSize      | Specifies the size of the data node. The default value is: Standard_D3. | No       |
| zookeeperNodeSize | Specifies the size of the Zoo Keeper node. The default value is: Standard_D3. | No       |

* Specifying node sizes
See the [Sizes of Virtual Machines](../virtual-machines/sizes.md) article for string values you need to specify for the properties mentioned in the previous section. The values need to conform to the **CMDLETs & APIS** referenced in the article. As you can see in the article, the data node of Large (default) size has 7-GB memory, which may not be good enough for your scenario. 

If you want to create D4 sized head nodes and worker nodes, specify **Standard_D4** as the value for headNodeSize and dataNodeSize properties. 

```json
"headNodeSize": "Standard_D4",    
"dataNodeSize": "Standard_D4",
```

If you specify a wrong value for these properties, you may receive the following **error:** Failed to create cluster. Exception: Unable to complete the cluster create operation. Operation failed with code '400'. Cluster left behind state: 'Error'. Message: 'PreClusterCreationValidationFailure'. When you receive this error, ensure that you are using the **CMDLET & APIS** name from the table in the [Sizes of Virtual Machines](../virtual-machines/sizes.md) article.

### Bring your own compute environment
In this type of configuration, users can register an already existing computing environment as a linked service. The computing environment is managed by the user and the service uses it to execute the activities.

This type of configuration is supported for the following compute environments:

* Azure HDInsight
* Azure Batch
* Azure Machine Learning
* Azure Data Lake Analytics
* Azure SQL DB, Azure Synapse Analytics, SQL Server

## Azure HDInsight linked service
You can create an Azure HDInsight linked service to register your own HDInsight cluster with a data factory or Synapse workspace.

### Example

```json
{
    "name": "HDInsightLinkedService",
    "properties": {
      "type": "HDInsight",
      "typeProperties": {
        "clusterUri": " https://<hdinsightclustername>.azurehdinsight.net/",
        "userName": "username",
        "password": {
            "value": "passwordvalue",
            "type": "SecureString"
          },
        "linkedServiceName": {
              "referenceName": "AzureStorageLinkedService",
              "type": "LinkedServiceReference"
        }
      },
      "connectVia": {
        "referenceName": "<name of Integration Runtime>",
        "type": "IntegrationRuntimeReference"
      }
    }
  }
```

### Properties
| Property          | Description                                                  | Required |
| ----------------- | ------------------------------------------------------------ | -------- |
| type              | The type property should be set to **HDInsight**.            | Yes      |
| clusterUri        | The URI of the HDInsight cluster.                            | Yes      |
| username          | Specify the name of the user to be used to connect to an existing HDInsight cluster. | Yes      |
| password          | Specify password for the user account.                       | Yes      |
| linkedServiceName | Name of the Azure Storage linked service that refers to the Azure blob storage used by the HDInsight cluster. <p>Currently, you cannot specify an Azure Data Lake Storage (Gen 2) linked service for this property. If the HDInsight cluster has access to the Data Lake Store, you may access data in the Azure Data Lake Storage (Gen 2) from Hive/Pig scripts. </p> | Yes      |
| isEspEnabled      | Specify '*true*' if the HDInsight cluster is [Enterprise Security Package](../hdinsight/domain-joined/apache-domain-joined-architecture.md) enabled. Default is '*false*'. | No       |
| connectVia        | The Integration Runtime to be used to dispatch the activities to this linked service. You can use Azure Integration Runtime or Self-hosted Integration Runtime. If not specified, it uses the default Azure Integration Runtime. <br />For Enterprise Security Package (ESP) enabled HDInsight cluster use a self-hosted integration runtime, which has a line of sight to the cluster or it should be deployed inside the same Virtual Network as the ESP HDInsight cluster. | No       |

> [!IMPORTANT]
> HDInsight supports multiple Hadoop cluster versions that can be deployed. Each version choice creates a specific version of the Hortonworks Data Platform (HDP) distribution and a set of components that are contained within that distribution. The list of supported HDInsight versions keeps being updated to provide latest Hadoop ecosystem components and fixes. Make sure you always refer to latest information of [Supported HDInsight version and OS Type](../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions) to ensure you are using supported version of HDInsight. 
>
> [!IMPORTANT]
> Currently, HDInsight linked services does not support HBase, Interactive Query (Hive LLAP), Storm. 
>
> 

## Azure Batch linked service

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

You can create an Azure Batch linked service to register a Batch pool of virtual machines (VMs) to a data or Synapse workspace. You can run Custom activity using Azure Batch.

See following articles if you are new to Azure Batch service:

* [Azure Batch basics](../batch/batch-technical-overview.md) for an overview of the Azure Batch service.
* [New-AzBatchAccount](/powershell/module/az.batch/New-azBatchAccount) cmdlet to create an Azure Batch account (or) [Azure portal](../batch/batch-account-create-portal.md) to create the Azure Batch account using Azure portal. See [Using PowerShell to manage Azure Batch Account](/archive/blogs/windowshpc/using-azure-powershell-to-manage-azure-batch-account) article for detailed instructions on using the cmdlet.
* [New-AzBatchPool](/powershell/module/az.batch/New-AzBatchPool) cmdlet to create an Azure Batch pool.

> [!IMPORTANT]
> When creating a new Azure Batch pool, ‘VirtualMachineConfiguration’ must be used and NOT ‘CloudServiceConfiguration'. For more details refer [Azure Batch Pool migration guidance](../batch/batch-pool-cloud-service-to-virtual-machine-configuration.md). 

### Example

```json
{
    "name": "AzureBatchLinkedService",
    "properties": {
      "type": "AzureBatch",
      "typeProperties": {
        "accountName": "batchaccount",
        "accessKey": {
          "type": "SecureString",
          "value": "access key"
        },
        "batchUri": "https://batchaccount.region.batch.azure.com",
        "poolName": "poolname",
        "linkedServiceName": {
          "referenceName": "StorageLinkedService",
          "type": "LinkedServiceReference"
        }
      },
      "connectVia": {
        "referenceName": "<name of Integration Runtime>",
        "type": "IntegrationRuntimeReference"
      }
    }
  }
```


### Properties
| Property          | Description                              | Required |
| ----------------- | ---------------------------------------- | -------- |
| type              | The type property should be set to **AzureBatch**. | Yes      |
| accountName       | Name of the Azure Batch account.         | Yes      |
| accessKey         | Access key for the Azure Batch account.  | Yes      |
| batchUri          | URL to your Azure Batch account, in format of https://*batchaccountname.region*.batch.azure.com. | Yes      |
| poolName          | Name of the pool of virtual machines.    | Yes      |
| linkedServiceName | Name of the Azure Storage linked service associated with this Azure Batch linked service. This linked service is used for staging files required to run the activity. | Yes      |
| connectVia        | The Integration Runtime to be used to dispatch the activities to this linked service. You can use Azure Integration Runtime or Self-hosted Integration Runtime. If not specified, it uses the default Azure Integration Runtime. | No       |

## Machine Learning Studio (classic) linked service

[!INCLUDE[ML Studio (classic) retirement](../../includes/machine-learning-studio-classic-deprecation.md)] 

You create a Machine Learning Studio (classic) linked service to register a Machine Learning Studio (classic) batch scoring endpoint to a data factory or Synapse workspace.

### Example

```json
{
    "name": "AzureMLLinkedService",
    "properties": {
      "type": "AzureML",
      "typeProperties": {
        "mlEndpoint": "https://[batch scoring endpoint]/jobs",
        "apiKey": {
            "type": "SecureString",
            "value": "access key"
        }
     },
     "connectVia": {
        "referenceName": "<name of Integration Runtime>",
        "type": "IntegrationRuntimeReference"
      }
    }
}
```

### Properties
| Property               | Description                              | Required                                 |
| ---------------------- | ---------------------------------------- | ---------------------------------------- |
| Type                   | The type property should be set to: **AzureML**. | Yes                                      |
| mlEndpoint             | The batch scoring URL.                   | Yes                                      |
| apiKey                 | The published workspace model's API.     | Yes                                      |
| updateResourceEndpoint | The Update Resource URL for an ML Studio (classic) Web Service endpoint used to update the predictive Web Service with trained model file | No                                       |
| servicePrincipalId     | Specify the application's client ID.     | Required if updateResourceEndpoint is specified |
| servicePrincipalKey    | Specify the application's key.           | Required if updateResourceEndpoint is specified |
| tenant                 | Specify the tenant information (domain name or tenant ID) under which your application resides. You can retrieve it by hovering the mouse in the upper-right corner of the Azure portal. | Required if updateResourceEndpoint is specified |
| connectVia             | The Integration Runtime to be used to dispatch the activities to this linked service. You can use Azure Integration Runtime or Self-hosted Integration Runtime. If not specified, it uses the default Azure Integration Runtime. | No                                       |

## Azure Machine Learning linked service
You create an Azure Machine Learning linked service to connect an Azure Machine Learning workspace to a data factory or Synapse workspace.

> [!NOTE]
> Currently only service principal authentication is supported for the Azure Machine Learning linked service.

### Example

```json
{
    "name": "AzureMLServiceLinkedService",
    "properties": {
        "type": "AzureMLService",
        "typeProperties": {
            "subscriptionId": "subscriptionId",
            "resourceGroupName": "resourceGroupName",
            "mlWorkspaceName": "mlWorkspaceName",
            "servicePrincipalId": "service principal id",
            "servicePrincipalKey": {
                "value": "service principal key",
                "type": "SecureString"
            },
            "tenant": "tenant ID"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime?",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Properties

| Property               | Description                              | Required                                 |
| ---------------------- | ---------------------------------------- | ---------------------------------------- |
| Type                   | The type property should be set to: **AzureMLService**. | Yes                                      |
| subscriptionId         | Azure subscription ID              | Yes                                      |
| resourceGroupName      | name | Yes                                      |
| mlWorkspaceName        | Azure Machine Learning workspace name | Yes  |
| servicePrincipalId     | Specify the application's client ID.     | Yes |
| servicePrincipalKey    | Specify the application's key.           | Yes |
| tenant                 | Specify the tenant information (domain name or tenant ID) under which your application resides. You can retrieve it by hovering the mouse in the upper-right corner of the Azure portal. | Required if updateResourceEndpoint is specified |
| connectVia             | The Integration Runtime to be used to dispatch the activities to this linked service. You can use Azure Integration Runtime or Self-hosted Integration Runtime. If not specified, it uses the default Azure Integration Runtime. | No |

## Azure Data Lake Analytics linked service
You create an **Azure Data Lake Analytics** linked service to link an Azure Data Lake Analytics compute service to a data factory or Synapse workspace. The Data Lake Analytics U-SQL activity in the pipeline refers to this linked service. 

### Example

```json
{
    "name": "AzureDataLakeAnalyticsLinkedService",
    "properties": {
        "type": "AzureDataLakeAnalytics",
        "typeProperties": {
            "accountName": "adftestaccount",
            "dataLakeAnalyticsUri": "azuredatalakeanalytics URI",
            "servicePrincipalId": "service principal id",
            "servicePrincipalKey": {
                "value": "service principal key",
                "type": "SecureString"
            },
            "tenant": "tenant ID",
            "subscriptionId": "<optional, subscription ID of ADLA>",
            "resourceGroupName": "<optional, resource group name of ADLA>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Properties

| Property             | Description                              | Required                                 |
| -------------------- | ---------------------------------------- | ---------------------------------------- |
| type                 | The type property should be set to: **AzureDataLakeAnalytics**. | Yes                                      |
| accountName          | Azure Data Lake Analytics Account Name.  | Yes                                      |
| dataLakeAnalyticsUri | Azure Data Lake Analytics URI.           | No                                       |
| subscriptionId       | Azure subscription ID                    | No                                       |
| resourceGroupName    | Azure resource group name                | No                                       |
| servicePrincipalId   | Specify the application's client ID.     | Yes                                      |
| servicePrincipalKey  | Specify the application's key.           | Yes                                      |
| tenant               | Specify the tenant information (domain name or tenant ID) under which your application resides. You can retrieve it by hovering the mouse in the upper-right corner of the Azure portal. | Yes                                      |
| connectVia           | The Integration Runtime to be used to dispatch the activities to this linked service. You can use Azure Integration Runtime or Self-hosted Integration Runtime. If not specified, it uses the default Azure Integration Runtime. | No                                       |



## Azure Databricks linked service
You can create **Azure Databricks linked service** to register Databricks workspace that you use to run the Databricks workloads(notebook, jar, python). 
> [!IMPORTANT]
> Databricks linked services supports [Instance pools](https://aka.ms/instance-pools) & System-assigned managed identity authentication.

### Example - Using new job cluster in Databricks

```json
{
    "name": "AzureDatabricks_LS",
    "properties": {
        "type": "AzureDatabricks",
        "typeProperties": {
            "domain": "https://eastus.azuredatabricks.net",
            "newClusterNodeType": "Standard_D3_v2",
            "newClusterNumOfWorker": "1:10",
            "newClusterVersion": "4.0.x-scala2.11",
            "accessToken": {
                "type": "SecureString",
                "value": "dapif33c9c721144c3a790b35000b57f7124f"
            }
        }
    }
}

```

### Example - Using existing Interactive cluster in Databricks

```json
{
    "name": " AzureDataBricksLinedService",
    "properties": {
      "type": " AzureDatabricks",
      "typeProperties": {
        "domain": "https://westeurope.azuredatabricks.net",
        "accessToken": {
            "type": "SecureString", 
            "value": "dapif33c9c72344c3a790b35000b57f7124f"
          },
        "existingClusterId": "{clusterId}"
        }
}

```

### Properties

| Property             | Description                              | Required                                 |
| -------------------- | ---------------------------------------- | ---------------------------------------- |
| name                 | Name of the Linked Service               | Yes   |
| type                 | The type property should be set to: **Azure Databricks**. | Yes                                      |
| domain               | Specify the Azure Region accordingly based on the region of the Databricks workspace. Example: https://eastus.azuredatabricks.net | Yes                                 |
| accessToken          | Access token is required for the service to authenticate to Azure Databricks. Access token needs to be generated from the databricks workspace. More detailed steps to find the access token can be found [here](/azure/databricks/dev-tools/api/latest/authentication#generate-token)  | No                                       |
| MSI          | Use the service's managed identity (system-assigned) to authenticate to Azure Databricks. You do not need Access Token when using 'MSI' authentication. More details about Managed Identity authentication can be found [here](https://techcommunity.microsoft.com/t5/azure-data-factory/azure-databricks-activities-now-support-managed-identity/ba-p/1922818)  | No                                       |
| existingClusterId    | Cluster ID of an existing cluster to run all jobs on this. This should be an already created Interactive Cluster. You may need to manually restart the cluster if it stops responding. Databricks suggest running jobs on new clusters for greater reliability. You can find the Cluster ID of an Interactive Cluster on Databricks workspace -> Clusters -> Interactive Cluster Name -> Configuration -> Tags. [More details](https://docs.databricks.com/user-guide/clusters/tags.html) | No 
| instancePoolId    | Instance Pool ID of an existing pool in databricks workspace.  | No  |
| newClusterVersion    | The Spark version of the cluster. It creates a job cluster in databricks. | No  |
| newClusterNumOfWorker| Number of worker nodes that this cluster should have. A cluster has one Spark Driver and num_workers Executors for a total of num_workers + 1 Spark nodes. A string formatted Int32, like "1" means numOfWorker is 1 or "1:10" means autoscale from 1 as min and 10 as max.  | No                |
| newClusterNodeType   | This field encodes, through a single value, the resources available to each of the Spark nodes in this cluster. For example, the Spark nodes can be provisioned and optimized for memory or compute intensive workloads. This field is required for new cluster                | No               |
| newClusterSparkConf  | a set of optional, user-specified Spark configuration key-value pairs. Users can also pass in a string of extra JVM options to the driver and the executors via spark.driver.extraJavaOptions and spark.executor.extraJavaOptions respectively. | No  |
| newClusterInitScripts| a set of optional, user-defined initialization scripts for the new cluster. You can specify the init scripts in workspace files (recommended) or via the DBFS path (legacy). | No  |


## Azure SQL Database linked service

You create an Azure SQL linked service and use it with the [Stored Procedure Activity](transform-data-using-stored-procedure.md) to invoke a stored procedure from a pipeline. See [Azure SQL Connector](connector-azure-sql-database.md#linked-service-properties) article for details about this linked service.

## Azure Synapse Analytics linked service

You create an Azure Synapse Analytics linked service and use it with the [Stored Procedure Activity](transform-data-using-stored-procedure.md) to invoke a stored procedure from a pipeline. See [Azure Synapse Analytics Connector](connector-azure-sql-data-warehouse.md#linked-service-properties) article for details about this linked service.

## SQL Server linked service

You create a SQL Server linked service and use it with the [Stored Procedure Activity](transform-data-using-stored-procedure.md) to invoke a stored procedure from a pipeline. See [SQL Server connector](connector-sql-server.md#linked-service-properties) article for details about this linked service.

## Azure Synapse Analytics (Artifacts) linked service

You create an Azure Synapse Analytics (Artifacts) linked service and use it with the [Synapse Notebook Activity](transform-data-synapse-notebook.md) and [Synapse Spark job definition Activity](transform-data-synapse-spark-job-definition.md). 

### Example

```json
{
    "name": "AzureSynapseArtifacts",
    "properties": {
        "description": "AzureSynapseArtifactsDescription",
        "annotations": [],
        "type": "AzureSynapseArtifacts",
        "typeProperties": {
            "endpoint": "https://<workspacename>.dev.azuresynapse.net",
            "authentication": "MSI",
            "workspaceResourceId": "<workspace Resource Id>"
        }
    }
}
```

### Properties

| **Property** | **Description** | **Required** |
| --- | --- | --- |
| name | Name of the Linked Service	 | Yes |
| description | description of the Linked Service	 | No |
| annotations | annotations of the Linked Service	 | No |
| type | The type property should be set to **AzureSynapseArtifacts** | Yes |
| endpoint | The Azure Synapse Analytics URL	 | Yes |
| authentication | The default setting is System Assigned Managed Identity | Yes |
| workspaceResourceId | workspace Resource Id	 | Yes |

## Azure Function linked service

You create an Azure Function linked service and use it with the [Azure Function activity](control-flow-azure-function-activity.md) to run Azure Functions in a pipeline. The return type of the Azure function has to be a valid `JObject`. (Keep in mind that [JArray](https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_Linq_JArray.htm) is *not* a `JObject`.) Any return type other than `JObject` fails and raises the user error *Response Content is not a valid JObject*.

| **Property** | **Description** | **Required** |
| --- | --- | --- |
| type   | The type property must be set to: **AzureFunction** | yes |
| function app url | URL for the Azure Function App. Format is `https://<accountname>.azurewebsites.net`. This URL is the value under **URL** section when viewing your Function App in the Azure portal  | yes |
| function key | Access key for the Azure Function. Click on the **Manage** section for the respective function, and copy either the **Function Key** or the **Host key**. Find out more here: [Azure Functions HTTP triggers and bindings](../azure-functions/functions-bindings-http-webhook-trigger.md#authorization-keys) | yes |
|   |   |   |

## Next steps

For a list of the supported transformation activities, see [Transform data](transform-data.md).
