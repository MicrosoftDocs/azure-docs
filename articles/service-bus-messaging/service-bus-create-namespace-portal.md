---
title: How to create a Service Bus namespace in the Azure portal | Microsoft Docs
description: Create a Service Bus namespace using the Azure portal.
services: service-bus-messaging
documentationcenter: .net
author: spelluru
manager: timlt
editor: ''

ms.assetid: fbb10e62-b133-4851-9d27-40bd844db3ba
ms.service: service-bus-messaging
ms.devlang: tbd
ms.topic: get-started-article
ms.tgt_pltfrm: dotnet
ms.workload: na
ms.date: 09/26/2018
ms.author: spelluru

---
# Create a Service Bus namespace using the Azure portal

A namespace is a scoping container for all messaging components. Multiple queues and topics can reside within a single namespace, and namespaces often serve as application containers. There are two ways to create a Service Bus namespace:

1. Azure portal (this article)
2. [Resource Manager templates][create-namespace-using-arm]

## Create a namespace in the Azure portal

[!INCLUDE [service-bus-create-namespace-portal](../../includes/service-bus-create-namespace-portal.md)]

Congratulations! You have now created a Service Bus Messaging namespace.

## Next steps

Check out the Service Bus [GitHub samples][github-samples], which show some of the more advanced features of Service Bus messaging.

[create-namespace-using-arm]: service-bus-resource-manager-overview.md
[github-samples]: https://github.com/Azure/azure-service-bus/tree/master/samples
