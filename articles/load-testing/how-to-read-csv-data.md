---
title: Read CSV data in an Apache JMeter load test
titleSuffix: Azure Load Testing
description: Learn how to read external data from a CSV file in Apache JMeter with Azure Load Testing.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 05/09/2023
ms.topic: how-to 
ms.custom: template-how-to
---

# Read data from a CSV file in JMeter with Azure Load Testing

In this article, you learn how to read data from a comma-separated value (CSV) file in JMeter with Azure Load Testing. You can use the JMeter [CSV Data Set Config element](https://jmeter.apache.org/usermanual/component_reference.html#CSV_Data_Set_Config) in your test script.

Use data from an external CSV file to make your JMeter test script configurable. For example, you might iterate over all customers in a CSV file to pass the customer details into API request.

Get started by [cloning or downloading the samples project from GitHub](https://github.com/Azure-Samples/azure-load-testing-samples/tree/main/jmeter-read-csv).

In this article, you learn how to:

> [!div class="checklist"]
> * Configure your JMeter script to read the CSV file.
> * Add the CSV file to your load test.
> * Optionally, split the CSV file evenly across all test engine instances.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* An Azure load testing resource. To create a load testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md#create-an-azure-load-testing-resource).
* An Apache JMeter test script (JMX).
* (Optional) Apache JMeter GUI to author your test script. To install Apache JMeter, see [Apache JMeter Getting Started](https://jmeter.apache.org/usermanual/get-started.html).

## Configure your JMeter script

In this section, you configure your Apache JMeter script to reference the external CSV file. You use a [CSV Data Set Config element](https://jmeter.apache.org/usermanual/component_reference.html#CSV_Data_Set_Config) to read data from a CSV file.

> [!IMPORTANT]
> Azure Load Testing uploads the JMX file and all related files in a single folder. When you reference an external file in your JMeter script, verify that your only use the file name and *remove any file path references*.

To edit your JMeter script by using the Apache JMeter GUI:

1. Select the **CSV Data Set Config** element in your test script.

1. Update the **Filename** information and remove any file path reference.

1. Optionally, enter the CSV field names in **Variable Names**, when you split the CSV file across test engines.

	Azure Load Testing doesn't preserve the header row when splitting your CSV file. Provide the variable names in the **CSV Data Set Config** element instead of using a header row.

	:::image type="content" source="media/how-to-read-csv-data/update-csv-data-set-config.png" alt-text="Screenshot that shows the JMeter UI to configure a C S V Data Set Config element.":::

1. Repeat the previous steps for every **CSV Data Set Config** element in the script.

1. Save the JMeter script and [upload the script to your load test](./how-to-create-manage-test.md#test-plan).

## Add the CSV file to your load test

When you run a load test with Azure Load Testing, upload all external files alongside the JMeter test script. When the load test starts, Azure Load Testing copies all files to a single folder on each of the test engines instances.

> [!IMPORTANT]
> Azure Load Testing doesn't preserve the header row when splitting your CSV file. Before you add the CSV file to the load test, remove the header row from the file.

# [Azure portal](#tab/portal)

To add a CSV file to your load test by using the Azure portal:

  1. In the [Azure portal](https://portal.azure.com), go to your Azure load testing resource.
  
  1. On the left pane, select **Tests** to view a list of tests.

  1. Select your test from the list by selecting the checkbox, and then select **Edit**.
  
      :::image type="content" source="media/how-to-read-csv-data/edit-test.png" alt-text="Screenshot that shows the list of load tests and the 'Edit' button.":::

  1. On the **Edit test** page, select the **Test plan** tab. 

  1. Select the CSV file from your computer, and then select **Upload** to upload the file to Azure. If the size of the CSV file is greater than 50 MB, zip the file. The size of the zip file should be below 50 MB. Azure Load Testing automatically unzips the file during the test run. Only five zip artifacts are allowed with a maximum of 1000 files in each zip and an uncompressed total size of 1 GB.
  
      :::image type="content" source="media/how-to-read-csv-data/edit-test-upload-csv.png" alt-text="Screenshot of the Test plan tab on the Edit test pane.":::
  
  1. Select **Apply** to modify the test and to use the new configuration when you rerun it.
  

# [Azure Pipelines / GitHub Actions](#tab/pipelines+github)

If you run a load test within your CI/CD workflow, you can add a CSV file to the test configuration YAML file. For more information about running a load test in a CI/CD workflow, see the [Automated regression testing tutorial](./tutorial-identify-performance-regression-with-cicd.md).

To add a CSV file to your load test:

  1. Commit the CSV file to the source control repository that contains the JMX file and YAML test configuration file. If the size of the CSV file is greater than 50 MB, zip the file. The size of the zip file should be below 50 MB. Azure Load Testing automatically unzips the file during the test run. Only five zip artifacts are allowed with a maximum of 1000 files in each zip and an uncompressed total size of 1 GB.

  1. Open your YAML test configuration file in Visual Studio Code or your editor of choice.

  1. Add the CSV file to the `configurationFiles` setting. You can use wildcards or specify multiple individual files. 

        ```yaml
        testName: MyTest
        testPlan: SampleApp.jmx
        description: Run a load test for my sample web app
        engineInstances: 1
        configurationFiles:
        - search-params.csv
        ```
        > [!NOTE]
        > If you store the CSV file in a separate folder, specify the file with a relative path name. For more information, see the [Test configuration YAML syntax](./reference-test-config-yaml.md).
  
  1. Save the YAML configuration file and commit it to your source control repository.
  
        The next time the CI/CD workflow runs, it will use the updated configuration.

---

## Split CSV input data across test engines

By default, Azure Load Testing copies and processes your input files unmodified across all test engine instances. By default, each test engine processes the entire CSV file. Alternately, Azure Load Testing enables you to split the CSV input data evenly across all engine instances. If you have multiple CSV files, each file is split evenly.

For example, if you have a large customer CSV input file, and the load test runs on 10 parallel test engines, then each instance processes 1/10th of the customers.

> [!IMPORTANT]
> Azure Load Testing doesn't preserve the header row when splitting your CSV file. 
> 1. [Configure your JMeter script](#configure-your-jmeter-script) to use variable names when reading the CSV file. 
> 1. Remove the header row from the CSV file before you add it to the load test.

To configure your load test to split input CSV files:

# [Azure portal](#tab/portal)

1. Go to the **Test plan** tab for your load test.

1. Select **Split CSV evenly between Test engines**.

    :::image type="content" source="media/how-to-read-csv-data/configure-test-split-csv.png" alt-text="Screenshot that shows the checkbox to enable splitting input C S V files when configuring a test in the Azure portal.":::

1. Select **Apply** to confirm the configuration changes.

    The next time you run the test, Azure Load Testing splits and processes the CSV file evenly across the test engines.

# [Azure Pipelines / GitHub Actions](#tab/pipelines+github)

1. Open your YAML test configuration file in Visual Studio Code or your editor of choice.

1. Add the `splitAllCSVs` setting and set its value to **True**.

    ```yaml
    testName: MyTest
    testPlan: SampleApp.jmx
    description: Run a load test for my sample web app
    engineInstances: 1
    configurationFiles:
      - customers.csv
    splitAllCSVs: True
    ```

1. Save the YAML configuration file and commit it to your source control repository.
  
    The next time you run the test, Azure Load Testing splits and processes the CSV file evenly across the test engines.

---

## Next steps

- Learn how to [Set up a high-scale load test](./how-to-high-scale-load.md).
- Learn how to [Configure automated performance testing](./tutorial-cicd-azure-pipelines.md).
- Learn how to [use JMeter plugins](./how-to-use-jmeter-plugins.md).
