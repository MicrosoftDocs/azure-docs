---
title: Mandatory Access Controls
description: Mandatory Access Controls.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 11/21/2024
---

# Mandatory Access Control for Azure Virtual Enclaves 
Access to Azure Virtual enclave resources is primarily controlled using built-in Role Based Access Control (RBAC) role assignments. This built-in RBAC functionality can be further expanded by using Azure Privileged Identity Management to grant just-in-time access to Virtual enclave resources. 

## RBAC for community and Enclaves 
Azure Virtual Enclaves provides built-in RBAC roles to control access at the **Community and Enclave** levels.

- **Community owner** - Create and delete communities, enclaves, community endpoints, and transit hub resources. Read-only access to workloads, enclave connections, and enclave endpoints.
- **Community contributor** - Same as above except for delete.
- **Community reader** - Read-only access to communities, Enclaves, community endpoints, and transit hub.
- **Enclave owner** - Creates, deletes, and manages workloads, endpoints, and connection resources for one or more enclaves
- **Enclave contributor** - Creates, and manages workloads, endpoints, and connection resources for one or more enclaves
- **Enclave reader** - Read-only access to one or more enclave resources and underlying workloads, endpoints, and connections.
- **Enclave approver** - Read-only access to all AVE resource types and explicit permissions to approve actions that require approval.

|Built in Role          |Community              |Community Endpoint     |Transit Hub        |Enclave            |Workload           |Enclave Endpoint       |Enclave connection |Approvals      |
|--|--|--|--|--|--|--|--|--|
|Community owner        |Read/Write/Delete      |Read/Write/Delete      |Read/Write/Delete  |Read/Write/Delete  |Read/Write/Delete  |Read-only              |Read/Write/Delete  |Read-only     |
|Community Contributor  |Read/Write             |Read/Write             |Read/Write         |Read/Write         |Read/Write         |Read-only              |Read/Write         |Read-only     |
|Community Reader       |Read-only              |Read-only              |Read-only          |Read-only          |Read-only          |Read-only              |Read-only          |Read-only     |
|Enclave owner          |Read-only              |Read Only              |Read-only          |Read/Write/Delete  |Read/Write/Delete  |Read/Write/Delete      |Read/Write/Delete  |Read-only     |
|Enclave Contributor    |Read-only              |Read-only              |Read-only          |Read/Write         |Read/Write         |Read/Write             |Read/Write         |Read-only     |
|Enclave Approver       |Read-only              |Read-only              |Read-only          |Read-only          |Read-only          |Read-only              |Read-only          |Approve/Reject |
|Enclave  Reader        |X                      |X                      |Read-only          |Read-only          |Read-only          |Read-only              |Read-only          |Read-only     |

These built-in RBAC roles can be assigned at [different scopes](/azure/role-based-access-control/scope-overview) depending on the scenario. 

For instance, an individual given a community owner RBAC assignment at the subscription scope would have the ability to create and/or delete community resources within the subscription. If the assignment is at the individual resource level of the community itself, they would have the ability to manage endpoints and transit hubs within that individual community. Similarly, an enclave owner assignment at the individual resource level would provide the ability to manage workloads, connections, and endpoints within that Enclave, but would not necessarily have access to the resource groups containing individual workloads.

[Learn more on RBAC Assignment Scopes ](/azure/role-based-access-control/scope-overview)

## RBAC for workloads
Each workload deployed using Azure Virtual Enclaves comes with a managed resource group. This simply means that the enclaves service has ownership over the resource group and access control is managed just as other resource groups within Azure are managed today. 

[Learn more about Azure RBAC](/azure/role-based-access-control/overview)

## Privileged Identity Management (PIM) Integration
Privileged access to Virtual enclave resources can be further controlled/enforced by leveraging Azure Privileged Identity management to grant "eligibilities" as opposed to persistent access.

### Time-Based Access Control
Azure Privileged Identity Management can be used in conjunction with built-in roles to grant users "eligibility" for specific role assignments and scopes over community, enclave, and workload resources, granting users the exact privileges they need for a limited amount of time. 

### Require approvals for Privileged Access
Azure Privileged Identity Management can also be leveraged to be Activating an eligibility can also require a second person to approve the request before permissions are granted.