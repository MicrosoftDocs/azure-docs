---
title: Copy data from and to Dynamics CRM or Dynamics 365 by using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from Microsoft Dynamics CRM or Microsoft Dynamics 365 to supported sink data stores, or from supported source data stores to Dynamics CRM or Dynamics 365, by using a copy activity in a data factory pipeline.
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
ms.date: 02/07/2018
ms.author: jingwang

---
# Copy data from and to Dynamics 365 or Dynamics CRM by using Azure Data Factory

This article outlines how to use Copy Activity in Azure Data Factory to copy data from and to Microsoft Dynamics 365 or Microsoft Dynamics CRM. It builds on the [Copy Activity overview](copy-activity-overview.md) article that presents a general overview of Copy Activity.

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you use version 1 of Data Factory, which is generally available, see [Copy Activity in version 1](v1/data-factory-data-movement-activities.md).

## Supported capabilities

You can copy data from Dynamics 365 or Dynamics CRM to any supported sink data store. You also can copy data from any supported source data store to Dynamics 365 or Dynamics CRM. For a list of data stores supported as sources or sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

This Dynamics connector supports the following Dynamics versions and authentication types. (IFD is short for internet-facing deployment.)

| Dynamics versions | Authentication types | Linked service samples |
|:--- |:--- |:--- |
| Dynamics 365 online <br> Dynamics CRM Online | Office365 | [Dynamics online + Office365 auth](#dynamics-365-and-dynamics-crm-online) |
| Dynamics 365 on-premises with IFD <br> Dynamics CRM 2016 on-premises with IFD <br> Dynamics CRM 2015 on-premises with IFD | IFD | [Dynamics on-premises with IFD + IFD auth](#dynamics-365-and-dynamics-crm-on-premises-with-ifd) |

For Dynamics 365 specifically, the following application types are supported:

- Dynamics 365 for Sales
- Dynamics 365 for Customer Service
- Dynamics 365 for Field Service
- Dynamics 365 for Project Service Automation
- Dynamics 365 for Marketing

Other application types e.g. Operations and Finance, Talent, etc. are not supported.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started-2](../../includes/data-factory-v2-connector-get-started-2.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to Dynamics.

## Linked service properties

The following properties are supported for the Dynamics linked service.

### Dynamics 365 and Dynamics CRM Online

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Dynamics**. | Yes |
| deploymentType | The deployment type of the Dynamics instance. It must be **"Online"** for Dynamics online. | Yes |
| organizationName | The organization name of the Dynamics instance. | No, should specify when there are more than one Dynamics instances associated with the user |
| authenticationType | The authentication type to connect to a Dynamics server. Specify **"Office365"** for Dynamics online. | Yes |
| username | Specify the user name to connect to Dynamics. | Yes |
| password | Specify the password for the user account you specified for username. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. If not specified, it uses the default Azure Integration Runtime. | No for source, Yes for sink if the source linked service doesn't have an integration runtime |

>[!IMPORTANT]
>When you copy data into Dynamics, the default Azure Integration Runtime can't be used to execute copy. In other words, if your source linked service doesn't have a specified integration runtime, explicitly [create an Azure Integration Runtime](create-azure-integration-runtime.md#create-azure-ir) with a location near your Dynamics instance. Associate it in the Dynamics linked service as in the following example.

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
                "type": "SecureString",
                "value": "<password>"
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

*Additional properties that compare to Dynamics online are "hostName" and "port".*

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **Dynamics**. | Yes |
| deploymentType | The deployment type of the Dynamics instance. It must be **"OnPremisesWithIfd"** for Dynamics on-premises with IFD.| Yes |
| hostName | The host name of the on-premises Dynamics server. | Yes |
| port | The port of the on-premises Dynamics server. | No, default is 443 |
| organizationName | The organization name of the Dynamics instance. | Yes |
| authenticationType | The authentication type to connect to the Dynamics server. Specify **"Ifd"** for Dynamics on-premises with IFD. | Yes |
| username | Specify the user name to connect to Dynamics. | Yes |
| password | Specify the password for the user account you specified for username. You can choose to mark this field as a SecureString to store it securely in ADF, or store password in Azure Key Vault and let the copy activity pull from there when performing data copy - learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | Yes |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. If not specified, it uses the default Azure Integration Runtime. | No for source, Yes for sink |

>[!IMPORTANT]
>To copy data into Dynamics, explicitly [create an Azure Integration Runtime](create-azure-integration-runtime.md#create-azure-ir) with the location near your Dynamics instance. Associate it in the linked service as in the following example.

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
                "type": "SecureString",
                "value": "<password>"
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

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Dynamics dataset.

To copy data from and to Dynamics, set the type property of the dataset to **DynamicsEntity**. The following properties are supported.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to **DynamicsEntity**. |Yes |
| entityName | The logical name of the entity to retrieve. | No for source (if "query" in the activity source is specified), Yes for sink |

> [!IMPORTANT]
>- When you copy data from Dynamics, the "structure" section is required in the Dynamics dataset. It defines the column name and data type for Dynamics data that you want to copy over. To learn more, see [Dataset structure](concepts-datasets-linked-services.md#dataset-structure) and [Data type mapping for Dynamics](#data-type-mapping-for-dynamics).
>- When you copy data to Dynamics, the "structure" section is optional in the Dynamics dataset. Which columns to copy into is determined by the source data schema. If your source is a CSV file without a header, in the input dataset, specify the "structure" with the column name and data type. They map to fields in the CSV file one by one in order.

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

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Dynamics source and sink types.

### Dynamics as a source type

To copy data from Dynamics, set the source type in the copy activity to **DynamicsSource**. The following properties are supported in the copy activity **source** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to **DynamicsSource**. | Yes |
| query | FetchXML is a proprietary query language that is used in Dynamics (online and on-premises). See the following example. To learn more, see [Build queries with FeachXML](https://msdn.microsoft.com/en-us/library/gg328332.aspx). | No (if "entityName" in the dataset is specified) |

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

### Dynamics as a sink type

To copy data to Dynamics, set the sink type in the copy activity to **DynamicsSink**. The following properties are supported in the copy activity **sink** section.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to **DynamicsSink**. | Yes |
| writeBehavior | The write behavior of the operation.<br/>Allowed value is **"Upsert"**. | Yes |
| writeBatchSize | The row count of data written to Dynamics in each batch. | No (default is 10) |
| ignoreNullValues | Indicates whether to ignore null values from input data (except key fields) during a write operation.<br/>Allowed values are **true** and **false**.<br>- **True**: Leave the data in the destination object unchanged when you do an upsert/update operation. Insert a defined default value when you do an insert operation.<br/>- **False**: Update the data in the destination object to NULL when you do an upsert/update operation. Insert a NULL value when you do an insert operation. | No (default is false) |

>[!NOTE]
>The default value of the sink writeBatchSize and the copy activity [parallelCopies](copy-activity-performance.md#parallel-copy) for the Dynamics sink are both 10. Therefore, 100 records are submitted to Dynamics concurrently.

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

When you copy data from Dynamics, the following mappings are used from Dynamics data types to Data Factory interim data types. To learn how the copy activity maps the source schema and data type to the sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

Configure the corresponding Data Factory data type in a dataset structure based on your source Dynamics data type by using the following mapping table.

| Dynamics data type | Data Factory interim data type | Supported as source | Supported as sink |
|:--- |:--- |:--- |:--- |
| AttributeTypeCode.BigInt | Long | ✓ | ✓ |
| AttributeTypeCode.Boolean | Boolean | ✓ | ✓ |
| AttributeType.DateTime | Datetime | ✓ | ✓ |
| AttributeType.Decimal | Decimal | ✓ | ✓ |
| AttributeType.Double | Double | ✓ | ✓ |
| AttributeType.EntityName | String | ✓ | ✓ |
| AttributeType.Integer | Int32 | ✓ | ✓ |
| AttributeType.Lookup | Guid | ✓ | |
| AttributeType.ManagedProperty | Boolean | ✓ | |
| AttributeType.Memo | String | ✓ | ✓ |
| AttributeType.Money | Decimal | ✓ | ✓ |
| AttributeType.Owner | Guid | ✓ | |
| AttributeType.Picklist | Int32 | ✓ | ✓ |
| AttributeType.Uniqueidentifier | Guid | ✓ | ✓ |
| AttributeType.String | String | ✓ | ✓ |
| AttributeType.State | Int32 | ✓ | ✓ |
| AttributeType.Status | Int32 | ✓ | ✓ |


> [!NOTE]
> The Dynamics data types AttributeType.CalendarRules and AttributeType.PartyList aren't supported.

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Data Factory, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
