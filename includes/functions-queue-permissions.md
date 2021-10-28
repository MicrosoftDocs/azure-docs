---
author: mattchenderson
ms.service: azure-functions
ms.topic: include
ms.date: 10/08/2021
ms.author: mahender
---

You will need to create a role assignment that provides access to your queue at runtime. Management roles like [Owner](../articles/role-based-access-control/built-in-roles.md#owner) are not sufficient. The following table shows built-in roles that are recommended when using the Queue Storage extension in normal operation. Your application may require additional permissions based on the code you write.

| Binding type   | Example built-in roles                                                |
|----------------|-----------------------------------------------------------------------|
| Trigger        | [Storage Queue Data Reader], [Storage Queue Data Message Processor]   |
| Output binding | [Storage Queue Data Contributor], [Storage Queue Data Message Sender] |

[Storage Queue Data Reader]: ../articles/role-based-access-control/built-in-roles.md#storage-queue-data-reader
[Storage Queue Data Message Processor]: ../articles/role-based-access-control/built-in-roles.md#storage-queue-data-message-processor
[Storage Queue Data Message Sender]: ../articles/role-based-access-control/built-in-roles.md#storage-queue-data-message-sender
[Storage Queue Data Contributor]: ../articles/role-based-access-control/built-in-roles.md#storage-queue-data-contributor
