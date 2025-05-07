---
title: "Azure Operator Nexus: MDE Runtime Protection"
description: Learn how to use the MDE Runtime Protection.
author: sshiba
ms.author: sidneyshiba
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/15/2024
ms.custom: template-how-to
---

# Introduction to the Microsoft Defender for Endpoint runtime protection service

The Microsoft Defender for Endpoint (MDE) runtime protection service provides the tools to configure and manage runtime protection for a Nexus cluster.

The Azure CLI allows you to configure runtime protection ***Enforcement Level*** and the ability to trigger ***MDE Scan*** on all nodes.
This document provides the steps to execute those tasks.

> [!NOTE]
> The MDE runtime protection service integrates with [Microsoft Defender for Endpoint](/azure/defender-for-cloud/integration-defender-for-endpoint), which provides comprehensive Endpoint Detection and Response (EDR) capabilities. With Microsoft Defender for Endpoint integration, you can spot abnormalities and detect vulnerabilities.

## Before you begin

- Install the latest version of the [appropriate CLI extensions](./howto-install-cli-extensions.md).
- Onboarding permissions granted to the nc-platform-extension identity of the cluster. See [Grant MDE Onboarding Permissions](./howto-set-up-defender-for-cloud-security.md).

## Setting variables

To help with configuring and triggering MDE scans, define these environment variables used by the various commands throughout this guide.

> [!NOTE]
> These environment variable values do not reflect a real deployment and users MUST change them to match their environments.

```bash
# SUBSCRIPTION_ID: Subscription of your cluster
export SUBSCRIPTION_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
# RESOURCE_GROUP: Resource group of your cluster
export RESOURCE_GROUP="contoso-cluster-rg"
# MANAGED_RESOURCE_GROUP: Managed resource group managed by your cluster
export MANAGED_RESOURCE_GROUP="contoso-cluster-managed-rg"
# CLUSTER_NAME: Name of your cluster
export CLUSTER_NAME="contoso-cluster"
```

## Defaults for MDE Runtime Protection
The runtime protection sets to following default values when you deploy a cluster
- Enforcement Level: `Disabled` if not specified when creating the cluster
- MDE Service: `Disabled`

> [!NOTE]
>The argument `--runtime-protection enforcement-level="<enforcement level>"` serves two purposes: enabling/disabling MDE service and updating the enforcement level.

If you want to disable the MDE service across your Cluster, use an `<enforcement level>` of `Disabled`.

## Configuring enforcement level
The `az networkcloud cluster update` command allows you to update of the settings for Cluster runtime protection *enforcement level* by using the argument `--runtime-protection enforcement-level="<enforcement level>"`.

The following command configures the `enforcement level` for your Cluster.

```bash
az networkcloud cluster update \
--subscription ${SUBSCRIPTION_ID} \
--resource-group ${RESOURCE_GROUP} \
--cluster-name ${CLUSTER_NAME} \
--runtime-protection enforcement-level="<enforcement level>"
```

Allowed values for `<enforcement level>`: `Disabled`, `RealTime`, `OnDemand`, `Passive`.
- `Disabled`: Real-time protection is turned off and no scans are performed.
- `RealTime`: Real-time protection (scan files as they're modified) is enabled.
- `OnDemand`: Files are scanned only on demand. In this:
  - Real-time protection is turned off.
- `Passive`: Runs the antivirus engine in passive mode. In this:
  - Real-time protection is turned off: Threats are not remediated by Microsoft Defender Antivirus.
  - On-demand scanning is turned on: Still use the scan capabilities on the endpoint.
  - Automatic threat remediation is turned off: No files will be moved and security admin is expected to take required action.
  - Security intelligence updates are turned on: Alerts will be available on security admins tenant.

You can confirm that enforcement level was updated by inspecting the output for the following json snippet:

```json
  "runtimeProtectionConfiguration": {
    "enforcementLevel": "<enforcement level>"
  }
```

## Triggering MDE scan on all nodes
To trigger an MDE scan on all nodes of a cluster, use the following command:

```bash
az networkcloud cluster scan-runtime \
--subscription ${SUBSCRIPTION_ID} \
--resource-group ${RESOURCE_GROUP} \
--cluster-name ${CLUSTER_NAME} \
--scan-activity Scan
```

> NOTE: the MDE scan action requires the MDE service to be enabled. Just in case it is not enabled, the command will fail.
In this case set the `Enforcement Level` to a value different from `Disabled` to enable the MDE service.

## Retrieve MDE scan information from each node
This section provides the steps to retrieve MDE scan information.
First you need to retrieve the list of node names of your cluster.
The following command assigns the list of node names to an environment variable.

```bash
nodes=$(az networkcloud baremetalmachine list \
--subscription ${SUBSCRIPTION_ID} \
--resource-group ${MANAGED_RESOURCE_GROUP} \
| jq -r '.[].machineName')
```

With the list of node names, we can start the process to extract MDE agent information for each node of your Cluster.
The following command will prepare MDE agent information from each node.

```bash
for node in $nodes
do
    echo "Extracting MDE agent information for node ${node}"
    az networkcloud baremetalmachine run-data-extract \
    --subscription ${SUBSCRIPTION_ID} \
    --resource-group ${MANAGED_RESOURCE_GROUP} \
    --name ${node} \
    --commands '[{"command":"mde-agent-information"}]' \
    --limit-time-seconds 600
done
```

The result for the command will include a URL where you can download the detailed report of MDE scans.
See the following example for the result for the MDE agent information.

```bash
Extracting MDE agent information for node rack1control01
====Action Command Output====
Executing mde-agent-information command
MDE agent is running, proceeding with data extract
Getting MDE agent information for rack1control01
Writing to /hostfs/tmp/runcommand

================================
Script execution result can be found in storage account: 
 <url to download mde scan results>
 ...
```

## Extracting MDE scan results
The extraction of MDE scan requires a few manual steps: To download the MDE scan report and extract the scan run information, and scan detailed result report.
This section will guide you on each of these steps.

### Download the scan report
As indicated earlier the MDE agent information response provides the URL storing the detailed report data.

Download the report from the returned URL `<url to download mde scan results>`, and open the file `mde-agent-information.json`.

The `mde-agent-information.json` file contains lots of information about the scan and it can be overwhelming to analyze such long detailed report.
This guide provides a few examples of extracting some essential information that can help you decide if you need to analyze thoroughly the report.

### Extracting the list of MDE scans
The `mde-agent-information.json` file contains a detailed scan report but you might want to focus first on a few details.
This section details the steps to extract the list of scans run providing the information such as start and end time for each scan, threats found, state (succeeded or failed), etc.

The following command extracts this simplified report.

```bash
cat <path to>/mde-agent-information.json| jq .scanList
```

The following example shows the extracted scan report from `mde-agent-information.json`.

```bash
[
  {
    "endTime": "1697204632487",
    "filesScanned": "1750",
    "startTime": "1697204573732",
    "state": "succeeded",
    "threats": [],
    "type": "quick"
  },
  {
    "endTime": "1697217162904",
    "filesScanned": "1750",
    "startTime": "1697217113457",
    "state": "succeeded",
    "threats": [],
    "type": "quick"
  }
]
```

You can use the Unix `date` command to convert the time in a more readable format.
For your convenience, see an example for converting Unix timestamp (in milliseconds) to year-month-day and hour:min:secs.

For example:

```bash
date -d @$(echo "1697204573732/1000" | bc) "+%Y-%m-%dT%H:%M:%S"

2023-10-13T13:42:53
```

### Extracting the MDE scan results
This section details the steps to extract the report about the list of threats identified during the MDE scans.
To extract the scan result report from `mde-agent-information.json` file, execute the following command.

```bash
cat <path to>/mde-agent-information.json| jq .threatInformation
```

The following example shows the report of threats identified by the scan extracted from `mde-agent-information.json` file.

```bash
{
  "list": {
    "threats": {
      "scans": [
        {
          "type": "quick",
          "start_time": 1697204573732,
          "end_time": 1697204632487,
          "files_scanned": 1750,
          "threats": [],
          "state": "succeeded"
        },
        {
          "type": "quick",
          "start_time": 1697217113457,
          "end_time": 1697217162904,
          "files_scanned": 1750,
          "threats": [],
          "state": "succeeded"
        }
      ]
    }
  },
  "quarantineList": {
    "type": "quarantined",
    "threats": []
  }
}
```
