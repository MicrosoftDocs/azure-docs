---
title: How to update and rerun a test
titleSuffix: Azure Load Testing
description: Learn how to update and rerun a test.
services: load-testing
ms.service: load-testing
ms.author: jmartens
author: j-martens
ms.date: 11/08/2021
ms.topic: how-to

---
# Update and rerun your test

 In this article, you'll learn how to update components for a test and then rerun it using the Azure Load Testing Service on **Azure portal**.  

In this article you'll learn how to:  

> [!div class="checklist"]

> - Update and edit the test from the tests page on Azure portal  
> - Update and edit the app components from the tests page on Azure portal  
> - Update and edit Metrics from the test page on Azure portal  
> - Update and edit app components and Metrics from the test run dashboard on the Azure portal  

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- You'll need an Azure Load Testing Resource already created. If you need to create a Load Test Resource, see [How to create the Load Test Resource](./quickstart-create-and-run-load-test.md).  
- You must have a valid test created with at least one test run completed. You can also use the sample test plan and the app in our tutorial. See [Tutorial: Run a load test to identify performance bottlenecks](./tutorial-identify-bottlenecks-azure-portal.md).  

## Update a Test from the Tests Page  

1. Go to your load test resource.  
2. Select 'tests' in the navigation menu to view the list of test plans.  
3. From the list, select the test plan you wish to update.  
4. On the test run page, you'll see the list of test runs for that test plan.  

   > [!NOTE]  
   > Changes made on this page are applied to the test plan. Subsequent runs of the plan will use these new settings for running the test in the future.  

1. The **Test**, **App Components**, and **server side Metrics** can be updated on this page using the **Configure** button on the command bar at the top.  
:::image type="content" source="media/how-to-update-rerun-test/configure.png" alt-text="Configure button on command bar.":::  
1. Select **Test** to edit the test plan details. Select **Apply** at the bottom to save your changes.  
:::image type="content" source="media/how-to-update-rerun-test/edit-test.png" alt-text="Configure the test plan.":::  
1. Select **App Components** to add or remove Azure resources types for which the dashboard would display server-side metrics.
:::image type="content" source="media/how-to-update-rerun-test/app-component.png" alt-text="Add or remove any app component.":::  
1. Pick **Metrics** to add any other metrics for the available resource types. You can select the metrics you want to view and also apply aggregation techniques. Your aggregations will show on the charts that would come up on the dashboard.  
:::image type="content" source="media/how-to-update-rerun-test/metrics.png" alt-text="Add or remove any server-side metrics.":::  
1. After you've made your changes and want to run the test again, go to the test plan and select  **Run** on the command bar to run the test plan.  
:::image type="content" source="media/how-to-update-rerun-test/run.png" alt-text="Running the test from the test run list page.":::  

## Updating and rerunning from the test run dashboard  

From the test run dashboard, you can configure app components and metrics then select **rerun** for rerunning the test. You can't modify the test script or any other value related to the test plan. You need to be on the test plan page if you want to modify your test plan.  
:::image type="content" source="media/how-to-update-rerun-test/dashboard-run.png" alt-text="Running the test from the test run dashboard.":::
