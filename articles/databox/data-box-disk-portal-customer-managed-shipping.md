---
title: Microsoft Azure Data Box Disk Customer Managed Shipping | Microsoft Docs in data 
description: Describes customer managed shipping workflow for Azure Data Box devices
services: databox
author: priestlg

ms.service: databox
ms.subservice: disk
ms.topic: conceptual
ms.date: 04/27/2020
ms.author: v-grpr
---

# Use the Azure Portal to manage Data Box Disk Customer Managed Shipping

This article describes the process workflow and customer managed shipping (CMS) tasks to order, pick-up, and drop off of an Azure Data Box Disk. You can manage the Data Box Disk device using the Azure portal. Since some organizations are working with sensitive data, it's imperative that there is a method for Microsoft and the customer to handle device logistics in a secure manner where the customer has control over. The customer can designate a point of contact from their organization, or use any carrier of their choice to pick up the Azure Data Box Disk device from a distribution center and also return the device back to the distribution center. The customer will need to follow distribution center's security procedures, so both parties will need to sign off at particular points between pick-up and drop-off. At many of the stages of the workflow, you will be using an assigned authorization code (authcode) that you, the customer, and the distribution center will use for that security.

## Prerequisites

Customer Managed Shipping for Azure Data Box and Azure Data Box Disc is only available to the following Regions:

1. Western Europe
2. Japan
3. Singapore
4. South Korea
5. India (CMS only)

For detailed information regarding prerequisites and Azure Portal usage, see [Quickstart: Deploy Azure Data Box Heavy using the Azure portal](data-box-heavy-quickstart-portal.md)

## Order an Azure Data Box from your supported region

1. When choosing shipping type, if you are located in a supported region, you will have the option of selecting **Self-managed shipping**.

   ![Self-managed shipping](media\data-box-disk-portal-customer-managed-shipping\customer-managed-shipping-ship-option.png)

2. After you fill out the fields, you will need to verify/validate your email address.

3. Ready for Pick-up in progress. You need to click on **Schedule Pickup**.

   ![Ordering a Data Box device for pickup](media\data-box-disk-portal-customer-managed-shipping\pendingUserPickup-disk-01b.png)

4. Follow the instructions in the **Schedule pickup for Azure**. Before you can get your authorization code, you must email [adbops@microsoft.com](mailto:adbops@microsoft.com) to schedule the device pickup from your region's distribution center.
   ![Schedule pickup](media\data-box-disk-portal-customer-managed-shipping\pendingUserPickup-disk-02b.png)

5. After you have made contact with ADBOPs, you will be able to view your **Authorization Code** for your device in the **Schedule pickup for Azure**.
   ![Authorization Code](media\data-box-disk-portal-customer-managed-shipping\selfManageDBDReadyToDisp-disk-01-b-Auth.png)

   Write this number down or print it.

6. Ready for pickup in progress.
   Your order automatically moves to this state once the device prep has completed. You will receive an email instructing you to contact ADB ops to schedule an appointment to come to the distribution center for pick up.

   ![Picked up](media\data-box-disk-portal-customer-managed-shipping\selfManageDBDReadyToRece-disk-01.png)

   You also need to provide details of who will be coming for the pick up. You or the point of contact has to carry a Government approved photo ID that will be validated at the DC. Ops will need to include this person's details so that it can be verified during pick up.

   Additionally, the person who is picking up the device also needs to have the **Authorization code** that is available in the Portal under **Schedule Pick up**. This code is also validated at the distribution center time of pick up.

7. After you have scheduled an appointment for pick up and shared the pick up point of contact's details.

8. After the device is picked up, the customer needs to finish data copy and then drop off the device back at the DC.

    Auth code for drop off will be available on the portal itself under **Schedule drop off**.
    Once you have finished data copy, you will need to contact operations to schedule an appointment for the drop off. If you plan on using a point of contact, you will need to include their personal details. The distribution center will also need to the authorization code.

   > [!NOTE]
   >
   > Do not share the authorization code over email. This is only to be verified at the distribution center during drop off.

9. You should now be at **Ready to receive** success state of the Azure portal. This means that you have scheduled an appointment for drop off and shared the drop off point of contact's details. You will also need to confirm that the distribution center also has the authorization code available.
   ![Authorization Code](media\data-box-disk-portal-customer-managed-shipping\receiveAzureDatacenterAuthCode-disk-02b.png)

10. Customer or point of contact has dropped off the device at the DC and their ID and authorization code have been verified.

    ![Received Complete](media\data-box-disk-portal-customer-managed-shipping\selfManageDB-Received-disk-01.png)

11. From this point on Microsoft will copy your data to their servers. From the UI you will be able to see the **Copy in progress**.

    ![Data Copy](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-copy-data-01.png)

12. When your data and finished copying successfully, Azure portal will indicate that the copy of your data is complete.

    ![Data Copy Complete](media\data-box-disk-portal-customer-managed-shipping\data-box-disk-copy-data-complete-01.png)

## Next steps

[Quickstart: Deploy Azure Data Box Heavy using the Azure portal](data-box-heavy-quickstart-portal.md)
