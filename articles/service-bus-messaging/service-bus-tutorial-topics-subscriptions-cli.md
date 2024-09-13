---
title: Use the Azure CLI to create Service Bus topics and subscriptions
description: In this quickstart, you learn how to create a Service Bus topic and subscriptions to that topic by using the Azure CLI
ms.date: 09/28/2021
ms.topic: quickstart
author: spelluru
ms.author: spelluru
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Use Azure CLI to create a Service Bus topic and subscriptions to the topic
In this quickstart, you use Azure CLI to create a Service Bus topic and then create subscriptions to that topic. 

## What are Service Bus topics and subscriptions?
Service Bus topics and subscriptions support a *publish/subscribe* messaging communication model. When using topics and subscriptions, components of a distributed application do not communicate directly with
each other; instead they exchange messages via a topic, which acts as an intermediary.

![TopicConcepts](./media/service-bus-java-how-to-use-topics-subscriptions/sb-topics-01.png)

In contrast with Service Bus queues, in which each message is processed by a single consumer, topics and subscriptions provide a one-to-many form of communication, using a publish/subscribe pattern. It is possible to
register multiple subscriptions to a topic. When a message is sent to a topic, it is then made available to each subscription to handle/process independently. A subscription to a topic resembles a virtual queue that receives copies of the messages that were sent to the topic. You can optionally register filter rules for a topic on a per-subscription basis, which allows you to filter or restrict which messages to a topic are received by which topic subscriptions.

Service Bus topics and subscriptions enable you to scale to process a large number of messages across a large number of users and applications.

## Prerequisites
If you don't have an Azure subscription, you can create a [free account][free account] before you begin.

In this quickstart, you use Azure Cloud Shell that you can launch after sign in to the Azure portal. For details about Azure Cloud Shell, see [Overview of Azure Cloud Shell](../cloud-shell/overview.md). You can also [install](/cli/azure/install-azure-cli) and use Azure PowerShell on your machine. 

## Create a Service Bus topic and subscriptions
Each [subscription to a topic](service-bus-messaging-overview.md#topics) can receive a copy of each message. Topics are fully protocol and semantically compatible with Service Bus queues. Service Bus topics support a wide array of selection rules with filter conditions, with optional actions that set or modify message properties. Each time a rule matches, it produces a message. To learn more about rules, filters, and actions, follow this [link](topic-filters.md).

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Launch Azure Cloud Shell by selecting the icon shown in the following image. Switch to **Bash** mode if the Cloud Shell is in **PowerShell** mode. 

    :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

3. Run the following command to create an Azure resource group. Update the resource group name and the location if you want. 

    ```azurecli-interactive
    az group create --name MyResourceGroup --location eastus
    ```
4. Run the following command to create a Service Bus messaging namespace. Update the name of the namespace to be unique. 

    ```azurecli-interactive
    namespaceName=MyNameSpace$RANDOM
    az servicebus namespace create --resource-group MyResourceGroup --name $namespaceName --location eastus
    ```
5. Run the following command to create a topic in the namespace. 

    ```azurecli-interactive
    az servicebus topic create --resource-group MyResourceGroup   --namespace-name $namespaceName --name MyTopic
    ```
6. Create the first subscription to the topic
    
    ```azurecli-interactive
    az servicebus topic subscription create --resource-group MyResourceGroup --namespace-name $namespaceName --topic-name MyTopic --name S1    
    ```
6. Create the second subscription to the topic
    
    ```azurecli-interactive
    az servicebus topic subscription create --resource-group MyResourceGroup --namespace-name $namespaceName --topic-name MyTopic --name S2    
    ```
6. Create the third subscription to the topic
    
    ```azurecli-interactive
    az servicebus topic subscription create --resource-group MyResourceGroup --namespace-name $namespaceName --topic-name MyTopic --name S3    
    ```
7. Create a filter on the first subscription with a filter using custom properties (`StoreId` is one of `Store1`, `Store2`, and `Store3`).

    ```azurecli-interactive
    az servicebus topic subscription rule create --resource-group MyResourceGroup --namespace-name $namespaceName --topic-name MyTopic --subscription-name S1 --name MyFilter --filter-sql-expression "StoreId IN ('Store1','Store2','Store3')"    
    ```
8. Create a filter on the second subscription with a filter using customer properties (`StoreId = Store4`)

    ```azurecli-interactive
    az servicebus topic subscription rule create --resource-group MyResourceGroup --namespace-name $namespaceName --topic-name myTopic --subscription-name S2 --name MySecondFilter --filter-sql-expression "StoreId = 'Store4'"    
    ```
9. Create a filter on the third subscription with a filter using customer properties (`StoreId` not in `Store1`, `Store2`, `Store3`, or `Store4`).

    ```azurecli-interactive
    az servicebus topic subscription rule create --resource-group MyResourceGroup --namespace-name $namespaceName --topic-name MyTopic --subscription-name S3 --name MyThirdFilter --filter-sql-expression "StoreId NOT IN ('Store1','Store2','Store3', 'Store4')"     
    ```
10. Run the following command to get the primary connection string for the namespace. You use this connection string to connect to the queue and send and receive messages. 

    ```azurecli-interactive
    az servicebus namespace authorization-rule keys list --resource-group MyResourceGroup --namespace-name $namespaceName --name RootManageSharedAccessKey --query primaryConnectionString --output tsv    
    ```

    Note down the connection string and the topic name. You use them to send and receive messages. 
    

## Next steps
To learn how to send messages to a topic and receive those messages via a subscription, see the following article: select the programming language in the TOC. 

> [!div class="nextstepaction"]
> [Publish and subscribe for messages](service-bus-dotnet-how-to-use-topics-subscriptions.md)


[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
[Install the Azure CLI]: /cli/azure/install-azure-cli
[az group create]: /cli/azure/group#az_group_create
