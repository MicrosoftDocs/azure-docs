---
title: Microsoft Azure Data Box Disk self-managed Shipping | Microsoft Docs in data 
description: Describes self-managed shipping workflow for Azure Data Box Disk devices
services: databox
author: priestlg

ms.service: databox
ms.subservice: disk
ms.topic: conceptual
ms.date: 04/27/2020
ms.author: v-grpr
---

# Use self-managed shipping for Azure Data Box Disk in the Azure portal

This article describes the process workflow and self managed shipping tasks to order, pick-up, and drop off of an Azure Data Box Disk device. You can manage the Data Box Disk using the Azure portal. You also have the option of designating a point of contact from your organization, or use any carrier of your choice to pick up the Azure Data Box Disk device from a datacenter and also return the device back to the datacenter. You need to follow the datacenter's security procedures as sign off is required at particular points between pickup and drop-of. At pick-up and drop-off, you, or point of contact, will be assigned an authorization code. This authorization code needs to be presented during device pick-up and drop-off at the datacenter.

## Prerequisites

Self managed shipping for Azure Data Box Disc is only available to the following Regions:

1. Western Europe
2. Japan
3. Singapore
4. South Korea
5. India - self managed shipping is the only available option

For detailed information regarding prerequisites and Azure portal usage, see [Quickstart: Deploy Azure Data Box Heavy using the Azure portal](data-box-heavy-quickstart-portal.md)

## Use self-managed shipping

When you place a Data Box Disk order, you can choose self managed shipping option.

1. In **Azure Data Box Disk**>**Select your Azure Data Box Disk**>**Order** Click on **Contact details**, then click **+ Add Shipping Address**.
   ![Self-managed shipping](media\data-box-portal-customer-managed-shipping\choose-self-managed-shipping-1.png)

2. When choosing shipping type, if you are located in a supported region, you will have the option of selecting **Self-managed shipping**.

3. Once you have provided your shipping address, you will need to validate it.
Then you can complete your order.
   ![Self-managed shipping](media\data-box-portal-customer-managed-shipping\choose-self-managed-shipping-2.png)

4. Ready for Pick-up in progress. You need to click on **Schedule Pickup**.

   ![Ordering a Data Box device for pickup](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-user-pickup-01b.png)

5. Follow the instructions in the **Schedule pickup for Azure**. Before you can get your authorization code, you must email [adbops@microsoft.com](mailto:adbops@microsoft.com) to schedule the device pickup from your region's datacenter.
   ![Schedule pickup](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-user-pickup-02c.png)

6. After you have made contact with ADBOPs, you will be able to view your **Authorization Code** for your device in the **Schedule pickup for Azure**.

   ![Viewing your authorization code](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-authcode-01b.png)

   Write this number down or print it.

7. Ready for pickup in progress.
   Your order automatically moves to this state once the device prep has completed. You will receive an email instructing you to contact ADB ops to schedule an appointment to come to the datacenter for pickup.

   ![Picked up](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-ready-disk-01a.png)

   You also need to provide details of who will be going to the datacenter for pickup. You or the point of contact has to carry a Government approved photo ID that will be validated at the datacenter. Ops will need to include this person's details so that it can be verified during pickup.

   Additionally, the person who is picking up the device also needs to have the **Authorization code** that is available in the Portal under **Schedule Pick up**. This code is also validated at the datacenter time of pickup.

8. After the device is picked up, the customer needs to finish data copy and then drop off the device back at the DC.

    The authorization code for drop off will be available on the portal itself under **Schedule drop off**.
    Once you have finished data copy, you will need to contact operations to schedule an appointment for the drop off. If you plan on using a point of contact, you will need to include their personal details. The datacenter will also need to the authorization code.

   > [!NOTE]
   >
   > Do not share the authorization code over email. This is only to be verified at the datacenter during drop off.

9. You should now be at **Ready to receive** success state of the Azure portal. This means that you have scheduled an appointment for drop off and shared the drop off point of contact's details. You will also need to confirm that the datacenter also has the authorization code available.
   ![Viewing your authorization code](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-authcode-dropoff-02b.png)

10. Customer or point of contact has dropped off the device at the DC and their ID and authorization cod have been verified.

    ![Received Complete](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-received-01a.png)

11. After drop-off, Microsoft will copy your data to their servers. The Azure portal should be at the **Copy in progress**.

    ![Data Copy](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-copy-data-01.png)

12. When your data and finished copying successfully, Azure portal will indicate that the copy of your data is complete.

    ![Data Copy Complete](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-copy-data-complete-01.png)

## Next steps

- [Quickstart: Deploy Azure Data Box Heavy using the Azure portal](data-box-heavy-quickstart-portal.md)
