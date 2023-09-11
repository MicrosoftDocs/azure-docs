---
title: Tutorial to order Azure Data Box Disk | Microsoft Docs
description: Use this tutorial to learn how to sign up and order an Azure Data Box Disk to import data into Azure.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: disk
ms.topic: tutorial
ms.date: 10/21/2022
ms.author: shaas
# Customer intent: As an IT admin, I need to be able to order Data Box Disk to upload on-premises data from my server onto Azure.
---
# Tutorial: Order an Azure Data Box Disk

Azure Data Box Disk is a hybrid cloud solution that allows you to import your on-premises data into Azure in a quick, easy, and reliable way. You transfer your data to solid-state disks (SSDs) supplied by Microsoft and ship the disks back. This data is then uploaded to Azure. 

This tutorial describes how you can order an Azure Data Box Disk. In this tutorial, you learn about:

> [!div class="checklist"]
>
> * Order a Data Box Disk
> * Track the order
> * Cancel the order 

## Prerequisites

Before you deploy, complete the following configuration prerequisites for Data Box service and Data Box Disk.

### For service

[!INCLUDE [Data Box service prerequisites](../../includes/data-box-supported-subscriptions.md)]

### For device

Before you begin, make sure that:

* You have a client computer available from which you can copy the data. Your client computer must:
  * Run a [Supported operating system](data-box-disk-system-requirements.md#supported-operating-systems-for-clients).
  * Have other [required software](data-box-disk-system-requirements.md#other-required-software-for-windows-clients) installed if it is a Windows client.  

## Order Data Box Disk

Sign in to:

* The Azure portal at this URL: https://portal.azure.com to order Data Box Disk.
* Or, the Azure Government portal at this URL: https://portal.azure.us. For more details, go to [Connect to Azure Government using the portal](../azure-government/documentation-government-get-started-connect-with-portal.md).

Take the following steps to order Data Box Disk.

1. In the upper left corner of the portal, click **+ Create a resource**, and search for *Azure Data Box*. Click **Azure Data Box**.

   ![Search Azure Data Box 1](media/data-box-disk-deploy-ordered/search-data-box11.png)

2. Click **Create**.

3. Check if Data Box service is available in your region. Enter or select the following information and click **Apply**.

    ![Select Data Box Disk option](media/data-box-disk-deploy-ordered/select-data-box-sku-1.png)

    |Setting|Value|
    |---|---|
    |Transfer type| Import to Azure|
    |Subscription|Select the subscription for which Data Box service is enabled.<br> The subscription is linked to your billing account. |
    |Resource group| Select the resource group you want to use to order a Data Box. <br> A resource group is a logical container for the resources that can be managed or deployed together.|
    |Source country/region | Select the country/region where your data currently resides.|
    |Destination Azure region|Select the Azure region where you want to transfer data.|
  
4. Select **Data Box Disk**. The maximum capacity of the solution for a single order of 5 disks is 35 TB. You could create multiple orders for larger data sizes.

     ![Select Data Box Disk option 2](media/data-box-disk-deploy-ordered/select-data-box-sku-zoom.png)

5. In **Order**, specify the **Order details** in the **Basics** tab. Enter or select the following information.


    |Setting|Value|
    |---|---|
    |Subscription| The subscription is automatically populated based on your earlier selection. |
    |Resource group| The resource group you selected previously. |
    |Import order name|Provide a friendly name to track the order.<br> The name can have between 3 and 24 characters that can be letters, numbers, and hyphens. <br> The name must start and end with a letter or a number. |
    |Number of disks per order| Enter the number of disks you would like to order. <br> There can be a maximum of 5 disks per order (1 disk = 7TB). |
    |Disk passkey| Supply the disk passkey if you check **Use custom key instead of Azure generated passkey**. <br> Provide a 12 to 32-character alphanumeric key that has at least one numeric and one special character. The allowed special characters are `@?_+`. <br> You can choose to skip this option and use the Azure generated passkey to unlock your disks.|

    ![Screenshot of order details](media/data-box-disk-deploy-ordered/data-box-disk-order.png)

6. On the **Data destination** screen, select the **Data destination** - either storage accounts or managed disks (or both). 
    
    |Setting|Value|
    |---|---|
    |Data destination |Choose from storage account or managed disks or both.<br> Based on the specified Azure region, select a storage account from the filtered list of an existing storage account. Data Box Disk can be linked with only 1 storage account.<br> You can also create a new General-purpose v1, General-purpose v2, or Blob storage account.<br> Storage accounts with virtual networks are supported. To allow Data Box service to work with secured storage accounts, enable the trusted services within the storage account network firewall settings. For more information, see how to Add Azure Data Box as a trusted service.|
    |Destination Azure region| Select a region for your storage account. <br> Currently, storage accounts in all regions in US, West and North Europe, Canada, and Australia are supported. |
    |Resource group| If using Data Box Disk to create managed disks from the on-premises VHDs, you need to provide the resource group.<br> Create a new resource group if you intend to create managed disks from on-premises VHDs. Use an existing resource group only if it was created for Data Box Disk order for managed disk by Data Box service.<br> Only one resource group is supported.|

    ![Screenshot of Data Box Disk data destination.](media/data-box-disk-deploy-ordered/data-box-disk-order-destination.png)

    The storage account specified for managed disks is used as a staging storage account. The Data Box service uploads the VHDs to the staging storage account and then converts those into managed disks and moves to the resource groups. For more information, see Verify data upload to Azure.

7. Select **Next: Security>** to continue.

    The **Security** screen lets you use your own encryption key.
    
    All settings on the **Security** screen are optional. If you don't change any settings, the default settings will apply.

8. If you want to use your own customer-managed key to protect the unlock passkey for your new resource, expand **Encryption type**.
    
    ![Screenshot of Data Box Disk encryption type.](media/data-box-disk-deploy-ordered/data-box-disk-encryption.png)

    Configuring a customer-managed key for your Azure Data Box Disk is optional. By default, Data Box uses a Microsoft managed key to protect the unlock passkey.

    A customer-managed key doesn't affect how data on the device is encrypted. The key is only used to encrypt the device unlock passkey.

    If you don't want to use a customer-managed key, skip to Step 14.

1. To use a customer-managed key, select **Customer managed key** as the key type. Then choose **Select a key vault and key**.

    ![Screenshot of Customer managed key selection.](media/data-box-disk-deploy-ordered/data-box-disk-customer-key.png)

1. In the **Select key from Azure Key Vault** blade:

    - The **Subscription** is automatically populated.

    - For **Key vault**, you can select an existing key vault from the dropdown list.

    ![Screenshot of existing key vault.](media/data-box-disk-deploy-ordered/data-box-disk-select-key-vault.png)

    Or select **Create new key vault** if you want to create a new key vault.

    ![Screenshot of new key vault.](media/data-box-disk-deploy-ordered/data-box-disk-create-new-key-vault.png)

    Then, on the **Create key vault** screen, enter the resource group and a key vault name. Ensure that **Soft delete** and **Purge protection** are enabled. Accept all other defaults, and select **Review + Create**.

    ![Screenshot of Create key vault blade.](media/data-box-disk-deploy-ordered/data-box-disk-key-vault-blade.png)

    Review the information for your key vault, and select **Create**. Wait for a couple minutes for key vault creation to complete.

    ![Screenshot of Review + create.](media/data-box-disk-deploy-ordered/data-box-disk-create-key-vault.png)

1. The **Select a key** blade will display your selected key vault.
    
    ![Screenshot of new key vault 2.](media/data-box-disk-deploy-ordered/data-box-disk-new-key-vault.png)
    
    If you want to create a new key, select **Create new key**. You must use an **RSA key**. The size can be 2048 or greater. Enter a name for your new key, accept the other defaults, and select **Create**.

    ![Screenshot of Create new key.](media/data-box-disk-deploy-ordered/data-box-disk-new-key.png)

    You'll be notified when the key has been created in your key vault. Your new key will be selected and displayed on the **Select a key** blade.

1. Select the **Version** of the key to use, and then choose **Select**.
    
    ![Screenshot of key version.](media/data-box-disk-deploy-ordered/data-box-disk-key-version.png)
    
    If you want to create a new key version, select **Create new version**.

    ![Screenshot of new key version.](media/data-box-disk-deploy-ordered/data-box-disk-new-key-version.png)

    Choose settings for the new key version, and select **Create**.

    ![Screenshot of new key version settings.](media/data-box-disk-deploy-ordered/data-box-disk-new-key-settings.png)

    The **Encryption type** settings on the **Security** screen show your key vault and key.

    ![Screenshot of encryption type settings.](media/data-box-disk-deploy-ordered/data-box-disk-encryption-settings.png)

1. Select a user identity that you'll use to manage access to this resource. Choose **Select a user identity**. In the panel on the right, select the subscription and the managed identity to use. Then choose **Select**.

    A user-assigned managed identity is a stand-alone Azure resource that can be used to manage multiple resources. For more information, see Managed identity types.

    If you need to create a new managed identity, follow the guidance in Create, list, delete, or assign a role to a user-assigned managed identity using the Azure portal.

    ![Screenshot of user identity.](media/data-box-disk-deploy-ordered/data-box-disk-user-identity.png)

    The user identity is shown in Encryption type settings.

    ![Screenshot of user identity 2.](media/data-box-disk-deploy-ordered/data-box-disk-user-identity-2.png)


8. In the **Contact details** tab, select **Add address** and enter the address details. Click Validate address. The service validates the shipping address for service availability. If the service is available for the specified shipping address, you receive a notification to that effect.

    If you have chosen self-managed shipping, see [Use self-managed shipping](data-box-disk-portal-customer-managed-shipping.md).

    ![Screenshot of Data Box Disk contact details.](media/data-box-disk-deploy-ordered/data-box-disk-contact-details.png)

    Specify valid email addresses as the service sends email notifications regarding any updates to the order status to the specified email addresses.

    We recommend that you use a group email so that you continue to receive notifications if an admin in the group leaves.

9. Review the information in the **Review + Order** tab related to the order, contact, notification, and privacy terms. Check the box corresponding to the agreement to privacy terms.

10.	Click **Order**. The order takes a few minutes to be created.

## Track the order

After you have placed the order, you can track the status of the order from Azure portal. Go to your order and then go to **Overview** to view the status. The portal shows the job in **Ordered** state.

![Data Box Disk status ordered.](media/data-box-disk-deploy-ordered/data-box-portal-ordered.png)

If the disks are not available, you receive a notification. If the disks are available, Microsoft identifies the disks for shipment and prepares the disk package. During disk preparation, following actions occur:

* Disks are encrypted using AES-128 BitLocker encryption.  
* Disks are locked to prevent an unauthorized access to the disks.
* The passkey that unlocks the disks is generated during this process.

When the disk preparation is complete, the portal shows the order in **Processed** state.

Microsoft then prepares and dispatches your disks via a regional carrier. You receive a tracking number once the disks are shipped. The portal shows the order in **Dispatched** state.

## Cancel the order

To cancel this order, in the Azure portal, go to **Overview** and click **Cancel** from the command bar.

You can only cancel when the disks are ordered, and the order is being processed for shipment. Once the order is processed, you can no longer cancel the order.

![Cancel order.](media/data-box-disk-deploy-ordered/cancel-order1.png)

To delete a canceled order, go to **Overview** and click **Delete** from the command bar.

## Next steps

In this tutorial, you learned about Azure Data Box topics such as:

> [!div class="checklist"]
>
> * Order Data Box Disk
> * Track the order
> * Cancel the order

Advance to the next tutorial to learn how to set up your Data Box Disk.

> [!div class="nextstepaction"]
> [Set up your Azure Data Box Disk](./data-box-disk-deploy-set-up.md)