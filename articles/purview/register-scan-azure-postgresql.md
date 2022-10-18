---
title: 'Connect to and manage an Azure Database for PostgreSQL'
description: This guide describes how to connect to an Azure Database for PostgreSQL single server in Microsoft Purview, and use Microsoft Purview's features to scan and manage your Azure Database for PostgreSQL source.
author: evangelinew
ms.author: evwhite
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 11/02/2021
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to and manage an Azure Database for PostgreSQL in Microsoft Purview

This article outlines how to register an Azure Database for PostgreSQL deployed with single server deployment option, as well as how to authenticate and interact with an Azure Database for PostgreSQL in Microsoft Purview. For more information about Microsoft Purview, read the [introductory article](overview.md).

## Supported capabilities

|**Metadata Extraction**|  **Full Scan**  |**Incremental Scan**|**Scoped Scan**|**Classification**|**Access Policy**|**Lineage**|**Data Sharing**|
|---|---|---|---|---|---|---|---|
| [Yes](#register) | [Yes](#scan)| [Yes](#scan) | [Yes](#scan) | [Yes](#scan) | No | Limited** | No |

\** Lineage is supported if dataset is used as a source/sink in [Data Factory Copy activity](how-to-link-azure-data-factory.md) 

> [!Important]
>  Microsoft Purview only supports single server deployment option for Azure Database for PostgreSQL. 
>  Versions 8.x to 12.x

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* An active [Microsoft Purview account](create-catalog-portal.md).

* You will need to be a Data Source Administrator and Data Reader to register a source and manage it in the Microsoft Purview governance portal. See our [Microsoft Purview Permissions page](catalog-permissions.md) for details.

## Register

This section describes how to register an Azure Database for PostgreSQL in Microsoft Purview using the [Microsoft Purview governance portal](https://web.purview.azure.com/).

### Authentication for registration

Currently, to be able to manage and interact with an Azure Database for PostgreSQL single server, only SQL Authentication is supported.

#### SQL Authentication

Connecting to an Azure Database for PostgreSQL database requires the fully qualified server name and login credentials. You can follow the instructions in [CONNECT AND QUERY](../postgresql/connect-python.md) to create a login for your Azure Database for PostgreSQL if you don't have this available. You will need **username** and **password** for the next steps.

1. If you do not have an Azure Key vault already, follow [this guide to create an Azure Key Vault](../key-vault/certificates/quick-create-portal.md).
1. Navigate to your key vault in the Azure portal
1. Select **Settings > Secrets**
1. Select **+ Generate/Import** and enter the **Name** and **Value** as the *password* from your Azure PostgreSQL Database
1. Select **Create** to complete
1. If your key vault is not connected to Microsoft Purview yet, you will need to [create a new key vault connection](manage-credentials.md#create-azure-key-vaults-connections-in-your-microsoft-purview-account)
1. Finally, [create a new credential](manage-credentials.md#create-a-new-credential) of type SQL authentication using the **username** and **password** to set up your scan

### Steps to register

To register a new Azure Database for PostgreSQL in your data catalog, do the following:

1. Navigate to your Microsoft Purview account.

1. Select **Data Map** on the left navigation.

1. Select **Register**

1. On **Register sources**, select **Azure Database for PostgreSQL**. Select **Continue**.

:::image type="content" source="media/register-scan-azure-postgresql/01-register-azure-postgres.png" alt-text="register new data source" border="true":::

On the **Register sources Azure Database for PostgreSQL** screen, do the following:

1. Enter a **Name** for your data source. This will be the display name for this data source in your Catalog.
1. Select **From Azure subscription**, select the appropriate subscription from the **Azure subscription** drop-down box and the appropriate server from the **Server name** drop-down box.
1. Select **Register** to register the data source.

:::image type="content" source="media/register-scan-azure-postgresql/02-register-source-azure-postgres.png" alt-text="register sources options" border="true":::

## Scan

Follow the steps below to scan an Azure Database for PostgreSQL database to automatically identify assets and classify your data. For more information about scanning in general, see our [introduction to scans and ingestion](concept-scans-and-ingestion.md)

### Create and run scan

To create and run a new scan, do the following:

1. Select the **Data Map** tab on the left pane in the [Microsoft Purview governance portal](https://web.purview.azure.com/resource/).

1. Select the Azure Database for PostgreSQL source that you registered.

1. Select **New scan**

1. Select the credential to connect to your data source.

   :::image type="content" source="media/register-scan-azure-postgresql/03-azure-postgres-scan.png" alt-text="Set up scan":::

1. You can scope your scan to specific folders or subfolders by choosing the appropriate items in the list.

   :::image type="content" source="media/register-scan-azure-postgresql/04-scope-scan.png" alt-text="Scope your scan":::

1. Then select a scan rule set. You can choose between the system default, existing custom rule sets, or create a new rule set inline.

   :::image type="content" source="media/register-scan-azure-postgresql/05-scan-rule-set.png" alt-text="Scan rule set":::

1. Choose your scan trigger. You can set up a schedule or run the scan once.

   :::image type="content" source="media/register-scan-azure-postgresql/06-trigger-scan.png" alt-text="trigger scan":::

1. Review your scan and select **Save and run**.

[!INCLUDE [view and manage scans](includes/view-and-manage-scans.md)]

## Next steps

Now that you have registered your source, follow the below guides to learn more about Microsoft Purview and your data.

- [Data Estate Insights in Microsoft Purview](concept-insights.md)
- [Lineage in Microsoft Purview](catalog-lineage-user-guide.md)
- [Search Data Catalog](how-to-search-catalog.md)
