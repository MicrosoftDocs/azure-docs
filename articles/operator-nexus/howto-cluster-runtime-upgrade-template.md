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
<details>
<summary> Overview of Cluster runtime upgrade template </summary>

**Runtime bundle components**: These components require operator consent for upgrades that may affect traffic behavior or necessitate server reboots. Nexus Cluster's design allows for updates to be applied while maintaining continuous workload operation.

Runtime changes are categorized as follows:
- **Firmware/BIOS/BMC updates**: Necessary to support new server control features and resolve security issues.
- **Operating system updates**: Necessary to support new Operating system features and resolve security issues.
- **Platform updates**: Necessary to support new platform features and resolve security issues.

</details>

## Prerequisites
<details>
<summary> Prerequisites for using this template to upgrade a Cluster </summary>

- Latest version of [Azure CLI](https://aka.ms/azcli).
- Latest `managednetworkfabric` [CLI extension](howto-install-cli-extensions.md).
- Latest `networkcloud` [CLI extension](howto-install-cli-extensions.md).
- Subscription access to run the Azure Operator Nexus Network Fabric (NF) and Network Cloud (NC) CLI extension commands.
- Target Cluster must be healthy in a running state.

</details>

## Required Parameters
<details>
<summary> Parameters used in this document </summary>

- \<ENVIRONMENT\>: - Instance Name
- <AZURE_REGION>: - Azure Region of Instance
- <CUSTOMER_SUB_NAME>: Subscription Name
- <CUSTOMER_SUB_ID>: Subscription ID
- \<NEXUS_VERSION\>: Nexus release version (for example, 2504.1)
- <NNF_VERSION>: Operator Nexus Fabric release version (for example, 8.1) 
- <NF_VERSION>: NF runtime version for upgrade (for example, 5.0.0)
- <NFC_NAME>: Associated Network Fabric Controller (NFC)
- <CM_NAME>: Associated Cluster Manager (CM)
- <CLUSTER_NAME>: Cluster Name
- <CLUSTER_RG>: Cluster Resource Group
- <CLUSTER_RID>: Cluster ARM ID
- <CLUSTER_MRG>: Cluster Managed Resource Group
- <CLUSTER_CONTROL_BMM>: Cluster Control plane baremetalmachine
- <CLUSTER_VERSION>: Runtime version for upgrade
- <DEPLOYMENT_THRESHOLD>: Compute deployment threshold
- <DEPLOYMENT_PAUSE_MINS>: Time to wait before moving to the next Rack once the current Rack meets the deployment threshold
- <MISE_CID>: Microsoft.Identity.ServiceEssentials (MISE) Correlation ID in debug output for Device updates
- <CORRELATION_ID>: Operation Correlation ID in debug output for Device updates
- <ASYNC_URL>: Asynchronous (ASYNC) URL in debug output for Device updates

</details>

## Deployment Data
<details>
<summary> Deployment data details </summary>

```
- Nexus: <NEXUS_VERSION>
- NC: <NC_VERSION>
- NF: <NF_VERSION>
- Subscription Name: <CUSTOMER_SUB_NAME>
- Subscription ID: <CUSTOMER_SUB_ID>
- Tenant ID: <CUSTOMER_SUB_TENANT_ID>
```

</details>

## Debug information for Azure CLI commands
<details>
<summary> How to collect debug information for Azure CLI commands </summary>

Azure CLI deployment commands issued with `--debug` contain the following information in the command output:
```
cli.azure.cli.core.sdk.policies:     'mise-correlation-id': '<MISE_CID>'
cli.azure.cli.core.sdk.policies:     'x-ms-correlation-request-id': '<CORRELATION_ID>'
cli.azure.cli.core.sdk.policies:     'Azure-AsyncOperation': '<ASYNC_URL>'
```

To view status of long running asynchronous operations, run the following command with `az rest`:
```
az rest -m get -u '<ASYNC_URL>'
```

Command status information is returned along with detailed informational or error messages:
- `"status": "Accepted"`
- `"status": "Succeeded"`
- `"status": "Failed"`

If any failures occur, report the <MISE_CID>, <CORRELATION_ID>, status code, and detailed messages when opening a support request.

</details>

## Prechecks
<details>
<summary> Prechecks before starting Cluster upgrade </summary>

1. Validate the provisioning and detailed status for the CM and Cluster.
   
   Log in to Azure CLI and select or set the `<CUSTOMER_SUB_ID>`:
   ```  
   az login
   az account set --subscription <CUSTOMER_SUB_ID>
   ```

   Check that the CM is in `Succeeded` for `Provisioning state`:
   ```
   az networkcloud clustermanager show -g <CM_RG> --resource-name <CM_NAME> --subscription <CUSTOMER_SUB_ID> -o table
   ```

   Check the Cluster status `Detailed status` is `Running`:
   ```  
   az networkcloud cluster show -g <CLUSTER_RG> --resource-name <CLUSTER_NAME> --subscription <CUSTOMER_SUB_ID> -o table
   ```

   >[!Note]
   > If CM `Provisioning state` isn't `Succeeded` and Cluster `Detailed status` isn't `Running` stop the upgrade until issues are resolved.

2. Check the Bare Metal Machine (BMM) status `Detailed status` is `Running`:
   ```
   az networkcloud baremetalmachine list -g <CLUSTER_MRG> --subscription <CUSTOMER_SUB_ID> --query "sort_by([].{name:name,kubernetesNodeName:kubernetesNodeName,location:location,readyState:readyState,provisioningState:provisioningState,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage,cordonStatus:cordonStatus,powerState:powerState,kubernetesVersion:kubernetesVersion,machineClusterVersion:machineClusterVersion,machineRoles:machineRoles| join(', ', @),createdAt:systemData.createdAt}, &name)" -o table
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
   az networkcloud virtualmachine list --sub <CUSTOMER_SUB_ID> --query "reverse(sort_by([?clusterId=='<CLUSTER_RID>'].{name:name, createdAt:systemData.createdAt, resourceGroup:resourceGroup, powerState:powerState, provisioningState:provisioningState, detailedStatus:detailedStatus,bareMetalMachineId:bareMetalMachineIdi,CPUCount:cpuCores, EmulatorStatus:isolateEmulatorThread}, &createdAt))" -o table
   az networkcloud kubernetescluster list --sub <CUSTOMER_SUB_ID> --query "[?clusterId=='<CLUSTER_RID>'].{name:name, resourceGroup:resourceGroup, provisioningState:provisioningState, detailedStatus:detailedStatus, detailedStatusMessage:detailedStatusMessage, createdAt:systemData.createdAt, kubernetesVersion:kubernetesVersion}" -o table
   ```

4. Review Operator Nexus Release notes for required checks and configuration updates not included in this document.

</details>

## Upgrade Procedure
<details>
<summary> Custer runtime uUpgrade procedure details </summary>

### Cluster upgrade settings defaults
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
az networkcloud cluster update -n <CLUSTER_NAME> -g <CLUSTER_RG> --update-strategy strategy-type="Rack" threshold-type="PercentSuccess" threshold-value=<DEPLOYMENT_THRESHOLD> wait-time-minutes=<DEPLOYMENT_PAUSE_MINS> --subscription <CUSTOMER_SUB_ID>
```
>[!Important]
> If 100% threshold is required, review the BMM status reported during pre-checks and make sure all BMM are healthy before proceeding with the upgrade.

Verify update:
```
az networkcloud cluster show -n <CLUSTER_NAME> -g <CLUSTER_RG> --subscription <CUSTOMER_SUB_ID>| grep -A5 updateStrategy
"updateStrategy": {
   "maxUnavailable": 32767,
   "strategyType": "Rack",
   "thresholdType": "PercentSuccess",
   "thresholdValue": <DEPLOYMENT_THRESHOLD>,
   "waitTimeMinutes": <DEPLOYMENT_PAUSE_MINS>
}
```

### How to run Cluster upgrade with `PauseAfterRack` Strategy
`PauseAferRack` strategy allows the customer to control the upgrade by requiring an API call to continue to the next Rack after each Compute Rack completes to the configured threshold.

To configure strategy to use `PauseAfterRack`:
```
az networkcloud cluster update -n <CLUSTER_NAME> -g <CLUSTER_RG> --update-strategy strategy-type="PauseAfterRack" wait-time-minutes=0 threshold-type="PercentSuccess" threshold-value=<DEPLOYMENT_THRESHOLD> --subscription <CUSTOMER_SUB_ID>
```

Verify update:
```
az networkcloud cluster show -g <CLUSTER_RG> -n <CLUSTER_NAME> --subscription <CUSTOMER_SUB_ID>| grep -A5 updateStrategy
  "updateStrategy": {
    "maxUnavailable": 32767,
    "strategyType": "PauseAfterRack",
    "thresholdType": "PercentSuccess",
    "thresholdValue": <DEPLOYMENT_THRESHOLD>,
    "waitTimeMinutes": 0
```

### Run upgrade from either portal or cli
* To start upgrade from Azure portal, go to Cluster resource, click `Update`, select <CLUSTER_VERSION>, then click `Update`
* To run upgrade from Azure CLI, run the following command:
  ```
  az networkcloud cluster update-version --subscription <CUSTOMER_SUB_ID> --cluster-name <CLUSTER_NAME> --target-cluster-version <CLUSTER_VERSION> --resource-group <CLUSTER_RG> --no-wait --debug
  ```

  Gather ASYNC URL and Correlation ID info for further troubleshooting if needed.
  ```
  cli.azure.cli.core.sdk.policies:     'mise-correlation-id': '<MISE_CID>'
  cli.azure.cli.core.sdk.policies:     'x-ms-correlation-request-id': '<CORRELATION_ID>'
  cli.azure.cli.core.sdk.policies:     'Azure-AsyncOperation': '<ASYNC_URL>'
  ```
  Provide this information to Microsoft Support when opening a support ticket for upgrade issues.

### How to continue upgrade during `PauseAfterRack` strategy
Once a compute Rack meets the success threshold, the upgrade pauses until the user signals to the operator to continue the upgrade.

Use the following command to continue upgrade once a Compute Rack is paused after meeting the deployment threshold for the Rack:
```
az networkcloud cluster continue-update-version -g <CLUSTER_RG> -n <CLUSTER_NAME> --subscription <CUSTOMER_SUB_ID>
```

### Monitor status of Cluster
```
az networkcloud cluster list -g <CLUSTER_RG> --subscription <CUSTOMER_SUB_ID> -o table
```
The Cluster `Detailed status` shows `Running` and the `Detailed status message` shows 'Cluster is up and running.` when the upgrade is complete.

### Monitor status of Bare Metal Machines
```
az networkcloud baremetalmachine list -g <CLUSTER_MRG> --subscription <CUSTOMER_SUB_ID> -o table
az networkcloud baremetalmachine list -g <CLUSTER_MRG> --subscription <CUSTOMER_SUB_ID> --query "sort_by([].{name:name,kubernetesNodeName:kubernetesNodeName,location:location,readyState:readyState,provisioningState:provisioningState,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage,cordonStatus:cordonStatus,powerState:powerState,kubernetesVersion:kubernetesVersion,machineClusterVersion:machineClusterVersion,machineRoles:machineRoles| join(', ', @),createdAt:systemData.createdAt}, &name)" -o table
```

Validate the following states for each BMM (except spare):
- ReadyState: True
- ProvisioningState: Succeeded
- DetailedStatus: Provisioned
- CordonStatus: Uncordoned
- PowerState: On
- KubernetesVersion: <NEW_VERSION>
- MachineClusterVersion: <NEXUS_VERSION>

### How to troubleshoot Cluster and BMM upgrade failures
The following troubleshooting documents can help recover BMM upgrade issues:
- [Hardware validation failures](troubleshoot-hardware-validation-failure.md)
- [BMM Provisioning issues](troubleshoot-bare-metal-machine-provisioning.md)
- [BMM Degraded Status](troubleshoot-bare-metal-machine-degraded.md)
- [BMM Warning Status](troubleshoot-bare-metal-machine-warning.md)

If troubleshooting doesn't resolve the issue, open a Microsoft support ticket:
- Collect any errors in the Azure CLI output.
- Collect Cluster and BMM operation state from Azure portal or Azure CLI.
- Create Azure Support Request for any Cluster or BMM upgrade failures and attach any errors along with ASYNC URL, correlation ID, and operation state of the Cluster and BMMs.

</details>

## Post-upgrade tasks
<details>
 <summary> Detailed steps for post-upgrade tasks </summary>

### Review Operator Nexus release notes
Review the Operator Nexus release notes for any version specific actions required post-upgrade.

### Validate Nexus Instance

Validate the health and status of all the Nexus Instance resources with the [Nexus Instance Readiness Test (IRT)](howto-run-instance-readiness-testing.md).

If not using IRT, perform resource validation of all Nexus Instance components with Azure CLI:
```
# Check `ProvisioningState = Succeeded` in all resources

# NFC
az networkfabric controller list -g <NFC_RG> --subscription <CUSTOMER_SUB_ID> -o table
az customlocation list -g <NFC_MRG> --subscription <CUSTOMER_SUB_ID> -o table

# Fabric
az networkfabric fabric list -g <NF_RG> --subscription <CUSTOMER_SUB_ID> -o table
az networkfabric rack list -g <NF_RG> --subscription <CUSTOMER_SUB_ID> -o table
az networkfabric fabric device list -g <NF_RG> --subscription <CUSTOMER_SUB_ID> -o table
az networkfabric nni list -g <NF_RG> --fabric <NF_NAME> --subscription <CUSTOMER_SUB_ID> -o table
az networkfabric acl list -g <NF_RG> --fabric <NF_NAME> --subscription <CUSTOMER_SUB_ID> -o table
az networkfabric l2domain list -g <NF_RG> --fabric <NF_NAME> --subscription <CUSTOMER_SUB_ID> -o table

# CM
az networkcloud clustermanager list -g <CM_RG> --subscription <CUSTOMER_SUB_ID> -o table

# Cluster
az networkcloud cluster list -g <CLUSTER_RG> --subscription <CUSTOMER_SUB_ID> -o table
az networkcloud baremetalmachine list -g <CLUSTER_MRG> --subscription <CUSTOMER_SUB_ID> --query "sort_by([]. {name:name,kubernetesNodeName:kubernetesNodeName,location:location,readyState:readyState,provisioningState:provisioningState,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage,cordonStatus:cordonStatus,powerState:powerState,machineRoles:machineRoles| join(', ', @),createdAt:systemData.createdAt}, &name)" -o table
az networkcloud storageappliance list -g <CLUSTER_MRG> --subscription <CUSTOMER_SUB_ID> -o table

# Tenant Workloads
az networkcloud virtualmachine list --sub <CUSTOMER_SUB_ID> --query "reverse(sort_by([?clusterId=='<CLUSTER_RID>'].{name:name, createdAt:systemData.createdAt, resourceGroup:resourceGroup, powerState:powerState, provisioningState:provisioningState, detailedStatus:detailedStatus,bareMetalMachineId:bareMetalMachineIdi,CPUCount:cpuCores, EmulatorStatus:isolateEmulatorThread}, &createdAt))" -o table
az networkcloud kubernetescluster list --sub <CUSTOMER_SUB_ID> --query "[?clusterId=='<CLUSTER_RID>'].{name:name, resourceGroup:resourceGroup, provisioningState:provisioningState, detailedStatus:detailedStatus, detailedStatusMessage:detailedStatusMessage, createdAt:systemData.createdAt, kubernetesVersion:kubernetesVersion}" -o table
```

> [!Note]
> IRT validation provides a complete functional test of networking and workloads across all components of the Nexus Instance. Simple validation does not provide functional testing.

</details>

## Links
<details>
<summary> Reference Links for Cluster upgrade </summary>

Reference links for Cluster upgrade:
- Access the [Azure portal](https://aka.ms/nexus-portal)
- [Install Azure CLI](https://aka.ms/azcli)
- [Install CLI Extension](howto-install-cli-extensions.md)
- [Cluster Upgrade](howto-cluster-runtime-upgrade.md)
- [Cluster Upgrade with PauseAfterRack](howto-cluster-runtime-upgrade-with-pauseafterrack-strategy.md)
- [Troubleshoot hardware validation failure](troubleshoot-hardware-validation-failure.md)
- [Troubleshoot BMM provisioning](troubleshoot-bare-metal-machine-provisioning.md)
- [Troubleshoot BMM provisioning](troubleshoot-bare-metal-machine-provisioning.md)
- [Troubleshoot BMM degraded](troubleshoot-bare-metal-machine-degraded.md)
- [Troubleshoot BMM warning](troubleshoot-bare-metal-machine-warning.md)
- Reference the [Nexus Instance Readiness Test (IRT)](howto-run-instance-readiness-testing.md)

</details>
