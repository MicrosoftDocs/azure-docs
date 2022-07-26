---
title: Create an Azure Video Indexer account
description: This article explains how to create an account for Azure Video Indexer.
ms.topic: tutorial
ms.author: itnorman
ms.date: 06/10/2022
---

# Get started with Azure Video Indexer in Azure portal

This Quickstart walks you through the steps to get started with Azure Video Indexer. You'll create an Azure Video Indexer account and its accompanying resources by using the Azure portal.

To start using Azure Video Indexer, you'll need to create an Azure Video Indexer account. The account needs to be associated with a [Media Services][docs-ms] resource and a [managed identity][docs-uami]. The managed identity will need to have Contributor permissions role on the Media Services.

## Prerequisites

### Account types

Before creating a new account, review [Account types](accounts-overview.md).

### Azure level

* This user should be a member of your Azure subscription with either an **Owner** role, or both **Contributor** and **User Access Administrator** roles. A user can be added twice, with two roles. Once with Contributor and once with user Access Administrator. For more information, see [View the access a user has to Azure resources](../role-based-access-control/check-access.md).
* Register the **EventGrid** resource provider using the Azure portal.
    
    In the [Azure portal](https://portal.azure.com), go to **Subscriptions**->[<*subscription*>]->**ResourceProviders**.
Search for **Microsoft.Media** and **Microsoft.EventGrid**. If not in the "Registered" state, select **Register**. It takes a couple of minutes to register. 

### Azure Video Indexer

* Owner<sup>*</sup> role assignment on the Subscription level.

    * Owner* role assignment on the related Azure Media Services (AMS)
    * Owner* role assignment on the related Managed Identity

<sup>*</sub>Or both **Contributor** and **User Access Administrator** roles

## Azure portal

### Create an Azure Video Indexer account in the Azure portal

1. Sign into the [Azure portal](https://portal.azure.com/).
1. Using the search bar at the top, enter **"Azure Video Indexer"**.
1. Select *Azure Video Indexer* under *Services*.

    ![Image of search bar](media/create-account-portal/search-bar.png)
1. Select **Create**.
1. In the **Create an Azure Video Indexer resource** section enter required values. 

    ![Image of how to create an Azure Video Indexer resource.](media/create-account-portal/avi-create-blade.png)
    
    Here are the definitions:
    
    | Name | Description|
    |---|---|
    |**Subscription**|Choose the subscription that you're using to create the Azure Video Indexer account.|
    |**Resource Group**|Choose a resource group where you're creating the Azure Video Indexer account, or select **Create new** to create a resource group.|
    |**Azure Video Indexer account**|Select *Create a new account* option.|
    |**Resource name**|Enter the name of the new Azure Video Indexer account, the name can contain letters, numbers and dashes with no spaces.|
    |**Region**|Select the geographic region that will be used to deploy the Azure Video Indexer account. The location matches the **resource group location** you chose, if you'd like to change the selected location change the selected resource group or create a new one in the preferred location. [Azure region in which Azure Video Indexer is available](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services&regions=all)|
    |**Media Services account name**|Select a Media Services that the new Azure Video Indexer account will use to process the videos. You can select an existing Media Services or you can create a new one. The Media Services must be in the same location you selected.|
    |**Managed identity**|Select an existing **user-assigned** managed identity or **system-assigned** managed identity or both when creating the account. The new Azure Video Indexer account will use the selected managed identity to access the Media Services associated with the account. If both user-assigned and system assigned managed identities will be selected during the account creation the **default** managed identity is the user assigned managed identity. A Contributor role should be assigned on the Media Services.|
1. Select **Review + create** at the bottom of the form.

### Review deployed resource

You can use the Azure portal to validate the Azure Video Indexer account and other resources that were created. After the deployment is finished, select **Go to resource** to see your new Azure Video Indexer account.

### Overview

![Image of Azure Video Indexer overview blade.](media/create-account-portal/avi-overview.png)

Select *Explore Azure Video Indexer's portal* to view your new account on the [Azure Video Indexer portal](https://aka.ms/vi-portal-link).

#### Unique essentials 

|Name|Description|
|---|---|
|Status| When the resource is connected properly, status is **Active**. When there's a problem with the connection between the managed identity and the Media Service instance status will be *Connection to Azure Media Services failed*. Contributor role assignment on the Media Services should be added to the proper managed identity.|
|Managed identity |The name of the default managed identity, user-assigned or system-assigned. The default managed identity can be updated using the *Change* button.|

### Management API

![Image of Generate-access-token.](media/create-account-portal/generate-access-token.png)

Use the *Management API* tab to manually generate access tokens for the account.
This token can be used to authenticate API calls for this account. Each token is valid for one hour.

Choose the following:
* Permission type: **Contributor** or **Reader**
* Scope: **Account**, **Project** or **Video**
    * For **Project** or **Video** you should also insert the matching ID
* Select **Generate**

### Identity

Use the *Identity* tab to manually update the managed identities associated with the Azure Video Indexer resource.
Add new managed identities, switch the default managed identity between user-assigned and system-assigned or set a new user-assigned managed identity. 

---

### Next steps

Learn how to [Upload a video using C#](https://github.com/Azure-Samples/media-services-video-indexer/tree/master/ApiUsage/ArmBased).


<!-- links -->
[docs-uami]: ../active-directory/managed-identities-azure-resources/overview.md
[docs-ms]: /azure/media-services/latest/media-services-overview
[docs-role-contributor]: ../../role-based-access-control/built-in-roles.md#contibutor
[docs-contributor-on-ms]: ./add-contributor-role-on-the-media-service.md
