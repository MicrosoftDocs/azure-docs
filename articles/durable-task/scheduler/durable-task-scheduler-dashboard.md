---
author: hhunter-ms
ms.author: hannahhunter
title: "Durable Task Scheduler Dashboard: Debug and Manage Orchestrations"
titleSuffix: Durable Task
description: Learn how to debug and manage your orchestrations using the Durable Task Scheduler dashboard.
ms.topic: how-to
ms.service: durable-task
ms.subservice: durable-task-scheduler
ms.date: 05/04/2026
zone_pivot_groups: dts-devexp
---

# Debug and manage orchestrations using the Durable Task Scheduler dashboard

The Durable Task Scheduler dashboard lets you observe running orchestrations, inspect execution history and activity inputs/outputs, and manage orchestration lifecycle (pause, resume, terminate), all from a browser.

The dashboard is available in two environments:

| Environment | URL | Authentication |
| --- | --- | --- |
| **Local emulator** | `http://localhost:8082` | None required |
| **Azure** | `https://dashboard.durabletask.io/?endpoint=<SCHEDULER_ENDPOINT>&taskhub=<TASK_HUB_NAME>` | Requires [Durable Task Data Contributor role](./durable-task-scheduler-identity.md) |

For more about the emulator, see [Emulator for local development](./durable-task-scheduler.md#emulator-for-local-development).

In this article, you learn how to:

> [!div class="checklist"]
>
> - Access the dashboard locally or on Azure.
> - Assign the Durable Task Data Contributor role to your developer identity.
> - Monitor orchestration status, filter instances, and inspect execution history.
> - Manage orchestrations (pause, resume, terminate, raise events).

## Prerequisites

Before you begin:

- [Install the latest Azure CLI](/cli/azure/install-azure-cli) 
- [Create a scheduler and task hub resource](./develop-with-durable-task-scheduler.md)
- [Configure managed identity for your Durable Task Scheduler resource](./durable-task-scheduler-identity.md)

## Access the dashboard locally

If you're using the [Durable Task Scheduler emulator](./durable-task-scheduler.md#emulator-for-local-development), the dashboard is available at:

```
http://localhost:8082
```

No authentication or role assignment is needed for local development.

## Assign dashboard access roles (Azure)

To access the dashboard for an Azure-hosted scheduler, assign the *Durable Task Data Contributor* role to your developer identity (email). 

::: zone pivot="az-cli" 

1. Set the assignee to your developer identity.

    ```azurecli
    assignee=$(az ad user show --id "someone@microsoft.com" --query "id" --output tsv)
    ```

1. Set the scope. Granting access on the scheduler scope gives access to *all* task hubs in that scheduler.

    **Task Hub**

    ```bash
    scope="/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME/taskHubs/TASK_HUB_NAME"
    ```
   
    **Scheduler**
    ```bash
    scope="/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME"
    ```

1. Grant access. Run the following command to create the role assignment and grant access.

    ```azurecli
    az role assignment create \
      --assignee "$assignee" \
      --role "Durable Task Data Contributor" \
      --scope "$scope"
    ```
   
    *Expected output*
   
    The following output example shows a developer identity assigned with the Durable Task Data Contributor role on the *scheduler* level:
   
    ```json
    {
      "condition": null,
      "conditionVersion": null,
      "createdBy": "YOUR_DEVELOPER_CREDENTIAL_ID",
      "createdOn": "2024-12-20T01:36:45.022356+00:00",
      "delegatedManagedIdentityResourceId": null,
      "description": null,
      "id": "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_DTS_NAME/providers/Microsoft.Authorization/roleAssignments/ROLE_ASSIGNMENT_ID",
      "name": "ROLE_ASSIGNMENT_ID",
      "principalId": "YOUR_DEVELOPER_CREDENTIAL_ID",
      "principalName": "YOUR_EMAIL",
      "principalType": "User",
      "resourceGroup": "YOUR_RESOURCE_GROUP",
      "roleDefinitionId": "/subscriptions/YOUR_SUBSCRIPTION/providers/Microsoft.Authorization/roleDefinitions/ROLE_DEFINITION_ID",
      "roleDefinitionName": "Durable Task Data Contributor",
      "scope": "/subscriptions/YOUR_SUBSCRIPTION/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_DTS_NAME",
      "type": "Microsoft.Authorization/roleAssignments",
      "updatedBy": "YOUR_DEVELOPER_CREDENTIAL_ID",
      "updatedOn": "2024-12-20T01:36:45.022356+00:00"
    }
    ```

1. After granting access, open the dashboard at:

    ```
    https://dashboard.durabletask.io/?endpoint=<SCHEDULER_ENDPOINT>&taskhub=<TASK_HUB_NAME>
    ```

    Replace `<SCHEDULER_ENDPOINT>` with your scheduler's endpoint (for example, `https://myscheduler.westus2.durabletask.io`) and `<TASK_HUB_NAME>` with the name of your task hub.

    Alternatively, navigate to `https://dashboard.durabletask.io/` and enter your scheduler endpoint and task hub name in the connection form. 
 
::: zone-end 

::: zone pivot="az-portal" 

[!INCLUDE [assign-dev-identity-role-based-access-control-portal](./includes/assign-dev-identity-role-based-access-control-portal.md)]

::: zone-end 

## Monitor your task hub via the dashboard

The dashboard allows you to monitor orchestration progress and review execution history. From the dashboard home page, you can find your task hub's orchestrations, entities, schedules, workers and metrics, and AI agents (currently in preview). 

<details>
<summary><b>Orchestrations overview pane</b></summary>

View orchestrations by clicking either on the task hub name or **Orchestrations** from the side menu.

:::image type="content" source="media/durable-task-scheduler-dashboard/dashboard-home.png" alt-text="Screenshot of the dashboard home page with links to task hubs, orchestration history, entities, schedules, workers, metrics, and AI agents.":::

From the **Orchestrations** overview pane, you can:
- Review a list of orchestration instances. 
- Narrow down the orchestrations via search bar or filters.
- Create a new orchestration.
- Copy a shareable link to the dashboard.
- Set autorefresh intervals of the orchestration list.

:::image type="content" source="media/durable-task-scheduler-dashboard/orchestrations.png" alt-text="Screenshot of the dashboard listing orchestrations.":::

Orchestration information is presented with the following default columns. 

| Category | Description |
| -------- | ----------- |
| Instance ID | Search for a specific orchestration instance by its unique ID. |
| Name | Filter by the orchestration type name. |
| Status | Filter by runtime status (Running, Completed, Failed, Terminated, Pending, Suspended). |
| Tags | Filter by the tags applied to the orchestration instance. |
| Created | Date and time that the orchestration was created. |

You can filter the orchestration list using the following criteria.

:::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-filters.png" alt-text="Screenshot of the dashboard listing orchestration history and status with filter options.":::

| Category | Description |
| -------- | ----------- |
| Orchestration name | Filter by the orchestration type name. |
| Runtime status | Filter by runtime status (Running, Completed, Failed, Terminated, Pending, Suspended). |
| Tag filter | Search for orchestrations by tag key *or* value. |
| Created from/Created to | Narrow results to a time window. |

Trigger a refresh of the orchestration list by:
- Clicking the refresh icon for a manual refresh.
- Toggle **Auto** and select interval to automatically refresh the list. 

   :::image type="content" source="media/durable-task-scheduler-dashboard/manage-orchestrations.png" alt-text="Screenshot of the autorefresh toggle and manual refresh icon.":::

**Create a new orchestration**

You can create a new orchestration from the Durable Task Scheduler dashboard. 

1. From the **Orchestrations** overview pane, click **+ New Orchestration**. 
1. Fill out the information in the **New Orchestration** form.

   :::image type="content" source="media/durable-task-scheduler-dashboard/create-new-orchestration.png" alt-text="Screenshot of the Create new orchestration form.":::

   | Field | Description |
   | ----- | ----------- |
   | Orchestration Name | Select an orchestration from the drop-down, or type a custom orchestration name. |
   | Instance ID | *Optional.* Instance IDs are autogenerated. Whether you create one yourself or let it autogenerate, instance IDs are in ASCII format. |
   | Version | *Optional.* Enter applicable version number. |
   | Input | *Optional.* Enter input in JSON format. |
   | Scheduled start | *Optional.* Select the start date and time for the orchestration. |
   | Tags | *Optional.* Enter key and/or value tags associated with the orchestration. |

1. Click **Create**.

   You can see your new orchestration in the list.

**Orchestration details**

Click an orchestration instance to diagnose problems or gain visibility into the status of an orchestration. 

Use the **Timeline**, **History**, and **Flow** tabs to view its execution details and activity progress. The Timeline tab is open by default.  

- The *Timeline* tab shows the intervals of a running orchestration. 

   :::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-details.png" alt-text="Screenshot of the orchestration execution timeline.":::

   Select an activity to view its input and output.

   :::image type="content" source="media/durable-task-scheduler-dashboard/view-activity.png" alt-text="Screenshot of the pane where you can view an activity's input, output, and status.":::

- The *History* tab provides a feed of all events in an orchestration, complete with timestamps. 

   :::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-history-details.png" alt-text="Screenshot of the dashboard showing an individual orchestration's event history.":::

- The *Flow* tab visually plots out the orchestration's execution flow. 

   :::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-flow.png" alt-text="Screenshot of an individual orchestration's event flow.":::

   You can also view an activity's input and output by clicking **View**.

   :::image type="content" source="media/durable-task-scheduler-dashboard/view-task.png" alt-text="Screenshot of the pane where you can view an activity's input, output, and status via the flow view.":::

**Manage orchestrations**

You can manage your orchestration lifecycle via the dashboard. In the **Orchestations** pane, select an instance ID to access the following actions:

:::image type="content" source="media/durable-task-scheduler-dashboard/manage-orchestration-status-2.png" alt-text="Screenshot of the dashboard showing the Purge, Restart, Terminate, Suspend, and Resume buttons for managing orchestrations.":::

- **Resume:** Continue a previously suspended orchestration.
- **Suspend:** Pause a running orchestration. It remains in memory, but stops processing events until resumed.
- **Restart:** Restart a previously running orchestration.
- **Terminate:** Immediately stop an orchestration with an optional reason string.
- **Purge:** Purge the orchestration instance.

Drill into an individual orchestration to access the **Raise event** action. This action sends a named external event (with optional JSON payload) to a running or suspended orchestration.

:::image type="content" source="media/durable-task-scheduler-dashboard/manage-orchestration-status.png" alt-text="Screenshot of the dashboard showing the Purge, Restart, Terminate, and Raise Event buttons for managing orchestrations.":::


</details>

<details>
<summary><b>Entities</b></summary>

Select **Entities** from the left side menu to view entities you created.

:::image type="content" source="media/durable-task-scheduler-dashboard/entities.png" alt-text="Screenshot of the entities you created and some management tools for them.":::

Click an individual entity from the list to view its details. From here, you can review:
- When it was last modified
- When the last operation ran
- Whether it's locked, and who locked it
- Its backlog size
- The entity state in either JSON or raw code

:::image type="content" source="media/durable-task-scheduler-dashboard/individual-entity-details.png" alt-text="Screenshot of an individual entity being tracked in the Durable Task Scheduler dashboard.":::

You can also send a signal to the entity. Click **Signal** in the top right corner and create the signal message.

:::image type="content" source="media/durable-task-scheduler-dashboard/send-signal-to-entity.png" alt-text="Screenshot of the window for sending a signal to your individual entity.":::

</details>

<details>
<summary><b>Agents (preview)</b></summary>

> [!NOTE]
> Reviewing agent sessions via the Durable Task Scheduler dashboard is currently in preview.

Select **Agents** from the left side menu to monitor agent sessions triggered by your application in the scheduler. Click into an agent session to view your token usage data, such as:
- The number of prompt tokens you've used.
- The number of completion tokens you've used.
- The total number of tokens used during the agent session.

You can also view the agent chat history and timeline.

:::image type="content" source="media/durable-task-scheduler-dashboard/agents-history.png" alt-text="Screenshot of the agent sessions triggered by your application.":::

</details>

<details>
<summary><b>Schedules</b></summary>

Select **Schedules** from the left side menu to view schedules you created. From the schedules pane, you can pause, resume, or delete a schedule. You can also click **+ Create Schedule** to create a schedule via the dashboard UI.

:::image type="content" source="media/durable-task-scheduler-dashboard/schedules-thumb.png" alt-text="Screenshot of the schedules you created and some management tools for them." lightbox="media/durable-task-scheduler-dashboard/schedules-large.png":::

</details>

<details>
<summary><b>Workers & metrics</b></summary>

Select **Workers & Metrics** from the left side menu to view:
- All of your pending, active, or stored activities, orchestrators, and entities.
- Connected workers.

:::image type="content" source="media/durable-task-scheduler-dashboard/workers-and-metrics.png" alt-text="Screenshot of an overview of the work item queues and connected workers.":::

</details>

## Next steps

For Durable Task Scheduler for Durable Functions:
- [Quickstart: Configure a Durable Functions app to use the Durable Task Scheduler](./quickstart-durable-task-scheduler.md)
- [Create Durable Task Scheduler resources and view them in the dashboard](./develop-with-durable-task-scheduler.md)

For Durable Task Scheduler for the Durable Task SDKs:
- [Quickstart: Create an app with Durable Task SDKs and Durable Task Scheduler](../sdks/quickstart-portable-durable-task-sdks.md)
- [Quickstart: Configure Durable Task SDKs in your container app](../sdks/quickstart-container-apps-durable-task-sdk.md)