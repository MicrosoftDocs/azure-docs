---
title: Quick start on data sharing
description: Learn how to share and receive data with Purview Data Share
author: jifems
ms.author: jife
ms.service: purview
ms.topic: quickstart
ms.date: 05/10/2022
---
# Quick start: Share and receive data with Microsoft Purview Data Sharing (preview)

This article provides a quick start guide on how to share and receive data from Azure Data Lake Storage Gen2 (ADLS Gen2) or Blob storage account.

## Prerequisites

### Purview prerequisites

* [A Purview account](create-catalog-portal.md). You can also use two Purview accounts, one for data provider and one for data consumer. If you are getting an error related to *quota* when creating a Purview account, open a support ticket to increase the service limit. 
* Your recipient's Azure sign-in email address which you can use to send the invitation to. The recipient's email alias won't work.

### Storage account prerequisites

* Your Azure subscription must be registered for the **AllowDataSharing** preview feature. Follow the below steps using Azure portal or PowerShell. 

    1. In Azure portal, select your Azure subscription which you will use to create the source and target storage account.
    1. From the left menu, select **Preview features** under *Settings*.
    1. Select **AllowDataSharing** and *Register*. 
    1. Refresh the *Preview features* screen to verify the *State* is **Registered**.

    ```azurepowershell-interactive
    Set-AzContext -SubscriptionId [Your Azure subscription ID]
    Register-AzProviderFeature -FeatureName "AllowDataSharing" -ProviderNamespace "Microsoft.Storage"​
    Get-AzProviderFeature -FeatureName "AllowDataSharing" -ProviderNamespace "Microsoft.Storage"   
    ```

    The *RegistrationState* should be **Registered**.

    For additional details, refer to [Register preview feature](../azure-resource-manager/management/preview-features?tabs=azure-portal#register-preview-feature).

* Source and target storage accounts created after the registration step is completed. 
* Both storage accounts must be in the same Azure region. 
* The following are supported storage account configurations:

    * Azure regions: Canada Central, Canada East, UK South, UK West, Australia East, Japan East, Korea South, and South Africa North 
    * Performance: Standard
    * Redundancy options: LRS, GRS, RA-GRS

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

   :::image type="content" source="./media/how-to-share-data/create-share.png" alt-text="Screenshot showing the data share overview.":::

1. Provide the details for your share. Specify a name, share type, description of share contents (optional), and collection. Then select **Continue**.

    Note: If you do not see a collection from the drop down list, it means you do not have Data Share Contributor role access to any Purview collection to share data. Please contact your Collection Admin to grant you access. 

    <img src="./media/how-to-share-data/create-share-details.png" alt="Create share and enter details" width=500/>

1. To add assets to your share, select **Add Assets**. 

    <img src="./media/how-to-share-data/create-share-add-asset.png" alt="Add assets" width=500/>

1. Select a asset type, and a data source which has already been registered with Purview. Select **Continue**. 

    Note: If you do not see a data source from the drop down list, click on the **Register a new source to share from** link below to register your data source. Azure resource needs to be registered with Purview before you can share data from that resource. Your data source needs to be registered in the same collection as the share. 

    <img src="./media/how-to-share-data/create-share-select-source.png" alt="Select source" width=500/> 

1. Browse your data source hierarchy and select (check) the objects you want to share. Then select **Add**. When sharing from storage account, only files and folders are currently supported. Sharing from container is not currently supported. 

    <img src="./media/how-to-share-data/create-share-select-contents.png" alt="Select objects to share" width=500/> 

1. Review the assets selected. Optionally, edit **Name** and **Display name** which the recipient will see. Select **Continue**.

    <img src="./media/how-to-share-data/create-share-edit-asset-name.png" alt="Edit asset name and display name" width=500/>   

1. Select **Add Recipient**. Enter the Azure login email address of who you want to share data with. Optionally, specify an expiration date for when to terminate the share. Select **Create and Share**. 
    
    Note you can share the same data with multiple recipients by clicking on **Add Recipient** multiple times. 

    <img src="./media/how-to-share-data/create-share-add-recipient.png" alt="Add recipients" width=500/>   

You've now created your Azure data share. The recipients of your share will receive an invitation and they can view the pending share in their Purview account.

## Receive share

1. You can view pending share in any Purview account. Select a Purview account you want to use to receive the share, and open Microsoft Purview governance portal. If you received an email invitation, you can click on the **View pending share** link in the email to select a Purview account. 

1. In Microsoft Purview governance portal, select **Data Share** icon from the left navigation. Then select **pending received share**.

    If you are a guest user of a tenant, you will be asked to verify your email address for the tenant prior to viewing pending received share for the first time. Once verified, it is valid for 12 months.

   ![Screenshot showing pending received share.](./media/how-to-receive-share/receive-share-invitation.png "Pending receive share.") 

1. Select name of the pending share you want to view. 

   ![Screenshot showing how to select pending received share.](./media/how-to-receive-share/receive-share-select-invitation.png "Select pending receive share.") 

1. Specify a **Received share name** and a collection. Select **Accept and configure**. If you do not want to accept the invitation, select *Reject*.

    <img src="./media/how-to-receive-share/receive-share-accept.png" alt="Accept pending share" width=500/>   

1. Continue to map asset. Select **Map** next to the asset to specify a target data store to receive or access shared data. 

    <img src="./media/how-to-receive-share/receive-share-map.png" alt="Map asset" width=500/>   

1. For in-place sharing, target type and locations are determined by the data provider's source type and location. Select a data store with the same type and location as the source. 

    Enter a new container and a new folder name. Select **Map to target**.

    <img src="./media/how-to-receive-share/receive-share-map-target.png" alt="Map asset to target" width=500/>   

    Note: If you do not see a data store from the drop down list, click on the **Register a new data store to map assets** link below to register your data store. Azure resource needs to be registered with Purview before you can receive data into that resource. Your data store needs to be registered in the same collection as the received share. 

1. The screen will show *Mapping* in progress. Asset mapping can take a few minutes. Select **Close**. 

    Note: You can select "Close" after you configured all the asset mapping. You don't need to wait for the mapping to complete.

    <img src="./media/how-to-receive-share/receive-share-map-inprogress.png" alt="Map asset to target in progress" width=500/>  

1. Select **Assets** tab to monitor mapping status. Once mapping is completed, you will get a notification in the screen. The status will change from *Mapping* to *Mapped*. You can now access the data in the target data store. 

   ![Screenshot showing mapping complete.](./media/how-to-receive-share/receive-share-asset-mapped.png "Map asset complete.") 

    Note: To access shared data using Azure Storage Explorer, you will need Azure Storage Explorer version 1.24.0 or later. To access shared data programmatically, you need to use Storage API version February 2020 or later.

## Clean up resources

To clean up the resources created for the quick start, follow the steps below: 

1. Within Microsoft Purview governance portal, delete the sent share and received share.
1. Once shares are successfully deleted, delete the target container and folder Purview created in the target storage account. 

## Troubleshoot
To troubleshoot issues with sharing data, refer to the [Troubleshoot section of How to share data](how-to-share-data.md#troubleshoot). To troubleshoot issues with receiving share, refer to the [Troubleshoot section of How to receive shared data](how-to-receive-share.md#troubleshoot).

## Next steps
* [FAQ for Data Share](how-to-data-share-faq.md)
* [How to share data](how-to-share-data.md)
* [How to receive shared data](how-to-receive-share.md)
* [REST API reference](/rest/api/purview/)
