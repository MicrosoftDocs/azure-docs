---
title: Microsoft Azure Data Box self-managed shipping | Microsoft Docs in data 
description: Describes self-managed shipping workflow for Azure Data Box devices
services: databox
author: priestlg

ms.service: databox
ms.subservice: disk
ms.topic: conceptual
ms.date: 04/27/2020
ms.author: v-grpr
---

# Use self-managed shipping for Azure Data Box in the Azure portal

This article describes self-managed shipping tasks to order, pick up, and drop-off of an Azure Data Box device. You can manage the Data Box device using the Azure portal. You have the option of choosing a point of contact from your organization, or use any carrier of your choice to pick up the Azure Data Box device from a datacenter and also return the device back to the datacenter.

It is important that you follow the datacenter's security procedures as sign-off is required at particular points between pickup and drop-off. At pickup and drop-off, you, or your point of contact, will be assigned an authorization code. This authorization code is needed during device pick-up and drop-off at the datacenter.

## Prerequisites

Self-managed shipping for Azure Data Box is only available to the following regions:

1. Western Europe
2. Japan
3. Singapore
4. South Korea
5. India

For detailed information on how to create a Data Box order, see [Tutorial: Order Azure Data Box](data-box-deploy-ordered.md).

## Use self-managed shipping

When you place a Data Box order, you can choose self-managed shipping option.

1. In your Azure Data Box order, under the **Contact details**, select **+ Add Shipping Address**.
   ![Self-managed shipping](media\data-box-portal-customer-managed-shipping\choose-self-managed-shipping-1.png)

2. When choosing shipping type, select the **Self-managed shipping** option. This option is only available if you are located in a supported region.

3. Once you have provided your shipping address, you will need to validate it and complete your order.
   ![Self-managed shipping](media\data-box-portal-customer-managed-shipping\choose-self-managed-shipping-2.png)

4. Once the device has shipped from Microsoft, you can schedule a pickup. In your Azure Data Box order, go to **Overview** and then select **Schedule pickup**.

   ![Ordering a Data Box device for pickup](media\data-box-portal-customer-managed-shipping\data-box-portal-schedule-pickup-01.png)

5. Follow the instructions in the **Schedule pickup for Azure**. Before you can get your authorization code, you must email [adbops@microsoft.com](mailto:adbops@microsoft.com) to schedule the device pickup from your region's datacenter.

   ![Schedule pickup](media\data-box-portal-customer-managed-shipping\data-box-portal-schedule-pickup-email-01.png)

6. After you have scheduled your device pickup, you will be able to view your device authorization code in the **Schedule pickup for Azure** pane.

   ![Viewing your authorization code](media\data-box-portal-customer-managed-shipping\data-box-portal-auth-01b.png)

   Make a note of this **Authorization code**.

   You also need to provide details of who will be going to the datacenter for pickup. You or the point of contact has to carry a Government approved photo ID that will be validated at the datacenter.

   Additionally, the person who is picking up the device also needs to have the **Authorization code**. The authorization code is validated at the datacenter time of pickup.

7. Your order automatically moves to the **Picked up** state once the device preparation is complete. You will receive an email instructing you to contact Microsoft to schedule a pickup appointment at the datacenter. 

    ![Picked up](media\data-box-portal-customer-managed-shipping\data-box-portal-picked-up-boxed-01.png)

8. After the device is picked up, you need to copy data to your Data Box from data servers. After the data copy is complete, you can prepare to ship the Data Box. For more information, see [Prepare to ship](data-box-deploy-picked-up.md#prepare-to-ship).

   The **Prepare to ship** step needs to complete without any critical errors, otherwise you will need to run this step again. After the prepare to ship completes successfully, you can view the authorization code for the drop off.

   > [!NOTE]
   >
   > The authorization code is no longer available in the Azure portal once **Prepare to ship** is complete. It is available only in the device local UI.

9. If you have scheduled an appointment for drop off and shared the drop off point of contact's details, then your order status should be at **Ready to receive at Azure datacenter**. The datacenter also should have confirmed that they have the authorization code available. Select **Schedule drop-off** to receive your new authorization code.

   ![Viewing your authorization code](media\data-box-portal-customer-managed-shipping\data-box-portal-received-complete-02b.png)

10. After you have dropped of the device at the datacenter and your ID and authorization code is verified, the order status should be at **Received**.

    ![Received Complete](media\data-box-portal-customer-managed-shipping\data-box-portal-received-complete-01.png)

11. From this point on, data will be uploaded to Azure. Your order status should be at **Data copy in progress**.

    ![Data Copy](media\data-box-portal-customer-managed-shipping\data-box-copy-data-01.png)

12. After the the upload to Azure is complete, the order status will be at **Completed**.

    ![Data Copy Complete](media\data-box-portal-customer-managed-shipping\data-box-copy-data-complete-01.png)

## Next steps

- [Get started with Azure Data Box](data-box-quickstart-portal.md)
