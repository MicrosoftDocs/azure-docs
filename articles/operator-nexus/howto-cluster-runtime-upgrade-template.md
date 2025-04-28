---
title: "Azure Operator Nexus: Cluster runtime upgrade template"
description: Learn the process for upgrading Cluster for Operator Nexus with step-by-step parameterized template.
author: bartpinto 
ms.author: bpinto
ms.service: azure-operator-nexus
ms.date: 04/24/2025
ms.topic: how-to
ms.custom: azure-operator-nexus, template-include
---

# Cluster runtime upgrade template

This how-to guide provides a step-by-step template for upgrading a Nexus Cluster designed to assist users in managing a reproducible end-to-end upgrade through Azure APIs and standard operating procedures. Regular updates are crucial for maintaining system integrity and accessing the latest product improvements.

## Overview

**Runtime bundle components**: These components require operator consent for upgrades that may affect traffic behavior or necessitate server reboots. Nexus Cluster's design allows for updates to be applied while maintaining continuous workload operation.

Runtime changes are categorized as follows:
- **Firmware/BIOS/BMC updates**: Necessary to support new server control features and resolve security issues.
- **Operating system updates**: Necessary to support new Operating system features and resolve security issues.
- **Platform updates**: Necessary to support new platform features and resolve security issues.

## Prerequisites

- Install the latest version of [Azure CLI](https://aka.ms/azcli).
- The latest `networkcloud` CLI extension is required. It can be installed following the steps listed in [Install CLI Extension](howto-install-cli-extensions.md).
- Subscription access to run the Azure Operator Nexus Network Fabric (NF) and Network Cloud (NC) CLI extension commands.
-Target Cluster must be healthy in a running state.

## Required Parameters
- \<ENVIRONMENT\>: - Instance Name
- <AZURE_REGION>: - Azure Region of Instance
- <CUSTOMER_SUB_NAME>: Subscription Name
- <CUSTOMER_SUB_ID>: Subscription ID
- <CLUSTER_NAME>: Cluster Name
- <CLUSTER_RG>: Cluster Resource Group
- <CLUSTER_RID>: Cluster ARM ID
- <CLUSTER_MRG>: Cluster Managed Resource Group
- <CLUSTER_CONTROL_BMM>: Cluster Control plane baremetalmachine
- <CLUSTER_VERSION>: Runtime version for upgrade
- <START_TIME>: Planned start time of upgrade
- \<DURATION\>: Estimated Duration of upgrade
- <DEPLOYMENT_THRESHOLD>: Compute deployment threshold
- <DEPLOYMENT_PAUSE_MINS>: Time to wait before moving to the next Rack once the current Rack meets the deployment threshold
- <NFC_NAME>: Associated Network Fabric Controller (NFC)
- <CM_NAME>: Associated Cluster Manager (CM)
- <BMM_ISSUE_LIST>: List of BMM with provisioning issues after Cluster upgrade is complete

## Pre-Checks

1. Validate the provisioning and detailed status for the CM and Cluster.
   
   Set up the subscription, CM, and Cluster parameters:
   ```  
   export SUBSCRIPTION_ID=<CUSTOMER_SUB_ID>
   export CM_RG=<CM_RG>
   export CM_NAME=<CM_NAME>
   export CLUSTER_RG=<CLUSTER_RG>
   export CLUSTER_NAME=<CLUSTER_NAME>
   export CLUSTER_RID=<CLUSTER_RID>
   export CLUSTER_MRG=<CLUSTER_MRG>
   export THRESHOLD=<DEPLOYMENT_THRESHOLD>
   export PAUSE_MINS=<DEPLOYMENT_PAUSE_MINS>
   ```

   Check that the CM is in `Succeeded` for `Provisioning state`:
   ```
   az networkcloud clustermanager show -g $CM_RG --resource-name $CM_NAME --subscription $SUBSCRIPTION_ID -o table
   ```

   Check the Cluster status `Detailed status` is `Running`:
   ```  
   az networkcloud cluster show -g $CLUSTER_RG --resource-name $CLUSTER_NAME --subscription $SUBSCRIPTION_ID -o table
   ```

   >[!Note]
   > If CM `Provisioning state` isn't `Succeeded` and Cluster `Detailed status` isn't `Running` stop the upgrade until issues are resolved.

2. Check the Bare Metal Machine (BMM) status `Detailed status` is `Running`:
   ```
   az networkcloud baremetalmachine list -g $CLUSTER_MRG --subscription $SUBSCRIPTION_ID --query "sort_by([].{name:name,kubernetesNodeName:kubernetesNodeName,location:location,readyState:readyState,provisioningState:provisioningState,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage,cordonStatus:cordonStatus,powerState:powerState,kubernetesVersion:kubernetesVersion,machineClusterVersion:machineClusterVersion,machineRoles:machineRoles| join(', ', @),createdAt:systemData.createdAt}, &name)" -o table
   ```

   Validate the following resource states for each BMM (except spare):
   - ReadyState: True
   - ProvisioningState: Succeeded
   - DetailedStatus: Provisioned
   - CordonStatus: Uncordoned
   - PowerState: On

   One control-plane BMM is labeled as a spare with the following BMM status profile:
   - ReadyState: False
   - ProvisioningState: Succeeded
   - DetailedStatus: Available
   - CordonStatus: Uncordoned
   - PowerState: Off

3. Collect a profile of the tenant workloads:
   ```
   az networkcloud clustermanager show -g $CM_RG --resource-name $CM_NAME --subscription $SUBSCRIPTION_ID -o table
   az networkcloud virtualmachine list --sub $SUBSCRIPTION_ID --query "reverse(sort_by([?clusterId=='$CLUSTER_RID'].{name:name, createdAt:systemData.createdAt, resourceGroup:resourceGroup, powerState:powerState, provisioningState:provisioningState, detailedStatus:detailedStatus,bareMetalMachineId:bareMetalMachineIdi,CPUCount:cpuCores, EmulatorStatus:isolateEmulatorThread}, &createdAt))" -o table
   az networkcloud kubernetescluster list --sub $SUBSCRIPTION_ID --query "[?clusterId=='$CLUSTER_RID'].{name:name, resourceGroup:resourceGroup, provisioningState:provisioningState, detailedStatus:detailedStatus, detailedStatusMessage:detailedStatusMessage, createdAt:systemData.createdAt, kubernetesVersion:kubernetesVersion}" -o table
   ```

4. Review Operator Nexus Release notes for required checks and configuration updates not included in this document.

## Send notification to Operations of upgrade schedule for the Cluster

The following template can be used through email or support ticket:
```
Title: <ENVIRONMENT> <AZURE_REGION> <CLUSTER_NAME> runtime upgrade to <CLUSTER_VERSION> <START_TIME> - Completion ETA <DURATION>

Operations Support:

Deployment Team notification for <ENVIRONMENT> <AZURE_REGION> <CLUSTER_NAME> runtime upgrade to <CLUSTER_VERSION> <START_TIME> - Completion ETA <DURATION>

Subscription: <CUSTOMER_SUB_ID>
NFC: <NFC_NAME>
CM: <CM_NAME>
Fabric: <NF_NAME>
Cluster: <CLUSTER_NAME>
Region: <AZURE_REGION>
Version: <NEXUS_VERSION>

CC: stakeholder-list
```

## Add resource tag on Cluster resource in Azure portal
To help track upgrades, add a tag to the Cluster resource in Azure portal (optional):
```
|Name            | Value          |
|----------------|-----------------
|BF in progress  |<DE_ID>         |
```

## Set deployment strategy and Compute threshold on Cluster if different from default
The default threshold for the percent of Compute BMM to pass hardware validation and provisioning is 80% with a default pause between Racks of one minute.

The following settings are available for `update-strategy`:
* `Rack` - Upgrade each Rack one at a time and move to the next Rack once the Compute threshold is met for the current Rack. Pause for <DEPLOYMENT_PAUSE_MINS> before starting next Rack.
* `PauseAfterRack` - Wait for user API response to continue to the next Rack once the Compute threshold is met for the current Rack.

If `updateStrategy` isn't set, the default values are as follows:
```
"updateStrategy": {
   "maxUnavailable": 32767,
   "strategyType": "Rack",
   "thresholdType": "PercentSuccess",
   "thresholdValue": 80,
   "waitTimeMinutes": 1
}
```

### Set a deployment threshold and wait time different than default
```
az networkcloud cluster update -n $CLUSTER_NAME -g $CLUSTER_RG --update-strategy strategy-type="Rack" threshold-type="PercentSuccess" threshold-value=$THRESHOLD wait-time-minutes=$PAUSE_MINS --subscription $SUBSCRIPTION_ID
```
>[!Important]
> If 100% threshold is required, review the BMM status reported during pre-checks and make sure all BMM are healthy before proceeding with the upgrade.

Verify update:
```
az networkcloud cluster show -n $CLUSTER_NAME -g $CLUSTER_RG --subscription $SUBSCRIPTION_ID| grep -A5 updateStrategy
"updateStrategy": {
   "maxUnavailable": 32767,
   "strategyType": "Rack",
   "thresholdType": "PercentSuccess",
   "thresholdValue": $THRESHOLD,
   "waitTimeMinutes": $PAUSE_MINS
}
```

### How to run Cluster upgrade with `PauseAfterRack` Strategy

`PauseAferRack` strategy allows the customer to control the upgrade by requiring an API call to continue to the next Rack after each Compute Rack completes to the configured threshold.

To configure strategy to use `PauseAfterRack`:
```
az networkcloud cluster update -n $CLUSTER_NAME -g $CLUSTER_RG --update-strategy strategy-type="PauseAfterRack" wait-time-minutes=0 threshold-type="PercentSuccess" threshold-value=$THRESHOLD --subscription $SUBSCRIPTION_ID
```

Verify update:
```
az networkcloud cluster show -g <CLUSTER_RG> -n <CLUSTER_NAME> --subscription <CUSTOMER_SUB_ID>| grep -A5 updateStrategy
  "updateStrategy": {
    "maxUnavailable": 32767,
    "strategyType": "PauseAfterRack",
    "thresholdType": "PercentSuccess",
    "thresholdValue": $THRESHOLD,
    "waitTimeMinutes": 0
```

## Run upgrade from either portal or cli
* To start upgrade from Azure portal, go to Cluster resource, click `Update`, select <CLUSTER_VERSION>, then click `Update`
* To run upgrade from Azure CLI, run the following command:
  ```
  az networkcloud cluster update-version --subscription $SUBSCRIPTION_ID --cluster-name $CLUSTER_NAME --target-cluster-version $CLUSTER_VERSION --resource-group $CLUSTER_RG --no-wait --debug
  ```

  Gather ASYNC URL and Correlation ID info for further troubleshooting if needed.
  ```
  cli.azure.cli.core.sdk.policies:     'mise-correlation-id': '<MISE_CID>'
  cli.azure.cli.core.sdk.policies:     'x-ms-correlation-request-id': '<CORRELATION_ID>'
  cli.azure.cli.core.sdk.policies:     'Azure-AsyncOperation': '<ASYNC_URL>'
  ```
  Provide this information to Microsoft Support when opening a support ticket for upgrade issues.

## Monitor status of Cluster
```
az networkcloud cluster list -g $CLUSTER_RG --subscription $SUBSCRIPTION_ID -o table
```
The Cluster `Detailed status` shows `Running` and the `Detailed status message` shows 'Cluster is up and running.` when the upgrade is complete.

## Monitor status of Bare Metal Machines
```
az networkcloud baremetalmachine list -g $CLUSTER_MRG --subscription $SUBSCRIPTION_ID -o table
az networkcloud baremetalmachine list -g $CLUSTER_MRG --subscription $SUBSCRIPTION_ID --query "sort_by([].{name:name,kubernetesNodeName:kubernetesNodeName,location:location,readyState:readyState,provisioningState:provisioningState,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage,cordonStatus:cordonStatus,powerState:powerState,kubernetesVersion:kubernetesVersion,machineClusterVersion:machineClusterVersion,machineRoles:machineRoles| join(', ', @),createdAt:systemData.createdAt}, &name)" -o table
```

Validate the following states for each BMM (except spare):
- ReadyState: True
- ProvisioningState: Succeeded
- DetailedStatus: Provisioned
- CordonStatus: Uncordoned
- PowerState: On
- KubernetesVersion: <NEW_VERSION>
- MachineClusterVersion: <NEXUS_VERSION>

Add a Tag to the BMM resource to track any BMM that fails to complete provisioning (optional):
```
|Name                | Value          |
|--------------------|-----------------
|BF provision issue  |<DE_ID>         |
```

## How to continue upgrade during `PauseAfterRack` strategy
Once a compute Rack meets the success threshold, the upgrade pauses until the user signals to the operator to continue the upgrade.

Use the following command to continue upgrade once a Compute Rack is paused after meeting the deployment threshold for the Rack:
```
az networkcloud cluster continue-update-version -g $CLUSTER_RG -n $CLUSTER_NAME$ --subscription $SUBSCRIPTION_ID
```
## How to troubleshoot Cluster and BMM upgrade failures
The following troubleshooting documents can help recover BMM upgrade issues:
- [Hardware validation failures](troubleshoot-hardware-validation-failure.md)
- [BMM Provisioning issues](troubleshoot-bare-metal-machine-provisioning.md)
- [BMM Degraded Status](troubleshoot-bare-metal-machine-degraded.md)
- [BMM Warning Status](troubleshoot-bare-metal-machine-warning.md)

If troubleshooting doesn't resolve the issue, open a Microsoft support ticket:
- Collect any errors in the Azure CLI output.
- Collect Cluster and BMM operation state from Azure portal or Azure CLI.
- Create Azure Support Request for any Cluster or BMM upgrade failures and attach any errors along with ASYNC URL, correlation ID, and operation state of the Cluster and BMMs.

## Post-upgrade validation
Run the following commands to check the status of the CM, Cluster, and BMM:

1. Check that the CM is in `Succeeded` for `Provisioning state`:
   ```
   az networkcloud clustermanager show -g $CM_RG --resource-name $CM_NAME --subscription $SUBSCRIPTION_ID -o table
   ```

2. Check the Cluster status `Detailed status` is `Running`:
   ```  
   az networkcloud cluster show -g $CLUSTER_RG --resource-name $CLUSTER_NAME --subscription $SUBSCRIPTION_ID -o table
   ```

3. Check the Bare Metal Machine status:
   ```
   az networkcloud baremetalmachine list -g $CLUSTER_MRG --subscription $SUBSCRIPTION_ID --query "sort_by([].{name:name,kubernetesNodeName:kubernetesNodeName,location:location,readyState:readyState,provisioningState:provisioningState,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage,cordonStatus:cordonStatus,powerState:powerState,kubernetesVersion:kubernetesVersion,machineClusterVersion:machineClusterVersion,machineRoles:machineRoles| join(', ', @),createdAt:systemData.createdAt}, &name)" -o table
   ```

   Validate the following resource states for each BMM (except spare)
   - ReadyState: True
   - ProvisioningState: Succeeded
   - DetailedStatus: Provisioned
   - CordonStatus: Uncordoned
   - PowerState: On

   >[!Note]
   > One control-plane BMM is labeled as a spare and is inactive.

4. Collect a profile of the tenant workloads:
   ```
   az networkcloud clustermanager show -g $CM_RG --resource-name $CM_NAME --subscription $SUBSCRIPTION_ID -o table
   az networkcloud virtualmachine list --sub $SUBSCRIPTION_ID --query "reverse(sort_by([?clusterId=='$CLUSTER_RID'].{name:name, createdAt:systemData.createdAt, resourceGroup:resourceGroup, powerState:powerState, provisioningState:provisioningState, detailedStatus:detailedStatus,bareMetalMachineId:bareMetalMachineIdi,CPUCount:cpuCores, EmulatorStatus:isolateEmulatorThread}, &createdAt))" -o table
   az networkcloud kubernetescluster list --sub $SUBSCRIPTION_ID --query "[?clusterId=='$CLUSTER_RID'].{name:name, resourceGroup:resourceGroup, provisioningState:provisioningState, detailedStatus:detailedStatus, detailedStatusMessage:detailedStatusMessage, createdAt:systemData.createdAt, kubernetesVersion:kubernetesVersion}" -o table
   ```

## Send notification to Operations of Cluster upgrade completion

The following template can be used through email or ticketing system:
```
Title: <ENVIRONMENT> <AZURE_REGION> <CLUSTER_NAME> Runtime <CLUSTER_VERSION> Upgrade Complete

Operations:
Deployment Team notification for <ENVIRONMENT> <AZURE_REGION> <CLUSTER_NAME> runtime <CLUSTER_VERSION> Upgrade Complete

Subscription: <CUSTOMER_SUB_ID>
NFC: <NFC_NAME>
CM: <CM_NAME>
Fabric: <NF_NAME>
Cluster: <CLUSTER_NAME>
Region: <AZURE_REGION>
Version: <NEXUS_VERSION>

The following is a list of BMM with provisioning issues during upgrade:
<BMM_ISSUE_LIST>
 
CC: stakeholder_list
```

## Remove resource tag on Cluster resource in Azure portal
Remove the resource tag on the Cluster resource tracking the upgrade in Azure portal (if added previously):
```
|Name            | Value          |
|----------------|-----------------
|BF in progress  |<DE_ID>         |
```

## Close out any Work Items in your ticketing system
* Update Task hours for upgrade duration.
* Set Cluster upgrade work item to `Complete`.
* Add any notes on support tickets and issues encountered during upgrade

## Links
- [Azure portal](https://aka.ms/nexus-portal)
- [Cluster Upgrade](howto-cluster-runtime-upgrade.md)
- [Cluster Upgrade with PauseAfterRack](howto-cluster-runtime-upgrade-with-pauseafterrack-strategy.md)
- [Azure CLI](https://aka.ms/azcli)
- [Install CLI Extension](howto-install-cli-extensions.md)
