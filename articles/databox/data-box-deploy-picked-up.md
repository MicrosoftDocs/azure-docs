---
title: Ship Microsoft Azure Data Box back| Microsoft Docs
description: Learn how to ship your Azure Data Box to Microsoft
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: tutorial
ms.date: 10/03/2018
ms.author: alkohli
#Customer intent: As an IT admin, I need to be able to return Data Box to upload on-premises data from my server onto Azure.
---

# Tutorial: Return Azure Data Box and verify data upload to Azure

This tutorial describes how to return Azure Data Box and verify the data uploaded to Azure.

In this tutorial, you will learn about topics such as:

> [!div class="checklist"]
> * Ship Data Box to Microsoft
> * Verify data upload to Azure
> * Erasure of data from Data Box

## Prerequisites

Before you begin, make sure that you have completed the [Tutorial: Copy data to Azure Data Box and verify](data-box-deploy-copy-data.md).

## Ship Data Box back

1. Ensure that the device is powered off and cables are removed. Spool and securely place the power cord that was provided with device in the back of the device.
2. If the device is shipping in US, ensure that the shipping label is displayed on the E-ink display and schedule a pickup with your carrier. If the label is damaged or lost or not displayed on the E-ink display, download the shipping label from the Azure portal and affix on the device. Go to **Overview > Download shipping label**. 

    If the device is shipping in Europe, the E-ink display does not show the shipping label. Instead the return shipping label is included in the clear pouch under the forward shipping label. Remove the old shipping label and ensure that the shipping label is clearly visible.
    
3. Schedule a pickup with UPS if returning the device in US. If you are returning the device in Europe with DHL, request for pickup from DHL by visiting their website and specifying the airway bill number. Go to the country DHL Express website and choose **Book a Courier Collection > eReturn Shipment**. 

    Specify the waybill number and click **Schedule Pickup** to arrange for pickup.

4. Once the Data Box is picked up and scanned by your carrier, the order status in the portal updates to **Picked up**. A tracking ID is also displayed.

## Verify data upload to Azure

When Microsoft receives and scans the device, order status is updated to **Received**. The device then undergoes physical verification for damage or signs of tampering. 

After the verification is complete, the Data Box is connected to the network in the Azure datacenter. The data copy starts automatically. Depending upon the data size, the copy operation may take a few hours to days to complete. You can monitor the copy job progress in the portal.

Once the copy is complete, order status updates to **Completed**.

Verify that your data is in the storage account(s) before you delete it from the source. 

## Erasure of data from Data Box
 
 Once the upload to Azure is complete, the Data Box erases the data on its disks as per the [NIST SP 800-88 Revision 1 guidelines](https://csrc.nist.gov/News/2014/Released-SP-800-88-Revision-1,-Guidelines-for-Medi). 

## Next steps

In this tutorial, you learned about Azure Data Box topics such as:

> [!div class="checklist"]
> * Ship Data Box to Microsoft
> * Verify data upload to Azure
> * Erasure of data from Data Box

Advance to the following article to learn how to manage Data Box via the local web UI.

> [!div class="nextstepaction"]
> [Use local web UI to administer Azure Data Box](./data-box-local-web-ui-admin.md)


