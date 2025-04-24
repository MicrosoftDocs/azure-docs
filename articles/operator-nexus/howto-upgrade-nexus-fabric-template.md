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

This how-to guide provides a step-by-step template for upgrading a Nexus Fabric. It is designed to assist users in managing a reproducable end-to-end upgrade through Azure APIs. Regular updates are crucial for maintaining system integrity and accessing the latest product improvements.

## Overview

**Runtime bundle components**: These components require operator consent for upgrades that may affect traffic behavior or necessitate device reboots. The network fabric's design allows for updates to be applied while maintaining continuous data traffic flow.

Runtime changes are categorized as follows:
- **Operating system updates**: Necessary to support new features or resolve issues.
- **Base configuration updates**: Initial settings applied during device bootstrapping.
- **Configuration structure updates**: Generated based on user input for conf

## Prerequisites

1. Install the latest version of the [appropriate CLI extensions](howto-install-cli-extensions.md).
1. The latest `networkfabric` CLI extension is required. It can be installed following the steps listed [here](./howto-install-cli-extensions.md).
1. Subscription access to run the Azure Operator Nexus network fabric (NF) and network cloud (NC) CLI extension commands.
1. Target Fabric must be healthy in a running state, with all Devices healthy.

## Required Parameters:
- <START_DATE>: Planned start date/time of upgrade
- \<ENVIRONMENT\>: Instance name
- <AZURE_REGION>: - Azure region of instance
- <CUSTOMER_SUB_NAME>: Subscription name
- <CUSTOMER_SUB_ID>: Subscription ID
- <NEXUS_VERSION>: Operator Nexus release version (e.g. 2504.1)
- <NNF_VERSION>: Operator Nexus Fabric release version (e.g. 8.1) 
- <NF_VERSION>: NF runtime version for upgrade (e.g. 5.0.0)
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
- <CLUSTER_NAME> Associated Cluster name

## Links
- [Azure Portal](https://aka.ms/nexus-portal)
- [Operator Nexus Releases and Notes](./release-notes-2402.2)
- [Network Fabric Upgrade](./howto-upgrade-nexus-fabric)

## Pre-Checks before executing the Fabric upgrade

1. The following role permissions should be assigned to end users responsible for Fabric create, upgrade, and delete operations. These permissions can be granted temporarily, limited to the duration required to perform these operations. 
   * Microsoft.NexusIdentity/identitySets/read
   * Microsoft.NexusIdentity/identitySets/write
   * Microsoft.NexusIdentity/identitySets/delete
   * Ensure that Role Based Access Control Administrator is sucessfully activated.
   * To Check: AZ Portal-> Network Fabric-> Access control (IAM) -> View my access.  In current role assignments, you should see the following two roles:
     - Nexus Contributor
     - Role Based Access Control Administrator

2. Validate Network Fabric Contoller, Fabric and Devices provisioning status.
   
   Setup the subscription, NFC and NF parameters:
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

4. Check Microsoft.NexusIdentity user RP is registered on the customer subscription:
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

5. Minimum available disk space on each device (CE, TOR, NPB, Mgmt Switch) must be more than 3.5 GB for a successful device upgrade.

   Verify the available space on each Fabric Devices using the following Azure CLI command. 
   ```
   az networkfabric device run-ro --resource-name <ND_DEVICE_NAME> --resource-group <NF_RG> --ro-command "dir flash" --subscription <CUSTOMER_SUB_ID> --debug
   ```

   Contact Microsoft support if there isn't enough space to perform the upgrade.  Archived EOS images and support bundle files can be removed at the direction of support.
   
6. Check Network Packet Broker for any orphaned Network Taps.
   
   Perform the following in the AZ Portal:
   * Select Network Fabrics -> <NF_NAME>.
   * Click on the Resource group.
   * In the Resources list, filter on `Network Packet Broker`.
   * Click on the Network Packet Broker name.
   * Click on "Network Taps".
   * All Network taps should be `Succeeded` for `Configuration State` and `Provisioning State` and `Enabled` for `Administrative State`.
   * Look for any Taps with a red `X` and a status of `Not Found`, `Failed` or `Error`.

   If any Taps show `Not Found`, `Failed` or `Error` status, stop the upgrade until issues are cleared.
   
7. Run and validate the Fabric cable validation report.
   Follow [Validate Cables for Nexus Network Fabric](./how-to-validate-cables) to setup and run the report

   >[!Note]
   > Resolve any connection and cable issues before continuing the upgrade.
   
## Send notification to Operations of upgrade schedule for the Fabric. 

   The following template can be used through email or support ticket:
   ```
   Title: <ENVIRONMENT> <AZURE_REGION> <NF_NAME> Runtime upgrade to <NF_VERSION> <START_TIME> - Completion ETA <DURATION>

   Operations Support:

   Nexus DE Team <ENVIRONMENT> <AZURE_REGION> <NF_NAME> Runtime upgrade to <NF_VERSION> <START_TIME> - Completion ETA <DURATION>

   Subscription: <CUSTOMER_SUB_ID>
   NFC: <NFC_NAME>
   CM: <CM_NAME>
   Fabric: <NF_NAME>
   Cluster: <CLUSTER_NAME>
   Region: <AZURE_REGION>
   Version: <NEXUS_VERSION>

   CC: stakeholder-list
   ```

## Add Azure Resource Tags on Fabric Resource:
   ```
   To help track upgrades, the DE can add a tag to the Fabric resource in Azure portal:
   |Name          | Value          |
   ---------------|-----------------
   |BF in progress|<DE_ID>|
   ```

   When deployment is complete, the DE will remove the tag.

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

  As part of the above command, the Fabric Resource Provider validates if the version upgrade is allowed from the existing Fabric version to the target version. Only N+1 major upgrades are allowed (e.g. 4.0.0->5.0.0).

  On successful completion, the command puts the Fabric status into `Under Maintenance` and prevents any other operation on the Fabric.

### Device-specific workflow:

   An `8-rack` environment will have the following 30 devices:
   - Aggr Rack - 2 CE's, 2 NPB's, 2 Mgmt Switches  (6 devices)
   - 8 Compute Racks - Each compute rack has 2 TOR's and 1 Mgmt Switch  (24 devices)

   A `4-rack` environment will have the following 17 devices:
   - Aggr Rack - 2 CE's, 1 NPB's, 2 Mgmt Switches  (5 devices)
   - 4 Compute Racks - Each compute rack has 2 TOR's and 1 Mgmt Switch  (12 devices)

   >[!Important]
   >The Devices must be upgraded in the following specific order to maintain networking service during the upgrade.

   1. Compute Rack Odd numbered TORs upgrade together in parallel.
   2. Compute Rack Even numbered TORs upgrade together in parallel.
   3. Compute Rack Management switches upgrade together in parallel.
   4. Aggr Rack CEs upgrade one after the other in serial.
      >[!Important]
      > After each CE upgrade, wait for a duration of five minutes to ensure that the recovery process is complete before proceeding to the next CE
   5. Aggr Rack NPBs upgrade one after the other in serial.
   6. Aggr Rack Management switches upgrade one after the other in serial.

   >[!NOTE]
   > Wait for successful upgrade on all devices in a group before moving to the next group.

### Device-specific upgrade:
   Run the following device upgrade command on the devices following the order specified in the previous section
   ```
   az networkfabric device upgrade --version $NF_VERSION -g $NF_RG --resource-name $NF_DEVICE_NAME --debug --subscription $SUBSCRIPTION_ID --debug
   ```

   Gather ASYNC URL and Correlation ID info for further troubleshooting if needed.
   ```
   cli.azure.cli.core.sdk.policies:     'mise-correlation-id': '<MISE_CID>'
   cli.azure.cli.core.sdk.policies:     'x-ms-correlation-request-id': '<CORRELATION_ID>'
   cli.azure.cli.core.sdk.policies:     'Azure-AsyncOperation': '<ASYNC_URL>'
   ```

   As part of the upgrade, the Devices will be kept in maintenance mode. The Device will drain out the traffic and stop advertising routes so that the traffic flow to the device stops.

   The NNF service updates the Device resource version property to the newer version.

   After device upgrades are complete, make sure that all the devices are showing as <NF_VERSION> by running the following command:
   ```
   az networkfabric device list -g $NF_RG --query "[].{name:name,version:version}" -o table --subscription $SUBSCRIPTION_ID
   ```

### Complete Network Fabric Upgrade
   Once all the devices are upgraded, run the following command to take the network fabric out of maintenance state.
   ```
   az networkfabric fabric upgrade --action Complete --version $NF_VERSION -g $NF_RG --resource-name $NF_NAME --debug --subscription $SUBSCRIPTION_ID
   ```

## Troubleshooting Device update failures.
1. Collect errors in AzCli output.
2. Collect device operation state from Azure Portal or CLI.
3. Create Azure Support Request for any device upgrade failures and attach any errors and operation state of Fabric and Devices.

## Post-upgrade Validation
Once complete, run the following commands to check the status of the Fabric and Devices:
```
az networkfabric fabric list -g $NF_RG --query "[].{name:name,fabricVersion:fabricVersion,configurationState:configurationState,provisioningState:provisioningState}" -o table --subscription $SUBSCRIPTION_ID
    
az networkfabric fabric show -g $NF_RG --resource-name $NF_NAME --subscription $SUBSCRIPTION_ID
```

## Notify Operations of Fabric upgrade completion

   The following template can be used through email or ticketing system:
   ```
   Title: <ENVIRONMENT> <AZURE_REGION> <NF_NAME> Runtime <NF_VERSION> Upgrade Complete

   Operations:
   DE Team <ENVIRONMENT> <AZURE_REGION> <NF_NAME> Runtime <NF_VERSION> Upgrade Complete

   Subscription: <CUSTOMER_SUB_ID>
   NFC: <NFC_NAME>
   CM: <CM_NAME>
   Fabric: <NF_NAME>
   Cluster: <CLUSTER_NAME>
   Region: <AZURE_REGION>
   Version: <NEXUS_VERSION>
 
   CC: stakeholder_list
   ```

## Remove upgrade Resource Tag added on Fabric Resource:
   ```
   |Name          | Value          |
   ---------------|-----------------
   |BF in progress|<DE_ID>|
   ```

## Close out any Work Items in your ticketing system
* Update Task hours for upgrade duration.
* Set Fabric upgrade work item to `Complete`.
* Add any notes on support tickets and issues encountered during upgrade
