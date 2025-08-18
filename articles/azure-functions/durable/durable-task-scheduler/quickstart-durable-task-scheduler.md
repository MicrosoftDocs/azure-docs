---
title: "Quickstart: Configure a Durable Functions app to use Azure Functions Durable Task Scheduler (preview)"
description: Learn how to configure an existing Durable Functions app to use Azure Functions Durable Task Scheduler.
ms.topic: how-to
ms.date: 05/06/2025
zone_pivot_groups: dts-runtime
---

# Quickstart: Configure a Durable Functions app to use Azure Functions Durable Task Scheduler (preview)

Write stateful functions in a serverless environment using Durable Functions, a feature of [Azure Functions](../../functions-overview.md). Scenarios where Durable Functions is useful include orchestrating microservices and workflows, stateful patterns like fan-out/fan-in, and long-running tasks.  

You can use the Durable Task Scheduler as a backend for your Durable Functions, to store orchestration and entity runtime state. 

In this quickstart, you: 

> [!div class="checklist"]
> * Configure an existing Durable Functions app to use the Durable Task Scheduler. 
> * Set up the Durable Task emulator for local development.
> * Deploy your app to Azure on the App Service plan using Visual Studio Code.
> * Monitor the status of your app and task hub on the Durable Task Scheduler dashboard. 

> [!NOTE]
> Durable Task Scheduler currently only supports Durable Functions running on **Functions Premium** and **App Service** plans. 

## Prerequisites

This quickstart assumes you already have an Azure Functions project on your local computer with:
- Durable functions added to your project including:
  - An [orchestrator function](../durable-functions-bindings.md#orchestration-trigger). 
  - A [client function](../durable-functions-bindings.md#orchestration-client) that triggers the Durable Functions app.
- The project configured for local debugging.

If you don't meet these prerequisites, we recommend that you begin with one of the following quickstarts to set up a local Functions project:

::: zone pivot="csharp"  

- [Create a Durable Functions app - C#](../durable-functions-isolated-create-first-csharp.md)

::: zone-end 

::: zone pivot="other"  

- [Create a Durable Functions app - JavaScript](../quickstart-js-vscode.md)
- [Create a Durable Functions app - Python](../quickstart-python-vscode.md)
- [Create a Durable Functions app - PowerShell](../quickstart-powershell-vscode.md)
- [Create a Durable Functions app - Java](../quickstart-java.md)

::: zone-end 

You also need:
- [Docker](https://docs.docker.com/engine/install/) installed to run the Durable Task Scheduler emulator. 
- [Azurite](../../../storage/common/storage-use-azurite.md#run-azurite) installed.
- An [HTTP test tool](../../functions-develop-local.md#http-test-tools) that keeps your data secure.

## Add the Durable Task Scheduler package

::: zone pivot="csharp" 

Install the latest version of the [Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged) package by using the [dotnet add package](/dotnet/core/tools/dotnet-add-package) command:

   ```bash
   dotnet add package Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged --prerelease
   ```

> [!NOTE] 
> The Durable Task Scheduler extension requires **Microsoft.Azure.Functions.Worker.Extensions.DurableTask** version `1.2.2` or higher. 

::: zone-end 

::: zone pivot="other"  

In host.json, update the `extensionBundle` property to use the preview version that contains the Durable Task Scheduler package:

```json
{
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[4.29.0, 5.0.0)"
  }
}
```

::: zone-end 

## Update host.json

Update the host.json as follows to use Durable Task Scheduler as the backend. 

```json
{
  "extensions": {
    "durableTask": {
      "hubName": "%TASKHUB_NAME%",
      "storageProvider": {
        "type": "azureManaged",
        "connectionStringName": "DURABLE_TASK_SCHEDULER_CONNECTION_STRING"
      }
    }
  }
}
```

## Configure local.settings.json 

Add connection information for local development:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "<DEPENDENT ON YOUR PROGRAMMING LANGUAGE>",
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "DURABLE_TASK_SCHEDULER_CONNECTION_STRING": "Endpoint=http://localhost:8080;Authentication=None",
    "TASKHUB_NAME": "default"
  }
}
```

## Set up the Durable Task emulator 

1. Pull the docker image containing the emulator. 

   ```bash
   docker pull mcr.microsoft.com/dts/dts-emulator:latest
   ```

1. Run the emulator.

   ```bash
   docker run -d -p 8080:8080 -p 8082:8082 mcr.microsoft.com/dts/dts-emulator:latest
   ```
   
   The following output indicates the emulator started successfully.

     :::image type="content" source="media/quickstart-durable-task-scheduler/emulator-started.png" alt-text="Screenshot showing emulator started successfully on terminal.":::

1. Make note of the ports exposed on Docker desktop. The scheduler exposes multiple ports for different purposes:  

   - `8080`: gRPC endpoint that allows an app to connect to the scheduler
   - `8082`: Endpoint for Durable Task Scheduler dashboard

   :::image type="content" source="media/quickstart-durable-task-scheduler/docker-ports.png" alt-text="Screenshot of ports on Docker.":::


## Test locally 

1. Go to the root directory of your app and start Azurite.

   ```bash
   azurite start
   ```

1. Run the application.

   ```bash
   func start
   ```

   You should see a list of the functions in your app. If you created your app following one of the Durable Functions quickstarts, you should see something similar to the following output:

   :::image type="content" source="media/quickstart-durable-task-scheduler/function-list.png" alt-text="Screenshot of functions listed when running app locally.":::

1. Start an orchestration instance by sending an HTTP `POST` request to the URL endpoint using the [HTTP test tool](../../functions-develop-local.md#http-test-tools) you chose. 

1. Copy the URL value for `statusQueryGetUri` and paste it in your browser's address bar. You should see the status on the orchestration instance:

   ```json
     {
       "name": "DurableFunctionsOrchestrationCSharp1",
       "instanceId": "b50f8b723f2f44149ab9fd2e3790a0e8",
       "runtimeStatus": "Completed",
       "input": null,
       "customStatus": null,
       "output": [
         "Hello Tokyo!",
         "Hello Seattle!",
         "Hello London!"
       ],
       "createdTime": "2025-02-21T21:09:59Z",
       "lastUpdatedTime": "2025-02-21T21:10:00Z"
     }
   ```

1. To view more details about the orchestration instance, go to **http://localhost:8082/** access the Durable Task Scheduler dashboard. 

1. Click on the *default* task hub to see its dashboard. 

> [!NOTE] 
> Learn more about the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md). 
>
> The [Durable Task Scheduler emulator](./durable-task-scheduler.md#emulator-for-local-development) stores orchestration data in memory, which means all data is lost when it shuts down. 
>
> Running into issues testing? [See the troubleshooting guide.](./troubleshoot-durable-task-scheduler.md)

## Run your app in Azure 

### Create required resources

Create a Durable Task Scheduler instance and Azure Functions app on Azure following the *Function app integrated creation flow*. This experience will automatically set up identity-based access and configure the required environment variables for the app to access the scheduler. 

[!INCLUDE [function-app-integrated-creation](./includes/function-app-integrated-creation.md)]

Resource deployment could take around 15 to 20 minutes. Once that is finished, you can deploy your app to Azure. 

### Deploy your function app to Azure

[!INCLUDE [functions-publish-project-vscode](../../../../includes/functions-deploy-project-vs-code.md)]

#### Apps on Functions Premium plan

If your app is running on the Functions Premium plan, turn on the *Runtime Scale Monitoring* setting after deployment to ensure your app autoscales based on load:

  ```azurecli
  az resource update -g <resource_group> -n <function_app_name>/config/web --set properties.functionsRuntimeScaleMonitoringEnabled=1 --resource-type Microsoft.Web/sites
  ```

## Test your function app 

Run the following command to get your function's URL: 
  
```azurecli
az functionapp function list --resource-group <RESOURCE_GROUP_NAME> --name <FUNCTION_APP_NAME>  --query '[].{Function:name, URL:invokeUrlTemplate}' --output json
```

### Check orchestration status

Check the status of the orchestration instance and activity details on the Durable Task Scheduler dashboard. Accessing the dashboard requires you to log in. 

[!INCLUDE [assign-dev-identity-role-based-access-control-portal](./includes/assign-dev-identity-role-based-access-control-portal.md)]

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Next steps

- Learn more about the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md).
- [Troubleshoot any errors you may encounter](./troubleshoot-durable-task-scheduler.md) while using Durable Task Scheduler.