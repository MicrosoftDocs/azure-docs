---
title: "Azure Operator Nexus: Baseboard Management Controller Credential Rotation Overview"
description: An overview of how credential rotation occurs for Baseboard Management Controller Credential
author: ghugo
ms.author: gagehugo
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 06/09/2025
---

# Baseboard Management Controller Credential Rotation Overview

The Baseboard Management Controller (BMC) (iDRAC) has several credentials that are automatically rotated as part of the system per each machine. In order for this automated rotation to occur, each Bare Metal Machine (BMM) must be considered one of two potential states in the cluster before it rotates the credential.

## Cluster Status and BMC Credential Rotation

When a Bare Metal Machine's iDRAC credentials can't be rotated or become mismatched, it can cause the machine to be unable to communicate with iDRAC. The mismatch of credentials can leave the Bare Metal Machine in an error state.

Additionally, a runtime upgrade doesn't occur since the undercloud infrastructure needs to communicate with the OS.

## Criteria For Rotation

For iDRAC credential rotation to occur, a machine must meet specific criteria where we consider it to be `Healthy` or `Spare`:

* The machine must be `Provision Status: Succeeded` and `Uncordoned`. If these two criteria are met, we move on to the next step.
* We check for two specific cases where we consider the machine to be "Healthy" or "Spare":
    * For the machine to be considered `Healthy`, we check the following criteria. If all three are met, we proceed with rotation. If not, we check for spare.
        - The machine must be in `Ready` state
        - The machine's detailed status is `Provisoned`
        - The machine must have a set kubernetes node
    * For the machine to be considered a `Spare`, we perform these checks. If the following are met, we consider it a "Spare" node and perform rotation.
        - The machine is `NOT` in `Ready` state
        - The machine's detailed status is `Available`

As per these guidelines, a machine doesn't perform automatic rotation if it's `Cordoned`. Likewise, rotation doesn't occur on any machine that isn't `Provision Status: Succeeded`.

For more information on BMM/BMC rotation, see [Credential Rotation](./howto-credential-rotation.md).
