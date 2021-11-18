---
title: How to export test results
titleSuffix: Azure Load Testing
description: Learn how to export load test results for use in third-party tools.
services: load-testing
ms.service: load-testing
ms.author: jmartens
author: j-martens
ms.date: 11/15/2021
ms.topic: how-to

---
# Export your load test results

In this article, you'll learn how to download the results file generated after a test run completes in **Azure portal**.  

In this article you'll learn how to:  

> [!div class="checklist"]
> - Download and save results file from the test run page.  
> - Download and save results file from the dashboard page.  

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing Resource created with a test plan that has at least one test run under it. If you need to create a Load Test Resource, see the quickstart guide [Create and run a load test](./quickstart-create-and-run-load-test.md).  
-   
    > [!NOTE]
    > A test run needs to be in the **Done**, **Stopped**, or **Failed** in order for the results file to be available for download.

## Download and save results from the test run page

1. Go to your load test resource.  
2. Select **Tests** in the navigation menu to view the list of test plans.  
3. Pick the correct test plan from the list. Use the filters at the top to find the test plan you want.  
4. Select the test plan to open the test run page.  
5. Use the search box to find the test run you want. You can also use the filters on **Time Range** and **Status** to further curate the list.
6. Use the ellipsis(...) on right side of the test run to open the menu for downloading the results file.
:::image type="content" source="media/how-to-export-test-results/test-run-page-download.png" alt-text="Downloading the logs from the test run page.":::  
7. You'll see an option to download and save the results file as a zip folder on your local system.  

## Download and save results from the dashboard page

1. Go to your load test resource.  
2. Select **Tests** in the navigation menu to view the list of test plans.  
3. Pick the correct test plan from the list. Use the filters at the top to find the test plan you want.  
4. Select the test plan to open the test run page.  
5. Use the search box to find the test run you want. You can also use the filters on **Time Range** and **Status** to further curate the list.  
6. Select your test run to land on its dashboard.  
7. To download the results file, select the **Download** button in the command bar on top, select results, and save it as a csv on your system.  
:::image type="content" source="media/how-to-export-test-results/dashboard-download.png" alt-text="Downloading the logs from the dashboard page.":::
