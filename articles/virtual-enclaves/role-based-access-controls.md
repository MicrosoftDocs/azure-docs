---
title: Azure Virtual Enclaves Role-based Access Controls
description: Learn how to use built-in roles in Azure Virtual Enclaves to isolate and delegate access across communities, enclaves, and workloads.
author: jadean-msft
ms.author: jadean
ms.topic: how-to
ms.date: 07/24/2025
---

# Role-based access control (RBAC) in Azure Virtual Enclaves

Azure Virtual Enclaves (AVE) supports granular delegation of permissions using Azure's native [role-based access control (RBAC)](https://learn.microsoft.com/azure/role-based-access-control/overview). Delegation ensures that customers can isolate responsibilities across community, enclave, and workload boundaries without compromising the security or operational integrity of their environments.

This article explains how AVE implements RBAC and introduces the built-in roles that help customers manage access across the AVE hierarchy.

## Overview of AVE resource hierarchy

AVE organizes resources into three logical layers:

- **Communities** – The root governance boundary for your isolated environments.
- **Enclaves** – Secure, virtual network-isolated landing zones that are created within a community.
- **Workloads** – Applications and services deployed into enclave resource groups.

Each layer exposes distinct management operations, and AVE provides purpose-built roles to isolate access across them.

## RBAC in Azure Virtual Enclaves

RBAC in AVE is enforced using Azure’s standard role assignment model. You assign roles to users, groups, or service principals at the scope of a community, enclave, or workload resource.

Key RBAC concepts:
- **Scope**: Defines the boundary at which a role applies (subscription, resource group, or resource).
- **Role**: A collection of permissions (actions) that define what operations are allowed.
- **Principal**: The user, group, or application being granted the role.

## Built-in roles for AVE

The following roles are built into the AVE resource provider to align with common operational patterns. These roles allow customers to follow the principle of least privilege by assigning access only to what is needed.

### Community roles
Roles applicable at the community level.

| Role Name                 | Description                                                                                    |
|---------------------------|------------------------------------------------------------------------------------------------|
| **Community Owner**       | Full control of a Community, including creating enclaves and managing logging and diagnostics. |
| **Community Contributor** | Can create and manage enclave resources within the community but can't assign roles.           |
| **Community Reader**      | View-only access to the Community and all enclaves within it.                                  |

### Enclave roles
Roles applicable at the enclave level.

| Role Name                | Description                                                                                      |
|--------------------------|--------------------------------------------------------------------------------------------------|
| **Enclave Owner**        | Full control of an Enclave, including networking, endpoint configuration, and workload creation. |
| **Enclave Contributor**  | Can modify enclave settings and deploy workloads but can't assign RBAC roles.                    |
| **Enclave Reader**       | View-only access to enclave metadata, endpoints, and associated workloads.                       |
| **Enclave Approver**     | Can view enclave details and approve deployment or update requests within gated workflows.       |

### Workload access
AVE doesn't introduce new workload-specific roles. Instead, customers use standard Azure RBAC roles (for example, Contributor, Reader, Owner) at the workload resource group level to control access to deployed applications and services.

## Isolating access within AVE

RBAC in AVE is intentionally layered to allow you to assign discrete teams or personas to different scopes:

- **Platform Team** assigned **Community Owner** to set up the governance boundary.
- **Cloud Network Engineers** receive **Enclave Owner** access to manage enclave-level resources.
- **App Developers** or **Workload Administrators** are granted Contributor or Reader roles at the workload resource group level only.
- **Security and Audit Teams** are given **Enclave Reader** or **Community Reader** to monitor infrastructure without risking configuration changes.

This model ensures strict separation of concerns and minimizes negative consequences due to misconfiguration or compromise.

## Role assignment best practices

To implement secure and effective access control in AVE:

- Use **least privilege** principles: assign the most restrictive role that allows users to perform their job.
- Assign roles at the **lowest scope possible** (resource group instead of subscription when appropriate).
- Monitor role assignments regularly using Azure Policy and audit logs.
- Consider pairing AVE roles with Azure PIM (Privileged Identity Management) for just-in-time access.

## Next steps

- [Deploy a community in Azure Virtual Enclaves](https://learn.microsoft.com/azure/virtual-enclaves/deploy-community)
- [Monitor enclave activity using Log Analytics](https://learn.microsoft.com/azure/virtual-enclaves/observability)
- [Create custom roles in Azure](https://learn.microsoft.com/azure/role-based-access-control/custom-roles)