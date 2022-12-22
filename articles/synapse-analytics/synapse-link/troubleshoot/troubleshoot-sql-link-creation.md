---
title: Troubleshooting guide for Azure Synapse Link creation for Azure SQL Database 
description: Learn how to troubleshoot Azure Synapse Link creation for Azure SQL Database
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: imotiwala
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.date: 12/19/2022
---

# Troubleshoot: Azure Synapse Link creation for Azure SQL Database 

This article is a guide to troubleshooting issues creating the Azure Synapse Link for Azure SQL Database.

## Symptom

During Azure Synapse Link connection creation, the link creation process may hang and without showing any error messages.

## Potential causes

1. Using the certificate for the managed identity used to sign the client assertion failed because the key used is expired. To confirm this is the cause query the [changefeed.change_feed_errors](/sql/relational-databases/system-tables/changefeed-change-feed-errors-transact-sql) dynamic management view and look for error number 22739. See sample query below: 
   ```sql
   SELECT session_id, error_number, error_message, source_task, entry_time 
   FROM  sys.dm_change_feed_errors
   WHERE error_number = 22739;
   ```

2. The system assigned managed identity (SAMI) for the Azure SQL Database logical server has not been configured properly or not enabled. To confirm this is the cause query the [changefeed.change_feed_errors](/sql/relational-databases/system-tables/changefeed-change-feed-errors-transact-sql) dynamic management view and look for error number 22739. See the previous sample query.

3. An incorrect managed identity was provided in the Synapse Link creation.

4. The subscription moved from one tenant to another, and the managed identity is no longer valid.

## Resolution

If disabled, enable the [system assigned managed identity (SAMI)](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity) for the Azure SQL Database logical server. If enabled, refresh the SAMI. Use either of the two following methods:

Caution: Please draw caution before turning off SAMI for your Azure SQL Database logical server as removing a system-assigned identity will also delete it from Azure AD. Also, consider other applications or resources that may be using the current SAMI and plan for refreshing other resources that may be using the SAMI for your Azure SQL Database.


### Solution 1 via the Azure portal

1. In the Azure portal, navigate to your Azure SQL Server. Select **Identity** under **Security** on the left side bar.
1. Review the **Status** setting for **system assigned managed identity** (SAMI).
1. Set the **Status** to **On** to create and enable the SAMI. 
   1. If the **Status** is already set to **On**, change it temporarily to **Off** and, then set it back to **On**.
   :::image type="content" source="media/troubleshoot-sql-link-creation/system-assigned-managed-identity-status.png" alt-text="A screenshot of the Azure portal where the system assigned managed identity can be enabled." lightbox="media/troubleshoot-sql-link-creation/system-assigned-managed-identity-status.png":::
1. In the Azure portal, navigate to your Synapse Link for SQL connection in Azure Synapse Workspace. In the **Integrate** hub, under **Link connection**, select your link connection. In the General window, expand the **Advanced** section. Select the **Refresh** button. You will see a message with checked green tick indicating the SQL logical server resource ID and Managed identity ID have been refreshed.
   :::image type="content" source="media/troubleshoot-sql-link-creation/synapse-workspace-link-connection-running.png" alt-text="A screenshot of the Azure portal in the Synapse workspace. In the General section under Advanced, the Refresh button is highlighted." lightbox="media/troubleshoot-sql-link-creation/synapse-workspace-link-connection-running.png":::

### Solution 2 via PowerShell

1. Remove the stale identity from the Azure SQL Database logical server using the Az.Sql cmdlet [Set-AzSqlServer](/powershell/module/az.sql/set-azsqlserver). Set `-IdentityType 'None'`.
   ```powershell
   Set-AzSqlServer -AssignIdentity -ResourceGroupName '<resource group>' `
   -ServerName '<server name>' -IdentityType 'None'
   ```
1. Set a new SAMI with `Set-AzSqlServer`, set `-IdentityType 'SystemAssigned'`.
   ```powershell
   Set-AzSqlServer-ResourceGroupName '<resource group>' -ServerName '<server name>' `
   -AssignIdentity -IdentityType 'SystemAssigned'
   ```
1. In the Azure portal, navigate to your Synapse Link for SQL connection in Azure Synapse Workspace. In the **Integrate** hub, under **Link connection**, select your link connection. In the General window, expand the **Advanced** section. Select the **Refresh** button. You will see a message with checked green tick indicating the SQL logical server resource ID and Managed identity ID have been refreshed.
   :::image type="content" source="media/troubleshoot-sql-link-creation/synapse-workspace-link-connection-running.png" alt-text="A screenshot of the Azure portal in the Synapse workspace. In the General section under Advanced, the Refresh button is highlighted." lightbox="media/troubleshoot-sql-link-creation/synapse-workspace-link-connection-running.png":::

## Next steps

 - [Get started with Azure Synapse Link for Azure SQL Database](../connect-synapse-link-sql-database.md)
 - [Managed identities in Azure AD for Azure SQL](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity)
 - [Azure Synapse Link for SQL FAQ](../faq.yml)
 - [Known limitations and issues with Azure Synapse Link for SQL](../synapse-link-for-sql-known-issues.md)
 - [changefeed.change_feed_errors (Transact-SQL)](/sql/relational-databases/system-tables/changefeed-change-feed-errors-transact-sql)
