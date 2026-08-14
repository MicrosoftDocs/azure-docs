---
title: Copy data from SharePoint Online List
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from SharePoint Online List to supported sink data stores by using a copy activity in an Azure Data Factory or Azure Synapse Analytics pipeline.
author: simplywilson
ms.subservice: data-movement
ms.topic: concept-article
ms.date: 07/25/2025
ms.author: tinglee
ms.custom:
  - synapse
  - sfi-image-nochange
---
# Copy data from SharePoint Online List by using Azure Data Factory or Azure Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE [Migrate to Data Factory in Microsoft Fabric](includes/migrate-to-fabric.md)]

This article outlines how to use Copy Activity in Azure Data Factory and Azure Synapse pipelines to copy data from SharePoint Online List. The article builds on [Copy Activity](copy-activity-overview.md), which presents a general overview of Copy Activity.

> [!NOTE]
> This connector is also available in [Data Factory in Microsoft Fabric](/fabric/data-factory/data-factory-overview). For Fabric-specific configuration and features, see the [Fabric SharePoint Online List connector documentation](/fabric/data-factory/connector-sharepoint-online-list-overview).


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

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to a SharePoint Online List using UI

Use the following steps to create a linked service to a SharePoint Online List in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then select New:

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
| siteUrl             | The SharePoint Online site url, for example, `https://contoso.sharepoint.com/sites/siteName`. | Yes          |
| servicePrincipalId  | The Application (client) ID of the application registered in Microsoft Entra ID. | Yes          |
| servicePrincipalCredentialType | Specify the credential type to use for service principal authentication. Allowed values are `ServicePrincipalCert` and `ServicePrincipalKey`. | No |
| ***For ServicePrincipalCert*** | | |
| servicePrincipalEmbeddedCert | Specify the base64 encoded certificate of your application registered in Microsoft Entra ID, and ensure the certificate content type is **PKCS #12**. Mark this field as a **SecureString** to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). You need to configure the permission settings referring this [article](/sharepoint/dev/solution-guidance/security-apponly-azuread).| No |
| servicePrincipalEmbeddedCertPassword | Specify the password of your certificate if your certificate is secured with a password. Mark this field as a **SecureString** to store it securely, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |
|  |  |  |
| tenantId            | The tenant ID under which your application resides.          | Yes          |
| connectVia          | The [Integration Runtime](concepts-integration-runtime.md) to use to connect to the data store. If not specified, the default Azure Integration Runtime is used. | No           |

>[!Note]
>If you use service principal key authentication, which is based on Azure ACS (Access Control Services), switch to **service principal certificate authentication** due to the [ACS retirement plan](/sharepoint/dev/sp-add-ins/retirement-announcement-for-azure-acs).

**Example : Using service principal certificate authentication**

```json
{
    "name": "SharePointOnlineList",
    "properties": {
        "type": "SharePointOnlineList",
        "typeProperties": {
            "siteUrl": "<site URL>",
            "servicePrincipalId": "<service principal id>",
            "servicePrincipalCredentialType": "ServicePrincipalCert",
            "servicePrincipalEmbeddedCert": { 
                "type": "SecureString", 
                "value": "<base64 encoded string of (.pfx) certificate data>"
            },
            "servicePrincipalEmbeddedCertPassword": { 
                "type": "SecureString", 
                "value": "<password of your certificate>"
            },
            "tenantId": "<tenant ID>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Grant permission for using service principal certificate

The SharePoint List Online connector uses service principal authentication to connect to SharePoint. Follow these steps to set it up:

1. Generate a self-signed certificate and export both the public certificate and the certificate including its private key. To learn how, see [Create a self-signed public certificate to authenticate your application](/entra/identity-platform/howto-create-self-signed-certificate).

1. Register an application with the Microsoft identity platform. To learn how, see [Register an application with the Microsoft identity platform](/graph/auth-register-app-v2). Make note of these values, which you use to define the linked service:

    - Application ID
    - Tenant ID

1. Upload the public certificate in the **Certificates & secrets**.

1. Select **Add Permission** for **API permissions**.

1. Select **SharePoint** for **Select an API**.

1. Select **Application permissions**.

1. Select **Sites.Read.All** for **Select permissions**. To learn details about the permissions, check [Microsoft Graph permissions reference](/graph/permissions-reference#sitesreadall).

1. Select **Add permissions**.

1. Select **Grant admin consent for**.

1. Select **Yes** for **Grant admin consent confirmation**.


## Dataset properties

For a full list of sections and properties that are available for defining datasets, see [Datasets and linked services](concepts-datasets-linked-services.md). The following section provides a list of the properties supported by the SAP table dataset.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the dataset must be set to **SharePointOnlineLResource**. | Yes |
| listName | The name of the SharePoint Online List. The apostrophe (') isn't allowed in file names. | Yes |

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

For a full list of sections and properties that are available for defining activities, see [Pipelines](concepts-pipelines-activities.md). The following section provides a list of the properties supported by the SharePoint Online List source.

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

You can copy a file from SharePoint Online by using **Web activity** to authenticate and get an access token from Microsoft Entra ID. Then, pass the token to the next **Copy activity** to copy data by using **HTTP connector as source**. 

:::image type="content" source="media/connector-sharepoint-online-list/sharepoint-online-copy-file-flow.png" alt-text="sharepoint copy file flow":::

1. Follow the [Grant permission for using service principal certificate](#grant-permission-for-using-service-principal-certificate) section to create a Microsoft Entra application and grant permission to **Microsoft Graph**, not **SharePoint**.

2. Create a **Web Activity** to get the access token from SharePoint Online:

    - **URL**: `https://login.microsoftonline.com/[tenant-ID]/oauth2/v2.0/token`. Replace the tenant ID.
    - **Method**: POST
    - **Headers**:
        - Content-Type: application/x-www-form-urlencoded
    - **Body**:  `client_id=[Client-ID]&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default&client_secret=[Client-Secret]&grant_type=client_credentials`. Replace the client ID (application ID) and client secret (application key).

    > [!CAUTION]
    > Set the Secure Output option to true in Web activity to prevent the token value from being logged in plain text. Any further activities that consume this value should have their Secure Input option set to true.

3. Chain with a **Copy activity** with HTTP connector as source to copy SharePoint Online file content:

    - HTTP linked service:
        - **Base URL**: `https://graph.microsoft.com/v1.0/sites/{Your-Site-ID}/drives/{Drive-ID}/root:/{path to file}:/content`. Replace the site ID, drive ID, and relative path to file. To learn how to get Drive ID, see [List available drives](/graph/api/drive-list?view=graph-rest-1.0&tabs=http&preserve-view=true). Alternatively, you can retrieve a direct download URL from the `@microsoft.graph.downloadUrl` property of the DriveItem object and use that URL instead.
        - **Authentication type:** Anonymous *(to use the Bearer token configured in copy activity source later)*
    - Dataset: choose the format you want. To copy file as-is, select "Binary" type.
    - Copy activity source:
        - **Request method**: GET
        - **Additional header**: use the following expression`@{concat('Authorization: Bearer ', activity('<Web-activity-name>').output.access_token)}`, which uses the Bearer token generated by the upstream Web activity as authorization header. Replace the Web activity name.
    - Configure the copy activity sink for any supported sink destination.

> [!NOTE]
> Even if a Microsoft Entra application has `FullControl` permissions on SharePoint Online, you can't copy files from document libraries with IRM enabled.

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Related content

For a list of data stores that Copy Activity supports as sources and sinks, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).
