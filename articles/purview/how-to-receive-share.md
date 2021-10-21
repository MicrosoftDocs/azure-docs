---
title: How to Receive Shared Data
description: Learn how to share and receive data from Azure Blob Storage and Azure Data Lake Storage.
author: jifems
ms.author: jife
ms.service: purview
ms.topic: how-to
ms.date: 10/15/2021
---
# Receive shared data from Purview Data Share

Purview Data Share supports in-place data sharing from Azure Data Lake Storage Gen2 (ADLS Gen2) and Blob storage account. This article explains how to receive shared data.

## Supported regions

Purview Data Share feature is currently available in the following Azure regions.

* Purview accounts in East US 2, Canada Central, West Europe, UK South, and Australia East
* ADLS Gen2 and Blob Storage accounts in Canada Central, Canada East, UK South, UK West, Australia East, Australia Southeast, Australia Central, Japan East, Korea South, and South Africa North 

## Prerequisites to receive shared data

* Data Source Admin and Data Share Contributor roles to a Purview collection. If you created the Purview account, you are automatically assigned these roles to the root collection. Refer to [Azure Purview permissions](catalog-permissions.md) to learn more about the Purview collection and roles.
* If the target Azure data store is in a different Azure subscription than the one for Purview account, [register the Microsoft.Purview resource provider](https://docs.microsoft.com/azure/azure-resource-manager/management/resource-providers-and-types) in the Azure subscription where the Azure data store is located.
* Different Azure data stores have different permission requirements for receiving share. Check out requirements for [ADLS Gen2](register-scan-adls-gen2.md) or [Blob storage](register-scan-azure-blob-storage-source.md) 

## Receive share

1. You can view pending share in any Purview account. Select a Purview account you want to use to receive the share, and open Purview Studio. If you received an email invitation, you can click on the **View pending share** link in the email to select a Purview account. 

1. In Purview Studio, select **Data Share** icon from the left navigation. Then select **pending received share**.

    If you are a guest user of a tenant, you will be asked to verify your email address for the tenant prior to viewing pending received share for the first time. Once verified, it is valid for 12 months.

   ![Screenshot showing pending received share.](./media/how-to-receive-share/receive-share-invitation.png "Pending receive share.") 

1. Select name of the pending share you want to view. 

   ![Screenshot showing how to select pending received share.](./media/how-to-receive-share/receive-share-select-invitation.png "Select pending receive share.") 

1. Specify a **Received share name** and a collection. Review all the fields, including the **Terms of use**. If you agree to the terms, select the check box. Select **Accept and configure**. If you do not want to accept the invitation, select *Reject*.

   ![Screenshot showing accepting pending share.](./media/how-to-receive-share/receive-share-accept.png "Accept pending share.") 

1. Continue to map assets. Select **Map** next to each asset to specify a target data store to receive or access shared data. 

   ![Screenshot showing mapping.](./media/how-to-receive-share/receive-share-map.png "Map asset.") 

1. For in-place sharing, target type and locations are determined by the data provider's source type and location. Select a data store with the same type and location. 

    Enter additional information required to map assets. This could be different depending on the asset types. Select **Map to target**.

   ![Screenshot showing mapping to target.](./media/how-to-receive-share/receive-share-map-target.png "Map asset to target.") 

    Note: If you do not see a data source from the drop down list, click on the **Register a new data store to map assets** link below to register your data store. Azure resource needs to be registered with Purview before you can share data from that resource. Your data store needs to be registered in the same collection as the received share. If you do not see the collection from the drop down list when registering your data store, it means you do not have Data Source Admin role access to the collection. Please contact your Collection Admin to grant you access.

1. The screen will show *Mapping* in progress. Asset mapping can take a few minutes. Map all the assets and select **Close**. 

Note: You can select "Close" after you configured all the asset mapping. You don't need to wait for the mapping to complete.

   ![Screenshot showing mapping to target in progress.](./media/how-to-receive-share/receive-share-map-inprogress.png "Map asset to target in progress.") 

1. Select **Assets** tab to monitor mapping status. Once mapping is completed, you will get a notification in the screen. The status will change from *Mapping* to *Mapped*. You can now access the data in the target data store. 

   ![Screenshot showing mapping complete.](./media/how-to-receive-share/receive-share-asset-mapped.png "Map asset complete.") 

## Next steps

* [How to Share Data](how-to-share-data.md)
* [REST API reference](https://docs.microsoft.com/rest/api/purview/)

