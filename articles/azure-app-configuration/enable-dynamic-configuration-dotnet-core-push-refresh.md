---
title: "Tutorial: Use dynamic configuration using push refresh in a .NET Core app"
titleSuffix: Azure App Configuration
description: In this tutorial, you learn how to dynamically update the configuration data for .NET Core apps using push refresh
services: azure-app-configuration
documentationcenter: ''
author: abarora
manager: zhenlan
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.workload: tbd
ms.devlang: csharp
ms.topic: tutorial
ms.date: 07/25/2020
ms.author: abarora

#Customer intent: I want to use push refresh to dynamically update my app to use the latest configuration data in App Configuration.
---
# Tutorial: Use dynamic configuration using push refresh in a .NET Core app

The App Configuration .NET Core client library supports updating configuration on demand without causing an application to restart. An application can be configured to detect changes in App Configuration using one or both of the following two approaches.

1. Poll Model: This is the default behavior that uses polling to detect changes in configuration. Once the cached value of a setting expires, the next call to `TryRefreshAsync` or `RefreshAsync` sends a request to the server to check if the configuration has changed, and pulls the updated configuration if needed.

1. Push Model: This uses [App Configuration events](./concept-app-configuration-event.md) to detect changes in configuration. Once App Configuration is set up to send key value change events to Azure Event Grid, the application can use these events to optimize the total number of requests needed to keep the configuration updated. Applications can choose to subscribe to these either directly from Event Grid, or though one of the [supported event handlers](../event-grid/event-handlers.md) such as a webhook, an Azure function or a Service Bus topic.

Applications can choose to subscribe to these events either directly from Event Grid, or through a web hook, or by forwarding events to Azure Service Bus. The Azure Service Bus SDK provides an API to register a message handler that simplifies this process for applications that either do not have an HTTP endpoint or do not wish to poll the event grid for changes continuously.

This tutorial shows how you can implement dynamic configuration updates in your code using push refresh. It builds on the app introduced in the quickstarts. Before you continue, finish [Create a .NET Core app with App Configuration](./quickstart-dotnet-core-app.md) first.

You can use any code editor to do the steps in this tutorial. [Visual Studio Code](https://code.visualstudio.com/) is an excellent option that's available on the Windows, macOS, and Linux platforms.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up a subscription to send configuration change events from App Configuration to a Service Bus topic
> * Set up your .NET Core app to update its configuration in response to changes in App Configuration.
> * Consume the latest configuration in your application.

## Prerequisites

To do this tutorial, install the [.NET Core SDK](https://dotnet.microsoft.com/download).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Set up Azure Service Bus topic and subscription

This tutorial uses the Service Bus integration for Event Grid to simplify the detection of configuration changes for applications that do not wish to poll App Configuration for changes continuously. The Azure Service Bus SDK provides an API to register a message handler that can be used to update configuration when changes are detected in App Configuration. Follow steps in the [Quickstart: Use the Azure portal to create a Service Bus topic and subscription](../service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal.md) to create a service bus namespace, topic and subscription.

Once the resources are created, add the following environment variables. These will be used to register an event handler for configuration changes in the application code.

| Key | Value |
|---|---|
| ServiceBusConnectionString | Connection string for the service bus namespace |
| ServiceBusTopic | Name of the Service Bus topic |
| ServiceBusSubscription | Name of the service bus subscription |

## Set up Event subscription

1. Open the App Configuration resource in the Azure portal, then click on `+ Event Subscription` in the `Events` pane.

    ![App Configuration Events](./media/events-pane.png)

1. Enter a name for the `Event Subscription` and the `System Topic`.

    ![Create event subscription](./media/create-event-subscription.png)

1. Select the `Endpoint Type` as `Service Bus Topic`, elect the Service Bus topic, then click on `Confirm Selection`.

    ![Event subscription service bus endpoint](./media/event-subscription-servicebus-endpoint.png)

1. Click on `Create` to create the event subscription.

1. Click on `Event Subscriptions` in the `Events` pane to validated that the subscription was created successfully.

    ![App Configuration event subscriptions](./media/event-subscription-view.png)

> [!NOTE]
> When subscribing for configuration changes, one or more filters can be used to reduce the number of events sent to your application. These can be configured either as [Event Grid subscription filters](../event-grid/event-filtering.md) or [Service Bus subscription filters](../service-bus-messaging/topic-filters.md). For example, a subscription filter can be used to only subscribe to events for changes in a key that starts with a specific string.

## Register event handler to reload data from App Configuration

Open *Program.cs* and update the file with the following code.

```csharp
using Microsoft.Azure.ServiceBus;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using System;
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace TestConsole
{
    class Program
    {
        private const string AppConfigurationConnectionStringEnvVarName = "AppConfigurationConnectionString"; // e.g. Endpoint=https://{store_name}.azconfig.io;Id={id};Secret={secret}
        private const string ServiceBusConnectionStringEnvVarName = "ServiceBusConnectionString"; // e.g. Endpoint=sb://{service_bus_name}.servicebus.windows.net/;SharedAccessKeyName={key_name};SharedAccessKey={key}
        private const string ServiceBusTopicEnvVarName = "ServiceBusTopic";
        private const string ServiceBusSubscriptionEnvVarName = "ServiceBusSubscription";

        private static IConfigurationRefresher _refresher = null;

        static async Task Main(string[] args)
        {
            string appConfigurationConnectionString = Environment.GetEnvironmentVariable(AppConfigurationConnectionStringEnvVarName);

            IConfiguration configuration = new ConfigurationBuilder()
                .AddAzureAppConfiguration(options =>
                {
                    options.Connect(appConfigurationConnectionString);
                    options.ConfigureRefresh(refresh =>
                        refresh
                            .Register("TestApp:Settings:Message")
                            .SetCacheExpiration(TimeSpan.FromDays(30))  // Important: Reduce poll frequency
                    );

                    _refresher = options.GetRefresher();
                }).Build();

            RegisterRefreshEventHandler();
            var message = configuration["TestApp:Settings:Message"];
            Console.WriteLine($"Initial value: {configuration["TestApp:Settings:Message"]}");

            while (true)
            {
                await _refresher.TryRefreshAsync();

                if (configuration["TestApp:Settings:Message"] != message)
                {
                    Console.WriteLine($"New value: {configuration["TestApp:Settings:Message"]}");
                    message = configuration["TestApp:Settings:Message"];
                }
                
                await Task.Delay(TimeSpan.FromSeconds(1));
            }
        }

        private static void RegisterRefreshEventHandler()
        {
            string serviceBusConnectionString = Environment.GetEnvironmentVariable(ServiceBusConnectionStringEnvVarName);
            string serviceBusTopic = Environment.GetEnvironmentVariable(ServiceBusTopicEnvVarName);
            string serviceBusSubscription = Environment.GetEnvironmentVariable(ServiceBusSubscriptionEnvVarName);
            SubscriptionClient serviceBusClient = new SubscriptionClient(serviceBusConnectionString, serviceBusTopic, serviceBusSubscription);

            serviceBusClient.RegisterMessageHandler(
                handler: (message, cancellationToken) =>
               {
                   string messageText = Encoding.UTF8.GetString(message.Body);
                   JsonElement messageData = JsonDocument.Parse(messageText).RootElement.GetProperty("data");
                   string key = messageData.GetProperty("key").GetString();
                   Console.WriteLine($"Event received for Key = {key}");

                   _refresher.SetDirty();
                   return Task.CompletedTask;
               },
                exceptionReceivedHandler: (exceptionargs) =>
                {
                    Console.WriteLine($"{exceptionargs.Exception}");
                    return Task.CompletedTask;
                });
        }
    }
}
```

The [SetDirty](/dotnet/api/microsoft.extensions.configuration.azureappconfiguration.iconfigurationrefresher.setdirty) method is used to set the cached value for key-values registered for refresh as dirty. This ensures that the next call to `RefreshAsync` or `TryRefreshAsync` re-validates the cached values with App Configuration and updates them if needed.

A random delay is added before the cached value is marked as dirty to reduce potential throttling in case multiple instances refresh at the same time. The default maximum delay before the cached value is marked as dirty is 30 seconds, but can be overridden by passing an optional `TimeSpan` parameter to the `SetDirty` method.

> [!NOTE]
> To reduce the number of requests to App Configuration when using push refresh, it is important to call `SetCacheExpiration(TimeSpan cacheExpiration)` with an appropriate value of `cacheExpiration` parameter. This controls the cache expiration time for pull refresh and can be used as a safety net in case there is an issue with the Event subscription or the Service Bus subscription. The recommended value is `TimeSpan.FromDays(30)`.

## Build and run the app locally

1. Set an environment variable named **AppConfigurationConnectionString**, and set it to the access key to your App Configuration store. If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```console
     setx AppConfigurationConnectionString "connection-string-of-your-app-configuration-store"
    ```

    If you use Windows PowerShell, run the following command:

    ```powershell
     $Env:AppConfigurationConnectionString = "connection-string-of-your-app-configuration-store"
    ```

    If you use macOS or Linux, run the following command:

    ```console
     export AppConfigurationConnectionString='connection-string-of-your-app-configuration-store'
    ```

1. Run the following command to build the console app:

    ```console
     dotnet build
    ```

1. After the build successfully completes, run the following command to run the app locally:

    ```console
     dotnet run
    ```

    ![Push refresh run before update](./media/dotnet-core-app-pushrefresh-initial.png)

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and select the App Configuration store instance that you created in the quickstart.

1. Select **Configuration Explorer**, and update the values of the following keys:

    | Key | Value |
    |---|---|
    | TestApp:Settings:Message | Data from Azure App Configuration - Updated |

1. Wait for 30 seconds to allow the event to be processed and configuration to be updated.

    ![Push refresh run after updated](./media/dotnet-core-app-pushrefresh-final.png)

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this tutorial, you enabled your .NET Core app to dynamically refresh configuration settings from App Configuration. To learn how to use an Azure managed identity to streamline the access to App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)