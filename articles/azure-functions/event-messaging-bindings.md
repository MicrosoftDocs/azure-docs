---
title: Connect to eventing and messaging services in Azure Functions
description: Provides an overview of how to connect your functions to other messaging and event-driven services in Azure, such as Azure Service Bus, Azure Event Grid, and Azure Event Hubs. 
ms.date: 10/20/2021
ms.topic: conceptual
ms.service: azure-functions

---

# Connect to eventing and messaging services from Azure Functions

As a cloud computing service, Azure Functions is frequently used to move data between various Azure services. To make it easier for you to connect your code to other services, Functions implements a set of binding extensions to connect to these services. To learn more, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md).

By definition, Azure Functions executions are stateless. If you need to connect your code to services in a more stateful way, consider instead using [Durable Functions](durable/durable-functions-overview.md) or [Azure Logic Apps](../logic-apps/logic-apps-overview.md). 

Triggers and bindings are provided to consuming and emitting data easier. There may be cases where you need more control over the service connection, or you just feel more comfortable using a client library provided by a service SDK. In those cases, you can use a client instance from the SDK in your function execution to access the service as you normally would. When using a client directly, you need to pay attention to the effect of scale and performance on client connections. To learn more, see the [guidance on using static clients](manage-connections.md#static-clients). 

You can't obtain the client instance used by a service binding from your function execution. 

The rest of this article provides specific guidance for integrating your code with the specific Azure services supported by Functions.     

## Event Grid

[!INCLUDE [functions-event-grid-intro](../../includes/functions-event-grid-intro.md)]

Azure Functions provides built-in integration with Azure Event Grid by using [triggers and bindings](functions-triggers-bindings.md). 

To learn how to configure and locally evaluate your Event Grid trigger and bindings, see [How to work with Event Grid triggers and bindings in Azure Functions](event-grid-how-tos.md) 

For more information about Event Grid trigger and output binding definitions and examples, see one of the following reference articles:

+ [Azure Event Grid bindings for Azure Functions](functions-bindings-event-grid.md)
+ [Azure Event Grid trigger for Azure Functions](functions-bindings-event-grid-trigger.md) 
+ [Azure Event Grid output binding for Azure Functions](functions-bindings-event-grid-output.md)  



## Next steps

To learn more about Event Grid with Functions, see the following articles:

+ [Azure Event Grid bindings for Azure Functions](functions-bindings-event-grid.md)
+ [Tutorial: Automate resizing uploaded images using Event Grid](../event-grid/resize-images-on-storage-blob-upload-event.md?toc=%2fazure%2fazure-functions%2ftoc.json)
