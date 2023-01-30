---
title: Create and manage tests
titleSuffix: Azure Load Testing
description: 'Learn how to create and manage tests in your Azure Load Testing Preview resource.'
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 05/30/2022
ms.topic: how-to
---
<!-- Intent: As a user I want to configure the test plan for a load test, so that I can successfully run a load test -->

# Create and manage tests in Azure Load Testing Preview

Learn how to create and manage [tests](./concept-load-testing-concepts.md#test) in your Azure Load Testing Preview resource.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* An Azure Load Testing resource. To create a Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md#create-an-azure-load-testing-resource).

## Create a test

There are two options to create a load test for Azure Load Testing resource in the Azure portal:

- Create a quick test by using a web application URL.
- Create a test by uploading a JMeter test script (JMX).

:::image type="content" source="media/how-to-create-manage-test/create-test-dropdown.png" alt-text="Screenshot that shows the options to create a new test in the Azure portal.":::

### Create a quick test by using a URL

To load test a single web endpoint, use the quick test experience in the Azure portal. Specify the application endpoint URL and basic load parameters to create and run a load test. For more information, see our [quickstart for creating and running a test by using a URL](./quickstart-create-and-run-load-test.md).

1. In the [Azure portal](https://portal.azure.com), and go to your Azure Load Testing resource.

1. Select **Quick test** on the **Overview** page.

    Alternately, select **Tests** in the left pane, select **+ Create**, and then select **Create a quick test**.

1. Enter the URL and load parameters.

    :::image type="content" source="media/how-to-create-manage-test/create-quick-test.png" alt-text="Screenshot that shows the page for creating a quick test in the Azure portal.":::

1. Select **Run test** to start the load test.

    Azure Load Testing automatically generates a JMeter test script, and configures your test to scale across multiple test engines, based on your load parameters.
    
    You can edit the test configuration at time after creating it. For example to [monitor server-side metrics](./how-to-monitor-server-side-metrics.md), [configure high scale load](./how-to-high-scale-load.md), or to edit the generated JMX file.

### Create a test by using a JMeter script

To reuse an existing JMeter test script, or for more advanced test scenarios, create a test by uploading a JMX file. For example, to [read data from a CSV input file](./how-to-read-csv-data.md), or to [configure JMeter user properties](./how-to-configure-user-properties.md). For more information, see [Create a load test by using an existing JMeter script](./how-to-create-and-run-load-test-with-jmeter-script.md).

If you're not familiar with creating a JMeter script, see [Getting started with Apache JMeter](https://jmeter.apache.org/usermanual/get-started.html).

1. In the [Azure portal](https://portal.azure.com), and go to your Azure Load Testing resource.

1. Select **Create** on the **Overview** page. 
    
    Alternately, select **Tests** in the left pane, select **+ Create**, and then select **Upload a JMeter script**.

1. On the **Basics** page, enter the basic test information.

    If you select **Run test after creation**, the test will start automatically. You can start your test manually at any time, after creating it.

    :::image type="content" source="media/how-to-create-manage-test/create-jmeter-test.png" alt-text="Screenshot that shows the page for creating a test with a J Meter script in the Azure portal.":::

## Test plan

The test plan contains all files that are needed for running your load test. At a minimum, the test plan should contain one `*.jmx` JMeter script. Azure Load Testing only supports one JMX file per load test. In addition, you can include a user property file, configuration files, or input data files.

1. Go to the **Test plan**.
1. Select all files from your local machine, and upload them to Azure.

    :::image type="content" source="media/how-to-create-manage-test/test-plan-upload-files.png" alt-text="Screenshot that shows the test plan page for creating a test in the Azure portal, highlighting the upload functionality.":::

<!-- 1. Optionally, upload a zip archive instead of uploading the individual data and configuration files.

    Azure Load Testing will unpack the zip archive on the test engine(s) when provisioning the test.
    
    > [!IMPORTANT]
    > The JMX file and user properties file can't be placed in the zip archive.
    >
    > The maximum upload size for a zip archive is 50 MB.

    :::image type="content" source="media/how-to-create-manage-test/test-plan-upload-zip.png" alt-text="Screenshot that shows the test plan page for creating a test in the Azure portal, highlighting an uploaded zip archive.":::
 -->
If you've previously created a quick test, you can edit the test plan at any time. You can add files to the test plan, or download and edit the generated JMeter script. Download a file by selecting the file name in the list.

### Split CSV input data across test engines

By default, Azure Load Testing copies and processes your input files unmodified across all test engine instances. Azure Load Testing enables you to split the CSV input data evenly across all engine instances. If you have multiple CSV files, each file will be split evenly.

For example, if you have a large customer CSV input file, and the load test runs on 10 parallel test engines, then each instance will process 1/10th of the customers.

Azure Load Testing doesn't preserve the header row in your CSV file when splitting a CSV file. For more information about how to configure your JMeter script and CSV file, see [Read data from a CSV file](./how-to-read-csv-data.md).

:::image type="content" source="media/how-to-create-manage-test/configure-test-split-csv.png" alt-text="Screenshot that shows the checkbox to enable splitting input C S V files when configuring a test in the Azure portal.":::

## Parameters

You can use parameters to make your test plan configurable. Specify key-value pairs in the load test configuration, and then reference their value in the JMeter script by using the parameter name.

There are two types of parameters:

- Environment variables. For example, to specify the domain name of the web application.
- Secrets, backed by Azure Key Vault. For example, to pass an authentication token in an HTTP request.

You can specify the managed identity to use for accessing your key vault.

For more information, see [Parameterize a load test with environment variables and secrets](./how-to-parameterize-load-tests.md).

:::image type="content" source="media/how-to-create-manage-test/configure-parameters.png" alt-text="Screenshot that shows how to configure parameters when creating a test in the Azure portal.":::

## Load

Configure the number of test engine instances, and Azure Load Testing automatically scales your load test across all instances. You configure the number of virtual users, or threads, in the JMeter script and the engine instances then run the script in parallel. For more information, see [Configure a test for high-scale load](./how-to-high-scale-load.md).

:::image type="content" source="media/how-to-create-manage-test/configure-test-engine-instances.png" alt-text="Screenshot that shows how to configure the number of test engine instances when creating a test in the Azure portal.":::

## Test criteria

You can specify test failure criteria based on client metrics. When a load test surpasses the threshold for a metric, the load test has a **Failed** status. For more information, see [Configure test failure criteria](./how-to-define-test-criteria.md).

You can use the following client metrics:

- Average **Response time**.
- **Error** percentage.

:::image type="content" source="media/how-to-create-manage-test/configure-test-criteria.png" alt-text="Screenshot that shows how to configure test criteria when creating a test in the Azure portal.":::

## Monitoring

For Azure-hosted applications, Azure Load Testing can capture detailed resource metrics for the Azure app components. These metrics enable you to [analyze application performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md).

When you edit a load test, you can select the Azure app component that you want to monitor. Azure Load Testing selects the most relevant resource metrics. You can add or remove resource metrics for each of the app components at any time.

:::image type="content" source="media/how-to-create-manage-test/configure-monitoring.png" alt-text="Screenshot that shows how to configure the Azure app components to monitor when creating a test in the Azure portal.":::

When the load test finishes, the test result dashboard shows a graph for each of the Azure app components and resource metrics.

:::image type="content" source="media/how-to-create-manage-test/test-result-dashboard.png" alt-text="Screenshot that shows the test result dashboard in the Azure portal.":::

For more information, see [Configure server-side monitoring](./how-to-monitor-server-side-metrics.md).

## Manage

If you already have a load test, you can start a new run, delete the load test, edit the test configuration, or compare test runs.

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.
1. On the left pane, select **Tests** to view the list of load tests, and then select your test.

:::image type="content" source="media/how-to-create-manage-test/manage-load-test.png" alt-text="Screenshot that shows the tests page in the Azure portal, highlighting the action bar.":::

You can perform the following actions:

- Refresh the list of test runs.
- Start a new test run. The run uses the current test configuration settings.
- Delete the load test. All test runs for the load test are also deleted.
- Configure the test configuration:
    - Configure the test plan. You can add or remove any of the files for the load test. If you want to update a file, first remove it and then add the updated version.
    - Add or remove Azure app components.
    - Configure resource metrics for the app components. Azure Load Testing automatically selects the relevant resource metrics for each app component. Add or remove metrics for any of the app components in the load test.
- [Compare test runs](./how-to-compare-multiple-test-runs.md). Select two or more test runs in the list to visually compare them in the results dashboard.

## Next steps

- [Identify performance bottlenecks with Azure Load Testing in the Azure portal](./quickstart-create-and-run-load-test.md)
- [Set up automated load testing with CI/CD](./tutorial-identify-performance-regression-with-cicd.md)
