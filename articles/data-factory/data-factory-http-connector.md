---
title: Move data from an HTTP source - Azure | Microsoft Docs
description: Learn about how to move data from an on-premises or a cloud HTTP source using Azure Data Factory.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: monicar

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/30/2017
ms.author: jingwang

---
# Move data from an HTTP source using Azure Data Factory
This article outlines how to use the Copy Activity in Azure Data Factory to move data from an on-premises/cloud HTTP endpoint to a supported sink data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article that presents a general overview of data movement with copy activity and the list of data stores supported as sources/sinks.

Data factory currently supports only moving data from an HTTP source to other data stores, but not moving data from other data stores to an HTTP destination.

## Supported scenarios and authentication types
You can use this HTTP connector to retrieve data from **both cloud and on-premises HTTP/s endpoint** by using HTTP **GET** or **POST** method. The following authentication types are supported: **Anonymous**, **Basic**, **Digest**, **Windows**, and **ClientCertificate**. Note the difference between this connector and the [Web table connector](data-factory-web-table-connector.md) is: the latter is used to extract table content from web HTML page.

When copying data from an on-premises HTTP endpoint, you need install a Data Management Gateway in the on-premises environment/Azure VM. See [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article to learn about Data Management Gateway and step-by-step instructions on setting up the gateway.

## Getting started
You can create a pipeline with a copy activity that moves data from an HTTP source by using different tools/APIs.

- The easiest way to create a pipeline is to use the **Copy Wizard**. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.

- You can also use the following tools to create a pipeline: **Azure portal**, **Visual Studio**, **Azure PowerShell**, **Azure Resource Manager template**, **.NET API**, and **REST API**. See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity. For JSON samples to copy data from HTTP source to Azure Blob Storage, see [JSON examples](#json-examples) section of this articles.

## Linked service properties
The following table provides description for JSON elements specific to HTTP linked service.

| Property | Description | Required |
| --- | --- | --- |
| type | The type property must be set to: `Http`. | Yes |
| url | Base URL to the Web Server | Yes |
| authenticationType | Specifies the authentication type. Allowed values are: **Anonymous**, **Basic**, **Digest**, **Windows**, **ClientCertificate**. <br><br> Refer to sections below this table on more properties and JSON samples for those authentication types respectively. | Yes |
| enableServerCertificateValidation | Specify whether to enable server SSL certificate validation if source is HTTPS Web Server | No, default is true |
| gatewayName | Name of the Data Management Gateway to connect to an on-premises HTTP source. | Yes if copying data from an on-premises HTTP source. |
| encryptedCredential | Encrypted credential to access the HTTP endpoint. Auto-generated when you configure the authentication information in copy wizard or the ClickOnce popup dialog. | No. Apply only when copying data from an on-premises HTTP server. |

See [Move data between on-premises sources and the cloud with Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md) for details about setting credentials for on-premises HTTP connector data source.

### Using Basic, Digest, or Windows authentication

Set `authenticationType` as `Basic`, `Digest`, or `Windows`, and specify the following properties besides the HTTP connector generic ones introduced above:

| Property | Description | Required |
| --- | --- | --- |
| username | Username to access the HTTP endpoint. | Yes |
| password | Password for the user (username). | Yes |

#### Example: using Basic, Digest, or Windows authentication

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

### Using ClientCertificate authentication

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

#### Example: using client certificate
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

## Dataset properties
For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc.).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **Http** has the following properties

| Property | Description | Required |
|:--- |:--- |:--- |
| type | Specified the type of the dataset. must be set to `Http`. | Yes |
| relativeUrl | A relative URL to the resource that contains the data. When path is not specified, only the URL specified in the linked service definition is used. <br><br> To construct dynamic URL, you can use [Data Factory functions and system variables](data-factory-functions-variables.md), e.g. "relativeUrl": "$$Text.Format('/my/report?month={0:yyyy}-{0:MM}&fmt=csv', SliceStart)". | No |
| requestMethod | Http method. Allowed values are **GET** or **POST**. | No. Default is `GET`. |
| additionalHeaders | Additional HTTP request headers. | No |
| requestBody | Body for HTTP request. | No |
| format | If you want to simply **retrieve the data from HTTP endpoint as-is** without parsing it, skip this format settings. <br><br> If you want to parse the HTTP response content during copy, the following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. For more information, see [Text Format](data-factory-supported-file-and-compression-formats.md#text-format), [Json Format](data-factory-supported-file-and-compression-formats.md#json-format), [Avro Format](data-factory-supported-file-and-compression-formats.md#avro-format), [Orc Format](data-factory-supported-file-and-compression-formats.md#orc-format), and [Parquet Format](data-factory-supported-file-and-compression-formats.md#parquet-format) sections. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**. Supported levels are: **Optimal** and **Fastest**. For more information, see [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md#compression-support). |No |

### Example: using the GET (default) method

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

### Example: using the POST method

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

## Copy activity properties
For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties such as name, description, input and output tables, and policy are available for all types of activities.

Properties available in the **typeProperties** section of the activity on the other hand vary with each activity type. For Copy activity, they vary depending on the types of sources and sinks.

Currently, when the source in copy activity is of type **HttpSource**, the following properties are supported.

| Property | Description | Required |
| -------- | ----------- | -------- |
| httpRequestTimeout | The timeout (TimeSpan) for the HTTP request to get a response. It is the timeout to get a response, not the timeout to read response data. | No. Default value: 00:01:40 |

## Supported file and compression formats
See [File and compression formats in Azure Data Factory](data-factory-supported-file-and-compression-formats.md) article on details.

## JSON examples
The following example provide sample JSON definitions that you can use to create a pipeline by using [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md) or [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data from HTTP source to Azure Blob Storage. However, data can be copied **directly** from any of sources to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores-and-formats) using the Copy Activity in Azure Data Factory.

### Example: Copy data from HTTP source to Azure Blob Storage
The Data Factory solution for this sample contains the following Data Factory entities:

1. A linked service of type [HTTP](#linked-service-properties).
2. A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties).
3. An input [dataset](data-factory-create-datasets.md) of type [Http](#dataset-properties).
4. An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties).
5. A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [HttpSource](#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties).

The sample copies data from an HTTP source to an Azure blob every hour. The JSON properties used in these samples are described in sections following the samples.

### HTTP linked service
This example uses the HTTP linked service with anonymous authentication. See [HTTP linked service](#linked-service-properties) section for different types of authentication you can use.

```JSON
{
    "name": "HttpLinkedService",
    "properties":
    {
        "type": "Http",
        "typeProperties":
        {
            "authenticationType": "Anonymous",
            "url" : "https://en.wikipedia.org/wiki/"
        }
    }
}
```

### Azure Storage linked service

```JSON
{
  "name": "AzureStorageLinkedService",
  "properties": {
    "type": "AzureStorage",
    "typeProperties": {
      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
    }
  }
}
```

### HTTP input dataset
Setting **external** to **true** informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory.

```JSON
{
	"name": "HttpSourceDataInput",
    "properties": {
		"type": "Http",
        "linkedServiceName": "HttpLinkedService",
        "typeProperties": {
            "relativeUrl": "$$Text.Format('/my/report?month={0:yyyy}-{0:MM}&fmt=csv', SliceStart)",
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

### Azure Blob output dataset

Data is written to a new blob every hour (frequency: hour, interval: 1).

```JSON
{
    "name": "AzureBlobOutput",
    "properties":
    {
        "type": "AzureBlob",
        "linkedServiceName": "AzureStorageLinkedService",
        "typeProperties":
        {
            "folderPath": "adfgetstarted/Movies"
        },
        "availability":
        {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```

### Pipeline with Copy activity

The pipeline contains a Copy Activity that is configured to use the input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **HttpSource** and **sink** type is set to **BlobSink**.

See [HttpSource](#httpsource-in-copy-activity) for the list of properties supported by the HttpSource.

```JSON
{  
    "name":"SamplePipeline",
    "properties":{  
    "start":"2014-06-01T18:00:00",
    "end":"2014-06-01T19:00:00",
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

> [!NOTE]
> To map columns from source dataset to columns from sink dataset, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).

## Performance and Tuning
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
