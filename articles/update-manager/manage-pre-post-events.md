---
title: Manage the pre and post maintenance configuration events (preview) in Azure Update Manager
description: The article provides the steps to manage the pre and post maintenance events in Azure Update Manager.
ms.service: azure-update-manager
ms.date: 10/29/2023
ms.topic: how-to
ms.author: sudhirsneha
author: SnehaSudhirG
---

# Manage pre and post events (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

Pre and post events allows you to execute user-defined actions before and after the schedule patch installation. This article describes on how to create, view, and cancel the pre and post events in Azure Update Manager.

## Timeline of schedules for pre and post events

We recommend you to go through the following table to understand the timeline of the schedule for pre and post events.

For example, if a maintenance schedule is set to start at **3:00 p.m. IST**: 

| **Time**| **Details** |
|----------|-------------|
|2:19 p.m. | You can modify the machines or dynamic scopes within the schedule's scope until this time. After this time, the resources will be included in the subsequent schedule run and not the current run. </br> **Note**</br> If you're creating a new schedule or editing an existing schedule with a pre event, you need at least 40 minutes prior to the maintenance window for the pre-event to run. |
|2:30 p.m. | The pre event is initiated.|
|2:50 p.m. | The pre event would complete all the tasks for a successful schedule run. </br> **Note** </br> - The pre event runs for 20 mins and if the pre event keeps running even after 2:50 p.m., the patch installation will go ahead irrespective of the pre event run status. </br> - If you choose to cancel the current run, the latest by when you can call the cancelation API is by 2:50 p.m. </br> You can cancel the current run by calling the cancelation API from your script or Azure function code. If cancelation API fails to get invoked or hasn't been set up, the patch installation proceeds to run. |
|3:00 p.m.| The schedule gets triggered. | 
|6:55 p.m.| The schedule completes patch installation.|
|7:15 p.m.| The post event is initiated at 6:55 p.m. and completed by 7:15 p.m. |


## Configure pre and post events on existing schedule

You can configure pre and post events on an existing schedule and can add multiple pre and post events to a single schedule. To add a pre and post event, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select the maintenance configuration to which you want to add a pre and post event.
1. On the selected **Maintenance configuration** page, under **Settings**, select **Events**. Alternatively, under the **Overview**, select the card **Create a maintenance event**.
   
   :::image type="content" source="./media/manage-pre-post-events/create-maintenance-event-inline.png" alt-text="Screenshot that shows the options to select to create a maintenance event." lightbox="./media/manage-pre-post-events/create-maintenance-event-expanded.png":::
   
1. Select **+Event Subscription** to create Pre/Post Maintenance Event.

    :::image type="content" source="./media/manage-pre-post-events/maintenance-events-inline.png" alt-text="Screenshot that shows the maintenance events." lightbox="./media/manage-pre-post-events/maintenance-events-expanded.png":::

1. On the **Create Event Subscription** page, enter the following details:
    - In the **Event Subscription Details** section, provide an appropriate name. 
    - Keep the schema as **Event Grid Schema**.
    - In the **Event Types** section, **Filter to Event Types**, select the event types that you want to get pushed to the endpoint or destination. You can select between **Pre Maintenance Event** and **Post Maintenance Event**.
    - In the **Endpoint details** section, select the endpoint where you want to receive the response from. It would help customers to trigger their pre or post event.  
       
      :::image type="content" source="./media/manage-pre-post-events/create-event-subscription.png" alt-text="Screenshot on how to create event subscription.":::

1. Select **Create** to configure the pre and post events on an existing schedule.  

> [!NOTE]
> - The pre and post event can only be created at a scheduled maintenance configuration level.
> - The pre and post event run falls outside of the schedule maintenance window.

## View pre and post events

To view the pre and post events, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select the maintenance configuration to which you want to add a pre and post event.
1. Select **Overview** and check the **Maintenance events**.
    - If you see **Configure**, it implies that there's no pre and post event currently set up. Select **Configure** to set up one.
    - If the setup is already done, you can see the count of the pre and post events associated to the configuration.
   
      :::image type="content" source="./media/manage-pre-post-events/view-configure-events-inline.png" alt-text="Screenshot that shows how to view and configure a pre and post event." lightbox="./media/manage-pre-post-events/view-configure-events-expanded.png":::

You can view the list of pre and post events that you configured in the **Events** page.

  :::image type="content" source="./media/manage-pre-post-events/view-events-inline.png" alt-text="Screenshot that shows how to view the pre and post events." lightbox="./media/manage-pre-post-events/view-events-expanded.png":::

## Delete pre and post event

To delete pre and post events, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select the maintenance configuration to which you want to add a pre and post event.
1. On the selected **Maintenance configuration** page, under **Settings**, select **Events**. Alternatively, under the **Overview**, select the card **Create a maintenance event**.
1. Select the event **Name** you want to delete from the grid.
1. On the selected event page, select **Delete**.

    :::image type="content" source="./media/manage-pre-post-events/delete-event-inline.png" alt-text="Screenshot that shows how to delete the pre and post events." lightbox="./media/manage-pre-post-events/delete-event-expanded.png":::


## Cancel a schedule from a pre event

To cancel the schedule, you must call the cancelation API in your pre event to set up the cancelation process that is in your Runbook script or Azure function code. Here, you must define the criteria from when the schedule must be canceled. The system won't monitor and won't automatically cancels the schedule based on the status of the pre event. 

There are two types of cancelations:
- **Cancelation by user** - when you invoke the cancelation API from your script or code.
- **Cancelation by system** - when the system invokes the cancelation API due to an internal error.

> [!NOTE]
> If the cancelation API fails to get invoked or has not been setup, the patch installation will proceed to run.
 
### View the cancelation status

To view the cancelation status, follow these steps:

1. In **Azure Update Manager** home page, go to **History**
1. Select by the **Maintenance run ID** and choose the run ID for which you want to view the status.

    :::image type="content" source="./media/manage-pre-post-events/view-cancelation-status-inline.png" alt-text="Screenshot that shows how to view the cancelation status." lightbox="./media/manage-pre-post-events/view-cancelation-status-expanded.png":::

You can view the cancelation status from the error message in the JSON. The JSON can be obtained from the Azure Resource Graph (ARG). The corresponding maintenance configuration would be canceled using the Cancelation API.

   :::image type="content" source="./media/manage-pre-post-events/cancelation-api-user-inline.png" alt-text="Screenshot for cancelation done by the user." lightbox="./media/manage-pre-post-events/cancelation-api-user-expanded.png" :::

   If the maintenance job is canceled by the system due to any reason, the error message in the JSON is obtained from the Azure Resource Graph for the corresponding maintenance configuration would be **Maintenance schedule canceled due to internal platform failure**.

#### Invoke the Cancelation API

```rest
 C:\ProgramData\chocolatey\bin\ARMClient.exe put https://management.azure.com/<your-c-id-obtained-from-above>?api-version=2023-09-01-preview "{\"Properties\":{\"Status\": \"Cancel\"}}" -Verbose 
```

> [!NOTE]
> You must replace the **Correlation ID** received from the above ARG query and replace it in the Cancelation API.

**Example**
```http 
  C:\ProgramData\chocolatey\bin\ARMClient.exe put https://management.azure.com/subscriptions/eee2cef4-bc47-4278-b4f8-cfc65f25dfd8/resourcegroups/fp02centraluseuap/providers/microsoft.maintenance/maintenanceconfigurations/prepostdemo7/providers/microsoft.maintenance/applyupdates/20230810085400?api-version=2023-09-01-preview "{\"Properties\":{\"Status\": \"Cancel\"}}" -Verbose
```

## Next steps
- For issues and workarounds, see [troubleshoot](troubleshoot.md)
- For an overview on [pre and post scenarios](pre-post-scripts-overview.md)
- Learn on the [common scenarios of pre and post events](pre-post-events-common-scenarios.md)
