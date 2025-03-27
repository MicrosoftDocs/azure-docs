---
title: Manage usage limits on Azure Load Testing resource
titleSuffix: Azure Load Testing
description: Learn how to manage usage limits an Azure Load testing resource.
services: load-testing
ms.service: azure-load-testing
ms.custom: manage-usage-limits
ms.author: ninallam
author: ninallam
ms.date: 02/17/2017
ms.topic: how-to
---

# Manage usage limits on Azure Load Testing resource

This article describes how to manage usage limits on an Azure Load Testing resource. Azure Load Testing now offers the ability to set usage limits on resources to help you manage your consumption and avoid overspending. This feature allows you to control the total consumption for a resource by setting monthly Virtual User Hours (VUH) limits. This ensures that you do not exceed your budget within a month. This capability provides the flexibility of a consumption-based pricing along with the predictability of not exceeding the budget.

## Prerequisites

- You have an Azure Load Testing resource that you want to enable usage limits on.

- You have at least Contributor role to manage limits and Reader role to view limits on the Azure Load Testing resource. Learn more about how to [manage access in Azure Load Testing](./how-to-assign-roles.md).

## Enable usage limits

You can set limits for a resource to control the total consumption of Virtual User Hours (VUH) for a month. Once the limit is reached, you cannot run tests for the resource until the next month. When a resource reaches the limit, and in-progress tests are stopped. Follow these steps to enable usage limits on an Azure Load Testing resource:

1. In the Azure portal, search and select **Azure Load Testing**.

1. Select your Azure Load Testing resource.

1. In the resource **Overview** page, select **Usage limits**.

1. In the **Usage limits** pane, select **Enable usage limits**.

1. Enter the **Monthly Virtual User Hours (VUH) limit** that you want to set for the resource.

1. Select **Apply**.

    :::image type="content" source="media/how-to-manage-usage-limits/enable-usage-limits.png" alt-text="Screenshot that shows how to enable usage limits on an Azure Load Testing resource.":::

> [!IMPORTANT]
>  In-progress tests will stop on a best-effort basis. Actual VUH usage may slightly exceed the limit.

## Modify usage limits

You can modify the usage limits for a resource at any time. Follow these steps to modify the usage limits on an Azure Load Testing resource:

1. In the Azure portal, search and select **Azure Load Testing**.

1. Select your Azure Load Testing resource.

1. In the resource **Overview** page, select **Usage limits**.

1. To disable usage limits, turn off the **Enable usage limits** selection.

1. To modify the usage limits, update the **Monthly Virtual User Hours (VUH) limit**.

1. Select **Apply**.

## Next steps

- To know the actual price for your usage, sign in to the [Azure Pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=load-testing).