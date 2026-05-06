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

The Durable Task Scheduler dashboard lets you observe running orchestrations, inspect execution history and activity inputs/outputs, and manage orchestration lifecycle (pause, resume, terminate) — all from a browser.

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

## Monitor your task hub

The dashboard allows you to monitor orchestration progress and review execution history. From the dashboard home page, you can find your task hub's orchestrations, entities, schedules, workers and metrics, and AI agents (currently in preview). 

View orchestrations by clicking either on the task hub name or **Orchestrations** from the side menu.

:::image type="content" source="media/durable-task-scheduler-dashboard/dashboard-home.png" alt-text="Screenshot of the dashboard home page with links to task hubs, orchestration history, entities, schedules, workers, metrics, and AI agents.":::

In the Orchestrations overview page, you can filter the orchestration list using the following criteria.

:::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-filters.png" alt-text="Screenshot of the dashboard listing orchestration history and status with filter options.":::

| Category | Description |
| -------- | ----------- |
| Orchestration name | Filter by the orchestration type name. |
| Runtime status | Filter by runtime status (Running, Completed, Failed, Terminated, Pending, Suspended). |
| Tag filter | Search for orchestrations by tag key *or* value. |
| Created from/Created to | Narrow results to a time window. |

:::image type="content" source="media/durable-task-scheduler-dashboard/orchestrations.png" alt-text="Screenshot of the dashboard listing orchestrations.":::

| Category | Description |
| -------- | ----------- |
| Instance ID | Search for a specific orchestration instance by its unique ID. |
| Name | Filter by the orchestration type name. |
| Status | Filter by runtime status (Running, Completed, Failed, Terminated, Pending, Suspended). |
| Tags | Filter by the tags applied to the orchestration instance. |
| Created | Date and time that the orchestration was created. |

### Detailed view of orchestration execution

Click an orchestration instance to view its execution details and activity progress. Use the following tabs to diagnose problems or gain visibility into the status of an orchestration. 

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

### Other views of orchestration execution sequence

The *History* view shows detailed event sequence, timestamps, and payload:

:::image type="content" source="media/durable-task-scheduler-dashboard/instance-details.png" alt-text="Screenshot of the dashboard showing orchestration instance details.":::

The *Sequence* view gives another way of visualizing event sequence:

:::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-sequence.png" alt-text="Screenshot of the dashboard showing orchestration sequence view.":::

## Orchestration management 

The dashboard includes features for managing orchestration lifecycle on demand. Available actions include:

- **Suspend** — Pause a running orchestration. It remains in memory but stops processing events until resumed.
- **Resume** — Continue a previously suspended orchestration.
- **Terminate** — Immediately stop an orchestration with an optional reason string.
- **Raise event** — Send a named external event (with optional JSON payload) to a running or suspended orchestration.

:::image type="content" source="media/durable-task-scheduler-dashboard/manage-orchestration.png" alt-text="Screenshot of the dashboard showing the Suspend, Resume, Terminate, and Raise Event buttons for managing orchestrations.":::

## Next steps

For Durable Task Scheduler for Durable Functions:
- [Quickstart: Configure a Durable Functions app to use the Durable Task Scheduler](./quickstart-durable-task-scheduler.md)
- [Create Durable Task Scheduler resources and view them in the dashboard](./develop-with-durable-task-scheduler.md)

For Durable Task Scheduler for the Durable Task SDKs:
- [Quickstart: Create an app with Durable Task SDKs and Durable Task Scheduler](../sdks/quickstart-portable-durable-task-sdks.md)
- [Quickstart: Configure Durable Task SDKs in your container app](../sdks/quickstart-container-apps-durable-task-sdk.md)