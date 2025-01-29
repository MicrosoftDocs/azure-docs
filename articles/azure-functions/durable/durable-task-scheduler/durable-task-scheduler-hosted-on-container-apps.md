---
title: Host a Durable Functions app using the Durable Task Scheduler (preview) on Azure Container Apps
description: Learn how to host a Durable Functions app using the Durable Task Scheduler on Azure Container Apps.
ms.topic: how-to
ms.date: 01/29/2025
---

Azure Functions provides integrated support for developing, deploying, and managing containerized function apps on Azure Container Apps. Learn more about [Azure Container apps hosting](../../functions-container-apps-hosting.md).

In this article, you learn how to host a Durable Functions app using Durable Task Scheduler on Azure Container Apps. The sample code will be in .NET 8 (isolated), but other languages are supported.

## Prerequisites

- An Azure subscription. [Don't have one? Create a free account.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [The latest Azure Functions Core Tools installed](../../functions-run-local.md)
- [The latest Azure CLI installed](/cli/azure/install-azure-cli)
- A Durable Task Scheduler and task hub 
- [Configure an Azurite storage emulator for local storage](/azure/storage/common/storage-use-azurite).
- An [Azure Storage account](https://learn.microsoft.com/azure/storage/common/storage-account-create?tabs=azure-portal), required by all Azure Function apps.
- [.NET 8.0 SDK installed](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker installed and started](https://docs.docker.com/install/), with a [Docker ID](https://hub.docker.com/signup)

> [!NOTE]
> If you have an M1 Mac, follow [these instructions](https://github.com/Azure/azure-functions-core-tools/issues/2901#issuecomment-1412660399) before proceeding.


## Create a local .NET isolated function project

1. In the terminal, run the following command to create a function project directory called `DurableFunctionsProj`:

    ```bash
    func init DurableFunctionsProj --worker-runtime dotnet-isolated --docker --target-framework net8.0
    ```

1. Change to the project directory:

    ```bash
    cd DurableFunctionsProj
    ```

   This directory has multiple project files, including the Dockerfile and the `host.json` and `local.settings.json` configuration files. 

1. Open the Dockerfile. It should look like the following:

    ```Dockerfile
    FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS installer-env

    COPY . /src/dotnet-function-app
    WORKDIR /src/dotnet-function-app
    RUN dotnet publish *.csproj --output /home/site/wwwroot

    FROM mcr.microsoft.com/azure-functions/dotnet-isolated:4-dotnet-isolated8.0
    ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
        AzureFunctionsJobHost__Logging__Console__IsEnabled=true

    COPY --from=installer-env ["/home/site/wwwroot", "/home/site/wwwroot"]
    ```

1. Create a file named `HelloOrchestration.cs` and add the following orchestration to it.

    ```csharp
    using System.Net;
    using Microsoft.Azure.Functions.Worker;
    using Microsoft.Azure.Functions.Worker.Http;
    using Microsoft.Extensions.Logging;

    using Microsoft.DurableTask;
    using Microsoft.DurableTask.Client;

    using System.Threading.Tasks;
    using System.Collections.Generic;

    namespace Company.Function
    {
        public static class HelloOrchestration
        {
            [Function(nameof(HelloOrchestration))]
            public static async Task<List<string>> RunOrchestrator(
                [OrchestrationTrigger] TaskOrchestrationContext context)
            {
                ILogger logger = context.CreateReplaySafeLogger(nameof(HelloOrchestration));
                logger.LogInformation("Saying hello.");
                var outputs = new List<string>();

                outputs.Add(await context.CallActivityAsync<string>(nameof(SayHello), "Tokyo"));
                outputs.Add(await context.CallActivityAsync<string>(nameof(SayHello), "Seattle"));
                outputs.Add(await context.CallActivityAsync<string>(nameof(SayHello), "London"));

                // returns ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
                return outputs;
            }

            [Function(nameof(SayHello))]
            public static string SayHello([ActivityTrigger] string name, FunctionContext executionContext)
            {
                ILogger logger = executionContext.GetLogger("SayHello");
                logger.LogInformation("Saying hello to {name}.", name);
                return $"Hello {name}!";
            }

            [Function("HelloOrchestration_HttpStart")]
            public static async Task<HttpResponseData> HttpStart(
                [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req,
                [DurableClient] DurableTaskClient client,
                FunctionContext executionContext)
            {
                ILogger logger = executionContext.GetLogger("HelloOrchestration_HttpStart");

                string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(
                    nameof(HelloOrchestration));

                logger.LogInformation("Started orchestration with ID = '{instanceId}'.", instanceId);

                return await client.CreateCheckStatusResponseAsync(req, instanceId);
            }
        }
    }
    ```

## Configure app to use Durable Task Scheduler

Before building and pushing the image to Docker Hub, configure the Durable Functions app to use Durable Task Scheduler. 

1. In `host.json`, add the `storageProvider` property and set type to be `azureManaged`:

    ```json
    {
        "version": "2.0",
        "extensions": {
        "durableTask": {
            "storageProvider": {
                "type": "azureManaged",
                "connectionStringName": "DURABLE_TASK_SCHEDULER_CONNECTION_STRING"
            },
            "hubName": "%TASKHUB_NAME%"
            }
        },
        "logging": {
            "applicationInsights": {
                "samplingSettings": {
                    "isEnabled": true,
                    "excludedTypes": "Request"
                },
                "enableLiveMetricsFilters": true
            }
        }
    }
    ```

2. Check your project's `.csproj` to make sure you have these packages:

    ```xml
    <FrameworkReference Include="Microsoft.AspNetCore.App" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.22.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http" Version="3.1.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.Http.AspNetCore" Version="1.2.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.17.4" />
    <PackageReference Include="Microsoft.ApplicationInsights.WorkerService" Version="2.22.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.ApplicationInsights" Version="1.2.0" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.DurableTask" Version="1.2.2" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged" Version="0.3.0-alpha" />
    ```

## Build the image

In the root project folder, run the following `docker build` command, providing a name and tag. 

    ```bash
    docker build --platform linux --tag <DOCKER_ID>/azuredurablefunctionsimage:v1.0.0 .
    ```
> **NOTE:** Add `--platform linux/amd64` if you have an M1 mac. 

Replace `<DOCKER_ID>` with your Docker Hub account ID.

## Push docker image to Docker Hub
Docker Hub is a container registry that hosts images and provides image and container services. To share your image, which includes deploying to Azure, you must push it to a registry.

1. Sign in to Docker with the `docker login` command
2. Push the image to Docker Hub by using the `docker push` command:
    ```bash
    docker push <docker_id>/azuredurablefunctionsimage:v1.0.0
    ```
Pushing the image the first time might take a few minutes (pushing subsequent changes is much faster). While you're waiting, you can proceed to the next section to create the required Azure resources in another terminal.

## Create Azure Container Apps environment and function app

1. Run the following commands to register the required service providers. 
    ```azurecli
    az login
    ```
    ```azurecli
    az account set -subscription | -s <subscription_name>
    ```
    ```azurecli
    az provider register --namespace Microsoft.Web
    az provider register --namespace Microsoft.App
    az provider register --namespace Microsoft.OperationalInsights
    ```

2. Add the `containerapp` extension:
    ```azurecli
    az upgrade
    ```
    ```azurecli
    az extension add --name containerapp --upgrade
    ```

3. Create an Azure Container Apps environment.
    ```azurecli
    az group create --name MyResourceGroup --location northcentralus
    az containerapp env create -n MyContainerappEnvironment -g MyResourceGroup --location northcentralus
    ````

4. Check to make sure your image was pushed successfully. Then run the following command deploy that image to a function app hosted in the previously created container apps environment:

    ```azurecli
    az functionapp create --resource-group MyResourceGroup --name <functionapp_name> \
    --environment MyContainerappEnvironment \
    --storage-account <Storage_name> \
    --functions-version 4 \
    --runtime dotnet-isolated \
    --min-replicas 1 \
    --image <DOCKER_ID>/<image_name>:<version> 
    ```

## Set up identity-based authentication for app

Follow all steps in [Run the app on Azure (.NET)](./configure-existing-app.md#run-the-app-on-azure-net) to set up identity-based authentication for the app, including configuring the required environment variables. 

## Test app

You can now test your Durable Functions app that's running inside an Azure Container Apps environment!

Navigate to `https://<function app name>.northcentralus.azurecontainerapps.io/api/HelloOrchestration_HttpStart` to start an orchestration instance:

```json
{
    "id": "a49573faf8674ee0ab5a66ce4bf1ec79",
    "purgeHistoryDeleteUri": "http://<function app name>.northcentralus.azurecontainerapps.io/runtime/webhooks/durabletask/instances/a49573faf8674ee0ab5a66ce4bf1ec79?code=<CODE>",
    "sendEventPostUri": "http://<function app name>.northcentralus.azurecontainerapps.io/runtime/webhooks/durabletask/instances/a49573faf8674ee0ab5a66ce4bf1ec79/raiseEvent/{eventName}?code=<CODE>",
    "statusQueryGetUri": "http://<function app name>.northcentralus.azurecontainerapps.io/runtime/webhooks/durabletask/instances/a49573faf8674ee0ab5a66ce4bf1ec79?code=<CODE>",
    "terminatePostUri": "http://<function app name>.northcentralus.azurecontainerapps.io/runtime/webhooks/durabletask/instances/a49573faf8674ee0ab5a66ce4bf1ec79/terminate?reason={{text}}&code=<CODE>",
    "suspendPostUri": "http://<function app name>.northcentralus.azurecontainerapps.io/runtime/webhooks/durabletask/instances/a49573faf8674ee0ab5a66ce4bf1ec79/suspend?reason={{text}}&code=<CODE>",
    "resumePostUri": "http://<function app name>.northcentralus.azurecontainerapps.io/runtime/webhooks/durabletask/instances/a49573faf8674ee0ab5a66ce4bf1ec79/resume?reason={{text}}&code=<CODE>"
}
```

Navigate to `statusQueryGetUri` to get the status of the instance: 

```json
{
    "name": "HelloOrchestration",
    "instanceId": "a49573faf8674ee0ab5a66ce4bf1ec79",
    "runtimeStatus": "Completed",
    "input": null,
    "customStatus": null,
    "output": [
        "Hello Tokyo!",
        "Hello Seattle!",
        "Hello London!"
    ],
    "createdTime": "2024-10-01T18:57:50Z",
    "lastUpdatedTime": "2024-10-01T18:57:50Z"
}
```

## A note on configuring scale rules

This tutorial command sets `min-replicas` to 1 when creating the function app. Increase the minimum replica count if your app needs to handle a large number of requests. You can also set `max-replicas` to specify the maximum number of replicas used to run your app. 


The following command sets minimum and maximum replica counts on an existing function app:

```azurecli
az functionapp config container set --name <APP_NAME> --resource-group <MY_RESOURCE_GROUP> --max-replicas 15 --min-replicas 1
```

> **NOTE:** Support for auto-scaling is on our roadmap. 

## Related links

- Try out samples for hosting Azure Functions on Azure Container Apps in the [azure-functions-on-container-apps](https://github.com/Azure/azure-functions-on-container-apps) GitHub repo. 