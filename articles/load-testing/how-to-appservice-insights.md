---
title: Get load test insights from App Service diagnostics
titleSuffix: Azure Load Testing
description: 'Learn how to get detailed application performance insights from App Service diagnostics and Azure Load Testing.'
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 10/24/2022
ms.topic: how-to

---

# Get detailed performance insights from App Service diagnostics and Azure Load Testing Preview

Azure Load Testing Preview collects detailed resource metrics to help you identify performance bottlenecks across your Azure application components. In this article, you learn how to use App Service Diagnostics to get detailed insights while load testing Azure App Service workloads.

[App Service diagnostics](/azure/app-service/overview-diagnostics.md) is an intelligent and interactive way to help troubleshoot your app, with no configuration required. When you run into issues with your app, App Service diagnostics can help you resolve the issue easily and quickly.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing resource. If you need to create an Azure Load Testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).
- An Azure App Service workload that you're running a load test against and that you've added to the app components to monitor during the load test.

## Get more insights when you test an App Service workload  

In this section, you use [App Service diagnostics](/azure/app-service/overview-diagnostics.md) to get more insights from load testing an Azure App Service workload.

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.

1. On the left pane, select **Tests** to view the list of tests, and then select your test.

1. On the test runs page, select **Configure**, and then select **App Components** to add or remove Azure resources to monitor during the load test.

    :::image type="content" source="media/how-to-appservice-insights/configure-app-components.png" alt-text="Screenshot that shows the 'Configure' and 'App Components' buttons for configuring the load test.":::  

1. Select the **Monitoring** tab, and then add your app service to the list of app components to monitor.

    :::image type="content" source="media/how-to-appservice-insights/test-monitoring-app-service.png" alt-text="Screenshot of the 'Edit test' pane for selecting and app service resource to monitor.":::  

1. Select **Run** to execute the load test.

    After the test finishes, you'll notice a section about App Service on the test result dashboard.

1. Select the **here** link in the App Service message.

    :::image type="content" source="media/how-to-appservice-insights/test-result-app-service-diagnostics.png" alt-text="Screenshot that shows the 'App Service' section on the test result dashboard.":::

    Your Azure App Service **Availability and Performance** page opens, which displays your App Service diagnostics.

    :::image type="content" source="media/how-to-appservice-insights/app-diagnostics-overview.png" alt-text="Screenshot that shows the App Service diagnostics overview page, with a list of interactive reports on the left pane.":::

1. On the left pane, select any of the various interactive reports that are available in App Service diagnostics.

    :::image type="content" source="media/how-to-appservice-insights/app-diagnostics-high-cpu.png" alt-text="Screenshot that shows the App Service diagnostics CPU usage report.":::

    > [!IMPORTANT]
    > It can take up to 45 minutes for the insights data to be displayed on this page.

## Next steps

- Learn how to [identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md) for Azure applications.
- Learn how to [parameterize a load test with secrets and environment variables](./how-to-parameterize-load-tests.md).
- Learn how to [configure automated performance testing](./tutorial-identify-performance-regression-with-cicd.md).
