---
title: Give Azure Functions to access a Media Services account
description: Suppose you want to build an “On Air” sign for your broadcasting studio. You can determine when Media Services Live Events are running using the Media Services API but this may be hard to call from an embedded device. Instead, you can expose a simple HTTP API for your embedded device using Azure Functions. Azure Functions could then call Media Services to get the state of a Live Event.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: tutorial
ms.date: 05/17/2021
ms.author: inhenkel
---

# Tutorial: Give Azure Functions to access a Media Services account

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

Suppose you want to build an “On Air” sign for your broadcasting studio. You can determine when Media Services Live Events are running using the Media Services API but this may be hard to call from an embedded device. Instead, you can expose a simple HTTP API for your embedded device using Azure Functions. Azure Functions could then call Media Services to get the state of a Live Event.

> [!NOTE]
> You must have the Owner role in order to assign Managed Identities for storage. Contributor doesn't have sufficient permissions.

This tutorial uses the 2020-05-01 Media Services API.

## Sign in to Azure

To use any of the commands in this article, you first have to be signed in to the subscription that you want to use.

 [!INCLUDE [Sign in to Azure with the CLI](./includes/task-sign-in-azure-cli.md)]

### Set subscription

Use this command to set the subscription that you want to work with.

[!INCLUDE [Sign in to Azure with the CLI](./includes/task-set-azure-subscription-cli.md)]

## Resource names

Before you get started, decide on the names of the resources you'll create.  They should be easily identifiable as a set, especially if you are not planning to use them after you are done testing. Naming rules are different for many resource types so it's best to stick with all lower case. For example, "mediatest1rg" for your resource group name and "mediatest1stor" for your storage account name. Use the same names for each step in this article.

You'll see these names referenced in the commands below.  The names of resources you'll need are:

- your-resource-group-name
- your-storage-account-name
- your-media-services-account-name
- your-region

> [!NOTE]
> The hyphens above are only used to separate guidance words. Because of the inconsistency of naming resources in Azure services, don't use hyphens when you name your resources.
> Also, you don't create the region name.  The region name is determined by Azure.

### List Azure regions

If you're not sure of the actual region name to use, use this command to get a listing:

[!INCLUDE [List Azure regions with the CLI](./includes/task-list-azure-regions-cli.md)]

**This tutorial is different**
