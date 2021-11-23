---
title: Get more insights when testing Azure App Service workloads
titleSuffix: Azure Load Testing
description: 'Learn how to get more insights by using App Service Diagnostics when testing Azure App Service workloads.'
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 11/30/2021
ms.topic: how-to

---

# Get more insights when load testing Azure App Service workloads

In this article, you'll learn how to gain more insights from Azure App Service workloads with Azure Load Testing Preview and App Service Diagnostics.

App Service diagnostics is an intelligent and interactive experience to help you troubleshoot your app with no configuration required. When you do run into issues with your app, App Service diagnostics points out what’s wrong to guide you to the right information to more easily and quickly troubleshoot and resolve the issue.

You can take advantage of App Service diagnostics when running load tests on application that run on Azure App Service.

> [!IMPORTANT]
> Azure Load Testing is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing resource. If you need to create an Azure Load Testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).
- An Azure App Service workload you're running your load test against and that you've added to the app components to monitor during the load test.

## Get more insights when testing an App Service Workload  

In this section, you'll use App Service Diagnostics to get more insights from load testing an Azure App Service workload.

1. Navigate to your Azure Load Testing resource in the [Azure portal](https://portal.azure.com).

1. Select **Tests** to view the list of tests, and then select your test.

1. On the test runs page, select **Configure**, and then select **App Components** to add or remove Azure resources to monitor during the load test.

    :::image type="content" source="media/how-to-appservice-insights/configure-app-components.png" alt-text="Screenshot that shows how to configure app components for a load test.":::  

1. Add your App Service to the list of app components to monitor.

    :::image type="content" source="media/how-to-appservice-insights/test-monitoring-app-service.png" alt-text="Screenshot that shows how to configure the load test to monitor an App Service component.":::  

1. Select **Run** to execute the load test.

    After the test finishes, you'll notice a section about App Service on the test result dashboard.

1. Select the link in the App Service message.

    :::image type="content" source="media/how-to-appservice-insights/test-result-app-service-diagnostics.png" alt-text="Screenshot that shows the test result dashboard with the App Service section.":::

    The link takes you to the App Service Diagnostics page for your Azure App Service. More specifically, the **Availability and Performance** page is shown.

1. Select the different interactive reports that are available in App Service Diagnostics.

    :::image type="content" source="media/how-to-appservice-insights/app-diagnostics-overview.png" alt-text="Screenshot that shows the App Service diagnostics overview.":::

    :::image type="content" source="media/how-to-appservice-insights/app-diagnostics-high-cpu.png" alt-text="Screenshot that shows the App Service diagnostics CPU usage information.":::

    > [!IMPORTANT]
    > Please note that it can take up to 45 minutes for the insights data to be available.

## Next steps

- For information on learning to parameterize load tests, see [Parameterize load tests](./how-to-parameterize-load-tests.md).

- To learn about performance test automation, see [Configure automated performance testing](./tutorial-cicd-azure-pipelines.md)

- You can learn more about App Service diagnostics at [Azure App Service diagnostics overview](/app-service/overview-diagnostics/).