---
title: Load testing for Azure App Service
titleSuffix: Azure Load Testing
description: 'Learn how to use Azure Load Testing with apps hosted on Azure App Service. Run load tests, use environment variables, and gain insights with server metrics and diagnostics.'
services: load-testing
ms.service: azure-load-testing
ms.author: ninallam
author: ninallam
ms.date: 06/30/2023
ms.topic: conceptual

---

# Load testing your Azure App Service applications

In this article, you'll learn about how Azure Load Testing can be used to test applications hosted on Azure App Service.  Azure App Service is a fully managed service that enables you to build, deploy, and scale web applications and APIs in the cloud. 

With Azure Load Testing, you can simulate real-world, large-scale traffic to your application and services. Even though [Azure App Service](/azure/app-service/overview) can scale automatically, when you run load tests with Azure Load Testing, you'll experience **increased reliability, performance, and cost optimization** and you'll:

- Ensure that all application components, not only the web application, can handle the expected load.
  
- Verify that the application meets your performance and stability requirements.

- Use application resource metrics and diagnostics to identify performance bottleneck across the entire application.
  
- Avoid over-allocation of computing resources and reduce cost inefficiencies.
  
- Detect performance regressions early by integrating load testing in your CI/CD pipeline and specifying test fail criteria.

## Traffic simulation with load tests 

You can create a load test to simulate traffic to your application on Azure App Service. Azure Load Testing provides two options to create a load test:

- Create a URL-based quick test
- Use an Apache JMeter script (JMX file)

After you create and run a load test, you can [monitor the resource metrics](#monitor) for the web application and all dependent Azure components to identify performance and scalability issues.

### Create a URL-based load test

You can create a URL-based load test directly from your Azure App Service web app in the Azure portal. When you create the load test, you can select a specific deployment slot and use the prepopulated endpoint URL.

The following screenshot shows how to create a URL-based load test in the Azure portal.

Get started by [creating a URL-based load test for Azure App Service](./how-to-create-load-test-app-service.md).

### Create a load test by uploading a JMeter script

Azure Load Testing provides high-fidelity support of JMeter. You can create a new load test by uploading an Apache JMeter script. You might use this approach in the following scenarios:

- Test multiple pages or endpoints in a single test
- Test authenticated endpoints
- Pass parameters to the load test, such as environment variables or secrets
- Test non-HTTP based endpoints, such as database connections
- Configure more advanced load patters
- Reuse existing JMeter scripts

Get started [create a load test by uploading a JMeter script](./how-to-create-and-run-load-test-with-jmeter-script.md).

If you previously created a [URL-based test](#create-a-url-based-load-test), Azure Load Testing generates a JMeter test script. You can download this generated test script, modify or extend it, and then reupload the script.

<a name="monitor"></a>

## Monitor your apps for bottlenecks and provisioning issues 

During a load test, Azure Load Testing collects [metrics](./concept-load-testing-concepts.md#metrics) about the test run:

- Client-side metrics: test engine metrics, such as the end-to-end response time, number of requests per second, or the error percentage. These metrics give an overall indication whether the application can support the simulated user load.

- Server-side metrics: resource metrics of the Azure application components, such as CPU percentage of the app service plan, HTTP response codes, or database resource usage.

Use the Azure Load Testing dashboard to analyze the test run metrics and identify performance bottlenecks in your application, or find out if you over-provisioned some compute resources. For example, you could evaluate if the service plan instances are right-sized for your workload.

:::image type="content" source="./media/concept-load-test-app-service/load-test-results-dashboard.png" alt-text="Screenshot that shows the load test results dashboard in the Azure portal." lightbox="./media/concept-load-test-app-service/load-test-results-dashboard.png":::

Learn more about how to [monitor server-side metrics in Azure Load Testing](./how-to-monitor-server-side-metrics.md).

For applications that are hosted on Azure App Service, you can use [App Service diagnostics](/azure/app-service/overview-diagnostics) to get extra insights into the performance and health of the application. When you add an app service application component to your load test configuration, the load testing dashboard provides a direct link to the App Service diagnostics dashboard for your App service resource.

:::image type="content" source="./media/concept-load-test-app-service/test-result-app-service-diagnostics.png" alt-text="Screenshot that shows the 'App Service' section on the load testing dashboard in the Azure portal." lightbox="./media/concept-load-test-app-service/test-result-app-service-diagnostics.png":::

## Customize your load test's failure criteria

Test fail criteria enable you to configure conditions for load test client-side metrics. If a load test run doesn't meet these conditions, the test is considered to fail.  Start [configuring fail criteria for your load test](./how-to-define-test-criteria.md).

For example, you can specify that the average response time of requests, or that the percentage of failed requests is above a given threshold. You can add fail criteria to your load test at any time, regardless if it's a quick test or if you uploaded a JMeter script.

When you run load tests as part of your CI/CD pipeline, you can use test fail criteria to identify performance regressions with an application build.

:::image type="content" source="./media/concept-load-test-app-service/load-test-configure-test-criteria.png" alt-text="Screenshot that shows the test criteria page for a load test in the Azure portal." lightbox="./media/concept-load-test-app-service/load-test-configure-test-criteria.png":::

## Use parameters to test across deployment slots

When you configure a load test, you can specify parameters to pass environment variables or secrets to the load test script. These parameters make your test script reusable and reconfigurable. Learn how to [use parameters to pass environment variables to a load test](./how-to-parameterize-load-tests.md).

One example is using a parameter as an environment variable so you can avoid storing the application endpoint URL in the test script. You can also use environment variables to pass other configuration settings to the JMeter test script. For example, you might pass the number of virtual users, or the file name of a [CSV input file](./how-to-read-csv-data.md) to the test script.

Another use for parameters is when you want to reuse your test script across multiple [Azure App Service deployment slots](/azure/app-service/deploy-staging-slots). Deployment slots are live apps with their own host names and separate URLs. Use a parameter for the application endpoint and then you can set up staging environments for your application. 

:::image type="content" source="./media/concept-load-test-app-service/quick-test-parameters.png" alt-text="Screenshot that shows the Parameters page of a quick test in the Azure portal, highlighting the parameters for the target URL." lightbox="./media/concept-load-test-app-service/quick-test-parameters.png":::


## Next steps

Learn how to:
- [Create a URL-based load test for Azure App Service](./how-to-create-load-test-app-service.md).
- [Configure automated performance testing](./quickstart-add-load-test-cicd.md).
- [Identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md) for Azure applications.
