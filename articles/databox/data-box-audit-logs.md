---
title: Audit logs for Azure Data Box, Azure Data Box Heavy events| Microsoft Docs 
description: Describes the full audit logs for Data Box that are collected at the various stages of your Azure Data Box and Azure Data Box Heavy order.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: pod
ms.topic: article
ms.date: 07/10/2020
ms.author: shaas
---

# Audit logs for your Azure Data Box and Azure Data Box Heavy

Logs are immutable, timestamped records of discrete events that happened over time. The logs contain diagnostic, audit, and security information from your device.  

A Data Box or Data Box Heavy order goes through the following steps during the course of its operation: order, set up, data copy, return, upload to Azure and verify, and data erasure. For each of these steps, all the events are audited and logged.

This article contains information on the Data Box audit logs including the types of logs and the information collected as well as the location of logs. 

The information in this article applies to both, Data Box and Data Box Heavy. In the subsequent sections, any references to Data Box also apply to Data Box Heavy. The logs collected from the Data Box service running in Azure are not covered in this article. 


## About audit logs 

On your Data Box, the following logs are collected:

- **System logs** - Data Box being a Windows-based device, all the hardware, software, and system events are logged. A set of these events is collected and reported in the system audit logs. 

- **Security** - Data Box being a Windows-based device, all the security events are logged. A set of these events is collected and reported in the security audit logs. 

- **Application** - These logs are specific to Data Box only. These logs contain all the events generated on the device in response to the Data Box services that are running.

Each of these logs is discussed in the following section.

### System logs

The following system log event IDs are collected as system audit logs on your Data Box:

|Event provider name     |Event ID collected   |Event description   |
|-------------------|----------|----------------|
|Microsoft-Windows-Kernel-General|12  |UTC time when OS was rebooted.   |
|                                |13  |UTC time when OS was shut down. |
|    |                              |
|Microsoft-Windows-Kernel-Power  |41  |System rebooted without a clean shutdown.| 
|    |                              |
|Microsoft-Windows-BitLocker-Driver|All|    |

### Security logs

The following security log event IDs are collected as security audit logs on your Data Box:

|Event provider name                   |Event ID collected    |Event description       |
|--------------------------------------|------------|----------|
|Microsoft-Windows-Security-Auditing   |4624        |Successful logon. |
|                                      |4625        |An account logon failed. Unknown user name or bad password. |
|                                     

### Application logs

The following application log event IDs are collected as a part of package audit logs on your Data Box. 	

- **Microsoft-Azure-DataBox-OOBE-Auditing** - contains the events that occur in the local UI. 
- **Microsoft-Azure-DataBox-Reprovision-Audit** - contains events related to the reprovisioning of the Data Box device. The reprovisioning of the Data Box occurs when the device is reset via the local UI. You choose this option when you want to erase the data you have copied by removing the existing shares and recreating the shares as part of the reprovisioning or the device reset.
- **Microsoft-Azure-DataBox-HcsMgmt-Audit** - contains events related only to the **Prepare to Ship** step before the device is shipped back to the Azure datacenter. 
- **Microsoft-Azure-DataBox-IfxAudit** - contains the messages logged by different entities of the product about the jobs, logs that indicate more information about what's happening in some of the flows.

Here is a table summarizing the various event providers and the corresponding event IDs that are collected in each case.

|Event provider name    |Event ID    | Notes |
|-----------------|-----------------|-------------------|
|Microsoft-Azure-DataBox-OOBE-Auditing |4624        |Successful logon.|
|                                      |4625        |An account logon failed. Unknown user name or bad password.|
|                                     |4634        |Log off event.|
|                                   |  | |
|Microsoft-Azure-DataBox-Reprovision-Audit    |65001       |Successful reprovision event.|
|                                                  |65002       |Failed to reprovision event.|
|                                                  |                 |         |
|Microsoft-Azure-DataBox-HcsMgmt-Audit        |65003       |Prepare to ship state event     NotStarted,     InProgress,     Failed,     Canceled,     Succeeded,     ScanCompletedWithIssues,     SucceededWithWarnings          |
|                                                  |                 |     |
|Microsoft-Azure-DataBox-IfxAudit    |All |All events are logged with audit log API in code |

Here is an example of the Instrumentation Framework (IFX) audit log:

|     Task/Job/API                              |     Events logged                                                                                                              | 
|-----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
|     Cleanup                                   |     The events related to start, completion, or failure of a clean up job are logged. |                                              
|     Prepare device for customer shipment    |     The events related to start, completion, or failure of job to prepare the device for shipment are logged. |
|     Provision                                 |     The events related to start, completion, or failure of a device provisioning job are logged.|
|     Audit   package job                       |     The events related to start, completion, or failure of an audit package job that creates chain of custody logs are logged.|
|     Disk   overwrite                          |     Failure to overwrite the disk is logged.|
|     Enable   or disable remote PowerShell     |     The events related to enabling or disabling of remote PowerShell on the device are logged. |
|     Get   install phase details               |     The events related to installation of software on the device in phases are logged at the Azure datacenter.|
|     Unlock or lock BitLocker volume           |     The events are logged to indicate the BitLocker status of *basevolume* and *hcsdata* volume.|
|     Sanitize disk                              |     The events related to failure of physical disks that could not be erased, and the events when all the physical disks on the device are successfully erased, are logged. |
|     Enable or disable local user               |     The events related to enabling or disabling of local user accounts for StorSimpleAdmin and PodSupportAdminUser are logged.| 
|     Password   reset                          |     The events related to successful or failed password reset for local StorSimpleAdmin user are logged. |


Apart from the IFX audit logs, chain of custody audit logs are also collected for Data Box. These logs cannot be viewed in real time but only after the job is completed and data is erased from the Data Box disks. These logs contain a subset of the information contained in the IFX audit logs.

For more information about the chain of custody audit logs, see [Get chain of custody logs after data erasure](data-box-logs.md#get-chain-of-custody-logs-after-data-erasure).

<!-- write a few lines about order history and link out to the detailed section on order history-->

## Access audit logs

These logs are stored in Azure and can't be accessed directly. If you need to access these logs, file a support ticket. For more information, see [Contact Microsoft Support](data-box-disk-contact-microsoft-support.md). 

Once the support ticket is filed, Microsoft will download and provide you access to these logs.


## Next steps

- Learn how to [Troubleshoot issues on your Data Box and Data Box Heavy](data-box-troubleshoot.md).
