---
title: Quick start on data sharing
description: Learn how to share and receive data with Purview Data Share
author: jifems
ms.author: jife
ms.service: purview
ms.topic: quickstart
ms.date: 11/05/2021
---
# Quick start: Share and receive data with Purview Data share (preview)

This article provides a quick start guide on how to share and receive data from Azure Data Lake Storage Gen2 (ADLS Gen2) or Blob storage account.

## Supported Purview accounts

Purview Data Share feature is currently available in Purview account in the following Azure regions: East US 2, Canada Central, West Europe, UK South, and Australia East.

## Supported storage accounts

In-place data sharing is currently supported for ADLS Gen2 and Blob storage accounts with the following configurations:

* Azure regions: Canada Central, Canada East, UK South, UK West, Australia East, Australia Southeast, Japan East, Korea South, and South Africa North 
* Performance: Standard
* Redundancy options: LRS, GRS, RA-GRS
* Tiers: Hot, Cool

Storage accounts with VNET and private endpoints are not supported.

## Prerequisites

* [A Purview account](create-catalog-portal.md) in the supported Azure region. You can also use two Purview accounts, one for data provider and one for data consumer. If you are getting an error related to *quota* when creating a Purview account, open a support ticket to increase the service limit. 
* **Data Source Admin** and **Data Share Contributor** roles to a Purview collection. If you created the Purview account, you are automatically assigned these roles to the root collection. Refer to [Azure Purview permissions](catalog-permissions.md) to learn more about the Purview collection and roles.
* A source storage account in the supported regions with files and folders you like to share. 
* **Owner** or **Blob Storage Data Owner** role to the source storage account. 
* A target storage account which you will use to access shared data. The target storage account must be in the same region as the source storage account. Both source and target need to be of the same type. If the source is ADLS Gen2, then target must be ADLS Gen2. If the source is Blob storage, then target must be Blob storage. 
* **Contributor**, **Owner**, **Blob Storage Data Contributor**, or **Blob Storage Data Owner** role to the target storage account.
* If the storage account is in a different Azure subscription than the one for Purview account, [register the Microsoft.Purview resource provider](../azure-resource-manager/management/resource-providers-and-types.md) in the Azure subscription where the storage account is located.
* Your recipient's Azure sign-in email address which you can use to send the invitation to. The recipient's email alias won't work.

## Create a share
1. Within Purview Studio, select **Data Share** icon from the left navigation, and then **Create a new share**.

   :::image type="content" source="./media/how-to-share-data/create-share.png" alt-text="Screenshot showing the data share overview.":::

1. Provide the details for your share. Specify a name, share type, description of share contents (optional), terms of use (optional), and collection. Then select **Continue**.

    Note: If you do not see a collection from the drop down list, it means you do not have Data Share Contributor role access to any Purview collection to share data. Please contact your Collection Admin to grant you access. 

    <img src="./media/how-to-share-data/create-share-details.png" alt="Create share and enter details" width=500/>

1. To add assets to your share, select **Add Assets**. 

    <img src="./media/how-to-share-data/create-share-add-asset.png" alt="Add assets" width=500/>

1. Select a asset type, and a data source which has already been registered with Purview. Select **Continue**. 

    Note: If you do not see a data source from the drop down list, click on the **Register a new source to share from** link below to register your data source. Azure resource needs to be registered with Purview before you can share data from that resource. Your data source needs to be registered in the same collection as the share. If you do not see the collection from the drop down list when registering your data source, it means you do not have Data Source Admin role access to the collection. Please contact your Collection Admin to grant you access.

    <img src="./media/how-to-share-data/create-share-select-source.png" alt="Select source" width=500/> 

1. Browse your data source hierarchy and select (check) the objects you want to share. Then select **Add**. When sharing from storage account, only files and folders are currently supported. Sharing from container is not currently supported. 

    <img src="./media/how-to-share-data/create-share-select-contents.png" alt="Select objects to share" width=500/> 

1. Review the assets selected. Optionally, edit **Name** and **Display name** which the recipient will see. Select **Continue**.

    <img src="./media/how-to-share-data/create-share-edit-asset-name.png" alt="Edit asset name and display name" width=500/>   

1. Select **Add Recipient**. Enter the Azure login email address of who you want to share data with. Select **Create and Share**. 
    
    Note you can share the same data with multiple recipients by clicking on **Add Recipient** multiple times. 

    <img src="./media/how-to-share-data/create-share-add-recipient.png" alt="Add recipients" width=500/>   

You've now created your Azure data share. The recipients of your share will receive an invitation and they can view the pending share in their Purview account.

## Receive share

1. You can view pending share in any Purview account. Select a Purview account you want to use to receive the share, and open Purview Studio. If you received an email invitation, you can click on the **View pending share** link in the email to select a Purview account. 

1. In Purview Studio, select **Data Share** icon from the left navigation. Then select **pending received share**.

    If you are a guest user of a tenant, you will be asked to verify your email address for the tenant prior to viewing pending received share for the first time. Once verified, it is valid for 12 months.

   ![Screenshot showing pending received share.](./media/how-to-receive-share/receive-share-invitation.png "Pending receive share.") 

1. Select name of the pending share you want to view. 

   ![Screenshot showing how to select pending received share.](./media/how-to-receive-share/receive-share-select-invitation.png "Select pending receive share.") 

1. Specify a **Received share name** and a collection. Review all the fields, including the **Terms of use**. If you agree to the terms, select the check box. Select **Accept and configure**. If you do not want to accept the invitation, select *Reject*.

    <img src="./media/how-to-receive-share/receive-share-accept.png" alt="Accept pending share" width=500/>   

1. Continue to map assets. Select **Map** next to each asset to specify a target data store to receive or access shared data. 

    <img src="./media/how-to-receive-share/receive-share-map.png" alt="Map asset" width=500/>   

1. For in-place sharing, target type and locations are determined by the data provider's source type and location. Select a data store with the same type and location. 

    Enter additional information required to map assets. This could be different depending on the asset types. Select **Map to target**.

    <img src="./media/how-to-receive-share/receive-share-map-target.png" alt="Map asset to target" width=500/>   

    Note: If you do not see a data source from the drop down list, click on the **Register a new data store to map assets** link below to register your data store. Azure resource needs to be registered with Purview before you can share data from that resource. Your data store needs to be registered in the same collection as the received share. If you do not see the collection from the drop down list when registering your data store, it means you do not have Data Source Admin role access to the collection. Please contact your Collection Admin to grant you access.

1. The screen will show *Mapping* in progress. Asset mapping can take a few minutes. Map all the assets and select **Close**. 

    Note: You can select "Close" after you configured all the asset mapping. You don't need to wait for the mapping to complete.

    <img src="./media/how-to-receive-share/receive-share-map-inprogress.png" alt="Map asset to target in progress" width=500/>  

1. Select **Assets** tab to monitor mapping status. Once mapping is completed, you will get a notification in the screen. The status will change from *Mapping* to *Mapped*. You can now access the data in the target data store. 

   ![Screenshot showing mapping complete.](./media/how-to-receive-share/receive-share-asset-mapped.png "Map asset complete.") 

## Clean up resources

To clean up the resources created for the quick start, follow the steps below: 

1. Within Purview, delete the sent share and received share.
1. Once shares are successfully deleted, delete the target folder Purview created in the target storage account. 

## Troubleshoot
To troubleshoot issues with sharing data, refer to the [Troubleshoot section of How to share data](how-to-share-data.md#troubleshoot). To troubleshoot issues with receiving share, refer to the [Troubleshoot section of How to receive shared data](how-to-receive-share.md#troubleshoot).

## Next steps
* [How to share data](how-to-share-data.md)
* [How to Receive Shared Data](how-to-receive-share.md)
* [REST API reference](/rest/api/purview/)
