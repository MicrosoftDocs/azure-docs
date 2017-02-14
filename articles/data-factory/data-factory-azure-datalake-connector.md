---
title: Move data to/from Azure Data Lake Store | Microsoft Docs
description: Learn how to move data to/from Azure Data Lake Store using Azure Data Factory
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
ms.date: 02/08/2017
ms.author: jingwang

---
# Move data to and from Azure Data Lake Store using Azure Data Factory
This article outlines how you can use the Copy Activity in an Azure data factory to move data from/to Azure Data Lake Store to/from another data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with the copy activity and the supported data store combinations.

> [!NOTE]
> Create an Azure Data Lake Store account before creating a pipeline with a Copy Activity to move data to/from an Azure Data Lake store. To learn about Azure Data Lake Store, see [Get started with Azure Data Lake Store](../data-lake-store/data-lake-store-get-started-portal.md).
>

## Supported authentication types
Azure Data Lake Store connector support **service principal** authentication and **user credential** authentication. You are recommended to use the former especially for scheduled data copy, to avoid token expiration behavior with the latter. See [Azure Data Lake Store Linked Service properties](#azure-data-lake-store-linked-service-properties) section with configuration details.

## Copy data wizard
The easiest way to create a pipeline that copies data to/from Azure Data Lake Store is to use the Copy data wizard. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.

The following examples provide sample JSON definitions that you can use to create a pipeline by using [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md) or [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data to and from Azure Data Lake Store and Azure Blob Storage. However, data can be copied **directly** from any of the sources to any of the supported sinks. For more information, see the section "Supported data stores and formats" in [Move data by using Copy Activity](data-factory-data-movement-activities.md).  

## Sample: Copy data from Azure Blob to Azure Data Lake Store
The following sample shows:

1. A linked service of type [AzureStorage](#azure-storage-linked-service-properties).
2. A linked service of type [AzureDataLakeStore](#azure-data-lake-linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [AzureBlob](#azure-blob-dataset-type-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureDataLakeStore](#azure-data-lake-dataset-type-properties).
5. A [pipeline](data-factory-create-pipelines.md) with a Copy activity that uses [BlobSource](#azure-blob-copy-activity-type-properties) and [AzureDataLakeStoreSink](#azure-data-lake-copy-activity-type-properties).

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

**Azure Data Lake linked service:**

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
> See the steps in [Azure Data Lake Store Linked Service properties](#azure-data-lake-store-linked-service-properties) section with configuration details.
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

**Azure Data Lake output dataset:**

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


**Pipeline with a Copy activity:**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **BlobSource** and **sink** type is set to **AzureDataLakeStoreSink**.

```JSON
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

## Sample: Copy data from Azure Data Lake Store to Azure Blob
The following sample shows:

1. A linked service of type [AzureDataLakeStore](#azure-data-lake-linked-service-properties).
2. A linked service of type [AzureStorage](#azure-storage-linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [AzureDataLakeStore](#azure-data-lake-dataset-type-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](#azure-blob-dataset-type-properties).
5. A [pipeline](data-factory-create-pipelines.md) with a Copy activity that uses [AzureDataLakeStoreSource](#azure-data-lake-copy-activity-type-properties) and [BlobSink](#azure-blob-copy-activity-type-properties)

The sample copies time-series data from an Azure Data Lake store to an Azure blob every hour. The JSON properties used in these samples are described in sections following the samples.

**Azure Data Lake Store linked service:**

```JSON
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
> See the steps in [Azure Data Lake Store Linked Service properties](#azure-data-lake-store-linked-service-properties) section with configuration details.
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

```JSON
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

**Pipeline with the Copy activity:**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **AzureDataLakeStoreSource** and **sink** type is set to **BlobSink**.

```JSON
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

## Azure Data Lake Store Linked Service properties
The following table provides description for JSON elements specific to Azure Data Lake Store linked service, and you can choose between **service principal** and **user credential** authentication.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzureDataLakeStore** | Yes |
| dataLakeStoreUri | Specify information about the Azure Data Lake Store account. It is in the following format: **https://[accountname].azuredatalakestore.net/webhdfs/v1** or **adl://[accountname].azuredatalakestore.net/**. | Yes |
| subscriptionId | Azure subscription Id to which Data Lake Store belongs. | Required for sink |
| resourceGroupName | Azure resource group name to which Data Lake Store belongs. | Required for sink |

### Using service principal authentication (recommended)
To use service principal authentication, firstly you need register an application entity in Azure Active Directory (AAD) and grant it access in Data Lake Store. Afterwards, you can specify below properties in Azure Data Factory with corresponding application ID, application key and tenant information to copy data from/to Data Lake Store. Refer to [Service-to-service authentication](../data-lake-store/data-lake-store-authenticate-using-active-directory.md) on how to set it up and retrieve the required info.

> [!IMPORTANT]
> When using copy wizard, make sure to grant the service principal at least Read permission to your ADLS root ("/") or Reader role for the ADLS account, in order to successfully navigate among the folders. Otherwise you may see "The credentials provided are invalid" error.
>
> If you newly create/update a service principal from AAD, it may take few minutes to actually take effect. Double check the service principal and ADLS ACL configuration first, if you still see error saying "The credentials provided are invalid", wait a while and try again.
>

| Property | Description | Required |
|:--- |:--- |:--- |
| servicePrincipalId | Specify the application's client ID. | Yes |
| servicePrincipalKey | Specify the application's key. | Yes |
| tenant | Specify the tenant information (domain name or tenant ID) under which your application resides. You can retrieve it by hovering the mouse in the top-right corner of the Azure Portal. | Yes |

**Example: using service principal authentication**
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

### Using user credential authentication
Alternatively, you can use user credential authentication to copy from/to Data Lake Store by specifying below properties.

| Property | Description | Required |
|:--- |:--- |:--- |
| authorization | Click **Authorize** button in the **Data Factory Editor** and enter your credential that assigns the auto-generated authorization URL to this property. | Yes |
| sessionId | OAuth session id from the OAuth authorization session. Each session id is unique and may only be used once. This setting is automatically generated when you use Data Factory Editor. | Yes |

**Example: using user credential authentication**
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
The authorization code you generate by using the **Authorize** button expires after sometime. See the following table for the expiration times for different types of user accounts. You may see the following error message when the authentication **token expires**: "Credential operation error: invalid_grant - AADSTS70002: Error validating credentials. AADSTS70008: The provided access grant is expired or revoked. Trace ID: d18629e8-af88-43c5-88e3-d8419eb1fca1 Correlation ID: fac30a0c-6be6-4e02-8d69-a776d2ffefd7 Timestamp: 2015-12-15 21-09-31Z".

| User type | Expires after |
|:--- |:--- |
| User accounts NOT managed by Azure Active Directory (@hotmail.com, @live.com, etc.). |12 hours |
| Users accounts managed by Azure Active Directory (AAD) |14 days after the last slice run. <br/><br/>90 days, if a slice based on OAuth-based linked service runs at least once every 14 days. |

If you change your password before this token expiration time, the token expires immediately and you see the error mentioned in this section.

To avoid/resolve this error, reauthorize using the **Authorize** button when the **token expires** and redeploy the linked service. You can also generate values for **sessionId** and **authorization** properties programmatically using code in the following section:

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
See [AzureDataLakeStoreLinkedService Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakestorelinkedservice.aspx), [AzureDataLakeAnalyticsLinkedService Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.azuredatalakeanalyticslinkedservice.aspx), and [AuthorizationSessionGetResponse Class](https://msdn.microsoft.com/library/microsoft.azure.management.datafactories.models.authorizationsessiongetresponse.aspx) topics for details about the Data Factory classes used in the code. Add a reference to **2.9.10826.1824** version of **Microsoft.IdentityModel.Clients.ActiveDirectory.WindowsForms.dll** for the WindowsFormsWebAuthenticationDialog class used in the code.

## Azure Data Lake Dataset type properties
For a full list of JSON sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc.).

The **typeProperties** section is different for each type of dataset and provides information about the location, format etc., of the data in the data store. The typeProperties section for dataset of type **AzureDataLakeStore** dataset has the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| folderPath |Path to the container and folder in the Azure Data Lake store. |Yes |
| fileName |Name of the file in the Azure Data Lake store. fileName is optional and case-sensitive. <br/><br/>If you specify a filename, the activity (including Copy) works on the specific file.<br/><br/>When fileName is not specified, Copy includes all files in the folderPath for input dataset.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: Data.<Guid>.txt (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt |No |
| partitionedBy |partitionedBy is an optional property. You can use it to specify a dynamic folderPath and filename for time series data. For example, folderPath can be parameterized for every hour of data. See the [Using partitionedBy property](#using-partitionedby-property) section for details and examples. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](#specifying-textformat), [Json Format](#specifying-jsonformat), [Avro Format](#specifying-avroformat), [Orc Format](#specifying-orcformat), and [Parquet Format](#specifying-parquetformat) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**; and supported levels are: **Optimal** and **Fastest**. For more information, see [Specifying compression](#specifying-compression) section. |No |

### Using partitionedBy property
You can specify a dynamic folderPath and filename for time series data with the **partitionedBy** section, Data Factory macros, and the system variables: SliceStart and SliceEnd, which indicate start and end times for a given data slice.

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

[!INCLUDE [data-factory-file-format](../../includes/data-factory-file-format.md)]

[!INCLUDE [data-factory-compression](../../includes/data-factory-compression.md)]

## Azure Data Lake Copy Activity type properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and policy are available for all types of activities.

Properties available in the typeProperties section of the activity on the other hand vary with each activity type. For Copy activity, they vary depending on the types of sources and sinks

**AzureDataLakeStoreSource** supports the following properties **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the sub folders or only from the specified folder. |True (default value), False |No |

**AzureDataLakeStoreSink** supports the following properties **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| copyBehavior |Specifies the copy behavior. |**PreserveHierarchy:** preserves the file hierarchy in the target folder. The relative path of source file to source folder is identical to the relative path of target file to target folder.<br/><br/>**FlattenHierarchy:** all files from the source folder are created in the first level of target folder. The target files are created with auto generated name.<br/><br/>**MergeFiles:** merges all files from the source folder to one file. If the File/Blob Name is specified, the merged file name would be the specified name; otherwise, would be auto-generated file name. |No |

[!INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

[!INCLUDE [data-factory-type-conversion-sample](../../includes/data-factory-type-conversion-sample.md)]

[!INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]

## Performance and Tuning

Depending on whether initial data movement is planned with a big volume of historical data or incremental production data load, Azure Data Factory has options to improve the performance of those tasks. The concurrency parameter is a part of the **Copy Activity** and defines how many different activity windows will be processed in parallel. The **parallelCopies** parameter defines the parallelism for the single activity run. It is important to consider using these parameters when designing data movement pipelines with Azure Data Factory to achieve the best throughput.

See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
