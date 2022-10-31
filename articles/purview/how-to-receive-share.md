---
title: How to receive shared data
description: Learn how to receive shared data from Azure Blob Storage and Azure Data Lake Storage using Microsoft Purview Data Sharing.
author: jifems
ms.author: jife
ms.service: purview
ms.subservice: purview-data-share
ms.topic: how-to
ms.date: 06/28/2022
---
# Receive Azure Storage in-place share with Microsoft Purview Data Sharing (preview)

Microsoft Purview Data Sharing supports in-place data sharing from Azure Data Lake Storage (ADLS Gen2) to ADLS Gen2, and Blob storage account to Blob storage account. This article explains how to receive a share and access shared data.

For an overview of how data sharing works, watch this short [demo](https://aka.ms/purview-data-share/overview-demo).

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

## Prerequisites to receive shared data

### Microsoft Purview prerequisites

* [A Microsoft Purview account](create-catalog-portal.md).
* **Data Share Contributor** role on a Microsoft Purview collection. If you created the Microsoft Purview account, you're automatically assigned this role to the root collection. Refer to [Microsoft Purview permissions](catalog-permissions.md) to learn more about the Microsoft Purview collections and roles.

### Azure Storage account prerequisites

* Your Azure subscription must be registered for the **AllowDataSharing** preview feature. Follow the below steps using Azure portal or PowerShell. 

    # [Portal](#tab/azure-portal)

    1. In the [Azure portal](https://portal.azure.com), select the Azure subscription that you'll use to create the source and target storage account.
    1. From the left menu, select **Preview features** under *Settings*.
    1. Select **AllowDataSharing** and *Register*. 
    1. Refresh the *Preview features* screen to verify the *State* is **Registered**. It could take 15 minutes to 1 hour for registration to complete.

    For more information, see [the register preview feature article](../azure-resource-manager/management/preview-features.md?tabs=azure-portal#register-preview-feature).

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
    The *RegistrationState* should be **Registered**. It could take 15 minutes to 1 hour for registration to complete. For more information, see the [register preview feature article](../azure-resource-manager/management/preview-features.md?tabs=azure-portal#register-preview-feature).

* A target storage account **created after** the registration step is completed. **The target storage account must be in the same Azure region as the source storage account.** If you don't know the Azure region of the source storage account, you'll be able to find out during the asset mapping step later in the process. Target storage account can be in a different Azure region from your Microsoft Purview account.

    > [!IMPORTANT]
    > The target storage account must be in the same Azure region as the source storage account.

    > [!NOTE]
    > The following are supported storage account configurations:
    >
    > - Azure regions: Canada Central, Canada East, UK South, UK West, Australia East, Japan East, Korea South, and South Africa North 
    > - Performance: Standard
    > - Redundancy options: LRS, GRS, RA-GRS
 
* You'll need the **Contributor** or **Owner** or **Storage Blob Data Owner** or **Storage Blob Data Contributor** role on the target storage account. You can find more details on the [ADLS Gen2](register-scan-adls-gen2.md#data-sharing) or [Blob storage](register-scan-azure-blob-storage-source.md#data-sharing) data source pages.
* If the target storage account is in a different Azure subscription than the one for Microsoft Purview account, the Microsoft.Purview resource provider needs to be registered in the Azure subscription where the Storage account is located. It is automatically registered at the time of share consumer mapping the asset and if the user has permission to do the `/register/action` operation and therefore, Contributor or Owner roles to the subscription where the Storage account is located. 
This registration is only needed the first time when sharing or receiving data into a storage account in the Azure subscription.
* A storage account needs to be registered in the collection where you'll receive the share. For instructions to register, see the [ADLS Gen2](register-scan-adls-gen2.md) or [Blob storage](register-scan-azure-blob-storage-source.md) data source pages.
* Latest version of the storage SDK, PowerShell, CLI and Azure Storage Explorer. Storage REST API version must be February 2020 or later. 

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

## Update received share

Once you accepted a share, you can update asset mapping, or stop the sharing relationship by deleting the received share.

### Update asset mapping

You can map or unmap an asset within a received share.

You can map an asset in the *unmapped* state. To map asset, first select the received share, and then select **Assets** tab. Locate the asset you want to map, and select the **Map** action next to the asset name. You can now specify a target data store where you want to access the shared data. Once you confirm your selection, it will take a few minutes for the asset mapping to complete, and your will see the shared data in your target data store. 

:::image type="content" source="./media/how-to-receive-share/edit-share-map.png" alt-text="Screenshot showing a received share in the Microsoft Purview governance portal, with the assets tab open, showing an asset with a Not Mapped status. The mapping button is highlighted next to the asset." border="true":::  

You can unmap an asset in the *mapped* or *Failed* state. To unmap an asset, first select the received share, and then select **Assets** tab. Locate the asset you want to unmap, and select the **Unmap** action next to the asset name. It will take a few minutes to complete. Once asset is unmapped, you can no longer access the shared data.

:::image type="content" source="./media/how-to-receive-share/edit-share-unmap.png" alt-text="Screenshot showing a received share in the Microsoft Purview governance portal, with the assets tab open, showing an asset in the Mapped status. The unmapping button is highlighted next to the asset." border="true":::   

## Delete received share

To delete a *received share*, select the share and then select **Delete**.

:::image type="content" source="./media/how-to-receive-share/delete-received-share.png" alt-text="Screenshot showing received shares in the Microsoft Purview governance portal. One share has been selected, and the Delete button is highlighted at the top of the page." border="true":::

Deleting a received share will stop the sharing relationship, and you'll no longer be able to access shared data. Deleting a received share can take a few minutes.

## Troubleshoot
Here are some common issues for receiving share and how to troubleshoot them.

### Can't create Microsoft Purview account

If you're getting an error related to *quota* when creating a Microsoft Purview account, it means your organization has exceeded [Microsoft Purview service limit](how-to-manage-quotas.md). If you require an increase in limit, contact support.

### Both Sent Shares and Received Shares are disabled

If both *sent shares* and *received shares* are disabled in the navigation, you don't have **Data Share Contributor** role to any collections in this Microsoft Purview account. 

### Can't view pending share

If you've been notified that you've received a share, but can't view pending share in your Microsoft Purview account, it could be due to the following reasons:

* You don't have **Data Share Contributor** role to any collections in this Microsoft Purview account. Contact your *Microsoft Purview Collection Admin* to grant you access to **Data Share Contributor** role to view, accept and configure the received share. 
* Pending share invitation is sent to your email alias or an email distribution group instead of your Azure sign-in email. Contact your data provider and ensure that they've sent the invitation to your Azure sign-in e-mail address..
* Share has already been accepted.  If you've already accepted the share, it will no longer show up in *Pending* tab. Select *Accepted* tab under *Received shares* to see your active shares.
* You're a guest user of the tenant. If you're a guest user of a tenant, you need to verify your email address for the tenant in order to view pending share for the first time. Once verified, it's valid for 12 months.

### Can't select a collection when accepting a pending share or register a data source

If you can't select a collection when accepting a pending share or register a data source, you don't have proper permission to the collection. You need to have **Data Share Contributor** role to a Microsoft Purview collection in order to register data source and receive share. 

### Can't select target storage account when mapping an asset

When you map an asset to a target, if your storage account isn't listed for you to select, it's likely due to the following reasons:
* The storage account isn't supported. Microsoft Purview Data share only [supports storage accounts with specific configurations](#azure-storage-account-prerequisites).
* You don't have **Data Share Contributor** role to the collection where the storage account is registered in. Data Share Contributor role is required to view the list of registered storage account in a collection. 


### Failed to map asset

If you failed to map an asset, it's likely due to the following reasons:
* Permission issue to the target data store. Check [prerequisites](#prerequisites-to-receive-shared-data) for required data store permissions.
* The share and target data store don't belong to the same Microsoft Purview collection. In order to receive data into a data store, the share and target data store need to belong to the same Microsoft Purview collection. 
* The *Path* you specified includes container created outside of Microsoft Purview Data Sharing. You can only receive data into containers created during asset mapping.
* The *New Folder* you specified to receive storage data isn't empty.
* Source and target storage account is the same. Sharing from the same source storage account to the same target isn't supported.
* Exceeding limit. Source storage account can support up to 20 targets, and target storage account can support up to 100 sources. If you require an increase in limit, contact support.

### Can't access shared data in the target data store

If you can't access shared data, it's likely due to the following reasons:
* After asset mapping is successful, it may take some time for the data to appear in the target data store. Try again in a few minutes. Likewise, after you delete asset mapping, it may take a few minutes for the data to disappear in the target data store.
* You're accessing shared data using a storage API version prior to February 2020. Only storage API version February 2020 and later are supported for accessing shared data. Ensure you're using the latest version of the storage SDK, PowerShell, CLI and Azure Storage Explorer.
* You're accessing shared data using an analytics tool which uses a storage API version prior to February 2020. You can access shared data from Azure Synapse Analytics Spark and Databricks. You won't be able to access shared data using Azure Data Factory, Power BI or AzCopy.
* You’re accessing shared data using ACLs. ACL is not supported for accessing shared data. You can use RBAC instead.

## Next steps

* [How to share data](how-to-share-data.md)
* [FAQ for data sharing](how-to-data-share-faq.md)
* [REST API reference](/rest/api/purview/)

