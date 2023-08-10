---
title: Use the Azure portal to create a Service Bus queue
description: In this quickstart, you learn how to create a Service Bus namespace and a queue in the namespace by using the Azure portal.
author: spelluru
ms.author: spelluru
ms.date: 10/20/2022
ms.topic: quickstart
ms.custom: mode-ui
---

# Use Azure portal to create a Service Bus namespace and a queue

This quickstart shows you how to create a Service Bus namespace and a queue using the [Azure portal]. It also shows you how to get authorization credentials that a client application can use to send/receive messages to/from the queue.

[!INCLUDE [howto-service-bus-queues](../../includes/howto-service-bus-queues.md)]

## Prerequisites

To complete this quickstart, make sure you have an Azure subscription. If you don't have an Azure subscription, you can create a [free account][] before you begin.

[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [service-bus-create-queue-portal](./includes/service-bus-create-queue-portal.md)]

## Next steps
In this article, you created a Service Bus namespace and a queue in the namespace. To learn how to send/receive messages to/from the queue, see one of the following quickstarts in the **Send and receive messages** section. 

- [.NET](service-bus-dotnet-get-started-with-queues.md)
- [Java](service-bus-java-how-to-use-queues.md)
- [JavaScript](service-bus-nodejs-how-to-use-queues.md)
- [Python](service-bus-python-how-to-use-queues.md)
- [Go](service-bus-go-how-to-use-queues.md)
- [PHP](service-bus-php-how-to-use-queues.md)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Azure portal]: https://portal.azure.com/

[service-bus-flow]: ./media/service-bus-quickstart-portal/service-bus-flow.png
