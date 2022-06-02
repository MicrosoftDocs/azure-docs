---
title: Read CSV data in an Apache JMeter load test
titleSuffix: Azure Load Testing
description: Learn how to read external data from a CSV file in Apache JMeter and Azure Load Testing.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 12/15/2021
ms.topic: how-to 
ms.custom: template-how-to
---

# Read data from a CSV file in JMeter and Azure Load Testing Preview

In this article, you'll learn how to read data from a comma-separated value (CSV) file in JMeter and Azure Load Testing Preview.

You can make an Apache JMeter test script configurable by reading settings from an external CSV file. To do this, you can use the [CSV Data Set Config element](https://jmeter.apache.org/usermanual/component_reference.html#CSV_Data_Set_Config) in JMeter. For example, to test a search API, you might retrieve the various query parameters from an external file.

When you configure your Azure load test, you can upload any additional files that the JMeter script requires. For example, CSV files that contain configuration settings or binary files to send in the body of an HTTP request. You then update the JMeter script to reference the external files.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* An Azure Load Testing resource. To create a Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md#create_resource).
* An Apache JMeter test script (JMX).
* (Optional) Apache JMeter GUI to author your test script. To install Apache JMeter, see [Apache JMeter Getting Started](https://jmeter.apache.org/usermanual/get-started.html).

## Configure your JMeter script

In this section, you'll configure your Apache JMeter test script to reference an external file. You'll use a CSV Data Set Config element to read data from a CSV file.

Azure Load Testing uploads the JMX file and all related files in a single folder. Verify that you refer to the external files in the JMX script by using only the file name.

To edit your JMeter script by using the Apache JMeter GUI:

  1. Select the CSV Data Set Config element in your test plan.

  1. Update the **Filename** information and remove any file path reference.

        :::image type="content" source="media/how-to-read-csv-data/update-csv-data-set-config.png" alt-text="Screenshot that shows the test runs to compare.":::
    
  1. Repeat the previous steps for every CSV Data Set Config element.
  
  1. Save the JMeter script.

To edit your JMeter script by using Visual Studio Code or your editor of preference:

  1. Open the JMX file in Visual Studio Code.

  1. For each `CSVDataSet`, update the `filename` element and remove any file path reference.

        ```xml
        <CSVDataSet guiclass="TestBeanGUI" testclass="CSVDataSet" testname="Search parameters" enabled="true">
          <stringProp name="delimiter">,</stringProp>
          <stringProp name="fileEncoding">UTF-8</stringProp>
          <stringProp name="filename">search-params.csv</stringProp>
          <boolProp name="ignoreFirstLine">true</boolProp>
          <boolProp name="quotedData">false</boolProp>
          <boolProp name="recycle">true</boolProp>
          <stringProp name="shareMode">shareMode.all</stringProp>
          <boolProp name="stopThread">false</boolProp>
          <stringProp name="variableNames">username,query</stringProp>
        </CSVDataSet>
        ```

  1. Save the JMeter script.
        
## Add a CSV file to your load test

In this section, you'll configure your Azure load test to include a CSV file. You can then use this CSV file in the JMeter test script. If you reference other external files in your script, you can add them in the same way.

You can add a CSV file to your load test in two ways:

* Configure the load test by using the Azure portal
* If you have a CI/CD workflow, update the test configuration YAML file

### Add a CSV file by using the Azure portal

To add a CSV file to your load test by using the Azure portal:

  1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.
  
  1. On the left pane, select **Tests** to view a list of tests. 

      >[!TIP]
      > To limit the number of tests to display in the list, you can use the search box and the **Time range** filter.
  
  1. Select your test from the list by selecting the checkbox, and then select **Edit**.
  
      :::image type="content" source="media/how-to-read-csv-data/edit-test.png" alt-text="Screenshot that shows the list of load tests and the 'Edit' button.":::

  1. On the **Edit test** page, select the **Test plan** tab. 

  1. Select the CSV file from your computer, and then select **Upload** to upload the file to Azure.
  
      :::image type="content" source="media/how-to-read-csv-data/edit-test-upload-csv.png" alt-text="Screenshot of the Test plan tab on the Edit test pane.":::
  
  1. Select **Apply** to modify the test and to use the new configuration when you rerun it.
  
### Add a CSV file to the test configuration YAML file

If you run a load test within your CI/CD workflow, you can add a CSV file to the test configuration YAML file. For more information about running a load test in a CI/CD workflow, see the [Automated regression testing tutorial](./tutorial-cicd-azure-pipelines.md).

To add a CSV file in the test configuration YAML file:

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

## Next steps

- For information about high-scale load tests, see [Set up a high-scale load test](./how-to-high-scale-load.md).

- To learn about performance test automation, see [Configure automated performance testing](./tutorial-cicd-azure-pipelines.md).
