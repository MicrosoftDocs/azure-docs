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

## Solution 1: Enable the SAMI, refresh the Synapse Link

1. If disabled, enable the [system assigned managed identity (SAMI)](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity) for the Azure SQL Database logical server. Regardless, proceed to Step 2.
1. In the Azure portal, navigate to your Synapse Link for SQL connection in Azure Synapse Workspace. In the **Integrate** hub, under **Link connection**, select your link connection. In the General window, expand the **Advanced** section. Select the **Refresh** button. You will see a message with checked green tick indicating the SQL logical server resource ID and Managed identity ID have been refreshed.
   :::image type="content" source="media/troubleshoot-sql-link-creation/synapse-workspace-link-connection-running.png" alt-text="A screenshot of the Azure portal in the Synapse workspace. In the General section under Advanced, the Refresh button is highlighted." lightbox="media/troubleshoot-sql-link-creation/synapse-workspace-link-connection-running.png":::



## Next steps

 - [Get started with Azure Synapse Link for Azure SQL Database](../connect-synapse-link-sql-database.md)
 - [Managed identities in Azure AD for Azure SQL](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity)
 - [Azure Synapse Link for SQL FAQ](../faq.yml)
 - [Known limitations and issues with Azure Synapse Link for SQL](../synapse-link-for-sql-known-issues.md)
 - [changefeed.change_feed_errors (Transact-SQL)](/sql/relational-databases/system-tables/changefeed-change-feed-errors-transact-sql)
