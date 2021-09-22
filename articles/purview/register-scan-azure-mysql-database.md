---
title: 'Register and scan an Azure MySQL database'
description: This tutorial describes how to scan an Azure MySQL database
author: evwhite
ms.author: evwhite
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 06/30/2021
# Customer intent: As a data steward or catalog administrator, I need to understand how to scan data into the catalog.
---

# Register and scan an Azure MySQL Database

This article describes how to register and scan an Azure MySQL database.


## Supported Capabilities
- **Full and incremental scans** to capture metadata and classification from Azure MySQL databases.

- **Lineage** between data assets for ADF copy and dataflow activities.

### Known limitations
Purview supports only SQL authentication for Azure MySQL databases.


## Prerequisites

1. Create a new Purview account if you don't already have one.

2. Networking access between your Purview account and the Azure MySQL database.

### Set up authentication for a scan

You will need **username** and **password** for the next steps.

Follow the instructions in [CREATE DATABASES AND USERS](../mysql/howto-create-users.md) to create a login for your Azure MySQL Database.

1. Navigate to your key vault in the Azure portal
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *password* from your Azure SQL Database
1. Select **Create** to complete
1. If your key vault is not connected to Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-azure-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) of type SQL authentication using the **username** and **password** to setup your scan

## Register an Azure MySQL database data source

To register a new Azure MySQL Database in your data catalog, do the following:

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

## Creating and running a scan

To create and run a new scan, do the following:

1. Select the **Data Map** tab on the left pane in the Purview Studio.

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

> [!NOTE]
> * Deleting your scan does not delete assets created from previous Azure MySQL Database scans.
> * The asset will no longer be updated with schema changes if your source table has changed and you re-scan the source table after editing the description in the schema tab of Purview.

## Next steps

- [Browse the Azure Purview Data catalog](how-to-browse-catalog.md)
- [Search the Azure Purview Data Catalog](how-to-search-catalog.md)
