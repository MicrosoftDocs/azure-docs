---
title: "Azure Operator Nexus: MDE Runtime Protection"
description: Learn how to use the MDE Runtime Protection.
author: sshiba
ms.author: sidneyshiba
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 10/15/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Introduction to the Microsoft Defender Runtime Protection Service

The Microsoft Defender (MDE) Runtime Protection service provides the tools to configure and manage runtime protection on all nodes of an Undercloud cluster.
Azure CLI was extended providing the ability to configure ***Enforcement Level*** and trigger ***MDE Scan*** on all nodes.

## Before you begin

1. Install the latest version of the [appropriate CLI extensions](./howto-install-cli-extensions.md).

## Setting variables

To help with configuring and triggering MDE scans, define these environment variables used by the various commands throughout this guide.

> [!NOTE]
> These environment variable values do not reflect a real deployment and users MUST change them to match their environments.

```bash
# SUBSCRIPTION_ID: Subscription of your Undercloud cluster
export SUBSCRIPTION_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
# RESOURCE_GROUP: Resource group of your Undercloud cluster
export RESOURCE_GROUP="contorso-cluster-rg"
# MANAGED_RESOURCE_GROUP: Managed resource group of your Undercloud cluster
export MANAGED_RESOURCE_GROUP="contorso-cluster-managed-rg"
# CLUSTER_NAME: Name of your Undercloud cluster
export CLUSTER_NAME="contoso-cluster"
```

## Configuring Enforcement Level
The `az networkcloud cluster update` has been extended to allow the update of the settings for cluster runtime protection *enforcement level* by using the argument `--runtime-protection-configuration enforcement-level="<enforcement level>"`.

```bash
az networkcloud cluster update \
--subscription ${SUBSCRIPTION_ID} \
--resource-group ${RESOURCE_GROUP} \
--cluster-name ${CLUSTER_NAME} \
--runtime-protection-configuration enforcement-level="<enforcement level>"
```

Allowed values for <enforcement level>: `Audit`, `Disabled`, `OnDemand`, `Passive`, `RealTime`. 

## Enabling & Disabling MDE Service on All Nodes
Before you can trigger a MDE scan on all nodes of a cluster, the MDE service needs to be enabled.

When the Undercloud cluster is deployed, the MDE service is disabled by default on all nodes of that cluster.
To enable the MDE service, execute the following command.

```bash
az networkcloud cluster update \
--subscription ${SUBSCRIPTION_ID} \
--resource-group ${RESOURCE_GROUP} \
--cluster-name ${CLUSTER_NAME} \
--runtime-protection-configuration enforcement-level="<enforcement level>"
```

where `<enforcement level>` value MUST be different from `"Disabled"`.

> [!NOTE]
>As you have noted, the argument `--runtime-protection-configuration enforcement-level="<enforcement level>"` serves two purposes: enabling/disabling MDE service and updating the enforcement level.

If you want to disable MDE service on all nodes of an Undercloud cluster, then `<enforcement level>` shall be equal to `"Disabled"`.

## Triggering MDE Scan on All Nodes
Once the MDE service is enabled on all nodes of your Undercloud cluster, you can trigger MDE scan with the following command.

```bash
az networkcloud cluster scan-runtime \
--subscription ${SUBSCRIPTION_ID} \
--resource-group ${RESOURCE_GROUP} \
--cluster-name ${CLUSTER_NAME} \
--scan-activity Scan
```

## Retrieve MDE Scan Information from Each Node

First we need to retrieve the list of node names.
```bash
nodes=$(az networkcloud baremetalmachine list \
--subscription ${SUBSCRIPTION_ID} \
--resource-group ${MANAGED_RESOURCE_GROUP} \
| jq -r '.[].machineName')
```

Extracting MDE agent information from each node of your Undercloud cluster

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

The results will be provided as URL for the data collected. See an example below.

```bash
Extracting MDE agent information for node rack1control01
====Action Command Output====
Executing mde-agent-information command
MDE agent is running, proceeding with data extract
Getting MDE agent information for rack1control01
Writing to /hostfs/tmp/runcommand

================================
Script execution result can be found in storage account: 
 https://cm9454mpfsq9st.blob.core.windows.net/bmm-run-command-output/d8b0cbd1-33eb-4b83-b4c4-6b3f68086555-action-bmmdataextcmd.tar.gz?se=2023-10-13T20%3A53%3A41Z&sig=yQlXoiRaQo2Iryf%2FZ44oWhVR9ykqZiEZdlbVXeXHJ9I%3D&sp=r&spr=https&sr=b&st=2023-10-13T16%3A53%3A41Z&sv=2019-12-12

 ...
```

## Extracting MDE Scan Results
The extraction of MDE scan requires a few manual steps.

### Download the Scan Report
In the scan report, there is an URL that provides the detailed report.

Download the report from the returned URL (e.g., https://cm9454mpfsq9st.blob.core.windows.net/bmm-run-command-output/d8b0cbd1-33eb-4b83-b4c4-6b3f68086555-action-bmmdataextcmd.tar.gz?se=2023-10-13T20%3A53%3A41Z&sig=yQlXoiRaQo2Iryf%2FZ44oWhVR9ykqZiEZdlbVXeXHJ9I%3D&sp=r&spr=https&sr=b&st=2023-10-13T16%3A53%3A41Z&sv=2019-12-12 ), and open the file `mde-agent-information.json`.

### Extracting the MDE Scans
To retrieve the list of scans run, execute the following command.

```bash
cat <path to>/mde-agent-information.json| jq .scanList
```

See an example of scan run report below.
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

You can use the command `date -d @$(echo "<UNIX timestamp>/1000" | bc) "+%Y-%m-%dT%H:%M:%S"` to convert the time in a more readable format.

For example:

```bash
date -d @$(echo "1697204573732/1000" | bc) "+%Y-%m-%dT%H:%M:%S"

2023-10-13T13:42:53
```

### Extracting the MDE Scan Results
To retrieve scan results, execute the following command.

```bash
cat <path to>/mde-agent-information.json| jq .threatInformation
```

See an example of scan results report below.

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

