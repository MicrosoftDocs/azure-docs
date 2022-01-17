---
title: 'Connect to and manage Azure Data Explorer'
description: This guide describes how to connect to Azure Data Explorer in Azure Purview, and use Azure Purview's features to scan and manage your Azure Data Explorer source.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 12/03/2021
ms.custom: ignite-fall-2021
---

# Connect to and manage Azure Data Explorer in Azure Purview


This article outlines how to register Azure Data Explorer, and how to authenticate and interact with Azure Data Explorer in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan) | [Yes](#scan) | [Yes](#scan)| [Yes](#scan)| No | No** |

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md) 

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Azure Purview resource](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Azure Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

## Register

This section describes how to register Azure Data Explorer in Azure Purview using the [Azure Purview Studio](https://web.purview.azure.com/).

### Authentication for registration

There are several methods available for authentication for Azure Data Explorer:

- [Service Principal](#service-principal-to-register)
- [System-assigned managed identity (SAMI)](#system-or-user-assigned-managed-identity-to-register)
- [User-assigned managed identity (UAMI)](#system-or-user-assigned-managed-identity-to-register)

#### Service Principal to register

To use service principal authentication for scans, you can use an existing one or create a new one.

> [!Note]
> If you have to create a new Service Principal, please follow these steps:
> 1. Navigate to the [Azure portal](https://portal.azure.com).
> 1. Select **Azure Active Directory** from the left-hand side menu.
> 1. Select **App registrations**.
> 1. Select **+ New application registration**.
> 1. Enter a name for the **application** (the service principal name).
> 1. Select **Accounts in this organizational directory only**.
> 1. For Redirect URI select **Web** and enter any URL you want; it doesn't have to be real or work.
> 1. Then select **Register**.

It is required to get the Service Principal's application ID and secret:

1. Navigate to your Service Principal in the [Azure portal](https://portal.azure.com)
1. Copy the values the **Application (client) ID** from **Overview** and **Client secret** from **Certificates & secrets**.
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** of your choice and **Value** as the **Client secret** from your Service Principal
1. Select **Create** to complete
1. If your key vault is not connected to Azure Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the Service Principal to set up your scan

#### Granting the Service Principal access to your Azure data explorer instance

1. Navigate to the Azure portal. Then navigate to your Azure data explorer instance.

1. Add the service principal to the **AllDatabasesViewer** role in the **Permissions** tab.

### System or user assigned managed identity to register

* **System-assigned managed identity** - As soon as the Azure Purview Account is created, a system-assigned managed identity (SAMI) is created automatically in Azure AD tenant. It has the same name as your Azure Purview account.

* **User-assigned managed identity** (preview) - Similar to a system-managed identity, a user-assigned managed identity (UAMI) is a credential resource that can be used to allow Azure Purview to authenticate against Azure Active Directory. For more information, you can see our [User-assigned managed identity guide](manage-credentials.md#create-a-user-assigned-managed-identity).

To register using either of these managed identities, follow these steps:

1. If you would like to use a user-assigned managed identity and have not created one, follow the steps to create the identity in the [User-assigned managed identity guide](manage-credentials.md#create-a-user-assigned-managed-identity).

1. Navigate to the [Azure portal](https://portal.azure.com). Then navigate to your Azure data explorer instance.

1. Select the **Permissions** tab on the left pane.

1. Add the SAMI or UAMI to the **AllDatabasesViewer** role in the **Permissions** tab.

### Steps to register

To register a new Azure Data Explorer (Kusto) account in your data catalog, follow these steps:

1. Navigate to your Azure Purview account
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On **Register sources**, select **Azure Data Explorer**
1. Select **Continue**

:::image type="content" source="media/register-scan-azure-data-explorer/register-new-data-source.png" alt-text="register new data source" border="true":::

On the **Register sources (Azure Data Explorer (Kusto))** screen, do the following:

1. Enter a **Name** that the data source will be listed with in the Catalog.
2. Choose your Azure subscription to filter down Azure Data Explorer.
3. Select an appropriate cluster.
4. Select a collection or create a new one (Optional).
5. Select **Register** to register the data source.

:::image type="content" source="media/register-scan-azure-data-explorer/register-sources.png" alt-text="register sources options" border="true":::

## Scan

Follow the steps below to scan Azure Data Explorer to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md).

### Create and run scan

To create and run a new scan, follow these steps:

1. Select the **Data Map** tab on the left pane in the [Azure Purview Studio](https://web.purview.azure.com/resource/).

1. Select the Azure Data Explorer source that you registered.

1. Select **New scan**

1. Select the credential to connect to your data source. 

   :::image type="content" source="media/register-scan-azure-data-explorer/set-up-scan-data-explorer.png" alt-text="Set up scan":::

1. You can scope your scan to specific databases by choosing the appropriate items in the list.

   :::image type="content" source="media/register-scan-azure-data-explorer/scope-your-scan-data-explorer.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/register-scan-azure-data-explorer/scan-rule-set-data-explorer.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/register-scan-azure-data-explorer/trigger-scan.png" alt-text="trigger":::

1. Review your scan and select **Save and run**.

[!INCLUDE [view and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you have registered your source, follow the below guides to learn more about Azure Purview and your data.

- [Data insights in Azure Purview](concept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
