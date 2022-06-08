---
title: Deploy the Nvidia DeepStream module on Ubuntu VM on Azure Stack Edge Pro with GPU | Microsoft Docs
description: Learn how to deploy the Nvidia Deepstream module on an Ubuntu virtual machine that is running on your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 06/08/2022
ms.author: alkohli
---

## Deploying the Nvidia DeepStream module on Ubuntu VM on Azure Stack Edge Pro with GPU

This section walks you through deploying Nvidia’s DeepStream module. This section only applies to GPU environments. Ensure that the VM was set up for GPU during VM creation.

1. From **IoT Hub** > **set modules**.

    ![Screenshot of the Azure portal, IoT Hub, set modules page.](media/azure-stack-edge-gpu-deploy-iot-edge-linux-vm/azure-portal-create-vm-iot-hub-set-module.png)

1. Add modules from Marketplace Module.

    ![Screenshot of the Azure portal, Marketplace Module, Add modules selection.](media/azure-stack-edge-gpu-deploy-iot-edge-linux-vm/azure-portal-create-vm-add-iot-edge-module.png)

1. Search for “NVIDIA DeepStream SDK 5.1 for x86/AMD64" and then select it. 

    ![Screenshot of the Azure portal, Marketplace Module, modules options.](media/azure-stack-edge-gpu-deploy-iot-edge-linux-vm/azure-portal-create-vm-iot-edge-module-marketplace.png)

1. Select **Review + Create** then **Create modules**. 

1. Verify that the module is running.  

     ![Screenshot of the Azure portal, modules runtime status.](media/azure-stack-edge-gpu-deploy-iot-edge-linux-vm/azure-portal-create-vm-verify-module-status.png)