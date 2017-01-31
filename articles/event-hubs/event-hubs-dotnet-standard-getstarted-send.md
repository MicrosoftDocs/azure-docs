---
title: Send events to Azure Event Hubs using .NET Standard | Microsoft Docs
description: Get started sending events to Event Hubs in .NET Standard
services: event-hubs
documentationcenter: na
author: jtaubensee
manager: timlt
editor: ''

ms.assetid: 
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/30/2017
ms.author: jotaub
---

# Get started sending messages to Event Hubs in .NET Standard

> **Note**
> 
> This sample is available on [GitHub](https://github.com/Azure/azure-event-hubs-dotnet/tree/master/samples/SampleSender).
>

## What will be accomplished

This tutorial shows how to create the existing solution **SampleSender** (inside this folder). You can run the solution as-is, replacing the `EhConnectionString`, `EhEntityPath`, and `StorageAccount` strings with your Event Hub values, or follow this tutorial to create your own.

In this tutorial, we will write a .NET Core console application to send messages to an Event Hub.

## Prerequisites

1. [Visual Studio 2015](http://www.visualstudio.com).

2. [.NET Core Visual Studio 2015 Tooling](http://www.microsoft.com/net/core).

3. An Azure subscription.

4. An Event Hubs namespace.

## Send messages to an Event Hub

To send messages to an Event Hub, we will write a C# console application using Visual Studio.

### Create a console application

1. Launch Visual Studio and create a new .NET Core console application.

### Add the Event Hubs NuGet package

1. Right-click the newly created project and select **Manage NuGet Packages**.

2. Click the **Browse** tab, then search for “Microsoft Azure Event Hubs” and select the **Microsoft Azure Event Hubs** item. Click **Install** to complete the installation, then close this dialog box.

### Write some code to send messages to the Event Hub

1. Add the following `using` statement to the top of the Program.cs file.

    [!code-csharp[main](../../azure-event-hubs-dotnet/samples/SampleSender/Program.cs#L9-L9 "Add using")]

2. Add constants to the `Program` class for the Event Hubs connection string and entity path (individual Event Hub name). Replace the placeholders in brackets with the proper values that were obtained when creating the Event Hub.

    [!code-csharp[main](../../azure-event-hubs-dotnet/samples/SampleSender/Program.cs#L13-L15 "Add constants")]

3. Add a new method named `MainAsync` to the `Program` class like the following:

    [!code-csharp[main](../../azure-event-hubs-dotnet/samples/SampleSender/Program.cs#L22-L40 "Add MainAsync")]
    
4. Add a new method named `SendMessagesToEventHub` to the `Program` class like the following:

    [!code-csharp[main](../../azure-event-hubs-dotnet/samples/SampleSender/Program.cs#L42-L62 "Add SendMessagesToEventHub")]

5. Add the following code to the `Main` method in the `Program` class.

    [!code-csharp[main](../../azure-event-hubs-dotnet/samples/SampleSender/Program.cs#L19-L19 "Add call to MainAsync")]

    Here is what your Program.cs should look like.

    [!code-csharp[main](../../azure-event-hubs-dotnet/samples/SampleSender/Program.cs#L4-L64 "Whole program")]
  
6. Run the program, and ensure that there are no errors thrown.
  
Congratulations! You have now sent messages to an Event Hub.
