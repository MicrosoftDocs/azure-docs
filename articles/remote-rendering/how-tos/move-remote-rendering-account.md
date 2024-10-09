---
title: Move an Azure Remote Rendering account between regions
description: Move an Azure Remote Rendering account between regions
author: FlorianBorn71
ms.author: flborn
ms.date: 02/01/2022
ms.topic: how-to
ms.custom: subject-moving-resources
#Customer intent: As an Azure service administrator, I want to move my service resources to another Azure region.
---

# Move a Remote Rendering account between regions

This article describes how to move a Remote Rendering account to a different Azure region. While a Remote Rendering account can be used to connect to any [region where Remote Rendering service is available](../reference/regions.md), there are reasons to move your resources to another region. For example, to meet internal policy and governance requirements, or in response to capacity planning requirements.

## Prerequisites

* Make sure that the Remote Rendering account is in the Azure region from which you want to move.
* Remote Rendering accounts can't be moved between regions. You'll have to associate a new Remote Rendering account in your source code to point to the target region, and link your storage account with new Remote Rendering account.

## Prepare and move

### Create a new Remote Rendering account in the target region

Follow steps to create and configure [an Azure Remote Rendering Account](create-an-account.md).

### Update your source code

The next step is to associate your new Remote Rendering account in your source code. Take note of the **Account Key**, **Account ID**, and **Account Domain** values, and use them to update your apps or web services source code.

## Verify

Run your app or web service and verify it's still functional after the move.

## Clean up

To complete the move of the Remote Rendering account, delete the source Remote Rendering or resource group. To do so, select the Remote Rendering account or resource group from your dashboard in the portal and select "Delete" at the top of each page.

## Next steps

In this tutorial, you moved a Remote Rendering account from one region to another and cleaned up the source resources. To learn more about moving resources between regions and disaster recovery in Azure, refer to:

> [!div class="nextstepaction"]
> [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)