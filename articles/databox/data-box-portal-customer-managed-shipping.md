---
title: Microsoft Azure Data Box self-managed shipping | Microsoft Docs in data 
description: Describes self-managed shipping workflow for Azure Data Box devices
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: how-to
ms.date: 04/30/2021
ms.author: alkohli
---

# Use self-managed shipping for Azure Data Box in the Azure portal

This article describes self-managed shipping tasks to order, pick up, and drop off an Azure Data Box device. You can manage the Data Box device using the Azure portal.

## Prerequisites

Self-managed shipping is available as an option when you [Order Azure Data Box](data-box-deploy-ordered.md). Self-managed shipping is only available in the following regions:

* US Government
* United Kingdom
* Western Europe
* Japan
* Singapore
* South Korea
* India
* South Africa
* Australia
* Brazil<!--NEW-->

## Use self-managed shipping

When you place a Data Box order, you can choose the self-managed shipping option.

1. In your Azure Data Box order, under the **Contact details**, select **+ Add Shipping Address**.
 
   ![Self-managed shipping, Add Shipping Address](media\data-box-portal-customer-managed-shipping\choose-self-managed-shipping-1.png)

2. When choosing a shipping type, select the **Self-managed shipping** option. This option is only available if you are in a supported region as described in the prerequisites.

3. Once you've provided your shipping address, you'll need to validate it and complete your order.

   ![Self-managed shipping, validate and add address](media\data-box-portal-customer-managed-shipping\choose-self-managed-shipping-2.png)

4. Once the device has been prepared and you receive an email notification for it, you can schedule a pickup.

   In your Azure Data Box order, go to **Overview** and then select **Schedule pickup**.

   ![Data Box order, Schedule pickup option](media\data-box-portal-customer-managed-shipping\data-box-portal-schedule-pickup-01.png)

5. Follow the instructions in the **Schedule pickup for Azure**.

   Before you can get your authorization code, you must email [adbops@microsoft.com](mailto:adbops@microsoft.com) to schedule the device pickup from your region's datacenter.

   ![Schedule pickup for Azure instructions](media\data-box-portal-customer-managed-shipping\data-box-portal-schedule-pickup-email-01.png)

   <!--Specific to Brazil: 
   Brazil: Include the following information in the email:
   * Subject: Request Azure Data Box pickup for order: ‘orderName’
   * Order name
   * Company name
   * Company legal name (if different)
   * Contact name of the person who will pick up the Data Box (A government-issued photo ID will be required to validate the contact’s identity upon arrival.)
   * License plate number
   * Tax ID
   * Address -IS THIS THE ADDRESS OF COMPANY HQ, FOR TAX PURPOSES? SHIPPING ADDRESS ENTERED IN PORTAL.
   * Country
   * Phone number

   Is this much detail needed about how they get to scheduling an appointment? The only thing significant is that it might take up to 4 business days: "After the operations team receives your information, they will submit it to the data center to obtain an inbound Nota Fiscal. After the Nota Fiscal is prepared, which can take up to 4 business days, the operations team will reach back out to schedule an appointment for pickup."-->

6. After you schedule your device pickup, you can view your device authorization code in the **Schedule pickup for Azure** pane.

   ![Viewing your device authorization code](media\data-box-portal-customer-managed-shipping\data-box-portal-auth-01b.png)

   Make a note of this **Authorization code**. As per security requirements, at the time of scheduling pick-up, it's necessary to present the name of the person who would arrive for pick-up.

   You also need to provide details of who will be going to the datacenter for pickup.<!--Loosely described on-screen. What are "details," typically? Brazil requires a license plate number in advance.--> 

7. Pick up your order at the Azure datacenter.

   The person who picks up the order must provide:

   * The authorization code for the order, which will be validated at the datacenter at the time of pickup
   * A government-approved ID, which will be validated at the datacenter
   * Brazil only: A copy of the appointment confirmation email provided by the Azure Data Box Operations team <!--NEW: Brazil only-->

   <!--REPLACED BY STEP 7. - You or the point of contact must carry a Government-approved photo ID that will be validated at the datacenter.

   Additionally, the person who is picking up the device also needs to have the **Authorization code**. The authorization code is validated at the datacenter time of pickup.-->

   If you miss a scheduled appointment, you'll need to request a new appointment.<!--Added by Brazil team.-->

7. Your order automatically moves to the **Picked up** state once the device has been picked up from the datacenter.

    ![An order in Picked up state](media\data-box-portal-customer-managed-shipping\data-box-portal-picked-up-boxed-01.png)

8. After the device is picked up, copy data to the Data Box at your site. After the data copy is complete, you can prepare to ship the Data Box. For more information, see [Prepare to ship](data-box-deploy-picked-up.md#prepare-to-ship).

   The **Prepare to ship** step needs to complete without any critical errors. Otherwise, you'll need to run this step again after making the necessary fixes. After the **Prepare to ship** step completes successfully, you can view the authorization code for the drop-off on the device local user interface.

   > [!NOTE]
   > Do not share the authorization code over email. This is only to be verified at the datacenter during drop off.

9. If you've received an appointment for drop-off, the order should have **Ready to receive at Azure datacenter** status in the Azure portal. Follow the instructions under **Schedule drop-off** to return the device.

   ![Instructions for device drop-off](media\data-box-portal-customer-managed-shipping\data-box-portal-received-complete-02b.png)

10. After your ID and authorization code are verified, and you have dropped off the device at the datacenter, the order status should be **Received**.

    ![An order with Received status](media\data-box-portal-customer-managed-shipping\data-box-portal-received-complete-01.png)

11. Once the device is received, the data copy will continue. When the copy finishes, the order is complete.

## Next steps

* [Get started with Azure Data Box](data-box-quickstart-portal.md)
