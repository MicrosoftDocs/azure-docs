---
title: Move data to or from Data Lake Store | Microsoft Docs
description: Learn how to move data to or from Data Lake Store by using Data Factory
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: monicar

ms.assetid: 25b1ff3c-b2fd-48e5-b759-bb2112122e30
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/30/2017
ms.author: jingwang

---
# Move data to and from Data Lake Store by using Data Factory
This article explains how to use Copy Activity in Azure Data Factory to move data to or from Azure Data Lake Store. It builds on the [Data movement activities](data-factory-data-movement-activities.md) article, an overview of data movement with Copy Activity.

You can copy data from any supported source data store to Data Lake Store, or from Data Lake Store to any supported sink data store. For a list of data stores supported as sources or sinks by Copy Activity, see the [Supported data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats) table in the [Move data by using Copy Activity](data-factory-data-movement-activities.md) article.  

> [!NOTE]
> Create a Data Lake Store account before creating a pipeline with Copy Activity. For more information, see [Get started with Azure Data Lake Store](../data-lake-store/data-lake-store-get-started-portal.md).

## Supported authentication types
The Data Lake Store connector supports these authentication types:
* Service principal authentication.
* User credential (OAuth) authentication. 

We recommend that you use service principal authentication, especially for a scheduled data copy. Token expiration behavior can occur with user credential authentication. See the [Linked service properties](#linked-service-properties) section for configuration details.

## Pipelines
You can create a pipeline with a copy activity that moves data to or from Data Lake Store by using different tools or APIs.

The easiest way to create a pipeline is to use the Copy wizard. See [Tutorial: Create a pipeline using Copy wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough. 

You can also create a pipeline with the following tools:
* Azure portal
* Visual Studio
* Azure PowerShell
* Azure Resource Manager template
* .NET API
* REST API
 
 See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions.

Whether you use the tools or APIs, use the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create **linked services** to link input and output data stores to your data factory.
2. Create **datasets** to represent input and output data for the copy operation.
3. Create a **pipeline** with a copy activity that takes a dataset as an input and a dataset as an output.

When you use the wizard, JSON definitions for these Data Factory entities (linked services, datasets, and the pipeline) are automatically created for you. 

When you use the tools or APIs (except the .NET API), you define these Data Factory entities by using the JSON format. For samples with JSON definitions, see the [JSON examples](#json-examples) section of this article.

The following sections provide details about JSON properties that are used to define Data Factory entities specific to Data Lake Store.

## Linked service properties
A linked service links a data store to a data factory. You create a linked service of type `AzureDataLakeStore` to link your Data Lake Store data to your data factory. The following table describes JSON elements specific to Data Lake Store linked services. You can choose between service principal and user credential authentication.

| Property | Description | Required |
|:--- |:--- |:--- |
| **type** | The type property must be set to: `AzureDataLakeStore` | Yes |
| **dataLakeStoreUri** | Information about the Azure Data Lake Store account. This information takes the following format: `https://[accountname].azuredatalakestore.net/webhdfs/v1` or `adl://[accountname].azuredatalakestore.net/`. | Yes |
| **subscriptionId** | Azure subscription ID to which the Data Lake Store belongs. | Required for sink |
| **resourceGroupName** | Azure resource group name to which the Data Lake Store belongs. | Required for sink |

### Service principal authentication (recommended)
To use service principal authentication, register an application entity in Azure Active Directory (Azure AD) and grant it the access to Data Lake Store. See [Service-to-service authentication](../data-lake-store/data-lake-store-authenticate-using-active-directory.md) for detailed steps. Make note of the following values, which you use to define the linked service:
* Application ID
* Application key 
* Tenant ID

> [!IMPORTANT]
> If you are using Copy wizard to author data pipelines, make sure that you grant the service principal at least Reader role in Access control (IAM) for the Data Lake Store account and at least Read+Execute permission to your Data Lake Store root ("/") and its children. Otherwise you see the message "The credentials provided are invalid."
>
> After you create or update a service principal in Azure AD, it can take a few minutes for the changes to take effect. Check the service principal and Data Lake Store access control list (ACL) configurations. If you still see the message "The credentials provided are invalid," wait a while and try again.

| Property | Description | Required |
|:--- |:--- |:--- |
| **servicePrincipalId** | Specify the application's client ID. | Yes |
| **servicePrincipalKey** | Specify the application's key. | Yes |
| **tenant** | Specify the tenant information (domain name or tenant ID) under which your application resides. You can retrieve it by hovering the mouse in the top-right corner of the Azure portal. | Yes |

**Example: Service principal authentication**
```json
{
    "name": "AzureDataLakeStoreLinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "typeProperties": {
            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": "<service principal key>",
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>",
            "subscriptionId": "<subscription of ADLS>",
            "resourceGroupName": "<resource group of ADLS>"
        }
    }
}
```

### User credential authentication
Alternatively, you can use user credential authentication to copy from or to Data Lake Store by specifying the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| **authorization** | Click the **Authorize** button in the Data Factory Editor and enter your credential that assigns the autogenerated authorization URL to this property. | Yes |
| **sessionId** | OAuth session ID from the OAuth authorization session. Each session ID is unique and can be used only once. This setting is automatically generated when you use the Data Factory Editor. | Yes |

**Example: User credential authentication**
```json
{
    "name": "AzureDataLakeStoreLinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "typeProperties": {
            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
            "sessionId": "<session ID>",
            "authorization": "<authorization URL>",
            "subscriptionId": "<subscription of ADLS>",
            "resourceGroupName": "<resource group of ADLS>"
        }
    }
}
```

#### Token expiration
The authorization code you generate by using the **Authorize** button expires after a certain amount of time. See the table later in this section for expiration times of different types of user accounts. You might see a message such as the following when the authentication token expires:

```
"Credential operation error: invalid_grant - AADSTS70002: Error validating credentials. AADSTS70008: The provided access grant is expired or revoked. Trace ID: d18629e8-af88-43c5-88e3-d8419eb1fca1 Correlation ID: fac30a0c-6be6-4e02-8d69-a776d2ffefd7 Timestamp: 2015-12-15 21-09-31Z".
```

| User type | Expires after |
|:--- |:--- |
| User accounts *not* managed by Azure Active Directory (@hotmail.com, @live.com, etc.). |12 hours |
| Users accounts managed by Azure Active Directory (AAD) |14 days after the last slice run. <br/><br/>90 days, if a slice based on an OAuth-based linked service runs at least once every 14 days. |

If you change your password before the token expiration time, the token expires immediately and you see the message shown earlier.

You can reauthorize the account by using the **Authorize** button when the token expires to redeploy the linked service. You can also generate values for the **sessionId** and **authorization** properties programmatically by using the code in the following section.

#### To programmatically generate sessionId and authorization values

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
See [AzureDataLakeStoreLinkedService Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakestorelinkedservice.aspx), [AzureDataLakeAnalyticsLinkedService Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakeanalyticslinkedservice.aspx), and [AuthorizationSessionGetResponse Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.authorizationsessiongetresponse.aspx) topics for details about the Data Factory classes used in the code. Add a reference to version `2.9.10826.1824` of `Microsoft.IdentityModel.Clients.ActiveDirectory.WindowsForms.dll` for the **WindowsFormsWebAuthenticationDialog** class used in the code.

## Dataset properties
To specify a dataset to represent input data in a Data Lake Store, you set the **type** property of the dataset to `AzureDataLakeStore`. Set the **linkedServiceName** property of the dataset to the name of the Azure Data Lake Store linked service. For a full list of JSON sections and properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset in JSON are similar for all dataset types (Azure SQL, Azure blob, and Azure table, for example). The `typeProperties` section is different for each type of dataset and provides information such as location and format of the data in the data store. The `typeProperties` section for a dataset of type **AzureDataLakeStore** dataset has the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| folderPath |Path to the container and folder in the Azure Data Lake store. |Yes |
| fileName |Name of the file in the Azure Data Lake store. fileName is optional and case-sensitive. <br/><br/>If you specify a filename, the activity (including Copy) works on the specific file.<br/><br/>When fileName is not specified, Copy includes all files in the folderPath for input dataset.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: Data.<Guid>.txt (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt |No |
| partitionedBy |partitionedBy is an optional property. You can use it to specify a dynamic folderPath and filename for time series data. For example, folderPath can be parameterized for every hour of data. See the [Using partitionedBy property](#using-partitionedby-property) section for details and examples. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

### Using partitionedBy property
As mentioned in the previous section, you can specify a dynamic folderPath and filename for time series data with the **partitionedBy** property, [Data Factory functions, and the system variables](data-factory-functions-variables.md).

See [Creating Datasets](data-factory-create-datasets.md) and [Scheduling & Execution](data-factory-scheduling-and-execution.md) articles to understand more details on time series datasets, scheduling, and slices.

#### Sample 1

```JSON
"folderPath": "wikidatagateway/wikisampledataout/{Slice}",
"partitionedBy":
[
    { "name": "Slice", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyyMMddHH" } },
],
```
In this example, {Slice} is replaced with the value of Data Factory system variable SliceStart in the format (YYYYMMDDHH) specified. The SliceStart refers to start time of the slice. The folderPath is different for each slice. For example: wikidatagateway/wikisampledataout/2014100103 or wikidatagateway/wikisampledataout/2014100104

#### Sample 2
```JSON
"folderPath": "wikidatagateway/wikisampledataout/{Year}/{Month}/{Day}",
"fileName": "{Hour}.csv",
"partitionedBy":
 [
    { "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
    { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } },
    { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } },
    { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "hh" } }
],
```
In this example, year, month, day, and time of SliceStart are extracted into separate variables that are used by folderPath and fileName properties.

## Copy activity properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and policy are available for all types of activities.

Whereas, properties available in the typeProperties section of the activity vary with each activity type. For Copy activity, they vary depending on the types of sources and sinks

**AzureDataLakeStoreSource** supports the following properties **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the sub folders or only from the specified folder. |True (default value), False |No |

**AzureDataLakeStoreSink** supports the following properties **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| copyBehavior |Specifies the copy behavior. |<b>PreserveHierarchy</b>: preserves the file hierarchy in the target folder. The relative path of source file to source folder is identical to the relative path of target file to target folder.<br/><br/><b>FlattenHierarchy</b>: all files from the source folder are created in the first level of target folder. The target files are created with auto generated name.<br/><br/><b>MergeFiles</b>: merges all files from the source folder to one file. If the File/Blob Name is specified, the merged file name would be the specified name; otherwise, would be auto-generated file name. |No |

## Supported file and compression formats
See [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md) article on details.

## JSON examples
The following examples provide sample JSON definitions that you can use to create a pipeline by using [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md) or [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data to and from Azure Data Lake Store and Azure Blob Storage. However, data can be copied **directly** from any of the sources to any of the supported sinks. For more information, see the section "Supported data stores and formats" in [Move data by using Copy Activity](data-factory-data-movement-activities.md).  
## Example: Copy data from Azure Blob to Azure Data Lake Store
The following sample shows:

1. A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
2. A linked service of type [AzureDataLakeStore](#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureDataLakeStore](#dataset-properties).
5. A [pipeline](data-factory-create-pipelines.md) with a Copy activity that uses [BlobSource](data-factory-azure-blob-connector.md#copy-activity-properties) and [AzureDataLakeStoreSink](#copy-activity-properties).

The sample copies time-series data from an Azure Blob Storage to Azure Data Lake Store every hour. The JSON properties used in these samples are described in sections following the samples.

**Azure Storage linked service:**

```JSON
{
  "name": "StorageLinkedService",
  "properties": {
    "type": "AzureStorage",
    "typeProperties": {
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
    }
  }
}
```

**Azure Data Lake Store linked service**

```JSON
{
    "name": "AzureDataLakeStoreLinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "typeProperties": {
            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": "<service principal key>",
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>",
            "subscriptionId": "<subscription of ADLS>",
            "resourceGroupName": "<resource group of ADLS>"
        }
    }
}
```

> [!NOTE]
> See the steps in [Azure Data Lake Store Linked Service properties](#linked-service-properties) section with configuration details.
>

**Azure Blob input dataset:**

Data is picked up from a new blob every hour (frequency: hour, interval: 1). The folder path and file name for the blob are dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, and day part of the start time and file name uses the hour part of the start time. “external”: “true” setting informs Data Factory service that the table is external to the data factory and is not produced by an activity in the data factory.

```JSON
{
  "name": "AzureBlobInput",
  "properties": {
    "type": "AzureBlob",
    "linkedServiceName": "StorageLinkedService",
    "typeProperties": {
      "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}",
      "partitionedBy": [
        {
          "name": "Year",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "yyyy"
          }
        },
        {
          "name": "Month",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "MM"
          }
        },
        {
          "name": "Day",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "dd"
          }
        },
        {
          "name": "Hour",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "HH"
          }
        }
      ]
    },
    "external": true,
    "availability": {
      "frequency": "Hour",
      "interval": 1
    },
    "policy": {
      "externalData": {
        "retryInterval": "00:01:00",
        "retryTimeout": "00:10:00",
        "maximumRetry": 3
      }
    }
  }
}
```

**Azure Data Lake Store output dataset:**

The sample copies data to an Azure Data Lake store. New data is copies to Data Lake store every hour.

```JSON
{
    "name": "AzureDataLakeStoreOutput",
      "properties": {
        "type": "AzureDataLakeStore",
        "linkedServiceName": "AzureDataLakeStoreLinkedService",
        "typeProperties": {
            "folderPath": "datalake/output/"
        },
        "availability": {
              "frequency": "Hour",
              "interval": 1
        }
      }
}
```


**A copy activity in a pipeline with Blob source and Azure Data Lake Store sink:**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **BlobSource** and **sink** type is set to **AzureDataLakeStoreSink**.

```json
{  
    "name":"SamplePipeline",
    "properties":
    {  
        "start":"2014-06-01T18:00:00",
        "end":"2014-06-01T19:00:00",
        "description":"pipeline with copy activity",
        "activities":
        [  
              {
                "name": "AzureBlobtoDataLake",
                "description": "Copy Activity",
                "type": "Copy",
                "inputs": [
                  {
                    "name": "AzureBlobInput"
                  }
                ],
                "outputs": [
                  {
                    "name": "AzureDataLakeStoreOutput"
                  }
                ],
                "typeProperties": {
                    "source": {
                        "type": "BlobSource"
                      },
                      "sink": {
                        "type": "AzureDataLakeStoreSink"
                      }
                },
                   "scheduler": {
                      "frequency": "Hour",
                      "interval": 1
                },
                "policy": {
                      "concurrency": 1,
                      "executionPriorityOrder": "OldestFirst",
                      "retry": 0,
                      "timeout": "01:00:00"
                }
              }
        ]
    }
}
```

## Example: Copy data from Azure Data Lake Store to Azure Blob
The following sample shows:

1. A linked service of type [AzureDataLakeStore](#linked-service-properties).
2. A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [AzureDataLakeStore](#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
5. A [pipeline](data-factory-create-pipelines.md) with a Copy activity that uses [AzureDataLakeStoreSource](#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties)

The sample copies time-series data from an Azure Data Lake store to an Azure blob every hour. The JSON properties used in these samples are described in sections following the samples.

**Azure Data Lake Store linked service:**

```json
{
    "name": "AzureDataLakeStoreLinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "typeProperties": {
            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": "<service principal key>",
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>"
        }
    }
}
```

> [!NOTE]
> See the steps in [Azure Data Lake Store Linked Service properties](#linked-service-properties) section with configuration details.
>

**Azure Storage linked service:**

```JSON
{
  "name": "StorageLinkedService",
  "properties": {
    "type": "AzureStorage",
    "typeProperties": {
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
    }
  }
}
```
**Azure Data Lake input dataset:**

Setting **"external": true** informs the Data Factory service that the table is external to the data factory and is not produced by an activity in the data factory.

```json
{
    "name": "AzureDataLakeStoreInput",
      "properties":
    {
        "type": "AzureDataLakeStore",
        "linkedServiceName": "AzureDataLakeStoreLinkedService",
        "typeProperties": {
            "folderPath": "datalake/input/",
            "fileName": "SearchLog.tsv",
            "format": {
                "type": "TextFormat",
                "rowDelimiter": "\n",
                "columnDelimiter": "\t"
            }
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
              "interval": 1
        },
        "policy": {
              "externalData": {
                "retryInterval": "00:01:00",
                "retryTimeout": "00:10:00",
                "maximumRetry": 3
              }
        }
      }
}
```
**Azure Blob output dataset:**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

```JSON
{
  "name": "AzureBlobOutput",
  "properties": {
    "type": "AzureBlob",
    "linkedServiceName": "StorageLinkedService",
    "typeProperties": {
      "folderPath": "mycontainer/myfolder/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
      "partitionedBy": [
        {
          "name": "Year",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "yyyy"
          }
        },
        {
          "name": "Month",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "MM"
          }
        },
        {
          "name": "Day",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "dd"
          }
        },
        {
          "name": "Hour",
          "value": {
            "type": "DateTime",
            "date": "SliceStart",
            "format": "HH"
          }
        }
      ],
      "format": {
        "type": "TextFormat",
        "columnDelimiter": "\t",
        "rowDelimiter": "\n"
      }
    },
    "availability": {
      "frequency": "Hour",
      "interval": 1
    }
  }
}
```

**A copy activity in a pipeline with Azure Data Lake Store source and Blob sink:**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **AzureDataLakeStoreSource** and **sink** type is set to **BlobSink**.

```json
{  
    "name":"SamplePipeline",
    "properties":{  
        "start":"2014-06-01T18:00:00",
        "end":"2014-06-01T19:00:00",
        "description":"pipeline for copy activity",
        "activities":[  
              {
                "name": "AzureDakeLaketoBlob",
                "description": "copy activity",
                "type": "Copy",
                "inputs": [
                  {
                    "name": "AzureDataLakeStoreInput"
                  }
                ],
                "outputs": [
                  {
                    "name": "AzureBlobOutput"
                  }
                ],
                "typeProperties": {
                    "source": {
                        "type": "AzureDataLakeStoreSource",
                      },
                      "sink": {
                        "type": "BlobSink"
                      }
                },
                   "scheduler": {
                      "frequency": "Hour",
                      "interval": 1
                },
                "policy": {
                      "concurrency": 1,
                      "executionPriorityOrder": "OldestFirst",
                      "retry": 0,
                      "timeout": "01:00:00"
                }
              }
         ]
    }
}
```

You can also map columns from source dataset to columns from sink dataset in the copy activity definition. For details, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).

## Performance and Tuning
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
