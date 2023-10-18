---
title: Copy and transform data from Microsoft 365 (Office 365)
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy and transform data from Microsoft 365 (Office 365) to supported sink data stores by using copy and mapping data flow activity in an Azure Data Factory or Synapse Analytics pipeline.
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse, ignite-2022
ms.topic: conceptual
ms.date: 11/28/2022
ms.author: jianleishen
---
# Copy and transform data from Microsoft 365 (Office 365) into Azure using Azure Data Factory or Synapse Analytics
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Azure Data Factory and Synapse Analytics pipelines integrate with [Microsoft Graph data connect](/graph/data-connect-concept-overview), allowing you to bring the rich organizational data in your Microsoft 365 (Office 365) tenant into Azure in a scalable way and build analytics applications and extract insights based on these valuable data assets. Integration with Privileged Access Management provides secured access control for the valuable curated data in Microsoft 365 (Office 365).  Please refer to [this link](/graph/data-connect-concept-overview) for an overview of Microsoft Graph data connect.

This article outlines how to use the Copy Activity to copy data and Data Flow to transform data from Microsoft 365 (Office 365). For an introduction to copy data, read the [copy activity overview](copy-activity-overview.md). For an introduction to transforming data, read [mapping data flow overview](concepts-data-flow-overview.md).

> [!NOTE]
> Microsoft 365 Data Flow connector is currently in preview. To participate, use this sign-up form: [M365 + Analytics Preview](https://aka.ms/m365-analytics-preview).

## Supported capabilities

This Microsoft 365 (Office 365) connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312;|
|[Mapping data flow](concepts-data-flow-overview.md) (source/-)|&#9312;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

ADF Microsoft 365 (Office 365) connector and Microsoft Graph Data Connect enables at scale ingestion of different types of datasets from Exchange Email enabled mailboxes, including address book contacts, calendar events, email messages, user information, mailbox settings, and so on.  Refer [here](/graph/data-connect-datasets) to see the complete list of datasets available.

For now, within a single copy activity and data flow, you can only **ingest data from Microsoft 365 (Office 365) into [Azure Blob Storage](connector-azure-blob-storage.md), [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md), and [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md) in JSON format** (type setOfObjects). When copying to Azure Blob Storage, the output is a blob containing JSON text. If you want to load Microsoft 365 (Office 365) into other types of data stores or in other formats, you can chain the first copy activity or data flow with a subsequent activity to further load data into any of the [supported ADF destination stores](copy-activity-overview.md#supported-data-stores-and-formats) (refer to "supported as a sink" column in the "Supported data stores and formats" table).

>[!IMPORTANT]
>- The Azure subscription containing the data factory or Synapse workspace and the sink data store must be under the same Microsoft Entra tenant as Microsoft 365 (Office 365) tenant.
>- Ensure the Azure Integration Runtime region used for copy activity as well as the destination is in the same region where the Microsoft 365 (Office 365) tenant users' mailbox is located. Refer [here](concepts-integration-runtime.md#integration-runtime-location) to understand how the Azure IR location is determined. Refer to [table here](/graph/data-connect-datasets#regions) for the list of supported Office regions and corresponding Azure regions.
>- Service Principal authentication is the only authentication mechanism supported for Azure Blob Storage, Azure Data Lake Storage Gen1, and Azure Data Lake Storage Gen2 as destination stores.

> [!NOTE]
> Please use Azure integration runtime in both source and sink linked services. The self-hosted integration runtime and the managed virtual network integration runtime are not supported.

## Prerequisites

To copy and transform data from Microsoft 365 (Office 365) into Azure, you need to complete the following prerequisite steps:

- Your Microsoft 365 (Office 365) tenant admin must complete on-boarding actions as described [here](/events/build-may-2021/microsoft-365-teams/breakouts/od483/).
- Create and configure a Microsoft Entra web application in Microsoft Entra ID.  For instructions, see [Create a Microsoft Entra application](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal).
- Make note of the following values, which you will use to define the linked service for Microsoft 365 (Office 365):
  - Tenant ID. For instructions, see [Get tenant ID](../active-directory/develop/howto-create-service-principal-portal.md#sign-in-to-the-application).
  - Application ID and Application key.  For instructions, see [Get application ID and authentication key](../active-directory/develop/howto-create-service-principal-portal.md#sign-in-to-the-application).
- Add the user identity who will be making the data access request as the owner of the Microsoft Entra web application (from the Microsoft Entra web application > Settings > Owners > Add owner).
  - The user identity must be in the Microsoft 365 (Office 365) organization you are getting data from and must not be a Guest user.

## Approving new data access requests

If this is the first time you are requesting data for this context (a combination of which data table is being access, which destination account is the data being loaded into, and which user identity is making the data access request), you will see the copy activity status as "In Progress", and only when you click into ["Details" link under Actions](copy-activity-overview.md#monitoring) will you see the status as "RequestingConsent".  A member of the data access approver group needs to approve the request in the Privileged Access Management before the data extraction can proceed.

Refer [here](/graph/data-connect-faq#how-can-i-approve-pam-requests-via-microsoft-365-admin-portal) on how the approver can approve the data access request, and refer [here](/graph/data-connect-pam) for an explanation on the overall integration with Privileged Access Management, including how to set up the data access approver group.


## Getting started

>[!TIP]
>For a walkthrough of using Microsoft 365 (Office 365) connector, see [Load data from Microsoft 365 (Office 365)](load-office-365-data.md) article.

You can create a pipeline with the copy activity and data flow by using one of the following tools or SDKs. Select a link to go to a tutorial with step-by-step instructions to create a pipeline with a copy activity.

- [Azure portal](quickstart-create-data-factory-portal.md)
- [.NET SDK](quickstart-create-data-factory-dot-net.md)
- [Python SDK](quickstart-create-data-factory-python.md)
- [Azure PowerShell](quickstart-create-data-factory-powershell.md)
- [REST API](quickstart-create-data-factory-rest-api.md)
- [Azure Resource Manager template](quickstart-create-data-factory-resource-manager-template.md).

## Create a linked service to Microsoft 365 (Office 365) using UI

Use the following steps to create a linked service to Microsoft 365 (Office 365) in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for Microsoft 365 (Office 365) and select the Microsoft 365 (Office 365) connector.

    :::image type="content" source="media/connector-office-365/office-365-connector.png" alt-text="Screenshot of the Microsoft 365 (Office 365) connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-office-365/configure-office-365-linked-service.png" alt-text="Screenshot of linked service configuration for Microsoft 365 (Office 365).":::

## Connector configuration details

The following sections provide details about properties that are used to define Data Factory entities specific to Microsoft 365 (Office 365) connector.

## Linked service properties

The following properties are supported for Microsoft 365 (Office 365) linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Office365** | Yes |
| office365TenantId | Azure tenant ID to which the Microsoft 365 (Office 365) account belongs. | Yes |
| servicePrincipalTenantId | Specify the tenant information under which your Microsoft Entra web application resides. | Yes |
| servicePrincipalId | Specify the application's client ID. | Yes |
| servicePrincipalKey | Specify the application's key. Mark this field as a SecureString to store it securely. | Yes |
| connectVia | The Integration Runtime to be used to connect to the data store.  If not specified, it uses the default Azure Integration Runtime. | No |

>[!NOTE]
> The difference between **office365TenantId** and **servicePrincipalTenantId** and the corresponding value to provide:
>- If you are an enterprise developer developing an application against Microsoft 365 (Office 365) data for your own organization's usage, then you should supply the same tenant ID for both properties, which is your organization's Microsoft Entra tenant ID.
>- If you are an ISV developer developing an application for your customers, then office365TenantId will be your customer's (application installer) Microsoft Entra tenant ID and servicePrincipalTenantId will be your company's Microsoft Entra tenant ID.

**Example:**

```json
{
    "name": "Office365LinkedService",
    "properties": {
        "type": "Office365",
        "typeProperties": {
            "office365TenantId": "<Microsoft 365 (Office 365) tenant id>",
            "servicePrincipalTenantId": "<AAD app service principal tenant id>",
            "servicePrincipalId": "<AAD app service principal id>",
            "servicePrincipalKey": {
                "type": "SecureString",
                "value": "<AAD app service principal key>"
            }
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Microsoft 365 (Office 365) dataset.

To copy data from Microsoft 365 (Office 365), the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **Office365Table** | Yes |
| tableName | Name of the dataset to extract from Microsoft 365 (Office 365). Refer [here](/graph/data-connect-datasets#datasets) for the list of Microsoft 365 (Office 365) datasets available for extraction. | Yes |

If you were setting `dateFilterColumn`, `startTime`, `endTime`, and `userScopeFilterUri` in dataset, it is still supported as-is, while you are suggested to use the new model in activity source going forward.

**Example**

```json
{
    "name": "DS_May2019_O365_Message",
    "properties": {
        "type": "Office365Table",
        "linkedServiceName": {
            "referenceName": "<Microsoft 365 (Office 365) linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [],
        "typeProperties": {
            "tableName": "BasicDataSet_v0.Event_v1"
        }
    }
}
```

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Microsoft 365 (Office 365) source.


### Microsoft 365 (Office 365) as source

To copy data from Microsoft 365 (Office 365), the following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **Office365Source** | Yes |
| allowedGroups | Group selection predicate.  Use this property to select up to 10 user groups for whom the data will be retrieved.  If no groups are specified, then data will be returned for the entire organization. | No |
| userScopeFilterUri | When `allowedGroups` property is not specified, you can use a predicate expression that is applied on the entire tenant to filter the specific rows to extract from Microsoft 365 (Office 365). The predicate format should match the query format of Microsoft Graph APIs, e.g. `https://graph.microsoft.com/v1.0/users?$filter=Department eq 'Finance'`. | No |
| dateFilterColumn | Name of the DateTime filter column. Use this property to limit the time range for which Microsoft 365 (Office 365) data is extracted. | Yes if dataset has one or more DateTime columns. Refer [here](/graph/data-connect-filtering#filtering) for list of datasets that require this DateTime filter. |
| startTime | Start DateTime value to filter on. | Yes if `dateFilterColumn` is specified |
| endTime | End DateTime value to filter on. | Yes if `dateFilterColumn` is specified |
| outputColumns | Array of the columns to copy to sink. | No |

**Example:**

```json
"activities": [
    {
        "name": "CopyFromO365ToBlob",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Microsoft 365 (Office 365) input dataset name>",
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
                "type": "Office365Source",
                "dateFilterColumn": "CreatedDateTime",
                "startTime": "2019-04-28T16:00:00.000Z",
                "endTime": "2019-05-05T16:00:00.000Z",
                "userScopeFilterUri": "https://graph.microsoft.com/v1.0/users?$filter=Department eq 'Finance'",
                "outputColumns": [
                    {
                        "name": "Id"
                    },
                    {
                        "name": "CreatedDateTime"
                    },
                    {
                        "name": "LastModifiedDateTime"
                    },
                    {
                        "name": "ChangeKey"
                    },
                    {
                        "name": "Categories"
                    },
                    {
                        "name": "OriginalStartTimeZone"
                    },
                    {
                        "name": "OriginalEndTimeZone"
                    },
                    {
                        "name": "ResponseStatus"
                    },
                    {
                        "name": "iCalUId"
                    },
                    {
                        "name": "ReminderMinutesBeforeStart"
                    },
                    {
                        "name": "IsReminderOn"
                    },
                    {
                        "name": "HasAttachments"
                    },
                    {
                        "name": "Subject"
                    },
                    {
                        "name": "Body"
                    },
                    {
                        "name": "Importance"
                    },
                    {
                        "name": "Sensitivity"
                    },
                    {
                        "name": "Start"
                    },
                    {
                        "name": "End"
                    },
                    {
                        "name": "Location"
                    },
                    {
                        "name": "IsAllDay"
                    },
                    {
                        "name": "IsCancelled"
                    },
                    {
                        "name": "IsOrganizer"
                    },
                    {
                        "name": "Recurrence"
                    },
                    {
                        "name": "ResponseRequested"
                    },
                    {
                        "name": "ShowAs"
                    },
                    {
                        "name": "Type"
                    },
                    {
                        "name": "Attendees"
                    },
                    {
                        "name": "Organizer"
                    },
                    {
                        "name": "WebLink"
                    },
                    {
                        "name": "Attachments"
                    },
                    {
                        "name": "BodyPreview"
                    },
                    {
                        "name": "Locations"
                    },
                    {
                        "name": "OnlineMeetingUrl"
                    },
                    {
                        "name": "OriginalStart"
                    },
                    {
                        "name": "SeriesMasterId"
                    }
                ]
            },
            "sink": {
                "type": "BlobSink"
            }
        }
    }
]
```

## Transform data with the Microsoft 365 connector

Microsoft 365 datasets can be used as a source with mapping data flows. The data flow will transform the data by flattening the dataset automatically. This allows users to concentrate on leveraging the flattened dataset to accelerate their analytics scenarios.

### Mapping data flow properties

To create a mapping data flow using the Microsoft 365 connector as a source, complete the following steps:

1.	In ADF Studio, go to the **Data flows** section of the **Author** hub, select the **…** button to drop down the **Data flow actions** menu, and select the **New data flow** item. Turn on debug mode by using the **Data flow debug** button in the top bar of data flow canvas.

    :::image type="content" source="media/connector-office-365/connector-office-365-mapping-data-flow-data-flow-debug.png" alt-text="Screenshot of the data flow debug button in mapping data flow.":::

2. In the mapping data flow editor, select **Add Source**.

    :::image type="content" source="media/connector-office-365/connector-office-365-mapping-data-flow-add-source.png" alt-text="Screenshot of add source in mapping data flow.":::

3. On the tab **Source settings**, select **Inline** in the **Source type** property, **Microsoft 365 (Office 365)** in the **Inline dataset type**, and the Microsoft 365 linked service that you have created earlier.

    :::image type="content" source="media/connector-office-365/connector-office-365-mapping-data-flow-select-dataset.png" alt-text="Screenshot of the select dataset option in source settings of mapping data flow source.":::

4. On the tab **Source options** select the **Table name** of the Microsoft 365 table that you would like to transform. Also select the **Auto flatten** option to decide if you would like data flow to auto flatten the source dataset.

    :::image type="content" source="media/connector-office-365/connector-office-365-mapping-data-flow-source-options.png" alt-text="Screenshot of the source options of mapping data flow source.":::

5. For the tabs **Projection**, **Optimize** and **Inspect**, please follow [mapping data flow](concepts-data-flow-overview.md).

6. On the tab **Data preview** click on the **Refresh** button to fetch a sample dataset for validation.

## Next steps
For a list of data stores supported as sources and sinks by the copy activity, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
