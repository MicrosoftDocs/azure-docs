---
title: Monitor the Azure FXT Edge Filer 
description: How to monitor hardware status for the Azure FXT Edge Filer hybrid storage cache
author: ekpgh
ms.service: fxt-edge-filer
ms.topic: conceptual
ms.date: 06/20/2019
ms.author: v-erkell
---

# Monitor Azure FXT Edge Filer hardware status

The Azure FXT Edge Filer hybrid storage cache system has multiple status lights built in to the chassis to help administrators understand how the hardware is functioning.

## System health status

To monitor cache operations at a higher level, use the software Control Panel's **Dashboard** page, as described in the [Control Panel Dashboard Guide](https://azure.github.io/Avere/legacy/dashboard/4_7/html/ops_dashboard_index.html)

## Hardware status LEDs

This section explains the various status lights built in to the Azure FXT Edge Filer hardware.

### Hard drive status LEDs

![picture of hard drive front, horizontal, with callout labels 2 (top left corner), 1 (lower left corner), and 3 (right side)](media/fxt-monitor/fxt-drive-callouts.png)

Each drive carrier has two status LEDs: an activity indicator (1) and a status indicator (2). 

* The activity LED (1) lights when the drive is in use.  
* The status LED (2) indicates the condition of the drive by using the codes in the table below.

| Drive status LED state              | Meaning  |
|-------------------------------------|----------------------------------------------------------|
| Flashes green twice per second      | Identifying drive *or* <br> Preparing drive for removal  |
| Off (unlit)                         | System has not finished startup *or* <br>Drive is ready to be removed |
| Flashes green, amber, and off       | Drive failure is predicted   |
| Flashes amber four times per second | Drive failed   |
| Solid green                         | Drive is online |

The right side of the drive (3) is labeled with the drive's capacity and other information.

Drive numbers are printed on the space between drives. In the Azure FXT Edge Filer, drive 0 is the top left drive, and drive 1 is directly underneath it. Numbering continues in that pattern. 

![photo of one hard drive bay in the FXT chassis, showing drive numbers and capacity labels](media/fxt-drives-photo.png)

## Left control panel

The left front control panel has various status LED indicators (1) and a large lighted system health indicator (2). 

![left status panel, with 1 labeling status indicators on the left, and 2 labeling the large system health indicator light on the right](media/fxt-monitor/fxt-control-panel-left.jpg)

### Control panel status indicators 

The status indicators at left show a solid amber light if there is an error in that system. The table below describes possible causes and solutions for the errors. 

If you still have the error after trying these solutions, [contact support](fxt-support-ticket.md) for help. 

| Icon | Description | Error condition | Possible solutions |
|----------------|---------------|--------------------|----------------------|
| ![drive icon](media/fxt-monitor/fxt-hd-icon.jpg) | Drive status | Drive error | Check the System Event Log to determine if the drive has an error, or <br>Run the appropriate online diagnostics test; restart the system and run embedded diagnostics (ePSA), or <br>If the drives are configured in a RAID array, restart the system and enter the host adapter configuration utility program |
|![temperature icon](media/fxt-monitor/fxt-temp-icon.jpg) | Temperature status | Thermal error - for example, a fan has failed or ambient temperature is out of range | Check for the following addressable conditions: <br>A cooling fan is missing or has failed <br>The system's cover, air shroud, memory module blank, or back filler bracket is removed <br>The ambient temperature is too high <br>External airflow is obstructed |
|![electricity icon](media/fxt-monitor/fxt-electric-icon.jpg) | Electrical status | Electrical error - for example, voltage out of range, failed PSU, or a failed voltage regulator |  Check the system event log or system messages for the specific issue. If there is a PSU problem, check the PSU status LED and reseat the PSU if needed. | 
|![memory icon](media/fxt-monitor/fxt-memory-icon.jpg) | Memory status | Memory error | Check the system event log or system messages for the location of the failed memory; reseat the memory module. |
|![PCIe icon](media/fxt-monitor/fxt-pcie-icon.jpg) | PCIe status | PCIe card error | Restart the system; update PCIe card drivers; reinstall the card |


### System health status indicator

The large lit button at the right of the left control panel indicates overall system status and also is used as a unit locator light in system ID mode.

Press the system health and ID button to switch between system ID mode and system health mode.

|System health status state | Condition |
|-------------------------------------------|-----------------------------------------------|
| Solid blue | Normal operation: the system is turned on, operating normally, and system ID mode is not active. <br/>Press the system health and ID button if you want to switch to system ID mode. |
| Blinking blue | System ID mode is active. Press the system health and system ID button if you want to switch to system health mode. |
| Solid amber | The system is in fail-safe mode. If the problem persists, [contact Microsoft Customer Service and Support](fxt-support-ticket.md). |
| Blinking amber | System fault. Check the system event log for specific error messages. For information about the event and error messages generated by the system firmware and agents that monitor system components, see the Error Code Lookup page at qrl.dell.com. |


