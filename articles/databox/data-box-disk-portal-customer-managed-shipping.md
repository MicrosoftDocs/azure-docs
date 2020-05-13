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

This article describes the process workflow and self-managed shipping tasks to order, pick-up, and drop off of an Azure Data Box Disk device. You can manage the Data Box Disk using the Azure portal. You also have the option of choosing a point of contact from your organization, or use any carrier of your choice to pick up the Azure Data Box Disk device from a datacenter and also return the device back to the datacenter. It is important that you follow the datacenter's security procedures as sign-off is required at particular points between pickup and drop-of. At pick-up and drop-off, you, or point of contact, will be assigned an authorization code. This authorization code is needed during device pick-up and drop-off at the datacenter.

## Prerequisites

Self-managed shipping for Azure Data Box Disc is only available to the following Regions:

1. Western Europe
2. Japan
3. Singapore
4. South Korea
5. India - self-managed shipping is the only available option

For detailed information on how to create a Data Box Disk order, see [Tutorial: Order Azure Data Box Disk](data-box-disk-deploy-ordered.md).

## Use self-managed shipping

When you place a Data Box Disk order, you can choose self-managed shipping option.

1. In **Azure Data Box Disk**>**Select your Azure Data Box Disk**>**Order** Click on **Contact details**, then click **+ Add Shipping Address**.
   ![Self-managed shipping](media\data-box-portal-customer-managed-shipping\choose-self-managed-shipping-1.png)

2. When choosing shipping type, if you are located in a supported region, you will have the option of selecting **Self-managed shipping**.

3. Once you have provided your shipping address, you will need to validate it.
Then you can complete your order.
   ![Self-managed shipping](media\data-box-portal-customer-managed-shipping\choose-self-managed-shipping-2.png)

4. Once the device has shipped from Microsoft, you can schedule a pickup. In your Azure Data Box order, go to **Overview** and then click **Schedule pickup**.

   ![Ordering a Data Box device for pickup](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-user-pickup-01b.png)

5. Follow the instructions in the **Schedule pickup for Azure**. Before you can get your authorization code, you must email [adbops@microsoft.com](mailto:adbops@microsoft.com) to schedule the device pickup from your region's datacenter.
   ![Schedule pickup](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-user-pickup-02c.png)

6. After you have made contact with ADBOPs, you will be able to view your **Authorization Code** for your device in the **Schedule pickup for Azure**.

   ![Viewing your authorization code](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-authcode-01b.png)

   Write down this number or print it.

7. Your order automatically moves to the **Picked up** state once the device prep has completed. You will receive an email instructing you to contact ADB ops to schedule an appointment to come to the datacenter for pickup.

   ![Picked up](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-ready-disk-01a.png)

   You also need to provide details of who will be going to the datacenter for pickup. You or the point of contact has to carry a Government approved photo ID that will be validated at the datacenter. Ops will need to include this person's details so that it can be verified during pickup.

   Additionally, the person who is picking up the device also needs to have the **Authorization code** that is available in the Portal under **Schedule pickup**. The authorization code is also validated at the datacenter at the time of pickup.

8. After the device is picked up, the customer needs to successfully complete data copy and then drop off the device back at the datacenter.

    The authorization code for drop off will be available on the portal itself under **Schedule drop off**.
    Once you have finished data copy, you will need to contact operations to schedule an appointment for the drop off. If you plan on using a point of contact, you will need to include their personal details. The datacenter will also need to the authorization code.

   > [!NOTE]
   >
   > Do not share the authorization code over email. This is only to be verified at the datacenter during drop off.

9. If you have scheduled an appointment for drop off and shared the drop off point of contact's details, then you should now be at **Ready to receive success** state of the Azure portal. You will also need to confirm that the datacenter also has your authorization code.
   ![Viewing your authorization code](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-authcode-dropoff-02b.png)

10. Customer or point of contact has dropped off the device at the datacenter and their ID and authorization code have been verified.

    ![Received Complete](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-received-01a.png)

11. After drop-off, Microsoft will copy your data from the Data Box Disk to Azure. The Azure portal will let you know that the back up is in progress with the status message, **Copy in progress**.

    ![Data Copy](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-copy-data-01.png)

12. After the datacenter has finished copying your data files from the Data Box Disk to Azure, the Azure portal will indicate that your data copy is complete.

    ![Data Copy Complete](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-copy-data-complete-01.png)

## Next steps

- [Quickstart: Deploy Azure Data Box Disk using the Azure portal](data-box-disk-quickstart-portal.md)
