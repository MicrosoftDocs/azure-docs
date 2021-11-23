---
title: Integrated Power BI experience in Azure Cosmos DB portal for Synapse Link enabled accounts
description: With the integrated Power BI experience, you can visualize your Azure Cosmos DB data in near real time in just a few clicks. It uses the in-built Power BI integration feature in the Azure portal.
author: AnithaAdusumilli
ms.service: cosmos-db
ms.topic: how-to
ms.date: 11/22/2021
ms.author: anithaa
ms.custom: synapse-cosmos-db
---

# Integrated Power BI experience in Azure Cosmos DB portal for Synapse Link enabled accounts
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

With the integrated Power BI experience, you can visualize your Azure Cosmos DB data in near real time in just a few clicks. It uses the in-built Power BI integration feature in the Azure portal along with [Azure Synapse Link](synapse-link.md).

Synapse Link enables you to build Power BI dashboards with no performance or cost impact to your transactional workloads, and no ETL pipelines. You can either use [DirectQuery](/power-bi/connect-data/service-dataset-modes-understand#directquery-mode) or [import](/power-bi/connect-data/service-dataset-modes-understand#import-mode) modes. With DirectQuery, you can build dashboards using live data from your Azure Cosmos DB accounts, without importing or copying the data into Power BI.

## Build a Power BI report - DirectQuery mode

Use the following steps to build a Power BI report from Azure Cosmos DB data in DirectQuery mode:

1. Sign into the [Azure portal](https://portal.azure.com/) and navigate to your Azure Cosmos DB account.

1. From the **Integrations** section, open the **Power BI** pane and select **Get started**.

   > [!NOTE]
   > Currently, this option is only available for SQL API accounts.

1. From the **Enable Azure Synapse Link** tab, if your account is not already enabled with Synapse Link, you can enable it from **Enable Azure Synapse link for this account** section. If Synapse Link is already enabled for your account, you will not see this tab. Once enabled, you cannot disable Azure Synapse Link. Enabling Azure Synapse Link has cost implications. See [Azure Synapse Link pricing](synapse-link.md#pricing) section for more details.

1. Next from the **Enable Azure Synapse Link for your containers** section, choose the required containers to enable Synapse Link.

   * You can enable Synapse Link on your existing containers.

   * If you already enabled Synapse Link on some containers, you will see the checkbox next to the container name is selected. You may optionally deselect them, based on the data you'd like to visualize in Power BI.

   > [!IMPORTANT]
   > Due to short-term capacity constraints, register to enable Synapse Link on your existing containers. Depending on the pending requests, approving this request may take anywhere from a day to a week. If you have any issues or questions, please reach out to the [Azure Cosmos DB Synapse team](mailto:cosmosdbsynapselink@microsoft.com)

   :::image type="content" source="./media/integrated-power-bi-synapse-link/register-synapse-link.png" alt-text="Register Synapse Link for selected containers" border="true" lightbox="./media/integrated-power-bi-synapse-link/register-synapse-link.png":::

   > [!NOTE]
   > You will only need to register once per each subscriptions. When the subscription is approved, you can enable Synapse Link for existing containers in all eligible accounts within that subscription.

1. Select **register** to enable Synapse Link on your existing accounts. The status changes to "registration pending". After your request is approved by Azure Cosmos DB team, this button will go away, and you will be able to select your existing containers.

1. Select any of the existing containers and select **Next**.

   If enabling Synapse Link is in progress on any of the containers, the data from those containers will not be included. You should come back to this tab later and import data when the containers are enabled.

   :::image type="content" source="./media/integrated-power-bi-synapse-link/synapse-link-progress-existing-containers.png" alt-text="Progress of Synapse Link enabled on existing containers" border="true" lightbox="./media/integrated-power-bi-synapse-link/synapse-link-progress-existing-containers.png":::

1. Depending on the amount of data in your containers, it may take a while to enable Synapse Link. To learn more, see [enable Synapse Link on existing containers](configure-synapse-link.md#update-analytical-ttl) article.  

   You can check the progress in the portal as shown in the following screen. Containers are enabled with Synapse Link when the progress reaches 100%.

   :::image type="content" source="./media/integrated-power-bi-synapse-link/synapse-link-existing-containers-registration-complete.png" alt-text="Synapse Link successfully enabled on the selected containers" border="true" lightbox="./media/integrated-power-bi-synapse-link/synapse-link-existing-containers-registration-complete.png":::

1. From the **Select workspace** tab, choose the Azure Synapse Analytics workspace and select **Next**. This will automatically create T-SQL views in Synapse Analytics, for the containers selected earlier. For more information on T-SQL views required to connect your Cosmos DB to Power BI, see [Prepare views](../synapse-analytics/sql/tutorial-connect-power-bi-desktop.md#3---prepare-view) article.

1. You can either choose an existing workspace or create a new one. To select an existing workspace, provide the **Subscription**, **Workspace**, and the **Database** details. Azure portal will use your AAD credentials to automatically connect to your Synapse workspace and create views. Make sure you have "Synapse administrator" permissions to this workspace.

   :::image type="content" source="./media/integrated-power-bi-synapse-link/synapse-create-views.png" alt-text="Connect to Synapse Link workspace and create views" border="true" lightbox="./media/integrated-power-bi-synapse-link/synapse-create-views.png":::

1. Next, select **Download .pbids** to download the Power BI data source file. Open the downloaded file, it contains the required connection information and opens a Power BI dashboard.

   :::image type="content" source="./media/integrated-power-bi-synapse-link/download-powerbi-desktop-files.png" alt-text="Download the Power BI desktop files in .pbids format" border="true" lightbox="./media/integrated-power-bi-synapse-link/download-powerbi-desktop-files.png":::

1. You can now connect to Azure Cosmos DB data from Power BI, using Synapse Link. A list of T-SQL views corresponding to the data in each container are displayed.

   For example, the following screen shows vehicle fleet data. You can load this data for further analysis or transform it before loading.

   :::image type="content" source="./media/integrated-power-bi-synapse-link/powerbi-desktop-select-view.png" alt-text="T-SQL views corresponding to the data in each container " border="true" lightbox="./media/integrated-power-bi-synapse-link/powerbi-desktop-select-view.png":::

1. You can now start building the dashboard using Azure Cosmos DB's analytical data. Any changes to your data will be reflected in the dashboard, as soon as the data is replicated to analytical store, which typically happens in a couple of minutes.

   :::image type="content" source="./media/integrated-power-bi-synapse-link/fleet-management-dashboard-example.png" alt-text="Fleet management system example Power BI dashboard" border="true" lightbox="./media/integrated-power-bi-synapse-link/fleet-management-dashboard-example.png":::

## Next steps

* Learn more about [Azure Synapse Link for Azure Cosmos DB](synapse-link.md)
* [Connect serverless SQL pool to Power BI Desktop & create report](../synapse-analytics/sql/tutorial-connect-power-bi-desktop.md#prerequisites)
