---
title: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 02/10/2021
ms.author: tamram
---

Before you assign an Azure RBAC role to a security principal, determine the scope of access that the security principal should have. Best practices dictate that it's always best to grant only the narrowest possible scope. Azure RBAC roles defined at a broader scope are inherited by the resources beneath them.

The following list describes the levels at which you can scope access to Azure blob and queue resources, starting with the narrowest scope:

- **An individual container.** At this scope, a role assignment applies to all of the blobs in the container, as well as container properties and metadata.
- **An individual queue.** At this scope, a role assignment applies to messages in the queue, as well as queue properties and metadata.
- **The storage account.** At this scope, a role assignment applies to all containers and their blobs, or to all queues and their messages.
- **The resource group.** At this scope, a role assignment applies to all of the containers or queues in all of the storage accounts in the resource group.
- **The subscription.** At this scope, a role assignment applies to all of the containers or queues in all of the storage accounts in all of the resource groups in the subscription.
- **A management group.** At this scope, a role assignment applies to all of the containers or queues in all of the storage accounts in all of the resource groups in all of the subscriptions in the management group.

For more information about Azure role assignments and scope, see [What is Azure role-based access control (Azure RBAC)?](../articles/role-based-access-control/overview.md).
