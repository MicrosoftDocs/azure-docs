---
title: Azure Service Bus as Event Grid source
description: Describes the properties that are provided for Service Bus events with Azure Event Grid
ms.topic: conceptual
ms.date: 12/02/2022
---

# Azure Service Bus as an Event Grid source

This article provides the properties and schema for Service Bus events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

>[!NOTE]
> Only Premium tier Service Bus namespace supports event integration. Basic and Standard tiers do not support integration with Event Grid.

[!INCLUDE [event-grid-service-bus.md](../service-bus-messaging/includes/event-grid-service-bus.md)]

## Tutorials and how-tos
|Title  |Description  |
|---------|---------|
| [Tutorial: Azure Service Bus to Azure Event Grid integration examples](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json) | Event Grid sends messages from Service Bus topic to function app and logic app. |
| [Azure Service Bus to Event Grid integration](../service-bus-messaging/service-bus-to-event-grid-integration-concept.md) | Overview of integrating Service Bus with Event Grid. |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
* For details on using Azure Event Grid with Service Bus, see the [Service Bus to Event Grid integration overview](../service-bus-messaging/service-bus-to-event-grid-integration-concept.md).
* Try [receiving Service Bus events with Functions or Logic Apps](../service-bus-messaging/service-bus-to-event-grid-integration-example.md?toc=%2fazure%2fevent-grid%2ftoc.json).
