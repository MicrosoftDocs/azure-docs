---
title: Configure Azure Synapse Link for SQL Server 2022 with network security
description: Learn how to configure Azure Synapse Link for SQL Server 2022 with network security.
author: yexu
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.date: 03/15/2023
ms.author: yexu
ms.reviewer: sngun, wiassaf
---

# Configure Azure Synapse Link for SQL Server 2022 with network security

This article is a guide for configuring Azure Synapse Link for SQL Server 2022 with network security. Before you begin this process, you should know how to create and start Azure Synapse Link for SQL Server 2022. For information, see [Get started with Azure Synapse Link for SQL Server 2022](connect-synapse-link-sql-server-2022.md). 

## Create a managed workspace virtual network without data exfiltration

In this section, you create an Azure Synapse workspace with a managed virtual network enabled. You'll enable **managed virtual network**, and then select **No** to allow outbound traffic from the workspace to any target. For an overview, see [Azure Synapse Analytics managed virtual network](../security/synapse-workspace-managed-vnet.md).

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-synapse-workspace-allow-outbound-traffic.png" alt-text="Screenshot that shows how to create an Azure Synapse workspace that allows outbound traffic.":::

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Open Synapse Studio, go to **Manage**, select **Integration runtimes**, and then select **AutoResolvingIntegrationRuntime**. 

1. In the pop-up window, select the **Virtual network** tab, and then enable **Interactive authoring**. 

   :::image type="content" source="../media/connect-synapse-link-sql-database/enable-interactive-authoring.png" alt-text="Screenshot that shows how to enable interactive authoring.":::

1. On the **Integrate** pane, create a link connection to replicate data from your SQL Server 2022 instance to the Azure Synapse SQL pool.

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link.png" alt-text="Screenshot that shows how to create a link to an Azure Synapse SQL pool.":::

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link-sql-server.png" alt-text="Screenshot that shows how to create a link connection from an Azure SQL Server 2022 instance.":::

1. Start your link connection.

   :::image type="content" source="../media/connect-synapse-link-sql-database/start-link.png" alt-text="Screenshot of starting a link connection.":::


## Create a managed workspace virtual network with data exfiltration

In this section, you create an Azure Synapse workspace with managed virtual network enabled. You'll enable **managed virtual network** and select **Yes** to limit outbound traffic from the managed workspace virtual network to targets through managed private endpoints. For an overview, see [Azure Synapse Analytics managed virtual network](../security/synapse-workspace-managed-vnet.md).

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-synapse-workspace-disallow-outbound-traffic.png" alt-text="Screenshot that shows how to create an Azure Synapse workspace that disallows outbound traffic.":::

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Open Synapse Studio, go to **Manage**, select **Integration runtimes**, and then select **AutoResolvingIntegrationRuntime**. 

1. In the pop-up window, select the **Virtual network** tab, and then enable **Interactive authoring**. 

   :::image type="content" source="../media/connect-synapse-link-sql-database/enable-interactive-authoring.png" alt-text="Screenshot that shows how to enable interactive authoring.":::

1. Create a linked service that connects to your SQL Server 2022 instance. 

   To learn how, see the "Create a linked service for your source SQL Server 2022 database" section of [Get started with Azure Synapse Link for SQL Server 2022](connect-synapse-link-sql-server-2022.md#create-a-linked-service-for-your-source-sql-server-2022-database).

1. Add a role assignment to ensure that you've granted your Azure Synapse workspace managed identity permissions to your Azure Data Lake Storage Gen2 storage account that's used as the landing zone. 

   To learn how, see the "Create a linked service to connect to your landing zone on Azure Data Lake Storage Gen2" section of [Get started with Azure Synapse Link for SQL Server 2022](connect-synapse-link-sql-server-2022.md#create-a-linked-service-to-connect-to-your-landing-zone-on-azure-data-lake-storage-gen2).

1. Create a linked service that connects to your Azure Data Lake Storage Gen2 storage (landing zone) with managed private endpoint enabled.

   a. Create a managed private endpoint in the linked service for Azure Data Lake Storage Gen2 storage.
   
     :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-server-linked-service-pe1.png" alt-text="Screenshot of a new Azure SQL Server 2022 database linked service private endpoint 1.":::

   b. Complete the managed private endpoint creation in the linked service for Azure Data Lake Storage Gen2 storage.
   
     :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-server-linked-service-pe2.png" alt-text="Screenshot of a new Azure SQL Server 2022 database linked service private endpoint 2.":::

   c. Go to the Azure portal for your Azure Data Lake Storage Gen2 storage as a landing zone, and then approve the private endpoint connections.
   
     :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-server-linked-service-pe3.png" alt-text="Screenshot of a new Azure SQL Server 2022 database linked service private endpoint 3.":::

   d. Complete the creation of the linked service for Azure Data Lake Storage Gen2 storage.
   
     :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-server-linked-service-pe4.png" alt-text="Screenshot of new sql db linked service pe4.":::

1. Create a blob type managed private endpoint to landing zone.

    a. Navigate to **Managed private endpoints** page, and then select **+New**.
    
     :::image type="content" source="../media/connect-synapse-link-sql-database/managed-private-endpoints.png" alt-text="Screenshot of managed private endpoints pane.":::

     b. Enter **blob** in the search box on **New managed private endpoint** pane, and then select **Azure Blob Storage**.

     :::image type="content" source="../media/connect-synapse-link-sql-database/blob-managed-private-endpoint.png" alt-text="Screenshot of Azure blob storage.":::

    c. Complete the managed private endpoint creation for Azure Blob Storage.
         
      :::image type="content" source="../media/connect-synapse-link-sql-database/create-managed-private-endpoint.png" alt-text="Screenshot of new managed private endpoint.":::

    d. After creating an Azure Blob Storage private endpoint, go to your Azure Data Lake Storage Gen2 networking page and approve it. 
    
      :::image type="content" source="../media/connect-synapse-link-sql-database/create-blob-private-endpoint.png" alt-text="Screenshot of create blob private endpoint.":::

    In case your SQL Server 2022 instance is installed on a virtual machine (VM) and your Azure Storage account is disabled from public network access, you can create a private endpoint of storage sub resource type **blob** to ensure secure communications between your VM, SQL Server and Azure Storage. For more information, refer to [Tutorial: Connect to a storage account using an Azure Private Endpoint](/azure/private-link/tutorial-private-endpoint-storage-portal).

1. Now you can create a link connection from the **Integrate** pane to replicate data from your SQL Server 2022 instance to an Azure Synapse SQL pool.

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link.png" alt-text="Screenshot that shows how to create a link.":::

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link-sql-server.png" alt-text="Screenshot that shows how to create a link from the SQL Server 2022 instance.":::

1. Start your link connection.

   :::image type="content" source="../media/connect-synapse-link-sql-database/start-link.png" alt-text="Screenshot that shows how to start the link connection.":::
 


## Next steps

If you're using a database other than a SQL Server 2022 instance, see:

* [Configure Azure Synapse Link for Azure Cosmos DB](../../cosmos-db/configure-synapse-link.md?context=/azure/synapse-analytics/context/context)
* [Configure Azure Synapse Link for Dataverse](/powerapps/maker/data-platform/azure-synapse-link-synapse?context=/azure/synapse-analytics/context/context)
* [Get started with Azure Synapse Link for SQL Server 2022](connect-synapse-link-sql-server-2022.md)
