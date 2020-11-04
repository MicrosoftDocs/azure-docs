---
title: Return your Azure Stack Edge Pro device | Microsoft Docs 
description: Learn how to wipe the data and return your Azure Stack Edge Pro device, and then delete the resource associated with the device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/27/2020
ms.author: alkohli
---

# Return your Azure Stack Edge Pro device

This article describes how to wipe the data and then return your Azure Stack Edge Pro device. After you've returned the device, you can also delete the resource associated with the device.

In this article, you learn how to:

> [!div class="checklist"]
>
> * Wipe the data off the data disks on the device
> * Initiate device return in Azure portal
> * Pack up the device and schedule a pickup
> * Delete the resource in Azure portal

## Erase data from the device

To wipe the data off the data disks of your device, you need to reset your device. You can reset your device using the local web UI or the PowerShell interface.

Before you reset, create a copy of the local data on the device if needed. You can copy the data from the device to an Azure Storage container.

You can initiate the device return even before the device is reset. 

To reset your device using the local web UI, take the following steps.

1. In the local web UI, go to **Maintenance > Device reset**.
2. Select **Reset device**.

    ![Reset device](media/azure-stack-edge-return-device/device-reset-1.png)

3. When prompted for confirmation, review the warning and select **Yes** to continue.

    ![Confirm reset](media/azure-stack-edge-return-device/device-reset-2.png)  

The reset erases the data off the device data disks. Depending on the amount of data on your device, this process takes about 30-40 minutes.

Alternatively, connect to the PowerShell interface of the device and use the `Reset-HcsAppliance` cmdlet to erase the data from the data disks. For more information, see [Reset your device](azure-stack-edge-connect-powershell-interface.md#reset-your-device).

> [!NOTE]
> - If you're exchanging or upgrading to a new device, we recommend that you reset your device only after you've received the new device.
> - The device reset only deletes all the local data off the device. The data that is in the cloud isn't deleted and collects [charges](https://azure.microsoft.com/pricing/details/storage/). This data needs to be deleted separately using a cloud storage management tool like [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

## Initiate device return

To begin the return process, take the following steps.

1. Go to your Azure Stack Edge Pro/Data Box Gateway resource in Azure portal. In the **Overview**, go to the command bar in the right pane and select **Return device**. 

    ![Return device 1](media/azure-stack-edge-return-device/return-device-1.png)  

2. In the **Return device** blade, under **Basic details**:

    1. Provide the serial number of the device. To get the device serial number, go the local web UI of the device and then go to **Overview**.  
    
    ![Device serial number 1](media/azure-stack-edge-return-device/device-serial-number-1.png) 

    2. Enter the service tag number which is a five or more character identifier that is unique to your device. The service tag is located on the bottom right corner of the device (as you face the device). Pull out the information tag (it is a slide-out label panel). This panel contains system information such as service tag, NIC, MAC address, and so on. 
    
    ![Service tag number 1](media/azure-stack-edge-return-device/service-tag-number-1.png)

    3. From the dropdown list, choose a reason for the return.

    ![Return device 2](media/azure-stack-edge-return-device/return-device-2.png) 

3. Under **Shipping details**:

    1. Provide your name, company name, and full company address. Enter a work phone including the area code and an email ID for notification.
    2. If you need a return shipping box, you can request it. Answer **Yes** to the question **Need an empty box to return**.

    ![Return device 3](media/azure-stack-edge-return-device/return-device-3.png)

4. Review the **Privacy terms** and select the checkbox against the note that you have reviewed and agree to the privacy terms.

5. Select **Initiate return**.

    ![Return device 4](media/azure-stack-edge-return-device/return-device-4.png) 

6. Once your device return details are captured, you can notify the Azure Stack Edge Pro operations team via an email. You can use your email application assuming the email application is installed and configured. You can also copy the data to create and send an email.

    ![Return device 5](media/azure-stack-edge-return-device/return-device-5.png) 

7. Once the Azure Stack Edge Pro operations team receives the email, they will send you a reverse shipment label. When you receive this label, you can schedule the device pickup with the carrier. 

## Schedule a pickup

To schedule a pickup, take the following steps.

1. Shut down the device. In the local web UI, go to **Maintenance > Power settings**.
2. Select **Shut down**. When prompted for confirmation, click **Yes** to continue. For more information, see [Manage power](data-box-gateway-manage-access-power-connectivity-mode.md#manage-power).
3. Unplug the power cables and remove all the network cables from the device.
4. Prepare the shipment package by using your own box or the empty box you received from Azure. Place the device and the power cords that were shipped with the device in the box.
5. Affix the shipping label that you received from Azure on the package.
6. Schedule a pickup with your regional carrier. If returning the device in US, your carrier could be UPS or FedEx. To schedule a pickup with UPS:

    1. Call the local UPS (country/region-specific toll free number).
    2. In your call, quote the reverse shipment tracking number as shown on your printed label.
    3. If the tracking number isn't quoted, UPS will require you to pay an additional charge during pickup.

    Instead of scheduling the pickup, you can also drop off the Azure Stack Edge Pro at the nearest drop-off location.

## Delete the resource

After the device is received at the Azure datacenter, the device is inspected for damage or any signs of tampering.

- If the device arrives intact and is in good shape, the billing meter stops for that resource. Azure Stack Edge Pro operations team will contact you to confirm that the device was returned. You can then delete the resource associated with the device in the Azure portal.
- If the device arrives significantly damaged, fines may apply. For details, see the [FAQ on lost or damaged device](https://azure.microsoft.com/pricing/details/databox/edge/) and [Product Terms of Service](https://www.microsoft.com/licensing/product-licensing/products).  


You can delete the device in the Azure portal:

- After you have placed the order and before the device is prepared by Microsoft.
- After you've returned the device to Microsoft, it passes the physical inspection at the Azure datacenter, and Azure Stack Edge Pro operations team calls to confirm that the device was returned.

If you've activated the device against another subscription or location, Microsoft will move your order to the new subscription or location within one business day. After the order is moved, you can delete this resource.


Take the following steps to delete the device and the resource in Azure portal.

1. In the Azure portal, go to your resource and then to **Overview**. From the command bar, select **Delete**.

    ![Select delete](media/azure-stack-edge-return-device/delete-resource-1.png)

2. In the **Delete device** blade, type the name of the device you want to delete and select **Delete**.

    ![Confirm delete](media/azure-stack-edge-return-device/delete-resource-2.png)

You're notified after the device and the associated resource is successfully deleted.


## Next steps

- Learn how to [Get a replacement Azure Stack Edge Pro device](azure-stack-edge-replace-device.md).
