---
title: Tutorial to ship Azure Data Box back in export order| Microsoft Docs
description: Learn how to ship your Azure Data Box to Microsoft after the export order is complete
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: tutorial
ms.date: 07/21/2020
ms.author: alkohli

# Customer intent: As an IT admin, I need to be able to return Data Box to upload on-premises data from my server onto Azure.
---

# Tutorial: Return Azure Data Box (Preview)

This tutorial describes how to return Azure Data Box and the data is erased once the device is received at the Azure data.

In this tutorial, you will learn about topics such as:

> [!div class="checklist"]
>
> * Prerequisites
> * Prepare to ship
> * Ship Data Box to Microsoft
> * Erasure of data from Data Box

[!INCLUDE [Data Box feature is in preview](../../includes/data-box-feature-is-preview-info.md)]

## Prerequisites

Before you begin, make sure:

* You've have completed the [Tutorial: Copy data from Azure Data Box](data-box-deploy-export-copy-data.md).
* Copy jobs are complete. Prepare to ship can't run if copy jobs are in progress.

## Prepare to ship

[!INCLUDE [data-box-export-prepare-to-ship](../../includes/data-box-export-prepare-to-ship.md)]

The next steps are determined by where you are returning the device.

## Ship Data Box back

Ensure that the data copy from the device is complete and **Prepare to ship** run is successful. Based on the region where you are shipping the device, the procedure is different.

## [US, Canada, Europe](#tab/in-us-canada-europe)

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

## [Australia](#tab/in-australia)

Azure datacenters in Australia have an additional security notification. All the inbound shipments must have an advanced notification. Take the following steps to ship in Australia.

1. Retain the original box used to ship the device for return shipment.
2. Make sure that the data copy to device is complete and **Prepare to ship run** is successful.
3. Power off the device and remove the cables.
4. Spool and securely place the power cord that was provided with the device in the back of the device.
5. Book a pickup online at the [DHL Link](https://mydhl.express.dhl/au/en/schedule-pickup.html#/schedule-pickup#label-reference).

## [Japan](#tab/in-japan)

1. Retain the original box used to ship the device for return shipment.
2. Power off the device and remove the cables.
3. Spool and securely place the power cord that was provided with the device in the back of the device.
4. Write your company name and address information on the consignment note as your sender information.
5. Email Quantium solution using the following email template.

    * If Japan Post Chakubarai consignment note wasn't included or is missing, note that in this email. Quantium Solutions Japan will request Japan Post to bring the consignment note upon pickup.
    * If you have multiple orders, email to ensure individual pickup.

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

6. Receive an email confirmation from Quantium solutions after you've booked a pickup. The email confirmation also includes information on the Chakubarai consignment note.

If needed, you can contact Quantium Solution Support (Japanese language) at the following information: 

* Email：Customerservice.JP@quantiumsolutions.com
* Telephone：03-5755-0150

## [Singapore](#tab/in-singapore)

1. Retain the original box used to ship the device for return shipment.
2. Note down the tracking number (shown as reference number on the Prepare to Ship page of the Data Box local web UI). This is available after the prepare to ship step successfully completes. Download the shipping label from this page and paste on the packing box.
3. Power off the device and remove the cables.
4. Spool and securely place the power cord that was provided with the device in the back of the device. 
5. Email SingPost Customer Service using the following email template with the tracking number.

    ```
    To: kadcustcare@singpost.com
    Subject: Microsoft Azure Pickup - OrderName 
    Body: 
        1. Requestor name  
        2. Requestor contact number
        3. Requestor collection address
        4. Preferred collection date
    ```

   > [!NOTE]
   > For booking requests received on a business day:
   >
   > * Before 3 PM, pickup will be the next business day between 9 AM and 1 PM.
   > * After 3 PM, pickup will be the next business day between 2 PM to 6 PM.  

## [South Africa](#tab/in-sa)

1. Retain the original box used to pack the device for return shipment.
2. Note down the reference number (waybill number) shown on the local web UI of the device. This number is displayed after the **Prepare to ship run** is successful.
3. Download and print shipping label that is available on the local web UI of the device and affix it on the shipment package.
4. To book a pickup with DHL, choose one of the following options:

    * Call the customer service contact center before 2:00 pm on **+27(0) 11 9213600**, select option 1, and then specify the waybill number.
    * Send an email to [Priority.Support@dhl.com](mailto:Priority.Support@dhl.com) using the following template:

    ```output
    To: Priority.Support@dhl.com
    Subject: Pickup request for Microsoft Azure
    Body: Need pick up for the below shipment
      *  DHL tracking number (reference number/waybill number)
      *  Requested pickup date: yyyy/mm/dd;time:HH MM
    ```

    * Alternatively, you can drop off the package at the nearest DHL service point.

5. If you encounter any issues, email [Priority.Support@dhl.com](mailto:Priority.Support@dhl.com) with details of the issue(s) you encountered and put the waybill number in the Subject: line. You can also call +27(0)119213902.

## [Hong Kong](#tab/in-hk)

1. Pack the device for return shipment in the original box.
2. Note down the reference number (tracking number for reverse shipment) shown on the local web UI of the device. This number is displayed after the **Prepare to ship run** is successful.
3. Download and print shipping label that is available on the local web UI of the device and affix it on the shipment package.
4. Spool and securely place the power cord that was provided with the device in the back of the device.
5. Call **Quantium Solutions** hotline at **(852) 2318 1213** during office hours (9am to 6pm, Monday to Friday).  
6. Quote Microsoft Azure pickup and the reference number and tracking number (above barcode) on the return shipping label to arrange for a collection.
7. You will get a verbal confirmation for the pickup schedule. If the courier does not arrive for collection, call Quantium Solutions hotline for alternate arrangements.
8. Upon booking a pickup with Quantium, share the confirmation with [Microsoft Data Box Operations Asia](mailto:adbo@microsoft.com) using the following template:

    ```output
    To: adbo@microsoft.com
    Subject: Microsoft Data Box Job: [order name] has completed copy
    Body:
    We have confirmed the pickup details with Quantium.

       * Requestor name:
       * Requestor contact number:
       * Pickup Date:  
       * Pickup time:
    ```

Should you encounter any issues, email Data Box Operations Asia [adbo@microsoft.com](mailto:adbo@microsoft.com) providing the job name in subject header and the issue encountered.

## [Self-Managed](#tab/in-selfmanaged)

If you are using Data Box in Japan, Singapore, Korea, India, South Africa, or West Europe and have selected the self-managed shipping option during order creation, follow these instructions.

1. Note down the Authorization code shown on the Prepare to Ship page of the Data Box local web UI after this step successfully completes.
2. Power off the device and remove the cables. Spool and securely place the power cord that was provided with the device at the back of the device.
3. Send an email to the Azure Data Box Operations team using the below template when you are ready to return the device.
    
    ```
    To: adbops@microsoft.com 
    Subject: Request for Azure Data Box drop-off for order: ‘orderName’ 
    Body: 
        1. Order name  
        2. Authorization code available after Prepare to Ship has completed [Yes/No]  
        3. Contact name of the person dropping off. You will need to display a Government approved ID during the drop off.
    ```

---

## Erasure of data from Data Box
 
Once the device reaches Azure datacenter, the Data Box erases the data on its disks as per the [NIST SP 800-88 Revision 1 guidelines](https://csrc.nist.gov/News/2014/Released-SP-800-88-Revision-1,-Guidelines-for-Medi).

## Next steps

In this tutorial, you learned about topics such as:

> [!div class="checklist"]
> * Prerequisites
> * Prepare to ship
> * Ship Data Box to Microsoft
> * Erasure of data from Data Box

Advance to the next article to learn how to manage your Data Box.

> [!div class="nextstepaction"]
> [Manage Data Box via Azure portal](./data-box-portal-admin.md)


