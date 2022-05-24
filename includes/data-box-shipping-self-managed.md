---
author: v-dalc
ms.service: databox  
ms.subservice: pod
ms.topic: include
ms.date: 03/30/2022
ms.author: alkohli
---

Self-managed shipping is available as an option when you [Order Azure Data Box](../articles/databox/data-box-deploy-ordered.md?tabs=portal). 

If you selected self-managed shipping when you created your order, follow these instructions. For detailed steps, see [Use self-managed shipping](../articles/databox/data-box-portal-customer-managed-shipping.md).

1. Write down the Authorization code that's shown on the **Prepare to Ship** page of the local web UI for the Data Box after the step completes successfully.
2. Power off the device and remove the cables. Spool and securely place the power cord that was provided with the device at the back of the device.
3. When you're ready to return the device, send an email to the Azure Data Box Operations team using the template below.

    ```
    To: adbops@microsoft.com
    Subject: Request for Azure Data Box drop-off for order: 'orderName'
    Body:
        1. Order name  
        2. Authorization code available after Prepare to Ship has completed [Yes/No]  
        3. Contact name of the person dropping off. You will need to display a government-approved ID during the drop off.
    ```

   > [!NOTE]
   > - Required information for return may vary by region. 
   > - If you're returning a Data Box in Brazil, see [Use self-managed shipping for Azure Data Box](..\articles\databox\data-box-portal-customer-managed-shipping.md) for detailed instructions.