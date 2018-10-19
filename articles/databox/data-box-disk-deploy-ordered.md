---
title: Tutorial to order Microsoft Azure Data Box Disk | Microsoft Docs
description: Use this tutorial to learn how to sign up and order an Azure Data Box Disk to import data into Azure.
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: tutorial
ms.date: 09/04/2018
ms.author: alkohli
Customer intent: As an IT admin, I need to be able to order Data Box Disk to upload on-premises data from my server onto Azure.
---
# Tutorial: Order an Azure Data Box Disk (Preview)

Azure Data Box Disk is a hybrid cloud solution that allows you to import your on-premises data into Azure in a quick, easy, and reliable way. You transfer your data to solid-state disks (SSDs) supplied by Microsoft and ship the disks back. This data is then uploaded to Azure. 

This tutorial describes how you can order an Azure Data Box Disk. In this tutorial, you learn about:

> [!div class="checklist"]
> * Sign up for Data Box Disk
> * Order a Data Box Disk
> * Track the order
> * Cancel the order

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!IMPORTANT]
> - Data Box Disk is in preview. Review the [Azure terms of service for preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you order and deploy this solution. 
> - During preview, Data Box Disk can be shipped to customers in US, West and North Europe, Candana, and Australia. For more information, go to [Region availability](data-box-disk-overview.md#region-availability).

## Sign up 

Data Box Disk is in preview and you need to sign up for the service. Perform the following steps to sign up for Data Box service:

1. Sign into the Azure portal at: [https://aka.ms/azuredataboxfromdiskdocs](https://aka.ms/azuredataboxfromdiskdocs).
2. Pick the subscription that you want to enable for the preview. Answer the questions regarding data size, data residence country, time-frame, and data transfer frequency. Click **Sign me up!**.
3. Once you are signed up and enabled for preview, you can order a Data Box Disk.

## Order Data Box Disk

Perform the following steps in the [Azure portal](https://aka.ms/azuredataboxfromdiskdocs) to order Data Box Disk.

1. In the upper left corner of the portal, click **+ Create a resource**, and search for *Azure Data Box*. Click **Azure Data Box**.
    
   ![Search Azure Data Box 1](media/data-box-disk-deploy-ordered/search-data-box11.png)

2. Click **Create**.

3. Check if Data Box service is available in your region. Enter or select the following information and click **Apply**.

    ![Select Data Box Disk option](media/data-box-disk-deploy-ordered/select-data-box-sku-1.png)

    |Setting|Value|
    |---|---|
    |Subscription|Select the subscription for which Data Box service is enabled.<br> The subscription is linked to your billing account. |
    |Transfer type| Import to Azure|
    |Source country | Select the country where your data currently resides.|
    |Destination Azure region|Select the Azure region where you want to transfer data.|

  
5.  Select **Data Box Disk**. The maximum capacity of the solution for a single order of 5 disks is 35 TB. You could create multiple orders for larger data sizes. 

     ![Select Data Box Disk option](media/data-box-disk-deploy-ordered/select-data-box-sku-zoom.png)

6.  In **Order**, specify the **Order details**. Enter or select the following information.

    |Setting|Value|
    |---|---|
    |Name|Provide a friendly name to track the order.<br> The name can have between 3 and 24 characters that can be letters, numbers, and hyphens. <br> The name must start and end with a letter or a number. |
    |Resource group| Use an existing or create a new one. <br> A resource group is a logical container for the resources that can be managed or deployed together. |
    |Destination Azure region| Select a region for your storage account.<br> Currently, storage accounts in all regions in US, West and North Europe, Canada, and Australia are supported. |
    |Storage account(s)|Based on the specified Azure region, select from the filtered list of an existing storage account. <br>You can also create a new General purpose v1 or General purpose v2 account. |
    |Estimated data size in TB| Enter an estimate in TB. <br>Based on the data size, Microsoft sends you an appropriate number of 8 TB SSDs (7 TB usable capacity). <br>The maximum usable capacity of 5 disks is up to 35 TB. |

13. Click **Next**. 

    ![Supply order details](media/data-box-disk-deploy-ordered/data-box-order-details.png)

14. In the **Shipping address** tab, provide your first and last name, name and postal address of the company and a valid phone number. Click **Validate address**. The service validates the shipping address for service availability. If the service is available for the specified shipping address, you receive a notification to that effect. 

    ![Provide shipping address](media/data-box-disk-deploy-ordered/data-box-shipping-address.png)
15. In the **Notification details**, specify email addresses. The service sends email notifications regarding any updates to the order status to the specified email addresses. 

    We recommend that you use a group email so that you continue to receive notifications if an admin in the group leaves.

16. Review the information **Summary** related to the order, contact, notification, and privacy terms. Check the box corresponding to the agreement to privacy terms.

17. Click **Order**. The order takes a few minutes to be created.

 
## Track the order

After you have placed the order, you can track the status of the order from Azure preview portal. Go to your order and then go to **Overview** to view the status. The portal shows the job in **Ordered** state. 

![Data Box Disk status ordered](media/data-box-disk-deploy-ordered/data-box-portal-ordered.png) 

If the disks are not available, you receive a notification. If the disks are available, Microsoft identifies the disks for shipment and prepares the disk package. During disk preparation, following actions occur:

- Disks are encrypted using AES-128 BitLocker encryption.  
- Disks are locked to prevent an unauthorized access to the disks.
- The passkey that unlocks the disks is generated during this process.

When the disk preparation is complete, the portal shows the order in **Processed** state.

Microsoft then prepares and dispatches your disks via a regional carrier. You receive a tracking number once the disks are shipped. The portal shows the order in **Dispatched** state.



## Cancel the order

To cancel this order, in the Azure preview portal, go to **Overview** and click **Cancel** from the command bar. 

You can only cancel when the disks are ordered and the order is being processed for shipment. Once the order is processed, you can no longer cancel the order. 

![Cancel order](media/data-box-disk-deploy-ordered/cancel-order1.png)

To delete a canceled order, go to **Overview** and click **Delete** from the command bar. 


## Next steps

In this tutorial, you learned about Azure Data Box topics such as:

> [!div class="checklist"]
> * Sign up for Data Box Disk
> * Order Data Box Disk
> * Track the order
> * Cancel the order

Advance to the next tutorial to learn how to set up your Data Box Disk.

> [!div class="nextstepaction"]
> [Set up your Azure Data Box Disk](./data-box-disk-deploy-set-up.md)


