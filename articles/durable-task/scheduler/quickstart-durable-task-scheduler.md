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

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) or later.

::: zone-end

<!-- markdownlint-disable-next-line MD044 -->
::: zone pivot="javascript"

- [Node.js 18+](https://nodejs.org/) installed.

::: zone-end

::: zone pivot="python"

- [Python 3.9+](https://www.python.org/downloads/) installed.

::: zone-end

::: zone pivot="java"

- [Java 11+](https://adoptium.net/) (JDK) installed.
- [Apache Maven](https://maven.apache.org/download.cgi) 3.0 or later.

::: zone-end

<!-- markdownlint-disable-next-line MD044 -->
::: zone pivot="powershell"

- [PowerShell 7.4+](/powershell/scripting/install/installing-powershell) installed.

::: zone-end

::: zone pivot="csharp,javascript,python,java,powershell"

- [Azure Functions Core Tools](../../azure-functions/functions-run-local.md) v4 or later.
- [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator.
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler) to use the quickstart sample.

## Set up the Durable Task Scheduler emulator

The [Durable Task Scheduler emulator](./develop-with-durable-task-scheduler.md#durable-task-scheduler-emulator) provides a local development environment so you can test orchestrations without an Azure subscription.

::: zone-end

::: zone pivot="java,powershell"

The Java and PowerShell Functions hosts also require [Azurite](../../storage/common/storage-use-azurite.md) for local storage. Start both containers:

```bash
docker run -d --name dtsemulator -p 8080:8080 -p 8082:8082 \
  mcr.microsoft.com/dts/dts-emulator:latest

docker run -d --name azurite -p 10000:10000 -p 10001:10001 -p 10002:10002 \
  mcr.microsoft.com/azure-storage/azurite
```

::: zone-end

::: zone pivot="csharp,javascript,python"

Pull and start the emulator container:

```bash
docker run -d --name dtsemulator -p 8080:8080 -p 8082:8082 \
  mcr.microsoft.com/dts/dts-emulator:latest
```

::: zone-end

::: zone pivot="csharp,javascript,python,java,powershell"

> [!TIP]
> Once the emulator is running, you can access the Durable Task Scheduler dashboard at `http://localhost:8082` to monitor orchestrations.

## Run the quickstart sample

::: zone-end

::: zone pivot="csharp"

1. Navigate to the sample directory:

   ```bash
   cd samples/durable-functions/dotnet/HelloCities
   ```

1. Build and run:

   ```bash
   dotnet build
   func start
   ```

::: zone-end

<!-- markdownlint-disable-next-line MD044 -->
::: zone pivot="javascript"

1. Navigate to the sample directory:

   ```bash
   cd samples/durable-functions/javascript/HelloCities
   ```

1. Install dependencies and run:

   ```bash
   npm install
   func start
   ```

::: zone-end

::: zone pivot="python"

1. Navigate to the sample directory:

   ```bash
   cd samples/durable-functions/python/hello-cities
   ```

1. Create a virtual environment, install dependencies, and run:

   # [Linux / macOS](#tab/linux)

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   func start
   ```

   # [Windows](#tab/windows)

   ```powershell
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   func start
   ```

   ---

::: zone-end

::: zone pivot="java"

1. Navigate to the sample directory:

   ```bash
   cd samples/durable-functions/java/HelloCities
   ```

1. Build and run:

   ```bash
   mvn clean package
   mvn azure-functions:run
   ```

::: zone-end

<!-- markdownlint-disable-next-line MD044 -->
::: zone pivot="powershell"

1. Navigate to the sample directory:

   ```bash
   cd samples/durable-functions/powershell/HelloCities
   ```

1. Create a `local.settings.json` file:

   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "UseDevelopmentStorage=true",
       "FUNCTIONS_WORKER_RUNTIME": "powershell",
       "DURABLE_TASK_SCHEDULER_CONNECTION_STRING": "Endpoint=http://localhost:8080;TaskHub=default;Authentication=None"
     }
   }
   ```

1. Start the function app:

   ```bash
   func start
   ```

::: zone-end

::: zone pivot="csharp,javascript,python,java,powershell"

1. In a separate terminal, trigger an orchestration:

   ```bash
   curl -X POST http://localhost:7071/api/StartChaining
   ```

1. Copy the `statusQueryGetUri` from the response and open it in your browser. You should see the orchestration completed with greeting output.

1. View more details about the orchestration instance in the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md) at `http://localhost:8082`.

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

::: zone-end

## Clean up resources

If you no longer need the resources that you created to complete the quickstart, to avoid related costs in your Azure subscription, [delete the resource group](/azure/azure-resource-manager/management/delete-resource-group?tabs=azure-portal#delete-resource-group) and all related resources.

## Next steps

- Learn more about the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md).
- [Troubleshoot any errors you may encounter](./troubleshoot-durable-task-scheduler.md) while using Durable Task Scheduler.