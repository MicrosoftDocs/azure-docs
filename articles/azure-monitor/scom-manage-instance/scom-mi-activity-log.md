---
ms.assetid: 
title: Azure Monitor SCOM Managed Instance activity log 
description: This article provides information on how to view the activity log.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.custom: engagement-fy24
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: article
---

# Azure Monitor SCOM Managed Instance activity log 

The Azure Monitor SCOM Managed Instance activity log is a platform log in Azure that provides insight into subscription-level events. The activity log includes information such as when a SCOM Managed Instance resource is created or modified or patched with new software and scaled or deleted. This article provides information on how to view the activity log.

>[!Note]
>- Entries in the Activity Log are system generated and can't be changed or deleted. 
>- Entries in the Activity Log represent control plane changes such as create, update, scale, patch, or delete SCOM Managed Instance.

## Retention period 

Activity log events are retained in Azure for 90 days and then deleted. There's no charge for entries during this time regardless of volume. For more functionality, such as longer retention, create a diagnostic setting and route the entries to another location based on your needs.  

## View the activity log 

You can access the activity log from the Azure portal. The menu that you open it from determines its initial filter. You can change the filter to view all other entries. Select **Add Filter**  to add more properties to the filter. 

For more information on activity log categories, see [Azure activity log event schema](/azure/azure-monitor/essentials/activity-log-schema#categories).

## Download the activity log 

Select **Download as CSV** to download the events in the current view. 

:::image type="Download activity log option" source="media/scom-mi-activity-log/download-activity-log.png" alt-text="Screenshot showing download activity log option.":::

### View change history 

You can view the change history of an event and get the details of changes occurred during the event time. Select an event from the activity log and then select the  **Change history**  to view any associated changes with that event.

:::image type="Change history" source="media/scom-mi-activity-log/view-change-history.png" alt-text="Screenshot showing change history.":::

If any changes are associated with the event, you'll see a list of changes that you can select. To view details, select a change. The  **Change history** page opens and displays the changes to the resource. In the following example, you can see that the SCOM Managed Instance tags and provision state changes. 

:::image type="SCOM Managed Instance tags" source="media/scom-mi-activity-log/scom-mi-tags.png" alt-text="Screenshot showing SCOM Managed Instance tags."::: 
