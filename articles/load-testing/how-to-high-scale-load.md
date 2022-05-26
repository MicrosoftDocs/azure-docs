---
title: Configure Azure Load Testing for high-scale load tests
titleSuffix: Azure Load Testing
description: Learn how to configure Azure Load Testing to run high-scale load tests by simulating large amounts of virtual users.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 11/30/2021
ms.topic: how-to

---

# Configure Azure Load Testing Preview for high-scale load

In this article, learn how to set up a load test for high-scale load by using Azure Load Testing Preview. To simulate a large number of virtual users, you'll configure the test engine instances.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  

- An existing Azure Load Testing resource. To create an Azure Load Testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).

## Determine requests per second

The maximum number of *requests per second* (RPS) that Azure Load Testing can generate depends on the application's *latency* and the number of *virtual users* (VUs). Application latency is the total time from sending an application request by the test engine to receiving the response.

You can apply the following formula: RPS = (# of VUs) * (1/latency in seconds).

For example, if application latency is 20 milliseconds (0.02 seconds), and you're generating a load of 2,000 VUs, you can achieve around 100,000 RPS (2000 * 1/0.02s).

Apache JMeter only reports requests that made it to the server and back, either successful or not. If Apache JMeter is unable to connect to your application, the actual number of requests per second will be lower than the maximum value. Possible causes might be that the server is too busy to handle the request, or that an TLS/SSL certificate is missing. To diagnose connection problems, you can check the **Errors** chart in the load testing dashboard and [download the load test log files](./how-to-find-download-logs.md).

## Test engine instances

In Azure Load Testing, *test engine* instances are responsible for executing a test plan. If you use an Apache JMeter script to create the test plan, each test engine executes the Apache JMeter script.

The test engine instances run in parallel. They allow you to define how you want to scale out the load test execution for your application.

In the Apache JMeter script, you define the number of parallel threads. This number indicates how many threads each test engine instance executes in parallel. Each thread represents a virtual user. We recommend that you keep the number of threads below a maximum of 250.

For example, to simulate 1,000 threads (or virtual users), set the number of threads in the Apache JMeter script to 250. Then configure the test with four test engine instances (that is, 4 x 250 threads).

The location of the Azure Load Testing resource determines the location of the test engine instances. All test engine instances within a Load Testing resource are hosted in the same Azure region.

> [!IMPORTANT]
> For preview release, Azure Load Testing supports up to 45 engine instances for a test run.

## Configure your test plan

In this section, you configure the scaling settings of your load test.

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Go to your Load Testing resource. On the left pane, select **Tests** to view the list of load tests.

1. In the list, select your load test, and then select **Edit**.

    :::image type="content" source="media/how-to-high-scale-load/edit-test.png" alt-text="Screenshot that shows the list of load tests and the 'Edit' button.":::

1. You can also edit the test configuration from the test details page. To do so, select **Configure**, and then select **Test**.

    :::image type="content" source="media/how-to-high-scale-load/configure-test.png" alt-text="Screenshot that shows the 'Configure' and 'Test' buttons on the test details page.":::

1. On the **Edit test** page, select the **Load** tab. Use the **Engine instances** slider control to update the number of test engine instances, or enter the value directly in the input box.

    :::image type="content" source="media/how-to-high-scale-load/edit-test-load.png" alt-text="Screenshot of the 'Load' tab on the 'Edit test' pane.":::

1. Select **Apply** to modify the test and use the new configuration when you rerun it.

## Service quotas and limits

All Azure services set default limits and quotas for resources and features. The following table describes the maximum limits for Azure Load Testing.

|Resource  |Limit  |
|---------|---------|
|Maximum concurrent engine instances that can be utilized per region per subscription     |    100     |
|Maximum concurrent test runs per region per subscription     |    25     |

You can increase the default limits and quotas by requesting the increase through an [Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

1. Select **create a support ticket**.

1. Provide a summary of your issue.

1. Select **Issue type** as *Technical*.

1. Select your subscription. Then, select **Service Type** as *Azure Load Testing - Preview*.

1. Select **Problem type** as *Test Execution*.

1. Select **Problem subtype** as *Provisioning stalls or fails*.

## Next steps

- For more information about comparing test results, see [Compare multiple test results](./how-to-compare-multiple-test-runs.md).

- To learn about performance test automation, see [Configure automated performance testing](./tutorial-cicd-azure-pipelines.md).
