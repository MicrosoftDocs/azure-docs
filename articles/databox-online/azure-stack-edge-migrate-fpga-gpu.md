---
title: Migration guide for Azure Stack Edge Pro FPGA to GPU physical device
description: This guide contains instructions to migrate workloads from an Azure Stack Edge Pro FPGA device to an Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: tutorial
ms.date: 01/12/2021
ms.author: alkohli  
---
# Migrate data from an Azure Stack Edge Pro FPGA to an Azure Stack Edge Pro GPU

This article describes how to migrate data from an Azure Stack Edge Pro FPGA device to an Azure Stack Edge Pro GPU device. The migration procedure involves an overview of migration including a comparison between the two devices, migration considerations, detailed steps, and verification followed by cleanup.

> [!IMPORTANT]
> Azure Stack Edge Pro FPGA devices will reach end-of-life in February 2024. If you are considering new deployments, we recommend that you explore Azure Stack Edge Pro GPU devices for your workloads.

<!--Migration will result in a downtime. The installation can take around XX hours to complete.  new time estimates etc., also we should be able to take the ASE FPGA workloads to Pro R as well if suited for the scenario? Should we add this somewhere here? -->

## About migration

Data migration is the process of moving data from one storage location to another. This entails making an exact copy of an organization’s current data from one device to another device - preferably without disrupting or disabling active applications - and then redirecting all input/output (I/O) activity to the new device. 

This migration guide provides a step-by-step walkthrough of the steps required to migrate data from an Azure Stack Edge Pro FPGA device to an Azure Stack Edge Pro GPU device. This document is intended for information technology (IT) professionals and knowledge workers who are responsible for operating, deploying, and managing Azure Stack Edge devices in the datacenter.

## Comparison summary

This section provides a comparative summary of capabilities between the Azure Stack Edge Pro GPU vs. the Azure Stack Edge Pro FPGA devices.

|                | Azure Stack Edge Pro GPU (Target device)                                                    | Azure Stack Edge Pro FPGA (Source device)                            |
|----------------|----------------------------------------------------------------------------|-----------------------------------------------------|
| Hardware       | Hardware acceleration: 1 or 2 Nvidia T4 GPUs <br> Compute, memory, network interface, power supply unit, power cord specifications are identical to the device with FPGA.  | Hardware acceleration: Intel Arria 10 FPGA <br> Compute, memory, network interface, power supply unit, power cord specifications are identical to the device with GPU.          |
| Usable storage | 4.19 TB <br> After reserving space for parity resiliency and internal use | 12.5 TB <br> After reserving space for internal use |
| Security       | Certificates |                                                     |
| Workloads      | IoT Edge workloads <br> Compute workloads <br> Kubernetes workloads| IoT Edge workloads |
| Pricing        | [Pricing](https://azure.microsoft.com/pricing/details/azure-stack/edge/) | [Pricing](https://azure.microsoft.com/pricing/details/azure-stack/edge/)|

## Plan for migration

To create your migration plan, consider the following information:

- Develop a schedule for migration. 
- When you migrate data, you will experience a downtime. We recommend that you schedule migration during a downtime maintenance window as the process is disruptive. You will set up and restore configurations in this downtime as described in [Recover the data from your Azure Stack Edge device](azure-stack-edge-gpu-recover-device-failure.md).
- Understand the total length of downtime and communicate it to all the stakeholders.
- Identify the local data that needs to be migrated from the source device. As a precaution, ensure that all the data on the existing storage has a recent backup. The procedure to back up data on an Azure Stack Edge device is described in [Back up your Azure Stack Edge device](azure-stack-edge-gpu-prepare-device-failure.md).


### Supported scenarios 

<!-- is there anything on supported migration paths and software versions we need to add here. Is there a min software version that our FPGA device should be running before we migrate data off it to the new device? How about IoT Edge versions? -->

### Unsupported scenarios

<!--what scenarios or operations are not supported for this migration, are there types of data that can't be moved over, or there are certain entities that can't be migrated-->

- An Azure Stack Edge Pro GPU device can't be activated against an Azure Stack Edge Pro FPGA resource. A new resource should be created for the Azure Stack Edge Pro GPU device as described in the [Create an Azure Stack Edge Pro GPU order]().
- The Machine Learning models deployed on the source device that used the FPGA will need to be changed for the target device with GPU. The custom models deployed on the source device that did not use the FPGA (used CPU only) should work as-is on the target device (using CPU).
- The IoT Edge modules deployed on the source device may require changes before these can be successfully deployed on the target device. 
- The source device supports NFS 3.0 and 4.1 protocols. The target device only supports NFS 3.0 protocol.

## Migration steps at-a-glance

This table summarizes the overall flow for migration, describing the steps required for migration and the location where these steps need to be performed.

| In this phase | Do this step| On this device |
|---------------|-------------|----------------|
| Prepare source device       | 1. Back up configuration data <br>2. Back up local data <br>3. Prepare IoT Edge workloads| Source device  |
| Prepare target device       |4. Create a new order <br>5. Configure and activate| Target device  |
| Migrate data       | 6. Restore data from shares <br>7. Redeploy IoT Edge workloads| Target device  |
| Verify data            |8. Verify migrated data |Target device  |
| Clean up, return              |9. Erase data and return| Source device  |


## 1. Back up configuration data

Do these steps on your source device via the local UI.

Use the [Deployment checklist](azure-stack-edge-gpu-deploy-checklist.md) to help create the device configuration for the source device. During migration, you'll use this configuration information to configure the new target device. 

## 2. Back up share data

The device data can be of one of the following types:

- Data in Edge cloud shares
- Data in local shares

### Data in Edge cloud shares

Edge cloud shares tier data from your device to Azure. Do these steps on your *source* device via the Azure portal. 

1. Make a list of all the Edge cloud shares and users that you have on the source device.
1. Make a list of all the bandwidth templates that you have. You will recreate these bandwidth templates on your target device.
1. Depending on the network bandwidth available, configure bandwidth templates on your device so that as maximize the data tiered to the cloud. This would to minimize local data on the device.

### Data in Edge local shares

Data in Edge local shares stays on the device. Do these steps on your *source* device via the Azure portal. 

1. Make a list of the Edge local shares that you have on the device.
1. Use one of the following third-party data protection solutions to back up the data in the local shares. 

    | Third-party software           | Reference to the solution                               |
    |--------------------------------|---------------------------------------------------------|
    | Cohesity                       | [https://www.cohesity.com/solution/cloud/azure/](https://www.cohesity.com/solution/cloud/azure/) <br> For details, contact Cohesity.          |
    | Commvault                      | [https://www.commvault.com/azure](https://www.commvault.com/azure) <br> For details, contact Commvault.          |
    | Veritas                        | [http://veritas.com/azure](http://veritas.com/azure) <br> For details, contact Veritas.   |
    | Veeam                          | [https://www.veeam.com/kb4041](https://www.veeam.com/kb4041) <br> For details, contact Veeam. |
1. If you have deployed IoT Edge workloads, the configuration data is shared on a share on the device. Back up the data in these shares.

## 3. Prepare IoT Edge workloads

If you have deployed IoT Edge modules and are using FPGA acceleration, you may need to modify the modules before these will run on the GPU device. Follow the instructions in [Modify IoT Edge modules](azure-stack-edge-placeholder.md). 

## 4. Create new order

You need to create a new order (and a new resource) for your *target* device. The target device must be activated against the GPU resource and not against the FPGA resource.

To place an order, [Create a new Azure Stack Edge resource](azure-stack-edge-gpu-deploy-prep.md#) in the Azure portal.


## 5. Set up, activate

You need to set up and activate the *target* device against the new resource you created earlier. 

Follow these steps to configure the *target* device via the Azure portal:

1. Gather the information required in the [Deployment checklist](azure-stack-edge-gpu-deploy-checklist.md). You can use the information that you saved from the source device configuration. 
1. [Unpack](azure-stack-edge-gpu-deploy-install.md#unpack-the-device), [rack mount](azure-stack-edge-gpu-deploy-install.md#rack-the-device) and [cable your device](azure-stack-edge-gpu-deploy-install.md#cable-the-device). 
1. [Connect to the local UI of the device](azure-stack-edge-gpu-deploy-connect.md).
1. Configure the network using the same IP addresses that you used for your old device. Use the same IP addresses to minimize the impact on any client machines used in your environment. See how to [configure network settings](azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md).
1. Assign the same device name and DNS domain as your old device. That way, your clients can use the same device name to talk to the new device. See how to [configure device setting](azure-stack-edge-gpu-deploy-set-up-device-update-time.md).
1. Configure certificates on the new device. See how to [configure certificates](azure-stack-edge-gpu-deploy-configure-certificates.md).
1. Get the activation key from the Azure portal and activate the new device. See how to [activate the device](azure-stack-edge-gpu-deploy-activate.md).

You are now ready to restore the share data and deploy the workloads that you were running on the old device.

## 6. Migrate data

You will now restore data from Edge cloud shares and Edge local shares on your *target* device.

### Restore Edge cloud shares

Follow these steps to restore the data on the Edge cloud shares on your device:

1. [Add shares](azure-stack-edge-j-series-manage-shares.md#add-a-share) with the same share names created previously on the failed device. Make sure that while creating shares, **Select blob container** is set to **Use existing** option and then select the container that was used with the previous device.
1. [Add users](azure-stack-edge-j-series-manage-users.md#add-a-user) that had access to the previous device.
1. [Add storage accounts](azure-stack-edge-j-series-manage-storage-accounts.md#add-an-edge-storage-account) associated with the shares previously on the device. While creating Edge storage accounts, select from an existing container and point to the container that was mapped to the Azure Storage account mapped on the previous device. Any data from the device that was written to the Edge storage account on the previous device was uploaded to the selected storage container in the mapped Azure Storage account. <!-- I don't think FPGA devices support Edge storage accounts, if confirmed, delete this-->
1. [Refresh the share](azure-stack-edge-j-series-manage-shares.md#refresh-shares) data from Azure. This pulls down all the cloud data from the existing container to the shares.

<!-- what about bandiwdth templates? Shouldn't we recreate those as well?-->

### Restore Edge local shares

You may have deployed a third-party backup solution to protect the local shares data for your IoT workloads. You will now need to restore that data.

After the replacement device is fully configured, enable the device for local storage. 

Follow these steps to recover the data from local shares:

1. [Configure compute on the device](azure-stack-edge-gpu-deploy-configure-compute.md).
1. [Add a local share](azure-stack-edge-j-series-manage-shares.md#add-a-local-share) back.
1. Run the recovery procedure provided by the data protection solution of choice. See references in the following table.

    | Third-party software           | Reference to the solution                               |
    |--------------------------------|---------------------------------------------------------|
    | Cohesity                       | [https://www.cohesity.com/solution/cloud/azure/](https://www.cohesity.com/solution/cloud/azure/) <br> For details, contact Cohesity.          |
    | Commvault                      | [https://www.commvault.com/azure](https://www.commvault.com/azure) <br> For details, contact Commvault. |
    | Veritas                        | [http://veritas.com/azure](http://veritas.com/azure) <br> For details, contact Veritas.   |
    | Veeam                          | [https://www.veeam.com/kb4041](https://www.veeam.com/kb4041) <br> For details, contact Veeam. |
## 7. Redeploy IoT Edge workloads

<!--need to have info on redeploying the IoT Edge workloads. They would also have the option of using K8 to deploy some of the existing IoT Edge workloads-->

## 8. Verify data

After migration, verify that all the data has migrated and the workloads have been deployed on the target device.

## 9. Erase data, return

After the data migration is complete, erase local data and return the source device. Follow the steps in [Return your Azure Stack Edge Pro device](azure-stack-edge-return-device.md)

## Troubleshoot migration
<!--need to have section on this, most common problems. For example, issues running FPGA modules as-is on the GPU device w/ K8 hosting platform -->


## Next steps

[Learn how to deploy IoT Edge workloads on Azure Stack Edge Pro GPU device](azure-stack-edge-placeholder.md)
