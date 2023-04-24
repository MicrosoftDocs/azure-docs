---
title: How to share data
description: Learn how to share data with Microsoft Purview Data Sharing.
author: sidontha
ms.author: sidontha
ms.service: purview
ms.subservice: purview-data-share
ms.topic: how-to
ms.custom: references_regions
ms.date: 02/16/2023
---
# Share Azure Storage data in-place with Microsoft Purview Data Sharing (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

Microsoft Purview Data Sharing supports in-place data sharing from Azure Data Lake Storage (ADLS Gen2) to ADLS Gen2, and Blob storage account to Blob storage account. This article explains how to share data using Microsoft Purview.

>[!NOTE]
>This feature has been updated in February 2023, and permissions needed to view and manage Data Sharing in Microsoft Purview have changed.
>Now only Reader permissions are needed on the collection where the shared data is housed. Refer to [Microsoft Purview permissions](catalog-permissions.md) to learn more about the Microsoft Purview collection and roles.

## Prerequisites to share data

### Microsoft Purview prerequisites

* [A Microsoft Purview account](create-catalog-portal.md).
* A minimum of Data Reader role is needed on a Microsoft Purview collection to use data sharing in the governance portal. Refer to [Microsoft Purview permissions](catalog-permissions.md) to learn more about the Microsoft Purview collection and roles.
* To use the SDK, no Microsoft Purview permissions are needed.
* Your data recipient's Azure sign-in email address, or the object ID and tenant ID of the recipient application, that you'll use to send the invitation to receive a share. The recipient's email alias won't work.

### Azure Storage account prerequisites

* Your Azure subscription must be registered for the **AllowDataSharing** preview feature. Follow the below steps using Azure portal or PowerShell.

    # [Portal](#tab/azure-portal)
    1. In the [Azure portal](https://portal.azure.com), select your Azure subscription.
    1. From the left menu, select **Preview features** under *Settings*.
    1. Select **AllowDataSharing** and *Register*. 
    1. Refresh the *Preview features* screen to verify the *State* is **Registered**. It could take 15 minutes to 1 hour for registration to complete.
    1. In addition, to use data share for storage accounts in East US, East US2, North Europe, Southcentral US, West Central US, West Europe, West US, West US2: Select AllowDataSharingInHeroRegion and Register

    For more information, see [Register preview feature](../azure-resource-manager/management/preview-features.md?tabs=azure-portal#register-preview-feature).

    # [PowerShell](#tab/powershell)
    ```azurepowershell
    Set-AzContext -SubscriptionId [Your Azure subscription ID]
    ```
    ```azurepowershell
    Register-AzProviderFeature -FeatureName "AllowDataSharing" -ProviderNamespace "Microsoft.Storage"
    ```
    ```azurepowershell
    Get-AzProviderFeature -FeatureName "AllowDataSharing" -ProviderNamespace "Microsoft.Storage"   
    ```
     In addition, to use data share for storage accounts in East US, East US2, North Europe, Southcentral US, West Central US, West Europe, West US, West US2: 

    ```azurepowershell
    Register-AzProviderFeature -FeatureName "AllowDataSharingInHeroRegion" -ProviderNamespace "Microsoft.Storage"
    ```
    ```azurepowershell
    Get-AzProviderFeature -FeatureName "AllowDataSharingInHeroRegion" -ProviderNamespace "Microsoft.Storage"   
    ```
   The *RegistrationState* should be **Registered**. It could take 15 minutes to 1 hour for registration to complete. For more information, see [Register preview feature](../azure-resource-manager/management/preview-features.md?tabs=azure-portal#register-preview-feature).

[!INCLUDE [share-storage-configuration](includes/share-storage-configuration.md)]

* A source storage account **created after the registration step is completed**. Source storage account can be in a different Azure region from your Microsoft Purview account, but needs to follow the available configurations.

* You need the **Owner** or **Storage Blob Data Owner** role on the source storage account to be able to share data. You can find more details on the [ADLS Gen2](register-scan-adls-gen2.md#data-sharing) or [Blob storage](register-scan-azure-blob-storage-source.md#data-sharing) data source page.

* If the source storage account is in a different Azure subscription than the one for Microsoft Purview account, the Microsoft. Purview resource provider needs to be registered in the Azure subscription where the Storage account is located. It's automatically registered at the time of share provider adding an asset if the user has permission to do the `/register/action` operation and therefore, Contributor or Owner roles to the subscription where the Storage account is located.
This registration is only needed the first time when sharing or receiving data into a storage account in the Azure subscription.

* A storage account needs to be registered in the collection to create a share using the Microsoft Purview compliance portal experience. For instructions to register, see the [ADLS Gen2](register-scan-adls-gen2.md) or [Blob storage](register-scan-azure-blob-storage-source.md) data source pages. This step isn't required to use the SDK.

## Create a share

1. You can create a share by starting from **Data Map**

    Open the [Microsoft Purview governance portal](https://web.purview.azure.com/). Select the **Data Map** icon from the left navigation. Then select **Shares**.  Select **+New Share**.

   :::image type="content" source="./media/how-to-share-data/create-share-datamap-new-share.png" alt-text="Screenshot that shows the Microsoft Purview governance portal Data Map with Data Map, Shares and New Share highlighted." border="true":::

    Select the Storage account type and the Storage account you want to share data from. Then select **Continue**. 

   :::image type="content" source="./media/how-to-share-data/create-share-datamap-select-type-account.png" alt-text="Screenshot that shows the New Share creation step with Type and Storage account options highlighted." border="true":::

1. You can create a share by starting from **Data Catalog**
 
    Within the [Microsoft Purview governance portal](https://web.purview.azure.com/), find the Azure Storage or Azure Data Lake Storage (ADLS) Gen 2 data asset you would like to share data from using either the [data catalog search](how-to-search-catalog.md) or [browse](how-to-browse-catalog.md).

   :::image type="content" source="./media/how-to-share-data/search-or-browse.png" alt-text="Screenshot that shows the Microsoft Purview governance portal homepage with the search and browse options highlighted." border="true":::

    Once you have found your data asset, select the **Data Share** button.

   :::image type="content" source="./media/how-to-share-data/select-data-share-inline.png" alt-text="Screenshot of a data asset in the Microsoft Purview governance portal with the Data Share button highlighted." border="true" lightbox="./media/how-to-share-data/select-data-share-large.png":::

    Select **+New Share**.

   :::image type="content" source="./media/how-to-share-data/select-new-share-inline.png" alt-text="Screenshot of the Data Share management window with the New Share button highlighted." border="true" lightbox="./media/how-to-share-data/select-new-share-large.png":::

1. Specify a name and a description of share contents (optional). Then select **Continue**.

   :::image type="content" source="./media/how-to-share-data/create-share-details-inline.png" alt-text="Screenshot showing create share and enter details window, with the Continue button highlighted." border="true" lightbox="./media/how-to-share-data/create-share-details-large.png":::

1. Search for and add all the assets you'd like to share out at the container, folder, and file level, and then select **Continue**.

   > [!IMPORTANT]
   > Only containers, files, and folders that belong to the current Blob or ADLSGen2 Storage account can be added to the share.

   :::image type="content" source="./media/how-to-share-data/add-asset.png" alt-text="Screenshot showing the add assets window, with a file and a folder selected to share." border="true":::

1. You can edit the display names the shared data will have, if you like. Then select **Continue**.

   :::image type="content" source="./media/how-to-share-data/provide-display-names.png" alt-text="Screenshot showing the second add assets window with the display names unchanged." border="true":::

1. Select **Add Recipient** and select **User** or **App**. 

    To share data to a user, select **User**, then enter the Azure sign-in email address of who you want to share data with. By default, the option to enter email address of user is shown.

    :::image type="content" source="./media/how-to-share-data/create-share-add-user-recipient-inline.png" alt-text="Screenshot showing the add recipients page, with the add recipient button highlighted, default user email option shown." border="true" lightbox="./media/how-to-share-data/create-share-add-user-recipient-large.png":::  

    To to share data with a service principal, select **App**. Enter the object ID and tenant ID of the recipient you want to share data with.

    :::image type="content" source="./media/how-to-share-data/create-share-add-app-recipient-inline.png" alt-text="Screenshot showing the add app recipients page, with the add app option and required fields highlighted." border="true" lightbox="./media/how-to-share-data/create-share-add-app-recipient-large.png":::  

1. Select **Create and Share**. Optionally, you can specify an **Expiration date** for when to terminate the share. You can share the same data with multiple recipients by selecting **Add Recipient** multiple times.

You've now created your share. The recipients of your share will receive an invitation and they can view the share invitation in their Microsoft Purview account.

When a share is created, a new asset of type sent share is ingested into the Microsoft Purview catalog, in the same collection as the storage account from which you created the share. You can search for it like any other asset in the data catalog.

You can also track lineage for data shared using Microsoft Purview. See, [Microsoft Purview Data Sharing lineage](how-to-lineage-purview-data-sharing.md) to learn more about share assets and data sharing lineage.

> [!NOTE]
> Shares created using the SDK without registering the storage account with Microsoft Purview will not be ingested into the catalog. User can register their storage account if desired. If a storage account is un-registered or re-registered to a different collection, share assets of that storage account continue to be in the initial collection.

## Update a sent share

Once a share is created, you can update description, assets, and recipients.

> [!NOTE]
> If you only have the **Reader** role on the source storage account, you will be able to view list of sent shares and received shares but not edit. You can find more details on the [ADLS Gen2](register-scan-adls-gen2.md#data-sharing) or [Blob storage](register-scan-azure-blob-storage-source.md#data-sharing) data source page.

You can find your sent shares one of two ways:

* Access the blob storage or ADLS Gen2 asset where the data was shared from in the data catalog. Open it, then select **Data Share**. There you're able to see all the shares for that asset. Select a share, and then select the **Edit** option.

   :::image type="content" source="./media/how-to-share-data/select-data-share-inline.png" alt-text="Screenshot of a data asset in the Microsoft Purview governance portal with the data share button highlighted." border="true" lightbox="./media/how-to-share-data/select-data-share-large.png":::

   :::image type="content" source="./media/how-to-share-data/select-share-to-edit.png" alt-text="Screenshot of the Manage data shares page with a share selected and the edit button highlighted." border="true":::

* For shares that you sent, you can find them in the **Shares** menu in the Microsoft Purview Data Map. There you're able to see all the shares you have sent. Select a share, and then select the **Edit** option.

   :::image type="content" source="./media/how-to-share-data/select-shares-in-data-map-inline.png" alt-text="Screenshot of the Data Shares menu in the Microsoft Purview Data Map." border="true" lightbox="./media/how-to-share-data/select-shares-in-data-map.png":::

From any of these places you can:

- [Edit share details](#edit-details)
- [Edit shared assets](#edit-assets)
- [Edit share recipients](#edit-recipients)
- [Delete your share](#delete-share)

### Edit details

On the **Details** tab of the [edit share page](#update-a-sent-share), you can update the share name and description.
Save any changes by selecting **Save**.

:::image type="content" source="./media/how-to-share-data/edit-details-inline.png" alt-text="Screenshot of the Details tab of the edit page, with the save button highlighted." border="true" lightbox="./media/how-to-share-data/edit-details-large.png":::

### Edit assets

On the **Asset** tab of the [edit share page](#update-a-sent-share) you can see all the shared files and folders.

You can **remove** any containers, files, or folders from the share by selecting the delete button in the asset's row however you can't remove all the assets of a sent share.

:::image type="content" source="./media/how-to-share-data/remove-asset.png" alt-text="Screenshot of the Asset tab of the edit page, with the delete button highlighted next to an asset." border="true":::

You can **add new assets** by selecting the **Edit** button and then searching for and selecting any other containers, files, and folders in the asset that you would like to add.

:::image type="content" source="./media/how-to-share-data/edit-assets.png" alt-text="Screenshot of the Asset tab of the edit page, with the edit button highlighted." border="true":::

Once you've selected your assets, select **Add**, and you'll see your new asset in the Asset tab.

Save all your changes by selecting the **Save** button.

### Edit recipients

On the **Recipients** tab of the [edit share page](#update-a-sent-share) you can see all the users and groups that are receiving your shares, their status, and the expiration date for their share.

Here are what each of the recipient statuses mean:

| Status | Meaning |
|---|---|
|Attached | The share has been accepted and the recipient has access to the shared data. |
|Detached | The recipient hasn't accepted the invitation or is no longer active. They aren't receiving the share. |

You can **remove or delete recipients** by either selecting the delete button on the recipient's row, or selecting multiple recipients and then selecting the **Delete recipients** button at the top of the page.

:::image type="content" source="./media/how-to-share-data/delete-recipients.png" alt-text="Screenshot of the Recipients tab of the edit page, with a recipient selected, and both delete options highlighted." border="true":::

You can **add recipients** by selecting the **Add recipients** button.

:::image type="content" source="./media/how-to-share-data/add-recipients.png" alt-text="Screenshot of the Recipients tab of the edit page showing the Add recipients button highlighted." border="true":::

Select **Add Recipient** again and select **User** or **App**.

To share data to a user, select **User**, then enter the Azure sign-in email address of who you want to share data with. By default, the option to enter email address of user is shown.

:::image type="content" source="./media/how-to-share-data/create-share-add-user-recipient-inline.png" alt-text="Screenshot showing the edit recipients page  with the add recipient button highlighted, default user email option shown." border="true" lightbox="./media/how-to-share-data/create-share-add-user-recipient-large.png":::  

To to share data with a service principal, select **App**. Enter the object ID and tenant ID of the recipient you want to share data with.

:::image type="content" source="./media/how-to-share-data/create-share-add-app-recipient-inline.png" alt-text="Screenshot showing the edit app recipients page, with the add app option and required fields highlighted." border="true" lightbox="./media/how-to-share-data/create-share-add-app-recipient-large.png":::  

Optionally, you can specify an **Expiration date** for when to terminate the share. You can share the same data with multiple recipients by clicking on **Add Recipient** multiple times.

When you're finished, select the **Add recipients** confirmation button at the bottom of the page.

Save all your changes by selecting the **Save** button.

### Delete share

To delete your share, on any tab in the [edit share page](#update-a-sent-share), select the **Delete share** button.

:::image type="content" source="./media/how-to-share-data/delete-share.png" alt-text="Screenshot showing the edit share page, with the delete share button highlighted." border="true"::: 

Confirm that you would like to delete in the pop-up window and the share will be removed.

## Troubleshoot

Here are some common issues for sharing data and how to troubleshoot.

### Can't create Microsoft Purview account

If you're getting an error related to *quota* when creating a Microsoft Purview account, it means your organization has exceeded [Microsoft Purview service limit](how-to-manage-quotas.md). If you require an increase in limit, contact support.

### Can't find my Storage account asset in the Catalog

There are a couple possible reasons:

* The data source isn't registered in Microsoft Purview. Refer to the registration steps for [Blob Storage](register-scan-azure-blob-storage-source.md) and [ADLSGen2](register-scan-adls-gen2.md) respectively. Performing a scan isn't necessary.
* Data source is registered to a Microsoft Purview collection that you don't have a minimum of Data Reader permission to. Refer to [Microsoft Purview catalog permissions](catalog-permissions.md) and reach out to your collection admin for access.

### Can't create shares or edit shares

* You don't have permission to the data store where you want to share data from. Check the [prerequisites](#prerequisites-to-share-data) for required data store permissions.

### Can't view list of shares in the storage account asset

 * You don't have enough permissions the data store that you want to see shares of. You need a minimum of **Reader** role on the source storage account to see a read-only view of sent shares and received shares. You can find more details on the [ADLS Gen2](register-scan-adls-gen2.md#data-sharing) or [Blob storage](register-scan-azure-blob-storage-source.md#data-sharing) data source page.

## Next steps

* [How to receive share](how-to-receive-share.md)
* [FAQ for data sharing](how-to-data-share-faq.md)
* [REST API reference](/rest/api/purview/)
* Discover share assets in Catalog
* See data sharing lineage
