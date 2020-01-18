---
title: Tutorial to ship Azure Data Box back| Microsoft Docs
description: Learn how to ship your Azure Data Box to Microsoft
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: tutorial
ms.date: 09/20/2019
ms.author: alkohli
ms.localizationpriority: high

# Customer intent: As an IT admin, I need to be able to return Data Box to upload on-premises data from my server onto Azure.
---

::: zone target="docs"

# Tutorial: Return Azure Data Box and verify data upload to Azure

::: zone-end

::: zone target="chromeless"

# Return Data Box and verify data upload to Azure

::: zone-end

::: zone target="docs"

This tutorial describes how to return Azure Data Box and verify the data uploaded to Azure.

In this tutorial, you will learn about topics such as:

> [!div class="checklist"]
> * Prerequisites
> * Prepare to ship
> * Ship Data Box to Microsoft
> * Verify data upload to Azure
> * Erasure of data from Data Box

## Prerequisites

Before you begin, make sure:

- You've have completed the [Tutorial: Copy data to Azure Data Box and verify](data-box-deploy-copy-data.md). 
- Copy jobs are complete. Prepare to ship can't run if copy jobs are in progress.

## Prepare to ship

[!INCLUDE [data-box-prepare-to-ship](../../includes/data-box-prepare-to-ship.md)]

::: zone-end

::: zone target="chromeless"

After the data copy is complete, you prepare and ship the device. When the device reaches Azure datacenter, data is automatically uploaded to Azure.

## Prepare to ship

Before you prepare to ship, make sure that copy jobs are complete.

1. Go to **Prepare to ship** page in the local web UI and start the ship preparation. 
2. Turn off the device from the local web UI. Remove the cables from the device. 

The next steps are determined by where you are returning the device.

::: zone-end

::: zone target="docs"

## Ship Data Box back

Ensure that the data copy to device is complete and **Prepare to ship** run is successful. Based on the region where you are shipping the device, the procedure is different.

::: zone-end

## [In US, Canada, Europe](#tab/in-us-canada-europe)

Take the following steps if returning the device in US, Canada, or Europe.

1. Make sure that the device is powered off and cables are removed. 
2. Spool and securely place the power cord that was provided with device in the back of the device.
3. Ensure that the shipping label is displayed on the E-ink display and schedule a pickup with your carrier. If the label is damaged or lost or not displayed on the E-ink display, contact Microsoft Support. If the Support suggests, then you can go to **Overview > Download shipping label** in the Azure portal. Download the shipping label and affix on the device. 
4. Schedule a pickup with UPS if returning the device. To schedule a pickup:

    - Call the local UPS (country/region-specific toll free number).
    - In your call, quote the reverse shipment tracking number as shown in the E-ink display or your printed label.
    - If the tracking number is not quoted, UPS will require you to pay an additional charge during pickup.

    Instead of scheduling the pickup, you can also drop off the Data Box at the nearest drop-off location.
4. Once the Data Box is picked up and scanned by your carrier, the order status in the portal updates to **Picked up**. A tracking ID is also displayed.

::: zone target="chromeless"

## Verify data upload to Azure

[!INCLUDE [data-box-verify-upload](../../includes/data-box-verify-upload.md)]

## Erasure of data from Data Box
 
Once the upload to Azure is complete, the Data Box erases the data on its disks as per the [NIST SP 800-88 Revision 1 guidelines](https://csrc.nist.gov/News/2014/Released-SP-800-88-Revision-1,-Guidelines-for-Medi).

::: zone-end

::: zone target="docs"

[!INCLUDE [data-box-verify-upload-return](../../includes/data-box-verify-upload-return.md)]



::: zone-end


## [In Australia](#tab/in-australia)

Azure datacenters in Australia have an additional security notification. All the inbound shipments must have an advanced notification. Take the following steps to ship in Australia.


1. Retain the original box used to ship the device for return shipment.
2. Make sure that the data copy to device is complete and **Prepare to ship run** is successful.
3. Power off the device and remove the cables.
4. Spool and securely place the power cord that was provided with the device in the back of the device.
5. Book a pick-up online at the [DHL Link](https://mydhl.express.dhl/au/en/schedule-pickup.html#/schedule-pickup#label-reference).

::: zone target="chromeless"

## Verify data upload to Azure

[!INCLUDE [data-box-verify-upload](../../includes/data-box-verify-upload.md)]

## Erasure of data from Data Box
 
Once the upload to Azure is complete, the Data Box erases the data on its disks as per the [NIST SP 800-88 Revision 1 guidelines](https://csrc.nist.gov/News/2014/Released-SP-800-88-Revision-1,-Guidelines-for-Medi).

::: zone-end

::: zone target="docs"

[!INCLUDE [data-box-verify-upload-return](../../includes/data-box-verify-upload-return.md)]

::: zone-end

## [In Japan](#tab/in-japan) 

1. Retain the original box used to ship the device for return shipment.
2. Power off the device and remove the cables.
3. Spool and securely place the power cord that was provided with the device in the back of the device.
4. Write your company name and address information on the consignment note as your sender information.
5. Email Quantium solution using the following email template.

    - If Japan Post Chakubarai consignment note wasn't included or is missing, note that in this email. Quantium Solutions Japan will request Japan Post to bring the consignment note upon pickup.
    - If you have multiple orders, email to ensure individual pickup.

    ```
    To: Customerservice.JP@quantiumsolutions.com
    Subject: Pickup request for Azure Data Box｜Job name： 
    Body: 
    - Japan Post Yu-Pack tracking number (reference number)：
    - Requested pickup date：mmdd (Select a requested time slot from below).
    a. 08：00-13：00 
    b. 13：00-15：00 
    c. 15：00-17：00 
    d. 17：00-19：00 
    ```

3. Receive an email confirmation from Quantium solutions after you've booked a pickup. The email confirmation also includes information on the Chakubarai consignment note.

If needed, you can contact Quantium Solution Support (Japanese language) at the following information: 

- Email：Customerservice.JP@quantiumsolutions.com 
- Telephone：03-5755-0150 

::: zone target="chromeless"

## Verify data upload to Azure

[!INCLUDE [data-box-verify-upload](../../includes/data-box-verify-upload.md)]

## Erasure of data from Data Box
 
Once the upload to Azure is complete, the Data Box erases the data on its disks as per the [NIST SP 800-88 Revision 1 guidelines](https://csrc.nist.gov/News/2014/Released-SP-800-88-Revision-1,-Guidelines-for-Medi).

::: zone-end

::: zone target="docs"

[!INCLUDE [data-box-verify-upload-return](../../includes/data-box-verify-upload-return.md)]

::: zone-end



