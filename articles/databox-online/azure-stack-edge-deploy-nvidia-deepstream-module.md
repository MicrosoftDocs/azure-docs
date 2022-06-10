---
title: Deploy the Nvidia DeepStream module on Ubuntu VM on Azure Stack Edge Pro with GPU | Microsoft Docs
description: Learn how to deploy the Nvidia Deepstream module on an Ubuntu virtual machine that is running on your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 06/10/2022
ms.author: alkohli
---

# Deploy the Nvidia DeepStream module on Ubuntu VM on Azure Stack Edge Pro with GPU

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article walks you through deploying Nvidia’s DeepStream module. This content only applies to GPU environments. 

## Prerequisites

Before you begin, make sure you have:

- A VM that is set up for GPU during VM creation.

## Get module from IoT Edge Module Marketplace

1. From **IoT Hub** > select **set modules**.

    ![Screenshot of the Azure portal, IoT Hub, set modules page.](media/azure-stack-edge-gpu-deploy-iot-edge-linux-vm/azure-portal-create-vm-iot-hub-set-module.png)

1. Select **Add** > **IoT Edge Module**.

    ![Screenshot of the Azure portal, Marketplace Module, Add modules selection.](media/azure-stack-edge-gpu-deploy-iot-edge-linux-vm/azure-portal-create-vm-add-iot-edge-module.png)

1. Search for **NVIDIA DeepStream SDK 5.1 for x86/AMD64** and then select it. 

    ![Screenshot of the Azure portal, Marketplace Module, modules options.](media/azure-stack-edge-gpu-deploy-iot-edge-linux-vm/azure-portal-create-vm-iot-edge-module-marketplace.png)

1. Select **Review + Create**, and then select **Create module**.

## Verify runtime status of the module

1. Verify that the module is running.  

     ![Screenshot of the Azure portal, modules runtime status.](media/azure-stack-edge-gpu-deploy-iot-edge-linux-vm/azure-portal-create-vm-verify-module-status.png)

1. Verify that the module provides the following output in the troubleshooting page of the IoT Edge device on IoT Hub:

    ![Screenshot of the Azure portal, NVIDIADeepStreamSDK log file output.](media/azure-stack-edge-gpu-deploy-iot-edge-linux-vm/azure-portal-create-vm-troubleshoot-iot-edge-module.png)

    ![Screenshot of the Azure portal, NVIDIADeepStreamSDK log file output, continued.](media/azure-stack-edge-gpu-deploy-iot-edge-linux-vm/azure-portal-create-vm-troubleshoot-iot-edge-module-2.png)
    
1. After a certain period of time, the module runtime will complete and quit, causing the module status to return an error. This error condition is expected behavior.

    ![Screenshot of the Azure portal, NVIDIADeepStreamSDK module runtime status with error condition.](media/azure-stack-edge-gpu-deploy-iot-edge-linux-vm/azure-portal-create-vm-add-iot-edge-module-error.png)