---
title: Azure Operator Nexus troubleshoot bare-metal machine provisioning
description: Troubleshoot bare-metal machine provisioning for Azure Operator Nexus.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 07/19/2024
author: bpinto
ms.author: bpinto
---

# Troubleshoot BMM provisioning in an Azure Operator Nexus cluster

As part of a cluster deploy action, bare metal machines (BMMs) are provisioned with roles that are required to participate in the cluster. This document supports troubleshooting for common provisioning issues by using the Azure CLI, the Azure portal, and the server baseboard management controller (BMC). For the Azure Operator Nexus platform, the underlying server hardware uses integrated Dell remote access controller (iDRAC) as the BMC. Provisioning uses the Preboot eXecution Environment (PXE) interface to load the operating system (OS) on the BMM.

## Prerequisites

1. Install the latest version of the [appropriate CLI extensions](howto-install-cli-extensions.md).
1. Collect the following information:
   - Subscription ID (`SUBSCRIPTION`)
   - Cluster name (`CLUSTER`)
   - Resource group (`CLUSTER_RG`)
   - Managed resource group (`CLUSTER_MRG`)
1. Request subscription access to run the Azure Operator Nexus network fabric (NF) and network cloud CLI extension commands.
1. Sign in to the Azure CLI and select the subscription where the cluster is deployed.

## BMM roles

For a specific version, roles are required to manage and operate the underlying Kubernetes cluster.

The following roles are assigned to BMM resources (see the [BMM roles reference](reference-near-edge-baremetal-machine-roles.md)):

- **Control plane**: The BMM responsible for running the Kubernetes control plane agents for the cluster.
- **Management plane**: The BMM responsible for running the platform agents, including controllers and extensions.
- **Compute plane**: The BMM responsible for running actual tenant workloads, including Kubernetes clusters and virtual machines.

## List the BMM status

The following command lists all `bareMetalMachineName` resources in the managed resource group with a simple status:

```azurecli
az networkcloud baremetalmachine list -g $CLUSTER_MRG -o table

Name          ResourceGroup                  DetailedStatus    DetailedStatusMessage
------------  -----------------------------  ----------------  ---------------------------------------
BMM_NAME      CLUSTER_MRG                    STATUS            STATUS_MSG
```

The `STATUS` process goes through the phases that are defined in the following table in the BMM provisioning process (see [BMM status in Azure Operator Nexus compute concepts](concepts-compute.md)):

| Phase | Actions |
| --- | --- |
| `Registering` | Verifies the BMC connectivity/BMC credentials and adds the BMM to the provisioning service. |
| `Preparing` | Reboots the BMM, resets the BMC, and verifies the power state. |
| `Inspecting` | Updates firmware, applies BIOS settings, and configures storage. |
| `Available` | Indicates that the BMM is ready to install the OS. |
| `Provisioning` | Indicates that the OS image is installing on the BMM. After the OS is installed, the BMM attempts to join the cluster. |
| `Provisioned` | Indicates that the BMM is successfully provisioned and joined to the cluster. |
| `Deprovisioning` | Indicates that BMM provisioning failed. The provisioning service cleans up the resource for retry. |
| `Failed` | Indicates that BMM provisioning failed and manual recovery is required. All retries are exhausted. |

During any phase, the BMM detailed status is set to `Failed`. The phase is blocked if any of the following disruptions occur:

- The BMC is unavailable.
- A network port is down.
- A hardware component fails.

To get a more detailed status of the BMM:

```azurecli
az networkcloud baremetalmachine list -g $CLUSTER_MRG --query "sort_by([].{name:name,readyState:readyState,provisioningState:provisioningState,detailedStatus:detailedStatus,detailedStatusMessage:detailedStatusMessage,powerState:powerState,machineRoles:machineRoles| join(', ', @),createdAt:systemData.createdAt}, &name)" --output table

Name            ReadyState    ProvisioningState    DetailedStatus    DetailedStatusMessage                      PowerState    MachineRoles                                      CreatedAt
------------    ----------    -----------------    --------------    -----------------------------------------  ----------    ------------------------------------------------  -----------
BMM_NAME        RSTATE        PROV_STATE           STATUS            STATUS_MSG                                 POWER_STATE   BMM_ROLE                                          CREATE_DATE
```

The following table lists where the output is defined.

| Output | Definition |
| --- | --- |
| `BMM_NAME` | BMM name. |
| `RSTATE` | Cluster participation status (`True`,`False`). |
| `PROV_STATE` | Provisioning state (`Succeeded`,`Failed`). |
| `STATUS` | Provisioning detailed status (`Registering`,`Preparing`,`Inspecting`,`Available`,`Provisioning`,`Provisioned`,`Deprovisioning`,`Failed`). |
| `STATUS_MSG` | Detailed provisioning status message. |
| `POWER_STATE` | Power state of BMM (`On`,`Off`). |
| `BMM_ROLE` | BMM cluster role (`control-plane`,`management-plane`,`compute-plane`). |
| `CREATE_DATE` | BMM creation date. |

For example:

```azurecli
x01dev01c01w01  True          Succeeded            Provisioned       The OS is provisioned to the machine       On            platform.afo-nc.microsoft.com/compute-plane=true  2024-05-03T15:12:48.0934793Z
x01dev01c01w01  False         Failed               Preparing         Preparing for provisioning of the machine  Off           platform.afo-nc.microsoft.com/compute-plane=true  2024-05-03T15:12:48.0934793Z
```

## BMM details

To show details and the status of a single BMM:

```azurecli
az networkcloud baremetalmachine show -g $CLUSTER_MRG -n $BMM_NAME
```

For BMM details specific to troubleshooting:

```azurecli
az networkcloud baremetalmachine show -g $CLUSTER_MRG -n $BMM_NAME --query "{name:name,BootMAC:bootMacAddress,BMCMAC:bmcMacAddress,Connect:bmcConnectionString,SN:serialNumber,rackId:rackId,RackSlot:rackSlot}" -o table
```

## Troubleshooting failed provisioning states

The following conditions can cause provisioning failures.

| Error type | Resolution |
| ---------- | ---------- |
| BMC shows `Backplane Comm` critical error. | 1. Run BMM remote flea drain.<br/> 2. Perform BMM physical flea drain.<br/> 3. Run BMM `replace` action. |
| Boot (PXE) network data response empty from BMC. | 1. Reset port on fabric device.<br/> 2. Run BMM remote flea drain.<br/> 3. Perform BMM physical flea drain.<br/> 4. Run BMM `replace` action. |
| Boot (PXE) MAC address mismatch. | 1. Validate BMM MAC address data against BMC data.<br/> 2. Run BMM remote flea drain.<br/> 3. Perform BMM physical flea drain.<br/> 4. Run BMM `replace` action. |
| BMC MAC address mismatch. | 1. Validate BMM MAC address data against BMC data.<br/> 2. Run BMM remote flea drain.<br/> 3. Perform BMM physical flea drain.<br/> 4. Run BMM `replace` action. |
| Disk data response empty from BMC. | 1. Remove or replace disk.<br/> 2. Remove or replace storage controller.<br/> 3. Run BMM remote flea drain.<br/> 4. Perform BMM physical flea drain.<br/> 5. Run BMM `replace` action. |
| BMC unreachable. | 1. Reset port on fabric device.<br/> 2. Remove or replace cable.<br/> 3. Run BMM remote flea drain.<br/> 4. Perform BMM physical flea drain.<br/> 5. Run BMM `replace` action. |
| BMC fails sign-in. | 1. Update credentials on BMC.<br/> 2. Run BMM `replace` action. |
| Memory, CPU, OEM critical errors on BMC. | 1. Resolve hardware issue with remove or replace.<br/> 2. Run BMM remote flea drain.<br/> 3. Perform BMM physical flea drain.<br/> 4. Run BMM `replace` action. |
| Console stuck at boot loader (GRUB) menu. | 1. Run NVRAM reset.<br/> 2. Run BMM `replace` action. |

### Azure BMM activity log

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search on the BMM name in the top **Search** box.
1. Select the **Bare Metal Machine (Operator Nexus)** name from the search results.
1. On the service menu, select **Activity log**.
1. Make sure the **Timespan** value encompasses the provisioning period.
1. Expand the `BareMetalMachines_Update` operation, and select any BMMs that show a `Failed` status.
1. Select the **JSON** tab to get the detailed status message.

Look for failures related to invalid credentials or if the BMC is unavailable.

### Determine the BMC IPv4 address

The IPv4 address of the BMC (`BMC_IP`) is in the `Connect` value returned from the previous section "BMM details."

### Validate the MAC address of the BMM against BMC data

To get the MAC address information from the BMM:

```azurecli
az networkcloud baremetalmachine show -g $CLUSTER_MRG -n $BMM_NAME --query "{name:name,BootMAC:bootMacAddress,BMCMAC:bmcMacAddress,SN:serialNumber,rackId:rackId,RackSlot:rackSlot}" -o table
```

Verify the MAC address data against the BMC through the web UI:

- `BMC` > `Dashboard`: Shows the BMC MAC address.
- `BMC` > `System Info` > `Network` > `Embedded.1-1-1`: Shows the Boot MAC address.

Verify that the MAC address is using `racadm` from a jumpbox that has access to the BMC network:

```bash
racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD getsysinfo | grep "MAC Address "        #BMC MAC
racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD getsysinfo | grep "NIC.Embedded.1-1-1"  #Boot MAC
```

If the MAC address supplied to the cluster is incorrect, use the BMM `replace` action at [BMM actions](howto-baremetal-functions.md) to correct the addresses.

### Ping test BMC connectivity

Attempt to run the `ping` command against the BMC IPv4 address:

1. Obtain the IPv4 address (`BMC_IP`) from the previous section "Determine the BMC IPv4 address."
1. Test `ping` to the BMC:

   To test from a jumpbox that has access to the BMC network:
   ```bash 
   ping $BMC_IP -c 3
   ```
   
   To test from a BMM control-plane host by using the Azure CLI:
   ```azurecli
   az networkcloud baremetalmachine run-read-command -g $CLUSTER_MRG -n $BMM_NAME --limit-time-seconds 60 --commands "[{command:'ping',arguments:['$BMC_IP',-c,3]}]"
   ```

### Reset the port on a fabric device

If `BMC_IP` isn't responsive, a reset of the fabric device port retriggers autonegotiation on the port and might bring it back online.

To find the `Network Fabric` port from Azure:

1. Obtain the `RackID` and `RackSlot` values from the previous section "BMM details."
1. In the Azure portal, drill down to the **Network Rack** rack ID for the BMM.
1. Select the **Network Devices** tab and then select the management (**Mgmt**) switch for the rack.
1. Under **Resources**, select **Network Interfaces**. Then select the BMC (iDRAC) or boot (PXE) interface for the port that requires a reset.

   Collect the following information:

   - Network fabric resource group (`NF_RG`)
   - Device name (`NF_DEVICE_NAME`)
   - Interface name (`NF_DEVICE_INTERFACE_NAME`)

1. Reset the port:

   To reset the port by using the Azure CLI:

   ```azurecli
   az networkfabric interface update-admin-state -g $NF_RG --network-device-name $NF_DEVICE_NAME --resource-name $NF_DEVICE_INTERFACE_NAME --state Disable
   az networkfabric interface update-admin-state -g $NF_RG --network-device-name $NF_DEVICE_NAME --resource-name $NF_DEVICE_INTERFACE_NAME --state Enable
   ```

### BMM remote power drain (flea drain)

To perform a remote flea drain against the BMM through the BMC UI:

1. Select **BMC** > **Configuration** > **BIOS Settings** > **Miscellaneous Settings**.

1. Under **Power Cycle Request**, select **Full Power Cycle**. Then select **Apply and reboot**.

Perform a remote flea drain by using `racadm` from a jumpbox that has access to the BMC network:

```bash
racadm set bios.miscsettings.powercyclerequest FullPowerCycle
racadm jobqueue create BIOS.Setup.1-1
racadm serveraction powercycle
```

### BMM physical power drain (flea drain)

For a physical flea drain, the local site hands physically disconnect the power cables from both power adapters for five minutes and then restore power. This process ensures that the server, capacitors, and all components have complete power removal and that all cached data is cleared.

### Reset NVRAM

If provisioning failed because of an OEM or hardware error, the boot sequence might be locked in NVRAM to `PXE boot` instead of showing `hdd` or `hard drive` listed first in the boot order.

This condition typically shows the BMM at the bootloader stage on the console and is blocked without manual keystroke intervention.

To reset the NVRAM, use the following sequence in the BMC UI:

1. Select **Maintenance** > **Diagnostics** > **Reset iDrac to Factory Defaults**.

1. Select **Discard All Settings, but preserve user and network settings**, and then select **Apply and reboot**.

### Reset the BMC password

If the activity log indicates invalid credentials on the BMC, run the following command from a jumpbox that has access to the BMC network:

```bash
racadm -r $BMC_IP -u $BMC_USER -p $CURRENT_PASSWORD  set iDRAC.Users.2.Password $BMC_PWD
```

## Add servers back into the cluster after a repair

After the hardware is fixed, run the BMM `replace` action by following the instructions in [Manage the lifecycle of bare metal machines](howto-baremetal-functions.md).

## Related content

- If you still have questions, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- For more information about support plans, see [Azure support plans](https://azure.microsoft.com/support/plans/response/).
