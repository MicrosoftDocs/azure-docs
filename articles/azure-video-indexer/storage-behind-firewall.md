---
title: Use Video Indexer with storage behind firewall
description: This article gives an overview how to configure Azure Video Indexer to use storage behind firewall.
ms.topic: article
ms.date: 02/24/2023
ms.author: juliako
---

# Configure Video Indexer to work with storage accounts behind firewall

When you create a Video Indexer account, you must associate it with a Media Services and Storage account. Video Indexer can access Media Services and Storage using system authentication or Managed Identity authentication. Video Indexer validates that the user adding the association has access to the Media Services and Storage account with Azure Resource Manager Role Based Access Control (RBAC).

If you want to use a firewall to secure your storage account and enable trusted storage, [Managed Identities](/azure/media-services/latest/concept-managed-identities) authentication that allows Video Indexer access through the firewall is the preferred option. It allows Video Indexer and Media Services to access the storage account that has been configured without needing public access for [trusted storage access.](/azure/storage/common/storage-network-security?tabs=azure-portal#grant-access-to-trusted-azure-services)

Follow these steps to enable Managed Identity for Media Services and Storage and then lock your storage account. It's assumed that you already created a Video Indexer account and associated with a Media Services and Storage account.


## Assign the Managed Identity and role

1. When you navigate to your Video Indexer account for the first time, we validate if you have the correct role assignments for Media Services and Storage. If not, the following banners that allow you to assign the correct role automatically will appear. If you don’t see the banner for the Storage account, it means your Storage account isn't behind a firewall, or everything is already set.

  :::image type="content" source="./media/storage-behind-firewall/trusted-service-assign-role-banner.png" alt-text="Assign role to Media Services and Storage accounts from the Azure portal":::

1. When you select **Assign Role**, the followinging roles are assigned: `Azure Media Services : Contributor` and `Azure Storage : Storage Blob Data Owner`. You can verify or manually set assignments by navigating to the **Identity** menu of your Video Indexer account and selecting **Azure Role Assignments**.

  :::image type="content" source="./media/storage-behind-firewall/trusted-service-verify-assigned-roles.png" alt-text="Screenshot of assigned roles from the Azure portal.":::

1. Navigate to your Media Services account and select **Storage accounts**.

  :::image type="content" source="./media/storage-behind-firewall/trusted-service-mediaservices-managed-identity-menu.png" alt-text="Screenshot of Assigned Managed Identity role on the connected storage account for Media Services from the Azure portal.":::

1. Select **Managed identity**. A warning that you have no managed identities will appear. Select **Click here** to configure one.

  :::image type="content" source="./media/storage-behind-firewall/trusted-service-mediaservices-managed-identity-selection.png" alt-text="Screenshot of enable System Managed Identity role on the connected storage account for Media Services from the Azure portal.":::

1. Select **User** or **System-assigned** identity. In this case, choose **System-assigned**.
1. Select **Save**.
1. Select **Storage accounts** in the menu and select **Managed identity** again. This time, the banner that you don’t have a managed identity shouldn't appear. Instead, you can now select the managed identity in the dropdown menu.
1. Select **System-assigned**.

  :::image type="content" source="./media/storage-behind-firewall/trusted-service-mediaservices-managed-identity-system-assigned-selection.png" alt-text="Screenshot of Azure portal to select System Managed Identity role on the connected storage account for Media Services from the Azure portal.":::

1. Select **Save**.
1. Navigate to your Storage account. Select **Networking** from the menu and select **Enabled from selected virtual networks and IP addresses** in the **Public network access** section.

  :::image type="content" source="./media/storage-behind-firewall/trusted-service-storage-lock-select-exceptions.png" alt-text="Screenshot of how to disable public access for your storage account and enable exception for trusted services from the Azure portal.":::

1. Under **Exceptions**, make sure that **Allow Azure services on the trusted services list to access this storage account** is selected.

## Summary

This concludes the tutorial. With these steps you've completed the following activities:

1. Assigning the Video Indexer managed-identity the necessary roles to Media Services (Contributor) and Storage (Storage Blob Data Owner).
1. Assigning the Media Services Managed-identity role to the Storage.
1. Locking down your storage account behind firewall and allow Azure Trusted Services to access the Storage account using Managed-identity.

## Next steps

[Disaster recovery](video-indexer-disaster-recovery.md)
