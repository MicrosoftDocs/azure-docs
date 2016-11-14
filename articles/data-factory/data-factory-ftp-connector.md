---
title: Move data from FTP server | Microsoft Docs
description: Learn about how to move data from an FTP server using Azure Data Factory.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.assetid: eea3bab0-a6e4-4045-ad44-9ce06229c718
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/20/2016
ms.author: spelluru

---
# Move data from an FTP server using Azure Data Factory
This article outlines how to use the Copy Activity in Azure Data Factory to move data from an FTP server to a supported sink data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article that presents a general overview of data movement with copy activity and the list of data stores supported as sources/sinks.

Data factory currently supports only moving data from an FTP server to other data stores, but not for moving data from other data stores to an FTP server. It supports both on-premises and cloud FTP servers.

If you are moving data from an **on-premises** FTP server to a cloud data store (example: Azure Blob Storage), install and use Data Management Gateway. The Data Management Gateway is a client agent that is installed on your on-premises machine, which allows cloud services to connect to on-premises resource. See [Data Management Gateway](data-factory-data-management-gateway.md) for details on the gateway. See [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article for step-by-step instructions on setting up the gateway and using it. You use the gateway to connect to an FTP server even if the server is on an Azure IaaS virtual machine (VM).

You can install the gateway on the same on-premises machine or the Azure IaaS VM as the FTP server. However, we recommend that you install the gateway on a separate machine or a separate Azure IaaS VM to avoid resource contention and for better performance. When you install the gateway on a separate machine, the machine should be able to access the FTP server.

## Copy data wizard
The easiest way to create a pipeline that copies data from an FTP server is to use the Copy data wizard. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.

The following examples provide sample JSON definitions that you can use to create a pipeline by using [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md) or [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md).

## Sample: Copy data from FTP server to Azure blob
This sample shows how to copy data from an FTP server to an Azure Blob Storage. However, data can be copied **directly** to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores-and-formats) using the Copy Activity in Azure Data Factory.  

The sample has the following data factory entities:

* A linked service of type [FtpServer](#ftp-linked-service-properties).
* A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service).
* An input [dataset](data-factory-create-datasets.md) of type [FileShare](#fileshare-dataset-type-properties).
* An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
* A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [FileSystemSource](#ftp-copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties).

The sample copies data from an FTP server to an Azure blob every hour. The JSON properties used in these samples are described in sections following the samples.

**FTP linked service**
This example uses the basic authentication with user name and password in plain text. You can also use one of the following ways:

* Anonymous authentication
* Basic authentication with encrypted credentials
* FTP over SSL/TLS (FTPS)

See [FTP linked service](#ftp-linked-service-properties) section for different types of authentication you can use.

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

**Azure Storage linked service**

    {
      "name": "AzureStorageLinkedService",
      "properties": {
        "type": "AzureStorage",
        "typeProperties": {
          "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
        }
      }
    }

**FTP input dataset**
This dataset refers to the FTP folder `mysharedfolder` and file `test.csv`. The pipeline copies the file to the destination.

Setting "external": "true" informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory.

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


**Azure Blob output dataset**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

    {
        "name": "AzureBlobOutput",
        "properties": {
            "type": "AzureBlob",
            "linkedServiceName": "AzureStorageLinkedService",
            "typeProperties": {
                "folderPath": "mycontainer/ftp/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
                "format": {
                    "type": "TextFormat",
                    "rowDelimiter": "\n",
                    "columnDelimiter": "\t"
                },
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
            "availability": {
                "frequency": "Hour",
                "interval": 1
            }
        }
    }



**Pipeline with Copy activity**

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **FileSystemSource** and **sink** type is set to **BlobSink**.

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
            "start": "2016-08-24T18:00:00Z",
            "end": "2016-08-24T19:00:00Z"
        }
    }

## FTP Linked Service properties
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

### Using Anonymous authentication
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

### Using username and password in plain text for basic authentication
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


### Using port, enableSsl, enableServerCertificateValidation
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

### Using encryptedCredential for authentication and gateway
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

See [Move data between on-premises sources and the cloud with Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md) for details about setting credentials for an on-premises FTP data source.

[!INCLUDE [data-factory-file-share-dataset](../../includes/data-factory-file-share-dataset.md)]

[!INCLUDE [data-factory-file-format](../../includes/data-factory-file-format.md)]

[!INCLUDE [data-factory-compression](../../includes/data-factory-compression.md)]

## FTP Copy Activity type properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and policies are available for all types of activities.

Properties available in the typeProperties section of the activity on the other hand vary with each activity type. For Copy activity, the type properties vary depending on the types of sources and sinks.

[!INCLUDE [data-factory-file-system-source](../../includes/data-factory-file-system-source.md)]

[!INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]

[!INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

## Performance and Tuning
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.

## Next Steps
See the following articles:

* [Copy Activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions for creating a pipeline with a Copy Activity.
