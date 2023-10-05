---
title: Troubleshooting guide for Azure Synapse Link creation for Azure SQL Database 
description: Learn how to troubleshoot Azure Synapse Link creation for Azure SQL Database
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: imotiwala
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.date: 12/22/2022
---

# Troubleshoot: Azure Synapse Link creation for Azure SQL Database 

This article is a guide to troubleshooting issues creating the Azure Synapse Link for Azure SQL Database.

## Symptom 1

During Azure Synapse Link connection creation, the link creation process may hang and without showing any error messages.

### Potential causes 1

1. Using the certificate for the managed identity used to sign the client assertion failed because the key used is expired. 

2. The system assigned managed identity (SAMI) for the Azure SQL Database logical server has not been configured properly or not enabled.

3. An incorrect managed identity was provided in the Synapse Link creation, for example, by manually providing an incorrect principal ID or Azure Key vault information.

To confirm these potential causes, query the [sys.dm_change_feed_errors](/sql/relational-databases/system-dynamic-management-views/sys-dm-change-feed-errors) dynamic management view and look for error number 22739. 
   ```sql
   SELECT session_id, error_number, error_message, source_task, entry_time 
   FROM  sys.dm_change_feed_errors
   WHERE error_number = 22739;
   ```

### Resolution 1

If the SAMI is not enabled, enable the SAMI. Regardless, refresh the Synapse Link authentication information in the Azure Synapse workspace.

### Solution: Enable the SAMI, refresh the Synapse Link

1. If disabled, enable the [system assigned managed identity (SAMI)](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity) for the Azure SQL Database logical server. Regardless, proceed to Step 2.
1. In the Azure portal, navigate to your Synapse Link for SQL connection in Azure Synapse workspace. In the **Integrate** hub, under **Link connection**, select your link connection. In the General window, expand the **Advanced** section. Select the **Refresh** button. You will see a message with checked green tick indicating the SQL logical server resource ID and managed identity ID have been refreshed.
   :::image type="content" source="media/troubleshoot-sql-link-creation/synapse-workspace-link-connection-running.png" alt-text="A screenshot of the Azure portal in the Synapse workspace. In the General section under Advanced, the Refresh button is highlighted." lightbox="media/troubleshoot-sql-link-creation/synapse-workspace-link-connection-running.png":::
1. If this does not resolve the Synapse Link issue, [submit an Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) following the below instructions:
    1.    For **Issue type**, select **Technical**.
    2.    Provide the desired subscription of the source database. Select **Next**.
    3.    For **Service type**, select **SQL Database**.
    4.    For **Resource**, select the source database where the initial snapshot is failing.
    5.    For **Summary**, provide any error numbers from `sys.dm_change_feed_errors`.
    6.    For **Problem type**, select **Data Sync, Replication, CDC and Change Tracking**.
    7.    For **Problem subtype**, select **Transactional Replication**.

<!---

## Symptom 2

During Azure Synapse Link connection creation, the link creation process may hang and without showing any error messages.

### Potential causes 2

1. The subscription moved from one tenant to another, and the system-assigned managed identity (SAMI) is no longer valid. The SAMI does not appear in the Azure AD in the new tenant. 

### Resolution 2

Disable and re-enable the SAMI for the Azure SQL logical server.

### Solution 2 via the Azure portal

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

-->

## Next steps

 - [Get started with Azure Synapse Link for Azure SQL Database](../connect-synapse-link-sql-database.md)
 - [Managed identities in Azure AD for Azure SQL](/azure/azure-sql/database/authentication-azure-ad-user-assigned-managed-identity)
 - [Azure Synapse Link for SQL FAQ](../faq.yml)
 - [Known limitations and issues with Azure Synapse Link for SQL](../synapse-link-for-sql-known-issues.md)
 - [sys.dm_change_feed_errors (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/sys-dm-change-feed-errors)
