---
title: Common scenarios in pre and post events (preview) in your Azure Update Manager
description: An overview of common scenarios for pre and post events (preview), including viewing the list of different endpoints, successful delivery to an endpoint, checking the script in Webhooks using runbooks triggered from Event Grid.
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 11/06/2023
author: SnehaSudhir 
ms.author: sudhirsneha
#Customer intent: As an implementer, I want answers to various questions.
---

# Pre and Post events (preview) frequently asked questions

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article presents the frequently asked questions in the lifecycle of pre and post events (preview).

## How to check the configuration of pre and post event on your schedule and its count?

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select the configuration.
1. Select **Overview**, and check **Maintenance events**.
    1. If there are no pre and post events that are set up, select **Configure** to set up.
    1. If there are pre and post events associated to the configuration, you can see the count of pre and post events.
    
       :::image type="content" source="./media/pre-post-events-common-scenarios/configure-new-event.png" alt-text="Screenshot that shows how to configure new event." lightbox="./media/pre-post-events-common-scenarios/configure-new-event.png":::

## How to view the list of pre and post events set up on a maintenance configuration?

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select the configuration.
1. On the selected maintenance configuration page, under **Settings**, select **Events** to view the pre and post events that you have created.

   The grid at the bottom of the **Events subscription** tab displays the names of both the pre and post events along with the corresponding **Event Types**.

   :::image type="content" source="./media/pre-post-events-common-scenarios/view-pre-post-events.png" alt-text="Screenshot that shows how to view the list of pre and post events." lightbox="./media/pre-post-events-common-scenarios/view-pre-post-events.png":::


## How to view the list of different endpoints setup for pre and post events on a maintenance configuration?

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select the configuration.
1. On the selected maintenance configuration page, under **Settings**, select **Events** to view the pre and post events that you have created.

   In the grid at the bottom of the **Event Subscription** tab, you can view the endpoint details.

   :::image type="content" source="./media/pre-post-events-common-scenarios/view-endpoint.png" alt-text="Screenshot that shows how to view endpoints." lightbox="./media/pre-post-events-common-scenarios/view-endpoint.png":::

## How to check the successful delivery of a pre or post event to an endpoint from Event Grid?

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select the configuration.
1. On the selected maintenance configuration page, under **Settings**, select **Events**.
1. In the **Essentials** section, view metrics to see the metrics for all the events that are part of the event subscription. In the grid, the count of the Published Events metric should match with the count of Matched Events metric. Both of these two values should also correspond with the Delivered Events count.
1. To view the metrics specific to a pre or a post event, select the name of the event from the grid. Here, the count of Matched Events metric should match with the Delivered Events count.
1. To view the time at which the event was triggered, hover over the line graph. [Learn more](https://learn.microsoft.com/azure/azure-monitor/reference/supported-metrics/microsoft-eventgrid-systemtopics-metrics).


## How to check an unsuccessful delivery of a pre and post events to an endpoint from Event Grid?

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select the configuration.
1. On the selected maintenance configuration page, under **Settings**, select **Events**.
1. In the **Essentials** section, view metrics to see the metrics for all the events that are part of the event subscription. Here, you find that the count of the metric **Delivery Failed Events** increase.
1. You further setup, you can do either of the following:
   1. Create Azure Monitor Alerts on this failure count to get notified of it. [Set alerts on Azure Event Grid metrics and activity logs](../event-grid/set-alerts.md). **(OR)**
   1. Enable Diagnostic logs by linking to Storage accounts or Log Analytics workspace. [Enable diagnostic logs for Event Grid resources](../event-grid/enable-diagnostic-logs-topic.md).
   > [!NOTE]
   > You can anytime set up logs and alerts for a successful deliveries. 

## How to check if the endpoint has been triggered in the pre or post task?

#### [With webhooks using Automation Runbooks](#tab/events-runbooks)

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Automation account**.
1. In your Automation account, under **Process Automation**, select **Runbooks**.
1. Select the pre or post script linked to your Webhook in Event Grid.
1. In **Overview**, you can view the status of the Runbook job. The trigger time should be approximately 30 minutes prior to the schedule start time. Once the job is finished, you can come back to the same section to confirm if the status is **Completed**.

   :::image type="content" source="./media/pre-post-events-common-scenarios/trigger-endpoint.png" alt-text="Screenshot that shows how to view the status of the Runbook job." lightbox="./media/pre-post-events-common-scenarios/trigger-endpoint.png":::

   Upon completion, you can confirm whether the prepatch installation process has been completed as planned. For instance, ensure that the VM has been either powered on or off. 

For more information on how to retrieve details from Automation account's activity log:
- Learn more on how to [Manage runbooks in Azure Automation](../automation/manage-runbooks.md).

#### [With Azure Functions](#tab/events-functions)

- See the [set up logs for Azure Functions to track their execution](../azure-functions/streaming-logs.md).

---

### How to check if the script in Webhooks using Runbooks is triggered from Event Grid?

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Automation account**.
1. In your Automation account, under **Process Automation**, select **Runbooks**.
1. Select the pre or post script linked to your Webhook in Event Grid.
1. In **Overview**, you can view the status of the Runbook job. Select the **Input** tab to view the latest run of the job.
   
    :::image type="content" source="./media/pre-post-events-common-scenarios/view-input-parameter.png" alt-text="Screenshot that shows how to view the latest run of the job." lightbox="./media/pre-post-events-common-scenarios/view-input-parameter.png":::

## How to check the cancelation of a schedule?

#### [Azure portal](#tab/cancel-portal)

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select the configuration.
1. On the selected maintenance configuration page, under **Settings**, select **Activity Log** to view the pre and post events that you have created.
    1. If the current maintenance schedule was canceled, the operation name would be *Write apply updates to a resource*.
       
       :::image type="content" source="./media/pre-post-events-common-scenarios/write-apply-updates.png" alt-text="Screenshot that shows how to view tif the current maintenance schedule has been canceled." lightbox="./media/pre-post-events-common-scenarios/write-apply-updates.png":::
    
    1. Select the activity to view the details that the activity performs.


#### [REST API](#tab/cancel-rest)

1. The cancellation flow is honored from T-40 when the premaintenance event is triggered until T-10. [Learn more](manage-pre-post-events.md#timeline-of-schedules-for-pre-and-post-events). 

   To invoke the cancelation API:
   
   ```rest
   C:\ProgramData\chocolatey\bin\ARMClient.exe put https://management.azure.com/<your-c-id-obtained-from-above>?api-version=2023-09-01-preview "{\"Properties\":{\"Status\": \"Cancel\"}}" -Verbose
   ```
1. Ensure to insert the correlation ID of your maintenance job to cancel it and you see the response on the CLI/API as follows:

   :::image type="content" source="./media/pre-post-events-common-scenarios/cancelation-response.png" alt-text="Screenshot that shows the response for cancelation of schedule." lightbox="./media/pre-post-events-common-scenarios/write-apply-updates.png":::

---

 
### How to confirm if the cancelation is by user or system?

You can view the status of the maintenance job from the ARG query mentioned above to understand if you've canceled the job or the system. The error message confirms the status of the job.

:::image type="content" source="./media/pre-post-events-common-scenarios/cancelation-query.png" alt-text="Screenshot that shows the status of job that has been canceled by system or user." lightbox="./media/pre-post-events-common-scenarios/cancelation-query.png":::

## How to check the status of the maintenance configuration?

#### [Azure portal](#tab/status-portal)

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **History**.
1. Select **By Maintenance ID** tab to view the jobs by maintenance configurations. For the respective maintenance run ID, you can view the status of the job.
1. Select the **Status** to view the details of the job.
   :::image type="content" source="./media/pre-post-events-common-scenarios/status-maintenance-configuration.png" alt-text="Screenshot that shows detailed view of the job." lightbox="./media/pre-post-events-common-scenarios/status-maintenance-configuration.png":::

#### [REST API/CLI](#tab/status-rest)

1. Use the following Azure Resource Graph (ARG) query to view the status of the job in ARG.

   ```kusto
    maintenanceresources  
    | where type =~ "microsoft.maintenance/maintenanceconfigurations/applyupdates"  
    | where properties.correlationId has "/subscriptions/<your-s-id> /resourcegroups/<your-rg-id> /providers/microsoft.maintenance/maintenanceconfigurations/<mc-name> /providers/microsoft.maintenance/applyupdates/"  
    | order by name desc	 
   ```

1. Ensure to insert the subscription ID, resource group, and maintenance configuration name in the above query

:::image type="content" source="./media/pre-post-events-common-scenarios/view-job-status.png" alt-text="Screenshot that shows how to insert the resource group, maintenance configuration." lightbox="./media/pre-post-events-common-scenarios/view-job-status.png":::

---

## Next steps
- For an overview on [pre and post scenarios](pre-post-scripts-overview.md)
- Manage the [pre and post maintenance configuration events](manage-pre-post-events.md)