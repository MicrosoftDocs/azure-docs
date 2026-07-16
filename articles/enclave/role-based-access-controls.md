---
title: Azure Enclave Role-based Access Controls
description: Learn how to use built-in roles in Azure Enclave to isolate and delegate access across communities, enclaves, and workloads.
author: jadean-msft
ms.author: jadean
ms.topic: how-to
ms.date: 9/30/2025
---

# Role-based access control (RBAC) in Azure Enclave

Azure Enclave supports granular delegation of permissions using Azure's native [role-based access control (RBAC)](/azure/role-based-access-control/overview). Delegation ensures that you can isolate responsibilities across community, enclave, and workload boundaries without compromising the security or operational integrity of your environments.

This article explains how Azure Enclave implements RBAC and introduces the built-in roles that help you manage access across the Azure Enclave hierarchy.

## Overview of Azure Enclave resource hierarchy

Azure Enclave organizes resources into three logical layers:

- **Communities** – The root governance boundary for your isolated environments.
- **Enclaves** – Secure, virtual network-isolated landing zones that are created within a community.
- **Workloads** – Applications and services deployed into enclave resource groups.

Each layer exposes distinct management operations, and Azure Enclave provides purpose-built roles to isolate access across them.

## RBAC in Azure Enclave

RBAC in Azure Enclave is enforced using standard RBAC role assignments in combination with deny assignments to enable granular control over Community/Enclave managed resources and workloads.

Key RBAC concepts:
- **Community and Enclave Access Controls** - Deny assignments are applied to Community and Enclave managed resource groups to prevent unauthorized changes. Community/Enclave **Admin Settings** determine which users/groups get role assignments over managed resources. **Maintenance Mode** determines who can perform specific privileged actions that may impact security and isolation.  
- **Workload Access Controls** - Workload resource groups are also optionally protected with deny assignments to ensure that only explicitly-defined users/groups have privileged access over workload resources.  
- **Maintanence Mode** - Grants explicitly-defined users/groups exceptions to the deny assignments over Community and Enclave managed resource groups to perform privileged actions over managed resources.

## Built-in roles for Azure Enclave

The following built-in RBAC roles are provided in Azure Enclave to align with common operational patterns over Microsoft.Mission resource types. These roles allow you to follow the principle of least privilege by assigning access only to what is needed.

### Community-level roles
Roles applicable at the community level.

| Role Name                 | Description                                                                                    |
|---------------------------|------------------------------------------------------------------------------------------------|
| **Community Owner**       | Full control of a community, including creating enclaves and managing logging and diagnostics. |
| **Community Contributor** | Can create and manage enclave resources within the community but can't assign roles.           |
| **Community Reader**      | View-only access to the Community and all enclaves within it.                                  |

### Enclave roles
Roles applicable at the enclave level.

| Role Name                | Description                                                                                      |
|--------------------------|--------------------------------------------------------------------------------------------------|
| **Enclave Owner**        | Full control of an enclave, including networking, endpoint configuration, and workload creation. |
| **Enclave Contributor**  | Can modify enclave settings and deploy workloads but can't assign RBAC roles.                    |
| **Enclave Reader**       | View-only access to enclave metadata, endpoints, and associated workloads.                       |
| **Enclave Approver Role**| Can view enclave details and approve deployment or update requests within gated workflows.       |

### Workload access
Azure Enclave doesn't introduce new workload-specific roles. Instead, you use standard Azure RBAC roles (for example, Contributor, Reader, Owner) at the workload resource group level to control access to deployed applications and services.

## Isolating access within Azure Enclave

RBAC in Azure Enclave is intentionally layered to allow you to assign discrete teams or personas to different scopes:

- **Platform Team** assigned **Community Owner** to set up the governance boundary.
- **Cloud Network Engineers** receive **Enclave Owner** access to manage enclave-level resources.
- **App Developers** or **Workload Administrators** are granted Contributor or Reader roles at the workload resource group level only.
- **Security and Audit Teams** are given **Enclave Reader** or **Community Reader** to monitor infrastructure without risking configuration changes.

This model ensures strict separation of concerns and minimizes negative consequences due to misconfiguration or compromise.

## Role assignment best practices

To implement secure and effective access control in Azure Enclave:

- Use **least privilege** principles: assign the most restrictive role that allows users to perform their job.
- Assign roles at the **lowest scope possible** (resource group instead of subscription when appropriate).
- Monitor role assignments regularly using Azure Policy and audit logs.
- Consider pairing Azure Enclave roles with Azure PIM (Privileged Identity Management) for just-in-time access.

## Next steps

- [Deploy a community in Azure Enclave](./1-1-create-community.md)
- [Monitor enclave activity using Log Analytics](./observability.md)
- [Create custom roles in Azure](/azure/role-based-access-control/custom-roles)