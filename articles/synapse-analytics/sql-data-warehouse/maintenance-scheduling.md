---
title: Maintenance schedules for Synapse SQL pool
description: Maintenance scheduling enables customers to plan around the necessary scheduled maintenance events that Azure Synapse Analytics uses to roll out new features, upgrades, and patches.
author: sowmi93
ms.author: sosivara
ms.reviewer: sngun
ms.date: 01/10/2024
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

To ensure compliance with latest security requirements, we are unable to accommodate requests to skip or delay these updates. However, you may have some options to adjust your maintenance window if you are using DW500c and higher
data warehouse tiers within the current cycle depending on your situation:
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

## Frequently asked questions

### What is the expected frequency for the maintenance.

Maintenance can happen more than once per month, because maintenance can include OS updates, security patches and drivers, internal Azure infrastructure updates, and DW patches and updates. Every customer has a twice-weekly schedule of maintenance cycles between through Saturday–Sunday, and Tuesday–Thursday.

### What changes have been made after the maintenance is completed, even though my dedicated SQL pool version remains the same?

After a maintenance update is completed, the SQL pool version may remain unchanged. This is because maintenance can include OS updates, security patches and drivers, internal Azure infrastructure updates, and DW patches and updates. Only if a Synapse DW patch or update is included in the maintenance will you see a change to the SQL Dedicated Pool version.

### Is it possible to upgrade the version of my dedicated SQL pool on demand?

- No, scheduled maintenance handles the management of dedicated SQL pools. However, you might have some options to trigger the maintenance once the cycle started, depending on your situation. Verify [Skip or change maintenance schedule](#skip-or-change-maintenance-schedule)
- It's important to keep in mind that the dedicated SQL Pool is a Platform as a Service (PaaS) feature. This implies that Microsoft Azure handles all kinds of tasks related to the service, such as infrastructure, maintenance, updates, and scalability. Scheduled maintenance can be tracked by setting an alert/notification so you stay informed of impending maintenance activity.

### What changes, if any, should be made before or after the dedicated SQL pool maintenance is completed?

- During maintenance, your service will be briefly taken offline, similar to what occurs during a pause, resume, or scale operation. Typically, the overall maintenance operation is completed in well under 30 minutes. However, it could take a little longer, depending on database activity during the maintenance window. We recommend pausing ETL, table updates, and especially transactional operations to avoid longer than normal maintenance. For example:
- If your instance is extremely busy during the planned window, especially with frequent update and delete activity, the maintenance operation might take longer than the normal time. To reduce the chance of extended maintenance activity, we recommend limiting activity to mostly read-only queries against the database if possible, and especially avoiding long-running transactional queries (see the next item).
- If there are active transactions when the maintenance begins, they are canceled and rolled back, potentially causing delays in restoring the online service. To prevent this situation, we recommend ensuring that there are no long-running transactions active at the start of your maintenance window.

### We were notified about an upcoming dedicated SQL pool scheduled maintenance with tracking ID 0000-000, but it was subsequently canceled or rescheduled. What prompted the cancellation or rescheduling of the maintenance?

There are various factors that could lead to the cancellation of scheduled maintenance, including actions such as:
- Pausing or scaling operations after receiving a pending maintenance notification while the cycle is initiated.
- If you are targeting different Service Level Objectives (SLOs) during the maintenance cycle, such as transitioning from any SLO higher than DW400c and then scaling back to an SLO lower or equal to DW400c, or vice versa, a cancellation could occur. This is because maintenance windows are not applicable for DW400c or lower performance levels, and they can undergo maintenance at any time.
- Internal infrastructure factors, such as actual changes to planned maintenance scheduling by the release team.
- Maintenance may be canceled or rescheduled if internal monitoring detects that maintenance is taking longer than expected. Maintenance must be completed within the Service Level Agreements (SLAs) defined by customer maintenance window settings.

### Are there any best practices that I need to consider for our workload during the maintenance window?

- Yes, if possible, pause all transactional and ETL workloads during the planned maintenance interval to avoid errors or delays in restoring the online service. Long-running transactional operations should be completed prior to an upcoming maintenance period.
- For workloads to be resilient to interruptions caused by maintenance operations, use retry logic for both the connection and the command (query) levels, applying longer retry intervals and/or more retry attempts to withstand an extended connection loss that can extend up to or greater than 30 minutes in some cases.

## Next steps

- [Learn more](../../azure-monitor/alerts/alerts-metric.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) about creating, viewing, and managing alerts by using Azure Monitor.
- [Learn more](../..//azure-monitor/alerts/alerts-log-webhook.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) about webhook actions for log alert rules.
- [Learn more](../..//azure-monitor/alerts/action-groups.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) Creating and managing Action Groups.
- [Learn more](../../service-health/service-health-overview.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) about Azure Service Health.
