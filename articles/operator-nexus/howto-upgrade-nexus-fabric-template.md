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

**Runtime bundle components**: These components require operator consent for upgrades that may affect traffic behavior or necessitate device reboots. The network fabric's design allows for updates to be applied while maintaining continuous data traffic flow.

Runtime changes are categorized as follows:
- **Operating system updates**: Necessary to support new features or resolve issues.
- **Base configuration updates**: Initial settings applied during device bootstrapping.
- **Configuration structure updates**: Generated based on user input for conf

## Prerequisites

1. Install the latest version of [Azure CLI](https://aka.ms/azcli).
2. The latest `managednetworkfabric` CLI extension is required. It can be installed following the steps listed in [Install CLI Extension](howto-install-cli-extensions.md).
3. Subscription access to run the Azure Operator Nexus Network Fabric (NF) and network cloud (NC) CLI extension commands.
4. Target Fabric must be healthy in a running state, with all Devices healthy.

## Required Parameters:
- <START_DATE>: Planned start date/time of upgrade
- \<ENVIRONMENT\>: Instance name
- <AZURE_REGION>: - Azure region of instance
- <CUSTOMER_SUB_NAME>: Subscription name
- <CUSTOMER_SUB_ID>: Subscription ID
- <NEXUS_VERSION>: Operator Nexus release version (for example, 2504.1)
- <NNF_VERSION>: Operator Nexus Fabric release version (for example, 8.1) 
- <NF_VERSION>: NF runtime version for upgrade (for example, 5.0.0)
- <NF_DEVICE_NAME>: Network Fabric Device Name
- <NF_DEVICE_RID>: Network Fabric Device Resource ID
- <NF_NAME>: Network Fabric Name
- <NF_RG>: Network Fabric Resource Group
- <NF_RID>: Network Fabric ARM ID
- <NFC_NAME>: Associated Network Fabric Controller (NFC)
- <NFC_RG>: NFC Resource Group
- <NFC_RID>: NFC ARM ID
- <NFC_MRG>: NFC Managed Resource Group
- \<DURATION\>: Estimated Duration of upgrade
- <DE_ID>: Deployment Engineer performing upgrade
- <CLUSTER_NAME>: Associated Cluster name
- <MISE_CID>: Microsoft.Identity.ServiceEssentials (MISE) Correlation ID in debug output for Device updates
- <CORRELATION_ID>: Operation Correlation ID in debug output for Device updates
- <ASYNC_URL>: Asynchronous (ASYNC) URL in debug output for Device updates


## Links
- [Azure portal](https://aka.ms/nexus-portal)
- [Network Fabric Upgrade](howto-upgrade-nexus-fabric.md)
- [Azure CLI](https://aka.ms/azcli)
- [Install CLI Extension](howto-install-cli-extensions.md)

## Pre-Checks

1. The following role permissions should be assigned to end users responsible for Fabric create, upgrade, and delete operations.
  
   These permissions can be granted temporarily, limited to the duration required to perform the upgrade. 
   * Microsoft.NexusIdentity/identitySets/read
   * Microsoft.NexusIdentity/identitySets/write
   * Microsoft.NexusIdentity/identitySets/delete
   * Ensure that `Role Based Access Control Administrator` is successfully activated.
   * Check in Azure portal from the following path: `Network Fabrics` -> <NF_NAME> -> `Access control (IAM)` -> `View my access`.
   * In current 'Role assignments', you should see the following two roles:
     - Nexus Contributor
     - Role Based Access Control Administrator

2. Validate the provisioning status for the Network Fabric Controller (NFC), Fabric, and Fabric Devices.
   
   Set up the subscription, NFC, and NF parameters:
   ```  
   export SUBSCRIPTION_ID=<CUSTOMER_SUB_ID>
   export NFC_RG=<NFC_RG>
   export NFC_NAME=<NFC_NAME>
   export NF_RG=<NF_RG>
   export NF_NAME=<NF_NAME>
   ```

   Check that the NFC is in Provisioned state:
   ```
   az networkfabric controller show -g $NFC_RG --resource-name $NFC_NAME --subscription $SUBSCRIPTION_ID -o table
   ```

   Check the NF status:
   ```  
   az networkfabric fabric show -g $NF_RG --resource-name $NF_NAME --subscription $SUBSCRIPTION_ID -o table
   ```
   Record down the `fabricVersion` and `provisioningState`.

   Check the Devices status.
   ```
   az networkfabric device list -g $NF_RG -o table --subscription $SUBSCRIPTION_ID
   ```

   >[!Note]
   > If `provisioningState` is not `Succeeded`, stop the upgrade until issues are resolved.**

3. Check `Microsoft.NexusIdentity` user Resource Provider (RP) is registered on the customer subscription:
   ```
   az provider show --namespace Microsoft.NexusIdentity -o table --subscription $SUBSCRIPTION_ID
   Namespace                RegistrationPolicy    RegistrationState
   -----------------------  --------------------  -------------------
   Microsoft.NexusIdentity  RegistrationRequired  Registered
   ```

   If not registered, run the following to register:
   ```
   az provider register --namespace Microsoft.NexusIdentity --wait --subscription $SUBSCRIPTION_ID

   az provider show --namespace Microsoft.NexusIdentity -o table
   Namespace                RegistrationPolicy    RegistrationState
   -----------------------  --------------------  -------------------
   Microsoft.NexusIdentity  RegistrationRequired  Registered
   ```

4. Minimum available disk space on each device must be more than 3.5 GB for a successful device upgrade.

   Verify the available space on each Fabric Devices using the following Azure CLI command. 
   ```
   az networkfabric device run-ro --resource-name <ND_DEVICE_NAME> --resource-group <NF_RG> --ro-command "dir flash" --subscription <CUSTOMER_SUB_ID> --debug
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

7. Review Operator Nexus Release notes for any additional checks and configuration updates prior to upgrading the Fabric.
   
## Send notification to Operations of upgrade schedule for the Fabric.

The following template can be used through email or support ticket:
```
Title: <ENVIRONMENT> <AZURE_REGION> <NF_NAME> Runtime upgrade to <NF_VERSION> <START_TIME> - Completion ETA <DURATION>

Operations Support:

Deployment Team notification for <ENVIRONMENT> <AZURE_REGION> <NF_NAME> runtime upgrade to <NF_VERSION> <START_TIME> - Completion ETA <DURATION>

Subscription: <CUSTOMER_SUB_ID>
NFC: <NFC_NAME>
CM: <CM_NAME>
Fabric: <NF_NAME>
Cluster: <CLUSTER_NAME>
Region: <AZURE_REGION>
Version: <NEXUS_VERSION>

CC: stakeholder-list
```

## Add resource tag on Fabric resource in Azure portal
To help track upgrades, add a tag to the Fabric resource in Azure portal (optional):
```
|Name            | Value          |
|----------------|-----------------
|BF in progress  |<DE_ID>         |
```

## Upgrade Procedure

### Verify current Fabric runtime version.
[How to check current cluster runtime version.](./howto-check-runtime-version.md#check-current-fabric-runtime-version)

```
az networkfabric fabric list -g $NF_RG --query "[].{name:name,fabricVersion:fabricVersion,configurationState:configurationState,provisioningState:provisioningState}" -o table --subscription $SUBSCRIPTION_ID
az networkfabric fabric show -g $NF_RG --resource-name $NF_NAME --subscription $SUBSCRIPTION_ID
```
   
### Initiate Fabric upgrade.
Start the upgrade with the following command:
```Azure CLI
az networkfabric fabric upgrade -g [resource-group] --resource-name [fabric-name] --action start --version "5.0.0"
{}
```

>[!Note]
> Output showing `{}` indicates successful execution of upgrade command.

The Fabric Resource Provider validates if the version upgrade is allowed from the existing Fabric version to the target version. Only N+1 major release upgrades are allowed (for example, 4.0.0->5.0.0).

On successful completion, the command puts the Fabric status into `Under Maintenance` and prevents any other operation on the Fabric.

### Device-specific workflow:

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

### Device-specific upgrade:
Run the following command to upgrade the version on each Device:
```
az networkfabric device upgrade --version $NF_VERSION -g $NF_RG --resource-name $NF_DEVICE_NAME --subscription $SUBSCRIPTION_ID --debug
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
az networkfabric device list -g $NF_RG --query "[].{name:name,version:version}" -o table --subscription $SUBSCRIPTION_ID
```

### Complete Network Fabric Upgrade
Once all the Devices are upgraded, run the following command to take the Network Fabric out of maintenance state.
```
az networkfabric fabric upgrade --action Complete --version $NF_VERSION -g $NF_RG --resource-name $NF_NAME --debug --subscription $SUBSCRIPTION_ID
```

## Troubleshooting Device update failures.
1. Collect any errors in the Azure CLI output.
2. Collect device operation state from Azure portal or Azure CLI.
3. Create Azure Support Request for any device upgrade failures and attach any errors along with ASYNC URL, correlation ID, and operation state of Fabric and Devices.

## Post-upgrade Validation
Once complete, run the following commands to check the status of the Fabric and Devices:
```
az networkfabric fabric list -g $NF_RG --query "[].{name:name,fabricVersion:fabricVersion,configurationState:configurationState,provisioningState:provisioningState}" -o table --subscription $SUBSCRIPTION_ID
az networkfabric fabric show -g $NF_RG --resource-name $NF_NAME --subscription $SUBSCRIPTION_ID
az networkfabric device list -g $NF_RG --query "[].{name:name,version:version}" -o table --subscription $SUBSCRIPTION_ID
```

## Send notification to Operations of Fabric upgrade completion

The following template can be used through email or ticketing system:
```
Title: <ENVIRONMENT> <AZURE_REGION> <NF_NAME> Runtime <NF_VERSION> Upgrade Complete

Operations:
Deployment Team notification for <ENVIRONMENT> <AZURE_REGION> <NF_NAME> runtime <NF_VERSION> Upgrade Complete

Subscription: <CUSTOMER_SUB_ID>
NFC: <NFC_NAME>
CM: <CM_NAME>
Fabric: <NF_NAME>
Cluster: <CLUSTER_NAME>
Region: <AZURE_REGION>
Version: <NEXUS_VERSION>
 
CC: stakeholder_list
```

## Remove resource tag on Fabric resource in Azure portal
Remove the resource tag on the Fabric resource tracking the upgrade in Azure portal (if added previously):
```
|Name            | Value          |
|----------------|-----------------
|BF in progress  |<DE_ID>         |
```

## Close out any Work Items in your ticketing system
* Update Task hours for upgrade duration.
* Set Fabric upgrade work item to `Complete`.
* Add any notes on support tickets and issues encountered during upgrade
