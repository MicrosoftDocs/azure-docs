---
title: Quickstart - Create a Job Router Client
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to create a Job Router client within your Azure Communication Services resource.
author: jasonshave
manager: phans
services: azure-communication-services

ms.author: jassha
ms.date: 09/19/2021
ms.topic: quickstart
ms.service: azure-communication-services
---
# Quickstart: Create a Job Router Client

[!INCLUDE [Public Preview Notice](../../includes/private-preview-include.md)]

Get started with Azure Communication Services Job Router by setting up your client so you can begin to configure core functionality such as queues, policies, workers, and Jobs. To learn more about Job Router concepts, visit [Job Router conceptual documentation](../../concepts/router/concepts.md)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).

## Setting up

### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `JobRouterQuickstart`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o JobRouterQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd JobRouterQuickstart
dotnet build
```

### Install the package

While still in the application directory, install the Azure Communication Job Router client library for .NET package by using the `dotnet add package` command.

```console
dotnet add package Azure.Communication.JobRouter --version TBD
```

Add the following `using` directives to the top of **Program.cs** to include the JobRouter namespaces.

```csharp
using Azure.Communication.JobRouter;
using Azure.Communication.JobRouter.Models;
```

Update `Main` function signature to be `async` and return a `Task`.

```csharp
static async Task Main(string[] args)
{
  ...
}
```

## Authenticate the Job Router client

Job Router clients can be authenticated using your connection string acquired from an Azure Communication Services resource in the Azure portal.

```csharp
// Get a connection string to our Azure Communication Services resource.
var connectionString = "your_connection_string";
var client = new JobRouterClient(connectionString);
```