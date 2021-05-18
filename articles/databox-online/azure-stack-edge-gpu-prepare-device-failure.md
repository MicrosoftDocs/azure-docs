---
title: Prepare for Azure Stack Edge Pro device failure
description: Describes how to get a replacement for an Azure Stack Edge Pro failed device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 02/22/2021
ms.author: alkohli
---

# Prepare for an Azure Stack Edge Pro GPU device failure

[!INCLUDE [applies-to-GPU-and-pro-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-sku.md)]

This article helps you prepare for a device failure by detailing how to save and back up the device configuration and data on your Azure Stack Edge Pro GPU device. 

The article does not include steps to back up Kubernetes and IoT containers deployed on your Azure Stack Edge Pro GPU device. 

## Understand device failures

Your Azure Stack Edge Pro GPU device can experience two types of hardware failures.

- Tolerable failures that require you to replace a hardware component. These failures will allow you to operate the device in a degraded state. Examples of these failures include a single failed power supply unit (PSU) or a single failed disk on the device. In each of these cases, the device can continue to operate. Contact Microsoft Support as soon as possible to replace the failed components.

- Non-tolerable failures that require you to replace the entire device - for example, when two disks have failed on your device. In these cases, contact Microsoft Support immediately. After they determine that a device replacement's needed, Support will help with the replacement of your Azure Stack Edge device.

To prepare for non-tolerable failures, you need to back up the following things on your device:

- Information on the device configuration
- Data in Edge local shares and Edge cloud shares
- Files and folders associated with the VMs running on your device


## Back up device configuration

During initial configuration of the device, it's important to keep a copy of the device configuration information as outlined in the [Deployment checklist](azure-stack-edge-gpu-deploy-checklist.md). During recovery, this configuration information will be used to apply to the new replacement device. 

## Protect device data

The device data can be of one of the following types:

- Data in Edge cloud shares
- Data in local shares
- Files and folders on VMs

The following sections discuss the steps and recommendations to protect each of these types of data on your device.

## Protect data in Edge cloud shares

You can create Edge cloud shares that tier data from your device to Azure. Depending on the network bandwidth available, configure bandwidth templates on your device to minimize any data loss if a non-tolerable failure occurs.

> [!IMPORTANT]
> If the device has a non-tolerable failure, local data that is not tiered off from the device to Azure may be lost. 

## Protect data in Edge local shares

If you're deploying Kubernetes or IoT Edge, configure to save the application data on the device locally and do not sync with Azure Storage. The data is stored on a share on the device. You might find it important to backup the data in these shares.

The following third-party data protection solutions can provide a backup solution for the data in the local SMB or NFS shares. 

| Third-party software           | Reference to the solution                               |
|--------------------------------|---------------------------------------------------------|
| Cohesity                       | [https://www.cohesity.com/solution/cloud/azure/](https://www.cohesity.com/solution/cloud/azure/) <br> For details, contact Cohesity.          |
| Commvault                      | [https://www.commvault.com/azure](https://www.commvault.com/azure) <br> For details, contact Commvault.          |
| Veritas                        | [http://veritas.com/azure](http://veritas.com/azure) <br> For details, contact Veritas.   |
| Veeam                          | [https://www.veeam.com/kb4041](https://www.veeam.com/kb4041) <br> For details, contact Veeam. |


## Protect files and folders on VMs

Azure Stack Edge works with Azure Backup and other third-party data protection solutions to provide a backup solution to protect data contained in the VMs that are deployed on the device. The following table lists references to available solutions that you can choose from.


| Backup solutions        | Supported OS   | Reference                                                                |
|-------------------------|----------------|--------------------------------------------------------------------------|
| Microsoft Azure Recovery Services (MARS) agent for Azure Backup | Windows        | [About MARS agent](../backup/backup-azure-about-mars.md)    |
| Cohesity                | Windows, Linux | [Microsoft Azure Integration, Backup & Recovery solution brief](https://www.cohesity.com/solution/cloud/azure) <br>For details, contact Cohesity.                          |
| Commvault               | Windows, Linux | [https://www.commvault.com/azure](https://www.commvault.com/azure) <br>For details, contact Commvault.                          |
| Veritas                 | Windows, Linux | [https://vox.veritas.com/t5/Protection/Protecting-Azure-Stack-Edge-with-NetBackup/ba-p/883370](https://vox.veritas.com/t5/Protection/Protecting-Azure-Stack-Edge-with-NetBackup/ba-p/883370) <br> For details, contact Veritas.                    |
| Veeam                   | Windows, Linux | [https://www.veeam.com/kb4041](https://www.veeam.com/kb4041) <br> For details, contact Veeam. |


## Next steps

- Learn how to [Recover from a failed Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-recover-device-failure.md).