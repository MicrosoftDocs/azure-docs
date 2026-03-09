---
title: 'Quickstart: Create and run load tests from a recording'
titleSuffix: Azure Load Testing
description: 'This quickstart shows how to create and run load tests using the browser extension for Azure App Testing.'
services: load-testing
ms.service: azure-load-testing
ms.topic: quickstart
author: ninallam
ms.author: ninallam
ms.date: 12/16/2025
---

# Quickstart: Create and run a load test from a recording using AI 

Learn how to use the Azure App Testing browser extension for Microsoft Edge or Google Chrome to easily create JMeter load tests. The experience uses AI to enhance your test scripts by suggesting correlations, parameterizations, and other improvements. You can then run the load test at scale in **Azure Load Testing**.

This quickstart guides you through the steps of installing the browser extension, recording a user journey, reviewing and enhancing the generated load test script with AI assistance, and finally running the load test in **Azure Load Testing**.

## Prerequisites

- Azure App Testing browser extension for [Microsoft Edge](https://aka.ms/AppTesting/Browser-Ext) or [Google Chrome](https://aka.ms/AppTesting/Browser-Ext-Chrome).
- An Azure account with an active subscription. Needed to run load tests at scale in **Azure Load Testing**. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).


## Create an Azure Load Testing resource

First, you create the top-level resource for Azure Load Testing. It provides a centralized place to view and manage test plans, test results, and related artifacts.

If you already have a load testing resource, skip this section and continue to [Record your scenarios](#record-your-scenarios).

To create a load testing resource:

[!INCLUDE [azure-load-testing-create-portal](./includes/azure-load-testing-create-in-portal/azure-load-testing-create-in-portal.md)]

## Record your scenarios  

To get started, navigate to the overview page of your Azure Load Testing resource in the Azure portal. From there, launch the **Azure App Testing** browser extension by selecting the **Record** button. If the extension isn't installed, you are redirected to the marketplace to install it.

:::image type="content" source="./media/quickstart-create-run-tests-from-recording/load-testing-portal-record-button.png" alt-text="Screenshot that shows the Record button in Azure Load Testing resource overview page." lightbox="./media/quickstart-create-run-tests-from-recording/load-testing-portal-record-button.png":::

The extension opens in a new browser tab. Sign in with your Azure account if prompted. Select your Azure subscription and the Azure Load Testing resource you created earlier. Enter the URL of the web application you want to test, and select **Start Recording**.

:::image type="content" source="./media/quickstart-create-run-tests-from-recording/load-testing-extension-start-recording.png" alt-text="Screenshot that shows the Azure App Testing browser extension to start recording a user journey." lightbox="./media/quickstart-create-run-tests-from-recording/load-testing-extension-start-recording.png":::

The extension opens a new browser window where you can interact with your web application. Perform the actions you want to include in your load test, such as navigating through pages, filling out forms, and submitting data. You can add a new scenario by selecting the **Add Scenario** button in the extension tab.

Once you've completed the user journey, return to the extension tab and select **Stop Recording**.

Select **Review and create test** to proceed to the next step. You can filter the domains to include or exclude specific requests from the recording.

> [!NOTE]
> You'll be prompted to accepting terms and conditions to use AI recommendations when you sign in for the first time. You can always disable AI recommendations later in the extension settings.

## Enhance the recording with AI assistance

After completing the recording, you'll be taken to the review recording view in the Azure portal. Here, you can see the recorded requests and scenarios. AI is used to analyze the recording and suggest improvements. The following enhancements can be applied to the recorded script.

### Smart labeling of requests

AI adds labels for your requests to make the script more readable. These labels are based on the request URLs and actions performed during the recording. You can always modify the labels in the experience by editing the request names. These labels are reflected in the test run results.

:::image type="content" source="./media/quickstart-create-run-tests-from-recording/load-testing-authoring-smart-labels.png" alt-text="Screenshot that shows AI-suggested smart labels for requests in the Azure App Testing browser extension." lightbox="./media/quickstart-create-run-tests-from-recording/load-testing-authoring-smart-labels.png":::

### Think times

Apply think times automatically between requests to simulate real user behavior. The suggested think times are based on the time intervals between your actions during the recording. You can adjust or remove these think times as needed. You can also choose to manually add think times between requests.

### Correlations

AI identifies dynamic values in the requests and suggests correlations to handle them. You can choose to accept or reject these suggestions. Additionally, you can manually add correlations if needed.

While adding or reviewing correlations, some of the fields that need to be filled in include:
- **Source Request**: The request from which the dynamic value is extracted.
- **Variable Name**: The name of the variable that stores the extracted value.
- **Path type**: The method used to extract the value (for example, JSONPath, XPath, Regex).
- **Path**: The specific path or pattern used to locate the dynamic value in the response.

The extracted value automatically reflects the value of the variable as extracted from the response of the source request.

:::image type="content" source="./media/quickstart-create-run-tests-from-recording/load-testing-authoring-correlations.png" alt-text="Screenshot that shows AI-suggested correlations in the Azure App Testing browser extension." lightbox="./media/quickstart-create-run-tests-from-recording/load-testing-authoring-correlations.png":::

### Parameters

AI detects parameters in the requests and suggests parameterizations to simulate realistic user behavior. You can accept or reject these suggestions as well. You can choose to provide these values from a CSV file or environment variables. You can also manually add parameters.

:::image type="content" source="./media/quickstart-create-run-tests-from-recording/load-testing-authoring-parameters.png" alt-text="Screenshot that shows AI-suggested parameters in the Azure App Testing browser extension." lightbox="./media/quickstart-create-run-tests-from-recording/load-testing-authoring-parameters.png"::: 

## Load configuration

You can configure various load test settings in the **Load details** section as follows:

- **Apply variable load for scenarios**: Enable this option to simulate variable load patterns for different scenarios. This helps in mimicking real-world user behavior more accurately.
- **Total virtual users**: Specify the number of virtual users to simulate during the test.
- **Test duration**: Specify the total duration for which the load test runs.
- **Ramp-up time**: Set the time duration over which the virtual users are gradually introduced to the test.


## Run the load test

Once you review and configure the load test setting, you can either directly run the test in Azure Load Testing by selecting the **Run test now** button or configure advanced test options. The advanced test options let you configure the load test with all the options to configure a JMeter test. Refer to the [create and run JMeter load tests](./how-to-create-and-run-load-test-with-jmeter-script.md) for more details.

A JMeter script is generated based on your recording and the enhancements applied. You can download this script for further customization or future use.

After the test is initiated, you can monitor its progress and view real-time metrics in the Azure portal. Once the test is complete, you can analyze the results to identify performance bottlenecks and areas for improvement in your web application.     

## Summary

In this quickstart, you learned how to use the Azure App Testing browser extension to create and run load tests from a recording. You recorded a user journey, enhanced the generated load test script with AI assistance, and ran the load test in Azure Load Testing.

## Related content

- Learn how to [create and run JMeter load tests](./how-to-create-and-run-load-test-with-jmeter-script.md).

