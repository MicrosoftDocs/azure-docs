---
title: How to share data
description: Learn how to share data with Microsoft Purview Data Sharing.
author: jifems
ms.author: jife
ms.service: purview
ms.subservice: purview-data-share
ms.topic: how-to
ms.custom: references_regions
ms.date: 06/28/2022
---
# Share Azure Storage data in-place with Microsoft Purview Data Sharing (preview)

Microsoft Purview Data Sharing supports in-place data sharing from Azure Data Lake Storage (ADLS Gen2) to ADLS Gen2, and Blob storage account to Blob storage account. This article explains how to share data using Microsoft Purview.

For an overview of how data sharing works, watch this short [demo](https://aka.ms/purview-data-share/overview-demo).

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

## Prerequisites to share data

### Microsoft Purview prerequisites

* [A Microsoft Purview account](create-catalog-portal.md). 
* **Data Share Contributor** roles to a Purview collection. If you created the Microsoft Purview account, you're automatically assigned this role to the root collection. Refer to [Microsoft Purview permissions](catalog-permissions.md) to learn more about the Microsoft Purview collection and roles.
* Your data recipient's Azure sign-in email address, which you'll use to send the invitation to receive a share. The recipient's email alias won't work.

### Azure Storage account prerequisites

* Your Azure subscription must be registered for the **AllowDataSharing** preview feature. Follow the below steps using Azure portal or PowerShell. 

    # [Portal](#tab/azure-portal)
    1. In the [Azure portal](https://portal.azure.com), select your Azure subscription.
    1. From the left menu, select **Preview features** under *Settings*.
    1. Select **AllowDataSharing** and *Register*. 
    1. Refresh the *Preview features* screen to verify the *State* is **Registered**. It could take 15 minutes to 1 hour for registration to complete.

    For more information, see [Register preview feature](../azure-resource-manager/management/preview-features.md?tabs=azure-portal#register-preview-feature).

    # [PowerShell](#tab/powershell)
    ```azurepowershell
    Set-AzContext -SubscriptionId [Your Azure subscription ID]
    ```
    ```azurepowershell
    Register-AzProviderFeature -FeatureName "AllowDataSharing" -ProviderNamespace "Microsoft.Storage"​
    ```
    ```azurepowershell
    Get-AzProviderFeature -FeatureName "AllowDataSharing" -ProviderNamespace "Microsoft.Storage"   
    ```
    The *RegistrationState* should be **Registered**. It could take 15 minutes to 1 hour for registration to complete. For more information, see [Register preview feature](../azure-resource-manager/management/preview-features.md?tabs=azure-portal#register-preview-feature).

* A source storage account **created after the registration step is completed**. Source storage account can be in a different Azure region from your Microsoft Purview account, but needs to follow the configurations below:

    > [!NOTE]
    > The following are supported storage account configurations:
    >
    > - Azure regions: Canada Central, Canada East, UK South, UK West, Australia East, Japan East, Korea South, and South Africa North 
    > - Performance: Standard
    > - Redundancy options: LRS, GRS, RA-GRS

* You need the **Owner** or **Storage Blob Data Owner** role on the source storage account to be able to share data. You can find more details on the [ADLS Gen2](register-scan-adls-gen2.md#data-sharing) or [Blob storage](register-scan-azure-blob-storage-source.md#data-sharing) data source page.
* If the source storage account is in a different Azure subscription than the one for Microsoft Purview account, the Microsoft. Purview resource provider needs to be registered in the Azure subscription where the Storage account is located. It's automatically registered at the time of share provider adding an asset if the user has permission to do the `/register/action` operation and therefore, Contributor or Owner roles to the subscription where the Storage account is located.
This registration is only needed the first time when sharing or receiving data into a storage account in the Azure subscription.

## Create a share

1. Within the [Microsoft Purview governance portal](https://web.purview.azure.com/), find the Azure Storage or Azure Data Lake Storage (ADLS) Gen 2 data asset you would like to share using either the [data catalog search](how-to-search-catalog.md) or [browse](how-to-browse-catalog.md).

   :::image type="content" source="./media/how-to-share-data/search-or-browse.png" alt-text="The Microsoft Purview governance portal homepage with the search and browse options highlighted." border="true":::

1. Once you have found your data asset, select the **Data Share** drop down, and then select **+New Share**

   :::image type="content" source="./media/how-to-share-data/select-data-share.png" alt-text="Screenshot of a data asset in the Microsoft Purview governance portal with the Data Share button highlighted." border="true":::

1. Specify a name and a description of share contents (optional). Then select **Continue**.

   :::image type="content" source="./media/how-to-share-data/create-share-details.png" alt-text="Screenshot showing create share and enter details window, with the Continue button highlighted." border="true":::

1. Search for and add all the assets you'd like to share out at the folder and file level, and then select **Continue**.

   :::image type="content" source="./media/how-to-share-data/add-asset.png" alt-text="Screenshot showing the add assets window, with a file and a folder selected to share." border="true":::

1. You can edit the display names the shared data will have, if you like. Then select **Continue**.

   :::image type="content" source="./media/how-to-share-data/provide-display-names.png" alt-text="Screenshot showing the second add assets window with the display names unchanged." border="true":::

1. Select **Add Recipient** and select **User** or **App**. 

    To share data to a user, select **User**, then enter the Azure login email address of who you want to share data with. By default, the option to enter email address of user is shown.

    :::image type="content" source="./media/how-to-share-data/create-share-add-user-recipient.png" alt-text="Screenshot showing the add recipients page, with the add recipient button highlighted, default user email option shown." border="true":::  

    To to share data with a service principal, select **App**. Enter the object ID and tenant ID of the recipient you want to share data with.

    :::image type="content" source="./media/how-to-share-data/create-share-add-app-recipient.png" alt-text="Screenshot showing the add app recipients page, with the add app option and required fields highlighted." border="true":::  

1. Select **Create and Share**. Optionally, you can specify an **Expiration date** for when to terminate the share. You can share the same data with multiple recipients by clicking on **Add Recipient** multiple times. 

You've now created your share. The recipients of your share will receive an invitation and they can view the pending share in their Microsoft Purview account. 

## Update a sent share

Once a share is created, you can update description, assets and recipients.

You'll do this from the asset, just like when you created the data share.

Search for your data asset in the data catalog, open it, then select **Data Share** and **Manage data shares**. There you'll be able to see all the shares for that asset.

:::image type="content" source="./media/how-to-share-data/manage-data-shares.png" alt-text="Screenshot of a data asset in the Microsoft Purview governance portal with the Manage data shares button highlighted." border="true":::  

Select a share, and then select the **Edit** option.

:::image type="content" source="./media/how-to-share-data/select-share-to-edit.png" alt-text="Screenshot of the Manage data shares page with a share selected and the edit button highlighted." border="true":::

From here you can:

- [Edit details](#edit-details)
- [Edit assets](#edit-assets)
- [Edit recipients](#edit-recipients)
- [Delete your share](#delete-share)

### Edit details

On the **Details** tab of the [edit share page](#update-a-sent-share), you can update the share name and description.
Save any changes by selecting **Save**.

:::image type="content" source="./media/how-to-share-data/edit-details.png" alt-text="Screenshot of the Details tab of the edit page, with the save button highlighted." border="true":::

### Edit assets

On the **Asset** tab of the [edit share page](#update-a-sent-share) you can see all the shared files and folders.

You can **remove** any files or folders from the share by selecting the delete button in the asset's row.

:::image type="content" source="./media/how-to-share-data/remove-asset.png" alt-text="Screenshot of the Asset tab of the edit page, with the delete button highlighted next to an asset." border="true":::

You can **add new assets** by selecting the **Edit** button and then searching for and selecting any other files and folders in the asset that you would like to add.

:::image type="content" source="./media/how-to-share-data/edit-assets.png" alt-text="Screenshot of the Asset tab of the edit page, with the edit button highlighted." border="true":::

Once you've selected your assets, select **Add**, and then you'll see your new asset in the Asset tab.

Save all your changes by selecting the **Save** button.

### Edit recipients

On the **Recipients** tab of the [edit share page](#update-a-sent-share) you can see all the users and groups that are receiving your shares, their status, and the expiration date for their share.

Here are what each of the recipient statuses mean:

| Status | Meaning |
|---|---|
|Active | The share has been accepted and the recipient has access to the shared data. |
|Detached | The recipient hasn't accepted the invitation or is no longer active. They aren't receiving the share. |
|Expired | The share has expired. You'll need to reshare to this recipient if you want to continue sharing data. |

You can **remove or delete recipients** by either selecting the delete button on the recipient's row, or selecting multiple recipients and then selecting the **Delete recipients** button at the top of the page.

:::image type="content" source="./media/how-to-share-data/delete-recipients.png" alt-text="Screenshot of the Recipients tab of the edit page, with a recipient selected, and both delete options highlighted." border="true":::

You can **add recipients** by selecting the **Add recipients** button.

:::image type="content" source="./media/how-to-share-data/add-recipients.png" alt-text="Screenshot of the Recipients tab of the edit page showing the Add recipients button highlighted." border="true":::

Select **Add Recipient** again and select **User** or **App**"

To share data to a user, select **User**, then enter the Azure login email address of who you want to share data with. By default, the option to enter email address of user is shown.

:::image type="content" source="./media/how-to-share-data/create-share-add-user-recipient.png" alt-text="Screenshot showing the edit recipients page  with the add recipient button highlighted, default user email option shown." border="true":::  

To to share data with a service principal, select **App**. Enter the object ID and tenant ID of the recipient you want to share data with.

:::image type="content" source="./media/how-to-share-data/create-share-add-app-recipient.png" alt-text="Screenshot showing the edit app recipients page, with the add app option and required fields highlighted." border="true":::  

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

### Both sent shares and received shares are disabled

If both *sent shares* and *received shares* are disabled in the navigation, you don't have **Data Share Contributor** role on any collections in this Microsoft Purview account. 

### Can't select a collection when creating a share or register a data source

If you can't select a collection when creating a share or register a data source, you don't have proper permission to the collection. You need to have **Data Share Contributor** role to a Microsoft Purview collection in order to register data source and add asset to a share.

### Issue add or update asset

If your storage account isn't listed for you to select, it's likely due to the following reasons:

* The storage account isn't supported. Microsoft Purview Data Sharing only [supports storage accounts with specific configurations](#azure-storage-account-prerequisites).
* You don't have **Data Share Contributor** role to the collection where the storage account is registered in. Data Share Contributor role is required to view the list of registered storage account in a collection and share data.

If you failed to add or update asset, it's likely due to the following reasons:

* Permission issue to the data store where you want to share data from. Check [Prerequisite](#prerequisites-to-share-data) for required data store permissions.
* The share and source data store don't belong to the same Microsoft Purview collection. In order to share data from a data store, the share and source data store need to belong to the same Microsoft Purview collection.
* You tried to share data from a *storage container*. Sharing from container isn't currently supported. You can select all files and folders within the container to share.
* Exceeding limit. Source storage account can support up to 20 targets, and target storage account can support up to 100 sources. If you require an increase in limit, contact Support.

### Failed to reinstate a recipient

After successfully revoking access to a recipient, you'll need to wait for a minute before reinstating the recipient.

## Next steps

* [How to receive share](how-to-receive-share.md)
* [FAQ for data sharing](how-to-data-share-faq.md)
* [REST API reference](/rest/api/purview/)
