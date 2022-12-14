---
title: Erase data from Azure Stack Edge device and generate a certificate of proof
description: Describes the process to erase data from an Azure Stack Edge device and generate a certificate of proof that data has been removed.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 12/14/2022
ms.author: alkohli
---
# Erase data from Azure Stack Edge device and generate a certificate of proof

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article provides steps to reset an Azure Stack Edge device and generate a certificate of proof that device data has been removed.

After you reset your device, you can generate a Secure Erase Certificate that verifies the following details about your device and its data in an erase record:

 - Summary of device details.
 - Disk by disk details, including erasure type how it was verified.
 
The following erase types are supported:

|Data erasure type |Description  |
|---------|---------|
|CryptoErase  |Description...  |
|Block erase  |Description...
|Next type  |Description...  |     

## Reset the Azure Stack Edge device

1. In Azure portal for your Azure Stack Edge device, select **Device reset** in the left-hand navigation, then select **Reset device**.

   ![Screenshot that shows the Azure portal option to reset an Azure Stack Edge device.](media/azure-stack-edge-gpu-secure-erase-certificate/azure-stack-edge-secure-erase-certificate-reset-device.png)

1. On the Confirm device reset dialog, type **Yes** and then select **Yes** to confirm the reset operation.

   ![Screenshot that shows the Azure portal option to confirm device reset for an Azure Stack Edge device.](media/azure-stack-edge-gpu-secure-erase-certificate/azure-stack-edge-secure-erase-certificate-reset-device-confirmation.png)

## Generate a certificate of proof that Azure Stack data has been removed

Use the following steps to generate a Secure Erase Certificate for your Azure Stack Edge device:

1. steps

## Create and download a Secure erase certificate for your device

1. Troubleshooting > Support > Support package options > Create support package > Download support package
1. What to do with your Secure Erase Certificate...

Yep

## Next steps

Yep
