---
title: include file
description: include file
services: service-bus-messaging
author: spelluru
ms.service: service-bus-messaging
ms.topic: include
ms.date: 03/08/2021
ms.author: spelluru
ms.custom: "include file"

---

## Trusted Microsoft services
When you enable the **Allow trusted Microsoft services to bypass this firewall** setting, the following services are granted access to your Service Bus resources.

| Trusted service | Supported usage scenarios | 
| --------------- | ------------------------- | 
| Azure Event Grid | Allows Azure Event Grid to send events to queues or topics in your Service Bus namespace. You also need to do the following steps: <ul><li>Enable system-assigned identity for a topic or a domain</li><li>Add the identity to the Azure Service Bus Data Sender role on the Service Bus namespace</li><li>Then, configure the event subscription that uses a Service Bus queue or topic as an endpoint to use the system-assigned identity.</li></ul> <p>For more information, see [Event delivery with a managed identity](../articles/event-grid/managed-service-identity.md)</p>|
| Azure API Management | <p>The API Management service allows you to send messages to a Service Bus queue/topic in your Service Bus Namespace.</p><ul><li>You can trigger custom workflows by sending messages to your Service Bus queue/topic when an API is invoked by using the [send-request policy](../articles/api-management/api-management-sample-send-request.md).</li><li>You can also treat a Service Bus queue/topic as your backend in an API. For a sample policy, see [Authenticate using a managed identity to access a Service Bus queue or topic](https://github.com/Azure/api-management-policy-snippets/blob/master/examples/Authenticate%20using%20Managed%20Identity%20to%20access%20Service%20Bus.xml). You also need to do the following steps:<ol><li>Enable system-assigned identity on the API Management instance. For instructions, see [Use managed identities in Azure API Management](../articles/api-management/api-management-howto-use-managed-service-identity.md).</li><li>Add the identity to the **Azure Service Bus Data Sender** role on the Service Bus namespace</li></ol></li></ul> | 