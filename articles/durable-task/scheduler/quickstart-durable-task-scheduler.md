---
author: hhunter-ms
ms.author: hannahhunter
title: "Quickstart: Configure a Durable Functions app to use Durable Task Scheduler"
titleSuffix: Durable Task
description: Configure an existing Durable Functions app to use the Durable Task Scheduler backend and run locally with the emulator. Get started now.
ms.topic: quickstart
ms.service: durable-task
ms.subservice: durable-task-scheduler
ms.date: 05/26/2026
zone_pivot_groups: df-languages
---

# Quickstart: Configure a Durable Functions app to use Durable Task Scheduler

Use the [Durable Task Scheduler](./durable-task-scheduler.md) as a backend for your [Durable Functions](../../azure-functions/durable-functions/durable-functions-overview.md) apps to store orchestration and entity runtime state. In this quickstart, you clone a Hello Cities sample that's already configured to use the Durable Task Scheduler, run it locally with the emulator, and then deploy it to Azure.

> [!div class="checklist"]
>
> - Clone the Hello Cities sample pre-configured for Durable Task Scheduler.
> - Set up the Durable Task Scheduler emulator for local development.
> - Run the sample and verify orchestration output.
> - Deploy your app to Azure and monitor it via the Durable Task Scheduler dashboard.

## Prerequisites

::: zone pivot="csharp"

- [Create a Durable Functions app - C#](../durable-functions/durable-functions-isolated-create-first-csharp.md)

::: zone-end

<!-- markdownlint-disable-next-line MD044 -->
::: zone pivot="javascript"

- [Create a Durable Functions app - JavaScript](../durable-functions/quickstart-js-vscode.md)

::: zone-end

::: zone pivot="python"

- [Create a Durable Functions app - Python](../durable-functions/quickstart-python-vscode.md)

::: zone-end

<!-- markdownlint-disable-next-line MD044 -->
::: zone pivot="powershell"

- [Create a Durable Functions app - PowerShell](../durable-functions/quickstart-powershell-vscode.md)

::: zone-end

::: zone pivot="java"

- [Create a Durable Functions app - Java](../durable-functions/quickstart-java.md)

::: zone-end

::: zone pivot="csharp,javascript,python,java,powershell"

> [!TIP]
> Once the emulator is running, you can access the Durable Task Scheduler dashboard at `http://localhost:8082` to monitor orchestrations.

## Run the quickstart sample

::: zone-end

::: zone pivot="csharp"

Install the latest version of the [Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged) package by using the [dotnet add package](/dotnet/core/tools/dotnet-add-package) command:

   ```bash
   dotnet add package Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged --prerelease
   ```

> [!NOTE] 
> The Durable Task Scheduler extension requires **Microsoft.Azure.Functions.Worker.Extensions.DurableTask** version `1.2.2` or higher. 

1. Build and start the function app:

   ```bash
   dotnet build
   func start
   ```

::: zone-end

<!-- markdownlint-disable-next-line MD044 -->
::: zone pivot="javascript,python,java,powershell"  

In host.json, update the `extensionBundle` property to use version 4.32.0 or later, which includes Durable Task Scheduler support:

   ```json
   {
     "extensionBundle": {
       "id": "Microsoft.Azure.Functions.ExtensionBundle",
       "version": "[4.32.0, 5.0.0)"
     }
   }
   ```

::: zone-end

<!-- markdownlint-disable-next-line MD044 -->
::: zone pivot="javascript,python,powershell"  

1. Start the function app:

   ```bash
   func start
   ```

::: zone-end

::: zone pivot="java"

1. Build and start the function app:

   ```bash
   mvn clean package
   mvn azure-functions:run
   ```

::: zone-end

::: zone pivot="csharp"

2. In a separate terminal, trigger an orchestration:

   ```powershell
   $response = Invoke-RestMethod -Method POST -Uri http://localhost:7071/api/DurableFunctionsOrchestrationCSharp1_HttpStart
   $response
   ```

::: zone-end

<!-- markdownlint-disable-next-line MD044 -->
::: zone pivot="javascript,python,java,powershell"

2. In a separate terminal, trigger an orchestration:

   ```powershell
   $response = Invoke-RestMethod -Method POST -Uri http://localhost:7071/api/StartChaining
   $response
   ```

::: zone-end

::: zone pivot="csharp,javascript,python,java,powershell"

3. The response contains status URLs for the orchestration instance. Query the `statusQueryGetUri` to check the result:

   ```powershell
   Invoke-RestMethod -Uri $response.statusQueryGetUri
   ```

   When the orchestration's `runtimeStatus` is `Completed`, the output contains greeting results. If `runtimeStatus` shows `Running` or `Pending`, wait a moment and query again.

4. View more details about the orchestration instance in the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md) at `http://localhost:8082`.

::: zone-end

::: zone pivot="csharp,javascript,python,java,powershell"

## Understand the Durable Task Scheduler configuration

The key configuration that makes these samples use the Durable Task Scheduler is in two files.

### host.json

The `storageProvider` section tells Durable Functions to use the Durable Task Scheduler (`azureManaged`) instead of the default Azure Storage backend:

```json
{
  "extensions": {
    "durableTask": {
      "hubName": "default",
      "storageProvider": {
        "type": "azureManaged",
        "connectionStringName": "DURABLE_TASK_SCHEDULER_CONNECTION_STRING"
      }
    }
  }
}
```

### local.settings.json

The connection string points to the local emulator for development:

```json
{
  "Values": {
    "DURABLE_TASK_SCHEDULER_CONNECTION_STRING": "Endpoint=http://localhost:8080;TaskHub=default;Authentication=None"
  }
}
```

> [!NOTE]
> To migrate an existing Durable Functions app, update these two files and add the appropriate extension package for your language. For .NET, install the [Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged) NuGet package. For other languages, update the extension bundle in `host.json` to version `[4.32.0, 5.0.0)`.

::: zone-end

## Run your app in Azure

### Create required resources

Create a Durable Task Scheduler instance and Azure Functions app on Azure following the *Function app integrated creation flow*. This experience will automatically set up identity-based access and configure the required environment variables for the app to access the scheduler.

[!INCLUDE [function-app-integrated-creation](./includes/function-app-integrated-creation.md)]

Resource deployment could take around 15 to 20 minutes. Once that is finished, you can deploy your app to Azure.

### Deploy your function app to Azure

[!INCLUDE [functions-publish-project-vscode](../../../includes/functions-deploy-project-vs-code.md)]

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