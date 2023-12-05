---
title: Troubleshooting guide for Azure Synapse Link for Azure SQL Database and Microsoft Entra user impersonation
description: Learn how to troubleshoot user impersonation issues with Azure Synapse Link for Azure SQL Database and Microsoft Entra ID 
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: imotiwala 
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.date: 11/09/2022
---

# Troubleshoot: Azure Synapse Link for Azure SQL Database and Microsoft Entra user impersonation

This article is a guide to troubleshoot Azure Synapse Link for Azure SQL Database and Microsoft Entra user impersonation. This article applies only to databases in Azure SQL Database. 

## Symptom

If you create database using a login connected to Microsoft Entra ID and then try to perform Azure Synapse Link database operations signed in with any SQL Authenticated principal, you will receive error messages due to an impersonation failure. The following sample errors are all a symptom of the same problem.

| Database Operation | Sample Error |
|:--|:--|
| sp_change_feed_enable_db, sp_change_feed_disable_db | `The error/state returned was 33171/1: 'Only active directory users can impersonate other active directory users.'. Use the action and error to determine the cause of the failure and resubmit the request.` |
| Restore an Azure Synapse Link enabled database | `Non retriable error occurred while restoring backup with index 11 - 22729 Could not remove the metadata. The failure occurred when executing the command 'sp_MSchange_feed_ddl_database_triggers 'drop''. The error/state returned was 33171/1: 'Only active directory users can impersonate other active directory users.'. Use the action and error to determine the cause of the failure and resubmit the request. RESTORE DATABASE successfully processed 0 pages in 0.751 seconds (0.000 MB/sec). `|
| Restore a blank database and then enable Azure Synapse Link | `The error returned was 33171: 'Only active directory users can impersonate other active directory users.'. Use the action and error to determine the cause of the failure and resubmit the request.` |

## Resolution

Sign in to the Azure SQL Database with a Microsoft Entra database principal. It doesn't have to be the same Microsoft Entra account that created the database. 

## See also

 - [Change data capture limitations](/sql/relational-databases/track-changes/about-change-data-capture-sql-server#limitations)

## Next steps

 - [Get started with Azure Synapse Link for Azure SQL Database](../connect-synapse-link-sql-database.md)
