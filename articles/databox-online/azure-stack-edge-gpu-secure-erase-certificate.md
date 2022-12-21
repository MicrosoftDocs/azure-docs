---
title: Erase data from Azure Stack Edge device and generate a certificate of proof
description: Describes the process to erase data from an Azure Stack Edge device and generate a certificate of proof that data has been removed.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 12/21/2022
ms.author: alkohli
---
# Erase data from Azure Stack Edge device and generate a certificate of proof

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article provides steps to reset an Azure Stack Edge device. After you reset your device, you can generate a Secure Erase Certificate that verifies details about your device and its data in an erase record.
 
The following erase types are supported:

|Data erasure type |Description  |
|---------|---------|
|CryptoErase  |Sanitizes the encryption key, leaving the data on disk unrecoverable.  |
|Block erase  |Deletes all user data from the disk.  |

## Reset the Azure Stack Edge device

1. In Azure portal for your Azure Stack Edge device, select **Device reset** in the left-hand navigation, then select **Reset device**.

   ![Screenshot that shows the Azure portal option to reset an Azure Stack Edge device.](media/azure-stack-edge-gpu-secure-erase-certificate/azure-stack-edge-secure-erase-certificate-reset-device.png)

1. On the Confirm device reset dialog, type **Yes** and then select **Yes** to confirm the reset operation.

   ![Screenshot that shows the Azure portal option to confirm device reset for an Azure Stack Edge device.](media/azure-stack-edge-gpu-secure-erase-certificate/azure-stack-edge-secure-erase-certificate-reset-device-confirmation.png)

1. The reset operation includes generation of a Secure Erase Certificate, as shown below:

   ![Screenshot of the Secure Erase Certificate following reset of an Azure Stack Edge device.](media/azure-stack-edge-gpu-secure-erase-certificate/azure-stack-edge-secure-erase-certificate.png)

## Download the Secure erase certificate for your device

Use the following steps to download a Secure Erase Certificate for your device after device reset:

1. **Troubleshooting** > **Support** > **Support package options** > **Create support package** > **Download support package**.

## Next steps

Yep
