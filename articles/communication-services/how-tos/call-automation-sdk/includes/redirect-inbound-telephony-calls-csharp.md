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
- A deployed [Communication Service resource](../../../quickstarts/create-communication-resource.md) and valid Connection String
- [Acquire a PSTN phone number from the Communication Service resource](../../../quickstarts/telephony/get-phone-number.md).
- The latest [.NET library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- A [web service application](/aspnet/core/web-api) to handle web hook callback events.
- Optional: [NGROK application](https://ngrok.com/) to proxy HTTP/S requests to a local development machine.
- The [ARMClient application](https://github.com/projectkudu/ARMClient), used to configure the Event Grid subscription.
- Obtain the NuGet package from the [Azure SDK Dev Feed](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed)
- An Event Grid subscription for Incoming Call.

## Create a new C# application

In the console window of your operating system, use the `dotnet` command to create a new web application with the name 'IncomingCallRedirect':

```console
 dotnet new web -n IncomingCallSample 
```

## Install the NuGet package

During the preview phase, the NuGet package can be obtained by configuring your package manager to use the [Azure SDK Dev Feed](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed)

## Configure Program.cs to redirect the call

Using the minimal API feature in .NET 6, we can easily add an HTTP POST map and redirect the call.
```csharp
using Azure.Communication;
using Azure.Communication.CallAutomation;
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
            // Webhook validation is assumed to be complete
            var jsonObject = JsonNode.Parse(eventGridEvent.Data).AsObject();
            var incomingCallContext = (string)jsonObject["incomingCallContext"];
            await client.RedirectCallAsync(incomingCallContext, new CommunicationUserIdentifier("<INSERT_ACS_ID>"));
        }

        return Results.Ok();
    });

app.Run();
```
