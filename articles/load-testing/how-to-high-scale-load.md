---
title: Configure Azure Load Testing for high-scale load tests
titleSuffix: Azure Load Testing
description: Learn how to configure Azure Load Testing to run high-scale load tests, by simulating large amounts of virtual users.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 11/08/2021
ms.topic: how-to

---

# Configure Azure Load Testing to run high-scale load tests

In this article, learn how to configure a high-scale load test with Azure Load Testing. You'll create a high-scale test by simulating a large number of virtual users to generate a high volume of simultaneous application requests.

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  

- An existing Azure Load Testing resource. To create a Load Test resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).

## Requests per second (RPS)

The maximum number of *requests per second* (RPS) that Azure Load Testing can generate depends on the application's latency and the number of *virtual users* (VUs). 

You can apply the following formula: RPS = (# of VUs) * (1/latency).

For example, if application latency is 20 ms, and you're generating a 2000 VUs load, you can achieve around 100,000 RPS.

## Test engine instances

In Azure Load Testing, *test engine* instances are responsible for executing the test plan. If you used an Apache JMeter script to create the test plan, each test engine executes the Apache JMeter script.

The test engine instances run in parallel. They allow you to define how you want to scale out the load test execution for your application.

In the Apache JMeter script, you define the number of parallel threads. This number indicates how many threads each test engine instance executes in parallel. Each thread represents a virtual user. The recommendation is to keep the number of threads below a maximum of 250.

For example, to simulate 1000 threads (or virtual users), set the number of threads in the Apache JMeter script to 250. Then configure the test with four test engine instances (4 x 250 threads).

## Configure your test plan

In this section, you'll configure the scaling settings of your load test.

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Navigate to your Load Testing resource, and select **Tests** from the left navigation to view the list of test plans. Next, select the test from the list by checking the box, and then select **Edit**.

    :::image type="content" source="media/how-to-high-scale-load/edit-test.png" alt-text="Screenshot that shows the list of tests.":::

1. You can also modify the test configuration from the test details page. Select **Configure**, and then **Test** to edit the test.

    :::image type="content" source="media/how-to-high-scale-load/configure-test.png" alt-text="Screenshot that shows how to configure a test from the test details page.":::

1. In the **Edit test** page, navigate to the **Load** tab and configure the **Engine instances** input field.

    :::image type="content" source="media/how-to-high-scale-load/edit-test-load.png" alt-text="Screenshot that shows the Load tab when editing a test.":::

1. Select **Apply** to modify the test and use the new configuration when you rerun the test.

## Next steps

- For information about how to compare test results, see [Compare multiple test results](./how-to-compare-multiple-test-runs.md).

- To learn how to configure automated regression testing, see [Configure automated load testing with Azure Pipelines](./tutorial-cicd-azure-pipelines.md).
