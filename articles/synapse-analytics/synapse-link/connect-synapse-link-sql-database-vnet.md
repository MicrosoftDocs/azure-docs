---
title: Configure Azure Synapse Link for Azure SQL Database with network security
description: Learn how to configure Azure Synapse Link for Azure SQL Database with network security.
author: yexu
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.date: 11/16/2022
ms.author: yexu
ms.reviewer: sngun, wiassaf
---

# Configure Azure Synapse Link for Azure SQL Database with network security

This article is a guide for configuring Azure Synapse Link for Azure SQL Database with network security. Before you begin, you should know how to create and start Azure Synapse Link for Azure SQL Database from [Get started with Azure Synapse Link for Azure SQL Database](connect-synapse-link-sql-database.md). 

## Create a managed workspace virtual network without data exfiltration

In this section, you create an Azure Synapse workspace with a managed virtual network enabled. For **Managed virtual network**, you'll select **Enable**, and for **Allow outbound data traffic only to approved targets**, you'll select **No**. For an overview, see [Azure Synapse Analytics managed virtual network](../security/synapse-workspace-managed-vnet.md).

:::image type="content" source="../media/connect-synapse-link-sql-database/create-synapse-workspace-allow-outbound-traffic.png" alt-text="Screenshot that shows how to create an Azure Synapse workspace that allows outbound traffic.":::

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your Azure Synapse workspace, select **Networking**, and then select the **Allow Azure Synapse Link for Azure SQL Database to bypass firewall rules** checkbox.

   :::image type="content" source="../media/connect-synapse-link-sql-database/enable-bypass-firewall-rules.png" alt-text="Screenshot that shows how to enable bypassing firewall rules.":::

1. Open Synapse Studio, go to **Manage**, select **Integration runtimes**, and then select **AutoResolvingIntegrationRuntime**. 

1. In the pop-up window, select the **Virtual network** tab, and then enable **Interactive authoring**. 

   :::image type="content" source="../media/connect-synapse-link-sql-database/enable-interactive-authoring.png" alt-text="Screenshot that shows how to enable interactive authoring.":::

1. From the **Integrate** pane, create a link connection to replicate data from your Azure SQL database to an Azure Synapse SQL pool.

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link.png" alt-text="Screenshot that shows how to create a link to an Azure Synapse SQL pool.":::

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link-sql-db.png" alt-text="Screenshot that shows how to create a link connection from an Azure SQL database.":::

1. Start your link connection.

   :::image type="content" source="../media/connect-synapse-link-sql-database/start-link.png" alt-text="Screenshot of starting a link connection.":::

## Create a managed workspace virtual network with data exfiltration

In this section, you create an Azure Synapse workspace with managed virtual network enabled. You'll enable **Managed virtual network**, and you'll select **Yes** to limit outbound traffic from the managed workspace virtual network to targets through managed private endpoints. For an overview, see [Azure Synapse Analytics managed virtual network](../security/synapse-workspace-managed-vnet.md).

:::image type="content" source="../media/connect-synapse-link-sql-database/create-synapse-workspace-disallow-outbound-traffic.png" alt-text="Screenshot that shows how to create an Azure Synapse workspace that disallows outbound traffic.":::

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your Azure Synapse workspace, select **Networking**, and then select the **Allow Azure Synapse Link for Azure SQL Database to bypass firewall rules** checkbox.

   :::image type="content" source="../media/connect-synapse-link-sql-database/enable-bypass-firewall-rules.png" alt-text="Screenshot that shows how to enable bypassing firewall rules.":::

1. Open Synapse Studio, go to **Manage**, select **Integration runtimes**, and then select **AutoResolvingIntegrationRuntime**. 

1. In the pop-up window, select the **Virtual network** tab, and then enable **Interactive authoring**. 

   :::image type="content" source="../media/connect-synapse-link-sql-database/enable-interactive-authoring.png" alt-text="Screenshot that shows how to enable interactive authoring.":::

1. Create a linked service that connects to your Azure SQL database with a managed private endpoint enabled.

   a. Create a linked service that connects to your Azure SQL database.
   
      :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-db-linked-service-pe.png" alt-text="Screenshot of a new Azure SQL database linked service private endpoint.":::

   b. Create a managed private endpoint in a linked service for the Azure SQL database.
   
     :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-db-linked-service-pe1.png" alt-text="Screenshot of a new Azure SQL database linked service private endpoint 1.":::

   c. Complete the managed private endpoint creation in the linked service for the Azure SQL database.
   
     :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-db-linked-service-pe2.png" alt-text="Screenshot of a new Azure SQL database linked service private endpoint 2.":::

   d. Go to the Azure portal for your SQL Server instance that hosts an Azure SQL database as a source store, and then approve the private endpoint connections.
   
     :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-db-linked-service-pe3.png" alt-text="Screenshot of a new Azure SQL database linked service private endpoint 3.":::
         
1. Now you can create a link connection from the **Integrate** pane to replicate data from your Azure SQL database to an Azure Synapse SQL pool.

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link.png" alt-text="Screenshot that shows how to create a link.":::

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link-sql-db.png" alt-text="Screenshot of creating a link to the SQL database.":::

1. Start your link connection.

   :::image type="content" source="../media/connect-synapse-link-sql-database/start-link.png" alt-text="Screenshot that shows how to start the link connection.":::
 


## Next steps

If you're using a database other than an Azure SQL database, see:

* [Configure Azure Synapse Link for Azure Cosmos DB](../../cosmos-db/configure-synapse-link.md?context=/azure/synapse-analytics/context/context)
* [Configure Azure Synapse Link for Dataverse](/powerapps/maker/data-platform/azure-synapse-link-synapse?context=/azure/synapse-analytics/context/context)
* [Get started with Azure Synapse Link for SQL Server 2022](connect-synapse-link-sql-server-2022.md)
