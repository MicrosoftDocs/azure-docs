---
title: Troubleshoot BMM Degraded issues in Azure Operator Nexus
description: Troubleshooting guide for Bare Metal Machines in 'Degraded' status in Azure Operator Nexus.
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus
ms.topic: troubleshooting
ms.date: 02/03/2025
author: robertstarling
ms.author: robstarling
ms.reviewer: ekarandjeff
---

# Troubleshoot _Degraded_ status errors on an Azure Operator Nexus Cluster Bare Metal Machine

This document provides basic troubleshooting information for Bare Metal Machine (BMM) resources which are reporting a _Degraded_ status in the BMM detailed status message.

## Symptoms

Bare Metal Machines (BMM) which are in _Degraded_ state exhibit the following symptoms.

- The Detailed status message includes one or more _Degraded_ messages as shown in the following table.
- The BMM might be automatically cordoned, if the resource is continuously degraded for 15 minutes or longer (for Compute nodes only).
- The BMM will then remain cordoned for 2 hours after the underlying conditions resolve, after which it will be automatically uncordoned.
- Control and Management nodes can be reported as _Degraded_, but aren't automatically cordoned.

| Detailed status message                                  | Cordon automatically? | Details and mitigation                                                                                            |
| -------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `Degraded: port is not functioning as expected`          | Yes                   | [Degraded: `port is not functioning as expected`](#degraded-port-is-not-functioning-as-expected)                  |
| `Degraded: LACP status is down`                          | Yes                   | [Degraded: `LACP status is down`](#degraded-lacp-status-is-down)                                                  |
| `Degraded: BMM power state doesn't match expected state` | No                    | [Degraded: `BMM power state doesn't match expected state`](#degraded-bmm-power-state-doesnt-match-expected-state) |

_Degraded_ status messages and associated automatic cordoning behavior are present in Azure Operator Nexus version 2502.1 and higher.

## Troubleshooting

To check for any Bare Metal Machines (BMMs) which are currently degraded, run `az networkcloud baremetalmachine list -g <ResourceGroup_Name> -o table`. This command shows the current status of all BMMs in the specified resource group. Any active _Degraded_ conditions are visible in the detailed status message.

To see the current Cordoning status, include a `--query` parameter which specifies the `cordonStatus`, as seen in the following example. This command can help to identify any compute nodes which are still automatically cordoned due to recently resolved _Degraded_ conditions.

```azurecli
az networkcloud baremetalmachine list  -g <ResourceGroup_Name> --output table --query "[].{name:name,powerState:powerState,provisioningState:provisioningState,readyState:readyState,cordonStatus:cordonStatus,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage}"
```

**Example Azure CLI output**

```
Name            PowerState    ProvisioningState    ReadyState    CordonStatus    DetailedStatus    DetailedStatusMessage
--------------  ------------  -------------------  ------------  --------------  ----------------  -----------------------------------------------------------------------------------------------------------------
rack2management1  On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack3management1  On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack2management2  On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack1management1  Off           Succeeded            False         Uncordoned      Available         Available to participate in the cluster.
rack3management2  On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack1management2  On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack3compute01    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack1compute05    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack1compute02    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack1compute03    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack1compute08    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack2compute05    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack2compute03    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack1compute01    On            Succeeded            False         Cordoned        Provisioned       The OS is provisioned to the machine. Degraded: LACP status is down
rack2compute07    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack2compute01    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack1compute04    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack3compute06    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack3compute05    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack3compute08    Off           Succeeded            False         Uncordoned      Error             This machine has failed hardware validation
rack2compute06    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack3compute07    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack3compute03    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack3compute02    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack1compute07    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack3compute04    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack2compute08    On            Succeeded            True          Cordoned        Provisioned       The OS is provisioned to the machine. Degraded: port is not functioning as expected
rack2compute02    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack1compute06    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack2compute04    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
```

For more information, use an Azure CLI Bare Metal Machine `run-read-command` command such as the following to inspect the `conditions` status of the corresponding kubernetes BMM object.

```azurecli
az networkcloud baremetalmachine run-read-command -g <ResourceGroup_Name> -n rack2management2 --limit-time-seconds 60 --commands "[{command:'kubectl get',arguments:[-n,nc-system,bmm,rack2compute08,-o,json]}]" --output-directory .
```

- Replace `<ResourceGroup_Name>` with the name of the resource group containing the BMM resources.
- Replace `rack2management2` with the name of a BMM resource for a healthy Kubernetes control plane node, from which to execute the `kubectl get` command.
- Replace `rack2compute08` with the name of the degraded or cordoned BMM to inspect.
- For more information about the `run-read-command` feature, see [BareMetal Run-Read Execution](./howto-baremetal-run-read.md).

Review the `lastTransitionTime` and `message` fields for more information about the corresponding degraded condition, as shown in the following example output.

**Example `conditions` output:**

```
  "conditions": [
    {
      "lastTransitionTime": "2025-01-30T23:54:04Z",
      "status": "True",
      "type": "BmmInExpectedLACPState"
    },
    {
      "lastTransitionTime": "2025-02-01T22:07:14Z",
      "message": "Error: Port status for interface 98_p1 is down",
      "reason": "Port status is down",
      "severity": "Error",
      "status": "False",
      "type": "BmmInExpectedPortState"
    },
    {
      "lastTransitionTime": "2025-01-30T23:54:04Z",
      "status": "True",
      "type": "BmmInExpectedPowerState"
    }
  ],
```

## Automatic Cordoning

If an uncordoned BMM is in a _Degraded_ state for 15 minutes or more, the node might be automatically cordoned, depending on which degraded conditions are present.

- The `cordonStatus` field in the BMM object shows the current state of the node.
- Only BMMs used for Compute are automatically cordoned. Control and Management nodes aren't automatically cordoned.
- An automatically cordoned node will remain cordoned for 2 hours after the underlying conditions are resolved, after which it will be automatically uncordoned.
- To uncordon a BMM manually, use the `az networkcloud baremetalmachine uncordon` command or execute the _Uncordon_ action from the Azure portal.
- Manually uncordoning a BMM which still has a degraded condition has no effect. The _Uncordon_ request will execute successfully, but the node will immediately be automatically cordoned again until 2 hours after the underlying conditions are resolved.

To investigate whether a currently cordoned BMM is due to a recent _Degraded_ state:

- Review the `lastTransitionTime` in the `conditions` for the kubernetes `bmm` resource, as described in the [Troubleshooting](#troubleshooting) section, to identify any recently resolved _Degraded_ conditions.
- Review the Activity Logs for the BMM resource in the Azure portal to check for any user initiated cordon requests.

## Degraded: `port is not functioning as expected`

This message in the BMM _Detailed status message_ field indicates that the physical link is down on one or more of the Mellanox interfaces on the underlying compute host. This scenario can indicate a cabling, switch port configuration, or hardware failure.

To troubleshoot this issue:

- review the `conditions` status of the kubernetes `bmm` object, as described in the [Troubleshooting](#troubleshooting) section
- this information should identify the affected port and approximate time of the issue
- check the Ethernet cabling and Top Of Rack (TOR) switch for the specified port
- check for any recent deployment or infrastructure changes which coincide with the time of failure.

**Example `conditions` output for unexpected port state**

```
  "conditions": [
    {
      "lastTransitionTime": "2025-02-01T22:07:14Z",
      "message": "Error: Port status for interface 98_p1 is down",
      "reason": "Port status is down",
      "severity": "Error",
      "status": "False",
      "type": "BmmInExpectedPortState"
    }
  ],
```

## Degraded: `LACP status is down`

This message in the BMM _Detailed status message_ field indicates a Link Aggregation Control Protocol (LACP) failure on the underlying compute host, when the physical links are physically up. This scenario can indicate a cabling or Top Of Rack (TOR) switch configuration issue.

To troubleshoot this issue:

- review the `conditions` status of the kubernetes `bmm` object, as described in the [Troubleshooting](#troubleshooting) section
- this information should identify the affected port and approximate time of the issue
- check the Ethernet cabling and Top Of Rack (TOR) switch for the specified port
- check whether any other BMMs are also reporting port or LACP issues, which might help to identify any potential mis-cabling or wider issue with the TOR switch or network configuration
- check for any recent deployment or infrastructure changes which coincide with the time of failure
- for more information about diagnosing and fixing LACP issues, see [Troubleshoot LACP Bonding](./troubleshoot-lacp-bonding.md).

> [!WARNING]
> As of version 2502.1, there's a known issue where `LACP status is down` can be incorrectly reported in addition to the `port is not functioning as expected` message during a port down scenario. This issue can happen when a BMM is restarted or reimaged while the physical port is down. This issue will be fixed in a future release. In the meantime, the `LACP status is down` warning can be safely ignored if the physical port is also down.

**Example `conditions` output for unexpected LACP state**

```
  "conditions": [
    {
      "lastTransitionTime": "2025-01-31T12:24:27Z",
      "message": "Error: LACP status for interface 4b_p0 is down, LACP status for interface 4b_p1 is down",
      "reason": "LACP status is down",
      "severity": "Error",
      "status": "False",
      "type": "BmmInExpectedLACPState"
    },
  ],
```

## Degraded: `BMM power state doesn't match expected state`

This message in the BMM _Detailed status message_ field indicates that either:

- the underlying host is powered off when it should be on, or
- the underlying host is powered on when it should be off.

This condition can happen temporarily during a normal Restart, Reimage, or similar BMM lifecycle event. However, a persistent 'unexpected power state' message can indicate an issue with the underlying compute host or baseboard management controller (BMC).

To troubleshoot this issue:

- review the `conditions` status of the kubernetes `bmm` object, as described in the [Troubleshooting](#troubleshooting) section
- this information should identify the approximate time of the issue and any other available details
- check the power feed, power cables, and physical hardware for the specified BMM
- check whether any other BMMs are also reporting an unexpected degraded state, which might indicate a broader issue with the underlying infrastructure
- check for any recent deployment or infrastructure changes which coincide with the time of failure
- review the power state and logs on the BMC for the affected host.

For more information about logging into the BMC, see [Troubleshoot Hardware Validation Failure](./troubleshoot-hardware-validation-failure.md).

**Example `conditions` output for unexpected power state**

```
  "conditions": [
    {
      "lastTransitionTime": "2025-02-03T22:35:55Z",
      "message": "BareMetalMachine expected to be powered on",
      "reason": "BmmPoweredOnExpected",
      "severity": "Error",
      "status": "False",
      "type": "BmmInExpectedPowerState"
    },
  ],
```
