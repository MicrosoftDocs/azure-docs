---
title: Create an Azure Video Analyzer for Media account
description: This topic explains how to create an account for Azure Video Analyzer for Media.
ms.topic: tutorial
ms.author: itnorman
ms.date: 10/13/2021
ms.custom: ignite-fall-2021
---

# Get started with Azure Video Analyzer for Media in Azure portal

This Quickstart walks you through the steps to get started with Azure Video Analyzer for Media. You will create an Azure Video Analyzer for Media account and its accompanying resources by using the Azure portal.

To start using Azure Video Analyzer for Media, you will need to create a Video Analyzer for Media account. The account needs to be associated with a [Media Services][docs-ms] resource and a [User-assigned managed identity][docs-uami]. The managed identity will need to have Contributor permissions role on the Media Services.

## Prerequisites
> [!NOTE]
> You'll need an Azure subscription where you have access to both the Contributor role and the User Access Administrator role to the resource group under which you will create new resources, and Contributor role on both Azure Media Services and the User-assigned managed identity. If you don't have the right permissions, ask your account administrator to grant you those permissions. The associated Azure Media Services must be in the same region as the Video Analyzer for Media account.


## Azure portal

### Create a Video Analyzer for Media account in the Azure portal

1. Sign into the [Azure portal](https://portal.azure.com/).
1. Using the search bar at the top, enter **"Video Analyzer for Media"**.
1. Click on *Video Analyzer for Media* under *Services*.

    ![Image of search bar](media/create-video-analyzer-for-media-account/search-bar1.png)

1. Click **Create**.
1. In the **Create a Video Analyzer for Media resource** section enter required values.

    ![Image of create account](media/create-video-analyzer-for-media-account/create-account-blade.png)


| Name | Description |
| ---|---|
|**Subscription**|Choose the subscription that you are using to create the Video Analyzer for Media account.|
|**Resource Group**|Choose a resource group where you are creating the Video Analyzer for Media account, or select **Create new** to create a resource group.|
|**Video Analyzer for Media account**|Select *Create a new account* option.|
|**Resource name**|Enter the name of the new Video Analyzer for Media account, the name can contain letters, numbers and dashes with no spaces.|
|**Location**|Select the geographic region that will be used to deploy the Video Analyzer for Media account. The location matches the **resource group location** you chose, if you'd like to change the selected location change the selected resource group or create a new one in the preferred location. [Azure region in which Video Analyzer for Media is available](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services&regions=all)|
|**Media Services account name**|Select a Media Services that the new Video Analyzer for Media account will use to process the videos. You can select an existing Media Services or you can create a new one. The Media Services must be in the same location you selected.|
|**User-assigned managed identity**|Select a user-assigned managed identity that the new Video Analyzer for Media account will use to access the Media Services. You can select an existing user-assigned managed identity or you can create a new one. The user-assignment managed identity will be assigned the role of Contributor role on the Media Services.|

1. Click **Review + create** at the bottom of the form.

### Review deployed resource

You can use the Azure portal to validate the Azure Video Analyzer for Media account and other resources that were created. After the deployment is finished, select **Go to resource** to see your new Video Analyzer for Media account.

### Overview

![Image of overview](media/create-video-analyzer-for-media-account/overview-screenshot.png)

Click on *Explore Video Analyzer for Media's portal* to view your new account on the [Azure Video Analyzer for Media portal](https://aka.ms/vi-portal-link)

### Management API

![Image of Generate-access-token](media/create-video-analyzer-for-media-account/generate-access-token.png)

Use the *Management API* tab to manually generate access tokens for the account.
This token can be used to authenticate API calls for this account. Each token is valid for one hour.

Choose the following:
* Permission type: **Contributor** or **Reader**
* Scope: **Account**, **Project** or **Video**
    * For **Project** or **Video** you should also insert the matching ID
* Click **Generate**

---

### Next steps

Learn how to [Upload a video using C#](https://github.com/Azure-Samples/media-services-video-indexer/tree/master/ApiUsage/ArmBased).


<!-- links -->
[docs-uami]: ../active-directory/managed-identities-azure-resources/overview.md
[docs-ms]: /media-services/latest/media-services-overview
[docs-role-contributor]: ../../role-based-access-control/built-in-roles.md#contibutor
[docs-contributor-on-ms]: ./add-contributor-role-on-the-media-service.md
