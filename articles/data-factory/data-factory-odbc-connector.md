<properties 
	pageTitle="Move data from ODBC data stores | Azure Data Factory" 
	description="Learn about how to move data from ODBC data stores using Azure Data Factory." 
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
	ms.date="06/27/2016" 
	ms.author="spelluru"/>

# Move data From ODBC data stores using Azure Data Factory
This article outlines how you can use the Copy Activity in an Azure data factory to move data from an on-premises ODBC data store to another data store. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article which presents a general overview of data movement with copy activity and supported data store combinations.

Data factory currently supports only moving data from an on-premises ODBC data store to other data stores, but not for moving data from other data stores to an on-premises ODBC data store.


## Enabling connectivity
Data Factory service supports connecting to on-premises ODBC sources using the Data Management Gateway. See [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article to learn about Data Management Gateway and step-by-step instructions on setting up the gateway. You need to leverage the gateway to connect to an ODBC data store even if it is hosted in an Azure IaaS VM. 

While you can install the gateway on the same on-premises machine or the Azure VM as the ODBC data store, we recommend that you install the gateway on a separate machine or a separate Azure IaaS VM to avoid resource contention and for better performance. When you install the gateway on a separate machine, the machine should be able to access the machine with the ODBC data store. 

Apart from the Data Management Gateway, you also need to install the ODBC driver for the data store on the gateway machine. 

> [AZURE.NOTE] See [Gateway Troubleshooting](data-factory-move-data-between-onprem-and-cloud.md#gateway-troubleshooting) for tips on troubleshooting connection/gateway related issues. 

## Sample: Copy data from ODBC data store to Azure Blob

This sample shows how to copy data from an ODBC data store to Azure Blob Storage. However, data can be copied **directly** to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores) using the Copy Activity in Azure Data Factory.  
 
The sample has the following data factory entities:

1.	A linked service of type [OnPremisesOdbc](#odbc-linked-service-properties).
2.	A linked service of type [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service-properties).
3.	An input [dataset](data-factory-create-datasets.md) of type [RelationalTable](#odbc-dataset-type-properties).
4.	An output [dataset](data-factory-create-datasets.md) of type [AzureBlob](data-factory-azure-blob-connector.md#azure-blob-dataset-type-properties).
4.	A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [RelationalSource](#odbc-copy-activity-type-properties) and [BlobSink](data-factory-azure-blob-connector.md#azure-blob-copy-activity-type-properties).

The sample copies data from a query result in an ODBC data store to a blob every hour. The JSON properties used in these samples are described in sections following the samples. 

As a first step, please setup the data management gateway as per the instructions in the [moving data between on-premises locations and cloud](data-factory-move-data-between-onprem-and-cloud.md) article. 

**ODBC linked service**
This example uses the Basic authentication. See [ODBC linked service](#odbc-linked-service-properties) section for different types of authentication you can use. 

	{
	    "name": "OnPremOdbcLinkedService",
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

**ODBC input dataset**

The sample assumes you have created a table “MyTable” in an ODBC database and it contains a column called “timestampcolumn” for time series data.

Setting “external”: ”true” and specifying externalData policy informs the Data Factory service that the table is external to the data factory and not produced by an activity in the data factory.
	
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



**Azure Blob output dataset**

Data is written to a new blob every hour (frequency: hour, interval: 1). The folder path for the blob is dynamically evaluated based on the start time of the slice that is being processed. The folder path uses year, month, day, and hours parts of the start time.

	{
	    "name": "AzureBlobOdbcDataSet",
	    "properties": {
	        "type": "AzureBlob",
	        "linkedServiceName": "AzureStorageLinkedService",
	        "typeProperties": {
	            "folderPath": "mycontainer/odbc/yearno={Year}/monthno={Month}/dayno={Day}/hourno={Hour}",
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
	                        "format": "%M"
	                    }
	                },
	                {
	                    "name": "Day",
	                    "value": {
	                        "type": "DateTime",
	                        "date": "SliceStart",
	                        "format": "%d"
	                    }
	                },
	                {
	                    "name": "Hour",
	                    "value": {
	                        "type": "DateTime",
	                        "date": "SliceStart",
	                        "format": "%H"
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

The pipeline contains a Copy Activity that is configured to use the above input and output datasets and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **RelationalSource** and **sink** type is set to **BlobSink**. The SQL query specified for the **query** property selects the data in the past hour to copy.
	
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
	        "start": "2014-06-01T18:00:00Z",
	        "end": "2014-06-01T19:00:00Z"
	    }
	}



## ODBC Linked Service properties

The following table provides description for JSON elements specific to ODBC linked service.

| Property | Description | Required |
| -------- | ----------- | -------- | 
| type | The type property must be set to: **OnPremisesOdbc** | Yes |
| connectionString | The non-access credential portion of the connection string as well as an optional encrypted credential. See examples below. | Yes
| credential | The access credential portion of the connection string specified in driver-specific property-value format, e.g. “Uid=<user ID>;Pwd=<password>;RefreshToken=<secret refresh token>;”. | No
| authenticationType | Type of authentication used to connect to the ODBC data store. Possible values are: Anonymous and Basic. | Yes | 
| username | Specify user name if you are using Basic authentication. | No | 
| password | Specify password for the user account you specified for the username. | No | 
| gatewayName | Name of the gateway that the Data Factory service should use to connect to the ODBC data store. | Yes |


See [Setting Credentials and Security](data-factory-move-data-between-onprem-and-cloud.md#set-credentials-and-security) for details about setting credentials for an on-premises ODBC data store.

### Using Basic authentication

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

### Using Basic authentication with encrypted credentials
You can encrypt the credentials using the [New-AzureRMDataFactoryEncryptValue](https://msdn.microsoft.com/library/mt603802.aspx) (1.0 version of Azure PowerShell) cmdlet or [New-AzureDataFactoryEncryptValue](https://msdn.microsoft.com/library/dn834940.aspx) ( 0.9 or earlier version of the Azure PowerShell).  

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


### Using Anonymous authentication

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



## ODBC Dataset type properties

For a full list of sections & properties available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections like structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, etc...).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for dataset of type **RelationalTable** (which includes ODBC dataset) has the following properties

| Property | Description | Required |
| -------- | ----------- | -------- |
| tableName | Name of the table in the ODBC data store that linked service refers to. | Yes | 

## ODBC Copy Activity type properties

For a full list of sections & properties available for defining activities, see the [Creating Pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, various policies etc. are available for all types of activities. 

Properties available in the typeProperties section of the activity on the other hand vary with each activity type and in case of Copy activity they vary depending on the types of sources and sinks.

In case of Copy Activity when source is of type **RelationalSource** (which includes ODBC) the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| -------- | ----------- | -------------- | -------- |
| query | Use the custom query to read data. | SQL query string. For example: select * from MyTable. | Yes | 

[AZURE.INCLUDE [data-factory-structure-for-rectangualr-datasets](../../includes/data-factory-structure-for-rectangualr-datasets.md)]

### Type mapping for ODBC

As mentioned in the [data movement activities](data-factory-data-movement-activities.md) article, Copy activity performs automatic type conversions from source types to sink types with the following 2 step approach:

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

When moving data from ODBC data stores, ODBC data types are mapped to .NET types as mentioned in the [ODBC Data Type Mappings](https://msdn.microsoft.com/library/cc668763.aspx) topic.


[AZURE.INCLUDE [data-factory-column-mapping](../../includes/data-factory-column-mapping.md)]

[AZURE.INCLUDE [data-factory-type-repeatability-for-relational-sources](../../includes/data-factory-type-repeatability-for-relational-sources.md)]

## GE Historian store
You create an ODBC linked service to link a [GE Proficy Historian (now GE Historian)](http://www.geautomation.com/products/proficy-historian) data store to an Azure data factory as shown in the following example: 

	{
	    "name": "HistorianLinkedService",
	    "properties":
	    {
	        "type": "OnPremisesOdbc",
	        "typeProperties":
	        {
			    "connectionString": "DSN=<name of the GE Historian store>",
			    "gatewayName": "<gateway name>",
			    "authenticationType": "Basic",
			    "userName": "<user name>",
			    "password": "<password>"
	        }
	    }
	}

You must install Data Management Gateway on an on-premises machine and register the gateway with the portal. The gateway installed on your on-premises computer uses the ODBC driver for GE Historian to connect to the GE Historian data store, so please install the driver if it is not already installed on the gateway machine. See [Enabling connectivity](#enabling-connectivity) section for details.

Before you use the GE Historian store in a Data Factory solution, verify whether the gateway can connect to the data store using instructions in the next section. 

Read the article from the beginning for a detailed overview of using ODBC data stores as source data stores in a copy operation.  

## Troubleshoot connectivity issues
Use the **Diagnostics** tab of **Data Management Gateway Configuration Manager** to troubleshoot connection issues. 

1. Launch **Data Management Gateway Configuration Manager**. You can either run "C:\Program Files\Microsoft Data Management Gateway\1.0\Shared\ConfigManager.exe" directly (or) search for **Gateway** to find a link to **Microsoft Data Management Gateway** application as shown in the following image. 

	![Search gateway](./media/data-factory-odbc-connector/search-gateway.png)
2. Switch to the **Diagnostics** tab.

	![Gateway diagnostics](./media/data-factory-odbc-connector/data-factory-gateway-diagnostics.png) 
3. Select the **type** of data store (linked service). 
4. Specify **authentication** and enter **credentials** (or) enter **connection string** to connect to the data store. 
5. Click **Test connection** to test the connection to the data store. 

## Performance and Tuning  
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.

