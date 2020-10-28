---
title: Prepare for Azure Stack Edge Pro device failure
description: Describes how to get a replacement for an Azure Stack Edge Pro failed device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 10/06/2020
ms.author: alkohli
---

# Prepare for an Azure Stack Edge Pro GPU device failure

This article helps you prepare for a device failure by detailing how to save and back up the device configuration and data on your Azure Stack Edge Pro GPU device. 

The article does not include steps to back up Kubernetes and IoT containers deployed on your Azure Stack Edge Pro GPU device. 

## Understand device failures

Your Azure Stack Edge Pro GPU device can experience two types of hardware failures.

- Tolerable failures that require you to replace a hardware component. These failures will allow you to operate the device in a degraded state. Examples of these failures include a single failed power supply unit (PSU) or a single failed disk on the device. In each of these cases, the device can continue to operate. You are recommended to contact Microsoft Support at the earliest to replace the failed components.

- Non-tolerable failures that would require you to replace the entire device. An example of this failure would be when two disks have failed on your device. In these instances, you contact Microsoft Support and after they determine that a device replacement is needed, they help facilitate the replacement of your Azure Stack Edge device.

To prepare for non-tolerable failures, you need to back up the following on your device:

- Information on device configuration.
- Data that resides in Edge local shares and Edge cloud shares.
- Files and folders associated with the VMs running on your device.


## Back up device configuration

During the initial configuration of the device, it is important that you keep a copy of the device configuration information as outlined in the [Deployment checklist](azure-stack-edge-gpu-deploy-checklist.md). During recovery, this configuration information will be used to apply to the new replacement device. 

## Protect device data

The device data can be of one of the following types:

- Data in Edge cloud shares
- Data in local shares
- Files and folders on VMs

The following sections discuss the steps and recommendations to protect each of these types of data on your device.

## Protect data in Edge cloud shares

You can create Edge cloud shares that tier data from your device to Azure. Depending on the network bandwidth available, configure bandwidth templates on your device to minimize any data loss in the event of a non-tolerable failure.

> [!IMPORTANT] 
> If the device has a non-tolerable failure, local data that is not tiered off from the device to Azure may be lost. 

## Protect data in Edge local shares

If deploying Kubernetes or IoT Edge, configure to save the application data on the device locally and do not sync with Azure Storage. The data is stored on a share on the device. You might find it important to backup the data in these shares.

The following third-party data protection solutions can provide a backup solution for the data in the local SMB or NFS shares. 

| Third-party software           | Reference to the solution                               |
|--------------------------------|---------------------------------------------------------|
| Cohesity                       | https://www.cohesity.com/solution/cloud/azure/ <br> For details, contact Cohesity.          |
| Commvault                      | https://www.commvault.com/azure <br> For details, contact Commvault.          |
| Veritas                        | http://veritas.com/azure <br> For details, contact Veritas.   |


## Protect files and folders on VMs

Azure Stack Edge works with Azure Backup and other third-party data protection solutions to provide a backup solution to protect data contained in the VMs deployed on the device. The following table lists references to available solutions that you can choose from.


| Backup solutions        | Supported OS   | Reference                                                                |
|-------------------------|----------------|--------------------------------------------------------------------------|
| Microsoft Azure Recovery Services (MARS) agent for Azure Backup | Windows        | [About MARS agent](/azure/backup/backup-azure-about-mars)    |
| Cohesity                | Windows, Linux | [Microsoft Azure Integration, Backup and Recovery solution brief](https://www.cohesity.com/solution/cloud/azure) <br>For details, contact Cohesity.                          |
| Commvault               | Windows, Linux | https://www.commvault.com/azure <br>For details, contact Commvault.                          |
| Veritas                 | Windows, Linux | http://veritas.com/azure <br> For details, contact Veritas.                    |



## Next steps

- Learn how to [Recover from a failed Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-recover-device-failure.md).
