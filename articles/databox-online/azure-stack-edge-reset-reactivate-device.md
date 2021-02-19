---
title: Reset and reactivate your Azure Stack Edge Pro device | Microsoft Docs 
description: Learn how to wipe the data from and then reactivate your Azure Stack Edge Pro device.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 02/19/2020
ms.author: alkohli
---

# Reset and reactive your Azure Stack Edge Pro device

This article describes how to wipe the data from your Azure Stack Edge Pro device and then reset it.<!--What's the scenario?-->

In this article, you learn how to:

> [!div class="checklist"]
>
> * Wipe the data off the data disks on the device
> * Reactivate the device by creating a new order for the existing device

## Reset data from the device

[!INCLUDE] [Reset data from the device](../../includes/azure-stack-edge-device-reset.md)

> [!NOTE]
> The device reset only deletes all the local data off the device. The data that is in the cloud isn't deleted and collects [charges](https://azure.microsoft.com/pricing/details/storage/). This data needs to be deleted separately using a cloud storage management tool like [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).<!--Is this relevant to the reset and reactivate scenario?-->

## Reactivate device

To reactive the device:

1. Create a new order by following the steps in [Create a new resource](azure-stack-edge-gpu-deploy-prep?tabs=azure-portal#create-a-new-resource). On the **Shipping address** tab, select **I already have a device**.

1. Reactivate the device by following the steps in [Get the activation key](azure-stack-edge-gpu-deploy-prep?tabs=azure-portal#get-the-activation-key).

## Next steps
<!--Do they need to do any install, connect activities after they reactivate a device?-->
- Learn how to [Get a replacement Azure Stack Edge Pro device](azure-stack-edge-replace-device.md).