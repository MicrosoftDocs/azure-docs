---
title: Azure Operator Nexus troubleshoot bare metal machine provisioning
description: Troubleshoot bare metal machine provisioning for Azure Operator Nexus.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 07/19/2024
author: bpinto
ms.author: bpinto
---

# Troubleshoot BMM provisioning in Azure Operator Nexus cluster

As part of cluster deploy action, bare metal machines (BMM) are provisioned with required roles to participate in the cluster. This document supports troubleshooting for common provisioning issues using Azure CLI, Azure portal, and the server baseboard management controller (BMC). For the Azure Operator Nexus platform, the underlying server hardware uses integrated Dell remote access controller (iDRAC) as the BMC. Provisioning uses the Preboot eXecution Environment (PXE) interface to load the Operating System (OS) on the BMM.

## Prerequisites
1. Install the latest version of the [appropriate CLI extensions](howto-install-cli-extensions.md)
2. Collect the following information:
   - Subscription ID (SUBSCRIPTION)
   - Cluster name (CLUSTER)
   - Resource group (CLUSTER_RG)
   - Managed resource group (CLUSTER_MRG)
3. Request subscription access to run Azure Operator Nexus network fabric (NF) and network cloud (NC) CLI extension commands.
4. Log in to Azure CLI and select the subscription where the cluster is deployed.

## BMM roles
For a given SKU, there are required roles to manage and operate the underlying kubernetes cluster.

The following roles are assigned to BMM resources (see [BMM roles reference](reference-near-edge-baremetal-machine-roles.md)):

  - `Control plane`: BMM responsible for running the kubernetes control plane agents for cluster.
  - `Management plane`: BMM responsible for running the platform agents including controllers and extensions.
  - `Compute plane`: BMM responsible for running actual tenant workloads including kubernetes clusters and virtual machines.

## Listing BMM status
This command will `list` all `bareMetalMachineName` resources in the managed resource group with simple status:

```azurecli
az networkcloud baremetalmachine list -g $CLUSTER_MRG -o table

Name          ResourceGroup                  DetailedStatus    DetailedStatusMessage
------------  -----------------------------  ----------------  ---------------------------------------
BMM_NAME      CLUSTER_MRG                    STATUS            STATUS_MSG
```

Where `STATUS` goes through the following phases through the BMM provisioning process (see [BMM Status in Azure Operator Nexus Compute Concepts](concepts-compute.md)):

`Registering` -> `Preparing` -> `Inspecting` -> `Available` -> `Provisioning` -> `Provisioned`

These phases are defined as follows:

| Phase | Actions |
| --- | --- |
| `Registering` | Verifying BMC connectivity/BMC credentials and adding BMM to provisioning service. |
| `Preparing` | Rebooting BMM, resetting BMC, and verifying power state. |
| `Inspecting` | Updating firmware, applying BIOS settings, and configuring storage. |
| `Available` | BMM is ready to install OS. |
| `Provisioning` | OS image installing on the BMM. After OS is installed, BMM attempts to join cluster. |
| `Provisioned` | BMM successfully provisioned and joined to cluster. |
| `Deprovisioning` | BMM provisioning failed. Provisioning service is cleaning up resource for retry. |
| `Failed` | BMM provisioning failed and manual recovery is required. All retries exhausted. |

During any phase, the BMM detailed status is set to failed and the phase is blocked if any of the following occurs:
- BMC is unavailable
- Network port is down
- Hardware component fails

To get a more detailed status of the BMM:
```azurecli
az networkcloud baremetalmachine list -g $CLUSTER_MRG --query "sort_by([].{name:name,readyState:readyState,provisioningState:provisioningState,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage,powerState:powerState,machineRoles:machineRoles| join(', ', @),createdAt:systemData.createdAt}, &name)" --output table

Name            ReadyState    ProvisioningState    DetailedStatus    DetailedStatusMessage                      PowerState    MachineRoles                                      CreatedAt
------------    ----------    -----------------    --------------    -----------------------------------------  ----------    ------------------------------------------------  -----------
BMM_NAME        RSTATE        PROV_STATE           STATUS            STATUS_MSG                                 POWER_STATE   BMM_ROLE                                          CREATE_DATE
```

Where the output is defined as follows:

| Output | Definition |
| --- | --- |
| BMM_NAME | BMM name |
| RSTATE | Cluster participation status (`True`,`False`). |
| PROV_STATE | Provisioning state (`Succeeded`,`Failed`). |
| STATUS | Provisioning detailed status (`Registering`,`Preparing`,`Inspecting`,`Available`,`Provisioning`,`Provisioned`,`Deprovisioning`,`Failed`). |
| STATUS_MSG | Detailed provisioning status message. |
| POWER_STATE | Power state of BMM (`On`,`Off`). |
| BMM_ROLE | BMM cluster role (`control-plane`,`management-plane`,`compute-plane`). |
| CREATE_DATE | BMM creation date. |

For example:
```azurecli
x01dev01c01w01  True          Succeeded            Provisioned       The OS is provisioned to the machine       On            platform.afo-nc.microsoft.com/compute-plane=true  2024-05-03T15:12:48.0934793Z
x01dev01c01w01  False         Failed               Preparing         Preparing for provisioning of the machine  Off           platform.afo-nc.microsoft.com/compute-plane=true  2024-05-03T15:12:48.0934793Z
```

## BMM details
To show details and status of a single BMM:
```azurecli
az networkcloud baremetalmachine show -g $CLUSTER_MRG -n $BMM_NAME
```
For BMM details specific to troubleshooting:
```azurecli
az networkcloud baremetalmachine show -g $CLUSTER_MRG -n $BMM_NAME --query "{name:name,BootMAC:bootMacAddress,BMCMAC:bmcMacAddress,Connect:bmcConnectionString,SN:serialNumber,rackId:rackId,RackSlot:rackSlot}" -o table
```

## Troubleshooting failed provisioning state

The following conditions can cause provisioning failures:

| Error Type | Resolution |
| ---------- | ---------- |
| BMC shows `Backplane Comm` critical error. | 1) Execute BMM remote flea drain. 2) Perform BMM physical flea drain. 3) Execute BMM `replace` action. |
| Boot (PXE) network data response empty from BMC. | 1) Reset port on fabric device. 2) Execute BMM remote flea drain. 3) Perform BMM physical flea drain. 4) Execute BMM `replace` action. |
| Boot (PXE) MAC address mismatch. | 1) Validate BMM MAC address data against BMC data. 2) Execute BMM remote flea drain. 3) Perform BMM physical flea drain. 4) Execute BMM `replace` action. |
| BMC MAC address mismatch | 1) Validate BMM MAC address data against BMC data. 2) Execute BMM remote flea drain. 3) Perform BMM physical flea drain. 4) Execute BMM `replace` action. |
| Disk data response empty from BMC. | 1) Remove/replace disk. 2) Remove/replace storage controller. 3) Execute BMM remote flea drain. 4) Perform BMM physical flea drain. 5) Execute BMM `replace` action. |
| BMC unreachable. | 1) Reset port on fabric device. 2) Remove/replace cable. 3) Execute BMM remote flea drain. 4) Perform BMM physical flea drain. 5) Execute BMM `replace` action. |
| BMC fails log in. | 1) Update credentials on BMC. 2) Execute BMM `replace` action. |
| Memory, CPU, OEM critical errors on BMC. | 1) Resolve hardware issue with remove/replace. 2) Execute BMM remote flea drain. 3) Perform BMM physical flea drain. 4) Execute BMM `replace` action. |
| Console stuck at boot loader (GRUB) menu. | 1) Execute NVRAM reset. 2) Execute BMM `replace` action. |

### Azure BMM activity log

1. Log in to [Azure portal](https://portal.azure.com/).
2. Search on the BMM name in the top `Search` box.
3. Select the `Bare Metal Machine (Operator Nexus)` from the search results.
4. Select `Activity log` on the left side menu.
5. Make sure the `Timespan` encompasses the provisioning period.
6. Expand the `BareMetalMachines_Update` operation and select any that show `Failed` status.
7. Select `JSON` tab to get the detailed status message.

Look for failures related to invalid credentials or BMC unavailable.

### Determine BMC IPv4 address
The IPv4 address of the BMC (BMC_IP) is in the `Connect` value returned from the previous `BMM Details` section.

### Validate MAC address of BMM against BMC data

To get the MAC address information from the BMM:
```azurecli
az networkcloud baremetalmachine show -g $CLUSTER_MRG -n $BMM_NAME --query "{name:name,BootMAC:bootMacAddress,BMCMAC:bmcMacAddress,SN:serialNumber,rackId:rackId,RackSlot:rackSlot}" -o table
```

Verify the MAC address data against the BMC through the WEB UI: 
`BMC` -> `Dashboard` - Shows BMC MAC address
`BMC` -> `System Info` -> `Network` -> `Embedded.1-1-1` - Shows Boot MAC address

Verify the MAC address using `racadm` from a jumpbox that has access to the BMC network:
```bash
racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD getsysinfo | grep "MAC Address "        #BMC MAC
racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD getsysinfo | grep "NIC.Embedded.1-1-1"  #Boot MAC
```

If the MAC address supplied to the cluster is incorrect, use the BMM `replace` action at [BMM actions](howto-baremetal-functions.md) to correct the addresses.

### Ping test BMC connectivity

Attempt to run ping against the BMC IPv4 address:
1. Obtain the IPv4 address (BMC_IP) from the previous `Determine BMC IPv4 address`.
2. Test ping to the BMC:

   To test from a jumpbox that has access to the BMC network:
   ```bash 
   ping $BMC_IP -c 3
   ```
   
   To test from a BMM control-plane host using Azure CLI:
   ```azurecli
   az networkcloud baremetalmachine run-read-command -g $CLUSTER_MRG -n $BMM_NAME --limit-time-seconds 60 --commands "[{command:'ping',arguments:['$BMC_IP',-c,3]}]"
   ```

### Reset port on fabric device
If the BMC_IP isn't responsive, a reset of the fabric device port retriggers autonegotiation on the port and may bring it back online.

To find the `Network Fabric` port from Azure:
1. Obtain the `RackID` and `RackSlot` from the previous `BMM Details` section.
2. In Azure portal, drill down to the `Network Rack` RackID for the BMM.
3. Select `Network Devices` tab and the management (Mgmt) switch for the rack.
4. Under `Resources`, select `Network Interfaces` and then the BMC (iDRAC) or boot (PXE) interface for the port that requires reset.

   Collect the following information:
   - Network fabric resource group (NF_RG)
   - Device name (NF_DEVICE_NAME)
   - Interface name (NF_DEVICE_INTERFACE_NAME)

5. Reset the port:

   To reset the port using Azure CLI:
   ```azurecli
   az networkfabric interface update-admin-state -g $NF_RG --network-device-name $NF_DEVICE_NAME --resource-name $NF_DEVICE_INTERFACE_NAME --state Disable
   az networkfabric interface update-admin-state -g $NF_RG --network-device-name $NF_DEVICE_NAME --resource-name $NF_DEVICE_INERFACE_NAME --state Enable
   ```

### BMM remote power drain (flea drain)
Perform a remote flea drain against the BMM through the BMC UI:
`BMC` -> `Configuration` -> `BIOS Settings` -> `Miscellaneous Settings` -> `Select "Full Power Cycle" under Power Cycle Request` -> `Apply and reboot`

Perform a remote flea drain using `racadm` from a jumpbox that has access to the BMC network:
```bash
racadm set bios.miscsettings.powercyclerequest FullPowerCycle
racadm jobqueue create BIOS.Setup.1-1
racadm serveraction powercycle
```

### BMM physical power drain (flea drain)
For a physical flea drain, the local site hands physically disconnect the power cables from both power adapters for 5 minutes and then restore power. This process ensures the server, capacitors, and all components have complete power removal and all cached data is cleared.

### Reset NVRAM
If provisioning failed due to an OEM or hardware error, the boot sequence may be locked in NVRAM to `PXE boot` instead of showing `hdd` or `hard drive` listed first in the boot order. 

This condition typically shows the BMM at the bootloader stage on the console and is blocked without manual keystroke intervention. 

To reset the NVRAM, use the following sequence in the BMC UI:
`Maintenance` -> `Diagnostics` -> `Reset iDrac to Factory Defaults` -> `Discard All Settings, but preserve user and network settings` -> `Apply and reboot`

### Reset BMC password
If the activity log indicates invalid credentials on the BMC, run the following command from a jumpbox that has access to the BMC network:
```bash
racadm -r $BMC_IP -u $BMC_USER -p $CURRENT_PASSWORD  set iDRAC.Users.2.Password $BMC_PWD
```

## Adding servers back into the cluster after a repair

After hardware is fixed, run BMM `replace` action following instructions from the following page [BMM actions](howto-baremetal-functions.md).

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
For more information about support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).
