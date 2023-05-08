---
title: Troubleshooting guide for Azure Synapse Link for Azure SQL Database after failover of an Azure SQL Database.
description: Learn how to troubleshoot and configure Azure Synapse Link for Azure SQL Database after failover of an Azure SQL Database.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: imotiwala 
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.date: 11/17/2022
---

# Troubleshoot: Azure Synapse Link for Azure SQL Database after failover of an Azure SQL Database

This article is a guide to troubleshoot and configure Azure Synapse Link for Azure SQL Database after failover of an Azure SQL Database. This article applies only to databases in Azure SQL Database. 

## Symptom

For the safety of data, users may choose to set [auto-failover group](/azure/azure-sql/database/failover-group-add-single-database-tutorial) for Azure SQL Database. By setting failover group, users can group multiple geo-replicated databases that can protect a potential data loss. However, when Azure Synapse Link for Azure SQL Database has been started for the table in the Azure SQL Database and the database experiences failover, Synapse Link will be disabled in the backend even though its status is still displayed as running. 

## Resolution

You must stop Synapse Link manually and configure Synapse Link according to the new primary server's information so that it can continue to work normally.  

1. Launch [Synapse Studio](https://web.azuresynapse.net).
1. Open the **Integrate** hub.
1. Select the Synapse Link whose database has failover occurred.
1. Select the **Stop** button.

    :::image type="content" source="media/troubleshoot-sql-database-failover/synapse-studio-stop-link-connection.png" alt-text="A screenshot of Synapse Studio. The Integrate hub is open and the Link Connection linkconnection1 is selected. The Stop button is highlighted." lightbox="media/troubleshoot-sql-database-failover/synapse-studio-stop-link-connection.png":::

1. Open the **Manage** hub. Under **External connections**, select **Linked services**.
1. In the list of **Linked services**, select the linked service whose database failed over.

    :::image type="content" source="media/troubleshoot-sql-database-failover/synapse-studio-linked-services.png" alt-text="A screenshot of Synapse Studio. The Manage hub is open. In the list of Linked services, the AzureSqlDatabase1 linked service is highlighted." lightbox="media/troubleshoot-sql-database-failover/synapse-studio-linked-services.png":::

1. You must reset the linked service connection string based on the new primary server after failover so that Synapse Link can connect to the new primary logical server's database. There are two options:
    * Use [the auto-failover group read/write listener endpoint](/azure/azure-sql/database/auto-failover-group-configure-sql-db#locate-listener-endpoint) and use the Synapse workspace's managed identity (SMI) to connect your Synapse workspace to the source database. Because of Read/Write listener endpoint that automatically maps to the new primary server after failover, so you only need to set it once. If failover occurs later, it will automatically use the fully-qualified domain name (FQDN) of the listener endpoint. Note that you still need to take action on every failover to update the Resource ID and Managed Identity ID for the new primary (see next step).
    * After each failover, edit the linked service **Connection string** with the **Server name**, **Database name**, and authentication information for the new primary server. You can use a managed identity or SQL Authentication. 

    The authentication account used to connect to the database, whether it be a managed identity or SQL Authenticated login to the Azure SQL Database, must have at least the CONTROL permission inside the database to perform the actions necessary for the linked service. The db_owner permission is similar to CONTROL.

    To use the auto-failover group read/write listener endpoint:

    :::image type="content" source="media/troubleshoot-sql-database-failover/synapse-studio-edit-linked-service-system-assigned-managed-identity.png" alt-text="Screenshot of the Azure Synapse Studio Edit linked service dialog. The FQDN of the read/write listener endpoint is entered manually." lightbox="media/troubleshoot-sql-database-failover/synapse-studio-edit-linked-service-system-assigned-managed-identity.png":::

1. You must refresh the Resource ID and Managed Identity ID after every failover. Open the **Integrate** hub. Select your Synapse Link.
1. The next step depends on the connection string you chose previously.
    - If you choose to use the Read/Write listener endpoint for updating linked service connection string, you must update the **SQL logical server resource ID** and **Managed identity ID** corresponding to the new primary server manually. 
    - If you provided the new primary server's connection information, select the **Refresh** button.
    
    :::image type="content" source="media/troubleshoot-sql-database-failover/synapse-studio-integrate-link-connection-refresh.png" alt-text="A screenshot of the Integrate hub of Synapse Studio. The Refresh button updates the SQL logical server resource ID and the managed identity ID." lightbox="media/troubleshoot-sql-database-failover/synapse-studio-integrate-link-connection-refresh.png":::

1. Azure Synapse Link for Azure SQL Database currently cannot restart the synchronization from before the failover. Before restarting the Link connection, you must empty the target table in Azure Synapse if data is present. Or, check the option to **Drop and recreate table on target**, as seen in the following screenshot.

    :::image type="content" source="media/troubleshoot-sql-database-failover/synapse-studio-start-drop-recreate-table-target.png" alt-text="A screenshot of the Integrate hub of Synapse Studio. The Drop and recreate table on target option is highlighted. The Start button is highlighted." lightbox="media/troubleshoot-sql-database-failover/synapse-studio-start-drop-recreate-table-target.png":::

1. Finally, restart the Azure Synapse Link. On the **Integrate** hub and with the desired Link connection open, select the **Start** button.


 
## Next steps

 - [Tutorial: Add an Azure SQL Database to an auto-failover group](/azure/azure-sql/database/failover-group-add-single-database-tutorial)
 - [Get started with Azure Synapse Link for Azure SQL Database](../connect-synapse-link-sql-database.md)
