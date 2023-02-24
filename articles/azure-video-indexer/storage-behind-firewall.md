---
title: Use Video Indexer with storage behind firewall
description: This article gives an overview how to configure Azure Video Indexer to use storage behind firewall.
ms.topic: article
ms.date: 02/24/2023
ms.author: juliako
---

# Configure Video Indexer to work with storage accounts behind firewall
When you create a Video Indexer account, you must associate it with a Media Services and Storage account. Video Indexer can access Media Services and Storage using system authentication or Managed Identity authentication. Video Indexer validates that the user adding the association has access the Media Services and Storage account with Azure Resource Manager RBAC.

If you want to use a firewall to secure your storage account and enable trusted storage, [Managed Identities](https://learn.microsoft.com/azure/media-services/latest/concept-managed-identities) authentication is the preferred option to allow Video Indexer access through the firewall. It allows Video Indexer and Media Services to access the storage account that has been configured without public access to go through [trusted storage access.](https://learn.microsoft.com/azure/storage/common/storage-network-security?tabs=azure-portal#grant-access-to-trusted-azure-services)

Follow these steps to enable Managed Identity for Media Services and Storage and finally lock you storage account. We assume you already created a Video Indexer account and associated with a Media Services and Storage account.

## Assign the Managed Identity and role
1. When you navigate for the first time to your Video Indexer account we will validate if we have the correct role assignments for Media Services and Storage. If not we will show the following banners to allow you to assign the correct role automatically. If you don’t see the banner for Storage account this means you’re Storage account is not behind firewall or everything is already set.

:::image type="content" source="./media/storage-behind-firewall/trusted-service-assign-role-banner.png" alt-text="Assign role to Media Services and Storage accounts from the Azure portal":::

1. When you click on "Assign Role" we will assign the follow roles: `Azure Media Services : Contributor` and `Azure Storage : Storage Blob Data Owner`. You can verify or manually set assignments by navigating to the "Identity" menu of your Video Indexer account and click on "Azure Role Assignments"

:::image type="content" source="./media/storage-behind-firewall/trusted-service-verify-assigned-roles.png" alt-text="Verify assigned roles from the Azure portal":::

1. Navigate to your Media Services account and select "Storage accounts"

:::image type="content" source="./media/storage-behind-firewall/trusted-service-ams-mi-menu.png" alt-text="Assigned Managed Identity role on the connected storage account for Media Services from the Azure portal":::

1. Select "Managed identity". This will show you a warning that you have no managed identities. Click on the "Click here" to configure one first.

:::image type="content" source="./media/storage-behind-firewall/trusted-service-ams-mi-selection.png" alt-text="Enable System Managed Identity role on the connected storage account for Media Services from the Azure portal":::

1. Select User or System-assigned identity. In this case we are going with "System-assigned".
1. Click Save
1. Go back to "Storage accounts" in the menu and select "Managed identity" again. This time it should not show the banner that you don’t have a managed identity. Instead you can now select the managed identity in the pull down menu. In this case "System-assigned"

:::image type="content" source="./media/storage-behind-firewall/trusted-service-ams-mi-system-assigned-selection.png" alt-text="Select System Managed Identity role on the connected storage account for Media Services from the Azure portal":::

1. Click Save
1. Now navigate to your Storage account. Select "Networking" from the menu and select "Enabled from selected virtual networks and IP addresses" in the "Public network access" section.

:::image type="content" source="./media/storage-behind-firewall/trusted-service-storage-lock-select-exceptions.png" alt-text="Disable public access for your storage account and enable exception for trusted services from the Azure portal":::

1. Make sure under "Exceptions" you select "Allow Azure services on the trusted services list to access this storage account" is selected.

## Summary
This concluded this tutorial. With these steps you have accomplished the following directives:
1. Assign the Video Indexer managed-identity the necessary roles to Media Services (Contributor) and Storage (Storage Blob Data Owner)
1. Assign the Media Services Managed-identity role to the Storage account
1. Lock down your storage account behind firewall and allow Azure Trusted Services to access the Storage account using Managed-identity. 

## Next steps

[Disaster recovery](video-indexer-disaster-recovery.md)
