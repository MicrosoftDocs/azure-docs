---
title: Analyze load tests using the results dashboard in Azure Load Testing
description: Learn about the sections and metrics available in the Azure Load Testing test run results dashboard.
author: nagarjuna-vipparthi
ms.author: vevippar
ms.date: 11/20/2025
ms.service: azure-load-testing
ms.topic: how-to
---

# Analyze load test results using the test run results dashboard

In this article, you learn how to use the comprehensive results dashboard provided by Azure Load Testing to analyze the results of your load test runs. This dashboard presents key performance statistics, AI generated actionable insights, client-side metrics, server-side metrics, etc. to help you evaluate the performance and reliability of your application under load. You can quickly understand whether your application meets the performance expectations. You can also do deeper analyses and troubleshooting by slicing and dicing the data using the rich interactive features. 

The test run results dashboard is available for load tests run from any of the interfaces like Azure portal, Az CLI, REST APIs, Azure SDKs, Visual Studio Code extension, or CI/CD pipelines. This article introduces the main sections of the dashboard, describes information you can find in each section, and explains how you can use the information for load test result analysis. 

The results dashboard contains the following sections: 

|Section            |Description  |
|---------------------|-------------|
|`Test run details`      | The state of test runs along with important information like start time, end time, virtual users, duration, etc. |
|`AI insights`      | AI generated actionable insights providing a summary of the test run and recommendations to improve performance |
|`Statistics` | Key performance metrics like response time, error rate, throughput at an aggregate level, along with request level statistics and comparison across regions  |
|`Test criteria`          | Test criteria evaluation to indicate whether the application meets your performance expectations |
|`Client side metrics`          | Charts showing the client side performance metrics like response time, throughput, and error rate |
|`Server side metrics`            | Charts showing the resource metrics of your app components like App Service, Azure Cosmos DB, etc. for the duration of load test |
|`Engine health`          | Resource metrics of load test engine instances |

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.  
- An Azure load testing resource that has a completed test run. If you need to create an Azure load testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md).  

## Test run details

In this section, you can see the status of the test run along with important information about the test run. For test runs in progress, it indicates the current state of the test run. 

:::image type="content" source="media/how-to-understand-test-run-results-dashboard/test-run-details.png" alt-text="Screenshot of the test run details card." lightbox="media/how-to-understand-test-run-results-dashboard/test-run-details.png":::

A test run that is currently in progress can be in one of the following states: 

|State            |Description  |
|---------------------|-------------|
|`Accepted`      | The service accepted the user request to start a test run. |
|`Not started`      | The service hasn't yet started processing the test run request. |
|`Provisioning`      | The [test engine instances](./concept-load-testing-concepts.md#test-engine) are being provisioned for the test run. |
|`Provisioned`      | Provisioning the test engine instances is completed. |
|`Configuring`      | The test engine instances are being configured for the test run. This step includes copying the input artifacts to the engines, installing any dependencies, etc. |
|`Configured`      | Configuring the test engine instances is completed. |
|`Executing`      | The test script is being executed on the test engine instances. In this state, the application being tested receives requests as per the configured load. |
|`Executed`      | Test run execution completed. |
|`Deprovisioning`      | The test engine instances provisioned for the test run are being deprovisioned. |
|`Deprovisioned`      | Deprovisioning the test engine instances is completed. |
|`Cancelling`      | User request to stop the test run is being processed. |

After the test run execution is completed, you can view the final status of the test run along with two sub states. The first sub state indicates whether the test run execution completed as expected. The second sub state indicates whether the performance criteria defined for the test are met. 

After the completion of test run execution, a test run will be in one of these terminal states:

|State            |Sub state 1  |Sub state 2  |Description  |
|---------------------|-------------|-------------|-------------|
|`Passed`      | `Run completed` | `Test criteria validated` | The test run was successfully executed as configured. Test criteria defined for the test run are within the thresholds. This state indicates that the application being tested meets the performance expectations. |
|`Failed`      | `Run completed` | `Test criteria not met` | The test run was successfully executed as configured. Test criteria defined for the test run are beyond the thresholds. This state indicates that the application being tested didn't meet the performance expectations. |
|`Completed`      | `Run completed` | `No test criteria` | The test run was successfully executed as configured. Test criteria aren't defined for the test run.  |
|`Error`      | `Run error` | `Criteria not validated` | The test run resulted in an error and couldn't be executed as configured. Test criteria couldn't be validated.  |
|`Stopped`      | `Run stopped` | `Auto stop triggered` | The test run was automatically stopped due to a high error rate.  |
|`Stopped`      | `Run stopped` | `Criteria not validated` | The user stopped the test run. Test criteria couldn't be evaluated.  |


In addition to the run status, you can see important information about the test run like *Start time*, *End time*, *Duration*, *Engine instances*, *Virtual users (Max)*, *Virtual user hours*, *Test run ID*, and *Baseline*. 

## AI insights
 
In this section, you can see AI-powered actionable insights to get a quick summary of what happened during the test run and the performance of your application. You can also see detailed insights on potential bottlenecks and some recommendations to fix the identified bottlenecks. 

:::image type="content" source="media/how-to-understand-test-run-results-dashboard/view-ai-insights.png" alt-text="Screenshot of the AI insights section in results dashboard." lightbox="media/how-to-understand-test-run-results-dashboard/view-ai-insights.png":::

See [Analyze test results using AI](./how-to-analyze-test-results-using-actionable-insights.md) to learn more about AI-powered actionable insights.

## Summary statistics

This section provides you an at-a-glance view of the performance of your application during the load test. You can see 

- The total number of requests sent
- Duration of the load test
- 90th percentile response time
- Error percentage 
- Throughput. 

If you [configured a test run as a baseline](./how-to-compare-multiple-test-runs.md#compare-load-test-runs-against-a-baseline), you can also see a comparison of these metrics with the metrics from the baseline run. 

:::image type="content" source="media/how-to-understand-test-run-results-dashboard/view-summary-statistics.png" alt-text="Screenshot of the summary statistics section in results dashboard." lightbox="media/how-to-understand-test-run-results-dashboard/view-summary-statistics.png":::

If your test scenario contains multiple requests or samplers, you can view the summary statistics at a sampler level under *Sampler statistics*. Optionally, you can choose a suitable response time aggregation. 

:::image type="content" source="media/how-to-understand-test-run-results-dashboard/view-sampler-statistics.png" alt-text="Screenshot of the sampler statistics section in results dashboard." lightbox="media/how-to-understand-test-run-results-dashboard/view-sampler-statistics.png":::

For multi-region load tests, you can view the comparison of performance metrics across regions and easily find out the regions that are performing better and the ones that aren't. 

:::image type="content" source="media/how-to-understand-test-run-results-dashboard/view-region-comparison.png" alt-text="Screenshot of the region comparison section in results dashboard." lightbox="media/how-to-understand-test-run-results-dashboard/view-region-comparison.png":::


## Test criteria

If you [defined failure criteria for the test run](./how-to-define-test-criteria.md), you can view the results of the test criteria evaluation in this section. 

For each of the test criteria defined, you see a card that shows:
- The performance metric like response time, error percentage etc., 
- The threshold value defined
- The actual value observed during the test run 
- The result of the criteria evaluation. 

If the failure criteria are defined on an app component metric, a link to view the Azure Monitor graph of the specific metric is also available. 

:::image type="content" source="media/how-to-understand-test-run-results-dashboard/view-test-criteria.png" alt-text="Screenshot of the test criteria section in results dashboard." lightbox="media/how-to-understand-test-run-results-dashboard/view-test-criteria.png":::

## Client-side metrics

This section provides a graphical view of how the client-side performance metrics like response time, throughput, and errors vary with the load over the duration of the load test. These graphs are populated live when the test run is in progress. Live graphs enable you to analyze the load test results when the test run is in progress. You can analyze the graphs after the test run completion as well. 

The client-side metrics are available at an individual sampler or request level, and at an aggregate level. You can use the filters to slice and dice the metrics as required and derive conclusions on the performance observed during the load test. For example, you can view only the 500 errors of one specific request by using the *Requests* and *Error Type* filters. Similarly, you can view the maximum response in one specific region by using the *Region* and *Aggregation* filters. 

:::image type="content" source="media/how-to-understand-test-run-results-dashboard/view-client-side-metrics.png" alt-text="Screenshot of the client-side metrics section in results dashboard." lightbox="media/how-to-understand-test-run-results-dashboard/view-client-side-metrics.png":::

## Server-side metrics

If you [configured app components for monitoring](./how-to-monitor-server-side-metrics.md), this section provides a graphical view of the resource metrics from the selected app components like Azure App Service, Azure Cosmos DB, etc. You can correlate these metrics with the client-side metrics to identify potential bottleneck components.

By default, Azure Load Testing shows the resource metrics that are most relevant to evaluate app performance. For example, for an App Service plan, CPU percentage and Memory percentage metrics are shown by default. Optionally, you can select the metrics and aggregations of your choice by selecting 'Configure server side metrics'. 

:::image type="content" source="media/how-to-understand-test-run-results-dashboard/view-server-side-metrics.png" alt-text="Screenshot of the server-side metrics section in results dashboard." lightbox="media/how-to-understand-test-run-results-dashboard/view-server-side-metrics.png":::

## Engine health metrics

In this section, you see a graphical view of resource metrics of the load generating engines:

- CPU percentage
- Memory percentage
- Network bytes per second 
- Number of virtual users. 

You can monitor resource metrics of the test engine instances to make sure that the test engine instances, themselves aren't a performance bottleneck. 

:::image type="content" source="media/how-to-understand-test-run-results-dashboard/view-engine-health-metrics.png" alt-text="Screenshot of the engine health metrics section in results dashboard." lightbox="media/how-to-understand-test-run-results-dashboard/view-engine-health-metrics.png":::

For more information on engine health metrics, see [monitor engine instance metrics](./how-to-high-scale-load.md#monitor-engine-instance-metrics)

## Next steps

- [Analyze test results using AI](./how-to-analyze-test-results-using-actionable-insights.md)
- [Diagnose failing load tests](./how-to-diagnose-failing-load-test.md)
- [Identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md)