---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/29/2023
ms.author: glenga
---

You must create a role assignment that provides access to your Event Grid topic at runtime. Management roles like [Owner](../articles/role-based-access-control/built-in-roles.md#owner) are not sufficient. The following table shows built-in roles that are recommended when using the Event Hubs extension in normal operation. Your application may require additional permissions based on the code you write.

| Binding type   | Example built-in roles                                          |
|----------------|-----------------------------------------------------------------|
| Output binding | [EventGrid Contributor](../articles/role-based-access-control//built-in-roles.md#eventgrid-contributor), [EventGrid Data Sender](../articles/role-based-access-control/built-in-roles.md#eventgrid-data-sender)  |
