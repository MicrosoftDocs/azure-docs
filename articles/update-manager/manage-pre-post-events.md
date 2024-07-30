---
title: Manage the pre and post (preview) maintenance configuration events in Azure Update Manager
description: The article provides the steps to manage the pre and post maintenance events in Azure Update Manager.
ms.service: azure-update-manager
ms.date: 07/24/2024
ms.topic: how-to
ms.author: sudhirsneha
author: SnehaSudhirG
---

# Manage pre and post events (preview) maintenance configuration events

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers :heavy_check_mark: Azure VMs.

This article describes on how to register your subscription and manage pre and post events in Azure Update Manager.

## Register your subscription for public preview

To self-register your subscription for public preview, follow these steps:

#### [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com) and select **More services**.
1. On the **All services** page, search for **Preview features**.
1. On the **Preview Features** page, search and select **Pre and Post Events**.
1. Select the feature and then select **Register** to register the subscription.

   :::image type="content" source="./media/tutorial-using-functions/register-feature.png" alt-text="Screenshot that shows how to register the preview feature." lightbox="./media/tutorial-using-functions/register-feature.png"::: 

#### [Azure CLI](#tab/cli)

```azurecli-interactive
az feature register --name InGuestPatchPrePostMaintenanceActivity --namespace Microsoft.Maintenance
```

#### [PowerShell](#tab/ps)

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName "InGuestPatchPrePostMaintenanceActivity" -ProviderNamespace "Microsoft.Maintenance"
```
---

## Manage pre and post events

### View pre and post events

To view the pre and post events, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. In the **Maintenance Configuration** page, select the maintenance configuration to which you want to add a pre and post event.
1. Select **Overview** and check the **Maintenance events**. You can see the count of the pre and post events associated to the configuration.

      :::image type="content" source="./media/manage-pre-post-events/view-configure-events-inline.png" alt-text="Screenshot that shows how to view and configure a pre and post event." lightbox="./media/manage-pre-post-events/view-configure-events-expanded.png":::

1. Select the count of the pre and post events to view the list of events and the event types.

      :::image type="content" source="./media/manage-pre-post-events/view-events-inline.png" alt-text="Screenshot that shows how to view the pre and post events." lightbox="./media/manage-pre-post-events/view-events-expanded.png":::

### Edit pre and post events

To edit the pre and post events, follow these steps:
1. Follow the steps listed in [View pre and post events](#view-pre-and-post-events).
1. In the selected **events** page, select the pre or post event you want to edit.
1. In the selected **pre or post event** page, you can edit the Event handler/endpoint used or the location of the endpoint.

## Manage the execution of pre/post event and schedule run

To check the successful delivery of a pre and post event to an endpoint from Event Grid, follow these steps:

   1. Sign in to the [Azure portal](https://portal.azure.com/) and go to **Azure Update Manager**.
   2. Under **Manage**, select **Machines**.
   3. Select **Maintenance Configurations** from the ribbon at the top.
   4. In the **Maintenance Configuration** page, select the maintenance configuration for which you want to view a pre and post event.
   5. On the selected **Maintenance Configuration** page, under **Settings** in the ToC, select **Events**.
   6. In the **Essentials** section, you can view the metrics for all the events under the selected event subscription. In the graph, the count of the Published Events metric should match with the count of Matched Events metric. Both values should also correspond with the Delivered Events count.
   7. To view the metrics specific to a pre or a post event, select the name of the event from the grid. Here, the count of Matched Events metric should match with the Delivered Events count.
   8. To view the time at which the event was triggered, hover over the line graph.  [Learn more](/azure/azure-monitor/reference/supported-metrics/microsoft-eventgrid-systemtopics-metrics).

   > [!Note]
   > Azure Event Grid adheres to an at-least-once delivery paradigm. This implies that, in exceptional circumstances, there is a chance of the event handler being invoked more than once for a given event. We recommend you to ensure that the event handler actions are idempotent. In other words, if the event handler is executed multiple times, it should not have any adverse effects. Implementing idempotency ensures the robustness of your application in the face of potential duplicate event invocations.


**To check if the endpoint has been triggered and completed in the pre or post event**

#### [Automation Runbooks via Webhooks](#tab/runbooks)

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to **Azure Automation account**.
1. In your Automation account, under **Process Automation**, select **Runbooks**.
1. Select the pre or post script that is linked to your Webhook in Event Grid.
1. In **Overview**, you can view the status of the Runbook job. The trigger time should be approximately 30 minutes before the schedule start time. Once the job is finished, you can come back to the same section to confirm if the status is **Completed**. For example, ensure that the VM has been either powered on or off.

    :::image type="content" source="./media/manage-pre-post-events/automation-runbooks-webhook.png" alt-text="Screenshot that shows how to check the status of runbook job." lightbox="./media/manage-pre-post-events/automation-runbooks-webhook.png":::
    
   For more information on how to retrieve details from Automation account's activity log and job statuses, see [Manage runbooks in Azure Automation](../automation/automation-runbook-execution.md#jobs).


#### [Azure Functions](#tab/functions)

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to **your Azure Function app.**
2. In your Azure Function app, go to the **Overview** page.
3. Select the specific **function** from the grid in the **Overview** page.
4. Under the **Monitor** column, select **Invocations and more.**
5. This will take you to the **Invocations** tab, which displays the execution details and status of the function.

To use application insights to monitor executions in Azure functions, refer [here](/azure/azure-functions/functions-monitoring).

---

### Cancel a schedule run before it begins to run

To cancel the schedule run, the cancelation API in your pre-event must get triggered at least 10 minutes before the schedule maintenance configuration start time. You must call the cancelation API in your pre-event, that is, Runbook script or Azure function code. 

**To cancel the schedule maintenance run**

#### [Azure portal](#tab/az-portal)
1. Sign in to the [Azure portal](https://portal.azure.com/) and go to **Azure Update Manager**.
1. Under **Manage** in the ToC, select **History**.
1. Select the **By Maintenance run ID** tab, and select the maintenance run ID for which you want to view the history.
1. Select **Cancel schedule update**. This option is enabled for 10 minutes before the start of the maintenance configuration.

#### [REST API](#tab/rest)

[Apply Updates - Create Or Update Or Cancel - REST API (Azure Maintenance) | Microsoft Learn](/rest/api/maintenance/apply-updates/create-or-update-or-cancel)

#### [PowerShell](#tab/az-ps)

[New-AzApplyUpdate (Az.Maintenance) | Microsoft Learn](/powershell/module/az.maintenance/new-azapplyupdate)

#### [CLI](#tab/az-cli)

[az maintenance applyupdate | Microsoft Learn](/cli/azure/maintenance/applyupdate)

---

You can obtain the list of machines in the maintenance run from the following ARG query. You can also view the correlation ID by selecting **See details**:

```kusto
maintenanceresources  
| where type =~ "microsoft.maintenance/maintenanceconfigurations/applyupdates"  
| where properties.correlationId has "/subscriptions/your- subscription -id/resourcegroups/your- ResourceGroupName/providers/microsoft.maintenance/maintenanceconfigurations/mc-name/providers/microsoft.maintenance/applyupdates/"  
| order by name desc
```

>[!Note]
>Azure Update Manager or maintenance configuration will not monitor and automatically cancel the schedule. If the user fails to cancel, the schedule run will proceed with installing updates during the user-defined maintenance window.

## Post schedule run

### View the history of pre and post events

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to **Azure Update Manager**.
2. Under **Manage**, select **History**.
3. Select the **By Maintenance run ID** tab, select the maintenance run ID for which you want to view the history.
4. Select the **Events** tab in this history page of the selected maintenance run ID.
5. You can view the count of events and event names along with the Event type and endpoint details.

### Debug pre and post events

#### [Automation-Webhook](#tab/az-webhook)

To view the job history of an event created through Webhook, follow these steps:

1. Find the event name for which you want to view the job logs.
2. Under the **Job history** column, select **View runbook history** corresponding to the event name. This takes you to the Automation account where the runbooks reside.
3. Select the specific runbook name that is associated to the pre or post event. In the **overview** page, you can view the recent jobs of the runbook along with the execution and status details.

#### [Azure Function](#tab/az-function)

To view the history of an event created through Azure Function, follow these steps:

1. Find the event name for which you want to view the job logs.
2. Under the **Job history** column, select **View Azure Function history** corresponding to the event name. This takes you to the Azure function **Invocations** page.
3. You can view the recent invocations along with the execution and status details.

---

### View the status of a canceled schedule run

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to **Azure Update Manager**.
2. Under **Manage**, select **History**.
3. Select the **By Maintenance run ID** tab, and then select the maintenance run ID for which you want to view the status.
4. Refer to the **Status** to view the status. If the maintenance run has been canceled, the status will be displayed as **cancelled**. Select the status to view the details.

There are two types of cancelations:

- **Cancelation by user**: When you invoke the cancelation API from your script or code.
- **Cancelation by system**: When the system invokes the cancelation API due to an internal error. This is done only if the system is unable to send the pre-event to the customer's end point that is 30 minutes before the scheduled patching job. In this case, the upcoming scheduled maintenance configuration will be canceled due to the failure of running the pre-events by the system.

To confirm if the cancelation is by user or system, you can view the status of the maintenance run ID from the ARG query mentioned above in **See details**. The **error message** displays whether the schedule run has been canceled by the user or system and the **status** field confirms the status of the maintenance run.

 :::image type="content" source="./media/manage-pre-post-events/cancelation-api-user-inline.png" alt-text="Screenshot that shows how to view the cancelation status." lightbox="./media/manage-pre-post-events/cancelation-api-user-expanded.png":::

The above image shows an example of cancelation by the user, where the error message would be **Maintenance cancelled using cancellation API at YYYY-MM-DD**. If the maintenance run is canceled by the system due to any reason, the error message in the JSON would be **Maintenance cancelled due to internal platform failure at YYYY-MM-DD**.


## Delete pre and post event

#### [Using Azure portal](#tab/del-portal)

To delete pre and post events, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. In the **Maintenance Configuration** page, select the maintenance configuration to which you want to add a pre and post event.
1. In the selected **Maintenance configuration** page, under **Settings**, select **Events**.
1. Select the event **Name** you want to delete from the grid.
1. On the selected event page, select **Delete**.

    :::image type="content" source="./media/manage-pre-post-events/delete-event-inline.png" alt-text="Screenshot that shows how to delete the pre and post events." lightbox="./media/manage-pre-post-events/delete-event-expanded.png":::

#### [Using PowerShell](#tab/del-ps)

#### Removing Event Subscription

```powershell-interactive
    Remove-AzEventGridSystemTopicEventSubscription -EventSubscriptionName $EventSubscriptionName -ResourceGroupName $ResourceGroupForSystemTopic -SystemTopicName $SystemTopicName
```

#### Remove System topic

```powershell-interactive
    Remove-AzEventGridSystemTopic -Name $SystemTopicName -ResourceGroupName $ResourceGroupForSystemTopic
```

#### [Using CLI](#tab/del-cli)

#### Removing Event subscription

```azurecli-interactive
    az eventgrid system-topic event-subscription delete --name “<Event subscription name>” --resource-group $ResourceGroupName --system-topic-name     $SystemTopicName
```

#### Remove System topic

```azurecli-interactive
    az eventgrid system-topic delete --name $SystemTopicName --resource-group $ResourceGroupName
```

#### [Using REST API](#tab/del-api)

#### Event subscription Deletion

```rest
    DELETE /subscriptions/<subscription Id>/resourceGroups/<resource group name>/providers/Microsoft.EventGrid/systemTopics/<system topic name>/eventSubscriptions/<Event Subscription name>?api-version=2022-06-15
```

#### System topic deletion
    
```rest
    DELETE /subscriptions/<subscription Id>/resourceGroups/<resource group name>/providers/Microsoft.EventGrid/systemTopics/<system topic name>;?api-version=2022-06-15
```
---

## Next steps
-  For an overview of pre and post events in Azure Update Manager, refer [here](pre-post-scripts-overview.md)
- To learn on how to create pre and post events, see [pre and post maintenance configuration events](pre-post-events-schedule-maintenance-configuration.md).
- To learn how to use pre and post events to turn on and off your VMs using Webhooks, refer [here](tutorial-webhooks-using-runbooks.md).
- To learn how to use pre and post events to turn on and off your VMs using Azure Functions, refer [here](tutorial-using-functions.md).
