---
title: Use JMeter plugins in test scripts
titleSuffix: Azure Load Testing
description: Learn how to use an Apache JMeter plugin in your test scripts with Azure Load Testing. Upload a custom plugin JAR file or reference a publicly available plugin.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 10/24/2022
ms.topic: how-to

---
# Use Apache JMeter plugins with Azure Load Testing Preview

Learn how to use an Apache JMeter plugin in your load test script with Azure Load Testing Preview. You can extend the core functionality of Apache JMeter by using plugins. For example, add functions to provide dynamic input or perform data manipulation, implement custom request samplers, and more.

Azure Load Testing supports using plugins from https://jmeter-plugins.org, or uploading a Java archive (JAR) file with your own plugin code. You can use multiple plugins within a single load test.

To use JMeter plugins with Azure Load Testing, follow these steps:

1. Install the plugin on your local Apache JMeter instance. Use the [Plugins Manager](https://jmeter-plugins.org/wiki/PluginsManager/) or copy the plugin JAR file to the `lib/ext` folder.
1. Reference the plugin in the JMeter test plan (JMX).
1. If you're using your own plugin code, upload the plugin JAR file to the load test.
1. Run your load test.

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* An Azure Load Testing resource. To create a Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md#create_resource).
* An Apache JMeter test script (JMX).
* (Optional) Apache JMeter GUI to author your test script. To install Apache JMeter, see [Apache JMeter Getting Started](https://jmeter.apache.org/usermanual/get-started.html).

## Reference a JMeter plugin in a test plan

After you installed the JMeter plugin on your local JMeter instance, reference the plugin functionality in your Apache JMeter test plan (JMX).

Add the plugin element to the test plan by using the Apache JMeter user interface. The following image shows an example of how to use an *Example Sampler* plugin:

  :::image type="content" source="media/how-to-use-custom-plugins/jmeter-add-custom-sampler.png" alt-text="Screenshot that shows how to add a custom sampler to a test plan by using the JMeter user interface.":::

Alternately, reference the plugin in the JMX file with its fully qualified name. In the following code snippet, `com.example.ExampleSampler` indicates the fully qualified name of the *Example Sampler* plugin:

```xml
<hashTree>
    <com.example.ExampleSampler guiclass="com.example.gui.ExampleSamplerGui" testclass="com.example.ExampleSampler" testname="Example Sampler" enabled="true">
        <stringProp name="ExampleSampler.data">my data</stringProp>
    </com.example.ExampleSampler>
<hashTree/>
```

## Upload a JMeter plugin JAR file

To use your own plugins during the load test, you have to upload the plugin JAR file to your load test. Azure Load Testing then installs your plugin on the load test engines.

For plugins from https://jmeter-plugins.org, you don't need to upload the JAR file. Azure Load Testing automatically configures these plugins for you.

### Upload a plugin JAR file in the Azure portal

You can add a plugin JAR file to an existing load test or when you create a new test.

Follow these steps to upload a JAR file by using the Azure portal:

  1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.
  
  1. If you have an existing load test:

      1. On the left pane, select **Tests** to view a list of tests.

      1. Select your test from the list by selecting the checkbox, and then select **Edit**.
  
          :::image type="content" source="media/how-to-use-custom-plugins/edit-test.png" alt-text="Screenshot that shows the list of load tests and the 'Edit' button.":::

  1. Alternately, create a new load test by uploading a JMeter script:

      1. On the **Overview** page, select **Create**.

          :::image type="content" source="media/how-to-use-custom-plugins/azure-load-testing-overview.png" alt-text="Screenshot that shows the Azure Load Testing overview page, highlighting the create button.":::

      1. Enter the information in the **Basics** page.

  1. Select the **Test plan** tab.

  1. Select the JAR file from your computer, and then select **Upload** to upload the file to Azure.
  
      :::image type="content" source="media/how-to-use-custom-plugins/edit-test-upload-jar.png" alt-text="Screenshot that shows the steps to upload a J A R file in the 'Test plan' tab on the 'Edit test' pane.":::
  
  1. Select **Apply** to modify the test, or select **Review + create** to create the test.

      When the test runs, Azure Load Testing deploys the plugin on each test engine instance.

### Upload a plugin JAR file in a CI/CD pipeline

If you run a load test within your CI/CD workflow, you can add the plugin JAR file to the test configuration YAML file. For more information about running a load test in a CI/CD workflow, see the [Automated regression testing tutorial](./tutorial-cicd-azure-pipelines.md).

To add a JAR file in the test configuration YAML file:

  1. Add the plugin JAR file to the source control repository.

  1. Open your YAML test configuration file in Visual Studio Code or your editor of choice.

  1. Add the JAR file to the `configurationFiles` setting. You can use wildcards or specify multiple individual files. 

      ```yaml
      testName: MyTest
      testPlan: SampleApp.jmx
      description: Run a load test for my sample web app
      engineInstances: 1
      configurationFiles:
      - examplesampler-1.0.jar
      ```

      > [!NOTE]
      > If you store the JAR file in a separate folder, specify the file with a relative path name. For more information, see the [Test configuration YAML syntax](./reference-test-config-yaml.md).

  1. Save the YAML configuration file and commit it to your source control repository.
  
      The next time the CI/CD workflow runs, it will use the updated configuration and Azure Load Testing will deploy the plugin on each test engine instance.

## Next steps

- Learn how to [Download JMeter logs to troubleshoot a load test](./how-to-find-download-logs.md).
- Learn how to [Export the load test result](./how-to-export-test-results.md).
- Learn how to [Monitor server-side application metrics](./how-to-monitor-server-side-metrics.md).