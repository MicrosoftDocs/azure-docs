---
title: Built-in RBAC roles in Azure Enclave
description: Learn how built-in role-based access control (RBAC) roles in Azure Enclave control access across communities, enclaves, and workloads.
author: jadean-msft
ms.author: jadean
ms.service: azure-enclave
ai-usage: ai-assisted
ms.topic: overview
ms.date: 08/31/2026
---

# Built-in RBAC roles in Azure Enclave

Access to Azure Enclave resources is controlled by built-in Azure role-based access control (RBAC) role assignments. You can further reduce standing access by using Microsoft Entra Privileged Identity Management (PIM) for just-in-time access.

## RBAC roles for communities and enclaves
Azure Enclave provides built-in RBAC roles to control access at community and enclave scopes.
- **Community Owner** - Create and delete communities, enclaves, community endpoints, and transit hub resources. Read-only access to workloads, enclave connections, and enclave endpoints.
- **Community Contributor** - Same as Community Owner except Community Contributors can't delete.
- **Community Reader** - Read-only access to communities, enclaves, community endpoints, and transit hub.
- **Enclave Owner** - Creates, deletes, and manages workloads, endpoints, and connection resources for one or more enclaves.
- **Enclave Contributor** - Creates and manages workloads, endpoints, and connection resources for one or more enclaves.
- **Enclave Reader** - Read-only access to one or more enclave resources and underlying workloads, endpoints, and connections.
- **Enclave Approver Role** - Read-only access to all Azure Enclave resource types and explicit permissions to approve actions that require approval. For more information, see [Manage approval requests](./manage-approvals.md).

| Built-in role | Community | Community endpoint | Transit hub | Enclave | Workload | Enclave endpoint | Enclave connection | Approvals |
|--|--|--|--|--|--|--|--|--|
| Community Owner | Read/Write/Delete | Read/Write/Delete | Read/Write/Delete | Read/Write/Delete | Read/Write/Delete | Read-only | Read/Write/Delete | Read-only |
| Community Contributor | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write | Read-only | Read/Write | Read-only |
| Community Reader | Read-only | Read-only | Read-only | Read-only | Read-only | Read-only | Read-only | Read-only |
| Enclave Owner | Read-only | Read-only | Read-only | Read/Write/Delete | Read/Write/Delete | Read/Write/Delete | Read/Write/Delete | Read-only |
| Enclave Contributor | Read-only | Read-only | Read-only | Read/Write | Read/Write | Read/Write | Read/Write | Read-only |
| Enclave Reader | No access | No access | Read-only | Read-only | Read-only | Read-only | Read-only | Read-only |
| Enclave Approver Role | Read-only | Read-only | Read-only | Read-only | Read-only | Read-only | Read-only | Approve/Reject |

These built-in roles can be assigned at [different scopes](/azure/role-based-access-control/scope-overview) depending on your scenario.

For example, a user with a community owner assignment at subscription scope can create and delete community resources in that subscription. If the assignment is scoped to a specific community resource, the user can manage endpoints and transit hubs in that community. Similarly, an enclave owner assignment scoped to a specific enclave allows the user to manage workloads and endpoints in that enclave, but it doesn't automatically grant permissions to unrelated resource groups. Enclave connections are a separate resource type that isn't nested under the enclave resource, so managing connections requires a role assignment scoped to the resource group (or subscription) that contains the enclave connection resource.

## RBAC for workloads

Azure Enclave provides multiple options to control access to workload resources. Secure workloads with deny assignments that block standard RBAC inheritance, or manage workloads with standard Azure role-based access control (RBAC).

[Learn more about Azure RBAC](/azure/role-based-access-control/overview)

## Privileged Identity Management (PIM) integration

Control privileged access to Azure Enclave resources by using Microsoft Entra PIM to grant eligibility instead of persistent access.

### Time-based access control

You can use Microsoft Entra PIM with built-in roles to grant users eligibility for specific role assignments. You can scope assignments to community, enclave, and workload resources so users get only the privileges they need for a limited time.

### Require approvals for privileged access

You can configure PIM activation to require approval from a second person before permissions are granted.

## Next steps

- [Role-based access control (RBAC) in Azure Enclave](./role-based-access-controls.md)
- [Manage approval requests](./manage-approvals.md)
- [Configure just-in-time access in Azure Enclave with Privileged Identity Management](./just-in-time-access.md)