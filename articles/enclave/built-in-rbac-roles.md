---
title: Built-in RBAC roles in Azure Enclave
description: Learn how built-in role-based access control (RBAC) roles in Azure Enclave control access across communities, enclaves, and workloads.
author: jadean-msft
ms.author: jadean
ai-usage: ai-assisted
ms.topic: overview
ms.date: 06/20/2026
---

# Mandatory Access Control for Azure Enclave 
Access to Azure Enclave resources is controlled by built-in Azure role-based access control (RBAC) role assignments. You can further reduce standing access by using Microsoft Entra Privileged Identity Management (PIM) for just-in-time access.

## RBAC roles for communities and enclaves
Azure Enclave provides built-in RBAC roles to control access at community and enclave scopes.
- **Community owner** - Create and delete communities, enclaves, community endpoints, and transit hub resources. Read-only access to workloads, enclave connections, and enclave endpoints.
- **Community contributor** - Same as Community Owner except Community Contributors can't delete.
- **Community reader** - Read-only access to communities, enclaves, community endpoints, and transit hub.
- **Enclave owner** - Creates, deletes, and manages workloads, endpoints, and connection resources for one or more enclaves
- **Enclave contributor** - Creates, and manages workloads, endpoints, and connection resources for one or more enclaves
- **Enclave reader** - Read-only access to one or more enclave resources and underlying workloads, endpoints, and connections.
- **Enclave Approver Role** - Read-only access to all Azure Enclave resource types and explicit permissions to approve actions that require approval. For more information, see [Manage approval requests](./manage-approvals.md).

| Built-in role | Community | Community endpoint | Transit hub | Enclave | Workload | Enclave endpoint | Enclave connection | Approvals |
|--|--|--|--|--|--|--|--|--|
| Community owner | Read/Write/Delete | Read/Write/Delete | Read/Write/Delete | Read/Write/Delete | Read/Write/Delete | Read-only | Read/Write/Delete | Read-only |
| Community contributor | Read/Write | Read/Write | Read/Write | Read/Write | Read/Write | Read-only | Read/Write | Read-only |
| Community reader | Read-only | Read-only | Read-only | Read-only | Read-only | Read-only | Read-only | Read-only |
| Enclave owner | Read-only | Read-only | Read-only | Read/Write/Delete | Read/Write/Delete | Read/Write/Delete | Read/Write/Delete | Read-only |
| Enclave contributor | Read-only | Read-only | Read-only | Read/Write | Read/Write | Read/Write | Read/Write | Read-only |
| Enclave approver role | Read-only | Read-only | Read-only | Read-only | Read-only | Read-only | Read-only | Approve/Reject |
| Enclave reader | No access | No access | Read-only | Read-only | Read-only | Read-only | Read-only | Read-only |

These built-in roles can be assigned at [different scopes](/azure/role-based-access-control/scope-overview) depending on your scenario.

For example, a user with a community owner assignment at subscription scope can create and delete community resources in that subscription. If the assignment is scoped to a specific community resource, the user can manage endpoints and transit hubs in that community. Similarly, an enclave owner assignment scoped to a specific enclave allows the user to manage workloads, connections, and endpoints in that enclave, but it doesn't automatically grant permissions to unrelated resource groups.

## RBAC for workloads

Azure Enclave provides multiple options to control access to workload resources. Workloads can be secured with Deny Assignments that block standard RBAC inheritance or can be managed with standard Azure Role-Based Access Controls.

[Learn more about Azure RBAC](/azure/role-based-access-control/overview)

## Privileged Identity Management (PIM) integration

You can control privileged access to Azure Enclave resources by using Microsoft Entra Privileged Identity Management (PIM) to grant eligibility instead of persistent access.

### Time-based access control

You can use Microsoft Entra PIM with built-in roles to grant users eligibility for specific role assignments. You can scope assignments to community, enclave, and workload resources so users get only the privileges they need for a limited time.

### Require approvals for privileged access

You can configure PIM activation to require approval from a second person before permissions are granted.
