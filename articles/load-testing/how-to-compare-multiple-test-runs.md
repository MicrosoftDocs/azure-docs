---
title: Compare Multiple test runs 
titleSuffix: Azure Load Testing
description: Understand your application performance with Azure Load Testing by comparing multiple test runs
services: load-testing
ms.service: load-testing
ms.author: jmartens
author: j-martens
ms.date: 10/18/2021
ms.topic: how-to

---

# Understand your application performance with Azure Load Testing by comparing multiple test runs  

In this article, you'll learn how to compare multiple test runs in the Azure Load Testing Service on the **Azure Portal**  

In this article you'll learn how to:  

> [!div class="checklist"]

> - Compare multiple test runs from the tests page on Azure Portal  
> - Compare multiple test runs from the results page on Azure Portal  

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- This tutorial requires that you have an Azure Load Testing Resource created. If you need to create a Load Test Resource, see [How to create the Load Test Resource](/cli/azure/install-azure-cli.md).  
- You must have a valid test plan created with multiple runs. You can also use the sample test plan and the app in our tutorial. See [how-to-identify-bottlenecks-in-vs-code](./how-to-identify-bottlenecks-vs-code.md)

## Compare from the test plan page in the portal

1. Go to your load test resource.  
2. Select 'tests' in the navigation menu to view the list of test plans.
3. Select the test plan whose runs you want to compare. Make sure to use the filters on the top to find your test plan.  
:::image type="content" source="media/how-to-compare-multiple-test-runs/test-plan.png" alt-text="List of test runs in the Test Plan Page.":::  
4. Select the 'compare' button at the top. You can pick the test runs you want to compare by using the checkboxes. Choose a maximum of five test runs to compare.  
:::image type="content" source="media/how-to-compare-multiple-test-runs/choose-runs-to-compare.png" alt-text="Choose the runs you want to compare.":::  
5. Clicking on compare will open render the comparison on the portal with the graphs for each test run being overlaid on the respective charts.  
:::image type="content" source="media/how-to-compare-multiple-test-runs/compare-screen.png" alt-text="Two Test runs being compared.":::  
6. Filters can be used to customize the chart. There are separate filters for the client and the server metrics.  

> [!TIP]
> The time filter is based on the relative duration of tests. A lower value of 0 indicates the beginning of the test. The maximum value indicates the longest duration of the runs being compared. For client metrics, test runs will show data only until their test execution time. For example, if you have two runs of 5 min and 10 min respectively, the filter allows values between 0-10. Choosing any value greater than 5 causes no change in the graph of the first test run where the duration was 5 mins.

## Compare from the test results page  

You can also compare test runs from any test results page. The test needs to be in 'Done', 'Stopped', or 'Failed' status to compare.

1. Select the 'compare' button at the top. Choose the test runs you want to compare by using the checkboxes. Pick a maximum of five test runs.  
:::image type="content" source="media/how-to-compare-multiple-test-runs/choose-runs-to-compare.png" alt-text="Choose the runs you want to compare.":::  
2. Clicking on compare renders the comparison on the portal. Each test run graph is overlaid on the respective charts.  
:::image type="content" source="media/how-to-compare-multiple-test-runs/compare-screen.png" alt-text="Two test runs being compared.":::  
3. Use filters to customize the chart. You'll find separate filters for the client and the server metrics.  

> [!TIP]
> The time filter is based on the relative duration of tests. The lower value of 0 indicates the beginning of the test. The maximum value indicates the longest duration of the test runs. For client metrics, the test runs show data only until their test execution time. For example, if you have two runs of 5 minutes and 10 minutes, the filter allows values between 0-10. Choosing any value greater than 5 will cause no change in the graph of the first test run where the duration was 5 mins.  
