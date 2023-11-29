---
title: Configure JMeter user properties
titleSuffix: Azure Load Testing
description: Learn how to use JMeter user properties with Azure Load Testing.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 04/05/2023
ms.topic: how-to
---

# Use JMeter user properties with Azure Load Testing

In this article, learn how to configure and use Apache JMeter user properties with Azure Load Testing. With user properties, you can make your test configurable by keeping test settings outside of the JMeter test script. Use cases for user properties include:

- You want to use the JMX test script in multiple deployment environments with different application endpoints.
- Your test script needs to accommodate multiple load patterns, such as smoke tests, peak load, or soak tests.
- You want to override default JMeter behavior by configuring [JMeter settings](https://jmeter.apache.org/usermanual/properties_reference.html), such as the results file format.

Azure Load Testing supports the standard [Apache JMeter properties](https://jmeter.apache.org/usermanual/test_plan.html#properties) and enables you to upload a user properties file. You can configure one user properties file per load test.

Alternately, you can also [use environment variables and secrets in Azure Load Testing](./how-to-parameterize-load-tests.md) to make your tests configurable.

> [!NOTE]
> Azure Load Testing overrides specific JMeter properties and ignores any values you specify for these properties. Learn more about the list of [JMeter properties that Azure Load Testing overrides](./resource-jmeter-property-overrides.md).

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing resource. If you need to create an Azure Load Testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## Add a JMeter user properties file to your load test

You can define user properties for your JMeter test script by uploading a *.properties* file to the load test. Azure Load Testing supports a single JMeter properties file per load test. Additional property files are ignored.

The following code snippet shows an example user properties file that defines three user properties and configures the `jmeter.save.saveservice.thread_name` configuration setting:

```properties
# peak-load.properties
# User properties for testing peak load
threadCount=250
rampUpSeconds=30
durationSeconds=600

# Override default JMeter properties
jmeter.save.saveservice.thread_name=false
```

# [Azure portal](#tab/portal)

To add a user properties file to your load test by using the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com), go to your Azure Load Testing resource.
1. On the left pane, select **Tests** to view the list of tests.
1. Select your test from the list by selecting the checkbox, and then select **Edit**. Alternately, select **Create test** to create a new load test.
1. Select the **Test plan** tab.
1. Select the properties file from your computer, and then select **Upload** to upload the file to Azure.

    :::image type="content" source="media/how-to-configure-user-properties/edit-test-upload-properties.png" alt-text="Screenshot that shows the steps to upload a user properties file on the Test plan tab on the Edit test pane.":::
  
1. Select **User properties** in the **File relevance** dropdown list.

    :::image type="content" source="media/how-to-configure-user-properties/edit-test-upload-properties-file-relevance.png" alt-text="Screenshot that highlights the file relevance dropdown for a user properties file on the Test plan pane.":::

    You can select only one file as a user properties file for a load test.

1. Select **Apply** to modify the test, or **Review + create**, and then **Create** to create the new test.

# [Azure Pipelines / GitHub Actions](#tab/pipelines+github)

If you run a load test within your CI/CD workflow, you add the user properties file to the source control repository. You then specify this properties file in the [load test configuration YAML file](./reference-test-config-yaml.md).

For more information about running a load test in a CI/CD workflow, see the [Automated regression testing tutorial](./tutorial-identify-performance-regression-with-cicd.md).

To add a user properties file to your load test, follow these steps:

1. Add the *.properties* file to the source control repository.
1. Open your YAML test configuration file in Visual Studio Code or your editor of choice.
1. Specify the *.properties* file in the `properties.userPropertyFile` setting.
    ```yaml
    testName: MyTest
    testPlan: SampleApp.jmx
    description: Configure a load test with peak load properties.
    engineInstances: 1
    properties:
      userPropertyFile: peak-load.properties
    configurationFiles:
      - input-data.csv
    ```

    > [!NOTE]
    > If you store the properties file in a separate folder, specify the file with a relative path name. For more information, see the [Test configuration YAML syntax](./reference-test-config-yaml.md).

1. Save the YAML configuration file and commit it to your source control repository.

    The next time the CI/CD workflow runs, it will use the updated configuration.

---

## Reference properties in JMeter

Azure Load Testing supports the built-in Apache JMeter functionality to reference user properties in your JMeter test script (JMX). You can use the [**__property**](https://jmeter.apache.org/usermanual/functions.html#__property) or [**__P**](https://jmeter.apache.org/usermanual/functions.html#__P) functions to retrieve the property values from the property file you uploaded previously.

The following code snippet shows an example of how to reference properties in a JMX file:

  ```xml
  <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Test home page" enabled="true">
  <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
  <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
      <boolProp name="LoopController.continue_forever">false</boolProp>
      <intProp name="LoopController.loops">-1</intProp>
  </elementProp>
  <stringProp name="ThreadGroup.num_threads">${__P(threadCount,1)}</stringProp>
  <stringProp name="ThreadGroup.ramp_time">${__P(rampUpSeconds,1)}</stringProp>
  <boolProp name="ThreadGroup.scheduler">true</boolProp>
  <stringProp name="ThreadGroup.duration">${__P(durationSeconds,30)}</stringProp>
  <stringProp name="ThreadGroup.delay"></stringProp>
  <boolProp name="ThreadGroup.same_user_on_next_iteration">true</boolProp>
  </ThreadGroup>
  ```

Alternately, you also specify properties in the JMeter user interface. The following image shows how to use properties to configure a JMeter thread group:

  :::image type="content" source="media/how-to-configure-user-properties/jmeter-user-properties.png" alt-text="Screenshot that shows how to reference user properties in the JMeter user interface.":::

You can [download the JMeter errors logs](./how-to-diagnose-failing-load-test.md) to troubleshoot errors during the load test.

## Next steps

- Learn more about [JMeter properties that Azure Load Testing overrides](./resource-jmeter-property-overrides.md).
- Learn more about [parameterizing a load test by using environment variables and secrets](./how-to-parameterize-load-tests.md).
- Learn more about [diagnosing failing load tests](./how-to-diagnose-failing-load-test.md).
