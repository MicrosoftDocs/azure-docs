---
title: include file
description: C# call automation quickstart for PSTN calls
services: azure-communication-services
author: ashwinder
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 09/06/2022
ms.topic: include
ms.custom: include file
ms.author: askaur
---

## Prerequisites

- An Azure account with an active subscription.
- A deployed Communication Service resource.
- [Acquire a PSTN phone number from the Communication Service resource](../../get-phone-number.md?pivots=programming-language-csharp).
- The latest [.NET library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- A [web service application](/aspnet/core/web-api) to handle web hook callback events.
- Optional: [NGROK application](https://ngrok.com/) to proxy HTTP/S requests to a local development machine.
- The [ARMClient application](https://github.com/projectkudu/ARMClient), used to configure the Event Grid subscription.
- Obtain the NuGet package from the [Azure SDK Dev Feed](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed)

## Configure an Event Grid subscription

Call Automation uses Event Grid to deliver the `IncomingCall` event to a subscription of your choice. For this guide, we'll use a web hook subscription pointing to your NGROK application proxy address.

1. Locate and copy the following to be used in the `armclient` command-line statement below:
    - Azure subscription ID
    - Resource group name

    On the picture below you can see the required fields:

    :::image type="content" source="./../../../voice-video-calling/media/call-automation/portal.png" alt-text="Screenshot of Communication Services resource page on Azure portal.":::

2. Communication Service resource name
3. Determine your local development HTTP port used by your web service application.
4. Start NGROK by issuing the following command from a command prompt

    ```console
    ngrok http https://localhost:<your_web_service_port>
    ```
    This command will produce a public URI you can use to receive the events from the Event Grid subscription.
5. Optional: Determine an API route path for the incoming call event together with your NGROK URI that will be used in the armclient command-line statement below, for example: `https://ff2f-75-155-253-232.ngrok.io/api/incomingcall`.

6. Event Grid web hooks require a valid reachable endpoint before they can be created. As such, start your web service application and run the commands below.
7. Since the `IncomingCall` event isn't yet published in the portal, you must run the following command-line statements to configure your subscription:

    ```console
    armclient login 

    armclient put "/subscriptions/<your_azure_subscription_guid>/resourceGroups/<your_resource_group_name>/providers/Microsoft.Communication/CommunicationServices/<your_acs_resource_name>/providers/Microsoft.EventGrid/eventSubscriptions/<subscription_name>?api-version=2022-06-15" "{'properties':{'destination':{'properties':{'endpointUrl':'[your_ngrok_uri]'},'endpointType':'WebHook'},'filter':{'includedEventTypes': ['Microsoft.Communication.IncomingCall']}}}" -verbose 
    ```

## Create a new C# application

In the console window of your operating system, use the `dotnet` command to create a new web application with the name 'IncomingCallRedirect':

```console
 dotnet new web -n IncomingCallSample 
```

## Install the NuGet package

During the preview phase, the NuGet package can be obtained by configuring your package manager to use the [Azure SDK Dev Feed](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed)

Obtain your connection string and configure your application

From the Azure portal, locate your Communication Service resource and click on the Keys section to obtain your connection string.

:::image type="content" source="./../../../voice-video-calling/media/call-automation/Key.png" alt-text="Screenshot of Communication Services resource page on portal to access keys.":::

## Configure Program.cs to redirect the call

Using the minimal API feature in .NET 6, we can easily add an HTTP POST map and redirect the call.
```csharp
using Azure.Communication;
using Azure.Communication.CallingServer;
using Azure.Messaging.EventGrid;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

var client = new CallAutomationClient(builder.Configuration["ACS:ConnectionString"]);

var app = builder.Build();

app.MapPost("/api/incomingCall", async (
    [FromBody] EventGridEvent[] eventGridEvents) =>
    {
        foreach (var eventGridEvent in eventGridEvents)
        {
            // Handle system events
            if (eventGridEvent.TryGetSystemEventData(out object eventData))
            {
                // Handle the subscription validation event
                if (eventData is SubscriptionValidationEventData subscriptionValidationEventData)
                {
                    var responseData = new SubscriptionValidationResponse
                    {
                        ValidationResponse = subscriptionValidationEventData.ValidationCode
                    };
                    return Results.Ok(responseData);
                }
            }

            var jsonObject = JsonNode.Parse(eventGridEvent.Data).AsObject();
            var incomingCallContext = (string)jsonObject["incomingCallContext"];
            await client.RedirectCallAsync(incomingCallContext, new CommunicationUserIdentifier("<INSERT_ACS_ID>"));
        }

        return Results.Ok();
    });

app.Run();
```

## Testing the application

1. Place a call to the number you acquired in the Azure portal (see prerequisites above).
2. Your Event Grid subscription to the IncomingCall should execute and call your web server.
3. The call will be redirected to the endpoint(s) you specified in your application.

Since this call flow involves a redirected call instead of answering it, pre-call web hook callbacks to notify your application the other endpoint accepted the call aren't published.
