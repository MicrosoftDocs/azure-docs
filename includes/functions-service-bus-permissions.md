---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 01/25/2022
ms.author: mahender
---

You'll need to create a role assignment that provides access to your topics and queues at runtime. Management roles like [Owner](../articles/role-based-access-control/built-in-roles.md#owner) aren't sufficient. The following table shows built-in roles that are recommended when using the Service Bus extension in normal operation. Your application may require additional permissions based on the code you write.

| Binding type   | Example built-in roles                                            |
|----------------|-------------------------------------------------------------------|
| Trigger<sup>1</sup> | [Azure Service Bus Data Receiver], [Azure Service Bus Data Owner] |
| Output binding | [Azure Service Bus Data Sender]                                   |

<sup>1</sup> For triggering from Service Bus topics, the role assignment needs to have effective scope over the Service Bus subscription resource. If only the topic is included, an error will occur. Some clients, such as the Azure portal, don't expose the Service Bus subscription resource as a scope for role assignment. In such cases, the Azure CLI may be used instead. To learn more, see [Azure built-in roles for Azure Service Bus][role-assignment-scope].

[Azure Service Bus Data Receiver]: ../articles/role-based-access-control/built-in-roles.md#azure-service-bus-data-receiver
[Azure Service Bus Data Sender]: ../articles/role-based-access-control/built-in-roles.md#azure-service-bus-data-sender
[Azure Service Bus Data Owner]: ../articles/role-based-access-control/built-in-roles.md#azure-service-bus-data-owner

[role-assignment-scope]: ../articles/service-bus-messaging/service-bus-managed-service-identity.md#resource-scope