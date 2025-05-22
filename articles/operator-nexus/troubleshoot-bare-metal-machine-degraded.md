---
title: Troubleshoot BMM Degraded issues in Azure Operator Nexus
description: Troubleshooting guide for Bare Metal Machines in 'Degraded' status in Azure Operator Nexus.
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus
ms.topic: troubleshooting
ms.date: 05/21/2025
author: robertstarling
ms.author: robstarling
ms.reviewer: ekarandjeff
---

# Troubleshoot _Degraded_ status errors on an Azure Operator Nexus Cluster Bare Metal Machine

This document provides basic troubleshooting information for Bare Metal Machine (BMM) resources which are reporting a _Degraded_ status in the BMM detailed status message.

## Symptoms

Bare Metal Machines (BMM) which are in _Degraded_ state exhibit the following symptoms.

- The Detailed status message includes one or more _Degraded_ messages as shown in the following table.
- The BMM is automatically cordoned once the resource is continuously degraded for more than 15 minutes (for Compute nodes only).
- The BMM will then remain cordoned for 2 hours after the underlying conditions resolve, after which it will be automatically uncordoned.
- Control and Management nodes can be reported as _Degraded_, but aren't automatically cordoned.

| Detailed status message         | Details and mitigation                                           |
| ------------------------------- | ---------------------------------------------------------------- |
| `Degraded: NIC failed`          | [`Degraded: NIC failed`](#degraded-nic-failed)                   |
| `Degraded: port down`           | [`Degraded: port down`](#degraded-port-down)                     |
| `Degraded: LACP status is down` | [`Degraded: LACP status is down`](#degraded-lacp-status-is-down) |
| `Degraded: port flapping`       | [`Degraded: port flapping`](#degraded-port-flapping)             |

_Degraded_ status messages and associated automatic cordoning behavior are present in Azure Operator Nexus version 2502.1 and higher.

## Troubleshooting

To check for any Bare Metal Machines (BMMs) which are currently degraded, run `az networkcloud baremetalmachine list -g <ResourceGroup_Name> -o table`.
This command shows the current status of all BMMs in the specified resource group. Any active _Degraded_ conditions are visible in the detailed status message.

To see the current Cordoning status, include a `--query` parameter which specifies the `cordonStatus`, as seen in the following example.
This command can help to identify any compute nodes which are still automatically cordoned due to recently resolved _Degraded_ conditions.

```azurecli
az networkcloud baremetalmachine list \
  -g <ResourceGroup_Name> \
  --output table \
  --query "[].{name:name,powerState:powerState,provisioningState:provisioningState,readyState:readyState,cordonStatus:cordonStatus,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage}"
```

**Example Azure CLI output**

This example shows a deployment with two currently degraded BMMs (`compute01` and `compute04`), and two cordoned BMMs (`compute02` and `compute04`).
Not all degraded BMMs are cordoned (yet), and not all of the healthy BMMs are uncordoned (yet) - due to the fixed delay before automatic cordoning and uncordoning takes effect.

```shell
Name            PowerState    ProvisioningState    ReadyState    CordonStatus    DetailedStatus    DetailedStatusMessage
--------------  ------------  -------------------  ------------  --------------  ----------------  -----------------------------------------------------------------------------------------------------------------
rack1management1  On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack1compute01    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine. Degraded: LACP status is down
rack1compute02    On            Succeeded            True          Cordoned        Provisioned       The OS is provisioned to the machine.
rack1compute03    On            Succeeded            True          Uncordoned      Provisioned       The OS is provisioned to the machine.
rack1compute04    On            Succeeded            True          Cordoned        Provisioned       The OS is provisioned to the machine. Degraded: port flapping Degraded: port down
```

Additional information about recent degraded conditions and automatic cordoning is available in the following fields on the `bmm` kubernetes resource.

- `degradedStartTime` and `degradedEndTime` show the start and end time of the most recent _degraded_ state
- `conditions` shows the status of any individual conditions which are contributing to a _degraded_ state
- `cordonStatus` indicates whether the node is currently cordoned or uncordoned
- `annotations` shows which conditions triggered the current cordon, if automatically cordoned.
  - `platform.afo-nc.microsoft.com/lacp-down-cordon`
  - `platform.afo-nc.microsoft.com/port-down-cordon`
  - `platform.afo-nc.microsoft.com/port-flap-cordon`
- If the user manually cordoned the BMM, the following annotation is also present.
  - `platform.afo-nc.microsoft.com/cutomer-cordon`
- The Activity Logs for the BMM resource in the Azure portal can also provide more information about any recent user initiated cordon requests.

- The `annotations` metadata on the `bmm` kubernetes resource shows which condition triggered the cordon.
- The `conditions` status on the `bmm` kubernetes object shows the current status and timestamp for any triggering conditions.

To view these `bmm` kubernetes resource fields, use an Azure CLI `run-read-command` command as shown in the following example.

```azurecli
az networkcloud baremetalmachine run-read-command \
  -g <ResourceGroup_Name> \
  -n rack2management2 \
  --limit-time-seconds 60 \
  --commands "[{command:'kubectl get',arguments:[-n,nc-system,bmm,rack2compute08,-o,json]}]" \
  --output-directory .
```

- Replace `<ResourceGroup_Name>` with the name of the resource group containing the BMM resources.
- Replace `rack2management2` with the name of a BMM resource for a healthy Kubernetes control plane node, from which to execute the `kubectl get` command.
- Replace `rack2compute08` with the name of the degraded or cordoned BMM to inspect.

For more information about the `run-read-command` feature, see [BareMetal Run-Read Execution](./howto-baremetal-run-read.md).

**Example `run-read-command` output (`kubectl get bmm`):**

This example shows an automatically cordoned BMM with two active _Degraded_ conditions.

```json
{
  "metadata": {
    "annotations": {
      "platform.afo-nc.microsoft.com/port-down-cordon": "true",
      "platform.afo-nc.microsoft.com/port-flap-cordon": "true"
    }
  },
  "status": {
    "conditions": [
      {
        "lastTransitionTime": "2025-03-04T02:47:59Z",
        "status": "True",
        "type": "BmmInExpectedLACPState"
      },
      {
        "lastTransitionTime": "2025-03-04T03:27:00Z",
        "message": "Physical link(s) down: 4b_p1",
        "reason": "PortDown",
        "status": "False",
        "type": "BmmNetworkLinksUp"
      },
      {
        "lastTransitionTime": "2025-03-04T03:49:00Z",
        "message": "Port flapping in the last 15 mins: 4b_p1 (2 times)",
        "reason": "PortFlappingDetected",
        "status": "False",
        "type": "BmmNetworkLinksStable"
      }
    ],
    "cordonStatus": "Cordoned",
    "degradedStartTime": "2025-03-04T03:27:00Z",
    "detailedStatus": "Provisioned",
    "detailedStatusMessage": "The OS is provisioned to the machine. Degraded: port flapping Degraded: port down"
  }
}
```

## Automatic Cordoning

If an uncordoned Compute BMM remains in a _Degraded_ state for more than 15 minutes, the node is automatically cordoned.

- An automatically cordoned node will remain cordoned for 2 hours after the underlying conditions are resolved, after which it will be automatically uncordoned.
- To uncordon a BMM manually, use the `az networkcloud baremetalmachine uncordon` command or execute the _Uncordon_ action from the Azure portal.
- Manually uncordoning a BMM which still has an active degraded condition isn't allowed. In this case, the _Uncordon_ request is rejected with an error message similar to the following.

`action rejected: baremetalmachine 'rack1compute01' currently degraded since 2025-02-26 05:26:09 +0000 UTC`

Note: only BMMs used for _Compute_ are automatically cordoned. Control and Management nodes aren't automatically cordoned.

For more information about investigating the root cause of an automatic cordon, see [Troubleshooting](#troubleshooting).

## `Degraded: NIC Failed`

This message indicates that one of the expected Mellanox Network Interface Cards (NICs) on the underlying compute host is failed or missing.
This message typically indicates a hardware failure on the NIC, or that the card isn't correctly seated in the host.

To troubleshoot this issue:

- to identify the nonoperational NIC, check the Ethernet link status indicators on the underlying compute host
- check that the NIC is correctly installed and seated
- sign into the Baseboard Management Controller (BMC) to check the hardware status of the NIC
- review detailed hardware logs by generating a Dell TSR (Technical Support Report) as described in the Dell Knowledge Base article [Export a SupportAssist Collection Using an iDRAC](https://www.dell.com/support/kbdoc/en-us/000126308/export-a-supportassist-collection-via-idrac9)
- review the most recent time of failure reported by the Bare Metal Machine `conditions`, as described in the [Troubleshooting](#troubleshooting) section
- power cycle the host by executing a "Restart" action on the Bare Metal Machine resource, and see if the condition clears.

**Example `conditions` output for NIC failed**

```json
"conditions": [
  {
    "lastTransitionTime": "2025-05-21T16:49:29Z",
    "message": "Expected 2 devices in oam-bond, found 1: 98_pf0vf0_vf",
    "reason": "OamDevicesUnhealthy",
    "status": "False",
    "type": "BmmNicsHealthy"
  },
],
```

## `Degraded: port down`

This message in the BMM _Detailed status message_ field indicates that the physical link is down on one or more of the Mellanox interfaces on the underlying compute host.
This scenario can indicate a cabling, switch port configuration, or hardware failure.

To troubleshoot this issue:

- review the `conditions` status of the kubernetes `bmm` object, as described in the [Troubleshooting](#troubleshooting) section
- this information should identify the affected port and approximate time of the issue
- check the Ethernet cabling and Top Of Rack (TOR) switch for the specified port
- check for any recent deployment or infrastructure changes which coincide with the time of failure.

**Example `conditions` output for port down**

```json
"conditions": [
  {
    "lastTransitionTime": "2025-03-04T03:27:00Z",
    "message": "Physical link(s) down: 4b_p1",
    "reason": "PortDown",
    "status": "False",
    "type": "BmmNetworkLinksUp"
  },
],
```

## `Degraded: LACP status is down`

This message in the BMM _Detailed status message_ field indicates a Link Aggregation Control Protocol (LACP) failure on the underlying compute host, when the physical links are physically up.
This scenario can indicate a cabling or Top Of Rack (TOR) switch configuration issue.

To troubleshoot this issue:

- review the `conditions` status of the kubernetes `bmm` object, as described in the [Troubleshooting](#troubleshooting) section
- this information should identify the affected port and approximate time of the issue
- check the Ethernet cabling and Top Of Rack (TOR) switch for the specified port
- check whether any other BMMs are also reporting port or LACP issues, which might help to identify any potential mis-cabling or wider issue with the TOR switch or network configuration
- check for any recent deployment or infrastructure changes which coincide with the time of failure
- for more information about diagnosing and fixing LACP issues, see [Troubleshoot LACP Bonding](./troubleshoot-lacp-bonding.md).

> [!WARNING]
> In version 2502.1, there's a known issue where `LACP status is down` can be incorrectly reported in addition to a `port is not functioning as expected` message during a port down scenario.
> This issue can happen when a BMM is restarted or reimaged while the physical port is down.
> In this case, the LACP warning can be safely ignored if the physical port is also down. This issue is fixed in version 2503.1.

**Example `conditions` output for unexpected LACP state**

```json
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

## `Degraded: port flapping`

This message in the BMM _Detailed status message_ field indicates that one or more of the Mellanox ethernet ports is experiencing port flapping.
Port flapping is defined as two or more changes in the physical link state within the previous 15 minutes.
This behavior can indicate a cabling, switch or hardware issue, or possible network configuration issues.

To troubleshoot this issue:

- identify the affected port and approximate time of the issue by reviewing the BMM `conditions`, as described in the [Troubleshooting](#troubleshooting) section
- check the `degradedStartTime` timestamp on the `bmm` object (if different) for more context about the overall timeline
- check the Ethernet cabling and Top Of Rack (TOR) switch for the specified port
- check for any other BMMs which are also reporting port flapping or link failures, for information about the scope of the issue or any common cause
- check for any recent deployment or infrastructure changes which coincide with the time of failure.

**Example `conditions` output for port flapping**

```json
"conditions": [
  {
    "lastTransitionTime": "2025-03-04T03:49:00Z",
    "message": "Port flapping in the last 15 mins: 4b_p1 (2 times)",
    "reason": "PortFlappingDetected",
    "status": "False",
    "type": "BmmNetworkLinksStable"
  },
],
```
