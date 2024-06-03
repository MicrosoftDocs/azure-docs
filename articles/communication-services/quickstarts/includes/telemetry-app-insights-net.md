---
title: include file
description: include file
services: azure-communication-services
author: minnieliu
manager: vravikumar

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/30/2021
ms.topic: include
ms.custom: include file
ms.author: peiliu
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- The latest version [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).
- Create an [Application Insights Resources](/previous-versions/azure/azure-monitor/app/create-new-resource) in Azure portal.

## Setting Up

### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `TelemetryAppInsightsQuickstart`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o TelemetryAppInsightsQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd TelemetryAppInsightsQuickstart
dotnet build
```

### Install the package

While still in the application directory, install the Azure Communication Services Identity library for .NET package by using the `dotnet add package` command.

```console
dotnet add package Azure.Communication.Identity --version 1.0.0
```

You will also need to install the Azure Monitor Exporter for OpenTelemetry library.

```console
dotnet add package Azure.Monitor.OpenTelemetry.Exporter -v 1.0.0-beta.3
```

### Set up the app framework

From the project directory:

1. Open **Program.cs** file in a text editor
2. Add a `using` directive to include the `Azure.Communication.Identity` namespace
3. Add a `using` directive to include the `Azure.Monitor.OpenTelemetry.Exporter` namespace;
4. Add a `using` directive to include the `OpenTelemetry.Trace` namespace;
5. Update the `Main` method declaration to support async code

Use the following code to begin:

```csharp
using System;
using System.Diagnostics;
using Azure.Communication;
using Azure.Communication.Identity;
using Azure.Monitor.OpenTelemetry.Exporter;
using OpenTelemetry;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace TelemetryAppInsightsQuickstart
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Export Telemetry to Application Insights");

            // Quickstart code goes here
        }
    }
}
```
## Setting up the telemetry tracer with communication identity SDK calls

Initialize a `CommunicationIdentityClient` with your connection string. Learn how to [manage your resource's connection string](../create-communication-resource.md#store-your-connection-string).

After the client is created, we must define an `Activity Source` which will track all the activities. Then, you can use the `Activity Source` to start an `Activity` which will be used to track the `CreateUserAsync` SDK call. Note that you can also define custom properties to be tracked within each `Activity` by using the `SetTag` method.

A similar tracing pattern is done for the `GetTokenAsync` function.

Create a new function called `TracedSample` and add the following code:

```csharp
public static async Task TracedSample()
{
    // This code demonstrates how to fetch your connection string
    // from an environment variable.
    string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
    var client = new CommunicationIdentityClient(connectionString);

    using var source = new ActivitySource("Quickstart.IdentityTelemetry");
    CommunicationUserIdentifier identity = null;

    using (var activity = source.StartActivity("Create User Activity"))
    {
        var identityResponse = await client.CreateUserAsync();

        identity = identityResponse.Value;
        Console.WriteLine($"\nCreated an identity with ID: {identity.Id}");
        activity?.SetTag("Identity id", identity.Id);
    }

    using (var activity = source.StartActivity("Get Token Activity"))
    {
        var tokenResponse = await client.GetTokenAsync(identity, scopes: new[] { CommunicationTokenScope.Chat });

        activity?.SetTag("Token value", tokenResponse.Value.Token);
        activity?.SetTag("Expires on", tokenResponse.Value.ExpiresOn);

        Console.WriteLine($"\nIssued an access token with 'chat' scope that expires at {tokenResponse.Value.ExpiresOn}:");
    }
}
```

## Funneling telemetry data to Application Insights

After the SDK calls have been wrapped with Activities, you can add the OpenTelemetry trace exporter and funnel the data into the Application Insights resource.

You have the option of defining a dictionary with some resource attributes that will show up in Application Insights.
Then, call `AddSource` and use the same Activity Source name that was defined in `TracedSample`.
You will also need to grab the [connection string](../../../azure-monitor/app/sdk-connection-string.md) from your Application Insights resource and pass it to `AddAzureMonitorTraceExporter()`. This will funnel the telemetry data to your Application Insights resource.

Lastly, call and await the `TracedSample()` function where we have our SDK calls.

Add the following code to the `Main` method:

```csharp
var resourceAttributes = new Dictionary<string, object> { { "service.name", "<service-name>" }, { "service.instance.id", "<service-instance-id>" } };
var resourceBuilder = ResourceBuilder.CreateDefault().AddAttributes(resourceAttributes);

using var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .SetResourceBuilder(resourceBuilder)
    .AddSource("Quickstart.IdentityTelemetry")
    .AddAzureMonitorTraceExporter(o =>
    {
        o.ConnectionString = Environment.GetEnvironmentVariable("APPLICATION_INSIGHTS_CONNECTION_STRING");
    })
    .Build();

await TracedSample();
```

## Run the code

Run the application from your application directory with the `dotnet run` command.

```console
dotnet run
```
