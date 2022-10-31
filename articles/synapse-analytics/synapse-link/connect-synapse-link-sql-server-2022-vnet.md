---
title: Configure Synapse link for SQL Server 2022 with network security (Preview)
description: Learn how to configure Synapse link for SQL Server 2022 with network security (Preview).
author: yexu
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.date: 09/28/2022
ms.author: yexu
ms.reviewer: sngun, wiassaf
---

# Configure Synapse link for SQL Server 2022 with network security (Preview)

This article provides a guide on configuring Azure Synapse Link for SQL Server 2022 with network security. Before reading this documentation, You should have known how to create and start Synapse link for SQL Server 2022 from [Get started with Azure Synapse Link for SQL Server 2022](connect-synapse-link-sql-server-2022.md). 

> [!IMPORTANT]
> Azure Synapse Link for SQL is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Managed workspace Virtual Network without data exfiltration

1. Create Synapse workspace with managed virtual network enabled. You will enable **managed virtual network** and select **No** to allow outbound traffic from the workspace to any target. You can learn more about managed virtual network from [this](../security/synapse-workspace-managed-vnet.md).

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-synapse-workspace-allow-outbound-traffic.png" alt-text="Screenshot of creating synapse workspace allow outbound traffic.":::

1. Navigate to your Synapse workspace on Azure portal, go to **Networking** tab to enable **Allow Azure Synapse Link for Azure SQL Database to bypass firewall rules**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/enable-bypass-firewall-rules.png" alt-text="Screenshot of enabling bypass firewall rules.":::

1. Launch Synapse Studio, navigate to **Manage**, click **Integration runtimes** and select **AutoResolvingIntegrationRuntime**. On the pop-up slide, you can click **Virtual network** tab, and enable **Interactive authoring**. 

   :::image type="content" source="../media/connect-synapse-link-sql-database/enable-interactive-authoring.png" alt-text="Screenshot of enabling interactive authoring.":::

1. Now you can create a link connection from **Integrate** tab to replicate data from SQL Server 2022 to Synapse SQL pool.

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link.png" alt-text="Screenshot of creating a link.":::

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link-sql-server.png" alt-text="Screenshot of creating link sql server.":::

1. Start your link connection

   :::image type="content" source="../media/connect-synapse-link-sql-database/start-link.png" alt-text="Screenshot of starting a link.":::


## Managed workspace Virtual Network with data exfiltration

1. Create Synapse workspace with managed virtual network enabled. You will enable **managed virtual network** and select **Yes** to limit outbound traffic from the Managed workspace Virtual Network to targets through Managed private endpoints. You can learn more about managed virtual network from [this](../security/synapse-workspace-managed-vnet.md)

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-synapse-workspace-disallow-outbound-traffic.png" alt-text="Screenshot of creating synapse workspace disallow outbound traffic.":::

1. Navigate to your Synapse workspace on Azure portal, go to **Networking** tab to enable **Allow Azure Synapse Link for Azure SQL Database to bypass firewall rules**.

   :::image type="content" source="../media/connect-synapse-link-sql-database/enable-bypass-firewall-rules.png" alt-text="Screenshot of enabling bypass firewall rules.":::

1. Launch Synapse Studio, navigate to **Manage**, click **Integration runtimes** and select **AutoResolvingIntegrationRuntime**. On the pop-up slide, you can click **Virtual network** tab, and enable **Interactive authoring**. 

   :::image type="content" source="../media/connect-synapse-link-sql-database/enable-interactive-authoring.png" alt-text="Screenshot of enabling interactive authoring.":::

1. Create a linked service connecting to SQL Server 2022. You can get more details from [this](connect-synapse-link-sql-server-2022.md#create-linked-service-for-your-source-sql-server-2022).

1. Add role assignment to make sure that you have granted your Synapse workspace managed identity permissions to ADLS Gen2 storage account used as the landing zone. You can get more details from [this](connect-synapse-link-sql-server-2022.md#create-linked-service-to-connect-to-your-landing-zone-on-azure-data-lake-storage-gen2).

1. Create a linked service connecting to ADLS Gen2 storage(landing zone) with managed private endpoint enabled.

   * Create a managed private endpoint in linked service for ADLS Gen2 storage.
   
     :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-server-linked-service-pe1.png" alt-text="Screenshot of new sql db linked service pe1.":::

   * Complete the managed private endpoint creation in the linked service for ADLS Gen2 storage.
   
     :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-server-linked-service-pe2.png" alt-text="Screenshot of new sql db linked service pe2.":::

   * Go to Azure portal of your ADLS Gen2 storage as landing zone, approve the Private endpoint connections.
   
     :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-server-linked-service-pe3.png" alt-text="Screenshot of new sql db linked service pe3.":::

   * Complete the creation of linked service for ADLS Gen2 storage.
   
     :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-server-linked-service-pe4.png" alt-text="Screenshot of new sql db linked service pe4.":::
		 
1. Now you can create a link connection from **Integrate** tab to replicate data from SQL Server 2022 to Synapse SQL pool.

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link.png" alt-text="Screenshot of creating a link.":::

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link-sql-server.png" alt-text="Screenshot of creating link sqldb.":::

1. Start your link connection

   :::image type="content" source="../media/connect-synapse-link-sql-database/start-link.png" alt-text="Screenshot of starting link.":::
 


## Next steps

If you are using a different type of database, see how to:

* [Configure Azure Synapse Link for Azure Cosmos DB](../../cosmos-db/configure-synapse-link.md?context=/azure/synapse-analytics/context/context)
* [Configure Azure Synapse Link for Dataverse](/powerapps/maker/data-platform/azure-synapse-link-synapse?context=/azure/synapse-analytics/context/context)
* [Get started with Azure Synapse Link for SQL Server 2022](connect-synapse-link-sql-server-2022.md)
