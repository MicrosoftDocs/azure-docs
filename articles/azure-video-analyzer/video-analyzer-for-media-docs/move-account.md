---
title: Moving a Classic account to an Azure Video Analyzer for Media account 
description: This topic explains how to move a classic account to an Azure Video Analyzer for Media. 

ms.topic: how-to
ms.date: 10/13/2021
---

# Move a Classic Account to a Video Analyzer for Media account

Moving a classic account to ARM requires that the Azure Video Analyzer for Media account will be associated with a [media service][docs-ms] account and [user-assigned managed identity][docs-uami]. The managed identity will need to have the permissions of [Contributor][docs-role-contributor] role on the media service. This article describes the steps for creating a new Video Analyzer for Media account.

## [Portal](#tab/portal/)

[!INCLUDE [the video analyzer for media account, the media service and the user-assigned managed identity must be in the same subscription and region](./includes/note-account-ms-uami-same-subscription-and-region.md)]

### Create a Video Analyzer for Media account in the Azure portal

1. Sign in at the [Azure portal](https://portal.azure.com/).
1. Using the search bar at the top, enter **Video Analyzer for Media**.
1. Click on *Video Analyzer for Media* under *Services*.
3. Click **Create**.
4. In the **Create a Video Analyzer for Media resource** section enter required values.

    | Name | Description |
    | ---|---|
    |**Subscription**|If you have more than one subscription, select one from the list of Azure subscriptions that you have access to.|
    |**Resource Group**|Select an existing resource or create a new one. A resource group is a collection of resources that share lifecycle, permissions, and policies. Learn more [here](../../azure-resource-manager/management/overview.md#resource-groups).|
    |**Video Analyzer for Media account**|Select *Connect an existing classic account* option.|
    |**Existing account ID**|Enter the classic account id.|
    |**Resource name**|Enter the name of the new Video Analyzer for Media account.|
    |**Location**|Select the geographic region that will be used deploy the Video Analyzer for Media account. Only the available Video Analyzer for Media regions appear in the drop-down list box. |
    |**Media Services account name**|Select a media services  that the new Video Analyzer for Media account will use to process the videos. You can select an existing media service or you can create a new one. 
    |**User-assigned managed identity**|Select a user-assigned managed identity that the new Video Analyzer for Media account will use to access the media service. You can select an existing user-assigned managed identity or you can create a new one. The user-assignment managed identity will be assigned the role of [Contributor][docs-role-contributor] role on the media service.

1. Click **Review + create** at the bottom of the form.

### Review deployed resources

You can use the Azure portal to check on the account and other resource that were created. After the deployment is finished, select **Go to resource group** to see the account and other resources.

### Clean up resources

When no longer needed, delete the resource group, which deletes the account and all of the resources in the resource group.

1. Select the **Resource group**.
1. On the page for the resource group, select **Delete**.
1. When prompted, type the name of the resource group and then select **Delete**.

---

### Next steps

Learn how to [add contributor role on the media service][docs-contributor-on-ms].


<!-- links -->
[docs-uami]: ../../active-directory/managed-identities-azure-resources/overview.md
[docs-ms]: ../../media-services/latest/media-services-overview.md
[docs-role-contributor]: ../../role-based-access-control/built-in-roles.md#contributor
[docs-contributor-on-ms]: ./add-contributor-role-on-the-media-service.md
