---
title: Copy and transform data in Dynamics 365 (Microsoft Dataverse) or Dynamics CRM 
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy and transform data in Dynamics 365 (Microsoft Dataverse) or Dynamics CRM using Azure Data Factory or Azure Synapse Analytics.
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.author: jianleishen
author: jianleishen
ms.custom: synapse
ms.date: 11/20/2023
---
# Copy and transform data in Dynamics 365 (Microsoft Dataverse) or Dynamics CRM using Azure Data Factory or Azure Synapse Analytics

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]
This article outlines how to use a copy activity in Azure Data Factory or Synapse pipelines to copy data from and to Dynamics 365 (Microsoft Dataverse) or Dynamics CRM, and use a data flow to transform data in Dynamics 365 (Microsoft Dataverse) or Dynamics CRM. To learn more, read the [Azure Data Factory](introduction.md) and the [Azure Synapse Analytics](..\synapse-analytics\overview-what-is.md) introduction articles.

## Supported capabilities

This connector is supported for the following activities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/sink)|&#9312; &#9313;|
|[Mapping data flow](concepts-data-flow-overview.md) (source/sink)|&#9312; |
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*


For a list of data stores that a copy activity supports as sources and sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.

>[!NOTE]
>Effective November 2020, Common Data Service has been renamed to [Microsoft Dataverse](/powerapps/maker/data-platform/data-platform-intro). This article is updated to reflect the latest terminology. 

This Dynamics connector supports Dynamics versions 7 through 9 for both online and on-premises. More specifically:
- Version 7 maps to Dynamics CRM 2015.
- Version 8 maps to Dynamics CRM 2016 and the early version of Dynamics 365.
- Version 9 maps to the later version of Dynamics 365.


Refer to the following table of supported authentication types and configurations for Dynamics versions and products.

| Dynamics versions | Authentication types | Linked service samples |
|:--- |:--- |:--- |
| Dataverse <br/><br/> Dynamics 365 online <br/><br/> Dynamics CRM online | Microsoft Entra service principal <br/><br/> Office 365 <br/><br/> User-assigned managed identity| [Dynamics online and Microsoft Entra service principal or Office 365 authentication](#dynamics-365-and-dynamics-crm-online) |
| Dynamics 365 on-premises with internet-facing deployment (IFD) <br/><br/> Dynamics CRM 2016 on-premises with IFD <br/><br/> Dynamics CRM 2015 on-premises with IFD | IFD | [Dynamics on-premises with IFD and IFD authentication](#dynamics-365-and-dynamics-crm-on-premises-with-ifd) |

>[!NOTE]
>With the [deprecation of regional Discovery Service](/power-platform/important-changes-coming#regional-discovery-service-is-deprecated), the service has upgraded to leverage [global Discovery Service](/powerapps/developer/data-platform/webapi/discover-url-organization-web-api#global-discovery-service) while using Office 365 Authentication.

> [!IMPORTANT]
>If your tenant and user is configured in Microsoft Entra ID for [conditional access](../active-directory/conditional-access/overview.md) and/or Multi-Factor Authentication is required, you will not be able to use Office 365 Authentication type. For those situations, you must use a Microsoft Entra service principal authentication.

For Dynamics 365 specifically, the following application types are supported:
- Dynamics 365 for Sales
- Dynamics 365 for Customer Service
- Dynamics 365 for Field Service
- Dynamics 365 for Project Service Automation
- Dynamics 365 for Marketing

This connector doesn't support other application types like Finance, Operations, and Talent.

>[!TIP]
>To copy data from Dynamics 365 Finance and Operations, you can use the [Dynamics AX connector](connector-dynamics-ax.md).

This Dynamics connector is built on top of [Dynamics XRM tooling](/dynamics365/customer-engagement/developer/build-windows-client-applications-xrm-tools).

## Prerequisites
To use this connector with Microsoft Entra service principal authentication, you must set up server-to-server (S2S) authentication in Dataverse or Dynamics. First register the application user (Service Principal) in Microsoft Entra ID. You can find out how to do this [here](../active-directory/develop/howto-create-service-principal-portal.md). During application registration you will need to create that user in Dataverse or Dynamics and grant permissions. Those permissions can either be granted directly or indirectly by adding the application user to a team which has been granted permissions in Dataverse or Dynamics. You can find more information on how to set up an application user to authenticate with Dataverse [here](/powerapps/developer/data-platform/use-single-tenant-server-server-authentication). 


## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to Dynamics 365 (Microsoft Dataverse) or Dynamics CRM using UI

Use the following steps to create a linked service to Dynamics 365 in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Dynamics or Dataverse and select the Dynamics 365 (Microsoft Dataverse) or Dynamics CRM connector.

    :::image type="content" source="media/connector-dynamics-crm-office-365/dynamics-crm-office-365-connector.png" alt-text="Screenshot of the Dynamics 365 connector.":::    

    :::image type="content" source="media/connector-dynamics-crm-office-365/dataverse-connector.png" alt-text="Screenshot of the Dataverse connector.":::  

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-dynamics-crm-office-365/configure-dynamics-crm-office-365-linked-service.png" alt-text="Screenshot of linked service configuration for Dynamics 365.":::

## Connector configuration details

The following sections provide details about properties that are used to define entities specific to Dynamics.

## Linked service properties

The following properties are supported for the Dynamics linked service.

### Dynamics 365 and Dynamics CRM online

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to "Dynamics", "DynamicsCrm", or "CommonDataServiceForApps". | Yes |
| deploymentType | The deployment type of the Dynamics instance. The value must be "Online" for Dynamics online. | Yes |
| serviceUri | The service URL of your Dynamics instance, the same one you access from browser. An example is "https://\<organization-name>.crm[x].dynamics.com". | Yes |
| authenticationType | The authentication type to connect to a Dynamics server. Valid values are "AADServicePrincipal", "Office365" and "ManagedIdentity". | Yes |
| servicePrincipalId | The client ID of the Microsoft Entra application. | Yes when authentication is "AADServicePrincipal" |
| servicePrincipalCredentialType | The credential type to use for service-principal authentication. Valid values are "ServicePrincipalKey" and "ServicePrincipalCert". | Yes when authentication is "AADServicePrincipal" |
| servicePrincipalCredential | The service-principal credential. <br/><br/>When you use "ServicePrincipalKey" as the credential type, `servicePrincipalCredential` can be a string that the service encrypts upon linked service deployment. Or it can be a reference to a secret in Azure Key Vault. <br/><br/>When you use "ServicePrincipalCert" as the credential, `servicePrincipalCredential` must be a reference to a certificate in Azure Key Vault, and ensure the certificate content type is **PKCS #12**.| Yes when authentication is "AADServicePrincipal" |
| username | The username to connect to Dynamics. | Yes when authentication is "Office365" |
| password | The password for the user account you specified as the username. Mark this field with "SecureString" to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes when authentication is "Office365" |
| credentials | Specify the user-assigned managed identity as the credential object. <br/><br/> [Create one or multiple user-assigned managed identities](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md), assign them to your data factory and [create credentials](credentials.md) for each user-assigned managed identity.| Yes when authentication is "ManagedIdentity" |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. If no value is specified, the property uses the default Azure integration runtime. | No |

>[!NOTE]
>The Dynamics connector formerly used the optional **organizationName** property to identify your Dynamics CRM or Dynamics 365 online instance. While that property still works, we suggest you specify the new **serviceUri** property instead to gain better performance for instance discovery.

>[!CAUTION]
>The **ServicePrincipalCert** credential type is currently in preview with no SLA guarantee. You may encounter transient issues when using it.

<a name='example-dynamics-online-using-azure-ad-service-principal-and-key-authentication'></a>

#### Example: Dynamics online using Microsoft Entra service principal and key authentication

```json
{  
    "name": "DynamicsLinkedService",  
    "properties": {  
        "type": "Dynamics",  
        "typeProperties": {  
            "deploymentType": "Online",  
            "serviceUri": "https://<organization-name>.crm[x].dynamics.com",  
            "authenticationType": "AADServicePrincipal",  
            "servicePrincipalId": "<service principal id>",  
            "servicePrincipalCredentialType": "ServicePrincipalKey",  
            "servicePrincipalCredential": "<service principal key>"
        },  
        "connectVia": {  
            "referenceName": "<name of Integration Runtime>",  
            "type": "IntegrationRuntimeReference"  
        }  
    }  
}  
```

<a name='example-dynamics-online-using-azure-ad-service-principal-and-certificate-authentication'></a>

#### Example: Dynamics online using Microsoft Entra service principal and certificate authentication

```json
{ 
    "name": "DynamicsLinkedService", 
    "properties": { 
        "type": "Dynamics", 
        "typeProperties": { 
            "deploymentType": "Online", 
            "serviceUri": "https://<organization-name>.crm[x].dynamics.com", 
            "authenticationType": "AADServicePrincipal", 
            "servicePrincipalId": "<service principal id>", 
            "servicePrincipalCredentialType": "ServicePrincipalCert", 
            "servicePrincipalCredential": { 
                "type": "AzureKeyVaultSecret", 
                "store": { 
                    "referenceName": "<AKV reference>", 
                    "type": "LinkedServiceReference" 
                }, 
                "secretName": "<certificate name in AKV>" 
            } 
        }, 
        "connectVia": { 
            "referenceName": "<name of Integration Runtime>", 
            "type": "IntegrationRuntimeReference" 
        } 
    } 
} 
```
#### Example: Dynamics online using Office 365 authentication

```json
{
    "name": "DynamicsLinkedService",
    "properties": {
        "type": "Dynamics",
        "typeProperties": {
            "deploymentType": "Online",
            "serviceUri": "https://<organization-name>.crm[x].dynamics.com",
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
#### Example: Dynamics online using user-assigned managed identity authentication

```json
{
    "name": "DynamicsLinkedService",
    "properties": {
        "type": "Dynamics",
        "typeProperties": {
            "deploymentType": "Online",
            "serviceUri": "https://<organization-name>.crm[x].dynamics.com",
            "authenticationType": "ManagedIdentity",
            "credential": {
                "referenceName": "credential1",
                "type": "CredentialReference"
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

Additional properties that compare to Dynamics online are **hostName** and **port**.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to "Dynamics", "DynamicsCrm", or "CommonDataServiceForApps". | Yes. |
| deploymentType | The deployment type of the Dynamics instance. The value must be "OnPremisesWithIfd" for Dynamics on-premises with IFD.| Yes. |
| hostName | The host name of the on-premises Dynamics server. | Yes. |
| port | The port of the on-premises Dynamics server. | No. The default value is 443. |
| organizationName | The organization name of the Dynamics instance. | Yes. |
| authenticationType | The authentication type to connect to the Dynamics server. Specify "Ifd" for Dynamics on-premises with IFD. | Yes. |
| username | The username to connect to Dynamics. | Yes. |
| password | The password for the user account you specified for the username. You can mark this field with "SecureString" to store it securely. Or you can store a password in Key Vault and let the copy activity pull from there when it does data copy. Learn more from [Store credentials in Key Vault](store-credentials-in-key-vault.md). | Yes. |
| connectVia | The [integration runtime](concepts-integration-runtime.md) to be used to connect to the data store. If no value is specified, the property uses the default Azure integration runtime. | No |

#### Example: Dynamics on-premises with IFD using IFD authentication

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

To copy data from and to Dynamics, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to "DynamicsEntity", "DynamicsCrmEntity", or "CommonDataServiceForAppsEntity". |Yes |
| entityName | The logical name of the entity to retrieve. | No for source if the activity source is specified as "query" and yes for sink |

#### Example

```json
{
    "name": "DynamicsDataset",
    "properties": {
        "type": "DynamicsEntity",
        "schema": [],
        "typeProperties": {
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

To copy data from Dynamics, the copy activity **source** section supports the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to "DynamicsSource", "DynamicsCrmSource", or "CommonDataServiceForAppsSource". | Yes |
| query | FetchXML is a proprietary query language that is used in Dynamics online and on-premises. See the following example. To learn more, see [Build queries with FetchXML](/previous-versions/dynamicscrm-2016/developers-guide/gg328332(v=crm.8)). | No if `entityName` in the dataset is specified |

>[!NOTE]
>The PK column will always be copied out even if the column projection you configure in the FetchXML query doesn't contain it.

> [!IMPORTANT]
>- When you copy data from Dynamics, explicit column mapping from Dynamics to sink is optional. But we highly recommend the mapping to ensure a deterministic copy result.
>- When the service imports a schema in the authoring UI, it infers the schema. It does so by sampling the top rows from the Dynamics query result to initialize the source column list. In that case, columns with no values in the top rows are omitted. The same behavior also applies to data preview and copy executions if there is no explicit mapping. You can review and add more columns into the mapping, which are honored during copy runtime.

#### Example

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

To copy data to Dynamics, the copy activity **sink** section supports the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity sink must be set to "DynamicsSink", "DynamicsCrmSink", or "CommonDataServiceForAppsSink". | Yes. |
| writeBehavior | The write behavior of the operation. The value must be "Upsert". | Yes |
| alternateKeyName | The alternate key name defined on your entity to do an upsert. | No. |
| writeBatchSize | The row count of data written to Dynamics in each batch. | No. The default value is 10. |
| ignoreNullValues | Whether to ignore null values from input data other than key fields during a write operation.<br/><br/>Valid values are **TRUE** and **FALSE**:<ul><li>**TRUE**: Leave the data in the destination object unchanged when you do an upsert or update operation. Insert a defined default value when you do an insert operation.</li><li>**FALSE**: Update the data in the destination object to a null value when you do an upsert or update operation. Insert a null value when you do an insert operation.</li></ul> | No. The default value is **FALSE**. |
| maxConcurrentConnections |The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No |

>[!NOTE]
>The default value for both the sink **writeBatchSize** and the copy activity **[parallelCopies](copy-activity-performance-features.md#parallel-copy)** for the Dynamics sink is 10. Therefore, 100 records are concurrently submitted by default to Dynamics.

For Dynamics 365 online, there's a limit of [52 concurrent batch calls per organization](/power-apps/developer/data-platform/api-limits#concurrent-requests). If that limit is exceeded, a "Server Busy" exception is thrown before the first request is ever run. Keep **writeBatchSize** at 10 or less to avoid such throttling of concurrent calls.

The optimal combination of **writeBatchSize** and **parallelCopies** depends on the schema of your entity. Schema elements include the number of columns, row size, and number of plug-ins, workflows, or workflow activities hooked up to those calls. The default setting of **writeBatchSize** (10) &times; **parallelCopies** (10) is the recommendation according to the Dynamics service. This value works for most Dynamics entities, although it might not give the best performance. You can tune the performance by adjusting the combination in your copy activity settings.

#### Example

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

## Retrieving data from views

To retrieve data from Dynamics views, you need to get the saved query of the view, and use the query to get the data.

There are two entities which store different types of view: "saved query" stores system view and "user query" stores user view. To get the information of the views, refer to the following FetchXML query and replace the "TARGETENTITY" with `savedquery` or `userquery`. Each entity type has more available attributes that you can add to the query based on your need. Learn more about [savedquery entity](/dynamics365/customer-engagement/web-api/savedquery) and [userquery entity](/dynamics365/customer-engagement/web-api/userquery).

```xml
<fetch top="5000" >
  <entity name="<TARGETENTITY>">
    <attribute name="name" />
    <attribute name="fetchxml" />
    <attribute name="returnedtypecode" />
    <attribute name="querytype" />
  </entity>
</fetch>
```

You can also add filters to filter the views. For example, add the following filter to get a view named "My Active Accounts" in account entity.

```xml
<filter type="and" >
    <condition attribute="returnedtypecode" operator="eq" value="1" />
    <condition attribute="name" operator="eq" value="My Active Accounts" />
</filter>
```

## Data type mapping for Dynamics

When you copy data from Dynamics, the following table shows mappings from Dynamics data types to interim data types within the service. To learn how a copy activity maps to a source schema and a data type maps to a sink, see [Schema and data type mappings](copy-activity-schema-and-type-mapping.md).

Configure the corresponding interim data type in a dataset structure that is based on your source Dynamics data type by using the following mapping table:

| Dynamics data type | Service interim data type | Supported as source | Supported as sink |
|:--- |:--- |:--- |:--- |
| AttributeTypeCode.BigInt | Long | ✓ | ✓ |
| AttributeTypeCode.Boolean | Boolean | ✓ | ✓ |
| AttributeType.Customer | GUID | ✓ | ✓ (See [guidance](#writing-data-to-a-lookup-field)) |
| AttributeType.DateTime | Datetime | ✓ | ✓ |
| AttributeType.Decimal | Decimal | ✓ | ✓ |
| AttributeType.Double | Double | ✓ | ✓ |
| AttributeType.EntityName | String | ✓ | ✓ |
| AttributeType.Integer | Int32 | ✓ | ✓ |
| AttributeType.Lookup | GUID | ✓ | ✓ (See [guidance](#writing-data-to-a-lookup-field)) |
| AttributeType.ManagedProperty | Boolean | ✓ | |
| AttributeType.Memo | String | ✓ | ✓ |
| AttributeType.Money | Decimal | ✓ | ✓ |
| AttributeType.Owner | GUID | ✓ | ✓ (See [guidance](#writing-data-to-a-lookup-field)) |
| AttributeType.Picklist | Int32 | ✓ | ✓ |
| AttributeType.Uniqueidentifier | GUID | ✓ | ✓ |
| AttributeType.String | String | ✓ | ✓ |
| AttributeType.State | Int32 | ✓ | ✓ |
| AttributeType.Status | Int32 | ✓ | ✓ |

> [!NOTE]
> The Dynamics data types **AttributeType.CalendarRules**, **AttributeType.MultiSelectPicklist**, and **AttributeType.PartyList** aren't supported.

## Writing data to a lookup field

To write data into a lookup field with multiple targets like Customer and Owner, follow this guidance and example:

1. Make your source contains both the field value and the corresponding target entity name.
   - If all records map to the same target entity, ensure one of the following conditions:
      - Your source data has a column that stores the target entity name.
      - You've added an additional column in the copy activity source to define the target entity.
   - If different records map to different target entities, make sure your source data has a column that stores the corresponding target entity name.

1. Map both the value and entity-reference columns from source to sink. The entity-reference column must be mapped to a virtual column with the special naming pattern `{lookup_field_name}@EntityReference`. The column doesn't actually exist in Dynamics. It's used to indicate this column is the metadata column of the given multitarget lookup field.

For example, assume the source has these two columns:

- **CustomerField** column of type **GUID**, which is the primary key value of the target entity in Dynamics.
- **Target** column of type **String**, which is the logical name of the target entity.

Also assume you want to copy such data to the sink Dynamics entity field **CustomerField** of type **Customer**.

In copy-activity column mapping, map the two columns as follows:

- **CustomerField** to **CustomerField**. This mapping is the normal field mapping.
- **Target** to **CustomerField\@EntityReference**. The sink column is a virtual column representing the entity reference. Input such field names in a mapping, as they won't show up by importing schemas.

:::image type="content" source="./media/connector-dynamics-crm-office-365/connector-dynamics-lookup-field-column-mapping.png" alt-text="Dynamics lookup-field column mapping":::

If all of your source records map to the same target entity and your source data doesn't contain the target entity name, here is a shortcut: in the copy activity source, add an additional column. Name the new column by using the pattern `{lookup_field_name}@EntityReference`, set the value to the target entity name, then proceed with column mapping as usual. If your source and sink column names are identical, you can also skip explicit column mapping because copy activity by default maps columns by name.

:::image type="content" source="./media/connector-dynamics-crm-office-365/connector-dynamics-add-entity-reference-column.png" alt-text="Dynamics lookup-field adding an entity-reference column":::

## Writing data to a lookup field via alternative keys

To write data into a lookup field using alternate key columns, follow this guidance and example: 

1. Ensure your source contains all the lookup key columns. 

2. The alternate key columns must be mapped to the column with the special naming pattern `{lookup_field_name}@{alternate_key_column_name}`. The column doesn't exist in Dynamics. It's used to indicate that this column is used to look up the record in the target entity.

3. Go to **Mapping** tab in the sink transformation of mapping data flows. Select the alternate key as output columns under the Lookup field. The value after indicates the key columns of this alternate key.

    :::image type="content" source="./media/connector-dynamics-crm-office-365/select-alternate-key-columns.png" alt-text="Screenshot shows selecting alternate key columns.":::

4. Once selected, the alternate key columns will automatically display in below.

    :::image type="content" source="./media/connector-dynamics-crm-office-365/connector-dynamics-lookup-field-column-mapping-alternate-key-1.png" alt-text="Screenshot shows mapping columns to lookup fields via alternate keys step 1.":::

5. Map your input columns on left with the output columns.

    :::image type="content" source="./media/connector-dynamics-crm-office-365/connector-dynamics-lookup-field-column-mapping-alternate-key-2.png" alt-text="Screenshot shows mapping columns to lookup fields via alternate keys step 2.":::

> [!Note]
> Currently this is only supported when you use inline mode in the sink transformation of mapping data flows.

## Mapping data flow properties

When transforming data in mapping data flow, you can read from and write to tables in Dynamics. For more information, see the [source transformation](data-flow-source.md) and [sink transformation](data-flow-sink.md) in mapping data flows. You can choose to use a Dynamics dataset or an [inline dataset](data-flow-source.md#inline-datasets) as source and sink type.

### Source transformation

The below table lists the properties supported by Dynamics. You can edit these properties in the **Source options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Entity name| The logical name of the entity to retrieve. | Yes when use inline dataset | - |  *(for inline dataset only)*<br>entity |
| Query |FetchXML is a proprietary query language that is used in Dynamics online and on-premises. See the following example. To learn more, see [Build queries with FetchXML](/previous-versions/dynamicscrm-2016/developers-guide/gg328332(v=crm.8)). | No | String | query |

> [!Note]
> If you select **Query** as input type, the column type from tables can not be retrieved. It will be treated as string by default. 

#### Dynamics source script example

When you use Dynamics dataset as source type, the associated data flow script is:

```
source(allowSchemaDrift: true,
	validateSchema: false,
	query: '<fetch mapping='logical' count='3 paging-cookie=''><entity name='new_dataflow_crud_test'><attribute name='new_name'/><attribute name='new_releasedate'/></entity></fetch>') ~> DynamicsSource
```

If you use inline dataset, the associated data flow script is:

```
source(allowSchemaDrift: true,
	validateSchema: false,
	store: 'dynamics',
	format: 'dynamicsformat',
	entity: 'Entity1',
	query: '<fetch mapping='logical' count='3 paging-cookie=''><entity name='new_dataflow_crud_test'><attribute name='new_name'/><attribute name='new_releasedate'/></entity></fetch>') ~> DynamicsSource
```

### Sink transformation

The below table lists the properties supported by Dynamics sink. You can edit these properties in the **Sink options** tab.

| Name | Description | Required | Allowed values | Data flow script property |
| ---- | ----------- | -------- | -------------- | ---------------- |
| Alternate key name | The alternate key name defined on your entity to do an update, upsert or delete.  | No | - | alternateKeyName |
| Update method | Specify what operations are allowed on your database destination. The default is to only allow inserts.<br>To update, upsert, or delete rows, an [Alter row transformation](data-flow-alter-row.md) is required to tag rows for those actions. | Yes | `true` or `false` | insertable <br/>updateable<br/>upsertable<br>deletable|
| Entity name| The logical name of the entity to write. | Yes when use inline dataset | - | *(for inline dataset only)*<br>entity|


#### Dynamics sink script example

When you use Dynamics dataset as sink type, the associated data flow script is:

```
IncomingStream sink(allowSchemaDrift: true,
    validateSchema: false,
    deletable:true,
    insertable:true,
    updateable:true,
    upsertable:true,
    skipDuplicateMapInputs: true,
    skipDuplicateMapOutputs: true) ~> DynamicsSink
```

If you use inline dataset, the associated data flow script is:

```
IncomingStream sink(allowSchemaDrift: true,
    validateSchema: false,
    store: 'dynamics',
    format: 'dynamicsformat',
    entity: 'Entity1',
    deletable: true,
    insertable: true,
    updateable: true,
    upsertable: true,
    skipDuplicateMapInputs: true,
    skipDuplicateMapOutputs: true) ~> DynamicsSink
```

## Lookup activity properties

To learn details about the properties, see [Lookup activity](control-flow-lookup-activity.md).

## Next steps

For a list of supported data stores the copy activity as sources and sinks, see [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
