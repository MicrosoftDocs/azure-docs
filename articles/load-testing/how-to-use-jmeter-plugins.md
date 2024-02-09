---
title: Customize load tests with JMeter plugins
titleSuffix: Azure Load Testing
description: Learn how to customize your load test with JMeter plugins and Azure Load Testing. Upload a custom plugin JAR file or reference a publicly available plugin.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 10/19/2023
ms.topic: how-to

---
# Customize a load test with Apache JMeter plugins and Azure Load Testing

In this article, you learn how to use an Apache JMeter plugin in your load test script with Azure Load Testing. You can extend the core functionality of Apache JMeter by using plugins. For example, to add functionality for performing data manipulation, to implement custom request samplers, and more.

When you use a JMeter plugin in your test script, the plugin needs to be uploaded onto the test engine instances in Azure Load Testing. You have two options for using JMeter plugins with Azure Load Testing:

- **Plugins from https://jmeter-plugins.org**. Azure Load Testing automatically preinstalls plugins from https://jmeter-plugins.org.

- **Other plugins**. When you create the load test, you need to add the JMeter plugin Java archive (JAR) file to your load test configuration. Azure Load Testing uploads the plugin JAR file onto the test engine instances when the load test starts.

> [!NOTE]
> If you use your own plugin code, we recommend that you build the executable JAR using Java 17.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* An Azure Load Testing resource. To create a Load Testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).
* (Optional) Apache JMeter GUI to author your test script. To install Apache JMeter, see [Apache JMeter Getting Started](https://jmeter.apache.org/usermanual/get-started.html).

## Reference the JMeter plugin in your test script

To use a JMeter plugin in your load test, you have to author the JMX test script and reference the plugin. There are no special instructions for referencing plugins in your script when you use Azure Load Testing.

Follow these steps to use the JMeter GUI to install and reference the plugin in your test script:

1. Install the JMeter plugin on your local JMeter instance in either of two ways:

    - Use the [Plugins Manager](https://jmeter-plugins.org/wiki/PluginsManager/), if the plugin is available.

    - To use your own plugin code, copy the plugin JAR file to the `lib/ext` folder of your local JMeter installation.

    After you install the plugin, the plugin functionality appears in the Apache JMeter user interface.

1. You can now reference the plugin functionality in your test script.

    The following screenshot shows an example of how to use an *Example Sampler* plugin. Depending on the type of plugin, you might have different options in the user interface.

    :::image type="content" source="media/how-to-use-jmeter-plugins/jmeter-add-custom-sampler.png" alt-text="Screenshot that shows how to add a custom sampler to a test plan by using the JMeter user interface.":::

> [!NOTE]
> You can also reference the JMeter plugin directly by editing the JMX file. In this case you don't have to install the plugin locally.

## Create a load test that uses JMeter plugins

If you only reference plugins from https://jmeter-plugins.org, you can [create a load test by uploading your JMX test script](./how-to-create-and-run-load-test-with-jmeter-script.md). Azure Load Testing preinstalls the plugin JAR files onto the test engine instances.

If you use your own plugins in your test script, you have to add the plugin JAR file to your load test configuration. Azure Load Testing then installs your plugin on the load test engines when the test starts.

You can add a plugin JAR file when you create a new load test, or anytime when you update an existing test.

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

# [GitHub Actions / Azure Pipelines](#tab/github+pipelines)

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
