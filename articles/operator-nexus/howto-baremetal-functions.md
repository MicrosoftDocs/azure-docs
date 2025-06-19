---
title: "Azure Operator Nexus: Bare Metal Machine platform commands"
description: Learn how to manage bare metal machines (BMM).
author: eak13
ms.author: ekarandjeff
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 04/02/2025
ms.custom: template-how-to, devx-track-azurecli
---

# Bare Metal Machine Platform Commands

This article describes how to perform lifecycle management operations on Bare Metal Machines (BMM).
These steps should be used for troubleshooting purposes to recover from failures or when taking maintenance actions.

First, read the advice in the article [Best Practices for Bare Metal Machine Operations](./howto-bare-metal-best-practices.md) before proceeding with operations.

The bolded actions listed are considered disruptive (Power off, Restart, Reimage, Replace).
The Cordon action without the `evacuate` parameter isn't considered disruptive while Cordon with the `evacuate` parameter is considered disruptive.

- **Power off a Bare Metal Machine**
- Start a Bare Metal Machine
- **Restart a Bare Metal Machine**
- Make a Bare Metal Machine unschedulable (cordon without evacuate, doesn't drain the node)
- **Make a Bare Metal Machine unschedulable (cordon with evacuate, drains the node)**
- Make a Bare Metal Machine schedulable (uncordon)
- **Reimage a Bare Metal Machine**
- **Replace a Bare Metal Machine**

[!INCLUDE [caution-affect-cluster-integrity](./includes/baremetal-machines/caution-affect-cluster-integrity.md)]

[!INCLUDE [important-donot-disrupt-kcpnodes](./includes/baremetal-machines/important-donot-disrupt-kcpnodes.md)]

[!INCLUDE [prerequisites-azure-cli-bare-metal-machine-actions](./includes/baremetal-machines/prerequisites-azure-cli-bare-metal-machine-actions.md)]

## Power off a Bare Metal Machine

> [!IMPORTANT]
> There are rare cases where running Nexus VMs fail to relaunch after BMM shutdown or restart. To prevent these cases, power off any virtual machines on the BMM before powering off or restarting the BMM. See the [`cordon`](#make-a-bare-metal-machine-unschedulable-cordon) command for instructions on finding the workloads running on a BMM.

This command will `power-off` the specified `bareMetalMachineName`.

```azurecli
az networkcloud baremetalmachine power-off \
  --name <BareMetalMachineName> \
  --resource-group <resourceGroup> \
  --subscription <subscriptionID>
```

## Start a Bare Metal Machine

This command will `start` the specified `bareMetalMachineName`.

```azurecli
az networkcloud baremetalmachine start \
  --name <BareMetalMachineName> \
  --resource-group <resourceGroup> \
  --subscription <subscriptionID>
```

## Restart a Bare Metal Machine

> [!IMPORTANT]
> There are rare cases where running Nexus VMs fail to relaunch after BMM shutdown or restart. To prevent these cases, power off any virtual machines on the BMM before powering off or restarting the BMM. See the [`cordon`](#make-a-bare-metal-machine-unschedulable-cordon) command for instructions on finding the workloads running on a BMM.

This command will `restart` the specified `bareMetalMachineName`.

```azurecli
az networkcloud baremetalmachine restart \
  --name <BareMetalMachineName> \
  --resource-group <resourceGroup> \
  --subscription <subscriptionID>
```

## Make a Bare Metal Machine unschedulable (cordon)

You can make a Bare Metal Machine unschedulable by executing the [`cordon`](#make-a-bare-metal-machine-unschedulable-cordon) command.
On the execution of the `cordon` command, Operator Nexus workloads aren't scheduled on the Bare Metal Machine when `cordon` is set.
Any attempt to create a workload on a `cordoned` Bare Metal Machine results in the workload being set to `pending` state.
Existing workloads continue to run on the Bare Metal Machine unless the workloads are drained.

### Drain Bare Metal Machine workloads

The cordon command supports the `evacuate` parameter which its default value `False` means that the `cordon` command prevents scheduling new workloads.
To drain workloads with the `cordon` command, the `evacuate` parameter must be set to `True`.
The workloads running on the Bare Metal Machine are `stopped` and the Bare Metal Machine is set to `pending` state.

> [!NOTE]
> Nexus Management Workloads continue to run on the Bare Metal Machine even when the server is cordoned and evacuated.

It's a best practice to set the `evacuate` value to `True` when attempting to do any maintenance operations on the Bare Metal server.
For more best practices to follow, read through [Best Practices for Bare Metal Machine Operations](./howto-bare-metal-best-practices.md).

```azurecli
az networkcloud baremetalmachine cordon \
  --evacuate "True" \
  --name <BareMetalMachineName> \
  --resource-group <resourceGroup> \
  --subscription <subscriptionID>
```

### To identify if any workloads are currently running on a Bare Metal Machine, run the following command:

For Virtual Machines:

```azurecli
az networkcloud baremetalmachine show -n <nodeName> /
  --resource-group <resourceGroup> /
  --subscription <subscriptionID> | jq '.virtualMachinesAssociatedIds'
```

For Nexus Kubernetes cluster nodes: (Requires logging into the Nexus Kubernetes cluster)

```shell
kubectl get nodes <resourceName> -ojson |jq '.metadata.labels."topology.kubernetes.io/baremetalmachine"'
```

## Make a Bare Metal Machine schedulable (uncordon)

You can make a Bare Metal Machine "schedulable" (the server can host workloads) by executing the [`uncordon`](#make-a-bare-metal-machine-schedulable-uncordon) command.
All workloads in a `pending` state on the Bare Metal Machine are `restarted` when the Bare Metal Machine is `uncordoned`.

```azurecli
az networkcloud baremetalmachine uncordon \
  --name <BareMetalMachineName> \
  --resource-group <resourceGroup> \
  --subscription <subscriptionID>
```

## Reimage a Bare Metal Machine

You can restore the runtime version on a Bare Metal Machine by executing `reimage` command. The `reimage` action doesn't affect the tenant workload files on the Bare Metal Machine.
This process **redeploys** the runtime image on the target Bare Metal Machine and executes the steps to rejoin the cluster with the same identifiers.

As a best practice, ensure the Bare Metal Machine's workloads are drained using the [`cordon`](#make-a-bare-metal-machine-unschedulable-cordon) command, with `evacuate` set to `True`, before executing the `reimage` command.
For more best practices to follow, read through [Best Practices for Bare Metal Machine Operations](./howto-bare-metal-best-practices.md).

> [!IMPORTANT]
> Avoid write or edit actions performed on the node via Bare Metal Machine access.
> The `reimage` action is required to restore Microsoft support and any changes done to the Bare Metal Machine are lost while restoring the node to it's expected state.

[!INCLUDE [warning-do-not-run-multiple-actions](./includes/baremetal-machines/warning-do-not-run-multiple-actions.md)]

```azurecli
az networkcloud baremetalmachine reimage \
  --name <BareMetalMachineName> \
  --resource-group <resourceGroup> \
  --subscription <subscriptionID>
```

## Replace a Bare Metal Machine

Use the `replace` command when a server encounters hardware issues requiring a complete or partial hardware replacement.
After the replacing components such as motherboard or Network Interface Card (NIC), the MAC address of Bare Metal Machine will change; however, the iDRAC IP address and hostname will remain the same.
A `replace` **must** be executed after each hardware maintenance operation, read through [Best practices for a Bare Metal Machine replace](./howto-bare-metal-best-practices.md#best-practices-for-a-bare-metal-machine-replace) for more details.

As of the 2506.2 release, the password value for iDRAC can be provided as a Key Vault Uniform Resource Identifier (URI) or password value. See [Key Vault Credential Reference](reference-key-vault-credential.md). Using a URI instead of a plaintext password provides extra security.

[!INCLUDE [warning-do-not-run-multiple-actions](./includes/baremetal-machines/warning-do-not-run-multiple-actions.md)]

```azurecli
az networkcloud baremetalmachine replace \
  --name <BareMetalMachineName> \
  --resource-group <resourceGroup> \
  --bmc-credentials password=<PASSWORD_URI or IDRAC_PASSWORD> username=<IDRAC_USER> \
  --bmc-mac-address <IDRAC_MAC> \
  --boot-mac-address <PXE_MAC> \
  --machine-name <OS_HOSTNAME> \
  --serial-number <SERIAL_NUMBER> \
  --subscription <subscriptionID>
```

If the `replace` action fails due to a hardware validation failure, the specific error or test failure is shown in the `replace` response, as shown in the following examples.
This information can also be found in the Activity Log for the Bare Metal Machine (Operator Nexus).
The error code and error message are included the JSON properties of the corresponding `BareMetalMachines_Replace` operation.

**Example 1: Hardware validation fails due to invalid Key Vault URI for Baseboard Management Controller (BMC) credentials**

```shell
$ az networkcloud baremetalmachine replace --name rack1compute02 --resource-group hostedRG --bmc-credentials password=$KEY_VAULT_URI username=root --bmc-mac-address 00-00-5E-00-01-00 --boot-mac-address 00-00-5E-00-02-00 --machine-name RACK1COMPUTE02 --serial-number SN123435
(failed to retrieve password from key vault) failed to get secret value from key vault: failed to get cluster key vault secret
Code: failed to retrieve password from key vault
Message: failed to retrieve password from key vault
Response: 400 Bad Request
```

**Example 2: Hardware validation fails due to invalid Baseboard Management Controller (BMC) credentials provided**

```shell
$ az networkcloud baremetalmachine replace --name rack1compute02 --resource-group hostedRG --bmc-credentials password=REDACTED username=root --bmc-mac-address 00-00-5E-00-01-00 --boot-mac-address 00-00-5E-00-02-00 --machine-name RACK1COMPUTE02 --serial-number SN123435
(None) BMC login unsuccessful: Fail - Unauthorized; System health test(s) failed: [Additional logs: Server power down at end of test failed with: Unauthorized]
Code: None
Message: BMC login unsuccessful: Fail - Unauthorized; System health test(s) failed: [Additional logs: Server power down at end of test failed with: Unauthorized]
```

> [!NOTE]
> When hardware validation fails due to BMC credential authentication issues (Unauthorized), the action is rejected but the Bare Metal Machine isn't marked as failed or put into an error state. The BMM maintains its current operational status while the hardware validation reports the credential authentication failure.

**Example 3: Hardware validation fails due to networking failure**

```shell
$ az networkcloud baremetalmachine replace --name rack1compute02 --resource-group hostedRG --bmc-credentials password=REDACTED username=root --bmc-mac-address 00-00-5E-00-01-00 --boot-mac-address 00-00-5E-00-02-00 --machine-name RACK1COMPUTE02 --serial-number SN123435
(None) Networking test(s) failed: [NIC.Slot.6-1-1_LinkStatus] expected: up; observed: Down; [Additional logs: Link failure detected on NIC.Slot.6-1-1; Unable to perform cabling check on PCI Slot 6]
Code: None
Message: Networking test(s) failed: [NIC.Slot.6-1-1_LinkStatus] expected: up; observed: Down; [Additional logs: Link failure detected on NIC.Slot.6-1-1; Unable to perform cabling check on PCI Slot 6]
```

For more information about troubleshooting hardware validation failures, see [Troubleshoot Hardware Validation Failure](./troubleshoot-hardware-validation-failure.md).
