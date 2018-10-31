---
title: Get started with Azure Relay Hybrid Connections HTTP requests in .NET | Microsoft Docs
description: Write a C# console application for Azure Relay Hybrid Connections HTTP requests in .NET.
services: service-bus-relay
documentationcenter: .net
author: spelluru
manager: timlt
editor: ''

ms.assetid: d1386900-b942-4abf-acfc-38d2ef826253
ms.service: service-bus-relay
ms.devlang: tbd
ms.topic: get-started-article
ms.tgt_pltfrm: dotnet
ms.workload: na
ms.date: 08/16/2018
ms.author: spelluru

---

# Get started with Relay Hybrid Connections HTTP requests in .NET
[!INCLUDE [relay-selector-hybrid-connections](../../includes/relay-selector-hybrid-connections.md)]

This tutorial provides an introduction to [Azure Relay Hybrid Connections](relay-what-is-it.md#hybrid-connections). Learn how to use Microsoft .NET to create a client application that sends requests to a corresponding listener application. 

## What will be accomplished
Hybrid Connections requires both a client component and a server component. In this tutorial, you complete these steps to create two console applications:

1. Create a Relay namespace by using the Azure portal.
2. Create a hybrid connection in that namespace by using the Azure portal.
3. Write a server (listener) console application to receive requests.
4. Write a client (sender) console application to send requests.

## Prerequisites

To complete this tutorial, you need the following prerequisites:

* [Visual Studio 2015 or later](http://www.visualstudio.com). The examples in this tutorial use Visual Studio 2017.
* An Azure subscription.

[!INCLUDE [create-account-note](../../includes/create-account-note.md)]

## 1. Create a namespace by using the Azure portal
If you have already created a Relay namespace, go to [Create a hybrid connection by using the Azure portal](#2-create-a-hybrid-connection-using-the-azure-portal).

[!INCLUDE [relay-create-namespace-portal](../../includes/relay-create-namespace-portal.md)]

## 2. Create a hybrid connection by using the Azure portal
If you have already created a hybrid connection, go to [Create a server application](#3-create-a-server-application-listener).

[!INCLUDE [relay-create-hybrid-connection-portal](../../includes/relay-create-hybrid-connection-portal.md)]

## 3. Create a server application (listener)
In Visual Studio, write a C# console application to listen for and receive messages from the relay.

[!INCLUDE [relay-hybrid-connections-http-requests-dotnet-get-started-server](../../includes/relay-hybrid-connections-http-requests-dotnet-get-started-server.md)]

## 4. Create a client application (sender)
In Visual Studio, write a C# console application to send messages to the relay.

[!INCLUDE [relay-hybrid-connections-http-requests-dotnet-get-started-client](../../includes/relay-hybrid-connections-http-requests-dotnet-get-started-client.md)]

## 5. Run the applications
1. Run the server application. You see the following text in the console window:

    ```
    Online
    Server listening
    ```
1. Run the client application. You see `hello!` in the client window. The client sent a HTTP request to the server, and server responded with a `hello!`. 
3. Now, to close the console windows, press **ENTER** in both the console windows. 

Congratulations, you have created an end-to-end Hybrid Connections application!

## Next steps

* [Relay FAQ](relay-faq.md)
* [Create a namespace](relay-create-namespace-portal.md)
* [Get started with Node](relay-hybrid-connections-node-get-started.md)

