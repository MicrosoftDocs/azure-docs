---
title: Provision simulated TPM Edge device - Azure IoT Edge| Microsoft Docs 
description: Use a simulated TPM on a Linux VM to test device provisioning for Azure IoT Edge
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 06/14/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Create and provision a simulated TPM Edge device on Linux

Azure IoT Edge devices can be auto-provisioned using the [Device Provisionin Service](../iot-dps/index.yml) just like devices that are not edge enabled. If you're unfamiliar with the process of auto-provisioning, review the [auto-provisioning concepts](../iot-dps/concepts-auto-provisioning.md) before continuing. 

This article shows you how to test auto-provisioning on a simulated Edge device with the following steps: 

* Create a Linux virtual machine (VM) in Hyper-V with a simulated Trusted Platform Module (TPM) for hardware security.
* Create an individual enrollment for the device
* Install the IoT Edge runtime and connect the device to IoT Hub

## Prerequisites

* A Windows development machine with [Hyper-V enabled](https://docs.microsoft.com/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v). This article uses Windows 10. 
* [IoT Hub Device Provisioning Service](https://docs.microsoft.com/en-us/azure/iot-dps/quick-setup-auto-provision.md) linked to your IoT hub.

## Simulate TPM device

In this section, you create a new Linux virtual machine on Hyper-V that has a simulated TPM so that you can use it for testing how auto-provisioning works with IoT Edge. 

### Create a virtual switch

A virtual switch enables your virtual machine to connect to a physical network.

1. Open Hyper-V on your windows machine. 

2. In the **Actions** menu, select **Virtual Switch Manager**. 

3. Choose an **External** virtual switch, then select **Create Virtual Switch**. 

4. Give your new virtual switch a name, for example **EdgeSwitch**. Make sure that the connection type is set to **External network**, then select **Ok**.

   ![Create new virtual switch](./media/how-to-simulate-dps-tpm/edgeswitch.png)

5. A pop-up warns you that network connectivity may be disrupted. Select **Yes** to continue. 

If you see errors while creating the new virtual switch, ensure that no other switches are using the ethernet adaptor, and that no other switches use the same name. 

### Import the virtual machine

Download a pre-built image, and use it to create a new virtual machine that has a simulated Trusted Platform Module (TPM).

1. Download the virtual machine image from https://azureiotedgepreview.blob.core.windows.net/shared/ubuntu-tpm-vm/EdgeMaster.zip. Save it locally and extract the files from the zipped folder. 

2. Create an empty folder on your machine where the VM files can be stored, for example **C:\EdgeMasterFiles**.

3. Open Hyper-V again. In the **Actions** menu, select **Import Virtual Machine**. 

4. Complete the following steps for each page of the import wizard:

   1. **Before You Begin**: Click **Next** to start the import setup. 

   2. **Locate Folder**: Browse to the **EdgeMaster** folder that you extracted from the .zip file.

      If you get an error that Hyper-V did not find virtual machines to import, ensure that you selected the folder that contains *Snapshots*, *Virtual Hard Disks*, and *Virtual Machines*. Not a folder level higher or lower.

   3. **Select Virtual Machine**: Select the **EdgeMaster** virtual machine. 

   4. **Choose Import Type**: Select **Copy the virtual machine (create a new unique ID)**. 

   5. **Choose Destination**: Select **Store the virtual machine in a different location**. Browse to the empty folder that you created for the VM files. Use that folder for all three entries on the page. 

      ![Choose destination](./media/how-to-simulate-dps-tpm/choose-destination.png)

   6. **Choose Storage Folders**: Browse to the same folder that you used in the previous step. 

   7. **Summary**: Review the description of your import, then click **Finish** to complete the wizard. 

      ![Import summary](./media/how-to-simulate-dps-tpm/summary.png)

      It may take a view minutes to create the new VM. 