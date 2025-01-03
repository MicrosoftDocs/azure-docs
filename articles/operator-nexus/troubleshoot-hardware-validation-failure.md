---
title: Azure Operator Nexus troubleshooting hardware validation failure
description: Troubleshoot hardware validation failure for Azure Operator Nexus.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 01/26/2024
author: vnikolin
ms.author: vanjanikolin
---

# Troubleshoot hardware validation failure in an Azure Operator Nexus cluster

This article describes how to troubleshoot a failed server hardware validation (HWV). HWV is run as part of a cluster deploy action and a bare metal `replace` action. HWV validates a bare metal machine (BMM) by executing test cases against the baseboard management controller (BMC). The Azure Operator Nexus platform is deployed on Dell servers. Dell servers use the integrated Dell remote access controller (iDRAC), which is the equivalent of a BMC.

## Prerequisites

1. Collect the following information:
   - Subscription ID
   - Cluster name
   - Resource group
1. Request access to the cluster's Log Analytics workspace (LAW).
1. Access to the BMC web UI or a jumpbox that allows the `racadm` utility to run.

## Locate hardware validation results

1. Go to the cluster resource group in the subscription.
1. Expand the cluster LAW resource for the cluster.
1. Go to the **Logs** tab.
1. Fetch hardware validation results with a query against the `HWVal_CL` table, according to the following example:

   :::image type="content" source="media\hardware-validation-cluster-law.png" alt-text="Screenshot that shows the cluster LAW custom table query." lightbox="media\hardware-validation-cluster-law.png":::

## Examine hardware validation results

The HWV result for a specific server includes the following categories:

- `system_info`
- `drive_info`
- `network_info`
- `health_info`
- `boot_info`

Expand `result_detail` for a specific category to see detailed results.

## Troubleshoot specific failures

This section discusses troubleshooting for problems you might encounter.

### System info category

* Memory/RAM-related failure (`memory_capacity_GB`) (measured in GiB)
    * Memory specs are defined in the version. Memory below the threshold value indicates a missing or failed dual inline memory module (DIMM). A failed DIMM is also reflected in the `health_info` category. The following example shows a failed memory check.

        ```yaml
            {
                "field_name": "memory_capacity_GB",
                "comparison_result": "Fail",
                "expected": "512",
                "fetched": "480"
            }
        ```

    * To check memory information in the BMC web UI:

        `BMC` -> `System` -> `Memory`

    * To check memory information with `racadm`:

        ```bash
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD hwinventory | grep SysMemTotalSize
        ```

    * To troubleshoot a memory problem, contact the vendor.

* CPU-related failure (`cpu_sockets`)
    * CPU specs are defined in the version. A failed `cpu_sockets` check indicates a failed CPU or CPU count mismatch. The following example shows a failed CPU check.

        ```yaml
            {
                "field_name": "cpu_sockets",
                "comparison_result": "Fail",
                "expected": "2",
                "fetched": "1"
            }
        ```

    * To check CPU information in the BMC web UI:

        `BMC` -> `System` -> `CPU`

    * To check CPU information with `racadm`:

        ```bash
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD hwinventory | grep PopulatedCPUSockets
        ```

    * To troubleshoot a CPU problem, contact the vendor.

* Model check failure (`Model`)
    * A failed `Model` check indicates that the wrong server is racked in the slot or that there's a cabling mismatch. The following example shows a failed model check.

        ```yaml
            {
                "field_name": "Model",
                "comparison_result": "Fail",
                "expected": "R750",
                "fetched": "R650"
            }
        ```

    * To check model information in the BMC web UI:

        `BMC` -> `Dashboard` - Shows Model

    * To check model information with `racadm`:

        ```bash
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD getsysinfo | grep Model
        ```

    * To troubleshoot this problem, ensure that the server is racked in the correct location and cabled accordingly, and that the correct IP is assigned.

* Serial number check failure (`Serial_Number`)
    * The server's serial number, also referred to as the service tag, is defined in the cluster. A failed `Serial_Number` check indicates a mismatch between the serial number in the cluster and the actual serial number of the machine. The following example shows a failed serial number check.

        ```yaml
            {
                "field_name": "Serial_Number",
                "comparison_result": "Fail",
                "expected": "1234567",
                "fetched": "7654321"
            }
        ```

    * To check serial number information in the BMC web UI:

        `BMC` -> `Dashboard` - Shows Service Tag

    * To check serial number information with `racadm`:

        ```bash
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD getsysinfo | grep "Service Tag"
        ```

    * To troubleshoot this problem, ensure that the server is racked in the correct location and cabled accordingly, and that the correct IP is assigned.

* iDRAC license check failure
    * All iDRACs require a perpetual/production iDRAC datacenter or enterprise license. Trial licenses are valid for only 30 days. A failed `iDRAC License Check` indicates that the required iDRAC license is missing. The following examples show a failed iDRAC license check for a trial license and missing license, respectively.

        ```yaml
            {
                "field_name": "iDRAC License Check",
                "comparison_result": "Fail",
                "expected": "idrac9 x5 datacenter license or idrac9 x5 enterprise license - perpetual or production",
                "fetched": "iDRAC9 x5 Datacenter Trial License - Trial"
            }
        ```

        ```yaml
            {
                "field_name": "iDRAC License Check",
                "comparison_result": "Fail",
                "expected": "idrac9 x5 datacenter license or idrac9 x5 enterprise license - perpetual or production",
                "fetched": ""
            }
        ```

    * To troubleshoot this problem, contact the vendor to obtain the correct license. Apply the license by using the iDRAC web UI in the following location:

        `BMC` -> `Configuration` -> `Licenses`

* Firmware version checks
    * Firmware version checks were introduced in release 3.9. The following example shows the expected log for release versions earlier than 3.9.

      ```yaml
          {
              "system_info": {
                  "system_info_result": "Pass",
                  "result_log": [
                      "Firmware validation not supported in release 3.8"
                  ]
              },
          }
      ```
    
    * Firmware versions are determined based on the `cluster version` value in the cluster object. The following example shows a failed check because of an indeterminate cluster version. If this problem is encountered, verify the version in the cluster object.

      ```yaml
          {
              "system_info": {
                  "system_info_result": "Fail",
                  "result_log": [
                      "Unable to determine firmware release"
                  ]
              },
          }
      ```

    * Firmware versions are logged as informational. The following component firmware versions are typically logged (depending on the hardware model).
        * BIOS
        * iDRAC
        * Complex Programmable Logic Device (CPLD)
        * Redundant Array of Independent Disks (RAID) controller
        * Backplane

    * The HWV framework identifies problematic firmware versions and attempts to fix them automatically. The following example shows a successful iDRAC firmware fix. (The versions and task ID are for illustration only.)

      ```yaml
          {
              "system_info": {
                  "system_info_result": "Pass",
                  "result_detail": [
                      {
                        "field_name": "Integrated Dell Remote Access Controller - unsupported_firmware_check",
                        "comparison_result": "Pass",
                        "expected": "6.00.30.00 - unsupported_firmware",
                        "fetched": "7.10.30.00"
                      }
                  ],
                  "result_log": [
                      "Firmware autofix task /redfish/v1/TaskService/Tasks/JID_274085357727 completed"
                  ]
              },
          }
      ```

### Drive info category

* Disk checks failure
    * Drive specs are defined in the version. Mismatched capacity values indicate incorrect drives or drives inserted into incorrect slots. Missing capacity and type fetched values indicate drives that failed, are missing, or were inserted into incorrect slots.

        ```yaml
            {
                "field_name": "Disk_0_Capacity_GB",
                "comparison_result": "Fail",
                "expected": "893",
                "fetched": "3576"
            }
        ```
    
        ```yaml
            {
                "field_name": "Disk_0_Capacity_GB",
                "comparison_result": "Fail",
                "expected": "893",
                "fetched": ""
            }
        ```
    
        ```yaml
            {
                "field_name": "Disk_0_Type",
                "comparison_result": "Fail",
                "expected": "SSD",
                "fetched": ""
            }
        ```
    
    * To check disk information in the BMC web UI:

        `BMC` -> `Storage` -> `Physical Disks`

    * To check disk information with `racadm`:

        ```bash
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD raid get pdisks -o -p State,Size
        ```

    * To troubleshoot, ensure that disks are inserted in the correct slots. If the problem persists, contact the vendor.

### Network info category

* Network interface cards (NICs) check failure
    * Dell server NIC specs are defined in the version. A mismatched link status indicates loose or faulty cabling or crossed cables. A mismatched model indicates that an incorrect NIC card is inserted into a slot. Missing link or model fetched values indicate NICs that failed, are missing, or were inserted into incorrect slots.

        ```yaml
            {
                "field_name": "NIC.Slot.3-1-1_LinkStatus",
                "comparison_result": "Fail",
                "expected": "Up",
                "fetched": "Down"
            }
        ```
    
        ```yaml
            {
                "field_name": "NIC.Embedded.2-1-1_LinkStatus",
                "comparison_result": "Fail",
                "expected": "Down",
                "fetched": "Up"
            }
        ```
    
        ```yaml
            {
                "field_name": "NIC.Slot.3-1-1_Model",
                "comparison_result": "Fail",
                "expected": "ConnectX-6",
                "fetched": "BCM5720"
            }
        ```
    
        ```yaml
            {
                "field_name": "NIC.Slot.3-1-1_LinkStatus",
                "comparison_result": "Fail",
                "expected": "Up",
                "fetched": ""
            }
        ```
    
        ```yaml
            {
                "field_name": "NIC.Slot.3-1-1_Model",
                "comparison_result": "Fail",
                "expected": "ConnectX-6",
                "fetched": ""
            }
        ```
    
    * To check NIC information in the BMC web UI:

        `BMC` -> `System` -> `Network Devices`

    * To check all NIC information with `racadm`:

        ```bash
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD hwinventory NIC
        ```

    * To check a specific NIC with `racadm`, provide the fully qualified device descriptor:

        ```bash
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD hwinventory NIC.Embedded.1-1-1
        ```

    * To troubleshoot, ensure that servers are cabled correctly and that ports are linked up. Bounce the port on the fabric. Perform a flea drain. If the problem persists, contact the vendor.

* NIC check Layer 2 switch information
    * HWV reports Layer 2 switch information for each of the server interfaces. The switch connection ID (switch interface MAC) and switch port connection ID (switch interface label) are informational.

        ```yaml
            {
                "field_name": "NIC.Slot.3-1-1_SwitchConnectionID",
                "comparison_result": "Info",
                "expected": "unknown",
                "fetched": "c0:d6:82:23:0c:7d"
            }
        ```
    
        ```yaml
            {
                "field_name": "NIC.Slot.3-1-1_SwitchPortConnectionID",
                "comparison_result": "Info",
                "expected": "unknown",
                "fetched": "Ethernet10/1"
            }
        ```

* Cabling checks for bonded interfaces
    * Mismatched cabling is reported in `result_log`. A cable check validates that bonded NICs connect to switch ports with the same port ID. In the following example, peripheral component interconnect (PCI) 3/1 and 3/2 connect to `Ethernet1/1` and `Ethernet1/3`, respectively, on TOR, which triggers a failure for HWV.

      ```yaml
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

    * To fix the problem, insert cables into the correct interfaces.

* iDRAC (BMC) MAC address check failure
    * The iDRAC MAC address is defined in the cluster for each BMM. A failed `iDRAC_MAC` check indicates a mismatch between the iDRAC/BMC MAC in the cluster and the actual MAC address retrieved from the machine.

        ```yaml
            {
                "field_name": "iDRAC_MAC",
                "comparison_result": "Fail",
                "expected": "aa:bb:cc:dd:ee:ff",
                "fetched": "aa:bb:cc:dd:ee:gg"
            }
        ```

    * To troubleshoot this problem, ensure that the correct MAC address is defined in the cluster. If the MAC is correct in the cluster object, attempt a flea drain. If the problem persists, ensure that the server is racked in the correct location, cabled accordingly, and that the correct IP is assigned.

* Preboot eXecution Environment (PXE) MAC address check failure
    * The PXE MAC address is defined in the cluster for each BMM. A failed `PXE_MAC` check indicates a mismatch between the PXE MAC in the cluster and the actual MAC address retrieved from the machine.

        ```yaml
            {
                "field_name": "NIC.Embedded.1-1_PXE_MAC",
                "comparison_result": "Fail",
                "expected": "aa:bb:cc:dd:ee:ff",
                "fetched": "aa:bb:cc:dd:ee:gg"
            }
        ```

    * To troubleshoot this problem, ensure that the correct MAC address is defined in the cluster. If the MAC is correct in the cluster object, attempt a flea drain. If the problem persists, ensure that the server is racked in the correct location, cabled accordingly, and that the correct IP is assigned.

### Health info category

* Health check sensor failure
    * Server health checks cover various hardware component sensors. A failed health sensor indicates a problem with the corresponding hardware component. The following examples indicate fan, drive, and CPU failures, respectively.

        ```yaml
            {
                "field_name": "System Board Fan1A",
                "comparison_result": "Fail",
                "expected": "Enabled-OK",
                "fetched": "Enabled-Critical"
            }
        ```
    
        ```yaml
            {
                "field_name": "Solid State Disk 0:1:1",
                "comparison_result": "Fail",
                "expected": "Enabled-OK",
                "fetched": "Enabled-Critical"
            }
        ```
    
        ```yaml
            {
                "field_name": "CPU.Socket.1",
                "comparison_result": "Fail",
                "expected": "Enabled-OK",
                "fetched": "Enabled-Critical"
            }
        ```
    
     * To check health information in the BMC web UI:

        `BMC` -> `Dashboard` - Shows Health Information

    * To check health information with `racadm`:

        ```bash
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD getsensorinfo
        ```

    * To troubleshoot a server health failure, contact the vendor.

* Health check lifecycle (LC) log failures
    * Dell server health checks fail for recent LC Log Critical Alarms. The hardware validation plugin logs the alarm ID, name, and time stamp. Recent critical alarms indicate the need for further investigation. The following example shows a failure for a critical backplane voltage alarm.

        ```yaml
            {
                "field_name": "LCLog_Critical_Alarms",
                "comparison_result": "Fail",
                "expected": "No Critical Errors",
                "fetched": "53539 2023-07-22T23:44:06-05:00 The system board BP1 PG voltage is outside of range."
            }
        ```

    * Virtual disk errors typically indicate a RAID cleanup false positive condition. They're logged because of the timing of the RAID cleanup and system power off before HWV. The following example shows an LC log critical error on virtual disk 238. If you encounter multiple errors that block deployment, delete the cluster, wait two hours, and then reattempt cluster deployment. If the failures aren't blocking deployment, wait two hours, and then run BMM `replace`.
    * Virtual disk errors are allow-listed starting with release 3.13 and don't trigger a health check failure.

        ```yaml
            {
                "field_name": "LCLog_Critical_Alarms",
                "comparison_result": "Fail",
                "expected": "No Critical Errors",
                "fetched": "104473 2024-07-26T16:05:19-05:00 Virtual Disk 238 on RAID Controller in SL 3 has failed."
            }
        ```

    * Allow-listed critical alarms and warning alarms are logged as informational starting with Azure Operator Nexus release 3.14.

        ```yaml
            {
                "field_name": "LCLog_Warning_Alarms - Non-Failing",
                "comparison_result": "Info",
                "expected": "Warning Alarm",
                "fetched": "104473 2024-07-26T16:05:19-05:00 The Embedded NIC 1 Port 1 network link is down."
            }
        ```

    * To check LC logs in the BMC web UI:

        `BMC` -> `Maintenance` -> `Lifecycle Log`

    * To check LC Log Critical Alarms with `racadm`:

        ```bash
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD lclog view -s critical
        ```

    * If `Backplane Comm` critical errors are logged, perform a flea drain. Contact the vendor to troubleshoot any other LC log critical failures.

* Health check server power control action failures
    * Dell server health checks fail for failed server power-up or failed iDRAC reset. A failed server control action indicates an underlying hardware issue. The following example shows a failed power-on attempt.

        ```yaml
            {
                "field_name": "Server Control Actions",
                "comparison_result": "Fail",
                "expected": "Success",
                "fetched": "Failed"
            }
        ```
    
        ```yaml
            "result_log": [
              "Server power up failed with: server OS is powered off after successful power on attempt",
            ]
        ```

    * To power on a server in the BMC web UI:

        `BMC` -> `Dashboard` -> `Power On System`

    * To power on a server with `racadm`:

        ```bash
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD serveraction powerup
        ```

    * To troubleshoot server power-on failure, attempt a flea drain. If the problem persists, contact the vendor.

* Virtual flea drain
    * HWV attempts a virtual flea drain for most failing checks. Flea drain attempts are logged under `health_info` > `result_log`.

        ```yaml
            "result_log": [
              "flea drain completed successfully",
            ]
        ```

    * If the virtual flea drain fails, perform a physical flea drain as a first troubleshooting step.

* RAID cleanup failures
    * As part of a RAID cleanup, the RAID controller configuration is reset. The Dell server health check fails for a RAID controller reset failure. A failed RAID cleanup action indicates an underlying hardware issue. The following example shows a failed RAID controller reset.

        ```yaml
            {
                "field_name": "Server Control Actions",
                "comparison_result": "Fail",
                "expected": "Success",
                "fetched": "Failed"
            }
        ```
    
        ```yaml
            "result_log": [
              "RAID cleanup failed with: raid deletion failed after 2 attempts",
            ]
        ```

    * To clear a RAID in the BMC web UI:

        Select **BMC** > **Dashboard** > **Storage** > **Controllers** > **Actions** > **Reset Configuration**.

    * To clear a RAID with `racadm`, check for RAID controllers and then clear config:

        ```bash
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD storage get controllers | grep "RAID"
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BC_PWD storage resetconfig:RAID.SL.3-1         #substitute with RAID controller from get command
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BC_PWD jobqueue create RAID.SL.3-1 --realtime  #substitute with RAID controller from get command
        ```

    * To troubleshoot RAID cleanup failure, check for any logged errors. For Dell R650/660, ensure that only slots 0 and 1 contain physical drives. For Dell R750/760, ensure that only slots 0 through 3 contain physical drives. For any other models, confirm that no extra drives are inserted based on the version definition. All extra drives should be removed to align with the version. If the problem persists, contact the vendor.
    * You can ignore BMC virtual disk critical alerts triggered during the HWV.

* Health check power supply failure and redundancy considerations
    * Dell server health checks warn when one power supply is missing or failed. Power supply `field_name` might appear as 0/PS0/Power Supply 0 and 1/PS1/Power Supply 1 for the first and second power supplies, respectively. A failure of one power supply doesn't trigger an HWV device failure.

        ```yaml
            {
                "field_name": "Power Supply 1",
                "comparison_result": "Warning",
                "expected": "Enabled-OK",
                "fetched": "UnavailableOffline-Critical"
            }
        ```
    
        ```yaml
            {
                "field_name": "System Board PS Redundancy",
                "comparison_result": "Warning",
                "expected": "Enabled-OK",
                "fetched": "Enabled-Critical"
            }
        ```

    * To check power supplies in the BMC web UI:

        Select **BMC** > **System** > **Power**.

    * To check power supplies with `racadm`:

        ```bash
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD getsensorinfo | grep PS
        ```

    * Reseating the power supply might fix the problem. If alarms persist, contact the vendor.

### Boot info category

* Boot device name check considerations
    * The `boot_device_name` check is currently informational.
    * A mismatched boot device name shouldn't trigger a device failure.

        ```yaml
            {
                "field_name": "boot_device_name",
                "comparison_result": "Info",
                "expected": "NIC.PxeDevice.1-1",
                "fetched": "NIC.PxeDevice.1-1"
            }
        ```

* PXE device checks considerations
    * This check validates the PXE device settings.
    * Starting with the 2024-07-01 GA API version, HWV attempts to automatically fix the BIOS boot configuration.
    * Failed `pxe_device_1_name` or `pxe_device_1_state` checks indicate a problem with the PXE configuration.
    * Failed settings must be fixed to enable system boot during deployment.

        ```yaml
            {
                "field_name": "pxe_device_1_name",
                "comparison_result": "Fail",
                "expected": "NIC.Embedded.1-1-1",
                "fetched": "NIC.Embedded.1-2-1"
            }
        ```
    
        ```yaml
            {
                "field_name": "pxe_device_1_state",
                "comparison_result": "Fail",
                "expected": "Enabled",
                "fetched": "Disabled"
            }
        ```

    * To update the PXE device state and name in the BMC web UI, set the value and then select **Apply** > **Apply and reboot**:

        `BMC` -> `Configuration` -> `BIOS Settings` -> `Network Settings` -> `PXE Device1` -> `Enabled`  
        `BMC` -> `Configuration` -> `BIOS Settings` -> `Network Settings` -> `PXE Device1 Settings` -> `Interface` -> `Embedded NIC 1 Port 1 Partition 1`  
    
    * To update the PXE device state and name with `racadm`, run the following commands:

        ```bash
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD set bios.NetworkSettings.PxeDev1EnDis Enabled
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD set bios.PxeDev1Settings.PxeDev1Interface NIC.Embedded.1-1-1
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD jobqueue create BIOS.Setup.1-1
            racadm --nocertwarn -r $IP -u $BMC_USR -p $BMC_PWD serveraction powercycle
        ```

### Device login check

* Device login check considerations
    * The `device_login` check fails if the iDRAC isn't reachable or if the hardware validation plugin can't sign in.

        ```yaml
            {
                "device_login": "Fail - Unreachable"
            }
        ```
    
        ```yaml
            {
                "device_login": "Fail - Unauthorized"
            }
        ```

    * To set a password in the BMC web UI:

        `BMC` -> `iDRAC Settings` -> `Users` -> `Local Users` -> `Edit`

    * To set a password with `racadm`:

        ```bash
            racadm -r $BMC_IP -u $BMC_USER -p $CURRENT_PASSWORD  set iDRAC.Users.2.Password $BMC_PWD
        ```

    * To troubleshoot, ping the iDRAC from a jumpbox with access to the BMC network. If the iDRAC pings, check that the passwords match.

## Add servers back into the cluster after a repair

After the hardware is fixed, run the BMM `replace` action by following the instructions in [Manage the lifecycle of bare metal machines](howto-baremetal-functions.md).

## Related content

- If you still have questions, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- For more information about support plans, see [Azure support plans](https://azure.microsoft.com/support/plans/response/).
