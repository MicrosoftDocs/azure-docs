---
title: How to create a Service Bus namespace in the Azure portal
description: This article provides instructions for creating an Azure Service Bus namespace in the Azure portal. 
services: service-bus-messaging
documentationcenter: .net
author: axisc
manager: timlt
editor: spelluru

ms.assetid: fbb10e62-b133-4851-9d27-40bd844db3ba
ms.service: service-bus-messaging
ms.devlang: tbd
ms.topic: conceptual
ms.tgt_pltfrm: dotnet
ms.workload: na
ms.date: 01/24/2020
ms.author: aschhab

---
# Create a Service Bus namespace using the Azure portal

A namespace is a scoping container for all messaging components. Multiple queues and topics can reside within a single namespace, and namespaces often serve as application containers. This article provides instructions for creating a namespace in the Azure portal. 

[!INCLUDE [service-bus-create-namespace-portal](../../includes/service-bus-create-namespace-portal.md)]

Congratulations! You have now created a Service Bus Messaging namespace.

## Next steps

Check out the Service Bus [GitHub samples][github-samples], which show some of the more advanced features of Service Bus messaging.

[create-namespace-using-arm]: service-bus-resource-manager-overview.md
[github-samples]: https://github.com/Azure/azure-service-bus/tree/master/samples
