---
author: stevenmatthew
ms.service: azure-databox
ms.topic: include
ms.date: 10/26/2021
ms.author: shaas
---

Take the following steps if you're returning the device in UK.

**If you receive the device packaged in a box, retain the box, and DO NOT discard it.**

1. Make sure the data copy to the device is complete, and the **Prepare to ship** step is completed successfully.
2. Note the tracking number. This tracking number is shown as reference number on the **Prepare to Ship** page of the Data Box local web UI. The tracking number is available after the **Prepare to Ship** step completes successfully. Download the shipping label from this page and paste it on the packing box. If you received a device without a box, ensure that the shipping label is displayed on the E-ink display. If the label is damaged or lost, or is not displayed on the E-ink display, [contact Microsoft Support](..\articles\databox\data-box-disk-contact-microsoft-support.md).
3. Make sure that the device is powered off and cables are removed.
4. Spool and securely place the power cord that was provided with device in the back of the device.
5. **Package the device using the original box that was used for shipping. Ensure that the return label is included.**
6. Check the shipping label to see which datacenter the device was shipped from: Cardiff or London. The London datacenter requires advance notice of all device returns. 

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

    2. Write down the Inbound ID number provided by Azure Data Box Operations, and paste it onto the unit, where it is clearly visible, near the return label.
7. Schedule a pickup with UPS if returning the device. To schedule a pickup:

    * Call the local UPS (country/region-specific toll free number).
    * In your call, quote the reverse shipment tracking number as shown in the E-ink display or your printed label. If you don't quote the tracking number, UPS will require an additional charge during pickup.
    * If any issues come up while you're scheduling a pickup, or you're asked to pay additional fees, contact Azure Data Box Operations. Send email to [adbops@microsoft.com](mailto:adbops@microsoft.com).

    Instead of scheduling the pickup, you can also drop off the Data Box at the nearest drop-off location.

Once the Data Box is picked up and scanned by your carrier, the order status in the portal updates to **Picked up**. A tracking ID is also displayed.

