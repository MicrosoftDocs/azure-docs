---
title: How to use Commit Workflow v2 in Azure Operator Nexus
description: Learn the process for using Commit Workflow v2 in Nexus Network Fabric
author: sushantjrao 
ms.author: sushrao
ms.date: 05/26/2025
ms.topic: how-to
ms.service: azure-operator-nexus
ms.custom: template-how-to, devx-track-azurecli
---

# How to use Commit Workflow v2 in Azure Operator Nexus

The **Commit Workflow v2** ensures that device-impacting changes to a Network Fabric instance are explicitly acknowledged and committed before being applied to the underlying infrastructure. This structured workflow increases reliability and control over configuration changes.

## Prerequisites

* **Runtime version**: `5.0.1` or later is required for Commit Workflow v2.

* **Azure CLI version** `8.0.0b3` or later is installed

* Your **Network Fabric must be in `Provisioned` state** and **configuration state must be `Succeeded`**.

* The **fabric and all impacted resources must have admin state set to `Enabled`**.

* You must have **BYOS (Bring Your Own Storage)** configured on the fabric to use the optional validation step.

## Commit Workflow v2 overview

Any `patch` operation on parent resources or `Create`/`Update`/`Delete` (CUD) operation on connected child resources now requires an explicit commit step. Changes are **batched** until you lock, validate (optional), and commit them.

### Step 1: Update resources

Make patch or CUD operations via Azure CLI, Portal, or ARM template.
Once these changes are made, the fabric's configuration state changes to `Accepted (Pending Commit)`.

#### Example scenarios

* Create a new **Route Policy** and attach it to **Internal Network 1**

* Create another **Internal Network 2**

All these changes are **batched**, but **not applied** to devices yet.


### Step 2: Lock Configuration (Mandatory)

Lock the configuration to signal that all intended updates are completed. After this lock, **no further updates** can be made to any fabric-related resources until you unlock.

#### Azure CLI Command

```Azure CLI
az networkfabric fabric lock-fabric \
    --action Lock \
    --lock-type Configuration \
    --network-fabric-name "example-fabric" \
    --resource-group "example-rg"
```

- Successful execution transitions the fabric to a **locked state**.

- Check CLI output for success or failure status.


### Step 3: Validate updates (Optional but recommended)

Validate the configuration using the `view-device-configuration` post-action. This step provides insight into the expected configuration outcomes.

> [!Important] 
> BYOS must be configured on the Network Fabric.

#### Azure CLI Command

```Azure CLI

az networkfabric fabric view-device-configuration \
    --network-fabric-name "example-fabric"\
    --resource-group "example-rg"
```

- **Pre-Device Changes**: Current config for all devices (CE, TOR, Management Switches)

- **Post-Device Changes**: Preview of what will be applied after commit

### Step 3a: Discard commit batch (Optional)

After validating with ViewDeviceConfiguration, users may choose to discard pending configuration updates if issues are found. This operation restores the ARM resource state to its last known good configuration and resets the fabric state from Accepted & Locked to Succeeded.


```Azure CLI
az networkfabric fabric discard-commit-batch \
  --resource-group "example-rg" \
  --network-fabric-name "example-fabric"
```

> [!Note]
> Internal/External network resources move to Admin State: Disabled and Config State: Rejected.<br>
> Resources are not deleted, user must delete them manually if required.<br>
> Network Monitor handling includes additional constraints (disabled monitors revert to rejected state).<br>

#### Need to Make More Updates?

Unlock the configuration to make further changes, then repeat the lock/validate/commit steps.

#### Unlock Example

```Azure CLI
az networkfabric fabric lock-fabric \
    --action Unlock \
    --lock-type Configuration \
    --network-fabric-name "example-fabric" \
    --resource-group "example-rg"
```

### Step 4: Commit Configuration (Mandatory)

Commit the configuration to apply the batched changes to all relevant fabric devices.

#### Azure CLI Command

```Azure CLI
az networkfabric fabric commit-configuration \
  --resource-group "example-rg" \
  --resource-name "example-fabric"
```

- The operation returns a **status**: `Succeeded`, `InProgress`, or `Failed`

- Use CLI polling or Azure Activity Logs to monitor progress

> [!Important]
> - This workflow applies **only when the fabric is in Provisioned state** and **admin state is Enabled**. <br>
> - Locking is mandatory before commit; **commit cannot proceed without locking first**. <br>
> - **Rollback is not supported** – any incorrect configuration must be updated and re-committed. <br>
> - Updates outside of this workflow (e.g., to tags or disconnected resources) do **not require commit**. <br>

