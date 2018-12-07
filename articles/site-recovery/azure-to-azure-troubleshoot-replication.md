---
title: Azure Site Recovery troubleshooting for Azure-to-Azure replication issues and errors| Microsoft Docs
description: Troubleshooting errors and issues when replicating Azure virtual machines for disaster recovery
services: site-recovery
author: asgang
manager: rochakm
ms.service: site-recovery
ms.topic: troubleshooting
ms.date: 11/27/2018
ms.author: asgang

---
# Troubleshoot Azure-to-Azure VM ongoing replication issues

This article describes the common issues in Azure Site Recovery when replicating and recovering Azure virtual machines from one region to another region and explains how to troubleshoot them. For more information about supported configurations, see the [support matrix for replicating Azure VMs](site-recovery-support-matrix-azure-to-azure.md).


## Recovery points not getting generated

ERROR MESSAGE: No crash consistent recovery point available for the VM in the last 60 minutes.</br>
ERROR ID: 153007 </br>

Azure Site Recovery consistently replicates data from source region to the disaster recovery region and creates crash consistent point every 5 minutes. If Site Recovery is unable to create recovery points for 60 minutes, then it alerts user. Below are the causes that could result in this error:

**Cause 1: [High data change rate on the source virtual machine](#high-data-change-rate-on-the-source-virtal-machine)**    
**Cause 2: [Network connectivity issue ](#Network-connectivity-issue)**

## Causes and solutions

### <a name="high-data-change-rate-on-the-source-virtal-machine"></a>High data change rate on the source Virtual machine
Azure Site Recovery fires an event if the data change rate on the source virtual machine is higher than the supported limits. To check if the issue is due to high churn, go to Replicated items> VM > click on “Events -last 72 hours”.
You should see the event “Data Change rate beyond supported limits” as shown in the screenshot below

![data_change_rate_high](./media/site-recovery-azure-to-azure-troubleshoot/data_change_event.png)

If you click on the event, you should see the exact disk information as shown in the screenshot below

![data_change_rate_event](./media/site-recovery-azure-to-azure-troubleshoot/data_change_event2.png)


#### Azure Site Recovery limits
The following table provides the Azure Site Recovery limits. These limits are based on our tests, but they cannot cover all possible application I/O combinations. Actual results can vary based on your application I/O mix. We should also note that there are two limits to consider, per disk data churn and per virtual machine data churn.
For example, if we look at  Premium P20 disk in the below table, Site Recovery can to handle 5 MB/s churn per disk with at max of five such disks per VM  due to the limit of 25 MB/s total churn per VM.

**Replication storage target** | **Average source disk I/O size** |**Average source disk data churn** | **Total source disk data churn per day**
---|---|---|---
Standard storage | 8 KB	| 2 MB/s | 168 GB per disk
Premium P10 or P15 disk | 8 KB	| 2 MB/s | 168 GB per disk
Premium P10 or P15 disk | 16 KB | 4 MB/s |	336 GB per disk
Premium P10 or P15 disk | 32 KB or greater | 8 MB/s | 672 GB per disk
Premium P20 or P30 or P40 or P50 disk | 8 KB	| 5 MB/s | 421 GB per disk
Premium P20 or P30 or P40 or P50 disk | 16 KB or greater |10 MB/s | 842 GB per disk

### Solution
We must understand that Azure Site Recovery has data change rate limits based on the type of disk. To know if this issue is recurring or momentarily, it is important to find the data change rate  pattern  of the affected  virtual machine.
To find the  data change rate of the affected virtual machine. Go to the source virtual machine> metrics under Monitoring and add the metrics as shown below.

![high_data_change_rate](./media/site-recovery-azure-to-azure-troubleshoot/churn.png)

1. Click on "Add metric" and add "OS Disk Write Bytes/sec" and "Data Disk Write Bytes/sec".
2. Monitor the spike as shown in the screenshot.
3. It will show  the total writes operation happening across OS disk and all data disks combined. Now these metrics might not tell you per disk level information but is a good indicator of the total data churn pattern.

In cases like above if it is an occasional data burst and the data change rate is greater than 10 MBps (for Premium) and 2 MBps (for Standard) for some time and comes down, replication will catch up. However if the churn is well beyond the supported limit most of the time, then you should consider one of the below option if possible:

**Option 1:** Exclude the disk, which is causing high data change rate: </br>
You can currently exclude the disk using [Site Recovery Powershell](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-powershell#replicate-azure-virtual-machine)

**Option 2:** Change the disaster recovery  storage disk tier: </br>
This option is only possible if the  disk data churn is less than 10 MB/s. Let say a VM with P10 disk is having a data churn of greater than 8 MB/s  but less than 10 MB/s. If customer can use P30 disk for target storage during protection, then the issue can be solved.

### <a name="Network-connectivity-issue"></a>Network connectivity issue

#### Network latency to Cache storage account :
 Site Recovery sends replicated data to the cache storage account and the issue might happen if uploading the data from Virtual machine to the cache storage account is slower that 4 MB in 3 secs. To check if there is any issue related to latency use [azcopy](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy) to upload data from the virtual machine to the cache storage account.<br>
If the latency is high, check if you are using a network virtual  appliances to control outbound network traffic from VMs. The appliance might get throttled if all the replication traffic passes through the NVA. We recommend creating a network service endpoint in your virtual network for "Storage" so that the replication traffic does not go to the NVA. Refer [network virtual appliance configuration](https://docs.microsoft.com/en-us/azure/site-recovery/azure-to-azure-about-networking#network-virtual-appliance-configuration)

#### Network connectivity
For Site Recovery replication to work, outbound connectivity to specific URLs or IP ranges is required from the VM. If your VM is behind a firewall or uses network security group (NSG) rules to control outbound connectivity, you might face one of these issues.</br>
Refer to [Outbound connectivity for Site Recovery URLs](https://docs.microsoft.com/en-us/azure/site-recovery/azure-to-azure-about-networking#outbound-connectivity-for-ip-address-ranges) to make sure all the URLs are connected 