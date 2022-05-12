---
title: How to Receive Shared Data
description: Learn how to receive shared data from Azure Blob Storage and Azure Data Lake Storage.
author: jifems
ms.author: jife
ms.service: purview
ms.topic: how-to
ms.date: 11/05/2021
---
# Receive shared data from Purview Data Share (preview)

Purview Data Share supports in-place data sharing from Azure Data Lake Storage Gen2 (ADLS Gen2) and Blob storage account. This article explains how to receive shared data.

## Supported Purview accounts

Purview Data Share feature is currently available in Purview account in the following Azure regions: East US 2, Canada Central, West Europe, UK South, and Australia East.

## Supported storage accounts

In-place data sharing is currently supported for ADLS Gen2 and Blob storage accounts with the following configurations:

* Azure regions: Canada Central, Canada East, UK South, UK West, Australia East, Australia Southeast, Japan East, Korea South, and South Africa North 
* Performance: Standard
* Redundancy options: LRS, GRS, RA-GRS
* Tiers: Hot, Cool

Storage accounts with VNET and private endpoints aren't supported.

## Prerequisites to receive shared data

* [A Purview account](create-catalog-portal.md) in the supported Azure region. If you're getting an error related to *quota* when creating a Purview account, open a support ticket to increase the service limit. 
* **Data Source Admin** and **Data Share Contributor** roles to a Purview collection. If you created the Purview account, you're automatically assigned these roles to the root collection. Refer to [Microsoft Purview permissions](catalog-permissions.md) to learn more about the Purview collection and roles.
* If the target Azure data store is in a different Azure subscription than the one for Purview account, [register the Microsoft.Purview resource provider](../azure-resource-manager/management/resource-providers-and-types.md) in the Azure subscription where the Azure data store is located.
* Different Azure data stores have different permission requirements for receiving share. To receive data into a target storage account, you need **Contributor**, **Owner**, **Blob Storage Data Contributor**, or **Blob Storage Data Owner** role to the target storage account. You can find more details on the [ADLS Gen2](register-scan-adls-gen2.md#data-sharing) or [Blob storage](register-scan-azure-blob-storage-source.md#data-sharing) data source page.

## Receive share

1. You can view pending share in any Purview account. Select a Purview account you want to use to receive the share, and open the Microsoft Purview governance portal. If you received an email invitation, you can select on the **View pending share** link in the email to select a Purview account. 

1. In the Microsoft Purview governance portal, select **Data Share** icon from the left navigation. Then select **pending received share**.

    If you're a guest user of a tenant, you'll be asked to verify your email address for the tenant prior to viewing pending received share for the first time. Once verified, it's valid for 12 months.

   ![Screenshot showing pending received share.](./media/how-to-receive-share/receive-share-invitation.png "Pending receive share.") 

1. Select name of the pending share you want to view. 

   ![Screenshot showing how to select pending received share.](./media/how-to-receive-share/receive-share-select-invitation.png "Select pending receive share.") 

1. Specify a **Received share name** and a collection. Review all the fields, including the **Terms of use**. If you agree to the terms, select the check box. Select **Accept and configure**. If you don't want to accept the invitation, select *Reject*.

    <img src="./media/how-to-receive-share/receive-share-accept.png" alt="Accept pending share" width=500/>   

1. Continue to map assets. Select **Map** next to each asset to specify a target data store to receive or access shared data. 

    <img src="./media/how-to-receive-share/receive-share-map.png" alt="Map asset" width=500/>   

1. For in-place sharing, target type and locations are determined by the data provider's source type and location. Select a data store with the same type and location. 

    Enter additional information required to map assets. This could be different depending on the asset types. Select **Map to target**.

    <img src="./media/how-to-receive-share/receive-share-map-target.png" alt="Map asset to target" width=500/>   

    Note: If you don't see a data source from the drop-down list, select on the **Register a new data store to map assets** link below to register your data store. Azure resource needs to be registered with Purview before you can share data from that resource. Your data store needs to be registered in the same collection as the received share. If you don't see the collection from the drop-down list when registering your data store, it means you don't have *Data Source Admin* role access to the collection. Contact your *Collection Admin* to grant you access.

1. The screen will show *Mapping* in progress. Asset mapping can take a few minutes. Map all the assets and select **Close**. 

    Note: You can select "Close" after you configured all the asset mapping. You don't need to wait for the mapping to complete.

    <img src="./media/how-to-receive-share/receive-share-map-inprogress.png" alt="Map asset to target in progress" width=500/>  

1. Select **Assets** tab to monitor mapping status. Once mapping is completed, you'll get a notification in the screen. The status will change from *Mapping* to *Mapped*. You can now access the data in the target data store. 

   ![Screenshot showing mapping complete.](./media/how-to-receive-share/receive-share-asset-mapped.png "Map asset complete.") 

## Update received share
Once you accepted a share, you can update asset mapping, or stop the sharing relationship by deleting the received share.

### Update asset mapping
You can map asset or unmap asset within a received share.

You can map an asset in the *unmapped* state. To map asset, first select the received share, and then select **Assets** tab. Locate the asset you want to map, and select the **Map** action next to the asset name. You can now specify a target data store where you want to access the shared data. Once you confirm your selection, it will take a few minutes for the asset mapping to complete, and your will see the shared data in your target data store. 

![Screenshot map asset.](./media/how-to-receive-share/edit-share-map.png "Map asset.") 

You can unmap an asset in the *mapped* or *Failed* stated. To unmap an asset, first select the received share, and then select **Assets** tab. Locate the asset you want to unmap, and select the **Unmap** action next to the asset name. It will take a few minutes to complete. Once asset is unmapped, you can no longer access the shared data.

![Screenshot unmap asset.](./media/how-to-receive-share/edit-share-unmap.png "Unmap asset.") 

## Delete received share
Deleting a received share will stop the sharing relationship, and you'll no longer be able to access shared data. Deleting a received share can take a few minutes.

## Troubleshoot
Here are some common issues for receiving share and how to troubleshoot.

### Can't see Data share icon from left navigation
Data share feature is only available in Purview account in select regions. Make sure your Purview account is in one of the [supported regions](#supported-purview-accounts). If you don't know which region your Purview account is in, you can find it in Azure portal by selecting your Purview account, and *Overview*. Region information is listed under *Location*. 

### Both Sent Shares and Received Shares are disabled
If both *sent shares* and *received shares* are disabled in the navigation, you don't have **Data Share Contributor** role to any collections in this Purview account. 

### Can't view pending share
If you've been notified that you've received a share, but can't view pending share in your Purview account, it could be due to the following reasons:

1. You don't have **Data Share Contributor** role to any collections in this Purview account. Contact your *Purview Collection Admin* to grant you access to both **Data Source Admin** and **Data Share Contributor** roles to view, accept and configure the received share. 
1. Pending share invitation is sent to your email alias instead of your Azure login email.  Contact your data provider and ensure that they've sent the invitation to your Azure login e-mail address and not your e-mail alias.
1. Share has already been accepted.  If you've already accepted the share, it will no longer show up in *Pending* tab. Select *Accepted* tab under *Received shares* to see your active shares.
1. You're a guest user of the tenant. If you're a guest user of a tenant, you need to verify your email address for the tenant in order to view pending share for the first time. Once verified, it's valid for 12 months.

### Can't select a collection when accepting a pending share or register a data source
If you can't select a collection when accepting a pending share or register a data source, you don't have proper permission to the collection. You need to have **Data Source Admin** and **Data Share Contributor** roles to a Purview collection in order to register data source and receive share. 

### Can't select target storage account when map an asset
When you map an asset to a target, if your storage account isn't listed for you to select, it's likely due to the following reasons:
1. The storage account isn't supported. Purview Data share only [supports storage accounts with specific configurations](#supported-storage-accounts).
1. You don't have **Data Source Admin** role to the collection where the storage account is registered in. Data Source Admin role is required to view the list of registered storage account in a collection.

### Failed to map asset
If you failed to map an asset, it's likely due to the following reasons:
1. Permission issue to the target data store. Check [Prerequisite](#prerequisites-to-receive-shared-data) for required data store permissions.
1. The share and target data store don't belong to the same Purview collection. In order to receive data into a data store, the share and target data store need to belong to the same Purview collection. 
1. The *New Folder* you specified to receive storage data isn't empty.
1. Source and target storage account is the same. Sharing from the same source storage account to the same target isn't supported.
1. Exceeding limit. Source storage account can support up to 20 targets, and target storage account can support up to 100 sources. If you require an increase in limit, contact Support.

After you unmap an asset, you have to wait for a minute before you can map it again.

## Next steps

* [How to Share Data](how-to-share-data.md)
* [REST API reference](/rest/api/purview/)

