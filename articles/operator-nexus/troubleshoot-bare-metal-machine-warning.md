---
title: Troubleshoot BMM Warning messages in Azure Operator Nexus
description: Troubleshooting guide for Bare Metal Machines Warning status messages in Azure Operator Nexus.
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus
ms.topic: troubleshooting
ms.date: 04/17/2025
author: robertstarling
ms.author: robstarling
ms.reviewer: ekarandjeff
---

# Troubleshoot _'Warning'_ detailed status messages on an Azure Operator Nexus Cluster Bare Metal Machine

This document provides basic troubleshooting information for Bare Metal Machine (BMM) resources which are reporting a _Warning_ message in the BMM detailed status message.

## Symptoms

The Detailed status message of the Bare Metal Machine (Operator Nexus) resource includes one or more of the following.

| Detailed status message                                 | Details and mitigation                                                                                          |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `Warning: PXE port is unhealthy`                        | [`Warning: PXE port is unhealthy`](#warning-pxe-port-is-unhealthy)                                              |
| `Warning: BMM power state doesn't match expected state` | [`Warning: BMM power state doesn't match expected state`](#warning-bmm-power-state-doesnt-match-expected-state) |
| `Warning: This machine has failed hardware validation`  | [`Warning: This machine has failed hardware validation`](#warning-this-machine-has-failed-hardware-validation)  |

## Troubleshooting

Evaluate the current status of all BMMs in the specified resource group.
Any active _Warning_ conditions are visible in the Detailed Status Message, as seen in the following example.

To check for any Bare Metal Machines (BMMs) which are reporting _Warning_ messages, run:

```azurecli
az networkcloud baremetalmachine list -g <ResourceGroup_Name> -o table
Name            ResourceGroup                       DetailedStatus    DetailedStatusMessage
--------------  ----------------------------------  ----------------  -------------------------------------------------------------------------------------------
rack1control01  cluster-1-HostedResources-3EA53DF9  Provisioned       The OS is provisioned to the machine.
rack1control02  cluster-1-HostedResources-3EA53DF9  Available         Available to participate in the cluster.
rack1compute02  cluster-1-HostedResources-3EA53DF9  Provisioned       The OS is provisioned to the machine. Warning: PXE port is unhealthy
rack1compute01  cluster-1-HostedResources-3EA53DF9  Provisioned       The OS is provisioned to the machine. Warning: BMM power state doesn't match expected state
```

For more information, use an Azure CLI Bare Metal Machine `run-read-command` command such as the following to inspect the `conditions` status of the corresponding kubernetes BMM object.

```azurecli
az networkcloud baremetalmachine run-read-command \
  -g <ResourceGroup_Name> \
  -n rack1control01 \
  --limit-time-seconds 60 \
  --commands "[{command:'kubectl get',arguments:[-n,nc-system,bmm,rack1compute01,-o,json]}]" \
  --output-directory .
```

- Replace `<ResourceGroup_Name>` with the name of the resource group containing the BMM resources.
- Replace `rack1control01` with the name of a BMM resource for a healthy Kubernetes control plane node, from which to execute the `kubectl get` command.
- Replace `rack1compute01` with the name of the affected BMM.
- For more information about the `run-read-command` feature, see [BareMetal Run-Read Execution](./howto-baremetal-run-read.md).

Review the `lastTransitionTime` and `message` fields for more information about the corresponding error condition, as shown in the following example output.

**Example `run-read-command` output (`kubectl get bmm`):**

```json
{
  "status": {
    "conditions": [
      {
        "lastTransitionTime": "2025-03-04T01:57:06Z",
        "status": "True",
        "type": "BmmInExpectedNodeReadiness"
      },
      {
        "lastTransitionTime": "2025-03-04T15:59:36Z",
        "message": "BareMetalMachine expected to be powered on",
        "reason": "BmmPoweredOnExpected",
        "severity": "Error",
        "status": "False",
        "type": "BmmInExpectedPowerState"
      },
      {
        "lastTransitionTime": "2025-03-04T02:48:54Z",
        "message": "PXE network port (pxe) is up and stable",
        "reason": "PxePortsHealthy",
        "status": "True",
        "type": "BmmPxePortHealthy"
      }
    ],
    "detailedStatus": "Provisioned",
    "detailedStatusMessage": "The OS is provisioned to the machine. Warning: BMM power state doesn't match expected state"
  }
}
```

## `Warning: PXE port is unhealthy`

This message in the BMM _Detailed status message_ field indicates a problem with network connectivity on the Preboot Execution Environment (PXE) Ethernet port on the underlying compute host.
The PXE port is used during provisioning and upgrades to download the operating system image and other software components.
PXE connectivity issues shouldn't directly affect customer workloads running on a compute host.
However they can cause failures in BMM lifecycle operations such as the following.

- Cluster Provisioning
- Cluster Upgrade
- BMM Reimage
- BMM Replace

Either of the following conditions can trigger this _Warning_. These conditions can be due to hardware, cabling, or network configuration issues.

- PXE network port is down (physical link is down)
- PXE network port is flapping (more than two changes in physical link state in the previous 15 minutes)

To troubleshoot this issue:

- review the `conditions` status of the kubernetes `bmm` object, as described in the [Troubleshooting](#troubleshooting) section
- this information should identify the specific root cause (port down or port flapping) and approximate time of the issue
- check the Ethernet cabling and Top Of Rack (TOR) switch for the affected PXE port
- check for any other BMMs which are also reporting unhealthy PXE status or other network-related problems
- check for any recent deployment or infrastructure changes which coincide with the time of failure.

**Example `conditions` output for PXE warning**

```
"conditions": [
  {
    "lastTransitionTime": "2025-03-04T16:43:29Z",
    "message": "Physical link down on PXE interface: pxe",
    "reason": "PxePortUnhealthy",
    "status": "False",
    "type": "BmmPxePortHealthy"
  },
],
```

## `Warning: BMM power state doesn't match expected state`

This message in the BMM _Detailed status message_ field indicates that either:

- the underlying host is powered off when it should be on, or
- the underlying host is powered on when it should be off.

This message can indicate an issue with the underlying compute host or baseboard management controller (BMC).

To troubleshoot this issue:

- review the `conditions` status of the kubernetes `bmm` object, as described in the [Troubleshooting](#troubleshooting) section
- this information should identify the approximate time of the issue and any other available details
- check the power feed, power cables, and physical hardware for the specified BMM
- check whether any other BMMs are also reporting an unexpected power state Warning, which might indicate a broader issue with the underlying infrastructure
- check for any recent deployment or infrastructure changes which coincide with the time of failure
- review the power state and logs on the BMC for the affected host.

For more information about logging into the BMC, see [Troubleshoot Hardware Validation Failure](./troubleshoot-hardware-validation-failure.md).

> [!WARNING]
> In versions 2502.1 and 2502.3, there's a known issue where `BMM power state doesn't match expected state` is incorrectly reported during deprovisioning and provisioning.
> For example, the issue can happen when running the BMM Reimage or Replace actions. This issue is fixed in version 2504.1.

**Example `conditions` output for unexpected power state**

```json
"conditions": [
    {
      "lastTransitionTime": "2025-03-04T15:59:36Z",
      "message": "BareMetalMachine expected to be powered on",
      "reason": "BmmPoweredOnExpected",
      "severity": "Error",
      "status": "False",
      "type": "BmmInExpectedPowerState"
    },
],
```

## `Warning: This machine has failed hardware validation`

This BMM _Detailed status message_ indicates that hardware validation for the BMM failed. Hardware validation typically occurs during initial cluster provisioning or during a BMM Replace action.

For more information about troubleshooting hardware validation failures, see [Troubleshoot Hardware Validation Failure](./troubleshoot-hardware-validation-failure.md).
