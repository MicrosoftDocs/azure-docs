---
title: 'Quickstart: Create and run a load test with Azure Load Testing'
description: 'This quickstart shows how to create an Azure Load Testing resource and run a high-scale load test for an external website by using the Azure portal.'
services: load-testing
ms.service: load-testing
ms.topic: quickstart
author: ntrogh
ms.author: nicktrog
ms.date: 11/30/2021
ms.custom: template-quickstart
adobe-target: true
---

# Quickstart: Create and run a load test with Azure Load Testing Preview

This quickstart describes how to create an Azure Load Testing Preview resource by using the Azure portal. With this resource, you'll create a load test with an Apache JMeter script and run the test against an external website. 

After you complete this quickstart, you'll have a resource and load test that you can use for other tutorials. 

> [!IMPORTANT]
> Azure Load Testing is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## <a name="create_resource"></a> Create an Azure Load Testing resource

First, you'll create an Azure Load Testing resource. This is the top-level resource. It provides a centralized place to view and manage test plans, test results, and other related artifacts.

If you already have a Load Testing resource, skip this section and continue to [Create a load test](#create_test).

To create a Load Testing resource:

[!INCLUDE [azure-load-testing-create-portal](../../includes/azure-load-testing-create-in-portal.md)]

In the next section, you'll create an Apache JMeter script. If you already have a script, you can skip to [Create a load test](#create_test).

## <a name="jmeter"></a> Create an Apache JMeter script

In this section, you'll create a sample Apache JMeter script that you'll use in the next section to load test a web endpoint.

1. Create a new file *SampleTest.jmx* on your local machine.

    ```powershell
    touch SampleTest.jmx
    ```

1. Open *SampleTest.jmx* in a text editor and paste the following code snippet in the file.

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <jmeterTestPlan version="1.2" properties="5.0" jmeter="5.4.1">
      <hashTree>
        <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="Test Plan" enabled="true">
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
          <kg.apc.jmeter.threads.UltimateThreadGroup guiclass="kg.apc.jmeter.threads.UltimateThreadGroupGui" testclass="kg.apc.jmeter.threads.UltimateThreadGroup" testname="jp@gc - Ultimate Thread Group" enabled="true">
            <collectionProp name="ultimatethreadgroupdata">
              <collectionProp name="1400604752">
                <stringProp name="1567">5</stringProp>
                <stringProp name="0">0</stringProp>
                <stringProp name="48873">30</stringProp>
                <stringProp name="49710">60</stringProp>
                <stringProp name="10">10</stringProp>
              </collectionProp>
            </collectionProp>
            <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
              <boolProp name="LoopController.continue_forever">false</boolProp>
              <intProp name="LoopController.loops">-1</intProp>
            </elementProp>
            <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
          </kg.apc.jmeter.threads.UltimateThreadGroup>
          <hashTree>
            <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="homepage" enabled="true">
              <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
                <collectionProp name="Arguments.arguments"/>
              </elementProp>
              <stringProp name="HTTPSampler.domain">{your-endpoint-url}</stringProp>
              <stringProp name="HTTPSampler.port"></stringProp>
              <stringProp name="HTTPSampler.protocol">https</stringProp>
              <stringProp name="HTTPSampler.contentEncoding"></stringProp>
              <stringProp name="HTTPSampler.path"></stringProp>
              <stringProp name="HTTPSampler.method">GET</stringProp>
              <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
              <boolProp name="HTTPSampler.auto_redirects">false</boolProp>
              <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
              <boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>
              <stringProp name="HTTPSampler.embedded_url_re"></stringProp>
              <stringProp name="HTTPSampler.implementation">HttpClient4</stringProp>
              <stringProp name="HTTPSampler.connect_timeout">60000</stringProp>
              <stringProp name="HTTPSampler.response_timeout">60000</stringProp>
            </HTTPSamplerProxy>
            <hashTree/>
          </hashTree>
        </hashTree>
      </hashTree>
    </jmeterTestPlan>
    ```

    This sample Apache JMeter script simulates a load test of five virtual users simultaneously accessing a web endpoint. It takes less than two minutes to complete.

1. In the file, replace the placeholder text (also replace the curly braces) *`{your-endpoint-url}`* with your own endpoint URL.

    > [!IMPORTANT]
    > Don't include `https` or `http` in the endpoint URL.

1. Save and close the file.

In the next section, you'll create a load test by using the Apache JMeter script.

## <a name="create_test"></a> Create a load test

With Azure Load Testing, you can use an Apache JMeter script to create a load test. This script defines the application test plan. The script contains information about the web endpoint, the number of virtual users, and other test configuration settings.

Next, you'll create a load test by using an existing Apache JMeter script.

1. Go to your Azure Load Testing resource, select **Tests** from the left pane, and then select **+ Create new test**.

    :::image type="content" source="./media/quickstart-create-and-run-loadtest/create-new-test.png" alt-text="Screenshot that shows the Azure Load Testing page and the button for creating a new test." :::
    
1. On the **Basics** tab, enter the **Test name** and **Test description** values. Optionally, you can select the **Run test after creation** checkbox.

    :::image type="content" source="./media/quickstart-create-and-run-loadtest/create-new-test-basics.png" alt-text="Screenshot that shows the Basics tab for creating a test." :::

1. On the **Test plan** tab, select your Apache JMeter script, and then select **Upload** to upload the file to Azure.

    :::image type="content" source="./media/quickstart-create-and-run-loadtest/create-new-test-test-plan.png" alt-text="Screenshot that shows the Test plan tab for creating a test." :::
    
    > [!NOTE]
    > You can select and upload additional Apache JMeter configuration files.

1. (Optional) On the **Parameters** tab, you can configure input parameters for your Apache JMeter script.

1. For this quickstart, you can leave the default values on the **Load** tab.

    |Field  |Default value  |Description  |
    |---------|---------|---------|
    |**Engine instances**     |**1**         |The number of parallel test engines that run the Apache JMeter script. |
    
    :::image type="content" source="./media/quickstart-create-and-run-loadtest/create-new-test-load.png" alt-text="Screenshot that shows the Load tab for creating a test." :::

1. (Optional) On the **Test criteria** tab, you can configure criteria to determine when your load test should fail.

1. (Optional) On the **Monitoring** tab, you can specify the Azure application components to capture server-side metrics for. For this quickstart, you're not testing an Azure-hosted application.

1. Select **Review + create**, review all settings, and then select **Create** to create the load test.

    :::image type="content" source="./media/quickstart-create-and-run-loadtest/create-new-test-review.png" alt-text="Screenshot that shows the tab for reviewing and creating a test." :::

In the next section, you'll run the load test. If you've selected the **Run test after creation** checkbox, you can continue to [View the load test results](#view).

## <a name="run"></a> Run the load test

In this section, you'll run the load test you created in the previous section.

If you checked the **Run test after creation** box when you created the load test, you can skip to [View the load test results](#view).

1. Navigate to your Load Testing resource, select **Tests** from the left navigation, and then select the test you created previously.

    :::image type="content" source="./media/quickstart-create-and-run-loadtest/tests.png" alt-text="Screenshot that shows the list of tests." :::

1. On the load test details screen, select **Run** or **Run test**.

    :::image type="content" source="./media/quickstart-create-and-run-loadtest/run-test.png" alt-text="Screenshot that shows how to run a load test." :::

1. On the **Run** confirmation page, optionally modify the test details. Then, select **Run** to start the load test.

    :::image type="content" source="./media/quickstart-create-and-run-loadtest/run-test-confirm.png" alt-text="Screenshot that shows the run confirmation page." :::

    > [!TIP]
    > You can stop a load test at any time from the Azure portal UI.

In the next section, you'll look at the test run details and monitor the load test execution.

## <a name="view"></a> View the load test results

While the load test is running, Azure Load Testing captures both client-side metrics and server-side metrics. In this section, you'll use the dashboard to monitor the client-side metrics.

1. Navigate to the test runs page, and select the most recent test run to navigate to the test run details page.

    :::image type="content" source="./media/quickstart-create-and-run-loadtest/test-runs-after-run.png" alt-text="Screenshot that shows the list of test runs." :::

    You can see the streaming client-side metrics while the test is running. By default, the data refreshes every five seconds.

    :::image type="content" source="./media/quickstart-create-and-run-loadtest/test-run-aggregated-by-percentile.png" alt-text="Screenshot that shows the load test results.":::

1. You can also change the display filters to view a specific time range, result percentile, or error type.

    :::image type="content" source="./media/quickstart-create-and-run-loadtest/test-result-filters.png" alt-text="Screenshot that shows the filter criteria for a load test result.":::
 
## Clean up resources

[!INCLUDE [alt-delete-resource-group](../../includes/alt-delete-resource-group.md)]

## Next steps

You now have an Azure Load Testing resource, which you used to load test an external website.

You can reuse this resource to learn how to identify performance bottlenecks in an Azure-hosted application by using the server-side metrics.

> [!div class="nextstepaction"]
> [Identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md)
