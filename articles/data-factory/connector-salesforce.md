---
title: Copy data from Salesforce by using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from Salesforce to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/30/2017
ms.author: jingwang

---
# Copy data from Salesforce using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1 - GA](v1/data-factory-salesforce-connector.md)
> * [Version 2 - Preview](connector-salesforce.md)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from a Salesforce database. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Salesforce connector in V1](v1/data-factory-salesforce-connector.md).

## Supported scenarios

You can copy data from Salesforce database to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Salesforce connector supports the following editions of Salesforce: **Developer Edition, Professional Edition, Enterprise Edition, or Unlimited Edition**. And it supports copying data from Salesforce **production, sandbox and custom domain**.

## Prerequisites

* API permission must be enabled in Salesforce. See [How do I enable API access in Salesforce by permission set?](https://www.data2crm.com/migration/faqs/enable-api-access-salesforce-permission-set/)

## Salesforce request limits

Salesforce has limits for both total API requests and concurrent API requests. Note the following points:

- If the number of concurrent requests exceeds the limit, throttling occurs and you see random failures.
- If the total number of requests exceeds the limit, the Salesforce account is blocked for 24 hours.

You might also receive the “REQUEST_LIMIT_EXCEEDED“ error in both scenarios. See the "API Request Limits" section in the [Salesforce Developer Limits](http://resources.docs.salesforce.com/200/20/en-us/sfdc/pdf/salesforce_app_limits_cheatsheet.pdf) article for details.

## Getting started
You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

The following sections provide details about properties that are used to define Data Factory entities specific to Salesforce connector.

## Linked service properties

The following properties are supported for Salesforce linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type |The type property must be set to: **Salesforce**. |Yes |
| environmentUrl | Specify the URL of Salesforce instance. <br><br> - Default is `"https://login.salesforce.com"`. <br> - To copy data from sandbox, specify `"https://test.salesforce.com"`. <br> - To copy data from custom domain, specify, for example, `"https://[domain].my.salesforce.com"`. |No |
| username |Specify a user name for the user account. |Yes |
| password |Specify a password for the user account. |Yes |
| securityToken |Specify a security token for the user account. See [Get security token](https://help.salesforce.com/apex/HTViewHelpDoc?id=user_security_token.htm) for instructions on how to reset/get a security token. To learn about security tokens in general, see [Security and the API](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_concepts_security.htm). |Yes |

**Example:**

```json
{
    "properties": {
        "type": "Salesforce",
        "typeProperties": {
            "username": "<username>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            },
            "securityToken": {
                "type": "SecureString",
                "value": "<security token>"
            }
        }
    },
    "name": "SalesforceLinkedService"
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Salesforce dataset.

To copy data from Salesforce, set the type property of the dataset to **RelationalTable**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **RelationalTable** | Yes |
| tableName | Name of the table in the Salesforce database. | No (if "query" in activity source is specified) |

> [!IMPORTANT]
> The "__c" part of the API Name is needed for any custom object.

![Data Factory - Salesforce connection - API name](media/copy-data-from-salesforce/data-factory-salesforce-api-name.png)

**Example:**

```json
{
    "name": "SalesforceDataset",
    "properties":
    {
        "type": "RelationalTable",
        "linkedServiceName": {
            "referenceName": "<Salesforce linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "tableName": "MyTable__c"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Salesforce source.

### Salesforce as source

To copy data from Salesforce, set the source type in the copy activity to **RelationalSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **RelationalSource** | Yes |
| query |Use the custom query to read data. You can use a SQL-92 query or [Salesforce Object Query Language (SOQL)](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql.htm) query. For example: `select * from MyTable__c`. | No (if the "tableName" in dataset is specified) |

> [!IMPORTANT]
> The "__c" part of the API Name is needed for any custom object.

![Data Factory - Salesforce connection - API name](media/copy-data-from-salesforce/data-factory-salesforce-api-name-2.png)

**Example:**

```json
"activities":[
    {
        "name": "CopyFromSalesforce",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Salesforce input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "RelationalSource",
                "query": "SELECT Col_Currency__c, Col_Date__c, Col_Email__c FROM AllDataType__c"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Query tips

### Retrieving data from Salesforce Report

You can retrieve data from Salesforce reports by specifying query as `{call "<report name>"}. Example: `"query": "{call \"TestReport\"}"`.

### Retrieving deleted records from Salesforce Recycle Bin

To query the soft deleted records from Salesforce Recycle Bin, you can specify **"IsDeleted = 1"** in your query. For example,

* To query only the deleted records, specify "select * from MyTable__c **where IsDeleted= 1**"
* To query all the records including the existing and the deleted, specify "select * from MyTable__c **where IsDeleted = 0 or IsDeleted = 1**"

### Retrieving data using where clause on DateTime column

When specify the SOQL or SQL query, pay attention to the DateTime format difference. For example:

* **SOQL sample**: `$$Text.Format('SELECT Id, Name, BillingCity FROM Account WHERE LastModifiedDate >= {0:yyyy-MM-ddTHH:mm:ssZ} AND LastModifiedDate < {1:yyyy-MM-ddTHH:mm:ssZ}', <datetime parameter>, <datetime parameter>)`
* **SQL sample**: `$$Text.Format('SELECT * FROM Account WHERE LastModifiedDate >= {{ts\\'{0:yyyy-MM-dd HH:mm:ss}\\'}} AND LastModifiedDate < {{ts\\'{1:yyyy-MM-dd HH:mm:ss}\\'}}', <datetime parameter>, <datetime parameter>)`

## Data type mapping for Salesforce

When copying data from Salesforce, the following mappings are used from Salesforce data types to Azure Data Factory interim data types. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

| Salesforce data type | Data factory interim data type |
|:--- |:--- |
| Auto Number |String |
| Checkbox |Boolean |
| Currency |Double |
| Date |DateTime |
| Date/Time |DateTime |
| Email |String |
| Id |String |
| Lookup Relationship |String |
| Multi-Select Picklist |String |
| Number |Double |
| Percent |Double |
| Phone |String |
| Picklist |String |
| Text |String |
| Text Area |String |
| Text Area (Long) |String |
| Text Area (Rich) |String |
| Text (Encrypted) |String |
| URL |String |


## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md##supported-data-stores-and-formats).