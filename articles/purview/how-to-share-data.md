---
title: How to Share Data
description: Learn how to share data with Purview Data Share
author: jifems
ms.author: jife
ms.service: purview
ms.topic: how-to
ms.date: 10/15/2021
---
# Share Data with Purview Data Share

Purview Data Share supports in-place data sharing from Azure Data Lake Storage Gen2 (ADLS Gen2) and Blob storage account. This article explains how to share data.

## Supported regions

Purview Data Share feature is currently available in the following Azure regions.

* Purview accounts in East US 2, Canada Central, West Europe, UK South, and Australia East
* ADLS Gen2 and Blob Storage accounts in Canada Central, Canada East, UK South, UK West, Australia East, Australia Southeast, Australia Central, Japan East, Korea South, and South Africa North 

## Prerequisites to share data

* Data Source Admin and Data Share Contributor roles to a Purview collection. If you created the Purview account, you are automatically assigned these roles to the root collection. Refer to [Azure Purview permissions](catalog-permissions.md) to learn more about the Purview collection and roles.
* Your recipient's Azure sign-in email address which you can use to send the invitation to. The recipient's email alias won't work.
* If the source Azure data store is in a different Azure subscription than the one for Purview account, [register the Microsoft.Purview resource provider](https://docs.microsoft.com/azure/azure-resource-manager/management/resource-providers-and-types) in the Azure subscription where the Azure data store is located.
* Different Azure data stores have different permission requirements for sharing. Check out requirements for [ADLS Gen2](register-scan-adls-gen2.md) or [Blob storage](register-scan-azure-blob-storage-source.md). 

## Create a share

1. Within Purview Studio, select **Data Share** icon from the left navigation, and then **Create a new share**.

   :::image type="content" source="./media/how-to-share-data/create-share.png" alt-text="Screenshot showing the data share overview.":::

1. Provide the details for your share. Specify a name, share type, description of share contents (optional), terms of use (optional), and collection. Then select **Continue**.

    Note: If you do not see a collection from the drop down list, it means you do not have Data Share Contributor role access to any Purview collection to share data. Please contact your Collection Admin to grant you access. 

    ![Screenshot showing data share details.](./media/how-to-share-data/create-share-details.png "Enter the data share details.") 

1. To add assets to your share, select **Add Assets**. 

    ![Screenshot showing how to add assets to your share.](./media/how-to-share-data/create-share-add-asset.png "Add assets.")

1. Select a asset type, and a data source which has already been registered with Purview. Select **Continue**. 

    Note: If you do not see a data source from the drop down list, click on the **Register a new source to share from** link below to register your data source. Azure resource needs to be registered with Purview before you can share data from that resource. Your data source needs to be registered in the same collection as the share. If you do not see the collection from the drop down list when registering your data source, it means you do not have Data Source Admin role access to the collection. Please contact your Collection Admin to grant you access.

    ![Screenshot showing where to select an asset type.](./media/how-to-share-data/create-share-select-source.png "Select source.")    

1. Browse your data source hierarchy and select (check) the objects you want to share. Then select **Add**. 

    ![Screenshot showing how to select an object to share.](./media/how-to-share-data/create-share-select-contents.png "Select objects to share.")    

1. Review the assets selected. Optionally, edit **Name** and **Display name** which the recipient will see. Select **Continue**.

    ![Screenshot showing how to edit asset name and display name.](./media/how-to-share-data/create-share-edit-asset-name.png "Edit asset name and display name.") 

1. Select **Add Recipient**. Enter the Azure login email address of who you want to share data with. Select **Create and Share**. 
    
    Note you can share the same data with multiple recipients by clicking on **Add Recipient** multiple times. 

    ![Screenshot showing how to add recipient email addresses.](./media/how-to-share-data/create-share-add-recipient.png "Add recipients.") 


You've now created your Azure data share. The recipients of your share will receive an invitation and they can view the pending share in their Purview account. 

## Next steps
* [How to Receive Shared Data](how-to-receive-share.md)
* [REST API reference](https://docs.microsoft.com/rest/api/purview/)