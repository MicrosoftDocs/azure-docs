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

This article describes on how to create, view, and cancel the pre and post events in Azure Update Manager.


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
    - If you see **Configure**, it implies that there is no pre and post event is currently setup. Select **Configure** to setup one.
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

To cancel the schedule, you must call the cancellation API in your pre event to set up the cancellation process (i.e.) in your Runbook script or Azure function code. Here, you must define the criteria from when the schedule must be cancelled. The system will not monitor and automatically cancels the schedule based on the status of the pre event. 

There are two types of cancellations:
- **Cancellation by user** - when you invoke the cancellation API from your script or code.
- **Cancellation by system** - when the system invoke the cancellation API due to an internal error.

> [!NOTE]
> If the cancellation API fails to get invoked or has not been set up, the patch installation will proceed to run.
 



## Next steps
For issues and workarounds, see [troubleshoot](troubleshoot.md)
