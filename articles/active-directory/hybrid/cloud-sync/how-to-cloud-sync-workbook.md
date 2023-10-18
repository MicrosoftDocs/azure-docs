---
title: 'Microsoft Entra cloud sync insights workbook'
description: This article describes the Azure Monitor workbook for cloud sync.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---



# Microsoft Entra cloud sync insights workbook
The cloud sync workbook provides a flexible canvas for data analysis. The workbook allows you to create rich visual reports within the Microsoft Entra admin center. To learn more, see Azure Monitor Workbooks overview.

This workbook is intended for Hybrid Identity Admins who use cloud sync to sync users from AD to Microsoft Entra ID.  It allows admins to gain insights into sync status and details.

The workbook can be accessed by select **Insights** on the left hand side of the cloud sync page.


 :::image type="content" source="media/how-to-cloud-sync-workbook/workbook-1.png" alt-text="Screenshot of the cloud sync workbook." lightbox="media/how-to-cloud-sync-workbook/workbook-1.png":::

>[!NOTE]
>The Insights node is available at both the all configurations level and the individual configuration level.  To view information on individual configurations select the Job Id for the configuration.

This workbook:

- Provides a synchronization summary of users and groups synchronized from AD to Microsoft Entra ID
- Provides a detailed view of information captured by the cloud sync provisioning logs.
- Allows you to customize the data to tailor it to your specific needs



|Field|Description|
|-----|-----|
|Date|The range that you want to view data on.|
|Status|View the provisioning status such as Success or Skipped.|
|Action|View the provisioning actions taken such as Create or Delete.|
|Job Id|Allows you to target specific Job Ids.  This can be used to see individual configuration data if you have multiple configurations.|
|SyncType|Filter by type of synchronization such as object or password.|


## Enabling provisioning logs

You should already be familiar with Azure monitoring and Log Analytics. If not, jump over to learn about them and then come back to learn about application provisioning logs. To learn more about Azure monitoring, see [Azure Monitor overview](../../../azure-monitor/overview.md). To learn more about Azure Monitor logs and Log Analytics, see [Overview of log queries in Azure Monitor](../../../azure-monitor/logs/log-query-overview.md) and [Provisioning Logs for troubleshooting cloud sync](how-to-troubleshoot.md).

## Sync summary  
The sync summary section provides a summary of your organizations synchronization activities.  These activities include:
   - Sync actions per day by action
   - Sync actions per day by status
   - Unique sync count by status
   - Recent sync errors



 :::image type="content" source="media/how-to-cloud-sync-workbook/workbook-2.png" alt-text="Screenshot of the cloud sync summary." lightbox="media/how-to-cloud-sync-workbook/workbook-2.png":::


## Sync details
The sync details tab allows you to drill into the synchronization data and get more information.  This information includes:
   - Objects sync by status
   - Sync log details
 
 :::image type="content" source="media/how-to-cloud-sync-workbook/workbook-3.png" alt-text="Screenshot of the cloud sync details." lightbox="media/how-to-cloud-sync-workbook/workbook-3.png":::

You can further drill in to the sync log details for additional information.

  :::image type="content" source="media/how-to-cloud-sync-workbook/workbook-4.png" alt-text="Screenshot of the log details." lightbox="media/how-to-cloud-sync-workbook/workbook-4.png":::

## Job Id
A Job Id will be created for each configuration when it runs and is populated with data.  You can look at individual configuration based on Job Id.   



## Custom queries

You can create custom queries and show the data on Azure dashboards. To learn how, see [Create and share dashboards of Log Analytics data](../../../azure-monitor/logs/get-started-queries.md). Also, be sure to check out [Overview of log queries in Azure Monitor](../../../azure-monitor/logs/log-query-overview.md).

## Custom alerts

Azure Monitor lets you configure custom alerts so that you can get notified about key events related to Provisioning. For example, you might want to receive an alert on spikes in failures. Or perhaps spikes in disables or deletes. Another example of where you might want to be alerted is a lack of any provisioning, which indicates something is wrong.

To learn more about alerts, see [Azure Monitor Log Alerts](../../../azure-monitor/alerts/alerts-create-new-alert-rule.md).

## Next steps 

- [What is provisioning?](../what-is-provisioning.md)
- [What is Microsoft Entra Connect cloud sync?](what-is-cloud-sync.md)
- [Known limitations](how-to-prerequisites.md#known-limitations)
- [Error codes](reference-error-codes.md)
