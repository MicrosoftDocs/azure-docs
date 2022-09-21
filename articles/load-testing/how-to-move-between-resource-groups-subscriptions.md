---
title: Move an Azure Load testing resource to another resource group or subscription
titleSuffix: Azure Load Testing
description: Learn how to move an Azure Load testing resource to another resource group or subscription.
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 09/12/2022
ms.topic: how-to
---

# Move an Azure Load Testing Preview resource to a new resource group or subscription

This article describes how to move your Azure Load Testing Preview resource to either another Azure subscription or another resource group under the same subscription.

If you want to move Azure Load Testing to a new region, see [Move an Azure Load Testing resource to another region](./how-to-move-between-regions.md).

> [!NOTE]
> New resource IDs are created as part of the move. After the resource has been moved, you will need to update your tools and scripts to use the new resource IDs.

When you move an Azure Load Testing resource across resource groups or subscriptions, the following guidance applies:

- Moving a resource to a new resource group or subscription is a metadata change that shouldn't affect the data. For example, the test and test runs data is preserved.

- Moving a resource only moves it to a new resource group or subscription. It doesn't change the location of the resource.

- After the resource move finishes, it may take up to five minutes for the test and test runs data to reflect again in the resource.

- A resource can only be moved when there are no active test runs.

- Moving a resource that has a test that is configured for private endpoint testing to another subscription, will result in an error while running the test. After the move finishes, update the test with a VNet and subnet from the new subscription.

## Move across subscriptions

You can move an Azure Load Testing resource to a different subscription by using the Azure portal.

1. Go to the [Azure portal](https://portal.azure.com/) to manage the resource group containing the resource to move. Search for and select **Resource groups**.

1. Choose the resource group which contains the resource that you want to move.

1. At the top of the page for the resource group, select **Move** and then select **Move to another subscription**. The **Move resources** page opens.

1. Select each of the resources to move.

1. Select the **Subscription** where you want the resource to be moved.

1. Select an existing **Resource group**, or enter a name to have a new resource group created.

1. When you are done, the resource move is validated. If the validation is successful, select that you understand that new resource IDs will be created and that the new IDs will need to be used for the resource after it is moved, and then select **OK**.

## Move across resource groups

You can move  an Azure Load Testing resource to another resource group by using the Azure portal.

1. Go to the Azure portal to manage the resource group containing the resource to move. Search for and select Resource groups.

1. Choose the resource group that contains the resource that you want to move.

1. At the top of the page for the resource group, select **Move** and then select **Move to another resource group**. The **Move resources** page opens.

1. Select each of the resources to move.

1. Select an existing **Resource group**, or enter a name to have a new resource group created.

1. When you are done, the resource move is validated. If the validation is successful, select that you understand that new resource IDs will be created and that the new IDs will need to be used for the resource after it is moved, and then select **OK**.

## Next steps

- You can move many different types of resources between resource groups and subscriptions. For more information, see [Move resources to a new resource group or subscription](/azure/azure-resource-manager/management/move-resource-group-and-subscription).
