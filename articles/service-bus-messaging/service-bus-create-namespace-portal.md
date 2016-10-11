<properties
    pageTitle="Create a Service Bus namespace using the Azure portal | Microsoft Azure"
    description="In order to get started with Service Bus, you will need a namespace. Here's how to create one using the Azure portal."
    services="service-bus"
    documentationCenter=".net"
    authors="jtaubensee"
    manager="timlt"
    editor=""/>

<tags
    ms.service="service-bus"
    ms.devlang="tbd"
    ms.topic="get-started-article"
    ms.tgt_pltfrm="dotnet"
    ms.workload="na"
    ms.date="08/22/2016"
    ms.author="jotaub"/>

# Create a Service Bus namespace using the Azure portal

A namespace is a common container for all your messaging components. Multiple queues and topics can reside in a single namespace, and namespaces often serve as application containers. There are currently two different ways to create a Service Bus namespace.

1.	Azure portal (this article)

2.	[Resource Manager templates][create-namespace-using-arm]

## Create a namespace in the Azure portal

[AZURE.INCLUDE [service-bus-create-namespace-portal](../../includes/service-bus-create-namespace-portal.md)]

Congratulations! You have now created a Service Bus Messaging namespace.

## Next steps

Check out our [GitHub samples][github-samples] which show some of the more advanced features of Azure Service Bus Messaging.

[create-namespace-using-arm]: service-bus-resource-manager-overview.md
[github-samples]: https://github.com/Azure-Samples/azure-servicebus-messaging-samples