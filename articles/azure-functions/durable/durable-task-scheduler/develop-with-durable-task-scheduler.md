---
title: Develop with the Azure Functions Durable Task Scheduler (preview)
description: Learn how to develop with the Azure Functions Durable Task Scheduler and task hub resources.
ms.topic: how-to
ms.date: 03/19/2025
zone_pivot_groups: dts-devexp
---

# Develop with the Azure Functions Durable Task Scheduler (preview)

The Azure Functions Durable Task Scheduler is a highly performant, fully managed backend provider for Durable Functions with an [out-of-the-box monitoring dashboard](./durable-task-scheduler-dashboard.md). In this article, you learn how to:

> [!div class="checklist"]
> * Create a scheduler and task hub. 
> * Configure identity-based authentication for your application to access Durable Task Scheduler.
> * Monitor the status of your app and task hub on the Durable Task Scheduler dashboard. 

Learn more about Durable Task Scheduler [features](./durable-task-scheduler.md#feature-highlights), [supported regions](./durable-task-scheduler.md#limitations-and-considerations), and [plans](./durable-task-scheduler.md#limitations-and-considerations).

::: zone pivot="az-cli"  

## Prerequisites

- [The latest version of the Azure CLI.](/cli/azure/install-azure-cli) 

## Set up the CLI

1. Log in to the Azure CLI and make sure you have the latest installed.

    ```azurecli
    az login
    az upgrade
    ```

1. Install the Durable Task Scheduler CLI extension.

    ```azurecli
    az extension add --name durabletask
    ```

1. If you already installed the Durable Task Scheduler CLI extension, upgrade to the latest version.

    ```azurecli
    az extension add --upgrade --name durabletask
    ```

::: zone-end 

## Run Durable Task emulator

1. Pull the docker image containing the emulator. 

   ```bash
   docker pull mcr.microsoft.com/dts/dts-emulator:v0.0.5
   ```

1. Run the emulator.

   ```bash
   docker run -itP mcr.microsoft.com/dts/dts-emulator:v0.0.5
   ```

    This command exposes a single task hub named `default`. If you need more than one task hub, you can set the environment variable `DTS_TASK_HUB_NAMES` on the container to a comma-delimited list of task hub names like in the following command:

    ```bash
    docker run -itP -e DTS_TASK_HUB_NAMES=taskhub1,taskhub2,taskhub3 mcr.microsoft.com/dts/dts-emulator:v0.0.5
    ```

## Create a scheduler and task hub

::: zone pivot="az-cli"

> [!NOTE]
> Durable Task Scheduler currently supports apps hosted in the **App Service** and **Functions Premium** plans only.  

1. Create a resource group.

    ```azurecli
    az group create --name YOUR_RESOURCE_GROUP --location LOCATION
    ```

1. Using the `durabletask` CLI extension, create a scheduler.

    ```azurecli
    az durabletask scheduler create --name "YOUR_SCHEDULER" --resource-group "YOUR_RESOURCE_GROUP" --location "LOCATION" --ip-allowlist "[0.0.0.0/0]" --sku-name "dedicated" --sku-capacity "1"
    ```

    The creation process may take up to 15 minutes to complete.

    *Output*

    ```json
    {
        "id": "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_SCHEDULER",
        "location": "northcentralus",
        "name": "YOUR_SCHEDULER",
        "properties": {
            "endpoint": "https://YOUR_SCHEDULER.northcentralus.durabletask.io",
            "ipAllowlist": [
                "0.0.0.0/0"
            ],
            "provisioningState": "Succeeded",
            "sku": {
                "capacity": 1,
                "name": "Dedicated",
                "redundancyState": "None"
            }
        },
        "resourceGroup": "YOUR_RESOURCE_GROUP",
        "systemData": {
            "createdAt": "2025-01-06T21:22:59Z",
            "createdBy": "YOUR_EMAIL@microsoft.com",
            "createdByType": "User",
            "lastModifiedAt": "2025-01-06T21:22:59Z",
            "lastModifiedBy": "YOUR_EMAIL@microsoft.com",
            "lastModifiedByType": "User"
        },
        "tags": {}
    }
    ```

1. Create a task hub.

    ```azurecli
    az durabletask taskhub create --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER --name YOUR_TASKHUB
    ```

    *Output*

    ```json
    {
      "id": "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_SCHEDULERS/taskHubs/YOUR_TASKHUB",
      "name": "YOUR_TASKHUB",
      "properties": {
        "provisioningState": "Succeeded"
      },
      "resourceGroup": "YOUR_RESOURCE_GROUP",
      "systemData": {
        "createdAt": "2024-09-18T22:13:56.5467094Z",
        "createdBy": "OBJECT_ID",
        "createdByType": "User",
        "lastModifiedAt": "2024-09-18T22:13:56.5467094Z",
        "lastModifiedBy": "OBJECT_ID",
        "lastModifiedByType": "User"
      },
      "type": "microsoft.durabletask/scheduler/taskhubs"
    }
    ```

::: zone-end 

::: zone pivot="az-portal" 

You can create a scheduler and task hub on Azure portal via two ways: 
- **Function app integrated creation:** *(recommended)* automatically creates the managed identity resource and RBAC assignment, plus configures required environment variables for your app to access Durable Task Scheduler.
- **Top-level creation:** Requires you to [manually assign RBAC permission](#configure-identity-based-authentication-for-app-to-access-durable-task-scheduler) to configure scheduler access for your app.

> [!NOTE]
> Durable Task Scheduler currently supports apps hosted in the **App Service** and **Functions Premium** plans, so this experience is available only when either of these plan types is picked. 

# [Function app integrated creation](#tab/function-app-integrated-creation)  

You can create a scheduler and a task hub as part of the Function app creation on Azure portal. 

[!INCLUDE [function-app-integrated-creation](./includes/function-app-integrated-creation.md)]

# [Top-level creation](#tab/top-level-creation) 

1. In the Azure portal, search for **Durable Task Scheduler** and select it from the results. 

    :::image type="content" source="media/create-durable-task-scheduler/search-for-durable-task-scheduler.png" alt-text="Screenshot of searching for the Durable Task Scheduler in the portal.":::

1. Click **Create** to open the **Azure Functions: Durable Task Scheduler (preview)** pane.

    :::image type="content" source="media/create-durable-task-scheduler/top-level-create-form.png" alt-text="Screenshot of the create page for the Durable Task Scheduler.":::

1. Fill out the fields in the **Basics** tab. Click **Review + create**. Once the validation passes, click **Create**. 

    Deployment may take around 15 to 20 minutes. 

---

::: zone-end 

## View all Durable Task Scheduler resources in a subscription

::: zone pivot="az-cli" 

1. Get a list of all scheduler names within a subscription by running the following command.

    ```azurecli
    az durabletask scheduler list --subscription <SUBSCRIPTION_ID>
    ```

1. You can narrow down results to a specific resource group by adding the `--resource-group` flag.

    ```azurecli
    az durabletask scheduler list --subscription <SUBSCRIPTION_ID> --resource-group <RESOURCE_GROUP_NAME>
    ```

::: zone-end 

::: zone pivot="az-portal"

In the Azure portal, search for **Durable Task Scheduler** and select it from the results. 

:::image type="content" source="media/create-durable-task-scheduler/search-for-durable-task-scheduler.png" alt-text="Screenshot of searching for the Durable Task Scheduler service in the portal.":::

You can see the list of scheduler resources created in all subscriptions you have access to. 

::: zone-end 

## View all task hubs in a Durable Task Scheduler

::: zone pivot="az-cli" 

Retrieve a list of task hubs in a specific scheduler by running: 

```azurecli
az durabletask taskhub list --resource-group <RESOURCE_GROUP_NAME> --scheduler-name <SCHEDULER_NAME>
```

::: zone-end 

::: zone pivot="az-portal"

You can see all the task hubs created in a scheduler on the **Overview** of the resource on Azure portal. 

:::image type="content" source="media/create-durable-task-scheduler/durable-task-scheduler-overview-portal.png" alt-text="Screenshot of overview tab of Durable Task Scheduler in the portal.":::

::: zone-end 

## Delete the scheduler and task hub

::: zone pivot="az-cli" 

1. Delete the scheduler:

    ```azurecli
    az durabletask scheduler --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER
    ```

1. Delete a task hub:

    ```azurecli
    az durabletask taskhub delete --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER --name YOUR_TASKHUB
    ```

::: zone-end 

::: zone pivot="az-portal"

1. Open the scheduler resource on Azure portal and click **Delete**: 

    :::image type="content" source="media/create-durable-task-scheduler/durable-task-scheduler-delete-portal.png" alt-text="Screenshot of scheduler resource in the portal highlighting delete button.":::

1. Find the scheduler with the task hub you want to delete, then click into that task hub. Click **Delete**:

    :::image type="content" source="media/create-durable-task-scheduler/task-hub-delete-portal.png" alt-text="Screenshot of task hub resource in the portal highlighting delete button.":::

::: zone-end 

## Configure identity-based authentication for app to access Durable Task Scheduler

Durable Task Scheduler **only** supports either *user-assigned* or *system-assigned* managed identity authentication. **User-assigned identities are recommended,** as they aren't tied to the lifecycle of the app and can be reused after the app is deprovisioned.

If you haven't already, [configure managed identity for your Durable Functions app](./durable-task-scheduler-identity.md).

## Accessing the Durable Task Scheduler dashboard

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

## Auto scaling in Functions Premium plan 

For Durable Task Scheduler apps on the Functions Premium plan, enable the *Runtime Scale Monitoring* setting to get auto scaling of the app. 

::: zone pivot="az-portal"

1. In the portal overview of your function app, navigate to **Settings** > **Configuration**.

1. Under the **Function runtime settings** tab, turn on **Runtime Scale Monitoring**. 

    :::image type="content" source="media/develop-with-durable-task-scheduler/runtime-scale-monitoring.png" alt-text="Screenshot of searching for Durable Task Scheduler in the portal.":::

::: zone-end 

::: zone pivot="az-cli" 

Run the following command:

```azurecli
az resource update -g <resource_group> -n <function_app_name>/config/web --set properties.functionsRuntimeScaleMonitoringEnabled=1 --resource-type Microsoft.Web/sites
```

::: zone-end 

## Next steps

Try out the [Durable Functions quickstart sample](quickstart-durable-task-scheduler.md).