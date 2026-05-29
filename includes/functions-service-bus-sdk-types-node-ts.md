---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 12/15/2025
ms.author: glenga 
---

This example uses the SDK type [`ServiceBusReceivedMessage`](/javascript/api/@azure/service-bus/servicebusreceivedmessage) obtained from `ServiceBusMessageContext` provided by the Service Bus trigger:

:::code language="typescript" source="~/functions-nodejs-extensions/azure-functions-nodejs-extensions-servicebus/samples/serviceBusSampleWithComplete/src/functions/serviceBusTopicTrigger.ts" range="4-50" :::

For another example using SDK types see the [exponential backoff strategy sample](https://github.com/Azure/azure-functions-nodejs-extensions/blob/main/azure-functions-nodejs-extensions-servicebus/samples/serviceBusTriggerExponentialBackOff/src/functions/serviceBusTopicTrigger.ts). 