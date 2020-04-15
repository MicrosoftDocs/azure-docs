---
title: Copy data from Office 365 using Azure Data Factory 
description: Learn how to copy data from Office 365 to supported sink data stores by using copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: shwang
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services


ms.topic: conceptual
ms.date: 10/20/2019
ms.author: jingwang

---
# Copy data from Office 365 into Azure using Azure Data Factory
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Azure Data Factory integrates with [Microsoft Graph data connect](https://docs.microsoft.com/graph/data-connect-concept-overview), allowing you to bring the rich organizational data in your Office 365 tenant into Azure in a scalable way and build analytics applications and extract insights based on these valuable data assets. Integration with Privileged Access Management provides secured access control for the valuable curated data in Office 365.  Please refer to [this link](https://docs.microsoft.com/graph/data-connect-concept-overview) for an overview on Microsoft Graph data connect and refer to [this link](https://docs.microsoft.com/graph/data-connect-policies#licensing) for licensing information.

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from Office 365. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities
ADF Office 365 connector and Microsoft Graph data connect enables at scale ingestion of different types of datasets from Exchange Email enabled mailboxes, including address book contacts, calendar events, email messages, user information, mailbox settings, and so on.  Refer [here](https://docs.microsoft.com/graph/data-connect-datasets) to see the complete list of datasets available.

For now, within a single copy activity you can only **copy data from Office 365 into [Azure Blob Storage](connector-azure-blob-storage.md), [Azure Data Lake Storage Gen1](connector-azure-data-lake-store.md), and [Azure Data Lake Storage Gen2](connector-azure-data-lake-storage.md) in JSON format** (type setOfObjects). If you want to load Office 365 into other types of data stores or in other formats, you can chain the first copy activity with a subsequent copy activity to further load data into any of the [supported ADF destination stores](copy-activity-overview.md#supported-data-stores-and-formats) (refer to "supported as a sink" column in the "Supported data stores and formats" table).

>[!IMPORTANT]
>- The Azure subscription containing the data factory and the sink data store must be under the same Azure Active Directory (Azure AD) tenant as Office 365 tenant.
>- Ensure the Azure Integration Runtime region used for copy activity as well as the destination is in the same region where the Office 365 tenant users' mailbox is located. Refer [here](concepts-integration-runtime.md#integration-runtime-location) to understand how the Azure IR location is determined. Refer to [table here](https://docs.microsoft.com/graph/data-connect-datasets#regions) for the list of supported Office regions and corresponding Azure regions.
>- Service Principal authentication is the only authentication mechanism supported for Azure Blob Storage, Azure Data Lake Storage Gen1, and Azure Data Lake Storage Gen2 as destination stores.

## Prerequisites

To copy data from Office 365 into Azure, you need to complete the following prerequisite steps:

- Your Office 365 tenant admin must complete on-boarding actions as described [here](https://docs.microsoft.com/graph/data-connect-get-started).
- Create and configure an Azure AD web application in Azure Active Directory.  For instructions, see [Create an Azure AD application](../active-directory/develop/howto-create-service-principal-portal.md#create-an-azure-active-directory-application).
- Make note of the following values, which you will use to define the linked service for Office 365:
    - Tenant ID. For instructions, see [Get tenant ID](../active-directory/develop/howto-create-service-principal-portal.md#get-values-for-signing-in).
    - Application ID and Application key.  For instructions, see [Get application ID and authentication key](../active-directory/develop/howto-create-service-principal-portal.md#get-values-for-signing-in).
- Add the user identity who will be making the data access request as the owner of the Azure AD web application (from the Azure AD web application > Settings > Owners > Add owner). 
    - The user identity must be in the Office 365 organization you are getting data from and must not be a Guest user.

## Approving new data access requests

If this is the first time you are requesting data for this context (a combination of which data table is being access, which destination account is the data being loaded into, and which user identity is making the data access request), you will see the copy activity status as "In Progress", and only when you click into ["Details" link under Actions](copy-activity-overview.md#monitoring) will you see the status as “RequestingConsent”.  A member of the data access approver group needs to approve the request in the Privileged Access Management before the data extraction can proceed.

Refer [here](https://docs.microsoft.com/graph/data-connect-tips#approve-pam-requests-via-office-365-admin-portal) on how the approver can approve the data access request, and refer [here](https://docs.microsoft.com/graph/data-connect-pam) for an explanation on the overall integration with Privileged Access Management, including how to set up the data access approver group.

## Policy validation

If ADF is created as part of a managed app and Azure policies assignments are made on resources within the management resource group, then for every copy activity run, ADF will check to make sure the policy assignments are enforced. Refer [here](https://docs.microsoft.com/graph/data-connect-policies#policies) for a list of supported policies.

## Getting started

>[!TIP]
>For a walkthrough of using Office 365 connector, see [Load data from Office 365](load-office-365-data.md) article.

You can create a pipeline with the copy activity by using one of the following tools or SDKs. Select a link to go to a tutorial with step-by-step instructions to create a pipeline with a copy activity. 

- [Azure portal](quickstart-create-data-factory-portal.md)
- [.NET SDK](quickstart-create-data-factory-dot-net.md)
- [Python SDK](quickstart-create-data-factory-python.md)
- [Azure PowerShell](quickstart-create-data-factory-powershell.md)
- [REST API](quickstart-create-data-factory-rest-api.md)
- [Azure Resource Manager template](quickstart-create-data-factory-resource-manager-template.md). 

The following sections provide details about properties that are used to define Data Factory entities specific to Office 365 connector.

## Linked service properties

The following properties are supported for Office 365 linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **Office365** | Yes |
| office365TenantId | Azure tenant ID to which the Office 365 account belongs. | Yes |
| servicePrincipalTenantId | Specify the tenant information under which your Azure AD web application resides. | Yes |
| servicePrincipalId | Specify the application's client ID. | Yes |
| servicePrincipalKey | Specify the application's key. Mark this field as a SecureString to store it securely in Data Factory. | Yes |
| connectVia | The Integration Runtime to be used to connect to the data store.  If not specified, it uses the default Azure Integration Runtime. | No |

>[!NOTE]
> The difference between **office365TenantId** and **servicePrincipalTenantId** and the corresponding value to provide:
>- If you are an enterprise developer developing an application against Office 365 data for your own organization's usage, then you should supply the same tenant ID for both properties, which is your organization's AAD tenant ID.
>- If you are an ISV developer developing an application for your customers, then office365TenantId will be your customer’s (application installer) AAD tenant ID and servicePrincipalTenantId will be your company’s AAD tenant ID.

**Example:**

```json
{
    "name": "Office365LinkedService",
    "properties": {
        "type": "Office365",
        "typeProperties": {
            "office365TenantId": "<Office 365 tenant id>",
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

For a full list of sections and properties available for defining datasets, see the [datasets](concepts-datasets-linked-services.md) article. This section provides a list of properties supported by Office 365 dataset.

To copy data from Office 365, the following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **Office365Table** | Yes |
| tableName | Name of the dataset to extract from Office 365. Refer [here](https://docs.microsoft.com/graph/data-connect-datasets#datasets) for the list of Office 365 datasets available for extraction. | Yes |

If you were setting `dateFilterColumn`, `startTime`, `endTime`, and `userScopeFilterUri` in dataset, it is still supported as-is, while you are suggested to use the new model in activity source going forward.

**Example**

```json
{
    "name": "DS_May2019_O365_Message",
    "properties": {
        "type": "Office365Table",
        "linkedServiceName": {
            "referenceName": "<Office 365 linked service name>",
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

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by Office 365 source.

### Office 365 as source

To copy data from Office 365, the following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **Office365Source** | Yes |
| allowedGroups | Group selection predicate.  Use this property to select up to 10 user groups for whom the data will be retrieved.  If no groups are specified, then data will be returned for the entire organization. | No |
| userScopeFilterUri | When `allowedGroups` property is not specified, you can use a predicate expression that is applied on the entire tenant to filter the specific rows to extract from Office 365. The predicate format should match the query format of Microsoft Graph APIs, e.g. `https://graph.microsoft.com/v1.0/users?$filter=Department eq 'Finance'`. | No |
| dateFilterColumn | Name of the DateTime filter column. Use this property to limit the time range for which Office 365 data is extracted. | Yes if dataset has one or more DateTime columns. Refer [here](https://docs.microsoft.com/graph/data-connect-filtering#filtering) for list of datasets that require this DateTime filter. |
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
                "referenceName": "<Office 365 input dataset name>",
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

## Next steps
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
