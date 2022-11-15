---
title: Migrate Azure Stack Edge from managed to self-service IoT Edge Linux VM 
description: Describes migration steps for an Azure Stack Edge device from managed to self-service IoT Edge Linux VM.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 11/15/2022
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to migrate an Azure Stack Edge device from managed to self-service IoT Edge Linux VM, so that I can efficiently manage my VMs. 
---

# Migrate Azure Stack Edge from managed to self-service IoT Edge Linux VM

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article provides general guidance on how to move your native/managed IoT Edge workloads to the IoT Edge running on a Linux VM on Azure Stack Edge. 

We use an example that uses an IoT Edge running on an Ubuntu VM on Azure Stack Edge. We recommend that you deploy the latest IoT Edge version in a Linux VM to run IoT Edge workloads on Azure Stack Edge. The native/managed IoT Edge on Azure Stack Edge uses an older version of IoT Edge runtime (IoT Edge version 1.1) that doesn’t have the latest features and updates. For more information, see [IoT Edge v1.1 EoL: What does that mean for me?](https://techcommunity.microsoft.com/t5/internet-of-things-blog/iot-edge-v1-1-eol-what-does-that-mean-for-me/ba-p/3662137). 

## IoT migration workflow

The high-level migration workflow is as follows:

1. From IoT Hub, create a new IoT Edge device to connect with a new IoT Edge device running on a VM. For detailed steps, see [](). 

1. Deploy a Linux VM and install IoT Edge runtime on it. Connect the newly deployed IoT Edge runtime (from step 2) with the newly created IoT Edge device (from step 1). Refer here for details. 

1. From IoT Hub, re-deploy modules onto the new IoT Edge device. Refer here for details. 

1. Once your solution is running on IoT Edge on a Linux VM, you can remove the modules running on the native/managed IoT Edge on Azure Stack Edge. From IoT Hub, delete the IoT Edge device to remove the modules running on Azure Stack Edge. Refer here for details. 

1. Optional: if you are not using the Kubernetes cluster on Azure Stack Edge, you can delete the whole Kubernetes cluster. From Azure Stack Edge resource on Azure portal under the Azure IoT Edge service, there is a “Remove” button to remove the Kubernetes cluster. Refer here for details  

1. Optional: If have leaf IoT devices communicating IoT Edge on K8s, changes will be needed to communicate with the IoT Edge on VM. Refer here for details. 

## Prerequisites

## Create an IoT Edge device on Linux using symmetric Keys

Create and provision an IoT Edge device on Linux using symmetric keys. For detailed steps, see [Create and provision an IoT Edge device on Linux using symmetric keys](../iot-edge/how-to-provision-single-device-linux-symmetric?view=iotedge-1.4&tabs=azure-portal%2Cubuntu). 

## Install and provision an IoT Edge on a Linux VM

Follow the steps at [Deploy IoT Edge runtime](azure-stack-edge-gpu-deploy-iot-edge-linux-vm.md#deploy-iot-edge-runtime). To deploy other Linux VMs, see [Linux containers](../iot-edge/support?view=iotedge-1.4#linux-containers). 

## Deploy Azure IoT Edge modules from the Azure portal

Deploy Azure IoT modules modules to the new IoT Edge. For detailed steps, see [Deploy Azure IoT Edge modules from the Azure portal](../iot-edge/how-to-deploy-modules-portal?view=iotedge-1.4). 

 -Deploy modules from Azure portal - Azure IoT Edge | Microsoft Learn. With the latest IoT Edge version, you can deploy your IoT Edge modules at scale. For more information see here - Deploy modules at scale in Azure portal - Azure IoT Edge | Microsoft Learn. 

## Remove Azure IoT Edge modules from the Azure portal 

## Remove the IoT Edge service

## Configure IoT Edge device as a transparent gateway

## Next steps

[Deploy VMs on your Azure Stack Edge Pro GPU device via the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md)



