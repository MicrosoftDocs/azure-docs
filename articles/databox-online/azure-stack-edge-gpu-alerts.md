---
title: Review alerts on Azure Stack Edge Pro GPU 
description: Describes alerts that can occur on Azure Stack Edge Pro GPU device.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 10/06/2021
ms.author: alkohli
---
# Review alerts on an Azure Stack Edge Pro GPU device

This article describes alerts that occur on an Azure Stack Edge Pro GPU device and steps to take when you receive the alert. The alerts generate notifications in the Azure portal.

> [!NOTE]
> You can also monitor activity logs for virtual machines in the Azure portal. For more information, see [Monitor VM activity on your device](azure-stack-edge-gpu-monitor-virtual-machine-activity.md).


## Alerts overview

The following tables list some of the Microsoft Azure Stack Edge alerts that you might encounter, as well as additional information and recommendations where available. Azure Stack Edge device alerts fall into one of the following categories:

* [Cloud connectivity alerts](#cloud-connectivity-alerts)
* [Edge compute alerts](#edge-compute-alerts)
* [FPGA only - Edge compute alerts](#fpga-only-edge-compute-alerts)
* [Local Azure Resource Manager alerts](#local-azure-resource-manager-alerts)
* [Minimum configuration alerts](#minimum-configuration-alerts)
* [Performance alerts](#performance-alerts)
<!--* [Disaster recovery alerts](#disaster-recovery-alerts)
* [Volume alerts](#volume-alerts)
* [Tiering alerts](#tiering-alerts)-->
* [Storage alerts](#storage-alerts)
* [Security alerts](#security-alerts)
* [Key vault alerts](#key-vault-alerts)

## Cloud connectivity alerts

| Alert text                       | Severity | Description / Recommended action |
|----------------------------------|----------|----------------------------------|
| Could not connect to the Azure.  | Critical | Check your internet connection. In the local web UI of the device, go to **Troubleshooting** > **Diagnostic tests**. Run the **Internet connectivity** diagnostic test. |
| Lost heartbeat from your device. | Critical | If your device is offline, then the device is not able to communicate with the Azure service. This could be due to one of the following reasons:<ul><li>The Internet connectivity is broken.<br>Check your internet connection. In the local web UI of the device, go to **Troubleshooting** > **Diagnostic tests**. Run the diagnostic tests. Resolve the reported issues.</li><li>The device is turned off or paused on the hypervisor. Turn on your device! For more information, go to [Manage power](..\databox-gateway\data-box-gateway-manage-access-power-connectivity-mode.md#manage-power).</li><li>Your device could have rebooted due to an update. Wait a few minutes and try to reconnect.</li></ul>|


## Edge compute alerts

|Alert text |Severity |Description / Recommended action |
|---------------------|---------------------------------|
|Edge compute is unhealthy. |Critical | Restart your device to resolve the issue. In the local web UI of your device, go to **Maintenance** > **Power settings** and click **Restart**.<br>If the problem persists, contact Microsoft Support. |
|Edge compute ran into an issue with name resolution. |Critical |Ensure that your DNS server {15} is online and reachable. If the problem persists, contact your network administrator. |
|Compute acceleration card configuration has an issue.<!--2 identical alerts--> |Critical |We've detected an unsupported compute acceleration card configuration.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li>Create a [Support request]( http://aka.ms/getazuresupport).</li><li>Attach the package to the support request.</li></ol> |
|Compute acceleration card configuration has an issue. |Critical |We've detected an unsupported compute acceleration card.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li><li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
| Compute acceleration card configuration has an issue.<!--3 identical alerts-->|Critical |This may be due to one of the following reasons:<ol><li>If the card is an FPGA, the image is not valid.</li><li>Compute acceleration card isn't seated properly.</li><li>Underlying issues with the compute acceleration driver.</li></ol>To resolve the issue, redeploy the Azure IoT Edge module. Once the issue is resolved, the alert goes away.<br>
If the issue persists, do the following:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|Compute acceleration card configuration has an issue. |Critical |We've detected an unsupported compute acceleration card.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li><li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|Compute acceleration card configuration has an issue. |Critical |This is due to an internal error.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li>Create a [Support request]( http://aka.ms/getazuresupport).</li><li>Attach the package to the support request.</li></ol> |
|Compute acceleration card configuration has an issue. |Critical |We've detected an unsupported compute acceleration card.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li><li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
| Compute acceleration card configuration has an issue. |Critical |As your Azure IoT Machine Learning module starts up, you may see this transient issue. Wait a few minutes to see if the issue resolves.<br>If the issue persists, do the following:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|Compute acceleration card driver software is not running. |Critical |This is due to an internal error.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li><li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|Compute acceleration card on your device is unhealthy. |Critical |This is due to an internal error.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li><li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|Shutting down the compute acceleration card as the card temperature has exceeded the operating limit! |Critical |This is due to an internal error.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li><li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|Compute acceleration card performance is degraded. |Warning |This might be because the compute acceleration card has a high usage. Consider stopping or reducing the workload on the Azure IoT Machine Learning module.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li><li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|Compute acceleration card temperature is rising. |Warning |This might be because the compute acceleration card has a high usage. Consider stopping or reducing the workload on the Azure IoT Machine Learning module.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li><li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|Edge compute couldn’t access data on share {16}. |Warning |Verify that you can access share {16}. If you can access the share, it indicates an issue with Edge compute. <br> To resolve the issue, restart your device. In the local web UI of your device, go to **Maintenance** > **Power settings** and click **Restart**. <br> If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|Edge compute couldn’t access data on share {16}. This may be because the share doesn’t exist anymore. |Warning |If the share does not {16} exist, restart your device to resolve the issue. In the local web UI of your device, go to **Maintenance** > **Power settings** and click **Restart**. <br> If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|IoT Edge agent is not running. |Warning |Restart your device to resolve the issue. In the local web UI of your device, go to **Maintenance** > **Power settings** and click **Restart**. <br> If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support).md). |
|IoT Edge service is not running. |Warning |Restart your device to resolve the issue. In the local web UI of your device, go to **Maintenance** > **Power settings** and click **Restart**. <br> If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support).md). |
|Storage used by Edge compute is getting full. | Warning | [Contact Microsoft Support](azure-stack-edge-contact-microsoft-support) for next steps. |
|Your Edge compute module {20} is disconnected from IoT Edge |Warning |Restart your device to resolve the issue. In the local web UI of your device, go to **Maintenance** > **Power settings** and click **Restart**. <br> If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support).md). |
|Your Edge compute module(s) may be using a local mount point {15} that is different than the local mountpoint used by a share. |Warning |Ensure that the local mountpoint {15} used is the one that is mapped to the share.<ul><li>In the Azure portal, go to **Shares** in your Data Box Edge resource.</li><li>Select a share to view the local mount point for Edge compute module.</li><li>Ensure that this path is used in the module and deploy the module again.</li></ol>Restart the device. In the local web UI of your device, go to **Maintenance** > **Power settings** and click **Restart**. <br> If the alert persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support).md). |


## FPGA only - Edge compute alerts

|Alert text |Severity |Description / Recommended action |
|---------------------|---------------------------------|
|FPGA on your device is unhealthy. |Critical |This may be due to an internal error.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li><li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|FPGA driver software is not running. | Critical |This is due to an internal error.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li><li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|FPGA configuration has an issue. |Critical |We've detected an unsupported FPGA card.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li><li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|FPGA configuration has an issue. |This may be due to one of the following reasons:<ol><li>Image on the FPGA is not valid.</li><li>FPGA card isn't seated properly.</li><li>Underlying issues with the FPGA driver.</li></ol>To resolve the issue, redeploy the Azure IoT Edge module. Once the issue is resolved, the alert goes away.<br>If the issue persists, do the following:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|FPGA configuration has an issue. |Critical |As your Azure IoT Machine Learning module starts up, you may see this transient issue. Wait a few minutes to see if the issue resolves.<br>If the issue persists, do the following:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|FPGA configuration has an issue. |Critical |This is due to an internal error.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li><li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|FPGA card temperature is rising. |Warning |This might be because the FPGA card has a high usage. Consider stopping or reducing the workload on the Azure IoT Machine Learning module.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li><li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |
|Shutting down the FPGA card as the card temperature has exceeded the operating limit! |Critical |This is due to an internal error.<br>Before you contact Microsoft Support, follow these steps:<ol><li>In the local web UI, go to **Troubleshooting** > **Support**.</li><li>Create and download a support package.</li><li>[Create a Support request](azure-stack-edge-contact-microsoft-support.md#create-a-support-request).</li><li>Attach the package to the support request.</li></ol> |


## Local Azure Resource Manager alerts

|Alert text |Severity |Description / Recommended action |
|-----------|---------|---------------------------------|
|Specified service authentication certificate with thumbprint '{0}' does not have a private key |Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|Certificate with thumbprint '{0}' at location '{1}' is not found or not accessible. |Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|Unable to connect endpoint: '{0}' |Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|Error occurred during web request: '{0}' |Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|Request timed out for url: '{0}' |Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|Unable to get Token using login endpoint '{0}' for resource '{1}' |Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|Unknown error occurred. ErrorCode:'{0}'. Details: '{1}' | Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|Could not start the VM service on the device. |Critical | If you see this alert, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|VM service is not running on the device. |Critical |If you see this alert, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |


## Minimum configuration alerts

|Alert text |Severity |Description / Recommended action |
|-----------|---------|---------------------------------|
|The virtual device doesn't meet the minimum configuration requirements. The minimum virtual processor requirement is {0}, but the device has only {1}. |Critical |Increase the number of virtual processors on the virtual device to meet the minimum requirement. |
|The virtual device doesn't meet the minimum configuration requirements. The minimum data disk size is {0} GB, but the device has only {1} GB. |Critical |Provision a data disk on the virtual device that meets the minimum requirement. |
|The virtual device doesn't meet the minimum configuration requirements. The minimum memory requirement is {0} GB, but the device has only {1} GB. |Critical |Increase the amount of memory for the virtual device to meet the minimum requirement. If using Hyper-V, ensure that the dynamic memory option is disabled. |
|The virtual device doesn't meet the minimum configuration requirements. The minimum network interface requirement is {0}, but the device has only {1}. |Critical |Increase the number of network interfaces on the virtual device to meet the minimum requirement. |


## Performance alerts

|Alert text |Severity |Description / Recommended action |
|-----------|---------|---------------------------------|
|The CPU utilization on your device has exceeded the threshold for an extended duration. |Critical |Reduce workloads or modules running on your device. If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|The CPUs reserved for the virtual machines on your device exceeds the configured threshold. |Critical |Take one of the following steps:<ol><li>Reduce CPU reservation for the virtual machines running on your device.</li><li>Remove some virtual machines off your device.</li></ol> |
|The memory used by the virtual machines on your device exceeds the configured threshold. |Critical |Take one of the following steps:<ol><li>Reduce memory allocated for the virtual machines running on your device.</li><li>Remove some virtual machines off your device.</li></ol> |
|The data volume on the device is {0}% full. Writes into the device are being throttled. |Critical                    |<ol><li>Distribute your data ingestion to target off-peak hours.</li><li>This may be due to a slow network. In the local web UI of the device, go to **Troubleshooting** > **Diagnostic tests** and click **Run diagnostic tests**. Resolve the reported issues.</li></ol>If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|The memory used by the virtual machines on node {0} of your device exceeds the configured threshold. |Critical |The device will try to balance load across other nodes. Consider reducing some virtual machine workloads from your device. If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|Your device is almost out of storage space. If a disk fails, then you may not be able to restore data on this device. |Critical |Delete data to free up capacity on your device. |
|The CPU utilization on node {0} of your device has exceeded the threshold for an extended duration. |Warning |The device will try to balance load across other nodes. Consider reducing some virtual machine workloads from your device. If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|The node {0} on your device is using more memory than expected. |Warning |If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|The CPU utilization on node {0} of your device has exceeded the threshold for an extended duration. |Warning |Reduce workloads or modules running on your device. If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|The CPUs reserved for the virtual machines on node {0} of your device exceeds the configured threshold. |Warning |Take one of the following steps:<ol><li>Reduce CPU reservation for the virtual machines running on your device.</li><li>Remove some virtual machines off your device.</li></ol> |
|The memory used by the virtual machines on your device exceeds the configured threshold. |Warning |Take one of the following steps:<ol><li>Reduce memory allocated for the virtual machines running on your device.</li><li>Remove some virtual machines off your device.</li></ol> |
|Too many virtual machines are active on node {0} of your device. |Warning |The device will try to balance load across other nodes. Consider reducing some virtual machine workloads from your device. If the problem persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |

| The virtual hard disk {0} is nearing its capacity. |Warning | Delete some data to free capacity.  |


## Storage alerts

|Alert text |Severity |Description / Recommended action |
|-----------|---------|---------------------------------|
|Could not access volume {0}. |Critical |This could happen when the volume is offline, or too many drives or servers have failed or are disconnected. Take the following steps:<ol><li>Reconnect missing drives and bring up servers that are down.</li><li>Allow the sync to complete.</li><li>Replace any failed drives and restore lost data from backup.</li></ol> |
|Could not find volume {0}. |Critical |If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
| Could not access volume {0}. |Critical |In the local web UI of the device, go to **Troubleshooting** > **Diagnostic tests**, and click **Run diagnostic tests**. Resolve the reported issues.<br>If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|Could not find volume {0}. |Critical/Warning |Expand the volume or migrate workloads to other volumes. |
|Some data on this volume {0} is not fully resilient. It remains accessible. |Informational |Restoring resiliency of the data. |
|Could not upload {0} files(s) from share {1}. |Critical |This could be due to one of the following reasons:<ol><li>Due to violations of Azure Storage naming and sizing conventions. For more information, go to [Naming conventions](../azure-resource-manager/management/resource-name-rules.md).</li><li>Because the uploaded files were modified in the cloud by other applications outside of the device.<ul><li>{2} inside the {1} share, or</li><li>{3} inside the {4} account.</li></ol></ul> |
|Could not connect to the storage account '{0}'. |Critical |This may be because the storage account access keys have been regenerated. If the keys have been regenerated, you will need to synchronize the new keys.<br>To fix the issue, in the Azure portal go to **Shares**, select the share, and refresh the storage keys. |
|Could not connect to the storage account '{0}'. |Critical |This may be due to Internet connectivity issues. The device is not able to communicate with the storage account service. In the local web UI of the device, go to **Troubleshooting** > **Diagnostic tests** and click **Run diagnostic tests**. Resolve the reported issues. |
|The device has {0} files. A maximum of {1} files are supported. |Critical |Consider deleting some files from the device. |
|Low throughput to and from Azure Storage detected. |Warning  |In the local web UI of the device, go to **Troubleshooting** > **Diagnostic tests** and click **Run diagnostic tests**. Resolve the reported issues. If the issue persists, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |


## Security alerts

|Alert text |Severity |Description / Recommended action |
|-----------|---------|---------------------------------|
|{0} from {1} expires in {2} days. |Critical/Warning |Check your certificate and upload a new certificate before the expiration date. |
|{0} of type {1} is not valid. |Critical |Check your certificate. If the certificate is not valid, upload a new certificate. |
|Internal certificate rotation failure |Critical |Couldn't rotate the internal certificates. If services are impaired, [contact Microsoft Support](azure-stack-edge-contact-microsoft-support.md). |
|Could not login '{0}'. Number of failed attempts : '{1}'. |Critical/Informational/Warning |Make sure that you have entered the correct password.<br>An authorized user may be attempting to connect to your device with an incorrect password. Verify that these attempts were from a legitimate source.<br>If you continue to see failed login attempts, contact your network administrator. |
|Rotate SED key protector on node {0}, did not complete in time. |Warning |The attempt to rotate SED key protector to the new default has not completed in time. Please check if node and physical disks are in healthy state. System will retry again. |
|Device password has changed |Informational |The device administrator password has changed. This is a required action as part of the first-time device setup or regular password reset. No further action is required. |
|A support session is enabled. |Informational |This is an information alert to ensure that administrators can ensure that the enabling the support session is legitimate. No action is needed. |
|A support session has started. |Informational |This is an information alert to ensure that administrators can ensure that the support session is legitimate. No action is needed. |


## Key Vault alerts

|Alert text |Severity |Description / Recommended action |
|-----------|---------|---------------------------------|
|Key Vault is not configured |Critical/Warning |<ol><li>Verify that the Key Vault is not deleted.</li><li>Assign the appropriate permissions for your device to get and set the secrets. For detailed steps, see [Prerequisites for an Azure Stack Edge resource](azure-stack-edge-gpu-deploy-prep.md#prerequisites).</li><li>If secrets are soft deleted, follow the steps [here](../key-vault/general/key-vault-recovery.md#list-recover-or-purge-soft-deleted-secrets-keys-and-certificates) to recover the secrets.</li><li>Refresh the Key Vault details to clear the alert.</li></ol> |
|Key Vault is not configured |Warning |Configure the Key Vault for your Azure Stack Edge resource. For detailed steps, see [Create a key vault](../key-vault/general/quick-create-portal.md). |
|Key Vault is deleted |Critical |If the key vault is deleted and the purge protection duration of 90 days hasn't elapsed, follow the steps to [Recover your key vault](../key-vault/general/key-vault-recovery.md#list-recover-or-purge-a-soft-deleted-key-vault).<!--Verify link target.-->|
|Couldn’t retrieve secret(s) from the Key Vault |Critical |<ol><li>Verify that the Key Vault is not deleted.</li><li>Assign the appropriate permissions for your device to get and set the secrets. The required permissions are are present [here](azure-stack-edge-gpu-deploy-prep.md#prerequisites).</li><li>Refresh the Key Vault details to clear the alert.</li></ol> |
|Couldn’t access the Key Vault |Critical |<ol><li>Verify that the Key Vault is not deleted.</li><li>Assign the appropriate permissions for your device to get and set the secrets. For detailed steps, click [here](azure-stack-edge-gpu-deploy-prep.md#prerequisites).</li><li>Refresh the Key Vault details to clear the alert.</li></ol> |


## Next steps

- [Monitor the VM activity log](azure-stack-edge-gpu-monitor-virtual-machine-activity.md).
- [Troubleshoot VM provisioning on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning.md).