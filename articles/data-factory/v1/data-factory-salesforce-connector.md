---
title: Move data from Salesforce by using Data Factory 
description: Learn about how to move data from Salesforce by using Azure Data Factory.
author: jianleishen
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: jianleishen
robots: noindex
---
# Move data from Salesforce by using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-salesforce-connector.md)
> * [Version 2 (current version)](../connector-salesforce.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [Salesforce connector in V2](../connector-salesforce.md).

This article outlines how you can use Copy Activity in an Azure data factory to copy data from Salesforce to any data store that is listed under the Sink column in the [supported sources and sinks](data-factory-data-movement-activities.md#supported-data-stores-and-formats) table. This article builds on the [data movement activities](data-factory-data-movement-activities.md) article, which presents a general overview of data movement with Copy Activity and supported data store combinations.

Azure Data Factory currently supports only moving data from Salesforce to [supported sink data stores](data-factory-data-movement-activities.md#supported-data-stores-and-formats), but does not support moving data from other data stores to Salesforce.

## Supported versions
This connector supports the following editions of Salesforce: Developer Edition, Professional Edition, Enterprise Edition, or Unlimited Edition. And it supports copying from Salesforce production, sandbox and custom domain.

## Prerequisites
* API permission must be enabled. 
* To copy data from Salesforce to on-premises data stores, you must have at least Data Management Gateway 2.0 installed in your on-premises environment.

## Salesforce request limits
Salesforce has limits for both total API requests and concurrent API requests. Note the following points:

- If the number of concurrent requests exceeds the limit, throttling occurs and you will see random failures.
- If the total number of requests exceeds the limit, the Salesforce account will be blocked for 24 hours.

You might also receive the "REQUEST_LIMIT_EXCEEDED" error in both scenarios. See the "API Request Limits" section in the [Salesforce Developer Limits](https://resources.docs.salesforce.com/200/20/en-us/sfdc/pdf/salesforce_app_limits_cheatsheet.pdf) article for details.

## Getting started
You can create a pipeline with a copy activity that moves data from Salesforce by using different tools/APIs.

The easiest way to create a pipeline is to use the **Copy Wizard**. See [Tutorial: Create a pipeline using Copy Wizard](data-factory-copy-data-wizard-tutorial.md) for a quick walkthrough on creating a pipeline using the Copy data wizard.

You can also use the following tools to create a pipeline: **Visual Studio**, **Azure PowerShell**, **Azure Resource Manager template**, **.NET API**, and **REST API**. See [Copy activity tutorial](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for step-by-step instructions to create a pipeline with a copy activity.

Whether you use the tools or APIs, you perform the following steps to create a pipeline that moves data from a source data store to a sink data store:

1. Create **linked services** to link input and output data stores to your data factory.
2. Create **datasets** to represent input and output data for the copy operation.
3. Create a **pipeline** with a copy activity that takes a dataset as an input and a dataset as an output.

When you use the wizard, JSON definitions for these Data Factory entities (linked services, datasets, and the pipeline) are automatically created for you. When you use tools/APIs (except .NET API), you define these Data Factory entities by using the JSON format. For a sample with JSON definitions for Data Factory entities that are used to copy data from Salesforce, see [JSON example: Copy data from Salesforce to Azure Blob](#json-example-copy-data-from-salesforce-to-azure-blob) section of this article.

The following sections provide details about JSON properties that are used to define Data Factory entities specific to Salesforce:

## Linked service properties
The following table provides descriptions for JSON elements that are specific to the Salesforce linked service.

| Property | Description | Required |
| --- | --- | --- |
| type |The type property must be set to: **Salesforce**. |Yes |
| environmentUrl | Specify the URL of Salesforce instance. <br><br> - Default is "https:\//login.salesforce.com". <br> - To copy data from sandbox, specify "https://test.salesforce.com". <br> - To copy data from custom domain, specify, for example, "https://[domain].my.salesforce.com". |No |
| username |Specify a user name for the user account. |Yes |
| password |Specify a password for the user account. |Yes |
| securityToken |Specify a security token for the user account. See [Get security token](https://help.salesforce.com/apex/HTViewHelpDoc?id=user_security_token.htm) for instructions on how to reset/get a security token. To learn about security tokens in general, see [Security and the API](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_concepts_security.htm). |Yes |

## Dataset properties
For a full list of sections and properties that are available for defining datasets, see the [Creating datasets](data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types (Azure SQL, Azure blob, Azure table, and so on).

The **typeProperties** section is different for each type of dataset and provides information about the location of the data in the data store. The typeProperties section for a dataset of the type **RelationalTable** has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| tableName |Name of the table in Salesforce. |No (if a **query** of **RelationalSource** is specified) |

> [!IMPORTANT]
> The "__c" part of the API Name is needed for any custom object.

:::image type="content" source="media/data-factory-salesforce-connector/data-factory-salesforce-api-name.png" alt-text="Screenshot shows the Custom Object Definition Detail where you can see the A P I names of the custom objects.":::

## Copy activity properties
For a full list of sections and properties that are available for defining activities, see the [Creating pipelines](data-factory-create-pipelines.md) article. Properties like name, description, input and output tables, and various policies are available for all types of activities.

The properties that are available in the typeProperties section of the activity, on the other hand, vary with each activity type. For Copy Activity, they vary depending on the types of sources and sinks.

In copy activity, when the source is of the type **RelationalSource** (which includes Salesforce), the following properties are available in typeProperties section:

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| query |Use the custom query to read data. |A SQL-92 query or [Salesforce Object Query Language (SOQL)](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm) query. For example: `select * from MyTable__c`. |No (if the **tableName** of the **dataset** is specified) |

> [!IMPORTANT]
> The "__c" part of the API Name is needed for any custom object.

:::image type="content" source="media/data-factory-salesforce-connector/data-factory-salesforce-api-name-2.png" alt-text="Screenshot shows the Custom Fields & Relationships where you can see the A P I names of the custom objects.":::

## Query tips
### Retrieving data using where clause on DateTime column
When specify the SOQL or SQL query, pay attention to the DateTime format difference. For example:

* **SOQL sample**: `$$Text.Format('SELECT Id, Name, BillingCity FROM Account WHERE LastModifiedDate >= {0:yyyy-MM-ddTHH:mm:ssZ} AND LastModifiedDate < {1:yyyy-MM-ddTHH:mm:ssZ}', WindowStart, WindowEnd)`
* **SQL sample**:
    * **Using copy wizard to specify the query:** `$$Text.Format('SELECT * FROM Account WHERE LastModifiedDate >= {{ts\'{0:yyyy-MM-dd HH:mm:ss}\'}} AND LastModifiedDate < {{ts\'{1:yyyy-MM-dd HH:mm:ss}\'}}', WindowStart, WindowEnd)`
    * **Using JSON editing to specify the query (escape char properly):** `$$Text.Format('SELECT * FROM Account WHERE LastModifiedDate >= {{ts\\'{0:yyyy-MM-dd HH:mm:ss}\\'}} AND LastModifiedDate < {{ts\\'{1:yyyy-MM-dd HH:mm:ss}\\'}}', WindowStart, WindowEnd)`

### Retrieving data from Salesforce Report
You can retrieve data from Salesforce reports by specifying query as `{call "<report name>"}`,for example,. `"query": "{call \"TestReport\"}"`.

### Retrieving deleted records from Salesforce Recycle Bin
To query the soft deleted records from Salesforce Recycle Bin, you can specify **"IsDeleted = 1"** in your query. For example,

* To query only the deleted records, specify "select * from MyTable__c **where IsDeleted= 1**"
* To query all the records including the existing and the deleted, specify "select * from MyTable__c **where IsDeleted = 0 or IsDeleted = 1**"

## JSON example: Copy data from Salesforce to Azure Blob
The following example provides sample JSON definitions that you can use to create a pipeline by using the [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) or [Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md). They show how to copy data from Salesforce to Azure Blob Storage. However, data can be copied to any of the sinks stated [here](data-factory-data-movement-activities.md#supported-data-stores-and-formats) using the Copy Activity in Azure Data Factory.

Here are the Data Factory artifacts that you'll need to create to implement the scenario. The sections that follow the list provide details about these steps.

* A linked service of the type [Salesforce](#linked-service-properties)
* A linked service of the type [AzureStorage](data-factory-azure-blob-connector.md#linked-service-properties)
* An input [dataset](data-factory-create-datasets.md) of the type [RelationalTable](#dataset-properties)
* An output [dataset](data-factory-create-datasets.md) of the type [AzureBlob](data-factory-azure-blob-connector.md#dataset-properties)
* A [pipeline](data-factory-create-pipelines.md) with Copy Activity that uses [RelationalSource](#copy-activity-properties) and [BlobSink](data-factory-azure-blob-connector.md#copy-activity-properties)

**Salesforce linked service**

This example uses the **Salesforce** linked service. See the [Salesforce linked service](#linked-service-properties) section for the properties that are supported by this linked service. See [Get security token](https://help.salesforce.com/apex/HTViewHelpDoc?id=user_security_token.htm) for instructions on how to reset/get the security token.

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
**Azure Storage linked service**

```json
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
**Salesforce input dataset**

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

Setting **external** to **true** informs the Data Factory service that the dataset is external to the data factory and is not produced by an activity in the data factory.

> [!IMPORTANT]
> The "__c" part of the API Name is needed for any custom object.

:::image type="content" source="media/data-factory-salesforce-connector/data-factory-salesforce-api-name.png" alt-text="Screenshot shows the Custom Object Definition Detail where you can see Singular Label, Plural Label, Object Name, and A P I Name.":::

**Azure blob output dataset**

Data is written to a new blob every hour (frequency: hour, interval: 1).

```json
{
    "name": "AzureBlobOutput",
    "properties":
    {
        "type": "AzureBlob",
        "linkedServiceName": "AzureStorageLinkedService",
        "typeProperties":
        {
            "folderPath": "adfgetstarted/alltypes_c"
        },
        "availability":
        {
            "frequency": "Hour",
            "interval": 1
        }
    }
}
```

**Pipeline with Copy Activity**

The pipeline contains Copy Activity, which is configured to use the input and output datasets, and is scheduled to run every hour. In the pipeline JSON definition, the **source** type is set to **RelationalSource**, and the **sink** type is set to **BlobSink**.

See [RelationalSource type properties](#copy-activity-properties) for the list of properties that are supported by the RelationalSource.

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

:::image type="content" source="media/data-factory-salesforce-connector/data-factory-salesforce-api-name-2.png" alt-text="Screenshot shows the Custom Fields & Relationships with the A P I names called out.":::


### Type mapping for Salesforce

| Salesforce type | .NET-based type |
| --- | --- |
| Auto Number |String |
| Checkbox |Boolean |
| Currency |Decimal |
| Date |DateTime |
| Date/Time |DateTime |
| Email |String |
| Id |String |
| Lookup Relationship |String |
| Multi-Select Picklist |String |
| Number |Decimal |
| Percent |Decimal |
| Phone |String |
| Picklist |String |
| Text |String |
| Text Area |String |
| Text Area (Long) |String |
| Text Area (Rich) |String |
| Text (Encrypted) |String |
| URL |String |

> [!NOTE]
> To map columns from source dataset to columns from sink dataset, see [Mapping dataset columns in Azure Data Factory](data-factory-map-columns.md).

[!INCLUDE [data-factory-structure-for-rectangular-datasets](includes/data-factory-structure-for-rectangular-datasets.md)]

## Performance and tuning
See the [Copy Activity performance and tuning guide](data-factory-copy-activity-performance.md) to learn about key factors that impact performance of data movement (Copy Activity) in Azure Data Factory and various ways to optimize it.
