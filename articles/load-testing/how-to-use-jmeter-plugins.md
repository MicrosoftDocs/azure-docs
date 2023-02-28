---
title: Customize load tests with JMeter plugins
titleSuffix: Azure Load Testing
description: Learn how to customize your load test with JMeter plugins and Azure Load Testing. Upload a custom plugin JAR file or reference a publicly available plugin.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 10/24/2022
ms.topic: how-to

---
# Customize a load test with Apache JMeter plugins and Azure Load Testing

In this article, you learn how to use an Apache JMeter plugin in your load test script with Azure Load Testing. You can extend the core functionality of Apache JMeter by using plugins. For example, to add functionality for performing data manipulation, to implement custom request samplers, and more.

Azure Load Testing lets you use plugins from https://jmeter-plugins.org, or upload a Java archive (JAR) file with your own plugin code. You can use multiple plugins in a load test.

Azure Load Testing preinstalls plugins from https://jmeter-plugins.org on the load test engine instances. For other plugins, you add the plugin JAR file to the load test configuration.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* An Azure Load Testing resource. To create a Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).
* (Optional) Apache JMeter GUI to author your test script. To install Apache JMeter, see [Apache JMeter Getting Started](https://jmeter.apache.org/usermanual/get-started.html).

## Reference a JMeter plugin in your test script

To reference a JMeter plugin in your JMeter script by using the JMeter GUI, first install the plugin on your local JMeter instance in either of two ways:

- Use the [Plugins Manager](https://jmeter-plugins.org/wiki/PluginsManager/), if the plugin is available.
- To use your own plugin code, copy the plugin JAR file to the `lib/ext` folder of your local JMeter installation.

After you install the plugin, the plugin functionality appears in the Apache JMeter user interface. You can now reference it in your test script. The following screenshot shows an example of how to use an *Example Sampler* plugin:

:::image type="content" source="media/how-to-use-jmeter-plugins/jmeter-add-custom-sampler.png" alt-text="Screenshot that shows how to add a custom sampler to a test plan by using the JMeter user interface.":::

> [!NOTE]
> You can also reference the JMeter plugin directly by editing the JMX file. In this case you don't have to install the plugin locally.

## Upload the JMeter plugin JAR file to your load test

To use your own plugins during the load test, you have to upload the plugin JAR file to your load test. Azure Load Testing then installs your plugin on the load test engines.

You can add a plugin JAR file when you create a new load test, or anytime when you update an existing test.

For plugins from https://jmeter-plugins.org, you don't need to upload the JAR file. Azure Load Testing automatically configures these plugins for you.

> [!NOTE]
> We recommend that you build the executable JAR using Java 17.

# [Azure portal](#tab/portal)

Follow these steps to upload a JAR file by using the Azure portal:

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.

1. On the left pane, select **Tests** to view a list of tests.

1. Select **Create > Upload a JMeter script** to create a new load test by using a JMeter script.

    :::image type="content" source="media/how-to-use-jmeter-plugins/create-new-test.png" alt-text="Screenshot that shows how to create a new load test by uploading a JMeter file in the Azure portal.":::

1. Alternately, if you have an existing load test, select the test from the list by selecting the checkbox, and then select **Edit**.

    :::image type="content" source="media/how-to-use-jmeter-plugins/edit-test.png" alt-text="Screenshot that shows the list of load tests and the 'Edit' button.":::

1. Select the **Test plan** tab.

1. Select the JAR file from your computer, and then select **Upload** to upload the file to Azure.

    :::image type="content" source="media/how-to-use-jmeter-plugins/edit-test-upload-jar.png" alt-text="Screenshot that shows the steps to upload a J A R file in the 'Test plan' tab on the 'Edit test' pane.":::

1. Select **Apply** to modify the test, or select **Review + create** to create the test.

    When the test runs, Azure Load Testing deploys the plugin on each test engine instance.

# [GitHub Actions](#tab/github)

When you run a load test within your CI/CD workflow, you reference the plugin JAR file in the `configurationFiles` setting in the [test configuration YAML file](./reference-test-config-yaml.md).

To reference the plugin JAR file in the test configuration YAML file:

1. Add the plugin JAR file to the source control repository, which contains your load test configuration.

1. Open the YAML test configuration file in Visual Studio Code or your editor of choice.

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

# [Azure Pipelines](#tab/pipelines)

When you run a load test within your CI/CD workflow, you reference the plugin JAR file in the `configurationFiles` setting in the [test configuration YAML file](./reference-test-config-yaml.md).

To reference the plugin JAR file in the test configuration YAML file:

1. Add the plugin JAR file to the source control repository, which contains your load test configuration.

1. Open the YAML test configuration file in Visual Studio Code or your editor of choice.

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

---

## Next steps

- Learn how to [Download JMeter logs to troubleshoot a load test](./how-to-troubleshoot-failing-test.md).
- Learn how to [Monitor server-side application metrics](./how-to-monitor-server-side-metrics.md).
- Learn how to [Automate load tests with CI/CD](./tutorial-identify-performance-regression-with-cicd.md).
