---
title: 'Connect to and manage Azure MySQL database'
description: This guide describes how to connect to Azure MySQL database in Azure Purview, and use Purview's features to scan and manage your Azure MySQL database source.
author: evwhite
ms.author: evwhite
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 10/14/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Connect to and manage Azure MySQL databases in Azure Purview

This article outlines how to register an Azure MySQL database, as well as how to authenticate and interact with Azure MySQL databases in Azure Purview. For more information about Azure Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Share**|**Access Policy**|**Lineage**|
|---|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan)| [Yes](#scan) | [Yes](#scan) | [Yes](#scan) | No | No | [Data Factory Lineage](how-to-link-azure-data-factory.md) |

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Purview resource](create-catalog-portal.md).

* You will need to be to be a Data Source Administrator and Data Reader to register a source and manage it in the Purview Studio. See our [Azure Purview Permissions page](catalog-permissions.md) for details.

## Register

This section describes how to register an Azure MySQL database in Azure Purview using the [Purview Studio](https://web.purview.azure.com/).

### Authentication for registration

You will need **username** and **password** for the next steps.

Follow the instructions in [CREATE DATABASES AND USERS](../mysql/howto-create-users.md) to create a login for your Azure MySQL Database.

1. Navigate to your key vault in the Azure portal
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *password* from your Azure SQL Database
1. Select **Create** to complete
1. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) of type SQL authentication using the **username** and **password** to setup your scan.

### Steps to register

To register a new Azure MySQL database in your data catalog, do the following:

1. Navigate to your Purview account.

1. Select **Data Map** on the left navigation.

1. Select **Register**.

1. On **Register sources**, select **Azure MySQL Database**. Select **Continue**.

:::image type="content" source="media/register-scan-azure-mysql/01-register-azure-mysql-data-source.png" alt-text="register new data source" border="true":::

On the **Register sources (Azure MySQL Database)** screen, do the following:

1. Enter a **Name** for your data source. This will be the display name for this data source in your Catalog.
1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop-down box and the appropriate server from the **Server name** drop-down box.
1. Select **Register** to register the data source.

:::image type="content" source="media/register-scan-azure-mysql/02-register-azure-mysql-name-connection.png" alt-text="register sources options" border="true":::

## Scan

Follow the steps below to scan Azure MySQL database to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md)

### Create and run scan

To create and run a new scan, do the following:

1. Select the **Data Map** tab on the left pane in the [Purview Studio](https://web.purview.azure.com/resource/).

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

Now that you have registered your source, follow the below guides to learn more about Purview and your data.

- [Data insights in Azure Purview](oncept-insights.md)
- [Lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)