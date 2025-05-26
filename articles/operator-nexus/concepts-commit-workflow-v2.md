---
title: Azure Operator Nexus – Network Fabric - Commit Workflow v2
description: Learn about Commit Workflow v2 process in Azure Operator Nexus – Network Fabric
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 05/16/2025
ms.custom: template-concept
---

# Commit Workflow v2 in Azure Operator Nexus - Network Fabric

**Commit Workflow v2** introduces a modernized and transparent approach for applying configuration changes to **Azure Operator Nexus – Network Fabric (NNF)** resources. This enhanced workflow provides better operational control, visibility, and error handling during the configuration update process.

With this update, users can lock configuration states, preview device-level changes, validate updates, and commit with confidence—overcoming earlier limitations such as the inability to inspect pre/post configurations and difficulty in diagnosing failures.

## Key concepts and capabilities

Commit Workflow v2 is built around a structured change management flow. The following core features are available:

- **Explicit configuration locking:** Users must explicitly lock the configuration of a Network Fabric resource after making changes. This ensures updates are applied in a predictable and controlled manner.

- **Full device configuration preview:** Enables visibility into the exact configuration that will be applied to each device before the commit. This helps validate intent and catch issues early.

- **Commit configuration to devices**
  Once validated, changes can be committed to the devices. This final step applies the locked configuration updates across the fabric.

## Prerequisites

Before using Commit Workflow v2, ensure the following environment requirements are met:

### Required versions

* **Runtime version**: `5.0.1` or later is required for Commit Workflow v2.

* **Network Fabric API version**:  `2024-06-15-preview`

* **AzCLI version**:  `8.0.0.b3` or later

### Supported upgrade paths to runtime version 5.0.1

* **Direct upgrade**: From `4.0.0 → 5.0.1` or From `5.0.0 → 5.0.1`

* **Sequential upgrade**:   From `4.0.0 → 5.0.0 → 5.0.1`

> [!Note]
>  Additional actions may be required when upgrading from version 4.0.0. Please refer to the [runtime release notes](#) for guidance on upgrade-specific steps.


## Behavior and constraints

Commit Workflow v2 introduces new operational expectations and constraints to ensure consistency and safety in configuration management:

- **Availability & Irreversibility**

Commit Workflow v2 is only available after upgrading to Runtime Version 5.0.1. Once upgraded, reverting to Commit Workflow v1 is not supported.

- **Configuration lock requirements**

Locking is only possible when:

    - There is no ongoing commit operation.

    - The fabric is not in maintenance or upgrade mode.

    - The fabric is in an administrative enabled state.

- **Unsupported during maintenance or upgrade**

Configuration Lock and View Device Configuration are not allowed during maintenance or upgrade windows.

- **Commit is final**

Once a configuration is committed, it cannot be rolled back. Future changes must go through another lock-commit cycle.

### Supported resource actions via Commit workflow v2 (when parent resources are in administrative state – Enabled)

| **Requires Commit Workflow (Impacts Device Config)** | **Does NOT Require Commit Workflow (ARM-level only)** |
| ---------------------------------------------------- | ----------------------------------------------------- |
| Updates to Network Fabric                            | ISD Creation (L2/L3)                                  |
| Updates to NNI                                       | Network TAP, Neighbor Group creation/updates          |
| Updates to Isolation Domains (L2/L3)                 | IP Prefix / IP Community (unattached)                 |
| Internal/External Network updates (L3 ISD)           | ACL creation not attached to any parent resource      |
| Route Policy changes (attached)                      | NFC creation/updates                                  |
| ACLs (attached to NNI, External, ISD)                | Tag updates                                           |
| IP Prefix / Community changes (attached)             | Resource delete when disabled and not attached        |
| Additional descriptions to Network Devices           | Admin actions like enable/disable, upgrade, RMA       |
| Network Monitor updates (with Fabric ID)             | Deletion of all NNF resources                         |


### Allowed actions after configuration lock

| **Supported Actions**                                               | **Unsupported Actions**                             |
| ------------------------------------------------------------------- | --------------------------------------------------- |
| Update NFC                                                          | Create/update NNI, ISDs, Internal/External Networks |
| Create/update/delete Network TAP rules, TAP, Neighbor Groups        | Modify Route Policies, ACLs (if attached)           |
| Create/update IP Prefix / IP Community (unattached)                 | Modify Network Monitor attached to Fabric           |
| Read operations across NNF resources                                | Delete enabled resources                            |
| Delete disabled, unattached resources                               | All admin actions (e.g., enable/disable, RMA)       |
| Lock Fabric, View Device Config, Commit Config, Check commit status | Other post-actions must be performed before locking |


## Next steps

[How to use Commit Workflow v2 in Azure Operator Nexus](./howto-use-commit-workflow-v2.md)