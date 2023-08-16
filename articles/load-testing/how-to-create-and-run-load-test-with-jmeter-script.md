---
title: Create a JMeter-based load test
titleSuffix: Azure Load Testing
description: 'Learn how to load test a website by using an existing Apache JMeter script and Azure Load Testing.'
services: load-testing
ms.service: load-testing
ms.topic: how-to
author: ntrogh
ms.author: nicktrog
ms.date: 10/02/2022
adobe-target: true
---

# Load test a website by using an existing JMeter script in Azure Load Testing

Learn how to use an Apache JMeter script to load test a web application with Azure Load Testing from the Azure portal. Azure Load Testing enables you to take an existing Apache JMeter script, and use it to run a load test at cloud scale. Learn more about which [JMeter functionality that Azure Load Testing supports](./resource-jmeter-support.md).

Use cases for creating a load test with an existing JMeter script include:

- You want to reuse existing JMeter scripts to test your application.
- You want to test multiple endpoints in a single load test.
- You have a data-driven load test. For example, you want to [read CSV data in a load test](./how-to-read-csv-data.md).
- You want to test endpoints that are not HTTP-based, such as databases or message queues. Azure Load Testing supports all communication protocols that JMeter supports.

If you want to create a load test without a JMeter script, learn how you can [create a URL-based load test in the Azure portal](./quickstart-create-and-run-load-test.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure Load Testing resource. If you need to create an Azure Load Testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).

- [Clone or download the samples project from GitHub](https://github.com/Azure-Samples/azure-load-testing-samples/tree/main/jmeter-basic-endpoint)

## Create an Apache JMeter script

If you already have a script, you can skip to [Create a load test](#create-a-load-test). In this section, you'll create a sample JMeter test script to load test a single web endpoint.

You can also use the [Apache JMeter test script recorder](https://jmeter.apache.org/usermanual/jmeter_proxy_step_by_step.html) to record the requests while navigating the application in a browser. Alternatively, [import cURL commands](https://jmeter.apache.org/usermanual/curl.html) to generate the requests in the JMeter test script.

To get started with a sample JMeter script:

1. [Clone or download the samples project from GitHub](https://github.com/Azure-Samples/azure-load-testing-samples/tree/main/jmeter-basic-endpoint)

1. Open the *SampleTest.jmx* file in a text editor.

    This script simulates a load test of five virtual users that simultaneously access a web endpoint, and takes 2 minutes to complete.

1. Set the value of the `HTTPSampler.domain` node to the host name of your endpoint.

    For example, if you want to test the endpoint `https://www.contoso.com/app/products`, the host name is `www.contoso.com`.

    > [!CAUTION]
    > Don't include `https` or `http` in the endpoint URL.

    :::code language="xml" source="~/azure-load-testing-samples/jmeter-basic-endpoint/sample.jmx" range="29-46" highlight="5":::

1. Set the value of the `HTTPSampler.path` node to the path of your endpoint.

    For example, the path for the URL `https://www.contoso.com/app/products` would be `/app/products`.

    :::code language="xml" source="~/azure-load-testing-samples/jmeter-basic-endpoint/sample.jmx" range="29-46" highlight="9":::

1. Save and close the file.

    > [!IMPORTANT]
    > Don't include any Personally Identifiable Information (PII) in the sampler name in the JMeter script. The sampler names appear in the Azure Load Testing test run results dashboard.

## Create a load test

When you create a load test in Azure Load Testing, you specify a JMeter script to define the [load test plan](./how-to-create-manage-test.md#test-plan). An Azure Load Testing resource can contain multiple load tests.

When you [create a quick test by using a URL](./quickstart-create-and-run-load-test.md), Azure Load Testing automatically generates the corresponding JMeter script.

To create a load test using an existing JMeter script in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) by using the credentials for your Azure subscription.

1. Go to your Azure Load Testing resource, select **Tests** from the left pane, select **+ Create**, and then select **Upload a JMeter script**.

    :::image type="content" source="./media/how-to-create-and-run-load-test-with-jmeter-script/create-new-test.png" alt-text="Screenshot that shows the Azure Load Testing page and the button for creating a new test." :::
    
1. On the **Basics** tab, enter the **Test name** and **Test description** information. Optionally, you can select the **Run test after creation** checkbox.

    :::image type="content" source="./media/how-to-create-and-run-load-test-with-jmeter-script/create-new-test-basics.png" alt-text="Screenshot that shows the Basics tab for creating a test." :::

1. On the **Test plan** tab, select your Apache JMeter script, and then select **Upload** to upload the file to Azure.

    :::image type="content" source="./media/how-to-create-and-run-load-test-with-jmeter-script/create-new-test-test-plan.png" alt-text="Screenshot that shows the Test plan tab." :::
    
    > [!NOTE]
    > You can upload additional JMeter configuration files or other files that you reference in the JMX file. For example, if your test script uses CSV data sets, you can upload the corresponding *.csv* file(s). See also how to [read data from a CSV file](./how-to-read-csv-data.md). For files other than JMeter scripts and user properties, if the size of the file is greater than 50 MB, zip the file. The size of the zip file should be below 50 MB. Azure Load Testing automatically unzips the file during the test run. Only five zip artifacts are allowed with a maximum of 1000 files in each zip and an uncompressed total size of 1 GB.

1. Select **Review + create**. Review all settings, and then select **Create** to create the load test.

You can update the test configuration at any time, for example to upload a different JMX file. Choose your test in the list of tests, and then select **Edit**.

## Run the load test

When Azure Load Testing starts your load test, it will first deploy the JMeter script, and any other files onto test engine instances, and then start the load test.

If you selected **Run test after creation**, your load test will start automatically. To manually start the load test you created earlier, perform the following steps:

1. Go to your Load Testing resource, select **Tests** from the left pane, and then select the test that you created earlier.

    :::image type="content" source="./media/how-to-create-and-run-load-test-with-jmeter-script/tests.png" alt-text="Screenshot that shows the list of load tests." :::

1. On the test details page, select **Run** or **Run test**. Then, select **Run** on the confirmation pane to start the load test. Optionally, provide a test run description.

    :::image type="content" source="./media/how-to-create-and-run-load-test-with-jmeter-script/run-test-confirm.png" alt-text="Screenshot that shows the run confirmation page." :::

    > [!TIP]
    > You can stop a load test at any time from the Azure portal.

1. Notice the test run details, statistics, and client metrics in the Azure portal.

    :::image type="content" source="./media/how-to-create-and-run-load-test-with-jmeter-script/test-run-aggregated-by-percentile.png" alt-text="Screenshot that shows the test run dashboard." :::

    Use the run statistics and error information to identify performance and stability issues for your application under load.

## Next steps

You've created a cloud-based load test based on an existing JMeter test script. For Azure-hosted applications, you can also [monitor server-side metrics](./how-to-monitor-server-side-metrics.md) for further application insights.

- Learn how to [export test results](./how-to-export-test-results.md).
- Learn how to [parameterize a load test with environment variables](./how-to-parameterize-load-tests.md).
- Learn how to [configure your test for high-scale load](./how-to-high-scale-load.md).
