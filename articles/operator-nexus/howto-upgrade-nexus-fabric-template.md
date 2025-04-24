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

This how-to guide provides a step-by-step template for upgrading a Fabric. It is designed to assist users in enhancing their network infrastructure through Azure APIs, which facilitate the lifecycle management of various network devices. Regular updates are crucial for maintaining system integrity and accessing the latest product improvements.

## Overview

**Runtime bundle components**: These components require operator consent for upgrades that may affect traffic behavior or necessitate device reboots. The network fabric's design allows for updates to be applied while maintaining continuous data traffic flow.

Runtime changes are categorized as follows:
- **Operating system updates**: Necessary to support new features or resolve issues.
- **Base configuration updates**: Initial settings applied during device bootstrapping.
- **Configuration structure updates**: Generated based on user input for conf

## Required Parameters:
- <START_DATE>: Planned start date/time of upgrade
- \<ENVIRONMENT\>: Instance name
- <AZURE_REGION>: - Azure region of instance
- <CUSTOMER_SUB_NAME>: Subscription name
- <CUSTOMER_SUB_TENANT_ID>: Tenant ID
- <CUSTOMER_SUB_ID>: Subscription ID
- <NEXUS_VERSION>: Operator Nexus release version (e.g. 2504.1)
- <NNF_VERSION>: Operator Nexus Fabric release version (e.g. 8.1) 
- <NF_VERSION>: NF runtime version for upgrade (e.g. 5.0.0)
- <NF_DEVICE_NAME>: Network Fabric Device Name
- <NF_DEVICE_RID>: Network Fabric Device Resource ID
- <NF_NAME>: Network Fabric Name
- <NF_RG>: Network Fabric Resource Group
- <NF_RID>: Network Fabric ARM ID
- <NFC_NAME>: Associated NFC
- <NFC_RG>: NFC Resource Group
- <NFC_RID>: NFC ARM ID
- <CLUSTER_KEYVAULT_ID>: Cluster Keyvault ARM ID
- <NFC_MRG>: Cluster Managed Resource Group
- \<DURATION\>: Estimated Duration of upgrade
- <DE_ID>: Deployment Engineer performing upgrade

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

2. Validate Network Fabric Contoller and Network Fabric provisioning status.
   
   Setup the subscription, NFC and NF parameters:
   ```  
   export SUBSCRIPTION_ID=<CUSTOMER_SUB_ID>
   export NFC_RG=<NFC_RG>
   export NFC_NAME=<NFC_NAME>
   export NF_RG=<NF_RG>
   export NF_NAME=<NF_NAME>
   ```

   Check that the NFC is in Provisioned state.
   ```
   az networkfabric controller show -g $NFC_RG --resource-name $NFC_NAME --subscription $SUBSCRIPTION_ID -o table
   ```

   Check the NF status:
   ```  
   az networkfabric fabric show -g $NF_RG --resource-name $NF_NAME --subscription $SUBSCRIPTION_ID -o table
   ```
   **Note down the fabricVersion and provisioningState - if provisioningState is not Succeeded then upgrade should not continue until resolved.**

3. Microsoft.NexusIdentity user RP must be registered on the customer subscription.  To check:
   ```
   az provider show --namespace Microsoft.NexusIdentity -o table --subscription $SUBSCRIPTION_ID
   Namespace                RegistrationPolicy    RegistrationState
   -----------------------  --------------------  -------------------
   Microsoft.NexusIdentity  RegistrationRequired  Registered
   ```

   If not registered, run the following:
   ```
   az provider register --namespace Microsoft.NexusIdentity --wait --subscription $SUBSCRIPTION_ID

   az provider show --namespace Microsoft.NexusIdentity -o table
   Namespace                RegistrationPolicy    RegistrationState
   -----------------------  --------------------  -------------------
   Microsoft.NexusIdentity  RegistrationRequired  Registered
   ```

4. Minimum available disk space on each device(CE, TOR, NPB, Mgmt Switch) must be more than 3.5 GB for a successful device upgrade.

   Verify the available space on all devices using the following  admin action.If there isn't enough space, remove archived EOS images and support bundle files.
   ```
   az networkfabric device run-ro --resource-name <ND_DEVICE_NAME> --resource-group <NF_RG> --ro-command "dir flash" --subscription <CUSTOMER_SUB_ID> --debug
   ```
   
5. Check no simultaneous fabric upgrade within NFC to prevent contention issues with the NFC storage account:
   ```
   az networkfabric fabric list --subscription <CUSTOMER_SUB_ID> -o table | grep <NFC_NAME>
   ```

   Verify there are no other Fabrics showing `provisioningState` as `Updating` on the same Network Fabric Controller. 
        
6. Check Network Packet Broker for any orphaned Network Taps:
   In the AZ Portal:
   * Select Network Fabrics -> <NF_NAME>.
   * Click on the Resource group.
   * In the Resources list, filter on "network packet broker".
   * Click on the network packet broker name.
   * Click on "Network Taps".
   * All Network taps should be `Succeeded` for `Configuration State` and `Provisioning State` and `Enabled` for `Administrative State`.
   * Look for any taps with a red `X` and a status of `not found`, `failed` or `error`.

   If any taps are "not found", failed" or "error" status, do not start the upgrade until the network taps issues are cleared.
   
7. Run cabling validation report:
   ```
   az networkfabric fabric validate-configuration --resource-group $NF_RG --resource-name $NF_NAME --validate-action "Cabling" --debug
   ```
   Following link to Storage Account in output where report is uploaded in JSON format. Satya wrote a python tool to convert to html (see Teams chat).

   Attached zipped html validation report to iTrack: e.g. report-01-05-2024-15-00.zip

   Add comment to itrack with interface NotConnected Status or ports mismatched.

   Report identifies following issues:
   Device Name Interface Map Name Validation Result Status Destination Hostname Destination Port Device 
   Configuration Error Reason Map Type
   <LIST_FAILURES>

   Validate under `Unknown` section, any ports with `Not-Connected` should be verified against the BOM.

   List all port connection and cabling issues in the iTrack and notify AT&T Nitro/Team

11. Notify SRE of Upgrade and ETA:

   DE will send notification to SRE of production resource upgrade and ETA using the following template:
   ```
   Title: <ENVIRONMENT> <REGION> <FABRIC_NAME> Runtime upgrade to <FABRIC_RUNTIME_VERSION> <START_TIME> - 
   Completion ETA <DURATION>

   AODS_SRE@microsoft.com:

   Nexus DE Team <ENVIRONMENT> <REGION> <FABRIC_NAME> Runtime upgrade to <FABRIC_RUNTIME_VERSION> <START_TIME> 
   - Completion ETA <DURATION>

   Subscription: <CUSTOMER_SUB_ID>
   NFC: <NFC_NAME>
   CM: <CM_NAME>
   Fabric: <FABRIC_NAME>
   Cluster: <CLUSTER_NAME>
   Region: <AZURE_REGION>
   Version: <NEXUS_VERSION>
 
   cc: aods-de- 
   vendor@microsoft.com;jacobsmith@microsoft.com;steve.laughman@microsoft.com;jegallagher@microsoft.com
   ```

12. Azure Resource Tags on Deployment Resources:

   ```
   To help track customer deployments, DE will add tags to DE created Azure resources in Azure portal for 
   Fabric:
   |Name          | Value          |
   ---------------|-----------------
   |BF in progress|<DE_CUSTOMER_ID>|

   When deployment is complete or issue is resolved, the DE will remove the tag.
   ```


#PROCEDURE
**STEP 1: TRIGGER UPGRADE ON FABRIC**
Operator triggers the upgrade POST action on NetworkFabric via AZCLI/Portal with request payload as:
```
az networkfabric fabric upgrade -g $NF_RG --resource-name $NF_NAME --action start --version "5.0.0" --subscription $SUBSCRIPTION_ID  --debug
{}
```
**Note: Output showing `{}` indicates successful execution of upgrade command**

As part of the above POST action request, RP validates if the version upgrade is allowed from the existing fabric version. We only allow an upgrade from 4.0.0 to 5.0.0.  
The above command marks the NetworkFabric Under Maintenance and prevents any other operation on the Fabric.

**STEP 2: TRIGGER UPGRADE PER DEVICE**
Operator triggers upgrade POST actions per device (in order as recommended by NNF team). The service completes the device upgrade to success, and marks it upgraded to a newer version.
**NOTE: In case the device upgrade fails, the issue needs to be mitigated manually before the operator can proceed to upgrade the next device. Please raise an azure portal support request.**

To see steps on how to create an Azure Portal Support Request and to see the flow for ticketing deployment issues, click here:
https://dev.azure.com/msazuredev/AzureForOperatorsIndustry/_wiki/wikis/AzureForOperatorsIndustry.wiki/27142/Azure-Portal-Support-Request-and-IcM-Ticketing-Process

An `8-rack` environment will have the following 30 devices:
Aggr Rack - 2 CE's, 2 NPB's, 2 Mgmt Switches  (6 devices)
8 Compute Racks - Each compute rack has 2 TOR's and 1 Mgmt Switch  (24 devices)

A `4-rack` environment will have the following 17 devices:
Aggr Rack - 2 CE's, 1 NPB's, 2 Mgmt Switches  (5 devices)
4 Compute Racks - Each compute rack has 2 TOR's and 1 Mgmt Switch  (12 devices)

**Device Upgrade Order**
***Compute Racks:***
1. Odd numbered TORs  (***NOTE: All DEVICES IN THIS GROUP CAN BE DONE IN PARALLEL; WAIT FOR SUCCESSFUL UPGRADE ON ALL DEVICES BEFORE MOVING TO THE NEXT GROUP***)

2. Even numbered TORs  (***NOTE: All DEVICES IN THIS GROUP CAN BE DONE IN PARALLEL; WAIT FOR SUCCESSFUL UPGRADE ON ALL DEVICES BEFORE MOVING TO THE NEXT GROUP***)

3. Compute rack management switches  (***NOTE: All DEVICES IN THIS GROUP CAN BE DONE IN PARALLEL; WAIT FOR SUCCESSFUL UPGRADE ON ALL DEVICES BEFORE MOVING TO THE NEXT GROUP***)

***Aggregate Racks:***

4. CEs are to be upgraded one after the other in a serial manner.  ***(NOTE: WAIT FOR SUCCESSFUL UPGRADE ON 
EACH DEVICE BEFORE MOVING TO THE NEXT DEVICE)*** Stop the upgrade procedure if there are any failures 
corresponding to CE upgrade operation.  After each CE upgrade, ***wait for a duration of five minutes*** to 
ensure that the recovery process is complete before proceeding to the next device upgrade.  ***(NOTE: WAIT 
FOR SUCCESSFUL UPGRADE ON BOTH CE DEVICES BEFORE MOVING TO THE NPBs)***

5. NPBs are to be upgraded one after the other in a serial manner.  ***(NOTE: Most sites will be an 8-rack environment with two NPB devices.  If the site has a 4-rack environment, there will only be one NPB device. WAIT FOR SUCCESSFUL UPGRADE ON EACH DEVICE BEFORE MOVING TO THE NEXT DEVICE; WAIT FOR SUCCESSFUL UPGRADE ON BOTH NPB DEVICES BEFORE 
MOVING TO THE Aggr Mgmt Switches)***

6. Remaining aggr rack mgmt switches are to be upgraded one after the other in a serial manner.  ***(NOTE: 
WAIT FOR SUCCESSFUL UPGRADE ON EACH DEVICE BEFORE MOVING TO THE NEXT DEVICE)***


Verify all devices have ConfigurationState `Succeeded` and ProvisionState `Succeeded`.
   ```
   az networkfabric device list -g $NF_RG -o table --subscription $SUBSCRIPTION_ID
   ```

Run the following device upgrade command on the devices **following the Device Upgrade Order listed above**.
   ```
   az networkfabric device upgrade --version 5.0.0 -g $NF_RG --resource-name $NF_DEVICE_NAME --debug --subscription 
   $SUBSCRIPTION_ID --debug
   ```
Gather ASYNC URL and Correlation ID info for further troubleshooting if needed.
  ```
  cli.azure.cli.core.sdk.policies:     'mise-correlation-id': '<MISE_CID>'
  cli.azure.cli.core.sdk.policies:     'x-ms-correlation-request-id': '<CORRELATION_ID>'
  cli.azure.cli.core.sdk.policies:     'Azure-AsyncOperation': '<ASYNC_URL>'
  ```
Verify any issue in activity log and dgrep for each device in the group before starting next group.
```
      Endpoint: Diagnostics PROD
      Namespace: AfoNetworkFabric
      Events to search: APIValidationErrors, Errors
      Time range: Make sure to encompass the period for when the upgrade action was executed

      Us the following Filtering conditions
      source
      | order by serviceTimestampString asc
      | where * contains "<FABRIC_NAME>"
      | where * contains "<CORRELATION_ID>"
     
      Example DGREP [query](https://portal.microsoftgeneva.com/s/E8AB3E31).
```

As part of the upgrade, NF devices will be kept in maintenance mode. During the maintenance mode, Device will drain out the traffic and stop advertising routes so that the traffic flow to the device stops.

After this step, NNF service updates the NetworkDevice resource version property to the newer version. Verify this accuracy of the information before moving to the next device.  
During this entire workflow, if there is a failure encountered at any step then NNF fails the device upgrade operation. Failures need to be mitigated by human intervention.

Operator triggers device upgrades each at a time.

**STEP 3: POST DEVICE UPGRADES**
After device upgrades are complete, make sure that all the devices are showing as 5.0.0 by running the following command:
```
az networkfabric device list -g $NF_RG --query "[].{name:name,version:version}" -o table --subscription $SUBSCRIPTION_ID
```

**STEP 4: COMPLETE NETWORK FABRIC UPGRADE**
Once all the devices are upgraded, run the following command to take the network fabric out of maintenance state.

```
az networkfabric fabric upgrade --action Complete --version "5.0.0" -g $NF_RG --resource-name $NF_NAME --debug --subscription $SUBSCRIPTION_ID
```
Once complete, run the following command to check fabric version is showing 5.0.0:
```
az networkfabric fabric list -g $NF_RG --query "[].{name:name,fabricVersion:fabricVersion,configurationState:configurationState,provisioningState:provisioningState}" -o table --subscription $SUBSCRIPTION_ID
    
az networkfabric fabric show -g $NF_RG --resource-name $NF_NAME --subscription $SUBSCRIPTION_ID
```

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Troubleshooting if device update failed:**
1.  Check device operation state from admin Api
2.  Check errors in AzCli output.

Troubleshoot Network Fabric upgrade TSG doc: [(https://eng.ms/docs/strategic-missions-and-technologies/strategic-missions-and-technologies-organization/azure-for-operators-industry/network-cloud/afoi-network-cloud/network-cloud-tsgs/doc/undercloud/deployment/how-to-troubleshoot-deployment-run)https://eng.ms/docs/cloud-ai-platform/azure-edge-platform-aep/aep-edge/nexus/nexus-network-fabric/nexus-network-fabric-troubleshooting-guides/networkfabric/networkfabric-upgrade-start-failed]()


#Create Azure Support Request in Portal

 For any device upgrade failure issue, please create an Azure Portal Support request to facilitate better tracking.

To see steps on how to create an Azure Portal Support Request and to see the flow for ticketing deployment issues, click here:
https://dev.azure.com/msazuredev/AzureForOperatorsIndustry/_wiki/wikis/AzureForOperatorsIndustry.wiki/27142/Azure-Portal-Support-Request-and-IcM-Ticketing-Process


# Post-upgrade Validation
1. Validation with prov-val.sh Scripts:
   Clone nc-labs: git clone https://msazuredev@dev.azure.com/msazuredev/AzureForOperatorsIndustry/_git/nc-labs
   ```
   cd ~/att/nc-labs/scripts/validation-bash-scripts
   $ ./prov-val-prod.sh
   ```

   Attach `prov-val-prod` output log to the iTrack ticket.


2. Notify Operations to perform upgrade validation.

   THe following template can be used through email or ticketing system:
   ```
   Title: <ENVIRONMENT> <REGION> <FABRIC_NAME> Runtime <FABRIC_RUNTIME_VERSION> Upgrade Complete - Validation Requested
   Operations

   Nexus DE Team <ENVIRONMENT> <REGION> <FABRIC_NAME> Runtime <FABRIC_RUNTIME_VERSION> Upgrade Complete - Validation Requested

   Subscription: <CUSTOMER_SUB_ID>
   NFC: <NFC_NAME>
   CM: <CM_NAME>
   Fabric: <FABRIC_NAME>
   Cluster: <CLUSTER_NAME>
   Region: <AZURE_REGION>
   Version: <NEXUS_VERSION>
 
   cc: <
   ```

# Wait for SRE Validation report
SRE will send a validation report and give OK to handoff to customer before continuing.

# Remove Fabric Tag
Remove the following tag in Azure portal on the Fabric resource added for upgrade tracking:
`BF in progress: <DE_ID>`

## Close out any Work Items in your ticketing system
* Update Task hours for upgrade duration.
* Set Fabric upgrade work item to `Complete`.
