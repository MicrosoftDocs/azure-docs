---
title: Azure Operator Nexus troubleshooting hardware validation failure
description: Troubleshoot Hardware Validation Failure for Azure Operator Nexus.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 01/26/2024
author: vnikolin
ms.author: vanjanikolin
---

# Troubleshoot hardware validation failure in Nexus Cluster

This article describes how to troubleshoot a failed server hardware validation. Hardware validation is run as part of cluster deploy action.

## Prerequisites

- Gather the following information:
  - Subscription ID
  - Cluster name and resource group
- The user needs access to the Cluster's Log Analytics Workspace (LAW)

## Locating hardware validation results

1. Navigate to cluster resource group in the subscription
2. Expand the cluster Log Analytics Workspace (LAW) resource for the cluster
3. Navigate to the Logs tab
4. Hardware validation results can be fetched with a query against the HWVal_CL table as per the following example

:::image type="content" source="media\hardware-validation-cluster-law.png" alt-text="Screenshot of cluster LAW custom table query." lightbox="media\hardware-validation-cluster-law.png":::

## Examining hardware validation results

The Hardware Validation result for a given server includes the following categories.

- system_info
- drive_info
- network_info
- health_info
- boot_info

Expanding `result_detail` for a given category shows detailed results.

## Troubleshooting specific failures

### System info category

* Memory/RAM related failure (memory_capacity_GB)
    * Memory specs are defined in the SKU.
    * Memory below threshold value indicates missing or failed DIMM(s). Failed DIMM(s) would also be reflected in the `health_info` category.

    ```json
        {
            "field_name": "memory_capacity_GB",
            "comparison_result": "Fail",
            "expected": "512",
            "fetched": "480"
        }
    ```

* CPU Related Failure (cpu_sockets)
    * CPU specs are defined in the SKU.
    * Failed `cpu_sockets` check indicates a failed CPU or CPU count mismatch.

    ```json
        {
            "field_name": "cpu_sockets",
            "comparison_result": "Fail",
            "expected": "2",
            "fetched": "1"
        }
    ```

* Model Check Failure (Model)
    * Failed `Model` check indicates that wrong server is racked in the slot or there's a cabling mismatch.

    ```json
        {
            "field_name": "Model",
            "comparison_result": "Fail",
            "expected": "R750",
            "fetched": "R650"
        }
    ```

* Serial Number Check Failure (Serial_Number)
    * The server's serial number is defined in the cluster.
    * Failed `Serial_Number` check indicates a mismatch between the serial number in the cluster and the actual serial number of the machine.

    ```json
        {
            "field_name": "Serial_Number",
            "comparison_result": "Fail",
            "expected": "1234567",
            "fetched": "7654321"
        }
    ```

* iDRAC License Check
    * To enable necessary functionality all iDRACs require a perpetual/production iDRAC9 datacenter or enterprise license.
    * Trial licenses are valid for only 30 days.
    * Failed `iDRAC License Check` indicates that the required iDRAC license is missing.
    * The following examples show a failed iDRAC license check for a trial license and missing license respectively.

    ```json
        {
            "field_name": "iDRAC License Check",
            "comparison_result": "Fail",
            "expected": "idrac9 x5 datacenter license or idrac9 x5 enterprise license - perpetual or production",
            "fetched": "iDRAC9 x5 Datacenter Trial License - Trial"
        }
    ```

    ```json
        {
            "field_name": "iDRAC License Check",
            "comparison_result": "Fail",
            "expected": "idrac9 x5 datacenter license or idrac9 x5 enterprise license - perpetual or production",
            "fetched": ""
        }
    ```


### Drive info category

* Disk Check Failure
    * Drive specs are defined in the SKU
    * Mismatched capacity values indicate incorrect drives or drives inserted in to incorrect slots.
    * Missing capacity and type fetched values indicate drives that are failed, missing or inserted in to incorrect slots.

    ```json
        {
            "field_name": "Disk_0_Capacity_GB",
            "comparison_result": "Fail",
            "expected": "893",
            "fetched": "3576"
        }
    ```

    ```json
        {
            "field_name": "Disk_0_Capacity_GB",
            "comparison_result": "Fail",
            "expected": "893",
            "fetched": ""
        }
    ```

    ```json
        {
            "field_name": "Disk_0_Type",
            "comparison_result": "Fail",
            "expected": "SSD",
            "fetched": ""
        }
    ```

### Network info category

* NIC Check Failure
    * Dell server NIC specs are defined in the SKU.
    * Mismatched link status indicates loose or faulty cabling or crossed cables.
    * Mismatched model indicates incorrect NIC card is inserted in to slot.
    * Missing link/model fetched values indicate NICs that are failed, missing or inserted in to incorrect slots.

    ```json
        {
            "field_name": "NIC.Slot.3-1-1_LinkStatus",
            "comparison_result": "Fail",
            "expected": "Up",
            "fetched": "Down"
        }
    ```

    ```json
        {
            "field_name": "NIC.Embedded.2-1-1_LinkStatus",
            "comparison_result": "Fail",
            "expected": "Down",
            "fetched": "Up"
        }
    ```

    ```json
        {
            "field_name": "NIC.Slot.3-1-1_Model",
            "comparison_result": "Fail",
            "expected": "ConnectX-6",
            "fetched": "BCM5720"
        }
    ```

    ```json
        {
            "field_name": "NIC.Slot.3-1-1_LinkStatus",
            "comparison_result": "Fail",
            "expected": "Up",
            "fetched": ""
        }
    ```

    ```json
        {
            "field_name": "NIC.Slot.3-1-1_Model",
            "comparison_result": "Fail",
            "expected": "ConnectX-6",
            "fetched": ""
        }
    ```

* NIC Check L2 Switch Information
    * HW Validation reports L2 switch information for each of the server interfaces.
    * The switch connection ID (switch interface MAC) and switch port connection ID (switch interface label) are informational.

    ```json
        {
            "field_name": "NIC.Slot.3-1-1_SwitchConnectionID",
            "comparison_result": "Info",
            "expected": "unknown",
            "fetched": "c0:d6:82:23:0c:7d"
        }
    ```

    ```json
        {
            "field_name": "NIC.Slot.3-1-1_SwitchPortConnectionID",
            "comparison_result": "Info",
            "expected": "unknown",
            "fetched": "Ethernet10/1"
        }
    ```

* Cabling Checks for Bonded Interfaces
    * Mismatched cabling is reported in the result_log.
    * Cable check validates that that bonded NICs connect to switch ports with same Port ID. In the following example PCI 3/1 and 3/2 connect to "Ethernet1/1" and "Ethernet1/3" respectively on TOR, triggering a failure for HWV.

  ```json
      {
          "network_info": {
              "network_info_result": "Fail",
              "result_detail": [
                  {
                      "field_name": "NIC.Slot.3-1-1_SwitchPortConnectionID",
                      "fetched": "Ethernet1/1",
                  },
                  {
                      "field_name": "NIC.Slot.3-2-1_SwitchPortConnectionID",
                      "fetched": "Ethernet1/3",
                  }
              ],
              "result_log": [
                  "Cabling problem detected on PCI Slot 3 - server NIC.Slot.3-1-1 connected to switch Ethernet1/1 - server NIC.Slot.3-2-1 connected to switch Ethernet1/3"
              ]
          },
      }
  ```

* iDRAC (BMC) MAC Address Check Failure
    * The iDRAC MAC address is defined in the cluster for each BMM.
    * A failed `iDRAC_MAC` check indicates a mismatch between the iDRAC/BMC MAC in the cluster and the actual MAC address retrieved from the machine.

    ```json
        {
            "field_name": "iDRAC_MAC",
            "comparison_result": "Fail",
            "expected": "aa:bb:cc:dd:ee:ff",
            "fetched": "aa:bb:cc:dd:ee:gg"
        }
    ```

* PXE MAC Address Check Failure
    * The PXE MAC address is defined in the cluster for each BMM.
    * A failed `PXE_MAC` check indicates a mismatch between the PXE MAC in the cluster and the actual MAC address retrieved from the machine.

    ```json
        {
            "field_name": "NIC.Embedded.1-1_PXE_MAC",
            "comparison_result": "Fail",
            "expected": "aa:bb:cc:dd:ee:ff",
            "fetched": "aa:bb:cc:dd:ee:gg"
        }
    ```

### Health info category

* Health Check Sensor Failure
    * Server health checks cover various hardware component sensors.
    * A failed health sensor indicates a problem with the corresponding hardware component.
    * The following examples indicate fan, drive and CPU failures respectively.

    ```json
        {
            "field_name": "System Board Fan1A",
            "comparison_result": "Fail",
            "expected": "Enabled-OK",
            "fetched": "Enabled-Critical"
        }
    ```

    ```json
        {
            "field_name": "Solid State Disk 0:1:1",
            "comparison_result": "Fail",
            "expected": "Enabled-OK",
            "fetched": "Enabled-Critical"
        }
    ```

    ```json
        {
            "field_name": "CPU.Socket.1",
            "comparison_result": "Fail",
            "expected": "Enabled-OK",
            "fetched": "Enabled-Critical"
        }
    ```

* Health Check Lifecycle Log (LC Log) Failures
    * Dell server health checks fail for recent Critical LC Log Alarms.
    * The hardware validation plugin logs the alarm ID, name, and timestamp.
    * Recent LC Log critical alarms indicate need for further investigation.
    * The following example shows a failure for a critical Backplane voltage alarm.

    ```json
        {
            "field_name": "LCLog_Critical_Alarms",
            "comparison_result": "Fail",
            "expected": "No Critical Errors",
            "fetched": "53539 2023-07-22T23:44:06-05:00 The system board BP1 PG voltage is outside of range."
        }
    ```

* Health Check Server Power Action Failures
    * Dell server health check fail for failed server power-up or failed iDRAC reset.
    * A failed server control action indicates an underlying hardware issue.
    * The following example shows failed power on attempt.

    ```json
        {
            "field_name": "Server Control Actions",
            "comparison_result": "Fail",
            "expected": "Success",
            "fetched": "Failed"
        }
    ```

    ```json
        "result_log": [
          "Server power up failed with: server OS is powered off after successful power on attempt",
        ]
    ```

* Health Check Power Supply Failure and Redundancy Considerations
    * Dell server health checks warn when one power supply is missing or failed.
    * Power supply "field_name" might be displayed as 0/PS0/Power Supply 0 and 1/PS1/Power Supply 1 for the first and second power supplies respectively.
    * A failure of one power supply doesn't trigger an HW validation device failure.

    ```json
        {
            "field_name": "Power Supply 1",
            "comparison_result": "Warning",
            "expected": "Enabled-OK",
            "fetched": "UnavailableOffline-Critical"
        }
    ```

    ```json
        {
            "field_name": "System Board PS Redundancy",
            "comparison_result": "Warning",
            "expected": "Enabled-OK",
            "fetched": "Enabled-Critical"
        }
    ```

### Boot info category

* Boot Device Name Check Considerations
    * The `boot_device_name` check is currently informational.
    * Mismatched boot device name shouldn't trigger a device failure.

    ```json
        {
            "field_name": "boot_device_name",
            "comparison_result": "Info",
            "expected": "NIC.PxeDevice.1-1",
            "fetched": "NIC.PxeDevice.1-1"
        }
    ```

* Boot Device State Check Considerations
    * A failed `boot_device_state` check indicates that the boot device is in a disabled state.

    ```json
        {
            "field_name": "boot_device_state",
            "comparison_result": "Fail",
            "expected": "enabled",
            "fetched": "disabled"
        }
    ```

* PXE Device Check Considerations
    * This check validates the PXE device settings.
    * Failed `pxe_device_1_name` or `pxe_device_1_state` checks indicate a problem with the PXE configuration.
    * Failed settings need to be fixed to enable system boot during deployment.

    ```json
        {
            "field_name": "pxe_device_1_name",
            "comparison_result": "Fail",
            "expected": "NIC.Embedded.1-1-1",
            "fetched": "NIC.Embedded.1-2-1"
        }
    ```

    ```json
        {
            "field_name": "pxe_device_1_state",
            "comparison_result": "Fail",
            "expected": "Enabled",
            "fetched": "Disabled"
        }
    ```

    * To update the PXE device state ane name in BMC webui set the value in the following location below then select `Apply` followed by `Apply And Reboot`:

        `BMC` -> `Configuration` -> `BIOS Settings` -> `Network Settings` -> `PXE Device1` -> `Enabled`
        `BMC` -> `Configuration` -> `BIOS Settings` -> `Network Settings` -> `PXE Device1 Settings` -> `Interface` -> `Embedded NIC 1 Port 1 Partition 1`  
    
    * To update the PXE device name and state with racadm perform the following:

    ```bash
        racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD set bios.NetworkSettings.PxeDev1EnDis Enabled
        racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD set bios.PxeDev1Settings.PxeDev1Interface NIC.Embedded.1-1-1
        racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD jobqueue create BIOS.Setup.1-1
        racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD serveraction powercycle
    ```

## Adding servers back into the Cluster after a repair

After Hardware is fixed, run BMM Replace following instructions from the following page [BMM actions](howto-baremetal-functions.md).



