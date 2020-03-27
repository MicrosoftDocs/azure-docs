---
title: Azure Data Box Disk portal admin guide | Microsoft Docs 
description: Describes how to use the Azure portal to administer your Azure Data Box.
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: how-to
ms.date: 01/09/2019
ms.author: alkohli
---
# Use Azure portal to administer your Data Box Disk

The tutorials in this article apply to the Microsoft Azure Data Box Disk during Preview. This article describes some of the complex workflows and management tasks that can be performed on the Data Box Disk. 

You can manage the Data Box Disk via the Azure portal. This article focuses on the tasks that you can perform using the Azure portal. Use the Azure portal to manage orders, manage disks, and track the status of the order as it proceeds to the terminal stage.

## Cancel an order

You may need to cancel an order for various reasons after you have placed the order. You can only cancel the order before the disk preparation starts. Once the disks are prepared and order processed, it is not possible to cancel the order. 

Perform the following steps to cancel an order.

1.	Go to **Overview > Cancel**. 

    ![Cancel order 1](media/data-box-portal-ui-admin/cancel-order1.png)

2.	Fill out a reason for canceling the order.  

    ![Cancel order 2](media/data-box-portal-ui-admin/cancel-order2.png)

3.	Once the order is canceled, the portal updates the status of the order and displays it as **Canceled**.

    ![Cancel order 3](media/data-box-portal-ui-admin/cancel-order3.png)

You do not receive an email notification when the order is canceled.

## Clone an order

Cloning is useful in certain situations. For example, a user has used Data Box Disk to transfer some data. As more data is generated, there is a need for more disks to transfer that data into Azure. In this case, the same order can be just cloned over.

Perform the following steps to clone an order.

1.	Go to **Overview > Clone**. 

    ![Clone order 1](media/data-box-portal-ui-admin/clone-order1.png)

2.	All the details of the order stay the same. The order name is the original order name appended by *-Clone*. Select the checkbox to confirm that you have reviewed the privacy information. Click **Create**.    

The clone is created in a few minutes and the portal updates to show the new order.

[![Clone order 3](media/data-box-portal-ui-admin/clone-order3.png)](media/data-box-portal-ui-admin/clone-order3.png#lightbox) 

## Delete order

You may want to delete an order when the order is complete. The order contains your personal information such as name, address, and contact information. This personal information is deleted when the order is deleted.

You can only delete orders that are completed or canceled. Perform the following steps to delete an order.

1. Go to **All resources**. Search for your order.

    ![Search Data Box Disk orders](media/data-box-portal-ui-admin/search-data-box-disk-orders.png)

2. Click the order you want to delete and go to **Overview**. From the command bar, click **Delete**.

    ![Delete Data Box Disk order 1](media/data-box-portal-ui-admin/delete-order1.png)

3. Enter the name of the order when prompted to confirm the order deletion. Click **Delete**.

     ![Delete Data Box Disk order 2](media/data-box-portal-ui-admin/delete-order2.png)


## Download shipping label

You may need to download the shipping label if the return shipping label shipped with your disks is misplaced or lost. 

Perform the following steps to download a shipping label.
1.	Go to **Overview > Download shipping label**. This option is available only after the disk is shipped. 

    ![Download shipping label](media/data-box-portal-ui-admin/download-shipping-label.png)

2.	This downloads the following return shipping label. Save the label, print it out, and affix to the return shipment.

    ![Example shipping label](media/data-box-portal-ui-admin/example-shipping-label.png)

## Edit shipping address

You may need to edit the shipping address once the order is placed. This is only available until the disk is dispatched. Once the disk is dispatched, this option will no longer be available.

Perform the following steps to edit the order.

1. Go to **Order details > Edit shipping address**.

    ![Edit shipping address 1](media/data-box-portal-ui-admin/edit-shipping-address1.png)

2. You can now edit the shipping address and then save the changes.

    ![Edit shipping address 2](media/data-box-portal-ui-admin/edit-shipping-address2.png)

## Edit notification details

You may need to change the users whom you want to receive the order status emails. For instance, a user needs to be informed when the disk is delivered or picked up. Another user may need to be informed when the data copy is complete so they can verify the data is in the Azure storage account before deleting it from the source. In these instances, you can edit the notification details.

Perform the following steps to edit notification details.

1. Go to **Order details > Edit notification details**.

    ![Edit notification details 1](media/data-box-portal-ui-admin/edit-notification-details1.png)

2. You can now edit the notification details and then save the changes.
 
    ![Edit notification details 2](media/data-box-portal-ui-admin/edit-notification-details2.png)

## View order status

|Order status |Description |
|---------|---------|
|Ordered     | Successfully placed an order. <br> If the disks are not available, you receive a notification. <br>If the disks are available, Microsoft identifies a disk for shipment and prepares the disk package.        |
|Processed     | Order processing is complete. <br> During order processing, following actions occur:<li>Disks are encrypted using AES-128 BitLocker encryption. </li> <li>The Data Box Disk are locked to prevent any unauthorized access.</li><li>The passkey that unlocks the disks is generated during this process.</li>        |
|Dispatched     | Order has shipped. You should receive the order in 1-2 days.        |
|Delivered     | Order was delivered to the address specified in the order.        |
|Picked up     |Your return shipment was picked up. <br> Once the shipment is received at Azure datacenter, data will be automatically uploaded to Azure.         |
|Received     | Your disks were received at the Azure datacenter. Data copy will start soon.        |
|Data copied     |Data copy is in progress.<br> Wait until the data copy is complete.         |
|Completed       |Successfully completed the order.<br> Verify your data is in Azure before you delete the on-premises data from servers.         |
|Completed with errors| Data copy was completed but errors were received. <br> Review the error logs for upload using the path provided in the **Overview**. For more information, go to [Download upload error logs](data-box-disk-troubleshoot-upload.md#download-logs).   |
|Canceled            |Order is canceled. <br> Either you canceled the order or an error was encountered and the service canceled the order.     |



## Next steps

- Learn how to [Troubleshoot Data Box Disk issues](data-box-disk-troubleshoot.md).
