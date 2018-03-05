---
title: Update inventory tutorial using Azure Service Bus topics and subscriptions | Microsoft Docs
description: Tutorial - Learn to use topics and subscriptions to update inventory systems.
services: service-bus-messaging
author: sethmanheim
manager: timlt

ms.author: sethm;chwolf
ms.date: 02/28/2018
ms.topic: tutorial
ms.service: service-bus-messaging
ms.custom: mvc

---

# Tutorial: update inventory assortment using topics and subscriptions

Microsoft Azure Service Bus is a multi-tenant cloud messaging service that sends information between applications and services. Asynchronous operations give you flexible, brokered messaging, along with structured first-in, first-out (FIFO) messaging, and publish/subscribe capabilities.

This tutorial shows how to use Service Bus topics, subscriptions with publish/subscribe channels. The article describes a retail scenario that updates an inventory assortment and sends a set of messages from the back office to the stores. The workflow is pictured as follows:

![inventory scenario](./media/tutorial-update-inventory/sbtutorial1.png)

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create a Service Bus topic and one or more subscriptions to that topic
> * Add topic filters
> * Create two messages with different content
> * Send the messages and verify they arrived in the expected subscriptions
> * Receive message from one subscription

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete this tutorial, make sure you have installed:

1. [Visual Studio 2017 Update 3 (version 15.3, 26730.01)](http://www.visualstudio.com/vs) or later.
2. [NET Core SDK](https://www.microsoft.com/net/download/windows), version 2.0 or later.

## Log in to Azure

This article requires that you are running the latest version of Azure PowerShell. If you need to install or upgrade, see [Install and Configure Azure PowerShell][].

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create a namespace

Either portal or PowerShell.

## Create a topic

Either portal or PowerShell.

## Create a subscription to the topic

Either portal or PowerShell.

## Add a filter

Use PowerShell.

## Create a console application and add Service Bus NuGet package

Use .NET Core.

## Write code to send

Link to download sample code from GitHub.

## Write code to receive

Link to download sample code from GitHub.

## Clean up resources

Run the following command to remove the resource group, namespace, and all related resources:

```powershell
Remove-AzureRmResourceGroup -Name <resource_group_name>
```

## Next steps

In this tutorial, you learned how to:
> [!div class="checklist"]
> * Create a Service Bus topic and subscription
> * Add topic filters
> * Create two messages
> * Send the messages to subscriptions
> * Receive message from one subscription

Advance to the next article to learn about message time to live and the deadletter queue.

> [!div class="nextstepaction"]
> [Service Bus Messaging overview](service-bus-messaging-overview.md)

