---
title: Azure Operator Nexus Network Fabric - Commit Workflow v2
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

- **Explicit configuration locking:**
  Users must explicitly lock the configuration of a Network Fabric resource after making changes. This process ensures updates are applied in a predictable and controlled manner.

- **Full device configuration preview:**
  Enables visibility into the exact configuration that is applied to each device before the commit. This helps validate intent and catch issues early.

- **Commit configuration to devices:**
  Once validated, changes can be committed to the devices. This final step applies the locked configuration updates across the fabric.

- **Discard Batch Updates:**
  Allows rollback of all uncommitted resource changes to their last known state.

- **Enhanced Constraints:**
  Enforces strict update rules during lock/maintenance/upgrade phases for stability.

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

### Availability & locking rules 

- Available only on Runtime Version 5.0.1+. Downgrade to v1 isn't supported.

- Locking is allowed only when:

  - No commit is in progress.

  - Fabric isn't under maintenance or upgrade.

  - Fabric is in an administrative enabled state.

### Unsupported during maintenance or upgrade

`Lock`, `ViewDeviceConfiguration`, and `related post-actions` aren't allowed during maintenance or upgrade windows.

### Commit Finality

Once committed, changes **can't be rolled back**. Any further edits require a new lock-validate-commit cycle.

### Discard Batch Behavior

- The `discard-commit-batch` operation:

  - Reverts all ARM resource changes to their last known good state.

  - Updates admin/config states (for example, external/internal networks become disabled and rejected).

  - Doesn't delete resources; users must delete them manually if desired.

  - Enables further patching to reapply changes.

- When the discard batch action is performed:

  - The administrative state of internal/external network resources moves to disabled and their configuration state to rejected; however, the resources aren't deleted automatically. A separate delete operation is required for removal.

  - Enabled Network Monitor resources attached to a fabric can't be attached to another fabric unless first detached and committed.

  - For Network Monitor resources in administrative state disabled (in commit queue), discard batch moves the config state to rejected. Users can reapply updates (PUT/patch) and commit again to enable.

### Resource update restrictions

**Post-lock**, only a limited set of `Create`/`Update`/`Delete` (CUD) actions are supported (for example, unattached ACLs, TAP rules).

Device-impacting resources (like Network-to-Network Interconnect (NNI), Isolation Domain (ISD), Route Policy, or ACLs attached to parent resources) are blocked during configuration lock.

### Supported resource actions via Commit workflow v2 (when parent resources are in administrative state – Enabled)

| **Supported resource actions which require commit workflow**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | **Unsupported resource actions which doesn’t require commit workflow**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **All resource updates impacting device configuration:**<br>• Updates to Network Fabric resource<br>• Updates to Network-to-Network Interconnect (NNI)<br>• Updates to ISD (L2 and L3)<br>• Creation and updates to Internal and External Networks of enabled L3 ISD<br>• Addition/updates/removal of Route Policy in Internal, External, ISD, and NNI resources<br>• Addition/updates/removal of IP Prefixes, IP Community, and Extended IP Community when attached to Route Policy or Fabric<br>• Addition/updates/removal of ACLs to Internal, External, ISD, and NNI resources<br>• Addition/updates/removal of Network Fabric resource in Network Monitor resource<br>• Additional description updates to Network Device properties<br>• Creation of multiple NNI | **Creation/updating of resources not impacting device configuration:**<br>• Creation of Isolation Domain (ISD) (L3 and L2)<br>• Network Fabric Controller (NFC) creation/updates<br>• Creation and updates to Network TAP rules, Network TAP, Neighbor groups<br>• Creation and updates to Network TAP rules, Network TAP, Neighbor groups<br>• Creation of new Route Policy and connected resources (IP Prefix, IP Community, IP Extended Community)<br>• Update of Route Policy and connected resources when not attached to ISD/Internal/External/NNI<br>• Creation/update of new Access Control List (ACL) which isn't attached<br><br>**ARM resources updates only:**<br>• Tag updates for all supported resources<br><br>**Other administrative actions and post actions which manage lifecycle events:**<br>• Enabling/Disabling Isolation Domain (ISD), Return Material Authorization (RMA), Upgrade, and all administrative actions (enable/disable), serial number update<br>• Deletion of all Nexus Network Fabric (NNF) resources |


### Allowed actions after configuration lock

Here's a clear, structured table showing **Supported actions post configuration lock is enabled on the fabric**, categorized by type of action and support status:

---

### **Supported and unsupported actions post configuration lock**

| **Actions**                          | **Supported resource actions when fabric is under configuration lock**                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | **Unsupported resource actions when fabric is under configuration lock**                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Resource Actions (CUD)**           | - **NFC** (Only *Update*)<br>- **Network TAP rules**, **Network TAP**, **Neighbor Group** *(Create, Update, Delete)* <br>- **ACL** *(Create/Update)* when **not attached** to parent resource<br>- **Network Monitor** created **without Fabric ID**<br>- **Creation/Update** of **IPPrefix**, **IPCommunity List**, **IPExtendedCommunity** when **not attached** to Route Policy<br>- **Read** of all NNF resources<br>- **Delete** of **disabled** resources and **not attached** to any parent resources | - No CUD operations allowed on:<br>  • **Network-to-Network Interconnect (NNI)**<br>  • **Isolation Domains (L2 & L3)**<br>  • **Internal/External Networks** (Additions/Updates)<br>  • **Route Policy**, **IPPrefix**, **IPCommunity List**, **IPExtendedCommunity**<br>  • **ACLs** when **attached to parent resources** (for example, NNI, External Network)<br>  • **Network Monitor** when **attached to Fabric**<br>  • **Deletion** of all **enabled** resources |
| **Post Actions**                     | - **Lock Fabric** (administrative state)<br>- **View Device Configuration**<br>- **Commit Configuration**<br>- **ARMConfig Diff** <br>- **Commit batch status**                                                                                                                                                                                                                                                                                                                                                         | - All other post actions are **blocked** and must be done **prior to enabling configuration lock**                                                                                                                                                                                                                                                                                                                                              |
| **Service Actions / Geneva Actions** | - N/A                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | - **All service actions are blocked**                                                                                                                                                                                                                                                                                                                                                                                                                      |

## Next steps

[How to use Commit Workflow v2 in Azure Operator Nexus](./howto-use-commit-workflow-v2.md)