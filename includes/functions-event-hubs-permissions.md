---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 10/08/2021
ms.author: mahender
---

You will need to create a role assignment that provides access to your event hub at runtime. The scope of the role assignment can be for an Event Hubs namespace, or the event hub itself. Management roles like [Owner](../articles/role-based-access-control/built-in-roles.md#owner) are not sufficient. The following table shows built-in roles that are recommended when using the Event Hubs extension in normal operation. Your application may require additional permissions based on the code you write.

| Binding type   | Example built-in roles                                          |
|----------------|-----------------------------------------------------------------|
| Trigger        | [Azure Event Hubs Data Receiver], [Azure Event Hubs Data Owner] |
| Output binding | [Azure Event Hubs Data Sender]                                  |

[Azure Event Hubs Data Receiver]: ../articles/role-based-access-control/built-in-roles.md#azure-event-hubs-data-receiver
[Azure Event Hubs Data Sender]: ../articles/role-based-access-control/built-in-roles.md#azure-event-hubs-data-sender
[Azure Event Hubs Data Owner]: ../articles/role-based-access-control/built-in-roles.md#azure-event-hubs-data-owner