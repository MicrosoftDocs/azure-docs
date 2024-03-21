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
            "expected": "unknown",
            "fetched": "c0:d6:82:23:0c:7d",
            "comparison_result": "Info"
        }
    ```

    ```json
        {
            "field_name": "NIC.Slot.3-1-1_SwitchPortConnectionID",
            "expected": "unknown",
            "fetched": "Ethernet10/1",
            "comparison_result": "Info"
        }
    ```

* Release 3.6 introduced cable checks for bonded interfaces.
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
                  "Cabling problem detected on PCI Slot 3"
              ]
          },
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
            "expected": "No Critical Errors",
            "fetched": "53539 2023-07-22T23:44:06-05:00 The system board BP1 PG voltage is outside of range.",
            "comparison_result": "Fail"
        }
    ```

* Health Check Server Power Action Failures
    * Dell server health check fail for failed server power-up or failed iDRAC reset.
    * A failed server control action indicates an underlying hardware issue.
    * The following example shows failed power on attempt.

    ```json
        {
            "field_name": "Server Control Actions",
            "expected": "Success",
            "fetched": "Failed",
            "comparison_result": "Fail"
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
            "expected": "Enabled-OK",
            "fetched": "UnavailableOffline-Critical",
            "comparison_result": "Warning"
        }
    ```

    ```json
        {
            "field_name": "System Board PS Redundancy",
            "expected": "Enabled-OK",
            "fetched": "Enabled-Critical",
            "comparison_result": "Warning"
        }
    ```

### Boot info category

* Boot Device Check Considerations
    * The `boot_device_name` check is currently informational.
    * Mismatched boot device name shouldn't trigger a device failure.

    ```json
        {
            "comparison_result": "Info",
            "expected": "NIC.PxeDevice.1-1",
            "fetched": "NIC.PxeDevice.1-1",
            "field_name": "boot_device_name"
        }
    ```

* PXE Device Check Considerations
    * This check validates the PXE device settings.
    * Failed `pxe_device_1_name` or `pxe_device_1_state` checks indicate a problem with the PXE configuration.
    * Failed settings need to be fixed to enable system boot during deployment.

    ```json
        {
            "field_name": "pxe_device_1_name",
            "expected": "NIC.Embedded.1-1-1",
            "fetched": "NIC.Embedded.1-2-1",
            "comparison_result": "Fail"
        }
    ```

    ```json
        {
            "field_name": "pxe_device_1_state",
            "expected": "Enabled",
            "fetched": "Disabled",
            "comparison_result": "Fail"
        }
    ```

## Adding servers back into the Cluster after a repair

After Hardware is fixed, run BMM Replace following instructions from the following page [BMM actions](howto-baremetal-functions.md).



