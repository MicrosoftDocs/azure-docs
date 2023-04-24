---
title: 'Connect to and manage Azure Database for MySQL'
description: This guide describes how to connect to Azure Database for MySQL in Microsoft Purview, and use Microsoft Purview's features to scan and manage your Azure Database for MySQL source.
author: heniot
ms.author: shjia
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 12/13/2022
ms.custom: template-how-to, ignite-fall-2021, fasttrack-edit
---

# Connect to and manage Azure Database for MySQL in Microsoft Purview

This article outlines how to register a database in Azure Database for MySQL, and how to authenticate and interact with Azure Database for MySQL in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Labeling**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan)| [Yes*](#scan) | [Yes](#scan) | [Yes](#scan) | [Yes](create-sensitivity-label.md) | No | Limited** | No |

\* Microsoft Purview relies on UPDATE_TIME metadata from Azure Database for MySQL for incremental scans. In some cases, this field might not persist in the database and a full scan is performed. For more information, see [The INFORMATION_SCHEMA TABLES Table](https://dev.mysql.com/doc/refman/5.7/en/information-schema-tables-table.html) for MySQL.

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md) 

> [!Important]
>  Microsoft Purview only supports single server deployment option for Azure Database for MySQL. 

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* You'll need to be a Data Source Administrator and Data Reader to register a source and manage it in the Microsoft Purview governance portal. See our [Microsoft Purview Permissions page](catalog-permissions.md) for details.

## Register

This section describes how to register an Azure Database for MySQL in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Authentication for registration

You'll need **username** and **password** for the next steps.

Follow the instructions in [CREATE DATABASES AND USERS](../mysql/howto-create-users.md) to create a login for your Azure Database for MySQL.

1. Navigate to your key vault in the Azure portal
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *password* from your Azure SQL Database
1. Select **Create** to complete
1. If your key vault isn't connected to Microsoft Purview yet, you'll need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) of type SQL authentication using the **username** and **password** to set up your scan.

### Steps to register

To register a new Azure Database for MySQL in your data catalog, do the following:

1. Open the Microsoft Purview governance portal by:

   - Browsing directly to [https://web.purview.azure.com](https://web.purview.azure.com) and selecting your Microsoft Purview account.
   - Opening the [Azure portal](https://portal.azure.com), searching for and selecting the Microsoft Purview account. Selecting the [**the Microsoft Purview governance portal**](https://web.purview.azure.com/) button.
1. Select **Data Map** on the left navigation.

1. Select **Register**.

1. On **Register sources**, select **Azure Database for MySQL**. Select **Continue**.

:::image type="content" source="media/register-scan-azure-mysql/01-register-azure-mysql-data-source.png" alt-text="register new data source" border="true":::

On the **Register sources (Azure Database for MySQL)** screen, do the following:

1. Enter a **Name** for your data source. This will be the display name for this data source in your Catalog.
1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop-down box and the appropriate server from the **Server name** drop-down box.
1. Select **Register** to register the data source.

:::image type="content" source="media/register-scan-azure-mysql/02-register-azure-mysql-name-connection.png" alt-text="register sources options" border="true":::

## Scan

Follow the steps below to scan Azure Database for MySQL to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md)

### Create and run scan

To create and run a new scan, do the following:

1. Select the **Data Map** tab on the left pane in the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Select the Azure Database for MySQL source that you registered.

1. Select **New scan**

1. Select the credential to connect to your data source and check your connection to make sure your credential is properly configured.

   :::image type="content" source="media/register-scan-azure-mysql/03-new-scan-azure-mysql-connection-credential.png" alt-text="Set up scan":::

1. You can scope your scan to specific folders or subfolders by choosing the appropriate items in the list.

   :::image type="content" source="media/register-scan-azure-mysql/04-scope-azure-mysql-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/register-scan-azure-mysql/05-scan-rule-set.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/register-scan-azure-mysql/06-trigger-scan.png" alt-text="trigger":::

1. Review your scan and select **Save and run**.-->

:::image type="content" source="media/register-scan-azure-mysql/07-review-your-scan.png" alt-text="review your scan" border="true":::

[!INCLUDE [view and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you've registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
