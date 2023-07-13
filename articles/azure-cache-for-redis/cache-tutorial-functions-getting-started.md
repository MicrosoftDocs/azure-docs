---
title: 'Tutorial: Function  - Azure Cache for Redis and Azure Functions'
description: Learn how to use Azure functions with Azure Cache for Redis.
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: tutorial
ms.date: 06/19/2023

---

# Get started with Azure Functions triggers in Azure Cache for Redis

The following tutorial shows how to implement basic triggers with Azure Cache for Redis and Azure Functions. This tutorial uses VS Code to write and deploy the Azure Function in C#.

## Requirements

- Azure subscription
- [Visual Studio Code](https://code.visualstudio.com/)

## Instructions

### Set up an Azure Cache for Redis instance

Create a new **Azure Cache for Redis** instance using the Azure portal or your preferred CLI tool. We use a _Standard C1_ instance, which is a good starting point. Use the [quickstart guide](quickstart-create-redis.md) to get started.

:::image type="content" source="media/cache-tutorial-functions-getting-started/cache-new-standard.png" alt-text="Screenshot of creating a cache in the Azure portal.":::

The default settings should suffice. We use a public endpoint for this demo, but we recommend you use a private endpoint for anything in production.

Creating the cache can take a few minutes. You can move to the next section while creating the cache completes.

### Set up Visual Studio Code

1. If you haven’t installed the functions extension for VS Code, search for _Azure Functions_ in the extensions menu, and select **Install**. If you don’t have the C# extension installed, install it, too.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-code-editor.png" alt-text="Screenshot of the required extensions installed in VSCode.":::

1. Next, go to the **Azure** tab, and sign-in to your existing Azure account, or create a new one:

1. Create a new local folder on your computer to hold the project that you're building. In our example, we use _RedisAzureFunctionDemo_.

1. In the Azure tab, create a new functions app by clicking on the lightning bolt icon in the top right of the **Workspace** tab .

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-add-resource.png" alt-text="Screenshot showing how to add a new function from VSCode.":::

1. Select the new folder that you’ve created to start the creation of a new Azure Functions project. You get several on-screen prompts. Select:

   - **C#** as the language
   - **.NET 6.0 LTS** as the .NET runtime
   - **Skip for now** as the project template

   > [!NOTE]
   > If you don’t have the .NET Core SDK installed, you’ll be prompted to do so.

1. The new project is created:

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-vscode-workspace.png" alt-text="Screenshot of a workspace in VSCode.":::

### Install the necessary NuGet package

You'll need to install `Microsoft.Azure.WebJobs.Extensions.Redis`, the NuGet package for the Redis extension that allows Redis keyspace notifications to be used as triggers in Azure Functions.

Install this package by going to the **Terminal** tab in VS Code and entering the following command:

```terminal
dotnet add package Microsoft.Azure.WebJobs.Extensions.Redis --prerelease
```

### Configure cache

1. Go to your newly created Azure Cache for Redis instance.

1. Go to your cache in the Azure portal and select the **Advanced settings** from the Resource menu. Scroll down to the field labeled _notify-keyspace-events_ and enter “KEA”. You have enabled **keyspace notifications** on the cache to trigger on keys and commands.

1. Then select **Save** at the top of the window. “KEA” is a configuration string that enables keyspace notifications for all keys and events. More information on keyspace configuration strings can be found [here](https://redis.io/docs/manual/keyspace-notifications/).

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-keyspace-notifications.png" alt-text="Screenshot of Advanced settings selected in the Resource menu and notify-keyspace-events highlighted with a red box.":::

1. Select **Access keys** from the Resource menu and write down/copy the Primary connection string field. This string is used to connect to the cache.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-access-keys.png" alt-text="Screenshot showing ":::

### Set up the example code

Go back to VS Code, add a file to the project called `RedisFunctions.cs` Copy and paste the code sample:

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

This tutorial shows multiple different ways to trigger on Redis activity:

1. _PubSubTrigger_, which is triggered when activity is published to the pub/sub channel named `pubsubTest`

1. _KeyspaceTrigger_, which is built on the Pub/Sub trigger. Use it to look for changes to the key `keyspaceTest`

1. _KeyeventTrigger_, which is also built on the Pub/Sub trigger. Use it to look for any use of the`DEL` command.

1. _ListTrigger_, which looks for changes to the list `listTest`

1. _StreamTrigger_, which looks for changes to the stream `streamTest`

### Connect to your cache

1.  In order to trigger on Redis activity, you need to pass in the connection string of your cache instance. This information will be stored in the `local.settings.json` file that was automatically created in your folder. Using the [local settings file](../azure-functions/functions-run-local.md#local-settings) is recommended as a security best practice.

1. To connect to your cache, add a `ConnectionStrings` section in the `local.settings.json` file and add your connection string using the parameter `redisConnectionString`. It should look like this:

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

![Image](media/cache-tutorial-functions-getting-started/cache-connection-string.png)

> [!IMPORTANT]
> This example is simplified for the tutorial. For production use, we recommend that you use [Azure Key Vault](../service-connector/tutorial-portal-key-vault.md) to store connection string information.
>
:::image type="content" source="media/cache-tutorial-functions-getting-started/cache-connection-string.png" alt-text="Screenshot of a connection string for a cache.":::

### Build and run the code locally

1. Switch to the **Run and debug** tab in VS Code and select the green arrow to debug the code locally. If you don’t have Azure Functions core tools installed, you're prompted to do so. In that case, you’ll need to restart VS Code after installing.

   The code should build successfully, which you can track in the Terminal output.

1. To test the trigger functionality, try creating and deleting the _keyspaceTest_ key. You can use any way you prefer to connect to the cache. An easy way is to use the built-in Console tool in the Azure Cache for Redis portal. Bring up the cache instance in the Azure portal, and select **Console** to open it.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-console.png" alt-text="Screenshot of C# code and a connection string.":::

1. After it's open, try the following commands:

    - `SET keyspaceTest 1`
    - `SET keyspaceTest 2`
    - `DEL keyspaceTest`
    - `PUBLISH pubsubTest testMessage`
    - `LPUSH listTest test`
    - `XADD streamTest * name Clippy`

:::image type="content" source="media/cache-tutorial-functions-getting-started/cache-console-output.png" alt-text="Screenshot of a console and some Redis commands and results.":::

1. You should see the triggers activating in the terminal:

:::image type="content" source="media/cache-tutorial-functions-getting-started/cache-triggers-working.png" alt-text="Screenshot of the VSCode editor with code running.":::

### Deploy code to an Azure function

1. Create a new Azure function by going back to the Azure tab, expanding your subscription, and right clicking on **Function App**. Select **Create a Function App in Azure…(Advanced)**.

   :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-create-function-app.png" alt-text="Screenshot of creating a function app in VSCode.":::

1. You see several prompts on information to configure the new functions app:

    - Enter a unique name
    - Choose **.NET 6** as the runtime stack
    - Choose either **Linux** or **Windows** (either works)
    - Select an existing or new resource group to hold the Function App
    - Choose the same region as your cache instance
    - Select **Premium** as the hosting plan
    - Create a new App Service plan
    - Choose the **EP1** pricing tier.
    - Choose an existing storage account or create a new one
    - Create a new Application Insights resource. We use the resource to confirm the trigger is working.

    > [!IMPORTANT]
    > Redis triggers are not currently supported on consumption functions.
    >

1. Wait a few minutes for the new Function App to be created. It appears in the drop down under **Function App** in your subscription. Right click on the new function app and select **Deploy to Function App…**

    :::image type="content" source="media/cache-tutorial-functions-getting-started/cache-deploy-to-function.png" alt-text="Screenshot of deploying to a function app in VSCode.":::

1. The app builds and starts deploying. You can track progress in the **Output Window**.

### Add connection string information

1. Navigate to your new Function App in the Azure portal and select the **Configuration** from the Resource menu.

1. Select **New application setting** and enter `redisConnectionString` as the Name, with your connection string as the Value. Set Type to _Custom_, and select **Ok** to close the menu and then **Save** on the Configuration page to confirm. The functions app will restart with the new connection string information. 

### Test your triggers

Once deployment is complete and the connection string information added, open your Function App in the Azure portal and select **Log Stream** from the Resource menu. Wait for log analytics to connect, and then use the Redis console to activate any of the triggers. You should see the triggers being logged here.

:::image type="content" source="media/cache-tutorial-functions-getting-started/cache-log-stream.png" alt-text="Screenshot of log stream for a function app resource in the Resource menu.":::

## Next steps

- [Serverless event-based architectures with Azure Cache for Redis and Azure Functions (preview)](cache-how-to-functions.md)
- [Build a write-behind cache using Azure Functions](cache-tutorial-write-behind.md)
