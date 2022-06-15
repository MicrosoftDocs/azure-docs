---
title: 'Quickstart: Run an end-to-end test with Microsoft Playwright Testing'
description: 'This quickstart shows how to run cross-browser, cross-platform end-to-end tests with Microsoft Playwright Testing.'
services: playwright-testing
ms.service: playwright-testing
ms.topic: quickstart
author: ntrogh
ms.author: nicktrog
ms.date: 06/08/2022
---

# Quickstart: Run end-to-end tests with Microsoft Playwright Testing Preview

This quickstart describes how to load test a web application with Microsoft Playwright Testing Preview from the Azure portal without prior knowledge about load testing tools. You'll first create an Azure Load Testing resource, and then create a load test by using the web application URL.

After you complete this quickstart, you'll have a resource and load test that you can use for other tutorials.

> [!IMPORTANT]
> Microsoft Playwright Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create an Azure Load Testing resource

First, you'll create the top-level resource for Azure Load Testing. It provides a centralized place to view and manage test plans, test results, and related artifacts.

## Create a load test

Azure Load Testing enables you to quickly create a load test from the Azure portal. You'll specify the web application URL and the basic load testing parameters. Azure Load Testing abstracts the complexity of creating the load test script and provisioning the compute infrastructure.

1. Go to the **Overview** page of your Azure Load Testing resource.

1. On the **Get started** tab, select **Quick test**.

1. On the **Quickstart test** page, enter the **Test URL**.

1. (Optional) Update the **Number of virtual users** to the total number of virtual users. 

1. (Optional) Update the **Test duration** and **Ramp up time** for the test.

1. Select **Run test** to create and start the load test.

## View the test results

Once the load test starts, you'll be redirected to the test run dashboard. While the load test is running, Azure Load Testing captures both client-side metrics and server-side metrics. In this section, you'll use the dashboard to monitor the client-side metrics.

* On the test run dashboard, you can see the streaming client-side metrics while the test is running. By default, the data refreshes every five seconds.

* Optionally, change the display filters to view a specific time range, result percentile, or error type.

## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

You now have an Azure Load Testing resource, which you used to load test an external website.

You can reuse this resource to learn how to identify performance bottlenecks in an Azure-hosted application by using server-side metrics.

> [!div class="nextstepaction"]
> [Identify web app issues with end-to-end tests](./tutorial-identify-issues-with-end-to-end-web-tests.md)
