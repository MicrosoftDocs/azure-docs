---
title: Tutorial to ship Azure Data Box Disk back| Microsoft Docs
description: In this tutorial, learn how to return your Azure Data Box Disk. The pickup instructions depend on where you are returning the device.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: disk
ms.topic: tutorial
ms.date: 01/23/2023
ms.author: shaas
ms.custom: references_regions
zone_pivot_groups: data-box-shipping

# Customer intent: As an IT admin, I need to be able to order Data Box Disk to upload on-premises data from my server onto Azure.
---

::: zone target="docs"

# Tutorial: Return Azure Data Box Disk

This tutorial describes how to return your Azure Data Box Disk. The pickup instructions depend on where you are returning the device.

In this tutorial, you will learn how to:

> [!div class="checklist"]
>
> * Ship Data Box Disk to Microsoft

## Prerequisites

Before you begin, make sure you've completed the [Tutorial: Copy data to Azure Data Box Disk and verify](data-box-disk-deploy-copy-data.md).

## Ship Data Box Disk back

::: zone-end

::: zone target="chromeless"

## Return Azure Data Box Disk

::: zone-end

1. Once the data validation is complete, follow these steps to unplug the disks and remove the connecting cables:
    - For Windows systems, safely remove the disks prior to unplugging them.
    - For Linux systems, use the following command to safely remove the disks prior to unplugging them: 

        `sudo DataBoxDiskUnlock /Unmount`.

2. Wrap all the disks and the connecting cables with a bubble wrap and place them into the shipping box. Charges may apply if the accessories are missing.
    - Reuse the packaging from the initial shipment.  
    - We recommend that you pack disks using a well-secured bubbled wrap.
    - Make sure the fit is snug to reduce any movements within the box.

The next steps are determined by where you are returning the device. In many countries/regions, you can use Microsoft managed shipping or [self-managed shipping](#self-managed-shipping).

::: zone pivot="americas" 

If using Microsoft managed shipping, follow these steps. 

## Shipping in Americas

### US & Canada

Take the following steps if returning the device in US or Canada.

1. Use the return shipping label that has the clear plastic sleeve affixed to the box. If the label is damaged or lost:
    - Go to **Overview > Download shipping label** and download a return ship label.
    - Affix the label on the device.

2. Seal the shipping box and ensure that the return shipping label is visible.
3. Schedule a pickup with UPS. To schedule a pickup:

    - Call the local UPS (country/region-specific toll free number).
    - In your call, quote the reverse shipment tracking number as shown in your printed label.
    - If the tracking number isn't quoted, UPS will require you to pay an additional charge during pickup.
    - Instead of scheduling the pickup, you can also drop off the Data Box Disk at the nearest drop-off location.

::: zone-end

::: zone pivot="europe" 

If using Microsoft managed shipping, follow these steps. 

## Shipping in Europe

### EU & UK

Take the following steps if returning the device in Europe or the UK.

1. Use the return shipping label that has the clear plastic sleeve affixed to the box. If the label is damaged or lost:
    - Go to **Overview > Download shipping label** and download a return ship label.
    - Affix the label on the device.

2. Seal the shipping box, and ensure that the return shipping label is visible.
3. Go to the country/region DHL Express website and select **Schedule a Pickup**. Under **Do you need a shipping label**, select **No** > **I have a DHL Waybill Number**.
4. Specify the waybill number, and click **Schedule Pickup** to arrange for pickup.

::: zone-end

::: zone pivot="australia" 

If using Microsoft managed shipping, follow these steps.

## Shipping in Australia

### Australia

Azure datacenters in Australia have an additional security notification. All the inbound shipments must have an advanced notification. Take the following steps for pickup in Australia.

1. Use the provided return ship label and make sure that the TAU code (reference number) is written on it. If the provided shipping label is missing or you have any other issues, email [Data Box Asia Operations](mailto:adbo@microsoft.com). Provide the order name in subject header and details of the issue.
2. Affix the label on the box.
3. Book a pickup online at the link https://mydhl.express.dhl/au/en/schedule-pickup.html#/schedule-pickup#label-reference.

::: zone-end

::: zone pivot="asia" 

If using Microsoft managed shipping, follow these steps.

## Shipping in Asia

### [Japan](#tab/in-japan)

1. Write your company name and address information on the consignment note as your sender information.
2. Email Quantium solution using the following email template.

    ```
    To: azure.qsjp@quantiumsolutions.com
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
    - If Japan Post Chakubarai consignment note wasn't included or is missing, make a note of this in the email. Quantium Solutions Japan will request Japan Post to bring the consignment note upon pickup.
    - If you have multiple orders, email to ensure individual pickup.

3. Receive an email confirmation from Quantium solutions after you've booked a pickup. The email confirmation also includes information on the Chakubarai consignment note.

If needed, you can contact Quantium Solution Support (Japanese language) at the following information: 

- Email：[azure.qsjp@quantiumsolutions.com](mailto:azure.qsjp@quantiumsolutions.com)
- Telephone：03-5755-0150 

### [Korea](#tab/in-korea)

1. Make sure to include the return consignment note.
2. To request pickup when consignment note is present:
    1. Call *Quantium Solutions International* hotline at 070-8231-1418 during office hours (10 AM to 5 PM, Monday to Friday). Quote *Microsoft Azure pickup* and the service request number to arrange for a collection.  
    2. If the hotline is busy, email [microsoft@rocketparcel.com](mailto:microsoft@rocketparcel.com), with the email subject *Microsoft Azure Pickup* and the service request number for reference.
    3. If the courier doesn't arrive for collection, call *Quantium Solutions International* hotline for alternate arrangements.
    4. You receive an email confirmation for the pickup schedule.
3. Do this step only if the consignment note isn't present. To request pickup:
    1. Call *Quantium Solutions International* hotline at 070-8231-1418 during office hours (10 AM to 5 PM, Monday to Friday). Quote *Microsoft Azure pickup* and the service request number to arrange for a collection. Specify that you need a new consignment note to arrange for a collection. Provide sender (customer), receiver information (Azure datacenter), and reference number (service request number).
    2. If the hotline is busy, email [microsoft@rocketparcel.com](mailto:microsoft@rocketparcel.com), with the email subject *Microsoft Azure Pickup* and the service request number as reference.
    3. If the courier doesn't arrive for collection, call *Quantium Solutions International* hotline for alternate arrangements.
    4. You receive a verbal confirmation if the request is made via telephone.

### [Singapore](#tab/in-singapore)

1. Print the shipping label and attach it to the box. If the label is damaged or lost:
    - Go to **Overview > Download shipping label** and get a return shipping label.
    - Affix the label on the device. Make sure that the label is visible.

2. To request pickup, email SingPost Customer Service by using the following template with the tracking number (the tracking number can be found on the return label provided in the delivered package).

    ```
    To: g-corpsgcs@singpost.com
    Subject: Microsoft Azure Pickup - XZ00001234567
    Body:
     a.    Requestor name
     b.    Requestor contact number
     c.    Requestor collection address
     d.    Preferred collection date
    ```

   > [!NOTE]
   > For booking requests received on a business day:
   >
   > * Before 3 PM, pickup will be the next business day between 9 AM and 1 PM.
   > * After 3 PM, pickup will be the next business day between 2 PM to 6 PM.

   If you come across any issues, contact Data Box Operations Asia at [adbo@microsoft.com](mailto:adbo@microsoft.com). Provide the job name in the subject header and the issue encountered.

3. Hand over to the courier.

### [China](#tab/in-china)

Take the following steps if returning the device in China.

1. Attach the shipping label provided and paste it on the box. This label contains the tracking number. If the shipping label is missing, you can download a new one from **Overview > Download shipping label**.

2. Email FedEx Premier Customer Care and provide them with tracking number (shipment reference number) to organize pickup using the following email template:  

   ```output
   To: ying.bao@fedex.com;739951@fedex.com
   Subject: Pickup request for Microsoft Azure : Order Name
   Body: Need pick up for the below shipment
   * FedEx tracking number (reference number)
   * Requested pickup date：yyyy/mm/dd; time: HH MM
   ```

3. Receive an email confirmation from FedEx after completion of booking pickup.  

4. If you come across any issues, email [DL-DC-SHA@oe.21vianet.com](mailto:DL-DC-SHA@oe.21vianet.com) with details of the issue(s), and put the order name in the Subject: line.

#### Premier Customer Care contact information

<ins>Primary</ins>

| Contact information | Details |
|---|---|
|Name:       | `Bao Ying`|
|Designation | Senior OneCall Representative |
|Phone:      | 400.889.6066 ext. 3693 |
|E-mail:     | [ying.bao@fedex.com](mailto:ying.bao@fedex.com) |

<ins>Backup</ins>

| Contact information | Details |
|---|---|
|Name:       | `He Xun`|
|Designation | OneCall Representative |
|Phone:      | 400.889.6066 ext. 3603 |
|E-mail:     | [739951@fedex.com](mailto:739951@fedex.com) |

### [India](#tab/in-india)

1. Once the data validation is complete, unplug the disks and remove the connecting cables.
2. Place each disk inside an individual bubble-wrap bag and package them along with the connecting cables inside the original box that was used for shipping. Make sure that the fit is snug to reduce any movement within the box.

   > [!NOTE]
   > Charges may apply if accessories are missing.

3. Email Azure Data Box Operations using the following template to receive the e-waybill and delivery challan required for the return shipment.
```
    To: adbops@microsoft.com
    Subject: Request for shipping documents for Azure Data Box Disk order: ‘orderName’
    Body:
    I am ready to return an Azure Data Box Disk and would like to request the e-waybill and delivery challan  for the following order:
    Order Name:
   ```
4. Once the shipping label and other documents are ready, Azure Data Box Operations will schedule a return pick up from your location. Affix the label to the outside of the package.
5. If an Inbound ID is also required to send the package to the datacenter, the Azure Data Box Operations team will provide this. Write down the Inbound ID number on the packaging box such that it is clearly visible near the return label.
6. If you encounter any issues or are asked to pay additional fees when scheduling a pickup, reach out to Azure Data Box Operations <adbops@microsoft.com> for assistance. Please provide the Order Name and the issue encountered in the subject line.
 
Once the package is picked up and scanned by the carrier, the order status in the Azure portal will be updated to **Picked Up** and a tracking ID will be displayed.

::: zone-end

::: zone pivot="africa" 

If using Microsoft managed shipping, follow these steps. 

## Shipping in Africa

### [S Africa](#tab/in-sa)

Take the following steps if returning the device in South Africa. 

1. Attach the provided shipping label on the box. This label contains the tracking number. If the shipping label is missing, you can download a new one from **Overview > Download shipping label**.

2. Seal the shipping box and ensure that the return shipping label is visible.

3. Request a return code from Azure Data Box Operations. A return code is required for delivering the package back to the datacenter. Send email to [adbops@microsoft.com](mailto:adbops@microsoft.com). Note this code on the shipping label next to the return address so it is clearly visible.

4. Book a pickup with DHL using one of the following methods:
   * Book a pickup online by going to [DHL Express South Africa, **Schedule a Pickup**](https://mydhl.express.dhl/za/en/schedule-pickup.html#/schedule-pickup#label-reference).
   * Send an email to [Priority.Support@dhl.com](mailto:Priority.Support@dhl.com) using the following template:

     ```output
     To: Priority.Support@dhl.com
     Subject: Pickup request for Microsoft Azure
     Body: Need pick up for the below shipment
       *  DHL tracking number: (reference number/waybill number)
       *  Requested pickup date: yyyy/mm/dd;time:HH MM
       *  Shipper contact: (company name)
       *  Contact person: 
       *  Phone number: 
       *  Full physical address: 
       *  Item to be collected: Azure Dt
     ```

    * Or drop off the package at the nearest DHL service point.

5. If you come across any issues, email [Priority.Support@dhl.com](mailto:Priority.Support@dhl.com) with details of the issue(s), and put the waybill number in the Subject: line. You can also call +27(0)119213902.

::: zone-end

## Self-managed shipping

 Self-managed shipping is available as an option when you [Order Azure Data Box](data-box-disk-deploy-ordered.md). For detailed steps, see [Use self-managed shipping](data-box-disk-portal-customer-managed-shipping.md).

Self-managed shipping is available in the following regions:

| Region        | Region         | Region         | Region    | Region    |
|---------------|----------------|----------------|-----------|-----------|
| US Government | United Kingdom | West Europe    | Japan     | Singapore |
| Korea         | India          | South Africa   | Australia | Brazil    |

If you are using Data Box Disk and have selected the self-managed shipping option during order creation, follow these instructions.

1. Go to the **Overview** blade for your order in the Azure portal. Go through the instructions displayed when you select **Schedule pickup**. You should see an Authorization code that is used at the time of dropping off the order.

2. Send an email to the Azure Data Box Operations team using the following template when you're ready to return the device. 

   ```
   To: adbops@microsoft.com
   Subject: Request for Azure Data Box Disk drop-off for order: 'orderName'
   Body:
   1. Order name
   2. Contact name of the person dropping off. You will need to display a government-approved ID during the drop-off.
   ```

3. Azure Data Box Operations team will work with you to arrange the drop-off to the Azure datacenter.

::: zone pivot="americas"

### Shipping in Brazil

To schedule a device return in Brazil, send an email to [adbops@microsoft.com](mailto:adbops@microsoft.com) with the following information:

```
Subject: Request Azure Data Box Disk drop-off for order: <ordername>

- Order name
- Contact name of the person who will drop off the Data Box Disk (A government-issued photo ID will be required to validate the contact’s identity upon arrival.) 
- Inbound Nota Fiscal (A copy of the inbound Nota Fiscal will be required at drop-off.)   
```
  
::: zone-end    

::: zone target="docs"

## Next steps

In this tutorial, you learned about Azure Data Box Disk topics such as:

> [!div class="checklist"]
>
> * Ship Data Box Disk to Microsoft

Advance to the next how-to to learn how to verify data upload from Data Box Disk to the Azure storage account.

> [!div class="nextstepaction"]
> [Verify data upload from Azure Data Box Disk](./data-box-disk-deploy-upload-verify.md)

::: zone-end
