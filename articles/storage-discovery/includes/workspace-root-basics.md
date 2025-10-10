---
author: fauhse
ms.author: fauhse
ms.topic: include
ms.date: 10/09/2025
ms.service: azure-storage-discovery
---

During the creation of a Storage Discovery workspace, you configure the workspace root. The [management components](../management-components.md) article provides more details for this configuration.
In the workspace root, you list at least one and at most 100 Azure resources of different types:
- subscriptions
- resource groups

The person deploying the workspace must have at least the Role Based Access Control (RBAC) role assignment *Reader* for every resource in the workspace root.
*Reader* is the minimum permission level required. *Contributor* and *Owner* are also supported.

It's possible that you see a subscription listed in the Azure portal, for which you don't have this direct *Reader* role assignment. When you can see a resource you don't have a role assignment to, then most likely you have permissions to a sub resource in this subscription. In this case, the existence of this "parent" was revealed to you, but you have no rights on the subscription resource itself. This example can be extended to resource groups as well. Missing a *Reader* or higher direct role assignment disqualifies an Azure resource from being the basis (root) of a workspace.

Permissions are only validated when a workspace is created. Any change to permissions of the Azure account that created the workspace, including its deletion, has no effect on the workspace or the Discovery service functionality.