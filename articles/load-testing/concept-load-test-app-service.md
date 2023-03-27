---
title: Load test apps on Azure App Service
titleSuffix: Azure Load Testing
description: 'Learn how to use Azure Load Testing on Azure App Service apps. Run load tests, use environment variables, and gain insights with server metrics and diagnostics.'
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 03/23/2023
ms.topic: conceptual

---

# Load test web apps on Azure App Service with Azure Load Testing

This article shows how to use Azure Load Testing with applications hosted on Azure App Service. You learn how to run a load test to validate your application's performance. Use environment variables to make your load test more configurable. This feature allows you to reuse your load test across different deployment slots. During and after the test, you can get detailed insights by using server-side metrics and App Service diagnostics, which helps you to identify and troubleshoot any potential issues.

[Azure App Service](/azure/app-service/overview) is a fully managed HTTP-based service that enables you to build, deploy, and scale web applications and APIs in the cloud. You can develop in your favorite language, be it .NET, .NET Core, Java, Ruby, Node.js, PHP, or Python. Applications run and scale with ease on both Windows and Linux-based environments.

## Why load test Azure App Service web apps?

Even though Azure App Service is a fully managed service for running applications, load testing can offer significant benefits in terms of reliability, performance, and cost optimization:

- Validate that your application and all dependent application components can handle your expected load
- Verify that your application meets your performance requirements, such as maximum response time or latency
- Identify performance bottlenecks within your application
- Do more with less: right-size your computing resources
- Ensure that new releases don't introduce performance regressions

Often, applications consist of multiple application components besides the app service application. For example, the application might use a database or other data storage solution, invoke dependent serverless functions, or use a caching solution for improving performance. Each of these application components contributes to the availability and performance of your overall application. By running a load test, you can validate that the entire application can support the expected user load without failures. Also, you can verify that the requests meet your performance and availability requirements.

The application implementation and algorithms might affect application performance and stability under load. For example, storing data in memory might lead to excessive memory consumption and application stability issues. You can use load testing to perform a *soak test* and simulate sustained user load over a longer period of time, to identify such problems in the application implementation.

Each application component has different options for allocating computing resources and scalability settings. For example, an app service always runs in an [App Service plan](/azure/app-service/overview-hosting-plans). An App Service plan defines a set of compute resources for a web app to run. Optionally, you can choose to enable [autoscaling](/azure/azure-monitor/autoscale/autoscale-overview) to automatically add more resources, based on specific metrics. With load testing, you can ensure that you add the right resources to match the characteristics of your application. For example, if your application is memory-intensive, you might choose compute instances that have more memory. Also, by [monitoring application metrics](./how-to-monitor-server-side-metrics.md) during the load test, you can also optimize costs by allocating the right type and amount of computing resources.

By integrating load testing in your CI/CD pipeline and by [adding fail criteria to your load test](./how-to-define-test-criteria.md), you can quickly identify performance regressions introduced by application changes. For example, adding an external service call in the application might result in the overall response time to surpass your maximum response time requirement.

## Create a load test for an app on Azure App Service

Azure Load Testing enables you to create load tests for your application in two ways:

- Create a URL-based quick test
- Use an existing Apache JMeter script (JMX file)

Use the quick test experience to create a load test for a specific endpoint URL, directly from within the Azure portal. For example, use the App Service web app *default domain* to perform a load test of the web application home page. You can specify a number of basic load test configuration settings, such as the number of [virtual users](./concept-load-testing-concepts.md#virtual-users), test duration, and [ramp-up time](./concept-load-testing-concepts.md#ramp-up-time). Azure Load Testing then generates the corresponding JMeter test script, and runs it against your endpoint. You can modify the test script and configuration settings at any time.

Alternately, create a new load test by uploading an existing JMeter script. Use this approach to load test multiple pages or endpoints in a single test, to test authenticated endpoints, use parameters in the test script, or to use more advanced load patterns. Azure Load Testing provides high-fidelity support of JMeter to enable you to reuse existing load test scripts.

If you get started with load testing, you might first create a quick test, and then further modify and extend the test script that Azure Load Testing generated.

After you create and run your load test, Azure Load Testing provides a dashboard with test run statistics, such as [response time](./concept-load-testing-concepts.md#response-time), error percentage and [throughput](./concept-load-testing-concepts.md#requests-per-second-rps).

## Use test fail criteria

The Azure Load Testing dashboard provides insights about a specific load test run and how the application responds to simulated load. To verify that your application can meet your performance and availability requirements, specify *load test fail criteria*.

Test fail criteria enable you to configure conditions for load test *client-side metrics*. If a load test run doesn't meet these conditions, the test is considered to fail. For example, specify that the average response time of requests, or that the percentage of failed requests is above a given threshold. You can add fail criteria to your load test at any time, regardless if it's a quick test or if you uploaded a JMeter script.

When you run load tests as part of your CI/CD pipeline, you can use test fail criteria to quickly identify performance regressions with an application build.

Learn how to [configure test fail criteria](./how-to-define-test-criteria.md) for your load test.

## Monitor application metrics

### Server-side metrics in Azure Load Testing

Azure Load Testing lets you monitor server-side metrics for your Azure app components for a load test. You can then visualize and analyze these metrics in the Azure Load Testing dashboard.

Azure Load Testing collects detailed resource metrics across your Azure app components to help identify performance bottlenecks.

- Add application component (App Service Plan, App Service)
- Default metrics added
- You can select additional metrics
- Link to server-side metrics docs

### App Service Diagnostics

<!--     
    - What is?
    - How to access
    - Link to App Service Diagnostics docs
    - What extra info do you get?
 -->
When the application you're load testing is hosted on Azure App Service, you can get extra insights by using [App Service diagnostics](/azure/app-service/overview-diagnostics).

App Service diagnostics is an intelligent and interactive way to help troubleshoot your app, with no configuration required. When you run into issues with your app, App Service diagnostics can help you resolve the issue easily and quickly.

Azure Load Testing provides a direct link from the test results dashboard, if you've added an App Service app component to your test configuration.


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

## Parameterize your test for deployment slots

- Requires a JMeter script
- Deployment slots -> different endpoint
- Avoid hard-coding 
- Use env vars to pass deployment slot and make URL configurable in JMeter script
- Also use for other configuration parameters (for example, number of virtual users, ramp-up time, and so on.)

## Authenticated endpoints

- Use shared secrets or certificates
- Pass secrets into the JMeter script (store in Azure Key Vault or in CI/CD secrets store)
- [Azure AD authentication config](/azure/app-service/configure-authentication-provider-aad)
- [Blog post](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/authentication-with-azure-load-testing-series-azure-active/ba-p/3718002)

## Next steps

- Learn how to [configure your test for high-scale load](./how-to-high-scale-load.md).
- Learn how to [configure automated performance testing](./tutorial-identify-performance-regression-with-cicd.md).
- Learn how to [identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md) for Azure applications.
