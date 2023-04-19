---
title: include file
description: C# call automation how-to for redirecting inbound PSTN calls
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
- A deployed [Communication Service resource](../../create-communication-resource.md) and valid connection string found by selecting Keys in left side menu on Azure portal.
- [Acquire a PSTN phone number from the Communication Service resource](../../telephony/get-phone-number.md). Note the phone number you acquired to use in this quickstart. 
- The latest [.NET library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- The latest version of Visual Studio 2022 (17.4.0 or higher).
- An Azure Event Grid subscription to receive the `IncomingCall` event.

## Create a new C# application

In the console window of your operating system, use the `dotnet` command to create a new web application with the name 'IncomingCallRedirect':

```console
 dotnet new web -n IncomingCallRedirect 
```

## Install the NuGet package

During the preview phase, the NuGet package can be obtained by configuring your package manager to use the [Azure SDK Dev Feed](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed)

Install the NuGet packages: [Azure.Communication.CallAutomation](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-net/NuGet/Azure.Communication.CallAutomation/versions/) and [Azure.Messaging.EventGrid](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-net/NuGet/Azure.Messaging.EventGrid/versions/) to your project. 
```console 
dotnet add <path-to-project> package Azure.Communication.CallAutomation --prerelease
dotnet add <path-to-project> package Azure.Messaging.EventGrid --prerelease
```

## Use Visual Studio Dev Tunnels for your Event Grid subscription

In this quick-start, you'll use the new [Visual Studio Dev Tunnels](/connectors/custom-connectors/port-tunneling) feature to obtain a public domain name so that your local application is reachable by the Call Automation platform on the Internet. The public name is needed to receive the Event Grid `IncomingCall` event and Call Automation events using webhooks.

If you haven't already configured your workstation, be sure to follow the steps in [this guide](/connectors/custom-connectors/port-tunneling). Once configured, your workstation will acquire a public domain name automatically allowing us to use the environment variable `["VS_TUNNEL_URL"]` as shown below.

Set up your Event Grid subscription to receive the `IncomingCall` event by reading [this guide](../../../concepts/call-automation/incoming-call-notification.md).

## Configure Program.cs to redirect the call

Using the minimal API feature in .NET 6, we can easily add an HTTP POST map and redirect the call.

In this code snippet, /api/incomingCall is the default route that will be used to listen for incoming calls. At a later step, you'll register this url with Event Grid. Since Event Grid requires you to prove ownership of your Webhook endpoint before it starts delivering events to that endpoint, the code sample also handles this one time validation by processing SubscriptionValidationEvent. This requirement prevents a malicious user from flooding your endpoint with events. For more information, see this [guide](../../../../event-grid/webhook-event-delivery.md).

```csharp
using Azure.Communication;
using Azure.Communication.CallAutomation;
using Azure.Messaging.EventGrid;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

var client = new CallAutomationClient("<resource_connection_string_obtained_in_pre-requisites>");

Console.WriteLine($"Tunnel URL:{builder.Configuration["VS_TUNNEL_URL"]}"); // echo Tunnel URL to screen to configure Event Grid webhook

var app = builder.Build();

app.MapPost("/api/incomingCall", async (
    [FromBody] EventGridEvent[] eventGridEvents) =>
    {
        foreach (var eventGridEvent in eventGridEvents)
        {
            if (eventGridEvent.TryGetSystemEventData(out object eventData))
            {
                // Handle the subscription validation event.
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
            await client.RedirectCallAsync(incomingCallContext, new PhoneNumberIdentifier("<phone_number_to_redirect_call_to")); //this can be any phone number you have access to and should be provided in format +(countrycode)(phonenumber)
        }

        return Results.Ok();
    });

app.Run();
```
Update the placeholders in the code above for connection string and phone number to redirect to. 

## Run the app
Open Your_Project_Name.csproj file in your project with Visual Studio, and then select Run button or press F5 on your keyboard. 

