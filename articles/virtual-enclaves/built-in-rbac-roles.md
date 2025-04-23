---
title: Mandatory Access Controls
description: Mandatory Access Controls.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 11/21/2024
---

# Mandatory Access Control for Azure Virtual Enclaves 
Access to Azure Virtual Enclave resources is primarily controlled using built-in Role Based Access Control (RBAC) role assignments. This built in RBAC functionality can be further expanded by using Azure Privileged Identity Management to grant Just-in-Time access to Virtual Enclave resources. 

## RBAC for Community and Enclaves 
Azure Virtual Enclaves provides built-in RBAC roles to control access at the **Community and Enclave** levels.

- **Community Owner** - Create/delete Communities, Enclaves, Community Endpoints, and Transit Hubs resources. Read-Onlyaccess to Workloads, Enclave Connections, and Enclave Endpoints.
- **Community Contributor** - Same as above except for delete.
- **Community Reader** - Read-Onlyaccess to Communities, Enclaves, Community Endpoints, and Transit Hubs
- **Enclave Owner** - Creates, deletes, and manages workloads, endpoints, and connection resources for one or more enclaves
- **Enclave Contributor** - Creates, and manages workloads, endpoints, and connection resources for one or more enclaves
- **Enclave Reader** - Has read-Onlyaccess to one or more Enclave resources and underlying workloads, endpoints, and connections.
- **Enclave Approver** - Read-access to all AVE resource types and explicit permissions to approve actions that require approval.

|Built in Role          |Community              |Community Endpoint     |Transit Hub        |Enclave            |Workload           |Enclave Endpoint       |Enclave Connection |Approvals      |
|--|--|--|--|--|--|--|--|--|
|Community Owner        |Read/Write/Delete      |Read/Write/Delete      |Read/Write/Delete  |Read/Write/Delete  |Read/Write/Delete  |Read-Only              |Read/Write/Delete  |Read-Only     |
|Community Contributor  |Read/Write             |Read/Write             |Read/Write         |Read/Write         |Read/Write         |Read-Only              |Read/Write         |Read-Only     |
|Community Reader       |Read-Only              |Read-Only              |Read-Only          |Read-Only          |Read-Only          |Read-Only              |Read-Only          |Read-Only     |
|Enclave Owner          |Read-Only              |Read Only              |Read-Only          |Read/Write/Delete  |Read/Write/Delete  |Read/Write/Delete      |Read/Write/Delete  |Read-Only     |
|Enclave Contributor    |Read-Only              |Read-Only              |Read-Only          |Read/Write         |Read/Write         |Read/Write             |Read/Write         |Read-Only     |
|Enclave Approver       |Read-Only              |Read-Only              |Read-Only          |Read-Only          |Read-Only          |Read-Only              |Read-Only          |Approve/Reject |
|Enclave  Reader        |X                      |X                      |Read-Only          |Read-Only          |Read-Only          |Read-Only              |Read-Only          |Read-Only     |

These built-in RBAC roles can be assigned at [different scopes](../role-based-access-control/scope-overview.md) depending on the scenario. 

For instance, an individual given a Community Owner RBAC assignment at the subscription scope would have the ability to create and/or delete Community Resources within the subscription. If the assignment is at the individual resource level of the Community itself, they would have the ability to manage endpoints and transit hubs within that individual Community. Similarly, an Enclave Owner assignment at the individual resource level would provide the ability to manage workloads, connections, and endpoints within that Enclave, but would not necessarily have access to the resource groups containing individual workloads.

[Learn more on RBAC Assignment Scopes ](../role-based-access-control/scope-overview.md)

## RBAC for Workloads
Each workload deployed using Azure Virtual Enclaves comes with a managed resource group. This simply means that the Virtual Enclaves service has ownership over the resource group and access control is managed just as other resource groups within Azure are managed today. 

[Learn more about Azure RBAC](../role-based-access-control/overview.md)

## Privileged Identity Management (PIM) Integration
Privileged access to Virtual Enclave resources can be further controlled/enforced by leveraging Azure Privileged Identity management to grant "eligibilities" as opposed to persistent access.

### Time-Based Access Control
Azure Privileged Identity Management can be used in conjunction with built-in roles to grant users "eligibility" for specific role assignments and scopes over Community, Virtual Enclave, and Workload resources, granting users the exact privileges they need for a limited amount of time. 

### Require Approvals for Privileged Access
Azure Privileged Identity Management can also be leveraged to be Activating an eligibility can also require a second person to approve the request before permissions are granted.

## Attribute-Based Access Control
[Learn more](./attribute-based-access-controls.md)