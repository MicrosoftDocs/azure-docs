---
title: Recover from an Azure Stack Edge Pro device failure 
description: Describes how to recover from an Azure Stack Edge Pro failed device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 02/22/2021
ms.author: alkohli
---

# Recover from a failed Azure Stack Edge Pro GPU device 

[!INCLUDE [applies-to-GPU-and-pro-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-sku.md)]

This article describes how to recover from a non-tolerable failure on your Azure Stack Edge Pro GPU device. A non-tolerable failure on Azure Stack Edge Pro GPU device requires a device replacement.

## Before you begin

Make sure that you have:

- Contacted Microsoft Support regarding the device failure and they have recommended a device replacement. 
- Backed up your device configuration as described in [Prepare for a device failure](azure-stack-edge-gpu-prepare-device-failure.md).


## Configure replacement device

When your device encounters a non-tolerable failure, you need to order a replacement device. The configuration steps for the replacement device remain the same. 

Retrieve the device configuration information that you backed up from the device that failed. You will use this information to configure the replacement device.  

Follow these steps to configure the replacement device:

1. Gather the information required in the [Deployment checklist](azure-stack-edge-gpu-deploy-checklist.md). You can use the information that you saved from the previous device configuration. 
1. Order a new device of the same configuration as the one that failed.  To place an order, [Create a new Azure Stack Edge resource](azure-stack-edge-gpu-deploy-prep.md#) in the Azure portal.
1. [Unpack](azure-stack-edge-gpu-deploy-install.md#unpack-the-device), [rack mount](azure-stack-edge-gpu-deploy-install.md#rack-the-device) and [cable your device](azure-stack-edge-gpu-deploy-install.md#cable-the-device). 
1. [Connect to the local UI of the device](azure-stack-edge-gpu-deploy-connect.md).
1. Configure the network using the same IP addresses that you used for your old device. Using the same IP addresses will minimize the impact on any client machines used in your environment. See how to [configure network settings](azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md).
1. Assign the same device name and DNS domain as your old device. That way, your clients can use the same device name to talk to the new device. See how to [configure device setting](azure-stack-edge-gpu-deploy-set-up-device-update-time.md).
1. Configure certificates on the new device in the same way as you did for the old device. Keep in mind that the new device has a new node serial number. If you used your own certificates on the old device, you will need to get a new node certificate. See how to [configure certificates](azure-stack-edge-gpu-deploy-configure-certificates.md).
1. Get the activation key from the Azure portal and activate the new device. See how to [activate the device](azure-stack-edge-gpu-deploy-activate.md).

You are now ready to deploy the workloads that you were running on the old device.

## Restore Edge cloud shares

Follow these steps to restore the data on the Edge cloud shares on your device:

1. [Add shares](azure-stack-edge-gpu-manage-shares.md#add-a-share) with the same share names created previously on the failed device. Make sure that while creating shares, **Select blob container** is set to **Use existing** option and then select the container that was used with the previous device.
1. [Add users](azure-stack-edge-gpu-manage-users.md#add-a-user) that had access to the previous device.
1. [Add storage accounts](azure-stack-edge-gpu-manage-storage-accounts.md#add-an-edge-storage-account) associated with the shares previously on the device. While creating Edge storage accounts, select from an existing container and point to the container that was mapped to the Azure Storage account mapped on the previous device. Any data from the device that was written to the Edge storage account on the previous device was uploaded to the selected storage container in the mapped Azure Storage account.
1. [Refresh the share](azure-stack-edge-gpu-manage-shares.md#refresh-shares) data from Azure. This pulls down all the cloud data from the existing container to the shares.

## Restore Edge local shares

To prepare for a potential device failure, you may have deployed one the following backup solutions to protect the local shares data from your Kubernetes or IoT workloads:

| Third-party software           | Reference to the solution                               |
|--------------------------------|---------------------------------------------------------|
| Cohesity                       | [https://www.cohesity.com/solution/cloud/azure/](https://www.cohesity.com/solution/cloud/azure/) <br> For details, contact Cohesity.          |
| Commvault                      | [https://www.commvault.com/azure](https://www.commvault.com/azure) <br> For details, contact Commvault. |
| Veritas                        | [http://veritas.com/azure](http://veritas.com/azure) <br> For details, contact Veritas.   |
| Veeam                          | [https://www.veeam.com/kb4041](https://www.veeam.com/kb4041) <br> For details, contact Veeam. |

After the replacement device is fully configured, enable the device for local storage. 

Follow these steps to recover the data from local shares:

1. [Configure compute on the device](azure-stack-edge-gpu-deploy-configure-compute.md).
1. [Add a local share](azure-stack-edge-gpu-manage-shares.md#add-a-local-share) back.
1. Run the recovery procedure provided by the data protection solution of choice. See references from the preceding table.

## Restore VM files and folders

To prepare for a potential device failure, you may have deployed one of the following backup solutions to protect the data on VMs:



| Backup solutions        | Supported OS   | Reference                                                                |
|-------------------------|----------------|--------------------------------------------------------------------------|
| Microsoft Azure Recovery Services (MARS) agent for Azure Backup | Windows        | [About MARS agent](../backup/backup-azure-about-mars.md)    |
| Cohesity                | Windows, Linux | [Microsoft Azure Integration, Backup & Recovery solution brief](https://www.cohesity.com/solution/cloud/azure) <br>For details, contact Cohesity.                          |
| Commvault               | Windows, Linux | [https://www.commvault.com/azure](https://www.commvault.com/azure) <br> For details, contact Commvault.
| Veritas                 | Windows, Linux | [https://vox.veritas.com/t5/Protection/Protecting-Azure-Stack-edge-with-NetBackup/ba-p/883370](https://vox.veritas.com/t5/Protection/Protecting-Azure-Stack-edge-with-NetBackup/ba-p/883370) <br> For details, contact Veritas.                    |
| Veeam                   | Windows, Linux | [https://www.veeam.com/kb4041](https://www.veeam.com/kb4041) <br> For details, contact Veeam. |

After the replacement device is fully configured, you can redeploy the VMs with the VM image previously used. 

Follow these steps to recover the data in the VMs:
 
1. [Deploy a VM from a VM image](azure-stack-edge-gpu-deploy-virtual-machine-templates.md) on the device. 
1. Install the data protection solution of choice on the VM.
1. Run the recovery procedure provided by the data protection solution of choice. See references from the preceding table.

## Restore a Kubernetes deployment

If you performed your Kubernetes deployment via Azure Arc, you can restore the deployment after a non-tolerable device failure. You'll need to redeploy the customer application/containers from the `git` repository where the application definition is stored. [Information on deploying Kubernetes with Azure Arc](./azure-stack-edge-gpu-deploy-stateless-application-git-ops-guestbook.md)<!--Original text: Kubernetes deployments can be restored from a non-tolerated failure with the device when deployed with Azure Arc. Customer application/containers deployed onto a Kubernetes on Azure Stack Edge via Azure Arc can be redeployed from the git repository where the application definition is. Here is a link to the article to deploy Kubernetes with Arc -->
 
## Next steps

- Learn how to [Return an Azure Stack Edge Pro device](azure-stack-edge-return-device.md).
