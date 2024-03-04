---
title: 'Tutorial: Get started with Azure Functions triggers in Azure Cache for Redis'
description: In this tutorial, you learn how to use Azure Functions with Azure Cache for Redis.
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: tutorial
ms.date: 07/19/2023
#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.

---

# Tutorial: Get started with Azure Functions triggers in Azure Cache for Redis

This tutorial shows how to implement basic triggers with Azure Cache for Redis and Azure Functions. It guides you through using Visual Studio Code (VS Code) to write and deploy an Azure function in C#.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up the necessary tools.
> * Configure and connect to a cache.
> * Create an Azure function and deploy code to it.
> * Confirm the logging of triggers.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Visual Studio Code](https://code.visualstudio.com/).

## Set up an Azure Cache for Redis instance

Create a new Azure Cache for Redis instance by using the Azure portal or your preferred CLI tool. This tutorial uses a _Standard C1_ instance, which is a good starting point. Use the [quickstart guide](quickstart-create-redis.md) to get started.

:::image type="content" source="media/cache-tutorial-functions-getting-started/cache-new-standard.png" alt-text="Screenshot of creating a cache in the Azure portal.":::

The default settings should suffice. This tutorial uses a public endpoint for demonstration, but we recommend that you use a private endpoint for anything in production.

Creating the cache can take a few minutes. You can move to the next section while the process finishes.

## Set up Visual Studio Code

1. If you haven't installed the Azure Functions extension for VS Code, search for **Azure Functions** on the **EXTENSIONS** menu, and then select **Install**. If you don't have the C# extension installed, install it, too.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-code-editor.png" alt-text="Screenshot of the required extensions installed in VS Code.":::

1. Go to the **Azure** tab. Sign in to your Azure account.

1. Create a new local folder on your computer to hold the project that you're building. This tutorial uses _RedisAzureFunctionDemo_ as an example.

1. On the **Azure** tab, create a new function app by selecting the lightning bolt icon in the upper right of the **Workspace** tab.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-add-resource.png" alt-text="Screenshot that shows the icon for adding a new function from VS Code.":::

1. Select the folder that you created to start the creation of a new Azure Functions project. You get several on-screen prompts. Select:

   - **C#** as the language.
   - **.NET 6.0 LTS** as the .NET runtime.
   - **Skip for now** as the project template.

   If you don't have the .NET Core SDK installed, you're prompted to do so.

1. Confirm that the new project appears on the **EXPLORER** pane.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-vscode-workspace.png" alt-text="Screenshot of a workspace in VS Code.":::

## Install the necessary NuGet package

You need to install `Microsoft.Azure.WebJobs.Extensions.Redis`, the NuGet package for the Redis extension that allows Redis keyspace notifications to be used as triggers in Azure Functions.

Install this package by going to the **Terminal** tab in VS Code and entering the following command:

```terminal
dotnet add package Microsoft.Azure.WebJobs.Extensions.Redis --prerelease
```

## Configure the cache

1. Go to your newly created Azure Cache for Redis instance.

1. Go to your cache in the Azure portal, and then:

   1. On the resource menu, select **Advanced settings**.
   1. Scroll down to the **notify-keyspace-events** box and enter **KEA**.

      **KEA** is a configuration string that enables keyspace notifications for all keys and events. For more information on keyspace configuration strings, see the [Redis documentation](https://redis.io/docs/manual/keyspace-notifications/).
   1. Select **Save** at the top of the window.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-keyspace-notifications.png" alt-text="Screenshot of advanced settings for Azure Cache for Redis in the portal.":::

1. Select **Access keys** from the resource menu, and then write down or copy the contents of the **Primary connection string** box. This string is used to connect to the cache.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-access-keys.png" alt-text="Screenshot that shows the primary connection string for an access key.":::

## Set up the example code

1. Go back to VS Code and add a file called _RedisFunctions.cs_ to the project.

1. Copy and paste the following code sample into the new file:

    ```csharp
    using Microsoft.Extensions.Logging;
    using StackExchange.Redis;

    namespace Microsoft.Azure.WebJobs.Extensions.Redis.Samples
    {
        public static class RedisSamples
        {
            public const string connectionString = "redisConnectionString";

            [FunctionName(nameof(PubSubTrigger))]
            public static void PubSubTrigger(
                [RedisPubSubTrigger(connectionString, "pubsubTest")] string message,
                ILogger logger)
            {
                logger.LogInformation(message);
            }

            [FunctionName(nameof(KeyspaceTrigger))]
            public static void KeyspaceTrigger(
                [RedisPubSubTrigger(connectionString, "__keyspace@0__:keyspaceTest")] string message,
                ILogger logger)
            {
                logger.LogInformation(message);
            }

            [FunctionName(nameof(KeyeventTrigger))]
            public static void KeyeventTrigger(
                [RedisPubSubTrigger(connectionString, "__keyevent@0__:del")] string message,
                ILogger logger)
            {
                logger.LogInformation(message);
            }

            [FunctionName(nameof(ListTrigger))]
            public static void ListTrigger(
                [RedisListTrigger(connectionString, "listTest")] string entry,
                ILogger logger)
            {
                logger.LogInformation(entry);
            }

            [FunctionName(nameof(StreamTrigger))]
            public static void StreamTrigger(
                [RedisStreamTrigger(connectionString, "streamTest")] string entry,
                ILogger logger)
            {
                logger.LogInformation(entry);
            }
        }
    }
    ```

1. This tutorial shows multiple ways to trigger on Redis activity:

    - `PubSubTrigger`, which is triggered when an activity is published to the Pub/Sub channel named `pubsubTest`.
    - `KeyspaceTrigger`, which is built on the Pub/Sub trigger. Use it to look for changes to the `keyspaceTest` key.
    - `KeyeventTrigger`, which is also built on the Pub/Sub trigger. Use it to look for any use of the `DEL` command.
    - `ListTrigger`, which looks for changes to the `listTest` list.
    - `StreamTrigger`, which looks for changes to the `streamTest` stream.

## Connect to your cache

1. To trigger on Redis activity, you need to pass in the connection string of your cache instance. This information is stored in the _local.settings.json_ file that was automatically created in your folder. We recommend that you use the [local settings file](../azure-functions/functions-run-local.md#local-settings) as a security best practice.

1. To connect to your cache, add a `ConnectionStrings` section in the _local.settings.json_ file, and then add your connection string by using the `redisConnectionString` parameter. The section should look like this example:

    ```json
    {
      "IsEncrypted": false,
      "Values": {
        "AzureWebJobsStorage": "",
        "FUNCTIONS_WORKER_RUNTIME": "dotnet",
        "redisConnectionString": "<your-connection-string>"
      }
    }
    ```

    The code in _RedisConnection.cs_ looks to this value when it's running locally:

      ```csharp
      public const string connectionString = "redisConnectionString";
      ```

> [!IMPORTANT]
> This example is simplified for the tutorial. For production use, we recommend that you use [Azure Key Vault](../service-connector/tutorial-portal-key-vault.md) to store connection string information.

## Build and run the code locally

1. Switch to the **Run and debug** tab in VS Code and select the green arrow to debug the code locally. If you don't have Azure Functions core tools installed, you're prompted to do so. In that case, you'll need to restart VS Code after installing.

1. The code should build successfully. You can track its progress in the terminal output.

1. To test the trigger functionality, try creating and deleting the `keyspaceTest` key.

   You can use any way you prefer to connect to the cache. An easy way is to use the built-in console tool in the Azure Cache for Redis portal. Go to the cache instance in the Azure portal, and then select **Console** to open it.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-console.png" alt-text="Screenshot of C-Sharp code and a connection string.":::

   After the console is open, try the following commands:

    - `SET keyspaceTest 1`
    - `SET keyspaceTest 2`
    - `DEL keyspaceTest`
    - `PUBLISH pubsubTest testMessage`
    - `LPUSH listTest test`
    - `XADD streamTest * name Clippy`

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-console-output.png" alt-text="Screenshot of a console and some Redis commands and results.":::

1. Confirm that the triggers are being activated in the terminal.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-triggers-working-lightbox.png" alt-text="Screenshot of the VS Code editor with code running." lightbox="media/cache-tutorial-functions-getting-started/cache-triggers-working.png":::

## Deploy code to an Azure function

1. Create a new Azure function:

   1. Go back to the **Azure** tab and expand your subscription.
   1. Right-click **Function App**, and then select **Create Function App in Azure (Advanced)**.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-create-function-app.png" alt-text="Screenshot of selections for creating a function app in VS Code.":::

1. You get several prompts for information to configure the new function app:

    - Enter a unique name.
    - Select **.NET 6 (LTS)** as the runtime stack.
    - Select either **Linux** or **Windows** (either works).
    - Select an existing or new resource group to hold the function app.
    - Select the same region as your cache instance.
    - Select **Premium** as the hosting plan.
    - Create a new Azure App Service plan.
    - Select the **EP1** pricing tier.
    - Select an existing storage account or create a new one.
    - Create a new Application Insights resource. You use the resource to confirm that the trigger is working.

    > [!IMPORTANT]
    > Redis triggers aren't currently supported on consumption functions.

1. Wait a few minutes for the new function app to be created. It appears under **Function App** in your subscription. Right-click the new function app, and then select **Deploy to Function App**.

    :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-deploy-to-function.png" alt-text="Screenshot of selections for deploying to a function app in VS Code.":::

1. The app builds and starts deploying. You can track its progress in the output window.

## Add connection string information

1. In the Azure portal, go to your new function app and select **Configuration** from the resource menu.

1. On the working pane, go to **Application settings**. In the **Connection strings** section, select **New connection string**.

1. For **Name**, enter **redisConnectionString**.

1. For **Value**, enter your connection string.

1. Set **Type** to **Custom**, and then select **Ok** to close the menu.

1. Select **Save** on the configuration page to confirm. The function app restarts with the new connection string information.

## Test your triggers

1. After deployment is complete and the connection string information is added, open your function app in the Azure portal. Then select **Log Stream** from the resource menu.

1. Wait for Log Analytics to connect, and then use the Redis console to activate any of the triggers. Confirm that triggers are being logged here.

    :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-log-stream.png" alt-text="Screenshot of a log stream for a function app resource on the resource menu." lightbox="media/cache-tutorial-functions-getting-started/cache-log-stream.png":::

## Next step

> [!div class="nextstepaction"]
> [Create serverless event-based architectures by using Azure Cache for Redis and Azure Functions (preview)](cache-how-to-functions.md)
