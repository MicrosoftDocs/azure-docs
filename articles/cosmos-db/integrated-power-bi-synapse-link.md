---
title: 
description: 
author: AnithaAdusumilli
ms.service: cosmos-db
ms.topic: how-to
ms.date: 11/22/2021
ms.author: anithaa
ms.custom: synapse-cosmos-db
---

# Seamless Power BI integration in Azure Cosmos DB portal using Azure Synapse Link

With just a few clicks, you can visualize your Azure Cosmos DB data in near real-time using the in-built Power BI integration, with [Azure Synapse Link](synapse-link.md).

Synapse Link enables you to build Power BI dashboards with no performance or cost impact to your transactional workloads, and no ETL pipelines. You can either use [DirectQuery](/power-bi/connect-data/service-dataset-modes-understand#directquery-mode) or [import](/power-bi/connect-data/service-dataset-modes-understand#import-mode) modes. With DirectQuery, you can build dashboards using live data from your Azure Cosmos DB accounts, without importing or copying the data into Power BI.

To build a Power BI report from Azure Cosmos DB data in DirectQuery mode, use the following steps:

1. Sign into the [Azure portal](https://portal.azure.com/) and navigate to your Azure Cosmos DB account.

1. Open the **Power BI** pane under **Integrations** and select **Get started**.

   > [!NOTE] Currently, this option is only available for SQL API accounts.

1. If your account is not already enabled with Synapse Link, you can enable it from **Enable Azure Synapse link for this account** tab. If Synapse Link is already enabled for the account, you will not see this tab. Once enabled, currently you cannot disable Azure Synapse Link. Enabling Azure Synapse Link has cost implications. See [Azure Synapse Link pricing](synapse-link.md#pricing) for more details.

1. You can now enable Synapse Link on containers. Choose the required containers from **Enable Azure Synapse Link for your containers**.

   * If you already enabled Synapse Link for some containers, you would see them as “selected”. You may optionally deselect some of them, based on the data you’d like to visualize in Power BI.

   * You can also enable Synapse Link on your existing containers.

   > [!IMPORTANT] Due to short-term capacity constraints, register to enable Synapse Link on your existing containers. Depending on the pending requests, approving this request may take anywhere from a day to a week.  If you have any issues or questions, please reach out to cosmosdbsynapselink@microsoft.com.

   :::image type="content" source="./media//.png" alt-text="" border="true":::

   > [!NOTE] You will only need to register once per each of your subscriptions. When the subscription is approved, you can enable Synapse Link for existing containers in all eligible accounts in that subscription.

1. When you click on “register”, the status will change to “registration pending”. Once the request is approved by Azure Cosmos DB team, this dialogue will go away, and you will be able to select your existing containers.

1. Select any of the existing containers and click **Next**.

   If enabling Synapse Link is in progress on any of the containers, the data from those containers will not be included. You can always come back to this portal screen, at a later point in time, to import data when the containers are ready.

   :::image type="content" source="./media//.png" alt-text="" border="true":::

1. Depending on the amount of data in your Cosmos DB containers, it may take a while to enable Synapse Link. To learn more about enabling Synapse Link on existing containers, please see [this article](configure-synapse-link.md#update-analytical-ttl).  

   You can check the progress in the portal as shown below. Containers are enabled with Synapse Link when the progress reaches 100%. 

   :::image type="content" source="./media//.png" alt-text="" border="true":::

1. Next select the Azure Synapse Analytics workspace and click “Next”. This will automatically create T-SQL views in Synapse Analytics, for the containers selected earlier in step 5. For more information on T-SQL views required to connect your Cosmos DB to Power BI, please see [this](../synapse-analytics/sql/tutorial-connect-power-bi-desktop.md#3---prepare-view) article.

1. You can either choose an existing workspace or create a new one. To select an existing workspace, provide the **Subscription**, **Workspace**, and **Database** details. Azure portal will use your AAD credentials to automatically connect to Synapse workspace and create views. Please make sure you are added as “Synapse administrator” in this workspace.

   :::image type="content" source="./media//.png" alt-text="" border="true":::

1. Next, select **Download .pbids** to download the Power BI data source file. Open the downloaded file, it contains the required connection information and opens a Power BI dashboard.

   :::image type="content" source="./media//.png" alt-text="" border="true":::

1. You can now connect to Cosmos DB data from Power BI, using Synapse Link. A list of T-SQL views corresponding to data in each container are displayed. For example, the following screen shows vehicle fleet data. You can load this data for further analysis or transform it before loading.

   :::image type="content" source="./media//.png" alt-text="" border="true":::

1. You can now start building the dashboard using Cosmos DB’s analytical data. Any changes to the Cosmos DB data will be reflected in the dashboard, as soon as the data is replicated to analytical store, in a couple of minutes.

   :::image type="content" source="./media//.png" alt-text="" border="true":::

## Next steps

* Learn more about [Azure Synapse Link for Azure Cosmos DB](synapse-link.md)
* [Connect serverless SQL pool to Power BI Desktop & create report](../synapse-analytics/sql/tutorial-connect-power-bi-desktop.md#prerequisites)
