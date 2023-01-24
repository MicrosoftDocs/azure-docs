---
title: 'Provisioning insights workbook'
description: This article describes the Azure Monitor workbook for provisioning.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.date: 11/11/2022
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---



# Provisioning insights workbook
The Provisioning workbook provides a flexible canvas for data analysis. This workbook brings together all of the provisioning logs from various sources and allows you to gain insight, in a single area.  The workbook allows you to create rich visual reports within the Azure portal. To learn more, see Azure Monitor Workbooks overview.

This workbook is intended for Hybrid Identity Admins who use provisioning to sync users from various data sources to various data repositories.  It allows admins to gain insights into sync status and details.

This workbook:

- Provides a synchronization summary of users and groups synchronized from all of you provisioning sources to targets
- Provides and agrigated and detailed view of information captured by the provisioning logs.
- Allows you to customize the data to tailor it to your specific needs

## Enabling provisioning logs

You should already be familiar with Azure monitoring and Log Analytics. If not, jump over to learn about them and then come back to learn about application provisioning logs. To learn more about Azure monitoring, see [Azure Monitor overview](../../azure-monitor/overview.md). To learn more about Azure Monitor logs and Log Analytics, see [Overview of log queries in Azure Monitor](../../azure-monitor/logs/log-query-overview.md) and [Provisioning Logs for troubleshooting cloud sync](how-to-troubleshoot.md#provisioning-logs).

## Source and Target
At the top of the workbook, using the drop-down, specify the source directory and target directory.  You can also scope your search so that it is more granular using the additional fields provided.  Use the table below as a reference for queries.

:::image type="content" source="media/provisioning-workbook/fields-1.png" alt-text="Screenshot of fields." lightbox="media/provisioning-workbook/fields-1.png":::


|Field|Description|
|-----|-----|
|Source|The provisioning source repository|
|Target|The provisioning target repository|
|Time Range|The range of provisioning information you want to view.  This can be anywhere from 4 hours to 90 days.  You can also set a custom value.|
|Status|View the provisioning status such as Success or Skipped.|
|Action|View the provisioning actions taken such as Create or Delete.|
|AppName|Allows you to filter by the application name.  In the case of Active Directory, you can filter by domains.|
|JobId|Allows you to target specific Job Ids.|
|SyncType|Filter by type of synchronization such as object or password.|


## Sync Summary  
The sync summary section provides a summary of your organizations synchronization activies.  These activies include:
   - Total synced objects by type 
   - Provisioning events by action
   - Provisioning events by status
   - Unique sync count by status
   - Top provisioning errors


 :::image type="content" source="media/provisioning-workbook/sync-summary-1.png" alt-text="Screenshot of the synchronization summary." lightbox="media/provisioning-workbook/sync-summary-1.png":::

## Sync details
The sync details tab allows you to drill into the synchronization data and get more information.  This information includes:
   - Objects sync by status
   - Objects synced by action
   - Sync log details
 
 :::image type="content" source="media/provisioning-workbook/sync-details-1.png" alt-text="Screenshot of the synchronization details." lightbox="media/provisioning-workbook/sync-details-1.png":::

You can further drill in to the sync log details for additional information.

## Sync details by cycle
The sync details by cycle tab allows you to get more granular with the synchronization data.  This information includes:
   - Objects sync by status
   - Objects synced by action
   - Sync log details
 
 :::image type="content" source="media/provisioning-workbook/sync-details-2.png" alt-text="Screenshot of the synchronization details by cycle tab." lightbox="media/provisioning-workbook/sync-details-2.png":::

You can further drill in to the sync log details for additional information.

## User provisioning view
The user provisioning view tab allows you to get synchronization data on individual users.  This includes all the places that a user has been provisioned to.  You can view by:
   - UPN
   - UserID
 


## Custom queries

You can create custom queries and show the data on Azure dashboards. To learn how, see [Create and share dashboards of Log Analytics data](../../azure-monitor/logs/get-started-queries.md). Also, be sure to check out [Overview of log queries in Azure Monitor](../../azure-monitor/logs/log-query-overview.md).

## Custom alerts

Azure Monitor lets you configure custom alerts so that you can get notified about key events related to Provisioning. For example, you might want to receive an alert on spikes in failures. Or perhaps spikes in disables or deletes. Another example of where you might want to be alerted is a lack of any provisioning, which indicates something is wrong.

To learn more about alerts, see [Azure Monitor Log Alerts](../../azure-monitor/alerts/alerts-log.md).

## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud sync?](what-is-cloud-sync.md)
- [Known limitations](how-to-prerequisites.md#known-limitations)
- [Error codes](reference-error-codes.md)