---
title: Create a data-driven load test with CSV data
titleSuffix: Azure Load Testing
description: Learn how to create a data-driven load test with Azure Load Testing by using data from a CSV file.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 12/07/2021
ms.topic: how-to 
ms.custom: template-how-to
---

# Create a data-driven load test by using CSV files

In this article, you'll learn how to create a data-driven load test in Azure Load Testing Preview. You'll configure a load test to use data from a CSV file.

You can make an Apache JMeter test script configurable by reading data from a CSV file. In JMeter you can use the [CSV Data Set Config element](https://jmeter.apache.org/usermanual/component_reference.html#CSV_Data_Set_Config). For example, to test a search API, you might retrieve the various query parameters from an external file.

When you configure your Azure load test, you can upload any additional files that the JMeter script requires. For example, CSV files that contain configuration settings or binary files to send in the body of an HTTP request. You then update the JMeter script to reference the external files.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* An existing Azure Load Testing resource. To create a Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md#create_resource).
* An existing Apache JMeter test script (JMX).
* (Optional) Apache JMeter GUI to author your test script. To install Apache JMeter, see [Apache JMeter Getting Started](https://jmeter.apache.org/usermanual/get-started.html).

## Configure your JMeter script

In this section, you'll configure your Apache JMeter test script to reference an external file. You'll use a CSV Data Set Config element to read data from a CSV file.

Azure Load Testing uploads the JMX file and all related files in a single folder. Verify that you refer to the external files in the JMX script by using only the file name.

To edit your JMeter script by using the Apache JMeter GUI:

  1. Select the CSV Data Set Config element in your test plan.

  1. Update the **Filename** information and remove any file path reference.

        :::image type="content" source="media/how-to-create-data-driven-test/update-csv-data-set-config.png" alt-text="Screenshot that shows the test runs to compare.":::
    
  1. Repeat steps 1-2 for every CSV Data Set Config element.
  
  1. Save the JMeter script.

To edit your JMeter script by using Visual Studio Code:

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

In this section, you'll configure your Azure load test to include a CSV file. You can then use this CSV file in the JMeter test script. If you're referencing other external files in your script, you can add them in the same way.

To add a CSV file to your load test by using the Azure portal:

  1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.
  
  1. On the left pane, select **Tests** to view a list of tests. 

      >[!TIP]
      > To limit the number of tests to display in the list, you can use the search box and the **Time range** filter.
  
  1. Select your test from the list by selecting the checkbox, and then select **Edit**.
  
      :::image type="content" source="media/how-to-create-data-driven-test/edit-test.png" alt-text="Screenshot that shows the list of load tests and the 'Edit' button.":::

  1. On the **Edit test** page, select the **Test plan** tab. Select the CSV file from your computer, and then select **Upload** to upload the file to Azure.
  
      :::image type="content" source="media/how-to-create-data-driven-test/edit-test-upload-csv.png" alt-text="Screenshot of the 'Load' tab on the 'Edit test' pane.":::
  
  1. Select **Apply** to modify the test and use the new configuration when you rerun it.
  
To add a CSV file to your load test by using the YAML test configuration file:

  1. Open your YAML test configuration file in Visual Studio Code or your editor of choice.
    
      You use a test configuration file when you run a load test in your CI/CD workflow. For more information, see the [Automated regression testing tutorial](./tutorial-cicd-azure-pipelines.md).

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
