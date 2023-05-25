---
title: Compute environments supported by Azure Data Factory version 1
description: Learn about compute environments that you can use in Azure Data Factory pipelines (such as Azure HDInsight) to transform or process data.
author: dcstwh
ms.author: weetok
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
---

# Compute environments supported by Azure Data Factory version 1

[!INCLUDE[ML Studio (classic) retirement](../../../includes/machine-learning-studio-classic-deprecation.md)] 

> [!NOTE]
> This article applies to version 1 of Azure Data Factory. If you are using the current version of the Data Factory service, see [Compute linked services in](../compute-linked-services.md).

This article explains the compute environments that you can use to process or transform data. It also provides details about different configurations (on-demand versus bring-your-own) that Data Factory supports when you configure linked services that link these compute environments to an Azure data factory.

The following table provides a list of compute environments that are supported by Data Factory, and the activities that can run on them. 

| Compute environment                      | Activities                               |
| ---------------------------------------- | ---------------------------------------- |
| [On-demand Azure HDInsight cluster](#azure-hdinsight-on-demand-linked-service) or [your own HDInsight cluster](#azure-hdinsight-linked-service) | [DotNet](data-factory-use-custom-activities.md), [Hive](data-factory-hive-activity.md), [Pig](data-factory-pig-activity.md), [MapReduce](data-factory-map-reduce.md), [Hadoop Streaming](data-factory-hadoop-streaming-activity.md) |
| [Azure Batch](#azure-batch-linked-service) | [DotNet](data-factory-use-custom-activities.md) |
| [ML Studio (classic)](#ml-studio-classic-linked-service) | [Studio (classic) activities: Batch Execution and Update Resource](data-factory-azure-ml-batch-execution-activity.md) |
| [Azure Data Lake Analytics](#azure-data-lake-analytics-linked-service) | [Data Lake Analytics U-SQL](data-factory-usql-activity.md) |
| [Azure SQL](#azure-sql-linked-service), [Azure Synapse Analytics](#azure-synapse-analytics-linked-service), [SQL Server](#sql-server-linked-service) | [Stored Procedure Activity](data-factory-stored-proc-activity.md) |

## <a name="supported-hdinsight-versions-in-azure-data-factory"></a>HDInsight versions supported in Data Factory
Azure HDInsight supports multiple Hadoop cluster versions that you can deploy at any time. Each supported version creates a specific version of the Hortonworks Data Platform (HDP) distribution and a set of components in the distribution. 

Microsoft updates the list of supported HDInsight versions  with the latest Hadoop ecosystem components and fixes. For detailed information, see [Supported HDInsight versions](../../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions).

> [!IMPORTANT]
> Linux-based HDInsight version 3.3 was retired July 31, 2017. Data Factory version 1 on-demand HDInsight linked services customers were given until December 15, 2017, to test and upgrade to a later version of HDInsight. Windows-based HDInsight will be retired July 31, 2018.
>
> 

### After the retirement date 

After December 15, 2017:

- You can no longer create Linux-based HDInsight version 3.3 (or earlier versions) clusters by using an on-demand HDInsight linked service in Data Factory version 1. 
- If the  [**osType** and **Version** properties](#azure-hdinsight-on-demand-linked-service) are not explicitly specified in the JSON definition for an existing Data Factory version 1 on-demand HDInsight linked service, the default value is changed from **Version=3.1, osType=Windows** to **Version=\<latest HDI default version\>, osType=Linux**.

After July 31, 2018:

- You can no longer create any version of Windows-based HDInsight clusters by using an on-demand HDInsight linked service in Data Factory version 1. 

### Recommended actions

- To ensure that you can use the latest Hadoop ecosystem components and fixes, update the [**osType** and **Version** properties](#azure-hdinsight-on-demand-linked-service) of affected Data Factory version 1 on-demand HDInsight linked service definitions to newer Linux-based HDInsight versions (HDInsight 3.6). 
- Before December 15, 2017, test Data Factory version 1 Hive, Pig, MapReduce, and Hadoop streaming activities that reference the affected linked service. Ensure that they are compatible with the new **osType** and **Version** default values (**Version=3.6**, **osType=Linux**) or the explicit HDInsight version and OS type that you are upgrading to. 
  To learn more about compatibility, see [Migrate from a Windows-based HDInsight cluster to a Linux-based cluster](../../hdinsight/index.yml) and [What are the Hadoop components and versions available with HDInsight?](../../hdinsight/hdinsight-component-versioning.md). 
- To continue using a Data Factory version 1 on-demand HDInsight linked service to create Windows-based HDInsight clusters, explicitly set **osType** to **Windows** before December 15, 2017. We recommend that you migrate to Linux-based HDInsight clusters before July 31, 2018. 
- If you are using an on-demand HDInsight linked service to execute Data Factory version 1 DotNet Custom Activity, update the DotNet Custom Activity JSON definition to instead use an Azure Batch linked service. For more information, see [Use custom activities in a Data Factory pipeline](./data-factory-use-custom-activities.md). 

> [!Note]
> If you use your existing, bring-your-own cluster HDInsight linked device in Data Factory version 1 or a bring-your-own and on-demand HDInsight linked service in Azure Data Factory, no action is required. In those scenarios, the latest version support policy of HDInsight clusters is already enforced. 
>
> 


## On-demand compute environment
In an on-demand configuration, Data Factory fully manages the compute environment. Data Factory automatically creates the compute environment before a job is submitted for processing data. When the job is finished, Data Factory removes the compute environment. 

You can create a linked service for an on-demand compute environment. Use the linked service to configure the compute environment, and to control granular settings for job execution, cluster management, and bootstrapping actions.

> [!NOTE]
> Currently, the on-demand configuration is supported only for HDInsight clusters.
> 

## Azure HDInsight on-demand linked service
Data Factory can automatically create a Windows-based or Linux-based on-demand HDInsight cluster for processing data. The cluster is created in the same region as the storage account that's associated with the cluster. Use the JSON **linkedServiceName** property to create the cluster.

Note the following *key* points about on-demand HDInsight linked service:

* The on-demand HDInsight cluster doesn't appear in your Azure subscription. The Data Factory service manages the on-demand HDInsight cluster on your behalf.
* The logs for jobs that are run on an on-demand HDInsight cluster are copied to the storage account that's associated with the HDInsight cluster. To access these logs, in the Azure portal, go to the **Activity Run Details** pane. For more information, see [Monitor and manage pipelines](data-factory-monitor-manage-pipelines.md).
* You are charged only for the time that the HDInsight cluster is up and running jobs.

> [!IMPORTANT]
> It typically takes *20 minutes* or more to provision an on-demand HDInsight cluster.
>
> 

### Example
The following JSON defines a Linux-based on-demand HDInsight linked service. Data Factory automatically creates a *Linux-based* HDInsight cluster when it processes a data slice. 

```json
{
    "name": "HDInsightOnDemandLinkedService",
    "properties": {
        "type": "HDInsightOnDemand",
        "typeProperties": {
            "version": "3.6",
            "osType": "Linux",
            "clusterSize": 1,
            "timeToLive": "00:05:00",            
            "linkedServiceName": "AzureStorageLinkedService"
        }
    }
}
```

> [!IMPORTANT]
> The HDInsight cluster creates a *default container* in the Azure Blob storage that you specify in the JSON **linkedServiceName** property. By design, HDInsight doesn't delete this container when the cluster is deleted. In an on-demand HDInsight linked service, an HDInsight cluster is created every time a slice needs to be processed, unless there's an existing live cluster (**timeToLive**). The cluster is deleted when processing is finished. 
>
> As more slices are processed, you see many containers in your Blob storage. If you don't need the containers for troubleshooting jobs, you might want to delete the containers to reduce the storage cost. The names of these containers follow a pattern: `adf<your Data Factory name>-<linked service name>-<date and time>`. You can use a tool like [Microsoft Azure Storage Explorer](https://storageexplorer.com/) to delete containers in Blob storage.
>
> 

### Properties
| Property                     | Description                              | Required |
| ---------------------------- | ---------------------------------------- | -------- |
| type                         | Set the type property to **HDInsightOnDemand**. | Yes      |
| clusterSize                  | The number of worker and data nodes in the cluster. The HDInsight cluster is created with 2 head nodes, in addition to the number of worker nodes that you specify for this property. The nodes are of size Standard_D3, which has 4 cores. A 4-worker node cluster takes 24 cores (4\*4 = 16 cores for worker nodes, plus 2\*4 = 8 cores for head nodes). For details about the Standard_D3 tier, see [Create Linux-based Hadoop clusters in HDInsight](../../hdinsight/hdinsight-hadoop-provision-linux-clusters.md). | Yes      |
| timeToLive                   | The allowed idle time for the on-demand HDInsight cluster. Specifies how long the on-demand HDInsight cluster stays alive when an activity run is finished, if there are no other active jobs in the cluster.<br /><br />For example, if an activity run takes 6 minutes and **timeToLive** is set to 5 minutes, the cluster stays alive for 5 minutes after the 6 minutes of processing the activity run. If another activity run is executed in the 6-minute window, it's processed by the same cluster.<br /><br />Creating an on-demand HDInsight cluster is an expensive operation (it might take a while). Use this setting as needed to improve performance of a data factory by reusing an on-demand HDInsight cluster.<br /><br />If you set the **timeToLive** value to **0**, the cluster is deleted as soon as the activity run finishes. However, if you set a high value, the cluster might stay idle, unnecessarily resulting in high costs. It's important to set the appropriate value based on your needs.<br /><br />If the **timeToLive** value is appropriately set, multiple pipelines can share the instance of the on-demand HDInsight cluster. | Yes      |
| version                      | The version of the HDInsight cluster. For allowed HDInsight versions, see [Supported HDInsight versions](../../hdinsight/hdinsight-component-versioning.md#supported-hdinsight-versions). If this value isn't specified,  the [latest HDI default version](../../hdinsight/hdinsight-component-versioning.md) is used. | No       |
| linkedServiceName            | The Azure Storage linked service to be used by the on-demand cluster for storing and processing data. The HDInsight cluster is created in the same region as this storage account.<p>Currently, you can't create an on-demand HDInsight cluster that uses Azure Data Lake Store as the storage. If you want to store the result data from HDInsight processing in Data Lake Store, use Copy Activity to copy the data from Blob storage to Data Lake Store. </p> | Yes      |
| additionalLinkedServiceNames | Specifies additional storage accounts for the HDInsight linked service. Data Factory registers the storage accounts on your behalf. These storage accounts must be in the same region as the HDInsight cluster. The HDInsight cluster is created in the same region as the storage account that's specified by the **linkedServiceName** property. | No       |
| osType                       | The type of operating system. Allowed values are **Linux** and **Windows**. If this value isn't specified, **Linux** is used.  <br /><br />We strongly recommend using Linux-based HDInsight clusters. The retirement date for HDInsight on Windows is July 31, 2018. | No       |
| hcatalogLinkedServiceName    | The name of the Azure SQL linked service that points to the HCatalog database. The on-demand HDInsight cluster is created by using the SQL database as the metastore. | No       |

#### Example: LinkedServiceNames JSON

```json
"additionalLinkedServiceNames": [
    "otherLinkedServiceName1",
    "otherLinkedServiceName2"
  ]
```

### Advanced properties
For granular configuration of the on-demand HDInsight cluster, you can specify the following properties:

| Property               | Description                              | Required |
| :--------------------- | :--------------------------------------- | :------- |
| coreConfiguration      | Specifies the core configuration parameters (core-site.xml) for the HDInsight cluster to be created. | No       |
| hBaseConfiguration     | Specifies the HBase configuration parameters (hbase-site.xml) for the HDInsight cluster. | No       |
| hdfsConfiguration      | Specifies the HDFS configuration parameters (hdfs-site.xml) for the HDInsight cluster. | No       |
| hiveConfiguration      | Specifies the Hive configuration parameters (hive-site.xml) for the HDInsight cluster. | No       |
| mapReduceConfiguration | Specifies the MapReduce configuration parameters (mapred-site.xml) for the HDInsight cluster. | No       |
| oozieConfiguration     | Specifies the Oozie configuration parameters (oozie-site.xml) for the HDInsight cluster. | No       |
| stormConfiguration     | Specifies the Storm configuration parameters (storm-site.xml) for the HDInsight cluster. | No       |
| yarnConfiguration      | Specifies the YARN configuration parameters (yarn-site.xml) for the HDInsight cluster. | No       |

#### Example: On-demand HDInsight cluster configuration with advanced properties

```json
{
  "name": " HDInsightOnDemandLinkedService",
  "properties": {
    "type": "HDInsightOnDemand",
    "typeProperties": {
      "version": "3.6",
      "osType": "Linux",
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
To specify the size of head, data, and ZooKeeper nodes, use the following properties: 

| Property          | Description                              | Required |
| :---------------- | :--------------------------------------- | :------- |
| headNodeSize      | Sets the size of the head node. The default value is **Standard_D3**. For details, see [Specify node sizes](#specify-node-sizes). | No       |
| dataNodeSize      | Sets the size of the data node. The default value is **Standard_D3**. | No       |
| zookeeperNodeSize | Sets the size of the ZooKeeper node. The default value is **Standard_D3**. | No       |

#### Specify node sizes
For string values that you must specify for the properties described in the preceding section, see [Virtual machine sizes](../../virtual-machines/sizes.md). The values must conform to the cmdlets and APIs referenced in [Virtual machine sizes](../../virtual-machines/sizes.md). The  Large (default) data node size has 7 GB of memory. This might not be sufficient for your scenario. 

If you want to create D4-size head nodes and worker nodes, specify **Standard_D4** as the value for the **headNodeSize** and **dataNodeSize** properties: 

```json
"headNodeSize": "Standard_D4",    
"dataNodeSize": "Standard_D4",
```

If you set an incorrect value for these properties, you might see the following message:

  Failed to create cluster. Exception: Unable to complete the cluster create operation. Operation failed with code '400'. Cluster left behind state: 'Error'. Message: 'PreClusterCreationValidationFailure'. 
  
If you see this message, ensure that you are using the cmdlet and API names from the table in [Virtual machine sizes](../../virtual-machines/sizes.md).  

> [!NOTE]
> Currently, Data Factory doesn't support HDInsight clusters that use Data Lake Store as the primary store. Use Azure Storage as the primary store for HDInsight clusters. 
>
> 


## Bring-your-own compute environment
You can register an existing compute environment as a linked service in Data Factory. You manage the compute environment. The Data Factory service uses the compute environment to execute activities.

This type of configuration is supported for the following compute environments:

* Azure HDInsight
* Azure Batch
* ML Studio (classic)
* Azure Data Lake Analytics
* Azure SQL Database, Azure Synapse Analytics, SQL Server

## Azure HDInsight linked service
You can create an HDInsight linked service to register your own HDInsight cluster with Data Factory.

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
| Property          | Description                              | Required |
| ----------------- | ---------------------------------------- | -------- |
| type              | Set the type property to **HDInsight**. | Yes      |
| clusterUri        | The URI of the HDInsight cluster.        | Yes      |
| username          | The name of the user account to use to connect to an existing HDInsight cluster. | Yes      |
| password          | The password for the user account.   | Yes      |
| linkedServiceName | The name of the storage linked service that refers to the Blob storage used by the HDInsight cluster. <p>Currently, you can't specify a Data Lake Store linked service for this property. If the HDInsight cluster has access to Data Lake Store, you might access data in Data Lake Store from Hive or Pig scripts. </p> | Yes      |

## Azure Batch linked service
You can create a Batch linked service to register a Batch pool of virtual machines (VMs) to a data factory. You can run Microsoft .NET custom activities by using either Batch or HDInsight.

If you are new to using the Batch service:

* Learn about [Azure Batch basics](/azure/azure-sql/database/sql-database-paas-overview).
* Learn about the [New-AzureBatchAccount](/previous-versions/azure/mt125880(v=azure.100)) cmdlet. Use this cmdlet to create a Batch account. Or, you can create the Batch account by using the [Azure portal](../../batch/batch-account-create-portal.md). For detailed information about using the cmdlet, see [Using PowerShell to manage a Batch account](/archive/blogs/windowshpc/using-azure-powershell-to-manage-azure-batch-account).
* Learn about the [New-AzureBatchPool](/previous-versions/azure/mt125936(v=azure.100)) cmdlet. Use this cmdlet to create a Batch pool.

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

For the **accountName** property, append **.\<region name\>** to the name of your batch account. For example:

```json
"accountName": "mybatchaccount.eastus"
```

Another option is to provide the **batchUri** endpoint. For example:

```json
"accountName": "adfteam",
"batchUri": "https://eastus.batch.azure.com",
```

### Properties
| Property          | Description                              | Required |
| ----------------- | ---------------------------------------- | -------- |
| type              | Set the type property to **AzureBatch**. | Yes      |
| accountName       | The name of the Batch account.         | Yes      |
| accessKey         | The access key for the Batch account.  | Yes      |
| poolName          | The name of the pool of VMs.    | Yes      |
| linkedServiceName | The name of the storage linked service that's associated with this Batch linked service. This linked service is used for staging files that are required to run the activity, and to store activity execution logs. | Yes      |

## ML Studio (classic) linked service

[!INCLUDE[ML Studio (classic) retirement](../../../includes/machine-learning-studio-classic-deprecation.md)] 

You can create an ML Studio (classic) linked service to register a Studio (classic) batch scoring endpoint to a data factory.

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
| Property   | Description                              | Required |
| ---------- | ---------------------------------------- | -------- |
| Type       | Set the type property to **AzureML**. | Yes      |
| mlEndpoint | The batch scoring URL.                   | Yes      |
| apiKey     | The published workspace model’s API.     | Yes      |

## Azure Data Lake Analytics linked service
You can create a Data Lake Analytics linked service to link a Data Lake Analytics compute service to an Azure data factory. The Data Lake Analytics U-SQL activity in the pipeline refers to this linked service. 

The following table describes the generic properties that are used in the JSON definition:

| Property                 | Description                              | Required                                 |
| ------------------------ | ---------------------------------------- | ---------------------------------------- |
| type                 | Set the type property to **AzureDataLakeAnalytics**. | Yes                                      |
| accountName          | The Data Lake Analytics account name.  | Yes                                      |
| dataLakeAnalyticsUri | The Data Lake Analytics URI.           | No                                       |
| subscriptionId       | The Azure subscription ID.                    | No<br /><br />(If not specified, the data factory subscription is used.) |
| resourceGroupName    | The Azure resource group name.                | No<br /><br /> (If not specified, the data factory resource group is used.) |

### Authentication options
For your Data Lake Analytics linked service, you can choose between authentication by using a service principal or a user credential.

#### Service principal authentication (recommended)
To use service principal authentication, register an application entity in Azure Active Directory (Azure AD). Then, grant Azure AD access to Data Lake Store. For detailed steps, see [Service-to-service authentication](../../data-lake-store/data-lake-store-service-to-service-authenticate-using-active-directory.md). Make note of the following values, which you use to define the linked service:
* Application ID
* Application key 
* Tenant ID

Use service principal authentication by specifying the following properties:

| Property                | Description                              | Required |
| :---------------------- | :--------------------------------------- | :------- |
| servicePrincipalId  | The application's client ID.     | Yes      |
| servicePrincipalKey | The application's key.           | Yes      |
| tenant              | The tenant information (domain name or tenant ID) where your application is located. To get this information, hover your mouse in the upper-right corner of the Azure portal. | Yes      |

**Example: Service principal authentication**
```json
{
    "name": "AzureDataLakeAnalyticsLinkedService",
    "properties": {
        "type": "AzureDataLakeAnalytics",
        "typeProperties": {
            "accountName": "adftestaccount",
            "dataLakeAnalyticsUri": "datalakeanalyticscompute.net",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": "<service principal key>",
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>",
            "subscriptionId": "<optional, subscription id of ADLA>",
            "resourceGroupName": "<optional, resource group name of ADLA>"
        }
    }
}
```

#### User credential authentication
For user credential authentication for Data Lake Analytics, specify the following properties:

| Property          | Description                              | Required |
| :---------------- | :--------------------------------------- | :------- |
| authorization | In Data Factory Editor, select the **Authorize** button. Enter the credential that assigns the autogenerated authorization URL to this property. | Yes      |
| sessionId     | The OAuth session ID from the OAuth authorization session. Each session ID is unique and can be used only once. This setting is automatically generated when you use Data Factory Editor. | Yes      |

**Example: User credential authentication**
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
            "subscriptionId": "<optional, subscription id of ADLA>",
            "resourceGroupName": "<optional, resource group name of ADLA>"
        }
    }
}
```

#### Token expiration
The authorization code that you generated by selecting the **Authorize** button expires after a set interval. 

You might see the following error message when the authentication token expires: 

  Credential operation error: invalid_grant - AADSTS70002: Error validating credentials. AADSTS70008: The provided access grant is expired or revoked. Trace ID: d18629e8-af88-43c5-88e3-d8419eb1fca1 Correlation ID: fac30a0c-6be6-4e02-8d69-a776d2ffefd7 Timestamp: 2015-12-15 21:09:31Z

The following table shows expirations by user account type: 

| User type                                | Expires after                            |
| :--------------------------------------- | :--------------------------------------- |
| User accounts that are *not* managed by Azure AD (Hotmail, Live, and so on) | 12 hours.                                 |
| User accounts that *are* managed by Azure AD | 14 days after the last slice run. <br /><br />90 days, if a slice that's based on an OAuth-based linked service runs at least once every 14 days. |

To avoid or resolve this error, reauthorize by selecting the **Authorize** button when the token expires. Then, redeploy the linked service. You can also generate values for the **sessionId** and **authorization** properties programmatically by using the following code:

```csharp
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

For details about the Data Factory classes that are used in this code example, see:
* [AzureDataLakeStoreLinkedService class](/dotnet/api/microsoft.azure.management.datafactories.models.azuredatalakestorelinkedservice)
* [AzureDataLakeAnalyticsLinkedService class](/dotnet/api/microsoft.azure.management.datafactories.models.azuredatalakeanalyticslinkedservice)
* [AuthorizationSessionGetResponse class](/dotnet/api/microsoft.azure.management.datafactories.models.authorizationsessiongetresponse)

Add a reference to Microsoft.IdentityModel.Clients.ActiveDirectory.WindowsForms.dll for the **WindowsFormsWebAuthenticationDialog** class. 

## Azure SQL linked service
You can create a SQL linked service and use it with the [Stored Procedure Activity](data-factory-stored-proc-activity.md) to invoke a stored procedure from a Data Factory pipeline. For more information, see [Azure SQL connector](data-factory-azure-sql-connector.md#linked-service-properties).

## Azure Synapse Analytics linked service
You can create an Azure Synapse Analytics linked service and use it with the [Stored Procedure Activity](data-factory-stored-proc-activity.md) to invoke a stored procedure from a Data Factory pipeline. For more information, see [Azure Synapse Analytics connector](data-factory-azure-sql-data-warehouse-connector.md#linked-service-properties).

## SQL Server linked service
You can create a SQL Server linked service and use it with the [Stored Procedure Activity](data-factory-stored-proc-activity.md) to invoke a stored procedure from a Data Factory pipeline. For more information, see [SQL Server connector](data-factory-sqlserver-connector.md#linked-service-properties).