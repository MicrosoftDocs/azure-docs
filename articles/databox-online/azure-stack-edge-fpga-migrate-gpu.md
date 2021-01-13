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

Migration will result in a downtime. The installation can take around XX hours to complete. <!-- new time estimates etc., also we should be able to take the ASE FPGA workloads to Pro R as well if suited for the scenario? Should we add this somewhere here? -->

## About migration

Data migration is the process of moving data from one storage location to another. This entails making an exact copy of an organization’s current data from one device to another device—preferably without disrupting or disabling active applications—and then redirecting all input/output (I/O) activity to the new device. 

This migration guide provides a step-by-step walkthrough of the steps required to migrate data from an Azure Stack Edge Pro FPGA device to an Azure Stack Edge Pro GPU device. This document is intended for information technology (IT) professionals and knowledge workers who are responsible for operating, deploying, and managing Azure Stack Edge devices in the datacenter.

## Comparison summary

This section provides a comparative summary of capabilities between the Azure Stack Edge Pro GPU vs. the Azure Stack Edge Pro FPGA devices.

|                | Azure Stack Edge Pro GPU (Target device)                                                    | Azure Stack Edge Pro FPGA (Source device)                            |
|----------------|----------------------------------------------------------------------------|-----------------------------------------------------|
| Hardware       | Hardware acceleration: 1 or 2 Nvidia T4 GPUs <br> Compute, memory, network interface, power supply unit, power cord specifications are identical to the device with FPGA.  | Hardware acceleration: Intel Arria 10 FPGA <br> Compute, memory, network interface, power supply unit, power cord specifications are identical to the device with GPU.          |
| Usable storage | 4.19 TB <br> After reserving space for parity resiliency and internal use | 12.5 TB <br> After reserving space for internal use |
| Security       | Certificates                                                               |                                                     |
| Workloads      | IoT Edge workloads <br> Compute workloads <br> Kubernetes workloads        | IoT Edge workloads                                  |
| Pricing        | Pricing                                                                    | Pricing                                             |


## Plan for migration

To create your migration plan, consider the following information:

- Develop a schedule for migration. 
- When you migrate data, you will experience a downtime. We recommend that you schedule migration during a downtime maintenance window as the process is disruptive. You will set up and restore configurations in this downtime as described in [Recover the data from your Azure Stack Edge device]().
- Understand the total length of downtime and communicate it to all the stakeholders.
- Identify the local data that needs to be migrated from the source device. As a precaution, ensure that all the data on the existing storage has a recent backup. The procedure to back up data on an Azure Stack Edge device is described in [Back up your Azure Stack Edge device]().
- Identify any required pre-migration configuration changes for the target device. These changes are described in the Migration Prerequisites section.

## Supported scenarios 

<!-- is there anything on supported migration paths and software versions we need to add here. Is there a min software version that our FPGA device should be running before we migrate data off it to the new device -->

## Unsupported scenarios

<!--what scenarios or operations are not supported for this migration, are there types of data that can't be moved over, or there are certain entities that can't be migrated-->

- An Azure Stack Edge Pro GPU device can't be activated against an Azure Stack Edge Pro FPGA resource. A new resource should be created for the Azure Stack Edge Pro GPU device as described in the [Create an Azure Stack Edge Pro GPU order]().
- The Machine Learning models deployed on the source device that used the FPGA will need to be changed for the target device with GPU. The custom models deployed on the source device that did not use the FPGA (used CPU only) should work as-is on the target device (using CPU).
- The IoT Edge modules deployed on the source device may require changes before these can be successfully deployed on the target device. 
- The source device supports 3.0 and 4.1 NFS protocols. The target device only supports 3.0 NFS protocol.

## Migration steps at-a-glance

This table summarizes the overall flow for migration, describing the steps required for migration and the location where these steps need to be performed.

| In this phase | Do this step| On this device |
|---------------|-------------|----------------|
| Prepare       | Step 1: Back up configuration data <br>Step 2: Back up local data| Source device  |
| Migrate       | Step 3: Create a new order <br>Step 4: Configure and activate| Target device  |
| Clean up              | Step 5: Erase data and return| Source device  |


## 1. Back up config data

Do these steps on your source device via the local UI.

Use the [Deployment checklist](azure-stack-edge-gpu-deploy-checklist.md) to help create the device configuration for the source device. During migration, you'll use this configuration information to configure the new target device. 

## 2. Back up local data

The device data can be of one of the following types:

- Data in Edge cloud shares
- Data in local shares

### Back up data in Edge cloud shares

Edge cloud shares tier data from your device to Azure. Do these steps on your **source** device via the Azure portal. 

1. Make a list of all the Edge cloud shares and users that you have on the source device.
1. Make a list of all the bandwidth templates that you have. You will recreate these bandwidth templates on your target device.
1. Depending on the network bandwidth available, configure bandwidth templates on your device so that as maximize the data tiered to the cloud. This would to minimize local data on the device.

### Back up data in Edge local shares

Data in Edge local shares stays on the device. Do these steps on your **source** device via the Azure portal. 

1. Make a list of the Edge local shares that you have on the device.
1. Use one of the following third-party data protection solutions to back up the data in the local shares. 

    | Third-party software           | Reference to the solution                               |
    |--------------------------------|---------------------------------------------------------|
    | Cohesity                       | [https://www.cohesity.com/solution/cloud/azure/](https://www.cohesity.com/solution/cloud/azure/) <br> For details, contact Cohesity.          |
    | Commvault                      | [https://www.commvault.com/azure](https://www.commvault.com/azure) <br> For details, contact Commvault.          |
    | Veritas                        | [http://veritas.com/azure](http://veritas.com/azure) <br> For details, contact Veritas.   |
    | Veeam                          | [https://www.veeam.com/kb4041](https://www.veeam.com/kb4041) <br> For details, contact Veeam. |
1. If you have deployed IoT Edge workloads, the configuration data is shared on a share on the device. Back up the data in these shares.

## Prepare IoT Edge workloads

If you have deployed IoT Edge modules and are using FPGA acceleration, you may need to modify the modules before these will run on the GPU device. Follow the instructions in [Modify IoT Edge modules](). 

## 3. Create new order

You need to create a new order (and a new resource) for your target device. The target device must be activated against the GPU resource and not against the FPGA resource.

Follow the steps in [Create an order for Azure Stack Edge GPU device]() in the Azure portal to place an order.


## 4. Set up, activate

You need to set up and activate the target device against the new resource you created earlier. Do these steps on the **target** device via the Azure portal.

1. Unpack, rack mount, and cable the device for power and network. See the steps in Install your device.
1. Connect to the local UI of the device.
1. 
1. 
1. 

## 5. Erase data, return



## Post migration verification and cleanup
<!-- didn't see anything on this. -->

## Troubleshoot migration
<!--need to have section on this, most common problems. For example, issues running FPGA modules as-is on the GPU device w/ K8 hosting platform -->


## Next steps

In this tutorial, you learned about Azure Stack Edge Pro topics such as how to:

> [!div class="checklist"]
> * Unpack the device
> * Rack the device
> * Cable the device

Advance to the next tutorial to learn how to connect, set up, and activate your device.

> [!div class="nextstepaction"]
> [Connect and set up Azure Stack Edge Pro](./azure-stack-edge-deploy-connect-setup-activate.md)
