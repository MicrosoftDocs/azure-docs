---
title: Move an Azure Spatial Anchors account between regions
description: Move an Azure Spatial Anchors account between regions
author: ramonarguelles
manager: virivera
services: azure-spatial-anchors

ms.author: rgarcia
ms.date: 04/07/2022
ms.topic: how-to
ms.custom: subject-moving-resources, devx-track-azurepowershell, devx-track-azurecli
ms.service: azure-spatial-anchors
#Customer intent: As an Azure service administrator, I want to move my service resources to another Azure region.
---

# Move a Spatial Anchors account between regions

This article describes how to move a Spatial Anchors account to a different Azure region. You might move your resources to another region for many reasons. For example, to take advantage of a new Azure region, to deploy features or services available in specific regions only, to meet internal policy and governance requirements, or in response to capacity planning requirements.

## Prerequisites

* Make sure that the Spatial Anchors account is in the Azure region from which you want to move.
* Spatial Anchors accounts can't be moved between regions. You'll have to associate a new Spatial Anchors account in your source code to point to the target region. You'll also have to recreate all the anchors that you had previously created.

## Prepare and move

### Create a new Spatial Anchors account in the target region

[!INCLUDE [Create Spatial Anchors resource](../../../includes/spatial-anchors-get-started-create-resource.md)]

### Update your source code

The next step is to associate your new Spatial Anchors account in your source code. You already took note of the **Account Key**, **Account ID**, and **Account Domain** values. You can use them to update your apps or web services source code.

## Verify

Run your app or web service and verify it's still functional after the move. You'll need to recreate all the anchors that you had previously created.

## Clean up

To complete the move of the Spatial Anchors account, delete the source Spatial Anchors account or resource group. To do so, select the Spatial Anchors account or resource group from your dashboard in the portal and select Delete at the top of each page.

## Next steps

In this tutorial, you moved a Spatial Anchors account from one region to another and cleaned up the source resources. To learn more about moving resources between regions and disaster recovery in Azure, refer to:

> [!div class="nextstepaction"]
> [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)
