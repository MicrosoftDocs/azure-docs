---
title: Troubleshooting guide for Azure Synapse Link for Azure SQL Database after failover of an Azure SQL Database.
description: Learn how to troubleshoot and configure Azure Synapse Link for Azure SQL Database after failover of an Azure SQL Database.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: imotiwala 
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.date: 11/07/2022
---

# Troubleshoot: Azure Synapse Link for Azure SQL Database after failover of an Azure SQL Database

This article is a guide to troubleshoot and configure Azure Synapse Link for Azure SQL Database after failover of an Azure SQL Database. This article applies only to databases in Azure SQL Database. 

## Symptom

For the safety of data, users may choose to set [auto-failover group](/sql/azure-sql/database/failover-group-add-single-database-tutorial) for Azure SQL Database. By setting failover group, users can group multiple geo-replicated databases that can protect a potential data loss. However, when Azure Synapse Link for Azure SQL Database has been started for the table in the Azure SQL Database and the database experiences failover, Synapse Link will be disabled in the backend even though its status is still displayed as running. 

You must stop Synapse Link manually and configure Synapse Link according to the new primary server's information so that it can continue to work normally.  

1. Launch [Synapse Studio](https://web.azuresynapse.net).
1. Open the **Integrate** hub.
1. Select the Synapse Link whose database has failover occurred.
1. Select the **Stop** button.

    :::image type="content" source="media/troubleshoot-sql-database-failover/synapse-studio-stop-link-connection.png" alt-text="A screenshot of Synapse Studio. The Integrate hub is open and the Link Connection linkconnection1 is selected. The Stop button is highlighted." lightbox="media/troubleshoot-sql-database-failover/synapse-studio-stop-link-connection.png":::

1. Open the **Manage** hub. Under **External connections**, select **Linked services**.
1. In the list of **Linked services**, select the linked service whose database failed over.

    :::image type="content" source="media/troubleshoot-sql-database-failover/synapse-studio-linked-services.png" alt-text="A screenshot of Synapse Studio. The Manage hub is open. Under External connections, the Linked Services page is selected. In the list of Linked services, the AzureSqlDatabase1 linked service is highlighted." lightbox="media/troubleshoot-sql-database-failover/synapse-studio-linked-services.png":::

1. You must reset the linked service connection string based on the new primary server after failover so that Synapse Link can connect to the new primary logical server's database. There are two options:
    * Use [the auto-failover group read/write listener endpoint](/sql/azure-sql/managed-instance/auto-failover-group-configure-sql-mi#locate-listener-endpoint) and the workspace's managed identity to connect your Synapse workspace to the source database. Because of Read/Write listener endpoint that automatically maps to the new primary server after failover, so you only need to set it once. If failover occurs later, it will automatically use the Fully qualified domain name (FQDN) of the listener endpoint. 
    * After each failover, edit the linked service **Connection string** with the **Server name**, **Database name**, and authentication information for the new primary server.
    To the auto-failover group read/write listener endpoint:

    :::image type="content" source="media/troubleshoot-sql-database-failover/synapse-studio-edit-linked-service-system-assigned-managed-identity.png" alt-text="Screenshot of the Azure Synapse Studio, showing the Edit linked service dialog. The Fully qualified domain name (FQDN) of the read/write listener endpoint is entered manually." lightbox="media/troubleshoot-sql-database-failover/synapse-studio-edit-linked-service-system-assigned-managed-identity.png":::

1. You must refresh the Resource ID and Managed Identity ID. Open the **Integrate** hub. Select your Synapse Link.
1. The next step depends on the connection string you chose previously.
    - If you choose to use the Read/Write listener endpoint for updating linked service connection string, you must update the **SQL logical server resource ID** and **Managed identity ID** corresponding to the new primary server manually. 
    - If you provided the new primary server's connection information, select the **Refresh** button.
    
    :::image type="content" source="media/troubleshoot-sql-database-failover/synapse-studio-integrate-link-connection-refresh.png" alt-text="A screenshot of the Integrate hub of Synapse Studio. The Link connection linkconnection1 is selected. In the general tab, the Refresh button is boxed. This updates the SQL logical server resource ID and the Managed identity ID." lightbox="media/troubleshoot-sql-database-failover/synapse-studio-integrate-link-connection-refresh.png":::

1. Finally, restart the Azure Synapse Link. Before restarting the Link connection, you may need to clean up the target table if incomplete data is present. Or, check the option to **Drop and recreate table on target**.

    :::image type="content" source="media/troubleshoot-sql-database-failover/synapse-studio-start-drop-recreate-table-target.png" alt-text="A screenshot of the Integrate hub of Synapse Studio. The Drop and recreate table on target option is highlighted. The Start button is highlighted." lightbox="media/troubleshoot-sql-database-failover/synapse-studio-start-drop-recreate-table-target.png":::

1. On the **Integrate** hub and with the desired Link connection open, select the **Start** button.


 
## Next steps

 - [Tutorial: Add an Azure SQL Database to an auto-failover group](/sql/azure-sql/database/failover-group-add-single-database-tutorial)
 - [Get started with Azure Synapse Link for Azure SQL Database](../connect-synapse-link-sql-database.md)
