---
title: Azure Data Box portal admin guide | Microsoft Docs 
description: Describes how to use the Azure portal to administer your Azure Data Box.
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: overview
ms.date: 09/24/2018
ms.author: alkohli
---

# Use the Azure portal to administer your Data Box

This article describes some of the complex workflows and management tasks that can be performed on the Data Box. You can manage the Data Box via the Azure portal or via the local web UI. 

This article focuses on the tasks that you can perform using the Azure portal. Use the Azure portal to manage orders, manage Data Box, and track the status of the order as it proceeds to completion.


## Cancel an order

You may need to cancel an order for various reasons after you have placed the order. You can only cancel the order before the order is processed. Once the order is processed and Data Box is prepared, it is not possible to cancel the order. 

Perform the following steps to cancel an order.

1.	Go to **Overview > Cancel**. 

    ![Cancel order 1](media/data-box-portal-admin/cancel-order1.png)

2.	Fill out a reason for canceling the order.  

    ![Cancel order 2](media/data-box-portal-admin/cancel-order2.png)

3.	Once the order is canceled, the portal updates the status of the order and displays it as **Canceled**. 

## Clone an order

Cloning is useful in certain situations. For example, a user has used Data Box to transfer some data. As more data is generated, there is a need for another Data Box to transfer that data into Azure. In this case, the same order can be just cloned over.

Perform the following steps to clone an order.

1.	Go to **Overview > Clone**. 

    ![Clone order 1](media/data-box-portal-admin/clone-order1.png)

2.	All the details of the order stay the same. The order name is the original order name appended by *-Clone*. Select the checkbox to confirm that you have reviewed the privacy information. Click **Create**.    

The clone is created in a few minutes and the portal updates to show the new order.


## Delete order

You may want to delete an order when the order is complete. The order contains your personal information such as name, address, and contact information. This personal information is deleted when the order is deleted.

You can only delete orders that are completed or canceled. Perform the following steps to delete an order.

1. Go to **All resources**. Search for your order.

2. Click the order you want to delete and go to **Overview**. From the command bar, click **Delete**.

    ![Delete Data Box order 1](media/data-box-portal-admin/delete-order1.png)

3. Enter the name of the order when prompted to confirm the order deletion. Click **Delete**.

## Download shipping label

You may need to download the shipping label if the E-ink display of your Data Box is not working and does not display the return shipping label. 

Perform the following steps to download a shipping label.
1.	Go to **Overview > Download shipping label**. This option is available only after the device has shipped. 

    ![Download shipping label](media/data-box-portal-admin/download-shipping-label.png)

2.	This downloads the following return shipping label. Save the label and print it out. Fold and insert the label into the clear sleeve on the device. Ensure that the label is visible. Remove any stickers that are on the device from previous shipping.

    ![Example shipping label](media/data-box-portal-admin/example-shipping-label.png)

## Edit shipping address

You may need to edit the shipping address once the order is placed. This is only available until the device is dispatched. Once the device is dispatched, this option is no longer available.

Perform the following steps to edit the order.

1. Go to **Order details > Edit shipping address**.

    ![Edit shipping address 1](media/data-box-portal-admin/edit-shipping-address1.png)

2. Edit and validate the shipping address and then save the changes.

    ![Edit shipping address 2](media/data-box-portal-admin/edit-shipping-address2.png)

## Edit notification details

You may need to change the users whom you want to receive the order status emails. For instance, a user needs to be informed when the device is delivered or picked up. Another user may need to be informed when the data copy is complete so he can verify the data is in the Azure storage account before deleting it from the source. In these instances, you can edit the notification details.

Perform the following steps to edit notification details.

1. Go to **Order details > Edit notification details**.

    ![Edit notification details 1](media/data-box-portal-admin/edit-notification-details1.png)

2. You can now edit the notification details and then save the changes.
 
    ![Edit notification details 2](media/data-box-portal-admin/edit-notification-details2.png)


## View order status

When the device status changes in portal, you are notified via an email.

|Order status |Description |
|---------|---------|
|Ordered     | Successfully placed an order. <br>If the device is available, Microsoft identifies a device for shipment and prepares the device. <br> If the device is not available immediately, order will be processed when the device becomes available. The order could take several days to a couple months to process. If the order cannot be fulfilled in 90 days, the order is canceled and you are notified.         |
|Processed     | Order processing is complete. As per your order, the device is prepared for shipment in the datacenter.         |
|Dispatched     | Order has shipped. Use the tracking ID displayed in your order in the portal to track the shipment.        |
|Delivered     | Shipment was delivered to the address specified in the order.        |
|Picked up     |Your return shipment was picked up and scanned by the carrier.         |
|Received     | Your device is received and scanned at the Azure datacenter. <br> Once the shipment is inspected, device upload will start.      |
|Data copy     | Data copy is in progress. Track the copy progress for your order in Azure portal. <br> Wait until the data copy is complete. |
|Completed       |Successfully completed the order.<br> Verify your data is in Azure before you delete the on-premises data from servers.         |
|Completed with errors| Data copy was completed but errors occurred during the copy. <br> Review the copy logs using the path provided in the Azure portal.   |
|Canceled            |Order is canceled. <br> Either you canceled the order or an error was encountered and the service canceled the order. If the order cannot be fulfilled in 90 days, the order is also canceled and you are notified.     |
|Clean up | The data on the device disks is erased. The device cleanup is considered complete when the order log report is available in the Azure portal.|



## Next steps

- Learn how to [Troubleshoot Data Box issues](data-box-faq.md).
