---
title: Manage Start/Stop VMs v2
description: This article tells how to monitor status of your Azure VMs managed by the Start/Stop VMs v2 feature and perform other management tasks.
services: azure-functions
ms.subservice: start-stop-vms
ms.date: 06/08/2022
ms.topic: conceptual
---

# How to manage Start/Stop VMs v2

## Azure dashboard

Start/Stop VMs v2 includes a [dashboard](/azure/azure-monitor/best-practices-analysis#azure-dashboards) to help you understand the management scope and recent operations against your VMs. It is a quick and easy way to verify the status of each operation that’s performed on your Azure VMs. The visualization in each tile is based on a Log query and to see the query, select the **Open in logs blade** option in the right-hand corner of the tile. This opens the [Log Analytics](/azure/azure-monitor/logs/log-analytics-overview#start-log-analytics) tool in the Azure portal, and from here you can evaluate the query and modify to support your needs, such as custom [log alerts](/azure/azure-monitor/alerts/alerts-log), a custom [workbook](/azure/azure-monitor/visualize/workbooks-overview), etc.

The log data each tile in the dashboard displays is refreshed every hour, with a manual refresh option on demand by clicking the **Refresh** icon on a given visualization, or by refreshing the full dashboard.

To learn about working with a log-based dashboard, see the following [tutorial](/azure/azure-monitor/visualize/tutorial-logs-dashboards).

## Configure email notifications

To change email notifications after Start/Stop VMs v2 is deployed, you can modify the action group created during deployment.

1. In the Azure portal, navigate to **Monitor**, then **Alerts**. Select **Action groups**.

1. On the **Manage actions** page, select the action group called **StartStopV2_VM_Notification**.

    :::image type="content" source="media/manage/alerts-action-groups.png" alt-text="Screenshot of the Action groups page.":::

1. On the **StartStopV2_VM_Notification** page, you can modify the Email/SMS/Push/Voice notification options. Add other actions or update your existing configuration to this action group and then click **OK** to save your changes.

    :::image type="content" source="media/manage/email-notification-type-example.png" alt-text="Screenshot of the Email/SMS/Push/Voice page showing an example email address updated.":::

    To learn more about action groups, see [action groups](/azure/azure-monitor/alerts/action-groups)

The following screenshot is an example email that is sent when the feature shuts down virtual machines.

:::image type="content" source="media/manage/email-notification-example.png" alt-text="Screenshot of an example email sent when the feature shuts down virtual machines.":::

## Next steps

To handle problems during VM management, see [Troubleshoot Start/Stop VMs v2](troubleshoot.md) issues.
