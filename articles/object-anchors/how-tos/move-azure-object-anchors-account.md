---
title: Move an Azure Object Anchors account between regions
description: Move an Azure Object Anchors account between regions
author: ramonarguelles
manager: virivera
services: azure-object-anchors

ms.author: rgarcia
ms.date: 12/02/2021
ms.topic: how-to
ms.custom: subject-moving-resources
ms.service: azure-object-anchors
#Customer intent: As an Azure service administrator, I want to move my service resources to another Azure region.
---

# Move an Object Anchors account between regions

This article describes how to move an Object Anchors account to a different Azure region. You might move your resources to another region for a number of reasons. For example, to take advantage of a new Azure region, to deploy features or services available in specific regions only, to meet internal policy and governance requirements, or in response to capacity planning requirements.

## Prerequisites

* Make sure that the Object Anchors account is in the Azure region from which you want to move.
* Object Anchors accounts can't be moved between regions. You'll have to associate a new Object Anchors account in your source code to point to the target region.

## Prepare and move

### Create a new Object Anchors account in the target region

[!INCLUDE [Create Account](../../../includes/object-anchors-get-started-create-account.md)]

### Update your source code

The next step is to associate your new Object Anchors account in your source code. You already took note of the **Account Key**, **Account ID**, and **Account Domain** values. You can use them to update your apps or web services source code.

## Verify

Run your app or web service and verify it's still functional after the move.

## Clean up

To complete the move of the Object Anchors account, delete the source Object Anchors account or resource group. To do so, select the Object Anchors account or resource group from your dashboard in the portal and select Delete at the top of each page.

## Next steps

In this tutorial, you moved an Object Anchors account from one region to another and cleaned up the source resources. To learn more about moving resources between regions and disaster recovery in Azure, refer to:

> [!div class="nextstepaction"]
> [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)