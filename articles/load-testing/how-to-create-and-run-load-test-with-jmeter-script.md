---
title: Create a JMeter-based load test
titleSuffix: Azure Load Testing
description: 'Learn how to load test a website by using an existing Apache JMeter script and Azure Load Testing.'
services: load-testing
ms.service: load-testing
ms.custom: devx-track-azurecli
ms.topic: how-to
author: ntrogh
ms.author: nicktrog
ms.date: 10/23/2023
adobe-target: true
---

# Load test a website by using a JMeter script in Azure Load Testing

Learn how to use an Apache JMeter script to load test a web application with Azure Load Testing from the Azure portal or by using the Azure CLI. Azure Load Testing enables you to take an existing Apache JMeter script, and use it to run a load test at cloud scale. Learn more about which [JMeter functionality that Azure Load Testing supports](./resource-jmeter-support.md).

Use cases for creating a load test with an existing JMeter script include:

- You want to reuse existing JMeter scripts to test your application.
- You want to test endpoints that aren't HTTP-based, such as databases or message queues. Azure Load Testing supports all communication protocols that JMeter supports.
- To use the CLI commands, Azure CLI version 2.2.0 or later. Run `az --version` to find the version that's installed on your computer. If you need to install or upgrade the Azure CLI, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A JMeter test script (JMX file). If you don't have a test script, get started with the sample script by [cloning or downloading the samples project from GitHub](https://github.com/Azure-Samples/azure-load-testing-samples/tree/main/jmeter-basic-endpoint).

## Create an Azure Load Testing resource

First, you create the top-level resource for Azure Load Testing. It provides a centralized place to view and manage test plans, test results, and related artifacts.

If you already have a load testing resource, skip this section and continue to [Create a load test](#create-a-load-test).

To create a load testing resource:

[!INCLUDE [azure-load-testing-create-portal](./includes/azure-load-testing-create-in-portal/azure-load-testing-create-in-portal.md)]

## Create a load test

Next, you create a load test by uploading an Apache JMeter test script (JMX file). The test script contains the application requests to simulate traffic to your application endpoints.

# [Azure portal](#tab/portal)

To create a load test using an existing JMeter script in the Azure portal:

1. In the [Azure portal](https://portal.azure.com/), go to your Azure Load Testing resource.

1. In the left navigation, select **Tests**  to view all tests.

1. Select **+ Create**, and then select **Upload a JMeter script**.

    :::image type="content" source="./media/how-to-create-and-run-load-test-with-jmeter-script/create-new-test.png" alt-text="Screenshot that shows the Azure Load Testing page and the button for creating a new test." lightbox="./media/how-to-create-and-run-load-test-with-jmeter-script/create-new-test.png":::
    
1. On the **Basics** tab, enter the load test details:

    |Field  |Description  |
    |-|-|
    | **Test name**                | Enter a unique test name. |
    | **Test description**         | (Optional) Enter a load test description. |
    | **Run test after creation**  | Select this setting to automatically start the load test after saving it. |

1. On the **Test plan** tab, select your Apache JMeter script, and then select **Upload** to upload the file to Azure.

    :::image type="content" source="./media/how-to-create-and-run-load-test-with-jmeter-script/create-new-test-test-plan.png" alt-text="Screenshot that shows the Test plan tab." lightbox="./media/how-to-create-and-run-load-test-with-jmeter-script/create-new-test-test-plan.png":::
    
    > [!NOTE]
    > You can upload additional JMeter configuration files or other files that you reference in the JMX file. For example, if your test script uses CSV data sets, you can upload the corresponding *.csv* file(s). See also how to [read data from a CSV file](./how-to-read-csv-data.md). For files other than JMeter scripts and user properties, if the size of the file is greater than 50 MB, zip the file. The size of the zip file should be below 50 MB. Azure Load Testing automatically unzips the file during the test run. Only five zip artifacts are allowed with a maximum of 1000 files in each zip and an uncompressed total size of 1 GB.

1. Select **Review + create**. Review all settings, and then select **Create** to create the load test.

# [Azure CLI](#tab/azure-cli)

To create a load test using an existing JMeter script with the Azure CLI:

1. Set parameter values.

    Specify a unique test ID for your load test, and the name of the JMeter test script (JMX file). If you use an existing test ID, a test run will be added to the test when you run it.

    ```azurecli
    $testId="<test-id>"
    testPlan="<my-jmx-file>"
    ```

1. Use the `azure load create` command to create a load test:

    The following command creates a load test by using uploading the JMeter test script. The test runs on one test engine instance.

    ```azurecli
    az load test create --load-test-resource  $loadTestResource --test-id $testId  --display-name "My CLI Load Test" --description "Created using Az CLI" --test-plan $testPlan --engine-instances 1
    ```

---

You can update the test configuration at any time, for example to upload a different JMX file. Choose your test in the list of tests, and then select **Edit**.

## Run the load test

When Azure Load Testing starts your load test, it first deploys the JMeter script, and any other files onto test engine instances, and then starts the load test.

# [Azure portal](#tab/portal)

If you selected **Run test after creation**, your load test will start automatically. To manually start the load test you created earlier, perform the following steps:

1. Go to your load testing resource, select **Tests** from the left pane, and then select the test that you created earlier.

    :::image type="content" source="./media/how-to-create-and-run-load-test-with-jmeter-script/tests.png" alt-text="Screenshot that shows the list of load tests." lightbox="./media/how-to-create-and-run-load-test-with-jmeter-script/tests.png":::

1. On the test details page, select **Run** or **Run test**. Then, select **Run** on the confirmation pane to start the load test. Optionally, provide a test run description.

    :::image type="content" source="./media/how-to-create-and-run-load-test-with-jmeter-script/run-test-confirm.png" alt-text="Screenshot that shows the run confirmation page." lightbox="./media/how-to-create-and-run-load-test-with-jmeter-script/run-test-confirm.png":::

    > [!TIP]
    > You can stop a load test at any time from the Azure portal.

1. Notice the test run details, statistics, and client metrics in the Azure portal.

    If you have multiple requests in your test script, the charts display all requests, and you can also filter for specific requests.

    :::image type="content" source="./media/how-to-create-and-run-load-test-with-jmeter-script/test-run-aggregated-by-percentile.png" alt-text="Screenshot that shows the test run dashboard." lightbox="./media/how-to-create-and-run-load-test-with-jmeter-script/test-run-aggregated-by-percentile.png":::

    Use the run statistics and error information to identify performance and stability issues for your application under load.

# [Azure CLI](#tab/azure-cli)

To run the load test you created previously with the Azure CLI:

1. Set parameter values.

    Specify a test run ID and display name.

    ```azurecli
    testRunId="run_"`date +"%Y%m%d%_H%M%S"`
    displayName="Run"`date +"%Y/%m/%d_%H:%M:%S"`
    ```

1. Use the `azure load test-run create` command to run a load test:

    ```azurecli
    az load test-run create --load-test-resource $loadTestResource --test-id $testId --test-run-id $testRunId --display-name $displayName --description "Test run from CLI"
    ```

1. Retrieve the client-side test metrics with the `az load test-run metrics list` command:

    ```azurecli
    az load test-run metrics list --load-test-resource $loadTestResource --test-run-id $testRunId --metric-namespace LoadTestRunMetrics
    ```

---

## Convert a URL-based load test to a JMeter-based load test

If you created a URL-based load test, you can convert the test into a JMeter-based load test. Azure Load Testing automatically generates a JMeter script when you create a URL-based load test.

To convert a URL-based load test to a JMeter-based load test:

1. Go to your load testing resource, and select **Tests** to view the list of tests.

    Notice the **Test type** column that indicates whether the test is URL-based or JMeter-based.

1. Select the **ellipsis (...)** for a URL-based load test, and then select **Convert to JMeter script**.

    :::image type="content" source="./media/how-to-create-and-run-load-test-with-jmeter-script/test-list-convert-to-jmeter-script.png" alt-text="Screenshot that shows the list of tests in the Azure portal, highlighting the menu option to convert the test to a JMeter-based test." lightbox="./media/how-to-create-and-run-load-test-with-jmeter-script/test-list-convert-to-jmeter-script.png":::

    Alternately, select the test, and then select **Convert to JMeter script** on the test details page.

1. On the **Convert to JMeter script** page, select **Convert** to convert the test to a JMeter-based test.

    Notice that the test type changed to *JMX* in the test list.

    :::image type="content" source="./media/how-to-create-and-run-load-test-with-jmeter-script/test-list-jmx-test.png" alt-text="Screenshot that shows the list of tests in the Azure portal, highlighting the test type changed to JMX for the converted test." lightbox="./media/how-to-create-and-run-load-test-with-jmeter-script/test-list-jmx-test.png":::

## Related content

- Learn how to [configure your test for high-scale load](./how-to-high-scale-load.md).
- Learn how to [monitor server-side metrics for your application](./how-to-monitor-server-side-metrics.md).
- Learn how to [parameterize a load test with environment variables](./how-to-parameterize-load-tests.md).
