---
title: Copy data from SharePoint Online List by using Azure Data Factory 
description: Learn how to copy data from SharePoint Online List to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: shwang
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services


ms.topic: conceptual
ms.date: 05/19/2020
ms.author: jingwang

---
# Copy data from SharePoint Online List by using Azure Data Factory
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory to copy data from SharePoint Online List. The article builds on [Copy Activity in Azure Data Factory](copy-activity-overview.md), which presents a general overview of Copy Activity.

## Supported capabilities

This SharePoint Online List connector is supported for the following activities:

- [Lookup activity](control-flow-lookup-activity.md)

You can copy data from SharePoint Online List to any supported sink data store. For a list of data stores that Copy Activity supports as sources and sinks, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).

Specifically, this SharePoint List Online connector uses service principal authentication and retrieves data via OData protocol.

## Prerequisites

The SharePoint List Online connector uses service principal authentication to connect to SharePoint. Follow these steps to set it up:

1. Register an application entity in Azure Active Directory (Azure AD) by following [Register your application with an Azure AD tenant](../storage/common/storage-auth-aad-app.md#register-your-application-with-an-azure-ad-tenant). Make note of the following values, which you use to define the linked service:

   - Application ID
   - Application key
   - Tenant ID

2. Grant SharePoint Online site permission to your registered application: 

   > [!NOTE]
   >
   > This operation requires SharePoint Online site owner permission. You can find the owner by going to the site home page -> click the "X members" in the right corner -> check who has the "Owner" role.

1. 1. Open SharePoint site link e.g. `https://[tenant-name].sharepoint.com/sites/[site-name]/_layouts/15/appinv.aspx` (replace tenant and site name).
   2. Search the application ID you just registered in Step 1, fill the empty fields, and click "Create".
      1. App Domain: localhost.com
      2. Redirect URL: https://www.localhost.com
      3. Permission Request XML:
   3. ```xml
      <AppPermissionRequests AllowAppOnlyPolicy="true">
      	<AppPermissionRequest Scope="http://sharepoint/content/sitecollection/web" Right="Read"/>
      </AppPermissionRequests>
      ```

2. ![sharepoint grant permission](media/connector-sharepoint-online-list/sharepoint-online-grant-permission.png)

3. 3. Click "Trust It" for this app.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties you can use to define Data Factory entities that are specific to SharePoint Online List connector.

## Linked service properties

The following properties are supported for an SharePoint Online List linked service:

| **Property**        | **Description**                                              | **Required** |
| ------------------- | ------------------------------------------------------------ | ------------ |
| type                | The type property must be set to: **SharePointOnlineList**.  | Yes          |
| siteUrl             | The SharePoint Online site url. Eg. `https://[tenant-name].sharepoint.com/sites/[site-name]`. | Yes          |
| servicePrincipalId  | The Application (client) ID of the application registered in Azure Active Directory. | Yes          |
| servicePrincipalKey | The application's key. Mark this field as a **SecureString** to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes          |
| tenantId            | The tenant ID under which your application resides.          | Yes          |
| connectVia          | The [Integration Runtime](concepts-integration-runtime.md) to use to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, the default Azure Integration Runtime is used. | No           |

**Example:**

```json
{
    "name": "SharePointOnlineList",
    "properties": {
        "type": "SharePointOnlineList",
        "typeProperties": {
            "siteUrl": "https://[tenant-name].sharepoint.com/sites/[site-name]",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": {
                "type": "SecureString",
                "value": "<service principal key>"
            },
            "tenantId": "<tenant GUID>"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties that are available for defining datasets, see [Datasets and linked services](concepts-datasets-linked-services.md). The following section provides a list of the properties supported by the SAP table dataset.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the dataset must be set to **SharePointOnlineLResource**. | Yes |
| listName | The name of the SharePoint Online List. | Yes |

**Example**

```json
{
    "name": "SharePointOnlineListDataset",
    "properties":
    {
        "type": "SharePointOnlineListResource",
        "linkedServiceName": {
            "referenceName": "<SharePoint Online List linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties":
        {
            "listName": "MyList"
        }
    }
}
```

## Copy Activity properties

For a full list of sections and properties that are available for defining activities, see [Pipelines](concepts-pipelines-activities.md).  The following section provides a list of the properties supported by the SharePoint Online List source.

### SharePoint Online List as source

To copy data from SharePoint Online List, the following properties are supported in the Copy Activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the Copy Activity source must be set to **SharePointOnlineListSource**. | Yes |
| query | Custom OData query options for filtering data. Example: `"$top=10&$select=Title,Number"`. | No |
| httpRequestTimeout | The timeout (in second) for the HTTP request to get a response. Default is 300 (5 minutes). | No |

**Example**

```json
"activities":[
    {
        "name": "CopyFromSharePointOnlineList",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<SharePoint Online List input dataset name>",
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
            "source": {
                "type": "SharePointOnlineListSource",
                "query": "<OData query e.g. $top=10&$select=Title,Number>"
            }, 
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Data type mapping for SharePoint Online List

When you copy data from SharePoint Online List, the following mappings are used between SharePoint Online List data types and Azure Data Factory interim data types. 

| **SharePoint Online data type**                 | **OData data type**                                  | **Azure Data Factory interim data type** |
| ----------------------------------------------- | ---------------------------------------------------- | ---------------------------------------- |
| Single line of text                             | Edm.String                                           | String                                   |
| Multiple lines of text                          | Edm.String                                           | String                                   |
| Choice (menu to choose from)                    | Edm.String                                           | String                                   |
| Number (1, 1.0, 100)                            | Edm.Double                                           | Double                                   |
| Currency ($, ¥, €)                              | Edm.Double                                           | Double                                   |
| Date and Time                                   | Edm.DateTime                                         | DateTime                                 |
| Lookup (information already on this site)       | Edm.Int32                                            | Int32                                    |
| Yes/No (check box)                              | Edm.Boolean                                          | Boolean                                  |
| Person or Group                                 | Edm.Int32                                            | Int32                                    |
| Hyperlink or Picture                            | Edm.String                                           | String                                   |
| Calculated (calculation based on other columns) | Edm.String / Edm.Double / Edm.DateTime / Edm.Boolean | String / Double / DateTime / Boolean     |
| Attachment                                      | Not supported                                        |                                          |
| Task Outcome                                    | Not supported                                        |                                          |
| External Data                                   | Not supported                                        |                                          |
| Managed Metadata                                | Not supported                                        |                                          |

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Next steps

For a list of data stores that Copy Activity supports as sources and sinks in Azure Data Factory, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).