---
title: Tutorial to ship Azure Data Box Disk back| Microsoft Docs
description: Use this tutorial to learn how to ship your Azure Data Box Disk to Microsoft
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: tutorial
ms.date: 05/08/2020
ms.author: alkohli
ms.localizationpriority: high

# Customer intent: As an IT admin, I need to be able to order Data Box Disk to upload on-premises data from my server onto Azure.
---



::: zone target="docs"

# Tutorial: Return Azure Data Box Disk 

This tutorial describes how to schedule a pick up to return your Azure Data Box Disk. The pick up instructions depend on where you are returning the device. 

In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Ship Data Box Disk to Microsoft
> * Pick up Data Box Disk in different regions

## Prerequisites

Before you begin, make sure that you have completed the [Tutorial: Copy data to Azure Data Box Disk and verify](data-box-disk-deploy-copy-data.md).


## Ship Data Box Disk back

::: zone-end

::: zone target="chromeless"

## Return Azure Data Box Disk 

::: zone-end

1. Once the data validation is complete, unplug the disks. Remove the connecting cables.
2. Wrap all the disks and the connecting cables with a bubble wrap and place those into the shipping box. Charges may apply if the accessories are missing.
    - Reuse the packaging from the initial shipment.  
    - We recommend that you pack disks using a well-secured bubbled wrap.
    - Make sure the fit is snug to reduce any movements within the box.

The next steps are determined by where you are returning the device. The instructions are different for US/Canada, European Union (EU), Australia, or countries/regions in Asia.

### [In US or Canada](#tab/in-us-or-canada)

Take the following steps if returning the device in US or Canada.

1. Use the return shipping label in the clear plastic sleeve affixed to the box. If the label is damaged or lost:
    - Go to **Overview > Download shipping label** and download a return ship label.
    - Affix the label on the device.

2. Seal the shipping box and ensure that the return shipping label is visible.
3. Schedule a pickup with UPS. To schedule a pickup:

    - Call the local UPS (country/region-specific toll free number).
    - In your call, quote the reverse shipment tracking number as shown in your printed label.
    - If the tracking number is not quoted, UPS will require you to pay an additional charge during pickup.
    - Instead of scheduling the pickup, you can also drop off the Data Box Disk at the nearest drop-off location.

### [In Europe](#tab/in-europe)

Take the following steps if returning the device in Europe.

1. Use the return shipping label in the clear plastic sleeve affixed to the box. If the label is damaged or lost:
    - Go to **Overview > Download shipping label** and download a return ship label.
    - Affix the label on the device.

2. Seal the shipping box and ensure that the return shipping label is visible.
3. If you are returning the device in Europe with DHL, request for pickup from DHL by visiting their website and specifying the airway bill number.
4. Go to the country/region DHL Express website and choose **Book a Courier Collection > eReturn Shipment**.    
3. Specify the waybill number and click **Schedule Pickup** to arrange for pickup.

### [In Australia](#tab/in-australia)

Azure datacenters in Australia have an additional security notification. All the inbound shipments must have an advanced notification. Take the following steps for pickup in Australia.

1. Use the provided return ship label and make sure that the TAU code (reference number) is written on it. If the provided shipping label is missing or you have any other issues, email [Data Box Asia Operations](mailto:adbo@microsoft.com). Provide the order name in subject header and details of the issue you are facing.
3. Affix the label on the box. 
4. Book a pick-up online at the link https://mydhl.express.dhl/au/en/schedule-pickup.html#/schedule-pickup#label-reference. 

### [In Japan](#tab/in-japan)

1. Write your company name and address information on the consignment note as your sender information.
2. Email Quantium solution using the following email template.

    ```
    To: Customerservice.JP@quantiumsolutions.com
    Subject: Pickup request for Microsoft Azure Data Box Disk｜Job Name： 
    Body: 
    - Japan Post Yu-Pack tracking number (reference number)：
    - Requested pickup date：mmdd (Select a requested time slot from below).
        a. 08：00-13：00 
        b. 13：00-15：00 
        c. 15：00-17：00 
        d. 17：00-19：00 
    ```
    - **If you are picking up in Osaka**, then modify the subject in the email template to: `Pickup request for Microsoft Azure OSA`.
    - If Japan Post Chakubarai consignment note wasn't included or is missing, note that in this email. Quantium Solutions Japan will request Japan Post to bring the consignment note upon pickup.
    - If you have multiple orders, email to ensure individual pickup.

3. Receive an email confirmation from Quantium solutions after you've booked a pickup. The email confirmation also includes information on the Chakubarai consignment note.

If needed, you can contact Quantium Solution Support (Japanese language) at the following information: 

- Email：Customerservice.JP@quantiumsolutions.com 
- Telephone：03-5755-0150 

### [In Korea](#tab/in-korea)

1. Make sure to include the return consignment note.
2. To request pickup when consignment note is present:
    1. Call *Quantium Solutions International* hotline at 070-8231-1418 during office hours (10 AM to 5 PM, Monday to Friday). Quote *Microsoft Azure pickup* and the service request number to arrange for a collection.  
    2. If the hotline is busy, email `microsoft@rocketparcel.com`, with the email subject *Microsoft Azure Pickup* and the service request number as reference.
    3. If the courier does not arrive for collection, call *Quantium Solutions International* hotline for alternate arrangements. 
    4. You receive an email confirmation for the pickup schedule.
3. Do this step only if the consignment note is not present. To request pickup:
    1. Call *Quantium Solutions International* hotline at 070-8231-1418 during office hours (10 AM to 5 PM, Monday to Friday). Quote *Microsoft Azure pickup* and the service request number to arrange for a collection. Specify that you need a new consignment note to arrange for a collection. Provide sender (customer), receiver information (Azure datacenter), and reference number (service request number). 
    2. If the hotline is busy, email `microsoft@rocketparcel.com`, with the email subject *Microsoft Azure Pickup* and the service request number as reference.
    3. If the courier does not arrive for collection, call *Quantium Solutions International* hotline for alternate arrangements. 
    4. You receive a verbal confirmation if the request is made via telephone.


### [In Singapore](#tab/in-singapore)

1. Print the shipping label and attach it to the box. If the label is damaged or lost:
    - Go to **Overview > Download shipping label** and get a return shipping label.
    - Affix the label on the device. Make sure that the label is visible.

2. To request pickup, email SingPost Customer Service by using the following template with the tracking number (the tracking number can be found on the return label provided in the delivered package).

    ```
    To: kadcustcare@singpost.com
    Subject: Microsoft Azure Pick-up - XZ00001234567 
    Body: 
     a.    Requestor name
     b.    Requestor contact number
     c.    Requestor collection address
     d.    Preferred collection date
    ```

   > [!NOTE]
   > For booking requests received on a business day:
   > - Before 3 PM, pickup will be the next business day between 9 AM and 1 PM.
   > - After 3 PM, pickup will be the next business day between 2 PM to 6 PM.

   If you encounter any issues, kindly reach out to Data Box Operations Asia at adbo@microsoft.com. Provide the job name in the subject header and the issue encountered.

3. Hand over to the courier.

### [In Self-Managed](#tab/in-selfmanaged)

If you are using Data Box Disk in Japan, Singapore, Korea, and West Europe and have selected the self-managed shipping option during order creation, follow these instructions. 

1. Go to the **Overview** blade for your order in the Azure portal. Go through the instructions displayed when you select **Schedule pickup**. You should see an Authorization code that is used at the time of dropping off the order.

2. Send an email to the Azure Data Box Operations team using the following template when you are ready to return the device.

    ```
    To: adbops@microsoft.com
    Subject: Request for Azure Data Box Disk drop-off for order: 'orderName'
    Body: 
     a. Order name
     b. Contact name of the person dropping off. You will need to display a Government approved ID during the drop off.
    ```
3. Azure Data Box Operations team will work with you to arrange the drop-off to the Azure Datacenter.

::: zone target="docs"

## Next steps

In this tutorial, you learned about Azure Data Box Disk topics such as:

> [!div class="checklist"]
> * Ship Data Box Disk to Microsoft
> * Pick up Data Box Disk in different regions

Advance to the next how-to to learn how to verify data upload from Data Box Disk to the Azure Storage account.

> [!div class="nextstepaction"]
> [Verify data upload from Azure Data Box Disk](./data-box-disk-deploy-picked-up.md)

::: zone-end




