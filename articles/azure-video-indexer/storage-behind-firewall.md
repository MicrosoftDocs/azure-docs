---
title: Use Video Indexer with storage behind firewall
description: This article gives an overview how to configure Azure AI Video Indexer to use storage behind firewall.
ms.topic: article
ms.date: 03/21/2023
ms.author: juliako
---

# Configure Video Indexer to work with storage accounts behind firewall

When you create a Video Indexer account, you must associate it with a Media Services and Storage account. Video Indexer can access Media Services and Storage using system authentication or Managed Identity authentication. Video Indexer validates that the user adding the association has access to the Media Services and Storage account with Azure Resource Manager Role Based Access Control (RBAC).

If you want to use a firewall to secure your storage account and enable trusted storage, [Managed Identities](/azure/media-services/latest/concept-managed-identities) authentication that allows Video Indexer access through the firewall is the preferred option. It allows Video Indexer and Media Services to access the storage account that has been configured without needing public access for [trusted storage access.](../storage/common/storage-network-security.md?tabs=azure-portal#grant-access-to-trusted-azure-services)

> [!IMPORTANT] 
> When you lock your storage accounts without public access be aware that the client device you're using to download the video source file using the Video Indexer portal will be the source ip that the storage account will see and allow/deny depending on the network configuration of your storage account. For instance, if I'm accessing the Video Indexer portal from my home network and I want to download the video source file a sas url to the storage account is created, my device will initiate the request and as a consequence the storage account will see my home ip as source ip. If you did not add exception for this ip you will not be able to access the SAS url to the source video. Work with your network/storage administrator on a network strategy i.e. use your corporate network, VPN or Private Link. 

Follow these steps to enable Managed Identity for Media Services and Storage and then lock your storage account. It's assumed that you already created a Video Indexer account and associated with a Media Services and Storage account.

## Assign the Managed Identity and role

1. When you navigate to your Video Indexer account for the first time, we validate if you have the correct role assignments for Media Services and Storage. If not, the following banners that allow you to assign the correct role automatically will appear. If you don’t see the banner for the Storage account, it means your Storage account isn't behind a firewall, or everything is already set.

   :::image type="content" source="./media/storage-behind-firewall/trusted-service-assign-role-banner.png" alt-text="Screenshot shows how to assign role to Media Services and Storage accounts from the Azure portal.":::
1. When you select **Assign Role**, the followinging roles are assigned: `Azure Media Services : Contributor` and `Azure Storage : Storage Blob Data Owner`. You can verify or manually set assignments by navigating to the **Identity** menu of your Video Indexer account and selecting **Azure Role Assignments**.

   :::image type="content" source="./media/storage-behind-firewall/trusted-service-verify-assigned-roles.png" alt-text="Screenshot of assigned roles from the Azure portal.":::
1. Navigate to your Media Services account and select **Storage accounts**.

   :::image type="content" source="./media/storage-behind-firewall/trusted-service-media-services-managed-identity-menu.png" alt-text="Screenshot of Assigned Managed Identity role on the connected storage account for Media Services from the Azure portal.":::
1. Select **Managed identity**. A warning that you have no managed identities will appear. Select **Click here** to configure one.

   :::image type="content" source="./media/storage-behind-firewall/trusted-service-media-services-managed-identity-selection.png" alt-text="Screenshot of enable System Managed Identity role on the connected storage account for Media Services from the Azure portal.":::
1. Select **User** or **System-assigned** identity. In this case, choose **System-assigned**.
1. Select **Save**.
1. Select **Storage accounts** in the menu and select **Managed identity** again. This time, the banner that you don’t have a managed identity shouldn't appear. Instead, you can now select the managed identity in the dropdown menu.
1. Select **System-assigned**.

   :::image type="content" source="./media/storage-behind-firewall/trusted-service-media-services-managed-identity-system-assigned-selection.png" alt-text="Screenshot of Azure portal to select System Managed Identity role on the connected storage account for Media Services from the Azure portal.":::
1. Select **Save**.
1. Navigate to your Storage account. Select **Networking** from the menu and select **Enabled from selected virtual networks and IP addresses** in the **Public network access** section.

   :::image type="content" source="./media/storage-behind-firewall/trusted-service-storage-lock-select-exceptions.png" alt-text="Screenshot of how to disable public access for your storage account and enable exception for trusted services from the Azure portal.":::
1. Under **Exceptions**, make sure that **Allow Azure services on the trusted services list to access this storage account** is selected.


## Upload from locked storage account

When uploading a file to Video Indexer you can provide a link to a video using a SAS locator. If the storage account hosting the video is not publicly accessible we need to use the Managed Identity and Trusted Service approach. Since there is no way for us to know if a SAS url is pointing to a locked storage account, and this also applies to the storage account connected to Media Services, you need to explicitly set the query parameter `useManagedIdentityToDownloadVideo` to `true` in the [upload-video API call](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video). In addition, you also need to set the role `Azure Storage : Storage Blob Data Owner` on this storage account as you did with the storage account connect to Media Services in the previous section.

## Summary

This concludes the tutorial. With these steps you've completed the following activities:

1. Assigning the Video Indexer managed-identity the necessary roles to Media Services (Contributor) and Storage (Storage Blob Data Owner).
1. Assigning the Media Services Managed-identity role to the Storage.
1. Locking down your storage account behind firewall and allow Azure Trusted Services to access the Storage account using Managed-identity.

## Next steps

[Disaster recovery](video-indexer-disaster-recovery.md)
