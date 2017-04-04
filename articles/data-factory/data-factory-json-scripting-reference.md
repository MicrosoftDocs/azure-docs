---
title: Data Factory - JSON Scripting Reference | Microsoft Docs
description: Provides JSON schemas for Data Factory entities. 
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: 

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/28/2017
ms.author: spelluru

---
# Azure Data Factory - JSON Scripting Reference
The following sections provide links to sections in other articles that have JSON schemas specific to the store or compute. 

## Pipeline JSON
High-level pipeline JSON. Properties that are at the top level. 

## Activity JSON
Properties at the activity level. Transformation activities have just type properties. Copy activity has two sections: source and sink. 

## Dataset JSON
High-level dataset JSON. Properties that are at the top level. The typeProperties section is different for each type of dataset.

## Data stores
Click the link for the store you are interested in to see the JSON schemas for linked service, dataset, and the source/sink for the copy activity.

| Category | Data store 
|:--- |:--- |
| **Azure** |[Azure Blob storage](#azure-blob-storage) |
| &nbsp; |[Azure Data Lake Store](#azure-datalake-store) |
| &nbsp; |[Azure DocumentDB](#azure-documentdb) |
| &nbsp; |[Azure SQL Database](#azure-sql-database) |
| &nbsp; |[Azure SQL Data Warehouse](#azure-sql-data-warehouse) |
| &nbsp; |[Azure Search](#azure-search) |
| &nbsp; |[Azure Table storage](#azure-table-storage) |
| **Databases** |[Amazon Redshift](#amazon-redshift) |
| &nbsp; |[IBM DB2](#ibm-db2) |
| &nbsp; |[MySQL](#mysql) |
| &nbsp; |[Oracle](#oracle) |
| &nbsp; |[PostgreSQL](#postgresql) |
| &nbsp; |[SAP Business Warehouse](#sap-business-warehouse) |
| &nbsp; |[SAP HANA](#sap-hana) |
| &nbsp; |[SQL Server](#sql-server) |
| &nbsp; |[Sybase](#sybase) |
| &nbsp; |[Teradata](#teradata) |
| **NoSQL** |[Cassandra](#cassandra) |
| &nbsp; |[MongoDB](#mongodb) |
| **File** |[Amazon S3](#amazon-s3) |
| &nbsp; |[File System](#file-system) |
| &nbsp; |[FTP](#ftp) |
| &nbsp; |[HDFS](#hdfs) |
| &nbsp; |[SFTP](#sftp) |
| **Others** |[HTTP](#http) |
| &nbsp; |[OData](#odata) |
| &nbsp; |[ODBC](#odbc) |
| &nbsp; |[Salesforce](#salesforce) |
| &nbsp; |[Web Table](#web-table) |

## Azure Blob Storage

### Linked service
There are two types of linked services: Azure Storage linked service and Azure Storage SAS linked service.

#### Azure Storage Linked Service
The **Azure Storage linked service** allows you to link an Azure storage account to an Azure data factory by using the **account key**. It provides the data factory with global access to the Azure Storage. The following table provides description for JSON elements specific to Azure Storage linked service.

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to: **AzureStorage** |Yes |
| connectionString |Specify information needed to connect to Azure storage for the connectionString property. |Yes |

**Example:**  

```json
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

#### Azure Storage SAS Linked Service
The Azure Storage SAS linked service allows you to link an Azure Storage Account to an Azure data factory by using a Shared Access Signature (SAS). It provides the data factory with restricted/time-bound access to all/specific resources (blob/container) in the storage. The following table provides description for JSON elements specific to Azure Storage SAS linked service. 

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to: **AzureStorageSas** |Yes |
| sasUri |Specify Shared Access Signature URI to the Azure Storage resources such as blob, container, or table. |Yes |

**Example:**

```json
{  
    "name": "StorageSasLinkedService",  
    "properties": {  
        "type": "AzureStorageSas",  
        "typeProperties": {  
            "sasUri": "<storageUri>?<sasToken>"   
        }  
    }  
}  
```

For more information about these linked services, see [Azure Blob Storage connector](data-factory-azure-blob-connector.md#linked-service-properties) article. 

### Dataset
 The typeProperties section for dataset of type **AzureBlob** has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Path to the container and folder in the blob storage. Example: myblobcontainer\myblobfolder\ |Yes |
| fileName |Name of the blob. fileName is optional and case-sensitive.<br/><br/>If you specify a filename, the activity (including Copy) works on the specific Blob.<br/><br/>When fileName is not specified, Copy includes all Blobs in the folderPath for input dataset.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: Data.<Guid>.txt (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt |No |
| partitionedBy |partitionedBy is an optional property. You can use it to specify a dynamic folderPath and filename for time series data. For example, folderPath can be parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

#### Example

```json
{
     "name": "AzureBlobInput",
     "properties": {
         "type": "AzureBlob",
         "linkedServiceName": "AzureStorageLinkedService",
         "typeProperties": {
             "fileName": "input.log",
             "folderPath": "adfgetstarted/inputdata",
             "format": {
                 "type": "TextFormat",
                 "columnDelimiter": ","
             }
         },
         "availability": {
             "frequency": "Month",
             "interval": 1
         },
         "external": true,
         "policy": {}
     }
 }
 ```


For more information, see [Azure Blob connector](data-factory-azure-blob-connector.md#dataset-properties) article.

### BlobSource in Copy Activity
**BlobSource** supports the following properties in the **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the sub folders or only from the specified folder. |True (default value), False |No |

#### Example: BlobSource**
```json
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2016-06-01T18:00:00",
    "end":"2016-06-01T19:00:00",
    "description":"pipeline with copy activity",
    "activities":[  
      {
        "name": "AzureBlobtoSQL",
        "description": "Copy Activity",
        "type": "Copy",
        "inputs": [
          {
            "name": "AzureBlobInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureSqlOutput"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "BlobSource"
          },
          "sink": {
            "type": "SqlSink"
          }
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
### BlobSink in Copy Activity
**BlobSink** supports the following properties **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| copyBehavior |Defines the copy behavior when the source is BlobSource or FileSystem. |<b>PreserveHierarchy</b>: preserves the file hierarchy in the target folder. The relative path of source file to source folder is identical to the relative path of target file to target folder.<br/><br/><b>FlattenHierarchy</b>: all files from the source folder are in the first level of target folder. The target files have auto generated name. <br/><br/><b>MergeFiles (default):</b> merges all files from the source folder to one file. If the File/Blob Name is specified, the merged file name would be the specified name; otherwise, would be auto-generated file name. |No |

#### Example: BlobSink

```json
{  
    "name":"SamplePipeline",
    "properties":{  
        "start":"2016-06-01T18:00:00",
        "end":"2016-06-01T19:00:00",
        "description":"pipeline for copy activity",
        "activities":[  
              {
                "name": "AzureSQLtoBlob",
                "description": "copy activity",
                "type": "Copy",
                "inputs": [
                  {
                    "name": "AzureSQLInput"
                  }
                ],
                "outputs": [
                  {
                    "name": "AzureBlobOutput"
                  }
                ],
                "typeProperties": {
                    "source": {
                        "type": "SqlSource",
                        "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
                      },
                      "sink": {
                        "type": "BlobSink"
                      }
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

For more information, see [Azure Blob connector](data-factory-azure-blob-connector.md#copy-activity-properties) article. 

## Azure Data Lake Store

### Linked service
The following table provides description for JSON elements specific to Azure Data Lake Store linked service, and you can choose between **service principal** and **user credential** authentication.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **AzureDataLakeStore** | Yes |
| dataLakeStoreUri | Specify information about the Azure Data Lake Store account. It is in the following format: `https://[accountname].azuredatalakestore.net/webhdfs/v1` or `adl://[accountname].azuredatalakestore.net/`. | Yes |
| subscriptionId | Azure subscription Id to which Data Lake Store belongs. | Required for sink |
| resourceGroupName | Azure resource group name to which Data Lake Store belongs. | Required for sink |

#### Example
```json
{
    "name": "AzureDataLakeStoreLinkedService",
    "properties": {
        "type": "AzureDataLakeStore",
        "typeProperties": {
            "dataLakeStoreUri": "https://<accountname>.azuredatalakestore.net/webhdfs/v1",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": "<service principal key>",
            "tenant": "<tenant info. Example: microsoft.onmicrosoft.com>"
        }
    }
}
```

For more information, see [Azure Data Lake Store connector](data-factory-azure-datalake-connector.md#linked-service-properties) article. 

### Dataset
The typeProperties section for dataset of type **AzureDataLakeStore** dataset has the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| folderPath |Path to the container and folder in the Azure Data Lake store. |Yes |
| fileName |Name of the file in the Azure Data Lake store. fileName is optional and case-sensitive. <br/><br/>If you specify a filename, the activity (including Copy) works on the specific file.<br/><br/>When fileName is not specified, Copy includes all files in the folderPath for input dataset.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: Data.<Guid>.txt (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt |No |
| partitionedBy |partitionedBy is an optional property. You can use it to specify a dynamic folderPath and filename for time series data. For example, folderPath can be parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

#### Example
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

For more information, see [Azure Data Lake Store connector](data-factory-azure-datalake-connector.md#dataset-properties) article. 

### Azure Data Lake Store Source in Copy Activity

**AzureDataLakeStoreSource** supports the following properties **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the sub folders or only from the specified folder. |True (default value), False |No |

#### Example: AzureDataLakeStoreSource
```json
{  
    "name":"SamplePipeline",
    "properties":{  
        "start":"2016-06-01T18:00:00",
        "end":"2016-06-01T19:00:00",
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
### Azure Data Lake Store Sink in Copy Activity

**AzureDataLakeStoreSink** supports the following properties **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| copyBehavior |Specifies the copy behavior. |<b>PreserveHierarchy</b>: preserves the file hierarchy in the target folder. The relative path of source file to source folder is identical to the relative path of target file to target folder.<br/><br/><b>FlattenHierarchy</b>: all files from the source folder are created in the first level of target folder. The target files are created with auto generated name.<br/><br/><b>MergeFiles</b>: merges all files from the source folder to one file. If the File/Blob Name is specified, the merged file name would be the specified name; otherwise, would be auto-generated file name. |No |

#### Example: AzureDataLakeStoreSink
```json
{  
    "name":"SamplePipeline",
    "properties":
    {  
        "start":"2016-06-01T18:00:00",
        "end":"2016-06-01T19:00:00",
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

For more information, see [Azure Data Lake Store connector](data-factory-azure-datalake-connector.md#copy-activity-properties) article. 

## Azure DocumentDB

### Linked service
The following table provides description for JSON elements specific to Azure DocumentDB linked service.

| **Property** | **Description** | **Required** |
| --- | --- | --- |
| type |The type property must be set to: **DocumentDb** |Yes |
| connectionString |Specify information needed to connect to Azure DocumentDB database. |Yes |

#### Example

```JSON
{
  "name": "DocumentDbLinkedService",
  "properties": {
    "type": "DocumentDb",
    "typeProperties": {
      "connectionString": "AccountEndpoint=<EndpointUrl>;AccountKey=<AccessKey>;Database=<Database>"
    }
  }
}
```
For more information, see [DocumentDB connector](data-factory-azure-documentdb-connector.md#linked-service-properties) article.

### Dataset
The typeProperties section for the dataset of type **DocumentDbCollection** has the following properties.

| **Property** | **Description** | **Required** |
| --- | --- | --- |
| collectionName |Name of the DocumentDB document collection. |Yes |

#### Example

```JSON
{
  "name": "PersonDocumentDbTable",
  "properties": {
    "type": "DocumentDbCollection",
    "linkedServiceName": "DocumentDbLinkedService",
    "typeProperties": {
      "collectionName": "Person"
    },
    "external": true,
    "availability": {
      "frequency": "Day",
      "interval": 1
    }
  }
}
```
For more information, see [DocumentDB connector](data-factory-azure-documentdb-connector.md#dataset-properties) article.

### DocumentDB Collection Source in Copy Activity
The following properties are available in **typeProperties** section when the source in copy activity is set to **DocumentDbCollectionSource**:

| **Property** | **Description** | **Allowed values** | **Required** |
| --- | --- | --- | --- |
| query |Specify the query to read data. |Query string supported by DocumentDB. <br/><br/>Example: `SELECT c.BusinessEntityID, c.PersonType, c.NameStyle, c.Title, c.Name.First AS FirstName, c.Name.Last AS LastName, c.Suffix, c.EmailPromotion FROM c WHERE c.ModifiedDate > \"2009-01-01T00:00:00\"` |No <br/><br/>If not specified, the SQL statement that is executed: `select <columns defined in structure> from mycollection` |
| nestingSeparator |Special character to indicate that the document is nested |Any character. <br/><br/>DocumentDB is a NoSQL store for JSON documents, where nested structures are allowed. Azure Data Factory enables user to denote hierarchy via nestingSeparator, which is “.” in the above examples. With the separator, the copy activity will generate the “Name” object with three children elements First, Middle and Last, according to “Name.First”, “Name.Middle” and “Name.Last” in the table definition. |No |

#### Example

```JSON
{
  "name": "DocDbToBlobPipeline",
  "properties": {
    "activities": [
      {
        "type": "Copy",
        "typeProperties": {
          "source": {
            "type": "DocumentDbCollectionSource",
            "query": "SELECT Person.Id, Person.Name.First AS FirstName, Person.Name.Middle as MiddleName, Person.Name.Last AS LastName FROM Person",
            "nestingSeparator": "."
          },
          "sink": {
            "type": "BlobSink",
            "blobWriterAddHeader": true,
            "writeBatchSize": 1000,
            "writeBatchTimeout": "00:00:59"
          }
        },
        "inputs": [
          {
            "name": "PersonDocumentDbTable"
          }
        ],
        "outputs": [
          {
            "name": "PersonBlobTableOut"
          }
        ],
        "policy": {
          "concurrency": 1
        },
        "name": "CopyFromDocDbToBlob"
      }
    ],
    "start": "2016-04-01T00:00:00",
    "end": "2016-04-02T00:00:00"
  }
}
```

### DocumentDB Collection Sink in Copy Activity
**DocumentDbCollectionSink** supports the following properties:

| **Property** | **Description** | **Allowed values** | **Required** |
| --- | --- | --- | --- |
| nestingSeparator |A special character in the source column name to indicate that nested document is needed. <br/><br/>For example above: `Name.First` in the output table produces the following JSON structure in the DocumentDB document:<br/><br/>"Name": {<br/>    "First": "John"<br/>}, |Character that is used to separate nesting levels.<br/><br/>Default value is `.` (dot). |Character that is used to separate nesting levels. <br/><br/>Default value is `.` (dot). |
| writeBatchSize |Number of parallel requests to DocumentDB service to create documents.<br/><br/>You can fine-tune the performance when copying data to/from DocumentDB by using this property. You can expect a better performance when you increase writeBatchSize because more parallel requests to DocumentDB are sent. However you’ll need to avoid throttling that can throw the error message: "Request rate is large".<br/><br/>Throttling is decided by a number of factors, including size of documents, number of terms in documents, indexing policy of target collection, etc. For copy operations, you can use a better collection (for example, S3) to have the most throughput available (2,500 request units/second). |Integer |No (default: 5) |
| writeBatchTimeout |Wait time for the operation to complete before it times out. |timespan<br/><br/> Example: “00:30:00” (30 minutes). |No |

#### Example

```JSON
{
  "name": "BlobToDocDbPipeline",
  "properties": {
    "activities": [
      {
        "type": "Copy",
        "typeProperties": {
          "source": {
            "type": "BlobSource"
          },
          "sink": {
            "type": "DocumentDbCollectionSink",
            "nestingSeparator": ".",
            "writeBatchSize": 2,
            "writeBatchTimeout": "00:00:00"
          }
          "translator": {
              "type": "TabularTranslator",
              "ColumnMappings": "FirstName: Name.First, MiddleName: Name.Middle, LastName: Name.Last, BusinessEntityID: BusinessEntityID, PersonType: PersonType, NameStyle: NameStyle, Title: Title, Suffix: Suffix, EmailPromotion: EmailPromotion, rowguid: rowguid, ModifiedDate: ModifiedDate"
          }
        },
        "inputs": [
          {
            "name": "PersonBlobTableIn"
          }
        ],
        "outputs": [
          {
            "name": "PersonDocumentDbTableOut"
          }
        ],
        "policy": {
          "concurrency": 1
        },
        "name": "CopyFromBlobToDocDb"
      }
    ],
    "start": "2016-04-14T00:00:00",
    "end": "2016-04-15T00:00:00"
  }
}
```

For more information, see [DocumentDB connector](data-factory-azure-documentdb-connector.md#copy-activity-properties) article.

## Azure SQL Database

### Linked service
An Azure SQL linked service links an Azure SQL database to your data factory. The following table provides description for JSON elements specific to Azure SQL linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **AzureSqlDatabase** |Yes |
| connectionString |Specify information needed to connect to the Azure SQL Database instance for the connectionString property. |Yes |

#### Example
```json
{
  "name": "AzureSqlLinkedService",
  "properties": {
    "type": "AzureSqlDatabase",
    "typeProperties": {
      "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
    }
  }
}
```

For more information, see [Azure SQL connector](data-factory-azure-sql-connector.md#linked-service-properties) article. 

### Dataset
 The **typeProperties** section for the dataset of type **AzureSqlTable** has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table or view in the Azure SQL Database instance that linked service refers to. |Yes |

#### Example

```json
{
  "name": "AzureSqlInput",
  "properties": {
    "type": "AzureSqlTable",
    "linkedServiceName": "AzureSqlLinkedService",
    "typeProperties": {
      "tableName": "MyTable"
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
For more information, see [Azure SQL connector](data-factory-azure-sql-connector.md#dataset-properties) article. 

### SQL Source in Copy Activity
In copy activity, when the source is of type **SqlSource**, the following properties are available in **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| sqlReaderQuery |Use the custom query to read data. |SQL query string. Example: `select * from MyTable`. |No |
| sqlReaderStoredProcedureName |Name of the stored procedure that reads data from the source table. |Name of the stored procedure. |No |
| storedProcedureParameters |Parameters for the stored procedure. |Name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |

#### Example

```json
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2016-06-01T18:00:00",
    "end":"2016-06-01T19:00:00",
    "description":"pipeline for copy activity",
    "activities":[  
      {
        "name": "AzureSQLtoBlob",
        "description": "copy activity",
        "type": "Copy",
        "inputs": [
          {
            "name": "AzureSQLInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureBlobOutput"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "SqlSource",
            "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
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
For more information, see [Azure SQL connector](data-factory-azure-sql-connector.md#copy-activity-properties) article. 

### SQL Sink in Copy Activity
In copy activity, when the sink is of type **SqlSink**, the following properties are available in **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| writeBatchTimeout |Wait time for the batch insert operation to complete before it times out. |timespan<br/><br/> Example: “00:30:00” (30 minutes). |No |
| writeBatchSize |Inserts data into the SQL table when the buffer size reaches writeBatchSize. |Integer (number of rows) |No (default: 10000) |
| sqlWriterCleanupScript |Specify a query for Copy Activity to execute such that data of a specific slice is cleaned up. |A query statement. |No |
| sliceIdentifierColumnName |Specify a column name for Copy Activity to fill with auto generated slice identifier, which is used to clean up data of a specific slice when rerun. |Column name of a column with data type of binary(32). |No |
| sqlWriterStoredProcedureName |Name of the stored procedure that upserts (updates/inserts) data into the target table. |Name of the stored procedure. |No |
| storedProcedureParameters |Parameters for the stored procedure. |Name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |
| sqlWriterTableType |Specify a table type name to be used in the stored procedure. Copy activity makes the data being moved available in a temp table with this table type. Stored procedure code can then merge the data being copied with existing data. |A table type name. |No |

#### Example

```json
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2016-06-01T18:00:00",
    "end":"2016-06-01T19:00:00",
    "description":"pipeline with copy activity",
    "activities":[  
      {
        "name": "AzureBlobtoSQL",
        "description": "Copy Activity",
        "type": "Copy",
        "inputs": [
          {
            "name": "AzureBlobInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureSqlOutput"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "BlobSource",
            "blobColumnSeparators": ","
          },
          "sink": {
            "type": "SqlSink"
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

For more information, see [Azure SQL connector](data-factory-azure-sql-connector.md#copy-activity-properties) article. 

## Azure SQL Data Warehouse

### Linked service
The following table provides description for JSON elements specific to Azure SQL Data Warehouse linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **AzureSqlDW** |Yes |
| connectionString |Specify information needed to connect to the Azure SQL Data Warehouse instance for the connectionString property. |Yes |



#### Example

```json
{
  "name": "AzureSqlDWLinkedService",
  "properties": {
    "type": "AzureSqlDW",
    "typeProperties": {
      "connectionString": "Server=tcp:<servername>.database.windows.net,1433;Database=<databasename>;User ID=<username>@<servername>;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
    }
  }
}
```

For more information, see [Azure SQL Data Warehouse connector](data-factory-azure-sql-data-warehouse-connector.md#linked-service-properties) article. 

### Dataset
The **typeProperties** section for the dataset of type **AzureSqlDWTable** has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table or view in the Azure SQL Data Warehouse database that the linked service refers to. |Yes |

#### Example

```json
{
  "name": "AzureSqlDWInput",
  "properties": {
    "type": "AzureSqlDWTable",
    "linkedServiceName": "AzureSqlDWLinkedService",
    "typeProperties": {
      "tableName": "MyTable"
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

For more information, see [Azure SQL Data Warehouse connector](data-factory-azure-sql-data-warehouse-connector.md#dataset-properties) article. 

### SQL DW Source in Copy Activity
When source is of type **SqlDWSource**, the following properties are available in **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| sqlReaderQuery |Use the custom query to read data. |SQL query string. For example: select * from MyTable. |No |
| sqlReaderStoredProcedureName |Name of the stored procedure that reads data from the source table. |Name of the stored procedure. |No |
| storedProcedureParameters |Parameters for the stored procedure. |Name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |

#### Example

```json
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2016-06-01T18:00:00",
    "end":"2016-06-01T19:00:00",
    "description":"pipeline for copy activity",
    "activities":[  
      {
        "name": "AzureSQLDWtoBlob",
        "description": "copy activity",
        "type": "Copy",
        "inputs": [
          {
            "name": "AzureSqlDWInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureBlobOutput"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "SqlDWSource",
            "sqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
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

For more information, see [Azure SQL Data Warehouse connector](data-factory-azure-sql-data-warehouse-connector.md#copy-activity-properties) article. 

### SQL DW Sink in Copy Activity
When sink is of type **SqlDWSink**, the following properties are available in **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| sqlWriterCleanupScript |Specify a query for Copy Activity to execute such that data of a specific slice is cleaned up. |A query statement. |No |
| allowPolyBase |Indicates whether to use PolyBase (when applicable) instead of BULKINSERT mechanism. <br/><br/> **Using PolyBase is the recommended way to load data into SQL Data Warehouse.** |True <br/>False (default) |No |
| polyBaseSettings |A group of properties that can be specified when the **allowPolybase** property is set to **true**. |&nbsp; |No |
| rejectValue |Specifies the number or percentage of rows that can be rejected before the query fails. <br/><br/>Learn more about the PolyBase’s reject options in the **Arguments** section of [CREATE EXTERNAL TABLE (Transact-SQL)](https://msdn.microsoft.com/library/dn935021.aspx) topic. |0 (default), 1, 2, … |No |
| rejectType |Specifies whether the rejectValue option is specified as a literal value or a percentage. |Value (default), Percentage |No |
| rejectSampleValue |Determines the number of rows to retrieve before the PolyBase recalculates the percentage of rejected rows. |1, 2, … |Yes, if **rejectType** is **percentage** |
| useTypeDefault |Specifies how to handle missing values in delimited text files when PolyBase retrieves data from the text file.<br/><br/>Learn more about this property from the Arguments section in [CREATE EXTERNAL FILE FORMAT (Transact-SQL)](https://msdn.microsoft.com/library/dn935026.aspx). |True, False (default) |No |
| writeBatchSize |Inserts data into the SQL table when the buffer size reaches writeBatchSize |Integer (number of rows) |No (default: 10000) |
| writeBatchTimeout |Wait time for the batch insert operation to complete before it times out. |timespan<br/><br/> Example: “00:30:00” (30 minutes). |No |

#### Example

```json
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2016-06-01T18:00:00",
    "end":"2016-06-01T19:00:00",
    "description":"pipeline with copy activity",
    "activities":[  
      {
        "name": "AzureBlobtoSQLDW",
        "description": "Copy Activity",
        "type": "Copy",
        "inputs": [
          {
            "name": "AzureBlobInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureSqlDWOutput"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "BlobSource",
            "blobColumnSeparators": ","
          },
          "sink": {
            "type": "SqlDWSink",
            "allowPolyBase": true
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

For more information, see [Azure SQL Data Warehouse connector](data-factory-azure-sql-data-warehouse-connector.md#copy-activity-properties) article. 

## Azure Search

### Linked service
The following table provides descriptions for JSON elements that are specific to the Azure Search linked service.

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property must be set to: **AzureSearch**. | Yes |
| url | URL for the Azure Search service. | Yes |
| key | Admin key for the Azure Search service. | Yes |

#### Example

```json
{
	"name": "AzureSearchLinkedService",
	"properties": {
	"type": "AzureSearch",
		"typeProperties": {
			"url": "https://<service>.search.windows.net",
			"key": "<AdminKey>"
		}
	}
}
```

For more information, see [Azure Search connector](data-factory-azure-search-connector.md#linked-service-properties) article.

### Dataset
The typeProperties section for a dataset of the type **AzureSearchIndex** has the following properties:

| Property | Description | Required |
| -------- | ----------- | -------- |
| type | The type property must be set to **AzureSearchIndex**.| Yes |
| indexName | Name of the Azure Search index. Data Factory does not create the index. The index must exist in Azure Search. | Yes |

#### Example

```json
{
	"name": "AzureSearchIndexDataset",
	"properties": {
		"type": "AzureSearchIndex",
		"linkedServiceName": "AzureSearchLinkedService",
		"typeProperties" : {
			"indexName": "products",
		},
		"availability": {
			"frequency": "Minute",
			"interval": 15
		}
	}
}
```

For more information, see [Azure Search connector](data-factory-azure-search-connector.md#dataset-properties) article.

### Azure Search Index Sink in Copy Activity
For Copy Activity, when the sink is of the type **AzureSearchIndexSink**, the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| WriteBehavior | Specifies whether to merge or replace when a document already exists in the index. | Merge (default)<br/>Upload| No |
| WriteBatchSize | Uploads data into the Azure Search index when the buffer size reaches writeBatchSize. | 1 to 1,000. Default value is 1000. | No |

#### Example

```json
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2016-06-01T18:00:00",
    "end":"2016-06-01T19:00:00",
    "description":"pipeline for copy activity",
    "activities":[  
      {
        "name": "SqlServertoAzureSearchIndex",
        "description": "copy activity",
        "type": "Copy",
        "inputs": [
          {
            "name": " SqlServerInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureSearchIndexDataset"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "SqlSource",
            "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
          },
          "sink": {
            "type": "AzureSearchIndexSink"
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

For more information, see [Azure Search connector](data-factory-azure-search-connector.md#copy-activity-properties) article.

## Azure Table Storage

### Linked service
There are two types of linked services: Azure Storage linked service and Azure Storage SAS linked service.

#### Azure Storage Linked Service
The **Azure Storage linked service** allows you to link an Azure storage account to an Azure data factory by using the **account key**. It provides the data factory with global access to the Azure Storage. The following table provides description for JSON elements specific to Azure Storage linked service.

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to: **AzureStorage** |Yes |
| connectionString |Specify information needed to connect to Azure storage for the connectionString property. |Yes |

**Example:**  

```json
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

#### Azure Storage SAS Linked Service
The Azure Storage SAS linked service allows you to link an Azure Storage Account to an Azure data factory by using a Shared Access Signature (SAS). It provides the data factory with restricted/time-bound access to all/specific resources (blob/container) in the storage. The following table provides description for JSON elements specific to Azure Storage SAS linked service. 

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to: **AzureStorageSas** |Yes |
| sasUri |Specify Shared Access Signature URI to the Azure Storage resources such as blob, container, or table. |Yes |

**Example:**

```json
{  
    "name": "StorageSasLinkedService",  
    "properties": {  
        "type": "AzureStorageSas",  
        "typeProperties": {  
            "sasUri": "<storageUri>?<sasToken>"   
        }  
    }  
}  
```

For more information about these linked services, see [Azure Table Storage connector](data-factory-azure-table-connector.md#linked-service-properties) article. 

### Dataset
The **typeProperties** section for the dataset of type **AzureTable** has the following properties.

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the Azure Table Database instance that linked service refers to. |Yes. When a tableName is specified without an azureTableSourceQuery, all records from the table are copied to the destination. If an azureTableSourceQuery is also specified, records from the table that satisfies the query are copied to the destination. |

#### Example

```json
{
  "name": "AzureTableInput",
  "properties": {
    "type": "AzureTable",
    "linkedServiceName": "StorageLinkedService",
    "typeProperties": {
      "tableName": "MyTable"
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

For more information about these linked services, see [Azure Table Storage connector](data-factory-azure-table-connector.md#dataset-properties) article. 

### Azure Table Source in Copy Activity
**AzureTableSource** supports the following properties in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| azureTableSourceQuery |Use the custom query to read data. |Azure table query string. See examples in the next section. |No. When a tableName is specified without an azureTableSourceQuery, all records from the table are copied to the destination. If an azureTableSourceQuery is also specified, records from the table that satisfies the query are copied to the destination. |
| azureTableSourceIgnoreTableNotFound |Indicate whether swallow the exception of table not exist. |TRUE<br/>FALSE |No |

#### Example

```json
{  
    "name":"SamplePipeline",
    "properties":{  
        "start":"2016-06-01T18:00:00",
        "end":"2016-06-01T19:00:00",
        "description":"pipeline for copy activity",
        "activities":[  
            {
                "name": "AzureTabletoBlob",
                "description": "copy activity",
                "type": "Copy",
                "inputs": [
                      {
                        "name": "AzureTableInput"
                    }
                ],
                "outputs": [
                      {
                            "name": "AzureBlobOutput"
                      }
                ],
                "typeProperties": {
                      "source": {
                        "type": "AzureTableSource",
                        "AzureTableSourceQuery": "PartitionKey eq 'DefaultPartitionKey'"
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

For more information about these linked services, see [Azure Table Storage connector](data-factory-azure-table-connector.md#copy-activity-properties) article. 

### Azure Table Sink in Copy Activity
**AzureTableSink** supports the following properties in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| azureTableDefaultPartitionKeyValue |Default partition key value that can be used by the sink. |A string value. |No |
| azureTablePartitionKeyName |Specify name of the column whose values are used as partition keys. If not specified, AzureTableDefaultPartitionKeyValue is used as the partition key. |A column name. |No |
| azureTableRowKeyName |Specify name of the column whose column values are used as row key. If not specified, use a GUID for each row. |A column name. |No |
| azureTableInsertType |The mode to insert data into Azure table.<br/><br/>This property controls whether existing rows in the output table with matching partition and row keys have their values replaced or merged. <br/><br/>To learn about how these settings (merge and replace) work, see [Insert or Merge Entity](https://msdn.microsoft.com/library/azure/hh452241.aspx) and [Insert or Replace Entity](https://msdn.microsoft.com/library/azure/hh452242.aspx) topics. <br/><br> This setting applies at the row level, not the table level, and neither option deletes rows in the output table that do not exist in the input. |merge (default)<br/>replace |No |
| writeBatchSize |Inserts data into the Azure table when the writeBatchSize or writeBatchTimeout is hit. |Integer (number of rows) |No (default: 10000) |
| writeBatchTimeout |Inserts data into the Azure table when the writeBatchSize or writeBatchTimeout is hit |timespan<br/><br/>Example: “00:20:00” (20 minutes) |No (Default to storage client default timeout value 90 sec) |

#### Example

```json
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2016-06-01T18:00:00",
    "end":"2016-06-01T19:00:00",
    "description":"pipeline with copy activity",
    "activities":[  
      {
        "name": "AzureBlobtoTable",
        "description": "Copy Activity",
        "type": "Copy",
        "inputs": [
          {
            "name": "AzureBlobInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureTableOutput"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "BlobSource"
          },
          "sink": {
            "type": "AzureTableSink",
            "writeBatchSize": 100,
            "writeBatchTimeout": "01:00:00"
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
For more information about these linked services, see [Azure Table Storage connector](data-factory-azure-table-connector.md#copy-activity-properties) article. 

## Amazon RedShift

### Linked service
The following table provides description for JSON elements specific to Amazon Redshift linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **AmazonRedshift**. |Yes |
| server |IP address or host name of the Amazon Redshift server. |Yes |
| port |The number of the TCP port that the Amazon Redshift server uses to listen for client connections. |No, default value: 5439 |
| database |Name of the Amazon Redshift database. |Yes |
| username |Name of user who has access to the database. |Yes |
| password |Password for the user account. |Yes |

#### Example
```json
{
    "name": "AmazonRedshiftLinkedService",
    "properties":
    {
        "type": "AmazonRedshift",
        "typeProperties":
        {
            "server": "< The IP address or host name of the Amazon Redshift server >",
            "port": <The number of the TCP port that the Amazon Redshift server uses to listen for client connections.>,
            "database": "<The database name of the Amazon Redshift database>",
            "username": "<username>",
            "password": "<password>"
        }
    }
}
```

For more information, see [Amazon Redshift connector](#data-factory-amazon-redshift-connector.md#linked-service-properties) article. 

### Dataset
The typeProperties section for dataset of type **RelationalTable** (which includes Amazon Redshift dataset) has the following properties

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the Amazon Redshift database that linked service refers to. |No (if **query** of **RelationalSource** is specified) |


#### Example

```json
{
    "name": "AmazonRedshiftInputDataset",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "AmazonRedshiftLinkedService",
        "typeProperties": {
            "tableName": "<Table name>"
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true
    }
}
```
For more information, see [Amazon Redshift connector](#data-factory-amazon-redshift-connector.md#dataset-properties) article.

### Relational Source in Copy Activity 
When source of copy activity is of type **RelationalSource** (which includes Amazon Redshift) the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: select * from MyTable. |No (if **tableName** of **dataset** is specified) |

#### Example

```json
{
    "name": "CopyAmazonRedshiftToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "RelationalSource",
                        "query": "$$Text.Format('select * from MyTable where timestamp >= \\'{0:yyyy-MM-ddTHH:mm:ss}\\' AND timestamp < \\'{1:yyyy-MM-ddTHH:mm:ss}\\'', WindowStart, WindowEnd)"
                    },
                    "sink": {
                        "type": "BlobSink",
                        "writeBatchSize": 0,
                        "writeBatchTimeout": "00:00:00"
                    }
                },
                "inputs": [
                    {
                        "name": "AmazonRedshiftInputDataset"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobOutputDataSet"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "AmazonRedshiftToBlob"
            }
        ],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
```
For more information, see [Amazon Redshift connector](#data-factory-amazon-redshift-connector.md#copy-activity-properties) article.

## IBM DB2

### Linked service
The following table provides description for JSON elements specific to DB2 linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OnPremisesDB2** |Yes |
| server |Name of the DB2 server. |Yes |
| database |Name of the DB2 database. |Yes |
| schema |Name of the schema in the database. The schema name is case-sensitive. |No |
| authenticationType |Type of authentication used to connect to the DB2 database. Possible values are: Anonymous, Basic, and Windows. |Yes |
| username |Specify user name if you are using Basic or Windows authentication. |No |
| password |Specify password for the user account you specified for the username. |No |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises DB2 database. |Yes |

#### Example
```json
{
    "name": "OnPremDb2LinkedService",
    "properties": {
        "type": "OnPremisesDb2",
        "typeProperties": {
            "server": "<server>",
            "database": "<database>",
            "schema": "<schema>",
            "authenticationType": "<authentication type>",
            "username": "<username>",
            "password": "<password>",
            "gatewayName": "<gatewayName>"
        }
    }
}
```
For more information, see [IBM DB2 connector](#data-factory-onprem-db2-connector.md#linked-service-properties) article.

### Dataset
The typeProperties section for dataset of type RelationalTable (which includes DB2 dataset) has the following properties.

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the DB2 Database instance that linked service refers to. The tableName is case-sensitive. |No (if **query** of **RelationalSource** is specified) 

#### Example
```json
{
    "name": "Db2DataSet",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "OnPremDb2LinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
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

For more information, see [IBM DB2 connector](#data-factory-onprem-db2-connector.md#dataset-properties) article.

### Relational Source in Copy Activity
For Copy Activity, when source is of type **RelationalSource** (which includes DB2) the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: `"query": "select * from "MySchema"."MyTable""`. |No (if **tableName** of **dataset** is specified) |

#### Example
```json
{
    "name": "CopyDb2ToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "RelationalSource",
                        "query": "select * from \"Orders\""
                    },
                    "sink": {
                        "type": "BlobSink"
                    }
                },
                "inputs": [
                    {
                        "name": "Db2DataSet"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobDb2DataSet"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "Db2ToBlob"
            }
        ],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
```
For more information, see [IBM DB2 connector](#data-factory-onprem-db2-connector.md#copy-activity-properties) article.

## MySQL

### Linked service
The following table provides description for JSON elements specific to MySQL linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OnPremisesMySql** |Yes |
| server |Name of the MySQL server. |Yes |
| database |Name of the MySQL database. |Yes |
| schema |Name of the schema in the database. |No |
| authenticationType |Type of authentication used to connect to the MySQL database. Possible values are: `Basic`. |Yes |
| username |Specify user name to connect to the MySQL database. |Yes |
| password |Specify password for the user account you specified. |Yes |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises MySQL database. |Yes |

#### Example

```JSON
    {
      "name": "OnPremMySqlLinkedService",
      "properties": {
        "type": "OnPremisesMySql",
        "typeProperties": {
          "server": "<server name>",
          "database": "<database name>",
          "schema": "<schema name>",
          "authenticationType": "<authentication type>",
          "userName": "<user name>",
          "password": "<password>",
          "gatewayName": "<gateway>"
        }
      }
    }
```

For more information, see [MySQL connector](data-factory-onprem-mysql-connector.md#linked-service-properties) article. 

### Dataset
The typeProperties section for dataset of type **RelationalTable** (which includes MySQL dataset) has the following properties

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the MySQL Database instance that linked service refers to. |No (if **query** of **RelationalSource** is specified) |

#### Example

```JSON
    {
        "name": "MySqlDataSet",
        "properties": {
            "published": false,
            "type": "RelationalTable",
            "linkedServiceName": "OnPremMySqlLinkedService",
            "typeProperties": {},
            "availability": {
                "frequency": "Hour",
                "interval": 1
            },
            "external": true,
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
For more information, see [MySQL connector](data-factory-onprem-mysql-connector.md#dataset-properties) article. 

### Relational Source in Copy Activity
When source in copy activity is of type **RelationalSource** (which includes MySQL), the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: select * from MyTable. |No (if **tableName** of **dataset** is specified) |


#### Example
```JSON
    {
        "name": "CopyMySqlToBlob",
        "properties": {
            "description": "pipeline for copy activity",
            "activities": [
                {
                    "type": "Copy",
                    "typeProperties": {
                        "source": {
                            "type": "RelationalSource",
                            "query": "$$Text.Format('select * from MyTable where timestamp >= \\'{0:yyyy-MM-ddTHH:mm:ss}\\' AND timestamp < \\'{1:yyyy-MM-ddTHH:mm:ss}\\'', WindowStart, WindowEnd)"
                        },
                        "sink": {
                            "type": "BlobSink",
                            "writeBatchSize": 0,
                            "writeBatchTimeout": "00:00:00"
                        }
                    },
                    "inputs": [
                        {
                            "name": "MySqlDataSet"
                        }
                    ],
                    "outputs": [
                        {
                            "name": "AzureBlobMySqlDataSet"
                        }
                    ],
                    "policy": {
                        "timeout": "01:00:00",
                        "concurrency": 1
                    },
                    "scheduler": {
                        "frequency": "Hour",
                        "interval": 1
                    },
                    "name": "MySqlToBlob"
                }
            ],
            "start": "2016-06-01T18:00:00",
            "end": "2016-06-01T19:00:00"
        }
    }
```

For more information, see [MySQL connector](data-factory-onprem-mysql-connector.md#copy-activity-properties) article. 

## Oracle 

### Linked service
The following table provides description for JSON elements specific to Oracle linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OnPremisesOracle** |Yes |
| driverType | Specify which driver to use to copy data from/to Oracle Database. Allowed values are **Microsoft** or **ODP** (default). See [Supported version and installation](#supported-versions-and-installation) section on driver details. | No |
| connectionString | Specify information needed to connect to the Oracle Database instance for the connectionString property. | Yes |
| gatewayName | Name of the gateway that that is used to connect to the on-premises Oracle server |Yes |

#### Example
```json
{
    "name": "OnPremisesOracleLinkedService",
    "properties": {
        "type": "OnPremisesOracle",
        "typeProperties": {
            "driverType": "Microsoft",
            "connectionString":"Host=<host>;Port=<port>;Sid=<sid>;User Id=<username>;Password=<password>;",
            "gatewayName": "<gateway name>"
        }
    }
}
```

For more information, see [Oracle connector](data-factory-onprem-oracle-connector.md#linked-service-properties) article.

### Dataset
The typeProperties section for the dataset of type **OracleTable** has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the Oracle Database that the linked service refers to. |No (if **oracleReaderQuery** of **OracleSource** is specified) |

#### Example

```json
{
    "name": "OracleInput",
    "properties": {
        "type": "OracleTable",
        "linkedServiceName": "OnPremisesOracleLinkedService",
        "typeProperties": {
            "tableName": "MyTable"
        },
        "external": true,
        "availability": {
            "offset": "01:00:00",
            "interval": "1",
            "anchorDateTime": "2016-02-27T12:00:00",
            "frequency": "Hour"
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
For more information, see [Oracle connector](data-factory-onprem-oracle-connector.md#dataset-properties) article.

### Oracle Source in Copy Activity
In Copy activity, when the source is of type **OracleSource** the following properties are available in **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| oracleReaderQuery |Use the custom query to read data. |SQL query string. For example: select * from MyTable <br/><br/>If not specified, the SQL statement that is executed: select * from MyTable |No (if **tableName** of **dataset** is specified) |

#### Example
```json
{  
    "name":"SamplePipeline",
    "properties":{  
        "start":"2016-06-01T18:00:00",
        "end":"2016-06-01T19:00:00",
        "description":"pipeline for copy activity",
        "activities":[  
            {
                "name": "OracletoBlob",
                "description": "copy activity",
                "type": "Copy",
                "inputs": [
                    {
                        "name": " OracleInput"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobOutput"
                    }
                ],
                "typeProperties": {
                    "source": {
                        "type": "OracleSource",
                        "oracleReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
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

For more information, see [Oracle connector](data-factory-onprem-oracle-connector.md#copy-activity-properties) article.

### Oracle Sink in Copy Activity
**OracleSink** supports the following properties:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| writeBatchTimeout |Wait time for the batch insert operation to complete before it times out. |timespan<br/><br/> Example: 00:30:00 (30 minutes). |No |
| writeBatchSize |Inserts data into the SQL table when the buffer size reaches writeBatchSize. |Integer (number of rows) |No (default: 100) |
| sqlWriterCleanupScript |Specify a query for Copy Activity to execute such that data of a specific slice is cleaned up. |A query statement. |No |
| sliceIdentifierColumnName |Specify column name for Copy Activity to fill with auto generated slice identifier, which is used to clean up data of a specific slice when rerun. |Column name of a column with data type of binary(32). |No |

#### Example
```json
{  
    "name":"SamplePipeline",
    "properties":{  
        "start":"2016-06-01T18:00:00",
        "end":"2016-06-05T19:00:00",
        "description":"pipeline with copy activity",
        "activities":[  
            {
                "name": "AzureBlobtoOracle",
                "description": "Copy Activity",
                "type": "Copy",
                "inputs": [
                    {
                        "name": "AzureBlobInput"
                    }
                ],
                "outputs": [
                    {
                        "name": "OracleOutput"
                    }
                ],
                "typeProperties": {
                    "source": {
                        "type": "BlobSource"
                    },
                    "sink": {
                        "type": "OracleSink"
                    }
                },
                "scheduler": {
                    "frequency": "Day",
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
For more information, see [Oracle connector](data-factory-onprem-oracle-connector.md#copy-activity-properties) article.

## PostgreSQL

### Linked service
The following table provides description for JSON elements specific to PostgreSQL linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OnPremisesPostgreSql** |Yes |
| server |Name of the PostgreSQL server. |Yes |
| database |Name of the PostgreSQL database. |Yes |
| schema |Name of the schema in the database. The schema name is case-sensitive. |No |
| authenticationType |Type of authentication used to connect to the PostgreSQL database. Possible values are: Anonymous, Basic, and Windows. |Yes |
| username |Specify user name if you are using Basic or Windows authentication. |No |
| password |Specify password for the user account you specified for the username. |No |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises PostgreSQL database. |Yes |

#### Example

```json
{
    "name": "OnPremPostgreSqlLinkedService",
    "properties": {
        "type": "OnPremisesPostgreSql",
        "typeProperties": {
            "server": "<server>",
            "database": "<database>",
            "schema": "<schema>",
            "authenticationType": "<authentication type>",
            "username": "<username>",
            "password": "<password>",
            "gatewayName": "<gatewayName>"
        }
    }
}
```
For more information, see [PostgreSQL connector](data-factory-onprem-postgresql-connector.md#linked-service-properties) article.

### Dataset
The typeProperties section for dataset of type **RelationalTable** (which includes PostgreSQL dataset) has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the PostgreSQL Database instance that linked service refers to. The tableName is case-sensitive. |No (if **query** of **RelationalSource** is specified) |

#### Example
```json
{
    "name": "PostgreSqlDataSet",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "OnPremPostgreSqlLinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
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
For more information, see [PostgreSQL connector](data-factory-onprem-postgresql-connector.md#dataset-properties) article.

### Relational Source in Copy Activity
When source is of type **RelationalSource** (which includes PostgreSQL), the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: "query": "select * from \"MySchema\".\"MyTable\"". |No (if **tableName** of **dataset** is specified) |

#### Example

```json
{
    "name": "CopyPostgreSqlToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "RelationalSource",
                        "query": "select * from \"public\".\"usstates\""
                    },
                    "sink": {
                        "type": "BlobSink"
                    }
                },
                "inputs": [
                    {
                        "name": "PostgreSqlDataSet"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobPostgreSqlDataSet"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "PostgreSqlToBlob"
            }
        ],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
```

For more information, see [PostgreSQL connector](data-factory-onprem-postgresql-connector.md#copy-activity-properties) article.

## SAP Business Warehouse


### Linked service
The following table provides description for JSON elements specific to SAP Business Warehouse (BW) linked service.

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
server | Name of the server on which the SAP BW instance resides. | string | Yes
systemNumber | System number of the SAP BW system. | Two-digit decimal number represented as a string. | Yes
clientId | Client ID of the client in the SAP W system. | Three-digit decimal number represented as a string. | Yes
username | Name of the user who has access to the SAP server | string | Yes
password | Password for the user. | string | Yes
gatewayName | Name of the gateway that the Data Factory service should use to connect to the on-premises SAP BW instance. | string | Yes
encryptedCredential | The encrypted credential string. | string | No

#### Example

```json
{
    "name": "SapBwLinkedService",
    "properties":
    {
        "type": "SapBw",
        "typeProperties":
        {
            "server": "<server name>",
            "systemNumber": "<system number>",
            "clientId": "<client id>",
            "username": "<SAP user>",
            "password": "<Password for SAP user>",
            "gatewayName": "<gateway name>"
        }
    }
}
```

For more information, see [SAP Business Warehouse connector](data-factory-sap-business-warehouse-connector.md#linked-service-properties) article. 

### Dataset
The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. There are no type-specific properties supported for the SAP BW dataset of type **RelationalTable**. 

#### Example

```json
{
    "name": "SapBwDataset",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "SapBwLinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true
    }
}
```
For more information, see [SAP Business Warehouse connector](data-factory-sap-business-warehouse-connector.md#dataset-properties) article. 

### Relational Source in Copy Activity
When source in copy activity is of type **RelationalSource** (which includes SAP BW), the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query | Specifies the MDX query to read data from the SAP BW instance. | MDX query. | Yes |

#### Example

```json
{
    "name": "CopySapBwToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "RelationalSource",
        				"query": "<MDX query for SAP BW>"
                    },
                    "sink": {
                        "type": "BlobSink",
                        "writeBatchSize": 0,
                        "writeBatchTimeout": "00:00:00"
                    }
                },
                "inputs": [
                    {
                        "name": "SapBwDataset"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobDataSet"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "SapBwToBlob"
            }
        ],
        "start": "2017-03-01T18:00:00",
        "end": "2017-03-01T19:00:00"
    }
}
```

For more information, see [SAP Business Warehouse connector](data-factory-sap-business-warehouse-connector.md#copy-activity-properties) article. 

## SAP HANA

### Linked service
The following table provides description for JSON elements specific to SAP HANA linked service.

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
server | Name of the server on which the SAP HANA instance resides. If your server is using a customized port, specify `server:port`. | string | Yes
authenticationType | Type of authentication. | string. "Basic" or "Windows" | Yes 
username | Name of the user who has access to the SAP server | string | Yes
password | Password for the user. | string | Yes
gatewayName | Name of the gateway that the Data Factory service should use to connect to the on-premises SAP HANA instance. | string | Yes
encryptedCredential | The encrypted credential string. | string | No

#### Example

```json
{
    "name": "SapHanaLinkedService",
    "properties":
    {
        "type": "SapHana",
        "typeProperties":
        {
            "server": "<server name>",
            "authenticationType": "<Basic, or Windows>",
            "username": "<SAP user>",
            "password": "<Password for SAP user>",
            "gatewayName": "<gateway name>"
        }
    }
}

```
For more information, see [SAP HANA connector](data-factory-sap-hana-connector.md#linked-service-properties) article.
 
### Dataset
The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. There are no type-specific properties supported for the SAP HANA dataset of type **RelationalTable**. 

#### Example

```json
{
    "name": "SapHanaDataset",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "SapHanaLinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true
    }
}
```
For more information, see [SAP HANA connector](data-factory-sap-hana-connector.md#dataset-properties) article. 

### Relational Source in Copy Activity
When source in copy activity is of type **RelationalSource** (which includes SAP HANA), the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query | Specifies the SQL query to read data from the SAP HANA instance. | SQL query. | Yes |


#### Example


```json
{
    "name": "CopySapHanaToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "RelationalSource",
        				"query": "<SQL Query for HANA>"
                    },
                    "sink": {
                        "type": "BlobSink",
                        "writeBatchSize": 0,
                        "writeBatchTimeout": "00:00:00"
                    }
                },
                "inputs": [
                    {
                        "name": "SapHanaDataset"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobDataSet"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "SapHanaToBlob"
            }
        ],
        "start": "2017-03-01T18:00:00",
        "end": "2017-03-01T19:00:00"
    }
}
```

For more information, see [SAP HANA connector](data-factory-sap-hana-connector.md#copy-activity-properties) article.


## SQL Server

### Linked service
You create a linked service of type **OnPremisesSqlServer** to link an on-premises SQL Server database to a data factory. The following table provides description for JSON elements specific to on-premises SQL Server linked service.

The following table provides description for JSON elements specific to SQL Server linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property should be set to: **OnPremisesSqlServer**. |Yes |
| connectionString |Specify connectionString information needed to connect to the on-premises SQL Server database using either SQL authentication or Windows authentication. |Yes |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises SQL Server database. |Yes |
| username |Specify user name if you are using Windows Authentication. Example: **domainname\\username**. |No |
| password |Specify password for the user account you specified for the username. |No |

You can encrypt credentials using the **New-AzureRmDataFactoryEncryptValue** cmdlet and use them in the connection string as shown in the following example (**EncryptedCredential** property):  

```JSON
"connectionString": "Data Source=<servername>;Initial Catalog=<databasename>;Integrated Security=True;EncryptedCredential=<encrypted credential>",
```


#### Example: JSON for using SQL Authentication

```json
{
    "name": "MyOnPremisesSQLDB",
    "properties":
    {
        "type": "OnPremisesSqlLinkedService",
        "typeProperties": {
            "connectionString": "Data Source=<servername>;Initial Catalog=MarketingCampaigns;Integrated Security=False;User ID=<username>;Password=<password>;",
            "gatewayName": "<gateway name>"
        }
    }
}
```
#### Example: JSON for using Windows Authentication

If username and password are specified, gateway uses them to impersonate the specified user account to connect to the on-premises SQL Server database. Otherwise, gateway connects to the SQL Server directly with the security context of Gateway (its startup account).

```json
{
     "Name": " MyOnPremisesSQLDB",
     "Properties":
     {
         "type": "OnPremisesSqlLinkedService",
         "typeProperties": {
             "ConnectionString": "Data Source=<servername>;Initial Catalog=MarketingCampaigns;Integrated Security=True;",
             "username": "<domain\\username>",
             "password": "<password>",
             "gatewayName": "<gateway name>"
        }
     }
}
```

For more information, see [SQL Server connector](data-factory-sqlserver-connector.md#linked-service-properties) article. 

### Dataset
The **typeProperties** section for the dataset of type **SqlServerTable** has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table or view in the SQL Server Database instance that linked service refers to. |Yes |

#### Example
```json
{
  "name": "SqlServerInput",
  "properties": {
    "type": "SqlServerTable",
    "linkedServiceName": "SqlServerLinkedService",
    "typeProperties": {
      "tableName": "MyTable"
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

For more information, see [SQL Server connector](data-factory-sqlserver-connector.md#dataset-properties) article. 

### Sql Source in Copy Activity
When source in a copy activity is of type **SqlSource**, the following properties are available in **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| sqlReaderQuery |Use the custom query to read data. |SQL query string. For example: select * from MyTable. May reference multiple tables from the database referenced by the input dataset. If not specified, the SQL statement that is executed: select from MyTable. |No |
| sqlReaderStoredProcedureName |Name of the stored procedure that reads data from the source table. |Name of the stored procedure. |No |
| storedProcedureParameters |Parameters for the stored procedure. |Name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |

If the **sqlReaderQuery** is specified for the SqlSource, the Copy Activity runs this query against the SQL Server Database source to get the data.

Alternatively, you can specify a stored procedure by specifying the **sqlReaderStoredProcedureName** and **storedProcedureParameters** (if the stored procedure takes parameters).

If you do not specify either sqlReaderQuery or sqlReaderStoredProcedureName, the columns defined in the structure section are used to build a select query to run against the SQL Server Database. If the dataset definition does not have the structure, all columns are selected from the table.

> [!NOTE]
> When you use **sqlReaderStoredProcedureName**, you still need to specify a value for the **tableName** property in the dataset JSON. There are no validations performed against this table though.


#### Example
```json
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2016-06-01T18:00:00",
    "end":"2016-06-01T19:00:00",
    "description":"pipeline for copy activity",
    "activities":[  
      {
        "name": "SqlServertoBlob",
        "description": "copy activity",
        "type": "Copy",
        "inputs": [
          {
            "name": " SqlServerInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureBlobOutput"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "SqlSource",
            "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd HH:mm}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd HH:mm}\\'', WindowStart, WindowEnd)"
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

In this example, **sqlReaderQuery** is specified for the SqlSource. The Copy Activity runs this query against the SQL Server Database source to get the data. Alternatively, you can specify a stored procedure by specifying the **sqlReaderStoredProcedureName** and **storedProcedureParameters** (if the stored procedure takes parameters). The sqlReaderQuery can reference multiple tables within the database referenced by the input dataset. It is not limited to only the table set as the dataset's tableName typeProperty.

If you do not specify sqlReaderQuery or sqlReaderStoredProcedureName, the columns defined in the structure section are used to build a select query to run against the SQL Server Database. If the dataset definition does not have the structure, all columns are selected from the table.

For more information, see [SQL Server connector](data-factory-sqlserver-connector.md#copy-activity-properties) article. 

### Sql Sink in Copy Activity
**SqlSink** supports the following properties:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| writeBatchTimeout |Wait time for the batch insert operation to complete before it times out. |timespan<br/><br/> Example: “00:30:00” (30 minutes). |No |
| writeBatchSize |Inserts data into the SQL table when the buffer size reaches writeBatchSize. |Integer (number of rows) |No (default: 10000) |
| sqlWriterCleanupScript |Specify query for Copy Activity to execute such that data of a specific slice is cleaned up. For more information, see [repeatability](#repeatability-during-copy) section. |A query statement. |No |
| sliceIdentifierColumnName |Specify column name for Copy Activity to fill with auto generated slice identifier, which is used to clean up data of a specific slice when rerun. For more information, see [repeatability](#repeatability-during-copy) section. |Column name of a column with data type of binary(32). |No |
| sqlWriterStoredProcedureName |Name of the stored procedure that upserts (updates/inserts) data into the target table. |Name of the stored procedure. |No |
| storedProcedureParameters |Parameters for the stored procedure. |Name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |
| sqlWriterTableType |Specify table type name to be used in the stored procedure. Copy activity makes the data being moved available in a temp table with this table type. Stored procedure code can then merge the data being copied with existing data. |A table type name. |No |

#### Example
The pipeline contains a Copy Activity that is configured to use these input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **BlobSource** and **sink** type is set to **SqlSink**.

```json
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2016-06-01T18:00:00",
    "end":"2016-06-01T19:00:00",
    "description":"pipeline with copy activity",
    "activities":[  
      {
        "name": "AzureBlobtoSQL",
        "description": "Copy Activity",
        "type": "Copy",
        "inputs": [
          {
            "name": "AzureBlobInput"
          }
        ],
        "outputs": [
          {
            "name": " SqlServerOutput "
          }
        ],
        "typeProperties": {
          "source": {
            "type": "BlobSource",
            "blobColumnSeparators": ","
          },
          "sink": {
            "type": "SqlSink"
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

For more information, see [SQL Server connector](data-factory-sqlserver-connector.md#copy-activity-properties) article. 

## Sybase

### Linked service
The following table provides description for JSON elements specific to Sybase linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OnPremisesSybase** |Yes |
| server |Name of the Sybase server. |Yes |
| database |Name of the Sybase database. |Yes |
| schema |Name of the schema in the database. |No |
| authenticationType |Type of authentication used to connect to the Sybase database. Possible values are: Anonymous, Basic, and Windows. |Yes |
| username |Specify user name if you are using Basic or Windows authentication. |No |
| password |Specify password for the user account you specified for the username. |No |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises Sybase database. |Yes |

#### Example
```JSON
{
    "name": "OnPremSybaseLinkedService",
    "properties": {
        "type": "OnPremisesSybase",
        "typeProperties": {
            "server": "<server>",
            "database": "<database>",
            "schema": "<schema>",
            "authenticationType": "<authentication type>",
            "username": "<username>",
            "password": "<password>",
            "gatewayName": "<gatewayName>"
        }
    }
}
```

For more information, see [Sybase connector](data-factory-onprem-sybase-connector.md#linked-service-properties) article. 

### Dataset
The **typeProperties** section for dataset of type **RelationalTable** (which includes Sybase dataset) has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the Sybase Database instance that linked service refers to. |No (if **query** of **RelationalSource** is specified) |

#### Example

```JSON
{
    "name": "SybaseDataSet",
    "properties": {
        "type": "RelationalTable",
        "linkedServiceName": "OnPremSybaseLinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
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

For more information, see [Sybase connector](data-factory-onprem-sybase-connector.md#dataset-properties) article. 

### Relational Source in Copy Activity
When the source is of type **RelationalSource** (which includes Sybase), the following properties are available in **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: select * from MyTable. |No (if **tableName** of **dataset** is specified) |

#### Example

```JSON
{
    "name": "CopySybaseToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "RelationalSource",
                        "query": "select * from DBA.Orders"
                    },
                    "sink": {
                        "type": "BlobSink"
                    }
                },
                "inputs": [
                    {
                        "name": "SybaseDataSet"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobSybaseDataSet"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "SybaseToBlob"
            }
        ],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
```

For more information, see [Sybase connector](data-factory-onprem-sybase-connector.md#copy-activity-properties) article.

## Teradata

### Linked service
The following table provides description for JSON elements specific to Teradata linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OnPremisesTeradata** |Yes |
| server |Name of the Teradata server. |Yes |
| authenticationType |Type of authentication used to connect to the Teradata database. Possible values are: Anonymous, Basic, and Windows. |Yes |
| username |Specify user name if you are using Basic or Windows authentication. |No |
| password |Specify password for the user account you specified for the username. |No |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises Teradata database. |Yes |

#### Example
```json
{
    "name": "OnPremTeradataLinkedService",
    "properties": {
        "type": "OnPremisesTeradata",
        "typeProperties": {
            "server": "<server>",
            "authenticationType": "<authentication type>",
            "username": "<username>",
            "password": "<password>",
            "gatewayName": "<gatewayName>"
        }
    }
}
```

For more information, see [Teradata connector](data-factory-onprem-teradata-connector.md#linked-service-properties) article.

### Dataset
The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. Currently, there are no type properties supported for the Teradata dataset.


#### Example
```json
{
    "name": "TeradataDataSet",
    "properties": {
        "published": false,
        "type": "RelationalTable",
        "linkedServiceName": "OnPremTeradataLinkedService",
        "typeProperties": {
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
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

For more information, see [Teradata connector](data-factory-onprem-teradata-connector.md#dataset-properties) article.

### Relational Source in Copy Activity
When the source is of type **RelationalSource** (which includes Teradata), the following properties are available in **typeProperties** section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: select * from MyTable. |Yes |

#### Example

```json
{
    "name": "CopyTeradataToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "RelationalSource",
                        "query": "$$Text.Format('select * from MyTable where timestamp >= \\'{0:yyyy-MM-ddTHH:mm:ss}\\' AND timestamp < \\'{1:yyyy-MM-ddTHH:mm:ss}\\'', SliceStart, SliceEnd)"
                    },
                    "sink": {
                        "type": "BlobSink",
                        "writeBatchSize": 0,
                        "writeBatchTimeout": "00:00:00"
                    }
                },
                "inputs": [
                    {
                        "name": "TeradataDataSet"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobTeradataDataSet"
                    }
                ],                    
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "TeradataToBlob"
            }
        ],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00",
        "isPaused": false
    }
}
```

For more information, see [Teradata connector](data-factory-onprem-teradata-connector.md#copy-activity-properties) article.

## Cassandra


### Linked service
The following table provides description for JSON elements specific to Cassandra linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OnPremisesCassandra** |Yes |
| host |One or more IP addresses or host names of Cassandra servers.<br/><br/>Specify a comma-separated list of IP addresses or host names to connect to all servers concurrently. |Yes |
| port |The TCP port that the Cassandra server uses to listen for client connections. |No, default value: 9042 |
| authenticationType |Basic, or Anonymous |Yes |
| username |Specify user name for the user account. |Yes, if authenticationType is set to Basic. |
| password |Specify password for the user account. |Yes, if authenticationType is set to Basic. |
| gatewayName |The name of the gateway that is used to connect to the on-premises Cassandra database. |Yes |
| encryptedCredential |Credential encrypted by the gateway. |No |

#### Example

```json
{
	"name": "CassandraLinkedService",
	"properties":
	{
		"type": "OnPremisesCassandra",
		"typeProperties":
		{
			"authenticationType": "Basic",
			"host": "mycassandraserver",
			"port": 9042,
			"username": "user",
			"password": "password",
			"gatewayName": "mygateway"
		}
	}
}
```

For more information, see [Cassandra connector](data-factory-onprem-cassandra-connector.md#linked-service-properties) article. 

### Dataset
The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **CassandraTable** has the following properties

| Property | Description | Required |
| --- | --- | --- |
| keyspace |Name of the keyspace or schema in Cassandra database. |Yes (If **query** for **CassandraSource** is not defined). |
| tableName |Name of the table in Cassandra database. |Yes (If **query** for **CassandraSource** is not defined). |

#### Example

```json
{
    "name": "CassandraInput",
    "properties": {
        "linkedServiceName": "CassandraLinkedService",
        "type": "CassandraTable",
        "typeProperties": {
            "tableName": "mytable",
            "keySpace": "mykeyspace"
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
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

For more information, see [Cassandra connector](data-factory-onprem-cassandra-connector.md#dataset-properties) article. 

### Cassandra Source in Copy Activity
When source is of type **CassandraSource**, the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL-92 query or CQL query. See [CQL reference](https://docs.datastax.com/en/cql/3.1/cql/cql_reference/cqlReferenceTOC.html). <br/><br/>When using SQL query, specify **keyspace name.table name** to represent the table you want to query. |No (if tableName and keyspace on dataset are defined). |
| consistencyLevel |The consistency level specifies how many replicas must respond to a read request before returning data to the client application. Cassandra checks the specified number of replicas for data to satisfy the read request. |ONE, TWO, THREE, QUORUM, ALL, LOCAL_QUORUM, EACH_QUORUM, LOCAL_ONE. See [Configuring data consistency](http://docs.datastax.com/en//cassandra/2.0/cassandra/dml/dml_config_consistency_c.html) for details. |No. Default value is ONE. |

#### Example
  
```json
{  
    "name":"SamplePipeline",
    "properties":{  
        "start":"2016-06-01T18:00:00",
        "end":"2016-06-01T19:00:00",
        "description":"pipeline with copy activity",
        "activities":[  
        {
            "name": "CassandraToAzureBlob",
            "description": "Copy from Cassandra to an Azure blob",
            "type": "Copy",
            "inputs": [
            {
                "name": "CassandraInput"
            }
            ],
            "outputs": [
            {
                "name": "AzureBlobOutput"
            }
            ],
            "typeProperties": {
                "source": {
                    "type": "CassandraSource",
                    "query": "select id, firstname, lastname from mykeyspace.mytable"

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

For more information, see [Cassandra connector](data-factory-onprem-cassandra-connector.md#copy-activity-properties) article.

## MongoDB

### Linked service
The following table provides description for JSON elements specific to **OnPremisesMongoDB** linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OnPremisesMongoDb** |Yes |
| server |IP address or host name of the MongoDB server. |Yes |
| port |TCP port that the MongoDB server uses to listen for client connections. |Optional, default value: 27017 |
| authenticationType |Basic, or Anonymous. |Yes |
| username |User account to access MongoDB. |Yes (if basic authentication is used). |
| password |Password for the user. |Yes (if basic authentication is used). |
| authSource |Name of the MongoDB database that you want to use to check your credentials for authentication. |Optional (if basic authentication is used). default: uses the admin account and the database specified using databaseName property. |
| databaseName |Name of the MongoDB database that you want to access. |Yes |
| gatewayName |Name of the gateway that accesses the data store. |Yes |
| encryptedCredential |Credential encrypted by gateway. |Optional |

#### Example

```json
{
    "name": "OnPremisesMongoDbLinkedService",
    "properties":
    {
        "type": "OnPremisesMongoDb",
        "typeProperties":
        {
            "authenticationType": "<Basic or Anonymous>",
            "server": "< The IP address or host name of the MongoDB server >",  
            "port": "<The number of the TCP port that the MongoDB server uses to listen for client connections.>",
            "username": "<username>",
            "password": "<password>",
           "authSource": "< The database that you want to use to check your credentials for authentication. >",
            "databaseName": "<database name>",
            "gatewayName": "<mygateway>"
        }
    }
}
```

For more information, see [MongoDB connector article](data-factory-on-premises-mongodb-connector.md#linked-service-properties)

### Dataset
The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **MongoDbCollection** has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| collectionName |Name of the collection in MongoDB database. |Yes |

#### Example

```json
{
     "name":  "MongoDbInputDataset",
    "properties": {
        "type": "MongoDbCollection",
        "linkedServiceName": "OnPremisesMongoDbLinkedService",
        "typeProperties": {
            "collectionName": "<Collection name>"    
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true
    }
}
```

For more information, see [MongoDB connector article](data-factory-on-premises-mongodb-connector.md#dataset-properties)

#### MongoDB Source in Copy Activity
When the source is of type **MongoDbSource**, the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL-92 query string. For example: select * from MyTable. |No (if **collectionName** of **dataset** is specified) |

#### Example

```json
{
    "name": "CopyMongoDBToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "MongoDbSource",
                        "query": "$$Text.Format('select * from  MyTable where LastModifiedDate >= {{ts\'{0:yyyy-MM-dd HH:mm:ss}\'}} AND LastModifiedDate < {{ts\'{1:yyyy-MM-dd HH:mm:ss}\'}}', WindowStart, WindowEnd)"
                    },
                    "sink": {
                        "type": "BlobSink",
                        "writeBatchSize": 0,
                        "writeBatchTimeout": "00:00:00"
                    }
                },
                "inputs": [
                    {
                        "name": "MongoDbInputDataset"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobOutputDataSet"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "MongoDBToAzureBlob"
            }
        ],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
```

For more information, see [MongoDB connector article](data-factory-on-premises-mongodb-connector.md#copy-activity-properties)

## Amazon S3


### Linked service
A linked service links a data store to a data factory. You create a linked service of type **AwsAccessKey** to link your Amazon S3 data store to your data factory. The following table provides description for JSON elements specific to Amazon S3 (AwsAccessKey) linked service.

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| accessKeyID |ID of the secret access key. |string |Yes |
| secretAccessKey |The secret access key itself. |Encrypted secret string |Yes |

#### Example
```json
{
    "name": "AmazonS3LinkedService",
    "properties": {
        "type": "AwsAccessKey",
        "typeProperties": {
            "accessKeyId": "<access key id>",
            "secretAccessKey": "<secret access key>"
        }
    }
}
```

For more information, see [Amazon S3 connector article](data-factory-amazon-simple-storage-service-connector.md#linked-service-properties).

### Dataset
To specify a dataset to represent input data in an Azure Blob Storage, you set the type property of the dataset to: **AmazonS3**. Set the **linkedServiceName** property of the dataset to the name of the Amazon S3 linked service.  For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc.). The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **AmazonS3** (which includes Amazon S3 dataset) has the following properties

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| bucketName |The S3 bucket name. |String |Yes |
| key |The S3 object key. |String |No |
| prefix |Prefix for the S3 object key. Objects whose keys start with this prefix are selected. Applies only when key is empty. |String |No |
| version |The version of S3 object if S3 versioning is enabled. |String |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No | |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. The supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No | |


> [!NOTE]
> bucketName + key specifies the location of the S3 object where bucket is the root container for S3 objects and key is the full path to S3 object.

#### Example: Sample dataset with prefix

```json
{
    "name": "dataset-s3",
    "properties": {
        "type": "AmazonS3",
        "linkedServiceName": "link- testS3",
        "typeProperties": {
            "prefix": "testFolder/test",
            "bucketName": "testbucket",
            "format": {
                "type": "OrcFormat"
            }
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true
    }
}
```
#### Example: Sample data set (with version)

```json
{
    "name": "dataset-s3",
    "properties": {
        "type": "AmazonS3",
        "linkedServiceName": "link- testS3",
        "typeProperties": {
            "key": "testFolder/test.orc",
            "bucketName": "testbucket",
            "version": "XXXXXXXXXczm0CJajYkHf0_k6LhBmkcL",
            "format": {
                "type": "OrcFormat"
            }
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true
    }
}
```

#### Example: Dynamic paths for S3
In the sample, we use fixed values for key and bucketName properties in the Amazon S3 dataset.

```json
"key": "testFolder/test.orc",
"bucketName": "testbucket",
```

You can have Data Factory calculate the key and bucketName dynamically at runtime by using system variables such as SliceStart.

```json
"key": "$$Text.Format('{0:MM}/{0:dd}/test.orc', SliceStart)"
"bucketName": "$$Text.Format('{0:yyyy}', SliceStart)"
```

You can do the same for the prefix property of an Amazon S3 dataset. See [Data Factory functions and system variables](data-factory-functions-variables.md) for a list of supported functions and variables.

For more information, see [Amazon S3 connector article](data-factory-amazon-simple-storage-service-connector.md#dataset-properties).

### File System Source in Copy Activity
When source in copy activity is of type **FileSystemSource** (which includes Amazon S3), the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Specifies whether to recursively list S3 objects under the directory. |true/false |No |


#### Example


```json
{
    "name": "CopyAmazonS3ToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "FileSystemSource",
                        "recursive": true
                    },
                    "sink": {
                        "type": "BlobSink",
                        "writeBatchSize": 0,
                        "writeBatchTimeout": "00:00:00"
                    }
                },
                "inputs": [
                    {
                        "name": "AmazonS3InputDataset"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobOutputDataSet"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "AmazonS3ToBlob"
            }
        ],
        "start": "2016-08-08T18:00:00",
        "end": "2016-08-08T19:00:00"
    }
}
```

For more information, see [Amazon S3 connector article](data-factory-amazon-simple-storage-service-connector.md#copy-activity-properties).

## File System


### Linked service
You can link an on-premises file system to an Azure data factory with the **On-Premises File Server** linked service. The following table provides descriptions for JSON elements that are specific to the On-Premises File Server linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |Ensure that the type property is set to **OnPremisesFileServer**. |Yes |
| host |Specifies the root path of the folder that you want to copy. Use the escape character ‘ \ ’ for special characters in the string. See [Sample linked service and dataset definitions](#sample-linked-service-and-dataset-definitions) for examples. |Yes |
| userid |Specify the ID of the user who has access to the server. |No (if you choose encryptedCredential) |
| password |Specify the password for the user (userid). |No (if you choose encryptedCredential |
| encryptedCredential |Specify the encrypted credentials that you can get by running the New-AzureRmDataFactoryEncryptValue cmdlet. |No (if you choose to specify userid and password in plain text) |
| gatewayName |Specifies the name of the gateway that Data Factory should use to connect to the on-premises file server. |Yes |

#### Sample folder path definitions 
| Scenario | Host in linked service definition | folderPath in dataset definition |
| --- | --- | --- |
| Local folder on Data Management Gateway machine: <br/><br/>Examples: D:\\\* or D:\folder\subfolder\\* |D:\\\\ (for Data Management Gateway 2.0 and later versions) <br/><br/> localhost (for earlier versions than Data Management Gateway 2.0) |.\\\\ or folder\\\\subfolder (for Data Management Gateway 2.0 and later versions) <br/><br/>D:\\\\ or D:\\\\folder\\\\subfolder (for gateway version below 2.0) |
| Remote shared folder: <br/><br/>Examples: \\\\myserver\\share\\\* or \\\\myserver\\share\\folder\\subfolder\\* |\\\\\\\\myserver\\\\share |.\\\\ or folder\\\\subfolder |


#### Example: Using username and password in plain text

```JSON
{
  "Name": "OnPremisesFileServerLinkedService",
  "properties": {
    "type": "OnPremisesFileServer",
    "typeProperties": {
      "host": "\\\\Contosogame-Asia",
      "userid": "Admin",
      "password": "123456",
      "gatewayName": "mygateway"
    }
  }
}
```

#### Example: Using encryptedcredential

```JSON
{
  "Name": " OnPremisesFileServerLinkedService ",
  "properties": {
    "type": "OnPremisesFileServer",
    "typeProperties": {
      "host": "D:\\",
      "encryptedCredential": "WFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5xxxxxxxxxxxxxxxxx",
      "gatewayName": "mygateway"
    }
  }
}
```

For more information, see [File System connector article](data-factory-onprem-file-system-connector.md#linked-service-properties).

### Dataset
The typeProperties section for the dataset of type **FileShare** has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Specifies the subpath to the folder. Use the escape character ‘\’ for special characters in the string. See [Sample linked service and dataset definitions](#sample-linked-service-and-dataset-definitions) for examples.<br/><br/>You can combine this property with **partitionBy** to have folder paths based on slice start/end date-times. |Yes |
| fileName |Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file is in the following format: <br/><br/>`Data.<Guid>.txt` (Example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt) |No |
| fileFilter |Specify a filter to be used to select a subset of files in the folderPath rather than all files. <br/><br/>Allowed values are: `*` (multiple characters) and `?` (single character).<br/><br/>Example 1: "fileFilter": "*.log"<br/>Example 2: "fileFilter": 2016-1-?.txt"<br/><br/>Note that fileFilter is applicable for an input FileShare dataset. |No |
| partitionedBy |You can use partitionedBy to specify a dynamic folderPath/fileName for time-series data. An example is folderPath parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**; and supported levels are: **Optimal** and **Fastest**. see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

> [!NOTE]
> You cannot use fileName and fileFilter simultaneously.

#### Example

```JSON
{
  "name": "OnpremisesFileSystemInput",
  "properties": {
    "type": " FileShare",
    "linkedServiceName": " OnPremisesFileServerLinkedService ",
    "typeProperties": {
      "folderPath": "mysharedfolder/yearno={Year}/monthno={Month}/dayno={Day}",
      "fileName": "{Hour}.csv",
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

For more information, see [File System connector article](data-factory-onprem-file-system-connector.md#dataset-properties).

### File System Source in Copy Activity
**FileSystemSource** supports the following properties:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the subfolders or only from the specified folder. |True, False (default) |No |

#### Example

```JSON
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2015-06-01T18:00:00",
    "end":"2015-06-01T19:00:00",
    "description":"Pipeline for copy activity",
    "activities":[  
      {
        "name": "OnpremisesFileSystemtoBlob",
        "description": "copy activity",
        "type": "Copy",
        "inputs": [
          {
            "name": "OnpremisesFileSystemInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureBlobOutput"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "FileSystemSource"
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
For more information, see [File System connector article](data-factory-onprem-file-system-connector.md#copy-activity-properties).

### File System Sink in Copy Activity
**FileSystemSink** supports the following properties:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| copyBehavior |Defines the copy behavior when the source is BlobSource or FileSystem. |**PreserveHierarchy:** Preserves the file hierarchy in the target folder. That is, the relative path of the source file to the source folder is the same as the relative path of the target file to the target folder.<br/><br/>**FlattenHierarchy:** All files from the source folder are created in the first level of target folder. The target files are created with an autogenerated name.<br/><br/>**MergeFiles:** Merges all files from the source folder to one file. If the file name/blob name is specified, the merged file name is the specified name. Otherwise, it is an auto-generated file name. |No |


#### Example

```JSON
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2015-06-01T18:00:00",
    "end":"2015-06-01T20:00:00",
    "description":"pipeline for copy activity",
    "activities":[  
      {
        "name": "AzureSQLtoOnPremisesFile",
        "description": "copy activity",
        "type": "Copy",
        "inputs": [
          {
            "name": "AzureSQLInput"
          }
        ],
        "outputs": [
          {
            "name": "OnpremisesFileSystemOutput"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "SqlSource",
            "SqlReaderQuery": "$$Text.Format('select * from MyTable where timestampcolumn >= \\'{0:yyyy-MM-dd}\\' AND timestampcolumn < \\'{1:yyyy-MM-dd}\\'', WindowStart, WindowEnd)"
          },
          "sink": {
            "type": "FileSystemSink"
          }
        },
       "scheduler": {
          "frequency": "Hour",
          "interval": 1
        },
        "policy": {
          "concurrency": 1,
          "executionPriorityOrder": "OldestFirst",
          "retry": 3,
          "timeout": "01:00:00"
        }
      }
     ]
   }
}
```

For more information, see [File System connector article](data-factory-onprem-file-system-connector.md#copy-activity-properties).

## FTP

### Linked service
The following table provides description for JSON elements specific to FTP linked service.

| Property | Description | Required | Default |
| --- | --- | --- | --- |
| type |The type property must be set to FtpServer |Yes |&nbsp; |
| host |Name or IP address of the FTP Server |Yes |&nbsp; |
| authenticationType |Specify authentication type |Yes |Basic, Anonymous |
| username |User who has access to the FTP server |No |&nbsp; |
| password |Password for the user (username) |No |&nbsp; |
| encryptedCredential |Encrypted credential to access the FTP server |No |&nbsp; |
| gatewayName |Name of the Data Management Gateway gateway to connect to an on-premises FTP server |No |&nbsp; |
| port |Port on which the FTP server is listening |No |21 |
| enableSsl |Specify whether to use FTP over SSL/TLS channel |No |true |
| enableServerCertificateValidation |Specify whether to enable server SSL certificate validation when using FTP over SSL/TLS channel |No |true |

#### Example: Using Anonymous authentication

```JSON
{
    "name": "FTPLinkedService",
    "properties": {
        "type": "FtpServer",
        "typeProperties": {        
            "authenticationType": "Anonymous",
              "host": "myftpserver.com"
        }
    }
}
```

#### Example: Using username and password in plain text for basic authentication

```JSON
{
    "name": "FTPLinkedService",
      "properties": {
    "type": "FtpServer",
        "typeProperties": {
            "host": "myftpserver.com",
            "authenticationType": "Basic",
            "username": "Admin",
            "password": "123456"
        }
      }
}
```

#### Example: Using port, enableSsl, enableServerCertificateValidation

```JSON
{
    "name": "FTPLinkedService",
    "properties": {
        "type": "FtpServer",
        "typeProperties": {
            "host": "myftpserver.com",
            "authenticationType": "Basic",    
            "username": "Admin",
            "password": "123456",
            "port": "21",
            "enableSsl": true,
            "enableServerCertificateValidation": true
        }
    }
}
```

#### Example: Using encryptedCredential for authentication and gateway

```JSON
{
    "name": "FTPLinkedService",
    "properties": {
        "type": "FtpServer",
        "typeProperties": {
            "host": "myftpserver.com",
            "authenticationType": "Basic",
            "encryptedCredential": "xxxxxxxxxxxxxxxxx",
            "gatewayName": "mygateway"
        }
      }
}
```

For more information, see [FTP connector](data-factory-ftp-connector.md#linked-service-properties) article.

### Dataset
The typeProperties section for a dataset of type **FileShare** dataset has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Sub path to the folder. Use escape character ‘ \ ’ for special characters in the string. See [Sample linked service and dataset definitions](#sample-linked-service-and-dataset-definitions) for examples.<br/><br/>You can combine this property with **partitionBy** to have folder paths based on slice start/end date-times. |Yes 
| fileName |Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: <br/><br/>Data.<Guid>.txt (Example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt |No |
| fileFilter |Specify a filter to be used to select a subset of files in the folderPath rather than all files.<br/><br/>Allowed values are: `*` (multiple characters) and `?` (single character).<br/><br/>Examples 1: `"fileFilter": "*.log"`<br/>Example 2: `"fileFilter": 2016-1-?.txt"`<br/><br/> fileFilter is applicable for an input FileShare dataset. This property is not supported with HDFS. |No |
| partitionedBy |partitionedBy can be used to specify a dynamic folderPath, filename for time series data. For example, folderPath parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**; and supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |
| useBinaryTransfer |Specify whether use Binary transfer mode. True for binary mode and false ASCII. Default value: True. This property can only be used when associated linked service type is of type: FtpServer. |No |

> [!NOTE]
> filename and fileFilter cannot be used simultaneously.

#### Example

```JSON
{
  "name": "FTPFileInput",
  "properties": {
    "type": "FileShare",
    "linkedServiceName": "FTPLinkedService",
    "typeProperties": {
      "folderPath": "mysharedfolder",
      "fileName": "test.csv",
      "useBinaryTransfer": true
    },
    "external": true,
    "availability": {
      "frequency": "Hour",
      "interval": 1
    }
  }
}
```

For more information, see [FTP connector](data-factory-ftp-connector.md#dataset-properties) article.

### File System Source in Copy Activity
In Copy Activity, when source is of type **FileSystemSource**, the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the sub folders or only from the specified folder. |True, False (default) |No |

#### Example

```JSON
{
    "name": "pipeline",
    "properties": {
        "activities": [{
            "name": "FTPToBlobCopy",
            "inputs": [{
                "name": "FtpFileInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "FileSystemSource"
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
                "executionPriorityOrder": "NewestFirst",
                "retry": 1,
                "timeout": "00:05:00"
            }
        }],
        "start": "2016-08-24T18:00:00",
        "end": "2016-08-24T19:00:00"
    }
}
```

For more information, see [FTP connector](data-factory-ftp-connector.md#copy-activity-properties) article.


## HDFS

### Linked service
You create a linked service of type **Hdfs** to link an on-premises HDFS to your data factory. The following table provides description for JSON elements specific to HDFS linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **Hdfs** |Yes |
| Url |URL to the HDFS |Yes |
| authenticationType |Anonymous, or Windows. <br><br> To use **Kerberos authentication** for HDFS connector, refer to [this section](#use-kerberos-authentication-for-hdfs-connector) to set up your on-premises environment accordingly. |Yes |
| userName |Username for Windows authentication. |Yes (for Windows Authentication) |
| password |Password for Windows authentication. |Yes (for Windows Authentication) |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the HDFS. |Yes |
| encryptedCredential |[New-AzureRMDataFactoryEncryptValue](https://msdn.microsoft.com/library/mt603802.aspx) output of the access credential. |No |

#### Example: Using Anonymous authentication

```JSON
{
    "name": "HDFSLinkedService",
    "properties":
    {
        "type": "Hdfs",
        "typeProperties":
        {
            "authenticationType": "Anonymous",
            "userName": "hadoop",
            "url" : "http://<machine>:50070/webhdfs/v1/",
            "gatewayName": "mygateway"
        }
    }
}
```

#### Example: Using Windows authentication

```JSON
{
    "name": "HDFSLinkedService",
    "properties":
    {
        "type": "Hdfs",
        "typeProperties":
        {
            "authenticationType": "Windows",
            "userName": "Administrator",
            "password": "password",
            "url" : "http://<machine>:50070/webhdfs/v1/",
            "gatewayName": "mygateway"
        }
    }
}
```

For more information, see [HDFS connector](#data-factory-hdfs-connector.md#linked-service-properties) article. 

### Dataset
The typeProperties section for dataset of type **FileShare** (which includes HDFS dataset) has the following properties

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Path to the folder. Example: `myfolder`<br/><br/>Use escape character ‘ \ ’ for special characters in the string. For example: for folder\subfolder, specify folder\\\\subfolder and for d:\samplefolder, specify d:\\\\samplefolder.<br/><br/>You can combine this property with **partitionBy** to have folder paths based on slice start/end date-times. |Yes |
| fileName |Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: <br/><br/>Data.<Guid>.txt (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt |No |
| partitionedBy |partitionedBy can be used to specify a dynamic folderPath, filename for time series data. Example: folderPath parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

> [!NOTE]
> filename and fileFilter cannot be used simultaneously.

#### Example

```JSON
{
    "name": "InputDataset",
    "properties": {
        "type": "FileShare",
        "linkedServiceName": "HDFSLinkedService",
        "typeProperties": {
            "folderPath": "DataTransfer/UnitTest/"
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval":  1
        }
    }
}
```

For more information, see [HDFS connector](#data-factory-hdfs-connector.md#dataset-properties) article. 

### File System Source in Copy Activity
For Copy Activity, when source is of type **FileSystemSource** the following properties are available in typeProperties section:

**FileSystemSource** supports the following properties:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the sub folders or only from the specified folder. |True, False (default) |No |

#### Example

```JSON
{
    "name": "pipeline",
    "properties":
    {
        "activities":
        [
            {
                "name": "HdfsToBlobCopy",
                "inputs": [ {"name": "InputDataset"} ],
                "outputs": [ {"name": "OutputDataset"} ],
                "type": "Copy",
                "typeProperties":
                {
                    "source":
                    {
                        "type": "FileSystemSource"
                    },
                    "sink":
                    {
                        "type": "BlobSink"
                    }
                },
                "policy":
                {
                    "concurrency": 1,
                    "executionPriorityOrder": "NewestFirst",
                    "retry": 1,
                    "timeout": "00:05:00"
                }
            }
        ],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
```

For more information, see [HDFS connector](#data-factory-hdfs-connector.md#copy-activity-properties) article.

## SFTP


### Linked service
The following table provides description for JSON elements specific to FTP linked service.

| Property | Description | Required |
| --- | --- | --- | --- |
| type | The type property must be set to `Sftp`. |Yes |
| host | Name or IP address of the SFTP server. |Yes |
| port |Port on which the SFTP server is listening. The default value is: 21 |No |
| authenticationType |Specify authentication type. Allowed values: **Basic**, **SshPublicKey**. <br><br> Refer to [Using basic authentication](#using-basic-authentication) and [Using SSH public key authentication](#using-ssh-public-key-authentication) sections on more properties and JSON samples respectively. |Yes |
| skipHostKeyValidation | Specify whether to skip host key validation. | No. The default value: false |
| hostKeyFingerprint | Specify the finger print of the host key. | Yes if the `skipHostKeyValidation` is set to false.  |
| gatewayName |Name of the Data Management Gateway to connect to an on-premises SFTP server. | Yes if copying data from an on-premises SFTP server. |
| encryptedCredential | Encrypted credential to access the SFTP server. Auto-generated when you specify basic authentication (username + password) or SshPublicKey authentication (username + private key path or content) in copy wizard or the ClickOnce popup dialog. | No. Apply only when copying data from an on-premises SFTP server. |

#### Example: Using basic authentication

To use basic authentication, set `authenticationType` as `Basic`, and specify the following properties besides the SFTP connector generic ones introduced in the last section:

| Property | Description | Required |
| --- | --- | --- | --- |
| username | User who has access to the SFTP server. |Yes |
| password | Password for the user (username). | Yes |

```json
{
    "name": "SftpLinkedService",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "mysftpserver",
            "port": 22,
            "authenticationType": "Basic",
            "username": "xxx",
            "password": "xxx",
            "skipHostKeyValidation": false,
            "hostKeyFingerPrint": "ssh-rsa 2048 xx:00:00:00:xx:00:x0:0x:0x:0x:0x:00:00:x0:x0:00",
            "gatewayName": "mygateway"
        }
    }
}
```

#### Example: Basic authentication with encrypted credential**

```JSON
{
    "name": "SftpLinkedService",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "mysftpserver",
            "port": 22,
            "authenticationType": "Basic",
            "username": "xxx",
            "encryptedCredential": "xxxxxxxxxxxxxxxxx",
            "skipHostKeyValidation": false,
            "hostKeyFingerPrint": "ssh-rsa 2048 xx:00:00:00:xx:00:x0:0x:0x:0x:0x:00:00:x0:x0:00",
            "gatewayName": "mygateway"
        }
      }
}
```

#### Using SSH public key authentication:**

To use basic authentication, set `authenticationType` as `SshPublicKey`, and specify the following properties besides the SFTP connector generic ones introduced in the last section:

| Property | Description | Required |
| --- | --- | --- | --- |
| username |User who has access to the SFTP server |Yes |
| privateKeyPath | Specify absolute path to the private key file that gateway can access. | Specify either the `privateKeyPath` or `privateKeyContent`. <br><br> Apply only when copying data from an on-premises SFTP server. |
| privateKeyContent | A serialized string of the private key content. The Copy Wizard can read the private key file and extract the private key content automatically. If you are using any other tool/SDK, use the privateKeyPath property instead. | Specify either the `privateKeyPath` or `privateKeyContent`. |
| passPhrase | Specify the pass phrase/password to decrypt the private key if the key file is protected by a pass phrase. | Yes if the private key file is protected by a pass phrase. |

```json
{
    "name": "SftpLinkedServiceWithPrivateKeyPath",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "mysftpserver",
            "port": 22,
            "authenticationType": "SshPublicKey",
            "username": "xxx",
            "privateKeyPath": "D:\\privatekey_openssh",
            "passPhrase": "xxx",
            "skipHostKeyValidation": true,
            "gatewayName": "mygateway"
        }
    }
}
```

#### Example: SshPublicKey authentication using private key content**

```json
{
    "name": "SftpLinkedServiceWithPrivateKeyContent",
    "properties": {
        "type": "Sftp",
        "typeProperties": {
            "host": "mysftpserver.westus.cloudapp.azure.com",
            "port": 22,
            "authenticationType": "SshPublicKey",
            "username": "xxx",
            "privateKeyContent": "<base64 string of the private key content>",
            "passPhrase": "xxx",
            "skipHostKeyValidation": true
        }
    }
}
```

For more information, see [SFTP connector](data-factory-sftp-connector.md#linked-service-properties) article. 

### Dataset
The typeProperties section for a dataset of type **FileShare** dataset has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Sub path to the folder. Use escape character ‘ \ ’ for special characters in the string. See [Sample linked service and dataset definitions](#sample-linked-service-and-dataset-definitions) for examples.<br/><br/>You can combine this property with **partitionBy** to have folder paths based on slice start/end date-times. |Yes |
| fileName |Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: <br/><br/>Data.<Guid>.txt (Example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt |No |
| fileFilter |Specify a filter to be used to select a subset of files in the folderPath rather than all files.<br/><br/>Allowed values are: `*` (multiple characters) and `?` (single character).<br/><br/>Examples 1: `"fileFilter": "*.log"`<br/>Example 2: `"fileFilter": 2016-1-?.txt"`<br/><br/> fileFilter is applicable for an input FileShare dataset. This property is not supported with HDFS. |No |
| partitionedBy |partitionedBy can be used to specify a dynamic folderPath, filename for time series data. For example, folderPath parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |
| useBinaryTransfer |Specify whether use Binary transfer mode. True for binary mode and false ASCII. Default value: True. This property can only be used when associated linked service type is of type: FtpServer. |No |

> [!NOTE]
> filename and fileFilter cannot be used simultaneously.

#### Example

```json
{
  "name": "SFTPFileInput",
  "properties": {
    "type": "FileShare",
    "linkedServiceName": "SftpLinkedService",
    "typeProperties": {
      "folderPath": "mysharedfolder",
      "fileName": "test.csv"
    },
    "external": true,
    "availability": {
      "frequency": "Hour",
      "interval": 1
    }
  }
}
```

For more information, see [SFTP connector](data-factory-sftp-connector.md#dataset-properties) article. 

### File System Source in Copy Activity
In Copy Activity, when source is of type **FileSystemSource**, the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| recursive |Indicates whether the data is read recursively from the sub folders or only from the specified folder. |True, False (default) |No |



#### Example

```json
{
    "name": "pipeline",
    "properties": {
        "activities": [{
            "name": "SFTPToBlobCopy",
            "inputs": [{
                "name": "SFTPFileInput"
            }],
            "outputs": [{
                "name": "AzureBlobOutput"
            }],
            "type": "Copy",
            "typeProperties": {
                "source": {
                    "type": "FileSystemSource"
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
                "executionPriorityOrder": "NewestFirst",
                "retry": 1,
                "timeout": "00:05:00"
            }
        }],
        "start": "2017-02-20T18:00:00",
        "end": "2017-02-20T19:00:00"
    }
}
```

For more information, see [SFTP connector](data-factory-sftp-connector.md#copy-activity-properties) article.


## HTTP

### Linked service
The following table provides description for JSON elements specific to HTTP linked service.

| Property | Description | Required |
| --- | --- | --- |
| type | The type property must be set to: `Http`. | Yes |
| url | Base URL to the Web Server | Yes |
| authenticationType | Specifies the authentication type. Allowed values are: **Anonymous**, **Basic**, **Digest**, **Windows**, **ClientCertificate**. <br><br> Refer to sections below this table on more properties and JSON samples for those authentication types respectively. | Yes |
| enableServerCertificateValidation | Specify whether to enable server SSL certificate validation if source is HTTPS Web Server | No, default is true |
| gatewayName | Name of the Data Management Gateway to connect to an on-premises HTTP source. | Yes if copying data from an on-premises HTTP source. |
| encryptedCredential | Encrypted credential to access the HTTP endpoint. Auto-generated when you configure the authentication information in copy wizard or the ClickOnce popup dialog. | No. Apply only when copying data from an on-premises HTTP server. |

#### Example: Using Basic, Digest, or Windows authentication
Set `authenticationType` as `Basic`, `Digest`, or `Windows`, and specify the following properties besides the HTTP connector generic ones introduced above:

| Property | Description | Required |
| --- | --- | --- |
| username | Username to access the HTTP endpoint. | Yes |
| password | Password for the user (username). | Yes |

```JSON
{
    "name": "HttpLinkedService",
    "properties":
    {
        "type": "Http",
        "typeProperties":
        {
            "authenticationType": "basic",
            "url" : "https://en.wikipedia.org/wiki/",
            "userName": "user name",
            "password": "password"
        }
    }
}
```

#### Example: Using ClientCertificate authentication

To use basic authentication, set `authenticationType` as `ClientCertificate`, and specify the following properties besides the HTTP connector generic ones introduced above:

| Property | Description | Required |
| --- | --- | --- |
| embeddedCertData | The Base64-encoded contents of binary data of the Personal Information Exchange (PFX) file. | Specify either the `embeddedCertData` or `certThumbprint`. |
| certThumbprint | The thumbprint of the certificate that was installed on your gateway machine’s cert store. Apply only when copying data from an on-premises HTTP source. | Specify either the `embeddedCertData` or `certThumbprint`. |
| password | Password associated with the certificate. | No |

If you use `certThumbprint` for authentication and the certificate is installed in the personal store of the local computer, you need to grant the read permission to the gateway service:

1. Launch Microsoft Management Console (MMC). Add the **Certificates** snap-in that targets the **Local Computer**.
2. Expand **Certificates**, **Personal**, and click **Certificates**.
3. Right-click the certificate from the personal store, and select **All Tasks**->**Manage Private Keys...**
3. On the **Security** tab, add the user account under which Data Management Gateway Host Service is running with the read access to the certificate.  

**Example: using client certificate:**
This linked service links your data factory to an on-premises HTTP web server. It uses a client certificate that is installed on the machine with Data Management Gateway installed.

```JSON
{
    "name": "HttpLinkedService",
    "properties":
    {
        "type": "Http",
        "typeProperties":
        {
            "authenticationType": "ClientCertificate",
            "url": "https://en.wikipedia.org/wiki/",
		    "certThumbprint": "thumbprint of certificate",
		    "gatewayName": "gateway name"

        }
    }
}
```

#### Example: using client certificate in a file
This linked service links your data factory to an on-premises HTTP web server. It uses a client certificate file on the machine with Data Management Gateway installed.

```JSON
{
    "name": "HttpLinkedService",
    "properties":
    {
        "type": "Http",
        "typeProperties":
        {
            "authenticationType": "ClientCertificate",
            "url": "https://en.wikipedia.org/wiki/",
		    "embeddedCertData": "base64 encoded cert data",
		    "password": "password of cert"
        }
    }
}
```

For more information, see [HTTP connector](data-factory-http-connector.md#linked-service-properties) article.

### Dataset
The typeProperties section for dataset of type **Http** has the following properties

| Property | Description | Required |
|:--- |:--- |:--- |
| type | Specified the type of the dataset. must be set to `Http`. | Yes |
| relativeUrl | A relative URL to the resource that contains the data. When path is not specified, only the URL specified in the linked service definition is used. <br><br> To construct dynamic URL, you can use [Data Factory functions and system variables](data-factory-functions-variables.md), Example: `"relativeUrl": "$$Text.Format('/my/report?month={0:yyyy}-{0:MM}&fmt=csv', SliceStart)"`. | No |
| requestMethod | Http method. Allowed values are **GET** or **POST**. | No. Default is `GET`. |
| additionalHeaders | Additional HTTP request headers. | No |
| requestBody | Body for HTTP request. | No |
| format | If you want to simply **retrieve the data from HTTP endpoint as-is** without parsing it, skip this format settings. <br><br> If you want to parse the HTTP response content during copy, the following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

#### Example: using the GET (default) method

```JSON
{
	"name": "HttpSourceDataInput",
    "properties": {
		"type": "Http",
        "linkedServiceName": "HttpLinkedService",
        "typeProperties": {
			"relativeUrl": "XXX/test.xml",
	    	"additionalHeaders": "Connection: keep-alive\nUser-Agent: Mozilla/5.0\n"
		},
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval":  1
        }
    }
}
```

#### Example: using the POST method

```JSON
{
    "name": "HttpSourceDataInput",
    "properties": {
        "type": "Http",
        "linkedServiceName": "HttpLinkedService",
        "typeProperties": {
            "relativeUrl": "/XXX/test.xml",
		   "requestMethod": "Post",
            "requestBody": "body for POST HTTP request"
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval":  1
        }
    }
}
```
For more information, see [HTTP connector](data-factory-http-connector.md#dataset-properties) article.

### HTTP Source in Copy Activity
When the source in copy activity is of type **HttpSource**, the following properties are supported.

| Property | Description | Required |
| -------- | ----------- | -------- |
| httpRequestTimeout | The timeout (TimeSpan) for the HTTP request to get a response. It is the timeout to get a response, not the timeout to read response data. | No. Default value: 00:01:40 |


#### Example

```JSON
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2016-06-01T18:00:00",
    "end":"2016-06-01T19:00:00",
    "description":"pipeline with copy activity",
    "activities":[  
      {
        "name": "HttpSourceToAzureBlob",
        "description": "Copy from an HTTP source to an Azure blob",
        "type": "Copy",
        "inputs": [
          {
            "name": "HttpSourceDataInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureBlobOutput"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "HttpSource"
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

For more information, see [HTTP connector](data-factory-http-connector.md#copy-activity-properties) article.

## OData

### Linked service
The following table provides description for JSON elements specific to OData linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OData** |Yes |
| url |Url of the OData service. |Yes |
| authenticationType |Type of authentication used to connect to the OData source. <br/><br/> For cloud OData, possible values are Anonymous, Basic, and OAuth (note Azure Data Factory currently only support Azure Active Directory based OAuth). <br/><br/> For on-premises OData, possible values are Anonymous, Basic, and Windows. |Yes |
| username |Specify user name if you are using Basic authentication. |Yes (only if you are using Basic authentication) |
| password |Specify password for the user account you specified for the username. |Yes (only if you are using Basic authentication) |
| authorizedCredential |If you are using OAuth, click **Authorize** button in the Data Factory Copy Wizard or Editor and enter your credential, then the value of this property will be auto-generated. |Yes (only if you are using OAuth authentication) |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the on-premises OData service. Specify only if you are copying data from on-prem OData source. |No |

#### Example - Using Basic authentication
```json
{
    "name": "inputLinkedService",
    "properties":
    {
        "type": "OData",
            "typeProperties":
        {
            "url": "http://services.odata.org/OData/OData.svc",
            "authenticationType": "Basic",
            "username": "username",
            "password": "password"
        }
    }
}
```

#### Example - Using Anonymous authentication

```json
{
    "name": "ODataLinkedService",
        "properties":
    {
        "type": "OData",
        "typeProperties":
        {
            "url": "http://services.odata.org/OData/OData.svc",
            "authenticationType": "Anonymous"
        }
    }
}
```

#### Example - Using Windows authentication accessing on-premises OData source

```json
{
    "name": "inputLinkedService",
    "properties":
    {
        "type": "OData",
            "typeProperties":
        {
            "url": "<endpoint of on-premises OData source, for example, Dynamics CRM>",
            "authenticationType": "Windows",
            "username": "domain\\user",
            "password": "password",
            "gatewayName": "mygateway"
        }
    }
}
```

#### Example - Using OAuth authentication accessing cloud OData source
```json
{
    "name": "inputLinkedService",
    "properties":
    {
        "type": "OData",
            "typeProperties":
        {
            "url": "<endpoint of cloud OData source, for example, https://<tenant>.crm.dynamics.com/XRMServices/2011/OrganizationData.svc>",
            "authenticationType": "OAuth",
            "authorizedCredential": "<auto generated by clicking the Authorize button on UI>"
        }
    }
}
```

For more information, see [OData connector](data-factory-odata-connector.md#linked-service-properties) article.

### Dataset
The typeProperties section for dataset of type **ODataResource** (which includes OData dataset) has the following properties

| Property | Description | Required |
| --- | --- | --- |
| path |Path to the OData resource |No |

#### Example

```json
{
    "name": "ODataDataset",
    "properties":
    {
        "type": "ODataResource",
        "typeProperties":
        {
                "path": "Products"
        },
        "linkedServiceName": "ODataLinkedService",
        "structure": [],
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
        "policy": {
            "retryInterval": "00:01:00",
            "retryTimeout": "00:10:00",
            "maximumRetry": 3                
        }
    }
}
```

For more information, see [OData connector](data-factory-odata-connector.md#dataset-properties) article.

### Relational Source in Copy Activity
When source is of type **RelationalSource** (which includes OData) the following properties are available in typeProperties section:

| Property | Description | Example | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |"?$select=Name, Description&$top=5" |No |

#### Example

```json
{
    "name": "CopyODataToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "RelationalSource",
                        "query": "?$select=Name, Description&$top=5",
                    },
                    "sink": {
                        "type": "BlobSink",
                        "writeBatchSize": 0,
                        "writeBatchTimeout": "00:00:00"
                    }
                },
                "inputs": [
                    {
                        "name": "ODataDataSet"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobODataDataSet"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "ODataToBlob"
            }
        ],
        "start": "2017-02-01T18:00:00",
        "end": "2017-02-03T19:00:00"
    }
}
```

For more information, see [OData connector](data-factory-odata-connector.md#copy-activity-properties) article.


## ODBC


### Linked service
The following table provides description for JSON elements specific to ODBC linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **OnPremisesOdbc** |Yes |
| connectionString |The non-access credential portion of the connection string and an optional encrypted credential. See examples in the following sections. |Yes |
| credential |The access credential portion of the connection string specified in driver-specific property-value format. Example: “Uid=<user ID>;Pwd=<password>;RefreshToken=<secret refresh token>;”. |No |
| authenticationType |Type of authentication used to connect to the ODBC data store. Possible values are: Anonymous and Basic. |Yes |
| username |Specify user name if you are using Basic authentication. |No |
| password |Specify password for the user account you specified for the username. |No |
| gatewayName |Name of the gateway that the Data Factory service should use to connect to the ODBC data store. |Yes |

#### Example - Using Basic authentication

```json
{
    "name": "odbc",
    "properties":
    {
        "type": "OnPremisesOdbc",
        "typeProperties":
        {
            "authenticationType": "Basic",
            "connectionString": "Driver={SQL Server};Server=Server.database.windows.net; Database=TestDatabase;",
            "userName": "username",
            "password": "password",
            "gatewayName": "mygateway"
        }
    }
}
```
#### Example - Using Basic authentication with encrypted credentials
You can encrypt the credentials using the [New-AzureRMDataFactoryEncryptValue](https://msdn.microsoft.com/library/mt603802.aspx) (1.0 version of Azure PowerShell) cmdlet or [New-AzureDataFactoryEncryptValue](https://msdn.microsoft.com/library/dn834940.aspx) (0.9 or earlier version of the Azure PowerShell).  

```json
{
    "name": "odbc",
    "properties":
    {
        "type": "OnPremisesOdbc",
        "typeProperties":
        {
            "authenticationType": "Basic",
            "connectionString": "Driver={SQL Server};Server=myserver.database.windows.net; Database=TestDatabase;;EncryptedCredential=eyJDb25uZWN0...........................",
            "gatewayName": "mygateway"
        }
    }
}
```

#### Example: Using Anonymous authentication

```json
{
    "name": "odbc",
    "properties":
    {
        "type": "OnPremisesOdbc",
        "typeProperties":
        {
            "authenticationType": "Anonymous",
            "connectionString": "Driver={SQL Server};Server={servername}.database.windows.net; Database=TestDatabase;",
            "credential": "UID={uid};PWD={pwd}",
            "gatewayName": "mygateway"
        }
    }
}
```

For more information, see [ODBC connector](data-factory-odbc-connector.md#linked-service-properties) article. 

### Dataset
The typeProperties section for dataset of type **RelationalTable** (which includes ODBC dataset) has the following properties

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in the ODBC data store. |Yes |


#### Example

```json
{
    "name": "ODBCDataSet",
    "properties": {
        "published": false,
        "type": "RelationalTable",
        "linkedServiceName": "OnPremOdbcLinkedService",
        "typeProperties": {},
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
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

For more information, see [ODBC connector](data-factory-odbc-connector.md#dataset-properties) article. 

### Relational Source in Copy Activity
In copy activity, when source is of type **RelationalSource** (which includes ODBC), the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |SQL query string. For example: select * from MyTable. |Yes |

#### Example

```json
{
    "name": "CopyODBCToBlob",
    "properties": {
        "description": "pipeline for copy activity",
        "activities": [
            {
                "type": "Copy",
                "typeProperties": {
                    "source": {
                        "type": "RelationalSource",
                        "query": "$$Text.Format('select * from MyTable where timestamp >= \\'{0:yyyy-MM-ddTHH:mm:ss}\\' AND timestamp < \\'{1:yyyy-MM-ddTHH:mm:ss}\\'', WindowStart, WindowEnd)"
                    },
                    "sink": {
                        "type": "BlobSink",
                        "writeBatchSize": 0,
                        "writeBatchTimeout": "00:00:00"
                    }
                },
                "inputs": [
                    {
                        "name": "OdbcDataSet"
                    }
                ],
                "outputs": [
                    {
                        "name": "AzureBlobOdbcDataSet"
                    }
                ],
                "policy": {
                    "timeout": "01:00:00",
                    "concurrency": 1
                },
                "scheduler": {
                    "frequency": "Hour",
                    "interval": 1
                },
                "name": "OdbcToBlob"
            }
        ],
        "start": "2016-06-01T18:00:00",
        "end": "2016-06-01T19:00:00"
    }
}
``` 

For more information, see [ODBC connector](data-factory-odbc-connector.md#copy-activity-properties) article.

## Salesforce


### Linked service
The following table provides descriptions for JSON elements that are specific to the Salesforce linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **Salesforce**. |Yes |
| environmentUrl | Specify the URL of Salesforce instance. <br><br> - Default is "https://login.salesforce.com". <br> - To copy data from sandbox, specify "https://test.salesforce.com". <br> - To copy data from custom domain, specify, for example, "https://[domain].my.salesforce.com". |No |
| username |Specify a user name for the user account. |Yes |
| password |Specify a password for the user account. |Yes |
| securityToken |Specify a security token for the user account. See [Get security token](https://help.salesforce.com/apex/HTViewHelpDoc?id=user_security_token.htm) for instructions on how to reset/get a security token. To learn about security tokens in general, see [Security and the API](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_concepts_security.htm). |Yes |

#### Example

```json
{
    "name": "SalesforceLinkedService",
    "properties":
    {
        "type": "Salesforce",
        "typeProperties":
        {
            "username": "<user name>",
            "password": "<password>",
            "securityToken": "<security token>"
        }
    }
}
```

For more information, see [Salesforce connector](data-factory-salesforce-connector.md#linked-service-properties) article. 

### Dataset
The typeProperties section for a dataset of the type **RelationalTable** has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in Salesforce. |No (if a **query** of **RelationalSource** is specified) |

#### Example

```json
{
    "name": "SalesforceInput",
    "properties": {
        "linkedServiceName": "SalesforceLinkedService",
        "type": "RelationalTable",
        "typeProperties": {
            "tableName": "AllDataType__c"  
        },
        "availability": {
            "frequency": "Hour",
            "interval": 1
        },
        "external": true,
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

For more information, see [Salesforce connector](data-factory-salesforce-connector.md#dataset-properties) article. 

### Relational Source in Copy Activity
In copy activity, when the source is of the type **RelationalSource** (which includes Salesforce), the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |A SQL-92 query or [Salesforce Object Query Language (SOQL)](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm) query. For example:  `select * from MyTable__c`. |No (if the **tableName** of the **dataset** is specified) |

#### Example  



```json
{  
    "name":"SamplePipeline",
    "properties":{  
        "start":"2016-06-01T18:00:00",
        "end":"2016-06-01T19:00:00",
        "description":"pipeline with copy activity",
        "activities":[  
        {
            "name": "SalesforceToAzureBlob",
            "description": "Copy from Salesforce to an Azure blob",
            "type": "Copy",
            "inputs": [
            {
                "name": "SalesforceInput"
            }
            ],
            "outputs": [
            {
                "name": "AzureBlobOutput"
            }
            ],
            "typeProperties": {
                "source": {
                    "type": "RelationalSource",
                    "query": "SELECT Id, Col_AutoNumber__c, Col_Checkbox__c, Col_Currency__c, Col_Date__c, Col_DateTime__c, Col_Email__c, Col_Number__c, Col_Percent__c, Col_Phone__c, Col_Picklist__c, Col_Picklist_MultiSelect__c, Col_Text__c, Col_Text_Area__c, Col_Text_AreaLong__c, Col_Text_AreaRich__c, Col_URL__c, Col_Text_Encrypt__c, Col_Lookup__c FROM AllDataType__c"                
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

> [!IMPORTANT]
> The "__c" part of the API Name is needed for any custom object.

For more information, see [Salesforce connector](data-factory-salesforce-connector.md#copy-activity-properties) article. 

## Web Data 

### Linked service
The following table provides description for JSON elements specific to Web linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **Web** |Yes |
| Url |URL to the Web source |Yes |
| authenticationType |Anonymous. |Yes |
 

#### Example


```json
{
    "name": "web",
    "properties":
    {
        "type": "Web",
        "typeProperties":
        {
            "authenticationType": "Anonymous",
            "url" : "https://en.wikipedia.org/wiki/"
        }
    }
}
```

For more information, see [Web Table connector](data-factory-web-table-connector.md#linked-service-properties) article. 

### Dataset
The typeProperties section for dataset of type **WebTable** has the following properties

| Property | Description | Required |
|:--- |:--- |:--- |
| type |type of the dataset. must be set to **WebTable** |Yes |
| path |A relative URL to the resource that contains the table. |No. When path is not specified, only the URL specified in the linked service definition is used. |
| index |The index of the table in the resource. See [Get index of a table in an HTML page](#get-index-of-a-table-in-an-html-page) section for steps to getting index of a table in an HTML page. |Yes |

#### Example

```json
{
    "name": "WebTableInput",
    "properties": {
        "type": "WebTable",
        "linkedServiceName": "WebLinkedService",
        "typeProperties": {
            "index": 1,
            "path": "AFI's_100_Years...100_Movies"
        },
        "external": true,
        "availability": {
            "frequency": "Hour",
            "interval":  1
        }
    }
}
```

For more information, see [Web Table connector](data-factory-web-table-connector.md#dataset-properties) article. 

### Web Source in Copy Activity
Currently, when the source in copy activity is of type **WebSource**, no additional properties are supported.

#### Example

```json
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2016-06-01T18:00:00",
    "end":"2016-06-01T19:00:00",
    "description":"pipeline with copy activity",
    "activities":[  
      {
        "name": "WebTableToAzureBlob",
        "description": "Copy from a Web table to an Azure blob",
        "type": "Copy",
        "inputs": [
          {
            "name": "WebTableInput"
          }
        ],
        "outputs": [
          {
            "name": "AzureBlobOutput"
          }
        ],
        "typeProperties": {
          "source": {
            "type": "WebSource"
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

For more information, see [Web Table connector](data-factory-web-table-connector.md#copy-activity-properties) article. 

## Computes
Click the link for the compute you are interested in to see the JSON schemas for linked service to link it to a data factory.

| Compute environment | activities |
| --- | --- |
| [On-demand HDInsight cluster](#azure-hdinsight-on-demand-linked-service) or [your own HDInsight cluster](#azure-hdinsight-linked-service) |[DotNet](data-factory-use-custom-activities.md), [Hive](data-factory-hive-activity.md), [Pig](data-factory-pig-activity.md), [MapReduce](data-factory-map-reduce.md), [Hadoop Streaming](data-factory-hadoop-streaming-activity.md) |
| [Azure Batch](#azure-batch-linked-service) |[DotNet](data-factory-use-custom-activities.md) |
| [Azure Machine Learning](#azure-machine-learning-linked-service) |[Machine Learning activities: Batch Execution and Update Resource](data-factory-azure-ml-batch-execution-activity.md) |
| [Azure Data Lake Analytics](#azure-data-lake-analytics-linked-service) |[Data Lake Analytics U-SQL](data-factory-usql-activity.md) |
| [Azure SQL](#azure-sql-linked-service), [Azure SQL Data Warehouse](#azure-sql-data-warehouse-linked-service), [SQL Server](#sql-server-linked-service) |[Stored Procedure](data-factory-stored-proc-activity.md) |

## On-demand Azure HDInsight cluster
The Azure Data Factory service can automatically create a Windows/Linux-based on-demand HDInsight cluster to process data. The cluster is created in the same region as the storage account (linkedServiceName property in the JSON) associated with the cluster.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property should be set to **HDInsightOnDemand**. |Yes |
| clusterSize |Number of worker/data nodes in the cluster. The HDInsight cluster is created with 2 head nodes along with the number of worker nodes you specify for this property. The nodes are of size Standard_D3 that has 4 cores, so a 4 worker node cluster takes 24 cores (4\*4 = 16 cores for worker nodes, plus 2\*4 = 8 cores for head nodes). See [Create Linux-based Hadoop clusters in HDInsight](../hdinsight/hdinsight-hadoop-provision-linux-clusters.md) for details about the Standard_D3 tier. |Yes |
| timetolive |The allowed idle time for the on-demand HDInsight cluster. Specifies how long the on-demand HDInsight cluster stays alive after completion of an activity run if there are no other active jobs in the cluster.<br/><br/>For example, if an activity run takes 6 minutes and timetolive is set to 5 minutes, the cluster stays alive for 5 minutes after the 6 minutes of processing the activity run. If another activity run is executed with the 6 minutes window, it is processed by the same cluster.<br/><br/>Creating an on-demand HDInsight cluster is an expensive operation (could take a while), so use this setting as needed to improve performance of a data factory by reusing an on-demand HDInsight cluster.<br/><br/>If you set timetolive value to 0, the cluster is deleted as soon as the activity run in processed. On the other hand, if you set a high value, the cluster may stay idle unnecessarily resulting in high costs. Therefore, it is important that you set the appropriate value based on your needs.<br/><br/>Multiple pipelines can share the same instance of the on-demand HDInsight cluster if the timetolive property value is appropriately set |Yes |
| version |Version of the HDInsight cluster. The default value is 3.1 for Windows cluster and 3.2 for Linux cluster. |No |
| linkedServiceName |Azure Storage linked service to be used by the on-demand cluster for storing and processing data. <p>Currently, you cannot create an on-demand HDInsight cluster that uses an Azure Data Lake Store as the storage. If you want to store the result data from HDInsight processing in an Azure Data Lake Store, use a Copy Activity to copy the data from the Azure Blob Storage to the Azure Data Lake Store.</p>  | Yes |
| additionalLinkedServiceNames |Specifies additional storage accounts for the HDInsight linked service so that the Data Factory service can register them on your behalf. |No |
| osType |Type of operating system. Allowed values are: Windows (default) and Linux |No |
| hcatalogLinkedServiceName |The name of Azure SQL linked service that point to the HCatalog database. The on-demand HDInsight cluster is created by using the Azure SQL database as the metastore. |No |

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

For more information, see [Compute linked services](data-factory-compute-linked-services.md) article. 

## Existing Azure HDInsight cluster
You can create an Azure HDInsight linked service to register your own HDInsight cluster with Data Factory.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property should be set to **HDInsight**. |Yes |
| clusterUri |The URI of the HDInsight cluster. |Yes |
| username |Specify the name of the user to be used to connect to an existing HDInsight cluster. |Yes |
| password |Specify password for the user account. |Yes |
| linkedServiceName | Name of the Azure Storage linked service that refers to the Azure blob storage used by the HDInsight cluster. <p>Currently, you cannot specify an Azure Data Lake Store linked service for this property. You may access data in the Azure Data Lake Store from Hive/Pig scripts if the HDInsight cluster has access to the Data Lake Store. </p>  |Yes |

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

## Azure Batch
You can create an Azure Batch linked service to register a Batch pool of virtual machines (VMs) to a data factory. You can run .NET custom activities using either Azure Batch or Azure HDInsight.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property should be set to **AzureBatch**. |Yes |
| accountName |Name of the Azure Batch account. |Yes |
| accessKey |Access key for the Azure Batch account. |Yes |
| poolName |Name of the pool of virtual machines. |Yes |
| linkedServiceName |Name of the Azure Storage linked service associated with this Azure Batch linked service. This linked service is used for staging files required to run the activity and storing the activity execution logs. |Yes |


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

## Azure Machine Learning
You create an Azure Machine Learning linked service to register a Machine Learning batch scoring endpoint to a data factory.

### Properties
| Property | Description | Required |
| --- | --- | --- |
| Type |The type property should be set to: **AzureML**. |Yes |
| mlEndpoint |The batch scoring URL. |Yes |
| apiKey |The published workspace model’s API. |Yes |

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

## Azure Data Lake Analytics
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
| sessionId |session id from the OAuth authorization session. Each session id is unique and may only be used once. When you use the Data Factory Editor, this ID is auto-generated . |Yes |


## Azure SQL Database
You create an Azure SQL linked service and use it with the [Stored Procedure Activity](data-factory-stored-proc-activity.md) to invoke a stored procedure from a Data Factory pipeline. See [Azure SQL Connector](data-factory-azure-sql-connector.md#linked-service-properties) article for details about this linked service.

## Azure SQL Data Warehouse
You create an Azure SQL Data Warehouse linked service and use it with the [Stored Procedure Activity](data-factory-stored-proc-activity.md) to invoke a stored procedure from a Data Factory pipeline. See [Azure SQL Data Warehouse Connector](data-factory-azure-sql-data-warehouse-connector.md#linked-service-properties) article for details about this linked service.

## SQL Server 
You create a SQL Server linked service and use it with the [Stored Procedure Activity](data-factory-stored-proc-activity.md) to invoke a stored procedure from a Data Factory pipeline. See [SQL Server connector](data-factory-sqlserver-connector.md#linked-service-properties) article for details about this linked service.

     

