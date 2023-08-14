---
title: Move across resource group or subscription
titleSuffix: Azure Load Testing
description: Learn how to move an Azure Load testing resource to another resource group or subscription.
services: load-testing
ms.service: load-testing
ms.author: ninallam
author: ninallam
ms.date: 07/12/2023
ms.topic: how-to
---

# Move an Azure Load Testing resource to another resource group or subscription

This article describes how to move your Azure Load Testing resource to either another Azure subscription or another resource group under the same subscription.

If you want to move Azure Load Testing to a new region, see [Move an Azure Load Testing resource to another region](./how-to-move-between-regions.md).

When you move an Azure Load Testing resource across resource groups or subscriptions, the following guidance applies:

- Moving a resource to a new resource group or subscription is a metadata change that shouldn't affect the data. For example, the test and test runs data is preserved.

- Moving a resource changes the ID of the resource. The standard format for a resource ID is `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}`. When a resource is moved to a new resource group or subscription, one or more values in the path are impacted. After the resource has been moved, you'll need to update your tools and scripts to use the new resource IDs.

- Moving a resource across subscriptions is allowed only for subscriptions in the same tenant.

- Resource move is not supported for Azure Load Testing resources that are encrypted with a customer-managed key.

- Moving a resource only moves it to a new resource group or subscription. It doesn't change the location of the resource.

- Any service principal that is currently scoped to a resource, resource group or subscription might not have access to the resource after the move.

- Automated resource provisioning using ARM templates or Bicep must be updated to the new resource group and / or subscription.

- For tests that previously ran from Azure Pipelines, the URL to view detailed results from Azure portal will not work after the resources have been moved.

- If the resource is moved across subscriptions, the service limits of the target subscription apply to the resource after the move.  

- Moving a resource that has a test that is configured for private endpoint testing to another subscription, results in an error while running the test. When the move is complete, you must update the test with a VNet and subnet from the new subscription.

## Move across resource groups or subscriptions

You can move an Azure Load Testing resource to a different resource group or subscription by using the Azure portal.

1. Go to the [Azure portal](https://portal.azure.com/).

1. Navigate to the resource that you want to move.

1. On the subscription or resource group overview page, select **Move**.

1. If you're moving the resource to another subscription, select the destination **Subscription**.

1. If you're moving the resource to another resource group, select the destination **Resource group**, or create a new resource group.

1. Select **Next**.

1. When the validation is completes, acknowledge the warning regarding moving resources.

1. Select **OK**.

## Next steps

- You can move many different types of resources between resource groups and subscriptions. For more information, see [Move resources to a new resource group or subscription](/azure/azure-resource-manager/management/move-resource-group-and-subscription).
