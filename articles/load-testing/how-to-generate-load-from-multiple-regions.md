---
title: Generate load from multiple regions
titleSuffix: Azure Load Testing
description: Learn how to create a geo-distributed load test in Azure Load Testing. Generate load from multiple Azure regions simultaneously.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
ms.custom: references_regions, build-2024
author: ntrogh
ms.date: 05/10/2024
ms.topic: how-to
# CustomerIntent: As a tester, I want to understand how I can generate load from multiple regions, so that I can validate that my application runs correctly for geo-distributed users.
---
# Generate load from multiple regions with Azure Load Testing

In this article, you learn how to configure a load test with Azure Load Testing to generate load from multiple regions simultaneously. You can specify the Azure regions from which to generate the load, and the percentage of load for each region. By default, Azure Load Testing creates load only from the Azure region associated with the load testing resource.

To generate load simultaneously from different regions and simulate users accessing your application from multiple geographical areas, select from any of the [Azure regions where Azure Load Testing](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=load-testing) is available.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure load testing resource. If you need to create a load testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).

## Configure load distribution for a load test

You can configure the load distribution when you create a load test, or you can modify an existing load test.

To specify the load distribution for a load test in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), go to your load testing resource.

1. On the left pane, select **Tests** to view a list of tests. Select your test and then select **Edit**.

    :::image type="content" source="media/how-to-export-test-results/test-list.png" alt-text="Screenshot that shows the list of tests for an Azure Load Testing resource." lightbox="media/how-to-export-test-results/test-list.png":::  

    Alternately, create a new load test by selecting **Create** > **Create a URL-based test** or **Create** > **Upload a JMeter script**.

1. Go to the **Load** tab, and then select **Add/Edit regions** to modify the list of Azure regions to generate load from.

    :::image type="content" source="media/how-to-generate-load-from-multiple-regions/select-add-edit-regions.png" alt-text="Screenshot that shows the option to add or edit regions for load distribution."::: 

1. In the **Add regions** window, select, or unselect one or more regions, and then select **Apply**.

    You can select up to 5 regions from any of the Azure regions where Azure Load Testing is available.
   
    :::image type="content" source="media/how-to-generate-load-from-multiple-regions/select-add-edit-regions.png" alt-text="Screenshot that shows the selection of regions to distribute load.":::   

1. Optionally, update the **% of load** or **Number of engines** to update the percentage of load to be generated from each region.

    The total number of engines corresponds with the value you specified in **Engine instances**.

    :::image type="content" source="media/how-to-generate-load-from-multiple-regions/distribute-load.png" alt-text="Screenshot that shows the option update the number of engines to update load distribution."::: 

> [!IMPORTANT]
> Load distribution is only enabled for tests against public endpoints. Test traffic mode is set to **Public** when you select the **Distribute load across regions** checkbox. 

## Related content

- Learn more about [Configuring high-scale load tests](./how-to-high-scale-load.md).
