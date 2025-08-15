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

This article explains how to use Commit Workflow Version 2 (Commit V2) in Azure Operator Nexus. It helps you safely stage changes, review them, commit the changes you want, or discard the ones you don’t need—across supported resources.

## Prerequisites

* **Runtime version**: `5.0.1` or later is required for Commit Workflow v2.

* **Azure CLI version** `8.0.0b3` or later is installed

* Your **Network Fabric must be in `Provisioned` state** and **configuration state must be `Succeeded`**.

* The **fabric and all impacted resources must have admin state set to `Enabled`**.

* You must have **BYOS (Bring Your Own Storage)** configured on the fabric to use the optional validation step.

## Commit Workflow v2 overview

Commit V2 enables you to update supported resources in a draft state, validate configuration changes, view configuration differences, and explicitly commit or discard the changes. It ensures atomicity, operational control, and improved user experience for complex network fabric operations.

### Benefits of Commit V2

- Faster commit operations: Reduces the time to apply configuration changes.

- Review pending configuration: View and validate configuration differences before committing.

- Discard commit batch: Revert staged changes if necessary.

- Lock configuration: Prevent conflicting changes during staging and review.

- Foundation for advanced scenarios: Enables A/B commit strategy and multi-user sessions in future releases.

### Workflow summary

The Commit V2 workflow includes the following steps:

- Update supported resources in draft mode using PATCH operations.

- Lock the fabric configuration to review or discard staged changes.

- Optionally, view configuration differences for each device.

- Either commit or discard the changes.

- After commit/discard, the fabric and all related resources return to a Provisioned state.

### Step 1: Update resources in draft mode

Resources can be updated using PATCH operations that leave the resource in a draft (ConfigurationState: `Accepted`) until explicitly committed. These changes are not applied to the data plane until committed.

#### Example scenario

* Create a new **Route Policy** and attach it to **Internal Network 1**

* Create another **Internal Network 2**

All these changes are **batched**, but **not applied** to devices yet.


### Step 2: Lock fabric configuration

Before you can view the configuration diff or discard the commit, the fabric must be locked in configuration mode.

Lock the configuration to signal that all intended updates are completed. After this lock, **no further updates** can be made to any fabric-related resources until you unlock.

#### Azure CLI Command

```Azure CLI
az networkfabric fabric lock-fabric \
    --action Lock \
    --lock-type Configuration \
    --network-fabric-name "example-fabric" \
    --resource-group "example-rg"
```

> [!Note]
> Ensure fabric configuration state is Accepted.<br> 
> Fabric is not under maintenance due to unrelated (non-commit) operations.<br>
> Network Fabric version is >= 5.0.1.<br>
> Fabric is in ProvisioningState: Succeeded.<br>

### Step 3: Validate updates (Optional but recommended)

Another key functionality commit V2 provides is to view the pending commit configuration and last committed configuration for each device (except Network Packet Broker (NPB) devices) so that users can compare them to validate the intended configuration. If there's any discrepancy, users can unlock the fabric, make necessary change, lock fabric, review pending commit followed by commit operation.

Validate the configuration using the `view-device-configuration` post-action. This step provides insight into the expected configuration outcomes.

> [!Important] 
> The fabric must be locked in configuration mode.<br>
> [BYOS](./howto-configure-bring-your-own-storage-network-fabric.md) must be configured on the Network Fabric.

#### Azure CLI Command

```Azure CLI

az networkfabric fabric view-device-configuration \
    --network-fabric-name "example-fabric"\
    --resource-group "example-rg"
```

#### Configuration diff location

Configuration diff files are stored in the customer-provided storage account in the following format:

```Location
https://<storageAccountName>.blob.core.windows.net/<NF_name>/CommitOperations/DeviceConfigDiff/<CommitBatchId>
```

You can retrieve the current CommitBatchId by performing a GET request on the fabric resource with API version `2024-06-15-preview` or higher.

### Step 3a: Discard commit batch (Optional)

Commit Discard is a POST action on NetworkFabric, allowed before a commit is performed. This operation allows a user to revert the changes made to the resources via PATCH operations for a specific commit session.
Users may choose to discard pending configuration updates if issues are found during validation using ViewDeviceConfiguration. This operation restores the ARM resource state to its last known good configuration and resets the fabric state from Accepted & Locked to Succeeded.

>[!Note]
> You can retrieve the CommitBatchId by performing a GET request on the fabric resource with API version `2024-06-15-preview` or above.

> [!IMPORTANT]
> If your Network Fabric resource is associated with a User Assigned Managed Identity (UAMI)—for example, when using a customer-managed storage account—you must ensure that the Microsoft.ManagedNetworkFabric resource provider has the [Managed Identity Operator (MIO) role](./howto-configure-bring-your-own-storage-network-fabric.md#step3-assign-permissions-to-uami-for-nexus-network-fabric-resource-provider) on the UAMI.
> Without this permission, the commit discard operation fails. This requirement is applicable only when the Network Fabric is linked to a UAMI. Network Fabrics that aren't associated with a UAMI don’t need any extra permission for commit discard.

```Azure CLI
az networkfabric fabric discard-commit-batch \
  --resource-group "example-rg" \
  --network-fabric-name "example-fabric"
  --commit-batch-id "example-commit-batch-id"
```

> [!Note]
> Internal/External network resources move to Admin State: Disabled and Config State: Rejected.<br>
> Resources aren't deleted, user must delete them manually if required.<br>
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

