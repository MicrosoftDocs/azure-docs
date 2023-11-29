---
title: Maintenance schedules for Synapse SQL pool
description: Maintenance scheduling enables customers to plan around the necessary scheduled maintenance events that Azure Synapse Analytics uses to roll out new features, upgrades, and patches.
author: sowmi93
ms.author: sosivara
ms.reviewer: sngun
ms.date: 11/28/2022
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
---

# Use maintenance schedules to manage service updates and maintenance

The maintenance schedule feature integrates the Service Health Planned Maintenance Notifications, Resource Health Check Monitor, and maintenance scheduling service for Synapse SQL pool (data warehouse) within Azure Synapse Analytics.

You should use maintenance scheduling to choose a time window when it's convenient to receive new features, upgrades, and patches. You will need to choose a primary and a secondary maintenance window within a seven-day period, each window must be within separate day ranges.

For example, you can schedule a primary window of Saturday 22:00 to Sunday 01:00, and then schedule a secondary window of Wednesday 19:00 to 22:00. If maintenance can't be performed during your primary maintenance window, it will try the maintenance again during your secondary maintenance window. Service maintenance could on occasion occur during both the primary and secondary windows. To ensure rapid completion of all maintenance operations, DW400c and lower data warehouse tiers could complete maintenance outside of a designated maintenance window.

All newly created data warehouse instances will have a system-defined maintenance schedule applied during deployment. The schedule can be edited as soon as deployment is complete.

When choosing a maintenance window, you need to select a start time and set a maximum duration. The "maximum duration of a maintenance window" determines the timeframe in which maintenance tasks will be carried out. This timeframe can be between three (3) and eight (8) hours, with a minimum requirement of three (3) hours. During this period, your data warehouse will be temporarily offline as your dedicated pool is moved to upgraded capacity using a process similar to pause/resume. Under typical conditions, this operation will complete in well under 30 minutes, but it's important to note that in some cases, it can take longer. For instance, if there are active transactions when the maintenance begins, they will be canceled and rolled back, potentially causing delays in restoring the online service. To prevent this situation, we recommend ensuring that there are no long-running transactions active at the start of your maintenance window.

All maintenance operations should finish within the specified maintenance windows unless we are required to deploy a time sensitive update. If your data warehouse is paused during a scheduled maintenance, it will be updated during the resume operation. You'll be notified immediately after your data warehouse maintenance is completed.

> [!NOTE]
> - The maintenance windows are not applicable for DW400c or lower performance levels. They can undergo maintenance at any time.
> - DW400c and lower may experience multiple brief losses in connectivity at various times during the maintenance window.

## Alerts and monitoring

Integration with Service Health notifications and the Resource Health Check Monitor allows customers to stay informed of impending maintenance activity. This automation takes advantage of Azure Monitor. You can decide how you want to be notified of impending maintenance events. Also, you can choose which automated flows will help you manage downtime and minimize operational impact.

> [!NOTE]
> A 24-hour advance notification precedes all maintenance events. In the event we are required to deploy a time critical update, advanced notification times may be significantly reduced. This could occur outside an identified maintenance window due to the critical nature of the update.

If you received advance notification that maintenance will take place, but maintenance can't be performed during the time period in the notification, you'll receive a cancellation notification. Maintenance will then resume during the next scheduled maintenance period.

All active maintenance events appear in the **Service Health - Planned Maintenance** section. The Service Health history includes a full record of past events. You can monitor maintenance via the Azure Service Health check portal dashboard during an active event.

### Maintenance schedule availability

Even if maintenance scheduling isn't available in your selected region, you can view and edit your maintenance schedule at any time. When maintenance scheduling becomes available in your region, the identified schedule will immediately become active on your Synapse SQL pool.

## View a maintenance schedule

By default, all newly created data warehouse instances have an eight-hour primary and secondary maintenance window applied during deployment. As indicated above, you can change the windows as soon deployment is complete. No maintenance will take place outside the specified maintenance windows without prior notification.

To view the maintenance schedule that has been applied to your Synapse SQL pool, complete the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select the Synapse SQL pool that you want to view.
3. The selected Synapse SQL pool opens on the overview blade. The maintenance schedule that's applied to the data warehouse appears below **Maintenance schedule**.

![Overview blade](./media/maintenance-scheduling/clear-overview-blade.PNG)

## Skip or change maintenance schedule

To ensure compliance with latest security requirements, we are unable to accommodate requests to skip or delay these updates. However, you may have some options to adjust your maintenance window within the current cycle depending on your situation:
- If you receive a pending notification for maintenance, and you need more time to finish your jobs or notify your team, you can change the window start time as long as you do so before the beginning of your defined maintenance window. This will shift your window forward in time within the cycle.

- You can manually trigger the maintenance by pausing and resuming (or scaling) your SQL Dedicated pool after the start of a cycle for which a "Pending" notification has been received. The weekend maintenance cycle starts on Saturday at 00:00 UTC; the midweek maintenance cycle starts Tuesday at 12:00 UTC.

- Although we do require a minimum window of 3 hours, under typical conditions this operation will complete in well under 30 minutes. However, it's important to note that in some cases, it can take longer. For instance, if there are active transactions when the maintenance begins, they will be canceled and rolled back, potentially causing delays in restoring the online service. To prevent this situation, we recommend ensuring that there are no long-running transactions active at the start of your maintenance window.

> [!NOTE]
> - If you change the window to a start time before the actual present time, maintenance will be triggered immediately and if there are active transactions when the maintenance starts, they will be aborted and rolled back.
> - After the pause and resume operation is completed to initiate the maintenance, instead of receiving a notification confirming the completion of the maintenance, you will be notified that it has been cancelled.
> - In case you are using DW400c or lower, although you are able to change the maintenance schedule, it will not be adhered to since it's a lower performance level. As mentioned earlier, these data warehouse tiers can undergo maintenance at any time with the maintenance cycle.

## Identifying the primary and secondary windows

The primary and secondary windows must have separate day ranges. An example is a primary window of Tuesday–Thursday and a secondary of window of Saturday–Sunday. The terms "Primary" and "Secondary" should be considered as "Window 1" and "Window 2" respectively. This means either of the windows can be picked up in any order for deploying maintenance upgrades.

To change the maintenance schedule for your Synapse SQL pool, complete the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select the Synapse SQL pool that you want to update. The page opens on the overview blade.
Open the page for maintenance schedule settings by selecting the **Maintenance Schedule summary** link on the overview blade. Or, select the **Maintenance Schedule** option on the left-side resource menu.

    ![Overview blade options](./media/maintenance-scheduling/maintenance-change-option.png)

3. Identify the preferred day range for your primary maintenance window by using the options at the top of the page. This selection determines if your primary window will occur on a weekday or over the weekend. Your selection will update the drop-down values.
During preview, some regions might not yet support the full set of available **Day** options.

   ![Maintenance settings blade](./media/maintenance-scheduling/maintenance-settings-page.png)

4. Choose your preferred primary and secondary maintenance windows by using the drop-down list boxes:
   - **Day**: Preferred day to perform maintenance during the selected window.
   - **Start time**: Preferred start time for the maintenance window.
   - **Time window**: Preferred duration of your time window.

   The **Schedule summary** area at the bottom of the blade is updated based on the values that you selected.
  
5. Select **Save**. A message appears, confirming that your new schedule is now active.

   You can update the Day, Start time, Time window (including the default 8-hour window) selections at any time. 
   If you're saving a schedule in a region that doesn't support maintenance scheduling, the following message appears. Your settings are saved and become active when the feature becomes available in your selected region.

   ![Message about region availability](./media/maintenance-scheduling/maintenance-not-active-toast.png)

## Next steps

- [Learn more](../../azure-monitor/alerts/alerts-metric.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) about creating, viewing, and managing alerts by using Azure Monitor.
- [Learn more](../..//azure-monitor/alerts/alerts-log-webhook.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) about webhook actions for log alert rules.
- [Learn more](../..//azure-monitor/alerts/action-groups.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) Creating and managing Action Groups.
- [Learn more](../../service-health/service-health-overview.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) about Azure Service Health.
