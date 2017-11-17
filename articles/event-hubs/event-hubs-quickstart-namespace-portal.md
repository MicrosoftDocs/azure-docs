---
title: Azure Quickstart - create an Azure Event Hubs namespace and event hub using portal | Microsoft Docs
description: Quickly learn to create an Event Hubs namespace with an event hub using Azure portal
services: event-hubs
documentationcenter: ''
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: ''
ms.service: event-hubs
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/16/2017
ms.author: sethm

---

# Create Event Hubs namespace and event hub using the Azure portal

Azure Event Hubs is a highly scalable data streaming platform and ingestion service capable of receiving and processing millions of events per second. This article shows how to quickly use the [Azure portal][] to create an Event Hubs namespace and an event hub within that namespace. Once provisioned, you can start sending and receiving events to and from the event hub.

If you do not have an Azure subscription, create a [free account][] before you begin.

## Log in to Azure

Log on to the [Azure portal][] using your Azure subscription.

## Create a resource group

A resource group is a logical collection of Azure resources. All resources are deployed and managed in a resource group. Do the following to create a resource group:

1. In the left navigation, click **Resource groups**. Then click **Add**.
   ![][1]
2. Type a unique name for the resource group. The system immediately checks to see if the name is available in the currently selected Azure subscription.
3. In **Subscription**, click the name of the Azure subscription in which you want to create the resource group.
4. Select a geographic location for the resource group.
5. Click **Create**.
   ![][2]

## Create an Event Hubs namespace

An Event Hubs namespace provides a unique scoping container, referenced by its [fully qualified domain name][], in which you create one or more event hubs. To create a namespace in your resource group using the portal, do the following:

1. Log on to the [Azure portal][], and click **Create a resource** at the top left of the screen.
2. Click **Internet of Things**, and then click **Event Hubs**.
3. In **Create namespace**, enter a namespace name. The system immediately checks to see if the name is available.
   ![](./media/event-hubs-create/create-event-hub1.png)
4. After making sure the namespace name is available, choose the pricing tier (Basic or Standard). Also, choose an Azure subscription, resource group, and location in which to create the resource. 
5. Click **Create** to create the namespace. You may have to wait a few minutes for the system to fully provision the resources.

## Create an event hub

To create an event hub within the namespace, do the following:

1. In the Event Hubs namespace list, click the newly created namespace.      
   
    ![](./media/event-hubs-quickstart-namespace-portal/create-event-hub2.png) 

2. In the namespace window, click **Event Hubs**.
   
    ![](./media/event-hubs-quickstart-namespace-portal/create-event-hub3.png)

1. At the top of the window, click **+ Add Event Hub**.
   
    ![](./media/event-hubs-quickstart-namespace-portal/create-event-hub4.png)
1. Type a name for your event hub, then click **Create**.
   
    ![](./media/event-hubs-quickstart-namespace-portal/create-event-hub5.png)

Congratulations! You have used the portal to create an Event Hubs namespace, and an event hub within that namespace.

## Create a storage account for Event Processor Host

The Event Processor Host is an intelligent agent that simplifies receiving events from Event Hubs by managing persistent checkpoints and parallel receives. For checkpointing, the Event Processor Host requires a storage account. The following example shows how to create a storage account and how to get its keys for access:

1. Log on to the [Azure portal][Azure portal], and click **New** at the top left of the screen.
2. Click **Storage**, then click **Storage account**.
   
    ![](./media/event-hubs-quickstart-namespace-portal/create-storage1.png)
3. In **Create storage account**, type a name for the storage account. Choose an Azure subscription, resource group, and location in which to create the resource. Then click **Create**.
   
    ![](./media/event-hubs-quickstart-namespace-portal/create-storage2.png)
4. In the list of storage accounts, click the newly created storage account.
5. In the storage account window, click **Access keys**. Copy the value of **key1** to use later.
   
    ![](./media/event-hubs-quickstart-namespace-portal/create-storage3.png)

## Next Steps

In this article, you’ve created the Event Hubs namespace and other resources required to send and receive events from your event hub. To learn how to send and receive events, continue with the following articles.

* [Send events to your event hub](event-hubs-dotnet-framework-getstarted-send.md)
* [Receive events from your event hub](event-hubs-dotnet-framework-getstarted-receive-eph.md)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Azure portal]: https://portal.azure.com/
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
[1]: ./media/event-hubs-quickstart-namespace-portal/resource-groups1.png
[2]: ./media/event-hubs-quickstart-namespace-portal/resource-groups2.png
