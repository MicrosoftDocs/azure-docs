---
title: Copy data from SharePoint Online List
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from SharePoint Online List to supported sink data stores by using a copy activity in an Azure Data Factory or Azure Synapse Analytics pipeline.
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 06/26/2023
ms.author: jianleishen
---
# Copy data from SharePoint Online List by using Azure Data Factory or Azure Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory and Azure Synapse pipelines to copy data from SharePoint Online List. The article builds on [Copy Activity](copy-activity-overview.md), which presents a general overview of Copy Activity.

## Supported capabilities

This SharePoint Online List connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*

For a list of data stores that are supported as sources or sinks, see the [Supported data stores](connector-overview.md#supported-data-stores) table.


Specifically, this SharePoint List Online connector uses service principal authentication and retrieves data via OData protocol.

> [!TIP]
> This connector supports copying data from SharePoint Online **List** but not file. Learn how to copy file from [Copy file from SharePoint Online](#copy-file-from-sharepoint-online) section.

## Prerequisites

The SharePoint List Online connector uses service principal authentication to connect to SharePoint. Follow these steps to set it up:

1. Register an application with the Microsoft identity platform. To learn how, see [Quickstart: Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md). Make note of these values, which you use to define the linked service:

    - Application ID
    - Application key
    - Tenant ID

2. Grant SharePoint Online site permission to your registered application by following the steps below. To do this, you need a site admin role.

    1. Open SharePoint Online site link e.g. `https://[your_site_url]/_layouts/15/appinv.aspx` (replace the site URL).
    2. Search the application ID you registered, fill the empty fields, and click "Create".

        - App Domain: `contoso.com`
        - Redirect URL: `https://www.contoso.com`
        - Permission Request XML:  

            ```xml
            <AppPermissionRequests AllowAppOnlyPolicy="true">
                <AppPermissionRequest Scope="http://sharepoint/content/sitecollection/web" Right="Read"/>
            </AppPermissionRequests>
            ```

            :::image type="content" source="media/connector-sharepoint-online-list/sharepoint-online-grant-permission-admin.png" alt-text="Grant SharePoint Online site permission to your registered application when you have site admin role.":::
            
        > [!NOTE]
        > In the context of configuring the SharePoint connector, the "App Domain" and "Redirect URL" refer to the SharePoint app that you have registered in Microsoft Entra ID to allow access to your SharePoint data. The "App Domain" is the domain where your SharePoint site is hosted. For example, if your SharePoint site is located at "https://contoso.sharepoint.com", then the "App Domain" would be "contoso.sharepoint.com". The "Redirect URL" is the URL that the SharePoint app will redirect to after the user has authenticated and granted permissions to the app. This URL should be a page on your SharePoint site that the app has permission to access. For example, you could use the URL of a page that displays a list of files in a library, or a page that displays the contents of a document.

    3. Click "Trust It" for this app.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to a SharePoint Online List using UI

Use the following steps to create a linked service to a SharePoint Online List in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for SharePoint and select the SharePoint Online List connector.

    :::image type="content" source="media/connector-sharepoint-online-list/sharepoint-online-list-connector.png" alt-text="Screenshot of the SharePoint Online List connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-sharepoint-online-list/configure-sharepoint-online-list-linked-service.png" alt-text="Screenshot of linked service configuration for a SharePoint Online List.":::

## Connector configuration details

The following sections provide details about properties you can use to define entities that are specific to SharePoint Online List connector.

## Linked service properties

The following properties are supported for a SharePoint Online List linked service:

| **Property**        | **Description**                                              | **Required** |
| ------------------- | ------------------------------------------------------------ | ------------ |
| type                | The type property must be set to: **SharePointOnlineList**.  | Yes          |
| siteUrl             | The SharePoint Online site url, e.g. `https://contoso.sharepoint.com/sites/siteName`. | Yes          |
| servicePrincipalId  | The Application (client) ID of the application registered in Microsoft Entra ID. Refer to [Prerequisites](#prerequisites) for more details including the permission settings.| Yes          |
| servicePrincipalKey | The application's key. Mark this field as a **SecureString** to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes          |
| tenantId            | The tenant ID under which your application resides.          | Yes          |
| connectVia          | The [Integration Runtime](concepts-integration-runtime.md) to use to connect to the data store. If not specified, the default Azure Integration Runtime is used. | No           |


**Example:**

```json
{
    "name": "SharePointOnlineList",
    "properties": {
        "type": "SharePointOnlineList",
        "typeProperties": {
            "siteUrl": "<site URL>",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalKey": {
                "type": "SecureString",
                "value": "<service principal key>"
            },
            "tenantId": "<tenant ID>"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties that are available for defining datasets, see [Datasets and linked services](concepts-datasets-linked-services.md). The following section provides a list of the properties supported by the SAP table dataset.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the dataset must be set to **SharePointOnlineLResource**. | Yes |
| listName | The name of the SharePoint Online List. Note that the apostrophe (') is not allowed in file names. | Yes |

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
            "listName": "<name of the list>"
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

> [!NOTE]
> It isn't possible to select more than one *choice* data type for a SharePoint Online List source.

## Data type mapping for SharePoint Online List

When you copy data from SharePoint Online List, the following mappings are used between SharePoint Online List data types and interim data types used by the service internally.

| **SharePoint Online data type**                 | **OData data type**                                  | **Interim data type** |
| ----------------------------------------------- | ---------------------------------------------------- | ---------------------------------------- |
| Single line of text                             | Edm.String                                           | String                                   |
| Multiple lines of text                          | Edm.String                                           | String                                   |
| Choice (menu to choose from)                    | Edm.String                                           | String                                   |
| Number (1, 1.0, 100)                            | Edm.Double                                           | Double                                   |
| Currency ($, ¥, &euro;)                              | Edm.Double                                           | Double                                   |
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

## Copy file from SharePoint Online

You can copy file from SharePoint Online by using **Web activity** to authenticate and grab access token from SPO, then passing to subsequent **Copy activity** to copy data with **HTTP connector as source**.

:::image type="content" source="media/connector-sharepoint-online-list/sharepoint-online-copy-file-flow.png" alt-text="sharepoint copy file flow":::

1. Follow the [Prerequisites](#prerequisites) section to create Microsoft Entra application and grant permission to SharePoint Online. 

2. Create a **Web Activity** to get the access token from SharePoint Online:

    - **URL**: `https://accounts.accesscontrol.windows.net/[Tenant-ID]/tokens/OAuth/2`. Replace the tenant ID.
    - **Method**: POST
    - **Headers**:
        - Content-Type: application/x-www-form-urlencoded
    - **Body**:  `grant_type=client_credentials&client_id=[Client-ID]@[Tenant-ID]&client_secret=[Client-Secret]&resource=00000003-0000-0ff1-ce00-000000000000/[Tenant-Name].sharepoint.com@[Tenant-ID]`. Replace the client ID (application ID), client secret (application key), tenant ID, and tenant name (of the SharePoint tenant).

    > [!CAUTION]
    > Set the Secure Output option to true in Web activity to prevent the token value from being logged in plain text. Any further activities that consume this value should have their Secure Input option set to true.

3. Chain with a **Copy activity** with HTTP connector as source to copy SharePoint Online file content:

    - HTTP linked service:
        - **Base URL**: `https://[site-url]/_api/web/GetFileByServerRelativeUrl('[relative-path-to-file]')/$value`. Replace the site URL and relative path to file. Make sure to include the SharePoint site URL along with the Domain name, such as `https://[sharepoint-domain-name].sharepoint.com/sites/[sharepoint-site]/_api/web/GetFileByServerRelativeUrl('/sites/[sharepoint-site]/[relative-path-to-file]')/$value`.
        - **Authentication type:** Anonymous *(to use the Bearer token configured in copy activity source later)*
    - Dataset: choose the format you want. To copy file as-is, select "Binary" type.
    - Copy activity source:
        - **Request method**: GET
        - **Additional header**: use the following expression`@{concat('Authorization: Bearer ', activity('<Web-activity-name>').output.access_token)}`, which uses the Bearer token generated by the upstream Web activity as authorization header. Replace the Web activity name.
    - Configure the copy activity sink as usual.

> [!NOTE]
> Even if a Microsoft Entra application has `FullControl` permissions on SharePoint Online, you can't copy files from document libraries with IRM enabled.

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Next steps

For a list of data stores that Copy Activity supports as sources and sinks, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).
