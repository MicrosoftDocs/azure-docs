---
author: v-dalc
ms.service: databox  
ms.subservice: pod
ms.topic: include
ms.date: 10/26/2021
ms.author: alkohli
---

Take the following steps if you're returning the device in UK.

1. Make sure that the device is powered off and cables are removed.
2. Spool and securely place the power cord that was provided with device in the back of the device.
3. Ensure that the shipping label is displayed on the E-ink display and schedule a pickup with your carrier. If the label is damaged or lost or not displayed on the E-ink display, [contact Microsoft Support](..\articles\databox\data-box-disk-contact-microsoft-support.md). If Support suggests, then you can go to **Overview > Download shipping label** in the Azure portal. Download the shipping label and affix on the device.
1. Check the shipping label to see which datacenter the device was shipped from: Cardiff or London. The London datacenter requires advance notice of all device returns. 

    If the device was shipped from London, do the following steps:
    1. Email Azure Data Box Operations at [adbops@microsoft.com](mailto:adbops@microsoft.com) to receive an Inbound ID. Send email to [adbops@microsoft.com](mailto:adbops@microsoft.com). Use the following template.

       ```
       To: adbops@microsoft.com
       Subject: Request for Azure Data Box Inbound ID: <orderName> 
       Body: 
        
       I am ready to return an Azure Data Box and would like to request an Inbound ID for the following order:
       
       Order Name: <orderName>
       Return Tracking Number: <returnTracking#>
       ```

    1. Write down the Inbound ID number provided by Azure Data Box Operations, and paste it onto the unit, where it is clearly visible, near the return label.
1. Schedule a pickup with UPS if returning the device. To schedule a pickup:

    * Call the local UPS (country/region-specific toll free number).
    * In your call, quote the reverse shipment tracking number as shown in the E-ink display or your printed label. If you don't quote the tracking number, UPS will require an additional charge during pickup.
    * If any issues come up while you're scheduling a pickup, or you're asked to pay additional fees, contact Azure Data Box Operations. Send email to [adbops@microsoft.com](mailto:adbops@microsoft.com).

    Instead of scheduling the pickup, you can also drop off the Data Box at the nearest drop-off location.

Once the Data Box is picked up and scanned by your carrier, the order status in the portal updates to **Picked up**. A tracking ID is also displayed.
