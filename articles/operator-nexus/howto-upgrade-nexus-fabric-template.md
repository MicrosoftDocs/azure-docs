---
title: "Azure Operator Nexus: Fabric runtime upgrade template"
description: Learn the process for upgrading Fabric for Operator Nexus with step-by-step parameterized template.
author: bartpinto 
ms.author: bpinto
ms.service: azure-operator-nexus
ms.date: 04/23/2025
ms.topic: how-to
ms.custom: azure-operator-nexus, template-include
---

# Fabric runtime upgrade template

This how-to guide provides a step-by-step template for upgrading a Nexus Fabric designed to assist users in managing a reproducible end-to-end upgrade through Azure APIs and standard operating procedures. Regular updates are crucial for maintaining system integrity and accessing the latest product improvements.

## Overview
<details>
<summary> Overview of Fabric runtime upgrade template </summary>

**Runtime bundle components**: These components require operator consent for upgrades that may affect traffic behavior or necessitate device reboots. The network fabric's design allows for updates to be applied while maintaining continuous data traffic flow.

Runtime changes are categorized as follows:
- **Operating system updates**: Necessary to support new features or resolve issues.
- **Base configuration updates**: Initial settings applied during device bootstrapping.
- **Configuration structure updates**: Generated based on user input for conf

</details>

## Prerequisites
<details>
<summary> Prerequisites for using this template to upgrade a Fabric </summary>

- Latest version of [Azure CLI](https://aka.ms/azcli).
- Latest `managednetworkfabric` [CLI extension](howto-install-cli-extensions.md).
- Latest `networkcloud` [CLI extension](howto-install-cli-extensions.md).
- Subscription access to run the Azure Operator Nexus Network Fabric (NF) and Network Cloud (NC) CLI extension commands.
- Target Fabric must be healthy in a running state, with all Devices healthy.

</details>

## Required Parameters
<details>
<summary> Parameters used in this document </summary>

- \<ENVIRONMENT\>: - Instance name
- <AZURE_REGION>: - Azure region of instance
- <CUSTOMER_SUB_NAME>: Subscription name
- <CUSTOMER_SUB_ID>: Subscription ID
- \<NEXUS_VERSION\>: Nexus release version (for example, 2504.1)
- <NNF_VERSION>: Operator Nexus Fabric release version (for example, 8.1) 
- <NF_VERSION>: NF runtime version for upgrade (for example, 5.0.0)
- <NFC_NAME>: Associated Network Fabric Controller (NFC)
- <NFC_RG>: NFC Resource Group
- <NFC_RID>: NFC ARM ID
- <NFC_MRG>: NFC Managed Resource Group
- <NF_NAME>: Network Fabric Name
- <NF_RG>: Network Fabric Resource Group
- <NF_RID>: Network Fabric ARM ID
- <NF_DEVICE_NAME>: Network Fabric Device Name
- <NF_DEVICE_RID>: Network Fabric Device Resource ID
- <CM_NAME>: Associated Cluster Manager (CM)
- <CLUSTER_NAME>: Associated Cluster name
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
<summary> Prechecks before starting Fabric upgrade </summary>

1. The following role permissions should be assigned to end users responsible for Fabric create, upgrade, and delete operations.

   These permissions can be granted temporarily, limited to the duration required to perform the upgrade.
   * Microsoft.NexusIdentity/identitySets/read
   * Microsoft.NexusIdentity/identitySets/write
   * Microsoft.NexusIdentity/identitySets/delete
   * Ensure that `Role Based Access Control Administrator` is successfully activated.
   * Check in Azure portal from the following path:
     `Network Fabrics` -> `NF_NAME` -> `Access control (IAM)` -> `View my access`.
   * In current 'Role assignments', you should see the following two roles:
     - Nexus Contributor
     - Role Based Access Control Administrator

2. Validate the provisioning status for the Network Fabric Controller (NFC), Fabric, and Fabric Devices.

   Log in to Azure CLI and select or set the `<CUSTOMER_SUB_ID>`:
   ```
   az login
   az account set --subscription <CUSTOMER_SUB_ID>
   ```

   Check that the NFC is in Provisioned state:
   ```
   az networkfabric controller show -g <NFC_RG> --resource-name <NFC_NAME> --subscription <CUSTOMER_SUB_ID> -o table
   ```

   Check the NF status:
   ```
   az networkfabric fabric show -g <NF_RG> --resource-name <NF_NAME> --subscription <CUSTOMER_SUB_ID> -o table
   ```
   Record down the `fabricVersion` and `provisioningState`.

   Check the Devices status.
   ```
   az networkfabric device list -g <NF_RG> -o table --subscription <CUSTOMER_SUB_ID>
   ```

   >[!Note]
   > If `provisioningState` is not `Succeeded`, stop the upgrade until issues are resolved.

3. Check `Microsoft.NexusIdentity` user Resource Provider (RP) is registered on the customer subscription:
   ```
   az provider show --namespace Microsoft.NexusIdentity -o table --subscription <CUSTOMER_SUB_ID>
   Namespace                RegistrationPolicy    RegistrationState
   -----------------------  --------------------  -------------------
   Microsoft.NexusIdentity  RegistrationRequired  Registered
   ```

   If not registered, run the following to register:
   ```
   az provider register --namespace Microsoft.NexusIdentity --wait --subscription <CUSTOMER_SUB_ID>

   az provider show --namespace Microsoft.NexusIdentity -o table
   Namespace                RegistrationPolicy    RegistrationState
   -----------------------  --------------------  -------------------
   Microsoft.NexusIdentity  RegistrationRequired  Registered
   ```

4. Minimum available disk space on each device must be more than 3.5 GB for a successful device upgrade.

   Verify the available space on each Fabric Devices using the following Azure CLI command. 
   ```
   az networkfabric device run-ro --resource-name <NF_DEVICE_NAME> --resource-group <NF_RG> --ro-command "dir flash" --subscription <CUSTOMER_SUB_ID> --debug
   ```

   Contact Microsoft support if there isn't enough space to perform the upgrade. Archived Extensible Operating System (EOS) images and support bundle files can be removed at the direction of support.

5. Check the Fabric's Network Packet Broker (NPB) for any orphaned `Network Taps` in Azure portal.
   * Select `Network Fabrics` under `Azure Services` and then select the <NF_NAME>.
   * Click on the `Resource group` for the Fabric.
   * In the Resources list, filter on `Network Packet Broker`.
   * Click on the `Network Packet Broker` name in the list.
   * Click on `Network Taps` tab on the `Overview` screen.
   * All `Network Taps` should be `Succeeded` for `Configuration State` and `Provisioning State`.
   * Look for any Taps with a red `X`, and a status of `Not Found`, `Failed`, or `Error`.

   >[!Note]
   > If any Taps show `Not Found`, `Failed`, or `Error` status, stop the upgrade until issues are cleared. Provide this information to Microsoft Support when opening a support ticket for Tap issues.

6. Run and validate the Fabric cable validation report.
   Follow [Validate Cables for Nexus Network Fabric](how-to-validate-cables.md) to set up and run the report

   >[!Note]
   > Resolve any connection and cable issues before continuing the upgrade.

7. Review Operator Nexus Release notes for required checks and configuration updates not included in this document.

</details>

## Upgrade Procedure
<details>
<summary> Fabric runtime upgrade procedure details </summary>

### Verify current Fabric runtime version
[How to check current cluster runtime version.](./howto-check-runtime-version.md#check-current-fabric-runtime-version)

```
az networkfabric fabric list -g <NF_RG> --query "[].{name:name,fabricVersion:fabricVersion,configurationState:configurationState,provisioningState:provisioningState}" -o table --subscription <CUSTOMER_SUB_ID>
az networkfabric fabric show -g <NF_RG> --resource-name <NF_NAME> --subscription <CUSTOMER_SUB_ID>
```

### Initiate Fabric upgrade
Start the upgrade with the following command:
```Azure CLI
az networkfabric fabric upgrade -g <NF_RG> --resource-name <NF_NAME> --subscription <CUSTOMER_SUB_ID> --action start --version "5.0.0"
{}
```

>[!Note]
> Output showing `{}` indicates successful execution of upgrade command.

The Fabric Resource Provider validates if the version upgrade is allowed from the existing Fabric version to the target version. Only N+1 major release upgrades are allowed (for example, 4.0.0->5.0.0).

On successful completion, the command puts the Fabric status into `Under Maintenance` and prevents any other operation on the Fabric.

### Follow device-specific workflow

Nexus Network Fabric Racks are composed of the following Devices types:
- Customer Edge (CE) Switches
- Management (MGMT) Switches
- Top Of Rack (TOR) Switches
- Network Packet Brokers (NPB)

Eight Rack environments have 30 Devices:
- Aggregate Rack - two CE, two NPB, two MGMT Switches  (six Devices)
- Eight Compute Racks - Each Compute Rack has two TOR's and one MGMT Switch  (24 Devices)

Four Rack environments have 17 Devices:
- Aggregate Rack - two CE's, one NPB, two MGMT Switches  (five Devices)
- Four Compute Racks - Each Compute Rack has two TOR's and one MGMT Switch  (12 Devices)

>[!Important]
>The Devices must be upgraded in the following specific order to maintain networking service during the upgrade.

1. Compute Rack odd numbered TOR upgrade together in parallel.
2. Compute Rack even numbered TOR upgrade together in parallel.
3. Compute Rack MGMT switches upgrade together in parallel.
4. Aggregate Rack CEs upgrade one after the other in serial.
   >[!Important]
   > After each CE upgrade, wait for a duration of five minutes to ensure that the recovery process is complete before proceeding to the next CE
5. Aggregate Rack NPBs upgrade one after the other in serial.
6. Aggregate Rack MGMT switches upgrade one after the other in serial.

>[!NOTE]
> Wait for successful upgrade on all Devices in a group before moving to the next group.

### Follow device-specific upgrade
Run the following command to upgrade the version on each Device:
```
az networkfabric device upgrade --version <NF_VERSION> -g <NF_RG> --resource-name <NF_DEVICE_NAME> --subscription <CUSTOMER_SUB_ID> --debug
```

As part of the upgrade, the Devices are put into maintenance mode. The Device drains all traffic and stops advertising routes so that the traffic flow to the device stops. At completion, the Nexus Network Fabric (NNF) service updates the Device resource version property to the new version.

Gather ASYNC URL and Correlation ID info for further troubleshooting if needed.
```
cli.azure.cli.core.sdk.policies:     'mise-correlation-id': '<MISE_CID>'
cli.azure.cli.core.sdk.policies:     'x-ms-correlation-request-id': '<CORRELATION_ID>'
cli.azure.cli.core.sdk.policies:     'Azure-AsyncOperation': '<ASYNC_URL>'
```
Provide this information to Microsoft Support when opening a support ticket for upgrade issues.

After Device upgrades are complete, make sure that all the Devices are showing with <NF_VERSION> by running the following command:
```
az networkfabric device list -g <NF_RG> --query "[].{name:name,version:version}" -o table --subscription <CUSTOMER_SUB_ID>
```

### Complete Network Fabric Upgrade
Once all the Devices are upgraded, run the following command to take the Network Fabric out of maintenance state.
```
az networkfabric fabric upgrade --action Complete --version <NF_VERSION> -g <NF_RG> --resource-name <NF_NAME> --debug --subscription <CUSTOMER_SUB_ID>
```

### How to troubleshoot Device update failures
1. Collect any errors in the Azure CLI output.
2. Collect device operation state from Azure portal or Azure CLI.
3. Create Azure Support Request for any device upgrade failures and attach any errors along with ASYNC URL, correlation ID, and operation state of Fabric and Devices.

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
<summary> Reference Links for Fabric upgrade </summary>

Reference links for Fabric upgrade:
- Access the [Azure portal](https://aka.ms/nexus-portal)
- [Install Azure CLI](https://aka.ms/azcli)
- [Install CLI Extension](howto-install-cli-extensions.md)
- Reference the [Network Fabric Upgrade](howto-upgrade-nexus-fabric.md)
- Reference the [Nexus Instance Readiness Test (IRT)](howto-run-instance-readiness-testing.md)

</details>
