---
title: 'Quickstart: Share data'
description: Learn how to securely share data from your environment using Microsoft Purview Data Sharing.
author: sidontha
ms.author: sidontha
ms.service: purview
ms.subservice: purview-data-share
ms.topic: quickstart
ms.custom: references_regions
ms.date: 02/16/2023
---
# Quickstart: Share and receive Azure Storage data in-place with Microsoft Purview Data Sharing (preview)

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

This article provides a quick guide on how to share data and receive shares from Azure Data Lake Storage (ADLS Gen2) or Blob storage accounts.

[!INCLUDE [data-share-quickstart-prerequisites](includes/data-share-quickstart-prerequisites.md)]

## Create a share

1. You can create a share by starting from **Data Map**

    Open the [Microsoft Purview governance portal](https://web.purview.azure.com/). Select the **Data Map** icon from the left navigation. Then select **Shares**.  Select **+New Share**.

   :::image type="content" source="./media/how-to-share-data/create-share-datamap-new-share.png" alt-text="Screenshot that shows the Microsoft Purview governance portal Data Map with Data Map, Shares and New Share highlighted." border="true":::

    Select the Storage account type and the Storage account you want to share data from. Then select **Continue**. 

   :::image type="content" source="./media/how-to-share-data/create-share-datamap-select-type-account.png" alt-text="Screenshot that shows the New Share creation step with Type and Storage account options highlighted." border="true":::

1. You can create a share by starting from **Data Catalog**
 
    Within the [Microsoft Purview governance portal](https://web.purview.azure.com/), find the Azure Storage or Azure Data Lake Storage (ADLS) Gen 2 data asset you would like to share data from using either the [data catalog search](how-to-search-catalog.md) or [browse](how-to-browse-catalog.md).

   :::image type="content" source="./media/how-to-share-data/search-or-browse.png" alt-text="Screenshot that shows the Microsoft Purview governance portal homepage with the search and browse options highlighted." border="true":::

    Once you have found your data asset, select the **Data Share** button.

   :::image type="content" source="./media/how-to-share-data/select-data-share-inline.png" alt-text="Screenshot of a data asset in the Microsoft Purview governance portal with the Data Share button highlighted." border="true" lightbox="./media/how-to-share-data/select-data-share-large.png":::

    Select **+New Share**.

   :::image type="content" source="./media/how-to-share-data/select-new-share-inline.png" alt-text="Screenshot of the Data Share management window with the New Share button highlighted." border="true" lightbox="./media/how-to-share-data/select-new-share-large.png":::

1. Specify a name and a description of share contents (optional). Then select **Continue**.

   :::image type="content" source="./media/how-to-share-data/create-share-details-inline.png" alt-text="Screenshot showing create share and enter details window, with the Continue button highlighted." border="true" lightbox="./media/how-to-share-data/create-share-details-large.png":::

1. Search for and add all the assets you'd like to share out at the container, folder, or file level, and then select **Continue**.

   :::image type="content" source="./media/how-to-share-data/add-asset.png" alt-text="Screenshot showing the add assets window, with a file and a folder selected to share." border="true":::

1. You can edit the display names the shared data will have, if you like. Then select **Continue**.

   :::image type="content" source="./media/how-to-share-data/provide-display-names.png" alt-text="Screenshot showing the second add assets window with the display names unchanged." border="true":::

1. Select **Add Recipient** and select **User** or **App**.

    To share data to a user, select **User**, then enter the Azure sign-in email address of who you want to share data with. By default, the option to enter email address of user is shown.

    :::image type="content" source="./media/how-to-share-data/create-share-add-user-recipient-inline.png" alt-text="Screenshot showing the add recipients page, with the add recipient button highlighted, default user email option shown." border="true" lightbox="./media/how-to-share-data/create-share-add-user-recipient-large.png":::  

    To to share data with a service principal, select **App**. Enter the object ID and tenant ID of the recipient you want to share data with.

    :::image type="content" source="./media/how-to-share-data/create-share-add-app-recipient-inline.png" alt-text="Screenshot showing the add app recipients page, with the add app option and required fields highlighted." border="true" lightbox="./media/how-to-share-data/create-share-add-app-recipient-large.png":::  

1. Select **Create and Share**. Optionally, you can specify an **Expiration date** for when to terminate the share. You can share the same data with multiple recipients by selecting **Add Recipient** multiple times.

You've now created your share. The recipients of your share will receive an invitation and they can view the pending share in their Microsoft Purview account.

## Receive share

1. You can view your share invitations in any Microsoft Purview account. In the [Azure portal](https://portal.azure.com), search for and select the Microsoft Purview account you want to use to receive the share. Open [the Microsoft Purview governance portal](https://web.purview.azure.com/). Select the **Data Map** icon from the left navigation. Then select **Share invites**. If you received an email invitation, you can also select the **View share invite** link in the email to select a Microsoft Purview account.

    If you're a guest user of a tenant, you'll be asked to verify your email address for the tenant before viewing pending received share for the first time. [You can see our guide for steps.](how-to-receive-share.md#guest-user-verification) Once verified, it's valid for 12 months.

    :::image type="content" source="./media/how-to-receive-share/view-invites.png" alt-text="Screenshot showing the Share invites page in the Microsoft Purview governance portal." border="true":::  

1. Select name of the pending share you want to view or configure.

1. If you don't want to accept the invitation, select **Delete**.

    :::image type="content" source="./media/how-to-receive-share/select-delete-invitation-inline.png" alt-text="Screenshot showing the share attachment page with the delete button highlighted." border="true" lightbox="./media/how-to-receive-share/select-delete-invitation-large.png":::  

    >[!NOTE]
    > If you delete an invitation, if you want to accept the share in future it will need to be resent. To deselect the share without deleting select the **Cancel** button instead.

1. You can edit the **Received share name** if you like. Then select a **Storage account name** for a target storage account in the same region as the source. You can choose to **Register a new storage account to map assets** in the drop-down as well.

    >[!IMPORTANT]
    >The target storage account needs to be in the same Azure region as the source storage account.

1. Configure the **Path** (either a new container name, or the name of an existing share container) and, if needed, **New folder**.

1. Select **Attach to target**.

   :::image type="content" source="./media/how-to-receive-share/attach-shared-data-inline.png" alt-text="Screenshot showing pending share configuration page, with a share name added, a collection selected, and the accept and configure button highlighted." border="true" lightbox="./media/how-to-receive-share/attach-shared-data-large.png":::  

1. On the Manage data shares page, you'll see the new share with the status of **Creating** until it has completed and is attached.

    :::image type="content" source="./media/how-to-receive-share/manage-data-shares-window-creating.png" alt-text="Screenshot showing the map asset window, with the map button highlighted next to the asset to specify a target data store to receive or access shared data." border="true":::  

1. You can access shared data from the target storage account through Azure portal, Azure Storage Explorer, Azure Storage SDK, PowerShell or CLI. You can also analyze the shared data by connecting your storage account to Azure Synapse Analytics Spark or Databricks.

## Clean up resources

To clean up the resources created for the quick start, follow the steps below:

1. Within [Microsoft Purview governance portal](https://web.purview.azure.com/), [delete the sent share](how-to-share-data.md#delete-share).
1. Also [delete your received share](how-to-receive-share.md#delete-received-share).
1. Once the shares are successfully deleted, delete the target container and folder Microsoft Purview created in your target storage account when you received shared data.

## Troubleshoot

To troubleshoot issues with sharing data, refer to the [troubleshooting section of the how to share data article](how-to-share-data.md#troubleshoot). To troubleshoot issues with receiving share, refer to the [troubleshooting section of the how to receive shared data article](how-to-receive-share.md#troubleshoot).

## Next steps

* [FAQ for data sharing](how-to-data-share-faq.md)
* [How to share data](how-to-share-data.md)
* [How to receive share](how-to-receive-share.md)
* [REST API reference](/rest/api/purview/)
