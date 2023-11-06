---
title: Common scenarios in pre and post events (preview) in your Azure Update Manager
description: An overview of common scenarios for pre and post events (preview), including viewing the list of different endpoints, successful delivery to an endpoint, checking the script in Webhooks using runbooks triggered from Event grid.
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 11/06/2023
---

# Pre and Post events (preview) common scenarios

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article presents common scenarios in the lifecycle of pre and post events (preview).

## Scenario 1: Check the configuration of pre and post event on your schedule and it's count

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select the configuration.
1. Select **Overview**, and check **Maintenance events**.
    1. If there are no pre and post events that are setup, select **Configure** to setup.
    1. If there are pre and post events associated to the configuration, you can see the count of pre and post events.
    
       :::image type="content" source="./media/pre-post-events-common-scenarios/configure-new-event.png" alt-text="Screenshot that shows how to configure new event." lightbox="./media/pre-post-events-common-scenarios/configure-new-event.png":::

## Scenario 2: View the list of pre and post events setup on a maintenance configuration

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select the configuration.
1. On the selected maintenance configuration page, under **Settings**, select **Events** to view the pre and post events that you've created.

   The grid at the bottom of the **Events subscription** tab displays the names of both the pre and post events along with the the corresponding **Event Types**.

   :::image type="content" source="./media/pre-post-events-common-scenarios/view-pre-post-events.png" alt-text="Screenshot that shows how to view the list of pre and post events." lightbox="./media/pre-post-events-common-scenarios/view-pre-post-events.png":::


## Scenario 3: View the list of different endpoints setup for pre and post events on a maintenance configuration

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select the configuration.
1. On the selected maintenance configuration page, under **Settings**, select **Events** to view the pre and post events that you've created.

   In the grid at the bottom of the **Event Subscription** tab, you can view the endpoint details.

   :::image type="content" source="./media/pre-post-events-common-scenarios/view-endpoint.png" alt-text="Screenshot that shows how to view endpoints." lightbox="./media/pre-post-events-common-scenarios/view-endpoint.png":::

## Scenario 4: Check the successful delivery of a pre or post event to an endpoint from Event Grid

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select the configuration.
1. On the selected maintenance configuration page, under **Settings**, select **Events**.
1. In the **Essentials** section, view metrics to see the metrics for all the events that are part of the event subscription. In the grid, the count of the Published Events metric should match with the count of Matched Events metric. Both of these two values should also correspond with the Delivered Events count.
1. To view the metrics specific to a pre or a post event, select the name of the event from the grid. Here, the count of Matched Events metric should match with the Delivered Events count.
1. To view the time at which the event was triggered, hover over the line graph. [Learn more](https://learn.microsoft.com/azure/azure-monitor/reference/supported-metrics/microsoft-eventgrid-systemtopics-metrics).


## Scenario 5: Check an unsuccessful delivery of a pre and post events to an endpoint from Event Grid

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select the configuration.
1. On the selected maintenance configuration page, under **Settings**, select **Events**.
1. In the **Essentials** section, view metrics to see the metrics for all the events that are part of the event subscription. Here, you will find that the count of the metric **Delivery Failed Events** will increase.
1. You further setup, you can do either of the following:
   1. Create Azure Monitor Alerts on this failure count to get notified of it. [Set alerts on Azure Event Grid metrics and activity logs](../event-grid/set-alerts.md). **(OR)**
   1. Enable Diagnostic logs by linking to Storage accounts or Log Analytics workspace. [Enable diagnostic logs for Event Grid resources](../event-grid/enable-diagnostic-logs-topic.md).
   > [!NOTE]
   > You can anytime set up logs and alerts for a successful deliveries. 

## Scenario 6: Check if the endpoint has triggered the pre or post task

> [!NOTE]
> This covers Webhooks using Runbooks and Azure Functions

### Webhooks using Runbooks

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Automation account**.
1. In your Automation account, under **Process Automation**, select **Runbooks**.
1. Select the pre or post script linked to your Webhook in Event grid.
1. In **Overview**, you can view the status of the Runbook job. The trigger time should be approximately 30 minutes prior to the schedule start time. Once the job is finished, you can come back to the same section to confirm if the status is **Completed**.

   :::image type="content" source="./media/pre-post-events-common-scenarios/trigger-endpoint.png" alt-text="Screenshot that shows how to view the status of the Runbook job." lightbox="./media/pre-post-events-common-scenarios/trigger-endpoint.png":::

   Upon completion, you can confirm whether the pre-patch installation process has been completed as planned. For instance, ensure that the VM has been either powered on or off. For more information on how to retrieve details from Automation account's activity log, see [Manage runbooks in Azure Automation](../automation/manage-runbooks.md).


### Azure Functions

- You can setup logs for Azure Functions to track their execution. [Learn more](../azure-functions/streaming-logs.md).
