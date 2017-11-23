---
title: Copy data from/to Dynamics CRM and 365 using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from Dynamics CRM and 365 to supported sink data stores (OR) from supported source data stores to Dynamics CRM and 365 by using a copy activity in an Azure Data Factory pipeline.
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
ms.date: 11/09/2017
ms.author: jingwang

---
# Copy data from/to Dynamics 365/Dynamics CRM using Azure Data Factory

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from and to Dynamics 365/Dynamics CRM. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Copy Activity in V1](v1/data-factory-data-movement-activities.md).

## Supported capabilities

You can copy data from Dynamics 365/Dynamics CRM to any supported sink data store, or copy data from any supported source data store to Dynamics 365/Dynamics CRM. For a list of data stores supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this Dynamics connector supports below Dynamics versions and authentication types:

| Dynamics Versions | Authentication Types | Linked service samples |
|:--- |:--- |:--- |
| Dynamics 365 online <br> Dynamics CRM online | Office365 | [Dynamics Online + Office365 auth](#dynamics-365-and-dynamics-crm-online) |
| Dynamics 365 on-premises with IFD <br> Dynamics CRM 2016 on-premises with IFD <br> Dynamics CRM 2015 on-premises with IFD | IFD | [Dynamics On-premises with IFD + IFD auth](#dynamics-365-and-dynamics-crm-on-premises-with-ifd) |

*IFD is short for Internet Facing Deployment.*

> [!NOTE]
> To use Dynamics connector, store your password in Azure Key Vault and let ADF copy acitivty pull from there when performing data copy. See how to configure in [linked service properties](#linked-service-properties) section.

## Getting started

You can create a pipeline with copy activity using .NET SDK, Python SDK, Azure PowerShell, REST API, or Azure Resource Manager template. See [Copy activity tutorial](quickstart-create-data-factory-dot-net.md) for step-by-step instructions to create a pipeline with a copy activity.

The following sections provide details about properties that are used to define Data Factory entities specific to Dynamics.

## Linked service properties

The following properties are supported for Dynamics linked service:

### Dynamics 365 and Dynamics CRM Online

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Dynamics**. | Yes |
| deploymentType | The deployment type of the Dynamics instance. Must be **"Online"** for Dynamics Online. | Yes |
| organizationName | The organization name of the Dynamics instance. | No, should specify when there are more than one Dynamics instances associated with the user. |
| authenticationType | The authentication type to connect to Dynamics server. Specify **"Office365"** for Dynamics Online. | Yes |
| username | Specify user name to connect to the Dynamics. | Yes |
| password | Specify password for the user account you specified for the username. You have to put the password in the Azure Key Vault, and configure the password as an "AzureKeyVaultSecret". Learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. If not specified, it uses the default Azure Integration Runtime. | No for source, Yes for sink |

>[!IMPORTANT]
>To copy data into Dynamics, explicitly [create an Azure IR](create-azure-integration-runtime.md#create-azure-ir) with a location near your Dynamics, and associate in the linked service as the following example.

**Example: Dynamics online using Office365 authentication**

```json
{
    "name": "DynamicsLinkedService",
    "properties": {
        "type": "Dynamics",
        "description": "Dynamics online linked service using Office365 authentication",
        "typeProperties": {
            "deploymentType": "Online",
            "organizationName": "orga02d9c75",
            "authenticationType": "Office365",
            "username": "test@contoso.onmicrosoft.com",
            "password": {
                "type": "AzureKeyVaultSecret",
                "secretName": "<secret name in AKV>",
                "store":{
                    "referenceName": "<Azure Key Vault linked service>",
                    "type": "LinkedServiceReference"
                }
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Dynamics 365 and Dynamics CRM on-premises with IFD

*Additional properties comparing to Dyanmics online are "hostName" and "port".*

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Dynamics**. | Yes |
| deploymentType | The deployment type of the Dynamics instance. Must be **"OnPremisesWithIfd"** for Dynamics on-premises with IFD.| Yes |
| **hostName** | The host name of on-premises Dynamics server. | Yes |
| **port** | The port of on-premises Dynamics server. | No, default is 443 |
| organizationName | The organization name of the Dynamics instance. | Yes |
| authenticationType | The authentication type to connect to Dynamics server. Specify **"Ifd"** for Dynamics on-premises with IFD. | Yes |
| username | Specify user name to connect to the Dynamics. | Yes |
| password | Specify password for the user account you specified for the username. Note you have to put the password in the Azure Key Vault, and configure the password as an "AzureKeyVaultSecret". Learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. If not specified, it uses the default Azure Integration Runtime. | No for source, Yes for sink |

>[!IMPORTANT]
>To copy data into Dynamics, explicitly [create an Azure IR](create-azure-integration-runtime.md#create-azure-ir) with the location near your Dynamics, and associate in the linked service as the following example.

**Example: Dynamics on-premises with IFD using IFD authentication**

```json
{
    "name": "DynamicsLinkedService",
    "properties": {
        "type": "Dynamics",
        "description": "Dynamics on-premises with IFD linked service using IFD authentication",
        "typeProperties": {
            "deploymentType": "OnPremisesWithIFD",
            "hostName": "contosodynamicsserver.contoso.com",
            "port": 443,
            "organizationName": "admsDynamicsTest",
            "authenticationType": "Ifd",
            "username": "test@contoso.onmicrosoft.com",
            "password": {
                "type": "AzureKeyVaultSecret",
                "secretName": "<secret name in AKV>",
                "store":{
                    "referenceName": "<Azure Key Vault linked service>",
                    "type": "LinkedServiceReference"
                }
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Dynamics dataset.

To copy data from/to Dynamics, set the type property of the dataset to **DynamicsEntity**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **DynamicsEntity** |Yes |
| entityName | The logical name of the entity to retrieve. | No for source (if "query" in activity source is specified), Yes for sink |

> [!IMPORTANT]
>- **When copying data from Dynamics, the "structure" section is required** in Dynamics dataset, which defines column name and data type for Dynamics data that you want to copy over. Learn more from [dataset structure](concepts-datasets-linked-services.md#dataset-structure) and the [Data type mapping for Dynamics](#data-type-mapping-for-dynamics).
>- **When copying data to Dynamics, the "structure" section is optional** in Dynamics dataset. Which column(s) to copy into will be determined by the source data schema. If your source is CSV file without header, in the input dataset, specify the "structure" with column name and data type which maps to fields in CSV file one by one in order.

**Example:**

```json
{
    "name": "DynamicsDataset",
    "properties": {
        "type": "DynamicsEntity",
        "structure": [
            {
                "name": "accountid",
                "type": "Guid"
            },
            {
                "name": "name",
                "type": "String"
            },
            {
                "name": "marketingonly",
                "type": "Boolean"
            },
            {
                "name": "modifiedon",
                "type": "Datetime"
            }
        ],
        "typePoperties": {
            "entityName": "account"
        },
        "linkedServiceName": {
            "referenceName": "<Dynamics linked service name>",
            "type": "linkedservicereference"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Dynamics source and sink.

### Dynamics as source

To copy data from Dynamics, set the source type in the copy activity to **DynamicsSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **DynamicsSource**  | Yes |
| query  | FetchXML is a proprietary query language that is used in Microsoft Dynamics (online & on-premises). See below example and learn more from [Build queries with FeachXML](https://msdn.microsoft.com/en-us/library/gg328332.aspx). | No (if "entityName" in dataset is specified)  |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromDynamics",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Dynamics input dataset>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<output dataset>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "DynamicsSource",
                "query": "<FetchXML Query>"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

### Sample FetchXML query

```xml
<fetch>
  <entity name="account">
    <attribute name="accountid" />
    <attribute name="name" />
    <attribute name="marketingonly" />
    <attribute name="modifiedon" />
    <order attribute="modifiedon" descending="false" />
    <filter type="and">
      <condition attribute ="modifiedon" operator="between">
        <value>2017-03-10 18:40:00z</value>
        <value>2017-03-12 20:40:00z</value>
      </condition>
    </filter>
  </entity>
</fetch>
```

### Dynamics as sink

To copy data to Dynamics, set the sink type in the copy activity to **DynamicsSink**. The following properties are supported in the copy activity **sink** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to: **DynamicsSink**  | Yes |
| writeBehavior | The write behavior of the operation.<br/>Allowed value is: **"Upsert"**. | Yes |
| writeBatchSize | The row count of data written to Dynamics in each batch. | No (default is 10) |
| ignoreNullValues | Indicates whether to ignore null values from input data (except key fields) during write operation.<br/>Allowed values are: **true**, and **false**.<br>- true: leave the data in the destination object unchanged when doing upsert/update operation, and insert defined default value when doing insert operation.<br/>- false: update the data in the destination object to NULL when doing upsert/update operation, and insert NULL value when doing insert operation.  | No (default is false) |

>[!NOTE]
>The default value of sink writeBatchSize and copy activity [parallelCopies](copy-activity-performance.md#parallel-copy) for Dynamics sink are both 10, which means 100 records being submitted to Dynamics concurrently.

**Example:**

```json
"activities":[
    {
        "name": "CopyToDynamics",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<input dataset>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<Dynamics output dataset>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "<source type>"
            },
            "sink": {
                "type": "DynamicsSink",
                "writeBehavior": "Upsert",
                "writeBatchSize": 10,
                "ignoreNullValues": true
            }
        }
    }
]
```

## Data type mapping for Dynamics

When copying data from Dynamics, the following mappings are used from Dynamics data types to Azure Data Factory interim data types. See [Schema and data type mappings](copy-activity-schema-and-type-mapping.md) to learn about how copy activity maps the source schema and data type to the sink.

Configure the corresponding ADF data type in dataset structure based on your source Dynamics data type using below mapping table:

| Dynamics data type | Data factory interim data type | Supported as source | Supported as sink |
|:--- |:--- |:--- |:--- |
| AttributeTypeCode.BigInt | Long | ✓ | ✓ |
| AttributeTypeCode.Boolean | Boolean | ✓ | ✓ |
| AttributeType.Customer | Guid | ✓ |  |
| AttributeType.DateTime | Datetime | ✓ | ✓ |
| AttributeType.Decimal | Decimal | ✓ | ✓ |
| AttributeType.Double | Double | ✓ | ✓ |
| AttributeType.EntityName | String | ✓ | ✓ |
| AttributeType.Integer | Int32 | ✓ | ✓ |
| AttributeType.Lookup | Guid | ✓ |  |
| AttributeType.ManagedProperty | Boolean | ✓ |  |
| AttributeType.Memo | String | ✓ | ✓ |
| AttributeType.Money | Decimal | ✓ |  |
| AttributeType.Owner | Guid | ✓ | |
| AttributeType.Picklist | Int32 | ✓ | ✓ |
| AttributeType.Uniqueidentifier | Guid | ✓ | ✓ |
| AttributeType.String | String | ✓ | ✓ |
| AttributeType.State | Int32 | ✓ |  |
| AttributeType.Status | Int32 | ✓ |  |


> [!NOTE]
> Dynamics data type AttributeType.CalendarRules and AttributeType.PartyList are not supported.

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).