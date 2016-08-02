<properties
   pageTitle="Create a Service Bus namespace using the Azure portal | Microsoft Azure"
   description="In order to get started with Service Bus, you will need a namespace. Here's how to create one using the Azure portal."
   services="service-bus"
   documentationCenter=".net"
   authors="jtaubensee"
   manager="timlt"
   editor="sethmanheim"/>

<tags
   ms.service="service-bus"
   ms.devlang="tbd"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="dotnet"
   ms.workload="na"
   ms.date="06/07/2016"
   ms.author="jotaub@microsoft.com"/>

#Creating a Service Bus namespace using the Azure portal
The namespace, is a common container for all of your messaging components. Multiple queues and topics can reside in a single namespace, and namespaces often serve as application containers. There are currently 2 different ways to create a Service Bus namespaces.

1.	Azure portal (this article)

2.	[ARM Templates][create-namespace-using-arm]

##Creating a namespace in the Azure portal
[AZURE.INCLUDE [service-bus-create-namespace-portal](../../includes/service-bus-create-namespace-portal.md)]

Congratulations! You have now created a Service Bus Namespace.

##Next steps

Chckout our GitHub repository with samples that show off some of the more advanced features of Azure Service Bus Messaging.
[https://github.com/Azure-Samples/azure-servicebus-messaging-samples][github-samples]

[create-namespace-using-arm]: ./service-bus-resource-manager-overview.md
[github-samples]: https://github.com/Azure-Samples/azure-servicebus-messaging-samples