---
title: Microsoft Azure Data Box Disk self-managed Shipping | Microsoft Docs in data 
description: Describes self-managed shipping workflow for Azure Data Box Disk devices
services: databox
author: priestlg

ms.service: databox
ms.subservice: disk
ms.topic: how-to
ms.date: 05/20/2020
ms.author: v-grpr
---

# Use self-managed shipping for Azure Data Box Disk in the Azure portal

This article describes self-managed shipping tasks to order, pick-up, and drop-off of Azure Data Box Disk. You can manage Data Box Disk using the Azure portal.

## Prerequisites

Self-managed shipping is available as an option when you [Order Azure Data Box Disk](data-box-disk-deploy-ordered.md). Self-managed shipping is only available in the following regions:

* US Government
* Western Europe
* Japan
* Singapore
* South Korea

## Use self-managed shipping

When you place a Data Box Disk order, you can choose self-managed shipping option.

1. In your Azure Data Box Disk order, under the **Contact details**, select **+ Add Shipping Address**.

   ![Self-managed shipping](media\data-box-portal-customer-managed-shipping\choose-self-managed-shipping-1.png)

2. When choosing shipping type, select the **Self-managed shipping** option. This option is only available if you are in a supported region as described in the prerequisites.

3. Once you have provided your shipping address, you will need to validate it and complete your order.

   ![Self-managed shipping](media\data-box-portal-customer-managed-shipping\choose-self-managed-shipping-2.png)

4. Once the device has been prepared and you received an email notification, you can schedule a pickup. In your Azure Data Box Disk order, go to **Overview** and then select **Schedule pickup**.

   ![Ordering a Data Box device for pickup](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-user-pickup-01b.png)

5. Follow the instructions in the **Schedule pickup for Azure**. Before you can get your authorization code, you must email [adbops@microsoft.com](mailto:adbops@microsoft.com) to schedule the device pickup from your region's datacenter.

   ![Schedule pickup](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-user-pickup-02c.png)

6. After you have scheduled your device pickup, you will be able to view your authorization code in the  **Schedule pickup for Azure**.

   ![Viewing your authorization code](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-authcode-01b.png)

   Make a note of this **Authorization code**.

   As per the security requirements, at the time of scheduling pick-up, it is necessary to present the name of the person who will be arriving for pick-up.

   You also need to provide details of who will be going to the datacenter for pickup. You or the point of contact must carry a Government approved photo ID that will be validated at the datacenter.

   Additionally, the person who is picking up the device also needs to have the **Authorization code**. The authorization code is unique for a pickup or a drop off and is validated at the datacenter.

7. Your order automatically moves to the **Picked up** state once the device has been picked up from the datacenter.

   ![Picked up](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-ready-disk-01b.png)

8. After the device is picked up, you may copy data to the Data Box Disk(s) at your site. After the data copy is complete, you can prepare to ship the Data Box Disk.

   Once you have finished data copy, you will need to contact operations to schedule an appointment for the drop off. You will need to share the details of the person coming to the datacenter to drop off the disks. The datacenter will also need to verify the authorization code at the time of drop-off. The authorization code for drop off will be available in Azure portal under **Schedule drop off**.

   > [!NOTE]
   > Do not share the authorization code over email. This is only to be verified at the datacenter during drop off.

9. If you have received an appointment for drop off the order should now be at the **Ready to receive at Azure datacenter** state in the Azure portal.

   ![Viewing your authorization code](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-authcode-dropoff-02b.png)

10. After your ID and authorization code have been verified and you have dropped off the device at the datacenter, the order status should be **Received**.

    ![Received Complete](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-received-01a.png)

11. Once the device is received, the data copy will continue. When the copy finishes, the order is complete.

## Next steps

* [Quickstart: Deploy Azure Data Box Disk using the Azure portal](data-box-disk-quickstart-portal.md)
