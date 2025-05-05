---
title: Maintenance mode
description: Maintenance mode explanation.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: conceptual
ms.date: 04/08/2025
---

# Maintenance Mode

Maintenance mode is a feature that allows enclave owners to temporarily place their enclaves into a "maintenance mode" state. This mode permits privileged users to make certain changes to the underlying managed resources in an enclave that are normally protected by Deny Assignments. This helps maintain the enclave isolation and network boundary.

## Key features
The following are the key features of Maintenance Mode:
- *Exclusion from Deny Assignments*: Enclave owners can temporarily exclude themselves from deny assignments, enabling them to perform necessary maintenance tasks or create complex workloads.
- *Privileged action*: As this is considered a privileged action, Azure recommends only using maintenance mode when performing certain elevated actions. Privileged users making changes should understand changes they're making, and steps to undo or remediate those changes.
- *User-friendly interface*: The feature is designed with a user-friendly interface, making it easy to activate and deactivate maintenance mode as needed.
- *Enhanced flexibility*: Maintenance mode provides users with the flexibility to manage their workloads more effectively, ensuring that they can perform tasks without unnecessary interruptions.

## Maintenance mode options

- `Off` - A deny assignment created by Azure is in-place to protect underlying managed resources in an enclave.
- `General` - A partial deny assignment created by Azure allows privileged users to modify certain existing resources only in the underlying managed resources in an enclave. These operations include resources joining the enclave virtual network and creating Private DNS Zone records. By default, enclaves are deployed in `Off` mode, but create enclaves in `General` mode and provide appropriate Microsoft Entra ID identities for deny assignment exclusion.
- `Advanced` - The deny assignment created by Azure is temporarily removed to allow privileged users to make elevated changes on the underlying managed resources in an enclave.

## Justification options

- **Networking** - Managing privileged or custom changes to Enclave-managed networking or resources.
- **Governance** - Managing logging, policy, or other Enclave governance-related changes.
- **Off** - Enclave Maintenance mode no longer necessary.

## How to use maintenance mode

### 1. Activate maintenance mode during enclave creation

1. Navigate to the Maintenance mode tab on the enclave create form.
2. Select the mode option [`Off` / `General` / `Advanced`].
3. Select the service principals that you want to include.
4. Select the justification for why you're entering maintenance mode [`OFF` / `NETWORKING` / `GOVERNANCE`].
5. Review and create enclave as normal.

### 2. Activate maintenance mode for an existing enclave

1. Navigate to the enclave you're enabling maintenance mode.
2. Navigate to the "Maintenance mode" tab.
3. Select the mode option [`Advanced` / `General`].
4. Select the service principals that you want to include.
5. Select the justification for why you're entering maintenance mode [`NETWORKING` / `GOVERNANCE`].
6. Confirm and save.

### 3. Perform maintenance tasks

- Once Maintenance Mode is activated, proceed with your maintenance tasks or create complex workloads as needed.

### 4. Deactivate maintenance mode

1. After completing your tasks, navigate back to the Maintenance mode tab.
2. Select the `OFF` mode.
3. Confirm and save.

## Best practices

- **Communicate**: Inform relevant team members about the activation and deactivation of maintenance mode to avoid any confusion.
- **Understand the impact**: Privileged users should fully understand the changes they're making, and steps to undo or remediate those changes. Making manual changes to underlying managed resources in an enclave while in maintenance mode might cause unintended drift in your environment from ideal states.
