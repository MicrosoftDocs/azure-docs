---
title: Reset and reactivate your Azure Stack Edge Pro device | Microsoft Docs 
description: Learn how to wipe the data from and then reactivate your Azure Stack Edge Pro device.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/03/2020
ms.author: alkohli
---

# Reset and reactivate your Azure Stack Edge Pro device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to reset, reconfigure, and reactivate an Azure Stack Edge Pro device if you're having issues with the device or need to start fresh for some other reason.

After you reset the device to remove the data, you'll need to reactivate the device as a new resource. Resetting a device removes the device configuration, so you'll need to reconfigure the device via the local web UI.

In this article, you learn how to:

> [!div class="checklist"]
>
> * Wipe the data off the data disks on the device
> * Reactivate the device by creating a new order, reconfiguring the device, and activating it

## Reset data from the device

To wipe the data off the data disks of your device, you need to reset your device.

Before you reset, create a copy of the local data on the device if needed. You can copy the data from the device to an Azure Storage container.

>[!IMPORTANT]
> Resetting your device will erase all local data and workloads from your device, and that can't be reversed. Reset your device only if you want to start afresh with the device.

You can reset your device in the local web UI or in PowerShell. For PowerShell instructions, see [Reset your device](./azure-stack-edge-connect-powershell-interface.md#reset-your-device).

[!INCLUDE [Reset data from the device](../../includes/azure-stack-edge-device-reset.md)]

## Reactivate device

After you reset the device, you'll need to reactivate the device as a new resource. After placing a new order, you'll need to reconfigure and then reactivate the new resource.

To reactivate your existing device, follow these steps:

1. Create a new order for the existing device by following the steps in [Create a new resource](azure-stack-edge-gpu-deploy-prep.md?tabs=azure-portal#create-a-new-resource). On the **Shipping address** tab, select **I already have a device**.

   ![Specify no new device in Shipping address](./media/azure-stack-edge-reset-reactivate-device/create-resource-with-no-new-device.png)

1. [Get the activation key](azure-stack-edge-gpu-deploy-prep.md?tabs=azure-portal#get-the-activation-key).

1. [Connect to the device](azure-stack-edge-gpu-deploy-connect.md).

1. [Configure the network for the device](azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md).

1. [Configure device settings](azure-stack-edge-gpu-deploy-set-up-device-update-time.md).

1. [Configure certificates](azure-stack-edge-gpu-deploy-configure-certificates.md).

1. [Activate the device](azure-stack-edge-gpu-deploy-activate.md).

## Next steps

- Learn how to [Connect to an Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-connect.md).
