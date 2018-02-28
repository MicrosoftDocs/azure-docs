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

This tutorial describes how to use Service Bus topics, subscriptions, and publish/subscribe channels to enable a retail scenario that updates an inventory assortment and sends a set of messages from the back office to the stores. The workflow is pictured in the following figure:

![inventory scenario](./media/tutorial-update-inventory/sbtutorial1.png)

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create a Service Bus topic and one or more subscriptions to that topic
> * Add topic filters
> * Create two messages with different content
> * Send the messages and verify they arrived in the expected subscriptions
> * Receive message from one subscription

## Prerequisites

To complete this tutorial, make sure you have installed:

1. [Visual Studio 2017 Update 3 (version 15.3, 26730.01)](http://www.visualstudio.com/vs) or later.
2. [NET Core SDK](https://www.microsoft.com/net/download/windows), version 2.0 or later.

## Log in to the Azure Portal

Log in to the Azure portal at http://portal.azure.com.

## Launch Azure Cloud Shell

TBD, if necessary.

## Create a namespace

TBD

## Create a topic

TBD

## Create a subscription to the topic

TBD

## Add a filter

TBD

## Send messages to the topic

TBD

## Create a console application and add Service Bus NuGet package

TBD

## Write code to send

TBD

## Write code to receive

TBD

## Clean up resources

TBD

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
> [Next steps button](contribute-get-started-mvc.md)

