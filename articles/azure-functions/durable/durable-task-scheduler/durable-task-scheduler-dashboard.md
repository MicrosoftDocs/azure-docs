---
title: Debug and manage orchestrations using the Azure Functions Durable Task Scheduler dashboard (preview)
description: Learn how to debug and manage your orchestrations using the Azure Functions Durable Task Scheduler.
ms.topic: how-to
ms.date: 05/06/2025
zone_pivot_groups: dts-devexp
---

# Debug and manage orchestrations using the Azure Functions Durable Task Scheduler dashboard (preview)

Observe, manage, and debug your task hub or scheduler's orchestrations using the Durable Task Scheduler dashboard. The dashboard is available when you run the [Durable Task Scheduler emulator](./durable-task-scheduler.md#emulator-for-local-development) locally or create a scheduler resource on Azure. 

Running the emulator locally doesn't require authentication. 

Creating a scheduler resource on Azure requires [assigning the *Durable Task Data Contributor* role to your identity](./durable-task-scheduler-identity.md). You can then access the dashboard via either:
- The task hub's dashboard endpoint URL in the Azure portal
- Navigate to `https://dashboard.durabletask.io/` combined with your task hub endpoint.  

In this article, you learn how to:

> [!div class="checklist"]
>
> - Assign one of the Durable Task roles to your developer identity. 
> - Access the Durable Task Scheduler dashboard.
> - View orchestration status and history via the Durable Task Scheduler dashboard.

## Prerequisites

Before you begin:

- [Install the latest Azure CLI](/cli/azure/install-azure-cli) 
- [Create a scheduler and task hub resource](./develop-with-durable-task-scheduler.md)
- [Configure managed identity for your Durable Task Scheduler resource](./durable-task-scheduler-identity.md)

## Access the Durable Task Scheduler dashboard

Assign the required role to your *developer identity (email)* to gain access to the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md). 

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

1. After granting access, go to `https://dashboard.durabletask.io/` and fill out the required information about your scheduler and task hub to see the dashboard. 
 
::: zone-end 

::: zone pivot="az-portal" 

[!INCLUDE [assign-dev-identity-role-based-access-control-portal](./includes/assign-dev-identity-role-based-access-control-portal.md)]

::: zone-end 

## Monitor orchestration progress and execution history

The dashboard allows you to monitor orchestration progress and review execution history. You can also filter by orchestration metadata, such as state and timestamps.

:::image type="content" source="media/durable-task-scheduler-dashboard/track-orchestration-progress.png" alt-text="Screenshot of the dashboard listing orchestration history and status.":::

View orchestration inputs and outputs:

:::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-input-outputs.png" alt-text="Screenshot of the dashboard listing orchestration history and status inputs and outputs.":::

## Detailed view of orchestration execution

You can drill into orchestration instances to view execution details and activity progress. This view helps you diagnose problems or gain visibility into the status of an orchestration.

In the following image, the *Timeline* view of an orchestration execution. In this "ProcessDocument" orchestration, the "WriteDoc" activity retried three times (unsuccessfully) with five seconds in between retry.

:::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-timeline.png" alt-text="Screenshot of the dashboard showing the orchestration execution timeline.":::

You can also view inputs and outputs of activities in an orchestration:

:::image type="content" source="media/durable-task-scheduler-dashboard/activity-input-output.png" alt-text="Screenshot of the dashboard showing activity inputs and outputs.":::

### Other views of orchestration execution sequence

The *History* view shows detailed event sequence, timestamps, and payload:

:::image type="content" source="media/durable-task-scheduler-dashboard/instance-details.png" alt-text="Screenshot of the dashboard showing orchestration instance details.":::

The *Sequence* view gives another way of visualizing event sequence:

:::image type="content" source="media/durable-task-scheduler-dashboard/orchestration-sequence.png" alt-text="Screenshot of the dashboard showing orchestration sequence view.":::

## Orchestration management 

The dashboard includes features for managing orchestrations on demand, such as starting, pausing, resuming, and terminating.

:::image type="content" source="media/durable-task-scheduler-dashboard/manage-orchestration.png" alt-text="Screenshot of the dashboard showing the buttons you use to manage the orchestration.":::

## Next steps

For Durable Task Scheduler for Durable Functions:
- [Quickstart: Configure a Durable Functions app to use the Durable Task Scheduler](./quickstart-durable-task-scheduler.md)
- [Create Durable Task Scheduler resources and view them in the dashboard](./develop-with-durable-task-scheduler.md)

For Durable Task Scheduler for the Durable Task SDKs:
- [Quickstart: Create an app with Durable Task SDKs and Durable Task Scheduler](./quickstart-portable-durable-task-sdks.md)
- [Quickstart: Configure Durable Task SDKs in your container app](./quickstart-container-apps-durable-task-sdk.md)