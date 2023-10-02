---
title: Create an Azure AI Video Indexer account
description: This article explains how to create an account for Azure AI Video Indexer.
ms.topic: tutorial
ms.date: 06/10/2022
ms.author: itnorman
author: IngridAtMicrosoft
---
 
# Tutorial: create an ARM-based account with Azure portal

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

[!INCLUDE [Gate notice](./includes/face-limited-access.md)]

To start using unlimited features and robust capabilities of Azure AI Video Indexer, you need to create an Azure AI Video Indexer unlimited account. 

This tutorial walks you through the steps of creating the Azure AI Video Indexer account and its accompanying resources by using the Azure portal. The account that gets created is ARM (Azure Resource Manager) account. For information about different account types, see [Overview of account types](accounts-overview.md).

## Prerequisites

* You should be a member of your Azure subscription with either an **Owner** role, or both **Contributor** and **User Access Administrator** roles. You can be added twice, with two roles, once with **Contributor** and once with **User Access Administrator**. For more information, see [View the access a user has to Azure resources](../role-based-access-control/check-access.md).
* Register the **EventGrid** resource provider using the Azure portal.
    
    In the [Azure portal](https://portal.azure.com), go to **Subscriptions**->[<*subscription*>]->**ResourceProviders**.
Search for **Microsoft.Media** and **Microsoft.EventGrid**. If not in the registered state, select **Register**. It takes a couple of minutes to register. 
* Have an **Owner** role (or **Contributor** and **User Access Administrator** roles) assignment on the associated Azure Media Services (AMS). You select the AMS account during the Azure AI Video Indexer account creation, as described below.
* Have an **Owner** role (or **Contributor** and **User Access Administrator** roles) assignment on the related managed identity.
    
## Use the Azure portal to create an Azure AI Video Indexer account

1. Sign in to the [Azure portal](https://portal.azure.com).

    Alternatively, you can start creating the **unlimited** account from the [videoindexer.ai](https://www.videoindexer.ai) website.
1. Using the search bar at the top, enter **"Video Indexer"**.
1. Select **Video Indexer** under **Services**.
1. Select **Create**.
1. In the Create an Azure AI Video Indexer resource section, enter required values (the descriptions follow after the image). 

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/create-account-portal/avi-create-blade.png" alt-text="Screenshot showing how to create an Azure AI Video Indexer resource.":::
    
    Here are the definitions:
    
    | Name | Description|
    |---|---|
    |**Subscription**|Choose the subscription to use. If you're a member of only one subscription, you'll see that name. If there are multiple choices, choose a subscription in which your user has the required role.
    |**Resource group**|Select an existing resource group or create a new one. A resource group is a collection of resources that share lifecycle, permissions, and policies. Learn more [here](../azure-resource-manager/management/overview.md#resource-groups).|
    |**Resource name**|This will be the name of the new Azure AI Video Indexer account. The name can contain letters, numbers and dashes with no spaces.|
    |**Region**|Select the Azure region that will be used to deploy the Azure AI Video Indexer account. The region matches the resource group region you chose.  If you'd like to change the selected region, change the selected resource group or create a new one in the preferred region. [Azure region in which Azure AI Video Indexer is available](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services&regions=all)|
    |**Existing content**|If you have existing classic Video Indexer accounts, you can choose to have the videos, files, and data associated with an existing classic account connected to the new account. See the following article to learn more [Connect the classic account to ARM](connect-classic-account-to-arm.md)
    |**Available classic accounts**|Classic accounts available in the chosen subscription, resource group, and region.|
    |**Media Services account name**|Select a Media Services that the new Azure AI Video Indexer account will use to process the videos. You can select an existing Media Services or you can create a new one. The Media Services must be in the same region you selected for your Azure AI Video Indexer account.|
    |**Storage account** (appears when creating a new AMS account)|Choose or create a new storage account in the same resource group.|
    |**Managed identity**|Select an existing user-assigned managed identity or system-assigned managed identity or both when creating the account. The new Azure AI Video Indexer account will use the selected managed identity to access the Media Services associated with the account. If both user-assigned and system assigned managed identities will be selected during the account creation the **default** managed identity is the user-assigned managed identity. A contributor role should be assigned on the Media Services.|
1. Select **Review + create** at the bottom of the form.

### Review deployed resource

You can use the Azure portal to validate the Azure AI Video Indexer account and other resources that were created. After the deployment is finished, select **Go to resource** to see your new Azure AI Video Indexer account.

## The Overview tab of the account

This tab enables you to view details about your account.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/create-account-portal/avi-overview.png" alt-text="Screenshot showing the Overview tab.":::

Select **Explore Azure AI Video Indexer's portal** to view your new account on the [Azure AI Video Indexer website](https://aka.ms/vi-portal-link).

### Essential details

|Name|Description|
|---|---|
|Status| When the resource is connected properly, the status is **Active**. When there's a problem with the connection between the managed identity and the Media Service instance, the status will be *Connection to Azure Media Services failed*. Contributor role assignment on the Media Services should be added to the proper managed identity.|
|Managed identity |The name of the default managed identity, user-assigned or system-assigned. The default managed identity can be updated using the **Change** button.|

## The Management tab of the account

This tab contains sections for:

* getting an access token for the account
* managing identities

### Management API 

Use the **Management API** tab to manually generate access tokens for the account.
This token can be used to authenticate API calls for this account. Each token is valid for one hour.

#### To get the access token

Choose the following:

* Permission type: **Contributor** or **Reader**
* Scope: **Account**, **Project** or **Video**

    * For **Project** or **Video** you should also insert the matching ID.
* Select **Generate**

### Identity 

Use the **Identity** tab to manually update the managed identities associated with the Azure AI Video Indexer resource.

Add new managed identities, switch the default managed identity between user-assigned and system-assigned or set a new user-assigned managed identity.

## Next steps

Learn how to [Upload a video using C#](https://github.com/Azure-Samples/media-services-video-indexer/blob/master/API-Samples/C%23/ArmBased/).


<!-- links -->
[docs-uami]: ../active-directory/managed-identities-azure-resources/overview.md
[docs-ms]: /azure/media-services/latest/media-services-overview
[docs-role-contributor]: ../../role-based-access-control/built-in-roles.md#contibutor
[docs-contributor-on-ms]: ./add-contributor-role-on-the-media-service.md
