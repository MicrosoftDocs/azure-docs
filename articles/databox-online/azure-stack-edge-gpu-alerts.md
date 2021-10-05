---
title: Review alerts on Azure Stack Edge Pro GPU 
description: Describes alerts that can occur on Azure Stack Edge Pro GPU device.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 10/05/2021
ms.author: alkohli
---
# Review alerts on an Azure Stack Edge Pro GPU device

This article describes alerts that occur on an Azure Stack Edge Pro GPU device and steps to take when you receive the alert. The alerts generate notifications in the Azure portal.

> [!NOTE]
> You can also monitor activity logs for virtual machines in the Azure portal. For more information, see [Monitor VM activity on your device](azure-stack-edge-gpu-monitor-virtual-machine-activity.md).


## Alerts quick reference

The following tables list some of the Microsoft Azure Stack Edge alerts that you might encounter, as well as additional information and recommendations where available. Azure Stack Edge device alerts fall into one of the following categories:

* Cloud connectivity alerts
* Edge compute alerts - *Resolve multiples.*
* FPGA Edge compute alerts - *Resolve multiples.*
* Local Azure Resource Manager alerts
* Minimum configuration alerts
* Performance alerts


### Cloud connectivity alerts

| Alert text                       | Severity | Description / Recommended action |
|----------------------------------|----------|----------------------------------|
| Could not connect to the Azure.  | Critical | Check your internet connection. In the local web UI of the device, go to **Troubleshooting** > **Diagnostic tests**. Run the **Internet connectivity** diagnostic test. |
| Lost heartbeat from your device. | Critical | If your device is offline, then the device is not able to communicate with the Azure service. This could be due to one of the following reasons:<ul><li>The Internet connectivity is broken.<br>Check your internet connection. In the local web UI of the device, go to **Troubleshooting** > **Diagnostic tests**. Run the diagnostic tests. Resolve the reported issues.</li><li>The device is turned off or paused on the hypervisor. Turn on your device! For more information, go to [Manage power](..\databox-gateway\data-box-gateway-manage-access-power-connectivity-mode.md#manage-power).</li><li>Your device could have rebooted due to an update. Wait a few minutes and try to reconnect.</li></ul>|

### Edge compute alerts

*Resolve multiples before porting in table.*

### FPGA Edge compute alerts

*Resolve multiple before porting in table.*

### Local Azure Resource Manager alerts

|Alert text |Severity |Description / Recommended action |
|-----------|---------|---------------------------------|
|Specified service authentication certificate with thumbprint '{0}' does not have a private key |Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|Certificate with thumbprint '{0}' at location '{1}' is not found or not accessible. |Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|Unable to connect endpoint: '{0}' |Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|Error occurred during web request: '{0}' |Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|Request timed out for url: '{0}' |Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|Unable to get Token using login endpoint '{0}' for resource '{1}' |Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|Unknown error occurred. ErrorCode:'{0}'. Details: '{1}' | Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|Could not start the VM service on the device. |Critical | If you see this alert, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|VM service is not running on the device. |Critical |If you see this alert, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |


### Minimum configuration alerts

*Do virtual devices = VMs?*

|Alert text |Severity |Description / Recommended action |
|-----------|---------|---------------------------------|
|The virtual device doesn't meet the minimum configuration requirements. The minimum virtual processor requirement is {0}, but the device has only {1}. |Critical |Increase the number of virtual processors on the virtual device to meet the minimum requirement. |
|The virtual device doesn't meet the minimum configuration requirements. The minimum data disk size is {0} GB, but the device has only {1} GB. |Critical |Provision a data disk on the virtual device that meets the minimum requirement. |
|The virtual device doesn't meet the minimum configuration requirements. The minimum memory requirement is {0} GB, but the device has only {1} GB. |Critical |Increase the amount of memory for the virtual device to meet the minimum requirement. If using Hyper-V, ensure that the dynamic memory option is disabled. |
|The virtual device doesn't meet the minimum configuration requirements. The minimum network interface requirement is {0}, but the device has only {1}. |Critical |Increase the number of network interfaces on the virtual device to meet the minimum requirement. |

### Performance alerts

|Alert text |Severity |Description / Recommended action |
|-----------|---------|---------------------------------|
|The CPU utilization on your device has exceeded the threshold for an extended duration. |Critical |Reduce workloads or modules running on your device. If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|The CPUs reserved for the virtual machines on your device exceeds the configured threshold. |Critical |Take one of the following steps:<ol><li>Reduce CPU reservation for the virtual machines running on your device.</li><li>Remove some virtual machines off your device.</li></ol> |
|The memory used by the virtual machines on your device exceeds the configured threshold. |Critical |Take one of the following steps:<ol><li>Reduce memory allocated for the virtual machines running on your device.</li><li>Remove some virtual machines off your device.</li></ol> |
|The data volume on the device is {0}% full. Writes into the device are being throttled. |Critical |<ol><li>Distribute your data ingestion to target off-peak hours.</li><li>This may be due to a slow network. In the local web UI of the device, go to **Troubleshooting** > **Diagnostic tests** and click **Run diagnostic tests**. Resolve the reported issues.</li></ol>If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|The CPU utilization on node {0} of your device has exceeded the threshold for an extended duration. |Warning |The device will try to balance load across other nodes. Consider reducing some virtual machine workloads from your device. If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|The node {0} on your device is using more memory than expected. |Warning |If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|The memory used by the virtual machines on node {0} of your device exceeds the configured threshold. |Critical |The device will try to balance load across other nodes. Consider reducing some virtual machine workloads from your device. If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|The CPU utilization on node {0} of your device has exceeded the threshold for an extended duration. |Warning |Reduce workloads or modules running on your device. If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|The CPUs reserved for the virtual machines on node {0} of your device exceeds the configured threshold. |Warning |Take one of the following steps:<ol><li>Reduce CPU reservation for the virtual machines running on your device.</li><li>Remove some virtual machines off your device.</li></ol> |
|The memory used by the virtual machines on your device exceeds the configured threshold. |Warning |Take one of the following steps:<ol><li>Reduce memory allocated for the virtual machines running on your device.</li><li>Remove some virtual machines off your device.</li></ol> |
|Too many virtual machines are active on node {0} of your device. |Warning |The device will try to balance load across other nodes. Consider reducing some virtual machine workloads from your device. If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support). |
|Your device is almost out of storage space. If a disk fails, then you may not be able to restore data on this device. |Critical |Delete data to free up capacity on your device. |
| The virtual hard disk {0} is nearing its capacity. |Warning | Delete some data to free capacity.  |



## Next steps

- [Monitor the VM activity log](azure-stack-edge-gpu-monitor-virtual-machine-activity.md).
- [Troubleshoot VM provisioning on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning.md).