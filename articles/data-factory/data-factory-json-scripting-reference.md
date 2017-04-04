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
| &nbsp; |[Azure Search Index](#azure-search) |
| &nbsp; |[Azure Table storage](data-factory-azure-table-connector.md#linked-service-properties) |
| **Databases** |[Amazon Redshift](data-factory-amazon-redshift-connector.md#linked-service-properties) |
| &nbsp; |[DB2](data-factory-onprem-db2-connector.md#linked-service-properties) |
| &nbsp; |[MySQL](data-factory-onprem-mysql-connector.md#linked-service-properties) |
| &nbsp; |[Oracle](data-factory-onprem-oracle-connector.md#linked-service-properties) |
| &nbsp; |[PostgreSQL](data-factory-onprem-postgresql-connector.md#linked-service-properties) |
| &nbsp; |[SAP Business Warehouse](data-factory-sap-business-warehouse-connector.md#linked-service-properties) |
| &nbsp; |[SAP HANA](data-factory-sap-hana-connector.md#linked-service-properties) |
| &nbsp; |[SQL Server](data-factory-sqlserver-connector.md#linked-service-properties) |
| &nbsp; |[Sybase](data-factory-onprem-sybase-connector.md#linked-service-properties) |
| &nbsp; |[Teradata](data-factory-onprem-teradata-connector.md#linked-service-properties) |
| **NoSQL** |[Cassandra](data-factory-onprem-cassandra-connector.md#linked-service-properties) |
| &nbsp; |[MongoDB](data-factory-on-premises-mongodb-connector.md#linked-service-properties) |
| **File** |[Amazon S3](data-factory-amazon-simple-storage-service-connector.md#linked-service-properties) |
| &nbsp; |[File System](data-factory-onprem-file-system-connector.md#linked-service-properties) |
| &nbsp; |[FTP](data-factory-ftp-connector.md#linked-service-properties) |
| &nbsp; |[HDFS](data-factory-hdfs-connector.md#linked-service-properties) |
| &nbsp; |[SFTP](data-factory-sftp-connector.md#linked-service-properties) |
| **Others** |[Generic HTTP](data-factory-http-connector.md#linked-service-properties) |
| &nbsp; |[Generic OData](data-factory-odata-connector.md#linked-service-properties) |
| &nbsp; |[Generic ODBC](data-factory-odbc-connector.md#linked-service-properties) |
| &nbsp; |[Salesforce](data-factory-salesforce-connector.md#linked-service-properties) |
| &nbsp; |[Web Table (table from HTML)](data-factory-web-table-connector.md#linked-service-properties) |

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
| partitionedBy |partitionedBy is an optional property. You can use it to specify a dynamic folderPath and filename for time series data. For example, folderPath can be parameterized for every hour of data. See the [Using partitionedBy property section](#using-partitionedBy-property) for details and examples. |No |
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
    "start":"2014-06-01T18:00:00",
    "end":"2014-06-01T19:00:00",
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
        "start":"2014-06-01T18:00:00",
        "end":"2014-06-01T19:00:00",
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
            "tenant": "<tenant info, e.g. microsoft.onmicrosoft.com>"
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
| partitionedBy |partitionedBy is an optional property. You can use it to specify a dynamic folderPath and filename for time series data. For example, folderPath can be parameterized for every hour of data. See the [Using partitionedBy property](#using-partitionedby-property) section for details and examples. |No |
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
    "start": "2015-04-01T00:00:00Z",
    "end": "2015-04-02T00:00:00Z"
  }
}
```

### DocumentDB Collection Sink in Copy Activity
**DocumentDbCollectionSink** supports the following properties:

| **Property** | **Description** | **Allowed values** | **Required** |
| --- | --- | --- | --- |
| nestingSeparator |A special character in the source column name to indicate that nested document is needed. <br/><br/>For example above: `Name.First` in the output table produces the following JSON structure in the DocumentDB document:<br/><br/>"Name": {<br/>    "First": "John"<br/>}, |Character that is used to separate nesting levels.<br/><br/>Default value is `.` (dot). |Character that is used to separate nesting levels. <br/><br/>Default value is `.` (dot). |
| writeBatchSize |Number of parallel requests to DocumentDB service to create documents.<br/><br/>You can fine-tune the performance when copying data to/from DocumentDB by using this property. You can expect a better performance when you increase writeBatchSize because more parallel requests to DocumentDB are sent. However you’ll need to avoid throttling that can throw the error message: "Request rate is large".<br/><br/>Throttling is decided by a number of factors, including size of documents, number of terms in documents, indexing policy of target collection, etc. For copy operations, you can use a better collection (e.g. S3) to have the most throughput available (2,500 request units/second). |Integer |No (default: 5) |
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
    "start": "2015-04-14T00:00:00Z",
    "end": "2015-04-15T00:00:00Z"
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
    "start":"2014-06-01T18:00:00",
    "end":"2014-06-01T19:00:00",
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
| sqlWriterCleanupScript |Specify a query for Copy Activity to execute such that data of a specific slice is cleaned up. For more information, see [repeatability section](#repeatability-during-copy). |A query statement. |No |
| sliceIdentifierColumnName |Specify a column name for Copy Activity to fill with auto generated slice identifier, which is used to clean up data of a specific slice when rerun. For more information, see [repeatability section](#repeatability-during-copy). |Column name of a column with data type of binary(32). |No |
| sqlWriterStoredProcedureName |Name of the stored procedure that upserts (updates/inserts) data into the target table. |Name of the stored procedure. |No |
| storedProcedureParameters |Parameters for the stored procedure. |Name/value pairs. Names and casing of parameters must match the names and casing of the stored procedure parameters. |No |
| sqlWriterTableType |Specify a table type name to be used in the stored procedure. Copy activity makes the data being moved available in a temp table with this table type. Stored procedure code can then merge the data being copied with existing data. |A table type name. |No |

#### Example

```json
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2014-06-01T18:00:00",
    "end":"2014-06-01T19:00:00",
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
    "start":"2014-06-01T18:00:00",
    "end":"2014-06-01T19:00:00",
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
| sqlWriterCleanupScript |Specify a query for Copy Activity to execute such that data of a specific slice is cleaned up. For details, see [repeatability section](#repeatability-during-copy). |A query statement. |No |
| allowPolyBase |Indicates whether to use PolyBase (when applicable) instead of BULKINSERT mechanism. <br/><br/> **Using PolyBase is the recommended way to load data into SQL Data Warehouse.** See [Use PolyBase to load data into Azure SQL Data Warehouse](#use-polybase-to-load-data-into-azure-sql-data-warehouse) section for constraints and details. |True <br/>False (default) |No |
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
    "start":"2014-06-01T18:00:00",
    "end":"2014-06-01T19:00:00",
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
| WriteBehavior | Specifies whether to merge or replace when a document already exists in the index. See the [WriteBehavior property](#writebehavior-property).| Merge (default)<br/>Upload| No |
| WriteBatchSize | Uploads data into the Azure Search index when the buffer size reaches writeBatchSize. See the [WriteBatchSize property](#writebatchsize-property) for details. | 1 to 1,000. Default value is 1000. | No |

#### Example

```json
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2014-06-01T18:00:00",
    "end":"2014-06-01T19:00:00",
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
        "start":"2014-06-01T18:00:00",
        "end":"2014-06-01T19:00:00",
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
    "start":"2014-06-01T18:00:00",
    "end":"2014-06-01T19:00:00",
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

## Computes
Click the link for the compute you are interested in to see the JSON schemas for linked service to link it to a data factory.

| Compute environment | activities |
| --- | --- |
| [On-demand HDInsight cluster](#azure-hdinsight-on-demand-linked-service) or [your own HDInsight cluster](#azure-hdinsight-linked-service) |[DotNet](data-factory-use-custom-activities.md), [Hive](data-factory-hive-activity.md), [Pig](data-factory-pig-activity.md), [MapReduce](data-factory-map-reduce.md), [Hadoop Streaming](data-factory-hadoop-streaming-activity.md) |
| [Azure Batch](#azure-batch-linked-service) |[DotNet](data-factory-use-custom-activities.md) |
| [Azure Machine Learning](#azure-machine-learning-linked-service) |[Machine Learning activities: Batch Execution and Update Resource](data-factory-azure-ml-batch-execution-activity.md) |
| [Azure Data Lake Analytics](#azure-data-lake-analytics-linked-service) |[Data Lake Analytics U-SQL](data-factory-usql-activity.md) |
| [Azure SQL](#azure-sql-linked-service), [Azure SQL Data Warehouse](#azure-sql-data-warehouse-linked-service), [SQL Server](#sql-server-linked-service) |[Stored Procedure](data-factory-stored-proc-activity.md) |
