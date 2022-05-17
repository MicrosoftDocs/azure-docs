---
title: Quick start on data sharing
description: Learn how to share and receive data with Purview Data Share
author: jifems
ms.author: jife
ms.service: purview
ms.topic: quickstart
ms.custom: references_regions
ms.date: 05/17/2022
---
# Quick start: Share Azure Storage data in-place and receive share with Microsoft Purview Data Sharing (preview)

This article provides a quick start guide on how to share data and receive share from Azure Data Lake Storage (ADLS Gen2) or Blob storage account. For an overview of how data sharing works, watch this short [demo](https://aka.ms/purview-data-share/overview-demo)

## Prerequisites

### Purview prerequisites

* [A Purview account](create-catalog-portal.md). You can also use two Purview accounts, one for data provider and one for data consumer. 
* Your recipient's Azure sign-in email address which you can use to send the invitation to. The recipient's email alias won't work.

### Storage account prerequisites

* Your Azure subscription must be registered for the **AllowDataSharing** preview feature. Follow the below steps using Azure portal or PowerShell. 

    # [Portal](#tab/azure-portal)
    1. In Azure portal, select your Azure subscription which you will use to create the source and target storage account.
    1. From the left menu, select **Preview features** under *Settings*.
    1. Select **AllowDataSharing** and *Register*. 
    1. Refresh the *Preview features* screen to verify the *State* is **Registered**.

    For additional details, refer to [Register preview feature](../azure-resource-manager/management/preview-features.md?tabs=azure-portal#register-preview-feature).

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
    The *RegistrationState* should be **Registered**. For additional details, refer to [Register preview feature](../azure-resource-manager/management/preview-features.md?tabs=azure-portal#register-preview-feature).

* Source and target storage accounts created after the registration step is completed. 
* Both storage accounts must be in the same Azure region. Your storage accounts can be in a different Azure region from your Purview account.
    > [!NOTE]
    > The following are supported storage account configurations:
    >
    > - Azure regions: Canada Central, Canada East, UK South, UK West, Australia East, Japan East, Korea South, and South Africa North 
    > - Performance: Standard
    > - Redundancy options: LRS, GRS, RA-GRS

* If the storage accounts are in an Azure subscription different than Purview account, [register the Microsoft.Purview resource provider](../azure-resource-manager/management/resource-providers-and-types.md) in the Azure subscription where the storage accounts are located.
* Latest version of the storage SDK, PowerShell, CLI and Azure Storage Explorer. Storage REST API version must be February 2020 or later. 

### Required roles
Below are required roles for sharing data and receiving shares.

| | Storage Account Roles | Purview Collection Roles |
|:--- |:--- |:--- |
| **Data Provider** |Owner OR Blob Storage Data Owner|Data Share Contributor|
| **Data Consumer** |Contributor OR Owner OR Blob Storage Data Contributor OR Blob Storage Data Owner|Data Share Contributor|

Note: If you created the Purview account, you are automatically assigned all the roles to the root collection. Refer to [Azure Purview permissions](catalog-permissions.md) to learn more about the Purview collection and roles.

## Create a share
1. Within Microsoft Purview governance portal, select **Data Share** icon from the left navigation, and then **Create a new share**.

    ![Screenshot showing the data share overview.](./media/how-to-share-data/create-share.png "Data share overview.") 

1. Provide the details for your share. Specify a name, share type, description of share contents (optional), and collection. Then select **Continue**.

    Note: If you don't see a collection from the drop-down list, it means you don't have Data Share Contributor role access to any Purview collection to share data. Contact your Collection Admin to grant you access. 

    ![Screenshot showing create share and enter details.](./media/how-to-share-data/create-share-details.png "Create share and enter details.") 

1. To add assets to your share, select **Add Assets**. 

    ![Screenshot showing add assets.](./media/how-to-share-data/create-share-add-asset.png "Add assets.") 

1. Select an asset type, and a storage account that has already been registered with Purview. Select **Continue**. 

    If you do not see a storage account from the drop down list, click on the **Register a new source to share from** link below to register your storage account. Azure resource needs to be registered with Purview before you can share data from that resource. Your storage account needs to be registered in the same collection as the share. 

    ![Screenshot showing select source.](./media/how-to-share-data/create-share-select-source.png "Select source.")  

1. Browse your storage account hierarchy and select (check) the objects you want to share. Then select **Add**. 

    > [!NOTE]
    > When sharing from a storage account, only files and folders are currently supported. Sharing from container isn't currently supported. 

    ![Screenshot showing select objects to share.](./media/how-to-share-data/create-share-select-contents.png "Select objects to share.")   

1. Review the assets selected. Optionally, edit **Name** and **Display name** which the recipient will see. Select **Continue**.

    ![Screenshot showing edit asset name and display name.](./media/how-to-share-data/create-share-edit-asset-name.png "Edit asset name and display name.")     

1. Select **Add Recipient**. Enter the Azure login email address of who you want to share data with. Optionally, specify an expiration date for when to terminate the share. Select **Create and Share**. 
    
    You can share the same data with multiple recipients by clicking on **Add Recipient** multiple times. 

    ![Screenshot showing add recipients.](./media/how-to-share-data/create-share-add-recipient.png "Add recipients.")   

You have now created your share. The recipients of your share will receive an invitation and they can view the pending share in their Purview account.

## Receive share

1. You can view pending share in any Purview account. Select a Purview account you want to use to receive the share, and open Microsoft Purview governance portal. Select **Data Share** icon from the left navigation. Then select **pending received share**. If you received an email invitation, you can click on the **View pending share** link in the email to select a Purview account. 

    If you're a guest user of a tenant, you'll be asked to verify your email address for the tenant prior to viewing pending received share for the first time. Once verified, it's valid for 12 months.

    ![Screenshot showing pending received share.](./media/how-to-receive-share/receive-share-invitation.png "Pending receive share.") 

1. Select name of the pending share you want to view. 

    ![Screenshot showing how to select pending received share.](./media/how-to-receive-share/receive-share-select-invitation.png "Select pending receive share.") 


1. Specify a **Received share name** and a collection. Select **Accept and configure**. If you do not want to accept the invitation, select *Reject*.
 
    ![Screenshot showing accept pending share.](./media/how-to-receive-share/receive-share-accept.png "Accept pending share.") 

1. Continue to map asset. Select **Map** next to the asset to specify a target data store to receive or access shared data. 

    ![Screenshot showing map asset.](./media/how-to-receive-share/receive-share-map.png "Map asset.")   

1. For in-place sharing, target type and locations are determined by the data provider's source type and location. Select a storage account with the same type and location as the source. 

    If you do not see a storage account from the drop down list, click on the **Register a new data store to map assets** link below to register your storage account. Azure resource needs to be registered with Purview before you can receive data into that resource. Your storage account needs to be registered in the same collection as the received share.

    Enter additional information required to map asset. Select **Map to target**.

    > [!NOTE] 
    > The container where shared data is mapped to is read-only. You cannot write to the container. You can map multiple shares into the same container.
 
    <br> 
    ![Screenshot showing map asset to target.](./media/how-to-receive-share/receive-share-map-target.png "Map asset to target.")   

1. The screen will show *Mapping* in progress. Asset mapping can take a few minutes. Select **Close**. 

    You can select "Close" after you configured all the asset mapping. You don't need to wait for the mapping to complete.
 
    ![Screenshot showing map asset to target in progress.](./media/how-to-receive-share/receive-share-map-inprogress.png "Map asset to target in progress.")   

1. Select **Assets** tab to monitor mapping status. Once mapping is completed, you'll get a notification in the screen. The status will change from *Mapping* to *Mapped*. 

   ![Screenshot showing mapping complete.](./media/how-to-receive-share/receive-share-asset-mapped.png "Map asset complete.") 

    You can now access the data in the target storage account. 
    > [!NOTE] 
    > Storage REST API version should be February 2020 or later. Ensure you are using the latest version of the storage SDK, PowerShell, CLI and Azure Storage Explorer.

## Clean up resources

To clean up the resources created for the quick start, follow the steps below: 

1. Within Microsoft Purview governance portal, delete the sent share and received share.
1. Once shares are successfully deleted, delete the target container and folder Purview created in the target storage account. 

## Troubleshoot
To troubleshoot issues with sharing data, refer to the [Troubleshoot section of How to share data](how-to-share-data.md#troubleshoot). To troubleshoot issues with receiving share, refer to the [Troubleshoot section of How to receive shared data](how-to-receive-share.md#troubleshoot).

## Next steps
* [FAQ for Data Share](how-to-data-share-faq.md)
* [How to share data](how-to-share-data.md)
* [How to receive share](how-to-receive-share.md)
* [REST API reference](/rest/api/purview/)
