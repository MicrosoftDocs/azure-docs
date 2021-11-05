---
title: How to Share Data
description: Learn how to share data with Purview Data Share
author: jifems
ms.author: jife
ms.service: purview
ms.topic: how-to
ms.date: 11/05/2021
---
# Share Data with Purview Data Share

Purview Data Share supports in-place data sharing from Azure Data Lake Storage Gen2 (ADLS Gen2) and Blob storage account. This article explains how to share data.

## Supported regions

Purview Data Share feature is currently available in the following Azure regions.

* Purview accounts in East US 2, Canada Central, West Europe, UK South, and Australia East
* ADLS Gen2 and Blob Storage accounts in Canada Central, Canada East, UK South, UK West, Australia East, Australia Southeast, Japan East, Korea South, and South Africa North 

## Supported storage account redundancy options

In-place data sharing is currently supported for storage account with the following redundancy: LRS, GRS, RA-GRS.

## Prerequisites to share data

* [A Purview account](create-catalog-portal.md) in the supported Azure region. If you are getting an error related to *quota* when creating a Purview account, open a support ticket to increase the service limit. 
* **Data Source Admin** and **Data Share Contributor** roles to a Purview collection. If you created the Purview account, you are automatically assigned these roles to the root collection. Refer to [Azure Purview permissions](catalog-permissions.md) to learn more about the Purview collection and roles.
* Your recipient's Azure sign-in email address which you can use to send the invitation to. The recipient's email alias won't work.
* If the source Azure data store is in a different Azure subscription than the one for Purview account, [register the Microsoft.Purview resource provider](../azure-resource-manager/management/resource-providers-and-types.md) in the Azure subscription where the Azure data store is located.
* Different Azure data stores have different permission requirements for sharing. To share data from storage account, you need **Owner** or **Blob Storage Data Owner** role to the source storage account. You can find additional details on the [ADLS Gen2](register-scan-adls-gen2.md#data-share) or [Blob storage](register-scan-azure-blob-storage-source.md#data-share) data source page.

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

1. Select **Add Recipient**. Enter the Azure login email address of who you want to share data with. Select **Create and Share**. You can share the same data with multiple recipients by clicking on **Add Recipient** multiple times. 

    Note in Purview Studio, you can only use user's Azure login email address as recipient. In Purview SDK or API, you can use object ID of the user or service principal as a recipient, and you can also optionally specify a target tenant ID (i.e. the Azure tenant recipient can receive the share into).

    <img src="./media/how-to-share-data/create-share-add-recipient.png" alt="Add recipients" width=500/>   

You've now created your Azure data share. The recipients of your share will receive an invitation and they can view the pending share in their Purview account. 

## Update a sent share
Once a share is created, you can update description, terms of use, assets and recipients. 

### Update assets
You can add assets or edit and delete an existing asset in a sent share. 

To add a new asset (for example, to share data from a different storage account), first select the share, and then select **Add assets**. 

To edit an existing asset (for example for a storage, to add or remove shared files and folders), first select the share, and then select **Assets** tab. Locate the asset you want to edit, and select the **Edit** action next to the asset name. You can now add or remove shared files and folders. Once you confirm your selection, it will take a few minutes for the change to take place. Once update is completed, recipients of your share will see the updated list of files and folders in their target storage account. 

To delete an asset, first select the share, and then select **Assets** tab. Locate the asset you want to delete, and select the **Delete** action next to the asset name. Delete an asset can take a few minutes.

### Update recipients
You can add more recipient, view status of your existing recipients, or revoke access.

To share the same data with more recipients, first select the share, and then select **Add recipient**.

To view status of existing recipients, first select the share, and then select **Recipients** tab. You can select **Accepted**, **Pending**, and **Rejected** to view status of these recipients. If you want to terminate access to a specific recipient, you can revoke access to a recipient in *accepted* state by locating the recipient and selecting **Revoke** action next to it. Once access is revoked, you can reinstate it by locating the recipient and selecting **Reinstate** action next to it. When a recipient is in *pending* state, you can delete it by locating the recipient and selecting **Delete** next to it. 

## Delete a sent share
Deleting a sent share will delete the share and revoke access to all the existing recipients. Deleting a sent share can take a few minutes.

## Troubleshoot
Here are some common issues for sharing data and how to troubleshoot.

### Cannot see Data share icon from left navigation
Data share feature is only available in Purview account in select regions. Make sure your Purview account is in one of the [supported regions](#supported-regions). You can find your Purview account region in Azure Portal by selecting your Purview account, and *Overview*. Region is listed under *Location*. 

### Cannot select a collection when creating a share or register a data source
If you cannot select a collection when creating a share or register a data source, you do not have proper permission to the collection. You need to have **Data Source Admin** and **Data Share Contributor** roles to a Purview collection in order to register data source and share data. 

### Issue add or update asset
If your storage account is not listed for you to select after register the source, it is likely the storage account is not in the [supported regions](#supported-regions) or does not have the [supported redundancy](#supported-storage-account-redundancy-options).

If you failed to add asset, it is likely due to the following reasons:
1. Permission issue to the data store where you want to share data from. Check [Prerequisite](#prerequisites-to-share-data) for required data store permissions.
1. The share and source data store do not belong to the same Purview collection. In order to share data from a data store, the share and source data store need to belong to the same Purview collection. 
1. You tried to share data from a *storage container*. Sharing from container is not currently supported. You can select all files and folders within the container to share.
1. Exceeding limit. Source storage account can support up to 20 targets, and target storage account can support up to 100 sources. If you require an increase in limit, please contact Support.

### Failed to reinstate a recipient
After successfully revoking access to a recipient, you will need to wait for a minute before reinstating the recipient.

## Next steps
* [How to Receive Shared Data](how-to-receive-share.md)
* [REST API reference](/rest/api/purview/)