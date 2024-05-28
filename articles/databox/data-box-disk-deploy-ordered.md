---
title: Tutorial to order Azure Data Box Disk | Microsoft Docs
description: Use this tutorial to learn how to sign up and order an Azure Data Box Disk to import data into Azure.
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: disk
ms.topic: tutorial
ms.date: 04/22/2024
ms.author: shaas
# Customer intent: As an IT admin, I need to be able to order Data Box Disk to upload on-premises data from my server onto Azure.

# Doc scores:
#    10/21/22: 75 (1921/15)
#    09/24/23: 100 (1996/0)

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
  * Have other [required software](data-box-disk-system-requirements.md#other-required-software-for-windows-clients) installed if it's a Windows client.

> [!IMPORTANT]
> Hardware encryption support for Data Box Disk is currently available for regions within the US, Europe, and Japan.
>
> Azure Data Box disk with hardware encryption requires a SATA III connection. All other connections, including USB, are not supported.  

## Order Data Box Disk

You can order Data Box Disks using either the Azure portal or Azure CLI.

### [Portal](#tab/azure-portal)

Sign in to:

* The Azure portal at this URL: https://portal.azure.com to order Data Box Disk.
* Or, the Azure Government portal at this URL: https://portal.azure.us. For more details, go to [Connect to Azure Government using the portal](../azure-government/documentation-government-get-started-connect-with-portal.md).

Take the following steps to order Data Box Disk.

1. In the upper left corner of the portal, select **+ Create a resource**, and search for *Azure Data Box*. Select **Azure Data Box**.

   :::image type="content" source="media/data-box-disk-deploy-ordered/data-box-import-01.png" alt-text="Screenshot highlighting the location of the Search box while searching for Data Box Disk":::

1. Select **Create**.

1. Check if Data Box service is available in your region. Enter or select the following information and select **Apply**.

    :::image type="content" source="media/data-box-disk-deploy-ordered/data-box-import-03.png" alt-text="Select Data Box Disk option":::

    |Setting|Value|
    |---|---|
    |Transfer type| Import to Azure|
    |Subscription|Select the subscription for which Data Box service is enabled.<br /> The subscription is linked to your billing account. |
    |Resource group| Select the resource group you want to use to order a Data Box. <br /> A resource group is a logical container for the resources that can be managed or deployed together.|
    |Source country/region | Select the country/region where your data currently resides.|
    |Destination Azure region|Select the Azure region where you want to transfer data.|
  
1. Select **Data Box Disk**. The maximum capacity of the solution for a single order of five disks is 35 TB. You could create multiple orders for larger data sizes.

     :::image type="content" alt-text="Screenshot showing the location of the Data Box Disk option's Select button." source="media/data-box-disk-deploy-ordered/data-box-import-04.png" lightbox="media/data-box-disk-deploy-ordered/data-box-import-04-lrg.png":::

1. In **Order**, specify the **Order details** in the **Basics** tab. Enter or select the following information.

    > [!IMPORTANT]
    > Hardware encryption support for Data Box Disk is currently available for regions within the US, Europe, and Japan.
    >
    > Hardware encrypted drives are only supported when using SATA 3 connections to Linux-based systems. Software encrypted drives use BitLocker technology, and can connect Data Box disks to either Windows- or Linux-based systems using USB or SATA connections.    

    |Setting|Value|
    |---|---|
    |Subscription| The subscription is automatically populated based on your earlier selection. |
    |Resource group| The resource group you selected previously. |
    |Import order name|Provide a friendly name to track the order.<br /> The name can have between 3 and 24 characters that can be letters, numbers, and hyphens. <br /> The name must start and end with a letter or a number. |
    |Number of disks per order| Enter the number of disks you would like to order. <br /> There can be a maximum of five disks per order  (1 disk = 7TB). |
    |Disk passkey| Supply the disk passkey if you check **Use custom key instead of Azure generated passkey**. <br /> Provide a 12-character to 32-character alphanumeric key that has at least one numeric and one special character. The allowed special characters are `@?_+`. <br /> You can choose to skip this option and use the Azure generated passkey to unlock your disks.|
    |Disk encryption type| Select between **Software (BitLocker) encryption** or **Hardware(Self-encrypted)** options. Hardware-encrypted disks require a SATA 3 connection and are only supported for Linux-based systems. |

    :::image type="content" alt-text="Screenshot of order details" source="media/data-box-disk-deploy-ordered/data-box-disk-order-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-order.png":::

1. On the **Data destination** screen, select the **Data destination** - either storage accounts or managed disks (or both).

    > [!CAUTION]
    > Blob data can be uploaded to the archive tier, but will need to be rehydrated before reading or modifying. Data copied to the archive tier must remain for at least 180 days or be subject to an early deletion charge. Archive tier is not supported for ZRS, GZRS, or RA-GZRS accounts.

    |Setting|Value|
    |---|---|
    |Data destination |Choose from storage account or managed disks or both.<br /> Based on the specified Azure region, select a storage account from the filtered list of an existing storage account. Data Box Disk can be linked with only one storage account.<br /> You can also create a new General-purpose v1, General-purpose v2, or Blob storage account.<br /> Storage accounts with virtual networks are supported. To allow Data Box service to work with secured storage accounts, enable the trusted services within the storage account network firewall settings. For more information, see how to Add Azure Data Box as a trusted service. <br /> To enable support for large file shares, select **Enable large file shares**. To enable the ability to move blob data to the archive tier, select **Enable copy to archive**. |
    |Destination Azure region| Select a region for your storage account. <br /> Currently, storage accounts in all regions in US, West and North Europe, Canada, and Australia are supported. |
    |Resource group| If using Data Box Disk to create managed disks from the on-premises VHDs, you need to provide the resource group.<br /> Create a new resource group if you intend to create managed disks from on-premises VHDs. Use an existing resource group only if it was created for Data Box Disk order for managed disk by Data Box service.<br /> Only one resource group is supported.|

    :::image type="content" alt-text="Screenshot of Data Box Disk data destination." source="media/data-box-disk-deploy-ordered/data-box-disk-order-destination-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-order-destination.png":::

    The storage account specified for managed disks is used as a staging storage account. The Data Box service uploads the VHDs to the staging storage account and then converts them into managed disks and moves to the resource groups. For more information, see Verify data upload to Azure.

    > [!NOTE]
    > Data Box supports copying only 1 MiB aligned, fixed-size `.vhd` files for creating managed disks. Dynamic VHDs, differencing VHDs, `.vmdk` or `.vhdx` files are not supported.
    >
    > If a page blob isn't successfully converted to a managed disk, it stays in the storage account and you're charged for storage.

1. Select **Next: Security>** to continue.

    The **Security** screen lets you use your own encryption key.

    All settings on the **Security** screen are optional. If you don't change any settings, the default settings apply.

1. If you want to use your own customer-managed key to protect the unlock passkey for your new resource, expand **Encryption type**.

    :::image type="content" alt-text="Screenshot of Data Box Disk encryption type." source="media/data-box-disk-deploy-ordered/data-box-disk-encryption-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-encryption.png":::

    Configuring a customer-managed key for your Azure Data Box Disk is optional. By default, Data Box uses a Microsoft managed key to protect the unlock passkey.

    A customer-managed key doesn't affect how data on the device is encrypted. The key is only used to encrypt the device unlock passkey.

    If you don't want to use a customer-managed key, skip to Step 14.

1. To use a customer-managed key, select **Customer managed key** as the key type. Then choose **Select a key vault and key**.

    :::image type="content" alt-text="Screenshot of Customer managed key selection." source="media/data-box-disk-deploy-ordered/data-box-disk-customer-key-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-customer-key.png":::

1. In the **Select key from Azure Key Vault** blade:

   * The **Subscription** is automatically populated.
   * For **Key vault**, you can select an existing key vault from the dropdown list.

    :::image type="content" alt-text="Screenshot of existing key vault." source="media/data-box-disk-deploy-ordered/data-box-disk-select-key-vault.png":::

    Or select **Create new key vault** if you want to create a new key vault.

    :::image type="content" alt-text="Screenshot of new key vault." source="media/data-box-disk-deploy-ordered/data-box-disk-create-new-key-vault-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-create-new-key-vault.png":::

    Then, on the **Create key vault** screen, enter the resource group and a key vault name. Ensure that **Soft delete** and **Purge protection** are enabled. Accept all other defaults, and select **Review + Create**.

    :::image type="content" alt-text="Screenshot of Create key vault blade." source="media/data-box-disk-deploy-ordered/data-box-disk-key-vault-blade-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-key-vault-blade.png":::

    Review the information for your key vault, and select **Create**. Wait for a couple minutes for key vault creation to complete.

    :::image type="content" alt-text="Screenshot of Review + create." source="media/data-box-disk-deploy-ordered/data-box-disk-create-key-vault-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-create-key-vault.png":::

1. The **Select a key** blade will display your selected key vault.

    :::image type="content" alt-text="Screenshot of new key vault 2." source="media/data-box-disk-deploy-ordered/data-box-disk-new-key-vault-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-new-key-vault.png":::

    If you want to create a new key, select **Create new key**. You must use an **RSA key**. The size can be 2048 or greater. Enter a name for your new key, accept the other defaults, and select **Create**.

    :::image type="content" alt-text="Screenshot of Create new key." source="media/data-box-disk-deploy-ordered/data-box-disk-new-key-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-new-key.png":::

    You're notified when the key has been created in your key vault. Your new key is selected on the **Select a key** blade.

1. Select the **Version** of the key to use, and then choose **Select**.

    :::image type="content" alt-text="Screenshot of key version." source="media/data-box-disk-deploy-ordered/data-box-disk-key-version-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-key-version.png":::

    If you want to create a new key version, select **Create new version**.

    :::image type="content" alt-text="Screenshot of new key version." source="media/data-box-disk-deploy-ordered/data-box-disk-new-key-version-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-new-key-version.png":::

    Choose settings for the new key version, and select **Create**.

    :::image type="content" alt-text="Screenshot of new key version settings." source="media/data-box-disk-deploy-ordered/data-box-disk-new-key-settings-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-new-key-settings.png":::

    The **Encryption type** settings on the **Security** screen show your key vault and key.

    :::image type="content" alt-text="Screenshot of encryption type settings." source="media/data-box-disk-deploy-ordered/data-box-disk-encryption-settings-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-encryption-settings.png":::

1. Select a user identity that you use to manage access to this resource. Choose **Select a user identity**. In the panel on the right, select the subscription and the managed identity to use. Then choose **Select**.

    A user-assigned managed identity is a stand-alone Azure resource that can be used to manage multiple resources. For more information, see Managed identity types.

    If you need to create a new managed identity, follow the guidance in Create, list, delete, or assign a role to a user-assigned managed identity using the Azure portal.

    :::image type="content" alt-text="Screenshot of user identity." source="media/data-box-disk-deploy-ordered/data-box-disk-user-identity-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-user-identity.png":::

    The user identity is shown in Encryption type settings.

    :::image type="content" alt-text="Screenshot of user identity 2." source="media/data-box-disk-deploy-ordered/data-box-disk-user-identity-2-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-user-identity-2.png":::

1. In the **Contact details** tab, select **Add address** and enter the address details. Select Validate address. The service validates the shipping address for service availability. If the service is available for the specified shipping address, you receive a notification to that effect.

    If you have chosen self-managed shipping, see [Use self-managed shipping](data-box-disk-portal-customer-managed-shipping.md).

    :::image type="content" alt-text="Screenshot of Data Box Disk contact details." source="media/data-box-disk-deploy-ordered/data-box-disk-contact-details-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-disk-contact-details.png":::

    Specify valid email addresses as the service sends email notifications regarding any updates to the order status to the specified email addresses.

    We recommend that you use a group email so that you continue to receive notifications if an admin in the group leaves.

1. Review the information in the **Review + Order** tab related to the order, contact, notification, and privacy terms. Check the box corresponding to the agreement to privacy terms.

1. Select **Order**. The order takes a few minutes to be created.

### [Azure CLI](#tab/azure-cli)

Use these Azure CLI commands to create a Data Box Disk job.

[!INCLUDE [azure-cli-prepare-your-environment-h3.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-h3.md)]

1. To create a Data Box Disk order, you need to associate it with a resource group and provide a storage account. If a new resource group is needed, use the [az group create](/cli/azure/group#az-group-create) command to create a resource group as shown in the following example:

   ```azurecli
   az group create --name databox-rg --location westus
   ```

1. As with the previous step, you can use the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command to create a storage account if necessary. The following example uses the name of the resource group created in the previous step:

   ```azurecli
   az storage account create --resource-group databox-rg --name databoxtestsa
   ```

1. Next, use the [az databox job create](/cli/azure/databox/job#az-databox-job-create) command to create a Data Box job with using the SKU parameter value `DataBoxDisk`. The following example uses the names of the resource group and storage account created in the previous steps:

   ```azurecli
   az databox job create --resource-group databox-rg --name databoxdisk-job --sku DataBoxDisk \
       --contact-name "Mark P. Daniels" --email-list markpdaniels@contoso.com \
       --phone=4085555555–-city Sunnyvale --street-address1 "1020 Enterprise Way" \
       --postal-code 94089 --country US --state-or-province CA --location westus \
       --storage-account databoxtestsa --expected-data-size 1
   ```

1. If needed, you can update the job using the [az databox job update](/cli/azure/databox/job#az-databox-job-update). The following example updates the contact information for a job named `databox-job`.

   ```azurecli
   az databox job update -g databox-rg --name databox-job \
      --contact-name "Larry Gene Holmes" --email-list larrygholmes@contoso.com
   ```

   The [az databox job show](/cli/azure/databox/job#az-databox-job-show) command allows you to display a job's information as shown in the following example:

   ```azurecli
   az databox job show --resource-group databox-rg --name databox-job
   ```

   To display all Data Box jobs for a particular resource group, use the [az databox job list]( /cli/azure/databox/job#az-databox-job-list) command as shown:

   ```azurecli
   az databox job list --resource-group databox-rg
   ```

   A job can be canceled and deleted by using the [az databox job cancel](/cli/azure/databox/job#az-databox-job-cancel) and [az databox job delete](/cli/azure/databox/job#az-databox-job-delete) commands, respectively. The following examples illustrate the use of these commands:

   ```azurecli
   az databox job cancel –resource-group databox-rg --name databox-job --reason "New cost center."
   az databox job delete –resource-group databox-rg --name databox-job
   ```

1. Finally, you can use the [az databox job list-credentials](/cli/azure/databox/job#az-databox-job-list-credentials) command to list the credentials for a particular Data Box job:

   ```azurecli
   az databox job list-credentials --resource-group "databox-rg" --name "databoxdisk-job"
   ```

After the order is created, the device is prepared for shipment.

---

## Track the order

After you place the order, you can track the status of the order from Azure portal. Go to your order and then go to **Overview** to view the status. The portal shows the job in **Ordered** state.

:::image type="content" alt-text="Data Box Disk status ordered." source="media/data-box-disk-deploy-ordered/data-box-portal-ordered-sml.png" lightbox="media/data-box-disk-deploy-ordered/data-box-portal-ordered.png":::

If the disks aren't available, you receive a notification. If the disks are available, Microsoft identifies the disks for shipment and prepares the disk package. During disk preparation, following actions occur:

* Disks are encrypted using AES-128 BitLocker encryption.  
* Disks are locked to prevent an unauthorized access to the disks.
* The passkey that unlocks the disks is generated during this process.

When the disk preparation is complete, the portal shows the order in **Processed** state.

Microsoft then prepares and dispatches your disks via a regional carrier. You receive a tracking number once the disks are shipped. The portal shows the order in **Dispatched** state. 

## Cancel the order

### [Portal](#tab/azure-portal)

To cancel this order using the Azure portal, navigate to the **Overview** section and select **Cancel** from the command bar.

You can only cancel and order while it's being processed for shipment. The order can't be canceled after processing is complete.

:::image type="content" alt-text="Cancel order." source="media/data-box-disk-deploy-ordered/cancel-order1-sml.png" lightbox="media/data-box-disk-deploy-ordered/cancel-order1.png":::

To delete a canceled order, go to **Overview** and select **Delete** from the command bar.

### [CLI](#tab/azure-cli)

 A job can be canceled using the Azure CLI. Using the [az databox job cancel](/cli/azure/databox/job#az-databox-job-cancel) and [az databox job delete](/cli/azure/databox/job#az-databox-job-delete) commands to cancel and delete the job, respectively. The following examples illustrate the use of these commands:

   ```azurecli
   az databox job cancel –resource-group databox-rg --name databox-job --reason "Billing to new cost center."
   az databox job delete –resource-group databox-rg --name databox-job
   ```

---

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
