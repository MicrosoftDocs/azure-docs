---
title: 'Tutorial: Get started with Azure Functions triggers and bindings in Azure Cache for Redis'
description: In this tutorial, you learn how to use Azure Functions with Azure Cache for Redis.
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: tutorial
ms.date: 04/12/2024
#CustomerIntent: As a developer, I want a introductory example of using Azure Cache for Redis triggers with Azure Functions so that I can understand how to use the functions with a Redis cache.

---

# Tutorial: Get started with Azure Functions triggers and bindings in Azure Cache for Redis

This tutorial shows how to implement basic triggers with Azure Cache for Redis and Azure Functions. It guides you through using Visual Studio Code (VS Code) to write and deploy an Azure function in C#.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Set up the necessary tools.
> - Configure and connect to a cache.
> - Create an Azure function and deploy code to it.
> - Confirm the logging of triggers.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Visual Studio Code](https://code.visualstudio.com/).

## Set up an Azure Cache for Redis instance

Create a new Azure Cache for Redis instance by using the Azure portal or your preferred CLI tool. This tutorial uses a _Standard C1_ instance, which is a good starting point. Use the [quickstart guide](quickstart-create-redis.md) to get started.

:::image type="content" source="media/cache-tutorial-functions-getting-started/cache-new-standard.png" alt-text="Screenshot of creating a cache in the Azure portal.":::

The default settings should suffice. This tutorial uses a public endpoint for demonstration, but we recommend that you use a private endpoint for anything in production.

Creating the cache can take a few minutes. You can move to the next section while the process finishes.

## Set up Visual Studio Code

1. If you didn't install the Azure Functions extension for VS Code yet, search for **Azure Functions** on the **EXTENSIONS** menu, and then select **Install**. If you don't have the C# extension installed, install it, too.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-code-editor.png" alt-text="Screenshot of the required extensions installed in VS Code.":::

1. Go to the **Azure** tab. Sign in to your Azure account.

1. To store the project that you're building, create a new local folder on your computer. This tutorial uses _RedisAzureFunctionDemo_ as an example.

1. On the **Azure** tab, create a new function app by selecting the lightning bolt icon in the upper right of the **Workspace** tab.

1. Select **Create function...**.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-add-resource.png" alt-text="Screenshot that shows the icon for adding a new function from VS Code.":::

1. Select the folder that you created to start the creation of a new Azure Functions project. You get several on-screen prompts. Select:

   - **C#** as the language.
   - **.NET 8.0 Isolated LTS** as the .NET runtime.
   - **Skip for now** as the project template.

   If you don't have the .NET Core SDK installed, you're prompted to do so.

    > [!IMPORTANT]
    > For .NET functions, using the _isolated worker model_ is recommended over the _in-process_ model. For a comparison of the in-process and isolated worker models, see [differences between the isolated worker model and the in-process model for .NET on Azure Functions](../azure-functions/dotnet-isolated-in-process-differences.md). This sample uses the _isolated worker model_.
    >

1. Confirm that the new project appears on the **EXPLORER** pane.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-vscode-workspace.png" alt-text="Screenshot of a workspace in VS Code.":::

## Install the necessary NuGet package

You need to install `Microsoft.Azure.Functions.Worker.Extensions.Redis`, the NuGet package for the Redis extension that allows Redis keyspace notifications to be used as triggers in Azure Functions.

Install this package by going to the **Terminal** tab in VS Code and entering the following command:

```terminal
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Redis --prerelease
```

> [!NOTE]
> The `Microsoft.Azure.Functions.Worker.Extensions.Redis` package is used for .NET isolated worker process functions. .NET in-process functions and all other languages will use the `Microsoft.Azure.WebJobs.Extensions.Redis` package instead.
>

## Configure the cache

1. Go to your newly created Azure Cache for Redis instance.

1. Go to your cache in the Azure portal, and then:

   1. On the resource menu, select **Advanced settings**.

   1. Scroll down to the **notify-keyspace-events** box and enter **KEA**.

      **KEA** is a configuration string that enables keyspace notifications for all keys and events. For more information on keyspace configuration strings, see the [Redis documentation](https://redis.io/docs/manual/keyspace-notifications/).

   1. Select **Save** at the top of the window.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-keyspace-notifications.png" alt-text="Screenshot of advanced settings for Azure Cache for Redis in the portal.":::

1. Locate **Access keys** on the Resource menu, and then write down or copy the contents of the **Primary connection string** box. This string is used to connect to the cache.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-access-keys.png" alt-text="Screenshot that shows the primary connection string for an access key.":::

## Set up the example code for Redis triggers

1. In VS Code, add a file called _Common.cs_ to the project. This class is used to help parse the JSON serialized response for the PubSubTrigger.

1. Copy and paste the following code into the _Common.cs_ file:
  
    ```csharp
    public class Common
    {
        public const string connectionString = "redisConnectionString";
    
        public class ChannelMessage
        {
            public string SubscriptionChannel { get; set; }
            public string Channel { get; set; }
            public string Message { get; set; }
        }
    }
    ```

1. Add a file called _RedisTriggers.cs_ to the project.

1. Copy and paste the following code sample into the new file:

    ```csharp
    using Microsoft.Extensions.Logging;
    using Microsoft.Azure.Functions.Worker;
    using Microsoft.Azure.Functions.Worker.Extensions.Redis;
    
    public class RedisTriggers
    {
        private readonly ILogger<RedisTriggers> logger;
    
        public RedisTriggers(ILogger<RedisTriggers> logger)
        {
            this.logger = logger;
        }
    
        // PubSubTrigger function listens to messages from the 'pubsubTest' channel.
        [Function("PubSubTrigger")]
        public void PubSub(
        [RedisPubSubTrigger(Common.connectionString, "pubsubTest")] Common.ChannelMessage channelMessage)
        {
        logger.LogInformation($"Function triggered on pub/sub message '{channelMessage.Message}' from channel '{channelMessage.Channel}'.");
        }
    
        // KeyeventTrigger function listens to key events from the 'del' operation.
        [Function("KeyeventTrigger")]
        public void Keyevent(
            [RedisPubSubTrigger(Common.connectionString, "__keyevent@0__:del")] Common.ChannelMessage channelMessage)
        {
            logger.LogInformation($"Key '{channelMessage.Message}' deleted.");
        }
    
        // KeyspaceTrigger function listens to key events on the 'keyspaceTest' key.
        [Function("KeyspaceTrigger")]
        public void Keyspace(
            [RedisPubSubTrigger(Common.connectionString, "__keyspace@0__:keyspaceTest")] Common.ChannelMessage channelMessage)
        {
            logger.LogInformation($"Key 'keyspaceTest' was updated with operation '{channelMessage.Message}'");
        }
    
        // ListTrigger function listens to changes to the 'listTest' list.
        [Function("ListTrigger")]
        public void List(
            [RedisListTrigger(Common.connectionString, "listTest")] string response)
        {
            logger.LogInformation(response);
        }
    
        // StreamTrigger function listens to changes to the 'streamTest' stream.
        [Function("StreamTrigger")]
        public void Stream(
            [RedisStreamTrigger(Common.connectionString, "streamTest")] string response)
        {
            logger.LogInformation(response);
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
        "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
        "redisConnectionString": "<your-connection-string>"
      }
    }
    ```

    The code in _Common.cs_ looks to this value when it's running locally:

      ```csharp
      public const string connectionString = "redisConnectionString";
      ```

> [!IMPORTANT]
> This example is simplified for the tutorial. For production use, we recommend that you use [Azure Key Vault](../service-connector/tutorial-portal-key-vault.md) to store connection string information or [authenticate to the Redis instance using EntraID](../azure-functions/functions-bindings-cache.md#redis-connection-string).

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

## Add Redis bindings

Bindings add a streamlined way to read or write data stored on your Redis instance. To demonstrate the benefit of bindings, we add two other functions. One is called `SetGetter`, which triggers each time a key is set and returns the new value of the key using an _input binding_. The other is called `StreamSetter`, which triggers when a new item is added to to the stream `myStream` and uses an _output binding_ to write the value `true` to the key `newStreamEntry`.

1. Add a file called _RedisBindings.cs_ to the project.

1. Copy and paste the following code sample into the new file:

    ```csharp
    using Microsoft.Extensions.Logging;
    using Microsoft.Azure.Functions.Worker;
    using Microsoft.Azure.Functions.Worker.Extensions.Redis;
    
    public class RedisBindings
    {
        private readonly ILogger<RedisBindings> logger;
    
        public RedisBindings(ILogger<RedisBindings> logger)
        {
            this.logger = logger;
        }
        
        //This example uses the PubSub trigger to listen to key events on the 'set' operation. A Redis Input binding is used to get the value of the key being set.
        [Function("SetGetter")]
        public void SetGetter(
            [RedisPubSubTrigger(Common.connectionString, "__keyevent@0__:set")] Common.ChannelMessage channelMessage,
            [RedisInput(Common.connectionString, "GET {Message}")] string value)
        {
            logger.LogInformation($"Key '{channelMessage.Message}' was set to value '{value}'");
        }
    
        //This example uses the PubSub trigger to listen to key events to the key 'key1'. When key1 is modified, a Redis Output binding is used to set the value of the 'key1modified' key to 'true'.
        [Function("SetSetter")]
        [RedisOutput(Common.connectionString, "SET")]
        public string SetSetter(
            [RedisPubSubTrigger(Common.connectionString, "__keyspace@0__:key1")] Common.ChannelMessage channelMessage)
        {
            logger.LogInformation($"Key '{channelMessage.Message}' was updated. Setting the value of 'key1modified' to 'true'");
            return $"key1modified true";
        }
    }
    ```
  
1. Switch to the **Run and debug** tab in VS Code and select the green arrow to debug the code locally. The code should build successfully. You can track its progress in the terminal output.

1. To test the input binding functionality, try setting a new value for any key, for instance using the command `SET hello world` You should see that the `SetGetter` function triggers and returns the updated value.

1. To test the output binding functionality, try adding a new item to the stream `myStream` using the command `XADD myStream * item Order1`. Notice that the `StreamSetter` function triggered on the new stream entry and set the value `true` to another key called `newStreamEntry`. This `set` command also triggers the `SetGetter` function.

## Deploy code to an Azure function

1. Create a new Azure function:

   1. Go back to the **Azure** tab and expand your subscription.

   1. Right-click **Function App**, and then select **Create Function App in Azure (Advanced)**.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-create-function-app.png" alt-text="Screenshot of selections for creating a function app in VS Code.":::

1. You get several prompts for information to configure the new function app:

    - Enter a unique name.
    - Select **.NET 8 Isolated** as the runtime stack.
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

1. In the Azure portal, go to your new function app and select **Environment variables** from the resource menu.

1. On the working pane, go to **App settings**.

1. For **Name**, enter **redisConnectionString**.

1. For **Value**, enter your connection string.

1. Select **Apply** on the page to confirm.

1. Navigate to the **Overview** pane and select **Restart** to reboot the functions app with the connection string information.

## Test your triggers and bindings

1. After deployment is complete and the connection string information is added, open your function app in the Azure portal. Then select **Log Stream** from the resource menu.

1. Wait for Log Analytics to connect, and then use the Redis console to activate any of the triggers. Confirm that triggers are being logged here.

    :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-log-stream.png" alt-text="Screenshot of a log stream for a function app resource on the resource menu." lightbox="media/cache-tutorial-functions-getting-started/cache-log-stream.png":::

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Overview of Azure functions for Azure Cache for Redis](/azure/azure-functions/functions-bindings-cache?tabs=in-process&pivots=programming-language-csharp)
- [Build a write-behind cache by using Azure Functions](cache-tutorial-write-behind.md)
