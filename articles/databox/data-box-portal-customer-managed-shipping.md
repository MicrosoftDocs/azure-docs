---
title: Microsoft Azure Data Box self-managed shipping | Microsoft Docs in data 
description: Describes self-managed shipping workflow for Azure Data Box devices
services: databox
author: priestlg

ms.service: databox
ms.subservice: disk
ms.topic: how-to
ms.date: 05/20/2020
ms.author: v-grpr
---

# Use self-managed shipping for Azure Data Box in the Azure portal

This article describes self-managed shipping tasks to order, pick up, and drop-off of an Azure Data Box device. You can manage the Data Box device using the Azure portal.

## Prerequisites

Self-managed shipping is available as an option when you [Order Azure Data Box](data-box-deploy-ordered.md). Self-managed shipping is only available in the following regions:

* US Government
* Western Europe
* Japan
* Singapore
* South Korea

## Use self-managed shipping

When you place a Data Box order, you can choose self-managed shipping option.

1. In your Azure Data Box order, under the **Contact details**, select **+ Add Shipping Address**.
   ![Self-managed shipping](media\data-box-portal-customer-managed-shipping\choose-self-managed-shipping-1.png)

2. When choosing shipping type, select the **Self-managed shipping** option. This option is only available if you are in a supported region as described in the prerequisites.

3. Once you have provided your shipping address, you will need to validate it and complete your order.
   ![Self-managed shipping](media\data-box-portal-customer-managed-shipping\choose-self-managed-shipping-2.png)

4. Once the device has been prepared and you receive an email notification for it, you can schedule a pickup.

   In your Azure Data Box order, go to **Overview** and then select **Schedule pickup**.

   ![Ordering a Data Box device for pickup](media\data-box-portal-customer-managed-shipping\data-box-portal-schedule-pickup-01.png)

5. Follow the instructions in the **Schedule pickup for Azure**.

   Before you can get your authorization code, you must email [adbops@microsoft.com](mailto:adbops@microsoft.com) to schedule the device pickup from your region's datacenter.

   ![Schedule pickup](media\data-box-portal-customer-managed-shipping\data-box-portal-schedule-pickup-email-01.png)

6. After you have scheduled your device pickup, you will be able to view your device authorization code in the **Schedule pickup for Azure** pane.

   ![Viewing your authorization code](media\data-box-portal-customer-managed-shipping\data-box-portal-auth-01b.png)

   Make a note of this **Authorization code**. As per the security requirements, at the time of scheduling pick-up, it is necessary to present the name of the person who would arrive for pick-up.

   You also need to provide details of who will be going to the datacenter for pickup. You or the point of contact must carry a Government approved photo ID that will be validated at the datacenter.

   Additionally, the person who is picking up the device also needs to have the **Authorization code**. The authorization code is validated at the datacenter time of pickup.

7. Your order automatically moves to the **Picked up** state once the device has been picked up from the datacenter.

    ![Picked up](media\data-box-portal-customer-managed-shipping\data-box-portal-picked-up-boxed-01.png)

8. After the device is picked up, copy data to the Data Box at your site. After the data copy is complete, you can prepare to ship the Data Box. For more information, see [Prepare to ship](data-box-deploy-picked-up.md#prepare-to-ship).

   The **Prepare to ship** step needs to complete without any critical errors, otherwise you will need to run this step again after making the necessary fixes. After the prepare to ship completes successfully, you can view the authorization code for the drop off on the device local user interface.

   > [!NOTE]
   > Do not share the authorization code over email. This is only to be verified at the datacenter during drop off.

9. If you have received an appointment for drop off, the order should be at **Ready to receive at Azure datacenter** state in the Azure portal. Follow the instructions under **Schedule drop-off** to return the device.

   ![Viewing your authorization code](media\data-box-portal-customer-managed-shipping\data-box-portal-received-complete-02b.png)

10. After your ID and authorization code are verified and you have dropped off the device at the datacenter, the order status should be **Received**.

    ![Received Complete](media\data-box-portal-customer-managed-shipping\data-box-portal-received-complete-01.png)

11. Once the device is received, the data copy will continue. When the copy finishes, the order is complete.

## Next steps

* [Get started with Azure Data Box](data-box-quickstart-portal.md)
