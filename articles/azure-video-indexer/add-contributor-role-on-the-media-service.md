---
title: Add Contributor role on the Media Services account
description: This topic explains how to add contributor role on the Media Services account.
ms.topic: how-to
ms.date: 10/13/2021
ms.custom: ignite-fall-2021
ms.author: itnorman
author: IngridAtMicrosoft
---

# Add contributor role to Media Services

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

This article describes how to assign contributor role on the Media Services account.

> [!NOTE]
> If you are creating your Azure AI Video Indexer through the Azure portal UI, the selected Managed identity will be automatically assigned with a contributor permission on the selected Media Service account.

## Prerequisites

1. Azure Media Services (AMS)
2. User-assigned managed identity

> [!NOTE]
> You need an Azure subscription with access to both the [Contributor][docs-role-contributor] role and the [User Access Administrator][docs-role-administrator] role to the Azure Media Services and the User-assigned managed identity. If you don't have the right permissions, ask your account administrator to grant you those permissions. The associated Azure Media Services must be in the same region as the Azure AI Video Indexer account.

## Add Contributor role on the Media Services
### [Azure portal](#tab/portal/)

### Add Contributor role to Media Services using Azure portal

1. Sign in at the [Azure portal](https://portal.azure.com/).
    * Using the search bar at the top, enter **Media Services**.
    * Find and select your Media Service resource.
1. In the pane to the left, click **Access control (IAM)**.
    * Click **Add** > **Add role assignment**. If you don't have permissions to assign roles, the **Add role assignment** option will be disabled.
1. In the Role list, select [Contributor][docs-role-contributor] role and click **Next**.
1. In the **Assign access to**, select *Managed identity* radio button.
    * Click **+Select members** button and **Select managed identities** pane should be pop up.
1. **Select** the following:
    * In the **Subscription**, the subscription where the managed identity is located.
    * In the **Managed identity**, select *User-assigned managed identity*.
    * In the **Select** section, search for the Managed identity you'd like to grant contributor permissions on the Media services resource.    
1. Once you have found the security principal, click to select it.
1. To assign the role, click **Review + assign**

## Next steps

[Create a new Azure Resource Manager based account](create-account-portal.md)

<!-- links -->
[docs-role-contributor]: ../role-based-access-control/built-in-roles.md#contributor
[docs-role-administrator]: ../role-based-access-control/built-in-roles.md#user-access-administrator
