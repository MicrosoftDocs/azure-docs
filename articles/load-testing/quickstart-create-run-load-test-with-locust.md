---
title: 'Quickstart: Create a load test with Locust'
titleSuffix: Azure Load Testing
description: 'This quickstart shows how to create a load test by using a Locust test script and Azure Load Testing. Azure Load Testing is a managed, cloud-based load testing tool.'
services: load-testing
ms.service: load-testing
ms.custom:
  - build-2024
ms.topic: quickstart
author: ntrogh
ms.author: nicktrog
ms.date: 04/04/2024
---

# Quickstart: Create and run a load test by using a Locust script and Azure Load Testing

Learn how to create and run a load test with a Locust test script and Azure Load Testing from the Azure portal. Azure Load Testing is a managed service that lets you run a load test at cloud scale. [Locust](https://locust.io/) is an open source load testing tool that enables you to describe all your test in Python code.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Locust test script. If you don't have a test script, get started from the [Locust quickstart](https://docs.locust.io/en/stable/quickstart.html) in the Locust documentation.


Use cases for creating a load test with an existing Locust test script: 

* You want to reuse existing Locust scripts to test your application.
* You want to simulate user traffic to your application and ensure that your application meets your requirements.
* You don't want to set up complex infrastructure for load testing. And, as a developer, you might not be familiar with load testing tools and test script syntax.

In this quickstart, you create a load test for your application endpoint by using Azure Load Testing and the Locust testing framework. You create a load testing resource in the Azure portal, and then create a load test by uploading the Locust test script and configuring the load parameters.

> [!IMPORTANT]
> Support for Locust in Azure Load Testing is currently in limited preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> Sign up [here](https://aka.ms/alt-locust-signup) to onboard your Azure subscription for the preview. 

## Create an Azure Load Testing resource

You first need to create the top-level resource for Azure Load Testing. Azure portal provides a centralized place to view and manage test plans, test results, and related artifacts.

If you already have a load testing resource, skip this section and continue to [Create a load test](#create-a-load-test).

To create a load testing resource:

[!INCLUDE [azure-load-testing-create-portal](./includes/azure-load-testing-create-in-portal/azure-load-testing-create-in-portal.md)]

## Create a load test

Now that you have a load testing resource, you can create a load test by uploading the Locust test script. Azure Load Testing will manage the infrastructure to run your test script at scale and simulate traffic to your application endpoints.

To create a load test for a Locust-based test in the Azure portal:

1. In the [Azure portal](https://portal.azure.com/), go to your Azure Load Testing resource.

1. In the left navigation, select **Tests**  to view all tests.

1. Select **+ Create**, and then select **Upload a script**.

    :::image type="content" source="./media/quickstart-create-and-run-load-test-with-locust/create-new-test.png" alt-text="Screenshot that shows the Azure Load Testing page and the button for creating a new test." lightbox="./media/quickstart-create-and-run-load-test-with-locust/create-new-test.png":::

1. On the **Basics** tab, enter the load test details:

    |Field  |Description  |
    |-|-|
    | **Test name**                | Enter a unique test name. |
    | **Test description**         | (Optional) Enter a load test description. |
    | **Run test after creation**  | Select this setting to automatically start the load test after saving it. |

1. On the **Test plan** tab, select **Locust** as the **Load testing framework**.

    :::image type="content" source="./media/quickstart-create-and-run-load-test-with-locust/select-framework.png" alt-text="Screenshot that shows the option to select Locust framework." lightbox="./media/quickstart-create-and-run-load-test-with-locust/select-framework.png":::

1. Next, select the Locust test script from your computer, and then select **Upload** to upload the file to Azure.

    :::image type="content" source="./media/quickstart-create-and-run-load-test-with-locust/create-new-test-test-plan.png" alt-text="Screenshot that shows the button for uploading test artifacts." lightbox="./media/quickstart-create-and-run-load-test-with-locust/create-new-test-test-plan.png":::

    > [!NOTE]
    > You can also upload other files that you reference in the test script. For example, if your test script uses CSV data sets, you can upload the corresponding *.csv* file(s). To use a configuration file with your Locust script, upload the file and select **Locust configuration** as the **File relevance**
1. On the **Load** tab, enter the details for the amount of load to generate:

    |Field  |Description  |
    |-|-|
    | **Test engine instances** | Select the number of parallel test engine instances. Each test engine simulates the traffic of **Number of users**. |
    | **Number of users**       | Enter the number of virtual users to simulate per test engine instance. |
    | **Duration (minutes)**    | The total duration of the load test in minutes. |
    | **Spawn rate of users**   | (Optional) Rate to add users at (users per second). |
    | **Host endpoint**   | (Optional) The HTTP endpoint URL. For example, https://www.contoso.com/products.|

1. Select **Review + create**. Review all settings, and then select **Create** to create the load test.

You can update the test configuration at any time, for example to upload a different Locust test file, or to modify the load parameters. Choose your test in the list of tests, and then select **Edit**.

## Run the load test


If you selected **Run test after creation**, your load test will start automatically. To manually start the load test you created earlier, perform the following steps:

1. Go to your load testing resource, select **Tests** from the left pane, and then select the test that you created earlier.

    :::image type="content" source="./media/quickstart-create-and-run-load-test-with-locust/tests.png" alt-text="Screenshot that shows the list of load tests." lightbox="./media/quickstart-create-and-run-load-test-with-locust/tests.png":::

1. On the test details page, select **Run** or **Run test**. Then, select **Run** on the confirmation pane to start the load test. Optionally, provide a test run description.

    :::image type="content" source="./media/quickstart-create-and-run-load-test-with-locust/run-test-confirm.png" alt-text="Screenshot that shows the run confirmation page." lightbox="./media/quickstart-create-and-run-load-test-with-locust/run-test-confirm.png":::

    > [!TIP]
    > You can stop a load test at any time from the Azure portal.
1. Notice the test run details, statistics, and client metrics in the Azure portal.

    If you have multiple requests in your test script, the charts display all requests, and you can also filter for specific requests. In the **Sampler statistics** section, you can view the statistics per request in a tabular format.

    :::image type="content" source="./media/quickstart-create-and-run-load-test-with-locust/test-run-aggregated-by-percentile.png" alt-text="Screenshot that shows the test run dashboard." lightbox="./media/quickstart-create-and-run-load-test-with-locust/test-run-aggregated-by-percentile.png":::

    Use the run statistics and error information to identify performance and stability issues for your application under load.

## Summary

In this quickstart, you created and ran a load test with Azure Load Testing by using a Locust test script. Azure Load Testing abstracts the complexity of setting up the infrastructure for simulating high-scale user load for your application.

You can further expand the load test to also monitor server-side metrics of the application under load, and to specify test fail metrics to get alerted when the application doesn't meet your requirements. To ensure that the application continues to perform well, you can also integrate load testing as part of your continuous integration and continuous deployment (CI/CD) workflow.

## Related content

- Learn how to [monitor server-side metrics for your application](./how-to-monitor-server-side-metrics.md).
- Learn how to [parameterize a load test with environment variables](./how-to-parameterize-load-tests.md).
