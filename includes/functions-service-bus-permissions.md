---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 10/08/2021
ms.author: mahender
---

You will need to create a role assignment that provides access to your topics and queues at runtime. Management roles like [Owner](../articles/role-based-access-control/built-in-roles.md#owner) are not sufficient. The following table shows built-in roles that are recommended when using the Service Bus extension in normal operation. Your application may require additional permissions based on the code you write.

| Binding type   | Example built-in roles                                            |
|----------------|-------------------------------------------------------------------|
| Trigger        | [Azure Service Bus Data Receiver], [Azure Service Bus Data Owner] |
| Output binding | [Azure Service Bus Data Sender]                                   |

[Azure Service Bus Data Receiver]: ../articles/role-based-access-control/built-in-roles.md#azure-service-bus-data-receiver
[Azure Service Bus Data Sender]: ../articles/role-based-access-control/built-in-roles.md#azure-service-bus-data-sender
[Azure Service Bus Data Owner]: ../articles/role-based-access-control/built-in-roles.md#azure-service-bus-data-owner
