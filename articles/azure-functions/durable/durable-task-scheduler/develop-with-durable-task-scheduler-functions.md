---
title: Azure Functions Durable Task Scheduler in Durable Functions (preview)
description: Learn how to develop with the Azure Functions Durable Task Scheduler for Durable Functions.
ms.topic: how-to
ms.date: 05/06/2025
---

# Durable Task Scheduler in Durable Functions (preview)

The Azure Functions Durable Task Scheduler is a highly performant, fully managed backend provider for Durable Functions with an [out-of-the-box monitoring dashboard](./durable-task-scheduler-dashboard.md). Azure Functions extensions built into Durable Functions makes building event-driven scenarios easy. In this article, you learn how to:

> [!div class="checklist"]
> * Create a scheduler and task hub. 
> * Configure identity-based authentication for your application to access Durable Task Scheduler.
> * Monitor the status of your app and task hub on the Durable Task Scheduler dashboard. 

Learn more about Durable Task Scheduler [features](./durable-task-scheduler.md#feature-highlights), [supported regions](./durable-task-scheduler.md#limitations-and-considerations), and [plans](./durable-task-scheduler.md#limitations-and-considerations).

## Create a scheduler and task hub

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

## View all Durable Task Scheduler resources in a subscription

In the Azure portal, search for **Durable Task Scheduler** and select it from the results. 

:::image type="content" source="media/create-durable-task-scheduler/search-for-durable-task-scheduler.png" alt-text="Screenshot of searching for the Durable Task Scheduler service in the portal.":::

You can see the list of scheduler resources created in all subscriptions you have access to. 

## View all task hubs in a Durable Task Scheduler

You can see all the task hubs created in a scheduler on the **Overview** of the resource on Azure portal. 

:::image type="content" source="media/create-durable-task-scheduler/durable-task-scheduler-overview-portal.png" alt-text="Screenshot of overview tab of Durable Task Scheduler in the portal.":::

## Delete the scheduler and task hub

1. Open the scheduler resource on Azure portal and click **Delete**: 

    :::image type="content" source="media/create-durable-task-scheduler/durable-task-scheduler-delete-portal.png" alt-text="Screenshot of scheduler resource in the portal highlighting delete button.":::

1. Find the scheduler with the task hub you want to delete, then click into that task hub. Click **Delete**:

    :::image type="content" source="media/create-durable-task-scheduler/task-hub-delete-portal.png" alt-text="Screenshot of task hub resource in the portal highlighting delete button.":::

## Configure identity-based authentication for app to access Durable Task Scheduler

Durable Task Scheduler **only** supports either *user-assigned* or *system-assigned* managed identity authentication. **User-assigned identities are recommended,** as they aren't tied to the lifecycle of the app and can be reused after the app is deprovisioned.

If you haven't already, [configure managed identity for your Durable Functions app](./durable-task-scheduler-identity.md).

## Access the Durable Task Scheduler dashboard

[Assign the required role to your *developer identity (email)*](./durable-task-scheduler-dashboard.md#access-the-durable-task-scheduler-dashboard) to gain access to the Durable Task Scheduler dashboard. 

## Auto scaling in Functions Premium plan 

For Durable Functions apps on the Functions Premium plan, you can enable autoscaling using the *Runtime Scale Monitoring* setting. 

1. In the portal overview of your function app, navigate to **Settings** > **Configuration**.

1. Under the **Function runtime settings** tab, turn on **Runtime Scale Monitoring**. 

    :::image type="content" source="media/develop-with-durable-task-scheduler/runtime-scale-monitoring.png" alt-text="Screenshot of searching for Durable Task Scheduler in the portal.":::

You can also set autoscaling using the Azure CLI.

```azurecli
az resource update -g <resource_group> -n <function_app_name>/config/web --set properties.functionsRuntimeScaleMonitoringEnabled=1 --resource-type Microsoft.Web/sites
```

## Limitations

- **Supported hosting plans:** 

   The Durable Task Scheduler currently only supports Durable Functions running on *Functions Premium* and *App Service* plans. For apps running on the Functions Premium plan, you must [enable the *Runtime Scale Monitoring* setting](#auto-scaling-in-functions-premium-plan) to get auto scaling of the app.

   The *Consumption*, *Flex Consumption*, and *Azure Container App* hosting plans aren't yet supported when using the Durable Task Scheduler.

- **Migrating [task hub data](../durable-functions-task-hubs.md) across backend providers:** 

   Currently, migrating across providers isn't supported. Function apps that have existing runtime data need to start with a fresh, empty task hub after they switch to the Durable Task Scheduler. Similarly, the task hub contents that are created by using the scheduler resource can't be preserved if you switch to a different backend provider.

## Next steps

> [!div class="nextstepaction"]
> [Run and deploy your Durable Functions app using the Durable Task Scheduler](./quickstart-durable-task-scheduler.md)