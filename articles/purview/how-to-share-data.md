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
* If the source storage account is in a different Azure subscription than the one for Microsoft Purview account, the Microsoft.Purview resource provider needs to be registered in the Azure subscription where the Storage account is located. It is automatically registered at the time of share provider adding an asset if the user has permission to do the `/register/action` operation and therefore, Contributor or Owner roles to the subscription where the Storage account is located.
This registration is only needed the first time when sharing or receiving data into a storage account in the Azure subscription.

## Create a share

1. Within the [Microsoft Purview governance portal](https://web.purview.azure.com/), select the **Data share** icon from the left navigation, and then **Create a new share**.

   :::image type="content" source="./media/how-to-share-data/create-share.png" alt-text="Screenshot showing the data share overview page in the Microsoft Purview governance portal." border="true":::

1. Provide the details for your share. Specify a name, share type, description of share contents (optional), and collection. Then select **Continue**.

    If you don't see a collection from the drop-down list, it means you don't have Data Share Contributor role access to any Microsoft Purview collection to share data. Contact your Collection Admin to grant you access. 

   :::image type="content" source="./media/how-to-share-data/create-share-details.png" alt-text="Screenshot showing create share and enter details window, with the Continue button highlighted." border="true":::

1. To select data to share, select **Add Assets**. 

   :::image type="content" source="./media/how-to-share-data/create-share-add-asset.png" alt-text="Screenshot showing the add assets button highlighted in the new share window." border="true":::

1. Select an asset type and a storage account that has already been registered with Microsoft Purview. Select **Continue**. 

    If you don't see a storage account from the drop-down list, select on the **Register a new source to share from** link below to register your storage account. Azure resource needs to be registered with Microsoft Purview before you can share data from that resource. Your storage account needs to be registered in the same collection as the share. For instructions to register, see the [ADLS Gen2](register-scan-adls-gen2.md) or [Blob storage](register-scan-azure-blob-storage-source.md) data source pages.

    :::image type="content" source="./media/how-to-share-data/create-share-select-source.png" alt-text="Screenshot showing select source, with an A D L S gen 2 account selected and continue highlighted." border="true":::

1. Browse your storage account hierarchy and select (check) the objects you want to share. Then select **Add**. 

    > [!NOTE]
    > When sharing from a storage account, only files and folders are currently supported. Sharing from container isn't currently supported. 

    :::image type="content" source="./media/how-to-share-data/create-share-select-contents.png" alt-text="Screenshot showing the add assets page, with several folders selected to share and the add button highlighted." border="true"::: 

1. Review the assets selected. Optionally, edit **Name** and **Display name** which the recipient will see. Select **Continue**.
 
    :::image type="content" source="./media/how-to-share-data/create-share-edit-asset-name.png" alt-text="Screenshot showing the add assets second page, with the asset paths listed and the display name bars available to edit." border="true":::  

1. Select **Add Recipient** and select **User**. Enter the Azure log in email address of who you want to share data with. By default, the option to enter email address of user is shown.

:::image type="content" source="./media/how-to-share-data/create-share-add-user-recipient.png" alt-text="Screenshot showing the add recipients page, with the add recipient button highlighted, default user email option shown." border="true":::  
    
Select **Add Recipient** and select **App** if you want to share data with a service principal. Enter the object ID and tenant ID of the recipient you want to share data with.

:::image type="content" source="./media/how-to-share-data/create-share-add-app-recipient.png" alt-text="Screenshot showing the add app recipients page, with the add app option and required fields highlighted." border="true":::  

Select **Create and Share**. Optionally, you can specify an **Expiration date** for when to terminate the share. You can share the same data with multiple recipients by clicking on **Add Recipient** multiple times. 

You've now created your share. The recipients of your share will receive an invitation and they can view the pending share in their Microsoft Purview account. 

## Update a sent share

Once a share is created, you can update description, assets and recipients. 

### Update asset

You can edit or delete asset in a sent share. Each sent share can include a maximum of one source storage account.

To edit an asset, first select the *share*, and then select **Assets** tab. Select the **Edit** action next to the asset name. You can now add or remove files and folders from the *share*. Once you confirm your selection, it will take a few minutes for update to complete and recipients will see the updated list of files and folders in their target storage account. 

:::image type="content" source="./media/how-to-share-data/edit-share-edit-asset.png" alt-text="Screenshot showing a list of in place shares, with the edit pencil button highlighted and selected next to the share." border="true":::  

To delete the asset, first select the *share*, and then select **Assets** tab. Select the **Delete** action next to the asset name. Deleting an asset can take a few minutes.

:::image type="content" source="./media/how-to-share-data/edit-share-delete-asset.png" alt-text="Screenshot showing a list of in place shares, with the delete trashcan button highlighted and selected next to the share." border="true":::

### Update recipients

You can add more recipients, view status of your existing recipients, or revoke access.

To share the same data with more recipients, first select the share, and then select **Add recipient**.

:::image type="content" source="./media/how-to-share-data/edit-share-add-recipient.png" alt-text="Screenshot of an in-place share page, that you can find by selecting a specific sent share, with the add recipient button selected in the top menu." border="true":::

To view status of existing recipients, first select the share, and then select **Recipients** tab. You can select **Accepted**, **Pending**, and **Rejected** to view status of these recipients. If you want to terminate,  access to a specific recipient, you can revoke access to a recipient in *accepted* state by locating the recipient and selecting **Revoke** action next to it. 

:::image type="content" source="./media/how-to-share-data/edit-share-revoke.png" alt-text="Screenshot the recipients list of a sent data share with the revoke button highlighted next to a user name." border="true":::

Once access is revoked, you can reinstate it by locating the recipient and selecting **Reinstate** action next to it. 

:::image type="content" source="./media/how-to-share-data/edit-share-reinstate.png" alt-text="Screenshot the recipients list of a sent data share with the reinstate button highlighted next to a user name." border="true":::

When a recipient is in *pending* state, you can resend the invitation email. You can also delete it by locating the recipient and selecting **Delete** next to it. 

:::image type="content" source="./media/how-to-share-data/edit-share-delete-recipient.png" alt-text="Screenshot the pending recipients list of a sent data share with the delete trashcan button highlighted next to a user name." border="true":::

## Delete a sent share

To delete a *sent share*, select the share and then select **Delete**.

:::image type="content" source="./media/how-to-share-data/delete-sent-share.png" alt-text="Screenshot showing the delete option highlighted with one recipient selected from the menu." border="true":::

Deleting a sent share will delete the share and revoke access to all the existing recipients. Deleting a sent share can take a few minutes.

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
