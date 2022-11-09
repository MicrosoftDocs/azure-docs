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

# Get performance insights from App Service diagnostics and Azure Load Testing Preview

Azure Load Testing Preview collects detailed resource metrics across your Azure app components to help identify performance bottlenecks. In this article, you learn how to use App Service Diagnostics to get additional insights when load testing Azure App Service workloads.

[App Service diagnostics](/azure/app-service/overview-diagnostics.md) is an intelligent and interactive way to help troubleshoot your app, with no configuration required. When you run into issues with your app, App Service diagnostics can help you resolve the issue easily and quickly.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing resource. If you need to create an Azure Load Testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).
- An Azure App Service workload that you're running a load test against and that you've added to the app components to monitor during the load test.

## Use App Service diagnostics for your load test

Azure Load Testing lets you monitor server-side metrics for your Azure app components for a load test. You can then visualize and analyze these metrics in the Azure Load Testing dashboard.

When the application you're load testing is hosted on Azure App Service, you can get extra insights by using [App Service diagnostics](/azure/app-service/overview-diagnostics.md).

To view the App Service diagnostics information for your application under load test:

1. Go to the [Azure portal](https://portal.azure.com).

1. Add your App Service resource to the load test app components. Follow the steps in [monitor server-side metrics](./how-to-monitor-server-side-metrics.md) to add your app service.

    :::image type="content" source="media/how-to-appservice-insights/test-monitoring-app-service.png" alt-text="Screenshot of the Monitoring tab when editing a load test in the Azure portal, highlighting the App Service resource.":::

1. Select **Run** to run the load test.

    After the test finishes, you'll notice a section about App Service on the test result dashboard.

    :::image type="content" source="media/how-to-appservice-insights/test-result-app-service-diagnostics.png" alt-text="Screenshot that shows the 'App Service' section on the load testing dashboard in the Azure portal.":::

1. Select the link in **Additional insights** to view the App Service diagnostics information.

    App Service diagnostics enables you to view in-depth information and dashboard about the performance, resource usage, and stability of your app service.

    In the screenshot, you notice that there are concerns about the CPU usage, app performance, and failed requests.

    :::image type="content" source="media/how-to-appservice-insights/app-diagnostics-overview.png" alt-text="Screenshot that shows the App Service diagnostics overview page, with a list of interactive reports on the left pane.":::

    On the left pane, you can drill deeper into specific issues by selecting one the diagnostics reports. For example, the following screenshot shows the **High CPU Analysis** report.

    :::image type="content" source="media/how-to-appservice-insights/app-diagnostics-high-cpu.png" alt-text="Screenshot that shows the App Service diagnostics CPU usage report.":::

    The following screenshot shows the **Web App Slow** report, which gives details and recommendations about application performance.

    :::image type="content" source="media/how-to-appservice-insights/app-diagnostics-web-app-slow.png" alt-text="Screenshot that shows the App Service diagnostics slow application report.":::

    > [!NOTE]
    > It can take up to 45 minutes for the insights data to be displayed on this page.

## Next steps

- Learn how to [parameterize a load test with secrets and environment variables](./how-to-parameterize-load-tests.md).
- Learn how to [identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md) for Azure applications.
- Learn how to [configure automated performance testing](./tutorial-identify-performance-regression-with-cicd.md).
