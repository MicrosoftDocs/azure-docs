---
title: Create Service Bus Topics and Subscriptions - Azure PowerShell
description: Create an Azure Service Bus topic and subscriptions with message filters using Azure PowerShell. Follow step-by-step commands in Azure Cloud Shell.
ms.date: 04/06/2026
ms.topic: quickstart
author: spelluru
ms.author: spelluru
ms.devlang: azurepowershell
ms.custom:
  - mode-api
  - devx-track-azurepowershell
ai-usage: ai-assisted

#customer intent: As a developer, I want to create a Service Bus topic with subscriptions using Azure PowerShell so that I can set up publish/subscribe messaging for my distributed application.
---

# Quickstart: Create a Service Bus topic and subscriptions using Azure PowerShell

In this quickstart, you use Azure PowerShell to create a Service Bus topic and then create subscriptions to that topic. You also create filters for each subscription to route messages based on custom properties.

## What are Service Bus topics and subscriptions?

Service Bus topics and subscriptions support a *publish/subscribe* messaging communication model. When using topics and subscriptions, components of a distributed application don't communicate directly with each other; instead they exchange messages via a topic, which acts as an intermediary.

:::image type="content" source="./media/service-bus-java-how-to-use-topics-subscriptions/service-bus-topics-subscriptions.png" alt-text="Diagram that shows publishers sending messages to a Service Bus topic, which distributes copies to multiple subscriber queues." lightbox="./media/service-bus-java-how-to-use-topics-subscriptions/service-bus-topics-subscriptions.png":::

In contrast with Service Bus queues, in which each message is processed by a single consumer, topics and subscriptions provide a one-to-many form of communication, using a publish/subscribe pattern. It's possible to register multiple subscriptions to a topic. When a message is sent to a topic, it's then made available to each subscription to handle/process independently. A subscription to a topic resembles a virtual queue that receives copies of the messages that were sent to the topic. You can optionally register filter rules for a topic on a per-subscription basis, which allows you to filter or restrict which messages to a topic are received by which topic subscriptions.

Service Bus topics and subscriptions enable you to scale to process a large number of messages across a large number of users and applications.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Azure Cloud Shell or Azure PowerShell installed locally. This quickstart uses Azure Cloud Shell.

## Create a Service Bus topic and subscriptions

Each subscription to a topic can receive a copy of each message. Topics are fully protocol and semantically compatible with Service Bus queues. Service Bus topics support a wide array of selection rules with filter conditions, with optional actions that set or modify message properties. Each time a rule matches, it produces a message.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Launch Azure Cloud Shell by selecting the icon shown in the following image.

    :::image type="content" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

1. In the bottom Cloud Shell window, switch from **Bash** to **PowerShell**.

    :::image type="content" source="./media/service-bus-quickstart-powershell/cloud-power-shell.png" alt-text="Screenshot of the Cloud Shell toolbar showing how to switch from Bash to PowerShell mode.":::

1. Run the following command to create an Azure resource group. Update the resource group name and the location if you want.

    ```azurepowershell-interactive
    New-AzResourceGroup -Name MyResourceGroup -Location eastus
    ```

1. Run the following command to create a Service Bus messaging namespace. Update the name of the namespace to be unique.

    ```azurepowershell-interactive
    $namespaceName = "MyNameSpace$(Get-Random)"
    New-AzServiceBusNamespace -ResourceGroupName MyResourceGroup -Name $namespaceName -Location eastus
    ```

1. Run the following command to create a topic in the namespace.

    ```azurepowershell-interactive
    New-AzServiceBusTopic -ResourceGroupName MyResourceGroup -NamespaceName $namespaceName -Name MyTopic
    ```

1. Create the first subscription to the topic.

    ```azurepowershell-interactive
    New-AzServiceBusSubscription -ResourceGroupName MyResourceGroup -NamespaceName $namespaceName -TopicName MyTopic -Name S1
    ```

1. Create the second subscription to the topic.

    ```azurepowershell-interactive
    New-AzServiceBusSubscription -ResourceGroupName MyResourceGroup -NamespaceName $namespaceName -TopicName MyTopic -Name S2
    ```

1. Create the third subscription to the topic.

    ```azurepowershell-interactive
    New-AzServiceBusSubscription -ResourceGroupName MyResourceGroup -NamespaceName $namespaceName -TopicName MyTopic -Name S3
    ```

1. Create a filter on the first subscription with a filter using custom properties (`StoreId` is one of `Store1`, `Store2`, and `Store3`).

    ```azurepowershell-interactive
    New-AzServiceBusRule -ResourceGroupName MyResourceGroup -NamespaceName $namespaceName -TopicName MyTopic -SubscriptionName S1 -Name MyFilter -SqlExpression "StoreId IN ('Store1','Store2','Store3')"
    ```

1. Create a filter on the second subscription with a filter using customer properties (`StoreId = Store4`).

    ```azurepowershell-interactive
    New-AzServiceBusRule -ResourceGroupName MyResourceGroup -NamespaceName $namespaceName -TopicName MyTopic -SubscriptionName S2 -Name MySecondFilter -SqlExpression "StoreId = 'Store4'"
    ```

1. Create a filter on the third subscription with a filter using customer properties (`StoreId` not in `Store1`, `Store2`, `Store3`, or `Store4`).

    ```azurepowershell-interactive
    New-AzServiceBusRule -ResourceGroupName MyResourceGroup -NamespaceName $namespaceName -TopicName MyTopic -SubscriptionName S3 -Name MyThirdFilter -SqlExpression "StoreId NOT IN ('Store1','Store2','Store3','Store4')"
    ```

1. Run the following command to get the primary connection string for the namespace. You use this connection string to connect to the topic and send and receive messages.

    ```azurepowershell-interactive
    Get-AzServiceBusKey -ResourceGroupName MyResourceGroup -Namespace $namespaceName -Name RootManageSharedAccessKey
    ```

    Note down the connection string and the topic name. You use them to send and receive messages.

## Clean up resources

When you no longer need the Service Bus namespace, topic, and subscriptions, delete them to avoid incurring charges. Run the following command to delete the resource group and all its resources:

```azurepowershell-interactive
Remove-AzResourceGroup -Name MyResourceGroup
```

## Next steps

To learn how to send messages to a topic and receive those messages via a subscription, see the following article and select your programming language in the TOC.

> [!div class="nextstepaction"]
> [Publish and subscribe for messages](service-bus-dotnet-how-to-use-topics-subscriptions.md)
