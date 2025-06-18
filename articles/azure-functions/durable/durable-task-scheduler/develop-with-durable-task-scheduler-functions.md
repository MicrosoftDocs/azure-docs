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
You can create a scheduler and a task hub as part of the Function app creation on Azure portal. This creation approach automatically configures identity-based authentication for the app to access the task hub. 

> [!NOTE]
> Durable Task Scheduler currently supports apps hosted in the **App Service** and **Functions Premium** plans, so this experience is available only when either of these plan types is picked. 

[!INCLUDE [function-app-integrated-creation](./includes/function-app-integrated-creation.md)]

## Configure identity-based authentication for app to access Durable Task Scheduler

Durable Task Scheduler **only** supports either *user-assigned* or *system-assigned* managed identity authentication. **User-assigned identities are recommended,** as they aren't tied to the lifecycle of the app and can be reused after the app is deprovisioned.

See step-by-step instructions on how to [configure managed identity for your Durable Functions app](./durable-task-scheduler-identity.md).

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

- **[Management operations using the Azure Functions Core Tools](../durable-functions-instance-management.md#azure-functions-core-tools)**

## Next steps

> [!div class="nextstepaction"]
> [Run and deploy your Durable Functions app using the Durable Task Scheduler](./quickstart-durable-task-scheduler.md)