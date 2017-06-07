---
title: Get started with Azure Relay Hybrid Connections in .NET | Microsoft Docs
description: How to write a C# console application for Hybrid Connections
services: service-bus-relay
documentationcenter: .net
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: d1386900-b942-4abf-acfc-38d2ef826253
ms.service: service-bus-relay
ms.devlang: tbd
ms.topic: get-started-article
ms.tgt_pltfrm: dotnet
ms.workload: na
ms.date: 03/27/2017
ms.author: sethm

---

# Get started with Relay Hybrid Connections
[!INCLUDE [relay-selector-hybrid-connections](../../includes/relay-selector-hybrid-connections.md)]

This tutorial provides an introduction to [Azure Relay Hybrid Connections](relay-what-is-it.md#hybrid-connections), and shows how to create a client application that sends messages to a corresponding listener application. 

## What will be accomplished
Because Hybrid Connections requires both a client and a server component, the tutorial creates two console applications. The steps are:

1. Create a Relay namespace, using the Azure portal.
2. Create a Hybrid Connection, using the Azure portal.
3. Write a server (listener) console application to receive messages.
4. Write a client (sender) console application to send messages.

## Prerequisites
1. [Visual Studio 2015 or higher](http://www.visualstudio.com). The examples in this tutorial use Visual Studio 2015.
2. An Azure subscription.

[!INCLUDE [create-account-note](../../includes/create-account-note.md)]

## 1. Create a namespace using the Azure portal
If you have already created a Relay namespace, jump to the [Create a Hybrid Connection using the Azure portal](#2-create-a-hybrid-connection-using-the-azure-portal) section.

[!INCLUDE [relay-create-namespace-portal](../../includes/relay-create-namespace-portal.md)]

## 2. Create a Hybrid Connection using the Azure portal
If you have already created a Hybrid Connection, jump to the [Create a server application](#3-create-a-server-application-listener) section.

[!INCLUDE [relay-create-hybrid-connection-portal](../../includes/relay-create-hybrid-connection-portal.md)]

## 3. Create a server application (listener)
To listen and receive messages from the Relay, we will write a C# console application using Visual Studio.

[!INCLUDE [relay-hybrid-connections-dotnet-get-started-server](../../includes/relay-hybrid-connections-dotnet-get-started-server.md)]

## 4. Create a client application (sender)
To send messages to the Relay, we will write a C# console application using Visual Studio.

[!INCLUDE [relay-hybrid-connections-dotnet-get-started-client](../../includes/relay-hybrid-connections-dotnet-get-started-client.md)]

## 5. Run the applications
1. Run the server application.
2. Run the client application and enter some text.
3. Ensure that the server application console outputs the text that was entered in the client application.

![running-applications](./media/relay-hybrid-connections-dotnet-get-started/running-applications.png)

Congratulations, you have created an end-to-end Hybrid Connections application.

## Next steps:
* [Relay FAQ](relay-faq.md)
* [Create a namespace](relay-create-namespace-portal.md)
* [Get started with Node](relay-hybrid-connections-node-get-started.md)

