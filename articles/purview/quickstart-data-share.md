---
title: 'Quickstart: Share data'
description: Learn how to securely share data from your environment using Microsoft Purview Data Sharing.
author: jifems
ms.author: jife
ms.service: purview
ms.subservice: purview-data-share
ms.topic: quickstart
ms.custom: references_regions
ms.date: 06/28/2022
---
# Quickstart: Share and receive Azure Storage data in-place with Microsoft Purview Data Sharing (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article provides a quick guide on how to share data and receive shares from Azure Data Lake Storage (ADLS Gen2) or Blob storage accounts. 

For an overview of how data sharing works, watch this short [demo](https://aka.ms/purview-data-share/overview-demo).

[!INCLUDE [data-share-quickstart-prerequisites](includes/data-share-quickstart-prerequisites.md)]

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

    :::image type="content" source="./media/how-to-share-data/create-share-select-source.png" alt-text="Screenshot showing select source, with an A D L S gen 2 account selected and Continue highlighted." border="true":::

1. Browse your storage account hierarchy and select (check) the objects you want to share. Then select **Add**. 

    > [!NOTE]
    > When sharing from a storage account, only files and folders are currently supported. Sharing from container isn't currently supported. 

    :::image type="content" source="./media/how-to-share-data/create-share-select-contents.png" alt-text="Screenshot showing the add assets page, with several folders selected to share and the add button highlighted." border="true"::: 

1. Review the assets selected. Optionally, edit **Name** and **Display name** which the recipient will see. Select **Continue**.
 
    :::image type="content" source="./media/how-to-share-data/create-share-edit-asset-name.png" alt-text="Screenshot showing the add assets second page, with the asset paths listed and the display name bars available to edit." border="true":::  

1. Select **Add Recipient**. Enter the Azure login email address of who you want to share data with. Select **Create and Share**. Optionally, you can specify an expiration date for when to terminate the share. You can share the same data with multiple recipients by clicking on **Add Recipient** multiple times. 

    > [!NOTE]
    > In Microsoft Purview governance portal, you can only use user's Azure login email address as recipient. In Microsoft Purview SDK or API, you can use object ID of the user or service principal as a recipient, and you can also optionally specify a target tenant ID (i.e. the Azure tenant recipient can receive the share into).

    :::image type="content" source="./media/how-to-share-data/create-share-add-recipient.png" alt-text="Screenshot showing the add recipients page, with the add recipient button highlighted, two users added." border="true":::  

You've now created your share. The recipients of your share will receive an invitation and they can view the pending share in their Microsoft Purview account. 

## Receive share

1. You can view your pending shares in any Microsoft Purview account. In the [Azure portal](https://portal.azure.com), search for and select the Microsoft Purview account you want to use to receive the share.
1. Open [the Microsoft Purview governance portal](https://web.purview.azure.com/). Select the **Data Share** icon from the left navigation. Then select **pending received share**. If you received an email invitation, you can also select the **View pending share** link in the email to select a Microsoft Purview account. 

    If you're a guest user of a tenant, you'll be asked to verify your email address for the tenant before viewing pending received share for the first time. Once verified, it's valid for 12 months.

   :::image type="content" source="./media/how-to-receive-share/receive-share-invitation.png" alt-text="Screenshot showing pending received share button in the Microsoft Purview governance portal." border="true"::: 

1. Select name of the pending share you want to view. 

   :::image type="content" source="./media/how-to-receive-share/receive-share-select-invitation.png" alt-text="Screenshot showing the received shares window under the pending tab, with a pending share highlighted to select it." border="true"::: 

1. Specify a **Received share name** and a collection. Select **Accept and configure**. If you don't want to accept the invitation, select *Reject*.

   :::image type="content" source="./media/how-to-receive-share/receive-share-accept.png" alt-text="Screenshot showing pending share configuration page, with a share name added, a collection selected, and the accept and configure button highlighted." border="true":::  

1. Continue to map asset. Select **Map** next to the asset to specify a target data store to receive or access shared data. 
 
    :::image type="content" source="./media/how-to-receive-share/receive-share-map.png" alt-text="Screenshot showing the map asset window, with the map button highlighted next to the asset to specify a target data store to receive or access shared data." border="true":::  

1. For in-place sharing, target type and locations are determined by the data provider's source type and location. Select a storage account with the same type and location as the source.

    If you don't see a storage account from the drop-down list, select the **Register a new data store to map assets** link below to register your storage account. Azure resource needs to be registered with Microsoft Purview before you can receive data into that resource. Your storage account needs to be registered in the same collection as the received share.

    Enter additional information required to map asset. Select **Map to target**.

    > [!NOTE] 
    > The container where shared data is mapped to is read-only. You cannot write to the container. You can map multiple shares into the same container.

    :::image type="content" source="./media/how-to-receive-share/receive-share-map-target.png" alt-text="Screenshot showing the map assets window with a storage account, path, and folder added, and the map to target button highlighted at the bottom of the page." border="true":::    

1. The screen will show *Mapping* in progress. Asset mapping can take a few minutes. Select **Close**. 

    You can select "Close" after you've configured the asset mapping. You don't need to wait for the mapping to complete.

    :::image type="content" source="./media/how-to-receive-share/receive-share-map-in-progress.png" alt-text="Screenshot showing the map assets window with a mapping in progress and the close button highlighted at the bottom of the window." border="true":::  

1. Select **Assets** tab to monitor mapping status. Once mapping is completed, you'll get a notification in the screen. The status will change from *Mapping* to *Mapped*. 

    :::image type="content" source="./media/how-to-receive-share/receive-share-asset-mapped.png" alt-text="Screenshot showing received shares in the Microsoft Purview governance portal, with the share selected, the Assets menu opened, and the status showing as Mapped." border="true"::: 

1. You can access shared data from the target storage account through Azure portal, Azure Storage Explorer, Azure Storage SDK, PowerShell or CLI. You can also analyze the shared data by connecting your storage account to Azure Synapse Analytics Spark or Databricks.

## Clean up resources

To clean up the resources created for the quick start, follow the steps below: 

1. Within [Microsoft Purview governance portal](https://web.purview.azure.com/), [delete the sent share](how-to-share-data.md#delete-a-sent-share).
1. Also [delete your received share](how-to-receive-share.md#delete-received-share).
1. Once the shares are successfully deleted, delete the target container and folder Microsoft Purview created in your target storage account when you received shared data.

## Troubleshoot

To troubleshoot issues with sharing data, refer to the [troubleshooting section of the how to share data article](how-to-share-data.md#troubleshoot). To troubleshoot issues with receiving share, refer to the [troubleshooting section of the how to receive shared data article](how-to-receive-share.md#troubleshoot).

## Next steps
* [FAQ for data sharing](how-to-data-share-faq.md)
* [How to share data](how-to-share-data.md)
* [How to receive share](how-to-receive-share.md)
* [REST API reference](/rest/api/purview/)
