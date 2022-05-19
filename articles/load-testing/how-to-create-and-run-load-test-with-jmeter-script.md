---
title: Create and run a load test with Azure Load Testing with a JMeter script
description: 'Learn how to load test a website with Azure Load Testing in the Azure portal by using an existing Apache JMeter script.'
services: load-testing
ms.service: load-testing
ms.topic: how-to
author: ntrogh
ms.author: nicktrog
ms.date: 05/16/2022
adobe-target: true
---

# Load test a website with Azure Load Testing Preview in the Azure portal by using an existing JMeter script

This article describes how to load test a web application with Azure Load Testing Preview from the Azure portal. You'll use an existing Apache JMeter script to configure the load test.

After you complete this, you'll have a resource and load test that you can use for other tutorials. 

Learn more about the [key concepts for Azure Load Testing](./concept-load-testing-concepts.md).

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An Azure Load Testing resource. If you need to create an Azure Load Testing resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).

## Create an Apache JMeter script

In this section, you'll create a sample Apache JMeter script that you'll use in the next section to load test a web endpoint. If you already have a script, you can skip to [Create a load test](#create-a-load-test).

1. Create a *SampleTest.jmx* file on your local machine:

    ```powershell
    touch SampleTest.jmx
    ```

1. Open *SampleTest.jmx* in a text editor and paste the following code snippet in the file:

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <jmeterTestPlan version="1.2" properties="5.0" jmeter="5.4.1">
      <hashTree>
        <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="Azure Load Testing Quickstart" enabled="true">
          <stringProp name="TestPlan.comments"></stringProp>
          <boolProp name="TestPlan.functional_mode">false</boolProp>
          <boolProp name="TestPlan.tearDown_on_shutdown">true</boolProp>
          <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
          <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
            <collectionProp name="Arguments.arguments"/>
          </elementProp>
          <stringProp name="TestPlan.user_define_classpath"></stringProp>
        </TestPlan>
        <hashTree>
          <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Thread Group" enabled="true">
            <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
            <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
              <boolProp name="LoopController.continue_forever">false</boolProp>
              <intProp name="LoopController.loops">-1</intProp>
            </elementProp>
            <stringProp name="ThreadGroup.num_threads">5</stringProp>
            <stringProp name="ThreadGroup.ramp_time">10</stringProp>
            <boolProp name="ThreadGroup.scheduler">true</boolProp>
            <stringProp name="ThreadGroup.duration">120</stringProp>
            <stringProp name="ThreadGroup.delay">5</stringProp>
            <boolProp name="ThreadGroup.same_user_on_next_iteration">true</boolProp>
          </ThreadGroup>
          <hashTree>
            <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="Homepage" enabled="true">
              <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
                <collectionProp name="Arguments.arguments"/>
              </elementProp>
              <stringProp name="HTTPSampler.domain">your-endpoint-url</stringProp>
              <stringProp name="HTTPSampler.port"></stringProp>
              <stringProp name="HTTPSampler.protocol"></stringProp>
              <stringProp name="HTTPSampler.contentEncoding"></stringProp>
              <stringProp name="HTTPSampler.path"></stringProp>
              <stringProp name="HTTPSampler.method">GET</stringProp>
              <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
              <boolProp name="HTTPSampler.auto_redirects">false</boolProp>
              <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
              <boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>
              <stringProp name="HTTPSampler.embedded_url_re"></stringProp>
              <stringProp name="HTTPSampler.connect_timeout"></stringProp>
              <stringProp name="HTTPSampler.response_timeout"></stringProp>
            </HTTPSamplerProxy>
            <hashTree/>
          </hashTree>
        </hashTree>
      </hashTree>
    </jmeterTestPlan>
    ```

    This sample Apache JMeter script simulates a load test of five virtual users simultaneously accessing a web endpoint. It takes less than two minutes to complete.

1. In the file, replace the placeholder text `your-endpoint-url` with your own endpoint URL.

    > [!IMPORTANT]
    > Don't include `https` or `http` in the endpoint URL.

1. Save and close the file.

## Create a load test

With Azure Load Testing, you can use an Apache JMeter script to create a load test. This script defines the application test plan. It contains information about the web endpoint, the number of virtual users, and other test configuration settings.

To create a load test by using an existing Apache JMeter script:

1. Go to your Azure Load Testing resource, select **Tests** from the left pane, and then select **+ Create new test**.

    :::image type="content" source="./media/how-to-create-and-run-loadtest-with-jmeter-script/create-new-test.png" alt-text="Screenshot that shows the Azure Load Testing page and the button for creating a new test." :::
    
1. On the **Basics** tab, enter the **Test name** and **Test description** information. Optionally, you can select the **Run test after creation** checkbox.

    :::image type="content" source="./media/how-to-create-and-run-loadtest-with-jmeter-script/create-new-test-basics.png" alt-text="Screenshot that shows the Basics tab for creating a test." :::

1. On the **Test plan** tab, select your Apache JMeter script, and then select **Upload** to upload the file to Azure.

    :::image type="content" source="./media/how-to-create-and-run-loadtest-with-jmeter-script/create-new-test-test-plan.png" alt-text="Screenshot that shows the Test plan tab." :::
    
    > [!NOTE]
    > You can select and upload additional Apache JMeter configuration files or other files that are referenced in the JMX file. For example, if your test script uses CSV data sets, you can upload the corresponding *.csv* file(s).

1. (Optional) On the **Parameters** tab, configure input parameters for your Apache JMeter script.

1. For this quickstart, you can leave the default value on the **Load** tab:

    |Field  |Default value  |Description  |
    |---------|---------|---------|
    |**Engine instances**     |**1**         |The number of parallel test engines that run the Apache JMeter script. |
    
    :::image type="content" source="./media/how-to-create-and-run-loadtest-with-jmeter-script/create-new-test-load.png" alt-text="Screenshot that shows the Load tab for creating a test." :::

1. (Optional) On the **Test criteria** tab, configure criteria to determine when your load test should fail.

1. (Optional) On the **Monitoring** tab, you can specify the Azure application components to capture server-side metrics for. For this quickstart, you're not testing an Azure-hosted application.

1. Select **Review + create**. Review all settings, and then select **Create** to create the load test.

    :::image type="content" source="./media/how-to-create-and-run-loadtest-with-jmeter-script/create-new-test-review.png" alt-text="Screenshot that shows the tab for reviewing and creating a test." :::

> [!NOTE]
> You can update the test configuration at any time, for example to upload a different JMX file. Choose your test in the list of tests, and then select **Edit**.

## Run the load test

In this section, you'll run the load test that you just created.

1. Go to your Load Testing resource, select **Tests** from the left pane, and then select the test that you created.

    :::image type="content" source="./media/how-to-create-and-run-loadtest-with-jmeter-script/tests.png" alt-text="Screenshot that shows the list of load tests." :::

1. On the test details page, select **Run** or **Run test**. Then, select **Run** on the **Run test** confirmation pane to start the load test.

    :::image type="content" source="./media/how-to-create-and-run-loadtest-with-jmeter-script/run-test-confirm.png" alt-text="Screenshot that shows the run confirmation page." :::

    > [!TIP]
    > You can stop a load test at any time from the Azure portal.

## Next steps

- To learn how to export test results, see [Export test results](./how-to-export-test-results.md).

- To learn how to monitor server side metrics, see [Monitor server side metrics](./how-to-monitor-server-side-metrics.md).
