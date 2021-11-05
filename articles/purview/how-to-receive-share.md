---
title: How to Receive Shared Data
description: Learn how to receive shared data from Azure Blob Storage and Azure Data Lake Storage.
author: jifems
ms.author: jife
ms.service: purview
ms.topic: how-to
ms.date: 11/05/2021
---
# Receive shared data from Purview Data Share

Purview Data Share supports in-place data sharing from Azure Data Lake Storage Gen2 (ADLS Gen2) and Blob storage account. This article explains how to receive shared data.

## Supported regions

Purview Data Share feature is currently available in the following Azure regions.

* Purview accounts in East US 2, Canada Central, West Europe, UK South, and Australia East
* ADLS Gen2 and Blob Storage accounts in Canada Central, Canada East, UK South, UK West, Australia East, Australia Southeast, Japan East, Korea South, and South Africa North 

## Supported storage account redundancy options

In-place data sharing is currently supported for storage account with the following redundancy: LRS, GRS, RA-GRS.

## Prerequisites to receive shared data

* [A Purview account](create-catalog-portal.md) in the supported Azure region. If you are getting an error related to *quota* when creating a Purview account, open a support ticket to increase the service limit. 
* **Data Source Admin** and **Data Share Contributor** roles to a Purview collection. If you created the Purview account, you are automatically assigned these roles to the root collection. Refer to [Azure Purview permissions](catalog-permissions.md) to learn more about the Purview collection and roles.
* If the target Azure data store is in a different Azure subscription than the one for Purview account, [register the Microsoft.Purview resource provider](../azure-resource-manager/management/resource-providers-and-types.md) in the Azure subscription where the Azure data store is located.
* Different Azure data stores have different permission requirements for receiving share. To receive data into a target storage account, you need **Contributor**, **Owner**, **Blob Storage Data Contributor**, or **Blob Storage Data Owner** role to the target storage account. You can find additional details on the [ADLS Gen2](register-scan-adls-gen2.md#data-share) or [Blob storage](register-scan-azure-blob-storage-source.md#data-share) data source page.

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

## Update received share
Once you accepted a share, you can update asset mapping, or stop the sharing relationship by deleting the received share.

### Update asset mapping
You can map asset or unmap asset within a received share.

You can map an asset in the *unmapped* state. To map asset, first select the received share, and then select **Assets** tab. Locate the asset you want to map, and select the **Map** action next to the asset name. You can now specify a target data store where you want to access the shared data. Once you confirm your selection, it will take a few minutes for the asset mapping to complete, and your will see the shared data in your target data store. 

You can unmap an asset in the *mapped* or *Failed* stated. To unmap an asset, first select the received share, and then select **Assets** tab. Locate the asset you want to unmap, and select the **Unmap** action next to the asset name. It will take a few minutes to complete. Once asset is unmapped, you can no longer access the shared data.

## Delete received share
Deleting a received share will stop the sharing relationship, and you will no longer be able to access shared data. Deleting a received share can take a few minutes.

## Troubleshoot
Here are some common issues for receiving share and how to troubleshoot.

### Cannot see Data share icon from left navigation
Data share feature is only available in Purview account in select regions. Make sure your Purview account is in one of the [supported regions](#supported-regions). You can find your Purview account region in Azure Portal by selecting your Purview account, and *Overview*. Region is listed under *Location*. 

### Cannot see pending share
This could be due to the following reasons:

1.	Pending share invitation is sent to your email alias instead of your Azure login email.  Contact your data provider and ensure that they have sent the invitation to your Azure login e-mail address and not your e-mail alias.
1.	Share has already been accepted.  If you have already accepted the share, it will no longer show up in *Pending* tab. Select *Accepted* tab under *Received shares* to see your active shares.
1.	You are a guest user of the tenant. If you are a guest user of a tenant, you need to verify your email address for the tenant in order to view pending share for the first time. Once verified, it is valid for 12 months.

### Cannot select a collection when accepting a pending share or register a data source
If you cannot select a collection when accepting a pending share or register a data source, you do not have proper permission to the collection. You need to have **Data Source Admin** and **Data Share Contributor** roles to a Purview collection in order to register data source and receive share. 

### Issue with asset mapping
If your storage account is not listed for you to select after register the source, it is likely the storage account is not in the [supported regions](#supported-regions) or does not have the [supported redundancy](#supported-storage-account-redundancy-options).

If you failed to map asset, it is likely due to the following issues:
1. Permission issue to the target data store. Check [Prerequisite](#prerequisites-to-receive-shared-data) for required data store permissions.
1. The share and target data store do not belong to the same Purview collection. In order to receive data into a data store, the share and target data store need to belong to the same Purview collection. 
1. The *New Folder* you specified to receive storage data is not empty.
1. Source and target storage account is the same. Sharing from the same source storage account to the same target is not supported.
1. Exceeding limit. Source storage account can support up to 20 targets, and target storage account can support up to 100 sources. If you require an increase in limit, please contact Support.

Note that after you unmap an asset, you have to wait for a minute before you can map it again.

## Next steps

* [How to Share Data](how-to-share-data.md)
* [REST API reference](/rest/api/purview/)

