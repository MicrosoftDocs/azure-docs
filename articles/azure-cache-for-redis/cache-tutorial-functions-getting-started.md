---
title: 'Tutorial: Function  - Azure Cache for Redis and Azure Functions'
description: Learn how to use Azure functions with Azure Cache for Redis.
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: tutorial
ms.date: 05/24/2023

---

# Get started with Azure Functions triggers in Azure Cache for Redis

The following tutorial shows how to implement basic triggers with Azure Cache for Redis and Azure Functions. This tutorial uses VS Code to write and deploy the Azure Function in C#.

## Requirements

- Azure subscription
- [Visual Studio Code](https://code.visualstudio.com/)

## Instructions

### 1. Set up an Azure Cache for Redis Instance

Create a new **Azure Cache for Redis** instance using the Azure portal or your preferred CLI tool. We use a _Standard C1_ instance, which is a good starting point. Use the [quickstart guide](quickstart-create-redis.md) to get started.

<!-- ![Image](Media/CreateCache.png) -->

The default settings should suffice. We use a public endpoint for this demo, but we recommend you use a private endpoint for anything in production.

Creating the cache can take a few minutes, so feel move to the next section while creating the cache completes.

### 2. Set up Visual Studio Code

If you haven’t installed the functions extension for VS Code, search for _Azure Functions_ in the extensions menu, and select **Install**. If you don’t have the C# extension installed, install it, too.

<!-- ![Image](Media/InstallExtensions.png) -->

Next, go to the **Azure** tab, and sign-in to your existing Azure account, or create a new one:

Create a new local folder on your computer to hold the project that you're building. In our example, we use “AzureRedisFunctionDemo”.

In the Azure tab, create a new functions app by clicking on the lightning bolt icon in the top right of the **Workspace** box in the lower left of the screen.

<!-- ![Image](Media/CreateFunctionProject.png) -->

Select the new folder that you’ve created to start the creation of a new Azure Functions project. You get several on-screen prompts. Select:

- **C#** as the language
- **.NET 6.0 LTS** as the .NET runtime
- **Skip for now** as the project template

> [!NOTE]
> If you don’t have the .NET Core SDK installed, you’ll be prompted to do so.

The new project is created:

<!-- ![Image](Media/VSCodeWorkspace.png) -->

### 3. Install Necessary NuGet packages

You need to install two NuGet packages:

1. [StackExchange.Redis](https://www.nuget.org/packages/StackExchange.Redis/), which is the primary .NET client for Redis.

1. `Microsoft.Azure.WebJobs.Extensions.Redis`, which is the extension that allows Redis keyspace notifications to be used as triggers in Azure Functions.

Install these packages by going to the **Terminal** tab in VS Code and entering the following commands:

```terminal
dotnet add package StackExchange.Redis
dotnet add package Microsoft.Azure.WebJobs.Extensions.Redis
dotnet restore
```

### 4. Configure Cache

Go to your newly created Azure Cache for Redis instance. Two steps are needed here.

First,  enable **keyspace notifications** on the cache to trigger on keys and commands. Go to your cache in the Azure portal and select the **Advanced settings** from the Resource menu. Scroll down to the field labeled _notify-keyspace-events_ and enter “KEA”. Then select Save at the top of the window. “KEA” is a configuration string that enables keyspace notifications for all keys and events. More information on keyspace configuration strings can be found [here](https://redis.io/docs/manual/keyspace-notifications/).

<!-- ![Image](Media/KeyspaceNotifications.png) -->

Second, select **Access keys** from the Resource menu and write down/copy the Primary connection string field. We use the access key to connect to the cache.

<!-- ![Image](Media/AccessKeys.png) -->

### 5. Set up the example code

Go back to VS Code, add a file to the project called `RedisFunctions.cs` Copy and paste the code sample:

```csharp
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Microsoft.Azure.WebJobs.Extensions.Redis.Samples
{
    public static class RedisSamples
    {
        public const string localhostSetting = "redisLocalhost";

        [FunctionName(nameof(PubSubTrigger))]
        public static void PubSubTrigger(
            [RedisPubSubTrigger(localhostSetting, "pubsubTest")] RedisMessageModel model,
            ILogger logger)
        {
            logger.LogInformation(JsonSerializer.Serialize(model));
        }

        [FunctionName(nameof(PubSubTriggerResolvedChannel))]
        public static void PubSubTriggerResolvedChannel(
            [RedisPubSubTrigger(localhostSetting, "%pubsubChannel%")] RedisMessageModel model,
            ILogger logger)
        {
            logger.LogInformation(JsonSerializer.Serialize(model));
        }

        [FunctionName(nameof(KeyspaceTrigger))]
        public static void KeyspaceTrigger(
            [RedisPubSubTrigger(localhostSetting, "__keyspace@0__:keyspaceTest")] RedisMessageModel model,
            ILogger logger)
        {
            logger.LogInformation(JsonSerializer.Serialize(model));
        }

        [FunctionName(nameof(KeyeventTrigger))]
        public static void KeyeventTrigger(
            [RedisPubSubTrigger(localhostSetting, "__keyevent@0__:del")] RedisMessageModel model,
            ILogger logger)
        {
            logger.LogInformation(JsonSerializer.Serialize(model));
        }

        [FunctionName(nameof(ListsTrigger))]
        public static void ListsTrigger(
            [RedisListTrigger(localhostSetting, "listTest")] RedisMessageModel model,
            ILogger logger)
        {
            logger.LogInformation(JsonSerializer.Serialize(model));
        }

        [FunctionName(nameof(ListsMultipleTrigger))]
        public static void ListsMultipleTrigger(
            [RedisListTrigger(localhostSetting, "listTest1 listTest2")] RedisMessageModel model,
            ILogger logger)
        {
            logger.LogInformation(JsonSerializer.Serialize(model));
        }

        [FunctionName(nameof(StreamsTrigger))]
        public static void StreamsTrigger(
            [RedisStreamTrigger(localhostSetting, "streamTest")] RedisMessageModel model,
            ILogger logger)
        {
            logger.LogInformation(JsonSerializer.Serialize(model));
        }

        [FunctionName(nameof(StreamsMultipleTriggers))]
        public static void StreamsMultipleTriggers(
            [RedisStreamTrigger(localhostSetting, "streamTest1 streamTest2")] RedisMessageModel model,
            ILogger logger)
        {
            logger.LogInformation(JsonSerializer.Serialize(model));
        }
    }
}
```

This example shows multiple different triggers:

1. _PubSubTrigger_, which is triggered when activity is published to the pub/sub channel named `pubsubTest`

1. _KeyspaceTrigger_, which is built on the Pub/Sub trigger. Use it to look for changes to the key `keyspaceTest`

1. _KeyeventTrigger_, which is also built on the Pub/Sub trigger. Use it to look for any use of the`DEL` command.

1. _ListTrigger_, which looks for changes to the list `listTest`

1. _ListMultipleTrigger_, which looks for changes to list `listTest1` and `listTest2`

1. _StreamTrigger_, which looks for changes to the stream `streamTest`

1. _StreamMultipleTrigger_, which looks for changes to streams `streamTest1` and `streamTest2`

To connect to your cache, take the connection string you copied from earlier and paste to replace the value of `localhost` at the top of the file, set to `127.0.0.1:6379` by default.

<!-- ![Image](Media/ConnectionString.png) -->

### 6. Build and run the code locally

Switch to the **Run and debug** tab in VS Code and select the green arrow to debug the code locally. If you don’t have Azure Functions core tools installed, you're prompted to do so. In that case, you’ll need to restart VS Code after installing.

The code should build successfully, which you can track in the Terminal output.

To test the trigger functionality, try creating and deleting the _keyspaceTest_ key. You can use any way you prefer to connect to the cache. An easy way is to use the built-in Console tool in the Azure Cache for Redis portal. Bring up the cache instance in the Azure portal, and select **Console** to open it.

<!-- ![Image](Media/Console.png) -->

After it's open, try the following commands:

- SET keyspaceTest 1
- SET keyspaceTest 2
- DEL keyspaceTest
- PUBLISH pubsubTest testMessage
- LPUSH listTest test
- XADD streamTest * name Clippy

<!-- ![Image](Media/Console2.png) -->

You should see the triggers activating in the terminal:

<!-- ![Image](Media/TriggersWorking.png) -->

### 6. Deploy Code to an Azure Function

Create a new Azure function by going back to the Azure tab, expanding your subscription, and right clicking on **Function App**. Select **Create a Function App in Azure…(Advanced)**.

<!-- ![Image](Media/CreateFunctionApp.png) -->

You see several prompts on information to configure the new functions app:

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

Wait a few minutes for the new Function App to be created. It appears in the drop down under **Function App** in your subscription. Right click on the new function app and select **Deploy to Function App…**

<!-- ![Image](Media/DeployToFunction.png) -->

The app builds and starts deploying. You can track progress in the **Output Window**
.
Once deployment is complete, open your Function App in the Azure portal and select **Log Stream** from the Resource menu. Wait for log analytics to connect, and then use the Redis console to activate any of the triggers. You should see the triggers being logged here.

<!-- ![Image](Media/LogStream.png) -->

## Next steps

- [Serverless event-based architectures with Azure Cache for Redis and Azure Functions (preview)](cache-how-to-functions.md)
- [Build a write-behind cache using Azure Functions](cache-tutorial-write-behind.md)
