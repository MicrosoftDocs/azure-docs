---
title: Connect to and manage Azure Files
description: This guide describes how to connect to Azure Files in Microsoft Purview, and use Microsoft Purview's features to scan and manage your Azure Files source.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 11/02/2021
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage Azure Files in Microsoft Purview

This article outlines how to register Azure Files, and how to authenticate and interact with Azure Files in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan) | [Yes](#scan) | [Yes](#scan) | [Yes](#scan) | No | Limited** | No |

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md) 

Azure Files supports full and incremental scans to capture the metadata and classifications, based on system default and custom classification rules.

For file types such as csv, tsv, psv, ssv, the schema is extracted when the following logics are in place:

1. First row values are non-empty
2. First row values are unique
3. First row values are neither a date nor a number

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Microsoft Purview governance portal. See our [Microsoft Purview Permissions page](catalog-permissions.md) for details.

## Register

This section describes how to register Azure Files in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Authentication for registration

Currently there's only one way to set up authentication for Azure file shares:

- Account Key

#### Account Key to register

When authentication method selected is **Account Key**, you need to get your access key and store in the key vault:

1. Navigate to your storage account
1. Select **Settings > Access keys**
1. Copy your *key* and save it somewhere for the next steps
1. Navigate to your key vault
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *key* from your storage account
1. Select **Create** to complete
1. If your key vault isn't connected to Microsoft Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) using the key to set up your scan

### Steps to register

To register a new Azure Files account in your data catalog, follow these steps:

1. Navigate to your Microsoft Purview Data Studio.
1. Select **Data Map** on the left navigation.
1. Select **Register**
1. On **Register sources**, select **Azure Files**
1. Select **Continue**

:::image type="content" source="media/register-scan-azure-files/register-sources.png" alt-text="register new data source" border="true":::

On the **Register sources (Azure Files)** screen, follow these steps:

1. Enter a **Name** that the data source will be listed with in the Catalog.
2. Choose your Azure subscription to filter down Azure Storage Accounts.
3. Select an Azure Storage Account.
4. Select a collection or create a new one (Optional).
5. Select **Register** to register the data source.

:::image type="content" source="media/register-scan-azure-files/azure-file-register-source.png" alt-text="register sources options" border="true":::

## Scan

Follow the steps below to scan Azure Files to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md)

### Create and run scan

To create and run a new scan, follow these steps:

1. Select the **Data Map** tab on the left pane in the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Select the Azure Files source that you registered.

1. Select **New scan**

1. Select the account key credential to connect to your data source.

   :::image type="content" source="media/register-scan-azure-files/set-up-scan-azure-file.png" alt-text="Set up scan":::

1. You can scope your scan to specific databases by choosing the appropriate items in the list.

   :::image type="content" source="media/register-scan-azure-files/azure-file-scope-your-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/register-scan-azure-files/azure-file-scan-rule-set.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule to reoccur, or run the scan once.

   :::image type="content" source="media/register-scan-azure-files/trigger-scan.png" alt-text="trigger":::

1. Review your scan and select **Save and run**.

[!INCLUDE [create and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you have registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
